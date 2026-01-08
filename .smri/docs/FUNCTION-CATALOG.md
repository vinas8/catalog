# 🔍 Complete Function Catalog

**Version:** 0.7.7  
**Generated:** 2026-01-08  
**Total Exports:** 244  
**Files Scanned:** 76

> Complete catalog of ALL functions, classes, and methods in the project.
> Not just module facades - includes ALL important exports.

---

## 📊 Quick Statistics

| Category | Files | Exports | Description |
|----------|-------|---------|-------------|
| Components | 5 | 6 classes, 50+ methods | UI components |
| Config | 13 | 40+ constants | Configuration |
| Data | 1 | 5 functions | Species data |
| Modules | 44 | 150+ exports | Core logic |
| Utils | 1 | 1 logger | Utilities |
| **TOTAL** | **76** | **244** | **Full project** |

---

## 🎯 Most Important Functions

### Core Game Functions
- `SerpentTown.init(config)` - Initialize game (30 methods)
- `SerpentTown.feed/water/clean(id)` - Care actions
- `createPetInstance(def, profile)` - Create pet
- `applyDecay(instance)` - Apply stat decay

### Shop & Economy
- `Economy.calculatePrice(species, morph)` - Calculate price
- `initializeCatalog()` - Load product catalog
- `EquipmentShop.buy(itemId, qty)` - Buy equipment
- `StripeSync.syncProduct(id)` - Sync with Stripe

### Authentication
- `UserAuth.login(identifier)` - Login user
- `UserAuth.getCurrentUser()` - Get current user
- `hashUser(identifier)` - Generate user hash

### Testing & SMRI
- `SMRIRunner.runScenario(id)` - Run test scenario
- `ScenarioRunner` - Test runner (24 methods)
- `TestRunner.run(suite)` - Run test suite
- `assert(condition, msg)` - Assertions

### Genetics & Breeding
- `calculateOffspring(p1, p2)` - Calculate offspring
- `calculateInbreedingCoefficient(ped)` - CoI calculation
- `checkLethalCombo(morphs)` - Check lethal combos
- `matchMorphToDatabase(morph)` - Match morph

---

## 📚 Complete List by Module

### Module 0: COMMON
**Files:** 9 | **Exports:** 30+

**Key Classes:**
- `ScenarioRunner` (24 methods) - Test execution
- `ScenarioExecutor` - Base test class
- `MockKV` - Mock storage for testing

**Key Functions:**
- `loadPlugins(plugins)` - Plugin system
- `createPetInstance(def, profile)` - Create pet
- `applyDecay(instance)` - Stat decay
- `applyAction(actionId, instance)` - Care action
- `calculateAutoTags(customer)` - Auto-tag customers
- `getSnakeAvatar(snake)` - Generate avatar

**Constants:**
- `ENTITY_TYPES`, `CARE_STATS`, `DEFAULTS`
- `DEFAULT_SNAKE_STATS`, `STAT_CHANGES`
- `ACTION_COSTS`, `TEMPERATURE_RANGES`

**Security Scenarios:** 6 test classes for security

---

### Module 1: SHOP
**Files:** 13 | **Exports:** 45+

**Key Classes:**
- `Economy` - Economic engine
- `EquipmentShop` - Equipment management
- `StripeSync` - Stripe integration
- `ShopView` (13 methods) - Shop UI

**Key Functions:**
- `initializeCatalog()` - Load catalog
- `loadCatalog()` - Get products
- `getAvailableProducts()` - Filter products
- `getProductById(id)` - Get product
- `createInitialGameState()` - Init state
- `formatPrice(amount)` - Format price
- `getEquipmentById(id)` - Get equipment
- `getMorphInfo(morph)` - Morph details
- `calculateMorphPrice(morphs)` - Morph pricing
- `getTraitInfo(trait)` - Trait info
- `parseMorphString(str)` - Parse morphs
- `isRealSnake(product)` - Check if real
- `validateRealProduct(data)` - Validate product
- `getSpeciesProfile(species)` - Species info
- `renderGameCatalog(container, products)` - Render catalog

