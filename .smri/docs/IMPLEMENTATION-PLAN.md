# 🚀 IMPLEMENTATION EXECUTION PLAN

## Status: Phase 2/6 Complete

### ✅ Completed
- [x] Core state management module (`/src/core/state.js`)
- [x] Test harness skeleton (`/tests/integration-test.js`)

### 📝 Next Steps (Automated Execution)

#### PHASE 3: Component Updates (3-4 hours estimated)

**3.1 Update Calculator** (`/calc/index.html`)
- Add URL param parsing (`?male=banana&female=piebald`)
- Auto-load morphs from params
- Auto-calculate on page load
- Mark `demoProgress.calculator = true` after calculation
- Add state module import

**3.2 Update Dex** (`/dex/index.html`)
- Load morphs from `morphs-comprehensive.json`
- Style locked/unlocked morphs (grayscale filter for locked)
- Add "Try in Calculator" buttons
- Show progress counter ("Collected X / 66")
- Mark `demoProgress.dex = true` when button clicked

**3.3 Update MyFarm** (`/learn-farm.html`)
- Load owned snakes from state
- Display snake cards with "View in Dex" button
- Navigate to Dex on click
- Mark `demoProgress.farm = true`

**3.4 Update Demo Checkout**
- Integrate `createDemoSnake()` call
- Trigger on purchase completion
- Redirect to MyFarm after checkout

#### PHASE 4: Demo Progress UI (1 hour)

**4.1 Create Progress Sidebar**
- Floating sidebar showing 4 steps
- Highlight current step
- Show checkmarks for completed
- Lock future steps until prior complete

**4.2 Add to All Pages**
- Calculator
- Dex
- MyFarm  
- Demo page

#### PHASE 5: Testing & Fixes (1-2 hours)

**5.1 Manual Browser Tests**
1. Reset state → Create demo snake → Check MyFarm
2. Click "View in Dex" → Verify unlocked morphs
3. Click "Try in Calculator" → Verify auto-load
4. Test lethal combo detection
5. Mobile responsiveness check

**5.2 Automated Tests**
- Run `tests/integration-test.js`
- Fix any failures
- Verify no console errors

#### PHASE 6: Deploy (30 min)

**6.1 Version Bump**
- Update `package.json` → 0.777
- Update all cache busters → `?v=0.777`
- Update Navigation component

**6.2 Git & Deploy**
```bash
git add -A
git commit -m "🎮 v0.777 - Integrated demo system (CHECKOUT→FARM→DEX→CALC)"
git push origin main
```

**6.3 Verify Live**
- https://vinas8.github.io/catalog/?v=0.777
- Test full flow on production

---

## 🎯 Success Criteria

After completion, user can:
- ✅ Complete demo checkout → Get demo snake
- ✅ View snake in MyFarm
- ✅ Click to Dex → See unlocked morphs (banana, spider)
- ✅ See 64 locked morphs (grayscale)
- ✅ Click "Try in Calculator" → Auto-load morphs
- ✅ Calculate breeding → See results
- ✅ Try Spider×Spider → See lethal warning
- ✅ All progress tracked in sidebar

---

## 📊 Estimated Total Time: 6-8 hours

**Should I proceed with automated implementation?**

Options:
1. **YES - Full auto**: I'll implement everything, test, and deploy
2. **Step-by-step**: I'll do one phase at a time and wait for confirmation
3. **Manual review**: Show me the code changes first before applying

Type: `1`, `2`, or `3`
