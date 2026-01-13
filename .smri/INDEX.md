# 🐍 Serpent Town - Index & Rules

**Version:** 0.7.7  
**Last Updated:** 2026-01-07  
**Purpose:** SMRI system index and operating rules

---

## 📖 What is .smri?

**SMRI** = **S**erpent Town **M**aster **R**eference **I**ndex

A consolidated documentation system where **ALL** project documentation lives:
- **INDEX.md** (this file) - Navigation, rules, AI instructions
- **docs/** - Focused topic docs (business, technical, deployment)
- **scenarios/** - Test scenarios in structured format
- **logs/** - Daily session conversation history

**Goal:** Single source of truth. **NO scattered docs**. Everything in `.smri/`.

---

## 🚨 CRITICAL RULES FOR AI ASSISTANTS

### 0. HARD RULE: Only ONE file in .smri root
**ONLY `INDEX.md` allowed in `/root/catalog/.smri/`**
- ❌ NO `.smri/AI-GUIDE.md`
- ❌ NO `.smri/README.md`
- ❌ NO `.smri/RULES.md`
- ✅ Use `.smri/logs/` for notes
- ✅ Use `.smri/docs/` for documentation

### 0.5. ANTI-SCATTER RULE: Follow Defined Structure
**WHY WE LOAD .smri: To prevent scattered files everywhere**

**PROBLEM:** Files get scattered across project:
- ❌ Multiple demo files in different locations
- ❌ Duplicate test runners (root, debug/, debug/tools/, debug/archive/)
- ❌ Similar files with slight differences
- ❌ No clear "source of truth"

**SOLUTION:** Strict structure enforcement
```
/debug/
  ├── index.html              ← Main debug hub (ONLY ONE)
  ├── tools/
  │   ├── smri-runner.html    ← Test executor (ONLY ONE)
  │   ├── kv-manager.html     ← KV management
  │   └── healthcheck.html    ← Health checks
  ├── purchase-flow-demo.html ← Purchase demo (ONLY ONE)
  ├── visual-demo.html        ← Visual demo (ONLY ONE)
  └── archive/                ← Old versions (NEVER use)
```

**RULES:**
1. **Before creating ANY file:** Check if it exists using `find` or `tree`
2. **If similar file exists:** Update existing, DON'T create new
3. **If old version exists:** Archive it, then create ONE new version
4. **Never create duplicates:** smri-runner-v2.html, demo-new.html, test-final.html
5. **Follow the map:** `.smri/INDEX.md` defines structure - stick to it

**AI ACTION REQUIRED:**
```bash
# Before creating any file, ALWAYS run:
cd /root/catalog && find . -name "*similar-name*" -type f
tree -L 3 debug/

# If duplicates found:
# 1. Move old to archive
# 2. Update/create ONE canonical version
# 3. Document in .smri/logs/
```

**This prevents:** "Where's the demo? There are 5 demo files!"  
**This ensures:** "The demo is at `/debug/visual-demo.html` - that's the only one."

### 1. Use Git to Verify Structure
**ALWAYS run before creating files:**
```bash
cd /root/catalog && git status .smri/
tree -L 3 .smri/
```

**After changes:**
```bash
git add .smri/
git commit -m "update: {description}"
git status .smri/  # verify clean
```
### 2. NO Documentation Outside .smri/
- ❌ Project root (except README.md, CHANGELOG.md)
- ❌ `/docs` folder (archived, read-only)
- ❌ Module folders (`src/*/README.md` - only code comments allowed)
- ❌ Temporary files (`IMPLEMENTATION_COMPLETE.md`, `WORK_SUMMARY_*.md`)

**ONLY create documentation in:**
- ✅ `.smri/docs/` - Topic-specific documentation
- ✅ `.smri/scenarios/` - Test scenarios
- ✅ `.smri/logs/` - Session logs

### 3. NO File Duplication
**Before creating ANY file:**
```bash
tree -L 3 /root/catalog/.smri/
```
**Check if topic already exists. If yes, UPDATE existing file, don't create new.**

### 4. Scenario Files Structure
**Scenarios must be:**
- Named using SMRI format: `S{M}.{RRR}.{II}-{short-name}.md`
- Stored flat in `.smri/scenarios/` (NO subfolders)
- Linked to `/debug` endpoint for testing
- One scenario per file

**SMRI Format:**
```
S{M}.{RRR}.{II}
- S = Scenario prefix
- M = Primary module (0-6) or submodule (e.g., 2-7 = Game Tutorial)
- RRR = Relations (comma-separated)
- II = Iteration (01-99)

