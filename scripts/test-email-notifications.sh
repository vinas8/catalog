#!/bin/bash
# Test email notifications locally

WORKER_URL="https://catalog.navickaszilvinas.workers.dev"

echo "🧪 Testing Email Notification System"
echo "====================================="
echo ""

# Test webhook with email sending
echo "1️⃣ Simulating Stripe webhook (should trigger emails)..."
curl -X POST "$WORKER_URL/stripe-webhook" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "checkout.session.completed",
    "data": {
      "object": {
        "id": "cs_test_email_'.$(date +%s)'",
        "client_reference_id": "test_user_'.$(date +%s)'",
        "amount_total": 1000,
        "currency": "eur",
        "payment_intent": "pi_test_email_123",
        "payment_status": "paid",
        "customer_details": {
          "email": "customer@example.com",
          "name": "Test Customer"
        },
        "customer_email": "customer@example.com",
        "metadata": {
          "product_id": "prod_TdKcnyjt5Jk0U2"
        }
      }
    }
  }' | python3 -m json.tool

echo ""
echo ""
echo "✅ Check your Mailtrap inbox for:"
echo "   - Customer confirmation email"
echo "   - Admin notification email"
echo ""
echo "🔗 Mailtrap: https://mailtrap.io/inboxes"
echo ""
echo "📝 Worker logs:"
echo "   wrangler tail --name catalog"
