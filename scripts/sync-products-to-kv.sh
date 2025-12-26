#!/bin/bash
# Sync products.json to Cloudflare KV (PRODUCTS namespace)
# Usage: bash scripts/sync-products-to-kv.sh

set -e

PRODUCTS_FILE="data/products.json"
NAMESPACE_ID="f17a5b5e2b664baeb1d24f2a8e99e803"  # PRODUCTS namespace ID
ACCOUNT_ID="${CLOUDFLARE_ACCOUNT_ID}"
API_TOKEN="${CLOUDFLARE_API_TOKEN}"

echo "🚀 Syncing products to Cloudflare KV..."
echo "📁 Reading from: $PRODUCTS_FILE"
echo ""

if [ ! -f "$PRODUCTS_FILE" ]; then
  echo "❌ Error: $PRODUCTS_FILE not found!"
  exit 1
fi

if [ -z "$API_TOKEN" ]; then
  echo "⚠️  CLOUDFLARE_API_TOKEN not set!"
  echo "   Loading from .env file..."
  if [ -f .env ]; then
    export $(grep CLOUDFLARE_API_TOKEN .env | xargs)
  fi
fi

if [ -z "$ACCOUNT_ID" ]; then
  echo "⚠️  CLOUDFLARE_ACCOUNT_ID not set!"
  echo "   Loading from .env file..."
  if [ -f .env ]; then
    export $(grep CLOUDFLARE_ACCOUNT_ID .env | xargs)
  fi
fi

# Parse products.json and upload each product
jq -c '.[]' "$PRODUCTS_FILE" | while read product; do
  PRODUCT_ID=$(echo "$product" | jq -r '.id')
  PRODUCT_NAME=$(echo "$product" | jq -r '.name')
  
  echo "📦 Uploading: $PRODUCT_NAME ($PRODUCT_ID)"
  
  # Upload to KV with key format: product:prod_xxx
  curl -s -X PUT \
    "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/storage/kv/namespaces/$NAMESPACE_ID/values/product:$PRODUCT_ID" \
    -H "Authorization: Bearer $API_TOKEN" \
    -H "Content-Type: application/json" \
    --data "$product" > /dev/null
  
  echo "   ✅ Uploaded"
done

# Create index of all product IDs
echo ""
echo "📋 Creating product index..."
PRODUCT_IDS=$(jq -r '[.[].id] | join(",")' "$PRODUCTS_FILE")

curl -s -X PUT \
  "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/storage/kv/namespaces/$NAMESPACE_ID/values/_index:products" \
  -H "Authorization: Bearer $API_TOKEN" \
  -H "Content-Type: text/plain" \
  --data "$PRODUCT_IDS" > /dev/null

echo "✅ Index created"
echo ""
echo "🎉 All products synced to KV!"
echo "   View at: https://dash.cloudflare.com -> Workers & Pages -> KV"
