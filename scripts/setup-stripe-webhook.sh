#!/bin/bash
# Configure Stripe Webhook via API
# Creates webhook endpoint for product sync

set -e

echo "🔗 Configuring Stripe Product Webhook"
echo "======================================"
echo ""

# Load environment
if [ -f .env ]; then
    source .env
else
    echo "❌ .env file not found"
    exit 1
fi

# Check required vars
if [ -z "$STRIPE_SECRET_KEY" ]; then
    echo "❌ STRIPE_SECRET_KEY not set in .env"
    exit 1
fi

WEBHOOK_URL="https://catalog.navickaszilvinas.workers.dev/stripe-product-webhook"

# Check if webhook already exists
echo "📡 Checking existing webhooks..."
EXISTING=$(curl -s https://api.stripe.com/v1/webhook_endpoints \
  -u "${STRIPE_SECRET_KEY}:")

WEBHOOK_ID=$(echo "$EXISTING" | python3 -c "
import json, sys
data = json.load(sys.stdin)
for wh in data.get('data', []):
    if wh['url'] == '$WEBHOOK_URL':
        print(wh['id'])
        sys.exit(0)
" 2>/dev/null || echo "")

if [ -n "$WEBHOOK_ID" ]; then
    echo "✅ Webhook already exists: $WEBHOOK_ID"
    echo ""
    echo "Webhook URL: $WEBHOOK_URL"
    echo ""
    echo "To view details:"
    echo "curl https://api.stripe.com/v1/webhook_endpoints/$WEBHOOK_ID -u \"${STRIPE_SECRET_KEY}:\""
    exit 0
fi

echo "🆕 Creating new webhook endpoint..."
echo ""

# Create webhook endpoint
RESPONSE=$(curl -s https://api.stripe.com/v1/webhook_endpoints \
  -u "${STRIPE_SECRET_KEY}:" \
  -d "url=$WEBHOOK_URL" \
  -d "enabled_events[]=product.created" \
  -d "enabled_events[]=product.updated" \
  -d "enabled_events[]=product.deleted" \
  -d "enabled_events[]=price.created" \
  -d "enabled_events[]=price.updated" \
  -d "api_version=2024-12-18.acacia")

# Parse response
WEBHOOK_ID=$(echo "$RESPONSE" | python3 -c "
import json, sys
try:
    data = json.load(sys.stdin)
    if 'id' in data:
        print(data['id'])
    else:
        print(json.dumps(data, indent=2), file=sys.stderr)
        sys.exit(1)
except Exception as e:
    print(f'Error: {e}', file=sys.stderr)
    sys.exit(1)
")

if [ -z "$WEBHOOK_ID" ]; then
    echo "❌ Failed to create webhook"
    echo "$RESPONSE"
    exit 1
fi

echo "✅ Webhook created successfully!"
echo ""
echo "Webhook ID: $WEBHOOK_ID"
echo "Webhook URL: $WEBHOOK_URL"
echo ""

# Get signing secret
SECRET=$(echo "$RESPONSE" | python3 -c "
import json, sys
data = json.load(sys.stdin)
print(data.get('secret', 'NOT_FOUND'))
")

echo "🔐 Signing Secret:"
echo "$SECRET"
echo ""
echo "⚠️  IMPORTANT: Save this secret!"
echo "Add to worker/.env:"
echo "STRIPE_WEBHOOK_SECRET_PRODUCTS=$SECRET"
echo ""

# Test webhook
echo "🧪 Testing webhook endpoint..."
TEST_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" \
  -X POST "$WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d '{"type":"test.event","data":{"object":{}}}')

if [ "$TEST_RESPONSE" = "200" ]; then
    echo "✅ Webhook endpoint is responding (HTTP $TEST_RESPONSE)"
else
    echo "⚠️  Webhook endpoint returned HTTP $TEST_RESPONSE"
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Add signing secret to worker/.env"
echo "2. Redeploy worker with secret"
echo "3. Test with: npm run test:stripe-webhook"
