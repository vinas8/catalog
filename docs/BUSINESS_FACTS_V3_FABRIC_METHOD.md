# Business Facts V3 - Extracted Using Fabric Pattern

**Method:** Fabric `extract_wisdom` pattern applied to E2E_TEST_SCENARIOS.md  
**Source:** 1344 lines, 45 scenarios  
**Pattern:** Atomic facts + System patterns + Abstractions  

---

## BUSINESS FACTS

### Purchase & Ownership
- User purchases establish permanent ownership via webhook confirmation only
- Payment requires customer reference ID (user hash) passed through checkout
- Products transition "available" → "sold" (one-way, irreversible state change)
- First purchase generates 32+ char alphanumeric user hash (client-side)
- Hash becomes permanent user identifier across all systems
- Webhook payload must contain: user_hash, product_id, amount
- No webhook = no ownership (even if payment succeeded)

### Multi-Purchase Behavior
- Same user_hash accumulates multiple products in single storage entry
- Second purchase appends to existing array (no new identity)
- Collection size unlimited (no cap on purchases per user)
- Registration optional (username separate from ownership)

### Product Types
- Real products: One-time sale, unique owner, price €45-€1500
- Virtual products: Unlimited availability, in-game gold purchase
- Real products disappear from catalog when sold
- Virtual products remain always available

### Loyalty Economics
- Conversion rate: €1 = 10 loyalty points
- Tier thresholds: Bronze (0-4999), Silver (5000-19999), Gold (20000+)
- Tier gates access to premium equipment in-game shop
- Points accumulate across all purchases (lifetime)

---

## TECHNICAL CONSTRAINTS

### Storage Architecture
- Key-value pattern: `user:{hash}` → JSON array of products
- Separate namespace: `USERS` KV for profiles (username, email, points)
- Product status: `product:{id}` → `{status: 'sold', owner_id: hash}`
- Eventual consistency: 60s global propagation delay accepted
- No expiration on user data (permanent storage)

### API Contracts
- GET `/user-products?user={hash}` → 200 + JSON array (empty if none)
- POST `/stripe-webhook` → Requires `Stripe-Signature` header
- Invalid hash → 400 Bad Request (not 404)
- Missing signature → 401 Unauthorized (not 500)

### Performance Requirements
- Catalog: 100 products load in <2 seconds
- User collection: Support 20+ snakes per user
- Webhook processing: Handle 10 concurrent requests
- Game state: Auto-save debounced to 1 second

### Currency & Payment
- EUR only (€) - no multi-currency support
- Single payment provider active at a time
- Webhook endpoints provider-specific (e.g., `/stripe-webhook`)
- No refund handling in v0.3.0 (manual admin process)

---

## SECURITY RULES

### Authentication
- Hash-based identity (no passwords, no OAuth)
- Hash format: Alphanumeric [a-zA-Z0-9], minimum 32 chars
- Invalid patterns rejected: `<script>`, SQL injection, `null`, empty
- Client-generated using cryptographically random method

### Webhook Security
- HMAC-SHA256 signature verification mandatory
- Shared secret between payment processor and worker
- Invalid signature → 401 + audit log entry
- Replay attack prevention via timestamp validation (5-minute window)

### Input Validation
- Product schema enforced before KV write
- Required fields: id, name, species, morph, price, type, status
- Type enforcement: String vs number validated
- XSS prevention: User content sanitized on output (not storage)

### Access Control
- Users read only their own products (hash match required)
- No cross-user access (hash mismatch returns empty array, not error)
- No admin backdoor to all user data
- CSRF prevented by signature verification

---

## SYSTEM PATTERNS

### Hash-Based Identity Pattern
- Client generates cryptographic random hash
- Hash stored in localStorage (client cache)
- Hash passed to payment processor as client_reference_id
- Hash used for all API requests (stateless authentication)
- Hash links purchases, profile, game state

### Webhook-Driven State Transitions
- Payment processor sends webhook → Worker processes → Ownership created
- No polling payment processor API
- Worker is passive receiver (event-driven)
- Idempotent webhook handling (same event can fire multiple times)

