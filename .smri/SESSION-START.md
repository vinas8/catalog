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
- **Read context log instead of full briefing**
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

## 🎯 Smart Session Start

```javascript
// Pseudo-code for AI agent
if (user_runs_smri) {
  const latestContext = findMostRecentContext('.smri/logs/');
  const age = Date.now() - latestContext.timestamp;
  
  if (age < 24_HOURS && latestContext.exists) {
    // Quick load from context
    loadContext(latestContext);
    console.log(`📍 Loaded session from ${latestContext.date}`);
    console.log(`   Focus: ${latestContext.focus}`);
    console.log(`   Commits: ${latestContext.commits.length}`);
    console.log('\nContinue where we left off or new task?');
  } else {
    // Full briefing
    runFullSmriBriefing();
  }
}
```

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
