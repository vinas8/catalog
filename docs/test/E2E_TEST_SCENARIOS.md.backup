# End-to-End Test Scenarios - Serpent Town v0.3.0

**Generated:** 2025-12-22  
**Purpose:** Comprehensive E2E test scenarios for Serpent Town snake purchasing and care system  
**Based On:** Code analysis, existing tests, user stories, business rules  
**Status:** Living document for TDD guidance  
**Coding System:** SMRI (Scenario-Module-Relation-Instance)

---

## 🧱 SMRI Coding System

```
S M R I
│ │ │ │
│ │ │ └─ Instance (sequential per M,R pair)
│ │ └─── Relation (0=standalone, 1-9=related module)
│ └───── Module (primary owner)
└─────── Prefix (always S)
```

**Module Numbers (Aligned with src/modules/):**
1. **Shop** - Product catalog, morphs, equipment, Stripe links
2. **Game** - Tamagotchi mechanics, stats, care actions
3. **Auth** - User identity, hash-based authentication
4. **Payment** - Stripe checkout, webhooks, KV writes
5. **Worker** - Cloudflare Worker API, KV operations, routing
6. **Common** - Shared utilities, helpers (no business logic)

**Note:** Security, Performance, Analytics, Data/KV are cross-cutting concerns embedded in modules above, not separate modules.

**Relation Digit (R):**
- 0 → Standalone (only this module)
- 1-9 → Related to another module (references module number)

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

### S121: Happy Path - First Purchase to Game Entry
**Code:** S121 (Payments → Game, Instance 1)  
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

### S131: Returning User - Second Purchase
**Code:** S131 (Payments → User, Instance 1)  
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

### S101: Product Status Check - Availability
**Code:** S101 (Payments standalone, Instance 1)  
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

### S411: Webhook Signature Verification
**Code:** S411 (Security → Payments, Instance 1)  
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

### S431: User Hash Validation
**Code:** S431 (Security → User, Instance 1)  
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

### S451: Product Schema Validation
**Code:** S451 (Security → Data, Instance 1)  
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

### S521: Load Game from KV - Cold Start
**Code:** S521 (Data → Game, Instance 1)  
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

### S201: View Snake Stats
**Code:** S201 (Game standalone, Instance 1)  
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

### S202: Stats Decay Over Time
**Code:** S202 (Game standalone, Instance 2)  
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

### S203: Feed Action
**Code:** S203 (Game standalone, Instance 3)  
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

### S204: Water Action
**Code:** S204 (Game standalone, Instance 4)  
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

### S205: Clean Enclosure Action
**Code:** S205 (Game standalone, Instance 5)  
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

### S206: Health Degradation
**Code:** S206 (Game standalone, Instance 6)  
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

### S251: Auto-Save Game State
**Code:** S251 (Game → Data, Instance 1)  
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

### S311: Register After Purchase
**Code:** S311 (User → Payments, Instance 1)
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

### S301: Skip Registration
**Code:** S301 (User standalone, Instance 1) - Returning User
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

### S312: Loyalty Points Earning
**Code:** S312 (User → Payments, Instance 2)
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

### S302: Loyalty Tier Progression
**Code:** S302 (User standalone, Instance 2)
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

### S211: Buy Equipment with Gold
**Code:** S211 (Game → Payments, Instance 1)
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

### S212: Cannot Buy Without Gold
**Code:** S212 (Game → Payments, Instance 2)
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

### S231: Loyalty Tier Required Items
**Code:** S231 (Game → User, Instance 1)
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

### S161: Webhook Delayed - Long Wait
**Code:** S161 (Payments → Performance, Instance 1) - Long Wait
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

### S102: Webhook Idempotency
**Code:** S102 (Payments standalone, Instance 2) - Duplicate Events
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

### S162: Product Already Sold - Race Condition
**Code:** S162 (Payments → Performance, Instance 2) - Race Condition
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

