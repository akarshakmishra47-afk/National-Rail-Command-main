import { NetworkState, Station, Train, Platform, Incident, DecisionAudit, RailwayEvent } from '../types';
import { globalEventBus } from './events';
import { RailwayEventSchema } from './schemas';

const MAX_HISTORY_LENGTH = 10;

export class DigitalTwinStore {
  private static instance: DigitalTwinStore;
  private state: NetworkState;
  
  private history: Map<number, string> = new Map();
  public auditLog: DecisionAudit[] = [];
  public executedDecisions: Set<string> = new Set();
  
  // Idempotency cache for telemetry events
  private processedEvents: Set<string> = new Set();

  private constructor() {
    this.state = this.initializeMockState();
    this.saveSnapshot();
  }

  public static getInstance(): DigitalTwinStore {
    if (!DigitalTwinStore.instance) {
      DigitalTwinStore.instance = new DigitalTwinStore();
    }
    return DigitalTwinStore.instance;
  }

  public getState(): NetworkState {
    return JSON.parse(JSON.stringify(this.state));
  }

  // Used by EXECUTE / ROLLBACK (Phase 2)
  public updateState(newState: NetworkState, audit: DecisionAudit): void {
    if (this.executedDecisions.has(audit.decisionId)) {
        throw new Error("ALREADY_EXECUTED");
    }

    const nextVersion = this.state.stateVersion + 1;
    newState.stateVersion = nextVersion;
    newState.timestamp = Date.now();
    
    audit.previousStateVersion = this.state.stateVersion;
    audit.newStateVersion = nextVersion;
    audit.timestamp = Date.now();
    audit.status = 'EXECUTED';
    
    this.state = JSON.parse(JSON.stringify(newState));
    this.saveSnapshot();
    
    this.auditLog.unshift(audit);
    this.executedDecisions.add(audit.decisionId);
    
    // Broadcast state change to SSE
    globalEventBus.emit('state_update', this.state);
  }

  public revertState(decisionId: string): DecisionAudit {
    const auditEntry = this.auditLog.find(a => a.decisionId === decisionId);
    if (!auditEntry) throw new Error("Decision not found");
    if (auditEntry.status === 'REVERTED') throw new Error("ALREADY_REVERTED");
    
    const targetVersion = auditEntry.previousStateVersion;
    const snapshotStr = this.history.get(targetVersion);
    if (!snapshotStr) throw new Error("Snapshot expired or unavailable for rollback");

    const nextVersion = this.state.stateVersion + 1;
    const restoredState = JSON.parse(snapshotStr);
    restoredState.stateVersion = nextVersion;
    restoredState.timestamp = Date.now();
    this.state = restoredState;
    this.saveSnapshot();

    auditEntry.status = 'REVERTED';

    const newAudit: DecisionAudit = {
        decisionId: `REV-${decisionId}`,
        timestamp: Date.now(),
        previousStateVersion: this.state.stateVersion - 1,
        newStateVersion: nextVersion,
        trigger: 'MANUAL_ROLLBACK',
        scenario: auditEntry.scenario,
        winningStrategy: `REVERT: ${auditEntry.winningStrategy}`,
        approver: 'HUMAN_OPERATOR',
        status: 'EXECUTED'
    };
    
    this.auditLog.unshift(newAudit);
    globalEventBus.emit('state_update', this.state);
    return newAudit;
  }

  // --- PHASE 3: EVENT PROCESSING --- //

