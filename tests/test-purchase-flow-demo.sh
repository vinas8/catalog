#!/bin/bash
###############################################################################
# Purchase Flow Demo - CLI Integration Test
# Tests the feature flag integration without browser
###############################################################################

CATALOG_URL="http://localhost:8000"
FLOW_URL="http://localhost:8005"
VERSION="0.7.50"

echo "🐍 Purchase Flow Demo - Integration Test"
echo "=========================================="
echo ""

passed=0
failed=0

# Test 1: Flow Server Health
echo "📊 Test 1: Flow Server Health Check"
health=$(curl -s "$FLOW_URL/api/health")
if echo "$health" | grep -q '"status":"ok"' && echo "$health" | grep -q 'S1.1,2,3,4,5.01'; then
  echo "✅ Flow server healthy"
  ((passed++))
else
  echo "❌ Flow server unhealthy"
  echo "   Response: $health"
  ((failed++))
fi
echo ""

# Test 2: Demo Page Loads
echo "📄 Test 2: Demo Page Loads with Version"
demo_page=$(curl -s "$CATALOG_URL/demo-purchase-flow.html?v=$VERSION")
if echo "$demo_page" | grep -q "v$VERSION" && echo "$demo_page" | grep -q "Purchase Flow"; then
  echo "✅ Demo page loads with v$VERSION"
  ((passed++))
else
  echo "❌ Demo page missing version or title"
  ((failed++))
fi
echo ""

# Test 3: Feature Flags Module Loads
echo "🎛️ Test 3: Feature Flags Module with Cache Bust"
flags=$(curl -s "$CATALOG_URL/src/modules/config/feature-flags.js?v=$VERSION")
if echo "$flags" | grep -q "USE_EXTERNAL_PURCHASE_FLOW" && echo "$flags" | grep -q "FEATURE_FLAGS"; then
  echo "✅ Feature flags module loads"
  ((passed++))
else
  echo "❌ Feature flags module failed"
  ((failed++))
fi
echo ""

# Test 4: Flow Products API
echo "🛍️ Test 4: Flow Products API"
products=$(curl -s "$FLOW_URL/api/products")
product_count=$(echo "$products" | grep -o '"id"' | wc -l)
if [ "$product_count" -ge 4 ]; then
  echo "✅ Products API returns $product_count products"
  ((passed++))
else
  echo "❌ Products API returned only $product_count products"
  ((failed++))
fi
echo ""

# Test 5: Checkout Session Creation
echo "💳 Test 5: Checkout Session Creation"
checkout=$(curl -s -X POST "$FLOW_URL/api/create-checkout-session" \
  -H "Content-Type: application/json" \
  -d '{"productId":"prod_1","userId":"test_user_123"}')

if echo "$checkout" | grep -q '"id"' && echo "$checkout" | grep -q '"session_'; then
  session_id=$(echo "$checkout" | grep -o '"id":"[^"]*"' | cut -d'"' -f4)
  echo "✅ Checkout session created: $session_id"
  ((passed++))
else
  echo "❌ Checkout session creation failed"
  echo "   Response: $checkout"
  ((failed++))
fi
echo ""

# Test 6: Demo Page HTML Structure
echo "🏗️ Test 6: Demo Page Structure"
if echo "$demo_page" | grep -q "flowToggle" && \
   echo "$demo_page" | grep -q "productsGrid" && \
   echo "$demo_page" | grep -q "logPanel"; then
  echo "✅ Demo page has correct structure"
  ((passed++))
else
  echo "❌ Demo page missing required elements"
  ((failed++))
fi
echo ""

# Test 7: Feature Flag Default State
echo "🔴 Test 7: Feature Flag Default (Disabled)"
if echo "$flags" | grep -q "USE_EXTERNAL_PURCHASE_FLOW: false"; then
  echo "✅ Feature flag defaults to disabled"
  ((passed++))
else
  echo "❌ Feature flag should default to false"
  ((failed++))
fi
echo ""

# Test 8: Cache Busting in Demo Page
echo "🔄 Test 8: Cache Busting Implementation"
if echo "$demo_page" | grep -q "CACHE_VERSION = '$VERSION'" && \
   echo "$demo_page" | grep -q '?v=${CACHE_VERSION}'; then
  echo "✅ Cache busting properly implemented"
  ((passed++))
else
  echo "❌ Cache busting not properly implemented"
  ((failed++))
fi
echo ""

# Test 9: Flow API Endpoints
echo "🔗 Test 9: All Flow API Endpoints"
endpoints_ok=0
endpoints=(
  "/api/health"
  "/api/products"
)

for endpoint in "${endpoints[@]}"; do
  status=$(curl -s -o /dev/null -w "%{http_code}" "$FLOW_URL$endpoint")
  if [ "$status" = "200" ]; then
    ((endpoints_ok++))
  fi
done

if [ "$endpoints_ok" -eq "${#endpoints[@]}" ]; then
  echo "✅ All $endpoints_ok endpoints responding"
  ((passed++))
else
  echo "❌ Only $endpoints_ok/${#endpoints[@]} endpoints responding"
  ((failed++))
fi
echo ""

# Test 10: Product Details
echo "🐍 Test 10: Product Data Structure"
first_product=$(echo "$products" | python3 -c "import sys, json; print(json.dumps(json.load(sys.stdin)[0], indent=2))" 2>/dev/null)
if echo "$first_product" | grep -q '"name"' && \
   echo "$first_product" | grep -q '"price"' && \
   echo "$first_product" | grep -q '"morph"'; then
  echo "✅ Products have correct data structure"
  ((passed++))
else
  echo "❌ Product data structure incomplete"
  ((failed++))
fi
echo ""

# Summary
total=$((passed + failed))
success_rate=$(awk "BEGIN {printf \"%.1f\", ($passed/$total)*100}")

echo "=========================================="
echo "📊 TEST SUMMARY"
echo "=========================================="
echo "Total Tests: $total"
echo "Passed: $passed ✅"
echo "Failed: $failed ❌"
echo "Success Rate: $success_rate%"
echo "=========================================="

if [ $failed -eq 0 ]; then
  echo ""
  echo "🎉 ALL TESTS PASSED!"
  echo ""
  echo "🌐 Access URLs:"
  echo "   Catalog Demo: $CATALOG_URL/demo-purchase-flow.html?v=$VERSION"
  echo "   Flow Demo:    $FLOW_URL/demo.html"
  echo ""
  exit 0
else
  echo ""
  echo "⚠️ Some tests failed. Review above."
  echo ""
  exit 1
fi
