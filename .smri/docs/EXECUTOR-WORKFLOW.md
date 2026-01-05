# 🎯 SMRI Executor-Driven Workflow

**Version:** 0.8.0  
**Last Updated:** 2026-01-05  
**Purpose:** All operations via SMRI executor - no manual scripts

---

## 🔄 Philosophy Change

### Before (Manual Scripts Era)
```bash
# Manual workflow - archived 2026-01-05
bash scripts/1-clear-stripe-products.sh
bash scripts/2-upload-products-to-stripe.sh
bash scripts/3-import-stripe-to-kv.sh
bash scripts/4-verify-sync.sh
```

### After (Executor-Driven Era)
```
1. Open /debug/index.html
2. Navigate to desired module (S1 Shop, S2 Game, etc.)
3. Click "Execute Scenario"
4. View results in real-time
5. All operations logged automatically
```

---

## 📂 Cleanup Summary

### Archived Scripts (27 files → `scripts/_archive/manual-scripts-2026-01-05/`)
- ✅ `1-clear-stripe-products.sh`
- ✅ `2-upload-products-to-stripe.sh`
- ✅ `3-import-stripe-to-kv.sh`
- ✅ `4-verify-sync.sh`
- ✅ `clear-kv-data.sh`
- ✅ `set-default-prices.sh`
- ✅ `webhook-server.py`, `upload-server.py` (never touch!)
- ✅ 20 more utility scripts

**Kept:** Only `deploy-worker-api.sh` and documentation files

### Archived Debug Tools (31 files → `debug/archive-pre-executor-focus/`)
- ✅ `tutorial-*.html` (6 tutorials)
- ✅ `tutorial-*.md` (6 markdown files)
- ✅ `test-*.html` (19 manual test pages)

**Kept:** Core executor tools only
- ✅ `index.html` - Debug hub (SMRI scenario navigator)
- ✅ `smri-runner.html` - Test executor
- ✅ `healthcheck.html` - System status
- ✅ `purchase-flow-demo.html` - E2E demo
- ✅ `kv-manager.html` - KV operations
- ✅ `test-cache.html` - Cache diagnostics

---

## 🎮 Core Debug Tools

### 1. **Debug Hub** (`/debug/index.html`)
**Purpose:** Central navigation for all SMRI scenarios

**Features:**
- 60 SMRI scenarios organized by module
- Real-time test status
- Progress tracking per module
- One-click scenario execution
- Visual results dashboard

**Usage:**
```
http://localhost:8000/debug/index.html
```

### 2. **SMRI Runner** (`/debug/smri-runner.html`)
**Purpose:** Execute individual scenario tests

**Features:**
- Run any scenario by ID (e.g., `S1.1.01`)
- Step-by-step execution
- Console output capture
- Pass/fail validation
- Automated reporting

**Usage:**
```
http://localhost:8000/debug/smri-runner.html?scenario=S1.1.01
```

### 3. **Health Check** (`/debug/healthcheck.html`)
**Purpose:** System validation and diagnostics

**Features:**
- Worker API status
- KV namespace connectivity
- Stripe webhook validation
- Performance metrics
- Error diagnostics

**Usage:**
```
http://localhost:8000/debug/healthcheck.html
```

### 4. **Purchase Flow Demo** (`/debug/purchase-flow-demo.html`)
**Purpose:** End-to-end purchase simulation (no Stripe required)

**Features:**
- Simulates complete purchase flow
- Tests catalog → checkout → success
- Validates KV storage
- Email notification preview
- Safe for localhost testing

**Usage:**
```
http://localhost:8000/debug/purchase-flow-demo.html
```

### 5. **KV Manager** (`/debug/kv-manager.html`)
**Purpose:** Cloudflare KV operations

**Features:**
- View all KV data (PRODUCTS, USER_PRODUCTS, USERS)
- Clear namespaces
- Import/export data
- Verify sync status
- Debug storage issues

**Usage:**
```
http://localhost:8000/debug/kv-manager.html
```

### 6. **Cache Diagnostics** (`/debug/test-cache.html`)
**Purpose:** localStorage cache debugging

**Features:**
- Cache hit/miss analysis
- TTL validation
- Performance metrics
- Clear cache manually
- Verbose logging

**Usage:**
```
http://localhost:8000/debug/test-cache.html
```

---

## 🔧 Common Operations

### Clear All Data (via KV Manager)
1. Open `/debug/kv-manager.html`
2. Click "Clear PRODUCTS" namespace
3. Click "Clear USER_PRODUCTS" namespace
4. Confirm operation
5. Verify in healthcheck

### Import Products (via SMRI Scenario)
1. Open `/debug/index.html`
2. Navigate to **S5 Worker** module
3. Find scenario: "Import products from CSV"
4. Click "Execute"
5. Upload CSV file
6. View import results

