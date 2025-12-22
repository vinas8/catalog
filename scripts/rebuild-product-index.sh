#!/bin/bash
# Rebuild product index from all product:* keys in KV

source /root/catalog/.env

NAMESPACE_ID="ecbcb79f3df64379863872965f993991"
ACCOUNT_ID="e24c9f59eed424bd6d04e0f10fe0886f"
API_TOKEN="2BKglg-h8Vbs-n7NsjRZzHqDj_cTlwYkx2IoBVWY"

echo "🔍 Scanning KV for all product:* keys..."

# Get all keys
RESPONSE=$(curl -s -X GET "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/storage/kv/namespaces/$NAMESPACE_ID/keys?limit=1000" \
  -H "Authorization: Bearer $API_TOKEN")

# Extract product IDs from keys like "product:prod_xxx"
PRODUCT_IDS=$(echo "$RESPONSE" | grep -o '"name":"product:[^"]*"' | sed 's/"name":"product://g' | sed 's/"//g' | tr '\n' ',' | sed 's/,$//')

if [ -z "$PRODUCT_IDS" ]; then
  echo "❌ No products found in KV!"
  exit 1
fi

# Convert to JSON array
INDEX_JSON="[\"$(echo $PRODUCT_IDS | sed 's/,/","/g')\"]"

echo "📦 Found products: $PRODUCT_IDS"
echo ""
echo "📝 Updating _index:products..."

curl -X PUT "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/storage/kv/namespaces/$NAMESPACE_ID/values/_index:products" \
  -H "Authorization: Bearer $API_TOKEN" \
  -H "Content-Type: application/json" \
  --data "$INDEX_JSON"

echo ""
echo "✅ Product index rebuilt!"
echo ""
echo "Verify: curl 'https://catalog.navickaszilvinas.workers.dev/products'"
