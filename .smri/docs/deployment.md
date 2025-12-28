# Deployment Guide

**Version:** 0.7.0  
**Last Updated:** 2025-12-28  
**Consolidated from:** `/docs/DEPLOYMENT_v0.7.0.md`, `/docs/CLOUDFLARE-DEPLOYMENT.md`

---

## Overview

Serpent Town uses a dual-hosting architecture:
- **Frontend:** GitHub Pages (static files)
- **Backend:** Cloudflare Workers (API + webhooks)

---

## Prerequisites

- Node.js 16+
- Cloudflare account
- Stripe account (test mode)
- GitHub repository
- Mailtrap/SendGrid/Resend account (email)

---

## Environment Variables

### Cloudflare Worker Secrets

Set in: **Cloudflare Dashboard** → Workers → catalog → Settings → Variables

| Variable | Type | Description |
|----------|------|-------------|
| `STRIPE_SECRET_KEY` | Secret | `sk_test_...` |
| `MAILTRAP_API_TOKEN` | Secret | `Bearer abc123...` (dev) |
| `SENDGRID_API_KEY` | Secret | Production email |
| `RESEND_API_KEY` | Secret | Production email |
| `CLOUDFLARE_API_TOKEN` | Secret | KV access |
| `CLOUDFLARE_ACCOUNT_ID` | Text | Account ID |
| `SHOP_NAME` | Text | "Serpent Town" |
| `FROM_EMAIL` | Text | orders@serpenttown.com |
| `ADMIN_EMAIL` | Text | admin@serpenttown.com |

### Local .env File

```bash
# /root/catalog/.env
STRIPE_SECRET_KEY=sk_test_...
CLOUDFLARE_API_TOKEN=...
CLOUDFLARE_ACCOUNT_ID=...
MAILTRAP_API_TOKEN=Bearer ...
```

---

## Cloudflare Worker Deployment

### Method 1: Wrangler CLI (Recommended)

```bash
cd /root/catalog/worker
wrangler publish worker.js
```

### Method 2: Cloudflare API

```bash
curl -X PUT "https://api.cloudflare.com/client/v4/accounts/{account}/workers/scripts/catalog" \
  -H "Authorization: Bearer {token}" \
  -F "worker.js=@worker.js;type=application/javascript+module" \
  -F "email-service.js=@email-service.js;type=application/javascript+module" \
  -F 'metadata={"main_module":"worker.js","compatibility_date":"2024-12-21","bindings":[...]};type=application/json'
```

### Method 3: GitHub Actions

**File:** `.github/workflows/deploy-worker.yml`

