import { config } from 'dotenv';
config();

import express from 'express';
import cors from 'cors';
import path from 'path';
import { DigitalTwinStore } from './lib/state';
import { globalEventBus } from './lib/events';
import { MockTelemetryProvider } from './simulation/telemetry';
import { PrecogEngine } from './lib/precog';
import { ConsensusEngine } from './agents/consensus';
import { IntelligenceLayer } from './lib/llm';
import { z } from 'zod';
import { Groq } from 'groq-sdk';

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

const app = express();
app.use(cors());
app.use(express.json());

// 1. Static file serving (the original UI)
const publicDir = path.join(__dirname, '..');
app.use(express.static(publicDir));

// Initialize engines
const store = DigitalTwinStore.getInstance();
const telemetry = MockTelemetryProvider.getInstance();
const precog = new PrecogEngine();

// API Endpoints
app.get(['/api/network', '/api/network/live'], (req, res) => {
    res.json(store.getState());
});

app.post('/api/network/live', (req, res) => {
    res.json(store.getState());
});

app.get('/api/events', (req, res) => {
    const startDemo = req.query.demo === 'true';

    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
    });

    const sendEvent = (type: string, data: any) => {
        res.write(`event: ${type}\ndata: ${JSON.stringify(data)}\n\n`);
    };

    sendEvent('initial_state', store.getState());

    const onStateUpdate = (state: any) => sendEvent('state_update', state);
    const onTelemetryUpdate = (event: any) => sendEvent('telemetry_update', event);
    const onPrecogUpdate = (predictions: any) => sendEvent('precog_update', predictions);

    globalEventBus.on('state_update', onStateUpdate);
    globalEventBus.on('telemetry_update', onTelemetryUpdate);
    globalEventBus.on('precog_update', onPrecogUpdate);

    req.on('close', () => {
        globalEventBus.off('state_update', onStateUpdate);
        globalEventBus.off('telemetry_update', onTelemetryUpdate);
        globalEventBus.off('precog_update', onPrecogUpdate);
    });

    if (startDemo) {
        telemetry.startDemoStream();
    }
});

app.get('/api/precog', (req, res) => {
    const predictions = precog.analyzeTemporalState(store.getState());
    res.json(predictions);
});

app.post('/api/predict/delay', async (req, res) => {
    try {
        const { trainId, minutes, reason, congestion, hour } = req.body;
        
        const prompt = `You are the CRIS (Centre for Railway Information Systems) Delay Prediction Engine for Indian Railways.
Analyze the following delay scenario and predict the cascading effects.
TRAIN: ${trainId}
INITIAL DELAY: ${minutes} minutes
WEATHER/REASON: ${reason}
ROUTE CONGESTION: ${congestion}%
HOUR OF DAY: ${hour}:00

Return ONLY a valid JSON object matching exactly this structure:
{
  "predictedDelay": <integer: final estimated delay at destination in minutes>,
  "confidence": <integer: 0-100>,
  "severity": "<LOW|MEDIUM|HIGH|CRITICAL>",
  "factors": [
    "<String: 10-15 word realistic delay factor (e.g., 'Speed restriction due to fog on northern corridor')>",
    "<String: another factor>",
    "<String: another factor>"
  ],
  "recommendation": "<String: actionable recommendation for operations control>",
  "cascadeRisk": "<String: description of how this affects trains behind>",
  "insight": "<String: historical intelligence insight for this corridor>"
}`;

        const chatCompletion = await groq.chat.completions.create({
            messages: [{ role: 'user', content: prompt }],
            model: 'openai/gpt-oss-20b',
            temperature: 0.7,
            response_format: { type: 'json_object' }
        });

        const content = chatCompletion.choices[0]?.message?.content;
        if (content) {
            const parsed = JSON.parse(content);
            return res.json(parsed);
        }
        throw new Error("Empty LLM response");
    } catch (e: any) {
        console.error("Delay Prediction AI Error:", e);
        // Fallback
        const { minutes } = req.body;
        res.json({
            predictedDelay: minutes + Math.floor(Math.random() * 20),
            confidence: 75,
            severity: minutes > 60 ? 'HIGH' : 'MEDIUM',
            factors: [
                "Weather conditions reducing safe operating speed on corridor",
                "Station congestion creating platform hold-back at next major junction",
                "Cascading delay from preceding train occupying track slot"
            ],
            recommendation: "Pre-position at next major junction and issue advisory to downstream stations.",
            cascadeRisk: "3 trains behind may face 10-18 min secondary delays without intervention.",
            insight: "Historical pattern: this corridor recovers ~60% of delays on clear weather windows."
        });
    }
});

