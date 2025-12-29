# 🐍 SMRI Specification v2.0

**SMRI** = **S**erpent Town **M**odule **R**elation **I**ndex

**Purpose:** Simple, consistent naming for scenarios, tests, and debug tools.

---

## 📐 Simplified Format

```
S{module}-{feature}-{version}
```

### Parts:
- **S** = Serpent Town prefix (always present)
- **{module}** = Module number (0-6) or name
- **{feature}** = Feature name (kebab-case)
- **{version}** = Optional version (v1, v2, etc.)

---

## 🗺️ Module Map

| Code | Module | Icon | Description | Path |
|------|--------|------|-------------|------|
| **S0** | Health | 🏥 | System health checks | `tests/api/` |
| **S1** | Shop | 🛒 | Product catalog & browsing | `src/modules/shop/` |
| **S2** | Game | 🎮 | Tamagotchi mechanics | `src/modules/game/` |
| **S3** | Auth | 🔐 | User authentication | `src/modules/auth/` |
| **S4** | Payment | 💳 | Stripe checkout | `src/modules/payment/` |
| **S5** | Worker | ☁️ | Cloudflare Worker API | `worker/` |
| **S6** | Common | 🛠️ | Utilities & debug tools | `src/modules/common/` |

### External Services (Use full name)
- **Cloudflare-KV** - Key-value storage
- **Cloudflare-Worker** - Worker runtime
- **Stripe-Checkout** - Stripe checkout API
- **Stripe-Webhook** - Stripe webhooks
- **GitHub-Pages** - Static hosting

---

## 📝 Naming Examples

### Simple Feature Tests
```
S1-catalog-display          # Shop: Display catalog
S2-snake-care               # Game: Care for snake
S3-user-login               # Auth: User login
S4-checkout-flow            # Payment: Checkout process
S5-webhook-handler          # Worker: Webhook handling
```

### Multi-Step Scenarios
```
S1-purchase-flow            # Shop: Browse → Select → Buy
S2-tutorial-happy-path      # Game: Tutorial (successful completion)
S4-payment-complete         # Payment: Full payment flow
```

### Versioned Tests
```
S2-tutorial-happy-path-v1   # Game tutorial version 1
S2-tutorial-happy-path-v2   # Game tutorial version 2 (refactored)
```

### Cross-Module Tests (Use primary module + description)
```
S1-shop-to-game             # Shop → Game integration
S4-payment-to-worker        # Payment → Worker webhook
S5-worker-to-kv             # Worker → KV storage
```

---

## 📂 File Naming Convention

### HTML Scenario Files
```
/debug/{feature-name}.html

Examples:
- /debug/catalog-display.html
- /debug/tutorial-happy-path.html
- /debug/purchase-flow-demo.html
```

### Test Files
```
/tests/{type}/{module}/{feature}.test.js

Examples:
- /tests/unit/shop/catalog.test.js
- /tests/e2e/purchase-flow.test.js
- /tests/integration/stripe-webhook.test.js
```

### Documentation Files
```
/.smri/scenarios/{feature-name}.md

Examples:
- /.smri/scenarios/tutorial-happy-path.md
- /.smri/scenarios/purchase-flow-complete.md
```

---

## 🎯 SMRI Code Usage

### In HTML Title
```html
<title>S2-tutorial-happy-path - Snake Care Tutorial</title>
```

### In Test Files
```javascript
// Test: S2-tutorial-happy-path
describe('S2 Game Tutorial - Happy Path', () => {
  // ...
});
```

### In Debug Hub
```javascript
const scenarios = {
  'S2-tutorial-happy-path': {
    title: 'Tutorial: Happy Path',
    module: 'S2',
    file: '/debug/tutorial-happy-path.html'
  }
};
```

---

## 🔗 Relation Notation (Optional)

When documenting dependencies, use arrow notation in comments:

```
S1 → S5 → Cloudflare-KV     # Shop calls Worker calls KV
S4 → Stripe-Checkout → S5   # Payment uses Stripe, triggers Worker
S2 → S5 → Cloudflare-KV     # Game fetches data from Worker/KV
```

---

## 📊 Module Dependencies

### Dependency Tree
```
Level 0 (Base):
  S5 (Worker) - No dependencies

Level 1 (Depends on Worker):
  S0 (Health) → S5
  S6 (Common) → S5
  
Level 2 (Depends on Worker + Storage):
  S1 (Shop) → S5 → Cloudflare-KV
  S2 (Game) → S5 → Cloudflare-KV
  S3 (Auth) → S5 + localStorage
  S4 (Payment) → S5 + Stripe-Webhook
```

### Testing Order
1. Test **S5 (Worker)** first
2. Test **S0 (Health)** and **S6 (Common)**
3. Test **S1, S2, S3, S4** (frontend modules)

---

## ✅ Migration from Old Format

### Old Format → New Format
```
S7.1.01                 → S2-tutorial-happy-path
S1.5-11.1.01            → S1-catalog-display
S1.1,2,3,4,5.01         → S1-purchase-flow
S5.5,5-1,5-2.01         → S5-webhook-handler
S0-3.3.01               → S3-user-validation
```

### What Changed
- ❌ Removed: Decimal notation (`.01`, `.02`)
- ❌ Removed: S7 module (merged into S2-tutorial)
- ❌ Removed: Complex relation chains (`5,5-1,5-2`)
- ✅ Added: Descriptive feature names
- ✅ Added: Simple versioning (`-v1`, `-v2`)
- ✅ Added: Clear module mapping

---

## 🎓 Quick Reference Card

```
┌─────────────────────────────────────────┐
│  SMRI v2.0 Quick Reference              │
├─────────────────────────────────────────┤
│  Format: S{module}-{feature}-{version}  │
│                                         │
│  Modules:                               │
│    S0 = Health    S3 = Auth             │
│    S1 = Shop      S4 = Payment          │
│    S2 = Game      S5 = Worker           │
│                   S6 = Common           │
│                                         │
│  Examples:                              │
│    S1-catalog-display                   │
│    S2-tutorial-happy-path               │
│    S4-checkout-flow-v2                  │
└─────────────────────────────────────────┘
```

---

## 📚 Documentation Files

- **This file** - SMRI specification
- `.smri/docs/smri-numbers.md` - Legacy format (archived)
- `.smri/INDEX.md` - Quick project index
- `docs/reference/PROMPT_INSTRUCTIONS.md` - AI assistant guide

---

**Version:** 2.0  
**Date:** 2025-12-29  
**Status:** Active specification  
**Migration:** In progress (all new scenarios use this format)