**Trigger:** Push to `main` branch (worker/* changes)

**Secrets Required:**
- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

```bash
# Add secrets at:
https://github.com/vinas8/catalog/settings/secrets/actions
```

---

## GitHub Pages Deployment

### Automatic Deployment

**Trigger:** Push to `main` branch

```bash
git add .
git commit -m "Update frontend"
git push origin main
```

GitHub Pages auto-deploys to: `https://vinas8.github.io/catalog/`

### Manual Verification

```bash
# Check Pages status
https://github.com/vinas8/catalog/settings/pages

# Test live site
curl -I https://vinas8.github.io/catalog/
```

---

## KV Namespaces

### Required Namespaces

| Namespace | ID | Purpose |
|-----------|-----|---------|
| **USER_PRODUCTS** | `3b88d32c0a0540a8b557c5fb698ff61a` | User purchases |
| **PRODUCT_STATUS** | `57da5a83146147c8939e4070d4b4d4c1` | Sold tracking |
| **PRODUCTS** | `ecbcb79f3df64379863872965f993991` | Product catalog |

### Create Namespace

```bash
wrangler kv:namespace create "USER_PRODUCTS"
wrangler kv:namespace create "PRODUCT_STATUS"
wrangler kv:namespace create "PRODUCTS"
```

### Bind to Worker

In `wrangler.toml`:

```toml
kv_namespaces = [
  { binding = "USER_PRODUCTS", id = "3b88d32c0a0540a8b557c5fb698ff61a" },
  { binding = "PRODUCT_STATUS", id = "57da5a83146147c8939e4070d4b4d4c1" },
  { binding = "PRODUCTS", id = "ecbcb79f3df64379863872965f993991" }
]
```

---

## Stripe Configuration

### Webhook Setup

1. Go to: https://dashboard.stripe.com/test/webhooks
2. Click "Add endpoint"
3. URL: `https://catalog.navickaszilvinas.workers.dev/stripe-webhook`
4. Events: `checkout.session.completed`
5. Copy webhook signing secret
6. Add to Cloudflare secrets as `STRIPE_WEBHOOK_SECRET`

### Test Payment Links

Each product needs a Stripe payment link:

```json
{
  "id": "prod_xxx",
  "stripe_link": "https://buy.stripe.com/test_xxx"
}
```

Create via Stripe Dashboard → Products → Payment Links

---

## Email Configuration

### Development: Mailtrap

1. Sign up: https://mailtrap.io
2. Get API token: Settings → API Tokens
3. Add to Cloudflare secrets: `MAILTRAP_API_TOKEN`

### Production: SendGrid or Resend

**SendGrid:**
1. Get API key: https://app.sendgrid.com/settings/api_keys
2. Add to secrets: `SENDGRID_API_KEY`

**Resend:**
1. Get API key: https://resend.com/api-keys
2. Add to secrets: `RESEND_API_KEY`

**Auto-detection:** Worker uses first available provider.

---

## Verification Checklist

### After Worker Deployment

```bash
# Check worker version
curl https://catalog.navickaszilvinas.workers.dev/version

# Test products endpoint
curl https://catalog.navickaszilvinas.workers.dev/products

# Test user products (with hash)
curl "https://catalog.navickaszilvinas.workers.dev/user-products?user=test_123"

# Monitor logs
wrangler tail --name catalog
```

### After Frontend Deployment

```bash
# Check GitHub Pages
curl -I https://vinas8.github.io/catalog/

# Test catalog page
curl https://vinas8.github.io/catalog/catalog.html

# Test game page
curl https://vinas8.github.io/catalog/game.html
```

---

## Common Deployment Issues

### Worker: "No email provider configured"

**Solution:** Add `MAILTRAP_API_TOKEN` or `SENDGRID_API_KEY` to secrets.

### Worker: "KV namespace not found"

**Solution:** Check `wrangler.toml` bindings match namespace IDs.

### Frontend: 404 errors

**Solution:** Ensure all paths are relative (no leading `/`).

### Webhook: "Signature verification failed"

**Solution:** Update `STRIPE_WEBHOOK_SECRET` in Cloudflare secrets.

---

## Rollback Procedures

### Revert Worker

```bash
# Use backup
cp /root/catalog/docs/worker/worker-cloudflare-backup.js /root/catalog/worker/worker.js
wrangler publish
```

### Revert Frontend

```bash
git revert HEAD
git push origin main
```

---

## Monitoring

### Cloudflare Dashboard

- Workers & Pages → catalog → Metrics
- Real-time requests, errors, CPU time
- Logs for debugging

### Stripe Dashboard

- Developers → Webhooks → Events
- Check webhook delivery status
- View event payloads

### Email Provider

- Mailtrap: Email Testing → Inbox
- SendGrid: Analytics → Email Activity
- Resend: Logs → Email Activity

---

## Production Checklist

- [ ] Cloudflare Worker deployed (v0.7.0)
- [ ] KV namespaces created and bound
- [ ] Stripe webhook configured
- [ ] Email provider configured
- [ ] GitHub Pages enabled
- [ ] Environment variables set
- [ ] Test purchase completed
- [ ] Emails received (customer + admin)
- [ ] Worker logs clean (no errors)
- [ ] Frontend loads correctly

---

## Quick Commands

```bash
# Deploy worker
cd worker && wrangler publish

# Deploy frontend
git push origin main

# Test worker
bash scripts/test-worker-curl.sh

# Monitor logs
wrangler tail --name catalog

# Sync Stripe → KV
bash scripts/sync-products-master.sh
```

---

## Sources

Consolidated from:
- `/docs/DEPLOYMENT_v0.7.0.md` - v0.7.0 deployment guide
- `/docs/CLOUDFLARE-DEPLOYMENT.md` - Cloudflare setup
- `/docs/EMAIL_SETUP.md` - Email configuration
- `/DEPLOYMENT-STATUS.md` - Status tracking (archived)
- `/DEPLOYMENT-SUCCESS.md` - v0.5.0 notes (archived)

---

**Last Updated:** 2025-12-28T20:54:38Z
