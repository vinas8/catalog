#!/bin/bash
# Clear All Customers - Removes all customer records from KV
# DESTRUCTIVE OPERATION - Requires confirmation

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR/.."

# Source environment from root .env
if [ -f .env ]; then
  source .env
elif [ -f worker/.env ]; then
  source worker/.env
else
  echo "❌ .env not found"
  exit 1
fi

KV_NAMESPACE_ID="ecbcb79f3df64379863872965f993991"

echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║                                                               ║"
echo "║   ⚠️  CLEAR ALL CUSTOMERS                                     ║"
echo "║                                                               ║"
echo "║   This will DELETE all customer records from KV              ║"
echo "║                                                               ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo ""

# Check for --force flag
if [ "$1" != "--force" ]; then
  read -p "⚠️  Type 'YES' to confirm deletion: " CONFIRM
  if [ "$CONFIRM" != "YES" ]; then
    echo "❌ Operation cancelled"
    exit 1
  fi
fi

echo ""
echo "🗑️  Clearing customer records..."

# List all customer keys
KV_KEYS=$(curl -s -X GET \
  "https://api.cloudflare.com/client/v4/accounts/$CLOUDFLARE_ACCOUNT_ID/storage/kv/namespaces/$KV_NAMESPACE_ID/keys?prefix=customer:" \
  -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" | jq -r '.result[].name' || echo "")

if [ -z "$KV_KEYS" ]; then
  echo "   Already empty (0 customers)"
  DELETED=0
else
  COUNT=$(echo "$KV_KEYS" | wc -l)
  echo "   Found $COUNT customers to delete"
  DELETED=0
  for KEY in $KV_KEYS; do
    curl -s -X DELETE \
      "https://api.cloudflare.com/client/v4/accounts/$CLOUDFLARE_ACCOUNT_ID/storage/kv/namespaces/$KV_NAMESPACE_ID/values/$KEY" \
      -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" > /dev/null && ((DELETED++))
    echo -n "."
  done
  echo ""
fi

echo ""
echo "✅ Deleted: $DELETED customer records"
echo ""

# Verification
sleep 2
VERIFY_COUNT=$(curl -s -X GET \
  "https://api.cloudflare.com/client/v4/accounts/$CLOUDFLARE_ACCOUNT_ID/storage/kv/namespaces/$KV_NAMESPACE_ID/keys?prefix=customer:" \
  -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" | jq '.result | length')

echo "🔍 Verification: $VERIFY_COUNT customers remaining"

if [ "$VERIFY_COUNT" -eq 0 ]; then
  echo "✅ All customers successfully cleared!"
else
  echo "⚠️  Warning: Some customers may still exist"
fi
echo ""
