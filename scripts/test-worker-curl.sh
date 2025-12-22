#!/bin/bash
# Test Cloudflare Worker endpoints with curl

WORKER_URL="https://catalog.navickaszilvinas.workers.dev"

echo "🧪 Testing Serpent Town Worker Endpoints"
echo "=========================================="
echo ""

# Test 1: User Products Endpoint (GET)
echo "📦 Test 1: GET /user-products?user=test_123"
echo "-------------------------------------------"
curl -X GET "${WORKER_URL}/user-products?user=test_123" \
  -H "Content-Type: application/json" \
  -w "\nStatus: %{http_code}\nTime: %{time_total}s\n" \
  -s
echo ""
echo ""

# Test 2: Stripe Webhook Endpoint (POST) - Test payload
echo "💳 Test 2: POST /stripe-webhook (test event)"
echo "-------------------------------------------"
curl -X POST "${WORKER_URL}/stripe-webhook" \
  -H "Content-Type: application/json" \
  -H "Stripe-Signature: test_signature" \
  -d '{
    "type": "checkout.session.completed",
    "data": {
      "object": {
        "id": "cs_test_123",
        "client_reference_id": "test_123",
        "line_items": {
          "data": [{
            "price": {
              "product": "prod_test_snake"
            }
          }]
        }
      }
    }
  }' \
  -w "\nStatus: %{http_code}\nTime: %{time_total}s\n" \
  -s
echo ""
echo ""

# Test 3: Health Check / Root
echo "🏥 Test 3: GET / (health check)"
echo "-------------------------------"
curl -X GET "${WORKER_URL}/" \
  -w "\nStatus: %{http_code}\nTime: %{time_total}s\n" \
  -s
echo ""
echo ""

# Test 4: CORS Preflight
echo "🌐 Test 4: OPTIONS /user-products (CORS)"
echo "----------------------------------------"
curl -X OPTIONS "${WORKER_URL}/user-products" \
  -H "Origin: https://vinas8.github.io" \
  -H "Access-Control-Request-Method: GET" \
  -v \
  2>&1 | grep -E "(< HTTP|< Access-Control)"
echo ""

echo "✅ Tests complete!"
