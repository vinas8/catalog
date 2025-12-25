#!/bin/bash
set -e

echo "🚀 Deploying Worker with KV Bindings..."
source .env

METADATA=$(cat <<JSONEOF
{
  "main_module": "worker.js",
  "bindings": [
    {
      "type": "kv_namespace",
      "name": "USER_PRODUCTS",
      "namespace_id": "3b88d32c0a0540a8b557c5fb698ff61a"
    },
    {
      "type": "kv_namespace",
      "name": "PRODUCT_STATUS",
      "namespace_id": "57da5a83146147c8939e4070d4b4d4c1"
    },
    {
      "type": "kv_namespace",
      "name": "PRODUCTS",
      "namespace_id": "ecbcb79f3df64379863872965f993991"
    }
  ],
  "compatibility_date": "2024-12-21"
}
JSONEOF
)

echo "📦 Uploading with KV bindings..."
echo "   USER_PRODUCTS: 3b88d32c0a0540a8b557c5fb698ff61a"
echo "   PRODUCT_STATUS: 57da5a83146147c8939e4070d4b4d4c1"
echo "   PRODUCTS: ecbcb79f3df64379863872965f993991"
echo ""

RESPONSE=$(curl -s -X PUT \
  "https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/workers/scripts/catalog" \
  -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}" \
  -F "metadata=<(echo '$METADATA')" \
  -F "worker.js=@worker.js;type=application/javascript+module")

SUCCESS=$(echo "$RESPONSE" | python3 -c "import sys, json; print(json.load(sys.stdin).get('success', False))" 2>/dev/null || echo "False")

if [ "$SUCCESS" = "True" ]; then
  echo "✅ Deployed successfully!"
  echo ""
  echo "Testing /user-products endpoint..."
  sleep 3
  curl -s "https://catalog.navickaszilvinas.workers.dev/user-products?user=mjg355rky15zszouluo" | python3 -m json.tool
else
  echo "❌ Deployment failed:"
  echo "$RESPONSE" | python3 -m json.tool
fi
