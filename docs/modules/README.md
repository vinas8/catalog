# Module Documentation Index

**Version:** 0.3.0  
**Last Updated:** 2025-12-22

---

## 📦 Active Modules

| Module | Status | Description | Source | Tests | Docs |
|--------|--------|-------------|--------|-------|------|
| **payment** | ✅ Active | Stripe payments, webhooks, purchase tracking | [`src/modules/payment/`](../../src/modules/payment/) | [`tests/modules/payment/`](../../tests/modules/payment/) | [payment.md](payment.md) |
| **shop** | ✅ Active | Product catalog, breeding economy, shop UI | [`src/modules/shop/`](../../src/modules/shop/) | [`tests/modules/shop/`](../../tests/modules/shop/) | [shop.md](shop.md) |
| **game** | ✅ Active | Tamagotchi mechanics, snake care, stats | [`src/modules/game/`](../../src/modules/game/) | [`tests/modules/game/`](../../tests/modules/game/) | [game.md](game.md) |
| **auth** | ✅ Active | User authentication, hash-based identity | [`src/modules/auth/`](../../src/modules/auth/) | [`tests/modules/auth/`](../../tests/modules/auth/) | [auth.md](auth.md) |
| **common** | ✅ Active | Shared utilities, helpers | [`src/modules/common/`](../../src/modules/common/) | [`tests/modules/common/`](../../tests/modules/common/) | [common.md](common.md) |

---

## 🏗️ Module Structure

Each module follows this standard structure:

```
src/modules/{module}/
  ├── index.js          # Main export
  ├── config.js         # Module configuration
  ├── business/         # Business logic
  ├── data/             # Data models
  └── ui/               # UI components

tests/modules/{module}/
  └── *.test.js         # Module tests

docs/modules/{module}.md
```

---

## 🎛️ Module Management

### Enable/Disable

Edit `src/module-config.js`:

```javascript
export const MODULE_CONFIG = {
  payment: { enabled: false },  // Disable
  shop: { enabled: true },      // Enable
  // ...
};
```

### Check Status

```javascript
import { isModuleEnabled, getEnabledModules } from './module-config.js';

if (isModuleEnabled('payment')) {
  // Payment features available
}

console.log(getEnabledModules()); // ['shop', 'game', ...]
```

---

## 📖 Module Documentation

### Payment Module
**Purpose:** Stripe payment integration, webhook handling, purchase tracking  
**Dependencies:** None  
**[Read Full Docs →](payment.md)**

**Key Features:**
- Stripe Checkout integration
- Webhook verification
- User purchase storage (KV)
- Payment link generation

---

### Shop Module
**Purpose:** Product catalog, breeding economy, shop UI  
**Dependencies:** `common`  
**[Read Full Docs →](shop.md)**

**Key Features:**
- Snake species & morphs catalog
- Breeding value calculations
- Equipment shop
- Stripe product sync

---

### Game Module
**Purpose:** Tamagotchi-style snake care mechanics  
**Dependencies:** `common`, `shop` (for equipment)  
**[Read Full Docs →](game.md)**

**Key Features:**
- 8-stat care system (hunger, water, health, etc.)
- Real-time stat decay
- Care actions (feed, water, clean)
- Equipment effects
- Multi-speed time system

---

### Auth Module
**Purpose:** User authentication and identity management  
**Dependencies:** `common`  
**[Read Full Docs →](auth.md)**

**Key Features:**
- Hash-based user identity
- URL parameter authentication
- LocalStorage fallback
- User registration

---

### Common Module
**Purpose:** Shared utilities and helpers (no business logic)  
**Dependencies:** None  
**[Read Full Docs →](common.md)**

**Key Features:**
- Date/time utilities
- Validation helpers
- General utilities
- No business logic (pure functions)

---

## 🔗 Related Documentation

- [ARCHITECTURE.md](../ARCHITECTURE.md) - Module system design principles
- [SETUP.md](../SETUP.md) - Installation and deployment
- [Main README](../../README.md) - Project overview

---

**Total Modules:** 5  
**All Active:** ✅  
**Test Coverage:** 100% (86/86 tests passing)
