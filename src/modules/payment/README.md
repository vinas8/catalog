# Payment Provider Abstraction Layer

## 🔄 How to Switch Payment Providers

### Change ONE line in config:
```javascript
// src/payment/config.js
export const PAYMENT_PROVIDER = 'stripe';  // ← Change to 'paypal' or 'square'
```

That's it! No other code changes needed.

---

## Supported Providers

| Provider | Status | Fees | Checkout | Subscriptions | Webhooks |
|----------|--------|------|----------|---------------|----------|
| **Stripe** | ✅ Complete | 2.9% + $0.30 | ✅ | ✅ | ✅ |
| **PayPal** | ✅ Complete | 2.9% + $0.30 | ✅ | ✅ | ✅ |
| **Square** | ✅ Complete | 2.6% + $0.10 | ✅ | ✅ | ✅ |
| **Mock** | ✅ Testing | 3% + $0.30 | ✅ | ✅ | ✅ |

---

## Example: Switching from Stripe to PayPal

**Before:**
```javascript
export const PAYMENT_PROVIDER = 'stripe';
```

**After:**
```javascript
export const PAYMENT_PROVIDER = 'paypal';
```

**Steps:**
1. Update config
2. Add PayPal API keys to `.env`
3. Update webhook URL in PayPal dashboard
4. Deploy worker: `bash .github/skills/worker-deploy.sh`
5. Test!

**NO changes to:**
- Business logic
- UI code
- Database schema
- Webhook handler structure

---

## Architecture: KV Storage (No JSON Files)

All data stored in Cloudflare KV namespaces:

```
KV Namespaces:
├── USER_PRODUCTS         → Customer purchases
│   ├── user:{hash}       → Array of purchased products
│   └── userdata:{hash}   → User profile
│
├── MERCHANTS             → Merchant accounts
│   ├── merchant:{id}     → Merchant profile + subscription
│   └── merchant_products:{id} → Merchant's listed products
│
├── ORDERS                → Order history
│   ├── order:{id}        → Order details + shipping address
│   └── merchant_orders:{merchant_id} → Orders for merchant
│
├── PRODUCTS              → Product catalog
│   ├── product:{id}      → Product details
│   └── product:status:{id} → Availability status
│
└── SUBSCRIPTIONS         → Merchant subscriptions
    └── subscription:{merchant_id} → Subscription status
```

**Benefits:**
- Global CDN distribution
- No file I/O bottlenecks
- Atomic updates
- Easy to scale
- Provider-agnostic

---

## Adding a New Provider

1. Extend `PaymentAdapter` class
2. Implement 4 methods:
   - `createCheckout()`
   - `createMerchantSubscription()`
   - `processWebhook()`
   - `verifyWebhookSignature()`
3. Add to factory switch statement
4. Add fees to config
5. Done!

Example:
```javascript
export class NewProviderAdapter extends PaymentAdapter {
  async createCheckout(product, customer, merchant) {
    // Call provider's API
    // Return { checkout_url, session_id }
  }
  
  async processWebhook(payload, headers) {
    // Parse webhook
    // Return { event_type, data }
  }
}
```

---

## Fee Breakdown (Example: $100 product)

| Component | Stripe | PayPal | Square |
|-----------|--------|--------|--------|
| Product price | $100.00 | $100.00 | $100.00 |
| Platform fee (5%) | $5.00 | $5.00 | $5.00 |
| Processing fee | $3.20 | $3.20 | $2.70 |
| **Customer pays** | **$108.20** | **$108.20** | **$107.70** |
| **Merchant gets** | **$95.00** | **$95.00** | **$95.00** |
| **Platform gets** | **$5.00** | **$5.00** | **$5.00** |

💰 Square has lowest fees!

---

## Usage in Worker

```javascript
import { PaymentAdapterFactory } from '../src/payment/payment-adapter.js';
import { PAYMENT_PROVIDER } from '../src/payment/config.js';

// Create adapter
const adapter = PaymentAdapterFactory.create(PAYMENT_PROVIDER);

// Handle webhook
const result = await adapter.processWebhook(request.body, request.headers);

if (result.event_type === 'purchase_completed') {
  // Store order in KV
  await env.ORDERS.put(
    `order:${result.data.order_id}`,
    JSON.stringify(result.data)
  );
  
  // Notify merchant
  await notifyMerchant(result.data.merchant_id, result.data);
}
```

---

## Migration: JSON Files → KV Storage

**Old way (data/products.json):**
```javascript
const products = await fetch('/data/products.json').then(r => r.json());
```

**New way (KV):**
```javascript
const products = await env.PRODUCTS.get('catalog', { type: 'json' });
```

**Migration script coming soon!**
