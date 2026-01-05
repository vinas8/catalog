# 🎯 SMRI SYSTEMATIC COMPLETION PLAN

**Date:** 2026-01-05  
**Version:** 0.8.0 → 0.9.0  
**Goal:** Complete ALL shop scenarios + implement missing SMRI tests

---

## 📊 CURRENT STATUS ANALYSIS

From Debug Hub v0.7.2 shown:
- **60 total scenarios** documented
- **10/60 done (17%)** - actual completion
- **Many at 0%** - not implemented

From SMRI Runner v0.8.0:
- **12 scenarios** in test runner
- **11/13 passing** - high quality but limited coverage

---

## 🎯 EXECUTION STRATEGY

### Phase 1: Shop Module (S1) - Priority 1
**Goal:** 100% complete, all 6 scenarios working

| Scenario | Status | Action |
|----------|--------|--------|
| S1.1,2,3,4,5.01 - Happy path purchase | 0% | ✅ Implement E2E test |
| S1.1,2,3,4.01 - Returning user | 0% | ✅ Add to SMRI runner |
| S1.1.01 - Product availability | 0% | ✅ Add status check test |
| S1.1,2.02 - Buy 5 snakes | 0% | ✅ Multi-purchase test |
| S1.1,2.03 - Buy same twice | 0% | ✅ Duplicate buy test |
| S1.1,4.01 - Email receipt | 0% | ✅ Webhook email test |

**Dependencies:**
- Stripe checkout working ✅
- KV storage working ✅
- Product rendering working ✅
- Need: Webhook handler, Email integration, Order tracking

---

### Phase 2: System Health (S0) - Priority 2
**Goal:** All 11 scenarios automated

| Scenario | Status | Action |
|----------|--------|--------|
| S0.0.01 - Generic health | 50% | ✅ Complete & add to runner |
| S0-1.1.01 - Shop rendering | 80% | ✅ Finish & add to runner |
| S0-2.2.01 - Game mechanics | 0% | ✅ Create test |
| S0-3.3.01 - Auth validation | 0% | ✅ Create test |
| S0-4.4.01 - Payment Stripe | 0% | ✅ Create test |
| S0-5.5,5-1.01 - Worker API | 0% | ✅ Create test |
| S0-11.5-1.01 - KV health | 0% | ✅ Create test |
| S0-12.5-2.01 - Webhooks | 0% | ✅ Create test |
| S0.1,2,3,4,5,5-1,5-2.03 - Full | 100% | ✅ Already in runner |
| S0.0.02 - Virtual snakes demo | 0% | ✅ Create test |
| S0.0.03 - Storage cleanup | 0% | ✅ Create test |

---

### Phase 3: Game Module (S2) - Priority 3
**Goal:** State persistence + testing

| Scenario | Status | Action |
|----------|--------|--------|
| S2.2.01-06 - Stats/Actions | 90% | ✅ Add to runner |
| S2.5,5-1.01 - Auto-save | 0% | ❌ Implement feature |
| S2.4.01-02 - Equipment | 70% | ✅ Add to runner |
| S2.2,3.01 - Loyalty tiers | 0% | ❌ Implement feature |

---

### Phase 4: Auth Module (S3) - Priority 4
**Goal:** Basic auth working

| Scenario | Status | Action |
|----------|--------|--------|
| S3.3,5.01 - Hash validation | 0% | ✅ Implement |
| S3.3.01 - Anonymous play | 50% | ✅ Complete |
| Rest | 0% | ⏸️ Defer to v0.10.0 |

---

### Phase 5: Payment Module (S4) - Priority 5
**Goal:** Webhook handling + security

| Scenario | Status | Action |
|----------|--------|--------|
| S4.4,5.01 - Schema validation | 0% | ✅ Implement |
| S4.4,5,5-2.02-05 - Webhooks | 0% | ✅ Implement |

---

### Phase 6: Worker Module (S5) - Priority 6
**Goal:** Reliability + testing

| Scenario | Status | Action |
|----------|--------|--------|
| S5.5.04-06 - Clear tests | 100% | ✅ Done |
| Rest | 0% | ✅ Add to runner |

---

## 🚀 IMPLEMENTATION ORDER

### NOW: Shop Module (Next 2 hours)

**Step 1: Create S1 Test Scenarios (30 min)**
```javascript
// Add to debug/smri-runner.html
scenarios.push({
  id: 's1-happy-path',
  title: 'S1: Happy Path Purchase',
  smri: 'S1.1,2,3,4,5.01',
  url: '../catalog.html',
  icon: '✅'
});
// ... add all 6 S1 scenarios
```

**Step 2: Implement E2E Purchase Flow (45 min)**
- Navigate catalog → product → checkout (external)
- Mock success return
- Verify collection updates
- Test with SMRI runner

**Step 3: Add Order Tracking (30 min)**
- Create orders KV namespace
- Store purchase history
- Display in account page

**Step 4: Multi-Purchase Tests (15 min)**
- Test buying 5 snakes
- Test duplicate purchases
- Validate cart/collection logic

---

### THEN: System Health (S0) - 1 hour

**Step 5: Create S0 Test Suite**
- One test per scenario
- Add all 11 to SMRI runner
- Validate each module health

---

### FINALLY: Polish & Integrate - 1 hour

**Step 6: Code Quality**
- Split worker.js (2077 lines → multiple files)
- Refactor game-controller.js
- Ensure all files <500 lines

**Step 7: Documentation**
- Update each scenario with implementation notes
- Mark completed scenarios in debug hub
- Update version to 0.9.0

---

## 📈 SUCCESS METRICS

**v0.9.0 Goals:**
- ✅ Shop module: 6/6 scenarios (100%)
- ✅ System health: 11/11 scenarios (100%)
- ✅ SMRI runner: 25+ scenarios (vs current 12)
- ✅ All core files: <500 lines
- ✅ Tests passing: 25/25 (100%)

**Progress Tracking:**
- Current: 10/60 scenarios (17%)
- Target: 30/60 scenarios (50%)
- Stretch: 45/60 scenarios (75%)

---

## 🎬 START EXECUTION

Beginning with **Phase 1: Shop Module**...

File to modify: `debug/smri-runner.html`
Action: Add 6 S1 test scenarios
Time: Starting now

---

**This plan saved to:** `SMRI-EXECUTION-PLAN.md`
