# 🐍 SMRI Commands Reference

Quick reference for all `.smri` commands.

---

## 📋 Basic Commands

### `.smri`
**Load project state** (auto-detects mode)

```bash
bash scripts/smri-startup.sh
```

**Behavior:**
- Checks for `.smri/CONTEXT-READY` flag
- If found (< 48h): Loads optimized context (fast! ~5 sec)
- If missing: Runs full briefing (slow, ~30 sec)

**Output:**
- Git status (commits + uncommitted)
- Context or full documentation
- Health checks
- Ready to work!

---

### `.smri save`
**Save current session to context**

```bash
bash scripts/smri-save-context.sh
```

**What it does:**
1. Asks for session focus (e.g., "Dev tools + UI")
2. Creates context template in `.smri/logs/YYYY-MM-DD-context.md`
3. Creates `.smri/CONTEXT-READY` flag
4. Next `.smri` will load fast!

**When to use:**
- End of work session
- Before closing terminal
- After significant changes
- When you want next load to be fast

---

### `.smri full`
**Force full briefing** (ignore context)

```bash
bash scripts/smri-startup.sh full
```

**When to use:**
- Context feels stale
- Want complete refresh
- Troubleshooting
- First time in a while

---

## 🎯 Workflow Examples

### Daily Work Session

```bash
# Morning: Start work
$ .smri                    # Loads saved context (fast!)

# [... work on features ...]

# Evening: End session
$ .smri save               # Save context for tomorrow
Enter focus: "Fixed auth bug, added tests"
```

---

### Fresh Start

```bash
# No saved context
$ .smri                    # Full briefing (slower)

# [... work ...]

# Save for next time
$ .smri save
```

---

### Force Refresh

```bash
# Want complete reload
$ .smri full               # Ignores saved context

# [... verify everything ...]

# Update context
$ .smri save
```

---

## 📊 Context System

### How It Works

```
.smri/CONTEXT-READY (flag file)
  ├── Contains: date, time, commit, context file path
  ├── Checked by: smri-startup.sh
  └── Created by: smri-save-context.sh

If flag exists & < 48h old:
  → Load context (fast)
Else:
  → Full briefing (complete)
```

### Context File

```bash
.smri/logs/YYYY-MM-DD-context.md
```

**Contains:**
- Session focus
- What was accomplished
- Current health scores
- Git status
- Module map
- Critical rules
- Next steps

**AI fills in:**
- Accomplishments
- Decisions made
- Issues found
- Recommendations

---

## 🔧 Advanced

### Check Context Status

```bash
# See if context is ready
$ ls -la .smri/CONTEXT-READY

# View context metadata
$ cat .smri/CONTEXT-READY
```

### Manual Context Edit

```bash
# Edit latest context
$ vim .smri/logs/YYYY-MM-DD-context.md

# Add details:
# - What you worked on
# - Decisions made
# - Issues encountered
# - Next steps
```

### Clear Context

```bash
# Force full briefing next time
$ rm .smri/CONTEXT-READY

# Next .smri will do full briefing
$ .smri
```

---

## 💡 Tips

### Fast Iterations
```bash
$ .smri              # Load context
$ [quick fixes]
$ .smri save         # Update context
```

### Long Break
```bash
# After vacation, clear stale context
$ rm .smri/CONTEXT-READY
$ .smri full         # Fresh start
$ .smri save         # Save new context
```

### Before Important Work
```bash
# Verify everything is current
$ .smri full
$ npm test
$ .smri save
```

---

## 🎓 Context vs Full

| Feature | Context Mode | Full Mode |
|---------|-------------|-----------|
| Speed | ⚡ Fast (~5 sec) | 🐢 Slow (~30 sec) |
| Git checks | ✅ Quick (3 commits) | ✅ Complete (5 commits) |
| Tree | ❌ Skipped | ✅ Shown |
| Health | ❌ Skipped | ✅ Full check |
| Docs | ✅ Context only | ✅ INDEX + README |
| Use when | Daily work | Fresh start |

---

**Last Updated:** 2026-01-14  
**Purpose:** Fast, optimized context loading  
**Flag File:** `.smri/CONTEXT-READY`

🚀 **Smart context = Fast workflow!**
