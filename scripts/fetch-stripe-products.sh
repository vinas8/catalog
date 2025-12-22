#!/bin/bash
# Fetch products from Stripe Payment Links and seed to KV
set -e

echo "🐍 Fetching Snakes from Stripe Payment Links"
echo "=============================================="
echo ""

# Load environment
if [ -f .env ]; then
    source .env
else
    echo "❌ .env file not found"
    exit 1
fi

# Check required vars
if [ -z "$STRIPE_SECRET_KEY" ]; then
    echo "❌ STRIPE_SECRET_KEY not set"
    exit 1
fi

if [ -z "$CLOUDFLARE_API_TOKEN" ] || [ -z "$CLOUDFLARE_ACCOUNT_ID" ]; then
    echo "❌ Cloudflare credentials not set"
    exit 1
fi

# Fetch products from Stripe
echo "📡 Fetching products from Stripe..."
STRIPE_PRODUCTS=$(curl -s https://api.stripe.com/v1/products?active=true&limit=100 \
  -u "${STRIPE_SECRET_KEY}:")

# Count products
PRODUCT_COUNT=$(echo "$STRIPE_PRODUCTS" | python3 -c "import json,sys; data=json.load(sys.stdin); print(len(data.get('data', [])))")
echo "Found $PRODUCT_COUNT products in Stripe"
echo ""

# Fetch prices for products
echo "💰 Fetching prices..."
STRIPE_PRICES=$(curl -s https://api.stripe.com/v1/prices?active=true&limit=100 \
  -u "${STRIPE_SECRET_KEY}:")

# Fetch payment links
echo "🔗 Fetching payment links..."
PAYMENT_LINKS=$(curl -s https://api.stripe.com/v1/payment_links?active=true&limit=100 \
  -u "${STRIPE_SECRET_KEY}:")

# Convert Stripe products to our format
echo "🔄 Converting to snake format..."
python3 << 'PYTHON' > /tmp/stripe_products.json
import json
import sys
import os

# Read Stripe data
products_data = """$STRIPE_PRODUCTS"""
prices_data = """$STRIPE_PRICES"""
links_data = """$PAYMENT_LINKS"""

try:
    products = json.loads(os.environ.get('STRIPE_PRODUCTS', '{"data":[]}'))
    prices = json.loads(os.environ.get('STRIPE_PRICES', '{"data":[]}'))
    payment_links = json.loads(os.environ.get('PAYMENT_LINKS', '{"data":[]}'))
except:
    import subprocess
    # Fetch again with proper env
    result = subprocess.run(['bash', '-c', 'source .env && curl -s https://api.stripe.com/v1/products?active=true -u "$STRIPE_SECRET_KEY:"'], 
                          capture_output=True, text=True)
    products = json.loads(result.stdout)
    
    result = subprocess.run(['bash', '-c', 'source .env && curl -s https://api.stripe.com/v1/prices?active=true -u "$STRIPE_SECRET_KEY:"'],
                          capture_output=True, text=True)
    prices = json.loads(result.stdout)
    
    result = subprocess.run(['bash', '-c', 'source .env && curl -s https://api.stripe.com/v1/payment_links?active=true -u "$STRIPE_SECRET_KEY:"'],
                          capture_output=True, text=True)
    payment_links = json.loads(result.stdout)

# Create price lookup
price_map = {}
for price in prices.get('data', []):
    product_id = price.get('product')
    if product_id:
        price_map[product_id] = {
            'amount': price['unit_amount'] / 100,  # Convert cents to dollars
            'currency': price['currency']
        }

# Create payment link lookup
link_map = {}
for link in payment_links.get('data', []):
    line_items = link.get('line_items', {}).get('data', [])
    if line_items:
        price_id = line_items[0].get('price')
        # Find product for this price
        for price in prices.get('data', []):
            if price['id'] == price_id:
                product_id = price.get('product')
                link_map[product_id] = link['url']
                break

# Convert products
snake_products = []
for product in products.get('data', []):
    product_id = product['id']
    
    # Get price
    price_info = price_map.get(product_id, {'amount': 0, 'currency': 'usd'})
    
    # Get payment link
    stripe_link = link_map.get(product_id, '')
    
    # Extract metadata
    metadata = product.get('metadata', {})
    species = metadata.get('species', 'ball_python')
    morph = metadata.get('morph', 'normal')
    
    snake = {
        'id': product_id,
        'name': product['name'],
        'species': species,
        'morph': morph,
        'price': price_info['amount'],
        'currency': price_info['currency'],
        'stripe_link': stripe_link,
        'description': product.get('description', ''),
        'images': product.get('images', []),
        'status': 'available',
        'source': 'stripe',
        'metadata': metadata,
        'created_at': product.get('created')
    }
    
    snake_products.append(snake)

