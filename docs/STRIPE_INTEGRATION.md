# Stripe Integration - Product Sync

## How It Works

1. **Local JSON Catalog** (`src/data/catalog.js`)
   - Contains snake products with metadata
   - Each product has `product_id` and optional `stripe_product_id`

2. **Stripe API Sync** (`src/business/stripe-sync.js`)
   - Fetches products from Stripe API
   - Merges with local catalog
   - Smart update logic

3. **Merge Logic**
   - **If product_id exists in local** → UPDATE with Stripe data
   - **If product_id new from Stripe** → ADD to catalog
   - **If product_id only in local** → KEEP (multi-tenant support)

## Usage

### Without Stripe (Local Only)
```javascript
// In game.js - set stripeKey to null
const stripeKey = null;
this.catalog = await initializeCatalog(stripeKey);
// Uses local catalog.js only
```

### With Stripe Sync
```javascript
// Set your Stripe secret key
const stripeKey = 'sk_test_your_key_here';
this.catalog = await initializeCatalog(stripeKey);
// Syncs with Stripe, merges with local
```

## Stripe Product Metadata

Add these fields to your Stripe products:

```
product_id: "bp_banana_001"  // Your unique ID
species: "ball_python"
morph: "banana"
info: "Co-dominant morph"
sex: "female"
weight_grams: "1200"
birth_date: "2023-06-20"
breeder: "local"
```

## Local Catalog Format

```javascript
{
  product_id: "bp_banana_001",      // Required: Your ID
  stripe_product_id: "prod_xyz",    // Added after sync
  stripe_price_id: "price_abc",     // Added after sync
  species: "ball_python",
  morph: "banana",
  name: "Banana Ball Python",
  description: "Stunning coloration",
  price: 199.99,
  stripe_link: "https://buy.stripe.com/...",
  metadata: { ... }
}
```

## Multi-Tenant Support

Products without `stripe_product_id` are **preserved**:
- Different breeders can use different Stripe accounts
- Local-only products won't be deleted
- Each tenant's products stay separate

## Cache

- Products cached in localStorage for 24 hours
- Auto-refresh after 24 hours
- Force refresh: Clear cache or restart

## Example Flow

1. You have 3 products in `catalog.js`
2. Stripe has 2 products (1 new, 1 updated)
3. After sync:
   - Product 1: Updated from Stripe
   - Product 2: Kept local-only
   - Product 3: Updated from Stripe
   - Product 4: Added from Stripe (new)
   - **Total: 4 products**

## Testing

```bash
# Run tests
npm test

# Check if catalog loads
curl http://localhost:8000/game.html
# Open browser console to see sync logs
```

## Enable Stripe Sync

1. Get your Stripe secret key from dashboard
2. Edit `game.js`:
   ```javascript
   const stripeKey = 'sk_test_YOUR_KEY';
   ```
3. Restart server
4. Products will auto-sync on page load

## Disable Stripe (Use Local Only)

```javascript
const stripeKey = null; // Already set to null by default
```

---

**Status:** ✅ Implemented & Ready
