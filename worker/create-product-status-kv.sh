#!/bin/bash
# Create PRODUCT_STATUS KV namespace

echo "🔧 Creating PRODUCT_STATUS KV namespace..."

# Create namespace
wrangler kv:namespace create "PRODUCT_STATUS"

echo ""
echo "✅ Done! Copy the namespace ID and update wrangler.toml"
echo ""
echo "Replace this line:"
echo '  id = "PLACEHOLDER_CREATE_THIS_NAMESPACE"'
echo ""
echo "With the ID shown above"
