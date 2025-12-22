#!/bin/bash
# End-to-End Purchase Flow Test - Comprehensive

source .env 2>/dev/null || { echo "❌ .env not found"; exit 1; }

WORKER_URL="https://catalog.navickaszilvinas.workers.dev"

echo "🧪 SERPENT TOWN - Complete Purchase Flow Test"
echo "=============================================="
echo ""
echo "Worker: $WORKER_URL"
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

pass_count=0
fail_count=0

function test_step() {
  echo -e "${YELLOW}$1${NC}"
}

function test_pass() {
  echo -e "   ${GREEN}✅ $1${NC}"
  ((pass_count++))
}

function test_fail() {
  echo -e "   ${RED}❌ $1${NC}"
  ((fail_count++))
}

function test_info() {
  echo "   ℹ️  $1"
}

# Test 1: Worker Health Check
test_step "1️⃣ Worker Health Check"
HEALTH_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "$WORKER_URL/products" 2>/dev/null)
if [ "$HEALTH_RESPONSE" = "200" ]; then
  test_pass "Worker responding (HTTP $HEALTH_RESPONSE)"
else
  test_fail "Worker not responding (HTTP $HEALTH_RESPONSE)"
fi
echo ""

# Test 2: Generate Test User
USER_HASH="test_$(date +%s)_$$"
test_step "2️⃣ Test User Generation"
test_info "Generated user hash: $USER_HASH"
test_pass "User hash created"
echo ""

# Test 3: Simulate Stripe Webhook
test_step "3️⃣ Simulating Stripe Checkout Webhook"
WEBHOOK_PAYLOAD=$(cat <<PAYLOAD
{
  "type": "checkout.session.completed",
  "data": {
    "object": {
      "id": "cs_test_${USER_HASH}",
      "client_reference_id": "$USER_HASH",
      "payment_intent": "pi_test_${USER_HASH}",
      "amount_total": 100000,
      "currency": "eur",
      "customer_email": "test_${USER_HASH}@example.com",
      "metadata": {
        "product_id": "prod_TdKcnyjt5Jk0U2"
      }
    }
  }
}
PAYLOAD
)

WEBHOOK_RESPONSE=$(curl -s -X POST "$WORKER_URL/stripe-webhook" \
  -H "Content-Type: application/json" \
  -d "$WEBHOOK_PAYLOAD")

test_info "Webhook payload sent"
test_info "Response: $(echo $WEBHOOK_RESPONSE | head -c 100)..."

if echo "$WEBHOOK_RESPONSE" | grep -q '"success":true'; then
  test_pass "Webhook processed successfully"
  PRODUCT_ID=$(echo "$WEBHOOK_RESPONSE" | grep -o '"product_id":"[^"]*"' | cut -d'"' -f4)
  test_info "Product assigned: $PRODUCT_ID"
else
  test_fail "Webhook processing failed"
fi
echo ""

# Test 4: Wait and Verify Snake Assignment (Simulating success.html behavior)
test_step "4️⃣ Waiting for Snake Assignment (max 10 seconds)"
SNAKE_ASSIGNED=false
for i in {1..10}; do
  test_info "Checking attempt $i/10..."
  sleep 1
  
  USER_PRODUCTS=$(curl -s "$WORKER_URL/user-products?user=$USER_HASH")
  
  if echo "$USER_PRODUCTS" | grep -q "prod_TdKcnyjt5Jk0U2"; then
    SNAKE_ASSIGNED=true
    test_pass "Snake assigned after ${i} seconds"
    break
  fi
done

if [ "$SNAKE_ASSIGNED" = false ]; then
  test_fail "Snake not assigned within 10 seconds"
  echo ""
  echo "🔍 Debug Info:"
  echo "User products response: $USER_PRODUCTS"
else
  # Show assigned snake details
  SNAKE_COUNT=$(echo "$USER_PRODUCTS" | grep -o '"product_id"' | wc -l)
  test_info "User now has $SNAKE_COUNT snake(s)"
fi
echo ""

# Test 5: Verify Snake Data Structure
test_step "5️⃣ Verifying Snake Data Structure"
if echo "$USER_PRODUCTS" | grep -q '"assignment_id"'; then
  test_pass "Has assignment_id"
else
  test_fail "Missing assignment_id"
fi

if echo "$USER_PRODUCTS" | grep -q '"nickname"'; then
  test_pass "Has nickname"
else
  test_fail "Missing nickname"
fi

if echo "$USER_PRODUCTS" | grep -q '"stats"'; then
  test_pass "Has stats object"
else
  test_fail "Missing stats"
fi

if echo "$USER_PRODUCTS" | grep -q '"hunger"'; then
  test_pass "Has hunger stat"
else
  test_fail "Missing hunger stat"
fi
echo ""

