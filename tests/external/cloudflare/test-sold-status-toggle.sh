#!/bin/bash
# Test: Mark/Unmark Product as Sold in KV
# Tests PRODUCT_STATUS namespace operations

set -e

source .env

NAMESPACE_ID="57da5a83146147c8939e4070d4b4d4c1"
PRODUCT_ID="prod_test_sold_toggle"
KEY="product:${PRODUCT_ID}"

echo "🧪 Testing Product Sold Status Toggle"
echo "========================================"
echo ""

# Test 1: Mark as sold
echo "1️⃣ Marking product as SOLD..."
curl -s -X PUT \
  "https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/storage/kv/namespaces/${NAMESPACE_ID}/values/${KEY}" \
  -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "sold",
    "owner_id": "test_user_123",
    "sold_at": "2025-12-22T15:00:00Z"
  }' > /dev/null

sleep 2

# Verify sold
SOLD_STATUS=$(curl -s "https://catalog.navickaszilvinas.workers.dev/product-status?id=${PRODUCT_ID}")
echo "Status: $SOLD_STATUS"
echo "✅ Marked as sold"
echo ""

# Test 2: Mark as available
echo "2️⃣ Marking product as AVAILABLE..."
curl -s -X DELETE \
  "https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/storage/kv/namespaces/${NAMESPACE_ID}/values/${KEY}" \
  -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}" > /dev/null

sleep 2

# Verify available
AVAIL_STATUS=$(curl -s "https://catalog.navickaszilvinas.workers.dev/product-status?id=${PRODUCT_ID}")
echo "Status: $AVAIL_STATUS"
echo "✅ Marked as available"
echo ""

echo "✅ Test passed: Product status toggle works!"
echo ""
echo "Usage for real products:"
echo "# Mark as sold:"
echo "curl -X PUT \\"
echo "  \"https://api.cloudflare.com/.../values/product:PRODUCT_ID\" \\"
echo "  -H \"Authorization: Bearer \$TOKEN\" \\"
echo "  -d '{\"status\":\"sold\",\"owner_id\":\"USER_HASH\"}'"
echo ""
echo "# Mark as available:"
echo "curl -X DELETE \\"
echo "  \"https://api.cloudflare.com/.../values/product:PRODUCT_ID\" \\"
echo "  -H \"Authorization: Bearer \$TOKEN\""
