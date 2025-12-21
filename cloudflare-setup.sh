#!/bin/bash
# Cloudflare Setup via API

# Extract from URL
ACCOUNT_ID="e24c9f59eed424bd6d04e0f10fe0886f"
KV_NAMESPACE_ID="3b88d32c0a0540a8b557c5fb698ff61a"

echo "✅ Found existing KV namespace!"
echo "   Account ID: $ACCOUNT_ID"
echo "   KV Namespace ID: $KV_NAMESPACE_ID"
echo ""

# Need Cloudflare API token
echo "📋 Need Cloudflare API Token to continue..."
echo ""
echo "Get it from: https://dash.cloudflare.com/profile/api-tokens"
echo "Or if you have it, provide it now."
echo ""
echo "Token should have permissions:"
echo "  - Workers Scripts: Edit"
echo "  - Workers KV Storage: Edit"
