# 🎯 Serpent Town - Public API Reference

**Version:** 0.7.7  
**Last Updated:** 2026-01-08

## 📚 Overview

This document lists **ALL public functions** available across the project. Each module exposes a clean facade via its `index.js`.

## 🏗️ Module Architecture

```
src/
├── config/              # Configuration (central)
│   └── smri/           # SMRI test configuration
│       ├── scenarios.js        # All test scenarios
│       └── module-functions.js # This API catalog
└── modules/            # Feature modules
    ├── common/         # Core utilities
    ├── game/           # Game mechanics
    ├── shop/           # E-commerce
    ├── auth/           # Authentication
    ├── payment/        # Stripe integration
    ├── testing/        # Test framework
    ├── breeding/       # Genetics
    ├── smri/           # Test runner
    └── tutorial/       # Tutorial system
```

## 📋 Module Functions

For complete API reference with signatures and descriptions:

```javascript
import { MODULE_FUNCTIONS } from './config/smri/module-functions.js';

// Get all functions for a module
const gameFns = MODULE_FUNCTIONS.game.functions;

// Search across all modules
import { searchFunctions } from './config/smri/module-functions.js';
const results = searchFunctions('buy');
```

## 🔍 Quick Reference by Module

### 1. Common Module (`src/modules/common`)
**Purpose:** Core utilities, constants, logging

```javascript
import { Core, GAME_CONSTANTS, SPECIES, MORPHS } from './modules/common/index.js';

Core.init()              // Initialize core system
Core.log(msg, type)      // Debug logging
Core.error(msg)          // Error logging
```

**Key Exports:**
- `Core` - System utilities
- `GAME_CONSTANTS` - Game configuration
- `SPECIES` - Available species
- `MORPHS` - Morph definitions

---

### 2. Game Module (`src/modules/game`)
**Purpose:** Tamagotchi-style care mechanics

```javascript
import { SerpentTown, snakesPlugin, tamagotchiPlugin } from './modules/game/index.js';

const game = SerpentTown.init(config)  // Initialize game
await game.loadUser(hash)              // Load user data
game.feed(animalId)                    // Feed animal
game.water(animalId)                   // Water animal
game.clean(animalId)                   // Clean habitat
game.getStats(animalId)                // Get stats
```

**Key Exports:**
- `SerpentTown` - Main controller
- `snakesPlugin` - Snake mechanics
- `plantsPlugin` - Plant mechanics
- `tamagotchiPlugin` - Core logic
- `dexPlugin` - Collection tracking
- `shopPlugin` - In-game shop

---

### 3. Shop Module (`src/modules/shop`)
**Purpose:** E-commerce, pricing, catalog

```javascript
import { 
  Economy, 
  EquipmentShop, 
  SPECIES_PROFILES,
  initializeCatalog,
  CatalogRenderer 
} from './modules/shop/index.js';

Economy.calculatePrice(species, morph)  // Calculate price
EquipmentShop.buy(itemId, qty)          // Buy equipment
await initializeCatalog()                // Load products
CatalogRenderer.renderProduct(product)   // Render UI
```

**Key Exports:**
- `Economy` - Pricing engine
- `EquipmentShop` - Equipment shop
- `StripeSync` - Stripe sync
- `SPECIES_PROFILES` - Species data
- `MORPHS_BY_SPECIES` - Morph catalog
- `TRAIT_DATABASE` - Genetics
- `ShopView` - Shop UI
- `CatalogRenderer` - Product UI

---

### 4. Auth Module (`src/modules/auth`)
**Purpose:** User authentication

```javascript
import { UserAuth, hashUser } from './modules/auth/index.js';

await UserAuth.login(identifier)  // Login, get hash
UserAuth.getCurrentUser()         // Get current user
UserAuth.logout()                 // Logout
hashUser(identifier)              // Generate hash
```

**Key Exports:**
- `UserAuth` - Auth manager
- `hashUser` - Hash function

---

