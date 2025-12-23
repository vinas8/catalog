# Business Facts v2 - Serpent Town

**Extracted from:** E2E_TEST_SCENARIOS.md (1344 lines, 45 scenarios)  
**Method:** Manual reading + SMRI pattern analysis  
**Version:** v0.5.0  
**Purpose:** Abstract business rules for AI validation

---

## SMRI Pattern Analysis

### Module Structure (6 Internal + 3 External)
**Internal Modules:**
1. Shop - Product catalog, Stripe links
2. Game - Tamagotchi mechanics
3. Auth - User identity (hash-based)
4. Payment - Webhook handling
5. Worker - API orchestration
6. Common - Shared utilities

**External Services:**
- 11.x Cloudflare (11.1=KV, 11.2=Workers, 11.3=CDN)
- 12.x Stripe (12.1=Checkout, 12.2=Webhooks, 12.3=API)
- 13.x GitHub (13.1=Pages, 13.2=Actions)

### Scenario Distribution
- **45 active scenarios** across 6 modules
- **2 dev tools** (debug dashboard, manual assignment)
- **3 future features** (disabled by flags)
- **Priority split:** P0 (15), P1 (8), P2 (2), P3 (4), P4+ (16)

---

## Core Business Facts (Extracted from Scenarios)

### 1. PURCHASE FLOW (S1.2345.01 - Happy Path)

**BF-001: First Purchase Identity Creation**
- User hash generated client-side (32+ alphanumeric chars)
- Hash stored in `localStorage.serpent_last_purchase_hash`
- Hash passed to payment processor as `client_reference_id`
- Hash becomes permanent user identifier

**BF-002: Payment Processor Integration**
- Payment processor must support customer reference ID
- Checkout URL generation required
- Webhook signature verification mandatory
- EUR currency only (currently Stripe-specific)

**BF-003: Webhook-Driven Ownership**
- Ownership established ONLY via webhook confirmation
- No webhook = no ownership (even if payment succeeded)
- Webhook payload must contain: user_hash, product_id, amount
- Worker validates signature before processing

**BF-004: Storage Write Pattern**
- Key format: `user:{hash}` → JSON array of products
- First purchase: Create new key
- Subsequent purchases: APPEND to existing array
- Storage must support eventual consistency (60s propagation)

**BF-005: Product Status Transitions**
- Available → Sold (one-way, no reversal)
- Sold products marked with `owner_id`
- Real products (one-time sale) vs Virtual products (unlimited)
- Status stored separately: `product:{id}` → `{status: 'sold'}`

---

### 2. RETURNING USER (S1.234.01)

**BF-006: Multi-Purchase Accumulation**
- Same user_hash used across all purchases
- Products accumulate in single KV entry
- No duplicate hash generation
- Collection size unlimited

**BF-007: Registration Optional**
- First purchase → "Register Now" prompt
- Second purchase → "Go to My Farm" (skip registration)
- Username/email stored separately in `USERS` KV
- Game functions without registration (hash-only mode)

**BF-008: Session Continuity**
- Hash persists in localStorage across sessions
- No expiration on user_hash
- No server-side sessions
- Stateless API design

---

### 3. PRODUCT CATALOG (S1.0.01)

