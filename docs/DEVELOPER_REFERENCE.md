# Developer Quick Reference Card

## 🚀 Essential Commands

```bash
# Test everything
npm test

# Deploy worker
cd worker && wrangler publish

# Test worker endpoints
bash scripts/test-worker-curl.sh

# Rebuild product index
bash scripts/rebuild-product-index.sh

# Clear test data
bash scripts/clear-test-data.sh
```

---

## 🌐 API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/products` | GET | List all products |
| `/product-status?id=X` | GET | Check if sold |
| `/user-products?user=X` | GET | Get user's snakes |
| `/stripe-webhook` | POST | Handle payments |

**Base URL:** `https://catalog.navickaszilvinas.workers.dev`

---

## 🔐 Cloudflare KV Direct Access

```bash
# Get product
curl -H "Authorization: Bearer $API_TOKEN" \
  "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/storage/kv/namespaces/$PRODUCTS_NS/values/product:prod_xxx"

# Update product
curl -X PUT \
  -H "Authorization: Bearer $API_TOKEN" \
  -H "Content-Type: application/json" \
  --data '{"id":"prod_xxx","type":"real",...}' \
  "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/storage/kv/namespaces/$PRODUCTS_NS/values/product:prod_xxx"
```

**Credentials:** Check `.env` file for `ACCOUNT_ID`, `API_TOKEN`, and namespace IDs

---

## 📦 Product Schema

```json
{
  "id": "prod_xxx",
  "name": "Snake Name",
  "species": "ball_python",
  "morph": "banana",
  "price": 450.00,
  "type": "real",          // REQUIRED: "real" or "virtual"
  "status": "available",
  "stripe_link": "https://buy.stripe.com/test_xxx"
}
```

**⚠️ CRITICAL:** Products MUST have `type` field or they won't display!

---

## 🐛 Common Issues

### Products not showing?
```bash
# Check if they have type field
curl https://catalog.navickaszilvinas.workers.dev/products | grep -o '"type":"[^"]*"'

# Fix: Add type field
curl -X PUT ... --data '{"type":"real",...}'

# Rebuild index
bash scripts/rebuild-product-index.sh
```

### Product showing as sold?
```bash
# Check status
curl "https://catalog.navickaszilvinas.workers.dev/product-status?id=prod_xxx"

# Mark as available (delete from PRODUCT_STATUS)
curl -X DELETE \
  -H "Authorization: Bearer $API_TOKEN" \
  "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/storage/kv/namespaces/$PRODUCT_STATUS_NS/values/product:prod_xxx"
```

---

## 📁 Key Files

| File | Purpose |
|------|---------|
| `worker/worker.js` | Backend API (Stripe webhooks, KV) |
| `catalog.html` | Shop (buy with Stripe) |
| `game.html` | Tamagotchi game |
| `d.html` | Debug/developer page |
| `src/config/feature-flags.js` | Toggle features |
| `src/config/worker-config.js` | API URLs |

---

## 🎮 Feature Flags

```javascript
// src/config/feature-flags.js
export const FEATURE_FLAGS = {
  ENABLE_VIRTUAL_SNAKES: true,  // Toggle virtual snakes
  ENABLE_BREEDING: false,        // Future feature
  ENABLE_MARKETPLACE: false      // Future feature
};
```

---

## 🔄 Full Purchase Flow

```
1. User clicks "Buy Now" → Stripe Checkout
2. Completes payment
3. Stripe webhook → POST /stripe-webhook
4. Worker writes to KV:
   - USER_PRODUCTS: user:USER_HASH → [products array]
   - PRODUCT_STATUS: product:PROD_ID → {status: "sold", owner_id}
5. User redirected to success.html → game.html?user=HASH
6. Game fetches GET /user-products?user=HASH
7. Snake appears in game! 🐍
```

---

## 📊 KV Namespaces

| Namespace | Binding | Purpose |
|-----------|---------|---------|
| `ecbcb79f3df64379863872965f993991` | PRODUCTS | Product catalog |
| `3b88d32c0a0540a8b557c5fb698ff61a` | USER_PRODUCTS | User purchases |
| `57da5a83146147c8939e4070d4b4d4c1` | PRODUCT_STATUS | Sold tracking |

---

## 🧪 Test Scenarios

```bash
# Test webhook
curl -X POST https://catalog.navickaszilvinas.workers.dev/stripe-webhook \
  -H "Content-Type: application/json" \
  --data '{"type":"checkout.session.completed",...}'

# Test user products
curl https://catalog.navickaszilvinas.workers.dev/user-products?user=test_123

# Test product status
curl https://catalog.navickaszilvinas.workers.dev/product-status?id=prod_xxx
```

---

## 📚 Full Documentation

- **[Cloudflare API Examples](CLOUDFLARE_API_EXAMPLES.md)** - Complete curl reference
- **[Setup Guide](SETUP.md)** - Deployment instructions
- **[Module Docs](modules/README.md)** - Architecture details

---

**Quick Links:**
- Dashboard: `/dashboard.html`
- Debug page: `/d.html`
- Worker logs: `wrangler tail`
- GitHub Pages: `https://vinas8.github.io/catalog/`
