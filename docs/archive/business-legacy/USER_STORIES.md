# User Stories - Serpent Town v0.3.0

**Extracted from:** Source code, tests, and business logic  
**Purpose:** E2E test scenarios and acceptance criteria  
**Last Updated:** 2025-12-22  
**Priority Order:** Tier 0 (P0) → Tier 6 (P6)

---

## 📊 Priority Tiers Summary

| Tier | Category | Stories | Description |
|------|----------|---------|-------------|
| **P0** | Must-work core | 12 | Revenue → Ownership → Security |
| **P1** | Core gameplay | 7 | Retention & game loop |
| **P2** | Identity UX | 2 | Registration flow |
| **P3** | Economy meta | 5 | Progression & loyalty |
| **P4** | Dev tooling | 3 | Development aids |
| **P5** | Analytics | 1 | Business intelligence |
| **P6** | Disabled/Future | 3 | Not shipping in v0.3.0 |

**Total:** 33 user stories

---

## 🎯 Tier 0 - Must-Work Core (P0)
**Revenue → Ownership → Security**

If ANY of these break: lost sales, mis-assigned ownership, fraud, or players can't access purchases.

1. **US-001:** Browse Available Snakes (catalog entry point)
2. **US-002:** Generate User Hash (identity for ownership)
3. **US-003:** Click Buy Now (initiates purchase)
4. **US-004:** Complete Stripe Payment (revenue)
5. **US-032:** Verify Webhook Signature (security)
6. **US-005:** Webhook Assigns Snake (payment → ownership)
7. **US-033:** Validate User Hash (prevents invalid ownership)
8. **US-031:** Validate Product Schema (data integrity)
9. **US-006:** Success Page Verification (confirms ownership)
10. **US-024:** Product Status Check (shows availability)
11. **US-009:** Load Purchased Snakes (access what you bought)
12. **US-023:** Load Game from KV (ownership persistence)

---

## 🎮 Tier 1 - Core Gameplay (P1)
**Retention & "The Game Works"**

Makes the game playable after purchase.

