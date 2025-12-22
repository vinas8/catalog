#!/bin/bash
# Test writing directly to KV via API

source ../.env

TEST_USER="test_direct_$(date +%s)"
TEST_DATA='[{"assignment_id":"assign_test","user_id":"'$TEST_USER'","product_id":"prod_test","product_type":"real","nickname":"Test Snake","acquired_at":"'$(date -Iseconds)'"}]'

echo "🧪 Testing KV Write"
echo "==================="
echo ""
echo "📝 Writing to USER_PRODUCTS KV..."
echo "Key: user:$TEST_USER"
echo "Data: $TEST_DATA"
echo ""

# Write to KV
RESPONSE=$(curl -s -X PUT \
  "https://api.cloudflare.com/client/v4/accounts/$CLOUDFLARE_ACCOUNT_ID/storage/kv/namespaces/3b88d32c0a0540a8b557c5fb698ff61a/values/user:$TEST_USER" \
  -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
  -H "Content-Type: application/json" \
  --data "$TEST_DATA")

echo "Response: $RESPONSE" | python3 -m json.tool
echo ""

# Read back
echo "📖 Reading back from KV..."
sleep 2

READ_RESPONSE=$(curl -s \
  "https://api.cloudflare.com/client/v4/accounts/$CLOUDFLARE_ACCOUNT_ID/storage/kv/namespaces/3b88d32c0a0540a8b557c5fb698ff61a/values/user:$TEST_USER" \
  -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN")

echo "Data: $READ_RESPONSE" | python3 -m json.tool
echo ""

# Test via worker API
echo "🌐 Testing via Worker API..."
WORKER_RESPONSE=$(curl -s "https://catalog.navickaszilvinas.workers.dev/user-products?user=$TEST_USER")
echo "Worker response: $WORKER_RESPONSE" | python3 -m json.tool
echo ""

if echo "$WORKER_RESPONSE" | grep -q "assignment_id"; then
  echo "✅ KV write/read test PASSED!"
else
  echo "❌ KV write/read test FAILED!"
fi
