#!/bin/bash
# Clear All Product Data - Stripe, KV, and Local JSON Files
# DESTRUCTIVE OPERATION - Requires confirmation

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR/.."

# Source environment from root .env
if [ -f .env ]; then
  source .env
elif [ -f worker/.env ]; then
  source worker/.env
else
  echo "❌ .env not found"
  exit 1
fi

# Config
KV_NAMESPACE_ID="ecbcb79f3df64379863872965f993991"

echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║                                                               ║"
echo "║   ⚠️  CLEAR ALL PRODUCT DATA                                  ║"
echo "║                                                               ║"
echo "║   This will DELETE:                                           ║"
echo "║   • All Stripe products                                       ║"
echo "║   • All KV catalog entries                                    ║"
echo "║   • All local JSON catalog files (except test fixtures)       ║"
echo "║                                                               ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo ""

# Check for --force flag
if [ "$1" != "--force" ]; then
  read -p "⚠️  Type 'YES' to confirm deletion: " CONFIRM
  if [ "$CONFIRM" != "YES" ]; then
    echo "❌ Operation cancelled"
    exit 1
  fi
fi

echo ""
echo "🗑️  Starting data clearing process..."
echo ""

# Step 1: Clear Stripe Products
echo "1️⃣  Clearing Stripe products..."
PRODUCT_IDS=$(curl -s "https://api.stripe.com/v1/products?limit=100" \
  -u "$STRIPE_SECRET_KEY:" | grep -o '"id":"prod_[^"]*"' | sed 's/"id":"//;s/"$//' || echo "")

if [ -z "$PRODUCT_IDS" ]; then
  echo "   Already empty (0 products)"
  STRIPE_DELETED=0
else
  COUNT=$(echo "$PRODUCT_IDS" | wc -l)
  echo "   Found $COUNT products to delete"
  STRIPE_DELETED=0
  for PRODUCT_ID in $PRODUCT_IDS; do
    curl -s -X DELETE "https://api.stripe.com/v1/products/$PRODUCT_ID" \
      -u "$STRIPE_SECRET_KEY:" > /dev/null && ((STRIPE_DELETED++))
    echo -n "."
  done
  echo ""
  echo "   ✅ Deleted: $STRIPE_DELETED products"
fi

echo ""

# Step 2: Clear KV Storage (product: keys only)
echo "2️⃣  Clearing KV product entries..."

# List all keys starting with "product:"
KV_KEYS=$(curl -s -X GET \
  "https://api.cloudflare.com/client/v4/accounts/$CLOUDFLARE_ACCOUNT_ID/storage/kv/namespaces/$KV_NAMESPACE_ID/keys?prefix=product:" \
  -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" | jq -r '.result[]?.name // empty' 2>/dev/null)

if [ -z "$KV_KEYS" ]; then
  echo "   Already empty (0 keys)"
  KV_DELETED=0
else
  KV_COUNT=$(echo "$KV_KEYS" | wc -l)
  echo "   Found $KV_COUNT keys to delete"
  KV_DELETED=0
  echo "$KV_KEYS" | while read -r KEY; do
    if [ -n "$KEY" ]; then
      curl -s -X DELETE \
        "https://api.cloudflare.com/client/v4/accounts/$CLOUDFLARE_ACCOUNT_ID/storage/kv/namespaces/$KV_NAMESPACE_ID/values/$KEY" \
        -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" > /dev/null 2>&1
      echo -n "."
    fi
  done
  echo ""
  KV_DELETED=$KV_COUNT
  echo "   ✅ Deleted: $KV_DELETED keys"
fi

# Also clear product index
curl -s -X DELETE \
  "https://api.cloudflare.com/client/v4/accounts/$CLOUDFLARE_ACCOUNT_ID/storage/kv/namespaces/$KV_NAMESPACE_ID/values/_index:products" \
  -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" > /dev/null 2>&1
echo "   ✅ Cleared product index"

echo ""

# Step 3: Remove Local JSON Files
echo "3️⃣  Removing local JSON catalog files..."
echo "   Keeping: test fixtures only"
echo ""

JSON_FILES=(
  "data/products-for-stripe.json"
  "data/new-products-2025.json"
  "data/snake-collection-complete.json"
  "data/snakes-inventory.json"
)

REMOVED=0
for FILE in "${JSON_FILES[@]}"; do
  if [ -f "$FILE" ]; then
    rm "$FILE"
    echo "   🗑️  Removed: $FILE"
    ((REMOVED++))
  fi
done

if [ $REMOVED -eq 0 ]; then
  echo "   Already clean (0 files)"
fi

echo ""

# Step 4: Verification
echo "🔍 Verification..."
sleep 2

# Check Stripe
STRIPE_COUNT=$(curl -s "https://api.stripe.com/v1/products?limit=1" \
  -u "$STRIPE_SECRET_KEY:" | jq '.data | length')

# Check KV
KV_COUNT=$(curl -s -X GET \
  "https://api.cloudflare.com/client/v4/accounts/$CLOUDFLARE_ACCOUNT_ID/storage/kv/namespaces/$KV_NAMESPACE_ID/keys?prefix=product:" \
  -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" | jq '.result | length')

# Check local files
LOCAL_COUNT=$(ls -1 data/*.json 2>/dev/null | grep -v test | wc -l)

echo ""
echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║   ✅ DATA CLEARING COMPLETE!                                  ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo ""
echo "📊 Final Status:"
echo "   • Stripe products: $STRIPE_COUNT (should be 0)"
echo "   • KV product entries: $KV_COUNT (should be 0)"
echo "   • Local JSON files: $LOCAL_COUNT (should be 0)"
echo ""

if [ "$STRIPE_COUNT" -eq 0 ] && [ "$KV_COUNT" -eq 0 ] && [ "$LOCAL_COUNT" -eq 0 ]; then
  echo "✅ All data successfully cleared!"
  echo ""
  echo "📌 Next steps:"
  echo "   1. Run: bash scripts/sync-stripe-kv-complete.sh"
  echo "   2. Re-upload product catalog"
else
  echo "⚠️  Warning: Some data may still exist"
  echo "   Manual verification recommended"
fi
echo ""