app.post('/api/predict/crowd', async (req, res) => {
    try {
        const { stationId, hour, is_weekend, event } = req.body;
        
        const prompt = `You are the CRIS (Centre for Railway Information Systems) AI Engine for Indian Railways crowd intelligence.

STATION: ${stationId}
CURRENT HOUR: ${hour}:00 IST
DAY TYPE: ${is_weekend ? 'Weekend/Holiday' : 'Weekday'}
SPECIAL EVENT: ${event || 'None'}

DOMAIN KNOWLEDGE — Indian Railway Station Patterns:
- Major junction stations (NDLS, CSTM, HWH, MAS, SBC, PNBE) have peak hours: 07:00-10:00 (morning rush), 17:00-21:00 (evening rush)
- Festival seasons (Diwali, Holi, Chhath, Kumbh Mela, Dev Deepawali) can increase crowd by 40-80%
- Weekends see 15-25% higher leisure travel
- Night hours (00:00-05:00) have minimal crowd (5-20%) except at major termini
- Monsoon season affects crowd patterns due to delays
- Station capacity varies: NDLS=16 platforms, CSTM=18, HWH=23, MAS=17
- Crowd levels: 0-30 LOW, 31-50 MODERATE, 51-70 HIGH, 71-85 VERY HIGH, 86-100 CRITICAL
- Incoming trains during peak can be 2-3x normal

Based on ALL of this, generate a realistic prediction.

Return ONLY a JSON object with this EXACT structure:
{
    "data": {
        "prediction": {
            "current_status": {
                "crowd_level": <integer 0-100>,
                "risk_level": "<LOW|MODERATE|HIGH|VERY_HIGH|CRITICAL>",
                "incoming_trains": <integer>,
                "status": "<normal|busy|critical>"
            },
            "hourly_forecast": [<24 integers, each 0-100, realistic pattern for the full day>],
            "recommended_deployments": {
                "rpf_personnel": <integer>,
                "ticket_counters": <integer>,
                "medical_units": <integer>
            },
            "peak_hours": [<2-3 integers representing peak hour indices>],
            "insights": "<one sentence summary of the station's predicted condition>"
        }
    }
}`;

        const chatCompletion = await groq.chat.completions.create({
            messages: [{ role: 'user', content: prompt }],
            model: 'openai/gpt-oss-20b',
            temperature: 0.6,
            response_format: { type: 'json_object' }
        });

        const content = chatCompletion.choices[0]?.message?.content;
        const fallback = {
            data: {
                prediction: {
                    current_status: { crowd_level: 65, risk_level: 'HIGH', incoming_trains: 8, status: 'busy' },
                    hourly_forecast: [12,10,8,7,9,15,30,55,72,78,70,65,60,58,55,60,68,78,82,75,60,45,30,18],
                    recommended_deployments: { rpf_personnel: 12, ticket_counters: 8, medical_units: 2 },
                    peak_hours: [8, 9, 18],
                    insights: 'Station operating at elevated capacity. Monitor platform congestion closely.'
                }
            }
        };

        if (content) {
            try {
                const parsed = JSON.parse(content);
                if (parsed.data?.prediction?.current_status?.crowd_level != null && Array.isArray(parsed.data?.prediction?.hourly_forecast)) {
                    return res.json(parsed);
                }
            } catch (e) {
                console.error('Failed to parse Groq crowd response', e);
            }
        }

        res.json(fallback);
    } catch (e: any) {
        console.error("Groq crowd API error:", e);
        res.json({
            data: {
                prediction: {
                    current_status: { crowd_level: 65, risk_level: 'HIGH', incoming_trains: 8, status: 'busy' },
                    hourly_forecast: [12,10,8,7,9,15,30,55,72,78,70,65,60,58,55,60,68,78,82,75,60,45,30,18],
                    recommended_deployments: { rpf_personnel: 12, ticket_counters: 8, medical_units: 2 },
                    peak_hours: [8, 9, 18],
                    insights: 'AI Core offline. Using deterministic fallback model.'
                }
            }
        });
    }
});

