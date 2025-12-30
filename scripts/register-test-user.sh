#!/bin/bash
# Register a test user in the system
# Usage: ./register-test-user.sh <user_id> [username] [email]

USER_ID="${1:-b2c6456eb79a}"
USERNAME="${2:-TestUser}"
EMAIL="${3:-test@example.com}"
WORKER_URL="https://catalog.navickaszilvinas.workers.dev"

echo "👤 Registering user..."
echo "   User ID: $USER_ID"
echo "   Username: $USERNAME"
echo "   Email: $EMAIL"
echo ""

RESPONSE=$(curl -s -X POST "${WORKER_URL}/register-user" \
  -H "Content-Type: application/json" \
  -d "{\"user_id\":\"${USER_ID}\",\"username\":\"${USERNAME}\",\"email\":\"${EMAIL}\"}")

if echo "$RESPONSE" | grep -q "success"; then
  echo "✅ User registered successfully!"
  echo "$RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$RESPONSE"
else
  echo "❌ Registration failed:"
  echo "$RESPONSE"
fi
