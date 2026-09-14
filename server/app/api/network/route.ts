import { NextResponse } from 'next/server';
import { DigitalTwinStore } from '../../../lib/state';

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
};

export async function GET() {
    try {
        const store = DigitalTwinStore.getInstance();
        return NextResponse.json(store.getState(), { headers: corsHeaders });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500, headers: corsHeaders });
    }
}

export async function OPTIONS() {
    return NextResponse.json({}, { headers: corsHeaders });
}
