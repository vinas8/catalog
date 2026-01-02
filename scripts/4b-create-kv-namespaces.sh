#!/bin/bash
# Create new KV namespaces for gamified shop system
# PRODUCTS_REAL, PRODUCTS_VIRTUAL, USERS

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Load environment variables
if [ -f "$SCRIPT_DIR/../worker/.env" ]; then
    source "$SCRIPT_DIR/../worker/.env"
elif [ -f "$SCRIPT_DIR/../.env" ]; then
    source "$SCRIPT_DIR/../.env"
else
    echo "⚠️  No .env file found. Using wrangler commands instead."
fi

echo "🏗️  CREATE KV NAMESPACES - Gamified Shop System"
echo "================================================"
echo ""

# Check if wrangler is available
if ! command -v wrangler &> /dev/null; then
    echo "❌ wrangler not found. Install with: npm install -g wrangler"
    exit 1
fi

echo "Creating 3 new KV namespaces..."
echo ""

# Create PRODUCTS_REAL namespace
echo "1️⃣  Creating PRODUCTS_REAL namespace..."
REAL_OUTPUT=$(wrangler kv:namespace create "PRODUCTS_REAL" 2>&1)
echo "$REAL_OUTPUT"

# Extract namespace ID from output
REAL_ID=$(echo "$REAL_OUTPUT" | grep -oP 'id = "\K[^"]+' || echo "")

if [ -z "$REAL_ID" ]; then
    echo "⚠️  Could not extract PRODUCTS_REAL ID automatically"
    echo "   Check output above for the ID"
    REAL_ID="PASTE_ID_HERE"
fi

echo "   → PRODUCTS_REAL ID: $REAL_ID"
echo ""

# Create PRODUCTS_VIRTUAL namespace
echo "2️⃣  Creating PRODUCTS_VIRTUAL namespace..."
VIRTUAL_OUTPUT=$(wrangler kv:namespace create "PRODUCTS_VIRTUAL" 2>&1)
echo "$VIRTUAL_OUTPUT"

VIRTUAL_ID=$(echo "$VIRTUAL_OUTPUT" | grep -oP 'id = "\K[^"]+' || echo "")

if [ -z "$VIRTUAL_ID" ]; then
    echo "⚠️  Could not extract PRODUCTS_VIRTUAL ID automatically"
    VIRTUAL_ID="PASTE_ID_HERE"
fi

echo "   → PRODUCTS_VIRTUAL ID: $VIRTUAL_ID"
echo ""

# Create USERS namespace
echo "3️⃣  Creating USERS namespace..."
USERS_OUTPUT=$(wrangler kv:namespace create "USERS" 2>&1)
echo "$USERS_OUTPUT"

USERS_ID=$(echo "$USERS_OUTPUT" | grep -oP 'id = "\K[^"]+' || echo "")

if [ -z "$USERS_ID" ]; then
    echo "⚠️  Could not extract USERS ID automatically"
    USERS_ID="PASTE_ID_HERE"
fi

echo "   → USERS ID: $USERS_ID"
echo ""

# Update wrangler.toml
echo "📝 Updating wrangler.toml..."
WRANGLER_FILE="$SCRIPT_DIR/../worker/wrangler.toml"

# Backup original
cp "$WRANGLER_FILE" "$WRANGLER_FILE.backup"
echo "   Backup created: wrangler.toml.backup"

# Replace placeholder IDs
if [ "$REAL_ID" != "PASTE_ID_HERE" ]; then
    sed -i "s/TODO_CREATE_IN_CLOUDFLARE/$REAL_ID/" "$WRANGLER_FILE"
    echo "   Updated PRODUCTS_REAL ID"
fi

# For VIRTUAL and USERS, need to find the right placeholders
# This is a simplified version - might need manual adjustment
echo ""
echo "⚠️  Manual step required:"
echo "   Edit worker/wrangler.toml and replace:"
echo "   - PRODUCTS_REAL: $REAL_ID"
echo "   - PRODUCTS_VIRTUAL: $VIRTUAL_ID"
echo "   - USERS: $USERS_ID"
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
echo "Next steps:"
echo "1. Copy IDs from kv-namespace-ids.txt"
echo "2. Paste into worker/wrangler.toml"
echo "3. Run: ./5-migrate-products-split.sh"
echo ""
