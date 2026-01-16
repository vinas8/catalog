#!/bin/bash
# SMRI Diff - Show changes since last cache update

set -e

PROJECT_ROOT="/root/catalog"
cd "$PROJECT_ROOT"

CONTEXT_DIR=".smri/context"

echo "🔄 SMRI Changes Since Last Cache"
echo "================================"
echo ""

# Check if cache exists
if [ ! -f "$CONTEXT_DIR/LAST_UPDATE.txt" ]; then
    echo "❌ No cache found. Run .smri first."
    exit 1
fi

# Load cache metadata
source "$CONTEXT_DIR/LAST_UPDATE.txt" 2>/dev/null

CACHED_COMMIT=${COMMIT_SHORT:-unknown}
CURRENT_COMMIT=$(git log -1 --format="%h" 2>/dev/null || echo "unknown")

echo "📌 Cache Info:"
echo "   Cached commit: $CACHED_COMMIT"
echo "   Current commit: $CURRENT_COMMIT"
echo "   Last update: ${DATE:-unknown} ${TIME:-unknown} UTC"
echo "   Usage count: ${USAGE_COUNT:-0}"
echo ""

# ============================================
# 1. Commits Since Cache
# ============================================
if [ "$CACHED_COMMIT" != "unknown" ] && [ "$CURRENT_COMMIT" != "unknown" ]; then
    COMMIT_COUNT=$(git rev-list --count ${CACHED_COMMIT}..${CURRENT_COMMIT} 2>/dev/null || echo "0")
    
    if [ "$COMMIT_COUNT" -gt 0 ]; then
        echo "📝 $COMMIT_COUNT new commits since cache:"
        echo ""
        git log --oneline ${CACHED_COMMIT}..${CURRENT_COMMIT} 2>/dev/null || echo "Unable to show commits"
        echo ""
    else
        echo "✅ No new commits since cache"
        echo ""
    fi
else
    echo "⚠️  Unable to compare commits"
    echo ""
fi

# ============================================
# 2. File Changes
# ============================================
echo "📁 File changes:"
echo ""

UNCOMMITTED=$(git status --short 2>/dev/null | wc -l)
if [ "$UNCOMMITTED" -gt 0 ]; then
    echo "Uncommitted changes ($UNCOMMITTED files):"
    git status --short
else
    echo "✅ No uncommitted changes"
fi

echo ""

# ============================================
# 3. Module Changes
# ============================================
if [ "$COMMIT_COUNT" -gt 0 ] 2>/dev/null; then
    echo "📦 Module changes:"
    echo ""
    git diff --name-only ${CACHED_COMMIT}..${CURRENT_COMMIT} src/modules/ 2>/dev/null | head -10 || echo "No module changes"
    echo ""
fi

# ============================================
# 4. Recommendation
# ============================================
echo "================================"
if [ "$COMMIT_COUNT" -gt 5 ] 2>/dev/null || [ "$UNCOMMITTED" -gt 10 ]; then
    echo "💡 Recommendation: Run .smri update"
elif [ "${USAGE_COUNT:-0}" -ge 8 ]; then
    echo "💡 Recommendation: Consider .smri update (used ${USAGE_COUNT}/10 times)"
else
    echo "✅ Cache is reasonably fresh"
fi
echo ""

exit 0
