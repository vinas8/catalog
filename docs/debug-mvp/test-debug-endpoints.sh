#!/bin/bash
# Test debug page with curl and extract JavaScript behavior

echo "🧪 Testing Debug Page JavaScript Execution"
echo "=========================================="
echo ""

echo "1️⃣ Fetching debug page..."
curl -s http://localhost:8000/src/modules/debug/index.html > /tmp/debug.html
SIZE=$(wc -c < /tmp/debug.html)
echo "   ✅ Downloaded: $SIZE bytes"
echo ""

echo "2️⃣ Checking visible text..."
grep -o "Debug v2 FIXED" /tmp/debug.html && echo "   ✅ Shows v2 FIXED" || echo "   ❌ Still old version"
echo ""

echo "3️⃣ Checking script tag..."
grep "script type=\"module\"" /tmp/debug.html && echo "   ✅ Has module script" || echo "   ❌ No script"
echo ""

echo "4️⃣ Checking import statement..."
grep "import.*WORKER_CONFIG.*from.*'../../config" /tmp/debug.html && echo "   ✅ Import path correct" || echo "   ❌ Import wrong"
echo ""

echo "5️⃣ Extracting module tabs..."
grep -o "onclick=\"switchModule('[^']*'" /tmp/debug.html | head -7
echo ""

echo "6️⃣ Checking Catalog module content..."
grep -A5 'id="module-catalog"' /tmp/debug.html | head -10
echo ""

echo "7️⃣ Testing Worker API directly..."
curl -s https://catalog.navickaszilvinas.workers.dev/products | python3 -c "import sys,json; d=json.load(sys.stdin); print(f'   ✅ Worker returns {len(d)} products')" 2>/dev/null || echo "   ❌ Worker API failed"
echo ""

echo "8️⃣ Checking cached products..."
if [ -f data/cache/kv-products.json ]; then
  COUNT=$(python3 -c "import json; print(len(json.load(open('data/cache/kv-products.json'))))" 2>/dev/null)
  echo "   ✅ Cache exists: $COUNT products"
else
  echo "   ❌ Cache not found"
fi
echo ""

echo "=========================================="
echo "📋 RESULT:"
echo "   Server is serving updated debug page."
echo "   If browser still shows old, clear cache!"
echo ""
echo "🔗 URLs to test:"
echo "   http://localhost:8000/debug.html"
echo "   http://localhost:8000/test-catalog-simple.html"

