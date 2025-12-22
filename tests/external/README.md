# External Service Tests

Tests that require live external services (Cloudflare, Stripe, GitHub).

## ⚠️ Requirements

These tests require:
- Internet connection
- Valid API credentials in `.env`
- Live worker deployment
- External service availability

## 🔧 Services Tested

### Cloudflare Workers
- Worker API endpoints
- KV storage operations
- Webhook processing

### Stripe
- Payment link generation
- Webhook verification
- Session handling

### GitHub
- Repository operations (if applicable)
- Actions workflows (if applicable)

## 🚀 Running Tests

```bash
# Run all external tests
npm run test:external

# Run specific service tests
npm run test:cloudflare
npm run test:stripe
npm run test:github
```

## 🧪 Test Organization

```
tests/external/
├── README.md (this file)
├── cloudflare/
│   ├── worker-api.test.js      # Worker endpoint tests
│   ├── kv-operations.test.js   # KV storage tests
│   └── webhook.test.js         # Webhook processing tests
├── stripe/
│   ├── payment-links.test.js   # Payment link tests
│   └── webhook.test.js         # Stripe webhook tests
└── github/
    └── (future tests)
```

## ⚡ Skip in CI

These tests are **skipped in CI** by default (require credentials).

Enable with: `CI_RUN_EXTERNAL_TESTS=true npm test`

---

**Note:** Keep external tests separate from unit/integration tests to avoid CI failures.
