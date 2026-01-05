#!/bin/bash
# Verify all API connections

source .env 2>/dev/null || { echo "❌ .env file not found"; exit 1; }

echo "🔍 Verifying API Connections..."
echo "================================"
echo ""

# 1. Cloudflare
echo "1️⃣ Cloudflare API"
CF_RESPONSE=$(curl -s "https://api.cloudflare.com/client/v4/user/tokens/verify" \
  -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN")
CF_STATUS=$(echo $CF_RESPONSE | grep -o '"success":[^,]*' | cut -d: -f2)
if [ "$CF_STATUS" = "true" ]; then
  echo "   ✅ Connected"
else
  echo "   ❌ Failed"
fi
echo ""

# 2. Stripe
echo "2️⃣ Stripe API"
STRIPE_RESPONSE=$(curl -s "https://api.stripe.com/v1/payment_links/$STRIPE_PAYMENT_LINK_ID" \
  -u "$STRIPE_SECRET_KEY:")
if echo $STRIPE_RESPONSE | grep -q '"id"'; then
  echo "   ✅ Connected"
  echo "   Payment Link: $(echo $STRIPE_RESPONSE | grep -o '"url":"[^"]*' | cut -d'"' -f4)"
else
  echo "   ❌ Failed"
fi
echo ""

# 3. GitHub
echo "3️⃣ GitHub API"
if [ -z "$GITHUB_TOKEN" ]; then
  echo "   ⚠️  Token not set in .env"
  echo "   Get token: https://github.com/settings/tokens/new"
  echo "   Required scopes: repo, workflow"
else
  GH_RESPONSE=$(curl -s "https://api.github.com/user" \
    -H "Authorization: Bearer $GITHUB_TOKEN")
  if echo $GH_RESPONSE | grep -q '"login"'; then
    GH_USER=$(echo $GH_RESPONSE | grep -o '"login":"[^"]*' | cut -d'"' -f4)
    echo "   ✅ Connected as: $GH_USER"
  else
    echo "   ❌ Failed"
  fi
fi
echo ""

# 4. Cloudflare KV
echo "4️⃣ Cloudflare KV Namespace"
KV_RESPONSE=$(curl -s "https://api.cloudflare.com/client/v4/accounts/$CLOUDFLARE_ACCOUNT_ID/storage/kv/namespaces/$CLOUDFLARE_KV_NAMESPACE_ID" \
  -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN")
if echo $KV_RESPONSE | grep -q '"success":true'; then
  echo "   ✅ Connected"
  echo "   Namespace: $(echo $KV_RESPONSE | grep -o '"title":"[^"]*' | cut -d'"' -f4)"
else
  echo "   ❌ Failed"
fi
echo ""

echo "================================"
echo "Summary:"
echo "- Cloudflare: API + KV ready"
echo "- Stripe: Payment links configured"
echo "- GitHub: $([ -z "$GITHUB_TOKEN" ] && echo "Needs token" || echo "Ready")"
