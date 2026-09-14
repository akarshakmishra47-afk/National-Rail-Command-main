import { NetworkState, Scenario, AgentResult } from '../types';

export interface Agent {
    id: string;
    name: string;
    analyze(state: NetworkState, scenario: Scenario): AgentResult;
}

// Simulated error injection for testing graceful degradation
export class OperationsAgent implements Agent {
    id = 'ops-1';
    name = 'Operations Agent';
    analyze(state: NetworkState, scenario: Scenario): AgentResult {
        if (scenario.params._forceAgentFailure === 'operations') {
            throw new Error("Simulated Agent Failure");
        }
        
        if (scenario.type === 'delay_cascade') {
            return {
                agent: this.name,
                status: 'warning',
                recommendations: ['Monitor downstream stations', 'Prepare for schedule adjustments'],
                constraints: ['Maintain minimum headway'],
                confidence: 0.92,
                reasons: ['Initial delay exceeds cascading threshold']
            };
        }
        return { agent: this.name, status: 'neutral', recommendations: [], constraints: [], confidence: 1.0, reasons: [] };
    }
}

export class SchedulingAgent implements Agent {
    id = 'sched-1';
    name = 'Scheduling Agent';
    analyze(state: NetworkState, scenario: Scenario): AgentResult {
        if (scenario.type === 'delay_cascade') {
            return {
                agent: this.name,
                status: 'recommend',
                recommendations: ['Reroute affected trains', 'Adjust departure of connecting trains'],
                constraints: ['Track availability is limited'],
                confidence: 0.85,
                reasons: ['Rerouting minimizes overall network delay']
            };
        }
        return { agent: this.name, status: 'neutral', recommendations: [], constraints: [], confidence: 1.0, reasons: [] };
    }
}

export class PlatformAgent implements Agent {
    id = 'plat-1';
    name = 'Platform Agent';
    analyze(state: NetworkState, scenario: Scenario): AgentResult {
        if (scenario.type === 'delay_cascade') {
            return {
                agent: this.name,
                status: 'reject',
                recommendations: ['Hold trains at previous station'],
                constraints: ['No alternative platforms available at destination'],
                confidence: 0.88,
                reasons: ['Platform conflict predicted at next station']
            };
        }
        return { agent: this.name, status: 'neutral', recommendations: [], constraints: [], confidence: 1.0, reasons: [] };
    }
}

export class CrowdAgent implements Agent {
    id = 'crowd-1';
    name = 'Crowd Agent';
    analyze(state: NetworkState, scenario: Scenario): AgentResult {
        if (scenario.type === 'festival_surge' || scenario.type === 'delay_cascade') {
            return {
                agent: this.name,
                status: 'warning',
                recommendations: ['Deploy additional RPF staff', 'Open emergency exits'],
                constraints: ['Station capacity near 90%'],
                confidence: 0.95,
                reasons: ['Projected passenger density exceeds safety threshold']
            };
        }
        return { agent: this.name, status: 'neutral', recommendations: [], constraints: [], confidence: 1.0, reasons: [] };
    }
}

export class EmergencyAgent implements Agent {
    id = 'emerg-1';
    name = 'Emergency Agent';
    analyze(state: NetworkState, scenario: Scenario): AgentResult {
        if (scenario.type === 'track_blockage' || scenario.type === 'festival_surge') {
             return {
                agent: this.name,
                status: 'recommend',
                recommendations: ['Activate crowd-control protocol', 'Alert local authorities'],
                constraints: ['Must act within 15 minutes', 'HARD_CONSTRAINT: Maintain Safety > 70'],
                confidence: 0.98,
                reasons: ['Life-safety risk elevated due to severe congestion']
            };
        }
        return { agent: this.name, status: 'neutral', recommendations: [], constraints: [], confidence: 1.0, reasons: [] };
    }
}

export const ALL_AGENTS = [
    new OperationsAgent(),
    new SchedulingAgent(),
    new PlatformAgent(),
    new CrowdAgent(),
    new EmergencyAgent()
];
