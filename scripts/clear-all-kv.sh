#!/bin/bash
# Clear ALL keys from USER_PRODUCTS KV namespace

source /root/catalog/.env

NAMESPACE_ID="$CLOUDFLARE_KV_NAMESPACE_ID"
ACCOUNT_ID="$CLOUDFLARE_ACCOUNT_ID"
API_TOKEN="$CLOUDFLARE_API_TOKEN"

echo "🗑️  Clearing ALL keys from USER_PRODUCTS KV namespace..."
echo ""

# Get all keys
KEYS=$(curl -s -X GET "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/storage/kv/namespaces/$NAMESPACE_ID/keys?limit=1000" \
  -H "Authorization: Bearer $API_TOKEN" \
  -H "Content-Type: application/json" | python3 -c "import sys, json; print('\n'.join([k['name'] for k in json.load(sys.stdin)['result']]))")

COUNT=$(echo "$KEYS" | wc -l)
echo "Found $COUNT keys to delete"
echo ""

# Delete each key
DELETED=0
for KEY in $KEYS; do
  echo "Deleting: $KEY"
  curl -s -X DELETE "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/storage/kv/namespaces/$NAMESPACE_ID/values/$KEY" \
    -H "Authorization: Bearer $API_TOKEN" > /dev/null
  DELETED=$((DELETED + 1))
  
  # Show progress every 10 deletions
  if [ $((DELETED % 10)) -eq 0 ]; then
    echo "  ✅ Deleted $DELETED/$COUNT..."
  fi
done

echo ""
echo "✅ Deleted $DELETED keys from KV"
echo "🔍 Verifying..."
echo ""

# Verify
REMAINING=$(curl -s -X GET "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/storage/kv/namespaces/$NAMESPACE_ID/keys" \
  -H "Authorization: Bearer $API_TOKEN" | python3 -c "import sys, json; print(json.load(sys.stdin)['result_info']['count'])")

echo "Remaining keys: $REMAINING"

if [ "$REMAINING" -eq 0 ]; then
  echo "✅ All keys cleared!"
else
  echo "⚠️  $REMAINING keys still remain"
fi
