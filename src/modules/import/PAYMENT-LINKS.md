# Payment Links Integration

**Status:** ⚠️ In Progress  
**Goal:** Automatically create Stripe payment links during import

---

## 🎯 Overview

When importing products, the system should:
1. Create Stripe product ✅
2. Create Stripe price ✅
3. **Create Stripe payment link** 🆕
4. **Store link in metadata** 🆕
5. Sync to KV with links ✅

---

## 📋 Current State

### ✅ What Works
- Import module architecture complete
- CSV → Stripe product creation
- Price creation
- KV sync

### ❌ What's Missing
- Payment link creation during import
- Payment links not returned in `/products` API
- Buy buttons disabled in catalog

---

## 🔧 Implementation Plan

### 1. Update Worker `/upload-products` Endpoint

**Location:** `worker/worker.js` → `handleUploadProducts()`

**Current flow:**
```javascript
// Create product
POST /v1/products → product_id

// Create price  
POST /v1/prices → price_id

// ❌ MISSING: Create payment link
// ❌ MISSING: Add link to metadata
```

**New flow:**
```javascript
// Create product
POST /v1/products → product_id

// Create price
POST /v1/prices → price_id

// 🆕 Create payment link
POST /v1/payment_links → payment_link_url

// 🆕 Update product metadata
POST /v1/products/:id → metadata.stripe_link = url
```

### 2. Update StripeDestination

**Location:** `src/modules/import/destinations/StripeDestination.js`

**No changes needed!** It calls `/upload-products` which will handle everything.

### 3. Update Product Response Format

**Location:** `worker/worker.js` → `handleGetProducts()`

Ensure returned products include:
```javascript
{
  id: "prod_xxx",
  name: "Mochi",
  price: 180,
  stripe_link: "https://buy.stripe.com/test_xxx", // 🆕
  // ... other fields
}
```

---

## 💻 Code Changes Needed

### File: `worker/worker.js`

#### A. Update `handleUploadProducts()` function

**After line ~1850 (price creation):**

```javascript
// Create payment link
const linkData = new URLSearchParams({
  'line_items[0][price]': price.id,
  'line_items[0][quantity]': '1',
  'after_completion[type]': 'redirect',
  'after_completion[redirect][url]': 'https://vinas8.github.io/catalog/success.html'
});

const linkResponse = await fetch('https://api.stripe.com/v1/payment_links', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${stripeKey}`,
    'Content-Type': 'application/x-www-form-urlencoded'
  },
  body: linkData
});

if (!linkResponse.ok) {
  results.push({ 
    name: product.name, 
    success: false, 
    error: 'Payment link creation failed' 
  });
  continue;
}

const paymentLink = await linkResponse.json();

// Update product metadata with payment link
const metadataUpdate = new URLSearchParams({
  'metadata[stripe_link]': paymentLink.url
});

await fetch(`https://api.stripe.com/v1/products/${stripeProduct.id}`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${stripeKey}`,
    'Content-Type': 'application/x-www-form-urlencoded'
  },
  body: metadataUpdate
});

results.push({ 
  name: product.name, 
  success: true, 
  product_id: stripeProduct.id,
  price_id: price.id,
  stripe_link: paymentLink.url  // 🆕
});
```

#### B. Update `handleGetProducts()` function

Ensure products include `stripe_link` from metadata:

```javascript
// When returning products from KV
const products = allProducts.filter(p => p !== null).map(product => ({
  ...product,
  stripe_link: product.metadata?.stripe_link || null  // 🆕
}));
```

---

## 🧪 Testing Steps

### 1. Test Import Flow

```bash
# Go to admin/import.html
1. Upload CSV
2. Click "Upload to Stripe"
3. Verify console shows payment links created
4. Click "Sync to KV"
```

### 2. Test Catalog Display

```bash
# Go to catalog.html
1. Products should show "Buy Now - €XXX" (not disabled)
2. Click "Buy Now" → should redirect to Stripe checkout
3. Complete test purchase
```

### 3. Test Demo Flow

```bash
# Go to demo/
1. Run "Shop & Browse Products" scenario
2. All steps should work
3. "Buy Now" buttons should be clickable
```

---

## 📝 Manual Scripts (Backup)

If automatic creation fails, use standalone scripts:

```bash
# Create payment links for existing products
node scripts/create-stripe-payment-links.js

# Update product metadata
node scripts/update-products-with-links.js
```

---

## ✅ Success Criteria

- [ ] Import creates products WITH payment links
- [ ] `/products` API returns `stripe_link` field
- [ ] Catalog shows enabled "Buy Now" buttons
- [ ] Demo purchase flow completes end-to-end
- [ ] No duplicate code or logic

---

## 🔗 Related Files

- `worker/worker.js` - API endpoints
- `src/modules/import/destinations/StripeDestination.js` - Import destination
- `admin/import.html` - Admin UI
- `catalog.html` - Product display
- `demo/index.html` - Tutorial flow

---

## 📚 References

- [Stripe Payment Links API](https://stripe.com/docs/api/payment_links)
- [Stripe Products API](https://stripe.com/docs/api/products)
- [Import Module README](./README.md)
