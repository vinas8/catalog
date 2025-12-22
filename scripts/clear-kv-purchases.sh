#!/bin/bash
# Clear purchased snakes from KV using Cloudflare API

source /root/catalog/.env

NAMESPACE_ID="3b88d32c0a0540a8b557c5fb698ff61a"
ACCOUNT_ID="e24c9f59eed424bd6d04e0f10fe0886f"
API_TOKEN="2BKglg-h8Vbs-n7NsjRZzHqDj_cTlwYkx2IoBVWY"

echo "🔍 Listing all keys in USER_PRODUCTS KV namespace..."
echo ""

# List all keys
curl -s -X GET "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/storage/kv/namespaces/$NAMESPACE_ID/keys" \
  -H "Authorization: Bearer $API_TOKEN" \
  -H "Content-Type: application/json" | jq '.'

echo ""
echo "To delete a specific key, run:"
echo "curl -X DELETE 'https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/storage/kv/namespaces/$NAMESPACE_ID/values/KEY_NAME' -H 'Authorization: Bearer $API_TOKEN'"
