# Business Requirements & Rules

**Version:** 0.3.0  
**Last Updated:** 2025-12-22  
**Status:** Active

---

## 🎯 Core Business Rules

### Product Catalog & Shop

#### Shop Display Rules
1. **Available Snakes Section** 
   - ✅ Show all snakes with `status === 'available'` (not sold to anyone)
   - ❌ Hide all snakes with `status === 'sold'` (regardless of owner)
   - ✅ Filter by species (Ball Python, Corn Snake, All)
   
2. **Sold Snakes Section** (Collapsed by default)
   - Show snakes owned by ANY user
   - Display owner information when available
   - Mark as "SOLD OUT" with disabled buy button

3. **Virtual Snakes Section** (🚫 DISABLED in v0.3.0)
   - Feature flag: `ENABLE_VIRTUAL_SNAKES = false`
   - No longer displayed in catalog
   - May be re-enabled in future versions

#### Product Data Sources

**Production (GitHub Pages):**
- **PRIMARY:** Cloudflare Worker API (`/products` endpoint)
- Reads from KV namespace: `PRODUCTS`
- No JSON file fallback

**Development (localhost):**
- **PRIMARY:** Cloudflare Worker API (`/products` endpoint)  
- **FALLBACK:** `docs/temp/test-data/products.json` (for offline testing only)
- JSON file should mirror Worker data structure

**❌ DEPRECATED:**
- `data/products.json` - No longer used
- Direct JSON loading in production

---

## 🔐 User & Ownership Rules

### Snake Ownership
1. **Assignment**
   - Snakes are assigned to users via Stripe webhook
   - User identified by `user_hash` (passed as `client_reference_id`)
   - Assignment stored in KV: `USER_PRODUCTS` namespace
   - Key format: `user:{user_hash}`

2. **Sold Status Tracking**
   - Product status stored in KV: `PRODUCT_STATUS` namespace
   - Key format: `product:{product_id}`
   - Contains: `status`, `owner_id`, `sold_at`, `payment_id`

3. **Ownership Verification**
   - Check via Worker API: `/product-status?id={product_id}`
   - Returns: `{ status: 'sold' | 'available', owner_id: string | null }`

### User Products Loading
1. **Game View (`game.html`)**
   - Load user's snakes from Worker API: `/user-products?user={hash}`
   - Convert to game snake objects with stats
   - Show empty state if no snakes purchased

2. **Catalog View (`catalog.html`)**
   - Check each product's sold status via `/product-status`
   - Hide snakes sold to ANY user
   - Show "Sold" badge for unavailable snakes

---

## 💳 Payment & Purchase Flow

### Stripe Integration
1. **Checkout Flow**
   ```
   User clicks "Buy Now" → Stripe Checkout
   ├─ URL: {stripe_link}?client_reference_id={user_hash}
   ├─ User completes payment
   └─ Stripe webhook → Worker → KV storage
   ```

2. **Webhook Processing** (`POST /stripe-webhook`)
   - Event: `checkout.session.completed`
   - Extract: `client_reference_id` (user hash), `product_id`, payment info
   - Store in `USER_PRODUCTS` KV
   - Mark product as sold in `PRODUCT_STATUS` KV

3. **Post-Purchase Redirect**
   - Success URL: `success.html?session_id={CHECKOUT_SESSION_ID}`
   - User registers profile (username, email)
   - Redirected to `game.html?user={hash}` to view purchased snake

---

## 📊 Data Storage Architecture

### KV Namespaces (Cloudflare)

#### 1. USER_PRODUCTS
**Purpose:** Store user's purchased snakes  
**ID:** `3b88d32c0a0540a8b557c5fb698ff61a`

**Key Format:** `user:{user_hash}`

**Value Structure:**
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

#### 2. PRODUCT_STATUS
**Purpose:** Track which products are sold  
**ID:** `57da5a83146147c8939e4070d4b4d4c1`

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

