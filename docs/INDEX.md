# Serpent Town Documentation Index

**Version:** 0.5.0  
**Last Updated:** 2025-12-22

This is the **master index** of all Serpent Town documentation. Start here.

---

## 📚 Core Documentation (Start Here)

### 🎯 **Source of Truth**
**File:** [`docs/test/E2E_TEST_SCENARIOS.md`](test/E2E_TEST_SCENARIOS.md)  
**Purpose:** All 45 E2E scenarios with SMRI codes  
**When to read:** Before every feature, test, or issue

### 📖 **Complete System Guide**
**File:** [`docs/v0.5.0.md`](v0.5.0.md)  
**Purpose:** Comprehensive v0.5.0 documentation (17k words)  
**When to read:** Onboarding, system overview, architecture

### 🎉 **Release Notes**
**File:** [`docs/RELEASE-v0.5.0.md`](RELEASE-v0.5.0.md)  
**Purpose:** What's new in v0.5.0, migration guide  
**When to read:** Upgrading from v0.3.0, checking new features

---

## 🧵 SMRI System

**When to use:** Automate scenario creation, code review

**Patterns:**
- `smri_scenario_generator` - User story → Scenario
- `smri_code_reviewer` - Code → Compliance report
- `smri_test_generator` - Scenario → Test code
- `smri_scenario_summarizer` - Add location/usage context

---

## 🔧 Module Documentation

### **Debug Module**
**File:** [`src/modules/debug/README.md`](../src/modules/debug/README.md)  
**Purpose:** Debug hub features, usage guide  
**When to read:** Using debug.html, manual testing

### **Common Module**
**File:** [`src/modules/common/README.md`](../src/modules/common/README.md) *(if exists)*  
**Purpose:** Scenario runner, shared utilities  
**When to read:** Writing tests, using scenario-runner.js

---

## 🧪 Testing

### **E2E Tests README**
**File:** [`tests/e2e/README.md`](../tests/e2e/README.md)  
**Purpose:** E2E test guidelines, execution  
**When to read:** Writing E2E tests

### **Security Scenarios Test**
**File:** [`tests/e2e/security-scenarios.test.js`](../tests/e2e/security-scenarios.test.js)  
**Purpose:** Reference implementation for SMRI tests  
**When to read:** Writing new scenario tests

---

## 🚀 Setup & Deployment

### **Main README**
**File:** [`README.md`](../README.md)  
**Purpose:** Quick start, project overview  
**When to read:** First time setup

### **Cloudflare Setup**
**File:** [`CLOUDFLARE-SETUP-COMPLETE.md`](../CLOUDFLARE-SETUP-COMPLETE.md)  
**Purpose:** Cloudflare Worker & KV configuration  
**When to read:** Deploying Worker, KV issues

### **Setup Guide**
**File:** [`SETUP.md`](../SETUP.md)  
**Purpose:** Full setup instructions  
**When to read:** New environment setup

---

## 📊 Change History

### **Changes Summary**
**File:** [`CHANGES_SUMMARY.md`](../CHANGES_SUMMARY.md)  
**Purpose:** Recent changes log  
**When to read:** Checking what changed recently

### **Debug Test Summary**
**File:** [`debug-test-summary.md`](../debug-test-summary.md)  
**Purpose:** Debug system verification results  
**When to read:** Troubleshooting debug issues

---

## 🗺️ Quick Navigation

### By Role

**Developer:**
1. Read `docs/test/E2E_TEST_SCENARIOS.md` (scenarios)
2. Read `docs/v0.5.0.md` (system guide)
3. Check `src/modules/debug/README.md` (debug hub)

**QA/Tester:**
1. Read `docs/test/E2E_TEST_SCENARIOS.md` (test scenarios)
2. Read `src/modules/debug/README.md` (manual testing)
3. Read `tests/e2e/README.md` (automated tests)

**Product/Business:**
1. Read `docs/RELEASE-v0.5.0.md` (what's new)
2. Read `docs/v0.5.0.md` § System Overview

**DevOps:**
1. Read `SETUP.md` (setup)
2. Read `CLOUDFLARE-SETUP-COMPLETE.md` (deployment)
3. Check `worker/README.md` (Worker specifics)

### By Task

**Writing a feature:**
1. Check if scenario exists in `E2E_TEST_SCENARIOS.md`
3. Write test in `tests/e2e/`
4. Implement feature
5. Test in `debug.html`

**Fixing a bug:**
1. Find SMRI code for affected feature
2. Read scenario in `E2E_TEST_SCENARIOS.md`
3. Reproduce in `debug.html`
4. Fix code
5. Verify test passes

**Reviewing code:**
1. Check if SMRI code in commit message
3. Verify scenario still passes
4. Check `E2E_TEST_SCENARIOS.md` updated if needed

**Deploying:**
1. Read `SETUP.md` or `CLOUDFLARE-SETUP-COMPLETE.md`
2. Run `npm run test:full`
3. Deploy Worker: `bash .github/skills/worker-deploy.sh`
4. Deploy frontend: `git push origin main`

---

## 📁 File Tree

```
docs/
├── INDEX.md                          # This file
├── v0.5.0.md                         # Complete system guide
├── RELEASE-v0.5.0.md                 # Release notes
├── test/
│   └── E2E_TEST_SCENARIOS.md        # ⭐ SOURCE OF TRUTH
├── guides/
└── archive/
    └── (old versions)

.fabric/
└── patterns/
    ├── smri_scenario_generator/
    ├── smri_code_reviewer/
    ├── smri_test_generator/
    └── smri_scenario_summarizer/

src/modules/debug/
└── README.md                        # Debug hub guide

tests/e2e/
└── README.md                        # E2E testing guide
```

---

## 🔍 Search Documentation

### Find a scenario:
```bash
grep -i "payment confirmation" docs/test/E2E_TEST_SCENARIOS.md
```

### Find where a feature is used:
```bash
grep -r "feedSnake" docs/
```

### Find all P0 scenarios:
```bash
grep "Priority: P0" docs/test/E2E_TEST_SCENARIOS.md
```

### List all SMRI codes:
```bash
grep "^### S" docs/test/E2E_TEST_SCENARIOS.md | cut -d: -f1 | tr -d '#'
```

---

## 🆘 Getting Help

1. **Search this index** for relevant documentation
2. **Read E2E_TEST_SCENARIOS.md** for scenario details
3. **Check v0.5.0.md** for system architecture
4. **Use debug.html** to test manually
5. **Ask with SMRI code** in issues/discussions

---

## 📊 Documentation Statistics

- **Total Documentation:** 50,000+ words
- **Core Files:** 8 essential docs
- **Module READMEs:** 2+ module guides
- **Test Guides:** 2 testing docs

---

**Version:** 0.5.0  
**Documentation Status:** ✅ Complete  
**Last Updated:** 2025-12-22

*Start with E2E_TEST_SCENARIOS.md. Everything flows from there.*
