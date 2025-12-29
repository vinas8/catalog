# 📋 Test Constants - Usage Guide

**Created:** 2025-12-29  
**Purpose:** Eliminate magic numbers and hardcoded values in tests  
**Status:** ✅ Implemented and working

---

## 🎯 Problem Solved

### Before (Bad - Magic Numbers Everywhere)
```javascript
// tests/modules/shop/game.test.js
assert(EQUIPMENT_CATALOG.length >= 15);  // What is 15?
assert(state.currency.gold === 1000);    // Why 1000?
state.loyalty_points = 1500;             // What tier is this?
assert(platinum === 0.15);                // Why 0.15?
```

### After (Good - Constants)
```javascript
// tests/modules/shop/game.test.js
import { 
  GAME_DEFAULTS, 
  LOYALTY_TIERS, 
  EQUIPMENT_REQUIREMENTS 
} from '../../test-constants.js';

assert(EQUIPMENT_CATALOG.length >= EQUIPMENT_REQUIREMENTS.MIN_ITEMS);
assert(state.currency.gold === GAME_DEFAULTS.STARTING_GOLD);
state.loyalty_points = LOYALTY_TIERS.PLATINUM.points_required;
assert(platinum === LOYALTY_TIERS.PLATINUM.discount);
```

**Benefits:**
- ✅ Self-documenting code
- ✅ Single source of truth
- ✅ Easy to update all tests at once
- ✅ No confusion about what numbers mean

---

## 📦 What's in test-constants.js

### 1. TEST_COUNTS
Tracks all test counts (real vs roadmap)

```javascript
import { TEST_COUNTS } from './test-constants.js';

console.log(`Total automated tests: ${TEST_COUNTS.TOTAL_AUTOMATED}`); // 88
console.log(`Pass rate: ${TEST_COUNTS.PASS_RATE}%`); // 98%
console.log(`Roadmap scenarios: ${TEST_COUNTS.ROADMAP_SCENARIOS}`); // 59
```

### 2. TEST_TIMEOUTS
Standard timeouts for different test types

```javascript
import { TEST_TIMEOUTS } from './test-constants.js';

// Set timeout for integration test
setTimeout(callback, TEST_TIMEOUTS.INTEGRATION); // 10000ms
```

### 3. SMRI_MODULES
Module codes for SMRI system

```javascript
import { SMRI_MODULES, getSMRICode } from './test-constants.js';

const code = getSMRICode(SMRI_MODULES.GAME, 'tutorial-happy-path');
// Result: 'S2-tutorial-happy-path'
```

### 4. GAME_DEFAULTS
Default game values

```javascript
import { GAME_DEFAULTS } from './test-constants.js';

const state = {
  gold: GAME_DEFAULTS.STARTING_GOLD,  // 1000
  stats: {
    max: GAME_DEFAULTS.STAT_MAX,      // 100
    min: GAME_DEFAULTS.STAT_MIN       // 0
  }
};
```

### 5. LOYALTY_TIERS
Loyalty system configuration

```javascript
import { LOYALTY_TIERS } from './test-constants.js';

// Check if user qualifies for platinum
if (user.points >= LOYALTY_TIERS.PLATINUM.points_required) {
  discount = LOYALTY_TIERS.PLATINUM.discount; // 0.15 (15%)
}
```

### 6. STRIPE_TEST
Test data for Stripe integration

```javascript
import { STRIPE_TEST } from './test-constants.js';

const mockProduct = {
  price: STRIPE_TEST.PRODUCT_PRICE,     // 100.00
  price_cents: STRIPE_TEST.PRICE_CENTS, // 10000
  weight_grams: STRIPE_TEST.WEIGHT_GRAMS // 150
};
```

### 7. KV_CONFIG
Cloudflare KV configuration

```javascript
import { KV_CONFIG } from './test-constants.js';

const key = `${KV_CONFIG.COLLECTION_PREFIX}${userId}`;
// Result: 'collection:user_abc123'
```

### 8. USER_HASH
User hash generation for tests

```javascript
import { USER_HASH } from './test-constants.js';

const testUser = USER_HASH.generate(); // Random 15-char hash
```

---

## 🔧 How to Use in Your Tests

### Step 1: Import what you need
```javascript
import { 
  GAME_DEFAULTS,
  LOYALTY_TIERS,
  TEST_COUNTS 
} from '../../test-constants.js';
```

### Step 2: Replace magic numbers
```javascript
// Before
assert(gold === 1000);

// After
assert(gold === GAME_DEFAULTS.STARTING_GOLD);
```

### Step 3: Run tests
```bash
npm test  # Should still pass!
```

---

## ✅ Already Refactored

**File:** `tests/modules/shop/game.test.js`  
**Status:** ✅ Using constants (15/15 tests passing)

**Changes made:**
- `1000` → `GAME_DEFAULTS.STARTING_GOLD`
- `15` → `EQUIPMENT_REQUIREMENTS.MIN_ITEMS`
- `100` → `STRIPE_TEST.PRODUCT_PRICE`
- `1000` → `VIRTUAL_SNAKE_PRICES.BALL_PYTHON`
- `100` → `LOYALTY_TIERS.SILVER.points_required`
- `1500` → `LOYALTY_TIERS.PLATINUM.points_required`
- `0.15` → `LOYALTY_TIERS.PLATINUM.discount`

---

## 📝 TODO: Refactor These Files

### High Priority
- [ ] `tests/snapshot/structure-validation.test.js` - Has hardcoded 71, 68, etc.
- [ ] `tests/integration/stripe-kv-sync.test.js` - Has 150, 10000, etc.
- [ ] `tests/e2e/product-sync.test.js` - Has KV namespace ID hardcoded
- [ ] `tests/slow/worker-api.test.js` - Has timeout values
- [ ] `tests/smri/scenario-runner.test.js` - Should use TEST_COUNTS

### Medium Priority
- [ ] `src/config/version.js` - SMRI_SCENARIOS array (59 items)
- [ ] `debug/index.html` - Hardcoded test counts in UI
- [ ] Shell scripts in `tests/e2e/*.sh` - Many magic numbers

### Low Priority
- [ ] Documentation files - Update counts to reference constants
- [ ] HTML mockups - Update displayed values

---

## 🎓 Best Practices

### ✅ DO
- Import constants at the top of test files
- Use descriptive constant names
- Group related constants together
- Add constants before using magic numbers

### ❌ DON'T
- Don't hardcode numbers that might change
- Don't create one-off constants (use if reused 2+ times)
- Don't mix constants and magic numbers in same file
- Don't forget to update constants when requirements change

---

## 📊 Impact

### Before
- ❌ 183 lines with magic numbers in `game.test.js`
- ❌ Hard to understand what numbers mean
- ❌ Risky to change values (might miss some)
- ❌ No single source of truth

### After
- ✅ 183 lines using constants
- ✅ Self-documenting code
- ✅ Change once, updates everywhere
- ✅ Single source of truth in `test-constants.js`

---

## 🚀 Next Steps

1. **Refactor remaining test files** to use constants
2. **Add more constants** as needed (e.g., `WORKER_ENDPOINTS`, `ERROR_MESSAGES`)
3. **Update documentation** to reference constants file
4. **Add to code review checklist**: "No magic numbers in tests"

---

**File:** `tests/test-constants.js`  
**Exports:** 8 constant groups + 2 helper functions  
**Status:** ✅ Active and working  
**Tests:** 15/15 passing with constants
