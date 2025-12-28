#!/bin/bash
# Clear all KV data using curl and Cloudflare API
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/../.env"

echo "🗑️  Cloudflare KV Data Cleanup"
echo "================================"
echo ""

# Get all keys
echo "🔍 Fetching all keys..."
KEYS_JSON=$(curl -s -X GET \
  "https://api.cloudflare.com/client/v4/accounts/$CLOUDFLARE_ACCOUNT_ID/storage/kv/namespaces/$CLOUDFLARE_KV_NAMESPACE_ID/keys" \
  -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
  -H "Content-Type: application/json")

KEY_COUNT=$(echo "$KEYS_JSON" | grep -o '"name"' | wc -l)
echo "Found $KEY_COUNT keys"

if [ "$KEY_COUNT" -eq 0 ]; then
    echo "✅ KV is already empty"
    exit 0
fi

echo ""
echo "⚠️  WARNING: This will DELETE ALL $KEY_COUNT keys!"
echo ""
read -p "Type 'yes' to confirm: " confirm

if [ "$confirm" != "yes" ]; then
    echo "❌ Aborted"
    exit 0
fi

echo ""
echo "🗑️  Deleting keys..."

# Extract key names and delete each one
echo "$KEYS_JSON" | grep -o '"name":"[^"]*"' | sed 's/"name":"//g' | sed 's/"//g' | while read key; do
    echo "  Deleting: $key"
    curl -s -X DELETE \
      "https://api.cloudflare.com/client/v4/accounts/$CLOUDFLARE_ACCOUNT_ID/storage/kv/namespaces/$CLOUDFLARE_KV_NAMESPACE_ID/values/$key" \
      -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" > /dev/null
done

echo ""
echo "✅ Deletion complete!"
echo ""

# Verify
echo "📊 Verification..."
REMAINING=$(curl -s -X GET \
  "https://api.cloudflare.com/client/v4/accounts/$CLOUDFLARE_ACCOUNT_ID/storage/kv/namespaces/$CLOUDFLARE_KV_NAMESPACE_ID/keys" \
  -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" | grep -o '"name"' | wc -l)

echo "Keys remaining: $REMAINING"

if [ "$REMAINING" -eq 0 ]; then
    echo "✅ KV cleanup complete!"
else
    echo "⚠️  Warning: $REMAINING keys still remain"
fi
