# Payment Module

**Version:** 0.1.0  
**Path:** `src/modules/payment/`  
**Status:** ✅ Enabled  

---

## 📋 Overview

Handles Stripe payment integration, webhooks, and checkout links.

---

## 🎯 Features

- Stripe Checkout session creation
- Webhook handling (payment success)
- Product ownership tracking via KV storage
- Client reference ID for user identification

---

## 📁 Files

```
src/modules/payment/
├── index.js              # Module exports & enable flag
├── payment-adapter.js    # Stripe API integration
├── config.js             # Stripe keys & endpoints
└── README.md             # This file
```

---

## 🔧 Configuration

**Stripe Keys** (`src/modules/payment/config.js`):
```javascript
export const STRIPE_CONFIG = {
  publishableKey: 'pk_test_...',
  secretKey: 'sk_test_...',
  webhookSecret: 'whsec_...'
};
```

**Environment Variables**:
```bash
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

---

## 🔌 API Endpoints (Cloudflare Worker)

### POST `/stripe-webhook`
Receives Stripe checkout.session.completed events

**Request:**
```json
{
  "type": "checkout.session.completed",
  "data": {
    "object": {
      "id": "cs_test_...",
      "client_reference_id": "user_abc123",
      "metadata": { "product_id": "prod_..." }
    }
  }
}
```

**Response:**
```json
{ "received": true }
```

### GET `/product-status?id=prod_xxx`
Check if product is sold

**Response:**
```json
{
  "product_id": "prod_xxx",
  "status": "available",  // or "sold"
  "owner_id": "user_abc123" // if sold
}
```

---

## 🧪 Testing

```bash
npm test tests/modules/payment/
```

---

## 🚫 Disable This Module

**Edit `src/modules/payment/index.js`:**
```javascript
export const ENABLED = false;
```

**Effect:** Catalog will show snakes but "Buy Now" buttons won't work.

---

## 📦 Dependencies

- **Stripe API**: Payment processing
- **Cloudflare KV**: Product ownership storage
- **Worker**: `/stripe-webhook` endpoint

---

## 🔗 Related

- [Shop Module](./shop.md) - Uses payment for purchases
- [Worker API](../../worker/README.md) - Backend endpoints