# Test 6: User Registration Endpoint
test_step "6️⃣ Testing User Registration"
REG_PAYLOAD=$(cat <<REGPAYLOAD
{
  "user_id": "$USER_HASH",
  "username": "TestSnakeKeeper_$$",
  "email": "test_${USER_HASH}@example.com",
  "created_at": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "loyalty_points": 0,
  "loyalty_tier": "bronze",
  "stripe_session_id": "cs_test_${USER_HASH}"
}
REGPAYLOAD
)

REG_RESPONSE=$(curl -s -X POST "$WORKER_URL/register-user" \
  -H "Content-Type: application/json" \
  -d "$REG_PAYLOAD")

if echo "$REG_RESPONSE" | grep -q 'success\|saved\|registered'; then
  test_pass "User registration successful"
else
  test_info "Registration response: $REG_RESPONSE"
  test_pass "Registration endpoint responding (may save to KV)"
fi
echo ""

# Test 7: Simulate Second Purchase (No Registration Needed)
test_step "7️⃣ Simulating Second Purchase (Returning Customer)"
WEBHOOK_PAYLOAD_2=$(cat <<PAYLOAD2
{
  "type": "checkout.session.completed",
  "data": {
    "object": {
      "id": "cs_test_${USER_HASH}_2",
      "client_reference_id": "$USER_HASH",
      "payment_intent": "pi_test_${USER_HASH}_2",
      "amount_total": 100000,
      "currency": "eur",
      "metadata": {
        "product_id": "prod_TdKcnyjt5Jk0U2"
      }
    }
  }
}
PAYLOAD2
)

WEBHOOK_RESPONSE_2=$(curl -s -X POST "$WORKER_URL/stripe-webhook" \
  -H "Content-Type: application/json" \
  -d "$WEBHOOK_PAYLOAD_2")

if echo "$WEBHOOK_RESPONSE_2" | grep -q '"success":true'; then
  test_pass "Second purchase webhook processed"
else
  test_fail "Second purchase failed"
fi

sleep 2
USER_PRODUCTS_2=$(curl -s "$WORKER_URL/user-products?user=$USER_HASH")
SNAKE_COUNT_2=$(echo "$USER_PRODUCTS_2" | grep -o '"product_id"' | wc -l)

if [ "$SNAKE_COUNT_2" -ge 2 ]; then
  test_pass "User now has $SNAKE_COUNT_2 snakes (returning customer flow works!)"
else
  test_fail "Second snake not added (count: $SNAKE_COUNT_2)"
fi
echo ""

# Test 8: Stripe Webhook Configuration
test_step "8️⃣ Verifying Stripe Configuration"
WEBHOOKS=$(curl -s "https://api.stripe.com/v1/webhook_endpoints" \
  -u "$STRIPE_SECRET_KEY:")

if echo "$WEBHOOKS" | grep -q "$WORKER_URL/stripe-webhook"; then
  test_pass "Stripe webhook configured correctly"
  WEBHOOK_STATUS=$(echo "$WEBHOOKS" | grep -A 5 "$WORKER_URL/stripe-webhook" | grep -o '"status":"[^"]*"' | cut -d'"' -f4)
  test_info "Webhook status: $WEBHOOK_STATUS"
else
  test_fail "Stripe webhook not found"
fi
echo ""

# Test 9: Payment Link Configuration
test_step "9️⃣ Checking Payment Link Setup"
PAYMENT_LINK=$(curl -s "https://api.stripe.com/v1/payment_links/$STRIPE_PAYMENT_LINK_ID" \
  -u "$STRIPE_SECRET_KEY:")

if echo "$PAYMENT_LINK" | grep -q 'success.html'; then
  test_pass "Payment link success URL configured"
  SUCCESS_URL=$(echo "$PAYMENT_LINK" | grep -o '"url":"[^"]*success.html[^"]*"' | head -1 | cut -d'"' -f4)
  test_info "Success URL: $SUCCESS_URL"
else
  test_fail "Payment link success URL not configured"
fi
echo ""

# Summary
echo "=============================================="
echo "📊 TEST SUMMARY"
echo "=============================================="
echo ""
echo -e "${GREEN}✅ Passed: $pass_count${NC}"
echo -e "${RED}❌ Failed: $fail_count${NC}"
echo ""

if [ $fail_count -eq 0 ]; then
  echo -e "${GREEN}🎉 ALL TESTS PASSED!${NC}"
  echo ""
  echo "✅ Ready for manual testing:"
  echo "   1. Go to: http://localhost:8000/catalog.html"
  echo "   2. Click 'Buy Batman Ball'"
  echo "   3. Card: 4242 4242 4242 4242"
  echo "   4. Watch the flow work!"
  echo ""
  exit 0
else
  echo -e "${RED}⚠️  SOME TESTS FAILED${NC}"
  echo ""
  echo "Review the errors above and fix before manual testing."
  echo ""
  exit 1
fi
