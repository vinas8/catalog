# 🐍 .smri Command - AI Instructions

**When user types `.smri`, run this FIRST.**

---

## 🚀 Quick Start: Run The Script

```bash
bash scripts/smri-startup.sh
```

**That's it!** The script handles everything:
- ✅ Checks for recent context (< 24 hours)
- ✅ Runs git log, git status, tree
- ✅ Runs health checks
- ✅ Loads context (hybrid) OR full briefing (full)
- ✅ Shows comparison of current vs saved state

---

## 📋 What The Script Does

### Phase 1: Check for Context
```bash
# Looks for: .smri/logs/*context.md
# If found & < 24hr → HYBRID mode
# If not found or > 24hr → FULL mode
```

### Phase 2: Dynamic Checks (ALWAYS)
```bash
git log --oneline -5          # Latest commits
git status --short            # Uncommitted changes
tree -L 2 -I 'node_modules'   # Directory structure
npm run dev:check | tail -20  # Health scores
```

### Phase 3: Load Content
**HYBRID mode (context exists):**
- Load `.smri/logs/YYYY-MM-DD-context.md`
- Show compressed session history
- Compare with Phase 2 checks

**FULL mode (no context):**
- Load `package.json` (version)
- Load `.smri/INDEX.md` (first 50 lines)
- Load `README.md` (first 50 lines)
- Show modules/components lists
- Show directory structure

### Phase 4: Summary
- Show load mode used
- Show current state
- Prompt user: "Continue or new task?"

---

## 🎯 Example Output

```bash
$ bash scripts/smri-startup.sh

🐍 Serpent Town - SMRI Startup
================================

📋 Phase 1: Checking for recent session context...

✅ Found recent context: 2026-01-13-context.md
   Age: 9 hours (< 24 hours)
   Mode: HYBRID (context + dynamic checks)

================================

📊 Phase 2: Current State Checks
================================

🔍 Git Log (last 5 commits):
c49bca9 docs: Add AI-START-HERE.md
e19c920 fix: Add directory tree check
e74d01c fix: Update SESSION-START
...

🔍 Git Status:
  ✅ No uncommitted changes

🔍 Directory Structure:
/root/catalog
├── .smri/
├── src/
├── scripts/
...

🔍 Health Check:
  Tests: 14/14 (100%) ✅
  Architecture: 5/5 (100%) ✅
  ...

================================

📍 Phase 3: Loading Session Context
================================

# [Full context file contents here]
# Shows:
# - What was done
# - Decisions made  
# - File references
# - Health scores
# - Next steps
# ...

================================

✅ SMRI Startup Complete
================================

📍 Loaded from: 2026-01-13-context.md
   Age: 9 hours
   Dynamic checks: ✅ Complete

🎯 Continue where we left off or start new task?
```

---

## 🔧 For AI Agents

**SIMPLE VERSION:**
```bash
# User types: .smri
# You run:
bash scripts/smri-startup.sh

# Then you:
# - Read all output
# - Show summary to user
# - Ask: "Continue or new task?"
```

**That's it!** No need to manually:
- ❌ Check for context
- ❌ Run git commands
- ❌ Load multiple files
- ❌ Compare states

**The script does everything!**

---

## 📁 Files

**Startup Script:**
- `scripts/smri-startup.sh` (main script)

**Context Logs:**
- `.smri/logs/*context.md` (session history)

**Docs (loaded by script):**
- `.smri/INDEX.md` (system rules)
- `README.md` (project overview)
- `src/SMRI.md` (quick reference)

---

## 🚨 Critical Notes

1. **Always run the script** - Don't skip to INDEX.md
2. **Script handles hybrid vs full** - You don't choose
3. **Dynamic checks always run** - Even with context
4. **Output is complete** - Everything you need is there

---

## 💡 Why This Approach?

**Before (Complex):**
```
AI reads AI-START-HERE.md
→ Check for context manually
→ Run git/tree/health manually
→ Load context or docs manually
→ Compare manually
→ Format output manually
```

**After (Simple):**
```
AI runs: bash scripts/smri-startup.sh
→ Done! Output is ready.
```

**Benefits:**
- ⚡ Faster
- 🎯 Consistent
- 🔒 No steps skipped
- 📊 Complete output
- 🧠 Less mental load

---

**Last Updated:** 2026-01-14  
**Purpose:** Single command to load everything  
**Usage:** `bash scripts/smri-startup.sh`

🚀 **Simple is better!**