#### 3. PRODUCTS
**Purpose:** Product catalog (synced from Stripe)  
**ID:** `ecbcb79f3df64379863872965f993991`

**Key Format:** 
- `product:{product_id}` - Individual product
- `_index:products` - Array of all product IDs

**Value Structure:**
```json
{
  "id": "prod_xxx",
  "name": "Batman Ball",
  "species": "ball_python",
  "morph": "banana",
  "price": 1000,
  "currency": "eur",
  "type": "real",
  "stripe_link": "https://buy.stripe.com/test_xxx",
  "status": "available",
  "source": "stripe",
  "description": "Beautiful ball python",
  "images": ["https://..."],
  "sex": "male",
  "birth_year": 2024,
  "weight_grams": 150
}
```

---

## 🚀 Deployment Rules

### Worker Deployment
- **Method:** Cloudflare API (NOT wrangler CLI)
- **Script:** `scripts/deploy-worker-api.sh` or use Cloudflare API directly
- **Bindings:** All 3 KV namespaces must be bound in metadata.json

### Frontend Deployment  
- **Platform:** GitHub Pages
- **URL:** https://vinas8.github.io/catalog/
- **Process:** Git push to `main` → Auto-deploy

### Product Sync
- **Script:** `scripts/fetch-stripe-products.js`
- **Process:** Fetch from Stripe → Update PRODUCTS KV via Cloudflare API
- **Frequency:** Manual (run when adding new products)

---

## 📝 Testing Requirements

### Localhost Testing
- JSON fallback file must exist: `docs/temp/test-data/products.json`
- File should match Worker `/products` response structure
- Update via: `curl https://catalog.navickaszilvinas.workers.dev/products > docs/temp/test-data/products.json`

### Production Testing
- Use debug dashboard: `debug.html?user={hash}`
- Test endpoints via: `scripts/test-worker-curl.sh`
- Check KV data via Cloudflare API or dashboard

---

## 🔧 Feature Flags

Located in: `src/config/feature-flags.js`

```javascript
export const FEATURE_FLAGS = {
  ENABLE_VIRTUAL_SNAKES: false,  // 🚫 Disabled in v0.3.0
  ENABLE_BREEDING: true,          // ✅ Enabled
  ENABLE_MARKETPLACE: false       // 🚫 Future feature
};
```

---

## 🎮 Game Mechanics

### Snake Care Requirements
- 8 stats tracked (hunger, water, temperature, etc.)
- Stats decay over time based on species
- User actions: Feed, Water, Clean, Heat, Mist, Handle
- Equipment shop: 15+ items for automation

### Economy
- Gold coins earned from breeding (future)
- Virtual snakes purchasable with gold (disabled)
- Real snakes purchased with Stripe only

---

## 🐛 Known Limitations

1. **Localhost Catalog Loading**
   - Stuck on "Loading..." if JSON file missing
   - **Fix:** Ensure `docs/temp/test-data/products.json` exists

2. **Worker API Failures**
   - If Worker is down, catalog won't load in production
   - **Fix:** Worker must be deployed and KV bound correctly

3. **User Hash Management**
   - Multiple localStorage keys for compatibility
   - Can cause confusion if user clears storage

---

## 📞 Related Documentation

- **Worker API:** `docs/api/cloudflare-api.md`
- **KV Storage:** `docs/CLOUDFLARE_API_EXAMPLES.md`
- **Shop Module:** `docs/modules/shop.md`
- **Feature Flags:** `src/config/feature-flags.js`
- **Developer Reference:** `docs/DEVELOPER_REFERENCE.md`

---

## 🔄 Change Log

**v0.3.0 (2025-12-22)**
- Shop now uses Worker API as primary source
- JSON fallback for localhost only
- Virtual snakes disabled
- Consolidated business requirements doc

**v0.1.0 (Initial)**
- Basic shop with JSON files
- Virtual and real snakes
- Stripe integration

