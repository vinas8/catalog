#!/bin/bash
# Add rule/lesson to SMRI INDEX.md
# Usage: bash scripts/smri-add-rule.sh "category" "rule text"

set -e

CATEGORY="$1"
RULE="$2"

if [ -z "$CATEGORY" ] || [ -z "$RULE" ]; then
  echo "Usage: bash scripts/smri-add-rule.sh \"category\" \"rule text\""
  echo ""
  echo "Categories:"
  echo "  - debugging"
  echo "  - architecture"
  echo "  - git"
  echo "  - testing"
  echo "  - deployment"
  echo "  - security"
  echo ""
  exit 1
fi

INDEX_FILE=".smri/INDEX.md"
TIMESTAMP=$(date -u +"%Y-%m-%d")

# Create backup
cp "$INDEX_FILE" "$INDEX_FILE.backup"

# Find insertion point based on category
case "$CATEGORY" in
  debugging)
    SECTION="### 0. DEBUGGING RULE"
    ;;
  architecture)
    SECTION="## 🏗️ Architecture Rules"
    ;;
  git)
    SECTION="### 3. Use Git to Verify Structure"
    ;;
  testing)
    SECTION="## 🧪 Testing Rules"
    ;;
  deployment)
    SECTION="## 🚀 Deployment Rules"
    ;;
  security)
    SECTION="## 🔒 Security Rules"
    ;;
  *)
    echo "❌ Unknown category: $CATEGORY"
    exit 1
    ;;
esac

echo "📝 Adding rule to SMRI INDEX.md..."
echo "   Category: $CATEGORY"
echo "   Rule: $RULE"
echo ""

# Add to lessons section at end of INDEX.md
cat >> "$INDEX_FILE" << EOF

---

## 📚 Lessons Learned ($TIMESTAMP)

### $CATEGORY
**$RULE**

EOF

echo "✅ Rule added to INDEX.md"
echo "💾 Backup saved: $INDEX_FILE.backup"
echo ""
echo "Next steps:"
echo "  1. Review: cat .smri/INDEX.md | tail -20"
echo "  2. Commit: git add .smri/INDEX.md && git commit -m 'docs: Add $CATEGORY rule'"
echo ""