13. **US-010:** View Snake Stats (see what you own)
14. **US-014:** Stats Decay Over Time (game loop mechanic)
15. **US-015:** Snake Health Degradation (consequence system)
16. **US-011:** Feed Snake (primary care action)
17. **US-012:** Water Snake (primary care action)
18. **US-013:** Clean Enclosure (primary care action)
19. **US-022:** Game State Auto-Save (don't lose progress)

---

## 👤 Tier 2 - Identity UX (P2)
**Nice to have, not revenue-critical**

20. **US-007:** Register After Purchase (optional profile)
21. **US-008:** Skip Registration (returning users)

---

## 💰 Tier 3 - Economy Meta (P3)
**Important later, not required for v0.3 core**

22. **US-017:** Earn Loyalty Points (retention mechanic)
23. **US-018:** Loyalty Tier Progression (unlock system)
24. **US-019:** Buy Equipment with Gold (meta progression)
25. **US-020:** Cannot Buy Without Gold (economy constraint)
26. **US-021:** Loyalty Tier Required Items (gating mechanic)

---

## 🛠️ Tier 4 - Dev/Test Tooling (P4)
**Helps shipping, not product logic**

27. **US-027:** Manual Product Assignment (testing without Stripe)
28. **US-028:** Debug Dashboard (dev tools hub)
29. **US-029:** Data Cleanup Utility (reset test data)

---

## 📈 Tier 5 - Analytics (P5)
**Useful, not essential**

30. **US-030:** Track Conversion Rate (business intelligence)

---

## 🔮 Tier 6 - Disabled/Future (P6)
**Not shipping in v0.3.0**

31. **US-016:** Buy Virtual Snake with Gold (🚫 disabled)
32. **US-025:** Breed Two Snakes (🚧 under development, flag off)
33. **US-026:** Genetic Calculator (🔮 future feature)

---

## 🛒 Shopping & Purchase Flow

### US-001: Browse Available Snakes
**As a** visitor  
**I want to** see all available snakes for sale  
**So that** I can choose which snake to buy

**Acceptance Criteria:**
- [ ] Catalog displays all products where `status === 'available'`
- [ ] Each snake shows: name, species, morph, price, image
- [ ] Species filter works (All, Ball Python, Corn Snake)
- [ ] Sold snakes are hidden from available section
- [ ] Page loads within 3 seconds
- [ ] Mobile responsive layout

**Test Files:**
- `tests/slow/frontend-to-backend.test.js` (catalog.html exists and loads)
- Source: `catalog.html`, `src/modules/shop/ui/catalog-renderer.js`

---

### US-002: Generate User Hash
**As a** first-time visitor  
**I want to** automatically get a unique identifier  
**So that** my purchases can be tracked without creating an account

**Acceptance Criteria:**
- [ ] Hash generated on first visit to catalog
- [ ] Hash is 32+ characters alphanumeric
- [ ] Hash saved to localStorage: `serpent_user_hash`
- [ ] Hash persists across page refreshes
- [ ] Hash consistent throughout purchase flow

**Test Files:**
- `tests/slow/real-scenario.test.js` (STEP 1: User browses catalog and hash is generated)
- Source: `src/auth/user-auth.js`

---

### US-003: Click Buy Now
**As a** customer  
**I want to** click "Buy Now" on a snake  
**So that** I can start the checkout process

**Acceptance Criteria:**
- [ ] Button opens Stripe Checkout in new tab
- [ ] URL includes `client_reference_id={user_hash}`
- [ ] Product metadata includes `product_id`
- [ ] Only available snakes have active Buy buttons
- [ ] Sold snakes show "SOLD OUT" disabled button

**Test Files:**
- `catalog.html` line 42 (Buy Now buttons rendered dynamically)
- Source: Stripe integration in catalog

---

### US-004: Complete Stripe Payment
**As a** customer  
**I want to** pay securely via Stripe  
**So that** I can purchase the snake

**Acceptance Criteria:**
- [ ] Stripe Checkout shows product name and price
- [ ] Payment succeeds with valid card
- [ ] Stripe sends webhook to Worker
- [ ] Webhook payload includes `client_reference_id` and `product_id`
- [ ] Webhook signature is verified

**Test Files:**
- `tests/integration/stripe-webhook-config.test.js`
- Source: `worker/worker.js` (POST /stripe-webhook)

---

### US-005: Webhook Assigns Snake
**As the** system  
**I want to** assign purchased snake to user  
**So that** they can access it in the game

**Acceptance Criteria:**
- [ ] Product written to `USER_PRODUCTS` KV (key: `user:{hash}`)
- [ ] Product status updated to 'sold' in `PRODUCT_STATUS` KV
- [ ] Assignment includes timestamp, payment_id, price_paid
- [ ] Snake stats initialized to 100 (all 8 stats)
- [ ] Webhook returns success to Stripe

**Test Files:**
- `tests/slow/real-scenario.test.js` (STEP 2: Webhook assigns snake to user in KV)
- `tests/integration/stripe-kv-sync.test.js`
- Source: `worker/worker.js` (handleStripeWebhook)

---

### US-006: Success Page Verification
**As a** customer  
**I want to** see confirmation after payment  
**So that** I know my purchase succeeded

**Acceptance Criteria:**
- [ ] Redirected to `success.html?session_id={id}`
- [ ] Page checks KV for assigned snake
- [ ] Shows "Snake purchased successfully" message
- [ ] Shows link to registration or game
- [ ] Handles case where webhook hasn't processed yet (retry)

**Test Files:**
- `tests/slow/real-scenario.test.js` (STEP 3: Success page verifies snake was assigned)
- `tests/slow/frontend-to-backend.test.js` (success.html checks for existing user)
- Source: `success.html`

---

## 👤 User Registration & Profile

### US-007: Register After Purchase
**As a** new customer  
**I want to** create a username and email  
**So that** I can access my snake in the game

**Acceptance Criteria:**
- [ ] Registration form shows username and email fields
- [ ] Username generator suggests funny names
- [ ] Email is optional
- [ ] Profile saved to KV (future feature)
- [ ] Redirected to `game.html#{user_hash}` after registration

**Test Files:**
- `tests/slow/real-scenario.test.js` (STEP 4: User completes registration)
- `tests/slow/frontend-to-backend.test.js` (register.html has username generator)
- Source: `register.html`

---

### US-008: Skip Registration (Return Customer)
**As a** returning customer  
**I want to** skip registration  
**So that** I can go straight to the game

**Acceptance Criteria:**
- [ ] Success page detects existing user in localStorage
- [ ] Shows "Welcome back" message
- [ ] Direct link to game (skip registration)
- [ ] New purchase added to existing collection

**Test Files:**
- `tests/slow/real-scenario.test.js` (STEP 7: Second purchase goes to FARM)
- `tests/slow/frontend-to-backend.test.js` (success.html checks for existing user)

---

## 🎮 Game & Snake Care

### US-009: Load Purchased Snakes
**As a** player  
**I want to** see my purchased snakes in the game  
**So that** I can start taking care of them

**Acceptance Criteria:**
- [ ] Game loads from Worker API `/user-products?user={hash}`
- [ ] All purchased snakes displayed in farm view
- [ ] Each snake shows: name, species, morph, 8 stats
- [ ] Stats display as progress bars (0-100)
- [ ] Empty state if no snakes purchased

**Test Files:**
- `tests/slow/real-scenario.test.js` (STEP 5 & 6: Game loads snakes from worker)
- `tests/slow/frontend-to-backend.test.js` (game.html loads from worker)
- Source: `game.html`, `src/modules/game/game-controller.js`

---

### US-010: View Snake Stats
**As a** player  
**I want to** see my snake's 8 stats  
**So that** I know what care it needs

**Acceptance Criteria:**
- [ ] Displays: Hunger, Water, Temperature, Humidity
- [ ] Displays: Health, Stress, Cleanliness, Happiness
- [ ] Each stat shows number (0-100) and bar
- [ ] Critical stats highlighted in red (< 20)
- [ ] Stats update in real-time

**Test Files:**
- Source: `src/modules/game/snake-care.js`
- Design: `docs/archive/DESIGN_ANSWERS.md` (Stats to Track)

---

### US-011: Feed Snake
**As a** player  
**I want to** feed my snake  
**So that** its hunger stat increases

**Acceptance Criteria:**
- [ ] Click "Feed" button
- [ ] Hunger increases by +40
- [ ] Stress decreases by -5
- [ ] Cannot feed if Hunger > 90
- [ ] 7-day cooldown enforced (realistic)
- [ ] Gold deducted for food cost (future)

**Test Files:**
- Source: `src/modules/game/snake-care.js`
- Business: `src/modules/shop/business/economy.js`

---

### US-012: Water Snake
**As a** player  
**I want to** give water to my snake  
**So that** its water stat increases

**Acceptance Criteria:**
- [ ] Click "Water" button
- [ ] Water increases by +50
- [ ] Stress decreases by -2
- [ ] Cannot water if Water > 95
- [ ] No cooldown (can water anytime)

**Test Files:**
- Source: `src/modules/game/snake-care.js`

---

### US-013: Clean Enclosure
**As a** player  
**I want to** clean my snake's enclosure  
**So that** cleanliness and stress improve

**Acceptance Criteria:**
- [ ] Click "Clean" button
- [ ] Cleanliness increases by +30
- [ ] Stress decreases by -10
- [ ] Cannot clean if Cleanliness > 85

**Test Files:**
- Source: `src/modules/game/snake-care.js`

---

### US-014: Stats Decay Over Time
**As the** system  
**I want to** decrease snake stats over time  
**So that** players must care for their snakes regularly

**Acceptance Criteria:**
- [ ] Hunger: -2.0 to -2.5 per hour
- [ ] Water: -3.0 per hour
- [ ] Cleanliness: -1.0 to -1.5 per hour
- [ ] Stress: +1.0 per hour (increases!)
- [ ] Decay rates species-specific
- [ ] Game loop runs every 5 seconds

**Test Files:**
- `tests/modules/game/tamagotchi.test.js`
- Source: `src/modules/game/plugins/decay-plugin.js`

---

### US-015: Snake Health Degradation
**As the** system  
**I want to** decrease health when stats are critical  
**So that** neglect has consequences

**Acceptance Criteria:**
- [ ] If Hunger < 20 for 48h: Health -1/hour
- [ ] If Water < 15 for 24h: Health -2/hour
- [ ] If any stat < 10: Health -5/hour (critical)
- [ ] Health reaches 0: Snake dies (permanent)
- [ ] Warning shown when health < 30

**Test Files:**
- Business: `docs/business/BUSINESS_RULES_CONSOLIDATED.md` § Snake Care Rules
- Source: `src/modules/game/snake-care.js`

---

## 💰 Economy & Equipment

### US-016: Buy Virtual Snake with Gold
**As a** player  
**I want to** buy a virtual snake using gold coins  
**So that** I can practice care without real money

**Acceptance Criteria:**
- [ ] Feature flag: `ENABLE_VIRTUAL_SNAKES = true`
- [ ] Corn Snake costs 500 gold
- [ ] Ball Python costs 1000 gold
- [ ] Gold deducted on purchase
- [ ] Snake added to collection
- [ ] Cannot buy if insufficient gold

**Test Files:**
- `tests/modules/shop/game.test.js` (Buy virtual snake)
- Source: `src/modules/shop/business/economy.js` (buyVirtualSnake)

**Status:** 🚫 Disabled in v0.3.0

---

### US-017: Earn Loyalty Points
**As a** player  
**I want to** earn loyalty points from purchases  
**So that** I can unlock discounts and benefits

**Acceptance Criteria:**
- [ ] Real purchase: 10 points per €1 spent
- [ ] Breeding success: 50 points (future)
- [ ] Daily care streak: 25 points per week
- [ ] Points accumulate (never decrease)
- [ ] Tier auto-upgrades at thresholds

**Test Files:**
- `tests/modules/shop/game.test.js` (Loyalty tier system)
- Source: `src/modules/shop/business/economy.js` (updateLoyaltyTier)

---

### US-018: Loyalty Tier Progression
**As a** player  
**I want to** progress through loyalty tiers  
**So that** I unlock better discounts

**Acceptance Criteria:**
- [ ] Bronze: 0 points, 0% discount
- [ ] Silver: 100 points, 5% discount
- [ ] Gold: 500 points, 10% discount
- [ ] Platinum: 1500 points, 15% discount
- [ ] Tier displayed in game header
- [ ] Cannot downgrade tiers

**Test Files:**
- `tests/modules/shop/game.test.js` (Loyalty tier system, Loyalty discounts)
- Source: `src/modules/shop/business/economy.js`

---

### US-019: Buy Equipment with Gold
**As a** player  
**I want to** buy equipment for my snake  
**So that** care tasks are automated

**Acceptance Criteria:**
- [ ] Equipment shop shows 15+ items
- [ ] Items cost gold coins
- [ ] Auto-feeder: 500 gold (Hunger +10/day)
- [ ] Auto-waterer: 400 gold (Water +15/day)
- [ ] Thermostat: 800 gold (Temp stable ±2°)
- [ ] Cannot buy without sufficient gold
- [ ] Some items require loyalty tier

**Test Files:**
- `tests/modules/shop/game.test.js` (Get available equipment, Buy equipment with gold)
- Source: `src/modules/shop/business/equipment.js`

---

### US-020: Cannot Buy Without Gold
**As the** system  
**I want to** prevent purchases when gold is insufficient  
**So that** players cannot overspend

**Acceptance Criteria:**
- [ ] Check balance before purchase
- [ ] Show error: "Insufficient gold"
- [ ] Button disabled if cannot afford
- [ ] Display required vs current balance

**Test Files:**
- `tests/modules/shop/game.test.js` (Cannot buy without gold)
- Source: `src/modules/shop/business/equipment.js`

---

### US-021: Loyalty Tier Required Items
**As the** system  
**I want to** restrict premium items to higher tiers  
**So that** loyalty is rewarded

**Acceptance Criteria:**
- [ ] Premium items show tier requirement
- [ ] Bronze users cannot buy silver+ items
- [ ] Error: "Requires {tier} tier"
- [ ] Badge shown on locked items

**Test Files:**
- `tests/modules/shop/game.test.js` (Loyalty tier requirements)
- Source: `src/modules/shop/business/equipment.js`

---

## 🔄 Data Persistence & Sync

### US-022: Game State Auto-Save
**As the** system  
**I want to** save game state every 5 minutes  
**So that** player progress is not lost

**Acceptance Criteria:**
- [ ] Auto-save every 5 minutes
- [ ] Save on every care action
- [ ] Saved to localStorage: `serpent_town_game_state`
- [ ] Includes: snakes, gold, loyalty, equipment
- [ ] Shows "Saved" indicator

**Test Files:**
- `tests/slow/real-scenario.test.js` (STEP 8: LocalStorage persists user session)
- Source: `src/modules/game/game-state.js`

---

### US-023: Load Game from KV
**As a** player  
**I want to** load my snakes from the server  
**So that** purchases sync across devices

**Acceptance Criteria:**
- [ ] Fetch from `/user-products?user={hash}`
- [ ] Merge server data with local state
- [ ] Server ownership = source of truth
- [ ] Local stats = latest if newer
- [ ] Conflict resolution: server wins for ownership

**Test Files:**
- `tests/slow/real-scenario.test.js` (STEP 5 & 6)
- Source: `src/modules/game/game-controller.js`

---

### US-024: Product Status Check
**As the** system  
**I want to** check if products are sold  
**So that** catalog shows accurate availability

**Acceptance Criteria:**
- [ ] Call `/product-status?id={product_id}` for each snake
- [ ] Response: `{status: 'available' | 'sold', owner_id}`
- [ ] Hide sold products from available section
- [ ] Show sold products in collapsed "Sold" section
- [ ] Cache for 5 minutes

**Test Files:**
- Source: `worker/worker.js` (GET /product-status)
- Business: `docs/business/BUSINESS_RULES_CONSOLIDATED.md` § Ownership & Status Rules

---

## 🧬 Breeding (Future Feature)

### US-025: Breed Two Snakes
**As a** player  
**I want to** breed two compatible snakes  
**So that** I can create offspring with new morphs

**Acceptance Criteria:**
- [ ] Both snakes same species
- [ ] Both Health > 80, Happiness > 70, Stress < 30
- [ ] Female: Age ≥ 3 years, last breed > 365 days
- [ ] Male: Age ≥ 3 years, last breed > 30 days
- [ ] Genetics calculated (dominant/recessive)
- [ ] Clutch of 4-10 eggs laid
- [ ] 55-60 day incubation period

**Test Files:**
- Design: `docs/archive/DESIGN_ANSWERS.md` (BREEDING & GENETICS)
- Business: `docs/business/BUSINESS_RULES_CONSOLIDATED.md` § Breeding Rules

**Status:** 🚧 Under development (feature flag disabled)

---

### US-026: Genetic Calculator
**As a** player  
**I want to** see predicted offspring morphs  
**So that** I can plan breeding combinations

**Acceptance Criteria:**
- [ ] Shows % chance for each morph
- [ ] Accounts for dominant/recessive genes
- [ ] Co-dominant shown as blended
- [ ] Follows real ball python genetics
- [ ] No impossible morphs created

**Test Files:**
- Source: `src/modules/game/breeding.js` (future)

**Status:** 🔮 Future feature

---

## 📊 Admin & Testing

### US-027: Manual Product Assignment (Dev)
**As a** developer  
**I want to** manually assign products to users  
**So that** I can test without Stripe

**Acceptance Criteria:**
- [ ] POST `/assign-product` with `{user_id, product_id}`
- [ ] Same behavior as webhook (create assignment, mark sold)
- [ ] Returns assignment object
- [ ] Dev-only endpoint (not for production)

**Test Files:**
- `tests/slow/real-scenario.test.js` (uses assign endpoint)
- Source: `worker/worker.js` (POST /assign-product)

---

### US-028: Debug Dashboard
**As a** developer  
**I want to** see all dev tools in one place  
**So that** I can quickly access what I need

**Acceptance Criteria:**
- [ ] Links to: catalog, game, debug, cleanup
- [ ] Shows current environment (dev/prod)
- [ ] Shows Worker config status
- [ ] Quick test buttons (assign product, clear storage)

**Test Files:**
- Source: `dashboard.html`

---

### US-029: Data Cleanup Utility
**As a** developer  
**I want to** clear test data  
**So that** I can reset during development

**Acceptance Criteria:**
- [ ] Clear localStorage button
- [ ] Clear specific keys only (not all browser data)
- [ ] Confirm before clearing
- [ ] Shows what will be deleted
- [ ] Cannot clear KV (server-side only)

**Test Files:**
- Source: `cleanup.html`

---

## 📈 Success Metrics

### US-030: Track Conversion Rate
**As a** business owner  
**I want to** track catalog view → purchase rate  
**So that** I can measure sales effectiveness

**Acceptance Criteria:**
- [ ] Log catalog page views
- [ ] Log "Buy Now" clicks
- [ ] Log successful purchases
- [ ] Calculate conversion funnel
- [ ] Anonymous (hash-based, no PII)

**Test Files:**
- Business: `docs/business/BUSINESS_RULES_CONSOLIDATED.md` § Business Metrics

**Status:** 🔮 Future feature (analytics)

---

## 🔒 Security & Validation

### US-031: Validate Product Schema
**As the** system  
**I want to** validate products before saving  
**So that** invalid data is rejected

**Acceptance Criteria:**
- [ ] Required: id, name, species, morph, price, type, status
- [ ] Real products: stripe_link, currency, source='stripe'
- [ ] Price > 0
- [ ] Species in ['ball_python', 'corn_snake']
- [ ] Status in ['available', 'sold']
- [ ] Return 400 if validation fails

**Test Files:**
- Business: `docs/business/BUSINESS_RULES_CONSOLIDATED.md` § Validation & Constraints
- Source: `worker/worker.js` (validateProduct function)

---

### US-032: Verify Webhook Signature
**As the** system  
**I want to** verify Stripe webhook signatures  
**So that** fake webhooks are rejected

**Acceptance Criteria:**
- [ ] Check `stripe-signature` header
- [ ] Use `STRIPE_WEBHOOK_SECRET` to verify
- [ ] Return 400 if signature invalid
- [ ] Log failed verification attempts

**Test Files:**
- Source: `worker/worker.js` (handleStripeWebhook)
- Design: `docs/business/stripe-kv-sync-strategy.md` § Security Considerations

---

### US-033: Validate User Hash
**As the** system  
**I want to** validate user hashes  
**So that** invalid requests are rejected

**Acceptance Criteria:**
- [ ] Hash must be string
- [ ] Hash length ≥ 32 characters
- [ ] Hash must be alphanumeric (hex)
- [ ] Return 400 if invalid
- [ ] Sanitize input (prevent injection)

**Test Files:**
- Business: `docs/business/BUSINESS_RULES_CONSOLIDATED.md` § Validation & Constraints
- Source: `worker/worker.js` (validateUserHash function)

---

## 📝 Total User Stories: 33

**Categories:**
- Shopping & Purchase: 6 stories
- User Registration: 2 stories
- Game & Care: 7 stories
- Economy & Equipment: 6 stories
- Data Persistence: 3 stories
- Breeding (future): 2 stories
- Admin & Testing: 3 stories
- Success Metrics: 1 story
- Security: 3 stories

**Implementation Status:**
- ✅ Implemented: 25 stories
- 🚫 Disabled: 2 stories (virtual snakes, breeding)
- 🚧 In Development: 2 stories
- 🔮 Future: 4 stories

---

**Next Steps:**
1. Convert these to E2E tests using Playwright/Puppeteer
2. Add to CI/CD pipeline
3. Track coverage in test reports
4. Update as features are added

---

**Sources:**
- `tests/modules/shop/game.test.js` - 15 functional tests
- `tests/slow/real-scenario.test.js` - 9 user flow tests
- `tests/slow/frontend-to-backend.test.js` - 11 integration tests
- `src/modules/shop/business/economy.js` - Economy logic
- `src/modules/shop/business/equipment.js` - Equipment shop
- `catalog.html`, `game.html`, `success.html` - User interfaces
- `worker/worker.js` - API endpoints
- `docs/business/BUSINESS_RULES_CONSOLIDATED.md` - Business rules
- `docs/archive/DESIGN_ANSWERS.md` - Design specifications

**Maintained by:** Development Team  
**Version:** 0.3.0  
**Last Updated:** 2025-12-22
