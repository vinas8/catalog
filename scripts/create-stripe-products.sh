#!/bin/bash
# Create Stripe products from snake inventory
# Reads snakes-inventory.json and creates products in Stripe

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/../.env"

INVENTORY_FILE="$SCRIPT_DIR/../data/snakes-inventory.json"
OUTPUT_FILE="$SCRIPT_DIR/../data/stripe-products-created.json"

if [ ! -f "$INVENTORY_FILE" ]; then
    echo "❌ Error: Inventory file not found: $INVENTORY_FILE"
    exit 1
fi

echo "🐍 Stripe Product Creator"
echo "========================="
echo ""
echo "📁 Reading inventory: $INVENTORY_FILE"

SNAKE_COUNT=$(cat "$INVENTORY_FILE" | jq '.snakes | length')
echo "Found $SNAKE_COUNT snakes to create"
echo ""

echo "⚠️  This will create $SNAKE_COUNT new products in Stripe"
read -p "Continue? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
    echo "❌ Aborted"
    exit 0
fi

echo ""
echo "🔨 Creating Stripe products..."
echo ""

# Initialize output array
echo "[]" > "$OUTPUT_FILE"

# Read snakes and create products
cat "$INVENTORY_FILE" | jq -c '.snakes[]' | while read snake; do
    NAME=$(echo "$snake" | jq -r '.name')
    MORPH=$(echo "$snake" | jq -r '.morph')
    SPECIES=$(echo "$snake" | jq -r '.species')
    GENDER=$(echo "$snake" | jq -r '.gender')
    YOB=$(echo "$snake" | jq -r '.yob')
    PRICE_EUR=$(echo "$snake" | jq -r '.price_eur')
    DESC=$(echo "$snake" | jq -r '.description')
    
    # Convert EUR to cents
    PRICE_CENTS=$((PRICE_EUR * 100))
    
    PRODUCT_NAME="$NAME - $MORPH"
    PRODUCT_DESC="$SPECIES | $GENDER | Born $YOB\n\n$DESC"
    
    echo "  Creating: $PRODUCT_NAME (€$PRICE_EUR)"
    
    # Create product via Stripe CLI
    PRODUCT_JSON=$(stripe products create \
        --name="$PRODUCT_NAME" \
        --description="$PRODUCT_DESC" \
        --metadata[snake_name]="$NAME" \
        --metadata[species]="$SPECIES" \
        --metadata[morph]="$MORPH" \
        --metadata[gender]="$GENDER" \
        --metadata[yob]="$YOB" \
        --metadata[source]="serpent_town_catalog" \
        --default-price-data[currency]=eur \
        --default-price-data[unit_amount]="$PRICE_CENTS" \
        --format=json)
    
    PRODUCT_ID=$(echo "$PRODUCT_JSON" | jq -r '.id')
    PRICE_ID=$(echo "$PRODUCT_JSON" | jq -r '.default_price')
    
    echo "    ✅ Created: $PRODUCT_ID"
    
    # Create payment link
    echo "    🔗 Creating payment link..."
    PAYMENT_LINK_JSON=$(stripe payment_links create \
        --line-items[0][price]="$PRICE_ID" \
        --line-items[0][quantity]=1 \
        --after_completion[type]=redirect \
        --after_completion[redirect][url]="https://vinas8.github.io/catalog/success.html?session_id={CHECKOUT_SESSION_ID}" \
        --format=json)
    
    PAYMENT_LINK_ID=$(echo "$PAYMENT_LINK_JSON" | jq -r '.id')
    PAYMENT_LINK_URL=$(echo "$PAYMENT_LINK_JSON" | jq -r '.url')
    
    echo "    ✅ Payment link: $PAYMENT_LINK_URL"
    
    # Save to output file
    PRODUCT_DATA=$(jq -n \
        --arg name "$NAME" \
        --arg morph "$MORPH" \
        --arg species "$SPECIES" \
        --arg gender "$GENDER" \
        --arg yob "$YOB" \
        --arg price "$PRICE_EUR" \
        --arg prod_id "$PRODUCT_ID" \
        --arg price_id "$PRICE_ID" \
        --arg link_id "$PAYMENT_LINK_ID" \
        --arg link_url "$PAYMENT_LINK_URL" \
        '{
            name: $name,
            morph: $morph,
            species: $species,
            gender: $gender,
            yob: $yob,
            price_eur: $price,
            stripe_product_id: $prod_id,
            stripe_price_id: $price_id,
            stripe_payment_link_id: $link_id,
            stripe_payment_link: $link_url,
            status: "available"
        }')
    
    # Append to output file
    cat "$OUTPUT_FILE" | jq ". += [$PRODUCT_DATA]" > "$OUTPUT_FILE.tmp"
    mv "$OUTPUT_FILE.tmp" "$OUTPUT_FILE"
    
    echo ""
done

echo ""
echo "✅ All products created successfully!"
echo ""
echo "📊 Summary:"
echo "  Products created: $(cat $OUTPUT_FILE | jq '. | length')"
echo "  Output saved to: $OUTPUT_FILE"
echo ""
echo "📋 Next steps:"
echo "  1. Review products in Stripe dashboard"
echo "  2. Update catalog.html with new payment links"
echo "  3. Sync products to KV using worker"
echo ""
