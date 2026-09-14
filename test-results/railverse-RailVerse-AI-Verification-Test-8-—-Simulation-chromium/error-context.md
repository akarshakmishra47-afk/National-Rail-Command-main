# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: railverse.spec.ts >> RailVerse AI Verification >> Test 8 — Simulation
- Location: tests\e2e\railverse.spec.ts:123:7

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: page.waitForResponse: Test timeout of 30000ms exceeded.
=========================== logs ===========================
waiting for response "/api/simulate"
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
        - generic [ref=e41]: 01:04:08
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
              - generic [ref=e62]: SIMULATION ENGINE
              - generic [ref=e65]: SELECT AND CONFIGURE A SCENARIO
            - generic [ref=e66]:
              - button "Train Delay Cascade How one delay propagates across the entire network" [ref=e67] [cursor=pointer]:
                - generic [ref=e72]:
                  - generic [ref=e73]: Train Delay Cascade
                  - generic [ref=e74]: How one delay propagates across the entire network
              - button "Festival Crowd Surge Model crowd dynamics during major Indian festivals" [ref=e75] [cursor=pointer]:
                - generic [ref=e83]:
                  - generic [ref=e84]: Festival Crowd Surge
                  - generic [ref=e85]: Model crowd dynamics during major Indian festivals
              - button "Track Blockage Analyze rerouting when a major route is blocked" [ref=e86] [cursor=pointer]:
                - generic [ref=e87]:
                  - generic [ref=e88]: Track Blockage
                  - generic [ref=e89]: Analyze rerouting when a major route is blocked
          - generic [ref=e90]:
            - generic [ref=e91]: PARAMETERS
            - generic [ref=e92]:
              - generic [ref=e93]:
                - generic [ref=e94]: TRAIN
                - combobox [ref=e95]:
                  - option "12301 — Howrah Rajdhani" [selected]
                  - option "22416 — Mumbai Rajdhani"
                  - option "12239 — Chennai Duronto"
                  - option "12628 — Karnataka Express"
                  - option "14205 — Lucknow Mail"
                  - option "11062 — Pawan Express"
                  - option "12721 — Dakshin Express"
                  - option "15003 — Chauri Chaura Exp"
              - generic [ref=e96]:
                - generic [ref=e97]:
                  - generic [ref=e98]: DELAY DURATION
                  - generic [ref=e99]: 60 min
                - slider [ref=e100]: "60"
          - button "RUN SIMULATION" [ref=e101] [cursor=pointer]
        - generic [ref=e107]:
          - generic [ref=e112]: Train Delay Cascade
          - generic [ref=e113]: How one delay propagates across the entire network
    - navigation [ref=e114]:
      - generic [ref=e115]:
        - generic [ref=e116]: "SEC: L5"
        - generic [ref=e117]: "NODE: DEL-CEN-01"
        - generic [ref=e118]: "UPLINK: ESTABLISHED"
      - generic [ref=e119]:
        - button "DECISION" [ref=e120] [cursor=pointer]
        - button "MAP" [ref=e124] [cursor=pointer]
        - button "DELAY_AI" [ref=e127] [cursor=pointer]
        - button "CROWD_AI" [ref=e131] [cursor=pointer]
        - button "AI_AGENTS" [ref=e137] [cursor=pointer]
        - button "SIMULATION" [ref=e141] [cursor=pointer]
        - button "WHAT_IF" [ref=e144] [cursor=pointer]
        - button "LIVE_INTEL" [ref=e148] [cursor=pointer]
        - button "ANALYTICS" [ref=e155] [cursor=pointer]
        - button "LOCO_PILOT" [ref=e159] [cursor=pointer]
      - generic [ref=e164]: AWAITING CMDS...
```

# Test source

```ts
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
> 133 |       page.waitForResponse('/api/simulate'),
      |            ^ Error: page.waitForResponse: Test timeout of 30000ms exceeded.
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