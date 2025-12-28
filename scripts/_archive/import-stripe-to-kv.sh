#!/bin/bash
# Import Stripe Products to Cloudflare KV
set -e

source .env 2>/dev/null || { echo "❌ .env not found"; exit 1; }

echo "🔄 Import Stripe Products to KV"
echo "================================="
echo ""

# Check required vars
if [ -z "$STRIPE_SECRET_KEY" ]; then
    echo "❌ STRIPE_SECRET_KEY not set"
    exit 1
fi

if [ -z "$CLOUDFLARE_API_TOKEN" ]; then
    echo "❌ CLOUDFLARE_API_TOKEN not set"
    exit 1
fi

if [ -z "$CLOUDFLARE_ACCOUNT_ID" ]; then
    echo "❌ CLOUDFLARE_ACCOUNT_ID not set"
    exit 1
fi

if [ -z "$KV_NAMESPACE_PRODUCTS" ]; then
    echo "❌ KV_NAMESPACE_PRODUCTS not set"
    exit 1
fi

# Fetch all Stripe products
echo "📡 Fetching products from Stripe API..."
STRIPE_RESPONSE=$(curl -s "https://api.stripe.com/v1/products?active=true&limit=100" \
  -u "$STRIPE_SECRET_KEY:")

# Count products
PRODUCT_COUNT=$(echo "$STRIPE_RESPONSE" | grep -o '"id":' | wc -l)
echo "✅ Found $PRODUCT_COUNT Stripe products"
echo ""

# Parse each product and upload to KV
echo "📤 Uploading to KV..."
echo "$STRIPE_RESPONSE" | grep -o '"id":"prod_[^"]*"' | sed 's/"id":"//;s/"$//' | while read -r product_id; do
    echo "  Processing: $product_id"
    
    # Fetch full product details
    PRODUCT_DATA=$(curl -s "https://api.stripe.com/v1/products/$product_id" \
      -u "$STRIPE_SECRET_KEY:")
    
    # Get product name
    PRODUCT_NAME=$(echo "$PRODUCT_DATA" | grep -o '"name":"[^"]*"' | head -1 | sed 's/"name":"//;s/"$//')
    
    # Build KV JSON (with defaults for missing fields)
    KV_JSON=$(cat <<EOF
{
  "id": "$product_id",
  "name": "$PRODUCT_NAME",
  "description": "",
  "images": [],
  "species": "ball_python",
  "morph": "normal",
  "sex": "unknown",
  "birth_year": 2024,
  "weight_grams": 100,
  "type": "real",
  "status": "available",
  "source": "stripe"
}
EOF
)
    
    # Upload to KV
    curl -s -X PUT \
      "https://api.cloudflare.com/client/v4/accounts/$CLOUDFLARE_ACCOUNT_ID/storage/kv/namespaces/$KV_NAMESPACE_PRODUCTS/values/product:$product_id" \
      -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
      -H "Content-Type: application/json" \
      --data "$KV_JSON" > /dev/null
    
    echo "  ✅ Uploaded: $PRODUCT_NAME"
done

echo ""
echo "✅ Import complete!"
echo ""
echo "🔍 Verify with:"
echo "   curl https://catalog.navickaszilvinas.workers.dev/products"

