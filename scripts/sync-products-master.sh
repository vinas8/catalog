#!/bin/bash
# Master script: Complete Stripe → KV product sync workflow
# Runs all 4 steps in sequence with confirmations

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "╔════════════════════════════════════════════════════════╗"
echo "║                                                        ║"
echo "║   🐍 SERPENT TOWN - STRIPE PRODUCT SYNC WORKFLOW       ║"
echo "║                                                        ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""
echo "This will:"
echo "  1. Clear all Stripe products (test mode)"
echo "  2. Upload 24 new products with metadata"
echo "  3. Import Stripe → Cloudflare KV"
echo "  4. Verify all systems match"
echo ""
echo "⚠️  WARNING: This deletes ALL existing Stripe products!"
echo ""

read -p "Ready to proceed? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
    echo "❌ Aborted"
    exit 0
fi

echo ""
echo "════════════════════════════════════════════════════════"
echo "STEP 1/4: Clear Stripe Products"
echo "════════════════════════════════════════════════════════"
echo ""

bash "$SCRIPT_DIR/1-clear-stripe-products.sh"

if [ $? -ne 0 ]; then
    echo "❌ Step 1 failed!"
    exit 1
fi

echo ""
read -p "Continue to Step 2? (yes/no): " confirm
if [ "$confirm" != "yes" ]; then
    echo "❌ Stopped at Step 1"
    exit 0
fi

echo ""
echo "════════════════════════════════════════════════════════"
echo "STEP 2/4: Upload Products to Stripe"
echo "════════════════════════════════════════════════════════"
echo ""

bash "$SCRIPT_DIR/2-upload-products-to-stripe.sh"

if [ $? -ne 0 ]; then
    echo "❌ Step 2 failed!"
    exit 1
fi

echo ""
read -p "Continue to Step 3? (yes/no): " confirm
if [ "$confirm" != "yes" ]; then
    echo "❌ Stopped at Step 2"
    exit 0
fi

echo ""
echo "════════════════════════════════════════════════════════"
echo "STEP 3/4: Import Stripe → KV"
echo "════════════════════════════════════════════════════════"
echo ""

bash "$SCRIPT_DIR/3-import-stripe-to-kv.sh"

if [ $? -ne 0 ]; then
    echo "❌ Step 3 failed!"
    exit 1
fi

echo ""
echo "════════════════════════════════════════════════════════"
echo "STEP 4/4: Verify Sync"
echo "════════════════════════════════════════════════════════"
echo ""

bash "$SCRIPT_DIR/4-verify-sync.sh"

if [ $? -ne 0 ]; then
    echo "❌ Step 4 failed!"
    exit 1
fi

echo ""
echo "╔════════════════════════════════════════════════════════╗"
echo "║                                                        ║"
echo "║   ✅  SYNC COMPLETE!                                   ║"
echo "║                                                        ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""
echo "📊 Final Status:"
echo "   • Stripe: 24 products ✅"
echo "   • Cloudflare KV: 24 products ✅"
echo "   • Worker API: Synced ✅"
echo ""
echo "🌐 View products:"
echo "   • Catalog: https://vinas8.github.io/catalog/catalog.html"
echo "   • API: https://catalog.navickaszilvinas.workers.dev/products"
echo "   • Stripe: https://dashboard.stripe.com/test/products"
echo ""
echo "📄 Output files:"
echo "   • data/new-products-2025.json (source)"
echo "   • data/stripe-products-uploaded.json (Stripe response)"
echo ""
