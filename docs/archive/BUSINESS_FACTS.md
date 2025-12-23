# Business Facts - Serpent Town

**Status:** ⚠️ ARCHIVED - See [MAIN_PURCHASE_FLOW.md](../MAIN_PURCHASE_FLOW.md) for current purchase flow

**Extracted from:** E2E_TEST_SCENARIOS.md  
**Version:** v0.5.0  
**Purpose:** Abstract business rules independent of implementation

---

## Core Business Model

### 1. Product Purchase
- **Product:** Snakes (Ball Python, Corn Snake) with different morphs
- **Payment Method:** Abstracted payment processor (currently Stripe)
- **Price Range:** €45 - €1500+ depending on morph rarity
- **Purchase Flow:**
  1. User browses catalog
  2. User initiates checkout with payment processor
  3. Payment processor handles transaction
  4. System receives payment confirmation webhook
  5. Product ownership recorded in storage
  6. User gains access to purchased product in game

### 2. User Identity
- **Authentication:** Hash-based identity (32+ character string)
- **Identity Creation:** Generated at first purchase
- **Identity Persistence:** Stored in browser local storage
- **Identity Usage:** Passed to payment processor, used for ownership lookup

### 3. Data Storage
- **Storage Abstraction:** Key-value store (currently Cloudflare KV)
- **Key Pattern:** `user_products:{user_hash}`
- **Data Structure:** JSON array of purchased product objects
- **Persistence:** Permanent (no expiration)

### 4. Ownership Model
- **Owner:** User identified by hash
- **Asset:** Snake with species, morph, base stats
- **Proof:** Record in key-value storage
- **Access Control:** Read-only API requires valid user hash

---

## Payment Abstraction

### Payment Processor Interface
```
PaymentProcessor {
  createCheckoutSession(product, userHash)
  handleWebhook(payload, signature)
  verifySignature(payload, signature) → boolean
  extractPurchaseData(payload) → {userId, productId, amount}
}
```

### Required Capabilities
- Generate checkout URL with customer reference ID
- Send webhooks on successful payment
- Provide signature verification for webhooks
- Support EUR currency
- Handle payment amounts €45+

### Current Implementation: Stripe
- Checkout: Stripe Checkout Sessions
- Webhooks: `checkout.session.completed` event
- Signature: `Stripe-Signature` header with secret verification
- Customer ID: `client_reference_id` field

---

## Storage Abstraction

### Key-Value Store Interface
```
KeyValueStore {
  get(key) → value
  put(key, value, options)
  list(prefix) → keys[]
  delete(key)
}
```

### Required Capabilities
- Store JSON data (10KB+ per record)
- Retrieve by exact key match
- No expiration (permanent storage)
- Global edge network (low latency reads)

### Current Implementation: Cloudflare KV
- Namespace: `USER_PRODUCTS`
- Consistency: Eventual (60s global propagation)
- Key format: `user_products:{hash}`
- Value: JSON stringified array

---

## Game Mechanics

### 3. Snake Care System
- **Stats:** 8 metrics (Hunger, Water, Temperature, Humidity, Health, Stress, Cleanliness, Happiness)
- **Range:** 0-100 per stat
- **Decay:** Time-based degradation (per hour at 1x speed)
- **Care Actions:** Feed, Water, Clean (restore stat values)
- **Death Condition:** Any stat reaches 0

### 4. Equipment Shop
- **Categories:** Feeders, Thermostats, Misting systems, Hides, Substrates
- **Function:** Reduce manual care frequency via automation
- **Purchase:** In-game currency (not real money)

### 5. Time Simulation
- **Speed Options:** 1x, 2x, 5x, 10x
- **Purpose:** Accelerate gameplay for testing/demo
- **State:** Persisted in browser local storage

---

## Security Rules

### 6. User Hash Validation
- **Minimum Length:** 32 characters
- **Format:** Hexadecimal string [a-f0-9]
- **Generation:** Cryptographically random (client-side)
- **Rejection:** Invalid hashes return 400 error

### 7. Webhook Security
- **Signature Required:** Every webhook must include signature header
- **Verification:** HMAC-SHA256 against shared secret
- **Replay Prevention:** Timestamp validation (5-minute window)
- **Invalid Signature:** Reject with 400, log attempt

### 8. Access Control
- **Ownership Verification:** User can only read their own products
- **No Cross-User Access:** Hash mismatch returns empty array (not error)
- **No Admin Override:** No backdoor access to all user data

---

## Data Integrity Rules

### 9. Idempotent Writes
- **Rule:** Same webhook can fire multiple times
- **Handling:** Check if product already exists before adding
- **Key:** Combine user_hash + product_id for uniqueness

### 10. Atomic Updates
- **Rule:** Product additions must be all-or-nothing
- **Implementation:** Read → Modify → Write pattern
- **Conflict Resolution:** Last write wins (eventual consistency)