**Constants:**
- `EQUIPMENT_CATALOG`, `MORPH_TRAITS`, `COMBO_MORPHS`
- `TRAIT_DATABASE`, `RARITY_TIERS`
- `SPECIES_PROFILES`, `REAL_SNAKE_SCHEMA`

---

### Module 2: GAME
**Files:** 6 | **Exports:** 20+

**Key Classes:**
- `SerpentTown` (30 methods) - Main game controller
- `ShelfManager` (11 methods) - Snake display
- `SnakeDetailView` (16 methods) - Detail view
- `GameStorageClient` (12 methods) - Storage

**Storage Adapters:**
- `LocalStorageAdapter` - Browser storage
- `KVAdapter` - Cloudflare KV
- `createGameStorage(type)` - Factory

**Main Methods:**
- `init(config)`, `loadUser(hash)`
- `feed(id)`, `water(id)`, `clean(id)`
- `getStats(id)`, `update(delta)`

---

### Module 3: AUTH
**Files:** 2 | **Exports:** 5+

**Key Class:**
- `UserAuth` - Authentication manager

**Functions:**
- `login(identifier)` - Login user
- `getCurrentUser()` - Get current
- `logout()` - Logout
- `generateHash(id)` - Generate hash
- `initializeUser()` - Initialize
- `requireUser()` - Require auth

---

### Module 4: PAYMENT
**Files:** 2 | **Exports:** 6+

**Key Classes:**
- `PaymentAdapter` - Base adapter
- `StripeAdapter` - Stripe integration
- `PayPalAdapter` - PayPal integration
- `SquareAdapter` - Square integration
- `MockAdapter` - Testing mock
- `PaymentAdapterFactory` - Factory

**Methods:**
- `createCheckout(productId)` - Create session
- `verifyPayment(sessionId)` - Verify payment

---

### Module 5: WORKER
**Status:** ⚠️ Needs abstraction (currently in worker/worker.js)

---

### Module 6: TESTING
**Files:** 5 | **Exports:** 25+

**Key Classes:**
- `TestRunner` (9 methods) - Test runner
- `DebugAdapter` (8 methods) - Debug adapter
- `StripeClient`, `KVClient`, `WorkerClient` - API clients

**Assertions:**
- `assertEquals(a, b)`, `assertDeepEquals(a, b)`
- `assert(condition)`, `assertContains(arr, item)`
- `assertThrows(fn)`, `assertStatus(res, code)`
- `assertOK(res)`, `assertLength(arr, len)`
- `assertHasProperty(obj, prop)`

**Mock Data:**
- `generateProduct()`, `generateCustomer()`
- `generatePurchase()`, `generateMorphs()`
- `generateStripeSession()`

**Test Utilities:**
- `createTestSuite(name)` - Create suite
- `createClients()` - Create API clients
- `createDebugRunner()` - Debug runner
- `initDebugPage()` - Init debug page

---

### Module 7: BREEDING
**Files:** 2 | **Exports:** 30+

**Genetics Functions (21 methods):**
- `loadGeneticsDatabase()` - Load data
- `getMorphValue(morph)` - Get value
- `getHealthRisk(combo)` - Get risk
- `checkLethalCombo(morphs)` - Check lethals
- `calculateInbreedingCoefficient(ped)` - CoI
- `calculateGeneticDiversity(morphs)` - Diversity
- `calculateHeterozygosity(morphs)` - Heterozygosity
- `assessHealthRisk(parents)` - Risk assessment
- `calculateOffspring(p1, p2)` - Calculate offspring
- `calculateCompatibility(p1, p2)` - Compatibility

**Morph Sync (9 methods):**
- `matchMorphToDatabase(morph)` - Match morph
- `extractMorphsFromURL(url)` - Extract from URL
- `syncMorphs(source)` - Sync morphs
- `createSnakeFromMorphs(morphs)` - Create snake
- `setupIframeMonitor(iframe)` - Setup monitor
- `validateMorphCombination(morphs)` - Validate
- `generateSyncReport()` - Generate report

---

### Module 8: SMRI
**Files:** 3 | **Exports:** 10+

**Key Class:**
- `SMRIRunner` (12 methods) - Test runner

