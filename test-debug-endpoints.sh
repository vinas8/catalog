#!/bin/bash
# Test all debug.html API endpoints

WORKER_URL="https://catalog.navickaszilvinas.workers.dev"
TEST_USER="test_$(date +%s)"

echo "🧪 Testing Debug Dashboard Endpoints"
echo "======================================"
echo "Worker: $WORKER_URL"
echo "Test User: $TEST_USER"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

pass=0
fail=0

test_endpoint() {
  local name="$1"
  local method="$2"
  local url="$3"
  local data="$4"
  
  echo -n "Testing $name... "
  
  if [ "$method" = "GET" ]; then
    response=$(timeout 10 curl -s -w "\n%{http_code}" "$url" 2>&1)
  else
    response=$(timeout 10 curl -s -w "\n%{http_code}" -X "$method" -H "Content-Type: application/json" -d "$data" "$url" 2>&1)
  fi
  
  status_code=$(echo "$response" | tail -1)
  body=$(echo "$response" | head -n -1)
  
  if [ "$status_code" -ge 200 ] && [ "$status_code" -lt 500 ]; then
    echo -e "${GREEN}✅ $status_code${NC}"
    echo "   Response: $(echo $body | head -c 100)..."
    ((pass++))
  else
    echo -e "${RED}❌ $status_code${NC}"
    echo "   Error: $body"
    ((fail++))
  fi
  echo ""
}

# Test 1: GET /user-products
test_endpoint \
  "GET /user-products" \
  "GET" \
  "$WORKER_URL/user-products?user=$TEST_USER"

# Test 2: GET /user-data
test_endpoint \
  "GET /user-data" \
  "GET" \
  "$WORKER_URL/user-data?user=$TEST_USER"

# Test 3: POST /assign-product
test_endpoint \
  "POST /assign-product" \
  "POST" \
  "$WORKER_URL/assign-product" \
  "{\"user_id\":\"$TEST_USER\",\"product_id\":\"prod_TdKcnyjt5Jk0U2\"}"

# Test 4: POST /register-user
test_endpoint \
  "POST /register-user" \
  "POST" \
  "$WORKER_URL/register-user" \
  "{\"user_id\":\"$TEST_USER\",\"username\":\"TestUser\",\"email\":\"test@example.com\"}"

# Test 5: GET /product-status
test_endpoint \
  "GET /product-status" \
  "GET" \
  "$WORKER_URL/product-status?id=prod_TdKcnyjt5Jk0U2"

# Test 6: GET /products
test_endpoint \
  "GET /products" \
  "GET" \
  "$WORKER_URL/products"

# Test 7: POST /stripe-webhook (should fail auth)
test_endpoint \
  "POST /stripe-webhook (no auth)" \
  "POST" \
  "$WORKER_URL/stripe-webhook" \
  "{\"type\":\"checkout.session.completed\",\"data\":{}}"

echo "======================================"
echo -e "${GREEN}✅ Passed: $pass${NC}"
echo -e "${RED}❌ Failed: $fail${NC}"
echo ""

if [ $fail -eq 0 ]; then
  echo -e "${GREEN}🎉 All endpoints working!${NC}"
  exit 0
else
  echo -e "${YELLOW}⚠️  Some endpoints failed${NC}"
  exit 1
fi
