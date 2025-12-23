# Stripe-KV Sync Strategy

**Version:** 0.3.0  
**Last Updated:** 2025-12-22  
**Status:** Design Document

---

## 📋 TL;DR

**Goal:** Catalog loads from KV, KV auto-syncs with Stripe

**Solution:** Add Stripe webhook endpoint to Worker
- Listen: `product.created`, `product.updated`, `product.deleted`
- Action: Update PRODUCTS KV namespace automatically
- Benefit: Real-time sync, no manual intervention

**Implementation:** 
1. Add `/stripe-product-webhook` endpoint to Worker
2. Configure webhook in Stripe Dashboard
3. Handle events → update KV
4. Done! Products auto-sync 🎉

---

## 🎯 Goal

**Catalog data should come from KV, and KV should automatically sync with Stripe.**

Current state: Manual sync via script `fetch-stripe-products.sh`  
Desired state: Automatic sync on Stripe events

---

## 📊 Current Architecture

### Data Flow (Current)
```
Stripe Dashboard → Manual Script → KV PRODUCTS → Worker API → Frontend
                   (fetch-stripe-products.sh)
```

### Problems
- ❌ Manual sync required when adding products
- ❌ KV can be out of sync with Stripe
- ❌ No real-time updates
- ❌ Requires running script after each product change

---

## 🔄 Proposed Solutions

### **Option 1: Stripe Webhook for Product Updates** ⭐ RECOMMENDED

**How it works:**
```
Stripe Product Event → Stripe Webhook → Worker → Update KV PRODUCTS
```

**Implementation:**
1. Add webhook endpoint to Worker: `POST /stripe-product-webhook`
2. Listen for Stripe product events:
   - `product.created`
   - `product.updated`
   - `product.deleted`
   - `price.created`
   - `price.updated`
3. Update KV PRODUCTS namespace automatically

**Pros:**
- ✅ Real-time sync (instant updates)
- ✅ No manual intervention
- ✅ Automatic when products added/changed in Stripe
- ✅ Reliable (Stripe retries failed webhooks)

**Cons:**
- ⚠️ Requires configuring Stripe webhook endpoint
- ⚠️ Need to handle webhook signature verification
- ⚠️ Need initial full sync on first run

**Code Changes Required:**
```javascript
// worker.js - Add new endpoint
if (pathname === '/stripe-product-webhook' && request.method === 'POST') {
  return handleStripeProductWebhook(request, env, corsHeaders);
}

async function handleStripeProductWebhook(request, env, corsHeaders) {
  // 1. Verify webhook signature
  // 2. Parse event type (product.created, product.updated, etc.)
  // 3. Update/delete product in PRODUCTS KV
  // 4. Rebuild product index (_index:products)
  // 5. Return success
}
```

---

### **Option 2: Scheduled Worker (Cron Job)**

**How it works:**
```
Cloudflare Cron → Worker → Fetch from Stripe API → Update KV PRODUCTS
```

**Implementation:**
1. Add scheduled event handler to Worker
2. Run every 15 minutes: Fetch all products from Stripe
3. Compare with KV and update differences

**Pros:**
- ✅ Simple to implement
- ✅ No webhook configuration needed
- ✅ Works even if webhook fails

**Cons:**
- ❌ Not real-time (15 min delay)
- ❌ Makes unnecessary API calls
- ❌ Costs more (frequent API calls)
- ❌ Rate limit concerns with Stripe API

**Code Example:**
```javascript
export default {
  async scheduled(event, env, ctx) {
    // Runs every 15 minutes
    await syncProductsFromStripe(env);
  }
}
```

**Wrangler.toml:**
```toml
[triggers]
crons = ["*/15 * * * *"]  # Every 15 minutes
```

---

### **Option 3: Hybrid Approach** 🌟 BEST

**How it works:**
```
Stripe Webhook → Worker → Update KV  (Real-time)
        +
Cron Job (daily) → Full sync check    (Safety net)
```

