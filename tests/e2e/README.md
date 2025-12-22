# E2E Tests

**Purpose:** End-to-end tests with real user flows and intentional delays

**Execution Time:** 15-20+ seconds per test

## Tests
- `e2e-purchase-flow.sh` - Complete purchase flow simulation
- `full-user-journey-test.sh` - Full user journey from catalog to game
- `auto-real-purchase-test.sh` - Automated real purchase test
- `simple-test.sh` - Basic connectivity test
- `test-first-purchase-fix.sh` - First purchase bug verification

## Run
```bash
npm run test:e2e
```

**Note:** These tests include `sleep` commands to wait for webhook processing and KV propagation.
