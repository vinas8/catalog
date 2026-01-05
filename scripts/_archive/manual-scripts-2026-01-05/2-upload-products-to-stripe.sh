#!/bin/bash
# Step 2: Upload 24 products to Stripe with metadata
# Creates products with default prices and stores metadata

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/../worker/.env" 2>/dev/null || source "$SCRIPT_DIR/../.env"

PRODUCTS_FILE="$SCRIPT_DIR/../data/new-products-2025.json"
OUTPUT_FILE="$SCRIPT_DIR/../data/stripe-products-uploaded.json"

echo "📤 UPLOAD PRODUCTS TO STRIPE"
echo "============================="
echo ""
echo "📁 Reading: $PRODUCTS_FILE"

if [ ! -f "$PRODUCTS_FILE" ]; then
    echo "❌ Products file not found!"
    exit 1
fi

# Check jq is available
if ! command -v jq &> /dev/null; then
    echo "❌ jq is required but not installed"
    echo "   Install: apt-get install jq"
    exit 1
fi

PRODUCT_COUNT=$(jq '.products | length' "$PRODUCTS_FILE")
echo "Found $PRODUCT_COUNT products to upload"
echo ""

read -p "Continue? (yes/no): " confirm
if [ "$confirm" != "yes" ]; then
    echo "❌ Aborted"
    exit 0
fi

echo ""
echo "🚀 Creating Stripe products..."
echo ""

# Initialize output
echo '{"products":[],"created_at":"'$(date -Iseconds)'"}' > "$OUTPUT_FILE"

CREATED=0
FAILED=0

# Process each product
jq -c '.products[]' "$PRODUCTS_FILE" | while read -r product; do
    NAME=$(echo "$product" | jq -r '.name')
    MORPH=$(echo "$product" | jq -r '.morph')
    GENDER=$(echo "$product" | jq -r '.gender')
    YOB=$(echo "$product" | jq -r '.yob')
    WEIGHT=$(echo "$product" | jq -r '.weight')
    SPECIES=$(echo "$product" | jq -r '.species // "ball_python"')
    
    # Handle null weight
    if [ "$WEIGHT" = "null" ]; then
        WEIGHT=""
    fi
    
    echo "  Creating: $NAME"
    echo "    Morph: $MORPH | Gender: $GENDER | YOB: $YOB"
    
    # Create slug for idempotency key
    SLUG=$(echo "$NAME" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9]/_/g' | sed 's/__*/_/g')
    IDEMPOTENCY_KEY="serpent_town_2025_${SLUG}"
    
    # Default price: €150 (15000 cents)
    PRICE_CENTS=15000
    
    # Build metadata JSON
    METADATA="metadata[morph]=$MORPH&metadata[gender]=$GENDER&metadata[yob]=$YOB&metadata[species]=$SPECIES"
    if [ -n "$WEIGHT" ]; then
        METADATA="$METADATA&metadata[weight]=$WEIGHT"
    fi
    
    # Create product with price
    CREATE_RESPONSE=$(curl -s -X POST "https://api.stripe.com/v1/products" \
      -u "$STRIPE_SECRET_KEY:" \
      -H "Idempotency-Key: $IDEMPOTENCY_KEY" \
      -d "name=$NAME" \
      -d "description=$SPECIES | $GENDER | Born $YOB" \
      -d "$METADATA" \
      -d "default_price_data[currency]=eur" \
      -d "default_price_data[unit_amount]=$PRICE_CENTS")
    
    # Check if successful
    if echo "$CREATE_RESPONSE" | grep -q '"object":"product"'; then
        PRODUCT_ID=$(echo "$CREATE_RESPONSE" | grep -o '"id":"prod_[^"]*"' | head -1 | sed 's/"id":"//;s/"$//')
        PRICE_ID=$(echo "$CREATE_RESPONSE" | grep -o '"default_price":"price_[^"]*"' | sed 's/"default_price":"//;s/"$//')
        
        echo "    ✅ Created: $PRODUCT_ID (price: $PRICE_ID)"
        
        # Save to output file
        PRODUCT_DATA=$(jq -n \
          --arg name "$NAME" \
          --arg morph "$MORPH" \
          --arg gender "$GENDER" \
          --arg yob "$YOB" \
          --arg weight "$WEIGHT" \
          --arg species "$SPECIES" \
          --arg prod_id "$PRODUCT_ID" \
          --arg price_id "$PRICE_ID" \
          '{
            name: $name,
            morph: $morph,
            gender: $gender,
            yob: ($yob | tonumber),
            weight: (if $weight == "" then null else $weight end),
            species: $species,
            stripe_product_id: $prod_id,
            stripe_price_id: $price_id,
            price_eur: 150,
            status: "available"
          }')
        
        # Append to output
        TMP_FILE="${OUTPUT_FILE}.tmp"
        jq ".products += [$PRODUCT_DATA]" "$OUTPUT_FILE" > "$TMP_FILE"
        mv "$TMP_FILE" "$OUTPUT_FILE"
        
        ((CREATED++))
    else
        echo "    ❌ Failed!"
        echo "$CREATE_RESPONSE" | jq '.' || echo "$CREATE_RESPONSE"
        ((FAILED++))
    fi
    
    echo ""
done

echo ""
echo "📊 Upload Summary:"
echo "   Created: $CREATED"
echo "   Failed: $FAILED"
echo ""

# Verify count
echo "🔍 Verifying Stripe product count..."
VERIFY=$(curl -s "https://api.stripe.com/v1/products?active=true&limit=100" \
  -u "$STRIPE_SECRET_KEY:")

STRIPE_COUNT=$(echo "$VERIFY" | grep -o '"id":"prod_' | wc -l)
echo "   Stripe has $STRIPE_COUNT active products"

if [ "$STRIPE_COUNT" -eq 24 ]; then
    echo "✅ SUCCESS: All 24 products uploaded!"
elif [ "$STRIPE_COUNT" -gt 0 ]; then
    echo "⚠️  WARNING: Expected 24 products, found $STRIPE_COUNT"
else
    echo "❌ ERROR: No products found in Stripe!"
    exit 1
fi

echo ""
echo "📄 Output saved to: $OUTPUT_FILE"
echo ""
echo "📋 Next step: Run import job to sync Stripe → KV"
echo "   bash scripts/3-import-stripe-to-kv.sh"
