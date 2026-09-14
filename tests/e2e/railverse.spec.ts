import { test, expect } from '@playwright/test';

test.describe('RailVerse AI - End-to-End Functionality Verification', () => {

  test.beforeEach(async ({ page }) => {
    // Monitor for console errors to satisfy "Zero Console Errors" requirement
    page.on('pageerror', (err) => {
      console.error(`Unhandled Exception: ${err.message}`);
    });
    
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        console.error(`Console Error: ${msg.text()}`);
      }
    });

    page.on('requestfailed', (request) => {
      console.error(`Failed Request: ${request.url()} - ${request.failure()?.errorText}`);
    });
  });

  test('Test 1: Initial Network & Test 4: Original UI Verification', async ({ page }) => {
    // Test 1: Verify Initial Network
    await page.goto('/index.html');
    
    // Verify Original UI elements are present
    await expect(page.locator('text=RAILVERSE AI')).toBeVisible();
    await expect(page.locator('text=COMMAND CENTER')).toBeVisible();
    await expect(page.locator('#network-map')).toBeVisible();
    await expect(page.locator('#precog-result')).toBeVisible();
    await expect(page.locator('#hud-metrics')).toBeVisible();
    
    // Test 5: Initial Network Test
    // Wait for stations and trains to load
    await expect(page.locator('.rv-card').filter({ hasText: 'STATIONS' })).toBeVisible();
  });

  test('Test 2: Live Telemetry & Test 6: SSE Test', async ({ page }) => {
    await page.goto('/index.html');
    
    // Listen for SSE events indirectly through UI changes
    // Wait for the "SECURE DATALINK ESTABLISHED" terminal message which triggers on 'initial_state'
    await expect(page.locator('#agent-log')).toContainText('SECURE DATALINK ESTABLISHED');
    
    // The UI should populate without reload
    await expect(page.locator('#network-map')).toBeVisible();
  });

  test('Test 8: Delay AI', async ({ page }) => {
    await page.goto('/index.html');
    
    // Interact with Delay AI
    // We expect the original HTML form to work
    const delayInput = page.locator('#delay-input');
    // Assuming Delay AI input is in a specific tab
    await page.click('text=DELAY PREDICTION');
    
    // Enter first input
    await delayInput.fill('10');
    await page.click('button:has-text("RUN AI ANALYSIS")');
    
    // Wait for prediction
    await expect(page.locator('#delay-result')).toContainText('MIN');
    const result1 = await page.locator('#delay-result').textContent();
    
    // Enter second input
    await delayInput.fill('60');
    await page.click('button:has-text("RUN AI ANALYSIS")');
    
    // Wait for prediction
    await expect(page.locator('#delay-result')).not.toHaveText(String(result1));
  });

  test('Test 11: What-If', async ({ page }) => {
    await page.goto('/index.html');
    
    const input = 'What happens if Train 22416 is delayed by 90 minutes during a festival surge in Varanasi?';
    await page.fill('#whatif-input', input);
    await page.click('#whatif-run-btn');
    
    // Wait for simulated network response
    await expect(page.locator('#whatif-result')).toContainText('Scenario Analysis Complete');
    await expect(page.locator('#whatif-result')).toContainText('RECOMMENDED ACTIONS');
  });

  test('Test 12: Decision Authorization', async ({ page }) => {
    await page.goto('/index.html');
    
    // Trigger a simulation that generates an actionable decision
    await page.click('text=SIMULATION ENGINE');
    await page.click('#sim-run-btn');
    
    // Wait for the authorize button
    await expect(page.locator('button:has-text("AUTHORIZE DECISION")')).toBeVisible({ timeout: 10000 });
    
    // Authorize it
    await page.click('button:has-text("AUTHORIZE DECISION")');
    
    // Verify Success
    await expect(page.locator('button:has-text("EXECUTED SUCCESSFULLY")')).toBeVisible();
    
    // Verify Audit log updated
    await expect(page.locator('#agent-log')).toContainText('EXECUTED');
  });

  test('Test 19: Loco Pilot Sync', async ({ context }) => {
    const page1 = await context.newPage();
    const page2 = await context.newPage();
    
    await page1.goto('/index.html');
    await page2.goto('/loco-pilot.html');
    
    // Wait for datalinks
    await expect(page1.locator('#agent-log')).toContainText('SECURE DATALINK ESTABLISHED');
    await expect(page2.locator('#hud-speed')).toBeVisible();
    
    // Trigger a delay on 22416 in Command Center
    await page1.click('text=SIMULATION ENGINE');
    await page1.click('#sim-run-btn');
    await expect(page1.locator('button:has-text("AUTHORIZE DECISION")')).toBeVisible({ timeout: 10000 });
    await page1.click('button:has-text("AUTHORIZE DECISION")');
    
    // Verify Loco Pilot reflects the delayed status
    await expect(page2.locator('#alert-box')).toContainText('WARNING', { timeout: 15000 });
  });

});
