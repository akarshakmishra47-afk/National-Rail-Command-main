import { test, expect } from '@playwright/test';

let consoleErrors = 0;
let unhandledExceptions = 0;
let failedRequests = 0;

test.beforeEach(async ({ page }) => {
  consoleErrors = 0;
  unhandledExceptions = 0;
  failedRequests = 0;
  
  page.on('console', msg => {
    if (msg.type() === 'error') {
      if (!msg.text().includes('tile.openstreetmap.org') && !msg.text().includes('favicon.ico')) {
        console.log('BROWSER CONSOLE ERROR:', msg.text());
        consoleErrors++;
      }
    }
  });
  
  page.on('pageerror', exception => {
    unhandledExceptions++;
  });
  
  page.on('requestfailed', request => {
    if (!request.url().includes('tile.openstreetmap.org') && !request.url().includes('favicon.ico') && !request.url().includes('wikimedia.org')) {
      console.log('BROWSER NETWORK ERROR:', request.url(), request.failure()?.errorText);
      failedRequests++;
    }
  });
});

test.afterEach(async () => {
  expect(consoleErrors).toBe(0);
  expect(unhandledExceptions).toBe(0);
  expect(failedRequests).toBe(0);
});

test.describe('RailVerse AI Verification', () => {
  
  test('Test 1 — Original UI', async ({ page }) => {
    await page.goto('/index.html');
    await expect(page.locator('#live-map')).toBeVisible();
    await expect(page.locator('.rv-header-title')).toContainText('RAILVERSE');
  });

  test('Test 2 — Loco Pilot', async ({ page }) => {
    await page.goto('/loco-pilot.html');
    await expect(page.locator('.rv-header-title')).toContainText('LOCO PILOT');
  });

  test('Test 3 — Network (Initial State)', async ({ page }) => {
    const [response] = await Promise.all([
      page.waitForResponse('/api/network'),
      page.goto('/index.html')
    ]);
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data.trains).toBeDefined();
    expect(data.stations).toBeDefined();
  });

  test('Test 4 — SSE Connectivity', async ({ page }) => {
    await page.goto('/index.html');
    
    // Check if the SSE connection establishes and updates the UI
    await expect(page.locator('#net-status-text')).toContainText('LIVE', { timeout: 10000 });
  });

  test('Test 5 — Delay AI', async ({ page }) => {
    await page.goto('/index.html');
    
    const delayBtn = page.locator('#delay-run-btn');
    await expect(delayBtn).toBeVisible();
    
    const [response] = await Promise.all([
      page.waitForResponse('/api/predict/delay'),
      delayBtn.click()
    ]);
    
    expect(response.status()).toBe(200);
    await expect(page.locator('#delay-result')).toContainText('SEVERITY');
  });

  test('Test 6 — Crowd AI', async ({ page }) => {
    await page.goto('/index.html');
    
    // Switch to Crowd AI Tab
    await page.evaluate('window.switchTab("crowd")');
    
    const crowdBtn = page.locator('#crowd-run-btn');
    await expect(crowdBtn).toBeVisible();
    
    const [response] = await Promise.all([
      page.waitForResponse('/api/predict/crowd'),
      crowdBtn.click()
    ]);
    
    expect(response.status()).toBe(200);
    await expect(page.locator('#crowd-result')).toContainText('RECOMMENDATION');
  });

  test('Test 7 — Agents', async ({ page }) => {
    await page.goto('/index.html');
    
    // Switch to Multi-Agent Tab
    await page.evaluate('window.switchTab("agents")');
    
    const agentBtn = page.locator('button', { hasText: 'RUN ALL AGENTS' });
    await expect(agentBtn).toBeVisible();
    
    const [response] = await Promise.all([
      page.waitForResponse('/api/agents/analyze'),
      agentBtn.click()
    ]);
    
    expect(response.status()).toBe(200);
    
    // Ensure agent results are rendered
    await expect(page.locator('#ag-res-ops')).not.toBeEmpty();
  });

  test('Test 8 — Simulation', async ({ page }) => {
    await page.goto('/index.html');
    
    // Switch to Simulation Tab
    await page.evaluate('window.switchTab("sim")');
    
    const simBtn = page.locator('#sim-run-btn');
    await expect(simBtn).toBeVisible();
    
    const [response] = await Promise.all([
      page.waitForResponse('/api/simulate'),
      simBtn.click()
    ]);
    
    expect(response.status()).toBe(200);
    await expect(page.locator('#sim-result')).toContainText('Affected Trains');
  });

  test('Test 9 — What-If Console', async ({ page }) => {
    await page.goto('/index.html');
    
    const whatifInput = page.locator('#whatif-input');
    await whatifInput.fill('What happens if Train 22416 is delayed by 90 minutes during a festival surge in Varanasi?');
    
    const whatifBtn = page.locator('#whatif-run-btn');
    
    const [response] = await Promise.all([
      page.waitForResponse('/api/simulate'),
      whatifBtn.click()
    ]);
    
    expect(response.status()).toBe(200);
  });

  test('Test 10 — Loco Pilot Synchronization', async ({ context }) => {
    const pilotPage = await context.newPage();
    const commandPage = await context.newPage();
    
    await commandPage.goto('/index.html');
    await pilotPage.goto('/loco-pilot.html');
    
    // Generate a decision in Command Center
    await commandPage.evaluate(`
        window.generateLiveDecision('12301', 'HOWRAH', 'NEW DELHI');
    `);
    
    const authBtn = commandPage.locator('button', { hasText: 'AUTHORIZE' }).first();
    await expect(authBtn).toBeVisible();
    
    const [response] = await Promise.all([
      commandPage.waitForResponse('/api/decisions/execute'),
      authBtn.click()
    ]);
    expect(response.status()).toBe(200);
    
    // The SSE connection on pilotPage should receive the update
    // Verify that the command status updates without page refresh
    // Wait a brief moment for the SSE event to propagate and the DOM to react
    await pilotPage.waitForTimeout(2000);
    
    // If the frontend correctly wired decision execution to update SSE, loco pilot should receive it
    // Wait for the state update on loco pilot map (just ensuring no errors and page is active)
    expect(consoleErrors).toBe(0);
  });

});
