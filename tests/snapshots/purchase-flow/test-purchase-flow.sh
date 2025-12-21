#!/bin/bash
# Simulate complete purchase flow

echo "🐍 SERPENT TOWN - Purchase Flow Test"
echo "======================================"
echo ""

# Step 1: Generate user hash (simulating catalog.html behavior)
USER_HASH="test_$(date +%s)"
echo "1️⃣ User visits catalog.html"
echo "   Generated user hash: $USER_HASH"
echo ""

# Step 2: User clicks "Buy Now" - hash stored in localStorage
echo "2️⃣ User clicks 'Buy Now' on Batman Ball"
echo "   localStorage.serpent_last_purchase_hash = $USER_HASH"
echo "   Redirecting to Stripe with client_reference_id=$USER_HASH"
echo ""

# Step 3: Simulate Stripe webhook (after payment)
echo "3️⃣ Stripe webhook fires after payment"
WEBHOOK_PAYLOAD=$(cat <<WEBHOOK
{
  "type": "checkout.session.completed",
  "data": {
    "object": {
      "id": "cs_test_${USER_HASH}",
      "client_reference_id": "$USER_HASH",
      "payment_intent": "pi_test_123",
      "amount_total": 100000,
      "currency": "eur",
      "metadata": {
        "product_id": "prod_TdKcnyjt5Jk0U2"
      }
    }
  }
}
WEBHOOK
)

echo "   Calling worker webhook endpoint..."
WEBHOOK_RESPONSE=$(curl -s -X POST http://localhost:8787/stripe-webhook \
  -H "Content-Type: application/json" \
  -d "$WEBHOOK_PAYLOAD")
echo "   Response: $WEBHOOK_RESPONSE"
echo ""

# Step 4: Stripe redirects to success.html
echo "4️⃣ Stripe redirects to success.html?session_id=cs_test_${USER_HASH}"
echo "   User sees: 'Payment Successful!'"
echo "   Countdown: 3 seconds..."
echo ""

# Step 5: success.html redirects to game.html
echo "5️⃣ Auto-redirect to game.html#$USER_HASH"
echo ""

# Step 6: Game fetches user's snakes
echo "6️⃣ Game calls /user-products?user=$USER_HASH"
USER_PRODUCTS=$(curl -s "http://localhost:8787/user-products?user=$USER_HASH")
echo "   Response: $USER_PRODUCTS"
echo ""

if echo "$USER_PRODUCTS" | grep -q "prod_TdKcnyjt5Jk0U2"; then
  echo "✅ SUCCESS! Batman Ball assigned to user!"
else
  echo "❌ FAILED! Snake not found in user products"
fi
