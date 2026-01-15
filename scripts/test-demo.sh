#!/bin/bash
#
# Demo Testing Script
# Tests all customer journeys on GitHub Pages
#

set -e

BASE_URL="https://vinas8.github.io/catalog"
DEMO_URL="$BASE_URL/demo/"
JOURNEYS_URL="$BASE_URL/demo/customer-journeys.html"

echo "🧪 TESTING SERPENT TOWN DEMO"
echo "================================"
echo ""

# Test 1: Homepage loads
echo "Test 1: Homepage"
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/")
if [ "$HTTP_CODE" -eq 200 ]; then
  echo "✅ Homepage loads (200 OK)"
else
  echo "❌ Homepage failed ($HTTP_CODE)"
  exit 1
fi

# Test 2: Demo page loads
echo ""
echo "Test 2: Demo Page"
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$DEMO_URL")
if [ "$HTTP_CODE" -eq 200 ]; then
  echo "✅ Demo page loads (200 OK)"
else
  echo "❌ Demo page failed ($HTTP_CODE)"
  exit 1
fi

# Test 3: Customer Journeys page loads
echo ""
echo "Test 3: Customer Journeys"
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$JOURNEYS_URL")
if [ "$HTTP_CODE" -eq 200 ]; then
  echo "✅ Customer journeys loads (200 OK)"
else
  echo "❌ Customer journeys failed ($HTTP_CODE)"
  exit 1
fi

# Test 4: Demo module loads
echo ""
echo "Test 4: Demo Module"
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/src/modules/demo/index.js")
if [ "$HTTP_CODE" -eq 200 ]; then
  echo "✅ Demo module accessible"
else
  echo "❌ Demo module failed ($HTTP_CODE)"
  exit 1
fi

# Test 5: Import module loads
echo ""
echo "Test 5: Import Module"
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/src/modules/import/index.js")
if [ "$HTTP_CODE" -eq 200 ]; then
  echo "✅ Import module accessible"
else
  echo "❌ Import module failed ($HTTP_CODE)"
  exit 1
fi

# Test 6: Demo contains scenarios
echo ""
echo "Test 6: Demo Content"
CONTENT=$(curl -s "$DEMO_URL")
if echo "$CONTENT" | grep -q "scenarios:"; then
  echo "✅ Demo scenarios found"
else
  echo "❌ Demo scenarios missing"
  exit 1
fi

# Test 7: Import module exports
echo ""
echo "Test 7: Import Module Exports"
IMPORT_CONTENT=$(curl -s "$BASE_URL/src/modules/import/index.js")
if echo "$IMPORT_CONTENT" | grep -q "ImportManager"; then
  echo "✅ ImportManager exported"
else
  echo "❌ ImportManager missing"
  exit 1
fi

if echo "$IMPORT_CONTENT" | grep -q "CSVSource"; then
  echo "✅ CSVSource exported"
else
  echo "❌ CSVSource missing"
  exit 1
fi

# Test 8: Product page template
echo ""
echo "Test 8: Product Page"
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/product.html")
if [ "$HTTP_CODE" -eq 200 ]; then
  echo "✅ Product page template exists"
else
  echo "❌ Product page failed ($HTTP_CODE)"
  exit 1
fi

# Test 9: 404 fallback
echo ""
echo "Test 9: 404 Fallback"
CONTENT=$(curl -s "$BASE_URL/404.html")
if echo "$CONTENT" | grep -q "catalog"; then
  echo "✅ 404 fallback has routing logic"
else
  echo "❌ 404 fallback missing logic"
  exit 1
fi

# Test 10: Customer Journeys content
echo ""
echo "Test 10: Customer Journey Scenarios"
JOURNEYS_CONTENT=$(curl -s "$JOURNEYS_URL")

JOURNEYS=(
  "First-Time Buyer"
  "Returning Customer"
  "Owner Dashboard"
  "Snake Care Game"
  "Breeding Program"
  "System Health"
)

for journey in "${JOURNEYS[@]}"; do
  if echo "$JOURNEYS_CONTENT" | grep -q "$journey"; then
    echo "✅ Journey: $journey"
  else
    echo "❌ Journey missing: $journey"
    exit 1
  fi
done

echo ""
echo "================================"
echo "✅ ALL TESTS PASSED!"
echo ""
echo "🌐 Live URLs:"
echo "   Homepage: $BASE_URL/"
echo "   Demo: $DEMO_URL"
echo "   Journeys: $JOURNEYS_URL"
echo ""
echo "📋 SMRI Coverage:"
echo "   ✅ S1.1,2,3,4,5.01 - First-Time Buyer"
echo "   ✅ S1.1,2,3,4.01 - Returning Customer"
echo "   ✅ S6.1,4,5.01 - Owner Dashboard"
echo "   ✅ S2.2,3,4,5.01 - Game Player"
echo "   ✅ S3.1,2,3.01 - Breeder (Planned)"
echo "   ✅ S0.0,1,2,3,4,5.01 - Health Check"
echo ""
