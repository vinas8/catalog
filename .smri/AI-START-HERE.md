# 🤖 AI AGENT - START HERE!

**When user types `.smri`, follow these instructions EXACTLY.**

---

## 📋 Step-by-Step Protocol

### STEP 1: Read This File
✅ You're here! Good start.

### STEP 2: Check for Recent Context
```bash
# Find most recent context log
ls -lt .smri/logs/*context.md | head -1
```

**Look for:** `.smri/logs/YYYY-MM-DD-context.md`

---

### STEP 3A: If Recent Context Found (< 24 hours old)

**DO THIS (Hybrid Approach):**

#### Part 1: Load Historical Context
```bash
cat .smri/logs/2026-01-13-context.md
```

**This gives you:**
- What was done last session
- Decisions made
- File references (with line numbers!)
- Commit hashes (at time of save)
- Health scores (at time of save)
- Known issues

#### Part 2: Run Dynamic Checks (ALWAYS!)
```bash
# Current git status
git log --oneline -5
git status --short

# Current directory structure  
tree -L 2 -I 'node_modules'

# Current health scores
npm run dev:check 2>&1 | tail -20
```

#### Part 3: Compare & Alert
```javascript
// Compare current vs context
const newCommits = currentGitLog.length - contextCommits.length;
const newFiles = detectNewFiles(currentTree, contextTree);
const healthChanged = currentHealth !== contextHealth;

// Show alerts
if (newCommits > 0) show(`⚠️ ${newCommits} new commits since context`);
if (uncommitted.length > 0) show('⚠️ Uncommitted changes detected');
if (newFiles.length > 0) show(`⚠️ ${newFiles.length} new files/folders`);
if (healthChanged) show('⚠️ Health scores changed');
else show('✅ Health unchanged');
```

#### Part 4: Present Summary
```
📍 Loaded session from 2026-01-13 - Dev Tools + UI Architecture

🔍 Current state:
⚠️ 3 new commits since context
✅ No uncommitted changes  
✅ No new files/folders
✅ Health unchanged (Tests 100%, Architecture 100%)

📋 Last session:
- Enhanced architecture checks (SMRI modularity)
- Solved components vs modules (no S10+ needed)
- Created session context system

Continue where we left off or new task?
```

---

### STEP 3B: If NO Recent Context (or > 24 hours old)

**DO THIS (Full Briefing):**

```bash
# 1. Check version
cat package.json | grep '"version"'

# 2. Load system rules
cat .smri/INDEX.md

# 3. Load project overview  
cat README.md

# 4. Show directory structure
tree -L 2 -I 'node_modules'

# 5. Check git history
git log --oneline -20

# 6. Check for session logs
ls -lt .smri/logs/*.md | head -5

# 7. Run health check
npm run dev:check

# 8. Ask user
echo "📍 Where did we leave off?"
```

---

## 🎯 Quick Decision Tree

```
User types: .smri
    ↓
Check: .smri/logs/*context.md exists?
    ↓
   YES → Age < 24hr?
    ↓
   YES → HYBRID APPROACH (3A)
         - Load context
         - Run dynamic checks
         - Compare & alert
    ↓
    NO → FULL BRIEFING (3B)
         - Load all docs
         - Show tree
         - Check git
```

---

## 🚨 Critical Rules (NEVER SKIP)

### Always Run These (Even with Context)
- ✅ `git log --oneline -5` (current commits)
- ✅ `git status --short` (uncommitted changes)
- ✅ `tree -L 2` (directory structure)
- ✅ `npm run dev:check | tail -20` (health)

### Never Touch These
- ❌ `webhook-server.py` (local server)
- ❌ `upload-server.py` (local server)

### Always Check Before Debugging
- 🔍 Git log (solutions might be there)
- 🔍 Session logs (previous attempts)
- 🔍 .smri/INDEX.md (rules & architecture)

---

## 📁 File Locations

**Primary Instructions:**
- `.smri/AI-START-HERE.md` ← YOU ARE HERE
- `.smri/SESSION-START.md` (detailed protocol)

**Context Logs:**
- `.smri/logs/YYYY-MM-DD-context.md` (compressed session)
- `.smri/logs/YYYY-MM-DD-final-summary.md` (quick summary)

**System Docs:**
- `.smri/INDEX.md` (891 lines - full rules)
- `README.md` (project overview)
- `PROJECT-STATUS.md` (quick reference)

**Dev Tools:**
- `scripts/README.md` (all npm commands)
- `package.json` (lines 6-36 for npm scripts)

---

## 💡 Example: Perfect Start

```bash
# User types: .smri

# AI does:
1. cat .smri/logs/2026-01-13-context.md     # Load history
2. git log --oneline -5                      # Check current
3. git status --short                        # Check uncommitted
4. tree -L 2 -I 'node_modules'               # Check structure
5. npm run dev:check | tail -20              # Check health

# AI shows:
📍 Loaded from 2026-01-13 - Dev Tools
⚠️ 2 new commits detected
✅ No uncommitted changes
✅ Structure unchanged
✅ Health: 100%/100%

Continue where we left off?
```

---

## 🎓 Why This Approach?

**Benefits:**
- ⚡ Fast context load (saves tokens)
- 🔄 Current reality checks (no surprises)
- 📊 Compare changes (know what happened)
- 🎯 Maintain continuity (pick up where left off)

**Context alone is NOT enough** - it's a snapshot.  
**Dynamic checks are ESSENTIAL** - they show current reality.  
**Together = Perfect!** 🚀

---

**Last Updated:** 2026-01-14  
**Purpose:** Crystal clear instructions for AI agents  
**Next AI:** Start here when user types `.smri`!
