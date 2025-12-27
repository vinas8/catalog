# 📚 Documentation Cleanup Plan

**Date:** 2025-12-27  
**Project:** Serpent Town v0.5.0  
**Status:** In Progress

---

## 🎯 Goal

Clean up redundant documentation by moving test scenarios and business rules into:
1. **Code** (where executable)
2. **.smri file** (single source of truth for scenarios)
3. **Debug Hub** (interactive testing)

Keep only **non-executable** information in `/docs/`.

---

## 📊 Current State

- **94 total documentation files** (2.4MB)
- Many files contain **redundant** test scenarios
- Business rules scattered across multiple files
- Test documentation outdated (not reflecting current .smri notation)

---

## 🗑️ Files to Remove/Archive

### Test Documentation (Migrated to .smri)
- [x] `docs/test/E2E_TEST_SCENARIOS.md.backup` → DELETE
- [x] `docs/test/E2E_TEST_SCENARIOS.md.archive` → Already archived, DELETE
- [ ] `docs/test/E2E_SCENARIOS_README.md` → **REPLACE** with redirect to .smri

### Business Rules (Consolidated to .smri)
- [x] `docs/archive/BUSINESS_FACTS.md` → Already archived
- [x] `docs/archive/BUSINESS_FACTS_V2.md` → Already archived
- [x] `docs/archive/BUSINESS_FACTS_V3_FABRIC_METHOD.md` → Already archived
- [x] `docs/archive/business-legacy/BUSINESS_REQUIREMENTS.md` → Already archived
- [x] `docs/archive/business-legacy/BUSINESS_RULES_CONSOLIDATED.md` → Already archived
- [ ] `docs/BUSINESS_RULES.md` → **KEEP** but reference .smri for specs

### Temporary Files
- [ ] `docs/temp/test/TEST-SESSION-SUMMARY.md` → DELETE (temp)
- [ ] `docs/temp/*` → Review and clean up

---

## ✅ What to Keep

### Core Documentation (Non-Code)
- `README.md` - Project overview
- `docs/v0.5.0.md` - Version documentation
- `docs/SETUP.md` - Deployment guide
- `docs/CLOUDFLARE-SETUP-COMPLETE.md` - Cloudflare setup
- `docs/STRIPE-SECRET-SETUP.md` - Stripe configuration
- `docs/DEVELOPER_REFERENCE.md` - API reference
- `docs/DOCUMENTATION_INDEX.md` - Documentation index

### API Documentation
- `docs/api/*.md` - API endpoint documentation
- `docs/worker/*.md` - Worker documentation

### Architecture
- `docs/architecture/*.md` - System design documents

### Guides
- `docs/guides/*.md` - How-to guides

---

## 📝 Files to Update

### docs/test/E2E_SCENARIOS_README.md
**Current:** Contains outdated scenario list  
**New:** Redirect to primary sources

```markdown
# E2E Test Scenarios

**⚠️ This document has been superseded.**

## 🎯 New Documentation Structure

All test scenarios are now maintained in:

1. **/.smri** - Complete scenario specifications with SMRI notation
2. **/debug/test-scenarios.html** - Interactive test hub
3. **/smri/scenarios/** - Executable test pages

## 📍 Quick Links

- [View .smri file](../../.smri) - Single source of truth
- [Open Debug Hub](https://vinas8.github.io/catalog/debug/) - Interactive testing
- [Test Scenarios Page](https://vinas8.github.io/catalog/debug/test-scenarios.html) - All 42 scenarios

## 📊 Current Status

- Total Scenarios: 42
- Implemented: 2/42 (4.8%)
- E2E Coverage: See .smri file
- Unit Tests: 71/71 passing (100%)

Last updated: 2025-12-27
```

### docs/BUSINESS_RULES.md
**Current:** Contains business rules  
**Update:** Add reference to .smri

```markdown
# Business Rules

**⚠️ Primary specification is in /.smri file**

This document provides a high-level overview. For detailed business rules with test scenarios, see:
- **/.smri** - Complete business rules with E2E scenarios
- **/debug/test-scenarios.html** - Interactive testing

## Quick Reference

### Purchase Flow
See: S1.1,2,3,4,5.01 in .smri

[Rest of document...]

## 📍 See Also
- [.smri file](../.smri) - Detailed specifications
- [Debug Hub](https://vinas8.github.io/catalog/debug/) - Interactive tests
```

### docs/DOCUMENTATION_INDEX.md
**Update:** Reflect new structure

```markdown
# Documentation Index

## 🎯 Primary Sources
1. **/.smri** - Test scenarios and business rules (SINGLE SOURCE OF TRUTH)
2. **/debug/** - Interactive testing and debugging tools
3. **README.md** - Project overview

## 📚 Documentation
[...]

## 🧪 Testing
- **Interactive:** /debug/test-scenarios.html
- **Specifications:** /.smri
- **Unit Tests:** /tests/
```

---

## 🚀 Migration Checklist

### Phase 1: Archive Redundant Files ✅
- [x] Move old business docs to archive/
- [x] Delete duplicate test scenarios
- [x] Clean up temp files

### Phase 2: Update Existing Docs
- [ ] Update E2E_SCENARIOS_README.md with redirects
- [ ] Update BUSINESS_RULES.md with .smri reference
- [ ] Update DOCUMENTATION_INDEX.md structure
- [ ] Update README.md if needed

### Phase 3: Verify References
- [ ] Search for broken links
- [ ] Update cross-references
- [ ] Test all documentation links

### Phase 4: Final Cleanup
- [ ] Delete archived backup files
- [ ] Consolidate remaining duplicates
- [ ] Update last-modified dates

---

## 📏 Documentation Standards Going Forward

### Where to Document

| Content Type | Location | Example |
|--------------|----------|---------|
| Test Scenarios | `.smri` file | S1.1,2,3.01 specification |
| Business Logic | Code + `.smri` | Purchase flow rules |
| API Endpoints | `docs/api/` | Worker API reference |
| Setup Guides | `docs/guides/` | Cloudflare setup |
| Architecture | `docs/architecture/` | System design |
| Change Logs | `CHANGELOG.md` | Version history |

### What NOT to Document

- ❌ Code that documents itself (use comments instead)
- ❌ Duplicate information (single source of truth)
- ❌ Outdated specifications (keep docs current or archive)
- ❌ Temporary notes (use `/docs/temp/` and clean regularly)

---

## 🎯 Success Metrics

- **Target:** < 50 documentation files (from 94)
- **Redundancy:** 0 duplicate specifications
- **Freshness:** All docs dated within 30 days
- **Accessibility:** 1-click access to test scenarios from docs

---

## 📋 Commands to Execute

### Delete Archived Duplicates
```bash
rm docs/test/E2E_TEST_SCENARIOS.md.backup
rm docs/temp/test/TEST-SESSION-SUMMARY.md
```

### Update Key Files
```bash
# Will be done manually with proper content
nano docs/test/E2E_SCENARIOS_README.md
nano docs/BUSINESS_RULES.md
nano docs/DOCUMENTATION_INDEX.md
```

### Verify No Broken Links
```bash
grep -r "docs/test/E2E_TEST_SCENARIOS" . --include="*.md"
grep -r "BUSINESS_FACTS" . --include="*.md"
```

---

**Last Updated:** 2025-12-27  
**Next Review:** When implementing new scenarios  
**Owner:** Development Team
