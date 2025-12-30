#!/bin/bash
# Assign test snakes to a user via Cloudflare Worker API
# Usage: ./assign-snakes-to-user.sh <user_id>

USER_ID="${1:-b2c6456eb79a}"
WORKER_URL="https://catalog.navickaszilvinas.workers.dev"

echo "🐍 Assigning test snakes to user: $USER_ID"
echo "📡 Worker URL: $WORKER_URL"
echo ""

# Array of product IDs to assign
PRODUCT_IDS=(
  "ponmanus_c70e2c9a1fed0c5b"
  "bp_001_albino"
  "bp_002_piebald"
  "bp_003_pastel"
  "cs_001_normal"
  "cs_002_amel"
)

SUCCESS_COUNT=0

for PRODUCT_ID in "${PRODUCT_IDS[@]}"; do
  echo "🔄 Assigning: $PRODUCT_ID"
  
  RESPONSE=$(curl -s -X POST "${WORKER_URL}/assign-product" \
    -H "Content-Type: application/json" \
    -d "{\"user_id\":\"${USER_ID}\",\"product_id\":\"${PRODUCT_ID}\"}")
  
  if echo "$RESPONSE" | grep -qi "success"; then
    SUCCESS_COUNT=$((SUCCESS_COUNT + 1))
    echo "   ✅ Success"
  else
    echo "   ⚠️  $RESPONSE"
  fi
  
  sleep 0.3
done

echo ""
echo "✅ Assigned $SUCCESS_COUNT / ${#PRODUCT_IDS[@]} snakes"
echo ""
echo "🎮 Open: http://localhost:8000/game.html#${USER_ID}"
