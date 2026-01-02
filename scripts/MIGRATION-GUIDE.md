# Gamified Shop Migration Scripts

Complete scripts for creating KV namespaces and migrating products.

## Scripts

### 4b-create-kv-namespaces.sh
Creates 3 new KV namespaces using wrangler CLI:
- PRODUCTS_REAL
- PRODUCTS_VIRTUAL
- USERS

**Usage:**
```bash
cd scripts
./4b-create-kv-namespaces.sh
```

**Output:**
- Creates namespaces in Cloudflare
- Saves IDs to `kv-namespace-ids.txt`
- Backs up `wrangler.toml`

**Manual step:**
Copy IDs from `kv-namespace-ids.txt` into `worker/wrangler.toml`

---

### 5-migrate-products-split.sh
Migrates products from PRODUCTS to PRODUCTS_REAL/PRODUCTS_VIRTUAL.

**Logic:**
- Reads all products from PRODUCTS namespace
- Checks `type` field (defaults to 'real' if missing)
- Adds `type` field if not present
- Copies to PRODUCTS_REAL or PRODUCTS_VIRTUAL
- Creates backup in `data/backup-TIMESTAMP/`

**Usage:**
```bash
cd scripts
./5-migrate-products-split.sh
```

**Requirements:**
- PRODUCTS_REAL and PRODUCTS_VIRTUAL must exist
- IDs must be in `worker/wrangler.toml`
- `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` in `.env`

**Output:**
- Backup directory with all products as JSON
- Migration summary (real count, virtual count, failures)

---

## Full Migration Process

**Step 1: Create namespaces**
```bash
cd /root/catalog/scripts
./4b-create-kv-namespaces.sh
```

**Step 2: Update wrangler.toml**
```bash
# Copy IDs from scripts/kv-namespace-ids.txt
# Paste into worker/wrangler.toml
nano ../worker/wrangler.toml
```

**Step 3: Run migration**
```bash
./5-migrate-products-split.sh
```

**Step 4: Verify**
```bash
# Open in browser
http://localhost:8000/debug/gamified-shop-test.html
# Click "Run All Tests"
```

**Step 5: Deploy**
```bash
cd ../worker
wrangler publish
```

---

## Rollback Plan

If migration fails:

1. **Restore from backup:**
   ```bash
   BACKUP_DIR="data/backup-TIMESTAMP"
   # Use backup files to restore
   ```

2. **Original PRODUCTS namespace is untouched**
   - Migration only copies, doesn't delete
   - Can re-run migration after fixes

3. **Revert wrangler.toml:**
   ```bash
   cd worker
   cp wrangler.toml.backup wrangler.toml
   ```

---

## Environment Variables Required

Create `.env` or `worker/.env` with:

```bash
CLOUDFLARE_API_TOKEN="your_api_token"
CLOUDFLARE_ACCOUNT_ID="your_account_id"
```

Get these from:
- Cloudflare Dashboard → Account → API Tokens
- Account ID is in the URL

---

## Testing

**Before migration:**
```bash
npm test
# All 3 SMRI scenarios should pass
```

**After migration:**
```bash
# Open debug test
http://localhost:8000/debug/gamified-shop-test.html

# Run all 17 tests
# Verify:
# - Phase 3: Farm loads real snakes only
# - Phase 4: Learn loads virtual snakes only
# - No mixing occurs
```

---

## Troubleshooting

**Error: "wrangler not found"**
```bash
npm install -g wrangler
```

**Error: "Namespace ID not found"**
- Check `worker/wrangler.toml` has real IDs (not "TODO_CREATE_IN_CLOUDFLARE")
- Re-run `4b-create-kv-namespaces.sh`

**Error: "CLOUDFLARE_API_TOKEN not set"**
- Create `.env` file with tokens
- Or export in shell: `export CLOUDFLARE_API_TOKEN="..."`

**Products not showing up after migration:**
- Check Cloudflare dashboard → Workers → KV
- Verify products exist in PRODUCTS_REAL
- Check worker logs for errors

---

## Files Created

- `scripts/4b-create-kv-namespaces.sh` - Namespace creation
- `scripts/5-migrate-products-split.sh` - Product migration
- `scripts/kv-namespace-ids.txt` - Generated namespace IDs
- `data/backup-TIMESTAMP/` - Product backups

---

**Status:** Ready to run  
**Next:** Execute `./4b-create-kv-namespaces.sh`
