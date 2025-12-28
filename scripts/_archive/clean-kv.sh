#!/bin/bash
# Clean all KV data for fresh start

echo "🧹 Cleaning Cloudflare KV data..."
echo ""

USER_PRODUCTS_NS="3b88d32c0a0540a8b557c5fb698ff61a"

echo "📋 Listing all keys in USER_PRODUCTS namespace..."
wrangler kv:key list --namespace-id=$USER_PRODUCTS_NS

echo ""
echo "❓ Delete all keys? (y/N)"
read -r response

if [[ "$response" =~ ^[Yy]$ ]]; then
  echo "🗑️ Deleting all keys..."
  
  # Get all keys and delete them
  keys=$(wrangler kv:key list --namespace-id=$USER_PRODUCTS_NS | jq -r '.[].name')
  
  if [ -z "$keys" ]; then
    echo "✅ No keys to delete - already clean!"
  else
    echo "$keys" | while read -r key; do
      if [ ! -z "$key" ]; then
        echo "  Deleting: $key"
        wrangler kv:key delete "$key" --namespace-id=$USER_PRODUCTS_NS
      fi
    done
    echo "✅ All keys deleted!"
  fi
else
  echo "❌ Cancelled"
fi

echo ""
echo "📊 Final state:"
wrangler kv:key list --namespace-id=$USER_PRODUCTS_NS