**Implementation:**
1. Use webhook for real-time updates (Option 1)
2. Add daily cron job to verify all products match
3. Handles edge cases (missed webhooks, manual Stripe changes)

**Pros:**
- ✅ Real-time updates via webhook
- ✅ Safety net via daily full sync
- ✅ Best of both worlds

**Cons:**
- ⚠️ Most complex to implement
- ⚠️ Requires both webhook AND cron setup

---

### **Option 4: Edge-Triggered Cache (Current + Auto-Refresh)**

**How it works:**
```
Frontend requests → Worker checks KV age → If old, fetch Stripe → Update KV
```

**Implementation:**
1. Store timestamp in KV: `_last_sync:products`
2. When frontend requests `/products`, check timestamp
3. If older than 1 hour, trigger background Stripe fetch
4. Return cached data immediately, update in background

**Pros:**
- ✅ No cron setup needed
- ✅ Self-healing (auto-refreshes when needed)
- ✅ Simple logic

**Cons:**
- ❌ First request after 1 hour is slow
- ❌ Not truly real-time
- ❌ Complexity in background update

---

## 🏆 Recommended Solution

**Hybrid Approach (Option 3)** is the best long-term solution, but start with **Option 1 (Webhook)** for MVP.

### Phase 1: Webhook Only (MVP)
1. Add `/stripe-product-webhook` endpoint
2. Configure webhook in Stripe Dashboard
3. Handle `product.*` and `price.*` events
4. Update KV on each event

### Phase 2: Add Safety Net
1. Add daily cron job for full sync
2. Compare Stripe vs KV and fix discrepancies
3. Alert on sync failures

---

## 🛠️ Implementation Plan

### Step 1: Add Webhook Endpoint to Worker

**File:** `worker/worker.js`

```javascript
// Add route
if (pathname === '/stripe-product-webhook' && request.method === 'POST') {
  return handleStripeProductWebhook(request, env, corsHeaders);
}

async function handleStripeProductWebhook(request, env, corsHeaders) {
  console.log('📥 Product webhook received');
  
  // 1. Verify webhook signature
  const signature = request.headers.get('stripe-signature');
  const webhookSecret = env.STRIPE_WEBHOOK_SECRET_PRODUCTS; // New secret
  
  let event;
  try {
    const payload = await request.text();
    // Verify signature (use Stripe library or manual crypto)
    event = JSON.parse(payload);
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Invalid webhook' }), {
      status: 400,
      headers: corsHeaders
    });
  }
  
  // 2. Handle event type
  switch (event.type) {
    case 'product.created':
    case 'product.updated':
      await updateProductInKV(event.data.object, env);
      break;
    
    case 'product.deleted':
      await deleteProductFromKV(event.data.object.id, env);
      break;
    
    case 'price.created':
    case 'price.updated':
      // Fetch product and update with new price
      await updatePriceInKV(event.data.object, env);
      break;
  }
  
  return new Response(JSON.stringify({ received: true }), {
    status: 200,
    headers: corsHeaders
  });
}

async function updateProductInKV(stripeProduct, env) {
  // Convert Stripe product format to our format
  const product = {
    id: stripeProduct.id,
    name: stripeProduct.name,
    description: stripeProduct.description,
    images: stripeProduct.images,
    metadata: stripeProduct.metadata,
    // ... convert to our schema
  };
  
  // Save to KV
  const key = `product:${product.id}`;
  await env.PRODUCTS.put(key, JSON.stringify(product));
  
  // Update index
  await rebuildProductIndex(env);
}

async function rebuildProductIndex(env) {
  // List all product keys
  const list = await env.PRODUCTS.list({ prefix: 'product:' });
  const productIds = list.keys.map(k => k.name.replace('product:', ''));
  
  // Save index
  await env.PRODUCTS.put('_index:products', JSON.stringify(productIds));
}
```

---

### Step 2: Configure Stripe Webhook

**In Stripe Dashboard:**
1. Go to: https://dashboard.stripe.com/webhooks
2. Click "Add endpoint"
3. URL: `https://catalog.navickaszilvinas.workers.dev/stripe-product-webhook`
4. Events to listen:
   - `product.created`
   - `product.updated`
   - `product.deleted`
   - `price.created`
   - `price.updated`
