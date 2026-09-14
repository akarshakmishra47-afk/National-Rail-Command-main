import { AgentResult, NetworkState, Scenario, SimulationResult } from '../types';
import { ALL_AGENTS, Agent } from './index';
import { SimulationEngine } from '../simulation/engine';

export class ConsensusEngine {
    public analyzeScenario(state: NetworkState, scenario: Scenario) {
        
        // 1. DEBATE Phase (with Graceful Degradation)
        const agentResults: AgentResult[] = [];
        let failedAgents = 0;

        for (const agent of ALL_AGENTS) {
            try {
                const res = agent.analyze(state, scenario);
                agentResults.push(res);
            } catch (e: any) {
                failedAgents++;
                agentResults.push({
                    agent: agent.name,
                    status: 'failed',
                    recommendations: ['STATUS: DEGRADED - ' + e.message],
                    constraints: [],
                    confidence: 0,
                    reasons: ['Agent encountered an internal exception']
                });
            }
        }

        // If majority fails, system collapses gracefully
        if (failedAgents > Math.floor(ALL_AGENTS.length / 2)) {
            return {
                scenario,
                agentDebate: agentResults,
                simulations: [],
                winningStrategy: null,
                systemStatus: 'CRITICAL_FAILURE',
                message: 'Consensus engine halted. Majority of agents are degraded.'
            };
        }

        // 2. STRATEGY GENERATION Phase
        const candidateStrategies = ['min_delay', 'max_safety', 'min_passenger_impact', 'balanced'];
        const simEngine = new SimulationEngine();
        
        // 3. SIMULATION Phase
        const simulations: SimulationResult[] = candidateStrategies.map(strategy => {
            return simEngine.simulateScenario(state, scenario, strategy);
        });

        // 4. HARD CONSTRAINT FILTER
        const safeSimulations = simulations.filter(sim => !sim.hardConstraintViolated);

        if (safeSimulations.length === 0) {
            return {
                scenario,
                agentDebate: agentResults,
                simulations: simulations,
                winningStrategy: null,
                systemStatus: 'NO_SAFE_STRATEGY',
                message: 'All generated strategies violate hard safety constraints.'
            };
        }

        // 5. OPTIMIZATION Phase: Rank SAFE strategies
        // Weighted objective: Lower is better
        // Delay (1x) + Impact (0.01x) + Conflicts (50x) - Safety (2x)
        const scored = safeSimulations.map(sim => {
            const score = sim.totalDelayMinutes + (sim.passengersImpacted * 0.01) + (sim.platformConflicts * 50) - (sim.safetyScore * 2);
            return { ...sim, _internalScore: score };
        });

        scored.sort((a, b) => a._internalScore! - b._internalScore!);
        const winningStrategy = scored[0];

        // Overall Confidence calculation
        const baseConfidence = agentResults.filter(a => a.status !== 'failed').reduce((acc, a) => acc + a.confidence, 0) / (ALL_AGENTS.length - failedAgents);
        const finalConfidence = Math.max(0, baseConfidence - (failedAgents * 0.15));

        return {
            scenario,
            agentDebate: agentResults,
            simulations: scored, // Returning safe ones
            discardedSimulations: simulations.filter(sim => sim.hardConstraintViolated),
            winningStrategy,
            systemStatus: failedAgents > 0 ? 'DEGRADED' : 'OPTIMAL',
            confidence: finalConfidence
        };
    }
}
