import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_AI_KEY });

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { time, crowdDensity, weatherCode, isSevere, stationName, incomingTrains, platforms } = body;
        
        const prompt = `You are a Railway Command AI. Analyze this situation and provide exactly 2 short tactical alerts (max 10 words each) in JSON format: {"alerts": ["alert 1", "alert 2"]}.
        Station: ${stationName}
        Time: ${time}:00
        Crowd: ${crowdDensity}%
        Severe Weather: ${isSevere}
        Incoming Trains: ${incomingTrains}
        Platforms: ${platforms}`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
            }
        });

        const text = response.text || "{}";
        const parsed = JSON.parse(text);

        return NextResponse.json(parsed, { headers: corsHeaders });
    } catch (e: any) {
        console.error("Gemini Error:", e);
        return NextResponse.json({ alerts: ["Unable to generate AI alerts", "System fallback active"] }, { status: 500, headers: corsHeaders });
    }
}

export async function OPTIONS() {
    return NextResponse.json({}, { headers: corsHeaders });
}
