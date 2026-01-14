# 🐍 Session Start Instructions

**When user runs `.smri` command, read THIS file first for quick context.**

---

## 🚀 Quick Start Protocol

### 1. Check Last Session (ALWAYS FIRST)
```bash
# Find most recent context log
ls -lt .smri/logs/*.md | head -5

# Read latest context
cat .smri/logs/YYYY-MM-DD-context.md
```

### 2. If Recent Context Exists (< 24 hours)
- **Load context log** (historical snapshot)
- **BUT STILL RUN DYNAMIC CHECKS:**
  ```bash
  git log --oneline -5          # Latest commits
  git status --short            # Uncommitted changes
  npm run dev:check | tail -20  # Quick health
  ```
- **Compare & Alert:**
  - "⚠️ X new commits since context"
  - "⚠️ Uncommitted changes detected"
  - "✅ Health scores unchanged"
- Show summary: "📍 Loaded session from [date] - [focus]"
- Ask: "Continue where we left off or new task?"

### 3. If No Recent Context OR > 24 hours
- **Run full `.smri` briefing:**
  1. Check version (`package.json`)
  2. Load `.smri/INDEX.md` (rules)
  3. Load `README.md` (overview)
  4. Show directory tree
  5. Check git log (last 20 commits)
  6. Ask: "📍 Where did we leave off?"

---

## 📊 Current Project State

**Version:** 0.7.7  
**Tests:** 14/14 passing (100%) ✅  
**Architecture:** 5/5 checks (100%) ✅  
**Module Coverage:** 9/11 (82%)  
**Component Coverage:** 2/7 (29%)  

---

## 🔧 Quick Health Check
```bash
npm run dev:check           # Full project health
npm test                    # Run all tests
git log --oneline -20       # Recent work
npm run smri:list:scenarios # All scenarios
```

---

## 📁 Key Files

**Configuration:**
- `package.json` - npm scripts (lines 6-36)
- `.smri/INDEX.md` - System rules (primary)
- `src/config/smri/scenarios.js` - 20 scenarios

**Documentation:**
- `.smri/logs/YYYY-MM-DD-context.md` - Latest session
- `PROJECT-STATUS.md` - Quick reference
- `scripts/README.md` - Dev tools

**Components:**
- `src/components/` - UI layer (7 components)
- `src/modules/` - Logic layer (11 modules, S0-S9)

---

## 🚨 Critical Rules

### Never Touch
- `webhook-server.py` - Local server (user managed)
- `upload-server.py` - Local server (user managed)

### Always Check
- Git log before debugging
- Session logs for solutions
- `.smri/INDEX.md` for rules

### Architecture
- Modules import ONLY from facades (`index.js`)
- Components CAN import modules
- Modules NEVER import components

---

## 🎯 Smart Session Start (HYBRID APPROACH)

```javascript
// Pseudo-code for AI agent
if (user_runs_smri) {
  const latestContext = findMostRecentContext('.smri/logs/');
  const age = Date.now() - latestContext.timestamp;
  
  if (age < 24_HOURS && latestContext.exists) {
    // Phase 1: Load historical context
    const ctx = loadContext(latestContext);
    console.log(`📍 Loaded session from ${ctx.date} - ${ctx.focus}`);
    
    // Phase 2: ALWAYS run dynamic checks
    const currentGit = runGitLog(5);
    const uncommitted = checkGitStatus();
    const tree = checkDirectoryTree();
    const health = runQuickHealth();
    
    // Phase 3: Compare & alert
    const newCommits = currentGit.length - ctx.commits.length;
    if (newCommits > 0) console.warn(`⚠️ ${newCommits} new commits since context`);
    if (uncommitted.length > 0) console.warn('⚠️ Uncommitted changes detected');
    if (tree.newFiles.length > 0) console.warn(`⚠️ ${tree.newFiles.length} new files/folders`);
    if (health.changed) console.log('⚠️ Health scores changed');
    else console.log('✅ Health unchanged');
    
    console.log('\nContinue where we left off or new task?');
  } else {
    // Full briefing
    runFullSmriBriefing();
  }
}
```

