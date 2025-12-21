# Setup Guide - Serpent Town v0.1.0

## Prerequisites

- Node.js 18+ (for testing only, no build step)
- Cloudflare account with Workers enabled
- Stripe account (test mode)
- GitHub account (for Pages hosting)

## Installation

### 1. Clone Repository

```bash
git clone https://github.com/vinas8/catalog.git
cd catalog
npm install  # Installs dev dependencies for testing only
```

### 2. Configure Environment

Create `.env` file:

```bash
# Cloudflare
CLOUDFLARE_ACCOUNT_ID=your_account_id
CLOUDFLARE_API_TOKEN=your_api_token

# Stripe
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
STRIPE_PUBLISHABLE_KEY=pk_test_xxx

# GitHub (optional, for AI assistants)
GITHUB_TOKEN=ghp_xxx
```

### 3. Setup Cloudflare KV

```bash
# Create KV namespace
wrangler kv:namespace create "USER_PRODUCTS"

# Note the namespace ID, add to wrangler.toml:
kv_namespaces = [
  { binding = "USER_PRODUCTS", id = "your_namespace_id" }
]
```

### 4. Deploy Worker

```bash
cd worker
wrangler publish worker.js
```

Or use the skill:
```bash
.github/skills/worker-deploy.sh
```

### 5. Configure Stripe Webhook

1. Go to Stripe Dashboard → Webhooks
2. Add endpoint: `https://your-worker.workers.dev/stripe-webhook`
3. Select events: `checkout.session.completed`
4. Copy webhook secret to `.env`

### 6. Deploy Frontend (GitHub Pages)

```bash
# Push to GitHub
git push origin main

# Enable GitHub Pages
# Go to: Settings → Pages → Source: main branch
```

Frontend will be at: `https://your-username.github.io/catalog/`

## Testing

```bash
# Run all tests
npm test

# Test worker endpoints
.github/skills/test-worker.sh

# Check server status (read-only)
.github/skills/check-server-status.sh
```

## Verification

1. **Frontend**: Visit catalog page, check snakes load
2. **Stripe**: Test purchase with card `4242 4242 4242 4242`
3. **Webhook**: Check Cloudflare KV for user products
4. **Game**: Open game.html with user hash, verify snake appears

## Troubleshooting

**Worker not deploying?**
- Check `wrangler.toml` has correct account ID
- Verify API token has Workers permissions

**Webhook not working?**
- Check Stripe webhook secret is correct
- Verify worker URL is publicly accessible
- Check Cloudflare logs for errors

**Game not loading snakes?**
- Verify user hash is correct
- Check KV storage has data
- Inspect browser console for errors

## Production Checklist

- [ ] Replace Stripe test keys with live keys
- [ ] Update webhook endpoint to production worker
- [ ] Set up custom domain (optional)
- [ ] Enable Cloudflare caching
- [ ] Test payment flow end-to-end
- [ ] Monitor webhook delivery in Stripe Dashboard

## Additional Resources

- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- [Stripe Webhooks Guide](https://stripe.com/docs/webhooks)
- [GitHub Pages Docs](https://docs.github.com/pages)

---

For detailed technical documentation, see [docs/v0.1.0.md](docs/v0.1.0.md)
