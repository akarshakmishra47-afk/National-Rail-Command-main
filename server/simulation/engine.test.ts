import { SimulationEngine } from './engine';
import { DigitalTwinStore } from '../lib/state';

function runTests() {
  console.log("Running Simulation Engine Determinism Tests...");
  
  const engine = new SimulationEngine();
  const store = DigitalTwinStore.getInstance();
  const initialState = store.getState();

  const scenario: any = {
      type: 'delay_cascade',
      params: { train: '22416', delayMinutes: 60 }
  };

  // Test 1: Simulating 'balanced' strategy should always produce the same result
  const sim1 = engine.simulateScenario(initialState, scenario, 'balanced');
  const sim2 = engine.simulateScenario(initialState, scenario, 'balanced');

  if (sim1.totalDelayMinutes !== sim2.totalDelayMinutes || sim1.passengersImpacted !== sim2.passengersImpacted) {
      console.error("❌ Determinism Test Failed: Repeated simulations produced different results.");
      process.exit(1);
  } else {
      console.log("✅ Determinism Test Passed: Simulation is reproducible.");
  }

  // Test 2: 'max_safety' strategy should increase delay but improve safety
  const simSafety = engine.simulateScenario(initialState, scenario, 'max_safety');
  if (simSafety.safetyScore >= sim1.safetyScore && simSafety.totalDelayMinutes > sim1.totalDelayMinutes) {
      console.log("✅ Strategy Test Passed: 'max_safety' prioritizes safety over delay.");
  } else {
      console.error("❌ Strategy Test Failed.");
      process.exit(1);
  }

  console.log("🎉 All Tests Passed.");
}

runTests();
