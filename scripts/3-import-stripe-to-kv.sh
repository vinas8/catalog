#!/bin/bash
# Step 3: Import Stripe products to Cloudflare KV
# Fetches all products from Stripe and writes to PRODUCTS namespace

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/../worker/.env" 2>/dev/null || source "$SCRIPT_DIR/../.env"

echo "🔄 IMPORT STRIPE → CLOUDFLARE KV"
echo "================================="
echo ""

# Check required vars
REQUIRED_VARS=("STRIPE_SECRET_KEY" "CLOUDFLARE_API_TOKEN" "CLOUDFLARE_ACCOUNT_ID")
for VAR in "${REQUIRED_VARS[@]}"; do
    if [ -z "${!VAR}" ]; then
        echo "❌ $VAR not set in .env"
        exit 1
    fi
done

# KV Namespace ID from wrangler.toml
KV_NAMESPACE_ID="ecbcb79f3df64379863872965f993991"

echo "📡 Fetching products from Stripe..."
STRIPE_RESPONSE=$(curl -s "https://api.stripe.com/v1/products?active=true&limit=100&expand[]=data.default_price" \
  -u "$STRIPE_SECRET_KEY:")

# Check response
if ! echo "$STRIPE_RESPONSE" | grep -q '"object":"list"'; then
    echo "❌ Failed to fetch from Stripe"
    echo "$STRIPE_RESPONSE" | jq '.' || echo "$STRIPE_RESPONSE"
    exit 1
fi

PRODUCT_COUNT=$(echo "$STRIPE_RESPONSE" | jq '.data | length')
echo "✅ Found $PRODUCT_COUNT products in Stripe"
echo ""

if [ "$PRODUCT_COUNT" -eq 0 ]; then
    echo "⚠️  No products to import!"
    exit 0
fi

echo "📤 Uploading to Cloudflare KV..."
echo ""

UPLOADED=0
FAILED=0
PRODUCT_IDS=()

# Process each product
echo "$STRIPE_RESPONSE" | jq -c '.data[]' | while read -r product; do
    PRODUCT_ID=$(echo "$product" | jq -r '.id')
    NAME=$(echo "$product" | jq -r '.name')
    DESC=$(echo "$product" | jq -r '.description // ""')
    
    # Extract metadata
    MORPH=$(echo "$product" | jq -r '.metadata.morph // "normal"')
    GENDER=$(echo "$product" | jq -r '.metadata.gender // "unknown"')
    YOB=$(echo "$product" | jq -r '.metadata.yob // "2024"')
    SPECIES=$(echo "$product" | jq -r '.metadata.species // "ball_python"')
    WEIGHT=$(echo "$product" | jq -r '.metadata.weight // ""')
    
    # Get price info
    PRICE_CENTS=$(echo "$product" | jq -r '.default_price.unit_amount // 15000')
    CURRENCY=$(echo "$product" | jq -r '.default_price.currency // "eur"')
    PRICE_ID=$(echo "$product" | jq -r '.default_price.id // ""')
    
    # Convert cents to full currency
    PRICE=$(awk "BEGIN {printf \"%.2f\", $PRICE_CENTS / 100}")
    
    echo -n "  $NAME... "
    
    # Build KV JSON
    KV_JSON=$(jq -n \
      --arg id "$PRODUCT_ID" \
      --arg name "$NAME" \
      --arg desc "$DESC" \
      --arg morph "$MORPH" \
      --arg gender "$GENDER" \
      --arg yob "$YOB" \
      --arg species "$SPECIES" \
      --arg weight "$WEIGHT" \
      --arg price "$PRICE" \
      --arg currency "$CURRENCY" \
      --arg price_id "$PRICE_ID" \
      '{
        id: $id,
        name: $name,
        description: $desc,
        species: $species,
        morph: $morph,
        gender: $gender,
        birth_year: ($yob | tonumber),
        weight: (if $weight == "" then null else $weight end),
        price: ($price | tonumber),
        currency: $currency,
        stripe_price_id: $price_id,
        status: "available",
        source: "stripe",
        imported_at: (now | todate)
      }')
    
    # Upload to KV
    KV_KEY="product:$PRODUCT_ID"
    KV_RESPONSE=$(curl -s -X PUT \
      "https://api.cloudflare.com/client/v4/accounts/$CLOUDFLARE_ACCOUNT_ID/storage/kv/namespaces/$KV_NAMESPACE_ID/values/$KV_KEY" \
      -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
      -H "Content-Type: application/json" \
      --data "$KV_JSON")
    
    if echo "$KV_RESPONSE" | grep -q '"success":true'; then
        echo "✅"
        ((UPLOADED++))
        PRODUCT_IDS+=("$PRODUCT_ID")
    else
        echo "❌"
        ((FAILED++))
    fi
done

echo ""
echo "🔧 Rebuilding product index..."

# Create product index
INDEX_JSON=$(printf '%s\n' "${PRODUCT_IDS[@]}" | jq -R . | jq -s .)

INDEX_RESPONSE=$(curl -s -X PUT \
  "https://api.cloudflare.com/client/v4/accounts/$CLOUDFLARE_ACCOUNT_ID/storage/kv/namespaces/$KV_NAMESPACE_ID/values/_index:products" \
  -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
  -H "Content-Type: application/json" \
  --data "$INDEX_JSON")

if echo "$INDEX_RESPONSE" | grep -q '"success":true'; then
    echo "✅ Product index created with ${#PRODUCT_IDS[@]} products"
else
    echo "⚠️  Failed to create index"
fi

echo ""
echo "📊 Import Summary:"
echo "   Uploaded: $UPLOADED"
echo "   Failed: $FAILED"
echo ""

if [ "$UPLOADED" -eq 24 ]; then
    echo "✅ SUCCESS: All 24 products imported to KV!"
else
    echo "⚠️  WARNING: Expected 24 products, uploaded $UPLOADED"
fi

echo ""
echo "🔍 Verify with:"
echo "   curl https://catalog.navickaszilvinas.workers.dev/products"
echo ""
echo "📋 Next step: Validate products appear on catalog.html"