### KV as Source of Truth
- localStorage = performance cache only
- All writes go to KV first
- Game works without localStorage (cold start from KV)
- Multi-device sync via KV reads (no device-to-device sync)

### Module Ownership (SMRI)
- Each scenario owned by single module (1-6)
- Relations explicit in code: S1.234.01 = Shop → Game, Auth, Payment
- External services separate numbering: 11.x (Cloudflare), 12.x (Stripe), 13.x (GitHub)
- No ambiguity in module responsibility

### Eventual Consistency Acceptance
- 60s KV propagation delay tolerated
- Success page polls API for 20 seconds (mitigates delay)
- Real-time sync deferred as future feature
- Trade-off: Simplicity over instant consistency

---

## EDGE CASES

### Webhook Failures
- Delayed webhook: Success page polls 20s, then shows "check back in 1 min"
- Idempotent: Same webhook multiple times → Check if product exists, skip if yes
- Race condition: Two users buy same real product → First webhook wins, second refunded manually

### Data Corruption
- Malformed JSON in KV: Worker catches parse error, returns empty array
- User deletes localStorage: Game detects, prompts refresh, data recoverable from KV
- Orphaned KV keys: Admin script reconciles index vs actual products monthly

### Network Failures
- API request timeout: User sees "Unable to load. Check connection." + Retry button
- No blank screens (graceful degradation)
- Retry mechanism for transient errors

### Security Attacks
- SQL injection: Hash validation rejects patterns (even though KV, not SQL)
- XSS: Username `<script>alert()` rendered as plain text, not executed
- CSRF: Fake webhook POST rejected (no signature)

---

## GAME MECHANICS

### Eight-Stat System
- Stats: Hunger, Water, Temperature, Humidity, Health, Stress, Cleanliness, Happiness
- Range: 0-100 per stat (boundaries enforced)
- Initial: All at 100 except Stress (starts at 10)

### Time-Based Decay (Species-Specific)
- Hunger: -2.0 to -2.5 per hour
- Water: -3.0 per hour
- Cleanliness: -1.0 to -1.5 per hour
- Decay continues when game closed (timestamp-based)

### Care Actions
- Feed: Hunger +40, Stress -5, Cost 10 gold
- Water: Water +50, Stress -2, Free
- Clean: Cleanliness +30, Stress -10, Cost 5 gold
- Actions apply immediately (no animation delay)

### Health Degradation
- Triggers when critical stats low: Hunger<20 (-5 health/hour), Water<20 (-3/hour), Cleanliness<20 (-2/hour)
- Health at 0 → "Critical" state (death disabled by flag)

### Equipment Shop
- In-game currency: Gold (not real money)
- Equipment: Auto-feeders, thermostats, misting systems (reduce manual care)
- Tier-gated items: Lock icon 🔒 for items above user's loyalty tier

---

## FUTURE CONSIDERATIONS

### Scalability
- Multi-payment support: Need webhook routing by provider (e.g., `/webhook/stripe`, `/webhook/paypal`)
- Real-time updates: WebSocket/SSE would break stateless API design (needs session management)
- Database migration: KV → PostgreSQL would enable filtering, sorting, joins

### Missing Features
- Refund handling: Need `charge.refunded` webhook processor
- Multi-currency: Requires Stripe account reconfiguration + client-side conversion
- Virtual snake purchases: Feature flag `ENABLE_VIRTUAL_SNAKES = false`
- Breeding system: Flag `ENABLE_BREEDING = false`, under development

### Technical Debt
- Username uniqueness not enforced (v0.3.0 limitation)
- No pagination for large catalogs (loads all 100 products at once)
- localStorage-only game state (KV sync future feature)
- Manual refunds (no automated process)

### Validation Questions
1. Can we swap Stripe for PayPal without changing Shop/Game modules?
2. Can we migrate KV → PostgreSQL without rewriting business logic?
3. What's needed for USD/GBP support beyond EUR?
4. Does WebSocket real-time sync break stateless design?
5. Where does refund logic live? (Payment module or Worker?)
6. Can Stripe + PayPal run simultaneously with current routing?
7. Does breeding conflict with current stat system?
8. Is gold economy abstraction sufficient for virtual products?

