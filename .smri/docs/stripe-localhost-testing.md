# Stripe Localhost Testing Limitation

**SMRI:** S4.0.01  
**Status:** ⚠️ Known Limitation  
**Updated:** 2026-01-18

---

## 🚨 The Problem

When testing on **localhost:8000**, Stripe payment links redirect to **GitHub Pages**, not localhost.

**Why?**
- Payment link redirect URL is hardcoded in `worker/worker.js` line 1779
- Set to: `https://vinas8.github.io/catalog/success.html`
- Stripe payment links are created once and can't change dynamically

---

## 🛠️ Solutions

### Option 1: Test on GitHub Pages (Recommended)
```bash
# Deploy and test on GitHub Pages
git push origin main

# Visit: https://vinas8.github.io/catalog/
# All Stripe flows work correctly
```

### Option 2: Use Demo Mode (Localhost)
```bash
# Visit: http://localhost:8000/demo/
# Run "Automated Test Flow"
# Uses placeholder links (no real Stripe)
```

### Option 3: Manual Stripe Dashboard Testing
```bash
# 1. Go to Stripe Dashboard
# 2. Create test payment link manually
# 3. Set redirect to http://localhost:8000/success.html
# 4. Copy link and test directly
```

---

## ⚠️ Why Snakes Don't Appear in "My Farm"

### Issue 1: Webhook Not Called
Stripe webhooks **only work with public URLs** (not localhost).

**Webhook endpoint:** `https://catalog.navickaszilvinas.workers.dev/stripe-webhook`

**Required:**
1. Configure webhook in Stripe Dashboard
2. Add endpoint URL
3. Enable event: `checkout.session.completed`

**Without webhook:**
- ❌ Payment completes
- ❌ Stripe doesn't notify worker
- ❌ Worker doesn't assign snake to user
- ❌ Snake doesn't appear in farm

### Issue 2: Local Webhook Testing

Use **Stripe CLI** to forward webhooks to localhost:

```bash
# Install Stripe CLI
# https://stripe.com/docs/stripe-cli

# Forward webhooks to local worker
stripe listen --forward-to http://localhost:8787/stripe-webhook

# Get webhook signing secret
stripe listen --print-secret

# Update worker environment
wrangler secret put STRIPE_WEBHOOK_SECRET
```

---

## ✅ Recommended Workflow

### For Development (Localhost)
1. ✅ Test UI/UX with demo mode
2. ✅ Test import/catalog with real Stripe API
3. ❌ Skip full purchase flow (webhook limitation)

### For Testing (GitHub Pages)
1. ✅ Deploy to GitHub Pages
2. ✅ Test full purchase flow
3. ✅ Verify webhook assigns snake
4. ✅ Check "My Farm" shows snake

### For Production
1. ✅ Configure Stripe webhook
2. ✅ Test on production URL
3. ✅ Monitor webhook delivery in Stripe Dashboard

---

## 📝 Webhook Configuration Steps

### 1. Stripe Dashboard
```
1. Go to: https://dashboard.stripe.com/webhooks
2. Click "+ Add endpoint"
3. URL: https://catalog.navickaszilvinas.workers.dev/stripe-webhook
4. Events: Select "checkout.session.completed"
5. Save
```

### 2. Worker Environment
```bash
# Get webhook signing secret from Stripe Dashboard
# Add to worker
wrangler secret put STRIPE_WEBHOOK_SECRET
```

### 3. Test Webhook
```bash
# Send test event from Stripe Dashboard
# Check worker logs
wrangler tail
```

---

## 🔍 Debugging

### Check if webhook was called:
```bash
# View worker logs
wrangler tail

# Look for:
# "✅ Assigning product: prod_xxx to user: hash_xxx"
# "✅ Saved to USER_PRODUCTS KV"
```

### Check if snake was assigned:
```bash
# API endpoint
curl "https://catalog.navickaszilvinas.workers.dev/user-products?user=YOUR_HASH"
```

### Check success page:
```
1. Open browser console
2. Look for debug logs
3. Should show:
   - "Found user hash in localStorage"
   - "Found X product(s)"
```

---

## 📚 Related Files

- `worker/worker.js` - Line 1779 (redirect URL)
- `worker/worker.js` - Line 435-600 (webhook handler)
- `success.html` - Purchase success page
- `demo/index.html` - Demo flow (bypasses Stripe)

---

## 🎯 Summary

| Environment | Stripe Purchase | Webhook | Snake Assignment |
|-------------|----------------|---------|------------------|
| Localhost   | ❌ Redirects to GitHub | ❌ Doesn't work | ❌ No |
| GitHub Pages | ✅ Works | ✅ Works (if configured) | ✅ Yes |
| Demo Mode   | 🎬 Simulated | 🎬 Simulated | 🎬 Simulated |

**Bottom line:** Test full Stripe flow on GitHub Pages, use demo mode for localhost UI/UX testing.
