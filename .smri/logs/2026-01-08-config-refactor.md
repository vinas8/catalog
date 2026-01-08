# Config Refactor Plan - 2026-01-08

## 🎯 Goal
Move ALL hardcoded data (magic values, translations, constants) to centralized config files.

## 📊 Current State Analysis

### ✅ Already Centralized
1. **`src/config/app-config.js`** - App identity, URLs, navigation, features
2. **`src/config/messages.js`** - UI messages (purchase, auth, game, network, validation)
3. **`src/config/lang-en.js`** - English translations (nav, headers, buttons, care terms)
4. **`src/modules/common/constants.js`** - Game constants (stats, timeouts, ranges)

### ⚠️ Issues Found

#### 1. **Hardcoded Timeouts** (Not using TIMEOUTS from constants)
```javascript
// Found in multiple files:
setTimeout(() => notification.remove(), 3000);  // shop-view.js
setTimeout(() => debugDiv.remove(), 8000);      // user-auth.js
setTimeout(() => controller.abort(), 5000);     // catalog-renderer.js
setTimeout(() => card.remove(), 300);           // event-system.js
setInterval(checkURL, interval);                // morph-sync.js (interval not defined)
```

**Action:** Use `TIMEOUTS` from `constants.js`

#### 2. **Magic Numbers in Economy** (src/modules/shop/business/economy.js)
```javascript
// Line 12-13: Currency conversion
static moneyToCurrency(usdCents) {
  return usdCents;  // $1 USD = 100 gold coins (comment only)
}

// Line 17-18: Conversion rate
static dollarsToGold(usdDollars) {
  return Math.floor(usdDollars * 100);  // 100 is magic number
}

// Line 38: Loyalty calculation
const loyaltyPoints = Math.floor(priceCents / 100);  // 100 is magic number

// Line 93-96: Base prices
const basePrice = {
  'ball_python': 1000,
  'corn_snake': 500
}[species] || 1000;
```

**Action:** Create `src/config/economy-config.js`

#### 3. **Visual/UI Magic Values** (game-controller.js, shelf-manager.js)
```javascript
// Tier emoji mappings (hardcoded in 2 places!)
// game-controller.js:704-708
1: '🪵',
2: '🪵🌿',
3: '🪵🌿💡',
4: '🪵🌿💡🌡️',
5: '🪵🌿💡🌡️💦'

// shelf-manager.js:175-179 (DUPLICATE!)
1: '🪵',
2: '🪵🌿',
3: '🪵🌿💡',
4: '🪵🌿💡🌡️',
5: '🪵🌿💡🌡️✨'
```

**Action:** Create `src/config/ui-config.js` for visual constants

#### 4. **Module Number Mappings** (scenario-runner.js)
```javascript
// Line 403-421: Hardcoded module numbers
1: 'Shop',
2: 'Game',
3: 'Auth',
4: 'Payment',
5: 'Worker',
6: 'Common',
11: 'Cloudflare',
12: 'Stripe',
13: 'GitHub'
```

**Action:** Move to `src/config/smri-config.js`

#### 5. **Test Timeouts** (test-runner.js)
```javascript
setTimeout(() => reject(new Error('Test timeout')), test.options.timeout)
```

**Action:** Define default test timeout in config

#### 6. **Inline Strings Not in lang-en.js**
- Console.log messages (debug-only, acceptable)
- Error messages (need to check if all are in messages.js)
- HTML strings (catalog-renderer, shop-view)

## 🔧 Refactor Plan

### Phase 1: Create New Config Files

#### A. `src/config/economy-config.js`
```javascript
export const ECONOMY_CONFIG = {
  // Currency conversion
  USD_TO_GOLD_RATE: 100,  // $1 USD = 100 gold
  LOYALTY_POINTS_PER_DOLLAR: 1,
  
  // Virtual snake base prices (gold)
  VIRTUAL_PRICES: {
    ball_python: 1000,
    corn_snake: 500,
    default: 1000
  },
  
  // Morph price multipliers
  MORPH_MULTIPLIERS: {
    banana: 2.0,
    piebald: 3.0,
    // ... (move from morphs.js)
  },
  
  // Loyalty tiers
  LOYALTY_TIERS: {
    BRONZE: { min: 0, max: 99 },
    SILVER: { min: 100, max: 499 },
    GOLD: { min: 500, max: 999 },
    PLATINUM: { min: 1000, max: Infinity }
  }
};
```