### S432: Invalid Hash in URL
**Code:** S432 (Security → User, Instance 2)
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

### S621: Network Failure During Game Load
**Code:** S621 (Performance → Game, Instance 1) During Game Load
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

### S561: Corrupted KV Data
**Code:** S561 (Data → Performance, Instance 1)
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

### S522: User Deletes localStorage Mid-Session
**Code:** S522 (Data → Game, Instance 2) Mid-Session
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

### S452: SQL Injection Attempt
**Code:** S452 (Security → Data, Instance 2) (Even Though No SQL)
**Priority:** P0

**Flow:**
1. Attacker sends: `/user-products?user=' OR 1=1--`
2. Worker validates hash format
3. Returns 400 Bad Request

**Expected Results:**
- ✅ No code execution
- ✅ Input sanitized

---

### S433: XSS Attempt via Username
**Code:** S433 (Security → User, Instance 3)
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

### S412: CSRF Attack on Webhook
**Code:** S412 (Security → Payments, Instance 2)
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

### S511: Product Sync - Create, Update, Delete
**Code:** S511 (Data → Payments, Instance 1) - Create, Update, Delete
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

### S501: KV Consistency Check
**Code:** S501 (Data standalone, Instance 1)
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

### S611: Load 100 Products in Catalog
**Code:** S611 (Performance → Payments, Instance 1) in Catalog
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

### S622: Game with 20 Snakes
**Code:** S622 (Performance → Game, Instance 2)
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

### S612: Concurrent Webhook Processing
**Code:** S612 (Performance → Payments, Instance 2)
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

### S122: Buy 5 Different Snakes
**Code:** S122 (Payments → Game, Instance 2)
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

### S123: Buy Same Morph Twice
**Code:** S123 (Payments → Game, Instance 3) (Virtual Snakes)
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

### S811: Manual Product Assignment
**Code:** S811 (Dev → Payments, Instance 1) (Dev Tool)
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

### S801: Debug Dashboard
**Code:** S801 (Dev standalone, Instance 1)
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

## 📈 Analytics Scenarios

### S711: Track Conversion Rate
**Code:** S711 (Analytics → Payments, Instance 1)
**Priority:** P5  
**User Story:** US-030

**Flow:**
1. System logs:
   - Catalog views
   - "Buy Now" clicks
   - Completed purchases
2. Admin views dashboard
3. Conversion rate: (Purchases / Catalog Views) * 100

**Expected Results:**
- ✅ Accurate tracking
- ✅ Privacy-compliant (no PII)
- ✅ Business insights

---

## 🔮 Future/Disabled Scenarios

### S921: Buy Virtual Snake with Gold
**Code:** S921 (Future → Game, Instance 1) with Gold
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

### S922: Breed Two Snakes
**Code:** S922 (Future → Game, Instance 2)
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

**Payments Module (1)**
- S101 - Product Status Check
- S102 - Webhook Idempotency
- S121 - Happy Path Purchase
- S122 - Buy 5 Different Snakes
- S123 - Buy Same Morph Twice
- S131 - Returning User Purchase
- S161 - Webhook Delayed
- S162 - Race Condition

**Game Module (2)**
- S201 - View Snake Stats
- S202 - Stats Decay Over Time
- S203 - Feed Action
- S204 - Water Action
- S205 - Clean Enclosure Action
- S206 - Health Degradation
- S211 - Buy Equipment with Gold
- S212 - Cannot Buy Without Gold
- S231 - Loyalty Tier Required Items
- S251 - Auto-Save Game State

**User Module (3)**
- S301 - Skip Registration
- S302 - Loyalty Tier Progression
- S311 - Register After Purchase
- S312 - Loyalty Points Earning

**Security Module (4)**
- S411 - Webhook Signature Verification
- S412 - CSRF Attack on Webhook
- S431 - User Hash Validation
- S432 - Invalid Hash in URL
- S433 - XSS Attempt via Username
- S451 - Product Schema Validation
- S452 - SQL Injection Attempt

