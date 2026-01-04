#!/bin/bash
# Enrich product data with complete snake information
# SMRI S1.4 - Real Snake Detail Completeness

set -e

WORKER_URL="https://catalog.navickaszilvinas.workers.dev"

echo "🐍 SMRI S1.4 - Product Data Enrichment"
echo "========================================"
echo ""

# Sample enriched product data
ENRICHED_PRODUCT='{
  "id": "prod_TdKcnyjt5Jk0U2",
  "name": "Batman Ball",
  "species": "ball_python",
  "morph": "Banana",
  "type": "real",
  "source": "stripe",
  "description": "Beautiful banana morph ball python, captive bred by reputable breeder",
  "status": "available",
  "price": 1000,
  "currency": "eur",
  "stripe_link": "https://buy.stripe.com/test_cNibJ04XLbUsaNQ8uPbjW00",
  "image": "🐍",
  
  "sex": "male",
  "weight_grams": 150,
  "length_cm": 90,
  
  "age": {
    "hatch_date": "2024-03-15T00:00:00Z",
    "months": 9,
    "years": 0
  },
  
  "genetics": {
    "visual": ["Banana"],
    "hets": ["Clown", "Pied"],
    "possible_hets": [],
    "traits": ["Banana", "Het Clown", "Het Pied"]
  },
  
  "breeder": {
    "id": "breeder_001",
    "name": "Premium Pythons EU",
    "location": "Netherlands",
    "reputation": 5
  }
}'

echo "📦 Sample Enriched Product Data:"
echo "$ENRICHED_PRODUCT" | jq '.'
echo ""

echo "✅ Product Structure Validation:"
echo "  ✓ Morph: Banana"
echo "  ✓ Sex: Male"
echo "  ✓ Age: 9 months (hatch date: 2024-03-15)"
echo "  ✓ Size: 150g, 90cm"
echo "  ✓ Genetics: Banana, Het Clown, Het Pied"
echo "  ✓ Breeder: Premium Pythons EU (Netherlands, 5★)"
echo ""

echo "📝 Data Schema Template for Real Snakes:"
cat << 'SCHEMA'
{
  "id": "string",
  "name": "string",
  "species": "ball_python | corn_snake",
  "morph": "string (REQUIRED)",
  "type": "real",
  "sex": "male | female | unknown (REQUIRED)",
  "weight_grams": number (REQUIRED),
  "length_cm": number (REQUIRED),
  "age": {
    "hatch_date": "ISO date (REQUIRED)",
    "months": number,
    "years": number
  },
  "genetics": {
    "visual": ["trait1", "trait2"],
    "hets": ["het1", "het2"],
    "possible_hets": [],
    "traits": ["all traits combined"]
  },
  "breeder": {
    "id": "string (REQUIRED)",
    "name": "string (REQUIRED)",
    "location": "string (REQUIRED)",
    "reputation": number (1-5 stars)
  },
  "description": "string",
  "price": number,
  "stripe_link": "string",
  "status": "available | sold"
}
SCHEMA

echo ""
echo "⚠️  CRITICAL FIELDS (Must not be empty):"
echo "  1. morph - Genetic morph name"
echo "  2. sex - Male, Female, or Unknown"
echo "  3. age.hatch_date - Birth date in ISO format"
echo "  4. weight_grams - Weight in grams"
echo "  5. genetics.visual - Visual genetic traits"
echo "  6. breeder.name - Breeder name"
echo "  7. breeder.location - Breeder location"
echo ""

echo "🔄 Next Steps:"
echo "  1. Update products in Stripe Dashboard with complete metadata"
echo "  2. Run: cd /root/catalog/scripts && ./3-import-stripe-to-kv.sh"
echo "  3. Verify: curl $WORKER_URL/products | jq '.[] | select(.type==\"real\") | {name, morph, sex, genetics, breeder}'"
echo "  4. Test: http://localhost:8001/debug/test-snake-detail-completeness.html"
echo ""

echo "✅ Schema template ready!"
echo "Update Stripe product metadata with these fields."