**BF-009: Availability Display**
- Catalog reads from `/products` endpoint
- Available products: "Buy Now" button enabled
- Sold products: "SOLD OUT" badge + disabled button
- Real-time updates (new users don't see sold items)

**BF-010: Product Schema Requirements**
- Required fields: `id`, `name`, `species`, `morph`, `price`, `type`, `status`
- Real products: `stripe_link` required
- Virtual products: No payment link (in-game purchase)
- Type enum: 'real' | 'virtual'

---

### 4. SECURITY RULES (S5.11.2-12.2.01, S3.5.01, S4.5.01)

**BF-011: Webhook Signature Verification**
- Every webhook MUST include signature header
- HMAC-SHA256 validation against shared secret
- Invalid signature → 401 Unauthorized
- No data written on signature failure
- Audit log created for failed attempts

**BF-012: User Hash Validation**
- Format: Alphanumeric only [a-zA-Z0-9]
- Length: Minimum 32 characters
- Rejection cases: `<script>`, SQL patterns, `null`, empty string
- Invalid hash → 400 Bad Request
- No XSS/SQLi vectors accepted

**BF-013: Schema Validation on Write**
- Product data validated BEFORE KV write
- Missing required fields → 400 Bad Request
- Invalid types (string vs number) → rejection
- Malformed JSON → logged + error response

**BF-014: CSRF Prevention**
- Only payment processor can trigger webhooks
- No user-facing webhook endpoints
- Signature verification prevents spoofing
- No cookies/sessions to hijack

**BF-015: XSS Prevention**
- Username sanitized on output (not storage)
- Product names rendered as plain text
- No innerHTML usage for user content
- Script tags displayed literally (not executed)

---

### 5. GAME MECHANICS (S2.0.01-06)

**BF-016: Eight-Stat System**
- Stats: Hunger, Water, Temperature, Humidity, Health, Stress, Cleanliness, Happiness
- Range: 0-100 per stat
- Initial state: All at 100 (except Stress at 10)
- Stat boundaries enforced (no negative, no >100)

**BF-017: Time-Based Decay**
- Decay continues when game closed (based on `last_interaction` timestamp)
- Decay rates species-specific:
  - Hunger: -2.0 to -2.5/hour
  - Water: -3.0/hour
  - Cleanliness: -1.0 to -1.5/hour
- Stats never go below 0 (floor enforced)

**BF-018: Care Action Effects**
- Feed: Hunger +40, Stress -5, Cost: 10 gold
- Water: Water +50, Stress -2, Cost: Free
- Clean: Cleanliness +30, Stress -10, Cost: 5 gold
- Actions apply immediately (no animation delay)

**BF-019: Health Degradation Triggers**
- Health degrades ONLY when critical stats low:
  - Hunger < 20 → Health -5/hour
  - Water < 20 → Health -3/hour
  - Cleanliness < 20 → Health -2/hour
- Health at 0 → "Critical" state (no death, feature disabled)

**BF-020: Auto-Save Behavior**
- Triggered on every user action (feed, water, clean)
- Debounced to 1 second (prevent excessive writes)
- Saves to localStorage (not KV in v0.3.0)
- KV sync is future feature (flag: `ENABLE_KV_SYNC = false`)

---

### 6. COLD START (S5.2.01)

**BF-021: Source of Truth Hierarchy**
- KV storage = source of truth
- localStorage = performance cache only
- Game works without localStorage
- All data recoverable from KV

**BF-022: Multi-Device Support**
- Same user_hash on different devices/browsers
- Each device fetches from KV independently
- No device-to-device sync (each reads from KV)
- Last-write-wins for stat updates (eventual consistency)

---

### 7. REGISTRATION (S3.4.01, S3.0.01)

**BF-023: Username Generation**
- Auto-generated on first load: "ChillVibesBeardedDragon42"
- Format: `{Adjective}{Adjective}{SnakeType}{Number}`
- User can customize before submission
- Username uniqueness NOT enforced (v0.3.0 limitation)

**BF-024: Email Optional**
- Email field exists but not required
- Email from Stripe checkout pre-filled if available
- No email verification
- Used only for future communications (not authentication)

**BF-025: Profile Storage**
- Separate from products: `user:{hash}` in USERS namespace
- Contains: username, email, created_at, loyalty_points, tier
- Profile independent of game state
- Deletable without losing product ownership

---

### 8. LOYALTY SYSTEM (S3.4.02, S3.0.02)

**BF-026: Points Earning**
- Conversion: €1 = 10 points
- Example: €450 purchase = 4,500 points
- Points added on webhook processing
- Accumulate across all purchases

**BF-027: Tier Thresholds**
- Bronze: 0-4,999 points
- Silver: 5,000-19,999 points
- Gold: 20,000+ points
- Tier badge displayed in game header

**BF-028: Tier-Gated Items**
- Equipment shop items restricted by tier
- Bronze users see lock icon 🔒 on Silver/Gold items
- Tooltip: "Requires {tier} tier"
- Purchase button disabled for locked items

---

### 9. EQUIPMENT SHOP (S2.4.01, S2.4.02)

**BF-029: In-Game Currency**
- Currency: Gold (not real money)
- Earned via gameplay (feeding, cleaning, achievements)
- No conversion from EUR to gold
- No microtransactions in equipment shop

**BF-030: Equipment Effects**
- Auto-Feeder: Prevents hunger decay (or reduces rate)
- Thermostat: Maintains temperature automatically
- Misting System: Maintains humidity
- Equipment persists in game state (localStorage)

**BF-031: Insufficient Funds Handling**
- Button disabled when gold < item price
- Error message: "Insufficient gold"
- No negative gold balances allowed
- Clear visual feedback (red text, disabled state)

---

### 10. ERROR HANDLING (S4.4.02, S4.4.03, S4.4.04)

**BF-032: Webhook Delay Recovery**
- Success page polls `/user-products` for 20 seconds
- Poll interval: 1 second (20 attempts max)
- After 20s: "Taking longer than expected. Check back in 1 minute."
- Manual refresh fallback provided

**BF-033: Webhook Idempotency**
- Same webhook can fire multiple times (Stripe retries)
- Worker checks if product already in user collection
- Duplicate check: Compare product_id in existing array
- Response: 200 OK (no error, just skip write)

**BF-034: Race Condition (Two Users, One Product)**
- Real products (one-time sale) only
- First webhook wins (marks product sold)
- Second webhook checks status → SOLD
- Second user: Manual refund process triggered
- Admin notified for resolution

---

### 11. DATA INTEGRITY (S5.5.01, S5.0.01)

**BF-035: Corrupted Data Recovery**
- Worker catches JSON.parse() errors
- Response: Empty array + error log (no crash)
- Admin notified for manual recovery
- User sees empty farm (better than crash)

**BF-036: KV Consistency Checks**
- Admin script validates `_index:products` against actual products
- Orphaned keys reported (in index but not in KV)
- Missing products reported (in KV but not in index)
- Manual reconciliation required

**BF-037: localStorage Loss Recovery**
- User deletes localStorage mid-session
- Game detects missing hash on next action
- Warning: "Session lost. Please refresh."
- Data fully recoverable from KV (no permanent loss)

---

### 12. NETWORK FAILURES (S5.2.02)

**BF-038: API Request Failure Handling**
- Fetch errors caught (network drop, 500 errors)
- User message: "Unable to load data. Check your connection."
- Retry button displayed
- No blank screen (graceful degradation)

---

### 13. PERFORMANCE (S5.1.01, S5.2.04, S5.4.02)

**BF-039: Catalog Scalability**
- Target: 100 products load within 2 seconds
- Images lazy-loaded (not all at once)
- No UI jank on scroll
- Pagination future feature (currently all products at once)

**BF-040: Large Collection Handling**
- Target: 20 snakes per user supported
- All snakes render in farm view
- Stats update smoothly (no memory leaks)
- Smooth scrolling with 20+ cards

**BF-041: Concurrent Webhooks**
- Cloudflare Workers handle parallel requests
- Each webhook processed independently
- No global locks (KV writes isolated by key)
- All 10 concurrent purchases succeed

---

### 14. PRODUCT TYPES (S1.2.03, FUT.2.01)

**BF-042: Real vs Virtual Products**
- Real: One-time sale, physical snakes (€45-€1500)
- Virtual: Unlimited, in-game purchases (gold only)
- Real products disappear when sold
- Virtual products always available

**BF-043: Duplicate Purchase Rules**
- Real products: Cannot buy same product twice (unique IDs)
- Virtual products: Can buy multiple of same morph
- Each virtual instance gets unique ID
- Collection displays all instances

---

### 15. SECURITY EDGE CASES (S4.5.02, S4.4.05)

**BF-044: SQL Injection Prevention**
- Input: `/user-products?user=' OR 1=1--`
- Hash validation rejects SQL patterns
- Response: 400 Bad Request
- No database (KV store), but validation still applied

**BF-045: CSRF Attack Prevention**
- Fake POST to `/stripe-webhook` without signature
- Signature validation fails
- Response: 401 Unauthorized
- No state changes

---

### 16. FUTURE FEATURES (FUT.2.01, FUT.2.02)

**BF-046: Virtual Snake Purchases (DISABLED)**
- Feature flag: `ENABLE_VIRTUAL_SNAKES = false`
- Gold-based purchases (1,000 gold per snake)
- No real money involved
- Unlockable morphs via gameplay

**BF-047: Breeding System (UNDER DEVELOPMENT)**
- Feature flag: `ENABLE_BREEDING = false`
- Requires: Male + female of same species
- Breeding timer: 30 days (simulated)
- Baby inherits parent morphs (genetics)

---

### 17. DEVELOPER TOOLS (DEV.0.01, DEV.4.01)

**BF-048: Debug Dashboard**
- Accessible at `debug.html`
- Shows: user hash, KV contents, localStorage, API status
- Manual action triggers (assign product, clear data)
- NOT accessible in production (ENV check)

**BF-049: Manual Product Assignment**
- Bypasses Stripe payment
- Script: `node scripts/assign-product.js {user_hash} {product_id}`
- Calls `/assign-product` endpoint (dev-only)
- Production endpoint requires authentication

---

### 18. EMAIL NOTIFICATIONS (S1.4.01)

**BF-050: Order Confirmation Email**
- Triggered by webhook (after KV write)
- Contains: Order details, snake info, care guide link, game link with hash
- Sent within 1 minute of purchase
- Email link directly opens `game.html?user={hash}`

---

### 19. DEMO MODE (S6.0.01)

**BF-051: Anonymous Browsing**
- Catalog fully functional without user hash
- Can view product details, species info, morphs
- Cannot access game until purchase
- "Buy Now" button leads to Stripe checkout (hash generated there)

---

### 20. DATA CLEANUP (S6.0.02)

**BF-052: Session Pruning**
- Admin script runs monthly
- Identifies users inactive >90 days
- Orphaned localStorage entries marked (but KV preserved)
- Users can always reload from KV (source of truth)

---

### 21. MULTI-PURCHASE PATTERNS (S1.2.02)

**BF-053: Collection Growth**
- User can buy 5, 10, 20+ snakes over time
- Each webhook appends to same KV entry
- No collection size limit
- All snakes display in farm view

---

### 22. PAYMENT ABSTRACTIONS

**BF-054: PaymentProcessor Interface (Implicit)**
```
Required Methods:
- createCheckoutSession(product, userHash) → URL
- handleWebhook(payload, signature) → boolean
- verifySignature(payload, signature) → boolean
- extractPurchaseData(payload) → {userId, productId, amount}
```

**BF-055: Current Implementation Constraints**
- Single payment provider (Stripe)
- Webhook endpoint provider-specific (`/stripe-webhook`)
- Multi-provider future feature (routing required)

---

### 23. STORAGE ABSTRACTIONS

**BF-056: KeyValueStore Interface (Implicit)**
```
Required Methods:
- get(key) → value
- put(key, value, options)
- list(prefix) → keys[]
- delete(key)
```

**BF-057: Eventual Consistency Trade-off**
- Writes propagate globally in 60s
- User may not see purchase immediately
- Success page polling mitigates delay
- Real-time sync future feature (WebSockets)

---

### 24. API CONTRACTS

**BF-058: GET /user-products Endpoint**
- Query param: `user` (hash, required)
- Response: 200 + JSON array
- Empty array: Valid hash, no products (not 404)
- 400: Missing/invalid hash
- 403: Malformed request

**BF-059: POST /stripe-webhook Endpoint**
- Header: `Stripe-Signature` (required)
- Body: JSON event object
- Response: 200 (success) | 400 (invalid) | 401 (bad signature)
- Side effect: KV write on `checkout.session.completed` event

**BF-060: CORS Configuration**
- Allowed origin: GitHub Pages domain
- Methods: GET (read), POST (webhook)
- Credentials: None (stateless)
- Preflight: Not required (simple requests)

---

### 25. BUSINESS CONSTRAINTS

**BF-061: No Refunds Policy (Current)**
- Purchases final (no refund handling)
- Stripe `charge.refunded` event NOT processed
- Manual refunds require admin intervention
- Future: Refund webhook handler needed

**BF-062: Inventory Model**
- Digital goods: Never "out of stock" (virtual products)
- Physical goods: One owner (real products)
- No inventory count field
- Status binary: Available | Sold

**BF-063: Currency Limitation**
- EUR only (€)
- No multi-currency support
- Stripe account configured for EUR
- No client-side conversion

---

### 26. TIME SIMULATION (Game Module)

**BF-064: Speed Multiplier**
- Options: 1x, 2x, 5x, 10x
- Affects decay rates only (not action cooldowns)
- Persisted in localStorage
- Used for testing/demo (fast progression)

---

### 27. PRODUCT SYNC (S5.4.01)

**BF-065: CRUD Operations**
- CREATE: Stripe product → webhook → KV write
- UPDATE: Product name change → webhook → KV update
- DELETE: Product archived → webhook → KV removal
- Index updated: `_index:products` maintained

---

### 28. PRIORITY SYSTEM (Scenario Matrix)

**BF-066: Priority Definitions**
- P0: Must-work (revenue/security critical) - 15 scenarios
- P1: Gameplay core - 8 scenarios
- P2: Identity/UX - 2 scenarios
- P3: Nice-to-have - 4 scenarios
- P4+: Dev tools, future features - 16 scenarios

**BF-067: Test Automation Status**
- ~70% of P0-P1 scenarios automated
- Manual testing: Webhook delays, race conditions
- Edge cases: Partial automation (need specialized tools)

---

## Abstraction Patterns Found

### 1. Hash-Based Identity
- No passwords, no OAuth, no email auth
- Client-generated, cryptographically random
- Permanent identifier across all systems
- Single point of truth for user identity

### 2. Webhook-Driven State Transitions
- Stripe payment → webhook → ownership
- No polling Stripe API for status
- Worker passive receiver (not active checker)
- Event-driven architecture

### 3. KV as Single Source of Truth
- localStorage = cache only
- All writes go to KV first
- Reads fallback to KV if localStorage empty
- Multi-device consistency via KV

### 4. Eventual Consistency Acceptance
- 60s propagation delay tolerated
- Polling mitigates user-facing delay
- Real-time sync deferred (future feature)
- Trade-off: Simplicity > instant consistency

### 5. Module Ownership Clear
- Each scenario has single owning module (1-6)
- Relations explicit (S1.234.01 = Shop relates to Game, Auth, Payment)
- External services numbered separately (11-13)
- No ambiguity in responsibility

---

## Validation Questions for AI Review

1. **Payment Abstraction:** Can we swap Stripe for PayPal without changing Shop/Game modules?
2. **Storage Abstraction:** Can we migrate from KV to PostgreSQL without rewriting business logic?
3. **Multi-Currency:** What's needed to support USD, GBP beyond just EUR?
4. **Real-Time Sync:** WebSocket addition - does it break stateless API design?
5. **Refund Handling:** What webhook events needed? Where does refund logic live?
6. **Multi-Provider:** Can we run Stripe + PayPal simultaneously with current architecture?
7. **Breeding System:** Does it conflict with current stat system or storage schema?
8. **Virtual Products:** Gold economy separate from EUR economy - abstraction sufficient?

---

**Total Facts:** 67 business rules  
**Scenario Coverage:** 45/45 scenarios analyzed  
**Abstraction Level:** Implementation-agnostic where architecture allows  
**Missing Abstractions Identified:** 8 questions for review  
**Validation Status:** 🟡 Pending AI cross-validation

**Extraction Method:** Manual reading + SMRI pattern recognition (no Fabric used)
