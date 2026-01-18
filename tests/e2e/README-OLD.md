# E2E Tests

**Purpose:** End-to-end tests with real user flows and intentional delays

**Execution Time:** 15-20+ seconds per test

## Tests

### Demo Flow Tests (New!)
- **Browser**: `http://localhost:8001/demo/` → Select "🧪 Automated Test Flow"
  - ✅ Auto-runs all steps (no clicking)
  - ✅ Real validation with error detection
  - ✅ Stops on failures
  
- **CLI**: `bash tests/e2e/demo-flow.sh`
  - ✅ Runs in terminal
  - ✅ Tests API directly
  - ✅ Exit code indicates pass/fail

See [Demo Flow README](./README-DEMO.md) for full documentation.

### Legacy Tests
- `e2e-purchase-flow.sh` - Complete purchase flow simulation
- `full-user-journey-test.sh` - Full user journey from catalog to game
- `auto-real-purchase-test.sh` - Automated real purchase test
- `simple-test.sh` - Basic connectivity test
- `test-first-purchase-fix.sh` - First purchase bug verification

## Quick Start

### Browser Demo (Recommended)
```bash
python3 -m http.server 8001
# Open: http://localhost:8001/demo/
# Select: 🧪 Automated Test Flow
```

### CLI Test
```bash
bash tests/e2e/demo-flow.sh
```

### All E2E Tests
```bash
npm run test:e2e
```

## What Gets Tested

| Test | Browser | CLI | Validates |
|------|---------|-----|-----------|
| Clear data | ✅ | ⚠️ | localStorage cleared |
| Empty catalog | ✅ | ✅ | No products shown |
| Import snake | ✅ | ✅ | Stripe + KV sync |
| Verify catalog | ✅ | ✅ | Product appears |
| View details | ✅ | ✅ | Product page loads |
| Check buyable | ✅ | ✅ | Stripe link exists |
| Purchase | ✅ | ✅ | Checkout available |

## Error Detection

**Demo tests now STOP and LOG ERRORS when:**
- ❌ Products not cleared (Step 2)
- ❌ Multiple products found (Step 4 - means clear failed)
- ❌ No products found (Step 4)
- ❌ Missing Stripe link (Step 6)
- ❌ Purchase not available (Step 7)

**Note:** These tests include `sleep` commands to wait for webhook processing and KV propagation.

