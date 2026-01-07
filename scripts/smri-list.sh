#!/bin/bash
# Fast SMRI scenario status list
# Usage: bash scripts/smri-list.sh

SCENARIOS_FILE="debug/smri-scenarios.js"
SCENARIOS_DIR=".smri/scenarios"

# Count scenarios
TOTAL=$(grep -c 'smri:' "$SCENARIOS_FILE")
COMPLETE=$(grep -c "status: '✅'" "$SCENARIOS_FILE")
PENDING=$(grep -c "status: '⏳'" "$SCENARIOS_FILE")
PLANNED=$(grep -c "status: '📝'" "$SCENARIOS_FILE")
FILES=$(ls -1 "$SCENARIOS_DIR"/*.md 2>/dev/null | wc -l)

# Calculate percentages
COMPLETE_PCT=$((COMPLETE * 100 / TOTAL))
PENDING_PCT=$((PENDING * 100 / TOTAL))

echo "📊 SMRI Scenarios (v0.7.7)"
echo ""
echo "Total: $TOTAL | ✅ $COMPLETE ($COMPLETE_PCT%) | ⏳ $PENDING ($PENDING_PCT%) | 📝 $PLANNED"
echo "Files: $FILES scenario docs in .smri/scenarios/"
echo ""
echo "🔴 Unfinished (⏳):"

# Extract pending scenarios (simpler approach)
awk '
  /smri:/ { smri = $0; gsub(/.*smri: ./, "", smri); gsub(/.,.*/, "", smri) }
  /title:/ { title = $0; gsub(/.*title: ./, "", title); gsub(/.,.*/, "", title); gsub(/^S[0-9]+[^:]*: /, "", title) }
  /status: .⏳./ && smri && title { print "   • " smri " - " substr(title, 1, 40); smri=""; title="" }
' "$SCENARIOS_FILE"

echo ""
echo "🎯 Next: Complete S0 health checks ($COMPLETE/11 done)"
