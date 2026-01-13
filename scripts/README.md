# Development Tools

Quick project health checkers for Snake Muffin.

## 🎯 SMRI Commands (via npm)

All SMRI commands are accessible via `npm run smri:*`:

```bash
# List scenarios with coverage
npm run smri:list              # or smri:list:scenarios
npm run smri:coverage          # same as smri:list

# List module functions  
npm run smri:list:functions

# Find dead facade methods
npm run smri:dead
```

**Scripts:**
- `scripts/smri-list-scenarios.cjs` - Module coverage + untested modules
- `scripts/smri-list-functions.cjs` - All facade exports (39 functions)
- `scripts/find-dead-facades.cjs` - Unused exports (currently 3 dead)

---

## 📋 Consistency Checker

```bash
npm run dev:consistency
```

**Script:** `scripts/check-consistency.cjs`

**Checks:**
- Version sync across package.json and docs
- Module structure (all modules have index.js)
- SMRI structure (only INDEX.md in .smri/ root)
- Duplicate files (backup copies, old versions)
- File sizes (flags files >500 lines docs, >1000 lines code)
- Module exports (PUBLIC-API.md + config exist)

---

## 🏗️ Architecture Analyzer

```bash
npm run dev:architecture
```

**Script:** `scripts/check-architecture.cjs`

**Analyzes:**
- Module dependencies and coupling
- Facade pattern compliance (ENABLED flags, exports)
- Circular dependencies detection
- **SMRI Modularity** - Validates modules only import from facades (index.js)
- **SMRI Syntax** - Validates scenario relation numbers match module numbers
- Code complexity metrics
- File organization by category

### SMRI Modularity Rules

**Rule:** Modules MUST only import from other module facades (index.js), never internal files.

✅ **Correct:**
```javascript
import { getSnakeAvatar } from '../common/index.js';
```

❌ **Violation:**
```javascript
import { getSnakeAvatar } from '../common/snake-avatar.js';
```

**Why?** Facade pattern ensures:
- Clean module boundaries
- Easy refactoring (internals can change)
- Clear public API surface
- Better testability

### SMRI Syntax Validation

**Format:** `S{M}.{RRR}.{II}`
- `M` = Primary module (0-9) or submodule (e.g., 2-7)
- `RRR` = Relations (comma-separated: 1,2,3)
- `II` = Iteration (01-99)

**Module Numbers:**
- 0: common/health
- 1: shop
- 2: game
- 3: auth
- 4: payment
- 5: worker
- 6: testing
- 7: breeding
- 8: smri
- 9: tutorial
- 10+: future external modules

✅ **Valid:** 
- `S2.7,5,5-1.01` - Game (2) with Tutorial (7), Worker (5), KV (5-1)
- `S1.1,2,3,4,5.01` - Shop (1) with full stack relations
- `S5.1,2.01` - Worker (5) with Shop (1) and Game (2)

❌ **Invalid:** 
- `S1.2,11.1.01` - Module 11 doesn't exist (max is 10)
- `S2-7-5.01` - Wrong separator (use dots and commas)

---

## 🚀 Combined Check

```bash
npm run dev:check
```

Runs both checkers in sequence for full project health report.

---

## 🔍 Dead Facade Finder

```bash
npm run dev:dead-facades  # or npm run smri:dead
```

**Script:** `scripts/find-dead-facades.cjs`

**Finds unused facade methods:**
- Scans all module facades (index.js)
- Searches entire codebase for usage
- Reports methods that are exported but never imported

**Current Results:**
- 40/43 methods used (93%)
- 3 dead methods found:
  - `breeding/GeneticsEngine` (doesn't exist!)
  - `payment/PaymentConfig` (unused)
  - `payment/createPaymentAdapter` (unused)

**Why this matters:**
- Dead code clutters API surface
- False documentation
- Technical debt accumulation

---

## 📊 Health Scores

**Consistency:** 4/6 checks (67%)  
**Architecture:** 5/5 checks (100%) ✅  
**Dead Methods:** 3/43 (7% dead code)  
**Module Coverage:** 9/11 modules (82%)  
**Overall:** Project is architecturally sound with minor cleanup needed

---

## 🛠️ All Scripts

**SMRI Commands:**
- `smri:list` → `scripts/smri-list-scenarios.cjs`
- `smri:list:functions` → `scripts/smri-list-functions.cjs`
- `smri:dead` → `scripts/find-dead-facades.cjs`

**Dev Tools:**
- `dev:check` → Run both consistency + architecture
- `dev:consistency` → `scripts/check-consistency.cjs`
- `dev:architecture` → `scripts/check-architecture.cjs`
- `dev:dead-facades` → `scripts/find-dead-facades.cjs`

**Convention:** All scripts log their path at the end:
```
Script: scripts/{script-name}.cjs
```