app.post('/api/predict/tactical', async (req, res) => {
    try {
        const { time, crowdDensity, weatherCode, isSevere, stationName, incomingTrains, platforms } = req.body;
        
        const prompt = `You are the CRIS Tactical Operations AI for Indian Railways — the decision-support system used by station masters and RPF commanders.

LIVE STATION TELEMETRY:
- Station: ${stationName || 'Unknown'}
- Time: ${time}:00 IST
- Crowd Density: ${crowdDensity}% ${crowdDensity > 85 ? '⚠️ CRITICAL THRESHOLD BREACHED' : crowdDensity > 70 ? '⚠️ ELEVATED' : '✅ WITHIN LIMITS'}
- Incoming Trains: ${incomingTrains}
- Available Platforms: ${platforms}
- Weather Alert: ${isSevere ? 'SEVERE (fog/rain/storm)' : 'Normal'} (WMO Code: ${weatherCode})

TACTICAL DOCTRINE — Indian Railways Standard Operating Procedures:
- RPF (Railway Protection Force) deploys when crowd > 70%
- Platform allocation conflicts require immediate resolution
- Gate management: open secondary exits when crowd > 60%
- Festival/peak hours: pre-position crowd barriers at concourse
- Severe weather: reduce platform speed limits, activate fog signals, hold departures if visibility < 200m
- Medical standby when crowd > 80% at any major station
- Digital signage redirection when any platform queue > 15 min wait
- Priority: SAFETY > Schedule > Comfort

Based on this real-time data, generate exactly 3 tactical alerts. Severity must match the conditions:
- Use "CRITICAL: " ONLY when crowd > 80% OR severe weather OR platform conflict risk
- Use "WARNING: " for elevated risk, congestion building up, or resource shortages
- Use "INFO: " for status updates, all-clear signals, or optimization tips

Be specific: mention actual numbers, platform IDs, gate names, and concrete actions. Do NOT be generic.

Return ONLY a JSON object: {"alerts": ["CRITICAL: ...", "WARNING: ...", "INFO: ..."]}`;

        const chatCompletion = await groq.chat.completions.create({
            messages: [{ role: 'user', content: prompt }],
            model: 'openai/gpt-oss-20b',
            temperature: 0.5,
            response_format: { type: 'json_object' }
        });

        const content = chatCompletion.choices[0]?.message?.content;
        let alerts = [
            "CRITICAL: Deploy Rapid Action Force to Main Concourse",
            "WARNING: Divert incoming train 22415 to secondary platform",
            "INFO: Activate supplemental digital signage for crowd routing"
        ];
        
        if (content) {
            try {
                const parsed = JSON.parse(content);
                if (parsed.alerts && Array.isArray(parsed.alerts)) {
                    alerts = parsed.alerts;
                }
            } catch (e) {
                console.error('Failed to parse Groq response', e);
            }
        }

        res.json({
            predictionId: 'PT-' + Date.now(),
            action: alerts[0] || 'Hold train 12301 at current station',
            reason: 'Determined by AI',
            confidence: 88,
            alerts
        });
    } catch (e: any) {
        console.error("Groq tactical API error:", e);
        // Fallback response if API fails
        res.json({
            predictionId: 'PT-' + Date.now(),
            action: 'Hold train 12301 at current station',
            reason: 'Severe congestion ahead',
            confidence: 85,
            alerts: [
                "CRITICAL: Deploy Rapid Action Force to Main Concourse",
                "WARNING: Divert incoming train 22415 to secondary platform",
                "INFO: Activate supplemental digital signage for crowd routing"
            ]
        });
    }
});

