# 🛒 Testing Purchase Flow - Quick Guide

**Date:** 2026-01-05  
**Issue:** Buy button gives 404 (checkout.html doesn't exist)  
**Solution:** Use debug purchase flow demo

---

## 🔴 Problem

Clicking "Buy Now" → 404 error

**Why?**
1. Products have `stripe_link: null` (not configured)
2. Catalog generates fake `checkout.html?product=xxx` link
3. `checkout.html` doesn't exist in project

---

## ✅ Solution: Use Debug Tools

### Option 1: Purchase Flow Demo (Recommended)

**URL:** http://localhost:8000/debug/purchase-flow-demo.html

**What it does:**
- ✅ Simulates complete purchase flow
- ✅ Tests all 9 steps (Catalog → Stripe → Webhook → KV → Game)
- ✅ No real Stripe needed
- ✅ Shows exactly what happens

**Steps:**
1. Open purchase-flow-demo.html
2. Click "▶️ Run Full Demo"
3. Watch the complete flow execute
4. Check output console

---

### Option 2: Localhost Auto-Detection (NEW!)

When on localhost, "Buy Now" buttons now link to debug demo:

```
http://localhost:8000/catalog.html
Click "Buy Now" → Goes to debug/purchase-flow-demo.html
```

**Auto-detects:**
- localhost → Test mode (debug demo)
- Production → Real Stripe (when configured)

---

## 🧪 Available Debug Tools

### 1. Purchase Flow Demo
**File:** `/debug/purchase-flow-demo.html`  
**Purpose:** Full E2E purchase test  
**Features:** 9-step simulation, logs everything

### 2. Complete Customer Journey
**File:** `/debug/complete-customer-journey.html`  
**Purpose:** User journey from start to finish  
**Features:** Step-by-step with UI

### 3. Debug Hub
**File:** `/debug/index.html`  
**Purpose:** All SMRI scenarios in one place  
**Features:** 60 scenarios, visual progress

### 4. Health Check
**File:** `/debug/healthcheck.html`  
**Purpose:** System health validation  
**Features:** API tests, status checks

---

## 🎯 How to Test Purchase Flow (Step by Step)

### Method 1: Automated Demo
```bash
# Open purchase demo
open http://localhost:8000/debug/purchase-flow-demo.html

# Click "Run Full Demo"
# Watch console output
# Verify all 9 steps pass
```

### Method 2: Manual Testing
```javascript
// 1. Browse catalog
open http://localhost:8000/catalog.html

// 2. Click product card
// 3. Click "Test Purchase" button (localhost only)
// 4. Follow demo flow
```

### Method 3: API Testing
```bash
# Test Worker endpoints
curl https://catalog.navickaszilvinas.workers.dev/products
curl https://catalog.navickaszilvinas.workers.dev/version
```

---

## 🔧 For Real Stripe Integration

To enable real purchases (production):

### 1. Create Stripe Price Objects
```bash
# Each product needs a Price ID
# In Stripe Dashboard:
# Products → Select product → Add price → Copy price_xxx ID
```

### 2. Add stripe_link to Products
```javascript
// Update product in KV with Stripe checkout link
{
  "id": "prod_xxx",
  "name": "Banana Ball Python",
  "stripe_link": "https://buy.stripe.com/xxx",  // ← Add this
  "price": 150
}
```

### 3. Alternative: Worker Checkout Endpoint
Create `/create-checkout-session` endpoint in worker:

```javascript
// POST /create-checkout-session
// Body: { product_id, user_hash }
// Returns: { checkout_url }
```

---

## 📊 Purchase Flow Architecture

```
User clicks "Buy Now"
    ↓
IF localhost:
    → debug/purchase-flow-demo.html (test mode)
    
IF production + stripe_link exists:
    → Stripe Checkout URL (real payment)
    
IF production + no stripe_link:
    → Alert: "Checkout not configured"
```

---

## 🎯 Current Status

### What Works ✅
- Debug purchase flow demo (full simulation)
- Catalog display with prices
- User hash generation
- Worker webhook handling
- KV product storage

### What Needs Setup ⚠️
- Real Stripe checkout session creation
- Price IDs for each product
- Payment link generation
- Production checkout flow

### Temporary Workaround ✅
- Localhost auto-links to debug demo
- Can test full flow without Stripe
- All 9 steps simulated

---

## 💡 Testing Checklist

### Before Each Test
- [ ] Clear localStorage cache
- [ ] Check worker is deployed
- [ ] Verify products exist in KV

### Test Scenarios
- [ ] Browse catalog (products load)
- [ ] Click "Test Purchase" (localhost)
- [ ] Run debug demo (9 steps pass)
- [ ] Check webhook simulation
- [ ] Verify KV assignment

### Expected Results
✅ Catalog loads instantly (cache)  
✅ Products show prices (€150 default)  
✅ Buy button works (demo mode)  
✅ Purchase flow completes  
✅ No 404 errors

---

## 🚀 Quick Commands

```bash
# Start server
cd /root/catalog
python3 -m http.server 8000

# Open catalog
open http://localhost:8000/catalog.html

# Open debug hub
open http://localhost:8000/debug/

# Open purchase demo
open http://localhost:8000/debug/purchase-flow-demo.html

# Test Worker API
curl https://catalog.navickaszilvinas.workers.dev/products
```

---

## 📝 Development Roadmap

### Phase 1: Testing (Current) ✅
- Use debug tools for testing
- Simulate purchase flow
- Validate worker endpoints

### Phase 2: Stripe Setup (Next)
- Create Price objects in Stripe
- Add checkout session endpoint
- Generate payment links

### Phase 3: Production (Future)
- Real Stripe integration
- Payment processing
- Webhook handling live

---

## 🔗 Related Files

- **Catalog:** `catalog.html` (fixed to use debug mode)
- **Demo:** `debug/purchase-flow-demo.html`
- **Worker:** `worker/worker.js` (webhook handler)
- **Scenarios:** `.smri/scenarios/S1-*.md`

---

## ✅ Summary

**Problem:** 404 on buy click  
**Cause:** checkout.html doesn't exist  
**Solution:** Use debug/purchase-flow-demo.html  
**Status:** Fixed for localhost testing  

**For production:** Need Stripe checkout session creation

---

**Created:** 2026-01-05  
**Testing:** Use /debug/ tools  
**Production:** Requires Stripe setup
