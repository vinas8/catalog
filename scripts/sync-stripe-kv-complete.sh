#!/bin/bash
# Automated Stripe → KV Product Sync Script
# Updates product catalog with correct name/morph structure

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR/.."

# Source environment
source worker/.env 2>/dev/null || { echo "❌ .env not found"; exit 1; }

echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║                                                               ║"
echo "║   🔄 STRIPE → KV PRODUCT SYNC                                 ║"
echo "║                                                               ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo ""

# Config
KV_NAMESPACE_ID="ecbcb79f3df64379863872965f993991"
SOURCE_FILE="data/products-for-stripe.json"

# Step 1: Clear Stripe
echo "🗑️  STEP 1: Clearing old Stripe products..."
PRODUCT_IDS=$(curl -s "https://api.stripe.com/v1/products?limit=100" \
  -u "$STRIPE_SECRET_KEY:" | grep -o '"id":"prod_[^"]*"' | sed 's/"id":"//;s/"$//' || echo "")

if [ -z "$PRODUCT_IDS" ]; then
  echo "   Already empty"
else
  COUNT=$(echo "$PRODUCT_IDS" | wc -l)
  echo "   Found $COUNT products"
  DELETED=0
  for PRODUCT_ID in $PRODUCT_IDS; do
    curl -s -X DELETE "https://api.stripe.com/v1/products/$PRODUCT_ID" \
      -u "$STRIPE_SECRET_KEY:" > /dev/null && ((DELETED++))
    echo -n "."
  done
  echo ""
  echo "   ✅ Deleted: $DELETED products"
fi

echo ""

# Step 2: Upload to Stripe
echo "📤 STEP 2: Uploading products to Stripe..."
CREATED=0
FAILED=0

jq -c '.products[]' "$SOURCE_FILE" | while read -r product; do
  NAME=$(echo "$product" | jq -r '.name')
  MORPH=$(echo "$product" | jq -r '.morph')
  GENDER=$(echo "$product" | jq -r '.gender')
  YOB=$(echo "$product" | jq -r '.yob')
  SPECIES=$(echo "$product" | jq -r '.species')
  
  RESULT=$(curl -s -X POST "https://api.stripe.com/v1/products" \
    -u "$STRIPE_SECRET_KEY:" \
    -d "name=$NAME" \
    -d "description=$SPECIES | $MORPH | $GENDER | Born $YOB" \
    -d "metadata[nickname]=$NAME" \
    -d "metadata[morph]=$MORPH" \
    -d "metadata[gender]=$GENDER" \
    -d "metadata[yob]=$YOB" \
    -d "metadata[species]=$SPECIES" \
    -d "default_price_data[currency]=eur" \
    -d "default_price_data[unit_amount]=15000")
  
  if echo "$RESULT" | grep -q '"object":"product"'; then
    echo "   ✅ $NAME"
    ((CREATED++))
  else
    echo "   ❌ $NAME (failed)"
    ((FAILED++))
  fi
done

echo "   Created: $CREATED, Failed: $FAILED"
echo ""

# Wait for Stripe consistency
sleep 3

# Step 3: Import to KV
echo "📡 STEP 3: Importing Stripe → KV..."
STRIPE_RESPONSE=$(curl -s "https://api.stripe.com/v1/products?active=true&limit=100&expand[]=data.default_price" \
  -u "$STRIPE_SECRET_KEY:")

PRODUCT_COUNT=$(echo "$STRIPE_RESPONSE" | jq '.data | map(select(.default_price != null)) | length')
echo "   Found $PRODUCT_COUNT products with prices"

UPLOADED=0
> /tmp/kv_product_ids.txt

echo "$STRIPE_RESPONSE" | jq -c '.data[] | select(.default_price != null)' | while read -r product; do
  PRODUCT_ID=$(echo "$product" | jq -r '.id')
  NAME=$(echo "$product" | jq -r '.name')
  
  KV_JSON=$(echo "$product" | jq '{
    id: .id,
    name: .name,
    description: .description // "",
    species: .metadata.species // "ball_python",
    morph: .metadata.morph // "normal",
    gender: .metadata.gender // "unknown",
    birth_year: (.metadata.yob // "2024" | tonumber),
    price: (.default_price.unit_amount / 100),
    currency: .default_price.currency,
    stripe_price_id: .default_price.id,
    status: "available",
    source: "stripe"
  }')
  
  curl -s -X PUT \
    "https://api.cloudflare.com/client/v4/accounts/$CLOUDFLARE_ACCOUNT_ID/storage/kv/namespaces/$KV_NAMESPACE_ID/values/product:$PRODUCT_ID" \
    -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
    -H "Content-Type: application/json" \
    --data "$KV_JSON" > /dev/null
  
  echo "$PRODUCT_ID" >> /tmp/kv_product_ids.txt
  echo -n "."
done

echo ""
UPLOADED=$(cat /tmp/kv_product_ids.txt | wc -l)
echo "   ✅ Uploaded: $UPLOADED products"
echo ""

# Step 4: Rebuild index
echo "🔧 STEP 4: Rebuilding product index..."
INDEX_JSON=$(cat /tmp/kv_product_ids.txt | jq -R . | jq -s .)

curl -s -X PUT \
  "https://api.cloudflare.com/client/v4/accounts/$CLOUDFLARE_ACCOUNT_ID/storage/kv/namespaces/$KV_NAMESPACE_ID/values/_index:products" \
  -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
  -H "Content-Type: application/json" \
  --data "$INDEX_JSON" > /dev/null

rm -f /tmp/kv_product_ids.txt
echo "   ✅ Index updated"
echo ""

# Step 5: Verify
echo "🔍 STEP 5: Verifying..."
sleep 2

WORKER_COUNT=$(curl -s "https://catalog.navickaszilvinas.workers.dev/products" | jq 'length')
echo "   Worker API: $WORKER_COUNT products"

echo ""
echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║   ✅ SYNC COMPLETE!                                           ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo ""
echo "📊 Summary:"
echo "   • Stripe: $PRODUCT_COUNT products"
echo "   • KV: $UPLOADED products"
echo "   • Worker API: $WORKER_COUNT products"
echo ""
echo "🌐 Check catalog:"
echo "   https://vinas8.github.io/catalog/catalog.html"
echo ""
