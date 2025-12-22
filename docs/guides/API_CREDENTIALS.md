# 🔐 API Credentials - Programmatic Access

## Overview

AI assistants can programmatically manage Cloudflare, Stripe, and GitHub through local `.env` file.

---

## Current Status

✅ **Cloudflare API**: Connected
✅ **Stripe API**: Connected
⚠️  **GitHub API**: Needs token
❌ **Cloudflare KV**: Namespace exists but API needs verification

---

## Setup

### 1. Environment File

All credentials stored in `/root/catalog/.env`:
```bash
# Cloudflare
CLOUDFLARE_API_TOKEN=2BKglg-h8Vbs-n7NsjRZzHqDj_cTlwYkx2IoBVWY
CLOUDFLARE_ACCOUNT_ID=e24c9f59eed424bd6d04e0f10fe0886f
CLOUDFLARE_KV_NAMESPACE_ID=3b88d32c0a0540a8b557c5fb698ff61a

# Stripe
STRIPE_SECRET_KEY=sk_test_51Sg3s0BjL72pe9Xs...
STRIPE_PUBLISHABLE_KEY=pk_test_51Sg3s0BjL72pe9Xs...
STRIPE_PAYMENT_LINK_ID=plink_1Sg3yBBjL72pe9XsSLo7qqin

# GitHub (to add)
GITHUB_TOKEN=
GITHUB_REPO=vinas8/catalog
```

### 2. Verify Connections

```bash
bash scripts/verify-api-connections.sh
```

Output shows:
- ✅ API connectivity status
- Service-specific details
- Action items

---

## Adding GitHub Token

### Step 1: Create Token

1. Go to: https://github.com/settings/tokens/new
2. Token name: `Serpent Town AI Access`
3. Expiration: 90 days (or No expiration)
4. Select scopes:
   - ✅ `repo` (Full control of repositories)
   - ✅ `workflow` (Update GitHub Action workflows)
5. Click "Generate token"
6. **Copy the token immediately** (can't see it again!)

### Step 2: Add to .env

```bash
cd /root/catalog
nano .env
```

Add line:
```
GITHUB_TOKEN=ghp_YOUR_TOKEN_HERE
```

Save and test:
```bash
bash scripts/verify-api-connections.sh
```

---

## Available Operations

### Cloudflare

**Deploy Worker:**
```bash
source .env
curl -X PUT "https://api.cloudflare.com/client/v4/accounts/$CLOUDFLARE_ACCOUNT_ID/workers/scripts/serpent-town-api" \
  -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
  --data-binary @worker/worker.js
```

**Read KV:**
```bash
curl "https://api.cloudflare.com/client/v4/accounts/$CLOUDFLARE_ACCOUNT_ID/storage/kv/namespaces/$CLOUDFLARE_KV_NAMESPACE_ID/keys" \
  -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN"
```

**Write to KV:**
```bash
curl -X PUT "https://api.cloudflare.com/client/v4/accounts/$CLOUDFLARE_ACCOUNT_ID/storage/kv/namespaces/$CLOUDFLARE_KV_NAMESPACE_ID/values/user:test123" \
  -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
  -d '{"snakes": []}'
```

---

### Stripe

**List Payment Links:**
```bash
source .env
curl "https://api.stripe.com/v1/payment_links" \
  -u "$STRIPE_SECRET_KEY:"
```

**Update Payment Link:**
```bash
curl -X POST "https://api.stripe.com/v1/payment_links/$STRIPE_PAYMENT_LINK_ID" \
  -u "$STRIPE_SECRET_KEY:" \
  -d "after_completion[redirect][url]=http://localhost:8000/success.html"
```

**List Webhooks:**
```bash
curl "https://api.stripe.com/v1/webhook_endpoints" \
  -u "$STRIPE_SECRET_KEY:"
```

---

### GitHub

**Trigger Workflow:**
```bash
source .env
curl -X POST "https://api.github.com/repos/$GITHUB_REPO/actions/workflows/deploy-worker.yml/dispatches" \
  -H "Authorization: Bearer $GITHUB_TOKEN" \
  -d '{"ref":"main"}'
```

**Check Workflow Status:**
```bash
curl "https://api.github.com/repos/$GITHUB_REPO/actions/runs" \
  -H "Authorization: Bearer $GITHUB_TOKEN"
```

**Create GitHub Secret:**
```bash
curl -X PUT "https://api.github.com/repos/$GITHUB_REPO/actions/secrets/MY_SECRET" \
  -H "Authorization: Bearer $GITHUB_TOKEN" \
  -d '{"encrypted_value":"...","key_id":"..."}'
```

---

## AI Assistant Usage

### Example Commands:

**"Deploy the worker":**
AI can trigger GitHub Actions workflow or deploy directly via Cloudflare API.

**"Check what's in KV storage":**
AI can query KV namespace and show stored user data.

**"Update Stripe redirect URL":**
AI can modify payment link settings via Stripe API.

**"Show recent workflow runs":**
AI can fetch GitHub Actions history and display results.

---

## Security Notes

⚠️ **Important:**
- `.env` file is in `.gitignore` - never committed
- Tokens are test mode only
- Regular token rotation recommended
- Limit token scopes to minimum required

---

## Troubleshooting

**API not connecting?**
1. Run verification script
2. Check token expiration
3. Verify scopes/permissions
4. Test with curl manually

**KV operations failing?**
- Namespace exists: `3b88d32c0a0540a8b557c5fb698ff61a`
- API endpoint might need different format
- Check Cloudflare dashboard for namespace status

---

## Next Steps

1. ✅ Add GitHub token to `.env`
2. ✅ Run verification script
3. ✅ Test worker deployment via API
4. ✅ Document successful operations

---

**Last Updated:** 2025-12-21
**Verification Script:** `scripts/verify-api-connections.sh`
