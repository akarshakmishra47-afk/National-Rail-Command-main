# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: railverse.spec.ts >> RailVerse AI Verification >> Test 6 — Crowd AI
- Location: tests\e2e\railverse.spec.ts:85:7

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: page.waitForResponse: Test timeout of 30000ms exceeded.
=========================== logs ===========================
waiting for response "/api/predict/crowd"
============================================================
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e6]:
    - generic [ref=e10]:
      - generic [ref=e11]: RESTRICTED ACCESS
      - generic [ref=e12]: LEVEL 5 CLEARANCE REQUIRED
    - generic [ref=e13]:
      - generic [ref=e14]:
        - generic [ref=e15]: OPERATOR ID
        - textbox [ref=e16]: ADMIN_CRIS_01
      - generic [ref=e17]:
        - generic [ref=e18]: AUTHORIZATION KEY
        - textbox [ref=e19]: "********"
    - button "AUTHENTICATE" [ref=e20] [cursor=pointer]
  - banner [ref=e21]:
    - generic [ref=e22]:
      - img "IR Logo" [ref=e23]
      - generic [ref=e24]:
        - heading "NATIONAL RAIL COMMAND | भारतीय रेल कमान" [level=1] [ref=e25]
        - generic [ref=e26]: CRIS AUTONOMOUS OVERSIGHT MODULE // भारतीय रेल
    - generic [ref=e27]:
      - generic [ref=e28]:
        - generic [ref=e29]: SYS.STATE
        - generic [ref=e30]: NOMINAL
      - generic [ref=e32]:
        - generic [ref=e33]: AI.CORE
        - generic [ref=e34]: ONLINE
      - button "AI CONFIGURATION" [ref=e36] [cursor=pointer]
      - generic [ref=e40]:
        - generic [ref=e41]: 01:03:07
        - generic [ref=e42]: IST ZULU+0530
  - generic [ref=e43]:
    - generic [ref=e44]:
      - generic [ref=e45]:
        - generic [ref=e46]: "ACTIVE TRAINS:"
        - generic [ref=e47]: 14,281
      - generic [ref=e48]:
        - generic [ref=e49]: "NETWORK LOAD:"
        - generic [ref=e50]: 87%
      - generic [ref=e51]:
        - generic [ref=e52]: "CRITICAL ALERTS:"
        - generic [ref=e53]: "02"
      - generic [ref=e54]: ">> IR_SYSTEM_INITIALIZED... VANDE BHARAT EXPRESS DEPARTED NDLS... FOG ALERT IN NORTHERN ZONE... ALL SECTORS OPERATIONAL... राष्ट्रीय रेल कमान... STANDING BY FOR COMMANDS..."
    - main [ref=e56]:
      - generic [ref=e58]:
        - generic [ref=e59]:
          - generic [ref=e60]:
            - generic [ref=e61]:
              - generic [ref=e62]: CROWD INTELLIGENCE ENGINE
              - generic [ref=e67]: LSTM · PROPHET · RANDOM FOREST
            - generic [ref=e68]:
              - generic [ref=e69]:
                - generic [ref=e70]: STATION
                - combobox [ref=e71]:
                  - option "New Delhi (NDLS)" [selected]
                  - option "Jaipur (JP)"
                  - option "Agra Cantt (AGC)"
                  - option "Kanpur (CNB)"
                  - option "Lucknow (LKO)"
                  - option "Prayagraj (PRYJ)"
                  - option "Varanasi (BSB)"
                  - option "Patna (PNBE)"
                  - option "Kolkata (Howrah) (HWH)"
                  - option "Bhopal (BPL)"
                  - option "Nagpur (NGP)"
                  - option "Mumbai CST (CSTM)"
                  - option "Hyderabad (SC)"
                  - option "Chennai Central (MAS)"
                  - option "Bengaluru (SBC)"
              - generic [ref=e72]:
                - generic [ref=e73]:
                  - generic [ref=e74]: HOUR OF DAY
                  - generic [ref=e75]: 18:00
                - slider [ref=e76]: "18"
              - generic [ref=e77]:
                - button "FESTIVAL" [ref=e78] [cursor=pointer]
                - button "WEEKEND" [ref=e85] [cursor=pointer]
              - button "PREDICT CROWD" [ref=e88] [cursor=pointer]
              - button "SYNC LIVE WEATHER" [ref=e92] [cursor=pointer]
          - generic [ref=e96]:
            - generic [ref=e97]: CURRENT STATION STATUS
            - generic [ref=e98]: New Delhi
            - generic [ref=e99]: 78%
            - generic [ref=e102]: 12 trains arriving · 16 platforms
        - generic [ref=e103]:
          - generic [ref=e104]:
            - generic [ref=e105]: 24-HOUR CROWD FORECAST
            - generic [ref=e155]:
              - generic [ref=e156]: 0h
              - generic [ref=e157]: 6h
              - generic [ref=e158]: 12h
              - generic [ref=e159]: 18h
              - generic [ref=e160]: 23h
          - generic [ref=e161]: RUN PREDICTION TO SEE CROWD INTELLIGENCE
    - navigation [ref=e168]:
      - generic [ref=e169]:
        - generic [ref=e170]: "SEC: L5"
        - generic [ref=e171]: "NODE: DEL-CEN-01"
        - generic [ref=e172]: "UPLINK: ESTABLISHED"
      - generic [ref=e173]:
        - button "DECISION" [ref=e174] [cursor=pointer]
        - button "MAP" [ref=e178] [cursor=pointer]
        - button "DELAY_AI" [ref=e181] [cursor=pointer]
        - button "CROWD_AI" [ref=e185] [cursor=pointer]
        - button "AI_AGENTS" [ref=e191] [cursor=pointer]
        - button "SIMULATION" [ref=e195] [cursor=pointer]
        - button "WHAT_IF" [ref=e198] [cursor=pointer]
        - button "LIVE_INTEL" [ref=e202] [cursor=pointer]
        - button "ANALYTICS" [ref=e209] [cursor=pointer]
        - button "LOCO_PILOT" [ref=e213] [cursor=pointer]
      - generic [ref=e218]: AWAITING CMDS...
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
  43  |     await expect(page.locator('#live-map')).toBeVisible();
  44  |     await expect(page.locator('.rv-header-title')).toContainText('RAILVERSE');
  45  |   });
  46  | 
  47  |   test('Test 2 — Loco Pilot', async ({ page }) => {
  48  |     await page.goto('/loco-pilot.html');
  49  |     await expect(page.locator('.rv-header-title')).toContainText('LOCO PILOT');
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
> 95  |       page.waitForResponse('/api/predict/crowd'),
      |            ^ Error: page.waitForResponse: Test timeout of 30000ms exceeded.
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
  173 |       commandPage.waitForResponse('/api/decisions/execute'),
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