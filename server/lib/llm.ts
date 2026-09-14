import { GoogleGenAI } from '@google/genai';
import { Scenario } from '../types';

export class IntelligenceLayer {
    private ai: any = null;
    
    constructor() {
        if (process.env.GOOGLE_AI_KEY && process.env.DISABLE_LLM !== 'true') {
            try {
                this.ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_AI_KEY });
            } catch (e) {
                console.warn("Failed to initialize Gemini:", e);
            }
        }
    }

    public async parseQueryToScenario(query: string): Promise<Scenario> {
        // Red-Team Failure triggers
        if (query.includes("_forceLLMFailure=true")) {
            throw new Error("Simulated LLM Connectivity Failure");
        }
        
        if (query.includes("_forceLLMHallucination=true")) {
            return { type: 'delay_cascade', params: { train: '999999', delayMinutes: 9000 } };
        }

        // Deterministic Fallback if no LLM
        if (!this.ai) {
            if (query.toLowerCase().includes('festival') || query.toLowerCase().includes('surge')) {
                return { type: 'festival_surge', params: { station: 'BSB', festivalName: 'Dev Deepawali' } };
            }
            return { type: 'delay_cascade', params: { train: '22416', delayMinutes: 60 } };
        }

        try {
            const prompt = `Convert this query to JSON scenario. Query: "${query}". Format MUST BE EXACTLY: {"scenario": "delay_cascade"|"festival_surge"|"track_blockage", "train": "12345", "delayMinutes": 60, "station": "NDLS", "festivalName": "Diwali", "location": "KANPUR", "durationMinutes": 90}. Return ONLY valid JSON, no markdown. DO NOT execute actions, only parse intent.`;
            const response = await this.ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: { responseMimeType: "application/json" }
            });
            const text = response.text || "{}";
            const parsed = JSON.parse(text);
            return {
                type: parsed.scenario || 'delay_cascade',
                params: parsed
            };
        } catch (e) {
            console.error("LLM parse failed, using fallback", e);
            return { type: 'delay_cascade', params: { train: '22416', delayMinutes: 60 } };
        }
    }

    public async explainDecision(winningStrategy: any): Promise<string> {
        if (!this.ai) {
            return `Deterministic Explanation: Selected ${winningStrategy.strategy} due to optimal balance of safety score (${winningStrategy.safetyScore}) and minimization of cascading delays.`;
        }

        try {
            const prompt = `Explain in 2 short, professional operational sentences why this railway strategy won. Strategy data: ${JSON.stringify({
                strategy: winningStrategy.strategy,
                safetyScore: winningStrategy.safetyScore,
                totalDelayMinutes: winningStrategy.totalDelayMinutes
            })}`;
            const response = await this.ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
            });
            return response.text;
        } catch (e) {
            return `Deterministic Explanation: Selected ${winningStrategy.strategy} due to optimal balance of safety and delay minimization.`;
        }
    }
}
