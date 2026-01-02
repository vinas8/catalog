#!/bin/bash
# Create new KV namespaces for gamified shop system using Cloudflare API
# PRODUCTS_REAL, PRODUCTS_VIRTUAL, USERS

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Load environment variables
if [ -f "$SCRIPT_DIR/../worker/.env" ]; then
    source "$SCRIPT_DIR/../worker/.env"
elif [ -f "$SCRIPT_DIR/../.env" ]; then
    source "$SCRIPT_DIR/../.env"
else
    echo "❌ No .env file found"
    exit 1
fi

echo "🏗️  CREATE KV NAMESPACES - Gamified Shop System"
echo "================================================"
echo ""

# Check required environment variables
if [ -z "$CLOUDFLARE_API_TOKEN" ] || [ -z "$CLOUDFLARE_ACCOUNT_ID" ]; then
    echo "❌ Required environment variables not set:"
    echo "   CLOUDFLARE_API_TOKEN"
    echo "   CLOUDFLARE_ACCOUNT_ID"
    echo ""
    echo "Set them in .env or worker/.env file"
    exit 1
fi

echo "Using Cloudflare API directly..."
echo "Account ID: $CLOUDFLARE_ACCOUNT_ID"
echo ""

# Function to create namespace via API
create_namespace() {
    local NAME=$1
    echo "Creating namespace: $NAME..."
    
    RESPONSE=$(curl -s -X POST \
        "https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/storage/kv/namespaces" \
        -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}" \
        -H "Content-Type: application/json" \
        -d "{\"title\":\"$NAME\"}")
    
    # Check if successful
    if echo "$RESPONSE" | grep -q '"success":true'; then
        NAMESPACE_ID=$(echo "$RESPONSE" | jq -r '.result.id')
        echo "   ✅ Created: $NAMESPACE_ID"
        echo "$NAMESPACE_ID"
    else
        echo "   ❌ Failed to create $NAME"
        echo "$RESPONSE" | jq '.'
        echo "ERROR"
    fi
}

# Create PRODUCTS_REAL namespace
echo "1️⃣  Creating PRODUCTS_REAL namespace..."
REAL_ID=$(create_namespace "PRODUCTS_REAL")
if [ "$REAL_ID" == "ERROR" ]; then
    echo "Failed to create PRODUCTS_REAL"
    exit 1
fi
echo ""

# Create PRODUCTS_VIRTUAL namespace
echo "2️⃣  Creating PRODUCTS_VIRTUAL namespace..."
VIRTUAL_ID=$(create_namespace "PRODUCTS_VIRTUAL")
if [ "$VIRTUAL_ID" == "ERROR" ]; then
    echo "Failed to create PRODUCTS_VIRTUAL"
    exit 1
fi
echo ""

# Create USERS namespace
echo "3️⃣  Creating USERS namespace..."
USERS_ID=$(create_namespace "USERS")
if [ "$USERS_ID" == "ERROR" ]; then
    echo "Failed to create USERS"
    exit 1
fi
echo ""

# Create summary file
SUMMARY_FILE="$SCRIPT_DIR/kv-namespace-ids.txt"
cat > "$SUMMARY_FILE" << EOF
# KV Namespace IDs - Created $(date)
# Paste these into worker/wrangler.toml

[[kv_namespaces]]
binding = "PRODUCTS_REAL"
id = "$REAL_ID"

[[kv_namespaces]]
binding = "PRODUCTS_VIRTUAL"
id = "$VIRTUAL_ID"

[[kv_namespaces]]
binding = "USERS"
id = "$USERS_ID"
EOF

echo "✅ Namespace IDs saved to: scripts/kv-namespace-ids.txt"
echo ""

# Update wrangler.toml automatically
WRANGLER_FILE="$SCRIPT_DIR/../worker/wrangler.toml"
if [ -f "$WRANGLER_FILE" ]; then
    # Backup original
    cp "$WRANGLER_FILE" "$WRANGLER_FILE.backup-$(date +%Y%m%d-%H%M%S)"
    echo "📝 Updating wrangler.toml..."
    
    # Replace TODO placeholders with actual IDs
    sed -i "s/id = \"TODO_CREATE_IN_CLOUDFLARE\" # PRODUCTS_REAL/id = \"$REAL_ID\"/" "$WRANGLER_FILE"
    
    # Find and replace PRODUCTS_VIRTUAL TODO
    awk -v virtual_id="$VIRTUAL_ID" '
        /PRODUCTS_VIRTUAL/ { in_block=1 }
        in_block && /id = "TODO_CREATE_IN_CLOUDFLARE"/ { 
            sub(/id = "TODO_CREATE_IN_CLOUDFLARE"/, "id = \"" virtual_id "\"")
            in_block=0
        }
        { print }
    ' "$WRANGLER_FILE" > "$WRANGLER_FILE.tmp" && mv "$WRANGLER_FILE.tmp" "$WRANGLER_FILE"
    
    # Find and replace USERS TODO
    awk -v users_id="$USERS_ID" '
        /USERS/ { in_block=1 }
        in_block && /id = "TODO_CREATE_IN_CLOUDFLARE"/ { 
            sub(/id = "TODO_CREATE_IN_CLOUDFLARE"/, "id = \"" users_id "\"")
            in_block=0
        }
        { print }
    ' "$WRANGLER_FILE" > "$WRANGLER_FILE.tmp" && mv "$WRANGLER_FILE.tmp" "$WRANGLER_FILE"
    
    echo "   ✅ Updated wrangler.toml with new namespace IDs"
    echo ""
fi

echo "📋 Summary:"
echo "   PRODUCTS_REAL: $REAL_ID"
echo "   PRODUCTS_VIRTUAL: $VIRTUAL_ID"
echo "   USERS: $USERS_ID"
echo ""
echo "✅ Namespaces created successfully!"
echo ""
echo "Next steps:"
echo "1. Review: worker/wrangler.toml"
echo "2. Run migration: ./5-migrate-products-split.sh"
echo ""

