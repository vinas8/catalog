# 🔧 Large File Refactoring Plan

## 📊 Files Requiring Split (>400 lines)

### Priority 0 - Critical (>1000 lines):
1. **worker/worker.js** - 1779 lines ⚠️ MASSIVE
   - Split into: routes/, handlers/, utils/
   
2. **src/modules/game/game-controller.js** - 1219 lines ⚠️
   - Split into: game-init.js, game-actions.js, game-shop.js

### Priority 1 - High (400-700 lines):
3. **src/components/Navigation.js** - 636 lines
   - Split into: navigation-core.js, navigation-menu.js
   
4. **src/modules/payment/payment-adapter.js** - 463 lines
   - Split into: stripe-adapter.js, payment-utils.js
   
5. **src/modules/common/scenario-runner.js** - 440 lines
   - Keep as-is (test infrastructure, OK to be large)

6. **src/modules/game/storage-client.js** - 395 lines
   - Split into: storage-read.js, storage-write.js

## 🎯 Refactoring Strategy

### 1. worker.js (1779 lines → 3-5 files)
```
worker/
├── worker.js (main entry, 100 lines)
├── routes.js (endpoint routing, 200 lines)
├── handlers/
│   ├── stripe-webhook.js (webhook logic)
│   ├── user-products.js (user data)
│   └── debug.js (debug endpoints)
└── utils/
    ├── cors.js (CORS headers)
    └── response.js (JSON responses)
```

### 2. game-controller.js (1219 lines → 3 files)
```
src/modules/game/
├── game-controller.js (main orchestrator, 300 lines)
├── game-init.js (initialization logic, 400 lines)
└── game-actions.js (feed/water/clean, 400 lines)
```

### 3. Navigation.js (636 lines → 2 files)
```
src/components/
├── Navigation.js (core nav, 300 lines)
└── NavigationMenu.js (menu rendering, 300 lines)
```

## 🚫 Files to LEAVE ALONE

### Test Files (OK to be large):
- debug/*.html (461 lines each) - Test templates
- tests/snapshot/structure-validation.test.js (534 lines) - Test suite

### Data Files (OK to be large):
- src/modules/shop/data/traits.js (362 lines) - Static data
- src/modules/shop/data/equipment-catalog.js (294 lines) - Static data

### Documentation (OK to be large):
- .smri/INDEX.md (414 lines) - Master index
- .smri/docs/*.md - Documentation

## ✅ Benefits of Splitting

1. **AI Context Management**
   - Smaller files = easier to load in prompts
   - Clear module boundaries
   - Less confusion about what to update

2. **Developer Experience**
   - Faster to find specific logic
   - Easier to test individual pieces
   - Better code reuse

3. **Maintenance**
   - Single Responsibility Principle
   - Easier to refactor incrementally
   - Clearer dependency chains

## 🎯 Implementation Plan

### Phase 1: Worker Split (worker.js)
- [ ] Create worker/routes.js
- [ ] Create worker/handlers/
- [ ] Extract endpoint handlers
- [ ] Update imports in worker.js
- [ ] Test all endpoints

### Phase 2: Game Controller Split (game-controller.js)
- [ ] Create game-init.js (initialization)
- [ ] Create game-actions.js (feed/water/clean)
- [ ] Update game-controller.js (orchestrator)
- [ ] Update imports in game.html
- [ ] Test game mechanics

### Phase 3: Navigation Split (Navigation.js)
- [ ] Create NavigationMenu.js
- [ ] Extract menu rendering logic
- [ ] Update Navigation.js
- [ ] Update imports in all HTML
- [ ] Test navigation

### Phase 4: Optional Splits
- [ ] payment-adapter.js → stripe-adapter.js + payment-utils.js
- [ ] storage-client.js → storage-read.js + storage-write.js

## 📋 Testing After Refactor

```bash
# Run all tests
npm test

# Run fast tests
npm run test:fast

# Test worker locally
cd worker && wrangler dev

# Manual browser test
python -m http.server 8000
```

## 🎯 Success Criteria

✅ All files <500 lines (except test/data files)
✅ Clear module boundaries
✅ All tests still passing
✅ No duplicate code
✅ Better AI prompt efficiency

---

**Estimated Time:** 3-4 hours
**Risk:** Medium (requires careful import updates)
**Priority:** High (will improve AI efficiency significantly)
