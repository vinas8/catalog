# Serpent Town Architecture v0.3.0

## 🏗️ Modular Architecture

Serpent Town uses a **module-based architecture** where each feature is self-contained and can be **enabled/disabled with one line**.

---

## 📦 Module Structure

Each module follows this pattern:

```
src/modules/{module-name}/
  ├── index.js          # Main export
  ├── config.js         # Module configuration
  ├── business/         # Business logic
  ├── data/             # Data models
  └── ui/               # UI components

tests/modules/{module-name}/
  └── *.test.js         # Module tests

docs/modules/{module-name}.md
```

---

## 🎛️ Module Registry

**Location:** `src/module-config.js`

### Current Modules (v0.3.0)

| Module | Status | Description | Tests |
|--------|--------|-------------|-------|
| **payment** | ✅ Active | Stripe integration, webhooks, user purchases | `/tests/modules/payment/` |
| **shop** | ✅ Active | Product catalog, breeding economy, shop UI | `/tests/modules/shop/` |
| **game** | ✅ Active | Tamagotchi mechanics, snake care, stats | `/tests/modules/game/` |
| **auth** | ✅ Active | User authentication, hash-based identity | `/tests/modules/auth/` |
| **common** | ✅ Active | Shared utilities, helpers | `/tests/modules/common/` |

---

## 🔧 Enable/Disable Modules

### One-Line Disable

Edit `src/module-config.js`:

```javascript
export const MODULE_CONFIG = {
  payment: { 
    enabled: false,  // ← Change this to disable payments
    path: 'modules/payment',
    description: 'Stripe payment integration and webhooks'
  },
  // ...
};
```

### Check Module Status

```javascript
import { isModuleEnabled, getEnabledModules } from './module-config.js';

if (isModuleEnabled('payment')) {
  // Load payment features
}

console.log(getEnabledModules()); // ['shop', 'game', 'auth', 'common']
```

---

## 📊 Module Details

### 💳 Payment Module

**Purpose:** Stripe payment processing, webhooks, purchase tracking

**Location:** `src/modules/payment/`
**Tests:** `tests/modules/payment/`
**Docs:** `docs/modules/payment.md`

**Key Files:**
- `index.js` - Main payment API
- `config.js` - Stripe keys, webhook config
- `payment-adapter.js` - Payment processing logic

**Dependencies:** None (self-contained)

---

### 🛒 Shop Module

**Purpose:** Product catalog, morphs, breeding economy, shop UI

**Location:** `src/modules/shop/`
**Tests:** `tests/modules/shop/`
**Docs:** `docs/modules/shop.md`

**Key Files:**
- `business/economy.js` - Breeding calculations, pricing
- `business/stripe-sync.js` - Sync products with Stripe
- `data/morphs.js` - Snake morphs and species
- `ui/catalog-renderer.js` - Shop UI

**Dependencies:** `common` (for utilities)

---

### 🎮 Game Module

**Purpose:** Tamagotchi mechanics, snake care, stats, plugins

**Location:** `src/modules/game/`
**Tests:** `tests/modules/game/`
**Docs:** `docs/modules/game.md`

**Key Files:**
- `core/stats-engine.js` - Stats decay and updates
- `core/care-actions.js` - Feeding, watering, cleaning
- `plugins/shop.js` - In-game equipment shop

**Dependencies:** `common`, `shop` (for equipment)

---

### 🔐 Auth Module

**Purpose:** User authentication, hash-based identity

**Location:** `src/modules/auth/`
**Tests:** `tests/modules/auth/`
**Docs:** `docs/modules/auth.md`

**Key Files:**
- `hash-auth.js` - Hash generation and validation
- `user-manager.js` - User account management

**Dependencies:** `common`

---

### 🛠️ Common Module

**Purpose:** Shared utilities, helpers, no business logic

**Location:** `src/modules/common/`
**Tests:** `tests/modules/common/`
**Docs:** `docs/modules/common.md`

**Key Files:**
- `utils.js` - General utilities
- `date-utils.js` - Date/time helpers
- `validation.js` - Input validation

**Dependencies:** None (pure utilities)

---

## 🧪 Test Organization

Tests are organized **by module**:

```
tests/
  ├── modules/           # Module-specific tests
  │   ├── payment/
  │   ├── shop/
  │   ├── game/
  │   ├── auth/
  │   └── common/
  ├── integration/       # Cross-module tests
  └── snapshot/          # Snapshot tests
```

---

## 📚 Documentation Organization

```
docs/
  ├── README.md                  # Documentation index
  ├── ARCHITECTURE.md            # This file
  ├── SETUP.md                   # Setup guide
  ├── modules/                   # Module docs
  │   ├── README.md              # Modules overview
  │   ├── payment.md
  │   ├── shop.md
  │   ├── game.md
  │   ├── auth.md
  │   └── common.md
  ├── releases/                  # Version release notes
  │   ├── v0.1.0-release-notes.md
  │   └── v0.0.x-consolidation.md
  └── archive/                   # Historical docs
```

---

## 🔄 Module Lifecycle

### Adding a New Module

1. Create directory: `src/modules/{name}/`
2. Add to `module-config.js`:
   ```javascript
   {name}: { 
     enabled: true, 
     path: 'modules/{name}',
     description: '...'
   }
   ```
3. Create tests: `tests/modules/{name}/`
4. Create docs: `docs/modules/{name}.md`
5. Update `docs/modules/README.md`

### Removing a Module

1. Set `enabled: false` in `module-config.js`
2. Move code to `archive/modules/{name}/`
3. Move docs to `docs/archive/modules/`
4. Update tests to skip module

---

## 🎯 Design Principles

1. **Self-Contained:** Each module has its own business logic, data, and UI
2. **Loose Coupling:** Modules communicate through well-defined APIs
3. **Easy Toggle:** Enable/disable with one line in config
4. **Test Isolation:** Module tests run independently
5. **Clear Dependencies:** Explicit dependency chain (e.g., game → shop → common)

---

## 🚀 Benefits

- ✅ **Maintainability:** Easy to understand and modify
- ✅ **Testability:** Isolated unit tests per module
- ✅ **Flexibility:** Enable/disable features on demand
- ✅ **Scalability:** Add new modules without refactoring
- ✅ **Documentation:** Clear module boundaries and responsibilities

---

**Version:** 0.3.0  
**Last Updated:** 2025-12-22  
**Modules:** 5 (payment, shop, game, auth, common)  
**Tests:** 86/86 (100%) ✅