app.post('/api/agents/analyze', async (req, res) => {
    const { scenario } = req.body;
    const finalScenario = scenario || { type: 'delay_cascade', params: { train: '22416', delayMinutes: 60 } };
    
    try {
        const state = store.getState();
        const prompt = `You are the CRIS Multi-Agent Orchestration System for Indian Railways. You control 5 autonomous AI agents that must coordinate to handle a live railway scenario.

SCENARIO: ${JSON.stringify(finalScenario)}

CURRENT NETWORK STATE:
- Active Trains: 14,281
- Network Load: 87%
- Critical Alerts: 02
- Key Stations: New Delhi (NDLS, 16 platforms), Mumbai CST (CSTM, 18 platforms), Howrah (HWH, 23 platforms), Prayagraj (PRYJ, 10 platforms), Varanasi (BSB, 9 platforms)
- Current time: ${new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata' })} IST

Generate UNIQUE, SPECIFIC, and REALISTIC decisions for each of the 5 agents. Use real train numbers (12301, 22416, 12239, 14205, 15003), station codes, platform numbers, and concrete actions. Each redeploy must produce DIFFERENT recommendations.

Return ONLY a JSON object with this structure:
{
  "ops": {
    "status": "<ALERT|MONITORING|NOMINAL>",
    "critical_issues": ["<specific issue 1>", "<specific issue 2>"],
    "alerts": ["<train-specific alert 1>", "<train-specific alert 2>"],
    "insight": "<one-line operational summary>",
    "action_required": "<specific action>"
  },
  "sched": {
    "rerouting": ["<specific reroute 1>", "<specific reroute 2>"],
    "speed_adjustments": ["<specific speed change>"],
    "priority_changes": ["<priority directive>"],
    "estimated_time_saved": "<X-Y minutes>",
    "insight": "<scheduling summary>"
  },
  "plat": {
    "platform_changes": ["<Train XXXXX → Platform N at STATION>", "<another change>"],
    "conflict_resolutions": ["<specific resolution>"],
    "crowd_redistribution": ["<gate/exit directive>"],
    "insight": "<platform summary>"
  },
  "crowd": {
    "gate_changes": ["<specific gate action at station>", "<another>"],
    "staff_deployment": ["<Deploy N staff at STATION location>", "<another>"],
    "passenger_routing": ["<redirect passengers via route>"],
    "risk_areas": ["<STATION area — SEVERITY level>"],
    "insight": "<crowd management summary>"
  },
  "emrg": {
    "risk_level": "<HIGH|MODERATE|LOW>",
    "incidents": [{"location": "<station>", "type": "<incident type>", "severity": "<CRITICAL|HIGH|MODERATE>"}],
    "action_plan": ["<emergency action 1>", "<action 2>"],
    "passenger_impact": "<N passengers across M stations affected>",
    "system_status": "OPTIMAL",
    "confidence": "<percentage>"
  }
}`;

        const chatCompletion = await groq.chat.completions.create({
            messages: [{ role: 'user', content: prompt }],
            model: 'openai/gpt-oss-20b',
            temperature: 0.8,
            response_format: { type: 'json_object' }
        });

        const content = chatCompletion.choices[0]?.message?.content;
        if (content) {
            try {
                const parsed = JSON.parse(content);
                if (parsed.ops && parsed.sched && parsed.plat && parsed.crowd && parsed.emrg) {
                    return res.json(parsed);
                }
            } catch (e) {
                console.error('Failed to parse Groq agents response', e);
            }
        }
    } catch (e: any) {
        console.error("Groq agents API error:", e);
    }
    
    // Fallback to consensus engine
    const consensus = new ConsensusEngine();
    const analysis = consensus.analyzeScenario(store.getState(), finalScenario);
    res.json(analysis);
});

