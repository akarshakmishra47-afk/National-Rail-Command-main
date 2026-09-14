import { NextResponse } from 'next/server';
import { DigitalTwinStore } from '../../../../lib/state';
import { ExecutionRequestSchema } from '../../../../lib/schemas';

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
};

export async function POST(req: Request) {
    try {
        const body = await req.json();
        
        // Zod Validation
        const result = ExecutionRequestSchema.safeParse(body);
        if (!result.success) {
            return NextResponse.json({ error: "VALIDATION_FAILED", details: result.error.format() }, { status: 400, headers: corsHeaders });
        }

        const { decisionId, baseVersion, simulatedState, scenario, strategy } = result.data;
        const store = DigitalTwinStore.getInstance();
        const liveState = store.getState();

        // 1. Optimistic Concurrency Check
        if (liveState.stateVersion !== baseVersion) {
            return NextResponse.json({ 
                error: "STALE_SIMULATION", 
                message: `Simulation generated from state version ${baseVersion}. Current state version: ${liveState.stateVersion}. Re-simulation required.` 
            }, { status: 409, headers: corsHeaders });
        }

        // 2. Execution & Audit
        try {
            store.updateState(simulatedState, {
                decisionId,
                timestamp: Date.now(),
                previousStateVersion: 0,
                newStateVersion: 0,
                trigger: 'WHAT_IF_CONSOLE',
                scenario: scenario || {},
                winningStrategy: strategy || 'UNKNOWN',
                approver: 'HUMAN_OPERATOR',
                status: 'EXECUTED'
            });
        } catch (e: any) {
            if (e.message === "ALREADY_EXECUTED") {
                return NextResponse.json({ error: "ALREADY_EXECUTED", message: "Decision ID has already been executed." }, { status: 409, headers: corsHeaders });
            }
            throw e;
        }

        return NextResponse.json({ success: true, message: "State successfully mutated." }, { headers: corsHeaders });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500, headers: corsHeaders });
    }
}

export async function OPTIONS() {
    return NextResponse.json({}, { headers: corsHeaders });
}
