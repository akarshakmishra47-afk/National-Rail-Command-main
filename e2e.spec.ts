import { test, expect } from '@playwright/test';

test.describe('RailVerse E2E Verification', () => {
  let consoleErrors = 0;
  let unhandledExceptions = 0;
  let failedRequests = 0;
  
  test.beforeEach(async ({ page }) => {
    page.on('console', msg => {
      if (msg.type() === 'error') {
        // Ignore expected Leaflet missing tile errors for offline maps
        if (!msg.text().includes('tile.openstreetmap.org')) {
          consoleErrors++;
        }
      }
    });
    page.on('pageerror', exception => {
      unhandledExceptions++;
    });
    page.on('requestfailed', request => {
      if (!request.url().includes('tile.openstreetmap.org')) {
        failedRequests++;
      }
    });
  });

  test('Complete End-to-End Flow', async ({ page }) => {
    // 1. Initial State & Map
    await page.goto('http://localhost:3000/');
    await expect(page.locator('#map')).toBeVisible();
    await expect(page.locator('.rv-card')).toHaveCountGreaterThan(0);
    
    // Wait for SSE connection and Initial Network Load
    await page.waitForTimeout(3000);
    await expect(page.locator('#net-status-text')).toContainText('LIVE');

    // 2. Delay AI
    const delayBtn = page.locator('#delay-run-btn');
    await expect(delayBtn).toBeVisible();
    await delayBtn.click();
    await page.waitForTimeout(1000);
    // Check if result changed (mock timeout replaced by real API)
    await expect(page.locator('#delay-result')).toContainText('SEVERITY');

    // 3. Crowd AI
    const crowdBtn = page.locator('#crowd-run-btn');
    await expect(crowdBtn).toBeVisible();
    await crowdBtn.click();
    await page.waitForTimeout(1500);
    await expect(page.locator('#crowd-result')).toContainText('RECOMMENDATION');

    // 4. Agents
    const agentBtn = page.locator('button', { hasText: 'RUN ALL AGENTS' });
    if (await agentBtn.isVisible()) {
        await agentBtn.click();
        await page.waitForTimeout(2000);
        await expect(page.locator('#ag-res-ops')).not.toBeEmpty();
    }

    // 5. Simulation
    const simBtn = page.locator('#sim-run-btn');
    await expect(simBtn).toBeVisible();
    await simBtn.click();
    await page.waitForTimeout(2000);
    await expect(page.locator('#sim-result')).toContainText('Platform Conflicts');

    // 6. Decision Generation (What-If)
    const whatifBtn = page.locator('#whatif-run-btn');
    if (await whatifBtn.isVisible()) {
        await whatifBtn.click();
        await page.waitForTimeout(3000);
    }
    
    // 7. Authorization
    const authBtn = page.locator('button', { hasText: 'AUTHORIZE' }).first();
    if (await authBtn.isVisible()) {
        await authBtn.click();
        await page.waitForTimeout(1000);
        await expect(authBtn.locator('..')).toContainText('AUTHORIZED');
    }

    // Check health metrics
    console.log(`Console Errors: ${consoleErrors}`);
    console.log(`Unhandled Exceptions: ${unhandledExceptions}`);
    console.log(`Failed Requests: ${failedRequests}`);
    
    expect(consoleErrors).toBe(0);
    expect(unhandledExceptions).toBe(0);
    expect(failedRequests).toBe(0);
  });
});
