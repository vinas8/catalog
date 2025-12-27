# Stripe → KV Product Sync Documentation

## Overview

This system syncs products between **Stripe** (payment platform) and **Cloudflare KV** (storage), ensuring the catalog always displays up-to-date products.

**Flow:** 
```
Source of Truth → Stripe → Cloudflare KV → catalog.html
(JSON file)       (API)    (Worker)       (Frontend)
```

---

## Architecture

### Components

1. **Source Data** - `data/new-products-2025.json`
   - 24 products with name, morph, gender, year of birth, weight
   - Ball pythons (#1-17) and Corn snakes (#18-24)

2. **Stripe** - Payment & product catalog
   - Products created with metadata (morph, gender, yob, species, weight)
   - Default prices in EUR (€150 = 15,000 cents)
   - Products have unique IDs (`prod_xxx`)

3. **Cloudflare KV** - Fast key-value storage
   - Namespace: `PRODUCTS` (`ecbcb79f3df64379863872965f993991`)
   - Keys: `product:prod_xxx` (one per product)
   - Index: `_index:products` (array of all product IDs)

4. **Worker API** - Cloudflare Worker (`worker/worker.js`)
   - Endpoint: `GET /products` - Returns all products from KV
   - Reads from KV, transforms for frontend

5. **Frontend** - `catalog.html`
   - Fetches from Worker API
   - Displays products with Stripe payment links

---

## Scripts

### Quick Start (All Steps)
```bash
bash scripts/sync-products-master.sh
```

This runs all 4 steps with confirmations between each.

---

### Individual Scripts

#### 1. Clear Stripe Products
```bash
bash scripts/1-clear-stripe-products.sh
```

**What it does:**
- Fetches ALL products from Stripe (test mode)
- Deletes each product via API
- Verifies Stripe is empty (0 products)

**Safety:**
- Requires typing "DELETE" to confirm
- Only affects test mode (uses test API key)
- Returns count of deleted products

**Expected Output:**
```
Found 0 products to delete
✅ SUCCESS: Stripe is now empty (0 products)
```

---

#### 2. Upload Products to Stripe
```bash
bash scripts/2-upload-products-to-stripe.sh
```

**What it does:**
- Reads `data/new-products-2025.json`
- Creates 24 Stripe products with:
  - Name (e.g., "Pudding Banana H. Clown")
  - Description (species, gender, birth year)
  - Metadata (morph, gender, yob, species, weight)
  - Default price (€150 = 15,000 cents)
- Uses idempotency keys (prevents duplicates)
- Saves Stripe response to `data/stripe-products-uploaded.json`

**Idempotency:**
- Key format: `serpent_town_2025_{slug}`
- Slug derived from product name (lowercase, underscores)
- Re-running script won't create duplicates

**Expected Output:**
```
Created: 24
Failed: 0
✅ SUCCESS: All 24 products uploaded!
```

**Output File Structure:**
```json
{
  "products": [
    {
      "name": "Pudding Banana H. Clown",
      "morph": "Banana H. Clown",
      "gender": "Male",
      "yob": 2024,
      "weight": null,
      "species": "ball_python",
      "stripe_product_id": "prod_xxx",
      "stripe_price_id": "price_xxx",
      "price_eur": 150,
      "status": "available"
    }
  ],
  "created_at": "2025-12-27T09:00:00Z"
}
```

---

#### 3. Import Stripe → KV
```bash
bash scripts/3-import-stripe-to-kv.sh
```

**What it does:**
- Fetches products from Stripe API
- Transforms to KV format
- Uploads to Cloudflare KV namespace `PRODUCTS`
- Rebuilds product index (`_index:products`)

**KV Storage Format:**

**Key:** `product:prod_RfkN4WyRUDxx`  
**Value:**
```json
{
  "id": "prod_RfkN4WyRUDxx",
  "name": "Pudding Banana H. Clown",
  "description": "ball_python | Male | Born 2024",
  "species": "ball_python",
  "morph": "Banana H. Clown",
  "gender": "Male",
  "birth_year": 2024,
  "weight": null,
  "price": 150.00,
  "currency": "eur",
  "stripe_price_id": "price_xxx",
  "status": "available",
  "source": "stripe",
  "imported_at": "2025-12-27T09:05:00Z"
}
```

**Index Key:** `_index:products`  
**Value:**
```json
[
  "prod_RfkN4WyRUDxx",
  "prod_RfkN4WyRUEyy",
  ...
]
```

**Expected Output:**
```
Uploaded: 24
Failed: 0
✅ Product index created with 24 products
✅ SUCCESS: All 24 products imported to KV!
```

---

#### 4. Verify Sync
```bash
bash scripts/4-verify-sync.sh
```

**What it does:**
- Counts products in Stripe
- Counts products in KV (via Worker API)
- Compares counts (should all be 24)
- Shows sample product names

**Expected Output:**
```
1️⃣  Checking Stripe...
   Stripe products: 24

2️⃣  Checking Cloudflare KV (via Worker)...
   KV products: 24

3️⃣  Comparing counts...
   ✅ MATCH: Stripe (24) = KV (24) = Expected (24)

4️⃣  Sample product names from KV:
   • Pudding Banana H. Clown
   • Taohu Super Mojave
   • Chocolate Chip Pastel DG
   • Gangsta Spotnose Clown
   • Mashmellow Ivory (Super yellow belly)

✅ VERIFICATION PASSED
```

---

## Worker API Endpoints

### GET /products
Returns all products from KV namespace.

**URL:** `https://catalog.navickaszilvinas.workers.dev/products`

**Response:**
```json
[
  {
    "id": "prod_xxx",
    "name": "Pudding Banana H. Clown",
    "species": "ball_python",
    "morph": "Banana H. Clown",
    "gender": "Male",
    "birth_year": 2024,
    "price": 150.00,
    "currency": "eur",
    "status": "available"
  },
  ...
]
```

**How it works:**
1. Reads `_index:products` key (array of product IDs)
2. Fetches each product by key `product:{id}`
3. Returns array of all products

**Code:** `worker/worker.js` lines 469-530

---

## Troubleshooting

### Problem: Stripe has wrong number of products

**Solution:**
```bash
# Clear and re-upload
bash scripts/1-clear-stripe-products.sh
bash scripts/2-upload-products-to-stripe.sh
bash scripts/4-verify-sync.sh
```

---

### Problem: KV shows 0 products

**Check:**
1. Stripe has products: `curl -s "https://api.stripe.com/v1/products?active=true" -u "$STRIPE_SECRET_KEY:"`
2. KV namespace ID correct in script (line 27 of `3-import-stripe-to-kv.sh`)
3. Cloudflare API token has KV edit permissions

**Solution:**
```bash
bash scripts/3-import-stripe-to-kv.sh
```

---

### Problem: catalog.html shows old products

**Check:**
1. Browser cache - Hard refresh (Ctrl+Shift+R)
2. Worker API returns new products:
   ```bash
   curl https://catalog.navickaszilvinas.workers.dev/products | jq '.[] | .name'
   ```
3. catalog.html using correct API endpoint

**Solution:**
```bash
# Rebuild KV index
bash scripts/3-import-stripe-to-kv.sh
```

---

### Problem: Duplicate products in Stripe

**Cause:** Idempotency key changed or script run without clearing first

**Solution:**
```bash
# Clear all and start fresh
bash scripts/sync-products-master.sh
```

---

## Environment Variables

Required in `.env` or `worker/.env`:

```bash
# Stripe (test mode keys)
STRIPE_SECRET_KEY=sk_test_xxx

# Cloudflare
CLOUDFLARE_API_TOKEN=xxx
CLOUDFLARE_ACCOUNT_ID=xxx
```

**Get Stripe keys:** https://dashboard.stripe.com/test/apikeys  
**Get Cloudflare token:** Dashboard → My Profile → API Tokens

---

## Manual Operations

### Manually add one product to KV

```bash
source .env

PRODUCT_ID="prod_xxx"
PRODUCT_JSON='{"id":"prod_xxx","name":"New Snake","price":150}'

curl -X PUT \
  "https://api.cloudflare.com/client/v4/accounts/$CLOUDFLARE_ACCOUNT_ID/storage/kv/namespaces/ecbcb79f3df64379863872965f993991/values/product:$PRODUCT_ID" \
  -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
  -H "Content-Type: application/json" \
  --data "$PRODUCT_JSON"
```

---

### Manually list all KV keys

```bash
curl -s \
  "https://api.cloudflare.com/client/v4/accounts/$CLOUDFLARE_ACCOUNT_ID/storage/kv/namespaces/ecbcb79f3df64379863872965f993991/keys" \
  -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
  | jq '.result.keys[] | .name'
```

---

### Delete one product from KV

```bash
PRODUCT_ID="prod_xxx"

curl -X DELETE \
  "https://api.cloudflare.com/client/v4/accounts/$CLOUDFLARE_ACCOUNT_ID/storage/kv/namespaces/ecbcb79f3df64379863872965f993991/values/product:$PRODUCT_ID" \
  -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN"
```

---

## Product Data Reference

### 24 Products (Source of Truth)

| # | Name | Morph | Gender | Species | YOB |
|---|------|-------|--------|---------|-----|
| 1 | Pudding Banana H. Clown | Banana H. Clown | Male | Ball Python | 2024 |
| 2 | Taohu Super Mojave | Super Mojave | Male | Ball Python | 2024 |
| 3 | Chocolate Chip Pastel DG | Pastel DG | Male | Ball Python | 2021 |
| 4 | Gangsta Spotnose Clown | Spotnose Clown | Male | Ball Python | 2024 |
| 5 | Mashmellow Ivory | Ivory (Super yellow belly) | Male | Ball Python | 2024 |
| 6 | Brownie Black head | Black head | Male | Ball Python | 2024 |
| 7 | Almond Hurricane Butter... | Hurricane Butter Fire... | Female | Ball Python | 2024 |
| 8 | Caramel Hurricane butter... | Hurricane butter Spider... | Female | Ball Python | 2024 |
| 9 | Cookie HRA Pastel Fire... | HRA Pastel Fire Paradox... | Female | Ball Python | 2024 |
| 10 | Hershy Super Mystic | Super Mystic | Female | Ball Python | 2024 |
| 11 | Halibo Spotnose Super Enchi | Spotnose Super Enchi | Female | Ball Python | 2023 |
| 12 | Biscuit Leopard Lesser Pastel | Leopard Lesser Pastel | Female | Ball Python | 2024 |
| 13 | Salabao OD Highway | OD Highway | Female | Ball Python | 2023 |
| 14 | Waffel HGW Enchi Fire | HGW Enchi Fire | Female | Ball Python | 2023 |
| 15 | Toffee Spotnose Pastel H.DG | Spotnose Pastel H.DG | Female | Ball Python | 2023 |
| 16 | Coco Pastel het. DG | Pastel het. DG | Female | Ball Python | 2023 |
| 17 | Latte Lesser Spotnose... | Lesser Spotnose 66%... | Female | Ball Python | 2023 |
| 18 | Mochi Salmon Hypo Bloodred | Salmon Hypo Bloodred | Male | Corn Snake | 2023 |
| 19 | Milkshake Salmon Tessera | Salmon Tessera | Female | Corn Snake | 2024 |
| 20 | Berry Snow poss Hypo | Snow poss Hypo Strawberry | Female | Corn Snake | 2024 |
| 21 | Honey Opal | Opal | Female | Corn Snake | 2024 |
| 22 | Peachy Opal Tessera | Opal Tessera | Male | Corn Snake | 2024 |
| 23 | Lavender Lavender tessera | Lavender tessera | Female | Corn Snake | 2024 |
| 24 | Lolipop Salmon H. Bloodred | Salmon H. Bloodred | Female | Corn Snake | 2024 |

**Species Split:**
- Ball Pythons: #1-17 (17 total)
- Corn Snakes: #18-24 (7 total)

**Gender Split:**
- Male: 7 (Ball Python: 6, Corn Snake: 1)
- Female: 17 (Ball Python: 11, Corn Snake: 6)

**Birth Year:**
- 2021: 1
- 2023: 6
- 2024: 17

---

## Testing Checklist

After running sync workflow, verify:

- [ ] Stripe dashboard shows 24 active products
- [ ] Worker API returns 24 products: `curl https://catalog.navickaszilvinas.workers.dev/products | jq length`
- [ ] Product names match source data
- [ ] Metadata preserved (morph, gender, yob, species, weight)
- [ ] catalog.html displays all 24 products
- [ ] Stripe payment links work (test with one product)

---

## Maintenance

### When to re-sync

- Adding new snakes to inventory
- Updating prices in Stripe
- Fixing product metadata
- After manual Stripe changes

### Best Practices

1. **Always use scripts** - Don't manually edit Stripe/KV
2. **Update source JSON first** - `data/new-products-2025.json` is source of truth
3. **Test in staging** - Run on test Stripe account before production
4. **Backup before clearing** - Export Stripe products if needed
5. **Verify after changes** - Always run `4-verify-sync.sh`

---

## Related Documentation

- **Stripe API:** https://stripe.com/docs/api/products
- **Cloudflare KV:** https://developers.cloudflare.com/kv/
- **Worker Code:** `worker/worker.js` (lines 469-530, 800-870)
- **Stripe Webhook:** `docs/api/stripe-webhook-api.md`

---

*Last updated: 2025-12-27*  
*Version: 1.0*  
*Serpent Town v0.7.0*
