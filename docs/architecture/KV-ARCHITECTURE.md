# 🗄️ KV Architecture Design - Serpent Town

**Date:** 2025-12-22  
**Version:** 0.3.0 → 0.4.0  
**Goal:** Migrate all data from JSON files to Cloudflare KV

---

## 🎯 Core Principle

**DATA SOURCES HIERARCHY:**
1. **KV Storage (Cloudflare)** - Production data (✅ PRIMARY)
2. **Local JSON files** - Development/testing ONLY (⚠️ TEMPORARY)
3. **LocalStorage** - Game state ONLY (browser-side caching)

---

## 📊 Current State (v0.3.0)

### Existing KV Namespaces
| Namespace | Keys | Purpose | Status |
|-----------|------|---------|--------|
| **USER_PRODUCTS** | `user:{hash}` | User's purchased snakes | ✅ Active |
| **PRODUCT_STATUS** | `product:{id}` | Sold status tracking | ✅ Active |

### JSON Files (TO MIGRATE)
| File | Records | Purpose | Should Be In KV? |
|------|---------|---------|-------------------|
| `data/products.json` | 3 | Product catalog | ✅ YES → PRODUCTS |
| `data/users.json` | 1 | User profiles | ✅ YES → USERS |

### Current Issues
- ❌ Frontend loads `data/products.json` directly
- ❌ Worker doesn't serve products from KV
- ❌ JSON files are source of truth (should be KV)
- ❌ Manual updates to JSON files needed

---

## 🏗️ Target Architecture (v0.4.0)

### KV Namespaces Design

#### 1. **PRODUCTS** (New)
**Purpose:** Product catalog (snakes for sale)

**Keys:**
- `product:{product_id}` → Full product data

**Example:**
```json
// Key: product:prod_TdKcnyjt5Jk0U2
{
  "id": "prod_TdKcnyjt5Jk0U2",
  "name": "Batman Ball",
  "species": "ball_python",
  "morph": "banana",
  "price": 1000.0,
  "type": "real",
  "source": "stripe",
  "info": "Male • 2024 • Captive Bred",
  "sex": "male",
  "birth_year": 2024,
  "weight_grams": 150,
  "description": "Beautiful banana morph ball python",
  "image": "🐍",
  "stripe_link": "https://buy.stripe.com/test_...",
  "unique": true,
  "created_at": "2025-12-22T00:00:00Z"
}
```

**List Key:**
- `_index:products` → Array of all product IDs
```json
["prod_TdKcnyjt5Jk0U2", "virtual_bp_001", "virtual_cs_001"]
```

---

#### 2. **USER_PRODUCTS** (Existing - Keep)
**Purpose:** Track which products each user owns

**Keys:**
- `user:{user_hash}` → Array of product IDs

**Example:**
```json
// Key: user:m2x9k7p4q8n3
[
  {
    "product_id": "prod_TdKcnyjt5Jk0U2",
    "purchased_at": "2025-12-22T02:53:58Z",
    "payment_id": "pi_success_flow_...",
    "price_paid": 1000.0
  }
]
```

---

#### 3. **PRODUCT_STATUS** (Existing - Keep)
**Purpose:** Track sold status of unique real snakes

**Keys:**
- `product:{product_id}` → Sold status

**Example:**
```json
// Key: product:prod_TdKcnyjt5Jk0U2
{
  "status": "sold",
  "owner_id": "m2x9k7p4q8n3",
  "sold_at": "2025-12-22T02:53:58Z",
  "payment_id": "pi_success_flow_..."
}
```

**Note:** Only for `type: "real"` and `unique: true` products.

---

#### 4. **USERS** (New)
**Purpose:** User profiles and account data

**Keys:**
- `user:{user_hash}` → User profile

**Example:**
```json
// Key: user:m2x9k7p4q8n3
{
  "user_id": "m2x9k7p4q8n3",
  "email": "user@example.com",
  "username": "SneakyPython42",
  "created_at": "2025-12-22T02:53:58Z",
  "loyalty_points": 150,
  "loyalty_tier": "bronze",
  "last_login": "2025-12-22T10:30:00Z"
}
```

---

#### 5. **MERCHANTS** (Future - v0.4.0+)
**Purpose:** Merchant accounts for marketplace

**Keys:**
- `merchant:{merchant_id}` → Merchant profile

**Example:**
```json
// Key: merchant:merch_abc123
{
  "merchant_id": "merch_abc123",
  "user_id": "m2x9k7p4q8n3",
  "business_name": "Snake Breeder Co",
  "subscription_status": "active",
  "subscription_started": "2025-12-22T00:00:00Z",
  "total_sales": 15,
  "commission_owed": 75.50
}
```

---

#### 6. **ORDERS** (Future - v0.4.0+)
**Purpose:** Order tracking with shipping addresses

**Keys:**
- `order:{order_id}` → Order details

**Example:**
```json
// Key: order:ord_xyz789
{
  "order_id": "ord_xyz789",
  "customer_id": "user_abc",
  "merchant_id": "merch_abc123",
  "product_id": "prod_TdKcnyjt5Jk0U2",
  "amount": 1000.0,
  "shipping_address": {
    "name": "John Doe",
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zip": "10001"
  },
  "status": "pending_shipment",
  "created_at": "2025-12-22T10:00:00Z"
}
```

