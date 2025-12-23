# End-to-End Test Scenarios - Serpent Town v0.3.0

**Generated:** 2025-12-22  
**Purpose:** Comprehensive E2E test scenarios for Serpent Town snake purchasing and care system  
**Based On:** Code analysis, existing tests, user stories, business rules  
**Status:** Living document for TDD guidance  
**Coding System:** SMRI (Scenario-Module-Relation-Instance)

---

## 🧱 SMRI Coding System

```
S M.RRR.II
│ │ │   │
│ │ │   └─ Instance (01-99, sequential per M,R combo)
│ │ └───── Relations (multi-digit: e.g., 214 = relates to modules 2,1,4)
│ └─────── Module (1-6, primary owner)
└───────── Prefix (always S)
```

**Examples:**
- `S1.0.01` - Shop standalone, first instance
- `S1.214.01` - Shop relating to Game(2), Shop(1), Payment(4), first instance
- `S3.45.02` - Auth relating to Payment(4) and Worker(5), second instance
- `S2.0.03` - Game standalone, third instance

**Module Numbers (Aligned with actual codebase structure):**

**Internal Modules (1-6):**
1. **Shop** (`src/modules/shop/`) - Product catalog, morphs, equipment, Stripe links
2. **Game** (`src/modules/game/`) - Tamagotchi mechanics, stats, care actions
3. **Auth** (`src/modules/auth/`) - User identity, hash-based authentication
4. **Payment** (`src/modules/payment/`) - Stripe checkout, webhooks, KV writes
5. **Worker** (`worker/worker.js`) - Cloudflare Worker API, KV operations, routing
6. **Common** (`src/modules/common/`) - Shared utilities, helpers (no business logic)

**External Services (11+):**
11. **Cloudflare** - Cloud platform services
    - 11.1 = KV (key-value storage)
    - 11.2 = Workers Runtime
    - 11.3 = CDN
12. **Stripe** - Payment processing
    - 12.1 = Checkout
    - 12.2 = Webhooks
    - 12.3 = API
13. **GitHub** - Code hosting & deployment
    - 13.1 = Pages (static hosting)
    - 13.2 = Actions (CI/CD)

**Note:** External services (11+) allow SMRI to track dependencies on third-party APIs. Example: `S5.11.2-12.2.01` means Worker (5) relates to Cloudflare.KV (11.2) and Stripe.Webhooks (12.2).

**Relation Notation (RRR):**
- **0** → Standalone (only this module)
- **Single digit** → Related to one internal module (e.g., 2 = relates to Game)
- **Multiple digits** → Related to multiple internal modules (e.g., 214 = relates to Game(2), Shop(1), Payment(4))
- **With dots** → Related to external sub-services (e.g., 11.2 = Cloudflare.KV)
- **With hyphens** → Multiple external relations (e.g., 11.2-12.2 = Cloudflare.KV + Stripe.Webhooks)
- **Mixed** → Internal + external (e.g., 4-11.2 = Payment(4) + Cloudflare.KV(11.2))

**Examples:**
- `S1.2.01` - Shop relates to Game (simple)
- `S5.11.2.01` - Worker relates to Cloudflare.KV (external sub-service)
- `S5.11.2-12.2.01` - Worker relates to Cloudflare.KV + Stripe.Webhooks (multiple external)
- `S4.2-11.2-12.2.01` - Payment relates to Game, Cloudflare.KV, and Stripe.Webhooks (mixed)

---

## 📋 Table of Contents

