'use client';

import { useState, useEffect } from 'react';
import { PrecogPrediction } from '../types';

export default function CommandCenter() {
  const [networkState, setNetworkState] = useState<any>(null);
  const [auditLog, setAuditLog] = useState<any[]>([]);
  const [precogAlerts, setPrecogAlerts] = useState<PrecogPrediction[]>([]);
  const [liveEvents, setLiveEvents] = useState<any[]>([]);
  
  const [query, setQuery] = useState('');
  const [simResult, setSimResult] = useState<any>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  
  const [llmStatus, setLlmStatus] = useState('ONLINE');
  const [sseStatus, setSseStatus] = useState('CONNECTING...');
  const [temporalMode, setTemporalMode] = useState<'PAST' | 'CURRENT' | 'PREDICTED'>('CURRENT');
  const [selectedPrediction, setSelectedPrediction] = useState<PrecogPrediction | null>(null);

  // Initial Data Load & SSE Setup
  useEffect(() => {
    // Load audit log (static fetch)
    fetch('/api/network/audit').then(res => res.json()).then(data => {
        if (Array.isArray(data)) setAuditLog(data);
    });

    // Setup Server-Sent Events
    let eventSource = new EventSource('/api/events');
    
    eventSource.onopen = () => setSseStatus('ONLINE');
    eventSource.onerror = () => setSseStatus('DEGRADED (Reconnecting...)');

    eventSource.addEventListener('initial_state', (e: any) => {
        setNetworkState(JSON.parse(e.data));
    });

    eventSource.addEventListener('state_update', (e: any) => {
        setNetworkState(JSON.parse(e.data));
    });

    eventSource.addEventListener('telemetry_update', (e: any) => {
        const evt = JSON.parse(e.data);
        setLiveEvents(prev => [evt, ...prev].slice(0, 50)); // Keep last 50
    });

    eventSource.addEventListener('telemetry_late', (e: any) => {
        const evt = JSON.parse(e.data);
        evt._isLate = true;
        setLiveEvents(prev => [evt, ...prev].slice(0, 50));
    });

    eventSource.addEventListener('precog_update', (e: any) => {
        const predictions = JSON.parse(e.data);
        setPrecogAlerts(predictions);
    });

    return () => {
        eventSource.close();
    };
  }, []);

  const handleSimulate = async (forceQuery?: string, flags?: any) => {
    const activeQuery = forceQuery || query;
    if (!activeQuery) return;
    setIsSimulating(true);
    setSimResult(null);
    try {
      const res = await fetch('/api/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: activeQuery, ...flags })
      });
      const data = await res.json();
      
      if (res.status === 422) alert(`VALIDATION OR SAFETY ERROR:\n${data.message}`);
      else if (res.status === 409) alert(`STALE SIMULATION:\n${data.message}`);
      else if (res.ok) {
          setSimResult(data);
          setLlmStatus(data.llmStatus);
      } else alert(`ERROR: ${data.message || data.error}`);
    } catch (e) {
      console.error(e);
    }
    setIsSimulating(false);
  };

  const handleDemoV2 = async () => {
      // Trigger the backend mock telemetry stream
      await fetch('/api/events?demo=true');
  }

  const handleExecute = async () => {
    if (!simResult?.winningStrategy?.state) return;
    try {
      const res = await fetch('/api/decisions/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            decisionId: crypto.randomUUID(), 
            baseVersion: networkState.stateVersion, // crucial for strict Phase 2 concurrency
            simulatedState: simResult.winningStrategy.state,
            scenario: simResult.scenario,
            strategy: simResult.winningStrategy.strategy
        })
      });
      
      const data = await res.json();
      if (res.status === 409) {
          alert(`CONFLICT: ${data.message}`);
      } else if (res.ok) {
          setSimResult(null);
          setQuery('');
          // Refresh audit
          fetch('/api/network/audit').then(r => r.json()).then(d => setAuditLog(d));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleRevert = async (decisionId: string) => {
      if (!confirm(`Are you sure you want to revert decision ${decisionId}?`)) return;
      try {
          const res = await fetch('/api/decisions/rollback', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ decisionId })
          });
          const data = await res.json();
          if (!res.ok) alert(`ROLLBACK FAILED: ${data.error}`);
          else fetch('/api/network/audit').then(r => r.json()).then(d => setAuditLog(d));
      } catch (e) {
          console.error(e);
      }
  };

  if (!networkState) return <div className="text-white p-10 bg-[#01050e] min-h-screen">Connecting to SSE Stream...</div>;

  return (
    <div className="bg-[#01050e] text-[#a0aec0] min-h-screen font-mono p-6 flex flex-col gap-6">
      <header className="flex justify-between items-center border-b border-[#1a365d] pb-4">
        <h1 className="text-3xl text-[#ffb300] font-bold tracking-widest">RAILVERSE AI <span className="text-sm text-gray-500">COMMAND CENTER</span></h1>
        
        {/* TEMPORAL PLAYBACK SLIDER */}
        <div className="flex bg-[#041024] p-1 rounded border border-[#1a365d]">
            <button onClick={() => setTemporalMode('PAST')} className={`px-4 py-1 text-xs font-bold ${temporalMode === 'PAST' ? 'bg-[#1a365d] text-white' : 'text-gray-500'}`}>PAST (HISTORY)</button>
            <button onClick={() => setTemporalMode('CURRENT')} className={`px-4 py-1 text-xs font-bold ${temporalMode === 'CURRENT' ? 'bg-[#00e5ff] text-[#01050e]' : 'text-gray-500'}`}>CURRENT (LIVE)</button>
            <button onClick={() => setTemporalMode('PREDICTED')} className={`px-4 py-1 text-xs font-bold ${temporalMode === 'PREDICTED' ? 'bg-orange-500 text-[#01050e]' : 'text-gray-500'}`}>PREDICTED (FORECAST)</button>
        </div>

        <div className="flex gap-4">
          <div className="bg-[#041024] border border-[#1a365d] p-2 rounded flex flex-col items-end gap-1">
             <div className="flex items-center gap-2">
                 <div className={`w-2 h-2 ${sseStatus === 'ONLINE' ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'} rounded-full`}></div>
                 <span className={`${sseStatus === 'ONLINE' ? 'text-[#00ff66]' : 'text-yellow-500'} font-bold text-sm`}>SIMULATED TELEMETRY</span>
             </div>
             <div className="text-xs text-gray-400">STATE v{networkState.stateVersion}</div>
          </div>
          <button onClick={handleDemoV2} className="bg-[#1a365d] border border-[#00e5ff] text-[#00e5ff] px-4 py-2 rounded hover:bg-[#2a466d] transition font-bold text-sm shadow-[0_0_10px_rgba(0,229,255,0.3)]">
             AUTONOMOUS DEMO V2
          </button>
        </div>
      </header>
      
      <div className="grid grid-cols-12 gap-6 flex-1">
        
        {/* LEFT PANEL: SYSTEM HEALTH, LIVE FEED, PRECOG */}
        <div className="col-span-3 flex flex-col gap-4">
           
           {/* SYSTEM HEALTH */}
           <div className="bg-[#041024] p-4 border border-[#1a365d] rounded shadow-lg">
              <h2 className="text-gray-300 text-sm mb-2 border-b border-[#1a365d] pb-1 font-bold">SYSTEM HEALTH</h2>
              <div className="text-xs flex flex-col gap-1">
                  <div className="flex justify-between"><span>Digital Twin</span> <span className="text-green-500">● ONLINE</span></div>
                  <div className="flex justify-between"><span>Telemetry Stream</span> <span className={sseStatus === 'ONLINE' ? 'text-green-500' : 'text-yellow-500'}>● {sseStatus}</span></div>
                  <div className="flex justify-between"><span>Consensus Engine</span> <span className="text-green-500">● ONLINE</span></div>
                  <div className="flex justify-between">
                      <span>Gemini LLM</span> 
                      <span className={llmStatus === 'ONLINE' ? "text-green-500" : "text-yellow-500"}>● {llmStatus}</span>
                  </div>
              </div>
           </div>

           {/* LIVE EVENT FEED */}
           <div className="bg-[#041024] p-4 border border-[#1a365d] rounded shadow-lg flex-1 overflow-y-auto max-h-[300px]">
              <h2 className="text-[#00e5ff] text-xl mb-4 border-b border-[#1a365d] pb-2">LIVE EVENT FEED</h2>
              {liveEvents.map((evt, i) => (
                  <div key={i} className={`text-xs mb-2 p-1 border-l-2 ${evt._isLate ? 'border-gray-500 text-gray-500' : 'border-[#00e5ff] text-gray-300'}`}>
                      <div className="flex justify-between">
                          <span className="font-bold">{new Date(evt.timestamp).toISOString().substring(11, 19)}</span>
                          {evt._isLate && <span className="bg-gray-800 text-[10px] px-1 rounded">LATE / HISTORY ONLY</span>}
                      </div>
                      <div className="text-[#ffb300]">{evt.type.toUpperCase()} - {evt.entityId}</div>
                      <div>{JSON.stringify(evt.payload)}</div>
                  </div>
              ))}
              {liveEvents.length === 0 && <div className="text-sm text-gray-500">Awaiting telemetry...</div>}
           </div>

           {/* PRECOG V2 PANEL */}
           <div className="bg-[#041024] p-4 border border-orange-500/50 rounded shadow-lg overflow-y-auto">
              <h2 className="text-orange-400 text-xl mb-4 border-b border-orange-500/30 pb-2 font-bold tracking-wide">
                  PRECOG V2 ENGINE
              </h2>
              {precogAlerts.length === 0 && <div className="text-sm text-green-500">Temporal forecast indicates stable conditions across all horizons.</div>}
              
              {precogAlerts.map((alert, i) => (
                 <div 
                    key={i} 
                    onClick={() => setSelectedPrediction(alert)}
                    className={`mb-4 p-3 border cursor-pointer transition hover:bg-orange-900/30 ${selectedPrediction?.id === alert.id ? 'border-orange-500 bg-orange-900/20' : 'border-[#1a365d] bg-[#01050e]'}`}
                 >
                    <div className="flex justify-between items-start mb-2">
                        <span className={`text-sm font-bold ${alert.severity === 'CRITICAL' ? 'text-red-500' : 'text-orange-400'}`}>
                            {alert.type.replace('_', ' ')}
                        </span>
                        <span className="bg-red-900 text-white text-[10px] px-2 py-1 rounded font-bold">
                            +{alert.horizonMinutes} MIN
                        </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs mb-2">
                        <div className="bg-black/50 p-1 border border-[#1a365d]">
                            <div className="text-gray-500">PROBABILITY</div>
                            <div className="text-red-400 font-bold text-lg">{Math.round(alert.probability)}%</div>
                        </div>
                        <div className="bg-black/50 p-1 border border-[#1a365d]">
                            <div className="text-gray-500">CONFIDENCE</div>
                            <div className="text-green-400 font-bold text-lg">{Math.round(alert.confidence)}%</div>
                        </div>
                    </div>
                 </div>
              ))}
           </div>
        </div>

        {/* CENTER & RIGHT: VISUALIZATIONS, WHAT-IF, DECISIONS */}
        <div className="col-span-9 flex flex-col gap-4">
            
            {/* TOP RIGHT: CASCADE GRAPH OR NETWORK STATE */}
            {selectedPrediction ? (
                <div className="bg-[#041024] p-6 border border-orange-500 rounded shadow-lg">
                    <div className="flex justify-between items-center mb-6 border-b border-[#1a365d] pb-2">
                        <h2 className="text-orange-400 text-2xl font-bold tracking-wider">PREDICTIVE CASCADE GRAPH</h2>
                        <button onClick={() => setSelectedPrediction(null)} className="text-xs bg-[#1a365d] text-white px-3 py-1 rounded hover:bg-gray-700">CLOSE</button>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-8">
                        {/* THE GRAPH VISUALIZATION */}
                        <div className="flex flex-col items-center justify-center p-4 bg-[#01050e] border border-[#1a365d] rounded">
                            <div className="bg-[#1a365d] border border-blue-400 text-white p-3 rounded-lg w-64 text-center font-bold">
                                {selectedPrediction.entityId} 
                            </div>
                            <div className="h-8 w-px bg-orange-500 relative">
                                <span className="absolute left-2 top-1 text-xs text-orange-400 bg-[#01050e] px-1">{Math.round(selectedPrediction.probability)}%</span>
                            </div>
                            <div className="bg-orange-900/50 border border-orange-500 text-orange-300 p-3 rounded-lg w-64 text-center font-bold shadow-[0_0_15px_rgba(255,165,0,0.3)]">
                                {selectedPrediction.type.replace('_', ' ')}
                            </div>
                            {selectedPrediction.predictedImpact.delayMinutes > 0 && (
                                <>
                                    <div className="h-8 w-px bg-red-500 relative">
                                        <span className="absolute left-2 top-1 text-xs text-red-400 bg-[#01050e] px-1">IMPACT</span>
                                    </div>
                                    <div className="bg-red-900/50 border border-red-500 text-red-300 p-3 rounded-lg w-64 text-center font-bold shadow-[0_0_15px_rgba(255,0,0,0.3)]">
                                        NETWORK DELAY CASCADE
                                    </div>
                                </>
                            )}
                        </div>

                        {/* STRUCTURED EXPLANATION */}
                        <div className="flex flex-col gap-3 text-sm">
                            <div className="bg-[#01050e] p-3 border border-[#1a365d]"><span className="text-gray-500 font-bold block mb-1">WHAT</span> <span className="text-white">{selectedPrediction.type.replace('_', ' ')}</span></div>
                            <div className="bg-[#01050e] p-3 border border-[#1a365d]"><span className="text-gray-500 font-bold block mb-1">WHEN</span> <span className="text-red-400">~{selectedPrediction.horizonMinutes} minutes from now</span></div>
                            <div className="bg-[#01050e] p-3 border border-[#1a365d]"><span className="text-gray-500 font-bold block mb-1">WHERE</span> <span className="text-white">{selectedPrediction.entityId}</span></div>
                            <div className="bg-[#01050e] p-3 border border-[#1a365d]">
                                <span className="text-gray-500 font-bold block mb-1">WHY (TREND EVIDENCE)</span> 
                                <ul className="list-disc pl-5 text-orange-300">
                                    {selectedPrediction.contributingFactors.map((f, i) => <li key={i}>{f}</li>)}
                                </ul>
                            </div>
                            <div className="bg-[#01050e] p-3 border border-red-900">
                                <span className="text-gray-500 font-bold block mb-1">PREDICTED IMPACT</span> 
                                <div className="grid grid-cols-3 gap-2 mt-2">
                                    <div><span className="block text-gray-600 text-xs">Trains</span><span className="text-white text-lg">{selectedPrediction.predictedImpact.trains}</span></div>
                                    <div><span className="block text-gray-600 text-xs">Passengers</span><span className="text-white text-lg">{selectedPrediction.predictedImpact.passengers}</span></div>
                                    <div><span className="block text-gray-600 text-xs">Delay</span><span className="text-red-400 font-bold text-lg">+{selectedPrediction.predictedImpact.delayMinutes}m</span></div>
                                </div>
                            </div>
                            
                            {selectedPrediction.recommendedAction && (
                                <div className="mt-4 p-4 bg-green-900/20 border border-green-500 rounded">
                                    <div className="text-green-500 font-bold mb-2">PROACTIVE RECOMMENDATION:</div>
                                    <div className="text-white mb-4">{selectedPrediction.recommendedAction}</div>
                                    <button 
                                        onClick={() => handleSimulate(`Simulate proactive action: ${selectedPrediction.recommendedAction} to prevent ${selectedPrediction.type} at ${selectedPrediction.entityId}`)}
                                        className="w-full bg-green-800 text-white font-bold py-2 rounded hover:bg-green-700"
                                    >
                                        SIMULATE CANDIDATE ACTION
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="bg-[#041024] p-4 border border-[#1a365d] rounded shadow-lg flex-1 overflow-y-auto max-h-[400px]">
                  <h2 className="text-[#00e5ff] text-xl mb-4 border-b border-[#1a365d] pb-2 flex justify-between">
                      NETWORK STATE
                      <span className="text-xs bg-[#1a365d] text-white px-2 py-1 rounded">MODE: {temporalMode}</span>
                  </h2>
                  <div className="grid grid-cols-2 gap-6">
                      <div>
                         <h3 className="text-white mb-2 font-bold">Trains</h3>
                         {Object.values(networkState.trains).map((t: any) => (
                            <div key={t.id} className={`text-sm mb-2 p-2 border ${t.currentDelay > 0 ? 'border-red-900 bg-red-900/20 text-red-400' : 'border-green-900 bg-green-900/20 text-green-400'}`}>
                              <div className="flex justify-between">
                                  <span className="font-bold">Train {t.id}</span>
                                  <span>{t.status}</span>
                              </div>
                              <div className="mt-1">Delay: <span className="font-bold text-white">+{t.currentDelay}m</span> | Next: {t.nextStation}</div>
                              
                              {/* Trend sparkline simulation */}
                              <div className="flex items-end h-6 mt-2 gap-1 border-b border-dashed border-gray-700 pb-1">
                                  {t.delayHistory && t.delayHistory.map((h: number, idx: number) => (
                                      <div key={idx} className="bg-blue-500 w-2" style={{ height: `${Math.max((h/60)*100, 10)}%`}}></div>
                                  ))}
                              </div>
                              <div className="text-[9px] text-gray-500 mt-1">DELAY TREND HISTORY</div>
                            </div>
                         ))}
                      </div>
                      <div>
                         <h3 className="text-white mb-2 font-bold">Stations</h3>
                         {Object.values(networkState.stations).map((s: any) => (
                            <div key={s.id} className={`text-sm mb-2 p-2 border ${s.riskState === 'CRITICAL' ? 'border-red-500 bg-red-900/20 text-red-400' : (s.riskState === 'WARNING' ? 'border-yellow-500 bg-yellow-900/20 text-yellow-400' : 'border-[#1a365d] bg-[#01050e]')}`}>
                              <div className="flex justify-between">
                                  <span className="font-bold">{s.name}</span>
                                  <span>[{s.riskState}]</span>
                              </div>
                              <div className="mt-1">Crowd Density: <span className="font-bold text-white">{s.crowdDensity}%</span></div>
                              
                              {/* Trend sparkline simulation */}
                              <div className="flex items-end h-6 mt-2 gap-1 border-b border-dashed border-gray-700 pb-1">
                                  {s.crowdHistory && s.crowdHistory.map((h: number, idx: number) => (
                                      <div key={idx} className="bg-orange-500 w-2" style={{ height: `${h}%`}}></div>
                                  ))}
                              </div>
                              <div className="text-[9px] text-gray-500 mt-1">CROWD TREND HISTORY</div>
                            </div>
                         ))}
                      </div>
                  </div>
               </div>
            )}

            {/* WHAT-IF CONSOLE */}
            <div className="bg-[#041024] p-4 border border-[#1a365d] rounded shadow-lg shrink-0">
                <h2 className="text-[#00e5ff] text-xl mb-4">WHAT-IF COMMAND CONSOLE</h2>
                <div className="flex gap-4">
                    <input 
                      type="text" 
                      className="flex-1 bg-[#01050e] border border-[#1a365d] p-3 text-white focus:outline-none focus:border-[#00e5ff]" 
                      placeholder="e.g. What happens if Train 22416 is delayed by 60 mins?" 
                      value={query}
                      onChange={e => setQuery(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleSimulate()}
                    />
                    <button onClick={() => handleSimulate()} disabled={isSimulating} className="bg-[#1a365d] text-[#00e5ff] font-bold px-8 py-3 rounded hover:bg-[#2a466d] border border-[#00e5ff] transition shadow-[0_0_10px_rgba(0,229,255,0.2)]">
                        {isSimulating ? 'SIMULATING...' : 'SIMULATE'}
                    </button>
                </div>
            </div>

            {/* AI DECISION SIMULATION RESULTS */}
            {simResult && (
                <div className="grid grid-cols-2 gap-4">
                    {/* AGENT DEBATE */}
                    <div className="bg-[#041024] p-4 border border-[#1a365d] rounded shadow-lg overflow-y-auto max-h-[500px]">
                        <h2 className="text-[#00e5ff] text-xl mb-4 border-b border-[#1a365d] pb-2 flex justify-between">
                            MULTI-AGENT DEBATE 
                            <span className={simResult.systemStatus === 'DEGRADED' ? 'text-yellow-500 text-sm' : 'text-green-500 text-sm'}>[{simResult.systemStatus}]</span>
                        </h2>
                        {simResult.agentDebate.map((a: any, i: number) => (
                            <div key={i} className={`mb-4 border-l-4 pl-4 py-1 bg-[#01050e] ${a.status === 'failed' ? 'border-red-500' : 'border-[#1a365d]'}`}>
                                <div className="text-white font-bold">{a.agent} <span className={`text-xs ml-2 px-1 rounded ${a.status === 'reject' ? 'bg-red-900 text-white' : a.status === 'recommend' ? 'bg-green-900 text-white' : a.status === 'failed' ? 'bg-red-600 text-white' : 'bg-yellow-900 text-white'}`}>[{a.status.toUpperCase()}]</span></div>
                                <div className="text-sm mt-2 text-gray-300"><span className="text-gray-500">Action:</span> {a.recommendations.join(', ') || 'Monitoring'}</div>
                            </div>
                        ))}
                    </div>

                    {/* EXECUTION */}
                    <div className="bg-[#041024] p-4 border border-[#1a365d] rounded shadow-lg flex flex-col">
                        <h2 className="text-[#ffb300] text-xl mb-4 border-b border-[#1a365d] pb-2">STRATEGY VALIDATION</h2>
                        <div className="bg-[#01050e] p-6 rounded mb-4 border border-[#ffb300] flex-1">
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-white text-2xl font-bold tracking-wider">{simResult.winningStrategy.strategy.toUpperCase()}</h3>
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-sm bg-[#041024] p-4 border border-[#1a365d]">
                                <div className="flex flex-col"><span className="text-gray-500">Total Delay</span><span className="text-red-400 text-xl">+{simResult.winningStrategy.totalDelayMinutes}m</span></div>
                                <div className="flex flex-col"><span className="text-gray-500">Safety Score</span><span className="text-green-400 text-xl">{simResult.winningStrategy.safetyScore}/100</span></div>
                            </div>
                        </div>
                        <div className="flex gap-4 mt-auto">
                            <button onClick={handleExecute} className="flex-1 bg-green-800 border border-green-500 text-white py-4 rounded font-bold hover:bg-green-700 tracking-wider shadow-[0_0_15px_rgba(0,255,0,0.2)]">
                                APPROVE & EXECUTE
                            </button>
                            <button onClick={() => setSimResult(null)} className="flex-1 bg-[#1a365d] border border-[#2a466d] text-white py-4 rounded font-bold hover:bg-[#2a466d]">
                                REJECT
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* AUDIT LOG */}
            {!simResult && !selectedPrediction && (
               <div className="bg-[#041024] p-4 border border-[#1a365d] rounded shadow-lg flex-1 overflow-y-auto max-h-[300px]">
                  <h2 className="text-[#00e5ff] text-xl mb-4 border-b border-[#1a365d] pb-2 flex justify-between">
                      DECISION AUDIT TRAIL
                      <button onClick={() => fetch('/api/network/audit').then(r => r.json()).then(d => setAuditLog(d))} className="text-xs bg-gray-800 px-2 py-1 rounded hover:bg-gray-700">REFRESH</button>
                  </h2>
                  {auditLog.length === 0 && <div className="text-sm text-gray-500">No decisions executed.</div>}
                  
                  <div className="flex flex-col gap-2">
                      {auditLog.map((audit: any) => (
                          <div key={audit.decisionId} className={`p-3 border ${audit.status === 'REVERTED' ? 'border-gray-700 bg-gray-900/50' : 'border-[#1a365d] bg-[#01050e] flex justify-between items-center'}`}>
                              <div>
                                  <div className="font-bold text-white text-sm">v{audit.previousStateVersion} → v{audit.newStateVersion} <span className="ml-2 text-gray-500 text-xs">ID: {audit.decisionId.substring(0,8)}...</span></div>
                                  <div className="text-sm text-gray-300 mt-1"><span className="text-[#ffb300]">{audit.status}:</span> {audit.winningStrategy}</div>
                              </div>
                              {audit.status === 'EXECUTED' && !audit.decisionId.startsWith('REV-') && (
                                  <button onClick={() => handleRevert(audit.decisionId)} className="text-xs bg-red-900/50 border border-red-500 text-red-300 px-3 py-1 hover:bg-red-900">
                                      REVERT DECISION
                                  </button>
                              )}
                          </div>
                      ))}
                  </div>
               </div>
            )}

        </div>
      </div>
    </div>
  );
}
