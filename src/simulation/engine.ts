import { NetworkState, Scenario, SimulationResult } from '../types';

export class SimulationEngine {
  
  public simulateScenario(state: NetworkState, scenario: Scenario, strategy: string): SimulationResult {
    const simulatedState = JSON.parse(JSON.stringify(state)) as NetworkState;
    let totalDelay = 0;
    let impacted = 0;
    let conflicts = 0;
    let safety = 100;
    let critical = 0;
    let violated = false;
    let violationReason = '';

    if (scenario.type === 'delay_cascade') {
      const trainId = scenario.params.train;
      const initialDelay = scenario.params.delayMinutes || 60;
      
      if (simulatedState.trains[trainId]) {
        simulatedState.trains[trainId].currentDelay += initialDelay;
        simulatedState.trains[trainId].status = 'DELAYED';
        totalDelay += initialDelay;
        impacted += 1200; 
        
        const nextSt = simulatedState.trains[trainId].nextStation;
        if (nextSt && simulatedState.stations[nextSt]) {
          critical += 1;
          simulatedState.stations[nextSt].crowdDensity = Math.min(100, simulatedState.stations[nextSt].crowdDensity + 20);
          if (simulatedState.stations[nextSt].crowdDensity > 85) {
             safety -= 15;
          }
          
          Object.values(simulatedState.trains).forEach(t => {
            if (t.id !== trainId && t.nextStation === nextSt) {
              if (strategy === 'min_delay') {
                t.currentDelay += 10;
                totalDelay += 10;
                safety -= 20; // Rushing trains reduces safety margin
              } else if (strategy === 'max_safety') {
                t.currentDelay += 30;
                t.status = 'HALTED';
                totalDelay += 30;
                safety += 10;
              } else {
                t.currentDelay += initialDelay / 2;
                totalDelay += initialDelay / 2;
                conflicts += 1;
                safety -= 5;
              }
              impacted += 800;
            }
          });
        }
      }
    } else if (scenario.type === 'festival_surge') {
        const stationId = scenario.params.station;
        if (simulatedState.stations[stationId]) {
            simulatedState.stations[stationId].crowdDensity = 98;
            simulatedState.stations[stationId].riskState = 'CRITICAL';
            critical += 1;
            impacted += 10000;
            safety -= 40; // High baseline risk
            
            if (strategy === 'max_safety') {
                safety += 35; // Deployed crowd control aggressively
                totalDelay += 120; // Massive delays to ensure safety
            } else if (strategy === 'min_delay') {
                safety -= 10; // Ignored safety protocol
                totalDelay += 20; 
            } else if (strategy === 'balanced') {
                safety += 15;
                totalDelay += 60;
            }
        }
    }

    const finalSafetyScore = Math.min(100, Math.max(0, safety));

    // HARD CONSTRAINT: Safety score must never drop below 60
    if (finalSafetyScore < 60) {
        violated = true;
        violationReason = `HARD_CONSTRAINT: Safety score fell to ${finalSafetyScore} (Min threshold: 60).`;
    }

    return {
      strategy,
      totalDelayMinutes: Math.round(totalDelay),
      passengersImpacted: impacted,
      platformConflicts: conflicts,
      criticalStations: critical,
      safetyScore: finalSafetyScore,
      confidence: 1.0, // Fully deterministic
      state: simulatedState,
      hardConstraintViolated: violated,
      violationReason: violationReason
    };
  }
}