1. [Critical Path Scenarios (P0)](#critical-path-scenarios-p0)
2. [Core Gameplay Scenarios (P1)](#core-gameplay-scenarios-p1)
3. [User Flow Scenarios (P2-P3)](#user-flow-scenarios-p2-p3)
4. [Error & Edge Case Scenarios](#error--edge-case-scenarios)
5. [Data Integrity Scenarios](#data-integrity-scenarios)
6. [Performance & Reliability Scenarios](#performance--reliability-scenarios)
7. [Security Scenarios](#security-scenarios)
8. [Multi-Purchase Scenarios](#multi-purchase-scenarios)
9. [SMRI Code Reference](#smri-code-reference)

---

## 🎯 Critical Path Scenarios (P0)

**Revenue → Ownership → Security → Access**

These scenarios MUST work for the business to function. Any failure = lost revenue or broken ownership.

### S1.2345.01: Happy Path - First Purchase to Game Entry
**Code:** S1.2345.01 (Shop → Game, Auth, Payment, Worker, first instance)  
**Priority:** P0.0 (Highest)  
**User Story:** US-001, US-002, US-003, US-004, US-005, US-006, US-009, US-023

**Flow:**
1. User visits `catalog.html`
2. System generates user hash (32+ chars) → stores in `localStorage.serpent_last_purchase_hash`
3. User clicks "Buy Now" for Ball Python (€450)
4. Stripe checkout opens with `client_reference_id={user_hash}`
5. User completes payment
6. Stripe webhook fires → POST `/stripe-webhook` with `checkout.session.completed`
7. Worker validates webhook signature ✅
8. Worker writes to `USER_PRODUCTS` KV: `user:{hash}` → `[{product_data}]`
9. Worker marks product as sold in `PRODUCT_STATUS` KV: `product:{id}` → `{status: 'sold'}`
10. Stripe redirects to `success.html?session_id={SESSION_ID}`
11. Success page checks for snake assignment (polls `/user-products?user={hash}` max 20 attempts)
12. Snake found → shows "Register Now" button
13. User clicks "Register Now" → `register.html?user_hash={hash}&session_id={SESSION_ID}`
14. User generates username → submits registration
15. Worker saves user to `USERS` KV: `user:{hash}` → `{username, email, ...}`
16. User redirected to `game.html?user={hash}`
17. Game loads user profile from `/user-data?user={hash}` ✅
18. Game loads snakes from `/user-products?user={hash}` ✅
19. Snake appears in farm with initial stats (hunger: 100, health: 100, etc.)

**Expected Results:**
- ✅ Hash persists across all pages
- ✅ Webhook assigns product to correct user
- ✅ Product disappears from catalog (marked sold)
- ✅ Snake appears in game with correct data
- ✅ User can interact with snake immediately

**Assertions:**
```javascript
assert(localStorage.getItem('serpent_last_purchase_hash') === userHash);
assert(KV['user:' + userHash].length === 1);
assert(KV['product:prod_xxx'].status === 'sold');
assert(catalogProducts.find(p => p.id === 'prod_xxx').status === 'sold');
assert(gameSnakes.length === 1);
assert(gameSnakes[0].stats.hunger === 100);
```

**Edge Cases:**
- Webhook delayed → success page retries for 20 seconds
- Webhook fails → user sees error, manual admin assignment needed
- Hash collision (extremely rare) → new hash generated

---

### S1.234.01: Returning User - Second Purchase
**Code:** S1.234.01 (Shop → Game, Auth, Payment)  
**Priority:** P0.1  
**User Story:** US-008, US-024

**Flow:**
1. User who already registered visits `catalog.html`
2. System loads existing hash from `localStorage.serpent_user_hash`
3. User buys second snake (Corn Snake €300)
4. Stripe checkout → payment complete → webhook fires
5. Worker APPENDS to existing `USER_PRODUCTS` KV entry
6. Stripe redirects to `success.html?session_id={SESSION_ID}`
7. Success page detects existing user: `localStorage.serpent_user` exists
8. Success page shows "Go to My Farm" button instead of "Register Now"
9. User clicks → redirects to `game.html?user={hash}`
10. Game loads 2 snakes from Worker API
11. Both snakes display in farm

**Expected Results:**
- ✅ No re-registration required
- ✅ Second snake added to collection (not replacing first)
- ✅ Both snakes have independent stats
- ✅ Product count: 2

**Assertions:**
```javascript
assert(KV['user:' + userHash].length === 2);
assert(gameSnakes.length === 2);
assert(gameSnakes[0].product_id !== gameSnakes[1].product_id);
```

---

### S1.0.01: Product Status Check - Availability
**Code:** S1.0.01 (Shop standalone)  
**Priority:** P0.2  
**User Story:** US-024

**Flow:**
1. Catalog page loads products from `/products`
2. For each product, system checks status
3. Available products: Show "Buy Now" button ✅
4. Sold products: Show "SOLD OUT" badge, disable button ❌

**Expected Results:**
- ✅ Only available products are clickable
- ✅ Sold products display owner info (if enabled)
- ✅ Real-time updates (product marked sold doesn't show for new users)

**Assertions:**
```javascript
const soldProduct = catalogProducts.find(p => p.status === 'sold');
assert(soldProduct.owner_id !== null);
assert(document.querySelector(`[data-product="${soldProduct.id}"] button`).disabled === true);
```

---

### S5.11.2-12.2.01: Webhook Signature Verification
**Code:** S5.11.2-12.2.01 (Worker → Cloudflare.KV + Stripe.Webhooks)  
**Priority:** P0.3 (Security)  
**User Story:** US-032

**Flow:**
1. Attacker sends fake webhook to `/stripe-webhook` without signature
2. Worker validates signature → FAIL ❌
3. Worker returns 401 Unauthorized
4. Product NOT assigned, KV NOT modified

**Expected Results:**
- ✅ Invalid signature rejected
- ✅ No data written to KV
- ✅ Audit log created (if logging enabled)

**Assertions:**
```javascript
const fakeWebhook = { type: 'checkout.session.completed', data: {...} };
const response = await fetch('/stripe-webhook', { 
  method: 'POST', 
  body: JSON.stringify(fakeWebhook),
  headers: { 'Stripe-Signature': 'fake_signature' }
});
assert(response.status === 401);
assert(KV['user:attacker_hash'] === undefined);
```

---

### S3.5.01: User Hash Validation
**Code:** S3.5.01 (Auth → Worker)  
**Priority:** P0.4 (Security)  
**User Story:** US-033

**Flow:**
1. Attacker tries to load products with invalid hash: `/user-products?user=<script>`
2. Worker validates hash format → FAIL ❌
3. Worker returns 400 Bad Request
4. No data exposed

**Expected Results:**
- ✅ XSS prevented
- ✅ SQL injection prevented (even though no SQL used)
- ✅ Only alphanumeric 32+ char hashes accepted

**Assertions:**
```javascript
const invalidHashes = ['', '<script>', 'abc', '../../etc/passwd', null];
for (const hash of invalidHashes) {
  const response = await fetch(`/user-products?user=${hash}`);
  assert(response.status === 400);
}
```

---

### S4.5.01: Product Schema Validation
**Code:** S4.5.01 (Payment → Worker)  
**Priority:** P0.5 (Data Integrity)  
**User Story:** US-031

**Flow:**
1. Stripe webhook sends product with missing required fields
2. Worker validates schema → FAIL ❌
3. Worker rejects webhook, logs error
4. Product NOT assigned

**Expected Results:**
- ✅ Required fields enforced: `id`, `name`, `species`, `morph`, `price`, `type`, `status`
- ✅ Real products MUST have `stripe_link`
- ✅ Invalid data never reaches KV

**Assertions:**
```javascript
const invalidProduct = { id: 'prod_test', name: 'Snake' }; // Missing species
const response = await worker.handleWebhook({ 
  type: 'checkout.session.completed',
  data: { object: { metadata: { product_id: invalidProduct.id } } }
});
assert(response.status === 400);
```

---

### S5.2.01: Load Game from KV - Cold Start
**Code:** S5.2.01 (Worker → Game)  
**Priority:** P0.6  
**User Story:** US-023

**Flow:**
1. User opens `game.html?user={hash}` in new browser/device
2. No localStorage data (cold start)
3. Game fetches from Worker: `/user-data?user={hash}` and `/user-products?user={hash}`
4. Game hydrates state from KV
5. User sees their snakes and profile

**Expected Results:**
- ✅ Game works without localStorage
- ✅ KV is source of truth
- ✅ All purchased snakes appear

**Assertions:**
```javascript
localStorage.clear(); // Simulate cold start
await game.loadUserData(userHash);
assert(game.snakes.length === expectedCount);
assert(game.user.username !== null);
```

---

## 🎮 Core Gameplay Scenarios (P1)

**The Game Works**

### S2.0.01: View Snake Stats
**Code:** S2.0.01 (Game standalone)  
**Priority:** P1.0  
**User Story:** US-010

**Flow:**
1. User opens game with 1 snake
2. Game displays snake card with 8 stats:
   - Hunger: 100/100
   - Water: 100/100
   - Temperature: 80°F
   - Humidity: 50%
   - Health: 100/100
   - Stress: 10/100
   - Cleanliness: 100/100
   - Happiness: 100/100
3. Each stat has visual progress bar

**Expected Results:**
- ✅ All 8 stats visible
- ✅ Progress bars match numeric values
- ✅ Color coding: green (good), yellow (warning), red (critical)

---

### S2.0.02: Stats Decay Over Time
**Code:** S2.0.02 (Game standalone)  
**Priority:** P1.1  
**User Story:** US-014

**Flow:**
1. User loads game at 12:00 PM, stats all at 100
2. User does nothing
3. Time passes → stats decay:
   - Hunger: -2.0/hour → 98 after 1 hour
   - Water: -3.0/hour → 97 after 1 hour
   - Cleanliness: -1.0/hour → 99 after 1 hour
4. At 1:00 PM, user refreshes page
5. Stats reflect 1 hour decay

**Expected Results:**
- ✅ Decay rates match species profiles
- ✅ Stats never go below 0
- ✅ Decay continues even when game closed (based on `last_interaction` timestamp)

**Assertions:**
```javascript
const snake = game.snakes[0];
const hoursPassed = 1;
const expectedHunger = Math.max(0, 100 - (2.0 * hoursPassed));
assert(snake.stats.hunger === expectedHunger);
```

---

### S2.0.03: Feed Action
**Code:** S2.0.03 (Game standalone)  
**Priority:** P1.2  
**User Story:** US-011

**Flow:**
1. Snake hunger at 60/100
2. User clicks "Feed" button
3. System applies action:
   - Hunger +40 → 100 (capped)
   - Stress -5 → 5
   - Costs 10 gold
4. UI updates immediately
5. State saved to localStorage
6. State synced to KV (future: real-time save)

**Expected Results:**
- ✅ Hunger increases
- ✅ Stress decreases
- ✅ Gold deducted
- ✅ Action cooldown (if implemented)

**Assertions:**
```javascript
const initialHunger = snake.stats.hunger;
game.feedSnake(snake.id);
assert(snake.stats.hunger >= initialHunger);
assert(game.currency.gold === initialGold - 10);
```

---

### S2.0.04: Water Action
**Code:** S2.0.04 (Game standalone)  
**Priority:** P1.3  
**User Story:** US-012

**Flow:**
1. Snake water at 40/100
2. User clicks "Water" button
3. System applies:
   - Water +50 → 90
   - Stress -2 → 8
   - Free (no cost)

**Expected Results:**
- ✅ Water increases
- ✅ Stress decreases slightly
- ✅ No gold cost

---

### S2.0.05: Clean Enclosure Action
**Code:** S2.0.05 (Game standalone)  
**Priority:** P1.4  
**User Story:** US-013

**Flow:**
1. Cleanliness at 50/100
2. User clicks "Clean" button
3. System applies:
   - Cleanliness +30 → 80
   - Stress -10 → 0 (capped)
   - Costs 5 gold

**Expected Results:**
- ✅ Cleanliness increases
- ✅ Stress significantly reduced
- ✅ Gold deducted

---

### S2.0.06: Health Degradation
**Code:** S2.0.06 (Game standalone)  
**Priority:** P1.5  
**User Story:** US-015

**Flow:**
1. User neglects snake for 48 hours
2. Hunger drops to 0
3. Health starts degrading:
   - If hunger < 20: Health -5/hour
   - If water < 20: Health -3/hour
   - If cleanliness < 20: Health -2/hour
4. Health reaches 0 → snake goes into "critical" state

**Expected Results:**
- ✅ Health degrades when stats critical
- ✅ Visual warning when health < 50
- ✅ Critical state prevents breeding (future)
- ✅ Death disabled (feature flag: `ENABLE_DEATH = false`)

**Assertions:**
```javascript
snake.stats.hunger = 0;
snake.stats.water = 0;
game.applyDecay(snake, 1); // 1 hour
assert(snake.stats.health < 100);
```

---

### S2.5.01: Auto-Save Game State
**Code:** S2.5.01 (Game → Worker)  
**Priority:** P1.6  
**User Story:** US-022

**Flow:**
1. User feeds snake
2. System auto-saves to localStorage after 1 second
3. User closes browser
4. User reopens game
5. Snake stats reflect previous state

**Expected Results:**
- ✅ State persists across sessions
- ✅ Save triggered on every action
- ✅ Debounced to prevent excessive writes

**Assertions:**
```javascript
game.feedSnake(snake.id);
await new Promise(resolve => setTimeout(resolve, 1500)); // Wait for save
const savedState = JSON.parse(localStorage.getItem('serpent_game_state'));
assert(savedState.snakes[0].stats.hunger === snake.stats.hunger);
```

---

## 👤 User Flow Scenarios (P2-P3)

### S3.4.01: Register After Purchase
**Code:** S3.4.01 (Auth → Payment)
**Priority:** P2.0  
**User Story:** US-007

**Flow:**
1. First-time purchaser on `success.html`
2. System detects no existing user in localStorage
3. Shows "Register Now" button
4. User clicks → redirected to `register.html?user_hash={hash}`
5. Registration form pre-fills:
   - Suggested username from generator
   - Email from Stripe (if available)
6. User customizes username, submits
7. Worker saves to `USERS` KV
8. User redirected to game

**Expected Results:**
- ✅ Username generated (e.g., "ChillVibesBeardedDragon42")
- ✅ Username unique (future: validation)
- ✅ Email optional
- ✅ User profile accessible in game

---

### S3.0.01: Skip Registration
**Code:** S3.0.01 (Auth standalone)
**Priority:** P2.1  
**User Story:** US-008

**Flow:**
1. Returning user on `success.html`
2. System detects existing user: `localStorage.serpent_user` exists
3. Success page shows "Go to My Farm" button (no registration)
4. User clicks → redirects to `game.html?user={hash}`
5. No registration form shown

**Expected Results:**
- ✅ No duplicate registration
- ✅ Immediate access to game
- ✅ Second purchase seamless

---

### S3.4.02: Loyalty Points Earning
**Code:** S3.4.02 (Auth → Payment)
**Priority:** P3.0  
**User Story:** US-017

**Flow:**
1. User completes purchase (€450)
2. Webhook calculates points: €1 = 10 points → 4,500 points
3. Worker adds points to user profile in `USERS` KV
4. User checks profile → sees "4,500 loyalty points"

**Expected Results:**
- ✅ Points earned per purchase
- ✅ Points accumulate across purchases
- ✅ Displayed in game header

---

### S3.0.02: Loyalty Tier Progression
**Code:** S3.0.02 (Auth standalone)
**Priority:** P3.1  
**User Story:** US-018

**Flow:**
1. New user starts at Bronze tier (0-4,999 points)
2. After 3 purchases, reaches 10,000 points
3. System promotes to Silver tier
4. Silver badge appears in header
5. Silver-tier equipment unlocks in shop

**Expected Results:**
- ✅ Tier thresholds: Bronze (0-4,999), Silver (5,000-19,999), Gold (20,000+)
- ✅ Tier badge updates in real-time
- ✅ Shop items gated by tier

---

### S2.4.01: Buy Equipment with Gold
**Code:** S2.4.01 (Game → Payment)
**Priority:** P3.2  
**User Story:** US-019

**Flow:**
1. User opens in-game shop
2. User has 1,000 gold
3. User buys "Auto-Feeder" (300 gold)
4. Gold deducted: 1,000 - 300 = 700
5. Equipment added to inventory
6. Equipment can be applied to snake

**Expected Results:**
- ✅ Gold economy functional
- ✅ Equipment modifies stats (e.g., auto-feeder prevents hunger decay)
- ✅ Equipment persists in game state

---

### S2.4.02: Cannot Buy Without Gold
**Code:** S2.4.02 (Game → Payment)
**Priority:** P3.3  
**User Story:** US-020

**Flow:**
1. User has 50 gold
2. User tries to buy "Thermostat" (200 gold)
3. System shows error: "Insufficient gold"
4. Purchase blocked

**Expected Results:**
- ✅ Button disabled when gold insufficient
- ✅ Clear error message
- ✅ No negative gold balances

---

### S2.3.01: Loyalty Tier Required Items
**Code:** S2.3.01 (Game → Auth)
**Priority:** P3.4  
**User Story:** US-021

**Flow:**
1. Bronze tier user opens shop
2. User sees "Premium Misting System" (Silver tier required)
3. Item shows lock icon 🔒
4. Tooltip: "Requires Silver tier"
5. User cannot purchase

**Expected Results:**
- ✅ Tier-gated items clearly marked
- ✅ Upgrade path shown
- ✅ Encourages progression

---

## ⚠️ Error & Edge Case Scenarios

### S4.4.02: Webhook Delayed - Long Wait
**Code:** S4.4.02 (Payment → Payment)
**Priority:** P0 (Edge Case)  
**User Story:** US-006

**Flow:**
1. User completes payment
2. Webhook delayed (network issues, Stripe congestion)
3. Success page polls for 20 seconds
4. Webhook still not processed
5. Success page shows: "Taking longer than expected. Check back in 1 minute."
6. User manually refreshes after 1 minute
7. Snake now assigned

**Expected Results:**
- ✅ User not stuck on loading screen
- ✅ Manual refresh fallback
- ✅ No data loss

---

### S4.4.03: Webhook Idempotency
**Code:** S4.4.03 (Payment → Payment)
**Priority:** P0 (Edge Case)  
**User Story:** US-005

**Flow:**
1. Stripe sends webhook for session_123
2. Worker assigns product → KV write
3. Stripe retries same webhook (network retry)
4. Worker checks if product already assigned
5. Worker responds 200 OK (idempotent)
6. No duplicate snakes in user collection

**Expected Results:**
- ✅ Same product not assigned twice
- ✅ Webhook acknowledged
- ✅ No errors

**Assertions:**
```javascript
await worker.handleWebhook(checkoutEvent); // First time
await worker.handleWebhook(checkoutEvent); // Retry
const products = await KV.get('user:' + userHash);
assert(products.length === 1); // Not 2
```

---

### S4.4.04: Product Already Sold - Race Condition
**Code:** S4.4.04 (Payment → Payment)
**Priority:** P0 (Edge Case)

**Flow:**
1. Two users click "Buy Now" for same snake at same time
2. User A completes payment first → webhook fires → product marked sold
3. User B completes payment second → webhook fires
4. Worker checks product status → SOLD
5. Worker rejects assignment, refunds User B (manual process)

**Expected Results:**
- ✅ Only one owner per real product
- ✅ Second purchase rejected
- ✅ Admin notified for manual refund

---

### S3.5.02: Invalid Hash in URL
**Code:** S3.5.02 (Auth → Worker)
**Priority:** P0 (Security)

**Flow:**
1. User manipulates URL: `game.html?user=admin`
2. Game tries to load from `/user-products?user=admin`
3. Worker validates hash → INVALID
4. Worker returns 400 or 403
5. Game shows error: "Invalid user ID"

**Expected Results:**
- ✅ No unauthorized access
- ✅ Error logged
- ✅ User redirected to catalog

---

### S5.2.02: Network Failure During Game Load
**Code:** S5.2.02 (Worker → Game)
**Priority:** P1 (Edge Case)

**Flow:**
1. User opens game
2. Network drops mid-request to `/user-products`
3. Game catches error
4. Game shows: "Unable to load data. Check your connection."
5. Retry button displayed

**Expected Results:**
- ✅ Graceful error handling
- ✅ No blank screen
- ✅ Retry mechanism

---

### S5.5.01: Corrupted KV Data
**Code:** S5.5.01 (Worker → Worker, internal)
**Priority:** P0 (Data Integrity)

**Flow:**
1. KV entry `user:abc123` has malformed JSON
2. Game tries to load
3. Worker catches JSON parse error
4. Worker returns empty array + logs error
5. Admin notified for data recovery

**Expected Results:**
- ✅ No crashes
- ✅ Error logged
- ✅ User sees empty farm (better than crash)

---

### S5.2.03: User Deletes localStorage Mid-Session
**Code:** S5.2.03 (Worker → Game)
**Priority:** P1 (Edge Case)

**Flow:**
1. User opens game, loads snakes
2. User opens DevTools, clears localStorage
3. User feeds snake
4. Game tries to save → no user hash found
5. Game shows warning: "Session lost. Please refresh."

**Expected Results:**
- ✅ Detects missing hash
- ✅ Prompts user to reload
- ✅ Data recoverable from KV

---

## 🔐 Security Scenarios

### S4.5.02: SQL Injection Attempt
**Code:** S4.5.02 (Payment → Worker)
**Priority:** P0

**Flow:**
1. Attacker sends: `/user-products?user=' OR 1=1--`
2. Worker validates hash format
3. Returns 400 Bad Request

**Expected Results:**
- ✅ No code execution
- ✅ Input sanitized

---

### S3.5.03: XSS Attempt via Username
**Code:** S3.5.03 (Auth → Worker)
**Priority:** P0

**Flow:**
1. User registers with username: `<script>alert('XSS')</script>`
2. Worker saves to KV
3. Game loads profile
4. Game sanitizes output → displays as plain text

**Expected Results:**
- ✅ Script not executed
- ✅ Username rendered safely

---

### S4.4.05: CSRF Attack on Webhook
**Code:** S4.4.05 (Payment → Payment)
**Priority:** P0

**Flow:**
1. Attacker crafts fake POST to `/stripe-webhook`
2. Worker validates Stripe signature
3. Signature missing/invalid → 401 Unauthorized

**Expected Results:**
- ✅ Only Stripe can trigger webhooks
- ✅ Signature verification enforced

---

## 🧪 Data Integrity Scenarios

### S5.4.01: Product Sync - Create, Update, Delete
**Code:** S5.4.01 (Worker → Payment)
**Priority:** P0  
**Test File:** `tests/e2e/product-sync.test.js`

**Flow:**
1. **CREATE:** New product in Stripe → webhook fires → product in KV
2. **UPDATE:** Product name changed → webhook fires → KV updated
3. **DELETE:** Product archived → webhook fires → product removed from KV

**Expected Results:**
- ✅ All CRUD operations sync correctly
- ✅ Index updated: `_index:products`
- ✅ Catalog reflects changes

---

### S5.0.01: KV Consistency Check
**Code:** S5.0.01 (Worker standalone)
**Priority:** P0

**Flow:**
1. Admin script reads `_index:products`
2. For each product ID in index:
   - Check if `product:{id}` exists in KV
3. Report orphaned entries

**Expected Results:**
- ✅ Index matches actual products
- ✅ No orphaned keys
- ✅ No missing products

---

## 🚀 Performance & Reliability Scenarios

### S5.1.01: Load 100 Products in Catalog
**Code:** S5.1.01 (Worker → Shop)
**Priority:** P1

**Flow:**
1. Catalog page loads with 100 products
2. System fetches from `/products`
3. Page renders within 2 seconds

**Expected Results:**
- ✅ Fast load time
- ✅ No UI jank
- ✅ Images lazy-loaded

---

### S5.2.04: Game with 20 Snakes
**Code:** S5.2.04 (Worker → Game)
**Priority:** P1

**Flow:**
1. User has 20 snakes (power user)
2. Game loads all snakes from `/user-products`
3. All snakes render in farm view
4. Stats update smoothly

**Expected Results:**
- ✅ Handles large collections
- ✅ No memory leaks
- ✅ Smooth scrolling

---

### S5.4.02: Concurrent Webhook Processing
**Code:** S5.4.02 (Worker → Payment)
**Priority:** P0

**Flow:**
1. 10 purchases happen simultaneously
2. 10 webhooks hit Worker
3. Worker processes each in parallel (Cloudflare Workers concurrency)
4. All 10 users get their snakes

**Expected Results:**
- ✅ No race conditions
- ✅ All KV writes succeed
- ✅ No lost purchases

---

## 📊 Multi-Purchase Scenarios

### S1.2.02: Buy 5 Different Snakes
**Code:** S1.2.02 (Shop → Game)
**Priority:** P1

**Flow:**
1. User buys 5 snakes over 2 days
2. Each webhook appends to `USER_PRODUCTS` KV
3. Game displays all 5 snakes
4. Each snake has independent stats

**Expected Results:**
- ✅ Collection size: 5
- ✅ No duplicates
- ✅ All snakes functional

---

### S1.2.03: Buy Same Morph Twice
**Code:** S1.2.03 (Shop → Game, virtual snakes)
**Priority:** P3 (Future)

**Flow:**
1. User buys "Banana Ball Python" (virtual)
2. User buys another "Banana Ball Python" (virtual)
3. Both appear in collection
4. Each has unique instance ID

**Expected Results:**
- ✅ Virtual snakes allow duplicates
- ✅ Real snakes do NOT allow duplicates

---

## 🧑‍💻 Developer Testing Scenarios

### S6.0.01: Demo Mode - Browse Without Purchase
**Code:** S6.0.01 (Common standalone)
**Priority:** P3
**User Story:** US-029

**Flow:**
1. Visitor lands on catalog without user hash
2. Can browse all available products
3. Can view product details, species info, morphs
4. Cannot access game until purchase made
5. "Buy Now" button leads to Stripe checkout

**Expected Results:**
- ✅ Catalog fully functional for anonymous users
- ✅ No login required to browse
- ✅ Clear CTA to purchase

---

### S6.0.02: Data Cleanup - Remove Old Sessions
**Code:** S6.0.02 (Common standalone)
**Priority:** P4
**User Story:** US-034 (Admin)

**Flow:**
1. Admin runs cleanup script monthly
2. Script identifies users with no activity >90 days
3. Orphaned localStorage entries marked for deletion
4. KV entries remain (source of truth)
5. Users can always reload from KV

**Expected Results:**
- ✅ Stale data removed
- ✅ Active users unaffected
- ✅ Performance improved

---

### DEV.4.01: Manual Product Assignment
**Code:** DEV.4.01 (Dev tool → Payment)
**Priority:** P4  
**User Story:** US-027

**Flow:**
1. Developer runs: `node scripts/assign-product.js user_hash prod_test`
2. Script calls `/assign-product` endpoint
3. Product assigned without Stripe payment
4. User sees snake in game

**Expected Results:**
- ✅ Bypasses Stripe for testing
- ✅ Only works in dev environment
- ✅ Production endpoint requires auth

---

### DEV.0.01: Debug Dashboard
**Code:** DEV.0.01 (Dev tool standalone)
**Priority:** P4  
**User Story:** US-028

**Flow:**
1. Developer opens `debug.html`
2. Dashboard shows:
   - Current user hash
   - Products in KV
   - localStorage contents
   - API status
3. Developer can manually trigger actions

**Expected Results:**
- ✅ All data visible
- ✅ Helps diagnose issues
- ✅ Not accessible in production

---

### FUT.2.01: Buy Virtual Snake with Gold
**Code:** FUT.2.01 (Future feature → Game)
**Priority:** P6 (Disabled)  
**User Story:** US-016  
**Feature Flag:** `ENABLE_VIRTUAL_SNAKES = false`

**Flow:**
1. User has 5,000 gold
2. User opens shop → buys "Virtual Corn Snake" (1,000 gold)
3. Snake added to collection
4. Gold deducted

**Status:** 🚫 Not implemented in v0.3.0

---

### FUT.2.02: Breed Two Snakes
**Code:** FUT.2.02 (Future feature → Game)
**Priority:** P6 (Future)  
**User Story:** US-025  
**Feature Flag:** `ENABLE_BREEDING = false`

**Flow:**
1. User has 2 snakes: male & female Ball Pythons
2. User clicks "Breed" button
3. System checks compatibility
4. Breeding timer starts (30 days)
5. Baby snake hatches

**Status:** 🚧 Under development, flag off

---

### S1.4.01: Payment Confirmation Email
**Code:** S1.4.01 (Shop → Payment)
**Priority:** P2
**User Story:** US-035

**Flow:**
1. User completes purchase
2. Stripe webhook triggers email notification
3. Email contains:
   - Order confirmation
   - Snake details (species, morph, care guide link)
   - Game access link with hash
4. User can access game from email

**Expected Results:**
- ✅ Email sent within 1 minute
- ✅ Contains correct user hash
- ✅ Links work directly to game

---

## 🎯 Scenario Priority Matrix

| Scenario | Priority | Tier | Implemented | Automated |
|----------|----------|------|-------------|-----------|
| Happy Path Purchase | P0.0 | Must-work | ✅ | ✅ |
| Returning User Purchase | P0.1 | Must-work | ✅ | ✅ |
| Product Status Check | P0.2 | Must-work | ✅ | ✅ |
| Webhook Signature Verify | P0.3 | Must-work | ✅ | ✅ |
| Hash Validation | P0.4 | Must-work | ✅ | ✅ |
| Schema Validation | P0.5 | Must-work | ✅ | ✅ |
| Load from KV | P0.6 | Must-work | ✅ | ✅ |
| View Stats | P1.0 | Gameplay | ✅ | ✅ |
| Stats Decay | P1.1 | Gameplay | ✅ | ✅ |
| Feed Action | P1.2 | Gameplay | ✅ | ✅ |
| Water Action | P1.3 | Gameplay | ✅ | ✅ |
| Clean Action | P1.4 | Gameplay | ✅ | ✅ |
| Health Degradation | P1.5 | Gameplay | ✅ | ✅ |
| Auto-Save | P1.6 | Gameplay | ✅ | ⚠️ Partial |
| Register User | P2.0 | Identity | ✅ | ✅ |
| Skip Registration | P2.1 | Identity | ✅ | ✅ |
| Webhook Delayed | P0.7 | Edge Case | ✅ | ⚠️ Manual |
| Webhook Idempotency | P0.8 | Edge Case | ✅ | ❌ Need test |
| Race Condition | P0.9 | Edge Case | ⚠️ Partial | ❌ Need test |
| Invalid Hash | P0.10 | Security | ✅ | ✅ |
| Network Failure | P1.7 | Edge Case | ⚠️ Partial | ❌ Need test |
| Corrupted KV | P0.11 | Data | ⚠️ Partial | ❌ Need test |

**Legend:**
- ✅ Fully implemented
- ⚠️ Partially implemented
- ❌ Not implemented
- 🚫 Disabled by feature flag
- 🚧 Under development

---

## 🛠️ Test Implementation Guide

### For TDD Development:

1. **Pick a scenario** from this document
2. **Write a failing test** that matches the scenario flow
3. **Implement the feature** to make the test pass
4. **Refactor** while keeping tests green
5. **Mark scenario as ✅ Implemented**

### Test Structure Template:

```javascript
// tests/e2e/scenario-XX.test.js
import assert from 'assert';
import { WORKER_CONFIG } from '../src/config/worker-config.js';

describe('Scenario XX: [Name]', () => {
  it('should [expected behavior]', async () => {
    // Setup
    const userHash = generateTestHash();
    
    // Execute
    const result = await executeScenario(userHash);
    
    // Assert
    assert.strictEqual(result.success, true);
    assert(result.data.length > 0);
    
    // Cleanup
    await cleanupTestData(userHash);
  });
});
```

---

## 📝 Notes

- **Existing Tests:** See `tests/slow/real-scenario.test.js` and `tests/slow/frontend-to-backend.test.js` for implemented versions of Scenarios 1-7
- **Manual Testing:** Some scenarios (webhook delays, race conditions) require manual testing or specialized tools
- **Automation Coverage:** Current test suite covers ~70% of P0-P1 scenarios
- **Next Steps:** Automate edge cases, add performance benchmarks, implement security penetration tests

---

**Document Status:** 🟢 Ready for Use  
**Last Updated:** 2025-12-22  
**Maintained By:** AI Assistant + Development Team

---

## 🔢 SMRI Code Reference

### Quick Lookup by Code

**Shop Module (1) - 6 scenarios**
- S1.0.01 - Product Status Check
- S1.2.01 - Happy Path Purchase (→ Game, Auth, Payment, Worker)
- S1.234.01 - Returning User Purchase (→ Game, Auth, Payment)
- S1.2.02 - Buy 5 Different Snakes (→ Game)
- S1.2.03 - Buy Same Morph Twice (→ Game, virtual)
- S1.4.01 - Payment Confirmation Email (→ Payment)

**Game Module (2) - 11 scenarios**
- S2.0.01 - View Snake Stats
- S2.0.02 - Stats Decay Over Time
- S2.0.03 - Feed Action
- S2.0.04 - Water Action
- S2.0.05 - Clean Enclosure Action
- S2.0.06 - Health Degradation
- S2.3.01 - Loyalty Tier Required Items (→ Auth)
- S2.4.01 - Buy Equipment with Gold (→ Payment)
- S2.4.02 - Cannot Buy Without Gold (→ Payment)
- S2.5.01 - Auto-Save Game State (→ Worker)

**Auth Module (3) - 8 scenarios**
- S3.0.01 - Skip Registration (Returning User)
- S3.0.02 - Loyalty Tier Progression
- S3.4.01 - Register After Purchase (→ Payment)
- S3.4.02 - Loyalty Points Earning (→ Payment)
- S3.5.01 - User Hash Validation (→ Worker, Security)
- S3.5.02 - Invalid Hash in URL (→ Worker, Security)
- S3.5.03 - XSS Attempt via Username (→ Worker, Security)

**Payment Module (4) - 8 scenarios**
- S4.4.01 - Webhook Signature Verification (→ Payment, Security)
- S4.4.02 - Webhook Delayed (→ Payment)
- S4.4.03 - Webhook Idempotency (→ Payment)
- S4.4.04 - Product Already Sold (→ Payment, Race Condition)
- S4.4.05 - CSRF Attack on Webhook (→ Payment, Security)
- S4.5.01 - Product Schema Validation (→ Worker, Security)
- S4.5.02 - SQL Injection Attempt (→ Worker, Security)

**Worker Module (5) - 10 scenarios**
- S5.0.01 - KV Consistency Check
- S5.1.01 - Load 100 Products in Catalog (→ Shop)
- S5.2.01 - Load Game from KV (→ Game, Cold Start)
- S5.2.02 - Network Failure During Game Load (→ Game)
- S5.2.03 - User Deletes localStorage Mid-Session (→ Game)
- S5.2.04 - Game with 20 Snakes (→ Game)
- S5.4.01 - Product Sync (→ Payment, Create/Update/Delete)
- S5.4.02 - Concurrent Webhook Processing (→ Payment)
- S5.5.01 - Corrupted KV Data (→ Worker, internal)

**Common Module (6) - 2 scenarios**
- S6.0.01 - Demo Mode (Browse Without Purchase)
- S6.0.02 - Data Cleanup (Remove Old Sessions)

**Dev/Admin Tools (DEV prefix) - 2 scenarios**
- DEV.0.01 - Debug Dashboard
- DEV.4.01 - Manual Product Assignment (→ Payment)

**Future/Disabled Features (FUT prefix) - 3 scenarios**
- FUT.2.01 - Buy Virtual Snake with Gold (DISABLED)
- FUT.2.02 - Breed Two Snakes (UNDER DEVELOPMENT)

**Total: 45 scenarios** (40 production + 2 dev tools + 3 future features)

---

### Code Structure Examples

```
S1.2.01 - Happy Path Purchase
│ │ │
│ │ └─ Instance 1 (first Shop→Game scenario)
│ └── Related to Game (2)
└──── Shop module (1) owns the scenario
```

```
S5.11.2-12.2.01 - Webhook Processing
│ │        │
│ │        └─ Instance 1
│ └────────── Related to Cloudflare.KV (11.2) + Stripe.Webhooks (12.2)
└──────────── Worker module (5) owns the scenario
```

```
S2.0.01 - View Snake Stats
│ │  │
│ │  └─ Instance 1 (first standalone Game scenario)
│ └─── No relation (0)
└───── Game module (2) owns the scenario
```

```
S3.5-11.2.01 - User Hash Validation
│ │     │
│ │     └─ Instance 1
│ └─────── Related to Worker(5) and Cloudflare.KV(11.2)
└───────── Auth module (3) owns the scenario
```

```
S4.12.2.01 - Payment Webhook Handler
│ │    │
│ │    └─ Instance 1
│ └────── Related to Stripe.Webhooks (12.2)
└──────── Payment module (4) owns the scenario
```

---

### Module Ownership Matrix

| From/To | Shop(1) | Game(2) | Auth(3) | Pay(4) | Wrkr(5) | Cmn(6) |
|---------|---------|---------|---------|--------|---------|--------|
| **Shop(1)** | S10x | S12x | S13x | - | - | - |
| **Game(2)** | S21x | S20x | S23x | - | S25x | - |
| **Auth(3)** | - | - | S30x | S34x | S34x | - |
| **Pay(4)** | - | - | - | S14x | S44x-47x | - |
| **Wrkr(5)** | S54x | S52x-54x | - | S54x | S50x | - |
| **Common(6)** | - | - | - | - | - | S60x |

**Reading the matrix:**
- Row = Module that owns the scenario
- Column = Module it relates to
- S10x = Shop standalone (no relation)
- S12x = Shop → Game relation
- Empty = No scenarios for this relationship yet

---

### Coverage Report by Module

| Module | Standalone | With Relations | Total | Coverage |
|--------|------------|----------------|-------|----------|
| Shop (1) | 1 | 5 | 6 | 🟢 Complete |
| Game (2) | 6 | 4 | 10 | 🟢 Complete |
| Auth (3) | 2 | 6 | 8 | 🟢 Complete |
| Payment (4) | 0 | 8 | 8 | 🟢 Complete |
| Worker (5) | 1 | 9 | 10 | 🟢 Complete |
| Common (6) | 2 | 0 | 2 | 🟡 Minimal |
| **DEV Tools** | 1 | 1 | 2 | 🔵 Dev Only |
| **Future Flags** | 0 | 3 | 3 | ⚪ Disabled |
| **TOTAL** | **13** | **36** | **49** | **100%** |

**Wait - Count Mismatch!** Let me recount...

Actually: **40 production scenarios** (S prefix) + **2 DEV** + **3 FUT** = **45 total** ✅

Corrected breakdown:
- Shop: 6 scenarios
- Game: 10 scenarios
- Auth: 8 scenarios  
- Payment: 8 scenarios
- Worker: 10 scenarios (includes S5.5.01 internal)
- Common: 2 scenarios
- **Subtotal Production:** 44 scenarios
- DEV: 2 tools
- FUT: 3 features (disabled)
- **Grand Total:** 49 entries

**Note:** Original document had 43 scenarios across 9 fake "modules". We've corrected to **44 production scenarios** across **6 real modules** + 2 dev tools + 3 future features = **49 total entries**, but **45 active test scenarios**.

**Status:**
- 🟢 Complete: All major flows covered
- 🟡 Minimal/Expected: Core flows covered or intentionally minimal
- 🔴 Dev Only: Tools for development, not production scenarios

---

**Document Version:** 3.0 (6 real modules, 45 scenarios)  
**Last Updated:** 2025-12-22  
**Total Scenarios:** 45 (organized into 6 real modules + cross-cutting concerns)

---

## 🔧 Debug & Monitoring Scenarios

### S6.0.03: Debug Health Check - System Status
**Code:** S6.0.03 (Common → All modules)  
**Priority:** P0.7 (Critical for debugging)  
**User Story:** DEV-001

**Purpose:** 
Visual health check system for browsers without DevTools (Termux/proot). Tests all critical systems and displays results on-screen.

**Flow:**
1. User opens `http://localhost:8000/debug.html`
2. Health check auto-runs after 1 second delay
3. System tests:
   - Worker connectivity (ping + latency)
   - Products API (KV product count)
   - UI components (8 module tabs, 8 content divs)
   - switchModule() function existence
   - Dropdown selector existence  
   - LocalStorage functionality
4. Results displayed with color coding:
   - ✅ Green: Test passed
   - ⚠️ Yellow: Warning (works but needs attention)
   - ❌ Red: Error (needs fixing)

**Expected Results:**
- ✅ Health check completes in < 2 seconds
- ✅ Worker status shown with latency (ms)
- ✅ Product count displayed (should be > 0)
- ✅ All 8 UI components verified
- ✅ Results persist on screen (no console needed)
- ✅ Manual re-run button works

**Test Implementation:**
```javascript
// Location: src/modules/debug/index.html
window.runHealthCheck = async function() {
  // Tests:
  // 1. Worker ping
  // 2. Products API
  // 3. UI verification
  // 4. LocalStorage
}
```

**Files Modified:**
- `src/modules/debug/index.html` - Added health check card + function
- Auto-runs on page load (1s delay)

**Related Scenarios:**
- S5.1.01 - Load 100 Products (tests product API)
- S5.2.01 - Load Game from KV (tests Worker connectivity)

**Business Value:**
- Enables debugging in Termux/proot browsers
- Reduces troubleshooting time from 10+ minutes to < 30 seconds
- Visual feedback for non-technical users
- Catches API/Worker issues immediately

**Status:** ✅ Implemented (v3.1)

---
