# Business Logic Modules

**Core Functionality** - Data processing, calculations, and business rules.

## 🎯 Purpose

Modules contain **pure business logic** with no UI dependencies. They export functions, classes, and data that implement the application's core features.

## 📦 Module Structure

Each module has:
- `index.js` - Public facade (exports only)
- Internal files - Implementation details
- `ENABLED` flag - Module enable/disable

## 🗂️ Modules (S0-S9)

| Module | SMRI | Purpose |
|--------|------|---------|
| `common/` | S0 | Core utilities, constants, health |
| `shop/` | S1 | E-commerce, catalog, pricing |
| `game/` | S2 | Tamagotchi mechanics, care system |
| `auth/` | S3 | User authentication, hashing |
| `payment/` | S4 | Stripe integration (external) |
| `worker/` | S5 | Backend API (external - needs abstraction) |
| `testing/` | S6 | Test framework, assertions |
| `breeding/` | S7 | Genetics calculator (external) |
| `smri/` | S8 | SMRI test runner |
| `tutorial/` | S9 | Interactive tutorial system |

## 🔒 Rules

### ✅ Allowed
- Pure functions (input → output)
- Data structures and classes
- Import other modules (via facades)
- Export via `index.js` facade
- Use Node.js/JavaScript APIs

### ❌ Not Allowed
- DOM manipulation (`document`, `window`)
- Import from `/src/components/`
- UI rendering
- Direct user interaction handling
- Browser-specific code (unless necessary)

## 🏗️ Facade Pattern

**Every module MUST export through `index.js`:**

```javascript
// ✅ Correct - via facade
import { Economy } from '../modules/shop/index.js';

// ❌ Wrong - bypass facade
import { Economy } from '../modules/shop/business/economy.js';
```

**Why?**
- Clean public API
- Easy refactoring (internals can change)
- Clear module boundaries
- Better testability

Enforced by: `npm run dev:architecture`

## 📊 Module Architecture

```
┌─────────────────┐
│   Components    │ ← Can import modules
│ /src/components/│
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│    Modules      │ ← Pure logic, no UI
│  (this folder)  │
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│     Config      │ ← Configuration only
│  /src/config/   │
└─────────────────┘
```

## 💡 Quick Decision

**"Should this go in `/modules/` or `/components/`?"**

Ask yourself:
- Is it pure logic? → **Module**
- Does it calculate/process data? → **Module**
- Does it render UI? → **Component**
- Does it manipulate DOM? → **Component**

## 📚 Examples

**Module:** `shop/economy.js`
```javascript
// ✅ Pure calculation, no DOM
export class Economy {
  calculatePrice(species, morph) {
    return this.basePrices[species] * this.morphMultipliers[morph];
  }
}
```

**Component:** `SnakeDetailModal.js`
```javascript
// ✅ Uses module data to render UI
import { SPECIES_PROFILES } from '../modules/shop/index.js';

export class SnakeDetailModal {
  render(snake) {
    const profile = SPECIES_PROFILES[snake.species];
    // ... render DOM
  }
}
```

## 🧪 Testing

**Module tests** (`tests/modules/`):
- Unit tests for functions/classes
- No DOM dependencies
- Fast execution
- Example: `tests/modules/shop/economy.test.js`

**Component tests** (visual):
- DOM rendering tests
- User interaction tests
- Browser-dependent
- Example: `debug/tools/smri-runner.html`

## 🔗 Related

- **UI Layer:** See `/src/components/README.md`
- **SMRI System:** See `.smri/INDEX.md`
- **Facade Pattern:** Run `npm run dev:architecture`
- **Module Functions:** Run `npm run smri:list:functions`

## demo
Interactive demo system with mobile-first split-screen layout.
- `Demo` - Main demo component with scenario execution
