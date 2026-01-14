#!/bin/bash
# SMRI Startup Script - Smart Context Loading
# Auto-runs when user types .smri
# Uses cached context from .smri/context/ for fast loads

set -e

PROJECT_ROOT="/root/catalog"
cd "$PROJECT_ROOT"

CONTEXT_DIR=".smri/context"
UPDATE_SCRIPT="scripts/smri-update-context.sh"

echo "🐍 Serpent Town - SMRI Startup"
echo "================================"
echo ""

# ============================================
# PHASE 1: Check Context Cache
# ============================================
echo "📋 Phase 1: Checking context cache..."
echo ""

NEED_UPDATE=false

# Check if context directory exists
if [ ! -d "$CONTEXT_DIR" ]; then
    echo "ℹ️  No context cache found"
    NEED_UPDATE=true
# Check if LAST_UPDATE exists
elif [ ! -f "$CONTEXT_DIR/LAST_UPDATE.txt" ]; then
    echo "ℹ️  Context cache incomplete"
    NEED_UPDATE=true
else
    # Check cache age
    source "$CONTEXT_DIR/LAST_UPDATE.txt"
    CURRENT_TIME=$(date +%s)
    CONTEXT_AGE=$(( (CURRENT_TIME - TIMESTAMP) / 3600 ))
    
    if [ "$CONTEXT_AGE" -lt 24 ]; then
        echo "✅ Context cache fresh (${CONTEXT_AGE}h old)"
        echo "   Last update: $DATE $TIME UTC"
        echo "   Commit: $COMMIT_SHORT"
        NEED_UPDATE=false
    else
        echo "⚠️  Context cache stale (${CONTEXT_AGE}h old)"
        NEED_UPDATE=true
    fi
fi

# Update cache if needed
if [ "$NEED_UPDATE" = true ]; then
    echo "   Regenerating context cache..."
    echo ""
    bash "$UPDATE_SCRIPT"
else
    echo "   Using cached context"
fi

echo ""
echo "================================"
echo ""

# ============================================
# PHASE 2: Load Session Context
# ============================================
echo "📄 Phase 2: Loading session context..."
echo ""

# Display the combined session context
cat "$CONTEXT_DIR/session.md"

echo ""
echo "================================"
echo ""

# ============================================
# PHASE 3: Quick Reference
# ============================================
# ============================================
# PHASE 3: Quick Reference
# ============================================
echo "✅ SMRI Startup Complete"
echo "================================"
echo ""
echo "📚 Quick Reference"
echo "================================"
echo ""
echo "🎯 Commands:"
echo "  .smri         - Reload (regenerates if > 24h old)"
echo "  .smri update  - Force regenerate context cache"
echo "  .smri save    - Save session notes to logs/"
echo ""
echo "📐 SMRI Format: S{M}.{RRR}.{II}"
echo "  M   = Module (0-9 internal, 10+ external)"
echo "  RRR = Relations (comma: 1,2,3)"
echo "  II  = Iteration (01-99)"
echo "  Example: S2.0,6.01 = Game module, uses common+testing"
echo ""
echo "🚨 Critical Rules:"
echo "  ❌ NEVER touch: webhook-server.py, upload-server.py"
echo "  ✅ Check first: git log, .smri/logs/YYYY-MM-DD.md"
echo "  ✅ Deploy worker: cd worker && bash cloudflare-deploy.sh"
echo "  ✅ Only facades: Modules import ONLY from index.js"
echo ""
echo "📁 Context Cache:"
echo "  All loaded docs cached in .smri/context/"
echo "  Read full files: cat .smri/context/{INDEX.md,README.md,SMRI.md,etc}"
echo ""
echo "================================"
echo ""
echo "🎯 Ready to work! What should we do?"
echo ""

# Return to allow AI to take over
exit 0
