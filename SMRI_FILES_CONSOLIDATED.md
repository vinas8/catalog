# SMRI Files Consolidated

**Status:** All SMRI documentation now in `.smri` manifest

---

## 📋 Single Source of Truth

**File:** `.smri`
**Location:** `/root/catalog/.smri`
**Purpose:** Complete SMRI system manifest

Contains:
- Notation standard v2.0
- All 42 scenarios with priorities
- Module definitions
- Implementation status
- Related file links

---

## 🔗 References

Primary:
  /.smri                              → Master manifest ⭐

Web Interface:
  /smri/                              → Test suite hub
  /smri/S6.1,2,3,4,5,6.03.html       → Health check (live)

Documentation:
  README.md                           → Project overview with SMRI section
  docs/test/E2E_TEST_SCENARIOS.md     → Full scenario specifications

Legacy (archived):
  SMRI_NOTATION_V2.md                 → v2.0 notation (now in .smri)
  SMRI_URL_STANDARD.md                → URL standard (now in .smri)

---

## ✅ Benefits of Single Manifest

1. **One place to update** - No duplicate info
2. **Version controlled** - Track changes in git
3. **Easy to reference** - `cat .smri` shows everything
4. **Linked everywhere** - README, docs, /smri/ all point to .smri
5. **Terminal friendly** - Plain text, grep-able

---

**Last Updated:** 2025-12-23
**Version:** 2.0
**Scenarios:** 42 total, 1 implemented
