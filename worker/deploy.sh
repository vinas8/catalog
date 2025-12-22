#!/bin/bash
# Deploy worker using wrangler

export CLOUDFLARE_API_TOKEN=$(grep CLOUDFLARE_API_TOKEN ../.env | cut -d '=' -f2)
export CLOUDFLARE_ACCOUNT_ID=$(grep CLOUDFLARE_ACCOUNT_ID ../.env | cut -d '=' -f2)

echo "🚀 Deploying worker to Cloudflare..."
echo "Account ID: $CLOUDFLARE_ACCOUNT_ID"
echo ""

npx wrangler@latest deploy worker.js --compatibility-date 2024-12-21
