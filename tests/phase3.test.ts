import { DigitalTwinStore } from '../src/lib/state';
import { MockTelemetryProvider } from '../src/simulation/telemetry';
import { PrecogEngine } from '../src/lib/precog';
import { RailwayEventSchema } from '../src/lib/schemas';
import { randomUUID } from 'crypto';

async function runPhase3Tests() {
  console.log("=== RAILVERSE PHASE 3 VERIFICATION ===");
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
      // 1. Zod Validation
      const badEvent = RailwayEventSchema.safeParse({ id: "123", timestamp: "now", type: "bad_type" });
      assert(!badEvent.success, "Event Validation: Zod rejected invalid payload correctly.");

      // 2. Domain Validation
      try {
          store.processTelemetryEvent({ id: randomUUID(), timestamp: Date.now(), type: "train_delay", entityId: "22416", payload: { delay: -50 } });
          assert(false, "Event Validation: Failed to reject negative delay.");
      } catch (e: any) {
          assert(e.message.includes("DOMAIN_VALIDATION_FAILED"), "Event Validation: Domain rejected impossible delay.");
      }

      // 3. Duplicate Event Handling
      const dupId = randomUUID();
      const res1 = store.processTelemetryEvent({ id: dupId, timestamp: Date.now(), type: "train_delay", entityId: "22416", payload: { delay: 10 } });
      const res2 = store.processTelemetryEvent({ id: dupId, timestamp: Date.now(), type: "train_delay", entityId: "22416", payload: { delay: 10 } });
      assert(res1.status === 'PROCESSED_FORWARD' && res2.status === 'IGNORED_DUPLICATE', "Duplicate event safely ignored due to idempotency.");

      // 4. Out-of-Order / Temporal History
      const oldTime = Date.now() - 50000;
      const initialVersion = store.getState().stateVersion;
      const res3 = store.processTelemetryEvent({ id: randomUUID(), timestamp: oldTime, type: "train_delay", entityId: "22416", payload: { delay: 5 } });
      assert(res3.status === 'PROCESSED_LATE_HISTORY_ONLY', "Out-of-Order Event: Processed into history only.");
      assert(store.getState().stateVersion === initialVersion, "State-Version Invalidation: Late event did not increment current state version.");

      // 5. Telemetry Burst Handling (Performance / Stability)
      const mock = MockTelemetryProvider.getInstance();
      const burstStartVersion = store.getState().stateVersion;
      mock.fireBurst(50);
      assert(store.getState().stateVersion > burstStartVersion, "Telemetry Burst: Handled 50 events gracefully without crashing.");

      // 6. PRECOG V2 & Trend Calculation
      const precog = new PrecogEngine();
      store.processTelemetryEvent({ id: randomUUID(), timestamp: Date.now(), type: "train_delay", entityId: "22416", payload: { delay: 15 } });
      store.processTelemetryEvent({ id: randomUUID(), timestamp: Date.now()+1000, type: "train_delay", entityId: "22416", payload: { delay: 25 } });
      store.processTelemetryEvent({ id: randomUUID(), timestamp: Date.now()+2000, type: "train_delay", entityId: "22416", payload: { delay: 35 } });
      
      const predictions = precog.analyzeTemporalState(store.getState());
      assert(predictions.length > 0, "PRECOG V2: Detected trend and generated predictive cascade.");
      assert(predictions[0].probability > 60 && predictions[0].horizonMinutes > 0, "Multi-Horizon Forecasting: Output includes Probability and Temporal Horizon.");
      assert(predictions[0].contributingFactors.length > 0, "Explainable PRECOG: Output includes deterministic evidence (Why).");

  } catch (e) {
      console.error("Test Suite encountered unhandled exception:", e);
      testsFailed++;
  }

  console.log(`\n=== RESULTS: ${testsPassed} PASSED | ${testsFailed} FAILED ===`);
  if (testsFailed > 0) process.exit(1);
}

runPhase3Tests();
