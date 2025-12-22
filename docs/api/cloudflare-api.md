# Cloudflare API Reference

**Purpose:** Complete reference for Cloudflare Workers API and KV operations  
**Last Updated:** 2025-12-22  
**Version:** Production

---

## 🔑 Authentication

### API Token
Required for all API calls. Set in `.env`:

```bash
CLOUDFLARE_API_TOKEN=your_token_here
CLOUDFLARE_ACCOUNT_ID=your_account_id
```

**Get Token:**
1. Go to: https://dash.cloudflare.com/profile/api-tokens
2. Create Token → Edit Cloudflare Workers
3. Permissions:
   - Account > Workers Scripts > Edit
   - Account > Workers KV Storage > Edit

---

## 🚀 Workers API

### Base URL
```
https://api.cloudflare.com/client/v4/accounts/{account_id}
```

### Deploy Worker

**Endpoint:** `PUT /workers/scripts/{script_name}`  
**Method:** Multipart form upload

```bash
curl -X PUT \
  "https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/workers/scripts/catalog" \
  -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}" \
  -F "metadata=@metadata.json;type=application/json" \
  -F "worker.js=@worker.js;type=application/javascript+module"
```

**metadata.json:**
```json
{
  "main_module": "worker.js",
  "compatibility_date": "2024-12-21",
  "bindings": [
    {
      "type": "kv_namespace",
      "name": "USER_PRODUCTS",
      "namespace_id": "3b88d32c0a0540a8b557c5fb698ff61a"
    }
  ]
}
```

**Response:**
```json
{
  "result": {
    "id": "catalog",
    "deployment_id": "abc123...",
    "modified_on": "2025-12-22T14:00:00Z"
  },
  "success": true
}
```

### Get Worker Script

**Endpoint:** `GET /workers/scripts/{script_name}`

```bash
curl -s \
  "https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/workers/scripts/catalog" \
  -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}"
```

### List Workers

**Endpoint:** `GET /workers/scripts`

```bash
curl -s \
  "https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/workers/scripts" \
  -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}"
```

---

## 🗄️ KV Storage API

### List KV Namespaces

**Endpoint:** `GET /storage/kv/namespaces`

```bash
curl -s \
  "https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/storage/kv/namespaces" \
  -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}"
```

**Response:**
```json
{
  "result": [
    {
      "id": "3b88d32c0a0540a8b557c5fb698ff61a",
      "title": "USER_PRODUCTS",
      "supports_url_encoding": true
    }
  ],
  "success": true
}
```

### Create KV Namespace

**Endpoint:** `POST /storage/kv/namespaces`

```bash
curl -X POST \
  "https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/storage/kv/namespaces" \
  -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{"title": "PRODUCTS"}'
```

### Write to KV

**Endpoint:** `PUT /storage/kv/namespaces/{namespace_id}/values/{key}`

```bash
curl -X PUT \
  "https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/storage/kv/namespaces/ecbcb79f3df64379863872965f993991/values/product:prod_123" \
  -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "id": "prod_123",
    "name": "Batman Ball",
    "price": 1000.0
  }'
```

**Response:**
```json
{
  "result": null,
  "success": true,
  "errors": [],
  "messages": []
}
```

### Read from KV

**Endpoint:** `GET /storage/kv/namespaces/{namespace_id}/values/{key}`

```bash
curl -s \
  "https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/storage/kv/namespaces/ecbcb79f3df64379863872965f993991/values/product:prod_123" \
  -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}"
```

**Response:** Raw value (JSON object)

### List KV Keys

**Endpoint:** `GET /storage/kv/namespaces/{namespace_id}/keys`

```bash
curl -s \
  "https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/storage/kv/namespaces/ecbcb79f3df64379863872965f993991/keys" \
  -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}"
```

**Response:**
```json
{
  "result": [
    {"name": "product:prod_123"},
    {"name": "product:prod_456"},
    {"name": "_index:products"}
  ],
  "success": true
}
```

### Delete from KV

**Endpoint:** `DELETE /storage/kv/namespaces/{namespace_id}/values/{key}`

```bash
curl -X DELETE \
  "https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/storage/kv/namespaces/ecbcb79f3df64379863872965f993991/values/product:prod_123" \
  -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}"
```