### 5. Payment Module (`src/modules/payment`)
**Purpose:** Stripe integration

```javascript
import { StripeAdapter, redirectToCheckout } from './modules/payment/index.js';

await StripeAdapter.createCheckout(productId)  // Create session
redirectToCheckout(sessionId)                  // Redirect to Stripe
await StripeAdapter.verifyPayment(sessionId)   // Verify payment
```

**Key Exports:**
- `StripeAdapter` - Stripe client
- `redirectToCheckout` - Checkout redirect

---

### 6. Testing Module (`src/modules/testing`)
**Purpose:** Unit test framework

```javascript
import { TestRunner, assert } from './modules/testing/index.js';

await TestRunner.run(testSuite)  // Run tests
assert(condition, message)       // Assert
```

**Key Exports:**
- `TestRunner` - Test executor
- `assert` - Assertion helper

---

### 7. Breeding Module (`src/modules/breeding`)
**Purpose:** Genetics calculator

```javascript
import { BreedingCalculator, MorphSync } from './modules/breeding/index.js';

BreedingCalculator.calculate(p1, p2)  // Calculate offspring
BreedingCalculator.getCoI(pedigree)   // Coefficient of inbreeding
await MorphSync.fetchMorphs()          // Fetch morph data
```

**Key Exports:**
- `BreedingCalculator` - Genetics engine
- `MorphSync` - Morph data sync

---

### 8. SMRI Module (`src/modules/smri`)
**Purpose:** Test runner system

```javascript
import { SMRIRunner, scenarios, pipelineSteps } from './modules/smri/index.js';

const runner = new SMRIRunner({ scenarios })
runner.init()                   // Initialize
await runner.runScenario(id)    // Run one test
await runner.runAll()           // Run all tests
runner.getSummary()             // Get results
```

**Key Exports:**
- `SMRIRunner` - Test runner
- `scenarios` - Test scenarios
- `pipelineSteps` - Pipeline steps

---

### 9. Tutorial Module (`src/modules/tutorial`)
**Purpose:** Interactive tutorials

```javascript
import { TutorialSystem, EventSystem } from './modules/tutorial/index.js';

TutorialSystem.start()              // Start tutorial
TutorialSystem.nextStep()           // Next step
EventSystem.trigger(event, data)    // Trigger event
```

**Key Exports:**
- `TutorialSystem` - Tutorial manager
- `EventSystem` - Event system

---

## 🎯 SMRI Configuration

Central test configuration at `src/config/smri/`:

```javascript
import { 
  SMRI_SCENARIOS,           // All scenarios
  getScenariosByModule,     // Filter by module
  getScenariosByStatus,     // Filter by status
  getScenarioStats,         // Get statistics
  MODULE_FUNCTIONS,         // Function catalog
  searchFunctions           // Search API
} from './config/smri/index.js';

// Get all shop scenarios
const shopTests = getScenariosByModule('shop');

// Search functions
const buyFns = searchFunctions('buy');

// Get stats
const stats = getScenarioStats();
```

---

## 📖 Usage Patterns

### Pattern 1: Import Single Module

```javascript
import { SerpentTown } from './modules/game/index.js';
const game = SerpentTown.init({ /* config */ });
```

### Pattern 2: Import Multiple Modules

```javascript
import { SerpentTown } from './modules/game/index.js';
import { Economy } from './modules/shop/index.js';
import { UserAuth } from './modules/auth/index.js';
```

### Pattern 3: Import from Config

```javascript
import { GAME_CONSTANTS } from './config/index.js';
import { SMRI_SCENARIOS } from './config/smri/index.js';
```

---

## 🔗 Links

- **Full API Catalog:** `src/config/smri/module-functions.js`
- **Test Scenarios:** `src/config/smri/scenarios.js`
- **Module Docs:** Each `src/modules/*/README.md`

---

**Total Functions:** 50+  
**Total Exports:** 40+  
**Modules:** 9

See `src/config/smri/module-functions.js` for complete details!
