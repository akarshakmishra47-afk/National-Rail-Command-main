import { NextResponse } from 'next/server';
import { DigitalTwinStore } from '../../../../lib/state';
import { RollbackRequestSchema } from '../../../../lib/schemas';

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
};

export async function POST(req: Request) {
    try {
        const body = await req.json();
        
        // Zod Validation
        const result = RollbackRequestSchema.safeParse(body);
        if (!result.success) {
            return NextResponse.json({ error: "VALIDATION_FAILED", details: result.error.format() }, { status: 400, headers: corsHeaders });
        }

        const { decisionId } = result.data;
        const store = DigitalTwinStore.getInstance();

        try {
            const audit = store.revertState(decisionId);
            return NextResponse.json({ success: true, message: "Rollback successful.", audit }, { headers: corsHeaders });
        } catch (e: any) {
            return NextResponse.json({ error: e.message }, { status: 409, headers: corsHeaders });
        }

    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500, headers: corsHeaders });
    }
}

export async function OPTIONS() {
    return NextResponse.json({}, { headers: corsHeaders });
}
