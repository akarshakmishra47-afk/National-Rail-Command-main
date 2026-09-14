import { NextResponse } from 'next/server';

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { hour, is_weekend, event } = body;
        
        let baseCrowd = 30 + Math.random() * 20;
        
        if (hour >= 8 && hour <= 10) baseCrowd += 30; // Morning Peak
        if (hour >= 17 && hour <= 20) baseCrowd += 35; // Evening Peak
        if (is_weekend) baseCrowd += 15;
        if (event !== 'None') baseCrowd += 25;
        
        const finalCrowd = Math.min(100, Math.max(0, baseCrowd));
        let recommended_deployments = [];
        if (finalCrowd > 80) {
            recommended_deployments.push('Alpha Team - Crowd Control', 'Additional RPF Personnel');
        } else if (finalCrowd > 60) {
            recommended_deployments.push('Monitor Platforms closely');
        } else {
            recommended_deployments.push('Standard deployment');
        }

        return NextResponse.json({
            data: {
                prediction: {
                    current_status: { crowd_level: Math.round(finalCrowd) },
                    recommended_deployments
                }
            }
        }, { headers: corsHeaders });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500, headers: corsHeaders });
    }
}

export async function OPTIONS() {
    return NextResponse.json({}, { headers: corsHeaders });
}
