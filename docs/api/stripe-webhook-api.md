# Stripe Webhook API Reference

**Purpose:** Programmatically create and manage webhooks  
**Last Updated:** 2025-12-22  
**Status:** Tested & Working ✅

---

## 🔑 Authentication

```bash
# Use Stripe Secret Key
Authorization: Bearer sk_test_...

# Or basic auth (username = secret key, no password)
curl -u "sk_test_...:"
```

---

## 📡 List Webhook Endpoints

**Endpoint:** `GET /v1/webhook_endpoints`

```bash
curl https://api.stripe.com/v1/webhook_endpoints \
  -u "sk_test_...:"
```

**Response:**
```json
{
  "object": "list",
  "data": [
    {
      "id": "we_1ShC4EBjL72pe9XsP75yGcEV",
      "object": "webhook_endpoint",
      "api_version": "2024-12-18.acacia",
      "application": null,
      "created": 1734889202,
      "description": null,
      "enabled_events": [
        "product.created",
        "product.updated",
        "product.deleted",
        "price.created",
        "price.updated"
      ],
      "livemode": false,
      "metadata": {},
      "status": "enabled",
      "url": "https://catalog.navickaszilvinas.workers.dev/stripe-product-webhook"
    }
  ],
  "has_more": false,
  "url": "/v1/webhook_endpoints"
}
```

---

## ➕ Create Webhook Endpoint

**Endpoint:** `POST /v1/webhook_endpoints`

```bash
curl https://api.stripe.com/v1/webhook_endpoints \
  -u "sk_test_...:" \
  -d "url=https://your-worker.workers.dev/stripe-product-webhook" \
  -d "enabled_events[]=product.created" \
  -d "enabled_events[]=product.updated" \
  -d "enabled_events[]=product.deleted" \
  -d "enabled_events[]=price.created" \
  -d "enabled_events[]=price.updated" \
  -d "api_version=2024-12-18.acacia"
```

**Response:**
```json
{
  "id": "we_1ShC4EBjL72pe9XsP75yGcEV",
  "object": "webhook_endpoint",
  "api_version": "2024-12-18.acacia",
  "created": 1734889202,
  "enabled_events": [
    "product.created",
    "product.updated",
    "product.deleted",
    "price.created",
    "price.updated"
  ],
  "livemode": false,
  "secret": "whsec_KRLslfkNRTxDQB73Ogqvn05bVBWN4Cw0",
  "status": "enabled",
  "url": "https://catalog.navickaszilvinas.workers.dev/stripe-product-webhook"
}
```

⚠️ **IMPORTANT:** `secret` is **only returned once** at creation time!  
Save it immediately. Cannot retrieve later.

---

## 🔍 Get Webhook Details

**Endpoint:** `GET /v1/webhook_endpoints/{webhook_id}`

```bash
curl https://api.stripe.com/v1/webhook_endpoints/we_1ShC4EBjL72pe9XsP75yGcEV \
  -u "sk_test_...:"
```

**Note:** Does NOT return `secret` field (security feature)

---

## 🗑️ Delete Webhook Endpoint

**Endpoint:** `DELETE /v1/webhook_endpoints/{webhook_id}`

```bash
curl -X DELETE \
  https://api.stripe.com/v1/webhook_endpoints/we_1ShC4EBjL72pe9XsP75yGcEV \
  -u "sk_test_...:"
```

---

## 🔔 Webhook Event Types

### Product Events
- `product.created` - New product added
- `product.updated` - Product details changed
- `product.deleted` - Product removed

### Price Events
- `price.created` - New price added to product
- `price.updated` - Price changed
- `price.deleted` - Price removed

### All Product Events Wildcard
```bash
-d "enabled_events[]=product.*"
```

---

## 🔐 Webhook Signature Verification

Stripe signs webhook payloads with `Stripe-Signature` header.

**Header Format:**
```
Stripe-Signature: t=1734889202,v1=5257a869e7ecebeda32affa62cdca3fa51cad7e77a0e56ff536d0ce8e108d8bd
```

**Verification (pseudo-code):**
```javascript
const signature = request.headers.get('stripe-signature');
const payload = await request.text();
const secret = env.STRIPE_WEBHOOK_SECRET_PRODUCTS;

// Parse signature header
const parts = signature.split(',');
const timestamp = parts.find(p => p.startsWith('t=')).substring(2);
const expectedSig = parts.find(p => p.startsWith('v1=')).substring(3);

// Compute signature
const signedPayload = `${timestamp}.${payload}`;
const computedSig = await crypto.subtle.sign(
  'HMAC',
  secret,
  new TextEncoder().encode(signedPayload)
);

// Compare signatures
if (computedSig === expectedSig) {
  // Valid webhook
}
```

