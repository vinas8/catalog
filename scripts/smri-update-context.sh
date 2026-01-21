#!/bin/bash
# SMRI Update Context - Regenerate .smri/context/ cache
# Called by smri-startup.sh when context is stale or missing

set -e

PROJECT_ROOT="/root/catalog"
cd "$PROJECT_ROOT"

CONTEXT_DIR=".smri/context"
mkdir -p "$CONTEXT_DIR"

echo "🔄 Updating .smri/context cache..."
echo ""

# ============================================
# 1. Git Information
# ============================================
echo "  📝 Git log..."
git log --oneline -20 > "$CONTEXT_DIR/git-log.txt" 2>/dev/null || echo "No git history" > "$CONTEXT_DIR/git-log.txt"
LAST_COMMIT=$(git log -1 --format="%H" 2>/dev/null || echo "unknown")
LAST_COMMIT_SHORT=$(git log -1 --format="%h" 2>/dev/null || echo "unknown")

# ============================================
# 2. Directory Structure
# ============================================
echo "  📁 Directory tree..."
if command -v tree >/dev/null 2>&1; then
    tree -L 2 -I 'node_modules|venv|__pycache__|.git' --dirsfirst > "$CONTEXT_DIR/tree.txt" 2>/dev/null || echo "Tree unavailable" > "$CONTEXT_DIR/tree.txt"
else
    ls -la > "$CONTEXT_DIR/tree.txt"
fi

# ============================================
# 3. Core Documentation
# ============================================
echo "  📖 Documentation files..."
if [ -f ".smri/docs/INDEX.md" ]; then
    cp ".smri/docs/INDEX.md" "$CONTEXT_DIR/INDEX.md"
else
    echo "INDEX.md not found" > "$CONTEXT_DIR/INDEX.md"
fi

if [ -f "README.md" ]; then
    cp "README.md" "$CONTEXT_DIR/README.md"
else
    echo "README.md not found" > "$CONTEXT_DIR/README.md"
fi

if [ -f "src/SMRI.md" ]; then
    cp "src/SMRI.md" "$CONTEXT_DIR/SMRI.md"
else
    echo "SMRI.md not found" > "$CONTEXT_DIR/SMRI.md"
fi

