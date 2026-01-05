#!/bin/bash
# Quick script to set default price on Stripe products
# Usage: bash set-default-prices.sh

echo "🐍 Setting default prices for Stripe products..."

STRIPE_KEY="$STRIPE_SECRET_KEY"

if [ -z "$STRIPE_KEY" ]; then
  echo "❌ Error: STRIPE_SECRET_KEY not set"
  echo "Export it first: export STRIPE_SECRET_KEY=sk_test_..."
  exit 1
fi

# Fetch all products
echo "📡 Fetching products from Stripe..."
PRODUCTS=$(curl -s https://api.stripe.com/v1/products?limit=100 \
  -u "${STRIPE_KEY}:")

# Count products
PRODUCT_COUNT=$(echo "$PRODUCTS" | jq '.data | length')
echo "✅ Found $PRODUCT_COUNT products"

# Update each product with default price in metadata
echo "💰 Setting default prices..."

echo "$PRODUCTS" | jq -r '.data[] | .id' | while read PRODUCT_ID; do
  # Get current metadata
  PRODUCT_DATA=$(curl -s "https://api.stripe.com/v1/products/${PRODUCT_ID}" \
    -u "${STRIPE_KEY}:")
  
  NAME=$(echo "$PRODUCT_DATA" | jq -r '.name')
  CURRENT_PRICE=$(echo "$PRODUCT_DATA" | jq -r '.metadata.price // "none"')
  
  # Skip if price already set
  if [ "$CURRENT_PRICE" != "none" ] && [ "$CURRENT_PRICE" != "null" ]; then
    echo "  ⏭️  $NAME - already has price: €$CURRENT_PRICE"
    continue
  fi
  
  # Set default price (150 EUR)
  echo "  💳 $NAME - setting price to €150"
  curl -s "https://api.stripe.com/v1/products/${PRODUCT_ID}" \
    -u "${STRIPE_KEY}:" \
    -d "metadata[price]=150" \
    > /dev/null
done

echo ""
echo "✅ Done! All products now have default €150 price"
echo ""
echo "🔄 To use different prices, edit metadata in Stripe Dashboard:"
echo "   https://dashboard.stripe.com/products"
echo ""
echo "Or use price-config.js for automatic pricing:"
echo "   src/config/price-config.js"