app.post('/api/simulate', async (req, res) => {
    try {
        const { query, scenario, _forceAgentFailure, _forceLLMFailure, _forceLLMHallucination } = req.body;
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
                llmStatus = 'OFFLINE_FALLBACK';
                finalScenario = { type: 'delay_cascade', params: { train: '22416', delayMinutes: 60 } };
            }
        }

        if (_forceAgentFailure && finalScenario?.params) {
            finalScenario.params._forceAgentFailure = _forceAgentFailure;
        }

        // Domain Validation (mocked simplified)
        if (!finalScenario || !finalScenario.type) {
            return res.status(422).json({ error: "DOMAIN_VALIDATION_FAILED", message: "Invalid scenario" });
        }

        try {
            const prompt = `You are the CRIS Simulation Engine for Indian Railways.
Run a simulation for the following scenario: ${JSON.stringify(finalScenario)}

Generate a highly realistic simulation outcome. You must return ONLY a valid JSON object matching this exact structure:
{
  "risk": "<LOW|MEDIUM|HIGH|CRITICAL>",
  "affected_trains": <integer>,
  "platform_conflicts": <integer>,
  "passenger_impact": <integer>,
  "recs": [
    "<String: recommendation 1>",
    "<String: recommendation 2>",
    "<String: recommendation 3>"
  ],
  "cascade": [
    { "train": "<String: train number>", "reason": "<String: reason for delay>", "delay": <integer: minutes> },
    { "train": "<String: train number>", "reason": "<String: reason for delay>", "delay": <integer: minutes> },
    { "train": "<String: train number>", "reason": "<String: reason for delay>", "delay": <integer: minutes> }
  ],
  "options": [
    { "via": "<String: alternate route description>", "trains": <integer: trains affected>, "time": "<String: time saved or lost>" },
    { "via": "<String: alternate route description>", "trains": <integer: trains affected>, "time": "<String: time saved or lost>" }
  ]
}

Make the numbers proportional to the scenario. For example, a 120-minute delay or major route blockage should have thousands of affected passengers and dozens of trains. A 15-minute delay should be small.`;

            const chatCompletion = await groq.chat.completions.create({
                messages: [{ role: 'user', content: prompt }],
                model: 'openai/gpt-oss-20b',
                temperature: 0.7,
                response_format: { type: 'json_object' }
            });

            const content = chatCompletion.choices[0]?.message?.content;
            if (content) {
                const parsed = JSON.parse(content);
                if (parsed.affected_trains !== undefined) {
                    return res.json(parsed);
                }
            }
        } catch (e) {
            console.error("Groq Simulation API error:", e);
        }

        // Fallback: Debate & Optimize
        const analysis = consensus.analyzeScenario(store.getState(), finalScenario);

        if (analysis.systemStatus === 'CRITICAL_FAILURE' || analysis.systemStatus === 'NO_SAFE_STRATEGY') {
             return res.status(422).json({
                ...analysis,
                llmStatus
            });
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

        res.json({
            ...analysis,
            explanation,
            llmStatus
        });
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
});

app.post('/api/decisions/execute', (req, res) => {
    try {
        const { decisionId, baseVersion, simulatedState, scenario, strategy } = req.body;
        const liveState = store.getState();
        
        if (liveState.stateVersion !== baseVersion) {
            return res.status(409).json({ 
                error: "STALE_SIMULATION", 
                message: `Simulation generated from state version ${baseVersion}. Current state version: ${liveState.stateVersion}. Re-simulation required.` 
            });
        }

        store.updateState(simulatedState || liveState, {
            decisionId,
            timestamp: Date.now(),
            previousStateVersion: liveState.stateVersion,
            newStateVersion: liveState.stateVersion + 1,
            trigger: 'WHAT_IF_CONSOLE',
            scenario: scenario || {},
            winningStrategy: strategy || 'UNKNOWN',
            approver: 'HUMAN_OPERATOR',
            status: 'EXECUTED'
        });
        
        res.json({ success: true, newVersion: store.getState().stateVersion });
    } catch (e: any) {
        if (e.message === "ALREADY_EXECUTED") {
            return res.status(409).json({ error: "ALREADY_EXECUTED", message: "Decision ID has already been executed." });
        }
        res.status(500).json({ error: e.message });
    }
});

app.post('/api/decisions/reject', (req, res) => {
    const { decisionId } = req.body;
    globalEventBus.emit('decision_update', { id: decisionId, status: 'REJECTED' });
    res.json({ success: true });
});

const PORT = process.env.PORT || 3000;
if (!process.env.VERCEL) {
    app.listen(PORT as number, '0.0.0.0', () => {
        console.log(`Server listening on port ${PORT}`);
    });
}

// Keep event loop alive
setInterval(() => {}, 1000 * 60 * 60);

export default app;
