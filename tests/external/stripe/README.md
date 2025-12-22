# Stripe Payment Tests

Tests for Stripe payment integration, webhooks, and payment links.

## 📦 Tests

### JavaScript Tests
- **marketplace.test.js** - Multi-provider payment system
  - Payment adapter factory
  - Fee calculations
  - Stripe, PayPal, Square, Mock adapters
  - Merchant registration
  - Product management

## 🚀 Running Tests

```bash
# JavaScript test
node tests/external/stripe/marketplace.test.js
```

## ⚙️ Requirements

- Stripe test API keys in `.env`:
  - `STRIPE_SECRET_KEY`
  - `STRIPE_PUBLISHABLE_KEY`
  - `STRIPE_WEBHOOK_SECRET`
- Live Cloudflare worker with Stripe webhook endpoint
- Active Stripe test account

## 📊 Test Coverage

- ✅ Payment provider abstraction
- ✅ Fee calculation (platform + processing)
- ✅ Merchant registration
- ✅ Product creation
- ✅ Multi-provider support (Stripe, PayPal, Square)

## 🔐 Security

**Never commit real Stripe keys!** Use test mode only.

Test keys start with:
- `sk_test_...` (secret key)
- `pk_test_...` (publishable key)
- `whsec_...` (webhook secret)

---

**Note:** These tests make real API calls to Stripe (test mode).
