#!/bin/bash
# Create Stripe products using curl and Stripe API
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/../.env"

INVENTORY_FILE="$SCRIPT_DIR/../data/snakes-inventory.json"
OUTPUT_FILE="$SCRIPT_DIR/../data/stripe-products-created.json"

if [ ! -f "$INVENTORY_FILE" ]; then
    echo "❌ Error: Inventory file not found: $INVENTORY_FILE"
    exit 1
fi

echo "🐍 Stripe Product Creator (curl version)"
echo "========================================="
echo ""
echo "📁 Reading inventory: $INVENTORY_FILE"

# Count snakes (count lines with "name" field)
SNAKE_COUNT=$(grep -c '"name":' "$INVENTORY_FILE")
echo "Found $SNAKE_COUNT snakes to create"
echo ""

echo "⚠️  This will create $SNAKE_COUNT new products in Stripe TEST mode"
read -p "Continue? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
    echo "❌ Aborted"
    exit 0
fi

echo ""
echo "🔨 Creating Stripe products..."
echo ""

# Initialize output
echo "[]" > "$OUTPUT_FILE"

# Function to create a product
create_product() {
    local name="$1"
    local morph="$2"
    local species="$3"
    local gender="$4"
    local yob="$5"
    local price_eur="$6"
    local desc="$7"
    
    local price_cents=$((price_eur * 100))
    local product_name="$name - $morph"
    local product_desc="$species | $gender | Born $yob\n\n$desc"
    
    echo "  Creating: $product_name (€$price_eur)"
    
    # Create product
    local response=$(curl -s https://api.stripe.com/v1/products \
      -u "$STRIPE_SECRET_KEY:" \
      -d "name=$product_name" \
      -d "description=$product_desc" \
      -d "metadata[snake_name]=$name" \
      -d "metadata[species]=$species" \
      -d "metadata[morph]=$morph" \
      -d "metadata[gender]=$gender" \
      -d "metadata[yob]=$yob" \
      -d "metadata[source]=serpent_town_catalog")
    
    local product_id=$(echo "$response" | grep -o '"id":"prod_[^"]*"' | head -1 | sed 's/"id":"//g' | sed 's/"//g')
    
    if [ -z "$product_id" ]; then
        echo "    ❌ Failed to create product"
        echo "    Response: $response"
        return 1
    fi
    
    echo "    ✅ Product created: $product_id"
    
    # Create price
    local price_response=$(curl -s https://api.stripe.com/v1/prices \
      -u "$STRIPE_SECRET_KEY:" \
      -d "product=$product_id" \
      -d "unit_amount=$price_cents" \
      -d "currency=eur")
    
    local price_id=$(echo "$price_response" | grep -o '"id":"price_[^"]*"' | head -1 | sed 's/"id":"//g' | sed 's/"//g')
    
    if [ -z "$price_id" ]; then
        echo "    ❌ Failed to create price"
        return 1
    fi
    
    echo "    ✅ Price created: $price_id"
    
    # Create payment link
    local link_response=$(curl -s https://api.stripe.com/v1/payment_links \
      -u "$STRIPE_SECRET_KEY:" \
      -d "line_items[0][price]=$price_id" \
      -d "line_items[0][quantity]=1" \
      -d "after_completion[type]=redirect" \
      -d "after_completion[redirect][url]=https://vinas8.github.io/catalog/success.html?session_id={CHECKOUT_SESSION_ID}")
    
    local link_id=$(echo "$link_response" | grep -o '"id":"plink_[^"]*"' | head -1 | sed 's/"id":"//g' | sed 's/"//g')
    local link_url=$(echo "$link_response" | grep -o '"url":"https://[^"]*"' | head -1 | sed 's/"url":"//g' | sed 's/"//g')
    
    if [ -z "$link_id" ]; then
        echo "    ❌ Failed to create payment link"
        return 1
    fi
    
    echo "    ✅ Payment link: $link_url"
    
    # Append to output file (using python for JSON manipulation)
    python3 -c "
import json
import sys

with open('$OUTPUT_FILE', 'r') as f:
    data = json.load(f)

data.append({
    'name': '$name',
    'morph': '$morph',
    'species': '$species',
    'gender': '$gender',
    'yob': '$yob',
    'price_eur': $price_eur,
    'stripe_product_id': '$product_id',
    'stripe_price_id': '$price_id',
    'stripe_payment_link_id': '$link_id',
    'stripe_payment_link': '$link_url',
    'status': 'available'
})

with open('$OUTPUT_FILE', 'w') as f:
    json.dump(data, f, indent=2)
"
    
    echo ""
}

