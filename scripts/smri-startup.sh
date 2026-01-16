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

CURRENT_COMMIT=$(git log -1 --format="%h" 2>/dev/null || echo "unknown")
NEEDS_UPDATE=false

# Check if context directory exists and has any files
if [ -d "$CONTEXT_DIR" ] && [ "$(ls -A $CONTEXT_DIR 2>/dev/null)" ]; then
    echo "✅ Context cache found"
    
    # Load cache metadata
    if [ -f "$CONTEXT_DIR/LAST_UPDATE.txt" ]; then
        source "$CONTEXT_DIR/LAST_UPDATE.txt" 2>/dev/null
        echo "   Last update: ${DATE:-unknown} ${TIME:-unknown} UTC"
        echo "   Commit: ${COMMIT_SHORT:-unknown}"
        
        # Track usage count
        USAGE_COUNT=${USAGE_COUNT:-0}
        USAGE_COUNT=$((USAGE_COUNT + 1))
        
        # Update usage count in cache
        sed -i "s/^USAGE_COUNT=.*/USAGE_COUNT=$USAGE_COUNT/" "$CONTEXT_DIR/LAST_UPDATE.txt" 2>/dev/null || \
            echo "USAGE_COUNT=$USAGE_COUNT" >> "$CONTEXT_DIR/LAST_UPDATE.txt"
        
        # Check if HEAD changed
        if [ "$COMMIT_SHORT" != "$CURRENT_COMMIT" ]; then
            echo "   ⚠️  HEAD changed: $COMMIT_SHORT → $CURRENT_COMMIT"
            echo "   🔄 Auto-updating cache..."
            NEEDS_UPDATE=true
        elif [ "$USAGE_COUNT" -ge 10 ]; then
            echo "   ⚠️  Cache used $USAGE_COUNT times since last update"
            echo "   💡 Consider running: .smri update"
        else
            echo "   📊 Cache usage: $USAGE_COUNT/10 (auto-refresh at 10)"
        fi
    fi
    echo "   Files cached: $(ls -1 $CONTEXT_DIR | wc -l)"
    
    if [ "$NEEDS_UPDATE" = true ]; then
        echo ""
        bash "$UPDATE_SCRIPT"
    else
        echo "   Using cached context"
    fi
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

# Display the combined session context if available
if [ -f "$CONTEXT_DIR/session.md" ]; then
    cat "$CONTEXT_DIR/session.md"
else
    echo "⚠️  session.md not found, showing available files:"
    echo ""
    ls -la "$CONTEXT_DIR/" 2>/dev/null || echo "No files in context cache"
    echo ""
    echo "Note: Run 'bash scripts/smri-update-context.sh' to generate complete context"
fi

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
echo "  .smri check   - Validate structure without full reload"
echo "  .smri diff    - Show changes since last cache"
echo "  .smri save    - Save session notes to logs/"
echo ""
echo "📐 SMRI Format: S{M}.{RRR}.{II}"
echo "  M   = Module (0-9 internal, 10+ external)"
echo "  RRR = Relations (comma: 1,2,3)"
echo "  II  = Iteration (01-99)"
echo "  Example: S2.0,6.01 = Game module, uses common+testing"
echo ""
echo "🚨 CRITICAL RULES (READ EVERY SESSION!):"
echo "================================"
echo ""
echo "❌ NEVER DO:"
echo "  - Touch webhook-server.py or upload-server.py (user manages)"
echo "  - Start/stop/restart any servers or processes"
echo "  - Delete working files without explicit permission"
echo "  - Change production configs without approval"
echo ""
echo "✅ ALWAYS DO FIRST:"
echo "  - Check: git log --oneline -20"
echo "  - Check: .smri/logs/YYYY-MM-DD.md (for previous solutions)"
echo "  - Read relevant .smri/docs/ before big changes"
echo ""
echo "✅ ARCHITECTURE RULES:"
echo "  - Modules import ONLY from index.js (facade pattern)"
echo "  - Components can use full module APIs"
echo "  - Deploy worker: cd worker && bash cloudflare-deploy.sh"
echo "  - Run tests before committing: npm test"
echo ""
echo "📖 For complete rules: cat .smri/context/INDEX.md"
echo ""
echo "================================"
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
