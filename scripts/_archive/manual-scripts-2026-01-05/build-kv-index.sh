#!/bin/bash
# Build product index from existing KV products

ACCOUNT_ID="e24c9f59eed424bd6d04e0f10fe0886f"
API_TOKEN="2BKglg-h8Vbs-n7NsjRZzHqDj_cTlwYkx2IoBVWY"
NAMESPACE_ID="ecbcb79f3df64379863872965f993991"

echo "📋 Building product index from KV..."

# List all keys with product: prefix
KEYS=$(curl -s "https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/storage/kv/namespaces/${NAMESPACE_ID}/keys?prefix=product:" \
  -H "Authorization: Bearer ${API_TOKEN}" | jq -r '.result[].name' | sed 's/product://')

# Count products
COUNT=$(echo "$KEYS" | wc -l)
echo "Found $COUNT products"

# Create JSON array
INDEX=$(echo "$KEYS" | jq -R . | jq -s .)

echo "Creating index: _index:products"
echo "$INDEX" | head -20

# Upload index to KV
curl -X PUT "https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/storage/kv/namespaces/${NAMESPACE_ID}/values/_index:products" \
  -H "Authorization: Bearer ${API_TOKEN}" \
  -H "Content-Type: application/json" \
  -d "$INDEX"

echo ""
echo "✅ Index created with $COUNT products!"
echo "Test: curl https://catalog.navickaszilvinas.workers.dev/products"
