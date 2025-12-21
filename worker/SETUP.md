# Cloudflare Worker Setup Guide

## 🚀 Quick Setup (15 minutes)

### Step 1: Install Wrangler CLI

```bash
npm install -g wrangler

# Or with pnpm
pnpm install -g wrangler

# Verify installation
wrangler --version
```

### Step 2: Login to Cloudflare

```bash
wrangler login
```

This will open a browser for authentication.

### Step 3: Create KV Namespace

```bash
cd /root/catalog/worker

# Create KV namespace
wrangler kv:namespace create "USER_PRODUCTS"
```

**Output:**
```
✅ Created namespace USER_PRODUCTS
📋 ID: 1234567890abcdef
```

### Step 4: Update wrangler.toml

Copy the KV namespace ID from above and update `wrangler.toml`:

```toml
[[kv_namespaces]]
binding = "USER_PRODUCTS"
id = "1234567890abcdef"  # ← Your actual ID here
```

### Step 5: Deploy Worker

```bash
wrangler publish
```

**Output:**
```
✅ Published serpent-town-api
🌍 https://serpent-town-api.YOUR_SUBDOMAIN.workers.dev
```

**Save this URL!** This is your API endpoint.

---

## 🔧 Configuration

### Update Stripe Webhook URL

1. Go to Stripe Dashboard → Webhooks
2. Add endpoint: `https://serpent-town-api.YOUR_SUBDOMAIN.workers.dev/stripe-webhook`
3. Select event: `checkout.session.completed`
4. Save

### Update Frontend API URL

In your game code, update the API URL:

```javascript
// src/auth/user-auth.js or wherever you load user products
const WORKER_URL = 'https://serpent-town-api.YOUR_SUBDOMAIN.workers.dev';

async function loadUserProducts(userHash) {
  const response = await fetch(`${WORKER_URL}/user-products?user=${userHash}`);
  return response.json();
}
```

---

## 📡 API Endpoints

### 1. POST /stripe-webhook
**Purpose:** Receives Stripe payment webhooks  
**Called by:** Stripe automatically

**Expected Payload:**
```json
{
  "type": "checkout.session.completed",
  "data": {
    "object": {
      "client_reference_id": "user_hash_abc123",
      "metadata": {
        "product_id": "prod_TdKcnyjt5Jk0U2"
      }
    }
  }
}
```

**Response:**
```json
{
  "success": true,
  "user_id": "user_hash_abc123",
  "product_id": "prod_TdKcnyjt5Jk0U2"
}
```

### 2. GET /user-products?user=HASH
**Purpose:** Get user's purchased snakes  
**Called by:** Frontend (game.html)

**Request:**
```
GET /user-products?user=abc123xyz
```

**Response:**
```json
[
  {
    "assignment_id": "assign_1234567890",
    "user_id": "abc123xyz",
    "product_id": "prod_TdKcnyjt5Jk0U2",
    "product_type": "real",
    "nickname": "Snake 1234567890",
    "acquired_at": "2025-12-21T12:00:00Z",
    "acquisition_type": "stripe_purchase",
    "payment_id": "pi_stripe123",
    "price_paid": 1000,
    "currency": "eur",
    "stats": {
      "hunger": 100,
      "water": 100,
      "health": 100
    }
  }
]
```

### 3. POST /assign-product (Testing Only)
**Purpose:** Manually assign product to user  
**Called by:** You (for testing)

**Request:**
```bash
curl -X POST https://serpent-town-api.YOUR_SUBDOMAIN.workers.dev/assign-product \
  -H "Content-Type: application/json" \
  -d '{"user_id": "test123", "product_id": "prod_TdKcnyjt5Jk0U2"}'
```

**Response:**
```json
{
  "success": true,
  "user_product": {...}
}
```

---

## 🧪 Testing

### Test 1: Check Worker is Running

```bash
curl https://serpent-town-api.YOUR_SUBDOMAIN.workers.dev/user-products?user=test123
```

**Expected:** `[]` (empty array)

### Test 2: Assign Test Product

```bash
curl -X POST https://serpent-town-api.YOUR_SUBDOMAIN.workers.dev/assign-product \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "test123",
    "product_id": "prod_TdKcnyjt5Jk0U2"
  }'
```

**Expected:** `{"success": true, ...}`

### Test 3: Verify Product Assigned

```bash
curl https://serpent-town-api.YOUR_SUBDOMAIN.workers.dev/user-products?user=test123
```

**Expected:** Array with 1 product

### Test 4: Test Stripe Webhook (Simulate)

```bash
curl -X POST https://serpent-town-api.YOUR_SUBDOMAIN.workers.dev/stripe-webhook \
  -H "Content-Type: application/json" \
  -d '{
    "type": "checkout.session.completed",
    "data": {
      "object": {
        "client_reference_id": "user_abc123",
        "id": "cs_test_123",
        "payment_intent": "pi_test_123",
        "amount_total": 100000,
        "currency": "eur",
        "metadata": {
          "product_id": "prod_TdKcnyjt5Jk0U2"
        }
      }
    }
  }'
```

**Expected:** `{"success": true, ...}`

---

## 🔍 Debugging

### View Logs

```bash
wrangler tail
```

This shows real-time logs from your Worker.

### Check KV Data

```bash
# List all keys
wrangler kv:key list --binding=USER_PRODUCTS

# Get specific user's data
wrangler kv:key get "user:test123" --binding=USER_PRODUCTS
```

### Common Issues

**1. "KV namespace not found"**
- Solution: Update `wrangler.toml` with correct KV namespace ID

**2. "CORS error in browser"**
- Solution: Worker already has CORS headers, check browser console

**3. "Worker not updating"**
- Solution: Run `wrangler publish` again, may need to clear cache

---

## 🔐 Security (Production)

### Add Stripe Signature Verification

Update worker.js to verify webhook signatures:

```javascript
async function handleStripeWebhook(request, env, corsHeaders) {
  const signature = request.headers.get('stripe-signature');
  const secret = env.STRIPE_WEBHOOK_SECRET;
  
  // Verify signature
  const body = await request.text();
  // Use stripe library to verify
  // ... verification code ...
}
```

Add secret to wrangler.toml:
```toml
[vars]
STRIPE_WEBHOOK_SECRET = "whsec_your_secret_here"
```

### Rate Limiting (Optional)

Cloudflare automatically provides DDoS protection, but you can add custom rate limiting if needed.

---

## 📊 Monitoring

### Cloudflare Dashboard

1. Go to Workers & Pages
2. Click your worker
3. View metrics:
   - Requests per second
   - Errors
   - CPU time
   - KV operations

### Alerts (Optional)

Set up alerts for:
- High error rate
- Slow response times
- High KV usage

---

## 💰 Cost

### Free Tier (More than enough!)

- ✅ 100,000 requests/day
- ✅ 1GB KV storage
- ✅ 100,000 KV reads/day
- ✅ 1,000 KV writes/day

### Your Usage:
- ~10 purchases/month = 10 writes
- ~1000 game loads/month = 1000 reads
- **Well within free tier!**

---

## 🚀 Next Steps

1. Deploy worker
2. Update Stripe webhook URL
3. Update frontend API URL
4. Test with real purchase
5. Monitor in Cloudflare dashboard

**You're done!** 🎉

---

## 📞 Support

- **Wrangler Docs:** https://developers.cloudflare.com/workers/wrangler/
- **Workers Docs:** https://developers.cloudflare.com/workers/
- **KV Docs:** https://developers.cloudflare.com/kv/

---

**Last Updated:** December 21, 2025  
**Version:** 3.4
