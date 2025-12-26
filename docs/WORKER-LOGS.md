# 📊 Cloudflare Worker Logs Guide

## Quick Start

### View Live Logs (Recommended)
```bash
cd /root/catalog/worker
wrangler tail
```

This shows real-time logs as requests hit your worker!

---

## 🎯 What You'll See

### Webhook Events
```
[webhook] ✅ Assigning product: prod_TdKcnyjt5Jk0U2 to user: mjg355rky15zszouluo
[webhook] 📦 Found product details: Batman Ball
[webhook] ✅ Saved to USER_PRODUCTS KV
```

### Collection Requests
```
[collection] 🔍 User mjg355rky15zszouluo requested products
[collection] ✅ Found 1 product(s)
[collection] 📤 Returned product list
```

### Errors
```
[error] ❌ Product not found in KV: prod_xyz123
[error] ⚠️ Invalid user hash format
```

---

## 📊 View Methods

### 1. Wrangler Tail (Best for development)
```bash
cd worker
wrangler tail

# Filter by status
wrangler tail --status error
wrangler tail --status ok

# Filter by method
wrangler tail --method POST
wrangler tail --method GET

# Sample rate (% of logs)
wrangler tail --sampling-rate 0.5
```

### 2. Cloudflare Dashboard
1. Go to https://dash.cloudflare.com
2. Click "Workers & Pages"
3. Click "catalog" (your worker)
4. Click "Logs" tab
5. View logs with filtering and search

### 3. API (Programmatic access)
```bash
curl -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
  https://api.cloudflare.com/client/v4/accounts/$CLOUDFLARE_ACCOUNT_ID/workers/scripts/catalog/tail
```

---

## 🔍 Common Log Searches

### Check Webhook Processing
```bash
wrangler tail | grep webhook
```

### Monitor Errors
```bash
wrangler tail --status error
```

### Watch Specific User
```bash
wrangler tail | grep mjg355rky15zszouluo
```

### See Product Fetches
```bash
wrangler tail | grep "Found product details"
```

---

## 🐛 Debugging Tips

### Worker Not Responding?
```bash
# Check worker is deployed
curl https://catalog.navickaszilvinas.workers.dev/version

# Tail logs while testing
wrangler tail &
curl https://catalog.navickaszilvinas.workers.dev/user-products?user=test
```

### Webhook Not Working?
```bash
# Monitor webhook endpoint
wrangler tail | grep "stripe-webhook"

# Check KV after webhook
curl https://catalog.navickaszilvinas.workers.dev/user-products?user=YOUR_HASH
```

### Product Not Found?
```bash
# Check if product in KV
wrangler kv:key get "product:prod_TdKcnyjt5Jk0U2" --namespace-id=ecbcb79f3df64379863872965f993991

# Sync products
cd /root/catalog
bash scripts/seed-products-kv.sh
```

---

## 📈 Performance Monitoring

### View Response Times
```bash
wrangler tail --format pretty
```

### Check Request Volume
Cloudflare Dashboard → Analytics tab shows:
- Requests per second
- Error rate
- CPU time
- Data transfer

---

## 🔐 Enable Log Storage (Optional)

For long-term log retention, enable Logpush:

1. In Cloudflare Dashboard:
   - Workers & Pages → catalog
   - Settings → Logpush
   - Configure destination (S3, R2, etc.)

2. In wrangler.toml:
```toml
logpush = true

[[logpush]]
destination = "YOUR_DESTINATION"
```

---

## 🎯 Log Levels

Worker uses console methods:
- `console.log()` - Info
- `console.error()` - Errors
- `console.warn()` - Warnings
- `console.debug()` - Debug info

All visible in `wrangler tail`!

---

## 📝 Example Log Session

```bash
$ cd worker && wrangler tail

⬇️ GET https://catalog.navickaszilvinas.workers.dev/version - Ok @ 12/26/2025, 5:43:30 AM
  [log] 🔍 Version check requested

⬇️ POST https://catalog.navickaszilvinas.workers.dev/stripe-webhook - Ok @ 12/26/2025, 5:44:15 AM
  [log] ✅ Webhook received
  [log] 📦 Found product details: Batman Ball
  [log] ✅ Saved to USER_PRODUCTS KV

⬇️ GET https://catalog.navickaszilvinas.workers.dev/user-products?user=mjg355rky15zszouluo - Ok @ 12/26/2025, 5:45:00 AM
  [log] 🔍 User mjg355rky15zszouluo requested products
  [log] ✅ Found 1 product(s)
```

---

## 🚀 Quick Commands

```bash
# Start tailing
wrangler tail

# Tail with errors only
wrangler tail --status error

# Pretty format
wrangler tail --format pretty

# Stop tailing
Ctrl+C

# View in dashboard
open https://dash.cloudflare.com
```

---

**Need help?** Check [Cloudflare Docs](https://developers.cloudflare.com/workers/observability/logs/)
