#!/bin/bash
# Test the REAL success page flow

set -e

echo "🧪 Testing Real Success Page Flow"
echo "=================================="
echo ""

WORKER_URL="https://catalog.navickaszilvinas.workers.dev"
TEST_USER="success_test_$(date +%s)"
TEST_PRODUCT="prod_TdKcnyjt5Jk0U2"

echo "1️⃣  Creating test purchase..."
echo "   User: $TEST_USER"
echo ""

# Trigger webhook
WEBHOOK_PAYLOAD=$(cat <<PAYLOAD
{
  "type": "checkout.session.completed",
  "data": {
    "object": {
      "id": "cs_test_${TEST_USER}",
      "client_reference_id": "${TEST_USER}",
      "payment_intent": "pi_${TEST_USER}",
      "amount_total": 100000,
      "currency": "eur",
      "metadata": {
        "product_id": "${TEST_PRODUCT}"
      }
    }
  }
}
PAYLOAD
)

echo "   Sending webhook..."
WEBHOOK_RESPONSE=$(curl -s -X POST "${WORKER_URL}/stripe-webhook" \
  -H "Content-Type: application/json" \
  -d "$WEBHOOK_PAYLOAD")

echo "   Response: $WEBHOOK_RESPONSE"
echo ""

# Wait for KV write
sleep 2

echo "2️⃣  Verifying snake assigned..."
PRODUCTS=$(curl -s "${WORKER_URL}/user-products?user=${TEST_USER}")
PRODUCT_COUNT=$(echo "$PRODUCTS" | python3 -c "import sys, json; data=json.load(sys.stdin); print(len(data) if isinstance(data, list) else len(data.get('products', [])))")

echo "   Products found: $PRODUCT_COUNT"
echo ""

if [ "$PRODUCT_COUNT" -gt 0 ]; then
  echo "✅ SUCCESS! Snake assigned to user"
  echo ""
  echo "3️⃣  Test the real page:"
  echo "   Open: http://localhost:8000/success.html?session_id=cs_test_${TEST_USER}"
  echo ""
  echo "   Expected behavior:"
  echo "   - Page shows loading spinner"
  echo "   - Fetches user hash from session API"
  echo "   - Polls for snake (should find immediately)"
  echo "   - Shows snake card with details"
  echo "   - 'Go to My Farm' button appears"
  echo ""
  echo "4️⃣  Check debug log at bottom of page"
  echo ""
else
  echo "❌ FAILED: No snake assigned"
  exit 1
fi
