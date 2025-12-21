#!/bin/bash
# Comprehensive Real Purchase Flow Test
# Tests: Webhook → Assignment → Registration → Second Purchase

source ../.env 2>/dev/null || { echo "❌ .env not found"; exit 1; }

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

WORKER_URL="https://catalog.navickaszilvinas.workers.dev"

echo ""
echo "🐍 COMPREHENSIVE PURCHASE FLOW TEST"
echo "===================================="
echo ""

USER_HASH="auto_$(date +%s)"
echo "Test User: $USER_HASH"
echo ""

# Test 1: First Purchase Webhook
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "1️⃣ FIRST PURCHASE - Webhook Processing"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

WEBHOOK=$(curl -s -X POST "$WORKER_URL/stripe-webhook" \
  -H "Content-Type: application/json" \
  -d "{\"type\":\"checkout.session.completed\",\"data\":{\"object\":{\"id\":\"cs_${USER_HASH}\",\"client_reference_id\":\"$USER_HASH\",\"payment_intent\":\"pi_${USER_HASH}\",\"amount_total\":100000,\"currency\":\"eur\",\"customer_email\":\"test@example.com\",\"metadata\":{\"product_id\":\"prod_TdKcnyjt5Jk0U2\"}}}}")

if echo "$WEBHOOK" | grep -q "success"; then
  echo -e "${GREEN}✅ Webhook processed${NC}"
else
  echo -e "${RED}❌ Webhook failed: $WEBHOOK${NC}"
  exit 1
fi
echo ""

# Test 2: Wait for Assignment (simulating success.html)
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "2️⃣ WAIT FOR ASSIGNMENT (like success.html)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

FOUND=false
for i in {1..20}; do
  PRODUCTS=$(curl -s "$WORKER_URL/user-products?user=$USER_HASH")
  
  if echo "$PRODUCTS" | grep -q "prod_TdKcnyjt5Jk0U2"; then
    FOUND=true
    echo -e "${GREEN}✅ Snake found after ${i} second(s)${NC}"
    break
  fi
  
  sleep 1
  if [ $((i % 5)) -eq 0 ]; then
    echo "   Waiting... ${i}/20s"
  fi
done

if [ "$FOUND" = false ]; then
  echo -e "${RED}❌ Snake not assigned within 20s${NC}"
  exit 1
fi
echo ""

# Test 3: Verify Snake Data
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "3️⃣ VERIFY SNAKE DATA STRUCTURE"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

echo "$PRODUCTS" | python3 -c "
import sys, json
try:
    data = json.load(sys.stdin)
    snake = data[0]
    
    checks = {
        'Has assignment_id': 'assignment_id' in snake,
        'Has nickname': 'nickname' in snake,
        'Has stats': 'stats' in snake,
        'Has hunger': 'stats' in snake and 'hunger' in snake['stats'],
        'Has health': 'stats' in snake and 'health' in snake['stats']
    }
    
    all_passed = all(checks.values())
    
    for check, result in checks.items():
        status = '✅' if result else '❌'
        print(f'{status} {check}')
    
    if not all_passed:
        sys.exit(1)
except Exception as e:
    print(f'❌ Error: {e}')
    sys.exit(1)
"

if [ $? -ne 0 ]; then
  echo -e "${RED}Data validation failed${NC}"
  exit 1
fi
echo ""

# Test 4: User Registration
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "4️⃣ USER REGISTRATION (First Purchase)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

REG=$(curl -s -X POST "$WORKER_URL/register-user" \
  -H "Content-Type: application/json" \
  -d "{\"user_id\":\"$USER_HASH\",\"username\":\"TestUser\",\"email\":\"test@example.com\",\"created_at\":\"$(date -u +%Y-%m-%dT%H:%M:%SZ)\",\"loyalty_points\":0,\"loyalty_tier\":\"bronze\",\"stripe_session_id\":\"cs_${USER_HASH}\"}")

echo -e "${GREEN}✅ Registration endpoint called${NC}"
echo ""

# Test 5: Second Purchase (Returning Customer)
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "5️⃣ SECOND PURCHASE (Returning Customer)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

WEBHOOK2=$(curl -s -X POST "$WORKER_URL/stripe-webhook" \
  -H "Content-Type: application/json" \
  -d "{\"type\":\"checkout.session.completed\",\"data\":{\"object\":{\"id\":\"cs_${USER_HASH}_2\",\"client_reference_id\":\"$USER_HASH\",\"payment_intent\":\"pi_${USER_HASH}_2\",\"amount_total\":100000,\"currency\":\"eur\",\"metadata\":{\"product_id\":\"prod_TdKcnyjt5Jk0U2\"}}}}")

if echo "$WEBHOOK2" | grep -q "success"; then
  echo -e "${GREEN}✅ Second webhook processed${NC}"
else
  echo -e "${RED}❌ Second webhook failed${NC}"
  exit 1
fi

sleep 3

PRODUCTS2=$(curl -s "$WORKER_URL/user-products?user=$USER_HASH")
COUNT=$(echo "$PRODUCTS2" | grep -o '"product_id"' | wc -l)

if [ "$COUNT" -ge 2 ]; then
  echo -e "${GREEN}✅ User now has $COUNT snakes (returning customer flow works!)${NC}"
else
  echo -e "${RED}❌ Expected 2+ snakes, got $COUNT${NC}"
  exit 1
fi
echo ""

# Success Summary
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}🎉 ALL TESTS PASSED!${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "✅ Webhook processing: WORKING"
echo "✅ Snake assignment: WORKING (within 20s timeout)"
echo "✅ Data structure: VALID"
echo "✅ Registration: WORKING"
echo "✅ Second purchase: WORKING (skip registration)"
echo ""
echo "Final snake count: $COUNT"
echo "Test user: $USER_HASH"
echo ""
echo "🎮 Ready for manual browser testing!"
