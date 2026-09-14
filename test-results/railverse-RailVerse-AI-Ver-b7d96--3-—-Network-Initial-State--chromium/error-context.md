# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: railverse.spec.ts >> RailVerse AI Verification >> Test 3 — Network (Initial State)
- Location: tests\e2e\railverse.spec.ts:52:7

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: page.waitForResponse: Test timeout of 30000ms exceeded.
=========================== logs ===========================
waiting for response "/api/network"
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
        - generic [ref=e41]: 01:01:49
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
              - generic [ref=e62]: Predictive Input Console
              - generic [ref=e63]: "TERM_ID: 9482"
            - generic [ref=e64]:
              - generic [ref=e65]: "[SYS] AUTH CONFIRMED. CRIS MAINFRAME ONLINE."
              - generic [ref=e66]: "[SYS] ACTION REQUIRED: CLICK 'LIVE RAIL MAP' TAB TO ENGAGE SATELLITE LINK."
              - generic [ref=e67]: "[SYS] AWAITING SCENARIO PARAMETERS..."
            - generic [ref=e68]:
              - generic [ref=e69]:
                - generic [ref=e70]: ">"
                - textbox "ENTER QUERY..." [ref=e71]
                - button "Voice Command" [ref=e72] [cursor=pointer]
              - generic [ref=e76]:
                - button "STATUS TRN_1204" [ref=e77] [cursor=pointer]
                - button "CONGESTION IN NR" [ref=e78] [cursor=pointer]
                - button "WEATHER IMPACT" [ref=e79] [cursor=pointer]
          - generic [ref=e80]:
            - generic [ref=e81]:
              - generic [ref=e82]: GEO-FENCE COMMAND
              - generic [ref=e85]: DANGER ZONE ASSIGNMENT
            - generic [ref=e86]:
              - generic [ref=e87]:
                - generic [ref=e88]: ZONE IDENTIFIER
                - textbox "E.g., FLOOD RISK" [ref=e89]
              - generic [ref=e90]:
                - generic [ref=e91]:
                  - generic [ref=e92]: START NODE
                  - combobox [ref=e93]:
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
                - generic [ref=e94]:
                  - generic [ref=e95]: END NODE
                  - combobox [ref=e96]:
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
              - button "DEPLOY FENCE" [ref=e97] [cursor=pointer]
          - generic [ref=e98]:
            - generic [ref=e99]:
              - generic [ref=e100]: INTERVENTIONS
              - generic [ref=e101]: 42▲
            - generic [ref=e103]:
              - generic [ref=e104]: PAX. PROTECTED
              - generic [ref=e105]: 14.2K
          - generic [ref=e107]:
            - generic [ref=e108]:
              - generic [ref=e109]: NETWORK CONGESTION FORECAST
              - generic [ref=e112]:
                - generic [ref=e113]:
                  - generic [ref=e114]: NR
                  - generic [ref=e117]: 82%
                - generic [ref=e118]:
                  - generic [ref=e119]: WR
                  - generic [ref=e122]: 65%
                - generic [ref=e123]:
                  - generic [ref=e124]: CR
                  - generic [ref=e127]: 41%
                - generic [ref=e128]:
                  - generic [ref=e129]: SR
                  - generic [ref=e132]: 38%
                - generic [ref=e133]:
                  - generic [ref=e134]: ER
                  - generic [ref=e137]: 58%
            - generic [ref=e138]:
              - generic [ref=e139]: PLATFORM OCCUPANCY AI
              - generic [ref=e145]:
                - generic [ref=e146]:
                  - generic [ref=e147]: NDLS (DELHI)
                  - generic [ref=e148]: CRITICAL
                - generic [ref=e149]:
                  - generic [ref=e150]: CSMT (MUMBAI)
                  - generic [ref=e151]: HEAVY
                - generic [ref=e152]:
                  - generic [ref=e153]: HWH (HOWRAH)
                  - generic [ref=e154]: MODERATE
                - generic [ref=e155]:
                  - generic [ref=e156]: MAS (CHENNAI)
                  - generic [ref=e157]: MODERATE
        - generic [ref=e158]:
          - generic [ref=e159]:
            - generic [ref=e160]:
              - button "PENDING" [ref=e161] [cursor=pointer]
              - button "RESOLVED" [ref=e164] [cursor=pointer]
            - generic [ref=e168]:
              - combobox [ref=e169]:
                - option "ALL ZONES" [selected]
                - option "NR (NORTHERN)"
                - option "WR (WESTERN)"
                - option "CR (CENTRAL)"
                - option "SR (SOUTHERN)"
                - option "ER (EASTERN)"
              - generic [ref=e170]: 0 REQ
          - generic [ref=e171]: NO PENDING OVERRIDES. STANDING BY.
    - navigation [ref=e173]:
      - generic [ref=e174]:
        - generic [ref=e175]: "SEC: L5"
        - generic [ref=e176]: "NODE: DEL-CEN-01"
        - generic [ref=e177]: "UPLINK: ESTABLISHED"
      - generic [ref=e178]:
        - button "DECISION" [ref=e179] [cursor=pointer]
        - button "MAP" [ref=e183] [cursor=pointer]
        - button "DELAY_AI" [ref=e186] [cursor=pointer]
        - button "CROWD_AI" [ref=e190] [cursor=pointer]
        - button "AI_AGENTS" [ref=e196] [cursor=pointer]
        - button "SIMULATION" [ref=e200] [cursor=pointer]
        - button "WHAT_IF" [ref=e203] [cursor=pointer]
        - button "LIVE_INTEL" [ref=e207] [cursor=pointer]
        - button "ANALYTICS" [ref=e214] [cursor=pointer]
        - button "LOCO_PILOT" [ref=e218] [cursor=pointer]
      - generic [ref=e223]: AWAITING CMDS...
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
  49  |     await expect(page.locator('.rv-header-title')).toContainText('LOCO PILOT');
  50  |   });
  51  | 
  52  |   test('Test 3 — Network (Initial State)', async ({ page }) => {
  53  |     const [response] = await Promise.all([
> 54  |       page.waitForResponse('/api/network'),
      |            ^ Error: page.waitForResponse: Test timeout of 30000ms exceeded.
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
  150 |       page.waitForResponse('/api/simulate'),
  151 |       whatifBtn.click()
  152 |     ]);
  153 |     
  154 |     expect(response.status()).toBe(200);
```