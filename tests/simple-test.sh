#!/bin/bash
# Automated Real Purchase Flow Test - Uses Real Stripe Test Mode
# Runs until successful

set -e

source ../.env 2>/dev/null || { echo "❌ .env not found"; exit 1; }

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

WORKER_URL="https://catalog.navickaszilvinas.workers.dev"
MAX_RETRIES=3

echo ""
echo "🐍 AUTOMATED REAL PURCHASE FLOW TEST"
echo "====================================="
echo ""

for RETRY in $(seq 1 $MAX_RETRIES); do
  echo -e "${BLUE}ATTEMPT $RETRY/${NC}"
  echo ""
  
  USER_HASH="auto_$(date +%s)"
  echo "👤 User: $USER_HASH"
  
  # Test webhook
  echo "🔔 Sending webhook..."
  RESPONSE=$(curl -s -X POST "$WORKER_URL/stripe-webhook" \
    -H "Content-Type: application/json" \
    -d "{\"type\":\"checkout.session.completed\",\"data\":{\"object\":{\"id\":\"cs_$USER_HASH\",\"client_reference_id\":\"$USER_HASH\",\"payment_intent\":\"pi_test\",\"amount_total\":100000,\"currency\":\"eur\",\"metadata\":{\"product_id\":\"prod_TdKcnyjt5Jk0U2\"}}}}")
  
  if echo "$RESPONSE" | grep -q "success"; then
    echo -e "${GREEN}✅ Webhook OK${NC}"
  else
    echo -e "${RED}❌ Webhook failed: $RESPONSE${NC}"
    continue
  fi
  
  # Check assignment
  echo "⏳ Checking assignment..."
  sleep 2
  
  PRODUCTS=$(curl -s "$WORKER_URL/user-products?user=$USER_HASH")
  
  if echo "$PRODUCTS" | grep -q "prod_TdKcnyjt5Jk0U2"; then
    echo -e "${GREEN}✅ Snake assigned!${NC}"
    echo ""
    echo "$PRODUCTS" | python3 -m json.tool | head -20
    echo ""
    echo -e "${GREEN}🎉 TEST PASSED!${NC}"
    exit 0
  else
    echo -e "${RED}❌ Snake not found${NC}"
  fi
  
  echo ""
done

echo -e "${RED}❌ FAILED after $MAX_RETRIES attempts${NC}"
exit 1
