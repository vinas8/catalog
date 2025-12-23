# Comprehensive SMRI Health Check Plan

**Goal:** Create `/debug/healthcheck.html` as a Swagger-style SMRI test suite

---

## 🎯 What It Should Have

### 1. **All 42 SMRI Scenarios** Organized by:
- Priority (P0, P1, P2, P3)
- Module (Shop, Game, Auth, Payment, Worker, Common)
- Service (Worker API, Stripe, KV, Security, Performance)

### 2. **For Each Scenario:**
```
┌─────────────────────────────────────┐
│ S1.2345.01 - Happy Path Purchase    │ [P0] [Shop]
│                                     │
│ Description: Complete purchase flow  │
│ Endpoint: Multiple (catalog→stripe→game)
│                                     │
│ [▶ Run Test] [📋 View Code] [📖 Docs]
│                                     │
│ Results:                            │
│ ✅ Step 1/14: User visits catalog   │
│ ✅ Step 2/14: Hash generated        │
│ ⏳ Step 3/14: Stripe checkout...    │
└─────────────────────────────────────┘
```

### 3. **Quick Actions:**
- Run All Tests
- Run P0 Only (Critical Path)
- Run By Module
- Export Results (JSON)
- Clear Results

### 4. **Live Stats Dashboard:**
```
┌──────────────────────────────────────┐
│  Tests: 42  │ Run: 0  │ Pass: 0  │ Fail: 0  │
│  Success Rate: 0%                    │
│  [████████░░░░░] 80%                │
└──────────────────────────────────────┘
```

### 5. **Swagger-Style Features:**
- Expandable test cards
- Request/Response viewers
- Latency measurement
- Status codes
- Error details
- Re-run individual tests

---

## 📋 Implementation Approach

### Current Status:
- ✅ `/debug.html` has basic health check (S6.0.03)
- ✅ `/debug/healthcheck.html` redirects to debug.html
- ✅ Scenario runner exists (`scenario-runner.js`)
- ❌ Comprehensive SMRI test suite doesn't exist

### Options:

**Option A:** Enhance `/debug.html` SMRI Scenarios tab
- Add all 42 scenarios as expandable cards
- Use existing debug hub UI
- Integrated with other modules

**Option B:** New standalone page
- Create new comprehensive page
- Independent from debug hub
- Focus purely on SMRI testing

**Recommendation:** Option A (enhance debug.html)

---

## 🚀 What To Build

### Enhance `/src/modules/debug/index.html`:

1. **Expand SMRI Scenarios Tab** to include:
   - All 42 scenarios organized by priority
   - Clickable test cards
   - Response viewers
   - Stats dashboard

2. **Add Scenario Definitions** from E2E docs:
   ```javascript
   const scenarios = {
     'S1.2345.01': {
       name: 'Happy Path Purchase',
       priority: 'P0',
       module: 'shop',
       steps: [...]
     },
     ...
   }
   ```

3. **Execute Scenarios**:
   - Use existing `scenario-runner.js`
   - Call Worker endpoints
   - Display results

4. **Auto-run Critical Tests**:
   - Run P0 scenarios on page load
   - Show pass/fail immediately

---

## 📊 42 Scenarios To Implement

### P0 (Must-Work) - 13 scenarios:
1. S1.2345.01 - Happy Path Purchase
2. S1.234.01 - Returning User
3. S1.0.01 - Product Status Check
4. S5.11.2-12.2.01 - Webhook Signature
5. S3.5.01 - Hash Validation
6. S4.5.01 - Schema Validation
7. S5.2.01 - Load from KV
8. S6.0.03 - Health Check ✅ (already implemented)
9. S3.5.02 - Invalid Hash
10. S4.5.02 - SQL Injection
11. S4.4.05 - CSRF Attack
12. S5.5.01 - Corrupted KV
13. S5.0.01 - KV Consistency

### P1 (Gameplay) - 9 scenarios:
14-22. S2.0.01-06 (Game mechanics)

### P2 (Identity) - 5 scenarios:
23-27. S3.x.xx (Auth flows)

### P3+ (Nice-to-have) - 14 scenarios:
28-42. Various features

---

## 🎯 Next Steps

1. Parse `docs/test/E2E_TEST_SCENARIOS.md`
2. Extract all 42 scenarios
3. Add to debug.html as test cards
4. Implement executors
5. Auto-run on load

---

**Status:** Plan complete, ready to implement  
**Target:** `/debug.html` enhanced with full SMRI suite  
**ETA:** 1-2 hours implementation time
