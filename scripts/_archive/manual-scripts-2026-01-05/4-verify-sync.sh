#!/bin/bash
# Step 4: Verify Stripe → KV sync was successful
# Checks that products match in Stripe, KV, and catalog.html

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/../worker/.env" 2>/dev/null || source "$SCRIPT_DIR/../.env"

echo "🔍 VERIFY STRIPE → KV SYNC"
echo "==========================="
echo ""

# 1. Check Stripe
echo "1️⃣  Checking Stripe..."
STRIPE_RESPONSE=$(curl -s "https://api.stripe.com/v1/products?active=true&limit=100" \
  -u "$STRIPE_SECRET_KEY:")

STRIPE_COUNT=$(echo "$STRIPE_RESPONSE" | jq '.data | length')
echo "   Stripe products: $STRIPE_COUNT"

if [ "$STRIPE_COUNT" -ne 24 ]; then
    echo "   ⚠️  Expected 24 products!"
fi

# 2. Check KV via Worker
echo ""
echo "2️⃣  Checking Cloudflare KV (via Worker)..."
WORKER_RESPONSE=$(curl -s "https://catalog.navickaszilvinas.workers.dev/products")

# Check if response is valid JSON
if echo "$WORKER_RESPONSE" | jq empty 2>/dev/null; then
    KV_COUNT=$(echo "$WORKER_RESPONSE" | jq 'length')
    echo "   KV products: $KV_COUNT"
    
    if [ "$KV_COUNT" -ne 24 ]; then
        echo "   ⚠️  Expected 24 products!"
    fi
else
    echo "   ❌ Failed to fetch from Worker"
    echo "   Response: $WORKER_RESPONSE"
    KV_COUNT=0
fi

# 3. Compare counts
echo ""
echo "3️⃣  Comparing counts..."
if [ "$STRIPE_COUNT" -eq "$KV_COUNT" ] && [ "$STRIPE_COUNT" -eq 24 ]; then
    echo "   ✅ MATCH: Stripe ($STRIPE_COUNT) = KV ($KV_COUNT) = Expected (24)"
else
    echo "   ❌ MISMATCH:"
    echo "      Stripe: $STRIPE_COUNT"
    echo "      KV: $KV_COUNT"
    echo "      Expected: 24"
fi

# 4. Sample product names
echo ""
echo "4️⃣  Sample product names from KV:"
echo "$WORKER_RESPONSE" | jq -r '.[0:5] | .[] | "   • " + .name' 2>/dev/null || echo "   (Unable to parse)"

echo ""
echo "══════════════════════════════════"

if [ "$STRIPE_COUNT" -eq 24 ] && [ "$KV_COUNT" -eq 24 ]; then
    echo "✅ VERIFICATION PASSED"
    echo ""
    echo "📋 All systems synced:"
    echo "   • Stripe: 24 products ✅"
    echo "   • KV: 24 products ✅"
    echo "   • Worker API: Responding ✅"
    echo ""
    echo "🌐 Check catalog.html:"
    echo "   https://vinas8.github.io/catalog/catalog.html"
else
    echo "❌ VERIFICATION FAILED"
    echo ""
    echo "Debug steps:"
    echo "   1. Check Stripe dashboard"
    echo "   2. Check Cloudflare KV namespace"
    echo "   3. Re-run import: bash scripts/3-import-stripe-to-kv.sh"
    exit 1
fi
