# SMRI Configuration

**Version:** 0.7.7  
**Purpose:** Central configuration for SMRI test system

## 📂 Structure

```
src/config/smri/
├── index.js              # Main entry point
├── scenarios.js          # All test scenarios (190 lines)
├── module-functions.js   # Public API catalog (200+ lines)
└── README.md             # This file
```

## 📋 Scenarios Configuration

All SMRI test scenarios in one place. Import anywhere:

```javascript
import { 
  SMRI_SCENARIOS,
  getScenariosByModule,
  getScenariosByStatus,
  getScenarioStats 
} from '../../config/smri/scenarios.js';

// Get all shop scenarios
const shopTests = getScenariosByModule('shop');

// Get stats
const stats = getScenarioStats();
// { total: 17, passed: 10, pending: 7, passRate: 59 }
```

### Scenario Format

```javascript
{
  id: 's1-happy-path-purchase',      // Unique ID
  title: 'S1.1,2,3,4,5.01: ...',     // Display title
  smri: 'S1.1,2,3,4,5.01',           // SMRI code
  module: 'shop',                     // Module category
  url: '../../catalog.html',          // Test URL (or null)
  icon: '🛒',                         // Display icon
  status: '✅',                       // ✅ ⏳ ❌
  autoRun: true                       // Auto-run (optional)
}
```

## 🏗️ Module Functions Catalog

Public API reference for all modules. Shows what each module exports:

```javascript
import { 
  MODULE_FUNCTIONS,
  getModuleFunctions,
  searchFunctions 
} from '../../config/smri/module-functions.js';

// Get all game functions
const gameFns = getModuleFunctions('game');
// { exports: [...], functions: [...] }

// Search for functions
const results = searchFunctions('feed');
// [{ module: 'game', name: 'SerpentTown.feed()', ... }]
```

### Module Categories

- **common** - Core utilities, constants
- **game** - Game logic, care mechanics
- **shop** - E-commerce, catalog, pricing
- **auth** - User authentication
- **payment** - Stripe integration
- **testing** - Test framework
- **breeding** - Genetics calculator
- **smri** - Test runner
- **tutorial** - Tutorial system

## 🔗 Usage Examples

### 1. Import in Test Runner

```javascript
import { SMRI_SCENARIOS } from '../../config/smri/index.js';

const runner = new SMRIRunner({ scenarios: SMRI_SCENARIOS });
```

### 2. Filter Scenarios

```javascript
import { getScenariosByModule, getAutoRunScenarios } from '../../config/smri/index.js';

// Only shop tests
const shopTests = getScenariosByModule('shop');

// Auto-run tests
const autoTests = getAutoRunScenarios();
```

### 3. Get Module API Reference

```javascript
import { MODULE_FUNCTIONS } from '../../config/smri/index.js';

// See what shop module exports
console.log(MODULE_FUNCTIONS.shop.exports);
// [{ name: 'Economy', type: 'class', ... }, ...]

// See available functions
console.log(MODULE_FUNCTIONS.shop.functions);
// [{ name: 'Economy.calculatePrice()', ... }, ...]
```

### 4. Search Functions

```javascript
import { searchFunctions } from '../../config/smri/index.js';

// Find all functions related to "buy"
const buyFns = searchFunctions('buy');
// [
//   { module: 'shop', name: 'EquipmentShop.buy()', ... },
//   { module: 'game', name: 'shopPlugin.buy()', ... }
// ]
```

## 📊 Statistics

Current counts:
- **Scenarios:** 17 total (10 passed, 7 pending)
- **Modules:** 9 documented
- **Functions:** 50+ public functions cataloged
- **Exports:** 40+ classes/objects/functions

## 🎯 Benefits

1. **Single Source of Truth** - All scenarios in one file
2. **Type Safety** - Clear function signatures
3. **Discoverability** - Search functions across modules
4. **Documentation** - Public API catalog
5. **Reusability** - Import anywhere

## 🔄 Integration

### Used By:
- `src/modules/smri/SMRIRunner.js` - Test runner
- `debug/smri-runner-modular-NEW.html` - UI runner
- `tests/smri/scenario-runner.test.js` - Automated tests

### Links to:
- All 9 module index.js files
- `.smri/scenarios/*.md` - Detailed scenarios
- `debug/smri-scenarios.js` - Legacy (deprecated)

---

**Created:** 2026-01-08  
**Maintainer:** SMRI System
