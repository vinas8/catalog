#!/bin/bash
# Seed Products to Cloudflare KV namespace
# This migrates data/products.json → PRODUCTS KV namespace

set -e

# Load environment variables
source ../.env

echo "🌱 Seeding Products to KV..."
echo "Account ID: ${CLOUDFLARE_ACCOUNT_ID:0:10}..."
echo ""

# Get products from JSON
PRODUCTS_JSON=$(cat ../data/products.json)

# Extract product IDs for index
PRODUCT_IDS=$(echo "$PRODUCTS_JSON" | python3 -c "
import json, sys
products = json.load(sys.stdin)
ids = [p['id'] for p in products]
print(json.dumps(ids))
")

echo "Found $(echo "$PRODUCT_IDS" | python3 -c "import json, sys; print(len(json.load(sys.stdin)))") products"
echo ""

# Get namespace ID for PRODUCTS
echo "🔍 Finding PRODUCTS namespace..."
NAMESPACE_RESPONSE=$(curl -s -X GET \
  "https://api.cloudflare.com/client/v4/accounts/$CLOUDFLARE_ACCOUNT_ID/storage/kv/namespaces" \
  -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN")

PRODUCTS_NAMESPACE_ID=$(echo "$NAMESPACE_RESPONSE" | python3 -c "
import json, sys
data = json.load(sys.stdin)
for ns in data.get('result', []):
    if ns['title'] == 'PRODUCTS':
        print(ns['id'])
        break
")

if [ -z "$PRODUCTS_NAMESPACE_ID" ]; then
  echo "❌ PRODUCTS namespace not found!"
  echo "Creating PRODUCTS namespace..."
  
  CREATE_RESPONSE=$(curl -s -X POST \
    "https://api.cloudflare.com/client/v4/accounts/$CLOUDFLARE_ACCOUNT_ID/storage/kv/namespaces" \
    -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
    -H "Content-Type: application/json" \
    --data '{"title":"PRODUCTS"}')
  
  PRODUCTS_NAMESPACE_ID=$(echo "$CREATE_RESPONSE" | python3 -c "
import json, sys
data = json.load(sys.stdin)
print(data.get('result', {}).get('id', ''))
")
  
  if [ -z "$PRODUCTS_NAMESPACE_ID" ]; then
    echo "❌ Failed to create PRODUCTS namespace"
    exit 1
  fi
  
  echo "✅ Created PRODUCTS namespace: $PRODUCTS_NAMESPACE_ID"
fi

echo "✅ Using PRODUCTS namespace: ${PRODUCTS_NAMESPACE_ID:0:10}..."
echo ""

# Upload each product
echo "$PRODUCTS_JSON" | python3 -c "
import json, sys, os, requests

products = json.load(sys.stdin)
account_id = os.environ['CLOUDFLARE_ACCOUNT_ID']
namespace_id = os.environ['PRODUCTS_NAMESPACE_ID']
token = os.environ['CLOUDFLARE_API_TOKEN']

base_url = f'https://api.cloudflare.com/client/v4/accounts/{account_id}/storage/kv/namespaces/{namespace_id}/values'
headers = {
    'Authorization': f'Bearer {token}',
    'Content-Type': 'application/json'
}

print('📤 Uploading products to KV...')
for product in products:
    key = f\"product:{product['id']}\"
    url = f'{base_url}/{key}'
    
    response = requests.put(url, headers=headers, json=product)
    if response.status_code == 200:
        print(f\"  ✅ {product['id']} - {product['name']}\")
    else:
        print(f\"  ❌ {product['id']} - Failed: {response.text}\")

# Upload index
index_key = '_index:products'
index_url = f'{base_url}/{index_key}'
ids = [p['id'] for p in products]
response = requests.put(index_url, headers=headers, json=ids)
if response.status_code == 200:
    print(f\"\\n  ✅ Product index created ({len(ids)} products)\")
else:
    print(f\"\\n  ❌ Index failed: {response.text}\")
" || echo "❌ Python upload failed"

echo ""
echo "✅ Products seeded to KV!"
echo ""
echo "🔧 Next steps:"
echo "1. Bind PRODUCTS namespace to worker"
echo "2. Deploy updated worker"
echo "3. Test /products endpoint"
