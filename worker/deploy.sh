#!/bin/bash
# Deploy worker using wrangler

set -e

echo "🚀 Deploying Cloudflare Worker v0.5.0..."
echo ""

# Load env
if [ -f .env ]; then
  export $(cat .env | grep -v '^#' | xargs)
fi

# Check wrangler
if ! command -v wrangler &> /dev/null; then
  echo "❌ wrangler not found. Installing..."
  npm install -g wrangler
fi

echo "📦 Deploying worker.js..."
wrangler deploy worker.js --name catalog

echo ""
echo "✅ Deployment complete!"
echo ""
echo "Testing /version endpoint..."
sleep 2

VERSION_RESPONSE=$(curl -s "https://catalog.navickaszilvinas.workers.dev/version")
echo "$VERSION_RESPONSE" | python3 -m json.tool

echo ""
echo "🎉 Worker deployed successfully!"
