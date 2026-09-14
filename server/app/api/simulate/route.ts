import { NextResponse } from 'next/server';
import { DigitalTwinStore } from '../../../lib/state';
import { IntelligenceLayer } from '../../../lib/llm';
import { ConsensusEngine } from '../../../agents/consensus';
import { Scenario } from '../../../types';

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
};

function validateDomainConstraints(state: any, scenario: Scenario): void {
    if (scenario.type === 'delay_cascade') {
        const train = scenario.params.train;
        if (!train || !state.trains[train]) {
            throw new Error(`VALIDATION_ERROR: Train ${train} does not exist in the digital twin.`);
        }
        if (scenario.params.delayMinutes > 1440 || scenario.params.delayMinutes < 0) {
            throw new Error(`VALIDATION_ERROR: Invalid delay limit. Must be between 0 and 1440 mins.`);
        }
    } else if (scenario.type === 'festival_surge') {
        const station = scenario.params.station;
        if (!station || !state.stations[station]) {
            throw new Error(`VALIDATION_ERROR: Station ${station} does not exist in the digital twin.`);
        }
    } else {
        throw new Error(`VALIDATION_ERROR: Unsupported scenario type ${scenario.type}`);
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        
        if (!body || typeof body !== 'object') {
            return NextResponse.json({ error: "VALIDATION_FAILED", message: "Malformed JSON body" }, { status: 400, headers: corsHeaders });
        }

        const { query, scenario, _forceAgentFailure, _forceLLMFailure, _forceLLMHallucination } = body;
        
        const store = DigitalTwinStore.getInstance();
        const state = store.getState();
        const llm = new IntelligenceLayer();
        const consensus = new ConsensusEngine();

        let finalScenario = scenario;
        let llmStatus = 'ONLINE';

        // Intent Parsing
        if (query && !scenario) {
            try {
                const parseQuery = query + 
                    (_forceLLMFailure ? " _forceLLMFailure=true" : "") + 
                    (_forceLLMHallucination ? " _forceLLMHallucination=true" : "");
                finalScenario = await llm.parseQueryToScenario(parseQuery);
            } catch (e: any) {
                console.error("LLM parse exception caught:", e.message);
                llmStatus = 'OFFLINE_FALLBACK';
                // Deterministic fallback due to connectivity failure
                finalScenario = { type: 'delay_cascade', params: { train: '22416', delayMinutes: 60 } };
            }
        }

        if (_forceAgentFailure) {
            finalScenario.params._forceAgentFailure = _forceAgentFailure;
        }

        // Domain Validation (Protects against hallucinations)
        try {
            validateDomainConstraints(state, finalScenario);
        } catch (e: any) {
            return NextResponse.json({ error: "DOMAIN_VALIDATION_FAILED", message: e.message }, { status: 422, headers: corsHeaders });
        }

        // Debate & Optimize
        const analysis = consensus.analyzeScenario(state, finalScenario);

        if (analysis.systemStatus === 'CRITICAL_FAILURE' || analysis.systemStatus === 'NO_SAFE_STRATEGY') {
             return NextResponse.json({
                ...analysis,
                llmStatus
            }, { status: 422, headers: corsHeaders });
        }

        if (!analysis.winningStrategy) {
            throw new Error("No feasible strategy could be determined.");
        }

        // Explanation
        let explanation = "";
        try {
             explanation = await llm.explainDecision(analysis.winningStrategy);
        } catch(e) {
             llmStatus = 'OFFLINE_FALLBACK';
             explanation = `Deterministic Explanation: Selected ${analysis.winningStrategy.strategy} due to optimal balance.`;
        }

        return NextResponse.json({
            ...analysis,
            explanation,
            llmStatus
        }, { headers: corsHeaders });

    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500, headers: corsHeaders });
    }
}

export async function OPTIONS() {
    return NextResponse.json({}, { headers: corsHeaders });
}
