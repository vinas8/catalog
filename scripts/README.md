# Scripts Directory

**Clean and organized scripts** - Only essential tools remain!

## 🔍 Development Tools (NEW in v0.7.7)

### `npm run dev:check`
**Run all project health checks** - consistency + architecture analysis.

```bash
npm run dev:check
```

### `npm run dev:consistency`
**Check project consistency** - versions, structure, duplicates, file sizes.

Validates:
- ✅ Version consistency across package.json, README.md, .smri/INDEX.md
- ✅ Module structure (all modules have index.js)
- ✅ SMRI structure (only INDEX.md in root)
- ✅ Duplicate files (smri-runner-*.html, demo-*.html, etc.)
- ✅ File sizes (warn if >500 lines for .md, >1000 for .js)
- ✅ Module exports (PUBLIC-API.md, module-functions.js exist)

### `npm run dev:architecture`
**Analyze architecture health** - dependencies, coupling, complexity.

Analyzes:
- 🔗 Module dependencies (shows dependency graph)
- 🎭 Facade pattern compliance (ENABLED flag, clean exports)
- 🔄 Circular dependencies (detects cycles)
- 📂 File organization (counts by category)
- 🧮 Code complexity (flags complex files >500 lines or high cyclomatic complexity)

---

## 📋 Core Workflow (4 scripts)
1. `1-clear-stripe-products.sh` - Clear all Stripe products
2. `2-upload-products-to-stripe.sh` - Upload products to Stripe
3. `3-import-stripe-to-kv.sh` - Sync Stripe → KV
4. `4-verify-sync.sh` - Verify synchronization

## 🛠️ Utilities (7 scripts)
- `build-kv-index.sh` - Build product index from KV
- `clear-all-data.sh` - Nuclear option - clear everything
- `clear-customers.sh` - Clear customer data
- `clear-kv-data.sh` - Clear KV storage
- `fix-kv-products-with-prices.sh` - Add price fields to products
- `deploy-worker-api.sh` - Deploy Cloudflare Worker
- `start-server.sh` - Start local development server

## 🔍 Testing & Verification (2 scripts)
- `test-worker-curl.sh` - Test Worker endpoints
- `verify-api-connections.sh` - Verify API health

## 📦 Archived Scripts
See `_archive/` folder for removed duplicates, obsolete scripts, and old test files.

**Total:** 13 scripts (down from 37)
**Archived:** 24 scripts
