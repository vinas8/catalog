#!/bin/bash
# KV Data Management Script
# Clears all data from Cloudflare KV namespaces

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/../.env"

echo "🗑️  Cloudflare KV Data Cleanup"
echo "================================"
echo ""
echo "⚠️  WARNING: This will DELETE ALL data from KV namespaces!"
echo ""
echo "Namespaces to clear:"
echo "  - USER_PRODUCTS"
echo "  - PRODUCT_STATUS"
echo "  - USERS"
echo ""
read -p "Are you sure you want to continue? (type 'yes' to confirm): " confirm

if [ "$confirm" != "yes" ]; then
    echo "❌ Aborted"
    exit 0
fi

echo ""
echo "🔍 Fetching all keys from USER_PRODUCTS namespace..."
npx wrangler kv:key list --namespace-id="$CLOUDFLARE_KV_NAMESPACE_ID" > /tmp/kv_keys.json

KEY_COUNT=$(cat /tmp/kv_keys.json | jq '. | length')
echo "Found $KEY_COUNT keys"

if [ "$KEY_COUNT" -eq 0 ]; then
    echo "✅ KV is already empty"
    exit 0
fi

echo ""
echo "🗑️  Deleting keys..."

cat /tmp/kv_keys.json | jq -r '.[].name' | while read key; do
    echo "  Deleting: $key"
    npx wrangler kv:key delete --namespace-id="$CLOUDFLARE_KV_NAMESPACE_ID" "$key"
done

echo ""
echo "✅ All KV data cleared successfully"
echo ""
echo "📊 Verification:"
npx wrangler kv:key list --namespace-id="$CLOUDFLARE_KV_NAMESPACE_ID"

echo ""
echo "✅ KV cleanup complete!"
