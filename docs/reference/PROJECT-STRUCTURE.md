# Serpent Town v0.3.0 - Project Structure

**Last Updated:** 2025-12-22  
**Total Tests:** 112 passing (71 snapshot + 16 frontend-to-backend + 15 game + 10 real-scenario)

---

## 📁 Source Code Structure (`src/`)

### Configuration (`src/config/`)
- `stripe-config.js` - Stripe API keys and endpoints
- `worker-config.js` - Cloudflare Worker endpoints

### Authentication (`src/modules/auth/`)
- `index.js` - Auth module exports
- `user-auth.js` - User authentication logic (hash-based)

### Core Utilities (`src/modules/common/`)
- `constants.js` - Global constants
- `core.js` - Core utility functions
- `index.js` - Common module exports

### Game Engine (`src/modules/game/`)
- `game-controller.js` - Main game loop and state management
- `index.js` - Game module exports

#### Game Plugins (`src/modules/game/plugins/`)
- `dex.js` - Snake encyclopedia/Pokédex
- `plants.js` - Plant care system
- `shop.js` - In-game equipment shop
- `snakes.js` - Snake management and care
- `tamagotchi.js` - Tamagotchi-style care mechanics

### Payment System (`src/modules/payment/`)
- `config.js` - Payment provider configuration
- `index.js` - Payment module exports
- `payment-adapter.js` - Multi-provider payment abstraction (Stripe, PayPal, Square, Mock)

### Shop System (`src/modules/shop/`)

#### Business Logic (`src/modules/shop/business/`)
- `economy.js` - Virtual currency and pricing
- `equipment.js` - Equipment shop mechanics
- `stripe-sync.js` - Sync products with Stripe

#### Data (`src/modules/shop/data/`)
- `catalog.js` - Snake product catalog
- `equipment-catalog.js` - Equipment items database
- `morphs.js` - Snake morph data (colors/patterns)
- `species-profiles.js` - Species information and care requirements

#### UI (`src/modules/shop/ui/`)
- `catalog-renderer.js` - Catalog display logic
- `shop-view.js` - Shop modal and interface

---

## 🧪 Test Structure (`tests/`)

### Integration Tests (`tests/integration/`)
- `frontend-to-backend.test.js` - Full stack integration (16 tests)
- `real-scenario.test.js` - User purchase flow simulation (10 tests)
- `snapshot.test.js` - Comprehensive snapshot tests (71 tests)

### Module Tests (`tests/modules/`)

#### Auth Tests (`tests/modules/auth/`)
- Currently empty (auth tests planned)

#### Common Tests (`tests/modules/common/`)
- `core.test.js` - Core utility function tests

#### Game Tests (`tests/modules/game/`)
- `dex.test.js` - Encyclopedia tests
- `plants.test.js` - Plant system tests
- `snakes.test.js` - Snake management tests
- `tamagotchi.test.js` - Care mechanics tests

#### Payment Tests (`tests/modules/payment/`)
- Currently empty (payment adapter tests planned)

#### Shop Tests (`tests/modules/shop/`)
- `game.test.js` - Game integration tests (15 tests)
- `shop.test.js` - Shop logic tests

### External Service Tests (`tests/external/`)

#### Cloudflare Tests (`tests/external/cloudflare/`)
- `worker-api.test.js` - Worker API endpoint tests (10 tests)
- `e2e-purchase-flow.sh` - End-to-end purchase test script
- `auto-real-purchase-test.sh` - Automated real purchase test
- `full-user-journey-test.sh` - Complete user journey test
- `simple-test.sh` - Basic worker connectivity test
- `test-first-purchase-fix.sh` - First purchase bug verification

#### GitHub Tests (`tests/external/github/`)
- Currently empty (GitHub Actions tests planned)

#### Stripe Tests (`tests/external/stripe/`)
- `marketplace.test.js` - Payment provider abstraction tests

### Snapshot Tests (`tests/snapshots/`)
- `purchase-flow/test-purchase-flow.sh` - Purchase flow snapshot

### Unit Tests (`tests/unit/`)
- Currently empty (dedicated unit tests planned)

