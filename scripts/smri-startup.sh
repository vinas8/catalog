#!/bin/bash
# SMRI Startup Script - Smart Context Loading
# Auto-runs when user types .smri
# Uses cached context from .smri/context/ if available

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

# Check if context exists and has session.md
if [ -f "$CONTEXT_DIR/session.md" ]; then
    echo "✅ Context cache found"
    if [ -f "$CONTEXT_DIR/LAST_UPDATE.txt" ]; then
        source "$CONTEXT_DIR/LAST_UPDATE.txt"
        echo "   Last update: $DATE $TIME UTC"
        echo "   Commit: $COMMIT_SHORT"
    fi
    echo "   Using cached context"
else
    echo "ℹ️  No context cache found"
    echo "   Generating fresh context..."
    echo ""
    bash "$UPDATE_SCRIPT"
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
echo "  .smri         - Reload (uses cache if exists)"
echo "  .smri update  - Regenerate context cache"
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
echo "  Update cache: bash scripts/smri-update-context.sh"
echo ""
echo "================================"
echo ""
echo "🎯 Ready to work! What should we do?"
echo ""

# Return to allow AI to take over
exit 0