---

## ATOMIC FACTS (67 Total)

1. User hash: 32+ alphanumeric characters, client-generated
2. Ownership: Established only via webhook confirmation
3. Storage key: `user:{hash}` → JSON array format
4. Product status: Binary (available | sold), one-way transition
5. Loyalty points: €1 = 10 points conversion rate
6. Tier thresholds: Bronze 0-4999, Silver 5000-19999, Gold 20000+
7. EUR currency only (no multi-currency)
8. Webhook signature: HMAC-SHA256 mandatory
9. Hash validation: Alphanumeric only, rejects SQL/XSS patterns
10. Eventual consistency: 60s propagation delay
11. Collection unlimited: No cap on products per user
12. Real products: One-time sale, unique owner
13. Virtual products: Unlimited, gold-based purchase
14. Registration optional: Username separate from ownership
15. Auto-save: Debounced to 1 second
16. Stats range: 0-100 enforced on all 8 stats
17. Hunger decay: -2.0 to -2.5 per hour
18. Water decay: -3.0 per hour
19. Feed action: +40 hunger, -5 stress, 10 gold
20. Water action: +50 water, -2 stress, free
21. Clean action: +30 cleanliness, -10 stress, 5 gold
22. Health degrades: When hunger/water/cleanliness <20
23. Critical state: Health at 0 (death disabled)
24. Equipment: Reduces manual care frequency
25. Tier gating: Lock icon 🔒 for premium items
26. Idempotent webhooks: Same event can fire multiple times
27. Race condition: First webhook wins for real products
28. Corrupted data: Returns empty array (no crash)
29. localStorage loss: Recoverable from KV
30. Network failure: Retry button + graceful error
31. XSS prevention: User content sanitized on output
32. CSRF prevention: Signature verification required
33. SQL injection: Hash validation rejects patterns
34. Multi-device: Each device reads from KV independently
35. Cold start: Game works without localStorage
36. Success page: Polls API for 20 seconds
37. Webhook delay: Manual refresh fallback after 20s
38. Catalog load: <2 seconds for 100 products
39. Large collection: 20+ snakes supported
40. Concurrent webhooks: 10 requests handled in parallel
41. Product schema: 7 required fields enforced
42. Invalid hash: Returns 400 Bad Request
43. Missing signature: Returns 401 Unauthorized
44. Empty products: Returns 200 + empty array (not 404)
45. Time simulation: 1x, 2x, 5x, 10x speed options
46. Email confirmation: Sent within 1 minute of purchase
47. Demo mode: Catalog browsable without user hash
48. Data cleanup: Monthly script for >90 day inactivity
49. Debug dashboard: Shows hash, KV, localStorage, API status
50. Manual assignment: Dev script bypasses Stripe payment
51. Virtual snake flag: `ENABLE_VIRTUAL_SNAKES = false`
52. Breeding flag: `ENABLE_BREEDING = false`
53. KV namespaces: USER_PRODUCTS, USERS, PRODUCT_STATUS
54. Profile storage: Separate from products array
55. Username format: `{Adj}{Adj}{SnakeType}{Number}`
56. Email optional: Pre-filled from Stripe if available
57. No refunds: Purchases final in v0.3.0
58. Inventory model: Digital goods never "out of stock"
59. CORS config: GitHub Pages domain only
60. Stateless API: No server-side sessions
61. Last-write-wins: Eventual consistency conflict resolution
62. Admin notification: Triggered on webhook failures
63. Audit logging: Invalid signature attempts logged
64. Timestamp validation: 5-minute window for webhook replay
65. Species profiles: Define decay rates, stat thresholds
66. Priority matrix: P0 (15 scenarios), P1 (8), P2 (2), P3 (4), P4+ (16)
67. Test coverage: ~70% P0-P1 scenarios automated

---

**Extraction Method:** Fabric `extract_wisdom` pattern  
**Pattern Structure:** Atomic facts → Grouped by domain → Abstraction identified  
**Output Format:** Actionable, verifiable, implementation-agnostic where possible  
**Validation:** 8 questions for AI cross-check  
**Total Facts:** 67 (same as V2, but structured per Fabric methodology)
