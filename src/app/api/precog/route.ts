import { NextResponse } from 'next/server';
import { DigitalTwinStore } from '../../../lib/state';
import { PrecogEngine } from '../../../lib/precog';

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
};

export async function GET() {
    try {
        const store = DigitalTwinStore.getInstance();
        const precog = new PrecogEngine();
        
        const predictions = precog.analyzeTemporalState(store.getState());
        
        return NextResponse.json({ predictions }, { headers: corsHeaders });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500, headers: corsHeaders });
    }
}

export async function OPTIONS() {
    return NextResponse.json({}, { headers: corsHeaders });
}
