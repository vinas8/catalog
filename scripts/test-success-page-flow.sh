#!/bin/bash
# Test the success page flow

source ../.env

# Simulate a real purchase
TEST_USER="success_flow_$(date +%s)"
TEST_PRODUCT="prod_TdKcnyjt5Jk0U2"
SESSION_ID="cs_test_${TEST_USER}"

echo "🎭 Simulating Success Page Flow"
echo "================================"
echo ""
echo "Test User: $TEST_USER"
echo "Product: $TEST_PRODUCT"
echo "Session ID: $SESSION_ID"
echo ""

# Step 1: Trigger webhook
echo "1️⃣ Triggering webhook (simulating Stripe)..."
WEBHOOK_RESPONSE=$(curl -s -X POST \
  "https://catalog.navickaszilvinas.workers.dev/stripe-webhook" \
  -H "Content-Type: application/json" \
  --data "{
    \"type\": \"checkout.session.completed\",
    \"data\": {
      \"object\": {
        \"id\": \"$SESSION_ID\",
        \"client_reference_id\": \"$TEST_USER\",
        \"payment_intent\": \"pi_$TEST_USER\",
        \"amount_total\": 100000,
        \"currency\": \"usd\",
        \"metadata\": {
          \"product_id\": \"$TEST_PRODUCT\"
        }
      }
    }
  }")

echo "$WEBHOOK_RESPONSE" | python3 -m json.tool
echo ""

# Step 2: Wait a bit (simulate page load delay)
echo "2️⃣ Waiting 2 seconds (simulate page load)..."
sleep 2

# Step 3: Check if product appears (what success.html does)
echo "3️⃣ Checking if product assigned (success.html check)..."
PRODUCTS=$(curl -s "https://catalog.navickaszilvinas.workers.dev/user-products?user=$TEST_USER")

echo "Products response:"
echo "$PRODUCTS" | python3 -m json.tool
echo ""

# Verify
if echo "$PRODUCTS" | grep -q "assignment_id"; then
  echo "✅ SUCCESS: Product found immediately!"
  echo ""
  echo "Success.html would redirect to:"
  echo "→ register.html?user_hash=$TEST_USER&session_id=$SESSION_ID"
else
  echo "❌ FAIL: Product not found"
  echo ""
  echo "This explains why success.html is stuck!"
  echo "Possible causes:"
  echo "- Webhook not saving to KV"
  echo "- KV write delay"
  echo "- Worker API not reading KV"
fi
