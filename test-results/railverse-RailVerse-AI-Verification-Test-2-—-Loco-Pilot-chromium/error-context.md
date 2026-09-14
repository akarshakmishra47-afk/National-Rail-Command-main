# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: railverse.spec.ts >> RailVerse AI Verification >> Test 2 — Loco Pilot
- Location: tests\e2e\railverse.spec.ts:47:7

# Error details

```
Error: expect(locator).toContainText(expected) failed

Locator: locator('.rv-header-title')
Expected substring: "LOCO PILOT"
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toContainText" locator('.rv-header-title') with timeout 5000ms
  - waiting for locator('.rv-header-title')

```

```yaml
- banner:
  - img
  - text: LOCO PILOT — LIVE OPERATIONAL PANEL TRAIN NO.
  - textbox: "22504"
  - button "TRACK TRAIN"
  - text: SIMULATION MODE TIME 01:01:09 DATA SIMULATED 0.0s ago
  - link "◄ COMMAND CENTER":
    - /url: index.html
- text: ADVISORY — ALL OPERATIONAL RECOMMENDATIONS REQUIRE PILOT / AUTHORISED RAILWAY PROCEDURE — THIS SYSTEM DOES NOT CONTROL THE LOCOMOTIVE
- main:
  - text: CURRENT SPEED SIMULATED 110 km/h PERMITTED 120 TARGET 120 SPEED DIFF -10 km/h ACCEL +0.04 m/s² BRAKE RELEASED THROTTLE NOTCH 4 ROUTE INFORMATION CURRENT KHARAGPUR JN NEXT BALASORE DISTANCE 63.9 KM ETA 01:36 SIGNAL ● GREEN DIST TO SIG 3.3 KM WEATHER SIMULATED CONDITION PARTLY CLOUDY VISIBILITY 2400 m RAINFALL NONE PILOT ROUTE VIEW
  - checkbox "FOLLOW TRAIN" [checked]
  - text: FOLLOW TRAIN LAT 22.0545 LNG 87.1875 ZOOM 10
  - img
  - button
  - tooltip "TRN 22504 VIVEK EXPRESS 110 km/h"
  - button "Zoom in"
  - button "Zoom out"
  - text: ACTIVE RISKS 0 ✓ NO ACTIVE RISKS SYSTEM MONITORING NEXT 15 MINUTES — UPCOMING EVENTS ROUTE DATA 01:36 ■ STATION BALASORE 63.9 km ahead · ETA 35m 01:41 ▬ BRIDGE SUBARNAREKHA RIVER BRIDGE 72.9 km ahead · ETA 40m OPERATIONS COLLABORATION SYSTEM 01:01:02 Simulation scenario 1 initiated. STATUS ACTIVE SYSTEM 01:01:02 All systems nominal. No active risks. STATUS NORMAL LIVE CHANGES ↑ SPEED → 110 km/h → VISIBILITY 2400 m → SIGNAL UNCHANGED → TRACK CLEAR SYSTEM HEALTH GPS ONLINE TELEMETRY ONLINE SIGNAL DATA ONLINE TRACK DATA ONLINE WEATHER ONLINE CONTROL LINK ONLINE RISK ENGINE ONLINE EVENT TIMELINE 01:01:02 Departed BHUBANESWAR — nominal operations 01:01:02 Scenario 1 started NEARBY TRAFFIC TRN 12301 AHEAD 12.4 km 118 km/h TRN 15003 BEHIND 7.8 km 94 km/h
- contentinfo:
  - text: "SCENARIO:"
  - button "① NORMAL"
  - button "② SPEED RESTRICT"
  - button "③ WEATHER"
  - button "④ TRACK HAZARD"
  - button "⑤ FAILED RESPONSE"
  - button "RESET"
  - button "SIMULATE FAILURE"
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | 
  3   | let consoleErrors = 0;
  4   | let unhandledExceptions = 0;
  5   | let failedRequests = 0;
  6   | 
  7   | test.beforeEach(async ({ page }) => {
  8   |   consoleErrors = 0;
  9   |   unhandledExceptions = 0;
  10  |   failedRequests = 0;
  11  |   
  12  |   page.on('console', msg => {
  13  |     if (msg.type() === 'error') {
  14  |       if (!msg.text().includes('tile.openstreetmap.org') && !msg.text().includes('favicon.ico')) {
  15  |         console.log('BROWSER CONSOLE ERROR:', msg.text());
  16  |         consoleErrors++;
  17  |       }
  18  |     }
  19  |   });
  20  |   
  21  |   page.on('pageerror', exception => {
  22  |     unhandledExceptions++;
  23  |   });
  24  |   
  25  |   page.on('requestfailed', request => {
  26  |     if (!request.url().includes('tile.openstreetmap.org') && !request.url().includes('favicon.ico') && !request.url().includes('wikimedia.org')) {
  27  |       console.log('BROWSER NETWORK ERROR:', request.url(), request.failure()?.errorText);
  28  |       failedRequests++;
  29  |     }
  30  |   });
  31  | });
  32  | 
  33  | test.afterEach(async () => {
  34  |   expect(consoleErrors).toBe(0);
  35  |   expect(unhandledExceptions).toBe(0);
  36  |   expect(failedRequests).toBe(0);
  37  | });
  38  | 
  39  | test.describe('RailVerse AI Verification', () => {
  40  |   
  41  |   test('Test 1 — Original UI', async ({ page }) => {
  42  |     await page.goto('/index.html');
  43  |     await expect(page.locator('#map')).toBeVisible();
  44  |     await expect(page.locator('.rv-header-title')).toContainText('RAILVERSE');
  45  |   });
  46  | 
  47  |   test('Test 2 — Loco Pilot', async ({ page }) => {
  48  |     await page.goto('/loco-pilot.html');
> 49  |     await expect(page.locator('.rv-header-title')).toContainText('LOCO PILOT');
      |                                                    ^ Error: expect(locator).toContainText(expected) failed
  50  |   });
  51  | 
  52  |   test('Test 3 — Network (Initial State)', async ({ page }) => {
  53  |     const [response] = await Promise.all([
  54  |       page.waitForResponse('/api/network'),
  55  |       page.goto('/index.html')
  56  |     ]);
  57  |     expect(response.status()).toBe(200);
  58  |     const data = await response.json();
  59  |     expect(data.trains).toBeDefined();
  60  |     expect(data.stations).toBeDefined();
  61  |   });
  62  | 
  63  |   test('Test 4 — SSE Connectivity', async ({ page }) => {
  64  |     await page.goto('/index.html');
  65  |     
  66  |     // Check if the SSE connection establishes and updates the UI
  67  |     await expect(page.locator('#net-status-text')).toContainText('LIVE', { timeout: 10000 });
  68  |   });
  69  | 
  70  |   test('Test 5 — Delay AI', async ({ page }) => {
  71  |     await page.goto('/index.html');
  72  |     
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
```