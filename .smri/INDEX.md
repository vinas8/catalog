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
1. **Load SMRI Format Rule:**
   ```
   S{M}.{RRR}.{II}
   - S = Scenario prefix
   - M = Primary module or submodule (e.g., 2-7 = Game Tutorial)
   - RRR = Relations (comma-separated)
   - II = Iteration (01-99)
   
   Separators:
   - DOT (.) = Separates parts
   - COMMA (,) = Separates modules in relations
   - DASH (-) = Indicates submodule (2-7, 5-1, etc.)
   
   Examples:
   - S2.7,5,5-1.01 = Game with Tutorial, Worker, KV (iteration 01)
   - S1.1,2,3,4,5.01 = Shop with full purchase flow
   - S0.0,1,2,3,4,5.01 = Health check across all modules
   ```
2. Check version (`package.json`)
3. Load `.smri/INDEX.md` (navigation + rules)
4. Load `README.md` (project overview)
5. Load `src/SMRI.md` (quick reference)
6. **Show deep directory tree** (4 levels with file sizes)
7. **Analyze file sizes** (find files >400 lines)
8. Check for inconsistencies:
   - Version mismatches (package.json vs docs)
   - Duplicate documentation
   - Outdated files
   - Redundant code/modules
   - **Large files needing split**
8. **Suggest refactors** (requires user approval):
   - Remove duplicate code
   - Consolidate similar modules
   - Archive outdated docs
   - Update version references
   - **Split large files**
9. Ask: "📍 Where did we leave off?"

**Note:** All changes require user approval before execution.

### `.smri log`
Update today's session log with:
- Latest prompt (original if <100 lines, else summarized)
- Latest answer (original if <100 lines, else summarized)
- Each entry separated by date/time header
- **Auto-suggest:** "Consolidate this session into .smri/docs/{topic}.md?"

### `.smri list`
List all SMRI scenarios with status:
1. **Execute:** `bash scripts/smri-list.sh` (instant)
2. **Display format:**
   ```
   📊 SMRI Scenarios (v0.7.7)
   
   Total: 63 | ✅ 3 (4%) | ⏳ 6 (9%) | 📝 6
   Files: 14 scenario docs in .smri/scenarios/
   
   🔴 Unfinished (⏳):
   • S0.2.01 - Game Mechanics Check
   • S0.3.01 - Auth Validation
   • S0.4.01 - Stripe Integration
   
   🎯 Next: Complete S0 health checks (3/11 done)
   ```
3. **Source:** `debug/smri-scenarios.js` (canonical)
4. **Fast:** <1 second, grep-based, no parsing

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
1. Run complete briefing (tree, README, docs, status)
2. Show consolidated documentation
3. **Analyze for issues:**
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

### When User Types `.smri list`:
1. **Execute script and show output directly:**
   ```bash
   bash scripts/smri-list.sh
   ```
2. **Display the complete output** (no summary, no extra text)
3. **Just show what the script returns** - nothing else

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
