# Cloudflare KV API Interaction Guide

## 🎯 Overview

This document shows how to interact with Cloudflare KV storage using curl commands. All examples are production-ready and tested.

---

## 🔐 Authentication

```bash
# Your Cloudflare credentials (from .env file)
ACCOUNT_ID="e24c9f59eed424bd6d04e0f10fe0886f"
API_TOKEN="2BKglg-h8Vbs-n7NsjRZzHqDj_cTlwYkx2IoBVWY"

# KV Namespace IDs
USER_PRODUCTS_NS="3b88d32c0a0540a8b557c5fb698ff61a"    # User purchases
PRODUCT_STATUS_NS="57da5a83146147c8939e4070d4b4d4c1"   # Product availability
PRODUCTS_NS="ecbcb79f3df64379863872965f993991"        # Product catalog
```

---

## 📦 KV Namespace: PRODUCTS

### List All Keys
```bash
curl -X GET \
  "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/storage/kv/namespaces/$PRODUCTS_NS/keys" \
  -H "Authorization: Bearer $API_TOKEN" \
  -H "Content-Type: application/json"
```

### Get a Product
```bash
curl -X GET \
  "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/storage/kv/namespaces/$PRODUCTS_NS/values/product:prod_TdKcnyjt5Jk0U2" \
  -H "Authorization: Bearer $API_TOKEN"
```

### Add/Update a Product
```bash
curl -X PUT \
  "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/storage/kv/namespaces/$PRODUCTS_NS/values/product:prod_new_snake" \
  -H "Authorization: Bearer $API_TOKEN" \
  -H "Content-Type: application/json" \
  --data '{
    "id": "prod_new_snake",
    "name": "Blue Ball Python",
    "species": "ball_python",
    "morph": "blue",
    "price": 800.00,
    "type": "real",
    "stripe_link": "https://buy.stripe.com/test_xxx",
    "status": "available"
  }'
```

### Update Product Index (CRITICAL!)
```bash
# After adding products, update the index
curl -X PUT \
  "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/storage/kv/namespaces/$PRODUCTS_NS/values/_index:products" \
  -H "Authorization: Bearer $API_TOKEN" \
  -H "Content-Type: application/json" \
  --data '["prod_default_banana_ball","prod_default_piebald_ball","prod_new_snake"]'
```

### Delete a Product
```bash
curl -X DELETE \
  "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/storage/kv/namespaces/$PRODUCTS_NS/values/product:prod_old_snake" \
  -H "Authorization: Bearer $API_TOKEN"
```

---

## 👤 KV Namespace: USER_PRODUCTS

### List All User Keys
```bash
curl -X GET \
  "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/storage/kv/namespaces/$USER_PRODUCTS_NS/keys?limit=100" \
  -H "Authorization: Bearer $API_TOKEN"
```

### Get User's Products
```bash
curl -X GET \
  "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/storage/kv/namespaces/$USER_PRODUCTS_NS/values/user:test_123" \
  -H "Authorization: Bearer $API_TOKEN"
```

### Add Product to User
```bash
curl -X PUT \
  "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/storage/kv/namespaces/$USER_PRODUCTS_NS/values/user:test_123" \
  -H "Authorization: Bearer $API_TOKEN" \
  -H "Content-Type: application/json" \
  --data '[
    {
      "assignment_id": "assign_1234567890",
      "user_id": "test_123",
      "product_id": "prod_TdKcnyjt5Jk0U2",
      "product_type": "real",
      "nickname": "My Snake",
      "acquired_at": "2025-12-22T15:00:00.000Z",
      "acquisition_type": "stripe_purchase",
      "payment_id": "cs_test_123",
      "price_paid": 1000.00,
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
  ]'
```

### Delete User Data
```bash
curl -X DELETE \
  "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/storage/kv/namespaces/$USER_PRODUCTS_NS/values/user:test_123" \
  -H "Authorization: Bearer $API_TOKEN"
```

---

## 🏷️ KV Namespace: PRODUCT_STATUS

### Check Product Status
```bash
curl -X GET \
  "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/storage/kv/namespaces/$PRODUCT_STATUS_NS/values/product:prod_TdKcnyjt5Jk0U2" \
  -H "Authorization: Bearer $API_TOKEN"
```