---

## 📊 Test Organization Rules

### Internal Tests (tests/modules/, tests/integration/)
**Purpose:** Test application logic WITHOUT external services  
**Run with:** `npm test`  
**Coverage:**
- Game mechanics and state management
- Shop calculations and economy
- Data transformations
- UI rendering logic
- Module integration

### External Tests (tests/external/)
**Purpose:** Test integration with external APIs and services  
**Run with:** `npm run test:external`  
**Coverage:**
- Cloudflare Worker API endpoints
- Stripe payment processing
- GitHub Actions workflows
- KV storage operations

**CRITICAL RULE:** External service tests MUST ONLY exist in `tests/external/`, never in `tests/modules/`

---

## 🎯 Test Commands

### Main Test Suites
```bash
npm test                          # All internal tests (112 tests)
npm run test:external             # All external service tests
npm run test:all                  # Both internal + external
```

### Specific Test Groups
```bash
npm run test:unit                 # Unit tests only
npm run test:snapshot             # Snapshot tests only
npm run test:real                 # Real scenario tests
npm run test:frontend             # Frontend-to-backend tests
npm run test:game                 # Game module tests
npm run test:shop                 # Shop module tests
npm run test:common               # Common utilities tests
```

### External Service Tests
```bash
npm run test:external:cloudflare  # Cloudflare Worker tests
npm run test:external:stripe      # Stripe payment tests
```

---

## 📝 Test Output Logging

**CRITICAL RULE:** Always save full test suite output to `docs/test/` with timestamp

### Automatic Logging
When running full test suite, output is automatically saved:
```bash
npm test 2>&1 | tee "docs/test/$(date +%Y-%m-%d_%H-%M-%S)_test-output.txt"
```

### Manual Logging
Save any test run to docs:
```bash
npm run test:external 2>&1 | tee "docs/test/$(date +%Y-%m-%d_%H-%M-%S)_external-tests.txt"
```

### Log File Naming Convention
- Format: `YYYY-MM-DD_HH-MM-SS_description.txt`
- Example: `2025-12-22_12-42-49_test-output.txt`

---

## 📈 Test Coverage Summary

| Category | Tests | Status |
|----------|-------|--------|
| Snapshot Tests | 71 | ✅ 100% |
| Frontend-to-Backend | 16 | ✅ 100% |
| Game Logic | 15 | ✅ 100% |
| Real Scenario | 10 | ✅ 100% |
| Worker API | 10 | ✅ 100% |
| **TOTAL** | **122** | **✅ 100%** |

---

## 🔄 Adding New Tests

### Internal Test (Module/Integration)
1. Place in `tests/modules/{module}/` or `tests/integration/`
2. Use `.test.js` extension
3. Add to appropriate npm script in `package.json`
4. Must NOT call external APIs

### External Service Test
1. Place in `tests/external/{service}/`
2. Use `.test.js` or `.sh` extension
3. Add to `test:external:{service}` script
4. Can call external APIs (Cloudflare, Stripe, GitHub)

### Test File Template
```javascript
// tests/modules/example/feature.test.js
let passed = 0;
let failed = 0;

function test(name, condition) {
  if (condition) {
    console.log(`✅ ${name}`);
    passed++;
  } else {
    console.log(`❌ ${name}`);
    failed++;
  }
}

// Run tests
test("Feature works", true);

// Report
console.log(`\n✅ Passed: ${passed}`);
console.log(`❌ Failed: ${failed}`);
process.exit(failed > 0 ? 1 : 0);
```

---

## 🛠️ Development Workflow

1. **Make changes** to source files
2. **Run tests** with `npm test`
3. **Save output** to `docs/test/{timestamp}_test-output.txt`
4. **Verify** all tests pass (100%)
5. **Commit** changes with test proof

---

## 📚 Related Documentation

- **README.md** - Project overview and quick start
- **docs/v0.3.0.md** - Complete technical documentation
- **docs/COPILOT-RULES.md** - AI assistant guidelines
- **docs/test/** - Test output history

---

**Remember:** This is a zero-dependency project. All tests use plain Node.js with no testing frameworks.
