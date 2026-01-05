#!/bin/bash
# Migrate products from PRODUCTS to PRODUCTS_REAL and PRODUCTS_VIRTUAL
# Splits based on type field (defaults all to 'real' if missing)

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/../worker/.env" 2>/dev/null || source "$SCRIPT_DIR/../.env"

echo "📦 MIGRATE PRODUCTS - Split Real/Virtual"
echo "========================================="
echo ""

# Check required vars
REQUIRED_VARS=("CLOUDFLARE_API_TOKEN" "CLOUDFLARE_ACCOUNT_ID")
for VAR in "${REQUIRED_VARS[@]}"; do
    if [ -z "${!VAR}" ]; then
        echo "❌ $VAR not set in .env"
        exit 1
    fi
done

# Namespace IDs from wrangler.toml
PRODUCTS_ID="ecbcb79f3df64379863872965f993991"
PRODUCTS_REAL_ID=""
PRODUCTS_VIRTUAL_ID=""

# Try to extract from wrangler.toml
WRANGLER_FILE="$SCRIPT_DIR/../worker/wrangler.toml"
if [ -f "$WRANGLER_FILE" ]; then
    PRODUCTS_REAL_ID=$(grep -A 1 'binding = "PRODUCTS_REAL"' "$WRANGLER_FILE" | grep 'id =' | cut -d'"' -f2)
    PRODUCTS_VIRTUAL_ID=$(grep -A 1 'binding = "PRODUCTS_VIRTUAL"' "$WRANGLER_FILE" | grep 'id =' | cut -d'"' -f2)
fi

if [ -z "$PRODUCTS_REAL_ID" ] || [ "$PRODUCTS_REAL_ID" == "TODO_CREATE_IN_CLOUDFLARE" ]; then
    echo "❌ PRODUCTS_REAL namespace ID not found in wrangler.toml"
    echo "   Run: ./4b-create-kv-namespaces.sh first"
    exit 1
fi

if [ -z "$PRODUCTS_VIRTUAL_ID" ] || [ "$PRODUCTS_VIRTUAL_ID" == "TODO_CREATE_IN_CLOUDFLARE" ]; then
    echo "❌ PRODUCTS_VIRTUAL namespace ID not found in wrangler.toml"
    echo "   Run: ./4b-create-kv-namespaces.sh first"
    exit 1
fi

echo "Source: PRODUCTS ($PRODUCTS_ID)"
echo "Target Real: PRODUCTS_REAL ($PRODUCTS_REAL_ID)"
echo "Target Virtual: PRODUCTS_VIRTUAL ($PRODUCTS_VIRTUAL_ID)"
echo ""

# Fetch all product keys from PRODUCTS
echo "1️⃣  Fetching all products from PRODUCTS namespace..."
KEYS_RESPONSE=$(curl -s "https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/storage/kv/namespaces/${PRODUCTS_ID}/keys?prefix=product:" \
  -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}")

# Check response
SUCCESS=$(echo "$KEYS_RESPONSE" | jq -r '.success')
if [ "$SUCCESS" != "true" ]; then
    echo "❌ Failed to fetch keys"
    echo "$KEYS_RESPONSE" | jq '.'
    exit 1
fi

KEYS=$(echo "$KEYS_RESPONSE" | jq -r '.result[].name')
TOTAL_COUNT=$(echo "$KEYS" | wc -l)

echo "   Found $TOTAL_COUNT products"
echo ""

if [ "$TOTAL_COUNT" -eq 0 ]; then
    echo "⚠️  No products to migrate!"
    exit 0
fi

# Create backup directory
BACKUP_DIR="$SCRIPT_DIR/../data/backup-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$BACKUP_DIR"
echo "2️⃣  Creating backup in: $BACKUP_DIR"

REAL_COUNT=0
VIRTUAL_COUNT=0
FAILED=0

# Process each product
echo ""
echo "3️⃣  Processing products..."
echo ""

for KEY in $KEYS; do
    # Fetch product data
    PRODUCT_DATA=$(curl -s "https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/storage/kv/namespaces/${PRODUCTS_ID}/values/${KEY}" \
      -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}")
    
    # Backup to file
    PRODUCT_ID="${KEY#product:}"
    echo "$PRODUCT_DATA" > "$BACKUP_DIR/${PRODUCT_ID}.json"
    
    # Check type field
    PRODUCT_TYPE=$(echo "$PRODUCT_DATA" | jq -r '.type // "real"')
    
    # Default to 'real' if type missing or invalid
    if [ "$PRODUCT_TYPE" != "real" ] && [ "$PRODUCT_TYPE" != "virtual" ]; then
        PRODUCT_TYPE="real"
    fi
    
    # Add type field if missing
    if ! echo "$PRODUCT_DATA" | jq -e '.type' > /dev/null 2>&1; then
        PRODUCT_DATA=$(echo "$PRODUCT_DATA" | jq --arg type "$PRODUCT_TYPE" '. + {type: $type}')
    fi
    
    # Upload to appropriate namespace
    if [ "$PRODUCT_TYPE" == "real" ]; then
        TARGET_ID="$PRODUCTS_REAL_ID"
        REAL_COUNT=$((REAL_COUNT + 1))
        echo "   ✅ $PRODUCT_ID → PRODUCTS_REAL"
    else
        TARGET_ID="$PRODUCTS_VIRTUAL_ID"
        VIRTUAL_COUNT=$((VIRTUAL_COUNT + 1))
        echo "   ✅ $PRODUCT_ID → PRODUCTS_VIRTUAL"
    fi
    
    # Upload to target namespace
    UPLOAD_RESPONSE=$(curl -s -X PUT \
      "https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/storage/kv/namespaces/${TARGET_ID}/values/${KEY}" \
      -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}" \
      -H "Content-Type: application/json" \
      -d "$PRODUCT_DATA")
    
    if ! echo "$UPLOAD_RESPONSE" | grep -q '"success":true'; then
        echo "   ❌ Failed to upload $PRODUCT_ID"
        FAILED=$((FAILED + 1))
    fi
done

echo ""
echo "✅ Migration complete!"
echo ""
echo "Summary:"
echo "  Total products: $TOTAL_COUNT"
echo "  → PRODUCTS_REAL: $REAL_COUNT"
echo "  → PRODUCTS_VIRTUAL: $VIRTUAL_COUNT"
echo "  Failed: $FAILED"
echo ""
echo "Backup location: $BACKUP_DIR"
echo ""

if [ $FAILED -gt 0 ]; then
    echo "⚠️  Some products failed to migrate. Check logs above."
    exit 1
fi

echo "Next steps:"
echo "1. Verify products in Cloudflare dashboard"
echo "2. Test /debug/gamified-shop-test.html"
echo "3. Deploy worker: cd worker && wrangler publish"
echo ""
