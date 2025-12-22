#!/bin/bash
# Clear test purchase data from KV storage

source /root/catalog/.env

NAMESPACE_ID="3b88d32c0a0540a8b557c5fb698ff61a"
ACCOUNT_ID="e24c9f59eed424bd6d04e0f10fe0886f"
API_TOKEN="2BKglg-h8Vbs-n7NsjRZzHqDj_cTlwYkx2IoBVWY"

echo "🧹 Clearing test user data from KV..."
echo ""

# Delete the test_123 user that was created by curl test
curl -X DELETE "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/storage/kv/namespaces/$NAMESPACE_ID/values/user:test_123" \
  -H "Authorization: Bearer $API_TOKEN"

echo ""
echo "✅ Cleared user:test_123"
echo ""
echo "To verify, run:"
echo "curl 'https://catalog.navickaszilvinas.workers.dev/user-products?user=test_123'"
