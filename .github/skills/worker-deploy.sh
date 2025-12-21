#!/bin/bash
# Deploy Cloudflare Worker (safe operation)
# Usage: Deploy worker changes to production

cd /root/catalog/worker || exit 1

echo "🚀 Deploying Cloudflare Worker..."
wrangler publish worker.js

exit $?
