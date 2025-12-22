#!/bin/bash
# Fetch products from Stripe and seed to KV with defaults
set -e

echo "🐍 Fetching Snakes from Stripe & Adding Defaults"
echo "=================================================="
echo ""

# Check for required env vars
if [ -z "$STRIPE_SECRET_KEY" ]; then
    echo "❌ STRIPE_SECRET_KEY not set in .env"
    exit 1
fi

if [ -z "$CLOUDFLARE_API_TOKEN" ]; then
    echo "❌ CLOUDFLARE_API_TOKEN not set in .env"
    exit 1
fi

# Fetch products from Stripe
echo "📡 Fetching products from Stripe..."
STRIPE_PRODUCTS=$(curl -s https://api.stripe.com/v1/products?active=true \
  -u "${STRIPE_SECRET_KEY}:" \
  -G)

echo "Found $(echo "$STRIPE_PRODUCTS" | grep -o '"id"' | wc -l) Stripe products"
echo ""

# Create default snakes array
cat > /tmp/default_snakes.json << 'EOF'
[
  {
    "id": "prod_default_banana_ball",
    "name": "Banana Ball Python",
    "species": "ball_python",
    "morph": "banana",
    "price": 450.00,
    "type": "real",
    "source": "default",
    "info": "Male • 2024 • Captive Bred",
    "sex": "male",
    "birth_year": 2024,
    "weight_grams": 150,
    "description": "Beautiful banana morph ball python with bright yellow coloration",
    "image": "🐍",
    "stripe_link": "https://buy.stripe.com/test_placeholder",
    "unique": true,
    "status": "available",
    "created_at": "2025-12-22T00:00:00Z"
  },
  {
    "id": "prod_default_piebald_ball",
    "name": "Piebald Ball Python",
    "species": "ball_python",
    "morph": "piebald",
    "price": 600.00,
    "type": "real",
    "source": "default",
    "info": "Female • 2023 • Captive Bred",
    "sex": "female",
    "birth_year": 2023,
    "weight_grams": 200,
    "description": "Stunning piebald pattern with white and dark patches",
    "image": "🐍",
    "stripe_link": "https://buy.stripe.com/test_placeholder",
    "unique": true,
    "status": "available",
    "created_at": "2025-12-22T00:00:00Z"
  },
  {
    "id": "prod_default_corn_amelanistic",
    "name": "Amelanistic Corn Snake",
    "species": "corn_snake",
    "morph": "amelanistic",
    "price": 80.00,
    "type": "real",
    "source": "default",
    "info": "Juvenile • 2024 • Captive Bred",
    "sex": "unknown",
    "birth_year": 2024,
    "weight_grams": 50,
    "description": "Vibrant orange and red amelanistic corn snake",
    "image": "🐍",
    "stripe_link": "https://buy.stripe.com/test_placeholder",
    "unique": false,
    "status": "available",
    "created_at": "2025-12-22T00:00:00Z"
  }
]
EOF

echo "✅ Created 3 default snakes"
echo ""

# Combine Stripe products + defaults (convert Stripe format)
echo "🔄 Processing products..."
python3 << 'PYTHON'
import json
import sys

# Load default snakes
with open('/tmp/default_snakes.json', 'r') as f:
    products = json.load(f)

# Note: Stripe products would be processed here
# For now, just use defaults

# Create product index
product_ids = [p['id'] for p in products]

# Save for upload
output = {
    'products': products,
    'index': product_ids
}

with open('/tmp/products_to_upload.json', 'w') as f:
    json.dump(output, f, indent=2)

print(f"✅ Prepared {len(products)} products for upload")

PYTHON

# Get KV namespace ID
echo ""
echo "🔍 Finding PRODUCTS namespace..."
NAMESPACE_ID=$(wrangler kv:namespace list | grep "PRODUCTS" | grep -o '"id": "[^"]*"' | cut -d'"' -f4 || echo "")

if [ -z "$NAMESPACE_ID" ]; then
    echo "❌ PRODUCTS namespace not found in wrangler.toml binding"
    echo "Using ID from wrangler.toml: ecbcb79f3df64379863872965f993991"
    NAMESPACE_ID="ecbcb79f3df64379863872965f993991"
fi

echo "Namespace ID: $NAMESPACE_ID"
echo ""

# Upload each product to KV
echo "⬆️  Uploading products to KV..."
cat /tmp/products_to_upload.json | python3 << PYTHON
import json
import sys
import subprocess

data = json.load(sys.stdin)
products = data['products']
namespace_id = "$NAMESPACE_ID"

for product in products:
    product_id = product['id']
    key = f"product:{product_id}"
    value = json.dumps(product)
    
    # Upload to KV
    result = subprocess.run([
        'wrangler', 'kv:key', 'put',
        '--namespace-id', namespace_id,
        key,
        value
    ], capture_output=True, text=True)
    
    if result.returncode == 0:
        print(f"✅ {product['name']} ({product_id})")
    else:
        print(f"❌ Failed: {product_id}")
        print(result.stderr)

# Upload product index
index_value = json.dumps(data['index'])
result = subprocess.run([
    'wrangler', 'kv:key', 'put',
    '--namespace-id', namespace_id,
    '_index:products',
    index_value
], capture_output=True, text=True)

if result.returncode == 0:
    print(f"✅ Product index ({len(data['index'])} items)")
else:
    print(f"❌ Failed to upload index")

PYTHON

echo ""
echo "🎉 Products seeded to KV!"
echo ""
echo "Test with:"
echo "curl https://catalog.navickaszilvinas.workers.dev/products"

# Cleanup
rm -f /tmp/default_snakes.json /tmp/products_to_upload.json