# Parse JSON and create products (Ball Pythons)
create_product "Pudding" "Banana H. Clown" "Ball Python" "Male" "2024" "455" "Beautiful banana morph with het clown genetics"
create_product "Taohu" "Super Mojave" "Ball Python" "Male" "2024" "490" "Stunning super mojave male"
create_product "Chocolate Chip" "Pastel DG" "Ball Python" "Male" "2021" "240" "Mature pastel DG male, great breeder"
create_product "Gangsta" "Spotnose Clown" "Ball Python" "Male" "2024" "403" "Bold spotnose clown pattern"
create_product "Marshmallow" "Ivory (Super Yellow Belly)" "Ball Python" "Male" "2024" "525" "Clean ivory super yellow belly"
create_product "Brownie" "Black Head" "Ball Python" "Male" "2024" "350" "Classic black head morph"
create_product "Almond" "Hurricane Butter Fire Yellow Belly H.Clown" "Ball Python" "Female" "2024" "630" "Complex 5-gene combo female"
create_product "Caramel" "Hurricane Butter Spider pos H.Ghost Clown Pied" "Ball Python" "Female" "2024" "630" "Rare 6-gene combo with pied"
create_product "Cookie" "HRA Pastel Fire Paradox 50% pos Het Clown" "Ball Python" "Female" "2024" "630" "Unique paradox pattern"
create_product "Hershey" "Super Mystic" "Ball Python" "Female" "2024" "560" "Gorgeous super mystic female"
create_product "Haribo" "Spotnose Super Enchi H.Clown" "Ball Python" "Female" "2023" "322" "Proven breeder, super enchi combo"
create_product "Biscuit" "Leopard Lesser Pastel H. Clown" "Ball Python" "Female" "2024" "473" "Beautiful leopard complex"
create_product "Salabao" "OD Highway" "Ball Python" "Female" "2023" "336" "OD Highway proven female"
create_product "Waffle" "HGW Enchi Fire" "Ball Python" "Female" "2023" "336" "HGW triple combo"
create_product "Toffee" "Spotnose Pastel H.DG" "Ball Python" "Female" "2023" "322" "Pastel spotnose with het DG"
create_product "Coco" "Pastel Het. DG" "Ball Python" "Female" "2023" "336" "Pastel het DG female"
create_product "Latte" "Lesser Spotnose 66% pos H.Clown 50% pos H.DG Hypo" "Ball Python" "Female" "2023" "378" "Lesser spotnose with possible hets"

# Corn Snakes
create_product "Mochi" "Salmon Hypo Bloodred" "Corn Snake" "Male" "2023" "180" "Vibrant salmon bloodred male"
create_product "Milkshake" "Salmon Tessera H.Bloodred" "Corn Snake" "Female" "2024" "216" "Beautiful tessera pattern"
create_product "Berry" "Snow poss Hypo Strawberry" "Corn Snake" "Female" "2024" "234" "Stunning snow morph"
create_product "Honey" "Opal" "Corn Snake" "Female" "2024" "252" "Classic opal female"
create_product "Peachy" "Opal Tessera" "Corn Snake" "Male" "2024" "252" "Opal tessera combo"
create_product "Lavender" "Lavender Tessera" "Corn Snake" "Female" "2024" "270" "Gorgeous lavender tessera"
create_product "Lollipop" "Salmon H. Bloodred" "Corn Snake" "Female" "2024" "216" "Sweet salmon het bloodred"

echo ""
echo "✅ All products created successfully!"
echo ""
echo "📊 Summary:"
CREATED_COUNT=$(python3 -c "import json; print(len(json.load(open('$OUTPUT_FILE'))))")
echo "  Products created: $CREATED_COUNT"
echo "  Output saved to: $OUTPUT_FILE"
echo ""
echo "📋 Next steps:"
echo "  1. Review products in Stripe dashboard: https://dashboard.stripe.com/test/products"
echo "  2. Update catalog.html with new payment links"
echo "  3. Test purchase flow end-to-end"
echo ""
