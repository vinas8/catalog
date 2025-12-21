#!/bin/bash
# Test Stripe webhook locally

echo "🧪 Testing Stripe Webhook Handler"
echo "=================================="
echo ""

WORKER_URL="https://catalog.navickaszilvinas.workers.dev/stripe-webhook"

# Sample Stripe webhook payload
PAYLOAD=$(cat <<EOF
{
  "type": "checkout.session.completed",
  "data": {
    "object": {
      "id": "cs_test_123",
      "client_reference_id": "test_user_$(date +%s)",
      "payment_intent": "pi_test_123",
      "amount_total": 45000,
      "currency": "usd",
      "metadata": {
        "product_id": "prod_TdKcnyjt5Jk0U2"
      }
    }
  }
}
EOF
)

echo "📤 Sending test webhook to:"
echo "   $WORKER_URL"
echo ""
echo "📦 Payload:"
echo "$PAYLOAD" | jq '.'
echo ""
echo "⏳ Sending request..."
echo ""

RESPONSE=$(curl -s -X POST \
  -H "Content-Type: application/json" \
  -d "$PAYLOAD" \
  "$WORKER_URL")

echo "📥 Response:"
echo "$RESPONSE" | jq '.' || echo "$RESPONSE"
echo ""

if echo "$RESPONSE" | grep -q "success"; then
  echo "✅ Webhook test PASSED!"
else
  echo "❌ Webhook test FAILED!"
  echo ""
  echo "Possible issues:"
  echo "1. Worker not deployed: cd worker && wrangler publish worker.js"
  echo "2. KV namespace not bound correctly"
  echo "3. Missing PRODUCT_STATUS namespace"
  echo "4. Check Cloudflare logs: cd worker && wrangler tail"
fi
