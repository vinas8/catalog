# 🤖 Copilot Rules - Serpent Town v0.3.0

**Last Updated:** 2025-12-22  
**Purpose:** Architectural guidelines for AI assistants working on Serpent Town

---

## 🎯 Core Principles

### 0. **Meta-Rule: Propose New Rules** ⭐ CRITICAL
- **When:** You notice a pattern that user repeats multiple times
- **Action:** Ask user: "Should I add this as a rule to COPILOT-RULES?"
- **Examples:**
  - User asks to check architecture → "Should I add 'Always check architecture first'?"
  - User asks to move files to specific location → "Should I add file organization rule?"
  - User asks same workflow multiple times → "Should I add this workflow to rules?"
- **Rule:** ALWAYS ask before adding new rule (don't assume)

### 1. **Modular First**
- All features live in `src/modules/{module}/`
- Changes stay within module boundaries
- Cross-module changes require explicit justification
- **Rule:** Touch ONE module at a time unless integrating

### 2. **KV Storage First** ⭐
- **Production data MUST live in Cloudflare KV**
- **NO** `data/` folder in project root (removed)
- Test data: `docs/temp/test-data/` ONLY
- Always fetch from worker API (not JSON files)
- Add fallback to JSON when worker unavailable (development)
- **Rule:** KV is PRIMARY, JSON is fallback for development/testing ONLY

### 3. **Check Architecture Before Changes** ⭐ NEW
- **ALWAYS** check `docs/architecture/` before structural changes
- Read `ARCHITECTURE.md` for module system
- Read `KV-ARCHITECTURE.md` for data architecture
- **Rule:** Architecture docs are source of truth for structure decisions

### 4. **Group by Quantity (3+ → Folder)** ⭐ NEW
- If 3+ related items exist → create folder
- Examples: `docs/architecture/` (2+ arch docs), `docs/modules/` (5+ modules)
- **Rule:** Anything containing more than 2 items → put in folder

### 5. **Documentation Before Code**
- Check if doc exists: `find docs -name "*.md" | grep {topic}`
- Always update relevant module doc when changing code
- **Rule:** Code change = Doc update (same PR/commit)


### 6. **Voice Input Tolerance** ⭐ NEW
- User uses voice-to-text input
- Interpret intent despite typos/misspellings
- Common patterns: "fonctioning"→"functioning", "duolicated"→"duplicated"
- **Rule:** Focus on intent, not perfect spelling

### 7. **Test Coverage Mandatory**
- Current: 86/86 tests (100%) ✅
- **Rule:** New feature = New test (no exceptions)
- Test location: `tests/modules/{module}/`
- Run before commit: `npm test`

### 9. **No Duplication**

---

## 📁 File Organization Rules

### Documentation Structure
```
docs/
├── README.md              # Documentation index (ALWAYS keep updated)
├── COPILOT-RULES.md       # AI assistant guidelines (this file)
├── ARCHITECTURE.md        # Module system design
├── KV-ARCHITECTURE.md     # KV storage architecture ⭐ NEW
├── SETUP.md               # Deployment guide
├── API_CREDENTIALS.md     # API keys
├── project-api.md         # Core API reference
├── test-api.md            # Testing API
├── modules/               # Per-module docs (one file per module)
│   ├── README.md          # Module index
│   └── {module}.md        # payment, shop, game, auth, common
├── releases/              # Version release notes ONLY
│   └── v{X.Y.Z}-notes.md
├── encyclopedia/          # Game content (species, morphs, care)
├── photos/                # Screenshots
└── temp/                  # Temporary/historical docs (not for reference)
    └── test/              # Test session summaries
```

**Rules:**
- ✅ Core docs in `docs/` root (max 10 files for discoverability)
- ✅ Module docs in `docs/modules/{module}.md` (never in root)
- ✅ Release notes in `docs/releases/` (NOT full version docs)
- ✅ Temporary/historical in `docs/temp/` (clearly labeled)
- ✅ Update `docs/README.md` when adding ANY new doc
- ❌ Don't create version-specific full docs (e.g., v0.4.0.md)
- ❌ Don't create random folders in `docs/` root
- ❌ Don't put test docs in `docs/test/` (use `docs/temp/test/`)

**When to Create New Doc:**
1. **Core architecture change** → New doc in `docs/` + link from README
2. **New module** → New doc in `docs/modules/` + update module index
3. **Release** → Create `docs/releases/v{X.Y.Z}-notes.md` (what changed ONLY)
4. **Bug fix session** → Create in `docs/temp/` (temporary reference)
5. **Setup guide update** → Update existing `docs/SETUP.md` (don't create new)

**When to Update Existing Doc:**
- Code change in module → Update `docs/modules/{module}.md`
- Architecture change → Update `docs/ARCHITECTURE.md` or `docs/KV-ARCHITECTURE.md`
- New API endpoint → Update `docs/project-api.md`
- Deployment process change → Update `docs/SETUP.md`
```
docs/
├── README.md                  # Index (always update)
├── ARCHITECTURE.md            # Module system design
├── SETUP.md                   # Deployment guide
├── modules/
│   ├── README.md              # Module index
│   └── {module}.md            # Per-module docs
├── releases/
│   └── v{X.Y.Z}-notes.md      # Release notes ONLY
└── archive/
    └── {historical}.md        # Old setup guides, etc.
```

**When to Create New Doc:**
1. **Core architecture change** → New doc in `docs/` + link from README
2. **New module** → New doc in `docs/modules/` + update module index
3. **Release** → Create `docs/releases/v{X.Y.Z}-notes.md` (what changed ONLY)
4. **Bug fix session** → Create in `docs/temp/` (temporary reference)
5. **Setup guide update** → Update existing `docs/SETUP.md` (don't create new)

**When to Update Existing Doc:**
- Code change in module → Update `docs/modules/{module}.md`
- Architecture change → Update `docs/ARCHITECTURE.md` or `docs/KV-ARCHITECTURE.md`
- New API endpoint → Update `docs/project-api.md`
- Deployment process change → Update `docs/SETUP.md`

### Test Structure
```
tests/
├── modules/              # Internal unit tests (NO external API calls)
│   └── {module}/
│       └── {feature}.test.js
├── integration/          # Cross-module integration tests
│   └── {scenario}.test.js
├── external/             # External service tests (API calls allowed)
│   ├── cloudflare/       # Worker API, KV storage tests
│   ├── stripe/           # Payment provider tests
│   └── github/           # GitHub Actions tests
└── snapshots/            # Snapshot/regression tests
    └── snapshot.test.js
```

**Rules:**
- ✅ Tests mirror `src/modules/` structure
- ✅ One test file per feature/component
- ❌ Don't mix unit and integration tests
- ✅ Integration tests only for cross-module behavior
- ✅ External service tests ONLY in `tests/external/` (never in `tests/modules/`) ⭐ NEW
- ✅ Always save full test suite output to `docs/test/{timestamp}_test-output.txt` ⭐ NEW

---

## 🔧 Change Workflow

### Before Making Changes
1. **Check version:** `cat package.json | grep version`
2. **Check existing docs:** `find docs -name "*{topic}*.md"`
3. **Check existing code:** `grep -r "{feature}" src/`
4. **Run baseline tests:** `npm test` (should be 86/86 passing)

### Making Changes
1. **Identify affected module:** Which module in `src/modules/`?
2. **Update code:** Make minimal, surgical changes
3. **Update tests:** Add/modify tests in `tests/modules/{module}/`
4. **Update docs:** Edit `docs/modules/{module}.md`
5. **Update index:** If new doc, update `docs/README.md`

### After Making Changes
1. **Run tests:** `npm test` (must pass all tests)
2. **Save test output:** `npm test 2>&1 | tee "docs/test/$(date +%Y-%m-%d_%H-%M-%S)_test-output.txt"` ⭐ NEW
3. **Check no duplication:** `git diff` (no copy-paste)
4. **Verify doc updated:** Did you update module doc?
5. **Commit message:** `feat({module}): brief description`

---

## 🚫 Anti-Patterns (NEVER DO THIS)

### Code Anti-Patterns
- ❌ **Duplicating utilities:** Check `src/modules/common/` first
- ❌ **Creating globals:** Use module exports, not window.*
- ❌ **Mixing concerns:** Business logic in UI files
- ❌ **Tight coupling:** Importing from other modules' internals
- ❌ **Breaking tests:** Reducing test count without justification
- ❌ **Using JSON as production data:** Always use KV via worker ⭐ NEW
- ❌ **Bypassing worker API:** Frontend must call worker, not KV directly ⭐ NEW

### Documentation Anti-Patterns
- ❌ **Versioned full docs:** Don't create `docs/v0.4.0.md` (use `releases/`)
- ❌ **Scattered setup guides:** One SETUP.md, archive old ones
- ❌ **Orphaned docs:** Every doc must be linked from `docs/README.md`
- ❌ **Duplicate content:** Don't copy-paste between docs
- ❌ **Stale docs:** Update docs when code changes

### File System Anti-Patterns
- ❌ **Flat structure:** Don't dump files in `src/` root
- ❌ **Deep nesting:** Max 3 levels in modules
- ❌ **Random naming:** Follow existing conventions (kebab-case)
- ❌ **Test files in src:** Tests only in `tests/`

---

## ✅ Best Practices

### Code Quality
- **Modular:** One module, one responsibility
- **Testable:** Pure functions, dependency injection
- **Readable:** Self-documenting names, minimal comments
- **Minimal:** Smallest change that works

### Documentation Quality
- **Scannable:** Use headings, bullet points, tables
- **Linked:** Cross-reference related docs
- **Current:** Update with code changes
- **Concise:** Remove redundancy

### Git Workflow
- **Atomic commits:** One logical change per commit
- **Descriptive messages:** `feat(shop): add breeding calculator`
- **Test before commit:** Always `npm test` first
- **Review diffs:** Check for unintended changes

---

## 🎯 Module-Specific Rules

### Payment Module (`src/modules/payment/`)
- **Don't:** Touch Stripe webhook verification
- **Do:** Add new payment providers via adapter pattern
- **Test:** Mock Stripe responses, never real API in tests

### Shop Module (`src/modules/shop/`)
- **Don't:** Hardcode prices (use data/products.json)
- **Do:** Use breeding calculator for morph values
- **Test:** Test catalog rendering with fixtures

### Game Module (`src/modules/game/`)
- **Don't:** Modify stat decay rates without balancing
- **Do:** Add new care actions via plugins
- **Test:** Test stats independently from UI

### Auth Module (`src/modules/auth/`)
- **Don't:** Store passwords (hash-only authentication)
- **Do:** Use existing hash generation
- **Test:** Test hash collisions

### Common Module (`src/modules/common/`)
- **Don't:** Add business logic here
- **Do:** Keep pure utility functions only
- **Test:** Test each utility in isolation

---

## 📊 Metrics to Maintain

| Metric | Current | Target | Rule |
|--------|---------|--------|------|
| **Test Pass Rate** | 86/86 (100%) | 100% | Never decrease |
| **Dependencies** | 0 | 0 | No npm packages |
| **Module Count** | 5 | ≤10 | Don't over-modularize |
| **Doc/Code Ratio** | 0.6 | 0.5-0.8 | Keep balanced |
| **Max Nesting** | 3 levels | 3 levels | Flat hierarchy |

---

## 🔍 Common Questions

### "Should I create a new module?"
- ✅ If it's a major feature (10+ files)
- ❌ If it's a small utility (use `common/`)
- ❌ If it fits existing module (extend existing)

### "Where should this function go?"
1. Is it business logic? → `business/`
2. Is it a data model? → `data/`
3. Is it UI? → `ui/`
4. Is it a utility? → `common/`

### "Do I need to update docs?"
- ✅ If you changed public API
- ✅ If you added new feature
- ✅ If you changed behavior
- ❌ If you only refactored internals

### "Which doc should I update?"
1. **Code change:** Update `docs/modules/{module}.md`
2. **New module:** Create `docs/modules/{module}.md` + update index
3. **Architecture change:** Update `docs/ARCHITECTURE.md`
4. **Deployment change:** Update `docs/SETUP.md`
5. **Release:** Create `docs/releases/v{X.Y.Z}-notes.md`

---

## 🚀 Quick Reference

### Before ANY change:
```bash
# 1. Check version
cat package.json | grep version

# 2. Find related docs
find docs -name "*{keyword}*.md"

# 3. Find related code
grep -r "{keyword}" src/

# 4. Run tests (baseline)
npm test
```

### After ANY change:
```bash
# 1. Run tests
npm test

# 2. Check diff
git diff

# 3. Verify docs updated
git status docs/

# 4. Commit
git add .
git commit -m "feat({module}): {description}"
```

---

## 📝 Example Workflows

### Adding a New Feature to Existing Module
```bash
# 1. Identify module: "shop"
# 2. Edit: src/modules/shop/business/new-feature.js
# 3. Test: tests/modules/shop/new-feature.test.js
# 4. Doc: docs/modules/shop.md (add section)
# 5. Run: npm test
# 6. Commit: git commit -m "feat(shop): add new feature"
```

### Creating a New Module
```bash
# 1. Create structure:
mkdir -p src/modules/newmodule/{business,data,ui}
touch src/modules/newmodule/index.js

# 2. Register: src/module-config.js
# 3. Create doc: docs/modules/newmodule.md
# 4. Update index: docs/README.md
# 5. Create tests: tests/modules/newmodule/
# 6. Run: npm test
```

### Fixing a Bug
```bash
# 1. Locate bug: grep -r "{error_message}" src/
# 2. Write failing test: tests/modules/{module}/bug.test.js
# 3. Fix bug: src/modules/{module}/...
# 4. Verify: npm test
# 5. Update doc if behavior changed
# 6. Commit: git commit -m "fix({module}): {bug_description}"
```

---

## 🎓 Learning the Codebase

### First Time Working Here?
1. Read: `README.md` (5 min)
2. Read: `docs/ARCHITECTURE.md` (10 min)
3. Read: `docs/modules/README.md` (5 min)
4. Explore: `src/modules/` (20 min)
5. Run tests: `npm test` (2 min)
6. **Total:** ~45 minutes to full understanding

### Understanding a Module
1. Read: `docs/modules/{module}.md`
2. View: `src/modules/{module}/index.js`
3. Check: `tests/modules/{module}/`
4. **Total:** ~10 minutes per module

---

**Remember:** This is a production codebase with 100% test coverage. Make surgical changes, maintain quality, and always ask if uncertain.

**Questions?** Reference `docs/README.md` for documentation index.