# ============================================
# 4. Module & Component Lists
# ============================================
echo "  📦 Modules & components..."
if [ -d "src/modules" ]; then
    ls -d src/modules/*/ 2>/dev/null | xargs -n 1 basename > "$CONTEXT_DIR/modules.txt" || echo "No modules" > "$CONTEXT_DIR/modules.txt"
else
    echo "No modules directory" > "$CONTEXT_DIR/modules.txt"
fi

if [ -d "src/components" ]; then
    ls src/components/*.js 2>/dev/null | xargs -n 1 basename > "$CONTEXT_DIR/components.txt" || echo "No components" > "$CONTEXT_DIR/components.txt"
else
    echo "No components directory" > "$CONTEXT_DIR/components.txt"
fi

# ============================================
# 5. Health Check & Tests
# ============================================
echo "  🏥 Health check..."
if [ -f "package.json" ]; then
    npm run dev:check 2>&1 | tail -30 > "$CONTEXT_DIR/health.txt" || echo "Health check failed" > "$CONTEXT_DIR/health.txt"
else
    echo "No package.json" > "$CONTEXT_DIR/health.txt"
fi

echo "  🧪 Test summary..."
if [ -f "package.json" ]; then
    # Run tests and extract summary
    TEST_OUTPUT=$(npm test 2>&1 || true)
    echo "$TEST_OUTPUT" > "$CONTEXT_DIR/test-full.txt"
    
    # Extract just the summary line
    echo "$TEST_OUTPUT" | grep -E "(passing|failing|tests pass)" | tail -5 > "$CONTEXT_DIR/test-summary.txt" || echo "No test results" > "$CONTEXT_DIR/test-summary.txt"
else
    echo "No tests available" > "$CONTEXT_DIR/test-summary.txt"
fi

# ============================================
# 6. Create Combined Session Context
# ============================================
echo "  📄 Building session.md..."

cat > "$CONTEXT_DIR/session.md" << EOFSESSION
# SMRI Session Context
**Generated:** $(date -u +"%Y-%m-%d %H:%M:%S UTC")  
**Commit:** $LAST_COMMIT_SHORT  
**Version:** $(cat package.json | grep '"version"' | cut -d'"' -f4 2>/dev/null || echo "unknown")

---

## 🔍 Recent Activity

### Git Log (Last 20 commits)
\`\`\`
$(cat "$CONTEXT_DIR/git-log.txt")
\`\`\`

### Git Status
\`\`\`
$(git status --short 2>/dev/null || echo "No changes")
\`\`\`

---

## 📁 Project Structure

\`\`\`
$(head -50 "$CONTEXT_DIR/tree.txt")
... (truncated, see .smri/context/tree.txt for full)
\`\`\`

---

## 📚 Core Documentation

### .smri/INDEX.md ($(wc -l < "$CONTEXT_DIR/INDEX.md" 2>/dev/null || echo "0") lines)
First 100 lines:
\`\`\`markdown
$(head -100 "$CONTEXT_DIR/INDEX.md")
\`\`\`
... (truncated, see .smri/context/INDEX.md for full)

### README.md ($(wc -l < "$CONTEXT_DIR/README.md" 2>/dev/null || echo "0") lines)
First 80 lines:
\`\`\`markdown
$(head -80 "$CONTEXT_DIR/README.md")
\`\`\`
... (truncated, see .smri/context/README.md for full)

### src/SMRI.md ($(wc -l < "$CONTEXT_DIR/SMRI.md" 2>/dev/null || echo "0") lines)
First 50 lines:
\`\`\`markdown
$(head -50 "$CONTEXT_DIR/SMRI.md")
\`\`\`
... (truncated, see .smri/context/SMRI.md for full)

---

## 📦 Modules & Components

### Modules (src/modules/)
\`\`\`
$(cat "$CONTEXT_DIR/modules.txt")
\`\`\`

### Components (src/components/)
\`\`\`
$(cat "$CONTEXT_DIR/components.txt")
\`\`\`

---

## 🏥 Health Status

\`\`\`
$(cat "$CONTEXT_DIR/health.txt")
\`\`\`

---

## 🧪 Test Summary

\`\`\`
$(cat "$CONTEXT_DIR/test-summary.txt")
\`\`\`

---

## 📖 Full Documentation Available

All complete files are cached in \`.smri/context/\`:
- \`INDEX.md\` - Complete SMRI index ($(wc -l < "$CONTEXT_DIR/INDEX.md" 2>/dev/null || echo "0") lines)
- \`README.md\` - Complete project README ($(wc -l < "$CONTEXT_DIR/README.md" 2>/dev/null || echo "0") lines)
- \`SMRI.md\` - Complete SMRI syntax guide ($(wc -l < "$CONTEXT_DIR/SMRI.md" 2>/dev/null || echo "0") lines)
- \`tree.txt\` - Full directory tree
- \`git-log.txt\` - Full git history
- \`health.txt\` - Complete health check output
- \`test-summary.txt\` - Test results summary
- \`test-full.txt\` - Complete test output

To read any file: \`cat .smri/context/{filename}\`

---

**Context cached at:** $(date -u +"%Y-%m-%d %H:%M:%S UTC")  
**To update:** Run \`bash scripts/smri-update-context.sh\`
EOFSESSION

# ============================================
# 7. Update Timestamp
# ============================================
cat > "$CONTEXT_DIR/LAST_UPDATE.txt" << EOFUPDATE
TIMESTAMP=$(date +%s)
DATE=$(date -u +"%Y-%m-%d")
TIME=$(date -u +"%H:%M:%S")
COMMIT=$LAST_COMMIT
COMMIT_SHORT=$LAST_COMMIT_SHORT
VERSION=$(cat package.json | grep '"version"' | cut -d'"' -f4 2>/dev/null || echo "unknown")
USAGE_COUNT=0
EOFUPDATE

echo ""
echo "✅ Context cache updated!"
echo "   Location: .smri/context/"
echo "   Main file: session.md"
echo ""

exit 0