### 11. Schema Validation
- **Rule:** All product records must match schema
- **Required Fields:** id, name, species, morph, price, purchased_at
- **Type Enforcement:** String/number validation before storage

---

## API Contracts

### 12. Product Lookup Endpoint
```
GET /user-products?user={hash}
Response: 200 + JSON array
Error Cases:
- Missing user param → 400
- Invalid hash format → 400
- Valid hash, no products → 200 + []
```

### 13. Webhook Endpoint
```
POST /stripe-webhook
Headers: Stripe-Signature (required)
Body: JSON event object
Response: 200 (success) | 400 (invalid)
Side Effect: KV write on checkout.session.completed
```

### 14. CORS Rules
- **Allowed Origin:** GitHub Pages domain only
- **Methods:** GET (read), POST (webhook)
- **Credentials:** None (stateless API)

---

## Business Constraints

### 15. Single Payment Provider
- **Limitation:** One active payment provider at a time
- **Reason:** Webhook endpoints are provider-specific
- **Future:** Could support multiple via routing logic

### 16. No Refunds (Current)
- **Policy:** Purchases are final
- **Implementation:** No refund webhook handling
- **Future:** Would require `charge.refunded` event handling

### 17. No Inventory Limits
- **Rule:** Products never go "out of stock"
- **Reason:** Digital goods (game assets)
- **Implication:** Unlimited purchases per user

### 18. EUR Currency Only
- **Constraint:** All prices in EUR (€)
- **Reason:** Stripe account configuration
- **Conversion:** Not supported client-side

---

## Error Handling Abstractions

### 19. Payment Failure
- **Trigger:** User cancels checkout OR card declined
- **Handling:** No webhook fired, no record created
- **User Experience:** Return to catalog, show generic error

### 20. Storage Unavailable
- **Trigger:** KV storage read/write fails
- **Handling:** Return 503, log error, retry logic
- **User Experience:** "Service unavailable" message

### 21. Webhook Processing Failure
- **Trigger:** Invalid signature, malformed payload, storage write failure
- **Handling:** Return 400/500, log full details, alert monitoring
- **Stripe Behavior:** Retries webhook up to 3 days

---

## Scalability Abstractions

### 22. Edge Computing
- **Architecture:** Serverless workers deployed globally
- **Benefit:** Low latency for all users
- **Trade-off:** Eventual consistency for writes

### 23. Stateless API
- **Design:** No server-side sessions
- **Authentication:** User hash in every request
- **Scaling:** Horizontal (add more workers)

### 24. Cache Strategy
- **Reads:** KV storage acts as cache (60s propagation)
- **Writes:** Direct to storage (no cache invalidation)
- **Problem:** Users may not see purchase for 60s after webhook

---

## Module Boundaries (Abstract)

### 25. Shop Module
- **Responsibility:** Display products, link to payment processor
- **No Business Logic:** Does not handle payments or storage
- **Output:** User navigation to payment processor

### 26. Payment Module
- **Responsibility:** Handle webhook, validate signature, extract purchase data
- **No Storage Logic:** Delegates to storage abstraction
- **Output:** Validated purchase event

### 27. Worker Module
- **Responsibility:** Route requests, orchestrate modules
- **No Business Rules:** Delegates to domain modules
- **Output:** HTTP responses

### 28. Game Module
- **Responsibility:** Fetch owned products, render game state
- **No Payment Logic:** Assumes ownership already established
- **Input:** User hash from URL/localStorage

---

## Testing Abstractions

### 29. Test Data Isolation
- **Rule:** Each test uses unique user hash
- **Benefit:** Parallel test execution
- **Cleanup:** Optional (storage is effectively infinite)

### 30. Mock Payment Provider
- **Use Case:** Local development without Stripe
- **Interface:** Same webhook format
- **Implementation:** Generate fake checkout.session.completed events

### 31. Test KV Store
- **Use Case:** Run tests without Cloudflare account
- **Interface:** In-memory key-value map
- **Limitation:** No eventual consistency simulation

---

## Future Abstractions

### 32. Multi-Payment Support
- **Goal:** Accept Stripe, PayPal, crypto
- **Implementation:** Payment provider router based on checkout URL
- **Webhook Routing:** Path-based (e.g., /webhook/stripe, /webhook/paypal)

### 33. Database Migration
- **Goal:** Move from KV to relational DB
- **Abstraction:** Repository pattern (already implicit)
- **Query Changes:** Support product filtering, sorting

### 34. Real-Time Updates
- **Goal:** User sees purchase immediately (no 60s delay)
- **Implementation:** WebSocket or Server-Sent Events
- **Storage:** Still eventual consistency, client polls faster

---

**Total Facts:** 34  
**Abstraction Level:** Implementation-agnostic where possible  
**Validation Status:** 🟡 Pending AI review
