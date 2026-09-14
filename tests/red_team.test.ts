import { DigitalTwinStore } from '../src/lib/state';
import { ConsensusEngine } from '../src/agents/consensus';
import { SimulationEngine } from '../src/simulation/engine';
import { IntelligenceLayer } from '../src/lib/llm';
import { ExecutionRequestSchema } from '../src/lib/schemas';

async function runHardeningTests() {
  console.log("=== RAILVERSE PHASE 2 RED-TEAM HARDENING TEST SUITE ===");
  const store = DigitalTwinStore.getInstance();
  let testsPassed = 0;
  let testsFailed = 0;

  const assert = (condition: boolean, message: string) => {
      if (condition) {
          console.log(`✅ PASS: ${message}`);
          testsPassed++;
      } else {
          console.error(`❌ FAIL: ${message}`);
          testsFailed++;
      }
  };

  try {
      // TEST 1: Zod Validation
      const invalidExecution = ExecutionRequestSchema.safeParse({ decisionId: "not-a-uuid", baseVersion: -1 });
      assert(!invalidExecution.success, "Zod correctly rejects invalid UUID and negative version.");

      // TEST 2: Determinism (100 Runs)
      const engine = new SimulationEngine();
      let deterministic = true;
      const baseSim = engine.simulateScenario(store.getState(), { type: 'delay_cascade', params: { train: '22416', delayMinutes: 60 } }, 'balanced');
      
      for (let i = 0; i < 100; i++) {
          const sim = engine.simulateScenario(store.getState(), { type: 'delay_cascade', params: { train: '22416', delayMinutes: 60 } }, 'balanced');
          if (sim.totalDelayMinutes !== baseSim.totalDelayMinutes || sim.safetyScore !== baseSim.safetyScore) {
              deterministic = false;
              break;
          }
      }
      assert(deterministic, "100 simulation runs produced identical deterministic results.");

      // TEST 3: Hard Safety Constraints
      const unsafeSim = engine.simulateScenario(store.getState(), { type: 'festival_surge', params: { station: 'BSB' } }, 'min_delay');
      assert(unsafeSim.hardConstraintViolated === true, "Hard constraint correctly identifies unsafe strategy (Safety < 60).");

      // TEST 4: Consensus Discards Unsafe Strategies
      const consensus = new ConsensusEngine();
      const analysis = consensus.analyzeScenario(store.getState(), { type: 'festival_surge', params: { station: 'BSB' } });
      assert(analysis.simulations.every(s => !s.hardConstraintViolated), "Consensus Engine filtered out unsafe strategies before optimization.");

      // TEST 5: Graceful Degradation (Agent Failure)
      const degradedAnalysis = consensus.analyzeScenario(store.getState(), { type: 'festival_surge', params: { station: 'BSB', _forceAgentFailure: 'operations' } });
      assert(degradedAnalysis.systemStatus === 'DEGRADED' && degradedAnalysis.agentDebate.some(a => a.status === 'failed'), "System gracefully degraded despite Operations Agent failure.");

      // TEST 6: Execution Concurrency & Versioning
      const decisionId1 = "123e4567-e89b-12d3-a456-426614174000"; // Valid UUID
      const initialState = store.getState();
      const initialVersion = initialState.stateVersion;

      // Execute successfully
      store.updateState(baseSim.state, {
          decisionId: decisionId1,
          timestamp: Date.now(),
          previousStateVersion: 0, newStateVersion: 0, trigger: 'TEST',
          scenario: {}, winningStrategy: 'balanced', approver: 'AUTO', status: 'EXECUTED'
      });
      assert(store.getState().stateVersion === initialVersion + 1, "State version correctly incremented after execution.");

      // TEST 7: Idempotency (Duplicate execution)
      try {
          store.updateState(baseSim.state, {
              decisionId: decisionId1, timestamp: Date.now(), previousStateVersion: 0, newStateVersion: 0,
              trigger: 'TEST', scenario: {}, winningStrategy: 'balanced', approver: 'AUTO', status: 'EXECUTED'
          });
          assert(false, "Idempotency failed: duplicate execution allowed.");
      } catch (e: any) {
          assert(e.message === "ALREADY_EXECUTED", "Idempotency verified: duplicate execution blocked.");
      }

      // TEST 8: Rollback
      const revertAudit = store.revertState(decisionId1);
      assert(revertAudit.status === 'EXECUTED' && store.getState().stateVersion === initialVersion + 2, "Rollback executed, state version incremented correctly.");
      
      const log = store.getAuditLog();
      const originalDecision = log.find(a => a.decisionId === decisionId1);
      assert(originalDecision?.status === 'REVERTED', "Original audit log entry marked as REVERTED.");

  } catch (e) {
      console.error("Test Suite encountered unhandled exception:", e);
      testsFailed++;
  }

  console.log(`\n=== RESULTS: ${testsPassed} PASSED | ${testsFailed} FAILED ===`);
  if (testsFailed > 0) process.exit(1);
}

runHardeningTests();
