#!/usr/bin/env python3
"""
Stripe Product Sync Script for Termux
Fetches products from Stripe API and generates products.json
"""

import json
import os
import sys

try:
    import requests
except ImportError:
    print("❌ requests not installed. Run: pip install requests")
    sys.exit(1)

# Configuration
STRIPE_API_KEY = os.environ.get('STRIPE_SECRET_KEY', '')
OUTPUT_FILE = 'data/products.json'

# Species mapping (customize as needed)
SPECIES_MAP = {
    'ball_python': 'ball_python',
    'ball python': 'ball_python',
    'corn_snake': 'corn_snake',
    'corn snake': 'corn_snake',
}

def fetch_stripe_products():
    """Fetch all active products from Stripe"""
    if not STRIPE_API_KEY:
        print("❌ STRIPE_SECRET_KEY environment variable not set!")
        print("Set it with: export STRIPE_SECRET_KEY='sk_test_...'")
        sys.exit(1)
    
    url = 'https://api.stripe.com/v1/products'
    headers = {
        'Authorization': f'Bearer {STRIPE_API_KEY}',
    }
    params = {
        'active': 'true',
        'limit': 100,
    }
    
    print("🔄 Fetching products from Stripe...")
    response = requests.get(url, headers=headers, params=params)
    
    if response.status_code != 200:
        print(f"❌ Stripe API error: {response.status_code}")
        print(response.text)
        sys.exit(1)
    
    data = response.json()
    return data.get('data', [])

def fetch_product_prices(product_id):
    """Fetch prices for a product"""
    url = 'https://api.stripe.com/v1/prices'
    headers = {
        'Authorization': f'Bearer {STRIPE_API_KEY}',
    }
    params = {
        'product': product_id,
        'active': 'true',
        'limit': 1,
    }
    
    response = requests.get(url, headers=headers, params=params)
    if response.status_code != 200:
        return None
    
    data = response.json()
    prices = data.get('data', [])
    return prices[0] if prices else None

def convert_to_catalog_format(stripe_product, price_data):
    """Convert Stripe product to catalog format"""
    
    # Extract metadata
    metadata = stripe_product.get('metadata', {})
    
    # Get species from metadata or name
    species = metadata.get('species', '').lower()
    if not species:
        # Try to guess from name
        name_lower = stripe_product.get('name', '').lower()
        for key, value in SPECIES_MAP.items():
            if key in name_lower:
                species = value
                break
    
    if not species:
        species = 'ball_python'  # default
    
    # Get price
    price = 0
    if price_data:
        price = price_data.get('unit_amount', 0) / 100  # cents to dollars
    
    # Get payment link
    stripe_link = metadata.get('payment_link', '')
    if not stripe_link:
        # Generate from product ID
        stripe_link = f"https://buy.stripe.com/test_{stripe_product['id']}"
    
    # Build catalog item
    catalog_item = {
        'id': stripe_product['id'],
        'name': stripe_product.get('name', 'Unknown Snake'),
        'species': species,
        'morph': metadata.get('morph', 'normal'),
        'price': price,
        'info': metadata.get('info', 'Captive Bred'),
        'sex': metadata.get('sex', 'unknown'),
        'birth_year': int(metadata.get('birth_year', 2024)),
        'weight_grams': int(metadata.get('weight_grams', 100)),
        'description': stripe_product.get('description', ''),
        'status': 'available' if stripe_product.get('active') else 'sold',
        'image': metadata.get('image', '🐍'),
        'stripe_link': stripe_link
    }
    
    return catalog_item

def main():
    print("🐍 Stripe Product Sync - v3.4")
    print("=" * 50)
    
    # Fetch products
    products = fetch_stripe_products()
    print(f"✅ Found {len(products)} products in Stripe")
    
    # Convert to catalog format
    catalog_items = []
    for product in products:
        print(f"Processing: {product['name']}...")
        
        # Fetch price
        price_data = fetch_product_prices(product['id'])
        
        # Convert
        catalog_item = convert_to_catalog_format(product, price_data)
        catalog_items.append(catalog_item)
    
    # Save to file
    os.makedirs('data', exist_ok=True)
    with open(OUTPUT_FILE, 'w') as f:
        json.dump(catalog_items, f, indent=2)
    
    print(f"\n✅ Saved {len(catalog_items)} products to {OUTPUT_FILE}")
    print("\n📋 Products:")
    for item in catalog_items:
        print(f"  - {item['name']} (${item['price']}) - {item['species']}")
    
    print("\n🚀 Next steps:")
    print("1. Review data/products.json")
    print("2. Commit and push to GitHub:")
    print("   git add data/products.json")
    print("   git commit -m 'Update products from Stripe'")
    print("   git push")

if __name__ == '__main__':
    main()
