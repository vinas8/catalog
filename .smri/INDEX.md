# 🐍 Serpent Town - Index & Rules

**Version:** 0.7.0  
**Last Updated:** 2025-12-28  
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
- Organized by feature: `.smri/scenarios/{feature-name}/`
- Named by ID: `{ID}-{short-name}.md`
- Linked to `/debug` endpoint for testing
- Minimal: Only ONE file per scenario

**Example:**
```
.smri/scenarios/
└── virtual-care-tutorial/
    ├── README.md (overview)
    ├── VCT-1.0-happy-daily.md
    ├── VCT-2.0-missed-care.md
    └── VCT-3.0-commerce.md
```

**NOT:**
```
❌ .smri/scenarios/virtual-care-tutorial/tests/
❌ .smri/scenarios/virtual-care-tutorial/VCT-1.0/setup.md
❌ .smri/scenarios/virtual-care-tutorial/VCT-1.0/test.md
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

## 🎯 SMRI Commands

### `.smri`
Complete project briefing:
1. Display full directory tree
2. Show README.md
3. Load API docs (latest version)
4. Show SMRI index
5. Summarize project status
6. **Check for inconsistencies:**
   - Version mismatches (package.json vs docs)
   - Duplicate documentation
   - Outdated files
   - Redundant code/modules
7. **Suggest refactors** (requires user approval):
   - Remove duplicate code
   - Consolidate similar modules
   - Archive outdated docs
   - Update version references
8. Ask: "Where did we leave off?"

**Note:** All changes require user approval before execution.

### `.smri log`
Update today's session log with:
- Latest prompt (original if <100 lines, else summarized)
- Latest answer (original if <100 lines, else summarized)
- Each entry separated by date/time header
- **Auto-suggest:** "Consolidate this session into .smri/docs/{topic}.md?"

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

## 📊 Current Status (v0.7.0)

### Consolidated Files:
- **103 docs** from `/docs` → Topic docs
- **8 root docs** pending review:
  - CHANGELOG.md ✅ Keep (version history)
  - README.md ✅ Keep (project overview)
  - DEPLOYMENT-STATUS.md ⚠️ Outdated (v0.5.0)
  - DEPLOYMENT-SUCCESS.md ⚠️ Outdated (v0.5.0)
  - CUSTOMER-SYSTEM-IMPLEMENTATION.md ⚠️ Status report (archive)
  - IMPLEMENTATION_COMPLETE.md ⚠️ Status report (archive)
  - STRIPE-SYNC-COMPLETE.md ✅ Keep (v0.7.0 feature)
  - WORK_SUMMARY_2025-12-27.md ✅ Keep (recent work)

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
