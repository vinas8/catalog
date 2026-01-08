#!/bin/bash
# Quick script to upload test products via Worker API
# Uses the deployed Cloudflare Worker

WORKER_URL="https://serpent-town.vinas8.workers.dev"
PRODUCTS_FILE="data/products-real-test.json"

echo "🐍 Uploading test products to KV..."
echo "📦 File: $PRODUCTS_FILE"
echo "🔗 Worker: $WORKER_URL"
echo ""

# Read products
PRODUCTS=$(cat $PRODUCTS_FILE)

# Upload via Worker API (if endpoint exists)
curl -X POST "$WORKER_URL/admin/upload-products" \
  -H "Content-Type: application/json" \
  -d "$PRODUCTS" \
  2>&1

echo ""
echo "✅ Upload complete! Check:"
echo "   http://localhost:8000/catalog.html"
echo "   http://localhost:8000/debug/smri-runner.html"
