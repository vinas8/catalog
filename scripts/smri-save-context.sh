#!/bin/bash
# SMRI Save Context - Compress session and prepare for next load
# Usage: bash scripts/smri-save-context.sh

set -e

PROJECT_ROOT="/root/catalog"
cd "$PROJECT_ROOT"

DATE=$(date +%Y-%m-%d)
TIME=$(date +%H:%M:%S)
TIMESTAMP=$(date +%s)
CONTEXT_FILE=".smri/logs/${DATE}-context.md"
FLAG_FILE=".smri/CONTEXT-READY"

echo "💾 SMRI Save Context"
echo "================================"
echo ""

# ============================================
# PHASE 1: Get Current State
# ============================================
echo "📊 Phase 1: Collecting Current State..."
echo ""

LAST_COMMIT=$(git log -1 --format="%H" 2>/dev/null || echo "unknown")
LAST_COMMIT_SHORT=$(git log -1 --format="%h" 2>/dev/null || echo "unknown")
LAST_COMMIT_MSG=$(git log -1 --format="%s" 2>/dev/null || echo "unknown")
GIT_STATUS=$(git status --short 2>/dev/null || echo "")
VERSION=$(cat package.json | grep '"version"' | cut -d'"' -f4 || echo "unknown")

echo "  Version: $VERSION"
echo "  Last commit: $LAST_COMMIT_SHORT - $LAST_COMMIT_MSG"
echo "  Uncommitted: $(echo "$GIT_STATUS" | wc -l) files"
echo ""

# ============================================
# PHASE 2: Check What to Include
# ============================================
echo "📋 Phase 2: What should be in context?"
echo ""

# Prompt user for session focus
read -p "  Session focus (e.g., 'Dev Tools + UI'): " SESSION_FOCUS
if [ -z "$SESSION_FOCUS" ]; then
    SESSION_FOCUS="General development"
fi

echo ""
echo "  Focus: $SESSION_FOCUS"
echo ""

# ============================================
# PHASE 3: Create Context File
# ============================================
echo "📝 Phase 3: Creating Context File..."
echo ""

cat > "$CONTEXT_FILE" << EOFCONTEXT
# Session Context - $DATE
**Version:** $VERSION | **Time:** $(date +%H:%M) UTC | **Focus:** $SESSION_FOCUS

---

## 🎯 What We Did

[AI will fill this in - describe accomplishments]

---

## 📊 Current State

### Project Health
- **Tests:** [AI fill] ✅
- **Architecture:** [AI fill] ✅
- **Consistency:** [AI fill]
- **Module Coverage:** [AI fill]

### Git Status
- **Last Commit:** $LAST_COMMIT_SHORT - $LAST_COMMIT_MSG
- **Uncommitted:** $(echo "$GIT_STATUS" | wc -l | xargs) files

### Module Map (S0-S9)
\`\`\`
S0: common    - Core utilities, snake avatar, constants
S1: shop      - E-commerce, catalog, economy
S2: game      - Tamagotchi mechanics, care system
S3: auth      - User authentication, password hashing
S4: payment   - Stripe integration (external)
S5: worker    - Backend API (external, needs abstraction)
S6: testing   - Test framework, assertions
S7: breeding  - Genetics calculator (external, untested)
S8: smri      - SMRI test runner
S9: tutorial  - Interactive tutorial (untested)
\`\`\`

---

## 🔧 Key Scripts

\`\`\`bash
npm run dev:check          # Full health check
npm run smri:coverage      # Module coverage
npm run smri:dead          # Dead methods
npm run smri:list:components # Component usage
\`\`\`

---

## 🚨 Critical Rules

**Never Touch:** webhook-server.py, upload-server.py  
**Always Check:** Git log, session logs, .smri/INDEX.md  
**Facade Pattern:** Modules import ONLY from index.js

---

## 📁 Important Files

- package.json (lines 6-36) - npm scripts
- .smri/INDEX.md - System rules
- src/config/smri/scenarios.js - 20 scenarios
- scripts/ - Dev tools

---

## 🎯 Next Steps

[AI will fill in - what to work on next]

---

**Created:** $DATE $TIME UTC  
**Commit:** $LAST_COMMIT_SHORT  
**Status:** Ready for next session

EOFCONTEXT

echo "  ✅ Created: $CONTEXT_FILE"
echo ""

# ============================================
# PHASE 4: Create Flag File
# ============================================
echo "🚩 Phase 4: Creating CONTEXT-READY Flag..."
echo ""

cat > "$FLAG_FILE" << EOFFLAG
# SMRI Context Ready Flag
# This file indicates optimized context is available

DATE=$DATE
TIME=$TIME
TIMESTAMP=$TIMESTAMP
LAST_COMMIT=$LAST_COMMIT
CONTEXT_FILE=$CONTEXT_FILE
VERSION=$VERSION
SESSION_FOCUS=$SESSION_FOCUS

# When .smri runs, it will check for this file
# If found: Load optimized context (fast)
# If missing: Run full briefing (slow)
EOFFLAG

echo "  ✅ Created: $FLAG_FILE"
echo ""

# ============================================
# PHASE 5: Summary
# ============================================
echo "================================"
echo "✅ Context Saved Successfully!"
echo "================================"
echo ""
echo "📦 What was created:"
echo "  - $CONTEXT_FILE (context log)"
echo "  - $FLAG_FILE (ready flag)"
echo ""
echo "🎯 Next session:"
echo "  Run: .smri"
echo "  Will: Load context automatically (fast!)"
echo ""
echo "⚠️  Note: Context is a TEMPLATE"
echo "  AI should fill in:"
echo "  - What was accomplished"
echo "  - Current health scores"
echo "  - Next steps"
echo ""
echo "💡 Tip: Edit $CONTEXT_FILE now to add details"
echo ""

exit 0
