# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: railverse.spec.ts >> RailVerse AI Verification >> Test 5 — Delay AI
- Location: tests\e2e\railverse.spec.ts:70:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator:  locator('#delay-run-btn')
Expected: visible
Received: hidden
Timeout:  5000ms

Call log:
  - Expect "toBeVisible" locator('#delay-run-btn') with timeout 5000ms
  - waiting for locator('#delay-run-btn')
    11 × locator resolved to <button class="rv-btn" id="delay-run-btn" onclick="runDelayPrediction()">…</button>
       - unexpected value "hidden"

```

```yaml
- img
- text: RESTRICTED ACCESS LEVEL 5 CLEARANCE REQUIRED OPERATOR ID
- textbox: ADMIN_CRIS_01
- text: AUTHORIZATION KEY
- textbox: "********"
- button "AUTHENTICATE"
- banner:
  - img "IR Logo"
  - heading "NATIONAL RAIL COMMAND | भारतीय रेल कमान" [level=1]
  - text: CRIS AUTONOMOUS OVERSIGHT MODULE // भारतीय रेल SYS.STATE NOMINAL AI.CORE ONLINE
  - button "AI CONFIGURATION"
  - text: 01:02:28 IST ZULU+0530
- text: "ACTIVE TRAINS: 14,281 NETWORK LOAD: 87% CRITICAL ALERTS: 02 >> IR_SYSTEM_INITIALIZED... VANDE BHARAT EXPRESS DEPARTED NDLS... FOG ALERT IN NORTHERN ZONE... ALL SECTORS OPERATIONAL... राष्ट्रीय रेल कमान... STANDING BY FOR COMMANDS..."
- main:
  - text: "Predictive Input Console TERM_ID: 9482 [SYS] AUTH CONFIRMED. CRIS MAINFRAME ONLINE. [SYS] ACTION REQUIRED: CLICK 'LIVE RAIL MAP' TAB TO ENGAGE SATELLITE LINK. [SYS] AWAITING SCENARIO PARAMETERS... >"
  - textbox "ENTER QUERY..."
  - button "Voice Command"
  - button "STATUS TRN_1204"
  - button "CONGESTION IN NR"
  - button "WEATHER IMPACT"
  - text: GEO-FENCE COMMAND DANGER ZONE ASSIGNMENT ZONE IDENTIFIER
  - textbox "E.g., FLOOD RISK"
  - text: START NODE
  - combobox:
    - option "Ahmedabad (ADI)" [selected]
    - option "Agra Cantt (AGC)"
    - option "Akola (AK)"
    - option "Asansol (ASN)"
    - option "Amritsar (ASR)"
    - option "Ayodhya (AY)"
    - option "BBS (BBS)"
    - option "Bhopal (BPL)"
    - option "Vadodara (BRC)"
    - option "Varanasi (BSB)"
    - option "Bhusaval (BSL)"
    - option "Bilaspur (BSP)"
    - option "Vijayawada (BZA)"
    - option "Coimbatore (CBE)"
    - option "Chandigarh (CDG)"
    - option "Kozhikode (CLT)"
    - option "Kanpur (CNB)"
    - option "Mumbai CST (CSMT)"
    - option "DBRG (DBRG)"
    - option "Dehradun (DDN)"
    - option "Dhanbad (DHN)"
    - option "Ernakulam (ERS)"
    - option "Itarsi (ET)"
    - option "Gaya (GAYA)"
    - option "GHY (GHY)"
    - option "Gorakhpur (GKP)"
    - option "Howrah (HWH)"
    - option "Indore (INDB)"
    - option "Jammu Tawi (JAT)"
    - option "Jabalpur (JBP)"
    - option "Jaipur (JP)"
    - option "Jodhpur (JU)"
    - option "Ludhiana (LDH)"
    - option "Lucknow (LKO)"
    - option "Chennai Central (MAS)"
    - option "Madurai (MDU)"
    - option "Malda Town (MLDT)"
    - option "Mumbai Central (MMCT)"
    - option "Mathura (MTJ)"
    - option "Mysuru (MYS)"
    - option "New Delhi (NDLS)"
    - option "Nagpur (NGP)"
    - option "NJP (NJP)"
    - option "Nashik (NK)"
    - option "Patna (PNBE)"
    - option "Prayagraj (PRYJ)"
    - option "Pune (PUNE)"
    - option "PURI (PURI)"
    - option "Raipur (R)"
    - option "Rajkot (RJT)"
    - option "RNC (RNC)"
    - option "Ratlam (RTM)"
    - option "Bengaluru (SBC)"
    - option "Secunderabad (SC)"
    - option "Surat (ST)"
    - option "Solapur (SUR)"
    - option "Tirupati (TPTY)"
    - option "Thiruvananthapuram (TVC)"
    - option "Hubballi (UBL)"
    - option "Udaipur (UDZ)"
    - option "Ujjain (UJN)"
    - option "Ambala (UMB)"
    - option "Jhansi (VGLJ)"
    - option "Visakhapatnam (VSKP)"
  - text: END NODE
  - combobox:
    - option "Ahmedabad (ADI)"
    - option "Agra Cantt (AGC)" [selected]
    - option "Akola (AK)"
    - option "Asansol (ASN)"
    - option "Amritsar (ASR)"
    - option "Ayodhya (AY)"
    - option "BBS (BBS)"
    - option "Bhopal (BPL)"
    - option "Vadodara (BRC)"
    - option "Varanasi (BSB)"
    - option "Bhusaval (BSL)"
    - option "Bilaspur (BSP)"
    - option "Vijayawada (BZA)"
    - option "Coimbatore (CBE)"
    - option "Chandigarh (CDG)"
    - option "Kozhikode (CLT)"
    - option "Kanpur (CNB)"
    - option "Mumbai CST (CSMT)"
    - option "DBRG (DBRG)"
    - option "Dehradun (DDN)"
    - option "Dhanbad (DHN)"
    - option "Ernakulam (ERS)"
    - option "Itarsi (ET)"
    - option "Gaya (GAYA)"
    - option "GHY (GHY)"
    - option "Gorakhpur (GKP)"
    - option "Howrah (HWH)"
    - option "Indore (INDB)"
    - option "Jammu Tawi (JAT)"
    - option "Jabalpur (JBP)"
    - option "Jaipur (JP)"
    - option "Jodhpur (JU)"
    - option "Ludhiana (LDH)"
    - option "Lucknow (LKO)"
    - option "Chennai Central (MAS)"
    - option "Madurai (MDU)"
    - option "Malda Town (MLDT)"
    - option "Mumbai Central (MMCT)"
    - option "Mathura (MTJ)"
    - option "Mysuru (MYS)"
    - option "New Delhi (NDLS)"
    - option "Nagpur (NGP)"
    - option "NJP (NJP)"
    - option "Nashik (NK)"
    - option "Patna (PNBE)"
    - option "Prayagraj (PRYJ)"
    - option "Pune (PUNE)"
    - option "PURI (PURI)"
    - option "Raipur (R)"
    - option "Rajkot (RJT)"
    - option "RNC (RNC)"
    - option "Ratlam (RTM)"
    - option "Bengaluru (SBC)"
    - option "Secunderabad (SC)"
    - option "Surat (ST)"
    - option "Solapur (SUR)"
    - option "Tirupati (TPTY)"
    - option "Thiruvananthapuram (TVC)"
    - option "Hubballi (UBL)"
    - option "Udaipur (UDZ)"
    - option "Ujjain (UJN)"
    - option "Ambala (UMB)"
    - option "Jhansi (VGLJ)"
    - option "Visakhapatnam (VSKP)"
  - button "DEPLOY FENCE"
  - text: INTERVENTIONS 42▲ PAX. PROTECTED 14.2K NETWORK CONGESTION FORECAST NR 82% WR 65% CR 41% SR 38% ER 58% PLATFORM OCCUPANCY AI NDLS (DELHI) CRITICAL CSMT (MUMBAI) HEAVY HWH (HOWRAH) MODERATE MAS (CHENNAI) MODERATE
  - button "PENDING"
  - button "RESOLVED"
  - combobox:
    - option "ALL ZONES" [selected]
    - option "NR (NORTHERN)"
    - option "WR (WESTERN)"
    - option "CR (CENTRAL)"
    - option "SR (SOUTHERN)"
    - option "ER (EASTERN)"
  - text: 0 REQ NO PENDING OVERRIDES. STANDING BY.
- navigation:
  - text: "SEC: L5 NODE: DEL-CEN-01 UPLINK: ESTABLISHED"
  - button "DECISION"
  - button "MAP"
  - button "DELAY_AI"
  - button "CROWD_AI"
  - button "AI_AGENTS"
  - button "SIMULATION"
  - button "WHAT_IF"
  - button "LIVE_INTEL"
  - button "ANALYTICS"
  - button "LOCO_PILOT"
  - text: AWAITING CMDS...
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
> 74  |     await expect(delayBtn).toBeVisible();
      |                            ^ Error: expect(locator).toBeVisible() failed
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
  173 |       commandPage.waitForResponse('/api/decisions/execute'),
  174 |       authBtn.click()
```