import { randomUUID } from 'crypto';
import { NetworkState, PrecogPrediction } from '../types';
import { globalEventBus } from './events';

export class PrecogEngine {
    
    public analyzeTemporalState(state: NetworkState): PrecogPrediction[] {
        const predictions: PrecogPrediction[] = [];

        // Trend Analysis & Multi-Horizon Evaluation
        
        // 1. Evaluate Train Delays
        Object.values(state.trains).forEach(train => {
            if (train.delayHistory && train.delayHistory.length >= 2) {
                const recent = train.delayHistory[train.delayHistory.length - 1];
                const previous = train.delayHistory[train.delayHistory.length - 2];
                const rateOfChange = recent - previous;

                if (rateOfChange > 0 && recent >= 15) {
                    // It's increasing and currently significant
                    predictions.push({
                        id: randomUUID(),
                        type: 'DELAY_CASCADE',
                        entityId: train.id,
                        probability: Math.min(60 + (rateOfChange * 2) + (recent * 0.5), 99),
                        confidence: train.delayHistory.length >= 5 ? 90 : 70, // More history = more confidence
                        horizonMinutes: 30, // Horizon
                        severity: recent > 30 ? 'HIGH' : 'MEDIUM',
                        contributingFactors: [
                            `Delay increasing by ${rateOfChange}m/tick`,
                            `Current delay is ${recent}m`
                        ],
                        predictedImpact: {
                            trains: 3, // Assuming it delays downstream trains
                            passengers: 2500,
                            delayMinutes: recent * 2
                        }
                    });
                }
            }
        });

        // 2. Evaluate Station Crowds
        Object.values(state.stations).forEach(station => {
            if (station.crowdHistory && station.crowdHistory.length >= 2) {
                const recent = station.crowdHistory[station.crowdHistory.length - 1];
                const previous = station.crowdHistory[station.crowdHistory.length - 2];
                const rateOfChange = recent - previous;

                if (rateOfChange > 0 && recent > 75) {
                    predictions.push({
                        id: randomUUID(),
                        type: 'PLATFORM_CONFLICT',
                        entityId: station.id,
                        probability: Math.min(50 + (rateOfChange * 3) + (recent - 70), 99),
                        confidence: station.crowdHistory.length >= 5 ? 92 : 65,
                        horizonMinutes: 15,
                        severity: recent > 90 ? 'CRITICAL' : 'HIGH',
                        contributingFactors: [
                            `Crowd density rising rapidly (+${rateOfChange}%)`,
                            `Current density: ${recent}%`
                        ],
                        predictedImpact: {
                            trains: 2,
                            passengers: 4200,
                            delayMinutes: 45
                        },
                        recommendedAction: `Reassign inbound trains away from ${station.name} Platform 4`
                    });
                }
            }
        });

        // Sort by probability and severity
        predictions.sort((a, b) => b.probability - a.probability);

        // Broadcast precog update to SSE
        globalEventBus.emit('precog_update', predictions);

        return predictions;
    }
}
