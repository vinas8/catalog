#!/bin/bash
set -e

echo "🚀 Deploying Cloudflare Worker via API (Module format)"
echo "======================================================="
echo ""

# Load env
source .env

WORKER_NAME="catalog"
ACCOUNT_ID="$CLOUDFLARE_ACCOUNT_ID"
API_TOKEN="$CLOUDFLARE_API_TOKEN"

# Create metadata for Module Worker
METADATA=$(cat <<EOF
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
    },
    {
      "type": "secret_text",
      "name": "STRIPE_SECRET_KEY",
      "text": "$STRIPE_SECRET_KEY"
    }
  ],
  "compatibility_date": "2024-12-21"
}
EOF
)

echo "📦 Uploading worker as Module Worker..."
echo "   Worker: $WORKER_NAME"
echo "   Account: $ACCOUNT_ID"
echo ""

# Use multipart form data for Module Worker
RESPONSE=$(curl -s -X PUT \
  "https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/workers/scripts/${WORKER_NAME}" \
  -H "Authorization: Bearer ${API_TOKEN}" \
  -F "metadata=@-;type=application/json" \
  -F "worker.js=@worker.js;type=application/javascript+module" \
  -F "email-service.js=@email-service.js;type=application/javascript+module" \
  <<< "$METADATA")

echo "📡 Response:"
echo "$RESPONSE" | python3 -m json.tool

SUCCESS=$(echo "$RESPONSE" | python3 -c "import sys, json; print(json.load(sys.stdin).get('success', False))" 2>/dev/null || echo "False")

if [ "$SUCCESS" = "True" ]; then
  echo ""
  echo "✅ Worker deployed successfully!"
  echo ""
  echo "🧪 Testing endpoints..."
  sleep 3
  
  echo ""
  echo "1️⃣ Testing /version:"
  curl -s "https://catalog.navickaszilvinas.workers.dev/version" | python3 -m json.tool || echo "Not available yet"
  
  echo ""
  echo "2️⃣ Testing /products:"
  curl -s "https://catalog.navickaszilvinas.workers.dev/products" | python3 -c 'import sys, json; data=json.load(sys.stdin); print("Products:", data.get("count", 0))' || echo "Not available yet"
  
  echo ""
  echo "🎉 Deployment complete!"
else
  echo ""
  echo "❌ Deployment failed - check errors above"
  exit 1
fi