### Test Purchase Flow (via Demo)
1. Open `/debug/purchase-flow-demo.html`
2. Select a snake from catalog
3. Click "Simulate Purchase"
4. Enter test user details
5. View success page
6. Verify in KV Manager

### Run All S1 Tests (via SMRI Runner)
1. Open `/debug/smri-runner.html`
2. Select "S1 Shop Module"
3. Click "Run All"
4. Watch real-time execution
5. View summary report

---

## 📊 SMRI Module Structure

### S0 - Health Checks (11 scenarios)
- System validation
- API connectivity
- Performance metrics
- Error diagnostics

### S1 - Shop (6 scenarios)
- Product browsing
- Catalog rendering
- Purchase initiation
- Email notifications

### S2 - Game (10 scenarios)
- Snake care mechanics
- Stats decay
- Equipment shop
- Tutorial flows

### S3 - Auth (7 scenarios)
- User registration
- Hash-based login
- Session management
- Security validation

### S4 - Payment (6 scenarios)
- Stripe checkout
- Webhook handling
- Product assignment
- Receipt generation

### S5 - Worker (13 scenarios)
- API endpoints
- KV operations
- Webhook processing
- Error handling

---

## 🎯 Workflow Examples

### Example 1: Set Up New Environment
```
1. Open /debug/healthcheck.html
   → Verify all systems green

2. Open /debug/kv-manager.html
   → Clear all namespaces
   → Import products from CSV

3. Open /debug/index.html
   → Run S0.1 (System Health Check)
   → Run S1.1 (Product Availability)
   → Verify both pass

4. Open /debug/purchase-flow-demo.html
   → Test complete purchase flow
   → Verify success
```

### Example 2: Debug Purchase Issue
```
1. Open /debug/healthcheck.html
   → Check Worker API status
   → Check Stripe webhook config

2. Open /debug/kv-manager.html
   → View PRODUCTS namespace
   → Verify product data correct

3. Open /debug/smri-runner.html?scenario=S1.1.01
   → Run "Happy Path Purchase"
   → Check which step fails
   → Read console logs

4. Fix issue in code

5. Re-run scenario
   → Verify pass
```

### Example 3: Add New Feature
```
1. Write scenario document in .smri/scenarios/{module}/
   → Define test steps
   → Write success criteria
   → Include implementation examples

2. Update debug/smri-scenarios.js
   → Add scenario metadata
   → Link to scenario file

3. Implement feature in code

4. Open /debug/smri-runner.html?scenario=NEW-ID
   → Run automated test
   → Verify pass

5. Update debug/index.html stats
   → Increment module completion
   → Update progress bars
```

---

## 🚀 Benefits of Executor Workflow

### 1. **Consistency**
- Every operation follows same pattern
- No ad-hoc bash scripts
- Standardized error handling

### 2. **Traceability**
- All actions logged automatically
- Test results preserved
- Easy to reproduce issues

### 3. **Safety**
- Built-in validation checks
- Confirmation prompts
- Rollback capabilities

### 4. **Speed**
- Click instead of type
- Real-time feedback
- Parallel test execution

### 5. **Documentation**
- Self-documenting scenarios
- Visual progress tracking
- Automated reporting

---

## 📝 Migration Notes

### If You Need Archived Scripts
**Location:** `scripts/_archive/manual-scripts-2026-01-05/`

**To use:**
```bash
cd /root/catalog
bash scripts/_archive/manual-scripts-2026-01-05/SCRIPT_NAME.sh
```

**Recommendation:** Port script logic to SMRI scenario instead

### If You Need Archived Debug Tools
**Location:** `debug/archive-pre-executor-focus/manual-debug-tools/`

**To use:**
```
http://localhost:8000/debug/archive-pre-executor-focus/manual-debug-tools/FILE.html
```

**Recommendation:** Use core tools instead - they're more powerful

---

## 🎓 Training Guide

### For New Contributors
1. Read this document
2. Open `/debug/index.html` and explore
3. Run scenario `S1.1.01` (Happy Path Purchase)
4. Review scenario file: `.smri/scenarios/S1-happy-path-purchase.md`
5. Try modifying and re-running
6. Create your first scenario!

### For Existing Users
1. Stop using manual scripts
2. Learn 6 core debug tools
3. Port your workflows to scenarios
4. Update documentation
5. Share improvements!

---

## 📚 Related Documentation

- **`.smri/INDEX.md`** - SMRI system overview
- **`.smri/docs/SYSTEM-X-ROADMAP.md`** - Completion strategy
- **`.smri/scenarios/S1-*.md`** - Shop module scenarios
- **`debug/README.md`** - Debug tools reference

---

**Built with ❤️ and 🐍**  
**Executor-Driven Era:** 2026-01-05+  
**No more manual scripts!** 🎉
