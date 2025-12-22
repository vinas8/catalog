#!/bin/bash
# Test complete purchase flow: Webhook → KV → Worker API

source ../.env

TEST_USER="purchase_test_$(date +%s)"
TEST_PRODUCT="prod_TdKcnyjt5Jk0U2"

echo "🛒 Testing Full Purchase Flow"
echo "=============================="
echo ""
echo "User: $TEST_USER"
echo "Product: $TEST_PRODUCT"
echo ""

# Step 1: Simulate Stripe webhook
echo "1️⃣ Simulating Stripe webhook..."
WEBHOOK_PAYLOAD=$(cat <<JSON
{
  "type": "checkout.session.completed",
  "data": {
    "object": {
      "id": "cs_test_${TEST_USER}",
      "client_reference_id": "$TEST_USER",
      "payment_intent": "pi_test_${TEST_USER}",
      "amount_total": 100000,
      "currency": "usd",
      "metadata": {
        "product_id": "$TEST_PRODUCT"
      }
    }
  }
}
JSON
)

WEBHOOK_RESPONSE=$(curl -s -X POST \
  "https://catalog.navickaszilvinas.workers.dev/stripe-webhook" \
  -H "Content-Type: application/json" \
  --data "$WEBHOOK_PAYLOAD")

echo "Webhook response:"
echo "$WEBHOOK_RESPONSE" | python3 -m json.tool
echo ""

# Step 2: Check KV directly
echo "2️⃣ Checking USER_PRODUCTS KV..."
sleep 2

KV_DATA=$(curl -s \
  "https://api.cloudflare.com/client/v4/accounts/$CLOUDFLARE_ACCOUNT_ID/storage/kv/namespaces/3b88d32c0a0540a8b557c5fb698ff61a/values/user:$TEST_USER" \
  -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN")

echo "KV data:"
echo "$KV_DATA" | python3 -m json.tool 2>/dev/null || echo "$KV_DATA"
echo ""

# Step 3: Check via Worker API
echo "3️⃣ Checking via Worker API..."
WORKER_DATA=$(curl -s "https://catalog.navickaszilvinas.workers.dev/user-products?user=$TEST_USER")

echo "Worker API response:"
echo "$WORKER_DATA" | python3 -m json.tool 2>/dev/null || echo "$WORKER_DATA"
echo ""

# Step 4: Check PRODUCT_STATUS KV
echo "4️⃣ Checking PRODUCT_STATUS KV..."
PRODUCT_STATUS=$(curl -s \
  "https://api.cloudflare.com/client/v4/accounts/$CLOUDFLARE_ACCOUNT_ID/storage/kv/namespaces/57da5a83146147c8939e4070d4b4d4c1/values/product:$TEST_PRODUCT" \
  -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN")

echo "Product status:"
echo "$PRODUCT_STATUS" | python3 -m json.tool 2>/dev/null || echo "$PRODUCT_STATUS"
echo ""

# Verify
echo "✅ VERIFICATION"
echo "==============="
if echo "$WEBHOOK_RESPONSE" | grep -q "success.*true"; then
  echo "✅ Webhook accepted"
else
  echo "❌ Webhook failed"
fi

if [ ! -z "$KV_DATA" ] && [ "$KV_DATA" != "null" ]; then
  echo "✅ Data in KV"
else
  echo "❌ No data in KV"
fi

if echo "$WORKER_DATA" | grep -q "assignment_id"; then
  echo "✅ Worker API returns data"
else
  echo "❌ Worker API returns empty"
fi

if echo "$PRODUCT_STATUS" | grep -q "sold"; then
  echo "✅ Product marked as sold"
else
  echo "❌ Product not marked as sold"
fi