### Mark Product as Sold
```bash
curl -X PUT \
  "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/storage/kv/namespaces/$PRODUCT_STATUS_NS/values/product:prod_TdKcnyjt5Jk0U2" \
  -H "Authorization: Bearer $API_TOKEN" \
  -H "Content-Type: application/json" \
  --data '{
    "status": "sold",
    "owner_id": "user_abc123",
    "sold_at": "2025-12-22T15:00:00.000Z",
    "payment_id": "pi_xxx"
  }'
```

### Mark Product as Available
```bash
curl -X DELETE \
  "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/storage/kv/namespaces/$PRODUCT_STATUS_NS/values/product:prod_TdKcnyjt5Jk0U2" \
  -H "Authorization: Bearer $API_TOKEN"
```

---

## 🌐 Worker API Endpoints

These are **public** endpoints that your HTML pages use:

### Get All Products
```bash
curl -X GET \
  "https://catalog.navickaszilvinas.workers.dev/products" \
  -H "Content-Type: application/json"
```

**Response:**
```json
[
  {
    "id": "prod_TdKcnyjt5Jk0U2",
    "name": "Batman Ball",
    "species": "ball_python",
    "morph": "banana",
    "price": 1000.00,
    "type": "real",
    "status": "available",
    "stripe_link": "https://buy.stripe.com/test_xxx"
  }
]
```

### Check Product Status
```bash
curl -X GET \
  "https://catalog.navickaszilvinas.workers.dev/product-status?id=prod_TdKcnyjt5Jk0U2" \
  -H "Content-Type: application/json"
```

**Response:**
```json
{
  "product_id": "prod_TdKcnyjt5Jk0U2",
  "status": "sold",
  "owner_id": "user_abc123"
}
```

### Get User's Products
```bash
curl -X GET \
  "https://catalog.navickaszilvinas.workers.dev/user-products?user=test_123" \
  -H "Content-Type: application/json"
```

**Response:**
```json
[
  {
    "assignment_id": "assign_1234567890",
    "user_id": "test_123",
    "product_id": "prod_TdKcnyjt5Jk0U2",
    "nickname": "My Snake",
    "stats": { ... }
  }
]
```

### Test Stripe Webhook (POST)
```bash
curl -X POST \
  "https://catalog.navickaszilvinas.workers.dev/stripe-webhook" \
  -H "Content-Type: application/json" \
  -H "Stripe-Signature: test_signature" \
  --data '{
    "type": "checkout.session.completed",
    "data": {
      "object": {
        "id": "cs_test_123",
        "client_reference_id": "test_123",
        "line_items": {
          "data": [{
            "price": {
              "product": "prod_TdKcnyjt5Jk0U2"
            }
          }]
        }
      }
    }
  }'
```

---

## 🛠️ Helper Scripts

### Rebuild Product Index
```bash
bash scripts/rebuild-product-index.sh
```

This scans all `product:*` keys and rebuilds `_index:products`.

### Clear Test Data
```bash
bash scripts/clear-test-data.sh
```

Removes test user data (like `user:test_123`).

### Test Worker Endpoints
```bash
bash scripts/test-worker-curl.sh
```

Tests all 4 worker endpoints with curl.

---

## 📄 HTML Examples

### catalog.html - Load Products
```javascript
// Load from Worker API
const response = await fetch('https://catalog.navickaszilvinas.workers.dev/products');
const products = await response.json();

// Filter by type
const realProducts = products.filter(p => p.type === 'real');
const virtualProducts = products.filter(p => p.type === 'virtual');

// Check each product's status
for (const product of realProducts) {
  const statusRes = await fetch(
    `https://catalog.navickaszilvinas.workers.dev/product-status?id=${product.id}`
  );
  const status = await statusRes.json();
  product.status = status.status;
  product.owner_id = status.owner_id;
}
```

### game.html - Load User's Snakes
```javascript
// Get user hash from URL
const userHash = window.location.hash.slice(1) || window.location.search.split('user=')[1];

// Fetch user's purchased snakes
const response = await fetch(
  `https://catalog.navickaszilvinas.workers.dev/user-products?user=${userHash}`
);
const userSnakes = await response.json();

// Render each snake
userSnakes.forEach(snake => {
  console.log(`${snake.nickname} - Health: ${snake.stats.health}`);
});
```

### success.html - Redirect After Purchase
```javascript
// Stripe redirects here with session_id
const urlParams = new URLSearchParams(window.location.search);
const sessionId = urlParams.get('session_id');
const userHash = urlParams.get('user_hash');

