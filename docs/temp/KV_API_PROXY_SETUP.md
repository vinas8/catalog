# KV API Proxy Setup

**Status:** Code ready, needs deployment ⏳

## 🎯 What Was Added

Added two new Worker endpoints that proxy KV API calls from the browser (avoiding CORS):

### New Endpoints:

1. **GET /kv/list-products**
   - Lists all product keys in PRODUCTS namespace
   - Returns: `{ success: true, result: [...keys], count: N }`

2. **GET /kv/get-product?id=PRODUCT_ID**
   - Gets a specific product from PRODUCTS namespace
   - Returns: `{ success: true, result: {...product} }`

## 📝 Files Modified:

1. **worker/worker.js** ✅
   - Added route handlers for `/kv/list-products` and `/kv/get-product`
   - Added `handleKVListProducts()` function
   - Added `handleKVGetProduct()` function

2. **src/modules/debug/index.html** ✅
   - Updated `testKVAPI()` to use new Worker proxy endpoints
   - Changed warning from red (CORS blocked) to green (works!)

## 🚀 To Deploy:

```bash
cd /root/catalog/worker
npx wrangler deploy
```

Or use the deploy script:
```bash
bash worker/deploy.sh
```

## ✅ After Deployment:

KV API tests in debug hub will work:
- ht tp://localhost:8000/debug.html
- Select "🧪 API Tests" module
- Click "▶ Run Test" on KV tests
- Should see green success messages!

## 🧪 Test Endpoints:

```bash
# List products
curl https://catalog.navickaszilvinas.workers.dev/kv/list-products

# Get specific product
curl https://catalog.navickaszilvinas.workers.dev/kv/get-product?id=prod_TdKcnyjt5Jk0U2
```

---

**Why This Works:**
- Browser → Worker (same origin, no CORS) ✅
- Worker → Cloudflare KV (server-side, no CORS) ✅
- Direct Browser → Cloudflare KV API (CORS blocked) ❌

**Solution:** Worker acts as proxy!
