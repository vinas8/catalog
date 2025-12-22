# 🚀 Cloudflare KV Complete Setup Guide

**Date:** 2025-12-22  
**Status:** Ready to Deploy  
**Namespaces:** 3 (all created, 1 needs seeding)

---

## ✅ Current State

### KV Namespaces in Cloudflare Dashboard
| Name | Binding | ID | Status | Purpose |
|------|---------|----|----|---------|
| **SnakeMuffin** | USER_PRODUCTS | `3b88d32c0a0540a8b557c5fb698ff61a` | ✅ Active | User's purchased snakes |
| **catalog-PRODUCT_STATUS** | PRODUCT_STATUS | `57da5a83146147c8939e4070d4b4d4c1` | ✅ Active | Sold status tracking |
| **PRODUCTS** | PRODUCTS | `ecbcb79f3df64379863872965f993991` | ✅ Created | Product catalog |

### Wrangler Bindings
✅ All 3 namespaces bound in `worker/wrangler.toml`

---

## 🔧 Setup Steps

### Step 1: Verify PRODUCTS Namespace is Seeded

```bash
# Check if products are in KV
curl -s "https://api.cloudflare.com/client/v4/accounts/$CLOUDFLARE_ACCOUNT_ID/storage/kv/namespaces/ecbcb79f3df64379863872965f993991/keys" \
  -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" | python3 -m json.tool
```

**Expected:** 4 keys (3 products + 1 index)
- `product:prod_TdKcnyjt5Jk0U2`
- `product:virtual_bp_001`
- `product:virtual_cs_001`
- `_index:products`

### Step 2: Deploy Worker via Cloudflare Dashboard

**Why:** `wrangler` CLI hangs, manual deployment required

**Steps:**
1. Go to: https://dash.cloudflare.com/
2. Navigate to: **Workers & Pages** → **catalog**
3. Click: **Quick edit**
4. Copy content from: `/root/catalog/worker/worker.js`
5. Paste into editor
6. Click: **Save and Deploy** (takes ~30 seconds)

### Step 3: Test Worker Endpoints

```bash
# Test products endpoint (should return 3 products from KV)
curl "https://catalog.navickaszilvinas.workers.dev/products" | python3 -m json.tool

# Expected output:
[
  {"id": "prod_TdKcnyjt5Jk0U2", "name": "Batman Ball", ...},
  {"id": "virtual_bp_001", "name": "Virtual Ball Python", ...},
  {"id": "virtual_cs_001", "name": "Virtual Corn Snake", ...}
]
```

```bash
# Test sold status (should include product_id)
curl "https://catalog.navickaszilvinas.workers.dev/product-status?id=prod_TdKcnyjt5Jk0U2"

# Expected output:
{
  "status": "sold",
  "owner_id": "success_flow_1766372038",
  "sold_at": "2025-12-22T02:53:58.151Z",
  "payment_id": "pi_success_flow_...",
  "product_id": "prod_TdKcnyjt5Jk0U2"  ← Must be present!
}
```

### Step 4: Test Frontend

Open: https://vinas8.github.io/catalog/catalog.html

**Expected:**
- Products load from KV (check console: "✅ Loaded products from KV")
- Batman Ball appears in "Sold (1)" section
- "Buy Now" button disabled for sold items
- Virtual snakes in "Virtual" section

---

## 📁 Data Folder Migration

### Current State
```
data/
├── products.json  ← 3 products (testing only)
└── users.json     ← 1 demo user (testing only)
```

### Migration Plan

**Move to test data location:**
```bash
mkdir -p docs/temp/test-data
mv data/ docs/temp/test-data/
```

**Update references:**
- Frontend: Already has fallback to JSON (for development)
- Tests: Update path to `../../../docs/temp/test-data/`

**Purpose:**
- Production: Load from KV via worker
- Development: Fallback to JSON when worker unavailable
- Testing: Use JSON fixtures from test-data/

---

## 🎯 Expected Results

### Data Flow - Production
```
User → catalog.html → Worker API (/products) → PRODUCTS KV → Products display
                              ↓ (if worker down)
                         data/products.json (fallback)
```

### KV Namespace Usage
```
PRODUCTS (catalog)
├── product:prod_TdKcnyjt5Jk0U2 → Batman Ball data
├── product:virtual_bp_001 → Virtual Ball Python data
├── product:virtual_cs_001 → Virtual Corn Snake data
└── _index:products → ["prod_TdKcnyjt5Jk0U2", "virtual_bp_001", ...]

USER_PRODUCTS (ownership)
└── user:{hash} → [{product_id, purchased_at, ...}]

PRODUCT_STATUS (sold tracking)
└── product:prod_TdKcnyjt5Jk0U2 → {status: "sold", owner_id, ...}
```

---

## 🐛 Troubleshooting

### Issue: Worker returns "PRODUCTS namespace not configured"
**Solution:** Check wrangler.toml bindings are correct

### Issue: Products endpoint returns empty array
**Solution:** Run seed script again:
```bash
cd /root/catalog
CLOUDFLARE_ACCOUNT_ID="..." CLOUDFLARE_API_TOKEN="..." python3 << 'EOF'
# ... seeding script ...
EOF
```

### Issue: Frontend still loads from JSON
**Solution:** Check browser console - worker might be returning error

### Issue: Batman Ball shows as available (not sold)
**Solution:** Deploy worker (product_id fix not deployed yet)

---

## ✅ Deployment Checklist

- [x] PRODUCTS namespace created
- [x] Products seeded to KV
- [x] Wrangler.toml updated with bindings
- [x] Worker code updated (handleGetProducts + bug fix)
- [ ] **Deploy worker via dashboard** ← YOUR ACTION
- [ ] Test /products endpoint
- [ ] Test /product-status endpoint
- [ ] Test catalog.html page
- [ ] Move data/ folder to test-data
- [ ] Commit changes

---

## 🎓 Key Learnings

1. **KV Namespace Names:** Dashboard shows "SnakeMuffin" but binding is USER_PRODUCTS
2. **Manual Deployment:** Wrangler CLI hangs, use dashboard instead
3. **Fallback Pattern:** Always have JSON fallback for development
4. **Index Keys:** Use `_index:*` pattern for listing items
5. **Key Prefixes:** Use `product:`, `user:` prefixes for organization

---

**Next Step:** Deploy worker via Cloudflare Dashboard (5 minutes) 🚀
