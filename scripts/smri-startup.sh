#!/bin/bash
# SMRI Startup Script - Complete Session Load
# Auto-runs when user types .smri
# Combines: context check + git + tree + health + briefing

set -e

PROJECT_ROOT="/root/catalog"
cd "$PROJECT_ROOT"

echo "🐍 Serpent Town - SMRI Startup"
echo "================================"
echo ""

# ============================================
# PHASE 1: Check for Recent Context
# ============================================
echo "📋 Phase 1: Checking for recent session context..."
echo ""

CONTEXT_FILE=$(ls -t .smri/logs/*context.md 2>/dev/null | head -1)
CONTEXT_AGE=""
LOAD_MODE="full"

if [ -n "$CONTEXT_FILE" ]; then
    CONTEXT_DATE=$(stat -c %Y "$CONTEXT_FILE" 2>/dev/null || stat -f %m "$CONTEXT_FILE" 2>/dev/null)
    CURRENT_DATE=$(date +%s)
    CONTEXT_AGE=$(( (CURRENT_DATE - CONTEXT_DATE) / 3600 ))
    
    if [ "$CONTEXT_AGE" -lt 24 ]; then
        LOAD_MODE="hybrid"
        echo "✅ Found recent context: $(basename $CONTEXT_FILE)"
        echo "   Age: ${CONTEXT_AGE} hours (< 24 hours)"
        echo "   Mode: HYBRID (context + dynamic checks)"
    else
        echo "⚠️  Found context but > 24 hours old (${CONTEXT_AGE}h)"
        echo "   Mode: FULL briefing"
    fi
else
    echo "ℹ️  No recent context found"
    echo "   Mode: FULL briefing"
fi

echo ""
echo "================================"
echo ""

# ============================================
# PHASE 2: Dynamic Checks (ALWAYS RUN)
# ============================================
echo "📊 Phase 2: Current State Checks"
echo "================================"
echo ""

# Git Log
echo "🔍 Git Log (last 5 commits):"
git log --oneline -5 --color=always 2>/dev/null || echo "  ⚠️  Git not available"
echo ""

# Git Status
echo "🔍 Git Status:"
if git status --short 2>/dev/null | grep -q .; then
    git status --short
    echo ""
else
    echo "  ✅ No uncommitted changes"
    echo ""
fi

# Directory Tree
echo "🔍 Directory Structure:"
if command -v tree >/dev/null 2>&1; then
    tree -L 2 -I 'node_modules' | head -30
    echo "  ... (truncated)"
else
    ls -la | head -20
    echo "  ... (tree not available, showing ls)"
fi
echo ""

# Quick Health Check
echo "🔍 Health Check:"
if [ -f "package.json" ]; then
    echo "  Running quick health check..."
    npm run dev:check 2>&1 | tail -20 || echo "  ⚠️  Health check unavailable"
else
    echo "  ⚠️  package.json not found"
fi
echo ""

echo "================================"
echo ""

# ============================================
# PHASE 3: Load Context or Full Briefing
# ============================================

if [ "$LOAD_MODE" = "hybrid" ]; then
    # HYBRID MODE: Load context + compare
    echo "📍 Phase 3: Loading Session Context"
    echo "================================"
    echo ""
    
    CONTEXT_BASENAME=$(basename $CONTEXT_FILE)
    CONTEXT_DATE=$(echo $CONTEXT_BASENAME | cut -d'-' -f1-3)
    
    echo "📄 Context File: $CONTEXT_BASENAME"
    echo "📅 Saved On: $CONTEXT_DATE"
    echo ""
    cat "$CONTEXT_FILE"
    echo ""
    echo "================================"
    echo ""
    
    # Compare notice
    echo "⚡ Dynamic checks completed above"
    echo "   Compare current state with context to see changes"
    echo ""
    
else
    # FULL MODE: Complete briefing
    echo "📍 Phase 3: Full SMRI Briefing"
    echo "================================"
    echo ""
    
    # Version
    echo "📦 Project Version:"
    cat package.json | grep -A 2 '"version"' || echo "  ⚠️  Version not found"
    echo ""
    
    # SMRI Directory
    echo "📁 .smri Directory:"
    ls -la .smri/ | grep -v "^total" | wc -l | xargs echo "  Files:"
    ls -la .smri/*.md 2>/dev/null | awk '{print "  - " $9}' || echo "  (no files)"
    echo ""
    
    # Load Key Docs
    echo "📖 Loading Documentation..."
    echo ""
    
    if [ -f ".smri/INDEX.md" ]; then
        echo "  ✅ .smri/INDEX.md ($(wc -l < .smri/INDEX.md) lines)"
        echo "     Loading first 50 lines..."
        head -50 .smri/INDEX.md
        echo "     ... (truncated, $(wc -l < .smri/INDEX.md) lines total)"
        echo ""
    fi
    
    if [ -f "README.md" ]; then
        echo "  ✅ README.md ($(wc -l < README.md) lines)"
        echo "     Loading first 50 lines..."
        head -50 README.md
        echo "     ... (truncated)"
        echo ""
    fi
    
    if [ -f "src/SMRI.md" ]; then
        echo "  ✅ src/SMRI.md ($(wc -l < src/SMRI.md) lines)"
        echo ""
    fi
    
    # Module Overview
    echo "📦 Modules:"
    if [ -d "src/modules" ]; then
        ls -d src/modules/*/ 2>/dev/null | wc -l | xargs echo "  Found modules:"
        ls -d src/modules/*/ 2>/dev/null | xargs -n 1 basename | sed 's/^/  - /'
    fi
    echo ""
    
    # Components Overview  
    echo "🎨 Components:"
    if [ -d "src/components" ]; then
        ls src/components/*.js 2>/dev/null | wc -l | xargs echo "  Found components:"
        ls src/components/*.js 2>/dev/null | xargs -n 1 basename | sed 's/^/  - /'
    fi
    echo ""
    
    echo "================================"
    echo ""
fi

# ============================================
# PHASE 4: Summary & Prompt
# ============================================
echo "✅ SMRI Startup Complete"
echo "================================"
echo ""

if [ "$LOAD_MODE" = "hybrid" ]; then
    echo "📍 Loaded from: $(basename $CONTEXT_FILE)"
    echo "   Age: ${CONTEXT_AGE} hours"
    echo "   Dynamic checks: ✅ Complete"
    echo ""
    echo "🎯 Continue where we left off or start new task?"
else
    echo "📍 Full briefing loaded"
    echo "   Version: $(cat package.json | grep '"version"' | cut -d'"' -f4)"
    echo "   Documentation: ✅ Loaded"
    echo "   Project state: ✅ Checked"
    echo ""
    echo "🎯 Where did we leave off?"
fi

echo ""
echo "================================"

# Return to allow AI to take over
exit 0