// Redirect to game with user hash
if (userHash) {
  window.location.href = `/game.html?user=${userHash}`;
}
```

---

## 🐛 Debugging with d.html

Your debug page (`d.html`) includes these features:

```javascript
// Generate test user
function generateTestUser() {
  const userHash = `test_${Date.now()}`;
  window.location.href = `/d.html?user=${userHash}`;
}

// Test API call
async function testAPI() {
  const userHash = getUserHash();
  
  console.log('🔍 Request:', {
    url: `https://catalog.navickaszilvinas.workers.dev/user-products?user=${userHash}`,
    method: 'GET'
  });
  
  const start = performance.now();
  const response = await fetch(
    `https://catalog.navickaszilvinas.workers.dev/user-products?user=${userHash}`
  );
  const latency = performance.now() - start;
  
  const data = await response.json();
  
  console.log('✅ Response:', {
    status: response.status,
    latency: `${latency.toFixed(2)}ms`,
    data: data
  });
}
```

---

## 🔍 Common Issues & Solutions

### Issue: Products not showing in catalog
**Cause:** Missing `type` field or not in `_index:products`

**Solution:**
```bash
# Check product
curl "https://catalog.navickaszilvinas.workers.dev/products" | grep "prod_xxx"

# Fix missing type field
curl -X PUT \
  "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/storage/kv/namespaces/$PRODUCTS_NS/values/product:prod_xxx" \
  -H "Authorization: Bearer $API_TOKEN" \
  -H "Content-Type: application/json" \
  --data '{ "id": "prod_xxx", "type": "real", ... }'

# Rebuild index
bash scripts/rebuild-product-index.sh
```

### Issue: Product shows as sold but shouldn't be
**Cause:** Entry in PRODUCT_STATUS KV

**Solution:**
```bash
# Remove sold status
curl -X DELETE \
  "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/storage/kv/namespaces/$PRODUCT_STATUS_NS/values/product:prod_xxx" \
  -H "Authorization: Bearer $API_TOKEN"
```

### Issue: User can't see purchased snake
**Cause:** Missing entry in USER_PRODUCTS

**Solution:**
```bash
# Check if user data exists
curl "https://catalog.navickaszilvinas.workers.dev/user-products?user=USER_HASH"

# If empty, webhook didn't fire - manually assign
curl -X POST \
  "https://catalog.navickaszilvinas.workers.dev/assign-product" \
  -H "Content-Type: application/json" \
  --data '{
    "user_id": "USER_HASH",
    "product_id": "prod_xxx"
  }'
```

---

## 📊 KV Storage Structure

```
PRODUCTS (ecbcb79f3df64379863872965f993991)
├── _index:products                      → ["prod_xxx", "prod_yyy", ...]
├── product:prod_default_banana_ball     → { id, name, price, type, ... }
├── product:prod_TdKcnyjt5Jk0U2         → { id, name, price, type, ... }
└── product:virtual_bp_001              → { id, name, type: "virtual", ... }

USER_PRODUCTS (3b88d32c0a0540a8b557c5fb698ff61a)
├── user:test_123                       → [{ assignment_id, product_id, stats, ... }]
├── user:journey_1766407757_11949       → [{ ... }]
└── userdata:test_123                   → { email, username, ... }

PRODUCT_STATUS (57da5a83146147c8939e4070d4b4d4c1)
├── product:prod_TdKcnyjt5Jk0U2         → { status: "sold", owner_id, sold_at }
└── (empty = available)
```

---

## 🎯 Quick Reference

| Task | Command |
|------|---------|
| List all products | `curl https://catalog.navickaszilvinas.workers.dev/products` |
| Check product status | `curl https://catalog.navickaszilvinas.workers.dev/product-status?id=PROD_ID` |
| Get user's snakes | `curl https://catalog.navickaszilvinas.workers.dev/user-products?user=HASH` |
| Rebuild index | `bash scripts/rebuild-product-index.sh` |
| Clear test data | `bash scripts/clear-test-data.sh` |
| Test all endpoints | `bash scripts/test-worker-curl.sh` |

---

**Author:** AI Assistant  
**Date:** 2025-12-22  
**Version:** 0.3.0