5. Copy webhook signing secret
6. Add to `.env`: `STRIPE_WEBHOOK_SECRET_PRODUCTS=whsec_...`

---

### Step 3: Add Webhook Secret to Worker

**File:** `worker/wrangler.toml`

```toml
[vars]
STRIPE_WEBHOOK_SECRET_PRODUCTS = "whsec_..."
```

Or bind as environment variable in Cloudflare dashboard.

---

### Step 4: Initial Full Sync

Run once to populate KV:
```bash
./scripts/fetch-stripe-products.sh
```

This seeds KV with all existing Stripe products. From then on, webhook keeps it in sync.

---

### Step 5: Testing

**Test webhook locally:**
```bash
# Use Stripe CLI to forward webhooks
stripe listen --forward-to http://localhost:8787/stripe-product-webhook

# Trigger test event
stripe trigger product.created
```

**Test on production:**
```bash
# Send test webhook from Stripe Dashboard
# Verify product appears in KV
curl https://catalog.navickaszilvinas.workers.dev/products
```

---

## 📝 Event Handling Matrix

| Stripe Event | Action | KV Operation |
|--------------|--------|--------------|
| `product.created` | New product added | `PUT product:{id}` + rebuild index |
| `product.updated` | Product details changed | `PUT product:{id}` (overwrite) |
| `product.deleted` | Product removed | `DELETE product:{id}` + rebuild index |
| `price.created` | New price for product | Update product with price |
| `price.updated` | Price changed | Update product with new price |

---

## 🔒 Security Considerations

1. **Verify Webhook Signature**
   - Always validate `stripe-signature` header
   - Prevents fake webhook calls
   
2. **Use Separate Webhook Secret**
   - Different secret for product webhooks vs payment webhooks
   - Limits blast radius if one is compromised

3. **Rate Limiting**
   - Implement rate limits on webhook endpoint
   - Prevent abuse

4. **Idempotency**
   - Handle duplicate webhook deliveries
   - Stripe may retry failed webhooks

---

## 📊 Monitoring & Alerts

### Metrics to Track
- Webhook success/failure rate
- Sync latency (webhook arrival → KV update)
- Product count in KV vs Stripe
- Failed webhook deliveries

### Alerts
- Alert if webhook fails 3+ times in a row
- Alert if product count diverges significantly
- Alert if webhook hasn't been received in 24 hours

---

## 🚀 Migration Path

### Current State
```bash
# Manual sync
./scripts/fetch-stripe-products.sh
```

### Transition State (Dual Mode)
```bash
# Keep manual script for safety
./scripts/fetch-stripe-products.sh

# Add webhook for new products
# Webhook auto-updates KV
```

### Final State
```
# Webhook handles all updates
# Manual script only for emergency full sync
```

---

## 📚 Related Documentation

- **Worker API:** `docs/api/cloudflare-api.md`
- **Stripe Integration:** `docs/modules/payment.md`
- **Business Requirements:** `docs/business/BUSINESS_REQUIREMENTS.md`
- **Current Sync Script:** `scripts/fetch-stripe-products.sh`

---

## ✅ Acceptance Criteria

- [ ] Webhook endpoint implemented in Worker
- [ ] Webhook configured in Stripe Dashboard
- [ ] `product.created` updates KV automatically
- [ ] `product.updated` updates KV automatically
- [ ] `product.deleted` removes from KV
- [ ] Product index rebuilds after changes
- [ ] Webhook signature verified
- [ ] Error handling for failed webhooks
- [ ] Logging for debugging
- [ ] Test coverage for webhook handler

---

## 🔄 Rollback Plan

If webhook fails:
1. Disable webhook in Stripe Dashboard
2. Revert to manual sync: `./scripts/fetch-stripe-products.sh`
3. Frontend still works (reads from KV)
4. Fix webhook issue
5. Re-enable webhook

**Risk:** Low - Manual sync always available as fallback

