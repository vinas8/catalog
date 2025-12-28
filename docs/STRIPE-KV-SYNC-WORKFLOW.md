# Stripe → KV Product Sync - Complete Workflow

**Date:** 2025-12-28  
**Purpose:** Automated process to sync products with correct name/morph structure

---

## Problem Solved

**Issue:** Product names were incorrectly combined
- ❌ **Before:** "Pudding Banana H. Clown" (full name)
- ✅ **After:** name="Pudding", morph="Banana H. Clown" (separated)

---

## Automated Script

### Location
```bash
scripts/sync-stripe-kv-complete.sh
```

### Usage
```bash
cd /root/catalog
bash scripts/sync-stripe-kv-complete.sh
```

### What It Does

**Step 1:** Clear old Stripe products
- Deletes all existing products
- Ensures clean slate

**Step 2:** Upload to Stripe
- Reads from `data/products-for-stripe.json`
- Creates 24 products with correct structure:
  - `name`: Single word (Pudding, Gangsta, etc.)
  - `metadata.morph`: Full genetics
  - `metadata.gender`: Male/Female
  - `metadata.yob`: Birth year
  - `metadata.species`: ball_python or corn_snake
- Default price: €150 (15,000 cents)

**Step 3:** Import to KV
- Fetches all Stripe products
- Transforms to KV format
- Uploads to `PRODUCTS` namespace
- Key pattern: `product:{stripe_id}`

**Step 4:** Rebuild index
- Creates `_index:products` with all IDs
- Worker uses this for fast product listing

**Step 5:** Verify
- Checks Worker API
- Confirms product count
- Displays sample products

---

## Data Structure

### Source File: `data/products-for-stripe.json`
```json
{
  "products": [
    {
      "name": "Pudding",
      "morph": "Banana H. Clown",
      "gender": "Male",
      "yob": 2024,
      "species": "ball_python"
    }
  ]
}
```

### Stripe Product
```
name: "Pudding"
description: "ball_python | Banana H. Clown | Male | Born 2024"
metadata:
  nickname: "Pudding"
  morph: "Banana H. Clown"
  gender: "Male"
  yob: "2024"
  species: "ball_python"
default_price: 15000 (€150)
```

### KV Storage
```json
{
  "id": "prod_xxx",
  "name": "Pudding",
  "description": "ball_python | Banana H. Clown | Male | Born 2024",
  "species": "ball_python",
  "morph": "Banana H. Clown",
  "gender": "Male",
  "birth_year": 2024,
  "price": 150,
  "currency": "eur",
  "stripe_price_id": "price_xxx",
  "status": "available",
  "source": "stripe"
}
```

---

## Key Improvements

### 1. Correct Name Structure
- **name** = Nickname only (Pudding)
- **morph** = Genetics only (Banana H. Clown)
- Clear separation for better data management

### 2. Worker Integration
- Worker code already expects this structure
- Webhook uses `metadata.morph` correctly
- No code changes needed - just data fix

### 3. Automated Process
- Single script runs entire workflow
- No manual steps required
- Consistent results every time

---

## Troubleshooting

### Script fails at Step 1 (Clear)
- Check STRIPE_SECRET_KEY in worker/.env
- Verify Stripe API access

### Script fails at Step 2 (Upload)
- Check jq is installed: `apt-get install jq`
- Verify source file exists
- Check for special characters in names

### Script fails at Step 3/4 (KV)
- Check CLOUDFLARE_API_TOKEN in worker/.env
- Verify CLOUDFLARE_ACCOUNT_ID
- Check KV namespace ID matches

### Products don't appear on catalog
- Wait 30 seconds for KV propagation
- Hard refresh browser (Ctrl+Shift+R)
- Check Worker API directly:
  ```bash
  curl https://catalog.navickaszilvinas.workers.dev/products
  ```

---

## Manual Steps (if needed)

### 1. Update Source Data
Edit `data/products-for-stripe.json`:
```bash
nano data/products-for-stripe.json
```

### 2. Run Sync
```bash
bash scripts/sync-stripe-kv-complete.sh
```

### 3. Verify
```bash
curl https://catalog.navickaszilvinas.workers.dev/products | jq 'length'
```

---

## Environment Requirements

### Required in `worker/.env`:
```bash
STRIPE_SECRET_KEY=sk_test_xxx
CLOUDFLARE_API_TOKEN=xxx
CLOUDFLARE_ACCOUNT_ID=xxx
```

### Required Tools:
- `curl` - HTTP requests
- `jq` - JSON processing
- `bash` - Script execution

---

## Related Files

- **Source:** `data/products-for-stripe.json`
- **Script:** `scripts/sync-stripe-kv-complete.sh`
- **Backup:** `data/snake-collection-complete.json` (full collection with all fields)
- **Worker:** `worker/worker.js` (webhook handler)
- **Old Scripts:** `scripts/1-clear-stripe-products.sh` through `4-verify-sync.sh` (deprecated)

---

## Changelog

### 2025-12-28
- ✅ Fixed name/morph separation
- ✅ Created automated sync script
- ✅ Documented complete workflow
- ✅ Verified 24 products with correct structure

### 2025-12-27
- ✅ Initial Stripe → KV sync system
- ✅ Manual 4-step process
- ❌ Incorrect name structure (combined)

---

## Success Metrics

After running script:
- ✅ Stripe: 24 products with prices
- ✅ KV: 24 products indexed
- ✅ Worker API: Returns all 24
- ✅ catalog.html: Shows correct names/morphs

---

## Next Steps

1. **Test Purchase Flow:**
   - Buy Baby Pastel Ball Python
   - Verify webhook assigns correctly
   - Check name appears as "Baby" not "Baby Pastel Ball Python"

2. **Monitor Webhook:**
   - Check Cloudflare Worker logs
   - Verify STRIPE_SECRET_KEY is working
   - Confirm products assigned to users

3. **Update Frontend:**
   - Ensure catalog.html displays `name` + `morph` separately
   - Check game.html uses correct fields

---

*Last updated: 2025-12-28*  
*Script version: 1.0*  
*Status: Production Ready ✅*
