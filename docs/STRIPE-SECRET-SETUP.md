# 🔐 Stripe Secret Configuration

## Problem
The worker's `/session-info` endpoint needs `STRIPE_SECRET_KEY` to fetch session data from Stripe API.

## Solution
Secret is stored encrypted in Cloudflare Workers, not in code.

---

## ✅ Already Configured
The Stripe secret is already added to the worker using Cloudflare API.

**Verify it's set:**
```bash
curl -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
  https://api.cloudflare.com/client/v4/accounts/$CLOUDFLARE_ACCOUNT_ID/workers/scripts/catalog/secrets
```

---

## 🔄 To Update Secret

### Method 1: Using Cloudflare API (Recommended)
```bash
cd worker
source .env

curl -X PUT \
  "https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/workers/scripts/catalog/secrets" \
  -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "STRIPE_SECRET_KEY",
    "text": "'"$STRIPE_SECRET_KEY"'",
    "type": "secret_text"
  }'
```

### Method 2: Using Wrangler CLI
```bash
cd worker
wrangler secret put STRIPE_SECRET_KEY
# Paste key when prompted: sk_test_51Sg3s0BjL72pe9Xs...
```

### Method 3: Cloudflare Dashboard
1. Go to https://dash.cloudflare.com
2. Workers & Pages → catalog
3. Settings → Variables and Secrets
4. Add secret: `STRIPE_SECRET_KEY`

---

## 🧪 Test It Works

```bash
# Should return session info (not 500)
curl "https://catalog.navickaszilvinas.workers.dev/session-info?session_id=cs_test_xxx"
```

---

## 🔒 Security Notes

✅ **Good Practices:**
- Secret encrypted by Cloudflare
- Never visible in logs
- Not in wrangler.toml
- Not in git repository
- Only accessible to worker at runtime

❌ **Don't Do This:**
```toml
# ❌ DON'T put secrets in wrangler.toml
[vars]
STRIPE_SECRET_KEY = "sk_test_xxx"  # NEVER DO THIS
```

---

## 📊 What This Enables

With `STRIPE_SECRET_KEY` configured:
✅ `/session-info` endpoint works
✅ success.html can fetch user hash
✅ Post-purchase flow complete
✅ No 500 errors

---

## 🐛 Troubleshooting

**Still getting 500?**
```bash
# Check if secret exists
cd worker
wrangler secret list

# Re-add if missing
wrangler secret put STRIPE_SECRET_KEY
```

**Wrong secret value?**
Just update it with the same command - overwrites existing.

---

## 📝 Current Status
✅ STRIPE_SECRET_KEY configured
✅ Worker has access to env.STRIPE_SECRET_KEY
✅ /session-info endpoint working
