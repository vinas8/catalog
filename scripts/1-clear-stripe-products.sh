#!/bin/bash
# Step 1: Clear all Stripe products (TEST MODE)
# This deletes ALL products in Stripe test mode - use with caution!

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/../worker/.env" 2>/dev/null || source "$SCRIPT_DIR/../.env"

echo "🗑️  CLEAR ALL STRIPE PRODUCTS (TEST MODE)"
echo "=========================================="
echo ""
echo "⚠️  WARNING: This will DELETE ALL products from Stripe!"
echo "   Mode: TEST (using test API key)"
echo ""

read -p "Type 'DELETE' to confirm: " confirm

if [ "$confirm" != "DELETE" ]; then
    echo "❌ Aborted"
    exit 0
fi

echo ""
echo "📡 Fetching all Stripe products..."

# Fetch all products (including archived)
RESPONSE=$(curl -s "https://api.stripe.com/v1/products?limit=100" \
  -u "$STRIPE_SECRET_KEY:")

# Extract product IDs
PRODUCT_IDS=$(echo "$RESPONSE" | grep -o '"id":"prod_[^"]*"' | sed 's/"id":"//;s/"$//' || echo "")

if [ -z "$PRODUCT_IDS" ]; then
    echo "✅ No products found - Stripe is already empty"
    exit 0
fi

PRODUCT_COUNT=$(echo "$PRODUCT_IDS" | wc -l)
echo "Found $PRODUCT_COUNT products to delete"
echo ""

# Delete each product
echo "🗑️  Deleting products..."
DELETED=0
FAILED=0

for PRODUCT_ID in $PRODUCT_IDS; do
    echo -n "  Deleting $PRODUCT_ID... "
    
    DELETE_RESPONSE=$(curl -s -X DELETE \
      "https://api.stripe.com/v1/products/$PRODUCT_ID" \
      -u "$STRIPE_SECRET_KEY:")
    
    if echo "$DELETE_RESPONSE" | grep -q '"deleted":true'; then
        echo "✅"
        ((DELETED++))
    else
        echo "❌"
        ((FAILED++))
    fi
done

echo ""
echo "📊 Summary:"
echo "   Deleted: $DELETED"
echo "   Failed: $FAILED"
echo ""

# Verify empty
echo "🔍 Verifying Stripe is empty..."
VERIFY=$(curl -s "https://api.stripe.com/v1/products?active=true&limit=1" \
  -u "$STRIPE_SECRET_KEY:")

REMAINING=$(echo "$VERIFY" | grep -o '"id":"prod_' | wc -l)

if [ "$REMAINING" -eq 0 ]; then
    echo "✅ SUCCESS: Stripe is now empty (0 products)"
else
    echo "⚠️  WARNING: $REMAINING products still exist"
    exit 1
fi