### Bulk Write to KV

**Endpoint:** `PUT /storage/kv/namespaces/{namespace_id}/bulk`

```bash
curl -X PUT \
  "https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/storage/kv/namespaces/ecbcb79f3df64379863872965f993991/bulk" \
  -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '[
    {
      "key": "product:prod_123",
      "value": "{\"id\":\"prod_123\",\"name\":\"Snake 1\"}"
    },
    {
      "key": "product:prod_456",
      "value": "{\"id\":\"prod_456\",\"name\":\"Snake 2\"}"
    }
  ]'
```

---

## 📊 Our KV Namespaces

### USER_PRODUCTS
**ID:** `3b88d32c0a0540a8b557c5fb698ff61a`  
**Purpose:** Store user's purchased snakes  
**Key Pattern:** `user:{hash}`  
**Value:** Array of product IDs

**Example:**
```json
["prod_TdKcnyjt5Jk0U2", "prod_TeTICJsKnUh6Xz"]
```

### PRODUCT_STATUS
**ID:** `57da5a83146147c8939e4070d4b4d4c1`  
**Purpose:** Track which products are sold  
**Key Pattern:** `product:{id}`  
**Value:** Sold status object

**Example:**
```json
{
  "sold": true,
  "soldTo": "user_abc123",
  "soldAt": "2025-12-22T14:00:00Z"
}
```

### PRODUCTS
**ID:** `ecbcb79f3df64379863872965f993991`  
**Purpose:** Product catalog (snakes for sale)  
**Key Pattern:** `product:{id}` or `_index:products`  
**Value:** Product object

**Example:**
```json
{
  "id": "prod_TdKcnyjt5Jk0U2",
  "name": "Batman Ball",
  "species": "ball_python",
  "morph": "banana",
  "price": 1000.0,
  "currency": "eur",
  "stripe_link": "https://buy.stripe.com/test_...",
  "status": "available"
}
```

**Index Key:** `_index:products`  
**Value:** Array of product IDs for fast listing

---

## 🛠️ Common Operations

### Deploy New Worker Version

```bash
cd /root/catalog
source .env

# Create metadata
cat > /tmp/metadata.json << 'JSON'
{
  "main_module": "worker.js",
  "compatibility_date": "2024-12-21",
  "bindings": [
    {
      "type": "kv_namespace",
      "name": "USER_PRODUCTS",
      "namespace_id": "3b88d32c0a0540a8b557c5fb698ff61a"
    },
    {
      "type": "kv_namespace",
      "name": "PRODUCT_STATUS",
      "namespace_id": "57da5a83146147c8939e4070d4b4d4c1"
    },
    {
      "type": "kv_namespace",
      "name": "PRODUCTS",
      "namespace_id": "ecbcb79f3df64379863872965f993991"
    }
  ]
}
JSON

# Deploy
curl -X PUT \
  "https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/workers/scripts/catalog" \
  -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}" \
  -F "metadata=@/tmp/metadata.json;type=application/json" \
  -F "worker.js=@worker/worker.js;type=application/javascript+module"
```

### Seed Products from Stripe to KV

```bash
# 1. Fetch from Stripe
PRODUCT_DATA=$(curl -s "https://api.stripe.com/v1/products/prod_TdKcnyjt5Jk0U2" -u "$STRIPE_SECRET_KEY:")

# 2. Upload to KV
curl -X PUT \
  "https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/storage/kv/namespaces/ecbcb79f3df64379863872965f993991/values/product:prod_TdKcnyjt5Jk0U2" \
  -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}" \
  -H "Content-Type: application/json" \
  -d "$PRODUCT_DATA"
```

### Clear All Products from KV

```bash
# List all product keys
KEYS=$(curl -s \
  "https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/storage/kv/namespaces/ecbcb79f3df64379863872965f993991/keys" \
  -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}" | \
  python3 -c "import json,sys; keys=json.load(sys.stdin)['result']; print('\n'.join([k['name'] for k in keys if k['name'].startswith('product:')]))")

# Delete each key
while read -r key; do
  curl -X DELETE \
    "https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/storage/kv/namespaces/ecbcb79f3df64379863872965f993991/values/$key" \
    -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}"
done <<< "$KEYS"
```

