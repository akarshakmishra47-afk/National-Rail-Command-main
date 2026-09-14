# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: railverse.spec.ts >> RailVerse AI Verification >> Test 10 — Loco Pilot Synchronization
- Location: tests\e2e\railverse.spec.ts:157:7

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: page.waitForResponse: Test timeout of 30000ms exceeded.
=========================== logs ===========================
waiting for response "/api/decisions/execute"
============================================================
```

# Test source

```ts
  73  |     const delayBtn = page.locator('#delay-run-btn');
  74  |     await expect(delayBtn).toBeVisible();
  75  |     
  76  |     const [response] = await Promise.all([
  77  |       page.waitForResponse('/api/predict/delay'),
  78  |       delayBtn.click()
  79  |     ]);
  80  |     
  81  |     expect(response.status()).toBe(200);
  82  |     await expect(page.locator('#delay-result')).toContainText('SEVERITY');
  83  |   });
  84  | 
  85  |   test('Test 6 — Crowd AI', async ({ page }) => {
  86  |     await page.goto('/index.html');
  87  |     
  88  |     // Switch to Crowd AI Tab
  89  |     await page.evaluate('window.switchTab("crowd")');
  90  |     
  91  |     const crowdBtn = page.locator('#crowd-run-btn');
  92  |     await expect(crowdBtn).toBeVisible();
  93  |     
  94  |     const [response] = await Promise.all([
  95  |       page.waitForResponse('/api/predict/crowd'),
  96  |       crowdBtn.click()
  97  |     ]);
  98  |     
  99  |     expect(response.status()).toBe(200);
  100 |     await expect(page.locator('#crowd-result')).toContainText('RECOMMENDATION');
  101 |   });
  102 | 
  103 |   test('Test 7 — Agents', async ({ page }) => {
  104 |     await page.goto('/index.html');
  105 |     
  106 |     // Switch to Multi-Agent Tab
  107 |     await page.evaluate('window.switchTab("agents")');
  108 |     
  109 |     const agentBtn = page.locator('button', { hasText: 'RUN ALL AGENTS' });
  110 |     await expect(agentBtn).toBeVisible();
  111 |     
  112 |     const [response] = await Promise.all([
  113 |       page.waitForResponse('/api/agents/analyze'),
  114 |       agentBtn.click()
  115 |     ]);
  116 |     
  117 |     expect(response.status()).toBe(200);
  118 |     
  119 |     // Ensure agent results are rendered
  120 |     await expect(page.locator('#ag-res-ops')).not.toBeEmpty();
  121 |   });
  122 | 
  123 |   test('Test 8 — Simulation', async ({ page }) => {
  124 |     await page.goto('/index.html');
  125 |     
  126 |     // Switch to Simulation Tab
  127 |     await page.evaluate('window.switchTab("sim")');
  128 |     
  129 |     const simBtn = page.locator('#sim-run-btn');
  130 |     await expect(simBtn).toBeVisible();
  131 |     
  132 |     const [response] = await Promise.all([
  133 |       page.waitForResponse('/api/simulate'),
  134 |       simBtn.click()
  135 |     ]);
  136 |     
  137 |     expect(response.status()).toBe(200);
  138 |     await expect(page.locator('#sim-result')).toContainText('Affected Trains');
  139 |   });
  140 | 
  141 |   test('Test 9 — What-If Console', async ({ page }) => {
  142 |     await page.goto('/index.html');
  143 |     
  144 |     const whatifInput = page.locator('#whatif-input');
  145 |     await whatifInput.fill('What happens if Train 22416 is delayed by 90 minutes during a festival surge in Varanasi?');
  146 |     
  147 |     const whatifBtn = page.locator('#whatif-run-btn');
  148 |     
  149 |     const [response] = await Promise.all([
  150 |       page.waitForResponse('/api/simulate'),
  151 |       whatifBtn.click()
  152 |     ]);
  153 |     
  154 |     expect(response.status()).toBe(200);
  155 |   });
  156 | 
  157 |   test('Test 10 — Loco Pilot Synchronization', async ({ context }) => {
  158 |     const pilotPage = await context.newPage();
  159 |     const commandPage = await context.newPage();
  160 |     
  161 |     await commandPage.goto('/index.html');
  162 |     await pilotPage.goto('/loco-pilot.html');
  163 |     
  164 |     // Generate a decision in Command Center
  165 |     await commandPage.evaluate(`
  166 |         window.generateLiveDecision('12301', 'HOWRAH', 'NEW DELHI');
  167 |     `);
  168 |     
  169 |     const authBtn = commandPage.locator('button', { hasText: 'AUTHORIZE' }).first();
  170 |     await expect(authBtn).toBeVisible();
  171 |     
  172 |     const [response] = await Promise.all([
> 173 |       commandPage.waitForResponse('/api/decisions/execute'),
      |                   ^ Error: page.waitForResponse: Test timeout of 30000ms exceeded.
  174 |       authBtn.click()
  175 |     ]);
  176 |     expect(response.status()).toBe(200);
  177 |     
  178 |     // The SSE connection on pilotPage should receive the update
  179 |     // Verify that the command status updates without page refresh
  180 |     // Wait a brief moment for the SSE event to propagate and the DOM to react
  181 |     await pilotPage.waitForTimeout(2000);
  182 |     
  183 |     // If the frontend correctly wired decision execution to update SSE, loco pilot should receive it
  184 |     // Wait for the state update on loco pilot map (just ensuring no errors and page is active)
  185 |     expect(consoleErrors).toBe(0);
  186 |   });
  187 | 
  188 | });
  189 | 
```