# Add default snakes if Stripe is empty
if len(snake_products) == 0:
    print("⚠️  No Stripe products found, adding defaults...", file=sys.stderr)
    snake_products = [
        {
            "id": "prod_default_banana_ball",
            "name": "Banana Ball Python",
            "species": "ball_python",
            "morph": "banana",
            "price": 450.00,
            "currency": "usd",
            "stripe_link": "https://buy.stripe.com/test_placeholder",
            "status": "available",
            "source": "default"
        },
        {
            "id": "prod_default_piebald_ball",
            "name": "Piebald Ball Python",
            "species": "ball_python",
            "morph": "piebald",
            "price": 600.00,
            "currency": "usd",
            "stripe_link": "https://buy.stripe.com/test_placeholder",
            "status": "available",
            "source": "default"
        },
        {
            "id": "prod_default_corn_amel",
            "name": "Amelanistic Corn Snake",
            "species": "corn_snake",
            "morph": "amelanistic",
            "price": 80.00,
            "currency": "usd",
            "stripe_link": "https://buy.stripe.com/test_placeholder",
            "status": "available",
            "source": "default"
        }
    ]

output = {
    'products': snake_products,
    'count': len(snake_products)
}

print(json.dumps(output, indent=2))

PYTHON

# Check if conversion succeeded
if [ ! -f /tmp/stripe_products.json ]; then
    echo "❌ Failed to convert products"
    exit 1
fi

CONVERTED_COUNT=$(cat /tmp/stripe_products.json | python3 -c "import json,sys; print(json.load(sys.stdin)['count'])")
echo "✅ Converted $CONVERTED_COUNT products"
echo ""

# Upload to KV
echo "⬆️  Uploading to Cloudflare KV..."
NAMESPACE_ID="ecbcb79f3df64379863872965f993991"

cat /tmp/stripe_products.json | python3 << PYTHON
import json
import sys
import subprocess
import os

data = json.load(sys.stdin)
products = data['products']
namespace_id = "$NAMESPACE_ID"
account_id = os.environ['CLOUDFLARE_ACCOUNT_ID']
api_token = os.environ['CLOUDFLARE_API_TOKEN']

product_ids = []
success_count = 0
fail_count = 0

for product in products:
    product_id = product['id']
    product_ids.append(product_id)
    key = f"product:{product_id}"
    value = json.dumps(product)
    
    # Upload via Cloudflare API
    result = subprocess.run([
        'curl', '-X', 'PUT',
        f'https://api.cloudflare.com/client/v4/accounts/{account_id}/storage/kv/namespaces/{namespace_id}/values/{key}',
        '-H', f'Authorization: Bearer {api_token}',
        '-H', 'Content-Type: application/json',
        '-d', value
    ], capture_output=True, text=True)
    
    try:
        response = json.loads(result.stdout)
        if response.get('success'):
            print(f"  ✅ {product['name']} (${product['price']})")
            success_count += 1
        else:
            print(f"  ❌ {product['name']}: {response.get('errors', 'Unknown error')}")
            fail_count += 1
    except:
        print(f"  ❌ {product['name']}: Failed to parse response")
        fail_count += 1

# Upload index
index_value = json.dumps(product_ids)
result = subprocess.run([
    'curl', '-X', 'PUT',
    f'https://api.cloudflare.com/client/v4/accounts/{account_id}/storage/kv/namespaces/{namespace_id}/values/_index:products',
    '-H', f'Authorization: Bearer {api_token}',
    '-H', 'Content-Type: application/json',
    '-d', index_value
], capture_output=True, text=True)

try:
    response = json.loads(result.stdout)
    if response.get('success'):
        print(f"  ✅ Product index ({len(product_ids)} items)")
    else:
        print(f"  ❌ Index upload failed")
except:
    print(f"  ❌ Index upload failed to parse")

print(f"\n📊 Results: {success_count} uploaded, {fail_count} failed")

PYTHON

echo ""
echo "🎉 Done!"
echo ""
echo "Test with:"
echo "curl https://catalog.navickaszilvinas.workers.dev/products"
echo ""
echo "⚠️  Note: Worker needs redeployment to pick up PRODUCTS KV binding"

# Cleanup
rm -f /tmp/stripe_products.json
