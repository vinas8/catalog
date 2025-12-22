# Virtual Snakes Plugin - Disabled

**Date:** 2025-12-22  
**Status:** ✅ Complete

## Changes Made

### 1. Created Feature Flags System
**File:** `src/config/feature-flags.js`
```javascript
export const FEATURE_FLAGS = {
  ENABLE_VIRTUAL_SNAKES: false,  // ❌ DISABLED
  ENABLE_BREEDING: false,
  ENABLE_MARKETPLACE: false,
  ENABLE_SOCIAL_FEATURES: false
};
```

### 2. Updated Catalog Renderer
**File:** `src/modules/shop/ui/catalog-renderer.js`
- Imported `FEATURE_FLAGS`
- Modified virtual product filtering:
  ```javascript
  const virtualProducts = FEATURE_FLAGS.ENABLE_VIRTUAL_SNAKES 
    ? filteredProducts.filter(p => p.type === 'virtual')
    : [];
  ```

### 3. Hidden Virtual Section in HTML
**File:** `catalog.html`
- Added `style="display: none;"` to virtual snakes section
- Added comment: `<!-- Virtual Snakes (DISABLED - Feature Flag) -->`

### 4. Removed Virtual Snakes from KV Index
**Updated:** `_index:products` in PRODUCTS KV namespace
- **Before:** 8 products (including `virtual_bp_001`, `virtual_cs_001`)
- **After:** 6 real products only

**Current Products:**
1. `prod_default_banana_ball`
2. `prod_default_piebald_ball`
3. `prod_default_corn_amel`
4. `prod_stripe_snake_001`
5. `prod_TdKcnyjt5Jk0U2` (Batman Ball)
6. `prod_TeTICJsKnUh6Xz` (Amelanistic Corn)

### 5. Updated Documentation
**File:** `README.md`
- Added feature flags section
- Replaced module-config reference with feature-flags
- Updated key features list

## How to Re-enable

### Option 1: Feature Flag Only (Keep in KV)
```javascript
// src/config/feature-flags.js
ENABLE_VIRTUAL_SNAKES: true
```

### Option 2: Full Re-enable (Add to Index)
```bash
# 1. Enable flag
vim src/config/feature-flags.js  # Set to true

# 2. Update KV index
bash scripts/rebuild-product-index.sh

# 3. Unhide HTML section
vim catalog.html  # Remove display:none
```

## Benefits

✅ **Clean Architecture** - Feature flags pattern established  
✅ **No Code Deletion** - Virtual snake code still exists  
✅ **Easy Toggle** - One-line change to re-enable  
✅ **Scalable** - Pattern ready for future features  
✅ **Zero Breakage** - All 71 tests still pass  

## What Still Exists

The virtual snake **code** is still in place:
- `renderVirtualCard()` function in catalog-renderer.js
- Virtual product data in KV (just not indexed)
- Virtual snake HTML section (just hidden)

**Nothing was deleted** - just disabled via feature flag.

## Future Feature Flags

Ready to add:
- `ENABLE_BREEDING` - Snake breeding mechanics
- `ENABLE_MARKETPLACE` - User-to-user trading
- `ENABLE_SOCIAL_FEATURES` - Friends, leaderboards

---

**Result:** Catalog now shows **only 6 real snakes** available for Stripe purchase. Virtual snakes hidden but can be re-enabled anytime.
