#!/bin/bash
# 🧬 Breeding Calculator - curl Test
# Tests that calculator.html loads correctly

echo "🧪 Testing Breeding Calculator..."
echo ""

PORT=8000
BASE_URL="http://localhost:${PORT}"

# Check if server is running
echo "📡 Checking if server is running on port ${PORT}..."
if ! curl -s "${BASE_URL}" > /dev/null; then
  echo "❌ Server not running. Start with: python3 -m http.server ${PORT}"
  exit 1
fi
echo "✅ Server is running"
echo ""

# Test calculator.html loads
echo "📄 Testing calculator.html..."
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "${BASE_URL}/calculator.html")
if [ "$RESPONSE" = "200" ]; then
  echo "✅ calculator.html loads (HTTP $RESPONSE)"
else
  echo "❌ calculator.html failed (HTTP $RESPONSE)"
  exit 1
fi

# Test that page contains breeding calculator content
echo "📄 Checking calculator.html content..."
CONTENT=$(curl -s "${BASE_URL}/calculator.html")

if echo "$CONTENT" | grep -q "Breeding Calculator"; then
  echo "✅ Contains 'Breeding Calculator' title"
else
  echo "❌ Missing 'Breeding Calculator' title"
  exit 1
fi

if echo "$CONTENT" | grep -q "genetics-core.js"; then
  echo "✅ Loads genetics-core.js module"
else
  echo "❌ Missing genetics-core.js import"
  exit 1
fi

if echo "$CONTENT" | grep -q "Select Males"; then
  echo "✅ Contains snake selection UI"
else
  echo "❌ Missing selection UI"
  exit 1
fi

# Test genetics module exists
echo "📦 Testing genetics module..."
GENETICS_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "${BASE_URL}/src/modules/breeding/genetics-core.js")
if [ "$GENETICS_RESPONSE" = "200" ]; then
  echo "✅ genetics-core.js exists (HTTP $GENETICS_RESPONSE)"
else
  echo "❌ genetics-core.js not found (HTTP $GENETICS_RESPONSE)"
  exit 1
fi

# Test debug/calc still works
echo "🔧 Testing debug/calc..."
DEBUG_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "${BASE_URL}/debug/calc/")
if [ "$DEBUG_RESPONSE" = "200" ]; then
  echo "✅ debug/calc/ still accessible (HTTP $DEBUG_RESPONSE)"
else
  echo "⚠️  debug/calc/ issue (HTTP $DEBUG_RESPONSE)"
fi

# Test farm link
echo "🏡 Testing farm integration..."
FARM_CONTENT=$(curl -s "${BASE_URL}/learn-farm.html")
if echo "$FARM_CONTENT" | grep -q "calculator.html"; then
  echo "✅ Farm links to calculator"
else
  echo "⚠️  Farm missing calculator link"
fi

# Test aquarium link
echo "🐠 Testing aquarium integration..."
AQUARIUM_CONTENT=$(curl -s "${BASE_URL}/debug/aquarium-shelf-demo.html")
if echo "$AQUARIUM_CONTENT" | grep -q "calculator.html"; then
  echo "✅ Aquarium links to calculator"
else
  echo "⚠️  Aquarium missing calculator link"
fi

echo ""
echo "=========================================="
echo "✅ ALL TESTS PASSED!"
echo "=========================================="
echo ""
echo "🔗 Test URLs:"
echo "   Production: ${BASE_URL}/calculator.html"
echo "   Debug:      ${BASE_URL}/debug/calc/"
echo "   Farm:       ${BASE_URL}/learn-farm.html"
echo "   Aquarium:   ${BASE_URL}/debug/aquarium-shelf-demo.html"
echo ""