**Methods:**
- `init()` - Initialize
- `runScenario(id)` - Run scenario
- `runAll()` - Run all
- `getSummary()` - Get results
- `log(msg, type)` - Log message
- `updateStats()` - Update stats

**Data:**
- `scenarios` - Test scenarios array
- `pipelineSteps` - Purchase pipeline

---

### Module 9: TUTORIAL
**Files:** 2 | **Exports:** 15+

**Key Classes:**
- `EventSystem` (6 methods) - Event system
- `TutorialWalkthrough` (11 methods) - Tutorial

**Event Methods:**
- `trigger(event, data)` - Trigger event
- `on(event, handler)` - Add listener
- `off(event, handler)` - Remove listener

**Tutorial Methods:**
- `start()` - Start tutorial
- `nextStep()` - Next step
- `previousStep()` - Previous step
- `complete()` - Complete tutorial

---

## 🧩 COMPONENTS

### BrowserFrame (16 methods)
- `init()`, `loadURL(url)`, `navigate(dir)`
- `refresh()`, `goBack()`, `goForward()`

### DebugPanel (10 methods)
- `init()`, `show()`, `hide()`, `log(msg)`

### Navigation (12 methods)
- `init()`, `setActive(page)`, `updateBadge(count)`

### SnakeDetailModal (16 methods)
- `open(snake)`, `close()`, `updateStats(stats)`
- `openSnakeDetail(snake, context)` - Helper function

---

## ⚙️ CONFIG

**Version Management:**
- `getVersion()`, `getFullVersion()`
- `getModuleVersion(name)`, `getSMRIStats()`

**SMRI Config:**
- `SMRI_SCENARIOS` (17 scenarios)
- `getScenariosByModule(name)`, `getScenariosByStatus(status)`
- `getScenarioStats()`, `getScenarioById(id)`

**Module Functions:**
- `MODULE_FUNCTIONS` (Complete catalog)
- `searchFunctions(query)` - Search across modules
- `getModuleFunctions(name)` - Get module functions

**Messages:**
- `getMessage(path, vars)` - Get message
- `showMessage(path, vars, type)` - Show notification

**Stripe:**
- `getStripeKey()`, `getPublishableKey()`

**Economy:**
- `ECONOMY_CONFIG`, `USD_TO_GOLD_RATE`
- `VIRTUAL_PRICES`, `LOYALTY_TIERS`

---

## 📦 DATA

### SnakeSpecies Class
- `initSnakeSpecies()` - Initialize
- `getSnakeSpeciesById(id)` - Get by ID
- `getSnakeSpeciesByType(type)` - Get by type
- `getSnakeSpeciesByRarity(rarity)` - Get by rarity

---

## 🛠️ UTILS

### Logger (7 methods)
- `log(msg)`, `error(msg)`, `warn(msg)`
- `debug(msg)`, `info(msg)`

---

## 🔍 How to Use This Catalog

### 1. Find Function by Name
Search this document (Ctrl+F) for function name

### 2. Search Programmatically
```javascript
import { searchFunctions } from './config/smri/module-functions.js';
const results = searchFunctions('buy');
```

### 3. Browse by Module
Check module section above for complete list

### 4. Check Source
Each function listed with its file location

---

## 📋 Import Examples

```javascript
// Core game
import { SerpentTown } from './modules/game/game-controller.js';

// Economy
import { Economy } from './modules/shop/business/economy.js';

// Authentication
import { UserAuth } from './modules/auth/user-auth.js';

// Testing
import { TestRunner } from './modules/testing/test-runner.js';

// Genetics
import { calculateOffspring } from './modules/breeding/genetics-core.js';

// SMRI
import { SMRIRunner } from './modules/smri/SMRIRunner.js';

// Components
import { BrowserFrame } from './components/BrowserFrame.js';

// Config
import { SMRI_SCENARIOS } from './config/smri/scenarios.js';
import { searchFunctions } from './config/smri/module-functions.js';
```

---

**Last Updated:** 2026-01-08  
**Files Scanned:** 76 JavaScript files  
**Total Exports:** 244 (classes, functions, constants)  
**Maintained In:** `src/FUNCTION-CATALOG.md`  

Use `.smri search {query}` to search functions interactively!