**Data Module (5)**
- S501 - KV Consistency Check
- S511 - Product Sync (Create/Update/Delete)
- S521 - Load Game from KV
- S522 - User Deletes localStorage
- S561 - Corrupted KV Data

**Performance Module (6)**
- S611 - Load 100 Products in Catalog
- S612 - Concurrent Webhook Processing
- S621 - Network Failure During Game Load
- S622 - Game with 20 Snakes

**Analytics Module (7)**
- S711 - Track Conversion Rate

**Dev/Admin Module (8)**
- S801 - Debug Dashboard
- S811 - Manual Product Assignment

**Future Module (9)**
- S921 - Buy Virtual Snake with Gold
- S922 - Breed Two Snakes

---

### Code Structure Examples

```
S121 - Happy Path Purchase
│ │ │
│ │ └─ Instance 1 (first Payments→Game scenario)
│ └── Related to Game (2)
└──── Payments module (1) owns the scenario
```

```
S411 - Webhook Signature Verification
│ │ │
│ │ └─ Instance 1 (first Security→Payments scenario)
│ └── Related to Payments (1)
└──── Security module (4) owns the scenario
```

```
S201 - View Snake Stats
│ │ │
│ │ └─ Instance 1 (first standalone Game scenario)
│ └── No relation (0)
└──── Game module (2) owns the scenario
```

---

### Module Ownership Matrix

| From/To | Pay(1) | Game(2) | User(3) | Sec(4) | Data(5) | Perf(6) | Anl(7) | Dev(8) | Fut(9) |
|---------|--------|---------|---------|--------|---------|---------|--------|--------|--------|
| **Pay(1)** | S10x | S12x | S13x | - | - | S16x | - | - | - |
| **Game(2)** | S21x | S20x | S23x | - | S25x | - | - | - | - |
| **User(3)** | S31x | - | S30x | - | - | - | - | - | - |
| **Sec(4)** | S41x | - | S43x | S40x | S45x | - | - | - | - |
| **Data(5)** | S51x | S52x | - | - | S50x | S56x | - | - | - |
| **Perf(6)** | S61x | S62x | - | - | - | S60x | - | - | - |
| **Anl(7)** | S71x | - | - | - | - | - | S70x | - | - |
| **Dev(8)** | S81x | - | - | - | - | - | - | S80x | - |
| **Fut(9)** | - | S92x | - | - | - | - | - | - | S90x |

**Reading the matrix:**
- Row = Module that owns the scenario
- Column = Module it relates to
- S10x = Payments standalone (no relation)
- S12x = Payments → Game relation
- Empty = No scenarios for this relationship yet

---

### Coverage Report by Module

| Module | Standalone | With Relations | Total | Coverage |
|--------|------------|----------------|-------|----------|
| Payments (1) | 2 | 7 | 9 | 🟢 Complete |
| Game (2) | 6 | 5 | 11 | 🟢 Complete |
| User (3) | 2 | 3 | 5 | 🟡 Good |
| Security (4) | 0 | 7 | 7 | 🟢 Complete |
| Data (5) | 1 | 4 | 5 | 🟡 Good |
| Performance (6) | 0 | 5 | 5 | 🟡 Good |
| Analytics (7) | 0 | 1 | 1 | 🔴 Minimal |
| Dev/Admin (8) | 1 | 1 | 2 | 🔴 Minimal |
| Future (9) | 0 | 2 | 2 | 🟡 Expected |

**Status:**
- 🟢 Complete: All major flows covered
- 🟡 Good: Core flows covered, could expand
- 🔴 Minimal: Only basic scenarios, needs expansion

---

**Document Version:** 2.0 (with SMRI codes)  
**Last Updated:** 2025-12-22  
**Total Scenarios:** 43 (organized into 9 modules)