Separators:
- DOT (.) = Separates parts
- COMMA (,) = Separates modules in relations
- DASH (-) = Indicates submodule (e.g., 2-7 = Module 2, Submodule 7)
```

**Module Numbers:**
- 0 = Health
- 1 = Shop
- 2 = Game (2-7 = Tutorial, 2-8 = Inventory)
- 3 = Auth
- 4 = Payment
- 5 = Worker (5-1 = KV storage)
- 6 = Common

**Real Examples:**
```
.smri/scenarios/
├── S0.0,1,2,3,4,5.01-all-health-checks.md
├── S1.1,2,3,4,5.01-happy-path-purchase.md
├── S2.7,5,5-1.01-tutorial-happy-path.md
├── S2.7,5,5-1.02-tutorial-missed-care.md
└── S6.1,2,3.09-FLUENT-CUSTOMER-JOURNEY.md
```

**NOT:**
```
❌ .smri/scenarios/shop/purchase-flow.md (no subfolders)
❌ .smri/scenarios/VCT-1.0.md (wrong format - use SMRI)
❌ .smri/scenarios/tests/ (no test subfolders)
```

### 5. Scenarios Link to /debug Endpoint
**Every scenario MUST reference debug endpoint:**
```
Test URL: https://vinas8.github.io/catalog/debug.html?scenario=VCT-1.0
Debug endpoint: /api/debug?run=VCT-1.0
```

**Debug endpoint provides:**
- Scenario execution
- KV state inspection
- Event queue preview
- Validation results

### 6. File Size Limits
**Maximum file sizes:**
- Topic docs: 1000 lines (split if larger)
- Scenarios: 300 lines per scenario
- Session logs: No limit (one file per day)

**If file exceeds limit, SPLIT into subtopics.**

---

## 🔄 SMRI Commands

### `.smri`
Complete project briefing:
1. **Explain Module Architecture:**
   ```
   📦 Module System (v0.7.7)
   
   src/modules/ - 9 internal modules with facades
   ├── common/      (S0) - Core utilities, health
   ├── shop/        (S1) - E-commerce
   ├── game/        (S2) - Tamagotchi mechanics
   ├── auth/        (S3) - User auth
   ├── payment/     (S4) - Stripe (external wrapper)
   ├── worker/      (S5) - Backend API (external - needs abstraction)
   ├── testing/     (S6) - Test framework
   ├── breeding/    (S7) - Genetics (external - needs abstraction)
   ├── smri/        (S8) - Test runner
   └── tutorial/    (S9) - Tutorial system
   
   External Modules (S10+):
   - Future external services that need abstraction
   - Pattern: Internal abstraction over external service
   
   Each module has:
   ✅ index.js (public facade)
   ✅ Listed in src/config/smri/module-functions.js
   ✅ Documented in src/PUBLIC-API.md
   
   When creating new SMRI scenarios:
   1. Check module number in SMRI format: S{module}.{relations}.{iteration}
   2. S0-S9: Add to existing module
   3. S10+: Create external abstraction first
   4. Update src/config/smri/scenarios.js
   ```
   
2. **Load SMRI Format Rule:**
   ```
   S{M}.{RRR}.{II}
   - S = Scenario prefix
   - M = Primary module (0-9) or submodule (e.g., 2-7 = Game Tutorial)
   - RRR = Relations (comma-separated module numbers)
   - II = Iteration (01-99)
   
   Module Numbers in SMRI:
   - 0: Health/Common
   - 1: Shop
   - 2: Game
   - 3: Auth
   - 4: Payment
   - 5: Worker (external - KV/webhooks)
   - 6: Testing
   - 7: Breeding (external)
   - 8: SMRI (test system)
   - 9: Tutorial
   - 10+: Future external modules
   
   Submodules (using dash):
   - 2-7: Game Tutorial (module 2, submodule 7)
   - 5-1: Worker KV storage (module 5, submodule 1)
   - 5-2: Worker Webhooks (module 5, submodule 2)
   
   Separators:
   - DOT (.) = Separates parts (S0.1,2,3.01)
   - COMMA (,) = Separates modules in relations (1,2,3)
   - DASH (-) = Indicates submodule (2-7, 5-1)
   
   Examples:
   - S2.7,5,5-1.01 = Game (module 2), related to Tutorial (7), Worker (5), KV (5-1), iteration 01
   - S1.1,2,3,4,5.01 = Shop (module 1) with relations to itself, game, auth, payment, worker
   - S0.0,1,2,3,4,5.01 = Health (module 0) checking all modules
   
   When Creating New Scenarios:
   1. Determine module number (0-9 internal, 10+ external)
   2. Check if module folder exists in src/modules/
   3. If 10+: Abstract external service first
   4. Add to src/config/smri/scenarios.js
   5. Create .smri/scenarios/S{M}.{RRR}.{II}-name.md file
   
   Real-World Scenario Creation Pattern:
   
   PATTERN: When implementing new features, create scenarios BEFORE coding:
   
   Example: User requests "Test render component for demos"
   
   Step 1: Break down into scenarios
   - S0.0,1,2,6,8.02 - Project Consistency Validation (file sizes, modularity)
   - S6.6,8.01 - TestRenderer Component Creation (modular component)
   - S8.6,8.01 - Conditional TestRenderer in SMRI Runner (conditional use)
   - S8.1,6,8.02 - Demo Scenario Collections with TestRenderer (reuse)
   - S1.1,6,8.01 - In-Browser Shop Frontend Testing (user interactions)
   
   Step 2: For each scenario, identify:
   - Primary module: What's the main focus? (e.g., 6=Testing, 8=SMRI, 1=Shop)
   - Relations: What other modules does it touch? (e.g., 6,8 = Testing+SMRI)
   - Iteration: First version? 01. Enhancement? 02+.
   
   Step 3: Write descriptive names:
   ✅ "TestRenderer Component Creation" - Clear, action-oriented
   ❌ "Make component" - Too vague
   ✅ "In-Browser Shop Frontend Testing" - Specific context
   ❌ "Test shop" - Unclear scope
   ```
   
3. Check version (`package.json`)
4. Load `.smri/INDEX.md` (navigation + rules)
5. Load `README.md` (project overview)
6. Load `src/SMRI.md` (quick reference)
7. Load `src/PUBLIC-API.md` (module functions)
8. Load `src/config/smri/scenarios.js` (all scenarios)
9. **Show deep directory tree** (4 levels with file sizes)
10. **Analyze file sizes** (find files >400 lines)
11. Check for inconsistencies:
   - Version mismatches (package.json vs docs)
   - Duplicate documentation
   - Outdated files
   - Redundant code/modules
   - **Large files needing split**
12. **Suggest refactors** (requires user approval):
   - Remove duplicate code
   - Consolidate similar modules
   - Archive outdated docs
   - Update version references
   - **Split large files**
   - **Abstract external modules (S10+)**
13. Ask: "📍 Where did we leave off?"

**Note:** All changes require user approval before execution.

### `.smri log`
Update today's session log with:
- Latest prompt (original if <100 lines, else summarized)
- Latest answer (original if <100 lines, else summarized)
- Each entry separated by date/time header
- **Auto-suggest:** "Consolidate this session into .smri/docs/{topic}.md?"

### `.smri list scenarios` (or `.smri list s`)
List all SMRI scenarios with status:
1. **Execute:** Import from `src/config/smri/scenarios.js`
2. **Display format:**
   ```
   📊 SMRI Scenarios (v0.7.7)
   
   Total: 17 | ✅ 10 (59%) | ⏳ 7 (41%)
   
   By Module:
   • health (S0): 5 scenarios (3 ✅, 2 ⏳)
   • shop (S1): 3 scenarios (3 ✅)
   • game (S2): 3 scenarios (2 ✅, 1 ⏳)
   • auth (S3): 1 scenario (⏳)
   • payment (S4): 1 scenario (✅)
   • worker (S5): 1 scenario (✅)
   • common (S6): 1 scenario (✅)
   
   🔴 Pending (⏳):
   • S0.2.01 - Game Mechanics Check
   • S0.3.01 - Auth Validation
   • S0.4.01 - Stripe Integration
   • S3.2,3.01 - Calculator Genetics Data
   • S2.1,2.01 - Gamified Shop
   
   🎯 Next: Complete S0 health checks
   ```
3. **Source:** `src/config/smri/scenarios.js` (centralized config)
4. **Fast:** <1 second, ES6 module import

### `.smri list functions` (or `.smri list f`)
List all public module functions:
1. **Execute:** Import from `src/config/smri/module-functions.js`
2. **Display format:**
   ```
   📚 Module Functions (v0.7.7)
   
   Modules: 9 | Functions: 50+ | Exports: 40+
   
   Available Modules:
   • common - Core utilities, constants
   • game - Tamagotchi mechanics (8 functions)
   • shop - E-commerce, pricing (9 functions)
   • auth - User authentication (4 functions)
   • payment - Stripe integration (3 functions)
   • testing - Test framework (2 functions)
   • breeding - Genetics calculator (3 functions)
   • smri - Test runner (4 functions)
   • tutorial - Tutorial system (3 functions)
   
   💡 Usage:
   import { Economy } from './modules/shop/index.js';
   import { SerpentTown } from './modules/game/index.js';
   
   📖 Full API: src/PUBLIC-API.md
   ```
3. **Source:** `src/config/smri/module-functions.js`
4. **Helper:** Can search with `.smri search {query}`

### `.smri search {query}`
Search functions across all modules:
1. **Execute:** `searchFunctions(query)` from module-functions.js
2. **Example:**
   ```
   > .smri search buy
   
   🔍 Found 3 functions matching "buy":
   
   shop.EquipmentShop.buy(itemId, qty)
     → Buy equipment
     → Returns: boolean
   
   game.shopPlugin.buy(itemId)
     → Purchase item
     → Returns: boolean
   
   shop.Economy.calculatePrice(species, morph)
     → Calculate product price (for buying)
     → Returns: number
   ```

### `.smri mcp`
Test MCP (Model Context Protocol) integration:
1. **Execute parallel tests:** GitHub MCP + code search
2. **Display results:**
   ```
   🔌 MCP Status Check (v0.7.7)
   
   ✅ GitHub MCP: 0 issues, 5 recent commits
   ✅ Code Search: 4 files with KV.put
   
   📚 Docs: .smri/docs/mcp-quickstart.md
   🔧 Config: ~/.copilot/config.json
   ```
3. **Sources:** 
   - GitHub issues API
   - GitHub commits API  
   - GitHub code search API
4. **Fast:** <2 seconds, parallel MCP calls

### `.smri consolidate`
Consolidate documentation:
- Scan `/docs` and root `*.md` files
- Check for outdated info (compare with package.json version)
- Merge into focused topic files in `.smri/docs/`
- Archive original files (move to `docs/archive/`)

### `.smri add`
Add new documentation or update existing:
1. **Analyze request:**
   - Determine topic category (business, technical, deployment, etc.)
   - Check if topic already exists in `.smri/docs/`
2. **Choose action:**
   - If topic exists: Update existing file (append or edit section)
   - If new topic: Create new file in `.smri/docs/{topic}.md`
3. **Format documentation:**
   - Add version number (from package.json)
   - Add timestamp
   - Use consistent markdown structure
   - Include examples and code snippets
4. **Update references:**
   - Add to `.smri/INDEX.md` Quick Links if major topic
   - Update session log (`.smri/logs/YYYY-MM-DD.md`)
5. **Confirm:**
   - Show what will be created/updated
   - Wait for user approval before writing

**Usage examples:**
- `.smri add` - Add current conversation to appropriate doc
- User provides context, AI suggests best location

---

## 📁 SMRI Structure

**HARD RULE: Only ONE file in .smri root: INDEX.md (this file)**

```
.smri/
├── INDEX.md               ← ONLY ROOT FILE (you are here)
├── docs/                  ← Topic documentation (5-10 files max)
│   ├── business.md
│   ├── technical.md
│   ├── deployment.md
│   └── {feature}-validation.md
├── scenarios/             ← Test scenarios (organized by feature)
│   └── {feature-name}/
│       ├── README.md
│       └── {ID}-{name}.md
└── logs/                  ← Session logs (one per day)
    └── YYYY-MM-DD.md