**Key Insight:** Context = historical snapshot, Git/health = current reality. BOTH needed!

---

## 💡 Context Log Format

Each session should end with compressed context log:
```markdown
# Session Context - YYYY-MM-DD
**Version:** X.X.X | **Time:** HH:MM-HH:MM | **Focus:** [main topic]

## 🎯 What We Did
- Key changes
- Decisions made
- Problems solved

## 📊 Current State
- Health scores
- Module status
- Known issues

## 🎯 Next Steps
- Recommended actions
- Unfinished work
- Technical debt

## 📁 Important Files
- Key files modified
- Where to look next

## 📋 Commits
- List of commits made
```

---

## 🔄 End of Session Workflow

**Before ending session:**
1. Create context log: `.smri/logs/YYYY-MM-DD-context.md`
2. Commit all work
3. Run `npm run dev:check` (final health check)
4. Update this file if process changes

**Context log should include:**
- What was accomplished
- Current health scores
- Important file references (with line numbers!)
- Next recommended actions
- Commits made (with hashes)

---

## 📚 Resources

**Full Documentation:**
- `.smri/INDEX.md` - Complete SMRI system (891 lines)
- `.smri/docs/` - Topic-specific docs
- `src/components/README.md` - UI architecture
- `src/modules/README.md` - Business logic architecture

**Quick Commands:**
```bash
npm run dev:check          # Project health
npm run smri:coverage      # Module coverage
npm run smri:dead          # Dead methods
npm run smri:list:components # Component usage
git log --oneline -20      # Recent work
```

---

**Last Updated:** 2026-01-13  
**Purpose:** Speed up AI agent session starts by loading context instead of full briefing  
**Benefit:** Saves tokens, faster onboarding, maintains continuity

**Next agent: Check `.smri/logs/` for latest context first!** 🚀

---

## 🔄 Context vs Dynamic Checks

### What Context Log Provides (Historical)
- ✅ What was done last session
- ✅ Decisions made and why
- ✅ File references with line numbers
- ✅ Commit hashes at time of save
- ✅ Health scores at time of save
- ✅ Known issues and next steps

### What Dynamic Checks Provide (Current)
- ✅ Latest git log (new commits?)
- ✅ Git status (uncommitted changes?)
- ✅ Current health scores (changed?)
- ✅ Test results (still passing?)
- ✅ Architecture validation (violations?)
- ✅ Directory tree (new files/folders?)

### Why Both Are Needed
```
Context Log     → "Here's what we accomplished"
Dynamic Checks  → "Here's current reality"
Combined        → "Continue from X, but Y changed"
```

**Example Output:**
```
📍 Loaded session from 2026-01-13 - Dev Tools + UI
   Last commit: 0421734 (Session context system)
   
⚠️ 3 new commits since context:
   - abc1234 feat: New feature added
   - def5678 fix: Bug fix
   - ghi9012 docs: Updated docs
   
✅ No uncommitted changes
✅ Health scores unchanged (Tests 100%, Architecture 100%)

Continue where we left off or new task?
```

---

## 📋 Checklist for AI Agent

**When user types `.smri`:**

- [ ] 1. Check for recent context log
- [ ] 2. If found < 24hr:
  - [ ] Load context (historical)
  - [ ] Run `git log --oneline -5`
  - [ ] Run `git status --short`
  - [ ] Run `tree -L 2 -I 'node_modules'`
  - [ ] Run `npm run dev:check | tail -20`
  - [ ] Compare current vs context
  - [ ] Alert on differences
- [ ] 3. If not found or > 24hr:
  - [ ] Run full `.smri` briefing
  - [ ] Load INDEX.md, README.md
  - [ ] Show directory tree
  - [ ] Check git log (20 commits)

**Never skip git/health checks - they show current reality!**
