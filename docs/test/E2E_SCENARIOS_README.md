# E2E Test Scenarios

**Status:** Detailed specs moved to `/.smri` manifest

---

## 📋 Quick Reference

**Master Document:** `/.smri` in project root

Contains:
- All 42 SMRI scenarios with priorities
- Detailed flows for key scenarios
- Implementation status
- Test coverage metrics

---

## 🔗 Access Scenarios

**Terminal:**
```bash
cat .smri                    # View all scenarios
grep "S1" .smri              # Find Shop scenarios
grep "P0" .smri              # Find critical scenarios
```

**Web Interface:**
```
http://localhost:8000/smri/  # Visual test suite
```

**Documentation:**
- `/.smri` → Complete manifest ⭐
- `/README.md` → SMRI section with quick links
- `/smri/` → Web-based test runner

---

## 📊 Scenario Breakdown

**By Priority:**
- P0 (Critical): 13 scenarios - Must work for business
- P1 (Gameplay): 9 scenarios - Core game mechanics
- P2 (Identity): 5 scenarios - User flows
- P3+ (Features): 15 scenarios - Nice-to-have

**By Module:**
- Shop (1): 6 scenarios
- Game (2): 9 scenarios
- Auth (3): 6 scenarios
- Payment (4): 6 scenarios
- Worker (5): 11 scenarios
- Common (6): 3 scenarios

**Status:**
- ✅ Implemented: 1 (S6.1,2,3,4,5,6.03)
- 🚧 Planned: 41

---

## 🎯 Key Scenarios

### Most Critical (P0.0-P0.3):
1. `S1.1,2,3,4,5.01` - Happy Path Purchase
2. `S1.1,2,3,4.01` - Returning User
3. `S1.1.01` - Product Status Check
4. `S5.5,11.2,12.2.01` - Webhook Signature

### Implemented:
- `S6.1,2,3,4,5,6.03` - Health Check ✅

---

## 📖 Legacy Documentation

**Archived (2025-12-23):**
- `E2E_TEST_SCENARIOS.md` → Migrated to `.smri`
- `SMRI_SCENARIO_SUMMARY.md` → Consolidated into `.smri`
- `/SMRI_NOTATION_V2.md` → Now in `.smri`
- `/SMRI_URL_STANDARD.md` → Now in `.smri`

**Reason:** Single source of truth = easier maintenance

---

**Last Updated:** 2025-12-23  
**Version:** 2.0  
**Master File:** `/.smri`
