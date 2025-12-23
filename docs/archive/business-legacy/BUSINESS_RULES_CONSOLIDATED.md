# Business Rules - Complete Consolidation

**Version:** 0.3.0  
**Last Updated:** 2025-12-22  
**Status:** Authoritative Reference

---

## 📋 Table of Contents

1. [Product Catalog Rules](#product-catalog-rules)
2. [Purchase & Payment Rules](#purchase--payment-rules)
3. [Ownership & Status Rules](#ownership--status-rules)
4. [Game Economy Rules](#game-economy-rules)
5. [Snake Care Rules](#snake-care-rules)
6. [Breeding Rules](#breeding-rules)
7. [Data Storage Rules](#data-storage-rules)
8. [API & Integration Rules](#api--integration-rules)
9. [Feature Flags](#feature-flags)
10. [Validation & Constraints](#validation--constraints)

---

## 🏪 Product Catalog Rules

### Display Rules

**Available Products Section:**
- ✅ MUST show all products where `status === 'available'`
- ✅ MUST show `type === 'real'` products from Stripe
- ❌ MUST NOT show products where `status === 'sold'`
- ✅ MUST support species filtering (Ball Python, Corn Snake, All)
- ✅ MUST show product price in original currency (EUR/USD)

**Sold Products Section:**
- ✅ MUST be collapsed by default
- ✅ MUST show products where `status === 'sold'`
- ✅ MUST display owner information if available
- ✅ MUST show "SOLD OUT" badge
- ❌ MUST disable "Buy Now" button for sold products

**Virtual Products Section:** (🚫 DISABLED v0.3.0)
- Feature flag: `ENABLE_VIRTUAL_SNAKES = false`
- ❌ MUST NOT display in catalog
- Future: May be re-enabled with feature flag

### Data Source Rules

**Production Environment (GitHub Pages):**
- ✅ PRIMARY: Cloudflare Worker API `/products` endpoint
- ✅ MUST read from KV namespace: `PRODUCTS` (ID: `ecbcb79f3df64379863872965f993991`)
- ❌ MUST NOT use JSON file fallback
- ✅ MUST handle API failure gracefully (show error message)

**Development Environment (localhost):**
- ✅ PRIMARY: Cloudflare Worker API `/products` endpoint
- ✅ FALLBACK: `docs/temp/test-data/products.json` (offline testing only)
- ⚠️ JSON file MUST mirror Worker data structure

**Deprecated (DO NOT USE):**
- ❌ `data/products.json` - No longer maintained
- ❌ Direct JSON loading in production

### Product Schema Requirements

**Required Fields (ALL products):**
```javascript
{
  id: string,          // MUST be unique, format: 'prod_*'
  name: string,        // MUST be 1-100 characters
  species: string,     // MUST be valid species enum
  morph: string,       // MUST be valid morph for species
  price: number,       // MUST be > 0
  type: string,        // MUST be 'real' | 'virtual'
  status: string       // MUST be 'available' | 'sold'
}
```

**Required for Real Products:**
```javascript
{
  stripe_link: string,    // MUST be valid Stripe checkout URL
  source: 'stripe',       // MUST be literal 'stripe'
  currency: string,       // MUST be 'eur' | 'usd'
  unique: true           // MUST be true (real snakes are unique)
}
```

**Optional Fields:**
```javascript
{
  description: string,
  images: string[],
  sex: 'male' | 'female' | 'unknown',
  birth_year: number,
  weight_grams: number,
  owner_id: string | null
}
```

---

## 💳 Purchase & Payment Rules

### Stripe Checkout Flow

**URL Structure:**
```
{stripe_link}?client_reference_id={user_hash}
```

**Requirements:**
- ✅ MUST include `client_reference_id` in checkout URL
- ✅ `client_reference_id` MUST be user's hash from localStorage
- ✅ Hash MUST be 32+ characters alphanumeric
- ✅ Checkout session MUST include product metadata

**Post-Purchase Flow:**
1. User completes payment on Stripe
2. Stripe sends webhook to Worker (`/stripe-webhook`)
3. Worker saves to `USER_PRODUCTS` KV
4. Worker marks product as sold in `PRODUCT_STATUS` KV
5. User redirected to `success.html?session_id={CHECKOUT_SESSION_ID}`
6. User registers profile (username, email)
7. User redirected to `game.html#{user_hash}`
8. Game loads purchased snakes from Worker API

**Validation Rules:**
- ✅ MUST verify webhook signature (Stripe signature verification)
- ✅ MUST check product is available before marking sold
- ✅ MUST NOT allow duplicate purchases of same real product
- ✅ MUST handle webhook idempotency (Stripe may retry)

### Payment Webhook Processing

**Event: `checkout.session.completed`**

**Extract:**
```javascript
{
  client_reference_id: string,  // User hash
  payment_intent: string,        // Payment ID
  amount_total: number,          // Amount in cents
  currency: string,              // Currency code
  metadata: {
    product_id: string           // Product being purchased
  }
}
```

**Actions (in order):**
1. Verify webhook signature
2. Extract user hash and product ID
3. Check product exists and is available
4. Create user product assignment
5. Save to `USER_PRODUCTS` KV (key: `user:{hash}`)
6. Mark product sold in `PRODUCT_STATUS` KV (key: `product:{id}`)
7. Return success response to Stripe

**Error Handling:**
- ❌ Invalid signature → Return 400 Bad Request
- ❌ Missing product_id → Return 400 Bad Request
- ❌ Product already sold → Return 409 Conflict
- ❌ KV write failure → Return 500 Internal Server Error (Stripe will retry)

---

## 🏷️ Ownership & Status Rules

### Product Status Tracking

**KV Namespace:** `PRODUCT_STATUS` (ID: `57da5a83146147c8939e4070d4b4d4c1`)

**Key Format:** `product:{product_id}`

**Value Structure:**
```json
{
  "status": "sold",
  "owner_id": "user_hash",
  "sold_at": "2025-12-22T12:00:00Z",
  "payment_id": "pi_xxx"
}
```

**Status Lifecycle:**
1. **available** → Product listed, no owner
2. **sold** → Product purchased, has owner
3. (No other statuses allowed)

**Rules:**
- ✅ Status change MUST be atomic
- ✅ Once sold, CANNOT be unsold (immutable)
- ✅ MUST record sold_at timestamp
- ✅ MUST record payment_id for audit trail

### User Products Assignment

**KV Namespace:** `USER_PRODUCTS` (ID: `3b88d32c0a0540a8b557c5fb698ff61a`)

**Key Format:** `user:{user_hash}`

**Value Structure:** Array of assignments
```json
[
  {
    "assignment_id": "assign_1234567890",
    "user_id": "user_hash",
    "product_id": "prod_xxx",
    "product_type": "real",
    "nickname": "Snake Name",
    "acquired_at": "2025-12-22T12:00:00Z",
    "acquisition_type": "stripe_purchase",
    "payment_id": "pi_xxx",
    "price_paid": 1000,
    "currency": "eur",
    "stats": {
      "hunger": 100,
      "water": 100,
      "temperature": 80,
      "humidity": 50,
      "health": 100,
      "stress": 10,
      "cleanliness": 100,
      "happiness": 100
    }
  }
]
```

**Rules:**
- ✅ User can own multiple products
- ✅ Each assignment MUST have unique `assignment_id`
- ✅ Assignment MUST NOT be deleted (permanent record)
- ✅ Stats MUST be initialized on purchase
- ✅ Nickname MUST default to "Snake {timestamp}" if not provided

### Ownership Verification

**Endpoint:** `GET /product-status?id={product_id}`

**Response:**
```json
{
  "product_id": "prod_xxx",
  "status": "available" | "sold",
  "owner_id": "user_hash" | null
}
```

**Catalog Usage:**
1. Load all products from `/products`
2. For each product, check `/product-status?id={product_id}`
3. Hide products where `status === 'sold'` from "Available" section
4. Move sold products to "Sold" section (collapsed)

---

## 💰 Game Economy Rules

### Currency System

**Gold Coins:**
- Primary in-game currency
- Earned from breeding (future feature)
- Used to purchase virtual snakes (feature disabled)
- Used to purchase equipment
- Cannot be converted back to real money

**Conversion Rates:**
- Real money → Gold: 1 cent = 1 gold (100 EUR = 10,000 gold)
- Gold → Equipment: Variable by item
- Gold → Virtual Snakes: 100-1000 gold (feature disabled)

**Starting Balance:**
- New users: 1,000 gold
- Can be adjusted via feature flag

### Loyalty System

**Tiers:**
| Tier | Points Required | Discount | Benefits |
|------|----------------|----------|----------|
| Bronze | 0 | 0% | None |
| Silver | 100 | 5% | Access to premium equipment |
| Gold | 500 | 10% | Early access to new morphs |
| Platinum | 1500 | 15% | Exclusive breeding combinations |

**Points Earned:**
- Real snake purchase: 10 points per €1
- Breeding success: 50 points
- Daily care (full week): 25 points
- Community contributions: Variable

**Rules:**
- ✅ Loyalty points MUST accumulate (never decrease)
- ✅ Tier MUST auto-upgrade when threshold reached
- ❌ Tier CANNOT downgrade
- ✅ Discounts apply to equipment only (not real snakes)

### Virtual Snake Pricing

**(🚫 Feature Disabled - v0.3.0)**

Future pricing when re-enabled:
| Rarity | Gold Cost | Examples |
|--------|-----------|----------|
| Common | 500 | Normal morphs |
| Uncommon | 1000 | Single gene morphs |
| Rare | 2000 | Multi-gene combos |

---

## 🐍 Snake Care Rules

### Stat System (8 Stats, 0-100 scale)

**Critical Thresholds:**
| Stat | Decay Rate (per hour @ 1x speed) | Critical Low | Critical High |
|------|----------------------------------|--------------|---------------|
| Hunger | -2.0 to -2.5 | < 20 | N/A |
| Water | -3.0 | < 15 | N/A |
| Temperature | -1.5 | < 30 | > 95 |
| Humidity | -2.0 | < 40 | > 90 |
| Cleanliness | -1.0 to -1.5 | < 25 | N/A |
| Health | -0.5 (if others low) | < 30 | N/A |
| Stress | +1.0 (increases!) | N/A | > 70 |
| Happiness | -0.5 | < 40 | N/A |

**Decay Modifiers:**
- Species-specific decay rates (Ball Python vs Corn Snake)
- Equipment reduces decay (auto-feeders, thermostats)
- Life stage affects decay (juveniles decay faster)

### Care Actions

**Feed:**
- Effect: Hunger +40, Stress -5
- Cooldown: 7 days (realistic feeding schedule)
- Constraint: Cannot feed if Hunger > 90
- Validation: Must have food in inventory (future)

**Water:**
- Effect: Water +50, Stress -2
- Cooldown: None
- Constraint: Cannot water if Water > 95

**Clean:**
- Effect: Cleanliness +30, Stress -10
- Cooldown: None
- Constraint: Cannot clean if Cleanliness > 85

**Heat Adjustment:**
- Effect: Temperature ±5 per adjustment
- Range: 70-95°F (species dependent)
- Constraint: Must have heating equipment

**Mist:**
- Effect: Humidity +15
- Cooldown: 24 hours
- Constraint: Must have misting equipment

**Handle:**
- Effect: Happiness +10, Stress +5 (if < 40 trust)
- Trust builds over time
- Constraint: Cannot handle if Stress > 70

### Health & Death Rules

**Health Degradation:**
- If Hunger < 20 for 48 hours: Health -1 per hour
- If Water < 15 for 24 hours: Health -2 per hour
- If Temperature outside range: Health -0.5 per hour
- If any stat < 10: Critical illness (Health -5 per hour)

**Death Conditions:**
- Health reaches 0: Snake dies (permanent)
- Multiple critical stats for 7+ days: Death risk
- Death is FINAL (realistic consequence)

**Prevention:**
- Equipment automation
- Vacation mode (NPC care)
- Warning notifications

---

## 🧬 Breeding Rules

**(🚫 Feature Under Development)**

### Requirements

**Both Parents Must Have:**
- Same species
- Health > 80
- Happiness > 70
- Stress < 30
- Age ≥ 3 years (ball python), ≥ 2 years (corn snake)
- Weight ≥ minimum breeding weight (species-specific)

**Cooldown:**
- Female: 365 days (1 year)
- Male: 30 days

### Genetics System

**Inheritance Rules:**
- Dominant genes: 50% chance per parent
- Recessive genes: 25% chance if both parents carry
- Co-dominant: Blended expression
- Sex-linked traits: Follow realistic genetics

**Morph Combinations:**
```javascript
banana × normal → 50% banana, 50% normal
banana × banana → 100% banana
piebald × piebald (het) → 25% piebald, 75% normal (het)
```

**Validation:**
- MUST follow real ball python genetics
- MUST NOT create impossible morphs
- MUST account for proven genetics vs visual

### Offspring Management

**Rules:**
- Clutch size: 4-10 eggs (species realistic)
- Incubation: 55-60 days (can fast-forward)
- Hatchling stats start at 100 (all stats)
- Owner can name offspring
- Owner can keep or sell offspring

**Selling:**
- Virtual offspring → Earn gold
- Rare morphs → Higher gold value
- Market price based on morph rarity

---

## 💾 Data Storage Rules

### KV Namespaces

**1. PRODUCTS**
- ID: `ecbcb79f3df64379863872965f993991`
- Purpose: Product catalog (synced from Stripe)
- TTL: None (permanent until deleted)
- Index: `_index:products` (array of IDs)

**2. USER_PRODUCTS**
- ID: `3b88d32c0a0540a8b557c5fb698ff61a`
- Purpose: User's purchased snakes
- TTL: None (permanent record)
- Structure: Array per user

**3. PRODUCT_STATUS**
- ID: `57da5a83146147c8939e4070d4b4d4c1`
- Purpose: Sold status tracking
- TTL: None (permanent audit trail)
- Updates: Write-once (immutable after sold)

### LocalStorage (Browser)

**Game State:**
- Key: `serpent_town_game_state`
- Contents: Snake stats, equipment, gold, loyalty points
- Update frequency: Every action + auto-save every 5 minutes
- Size limit: 5MB (reasonable for 50+ snakes)

**User Identity:**
- Key: `user_hash` (primary)
- Also: `serpent_town_user_hash` (legacy)
- Value: 32-character hex hash
- Generated once, never changes

**Data Sync Rules:**
- LocalStorage = game state (temporary, can be cleared)
- KV = ownership records (permanent, source of truth)
- On load: Fetch from KV, merge with local state
- On save: Update local only (ownership unchanged)

---

## 🔌 API & Integration Rules

### Worker API Endpoints

**1. GET `/products`**
- Purpose: List all available products
- Auth: None (public)
- Response: Array of products
- Caching: 5 minutes
- Error: Return [] if KV fails

**2. GET `/user-products?user={hash}`**
- Purpose: Get user's purchased snakes
- Auth: None (hash is auth)
- Validation: Hash must be 32+ chars
- Response: Array of user products
- Error: Return [] if user not found

**3. GET `/product-status?id={product_id}`**
- Purpose: Check if product is sold
- Auth: None (public data)
- Response: Status object
- Caching: None (must be real-time)
- Error: Return {status: 'unknown'} if not found

**4. POST `/stripe-webhook`**
- Purpose: Receive Stripe payment events
- Auth: Stripe signature verification
- Events: `checkout.session.completed` only
- Response: {received: true}
- Error handling: Return 200 even on processing error (acknowledge receipt)

**5. POST `/assign-product`** (Testing Only)
- Purpose: Manually assign product to user
- Auth: API key (future) or dev-only
- Body: {user_id, product_id}
- Response: Assignment object
- Error: 400 if product already sold

### CORS Rules

**Allowed Origins:**
- https://vinas8.github.io (production)
- http://localhost:* (development)
- http://127.0.0.1:* (development)

**Headers:**
```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, OPTIONS
Access-Control-Allow-Headers: Content-Type
```

### Rate Limiting

**Current:** None (trust Cloudflare default protection)

**Future:**
- `/products`: 100 requests/minute per IP
- `/user-products`: 300 requests/minute per IP
- `/stripe-webhook`: Unlimited (Stripe controls)

---

## 🎚️ Feature Flags

**Location:** `src/config/feature-flags.js`

```javascript
export const FEATURE_FLAGS = {
  ENABLE_VIRTUAL_SNAKES: false,    // ❌ Disabled v0.3.0
  ENABLE_BREEDING: false,          // 🚧 Under development
  ENABLE_MARKETPLACE: false,       // 🔮 Future feature
  ENABLE_MULTIPLAYER: false,       // 🔮 Future feature
  ENABLE_VACATION_MODE: false      // 🔮 Future feature
};
```

**Rules:**
- ✅ Features MUST check flag before rendering/executing
- ✅ Disabled features MUST NOT appear in UI
- ✅ Disabled features MUST NOT process data
- ✅ Flags can be changed without code deploy (future: remote config)

---

## ✅ Validation & Constraints

### Product Validation

```javascript
function validateProduct(product) {
  // Required fields
  if (!product.id || !product.id.startsWith('prod_')) return false;
  if (!product.name || product.name.length < 1 || product.name.length > 100) return false;
  if (!['ball_python', 'corn_snake'].includes(product.species)) return false;
  if (product.price <= 0) return false;
  if (!['real', 'virtual'].includes(product.type)) return false;
  if (!['available', 'sold'].includes(product.status)) return false;
  
  // Real product requirements
  if (product.type === 'real') {
    if (!product.stripe_link || !product.stripe_link.startsWith('https://buy.stripe.com/')) return false;
    if (!product.currency || !['eur', 'usd'].includes(product.currency)) return false;
    if (product.source !== 'stripe') return false;
  }
  
  return true;
}
```

### User Hash Validation

```javascript
function validateUserHash(hash) {
  if (!hash) return false;
  if (typeof hash !== 'string') return false;
  if (hash.length < 32) return false;
  if (!/^[a-f0-9]+$/i.test(hash)) return false; // Hex only
  return true;
}
```

### Snake Stats Validation

```javascript
function validateSnakeStats(stats) {
  const requiredStats = ['hunger', 'water', 'temperature', 'humidity', 
                          'health', 'stress', 'cleanliness', 'happiness'];
  
  for (const stat of requiredStats) {
    if (!(stat in stats)) return false;
    if (typeof stats[stat] !== 'number') return false;
    if (stats[stat] < 0 || stats[stat] > 100) return false;
  }
  
  return true;
}
```

### Equipment Purchase Validation

```javascript
function canPurchaseEquipment(user, item) {
  // Check gold balance
  if (user.currency.gold < item.price_gold) return false;
  
  // Check loyalty tier requirement
  if (item.tier_required && !hasLoyaltyTier(user, item.tier_required)) return false;
  
  // Check if already owned (single-purchase items)
  if (item.unique && userOwnsItem(user, item.id)) return false;
  
  return true;
}
```

---

## 📊 Business Metrics

**Key Performance Indicators:**
- Conversion rate (catalog view → purchase)
- Average order value
- Customer retention (daily active users)
- Snake care engagement (actions per day)
- Breeding activity (when enabled)

**Tracking Requirements:**
- ✅ Log all purchases (permanent in KV)
- ✅ Log catalog views (analytics)
- ✅ Log care actions (analytics)
- ❌ DO NOT log personal information beyond user_hash
- ✅ GDPR compliant (hash-based anonymity)

---

## 🔒 Security Rules

**Authentication:**
- User identity = hash in localStorage
- No passwords (hash-based auth)
- Hash generated client-side (crypto.randomUUID())

**Payment Security:**
- All payments through Stripe (PCI compliant)
- Never store credit card data
- Webhook signature verification required

**Data Privacy:**
- User hash is anonymous (no PII)
- Product ownership public (sold status visible to all)
- Email only collected post-purchase (optional)

**API Security:**
- Webhook signature verification (Stripe)
- Rate limiting (future)
- CORS restrictions
- Input validation on all endpoints

---

## 📝 Related Documentation

- [Business Requirements](./BUSINESS_REQUIREMENTS.md) - Original requirements doc
- [Stripe-KV Sync Strategy](./stripe-kv-sync-strategy.md) - Product sync design
- [Module Documentation](../modules/) - Technical implementation
- [API Reference](../api/) - Complete API docs

---

**Last Updated:** 2025-12-22  
**Version:** 0.3.0  
**Status:** ✅ Authoritative
