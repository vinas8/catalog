#!/bin/bash
# SMRI Structure Validation - Quick check without full reload

set -e

PROJECT_ROOT="/root/catalog"
cd "$PROJECT_ROOT"

echo "🔍 SMRI Structure Validation"
echo "================================"
echo ""

ERRORS=0
WARNINGS=0

# ============================================
# 1. Check .smri/ Structure
# ============================================
echo "📁 Checking .smri/ structure..."

# Only INDEX.md should be in root
SMRI_ROOT_FILES=$(ls -A .smri/*.md 2>/dev/null | wc -l)
if [ -f ".smri/INDEX.md" ]; then
    echo "   ✅ INDEX.md exists"
    if [ "$SMRI_ROOT_FILES" -eq 1 ]; then
        echo "   ✅ Only INDEX.md in .smri/ root"
    else
        echo "   ⚠️  Extra files in .smri/ root (should only have INDEX.md)"
        ls -1 .smri/*.md 2>/dev/null | grep -v INDEX.md
        WARNINGS=$((WARNINGS + 1))
    fi
else
    echo "   ❌ INDEX.md missing"
    ERRORS=$((ERRORS + 1))
fi

# Check required directories
for dir in docs logs scenarios context; do
    if [ -d ".smri/$dir" ]; then
        echo "   ✅ .smri/$dir/ exists"
    else
        echo "   ⚠️  .smri/$dir/ missing"
        WARNINGS=$((WARNINGS + 1))
    fi
done

echo ""

# ============================================
# 2. Check Module Structure
# ============================================
echo "📦 Checking module structure..."

if [ -d "src/modules" ]; then
    for module_dir in src/modules/*/; do
        module_name=$(basename "$module_dir")
        if [ -f "${module_dir}index.js" ]; then
            echo "   ✅ $module_name has index.js"
        else
            echo "   ❌ $module_name missing index.js"
            ERRORS=$((ERRORS + 1))
        fi
    done
else
    echo "   ❌ src/modules/ not found"
    ERRORS=$((ERRORS + 1))
fi

echo ""

# ============================================
# 3. Check for Duplicates
# ============================================
echo "🔎 Checking for duplicate files..."

# Check for duplicate demo files
DEMO_COUNT=$(find . -name "*demo*.html" -not -path "*/node_modules/*" -not -path "*/.git/*" | wc -l)
if [ "$DEMO_COUNT" -le 3 ]; then
    echo "   ✅ Demo file count reasonable ($DEMO_COUNT)"
else
    echo "   ⚠️  Many demo files found ($DEMO_COUNT):"
    find . -name "*demo*.html" -not -path "*/node_modules/*" -not -path "*/.git/*" | head -10
    WARNINGS=$((WARNINGS + 1))
fi

# Check for duplicate test runners
TEST_RUNNER_COUNT=$(find . -name "*test-runner*.html" -o -name "*smri-runner*.html" | grep -v node_modules | wc -l)
if [ "$TEST_RUNNER_COUNT" -le 2 ]; then
    echo "   ✅ Test runner count reasonable ($TEST_RUNNER_COUNT)"
else
    echo "   ⚠️  Multiple test runners found ($TEST_RUNNER_COUNT):"
    find . -name "*test-runner*.html" -o -name "*smri-runner*.html" | grep -v node_modules
    WARNINGS=$((WARNINGS + 1))
fi

echo ""

# ============================================
# 4. Check Git Status
# ============================================
echo "🔧 Git status..."

UNCOMMITTED=$(git status --short 2>/dev/null | wc -l)
if [ "$UNCOMMITTED" -eq 0 ]; then
    echo "   ✅ Working tree clean"
else
    echo "   ⚠️  $UNCOMMITTED uncommitted changes"
    git status --short | head -10
    WARNINGS=$((WARNINGS + 1))
fi

echo ""

# ============================================
# Summary
# ============================================
echo "================================"
echo "📊 Summary:"
echo "   Errors: $ERRORS"
echo "   Warnings: $WARNINGS"
echo ""

if [ "$ERRORS" -eq 0 ] && [ "$WARNINGS" -eq 0 ]; then
    echo "✅ All checks passed!"
    exit 0
elif [ "$ERRORS" -eq 0 ]; then
    echo "⚠️  Checks passed with warnings"
    exit 0
else
    echo "❌ Checks failed - please fix errors"
    exit 1
fi
