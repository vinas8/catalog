# Debug Catalog Loading - Step by Step

## Files Created

1. **`data/cache/kv-products.json`** - Cached response from Worker API (17 products)
2. **`test-catalog-simple.html`** - Step-by-step test page
3. **Updated `src/modules/debug/index.html`** - Added cache viewer and rendering test

## Test Options

### Option A: Debug Dashboard (Recommended)

```
URL: http://localhost:8000/debug.html
```

**Steps:**
1. Click "Catalog" tab
2. Click "📂 View Cache" → Shows 17 cached products
3. Click "🧪 Test Catalog Loading" → Tests loadCatalog() function
4. Click "🎨 Test Rendering" → Tests renderProductCard()

**What to check:**
- Does it load products from Worker?
- How many products are returned?
- Are there any errors?

### Option B: Simple Test Page

```
URL: http://localhost:8000/test-catalog-simple.html
```

**What it does:**
1. Loads Worker config
2. Fetches from Worker API directly
3. Loads catalog module
4. Calls loadCatalog()
5. Loads catalog renderer
6. Calls renderStandaloneCatalog()

**Progress shown step-by-step** - you'll see exactly where it fails!

### Option C: Real Catalog Page

```
URL: http://localhost:8000/catalog.html
```

**Steps:**
1. Open page
2. Press F12 (browser console)
3. Look for logs starting with 🔄 or ❌
4. Copy any error messages

## Expected Console Logs

If working correctly, you should see:

```
🔄 renderStandaloneCatalog START { selectedSpecies: 'all' }
📡 Calling loadCatalog()...
📡 Fetching products from Worker API...
✅ Loaded from Worker API: 17 products
✅ loadCatalog returned: 17 products
✅ After species filter: 17 products
✅ Real products: 15 Virtual: 2
✅ Available: 15 Sold: 0
✅ User hash: abc123...
🎨 Rendering 15 available snakes
✅ renderStandaloneCatalog COMPLETE
```

## Common Issues & Solutions

### Issue 1: "Loading..." forever
**Cause:** JavaScript error during rendering  
**Check:** Browser console for error message  
**Fixed:** Added null-safe price handling

### Issue 2: No products returned
**Cause:** Worker API not responding  
**Check:** Run `curl https://catalog.navickaszilvinas.workers.dev/products`  
**Solution:** Check Worker deployment

### Issue 3: Import errors
**Cause:** Module path incorrect  
**Check:** 404 errors in Network tab  
**Solution:** Verify paths start with `./` or `/`

## Cached Data Location

```
/root/catalog/data/cache/kv-products.json
```

**Contains:** 17 products from Worker API
- 15 real products
- 2 virtual products
- Some products have missing `price` field (handled)

## Files Modified

1. **`src/modules/shop/ui/catalog-renderer.js`**
   - Added safe price handling
   - Added null checks for fields
   - Disabled buy button for products without price

2. **`src/modules/debug/index.html`**
   - Added cache viewer
   - Added rendering test
   - Added detailed logging

## Next Steps

1. **Run one of the test options above**
2. **Share the console output or error message**
3. **If test page works but catalog.html doesn't** → likely an import path issue
4. **If nothing works** → Worker API may be down

---

**Created:** 2025-12-23T06:00 UTC  
**Purpose:** Debug catalog "Loading..." issue
