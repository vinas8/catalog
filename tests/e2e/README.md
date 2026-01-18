# Demo Flow E2E Tests

Tests the complete user journey: **Clear → Import → Verify → Purchase**

## 🎯 Quick Start

### Option 1: Browser Demo (Visual + Auto-run)
```bash
python3 -m http.server 8001
# Open: http://localhost:8001/demo/
# Select: 🧪 Automated Test Flow
```

### Option 2: CLI Test (Fast)
```bash
bash tests/e2e/demo-flow.sh
```

---

## ✅ What Gets Tested

| Step | Action | Error Detection |
|------|--------|-----------------|
| 1. Clear | Remove localStorage, cache | - |
| 2. Empty | Count products in catalog | ❌ Errors if >0 products |
| 3. Import | Add test snake (Banana Het Clown) | - |
| 4. Verify | Check snake appears in catalog | ❌ Errors if 0 or >1 products |
| 5. View | Click "View Details" button | - |
| 6. Buyable | Check for Stripe payment link | ❌ Errors if no link |
| 7. Purchase | Verify checkout available | ❌ Errors if unavailable |

---

## 🔍 Error Detection

### Step 2: Not Empty
```
📊 Found 51 products (expected 0)
❌ ERROR: Catalog not empty
```
→ **Fix**: Clear Stripe products or localStorage

### Step 4: Not Found
```
📊 Found 0 products
❌ ERROR: Snake NOT found after import
```
→ **Fix**: Check import/sync, verify Stripe API key

### Step 4: Multiple Products
```
📊 Found 51 products (expected 1)
❌ ERROR: Data NOT cleared in Step 1
```
→ **Fix**: Step 1 failed to clear old data

### Step 6: Not Buyable
```
❌ ERROR: Missing Stripe payment link
```
→ **Fix**: Add `stripe_link` to Stripe product metadata

---

## 📊 Test Results

### Browser Demo
- ✅ Auto-runs all steps (no clicking)
- ✅ Real-time validation
- ✅ Stops on errors
- ✅ Visual feedback
- ⚠️ Requires server running

### CLI Test
- ✅ Runs in terminal
- ✅ Tests API directly
- ✅ Exit code 0/1
- ✅ No browser needed
- ⚠️ Network dependent

---

## 🛠️ Troubleshooting

### Browser test hangs
```bash
# Check console for errors
# Verify worker URL in catalog.html
# Check CORS settings
```

### CLI test fails "fetch failed"
```bash
# Test worker directly
curl https://catalog.navickaszilvinas.workers.dev/products

# Check internet connection
```

### Products not clearing
```javascript
// In browser console
localStorage.clear()
sessionStorage.clear()
location.reload()
```

---

## 📁 Files

- Browser demo: `/demo/index.html`
- CLI test: `/tests/e2e/demo-flow.sh`
- Demo module: `/src/modules/demo/Demo.js`
- Product page: `/product.html`
- Catalog: `/catalog.html`

---

## 🚀 CI/CD

```yaml
- name: E2E Demo Test
  run: bash tests/e2e/demo-flow.sh
  env:
    STRIPE_SECRET_KEY: ${{ secrets.STRIPE_SECRET_KEY }}
```

---

## 📚 More Info

- [Old E2E Tests](./README-OLD.md) - Legacy test suite
- [Integration Tests](../integration/README.md)
- [Customer Journeys](../../demo/customer-journeys/)