```

**Current:** 10 files (INDEX + 5 docs + 1 log + 3 scenarios)  
**Target:** Keep under 20 total files

---

## 📚 Topic Docs (.smri/docs/)

### When to Create a New Topic Doc:

1. **Size threshold:** When MASTER.md section exceeds 200 lines
2. **Complexity:** Topic requires deep dive with examples
3. **Frequent updates:** Content changes often (e.g., troubleshooting)
4. **Standalone value:** Can be read independently

### Topic Doc Format:

```markdown
# {Topic Name}

**Version:** 0.7.0  
**Last Updated:** YYYY-MM-DD  
**Consolidated from:** List source files

---

## Overview
Brief description (2-3 sentences)

## Content Sections
Detailed information organized by subtopics

## Quick Reference
Commands, examples, links

## Sources
Original documentation this replaces
```

---

## 🗂️ Documentation Hierarchy

### 1. **INDEX.md** (This File)
- SMRI system rules
- Command reference
- Navigation to all docs
- Quick links

### 2. **Topic Docs** (.smri/docs/)
- Business logic → `business.md`
- Technical details → `technical.md`
- Stripe/payments → `stripe.md`
- Troubleshooting → `troubleshooting.md`
- Deployment → `deployment.md`

### 3. **Session Logs** (.smri/logs/)
- Daily conversation history
- Prompts + answers (summarized if >100 lines)
- Links to created/updated docs

### 4. **Archives** (docs/archive/)
- Outdated documentation
- Historical reference
- Not actively used

---

## 🔄 Documentation Lifecycle

### Active → Consolidated → Archived

1. **Active** (`/docs`, root `*.md`)
   - Current working documentation
   - May be outdated or redundant

2. **Consolidation** (by `.smri consolidate`)
   - Check version/date (compare with package.json)
   - Merge into topic docs
   - Remove duplicates

3. **Archived** (`docs/archive/`)
   - Original files moved here
   - Kept for historical reference
   - Not actively maintained

---

## ✅ Consolidation Rules

### What to Keep:
- Current version info (0.7.0)
- Working code examples
- Deployment instructions
- API documentation
- Troubleshooting guides

### What to Archive:
- Old version docs (v0.5.0, v0.6.0 specifics)
- Duplicate information
- Implementation notes (completed tasks)
- Status reports (deployment success, etc.)

### What to Delete:
- Empty files
- Test output logs
- Temporary notes
- Outdated status files

---

## 📊 Current Status (v0.7.1)

### Recent Updates:
- ✅ Version synced to 0.7.1 across all docs
- ✅ 6 tutorial scenarios complete (S2-7.x)
- ✅ Aquarium redesign + debug system
- ⚠️ 6 snapshot tests failing (88% pass rate)

### Cleanup Status:
- **Root test files:** 6 files to move to /debug
- **Old backups:** 2 files to archive
- **Session markers:** 2 files to remove

---

## 🎯 Quick Links

### Essential Files:
- **Project Overview:** `/README.md`
- **Version History:** `/CHANGELOG.md`
- **Business Logic:** `.smri/docs/business.md`
- **Technical Docs:** `.smri/docs/technical.md`
- **Latest Session:** `.smri/logs/2025-12-28.md`

### External Links:
- **GitHub:** https://github.com/vinas8/catalog
- **Live Site:** https://vinas8.github.io/catalog/
- **Worker API:** https://catalog.navickaszilvinas.workers.dev

---

## 🛠️ AI Assistant Rules

### When User Types `.smri`:
1. **Check if function catalog needs update:**
   ```bash
   current_hash=$(git log -1 --format="%h")
   catalog_hash=$(grep "Git Commit:" .smri/docs/FUNCTION-CATALOG.md 2>/dev/null | cut -d'`' -f2 | cut -d' ' -f1)
   
   if [ "$current_hash" != "$catalog_hash" ]; then
     echo "🔄 Updating function catalog (new commit detected)..."
     node scripts/scan-functions.cjs > .smri/docs/FUNCTION-CATALOG.md
     echo "✅ Function catalog updated to $current_hash"
   else
     echo "✅ Function catalog up to date ($current_hash)"
   fi
   ```

2. **Run complete briefing:**
   - Explain module architecture
   - Scan for version inconsistencies
   - Detect duplicate files/documentation
   - Identify outdated content
   - Find redundant code patterns
4. **Report findings:**
   - List all inconsistencies found
   - Suggest specific refactors
   - Estimate impact of each change
5. **Wait for approval:**
   - Do NOT make changes automatically
   - Present suggestions as a list
   - Ask: "Apply these fixes? (y/n)"
6. Ask: "Where did we leave off?"

### When User Types `.smri log`:
1. Append to today's log file (`.smri/logs/YYYY-MM-DD.md`)
2. Include prompt + answer (summarize if >100 lines)
3. Add timestamp separator
4. Suggest: "Consolidate into .smri/docs/{topic}.md?"

### When User Types `.smri list scenarios`:
1. **Load and display from central config:**
   ```javascript
   import { SMRI_SCENARIOS, getScenarioStats, getScenariosByModule } 
     from './config/smri/scenarios.js';
   
   const stats = getScenarioStats();
   // Display: total, passed, pending, by module, next actions
   ```
2. **Format output** (grouped by module, status summary)
3. **Show next recommended scenarios**

### When User Types `.smri list functions`:
1. **Load and display from function catalog:**
   ```javascript
   import { MODULE_FUNCTIONS, getAllModuleNames } 
     from './config/smri/module-functions.js';
   
   // Display: module count, function count, quick reference
   ```
2. **Show module list with function counts**
3. **Link to src/PUBLIC-API.md for details**

### When User Types `.smri search {query}`:
1. **Search across all functions:**
   ```javascript
   import { searchFunctions } from './config/smri/module-functions.js';
   
   const results = searchFunctions('buy');
   // Display: matching functions with signatures
   ```
2. **Show relevant modules and functions**
3. **Include usage examples**

### When User Types `.smri mcp`:
1. **Run parallel MCP tests:**
   - `github-mcp-server-list_issues` (vinas8/catalog, 5 results)
   - `github-mcp-server-list_commits` (vinas8/catalog, 5 results)
   - `github-mcp-server-search_code` (query: "repo:vinas8/catalog KV.put", 3 results)
2. **Display compact summary:**
   ```
   🔌 MCP Status (v0.7.7)
   
   ✅ GitHub MCP: {N} issues, {N} recent commits
   ✅ Code Search: {N} files found
   
   📚 Quickstart: .smri/docs/mcp-quickstart.md
   🔧 Config: ~/.copilot/config.json
   ```
3. **No extra explanation** - just test results

### When User Types `.smri consolidate`:
1. Scan `/docs` and root `*.md` files
2. Check version/dates
3. Merge into topic docs
4. Archive originals
5. Report: Files reviewed, consolidated, archived

### When User Types `.smri add`:
1. **Analyze the context:**
   - Read previous prompt and answer
   - Identify topic (debugging, features, configuration, etc.)
   - Check existing `.smri/docs/` files for related content
2. **Suggest destination:**
   - If exists: "Add to `.smri/docs/troubleshooting.md` section 'Stripe Upload Issues'?"
   - If new: "Create `.smri/docs/stripe-debugging.md`?"
3. **Show preview:**
   - Display markdown that will be added
   - Include version, timestamp, and formatted content
4. **Wait for approval:**
   - Ask: "Add this documentation? (y/n)"
   - Do NOT write until user confirms
5. **Write and log:**
   - Create or update the file
   - Log action in session log
   - Report: "✅ Added to .smri/docs/{file}.md"

### Version Check:
- Always check `package.json` for current version
- Flag docs with mismatched versions
- Update or archive outdated docs

---

## 📝 Maintenance

### Daily:
- Update session logs (`.smri log` after each session)
- Suggest consolidation when new docs created

### Weekly:
- Review `.smri/docs/` for size (target: <500 lines each)
- Split large topics into subtopics
- Archive outdated root docs

### On Version Release:
- Update all version numbers in `.smri/`
- Archive previous version docs
- Create new version summary

---

**Built with ❤️ and 🐍**  
**SMRI System v1.0**  
**Last Updated:** 2025-12-28T20:54:38Z

---

## 🔍 File Size Management

### Large File Policy:
- **Soft limit:** 500 lines per file
- **Hard limit:** 1000 lines per file  
- **Exceptions:** Test files, data files
- **Documentation limit:** 500 lines per .md file in `.smri/docs/`

### SMRI Documentation Structure Rule:

**When .smri/docs/{topic}.md exceeds 500 lines:**

1. **Create subfolder:** `.smri/docs/{topic}/`
2. **Split into focused files:**
   - `README.md` - Overview & navigation (50-100 lines)
   - `config.md` - Constants, thresholds, data (150-250 lines)
   - `formulas.md` - Algorithms, calculations (250-350 lines)
   - `research.md` - Sources, science, references (150-250 lines)
   - `implementation.md` - Roadmap, specs, dev notes (150-250 lines)

3. **Each file must:**
   - ✅ Stay under 500 lines
   - ✅ Have clear purpose
   - ✅ Link to related files
   - ✅ Include version & date

**Example Structure:**
```
.smri/docs/
├── breeding-calculator/
│   ├── README.md          # Quick reference & links
│   ├── config.md          # LETHAL_COMBOS, MORPH_VALUES
│   ├── formulas.md        # CoI, heterozygosity calculations
│   ├── research.md        # Wright's formula, sources
│   └── implementation.md  # Phase 1-4, UI specs
├── business.md            # Simple topic (< 500 lines, no split)
├── technical.md           # Simple topic (< 500 lines, no split)
└── ... 
```

### When AI Sees Large Files:
1. **Check if it's SMRI doc** (`.smri/docs/*.md`)
2. **If >500 lines:** Suggest split with specific structure
3. **If >1000 lines:** Recommend immediate split
4. **Show:** Proposed file breakdown with line counts

### Refactoring Guidance:
When user says "add to {topic}.md":
1. Check current line count
2. If >400 lines, warn: "File is {N} lines, approaching 500 limit"
3. If >500 lines, suggest: "Split into {topic}/ subfolder first?"
4. Wait for approval
5. Split, THEN add content

**Example:**
```
User: "Add breeding research to breeding-calculator.md"
AI: "breeding-calculator.md is 854 lines (over 500 limit). 
     Should I:
     1. Split into breeding-calculator/ subfolder (5 files)?
     2. Add to existing file (not recommended)?
     Choose: "
```

### Deep Tree Command:
```bash
tree -L 4 -I 'node_modules|venv' --filesfirst
```
Shows all modules and their split structure clearly.

---

## 🏗️ Module Architecture (v0.7.7)

### Internal Modules (S0-S9)
Located in `src/modules/`, each has:
- **index.js** - Public facade with `ENABLED` flag
- **README.md** - Module documentation
- Listed in `src/config/smri/module-functions.js`
- Documented in `src/PUBLIC-API.md`

```
0: common      - Core utilities, constants
1: shop        - E-commerce, catalog, pricing
2: game        - Tamagotchi mechanics, care system
3: auth        - User authentication, hashing
4: payment     - Stripe integration (external wrapper)
5: worker      - Backend API (external - to be abstracted)
6: testing     - Test framework, assertions
7: breeding    - Genetics calculator (external - to be abstracted)
8: smri        - Test runner system
9: tutorial    - Interactive tutorial system
```

### External Modules (S10+)
Services that need abstraction layer:
- **Pattern:** Internal facade wrapping external API
- **Examples:** 
  - M5 (Worker/KV) - Currently `worker/worker.js`, move to `src/modules/worker/`
  - S7 (Breeding) - Currently inline, abstract to `src/modules/breeding/`
  - Future: 10 (Email), 11 (Analytics), etc.

### Module Lifecycle

**When Creating S0-S9 Scenario:**
1. Module already exists
2. Add scenario to `src/config/smri/scenarios.js`
3. Create `.smri/scenarios/S{M}.*.md`
4. Update module if needed

**When Creating S10+ Scenario:**
1. **First:** Create abstraction module in `src/modules/{name}/`
2. Create `index.js` facade with `ENABLED` flag
3. Add to `src/config/smri/module-functions.js`
4. Document in `src/PUBLIC-API.md`
5. **Then:** Add scenario like S0-S9

**Example: Abstracting Worker (M5)**
```
Current:  worker/worker.js (2077 lines, monolithic)
Future:   src/modules/worker/
          ├── index.js          # Facade
          ├── kv-manager.js     # KV operations
          ├── webhook-handler.js # Stripe webhooks
          └── api-router.js     # Route handling
```

### Module Rules

1. **Facade Pattern:** Every module has `index.js` with clean exports
2. **Enable/Disable:** Each has `export const ENABLED = true`
3. **Self-Contained:** Minimal dependencies between modules
4. **Documentation:** Function catalog + README
5. **S10+ Must Abstract:** External services get internal wrapper

---