  public processTelemetryEvent(eventRaw: any) {
      // 1. Zod Validation
      const result = RailwayEventSchema.safeParse(eventRaw);
      if (!result.success) {
          throw new Error("TELEMETRY_VALIDATION_FAILED: " + result.error.message);
      }
      const event: RailwayEvent = result.data;

      // 2. Idempotency Check
      if (this.processedEvents.has(event.id)) {
          return { status: 'IGNORED_DUPLICATE' };
      }
      this.processedEvents.add(event.id);
      
      // Cleanup processedEvents cache (keep it bounded)
      if (this.processedEvents.size > 5000) {
          const firstKey = this.processedEvents.keys().next().value;
          this.processedEvents.delete(firstKey!);
      }

      // 3. Out-of-order Event Policy
      const isLateEvent = event.timestamp < this.state.timestamp;
      
      // 4. Domain Validation & Mutation Sandbox
      const sandboxState = JSON.parse(JSON.stringify(this.state)) as NetworkState;
      let mutated = false;

      if (event.type === 'train_delay') {
          const train = sandboxState.trains[event.entityId];
          if (!train) throw new Error("INVALID_ENTITY: Train not found");
          
          if (typeof event.payload.delay !== 'number' || event.payload.delay < 0) {
              throw new Error("DOMAIN_VALIDATION_FAILED: Invalid delay value");
          }
          
          if (!isLateEvent) {
              train.currentDelay = event.payload.delay;
              train.status = train.currentDelay > 0 ? 'DELAYED' : 'ON_TIME';
              mutated = true;
          }
          
          // Bounded History updates (even for late events, assuming sorting later, but simple append here)
          train.delayHistory = train.delayHistory || [];
          train.delayHistory.push(event.payload.delay);
          if (train.delayHistory.length > MAX_HISTORY_LENGTH) train.delayHistory.shift();

      } else if (event.type === 'crowd_change') {
          const station = sandboxState.stations[event.entityId];
          if (!station) throw new Error("INVALID_ENTITY: Station not found");
          
          if (typeof event.payload.density !== 'number' || event.payload.density < 0 || event.payload.density > 100) {
              throw new Error("DOMAIN_VALIDATION_FAILED: Invalid density value");
          }
          
          if (!isLateEvent) {
              station.crowdDensity = event.payload.density;
              station.riskState = station.crowdDensity > 80 ? 'WARNING' : (station.crowdDensity > 95 ? 'CRITICAL' : 'NORMAL');
              mutated = true;
          }
          
          station.crowdHistory = station.crowdHistory || [];
          station.crowdHistory.push(event.payload.density);
          if (station.crowdHistory.length > MAX_HISTORY_LENGTH) station.crowdHistory.shift();
      }

      // 5. Commit mutations for Forward Events
      if (!isLateEvent) {
          if (mutated) {
              sandboxState.stateVersion += 1;
              sandboxState.timestamp = event.timestamp;
              this.state = sandboxState;
              this.saveSnapshot();
              
              // Emit changes so UI and PRECOG react
              globalEventBus.emit('telemetry_update', event);
              globalEventBus.emit('state_update', this.state);
              return { status: 'PROCESSED_FORWARD', newVersion: this.state.stateVersion };
          }
          return { status: 'IGNORED_NO_MUTATION' };
      } else {
          // Late events only update history arrays
          this.state = sandboxState; // safe since version/timestamp not changed
          globalEventBus.emit('telemetry_late', event);
          return { status: 'PROCESSED_LATE_HISTORY_ONLY' };
      }
  }

  // --- INTERNAL --- //

  private saveSnapshot() {
    this.history.set(this.state.stateVersion, JSON.stringify(this.state));
    if (this.history.size > 10) {
        const minKey = Math.min(...Array.from(this.history.keys()));
        this.history.delete(minKey);
    }
  }

  public getAuditLog(): DecisionAudit[] {
      return JSON.parse(JSON.stringify(this.auditLog));
  }

  private initializeMockState(): NetworkState {
    const stations: Record<string, Station> = {
      'NDLS': { id: 'NDLS', name: 'New Delhi', lat: 28.6139, lng: 77.2090, platforms: 16, currentOccupancy: 65, crowdDensity: 70, riskState: 'NORMAL', activeIncidents: [], crowdHistory: [68, 69, 70] },
      'BSB': { id: 'BSB', name: 'Varanasi Jn', lat: 25.3176, lng: 82.9739, platforms: 9, currentOccupancy: 80, crowdDensity: 85, riskState: 'WARNING', activeIncidents: [], crowdHistory: [80, 82, 85] },
      'CNB': { id: 'CNB', name: 'Kanpur Central', lat: 26.4499, lng: 80.3319, platforms: 10, currentOccupancy: 50, crowdDensity: 40, riskState: 'NORMAL', activeIncidents: [], crowdHistory: [40, 40, 40] },
    };

    const trains: Record<string, Train> = {
      '22416': { id: '22416', category: 'SUPERFAST', route: ['NDLS', 'CNB', 'BSB'], currentStation: 'NDLS', nextStation: 'CNB', scheduledArrival: '2026-09-15T10:00:00Z', scheduledDeparture: '2026-09-15T10:15:00Z', currentDelay: 0, currentSpeed: 0, assignedPlatform: 4, status: 'ON_TIME', delayHistory: [0, 0, 0] },
      '15003': { id: '15003', category: 'EXPRESS', route: ['CNB', 'BSB'], currentStation: 'CNB', nextStation: 'BSB', scheduledArrival: '2026-09-15T11:00:00Z', scheduledDeparture: '2026-09-15T11:20:00Z', currentDelay: 5, currentSpeed: 110, assignedPlatform: 2, status: 'DELAYED', delayHistory: [5, 5, 5] },
    };

    const platforms: Record<string, Platform> = {
      'NDLS-4': { id: 'NDLS-4', stationId: 'NDLS', platformNumber: 4, currentTrainId: '22416', occupancy: 40, capacity: 100, availabilityTime: Date.now() + 900000 },
      'CNB-2': { id: 'CNB-2', stationId: 'CNB', platformNumber: 2, currentTrainId: '15003', occupancy: 60, capacity: 100, availabilityTime: Date.now() + 1200000 },
    };

    return {
      stateVersion: 1,
      stations,
      trains,
      platforms,
      incidents: {},
      timestamp: Date.now()
    };
  }
}
