export interface Station {
    id: string;
    name: string;
    lat: number;
    lng: number;
    platforms: number;
    currentOccupancy: number; // percentage
    crowdDensity: number; // percentage
    riskState: 'NORMAL' | 'WARNING' | 'CRITICAL';
    activeIncidents: string[];
    // Bounded history for trend analysis
    crowdHistory?: number[]; 
}

export interface Train {
    id: string;
    category: 'SUPERFAST' | 'EXPRESS' | 'PASSENGER' | 'FREIGHT';
    route: string[];
    currentStation: string | null;
    nextStation: string | null;
    scheduledArrival: string;
    scheduledDeparture: string;
    currentDelay: number; // minutes
    currentSpeed: number; // km/h
    assignedPlatform: number | null;
    status: 'ON_TIME' | 'DELAYED' | 'HALTED' | 'REROUTED';
    // Bounded history
    delayHistory?: number[];
}

export interface Platform {
    id: string;
    stationId: string;
    platformNumber: number;
    currentTrainId: string | null;
    occupancy: number;
    capacity: number;
    availabilityTime: number;
}

export interface Incident {
    id: string;
    type: 'DELAY' | 'TRACK_FAULT' | 'CROWD_SURGE' | 'SIGNAL_FAILURE';
    severity: 1 | 2 | 3 | 4 | 5;
    location: string;
    reportedAt: number;
    description: string;
}

export interface NetworkState {
    stateVersion: number;
    stations: Record<string, Station>;
    trains: Record<string, Train>;
    platforms: Record<string, Platform>;
    incidents: Record<string, Incident>;
    timestamp: number;
}

export interface Scenario {
    type: string;
    params: Record<string, any>;
}

export interface AgentResult {
    agent: string;
    status: 'recommend' | 'reject' | 'warning' | 'neutral' | 'failed';
    recommendations: string[];
    constraints: string[];
    confidence: number;
    reasons: string[];
}

export interface SimulationResult {
    strategy: string;
    totalDelayMinutes: number;
    passengersImpacted: number;
    platformConflicts: number;
    criticalStations: number;
    safetyScore: number;
    confidence: number;
    state: NetworkState;
    hardConstraintViolated?: boolean;
    violationReason?: string;
    _internalScore?: number;
}

export interface DecisionAudit {
    decisionId: string;
    timestamp: number;
    previousStateVersion: number;
    newStateVersion: number;
    trigger: string;
    scenario: any;
    winningStrategy: string;
    approver: string;
    status: 'EXECUTED' | 'REVERTED';
}

export interface RailwayEvent {
    id: string;
    timestamp: number;
    type: 'train_position' | 'train_delay' | 'platform_change' | 'crowd_change' | 'weather_change' | 'incident';
    entityId: string;
    payload: Record<string, any>;
}

export interface PrecogPrediction {
    id: string;
    type: string;
    entityId: string;
    probability: number;
    confidence: number;
    horizonMinutes: number;
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    contributingFactors: string[];
    predictedImpact: {
        trains: number;
        passengers: number;
        delayMinutes: number;
    };
    recommendedAction?: string;
}