---

## 📊 Webhook Status

**Statuses:**
- `enabled` - Webhook is active
- `disabled` - Webhook manually disabled
- `failed` - Too many delivery failures

**Check Status:**
```bash
curl https://api.stripe.com/v1/webhook_endpoints/we_1ShC4EBjL72pe9XsP75yGcEV \
  -u "sk_test_...:" | jq '.status'
```

---

## 🧪 Testing Webhooks

### 1. Using Stripe CLI
```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login
stripe login

# Forward webhooks to localhost
stripe listen --forward-to http://localhost:8787/stripe-product-webhook

# Trigger test event
stripe trigger product.created
```

### 2. Manual Test Event
```bash
curl -X POST https://your-worker.workers.dev/stripe-product-webhook \
  -H "Content-Type: application/json" \
  -d '{
    "type": "product.created",
    "data": {
      "object": {
        "id": "prod_test123",
        "name": "Test Snake",
        "metadata": {
          "species": "ball_python",
          "morph": "banana"
        }
      }
    }
  }'
```

### 3. Real Stripe Event
Create/update a product in Stripe Dashboard → webhook fires automatically

---

## 📝 Best Practices

### 1. Idempotency
Handle duplicate webhook deliveries:
```javascript
const processedEvents = new Set();

if (processedEvents.has(event.id)) {
  return { message: 'Already processed' };
}
processedEvents.add(event.id);
```

### 2. Return Quickly
Respond within 5 seconds:
```javascript
// Acknowledge receipt immediately
response.send({ received: true });

// Process in background
await processWebhookAsync(event);
```

### 3. Retry Logic
Stripe retries failed webhooks (up to 3 days)  
Return 2xx status = success  
Return 4xx/5xx status = retry

### 4. Secret Rotation
```bash
# Create new endpoint
# Update worker with new secret
# Delete old endpoint
```

---

## 🔧 Troubleshooting

### Webhook Not Firing
- Check URL is publicly accessible
- Check HTTPS (required, not HTTP)
- Check firewall/CORS settings
- Verify enabled_events includes your event type

### 401 Unauthorized
- Wrong signing secret
- Secret verification failing
- Check `Stripe-Signature` header exists

### 429 Rate Limited
- Too many webhooks firing
- Slow response time → Stripe queuing up
- Optimize handler to respond faster

---

## 📚 Related Documentation

- **Stripe Official Docs:** https://stripe.com/docs/webhooks
- **Event Types:** https://stripe.com/docs/api/events/types
- **Best Practices:** https://stripe.com/docs/webhooks/best-practices
- **Signature Verification:** https://stripe.com/docs/webhooks/signatures

---

## ✅ Tested Commands

All commands below have been tested and work:

```bash
# List webhooks ✅
curl https://api.stripe.com/v1/webhook_endpoints \
  -u "sk_test_...:"

# Create webhook ✅
curl https://api.stripe.com/v1/webhook_endpoints \
  -u "sk_test_...:" \
  -d "url=https://catalog.navickaszilvinas.workers.dev/stripe-product-webhook" \
  -d "enabled_events[]=product.created" \
  -d "enabled_events[]=product.updated" \
  -d "enabled_events[]=product.deleted" \
  -d "enabled_events[]=price.created" \
  -d "enabled_events[]=price.updated"

# Get webhook details ✅
curl https://api.stripe.com/v1/webhook_endpoints/we_1ShC4EBjL72pe9XsP75yGcEV \
  -u "sk_test_...:"

# Test webhook endpoint ✅
curl -X POST https://catalog.navickaszilvinas.workers.dev/stripe-product-webhook \
  -H "Content-Type: application/json" \
  -d '{"type":"test.event","data":{"object":{}}}'
```

---

## 🎯 Quick Reference

| Action | Method | Endpoint |
|--------|--------|----------|
| List webhooks | GET | `/v1/webhook_endpoints` |
| Create webhook | POST | `/v1/webhook_endpoints` |
| Get webhook | GET | `/v1/webhook_endpoints/{id}` |
| Update webhook | POST | `/v1/webhook_endpoints/{id}` |
| Delete webhook | DELETE | `/v1/webhook_endpoints/{id}` |

**Webhook ID Format:** `we_1ShC4EBjL72pe9XsP75yGcEV`  
**Secret Format:** `whsec_KRLslfkNRTxDQB73Ogqvn05bVBWN4Cw0`  
**API Version:** `2024-12-18.acacia`
