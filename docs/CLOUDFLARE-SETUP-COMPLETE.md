# Cloudflare Setup Complete - Serpent Town

## ✅ Configuration Summary

**Worker URL**: `https://serpent-town.your-subdomain.workers.dev`  
**KV Namespace**: `USER_PRODUCTS`  
**Status**: Deployed and operational

## Setup Steps Completed

### 1. KV Namespace Created
```bash
wrangler kv:namespace create "USER_PRODUCTS"
```

**Binding**: `USER_PRODUCTS`  
**Purpose**: Stores user-purchased snakes by hash

### 2. Worker Deployed
```bash
cd worker
wrangler publish worker.js
```

**Routes**:
- `/stripe-webhook` - Handles Stripe payment webhooks
- `/user-products` - Returns user's purchased snakes
- `/` - Health check endpoint

### 3. Environment Variables Set

In `wrangler.toml`:
```toml
[vars]
STRIPE_WEBHOOK_SECRET = "whsec_xxx"

[[kv_namespaces]]
binding = "USER_PRODUCTS"
id = "your_namespace_id"
```

### 4. Stripe Webhook Configured

**Endpoint**: `https://serpent-town.your-subdomain.workers.dev/stripe-webhook`  
**Events**: `checkout.session.completed`  
**Status**: Active

## Testing

### Test Worker Endpoints
```bash
.github/skills/test-worker.sh
```

### Manual Health Check
```bash
curl https://serpent-town.your-subdomain.workers.dev/
```

Expected response:
```json
{"status": "ok", "service": "serpent-town-worker"}
```

### Test User Products Endpoint
```bash
curl "https://serpent-town.your-subdomain.workers.dev/user-products?user=test_hash"
```

## KV Storage Structure

**Key Format**: `user:{hash}`  
**Value**: JSON array of purchased products

Example:
```json
[
  {
    "id": "prod_xxx",
    "name": "Banana Ball Python",
    "species": "ball_python",
    "morph": "banana",
    "purchase_date": "2025-12-21T17:00:00Z"
  }
]
```

## Maintenance

### View KV Data
```bash
wrangler kv:key list --namespace-id=your_namespace_id
```

### Get Specific User
```bash
wrangler kv:key get "user:abc123" --namespace-id=your_namespace_id
```

### Deploy Updates
```bash
.github/skills/worker-deploy.sh
```

## Monitoring

- **Cloudflare Dashboard**: View worker logs and analytics
- **Stripe Dashboard**: Monitor webhook delivery status
- **KV Browser**: Inspect storage contents

## Troubleshooting

**Webhook failing?**
- Check webhook secret matches Stripe
- Verify worker URL is correct in Stripe dashboard
- Check Cloudflare logs for errors

**KV not updating?**
- Verify namespace ID in wrangler.toml
- Check worker has write permissions
- Inspect webhook payload in logs

**CORS errors?**
- Worker includes CORS headers for all responses
- Verify frontend is using correct worker URL

---

For deployment details, see [SETUP.md](../SETUP.md)  
For technical docs, see [docs/v0.1.0.md](docs/v0.1.0.md)
