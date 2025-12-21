#!/bin/bash
# Deploy worker via Cloudflare API

ACCOUNT_ID="e24c9f59eed424bd6d04e0f10fe0886f"
KV_NAMESPACE_ID="3b88d32c0a0540a8b557c5fb698ff61a"
WORKER_NAME="serpent-town-api"

echo "🚀 Deploying Cloudflare Worker via API"
echo ""

# Check if API token is provided
if [ -z "$CLOUDFLARE_API_TOKEN" ]; then
  echo "⚠️  Need Cloudflare API Token"
  echo ""
  echo "Get it from: https://dash.cloudflare.com/profile/api-tokens"
  echo ""
  echo "Then run:"
  echo "export CLOUDFLARE_API_TOKEN='your_token_here'"
  echo "./deploy-worker-api.sh"
  exit 1
fi

echo "📦 Uploading worker code..."

# Upload worker script
curl -X PUT "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/workers/scripts/$WORKER_NAME" \
  -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
  -F "metadata=@worker-metadata.json;type=application/json" \
  -F "script=@worker/worker.js;type=application/javascript+module"

echo ""
echo "✅ Worker deployed!"
echo ""
echo "🔗 Your worker URL:"
echo "https://serpent-town-api.YOUR_SUBDOMAIN.workers.dev"
