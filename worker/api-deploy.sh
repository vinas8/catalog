#!/bin/bash
# Deploy worker via Cloudflare API

set -e

echo "🚀 Deploying Worker via Cloudflare API..."
echo ""

# Load credentials
source .env

WORKER_NAME="catalog"
SCRIPT_FILE="worker.js"

# Read worker script
WORKER_SCRIPT=$(cat $SCRIPT_FILE)

echo "📦 Uploading worker script..."
echo "   Name: $WORKER_NAME"
echo "   File: $SCRIPT_FILE"
echo ""

# Deploy via API
RESPONSE=$(curl -s -X PUT \
  "https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/workers/scripts/${WORKER_NAME}" \
  -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}" \
  -H "Content-Type: application/javascript" \
  --data-binary "@${SCRIPT_FILE}")

SUCCESS=$(echo "$RESPONSE" | python3 -c "import sys, json; print(json.load(sys.stdin).get('success', False))")

if [ "$SUCCESS" = "True" ]; then
  echo "✅ Worker deployed successfully!"
  echo ""
  echo "Testing /version endpoint..."
  sleep 2
  
  VERSION_RESPONSE=$(curl -s "https://catalog.navickaszilvinas.workers.dev/version")
  echo "$VERSION_RESPONSE" | python3 -m json.tool
  
  echo ""
  echo "🎉 Deployment complete!"
else
  echo "❌ Deployment failed:"
  echo "$RESPONSE" | python3 -m json.tool
  exit 1
fi
