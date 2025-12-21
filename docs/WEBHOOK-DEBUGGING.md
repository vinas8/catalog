# Stripe Webhook Debugging Guide

## ✅ Current Status

**Webhook is working!** Test shows successful response:
```json
{
  "success": true,
  "message": "Product assigned to user",
  "user_id": "test_user_xxx",
  "product_id": "prod_TdKcnyjt5Jk0U2"
}
```

## ⚠️ Missing Feature

**PRODUCT_STATUS tracking not active** because:
- KV namespace `PRODUCT_STATUS` has placeholder ID in `wrangler.toml`
- Line 13: `id = "PLACEHOLDER_CREATE_THIS_NAMESPACE"`
- Deployed worker doesn't have sold status tracking yet

## 🔧 Fix Required

### Step 1: Create PRODUCT_STATUS Namespace

```bash
cd worker
bash create-product-status-kv.sh
```

This will output something like:
```
Created namespace PRODUCT_STATUS
ID: abc123def456ghi789
```

### Step 2: Update wrangler.toml

Replace line 13 in `worker/wrangler.toml`:
```toml
# OLD
id = "PLACEHOLDER_CREATE_THIS_NAMESPACE"

# NEW (use your actual ID)
id = "abc123def456ghi789"
```

### Step 3: Deploy Updated Worker

```bash
cd worker
wrangler publish worker.js
```

### Step 4: Verify

```bash
bash ../scripts/test-webhook.sh
```

Should see:
```json
{
  "success": true,
  "message": "Product assigned to user and marked as sold",  ← NEW!
  "user_id": "test_user_xxx",
  "product_id": "prod_TdKcnyjt5Jk0U2"
}
```

## 🧪 Testing

Use the test script to verify webhook functionality:

```bash
# Test webhook handler
bash scripts/test-webhook.sh

# Watch live webhook calls
cd worker && wrangler tail
```

## 🔍 What the Test Does

1. Sends a mock Stripe `checkout.session.completed` event
2. Includes `client_reference_id` (user hash)
3. Includes `metadata.product_id` (product ID)
4. Checks if worker responds with success

## 📊 Expected Data Flow

```
Stripe Payment Success
  ↓
Webhook → POST /stripe-webhook
  ↓
Worker receives payload
  ↓
Extracts: client_reference_id, product_id
  ↓
Writes to USER_PRODUCTS KV (user's collection)
  ↓
Writes to PRODUCT_STATUS KV (mark as sold) ← MISSING CURRENTLY
  ↓
Returns success response
```

## 🐛 Common Issues

### Issue: "Product assigned" but not "marked as sold"
**Cause:** PRODUCT_STATUS namespace not created or not bound
**Fix:** Follow steps above to create namespace

### Issue: "Missing user hash or product ID"
**Cause:** Stripe not sending `client_reference_id` in webhook
**Fix:** Check catalog.html appends hash to Stripe URL (line 183)

### Issue: No response from webhook
**Cause:** Worker not deployed or wrong URL
**Fix:** Deploy with `wrangler publish worker.js`

### Issue: CORS errors in browser
**Cause:** Worker CORS headers misconfigured
**Fix:** Check `corsHeaders` object in worker.js (lines 29-34)

## 📝 Webhook Payload Structure

Stripe sends this format:
```json
{
  "type": "checkout.session.completed",
  "data": {
    "object": {
      "id": "cs_xxx",
      "client_reference_id": "user_abc123",  ← User hash
      "payment_intent": "pi_xxx",
      "amount_total": 45000,
      "currency": "usd",
      "metadata": {
        "product_id": "prod_xxx"  ← Product ID
      }
    }
  }
}
```

## 🔗 Related Files

- `worker/worker.js` - Webhook handler (line 84)
- `worker/wrangler.toml` - KV namespace config
- `catalog.html` - Appends user hash to checkout URL (line 183)
- `scripts/test-webhook.sh` - Test script

## ✅ Verification Checklist

- [ ] PRODUCT_STATUS namespace created
- [ ] wrangler.toml updated with real namespace ID
- [ ] Worker deployed (`wrangler publish worker.js`)
- [ ] Test script passes (`bash scripts/test-webhook.sh`)
- [ ] Response includes "marked as sold" message
- [ ] Catalog shows sold snakes in "Sold Snakes" section

---

**Last Updated:** 2025-12-21  
**Test Script:** `scripts/test-webhook.sh`