---

## 🎯 Worker Endpoints (Production)

### Base URL
```
https://catalog.navickaszilvinas.workers.dev
```

### GET /products
**Purpose:** Get available products  
**Response:**
```json
[
  {
    "id": "prod_TdKcnyjt5Jk0U2",
    "name": "Batman Ball",
    "price": 1000.0,
    "stripe_link": "https://buy.stripe.com/..."
  }
]
```

### GET /user-products?user={hash}
**Purpose:** Get user's purchased snakes  
**Response:**
```json
["prod_TdKcnyjt5Jk0U2", "prod_TeTICJsKnUh6Xz"]
```

### POST /stripe-webhook
**Purpose:** Handle Stripe webhook events  
**Headers:** `Stripe-Signature: xxx`  
**Body:** Stripe event object

### GET /product-status?id={product_id}
**Purpose:** Check if product is sold  
**Response:**
```json
{
  "product_id": "prod_123",
  "status": "available",
  "owner_id": null
}
```

### POST /register-user
**Purpose:** Save user profile after registration  
**Body:**
```json
{
  "user_hash": "abc123",
  "username": "SnakeWhisperer42"
}
```

### GET /user-data?user={hash}
**Purpose:** Get user profile  
**Response:**
```json
{
  "username": "SnakeWhisperer42",
  "registered_at": "2025-12-22T14:00:00Z"
}
```

---

## 🔒 Security Best Practices

### API Token Permissions
- ✅ Limit to specific workers
- ✅ Set expiration date
- ✅ Use separate tokens for dev/prod
- ❌ Never commit tokens to git

### KV Access
- ✅ Validate all inputs
- ✅ Use namespaces for isolation
- ✅ Implement rate limiting
- ✅ Log all write operations

### Worker Security
- ✅ Validate Stripe signatures
- ✅ Use CORS headers appropriately
- ✅ Sanitize user inputs
- ✅ Return minimal error details

---

## 📈 Rate Limits

### Workers API
- **Requests:** 1,200/5 minutes per account
- **Script Size:** 1 MB after compression
- **CPU Time:** 50ms per request (free), 50ms-30s (paid)

### KV API
- **Reads:** Unlimited
- **Writes:** 1,000/day (free), unlimited (paid)
- **List:** 100 requests/second
- **Bulk:** 1,000 pairs per request

---

## 🐛 Troubleshooting

### Error: "No such module: worker.js"
**Cause:** Missing `main_module` in metadata  
**Fix:** Set `"main_module": "worker.js"` in metadata.json

### Error: "PRODUCTS namespace not bound"
**Cause:** KV binding not configured  
**Fix:** Add binding in wrangler.toml or API call

### Error: "Unexpected token 'export'"
**Cause:** Wrong content type  
**Fix:** Use `type=application/javascript+module`

### KV writes not visible immediately
**Cause:** Eventual consistency (up to 60s)  
**Fix:** Wait or use cache busting

---

## 📚 Related Documentation

- **Cloudflare Workers Docs:** https://developers.cloudflare.com/workers/
- **KV Documentation:** https://developers.cloudflare.com/kv/
- **API Reference:** https://developers.cloudflare.com/api/
- **Our Worker Config:** `worker/wrangler.toml`
- **Our KV Architecture:** `docs/architecture/KV-ARCHITECTURE.md`

---

## 🎓 Quick Reference

```bash
# Set environment
source .env

# Deploy worker
curl -X PUT "https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/workers/scripts/catalog" \
  -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}" \
  -F "metadata=@metadata.json;type=application/json" \
  -F "worker.js=@worker.js;type=application/javascript+module"

# Write to KV
curl -X PUT "https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/storage/kv/namespaces/NS_ID/values/KEY" \
  -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}" \
  -d '{"data":"value"}'

# Read from KV
curl -s "https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/storage/kv/namespaces/NS_ID/values/KEY" \
  -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}"

# Test worker
curl https://catalog.navickaszilvinas.workers.dev/products
```

---

**Last Updated:** 2025-12-22  
**Maintainer:** Serpent Town Team