#### B. `src/config/ui-config.js`
```javascript
export const UI_CONFIG = {
  // Enclosure tier visuals
  TIER_EMOJIS: {
    1: '🪵',
    2: '🪵🌿',
    3: '🪵🌿💡',
    4: '🪵🌿💡🌡️',
    5: '🪵🌿💡🌡️💦'
  },
  
  // Notification durations (ms)
  NOTIFICATION_DURATION: 3000,
  DEBUG_MESSAGE_DURATION: 8000,
  
  // Animation durations (ms)
  FADE_OUT: 300,
  SLIDE_IN: 200,
  
  // Request timeouts (ms)
  FETCH_TIMEOUT: 5000,
  API_TIMEOUT: 10000
};
```

#### C. Update `src/modules/common/constants.js`
```javascript
// Add missing timeouts
export const TIMEOUTS = {
  DEBUG_MESSAGE_AUTO_REMOVE: 5000,
  FETCH_TIMEOUT: 10000,
  ANIMATION_DURATION: 300,
  NOTIFICATION_DURATION: 3000,      // NEW
  DEBUG_DIV_DURATION: 8000,         // NEW
  NETWORK_TIMEOUT: 5000,            // NEW
  EVENT_CARD_FADE: 300,             // NEW
  TEST_TIMEOUT_DEFAULT: 5000        // NEW
};
```

### Phase 2: Refactor Module Imports

#### Files to Update:
1. `src/modules/shop/business/economy.js` - Import ECONOMY_CONFIG
2. `src/modules/game/game-controller.js` - Import UI_CONFIG (remove duplicate tier emojis)
3. `src/modules/game/shelf-manager.js` - Import UI_CONFIG (remove duplicate tier emojis)
4. `src/modules/shop/ui/shop-view.js` - Import TIMEOUTS.NOTIFICATION_DURATION
5. `src/modules/shop/ui/catalog-renderer.js` - Import TIMEOUTS.FETCH_TIMEOUT
6. `src/modules/auth/user-auth.js` - Import TIMEOUTS.DEBUG_DIV_DURATION
7. `src/modules/testing/test-runner.js` - Import TIMEOUTS.TEST_TIMEOUT_DEFAULT
8. `src/modules/tutorial/event-system.js` - Import TIMEOUTS.ANIMATION_DURATION
9. `src/modules/breeding/morph-sync.js` - Define interval constant

### Phase 3: HTML Files Check
- Scan all HTML files for inline strings
- Move to lang-en.js if user-facing
- Move to messages.js if system messages

### Phase 4: Worker Refactor
- Check `worker/worker.js` for hardcoded values
- Create `worker/config.js` for worker-specific constants

## 📋 Implementation Checklist

- [ ] Create `src/config/economy-config.js`
- [ ] Create `src/config/ui-config.js`
- [ ] Update `src/modules/common/constants.js` (add missing timeouts)
- [ ] Refactor `src/modules/shop/business/economy.js`
- [ ] Refactor `src/modules/game/game-controller.js`
- [ ] Refactor `src/modules/game/shelf-manager.js`
- [ ] Refactor `src/modules/shop/ui/shop-view.js`
- [ ] Refactor `src/modules/shop/ui/catalog-renderer.js`
- [ ] Refactor `src/modules/auth/user-auth.js`
- [ ] Refactor `src/modules/testing/test-runner.js`
- [ ] Refactor `src/modules/tutorial/event-system.js`
- [ ] Refactor `src/modules/breeding/morph-sync.js`
- [ ] Run tests: `npm test`
- [ ] Verify no magic values remain: `grep -r "setTimeout\|setInterval" src/modules`
- [ ] Update `.smri/docs/technical.md` with config documentation

## 🎯 Success Criteria

1. ✅ No magic numbers in business logic
2. ✅ All timeouts use constants from config
3. ✅ No duplicate visual constants
4. ✅ All user-facing strings in lang-en.js or messages.js
5. ✅ Tests pass (88/88)
6. ✅ Worker uses centralized config

## 📝 Notes

- Keep `console.log` debug messages (debug-only, not user-facing)
- Don't over-engineer: Only move values that are:
  - Repeated in multiple places (DRY principle)
  - Subject to change (business rules, thresholds)
  - Configuration values (timeouts, limits, rates)
- Leave one-time values in place if they're contextual