---

## 🔄 Migration Plan

### Phase 1: Products to KV (Immediate)
1. Create `PRODUCTS` KV namespace
2. Migrate `data/products.json` → KV
3. Update `handleGetProducts()` in worker
4. Update frontend to fetch from worker
5. Keep `data/products.json` for testing only

### Phase 2: Users to KV (Short-term)
1. Create `USERS` KV namespace
2. Migrate `data/users.json` → KV
3. Update registration to write to KV
4. Update `handleGetUserData()` in worker

### Phase 3: Merchant System (Future)
1. Create `MERCHANTS` KV namespace
2. Create `ORDERS` KV namespace
3. Build merchant dashboard
4. Implement marketplace features

---

## 🛠️ Implementation Steps

### Step 1: Create PRODUCTS Namespace
```bash
# Via Cloudflare Dashboard
1. Go to Workers & Pages → KV
2. Click "Create namespace"
3. Name: PRODUCTS
4. Bind to worker "catalog"
```

### Step 2: Seed Products to KV
```javascript
// Script: scripts/seed-products-kv.js
import products from './data/products.json';

async function seedProducts() {
  for (const product of products) {
    const key = `product:${product.id}`;
    await env.PRODUCTS.put(key, JSON.stringify(product));
  }
  
  // Create index
  const ids = products.map(p => p.id);
  await env.PRODUCTS.put('_index:products', JSON.stringify(ids));
}
```

### Step 3: Update Worker
```javascript
// worker/worker.js - handleGetProducts()
async function handleGetProducts(request, env, corsHeaders) {
  if (!env.PRODUCTS) {
    return new Response(JSON.stringify({ 
      error: 'PRODUCTS namespace not bound' 
    }), { status: 500, headers: corsHeaders });
  }
  
  // Get product index
  const indexData = await env.PRODUCTS.get('_index:products');
  if (!indexData) {
    return new Response(JSON.stringify([]), { 
      status: 200, headers: corsHeaders 
    });
  }
  
  const productIds = JSON.parse(indexData);
  const products = [];
  
  for (const id of productIds) {
    const key = `product:${id}`;
    const productData = await env.PRODUCTS.get(key);
    if (productData) {
      products.push(JSON.parse(productData));
    }
  }
  
  return new Response(JSON.stringify(products), {
    status: 200,
    headers: corsHeaders
  });
}
```

### Step 4: Update Frontend
```javascript
// src/modules/shop/data/catalog.js
export async function loadCatalog() {
  // Try worker first (production)
  try {
    const workerUrl = 'https://catalog.navickaszilvinas.workers.dev/products';
    const response = await fetch(workerUrl);
    if (response.ok) {
      const products = await response.json();
      if (Array.isArray(products) && products.length > 0) {
        console.log('✅ Loaded products from KV (via worker)');
        return products;
      }
    }
  } catch (err) {
    console.warn('⚠️ Worker unavailable, falling back to JSON');
  }
  
  // Fallback to JSON (development/testing)
  const response = await fetch('./data/products.json');
  const products = await response.json();
  console.log('⚠️ Loaded products from JSON (testing mode)');
  return products;
}
```

---

## 📜 Rules for COPILOT-RULES.md

### Data Storage Rules

**ALWAYS:**
- ✅ Store production data in KV (via worker)
- ✅ Load data from worker API endpoints
- ✅ Use JSON files for development/testing ONLY
- ✅ Add fallback to JSON when worker unavailable
- ✅ Log data source (KV vs JSON) in console

**NEVER:**
- ❌ Use JSON files as production data source
- ❌ Hardcode product data in code
- ❌ Update JSON files for production changes
- ❌ Store user data in frontend code
- ❌ Bypass worker API to access KV directly

### Data Flow Pattern
```
User Action → Frontend → Worker API → KV Storage → Worker → Frontend → UI
```

### Development vs Production
```
Development:  data/products.json (quick testing)
              ↓ (fallback)
Production:   KV → Worker API → Frontend
```

---

## 🧪 Testing Strategy

### Unit Tests
- Test worker endpoints (mock KV)
- Test frontend with mock API responses
- Test fallback to JSON when worker fails

### Integration Tests
- Test full flow: Frontend → Worker → KV
- Test data consistency
- Test error handling

### Manual Testing
- Verify catalog loads from KV
- Verify sold status updates in real-time
- Verify JSON fallback works

---

## 📈 Benefits

1. **Scalability** - KV handles millions of reads
2. **Real-time** - Instant updates across all users
3. **Reliability** - Cloudflare's global network
4. **Security** - Data not exposed in static files
5. **Flexibility** - Easy to add/update products via API

---

## 🚀 Deployment Checklist

- [ ] Create PRODUCTS namespace in Cloudflare
- [ ] Bind PRODUCTS to worker
- [ ] Run seed script to populate KV
- [ ] Update worker.js (handleGetProducts)
- [ ] Update frontend catalog loader
- [ ] Deploy worker
- [ ] Test catalog page loads from KV
- [ ] Verify JSON fallback works
- [ ] Update COPILOT-RULES.md
- [ ] Document in module docs

---

**Status:** Architecture designed, ready for implementation  
**Estimated Time:** 2-3 hours  
**Priority:** High (foundational for merchant system)
