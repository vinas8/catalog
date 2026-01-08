# 🎯 SMRI System - Quick Start Guide

**Version:** 0.7.7  
**Last Updated:** 2026-01-08  
**Status:** ✅ Modular architecture with centralized config

---

## 📊 Current Progress

```
Scenarios: 17 total (10 ✅, 7 ⏳) = 59% pass rate
Modules: 9 internal (M0-M9) + 2 external abstractions needed
Functions: 50+ documented in public API
Tests: 88/88 passing (98%)
```

---

## 🚀 Quick Commands

### SMRI System
```bash
.smri                      # Complete briefing + module architecture
.smri list scenarios       # List all test scenarios (from config)
.smri list functions       # List all module functions (from catalog)
.smri search {query}       # Search functions across modules
.smri log                  # Update session log
.smri add                  # Add new documentation
```

### Run Tests
```bash
npm test                   # All tests (88)
npm run test:smri          # SMRI scenarios (2)
npm run test:unit          # Unit tests (15)
npm run test:snapshot      # Snapshot tests (71)
```

### Development
```bash
npm start                  # localhost:8000
```

---

## 🏗️ Module Architecture

### Internal Modules (M0-M9) - `src/modules/`
All have public facades (`index.js`) and documentation:

```
M0: common   - Core utilities, constants
M1: shop     - E-commerce, catalog, pricing
M2: game     - Tamagotchi mechanics
M3: auth     - User authentication
M4: payment  - Stripe integration (external wrapper)
M6: testing  - Test framework
M7: breeding - Genetics calculator (needs abstraction)
M8: smri     - Test runner system
M9: tutorial - Tutorial system
```

### External Modules (M10+)
Need abstraction before use:
- **M5: Worker/KV** - Currently `worker/worker.js` (2077 lines)
- Future: Email, Analytics, etc.

### Centralized Config (`src/config/smri/`)
- **scenarios.js** - All test scenarios (17 total)
- **module-functions.js** - Function catalog (50+ functions)
- **index.js** - Main entry point

---

## 📁 Key Files

### Configuration
- `src/config/smri/scenarios.js` - All scenarios (central)
- `src/config/smri/module-functions.js` - Function catalog
- `src/PUBLIC-API.md` - Complete API reference (289 lines)

### Documentation
- `.smri/INDEX.md` - System rules & navigation
- `.smri/docs/` - Topic documentation
- `src/modules/*/README.md` - Module docs

### Scenarios
- `.smri/scenarios/*.md` - Detailed scenario files
- Debug tools: `debug/smri-runner-modular-NEW.html`

---

## 🎯 Creating New Scenarios

### For M0-M9 (Existing Modules)
```bash
# 1. Add to config
vim src/config/smri/scenarios.js

# 2. Create detailed doc
vim .smri/scenarios/S{M}.{RRR}.{II}-name.md

# 3. Update module if needed
vim src/modules/{module}/
```

### For M10+ (New External Service)
```bash
# 1. Create abstraction module FIRST
mkdir -p src/modules/{service}
vim src/modules/{service}/index.js  # Facade

# 2. Add to function catalog
vim src/config/smri/module-functions.js

# 3. Document in PUBLIC-API
vim src/PUBLIC-API.md

# 4. THEN add scenario
vim src/config/smri/scenarios.js
vim .smri/scenarios/S{M}.*.md
```

---

## 💡 Pro Tips

### 1. Use Centralized Config
```javascript
// OLD: Scattered definitions
import { scenarios } from '../../debug/smri-scenarios.js';

// NEW: Central config
import { SMRI_SCENARIOS, getScenariosByModule } 
  from './config/smri/scenarios.js';

const shopTests = getScenariosByModule('shop');
```

### 2. Search Functions
```javascript
import { searchFunctions } from './config/smri/module-functions.js';

const buyFns = searchFunctions('buy');
// Returns all functions matching "buy" across modules
```

### 3. Check Module API
```javascript
import { MODULE_FUNCTIONS } from './config/smri/module-functions.js';

console.log(MODULE_FUNCTIONS.shop.functions);
// See all shop functions with signatures
```

### 4. Keep Modules Under 500 Lines
```bash
# Check file sizes
find src/modules -name "*.js" | xargs wc -l | sort -rn | head -10

# If >500 lines → split into submodules
```

---

## 📊 Module Roadmap

| Module | Status | Functions | Next Action |
|--------|--------|-----------|-------------|
| M0 (common) | ✅ Complete | 3 | - |
| M1 (shop) | ✅ Complete | 9 | - |
| M2 (game) | ✅ Complete | 8 | - |
| M3 (auth) | ✅ Complete | 4 | - |
| M4 (payment) | ✅ Complete | 3 | - |
| M5 (worker) | ⚠️ Needs abstraction | - | Extract to src/modules/worker/ |
| M6 (testing) | ✅ Complete | 2 | - |
| M7 (breeding) | ⚠️ Needs abstraction | 3 | Improve facade |
| M8 (smri) | ✅ Complete | 4 | - |
| M9 (tutorial) | ✅ Complete | 3 | - |

**Priority:** Abstract M5 (Worker) - 2077 lines → modular

---

## 🔗 External Links

- **Live Site:** https://vinas8.github.io/catalog/
- **Worker API:** https://catalog.navickaszilvinas.workers.dev
- **Debug Hub:** https://vinas8.github.io/catalog/debug/
- **GitHub:** https://github.com/vinas8/catalog

---

## 📝 Daily Workflow

### Morning
1. Check progress: `.smri list scenarios`
2. Review functions: `.smri list functions`
3. Pick module: M0-M9 or abstract M10+

### Afternoon
4. Implement: Update module or create abstraction
5. Document: Update `src/config/smri/`
6. Test: `npm test`

### Evening
7. Commit: `git commit -m "feat(SX): ..."`
8. Log: `.smri log`
9. Review: Debug hub

---

## 🎯 Success Criteria

**Project Complete When:**
- ✅ All M0-M9 modules have facades
- ✅ M10+ abstractions created (M5 worker priority)
- ✅ 60/60 SMRI scenarios implemented
- ✅ 150+ automated tests passing
- ✅ All files under 500 lines
- ⚠️ Zero scattered config (central only)

**Current:** 17/60 scenarios (28%), 88 tests (98%), 9/9 facades ✅

---

## 🐍 Keep Building!

**Architecture:** ✅ Solid modular foundation  
**Config:** ✅ Centralized in `src/config/smri/`  
**Next:** Abstract M5 (Worker) or complete scenarios  

**You got this!** The modules are clean and ready to scale.

---

_Last session: 2026-01-08 - Modular SMRI + centralized config_
