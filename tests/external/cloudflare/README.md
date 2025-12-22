# Cloudflare Worker Tests

Tests for Cloudflare Workers, KV storage, and webhook processing.

## 📦 Tests

### JavaScript Tests
- **worker-api.test.js** - Worker endpoint validation
  - Config validation
  - Endpoint availability
  - Register user flow
  - User products retrieval
  - Hash generation

### Shell Script Tests
- **e2e-purchase-flow.sh** - End-to-end purchase flow
- **full-user-journey-test.sh** - Complete user journey
- **auto-real-purchase-test.sh** - Automated purchase test
- **simple-test.sh** - Quick smoke test
- **test-first-purchase-fix.sh** - First purchase bug regression test

## 🚀 Running Tests

```bash
# JavaScript test
node tests/external/cloudflare/worker-api.test.js

# Shell tests
bash tests/external/cloudflare/e2e-purchase-flow.sh
bash tests/external/cloudflare/full-user-journey-test.sh
```

## ⚙️ Requirements

- Live worker deployed at: `https://catalog.navickaszilvinas.workers.dev`
- KV namespace `USER_PRODUCTS` bound to worker
- `.env` file with `CLOUDFLARE_API_TOKEN`

## 📊 Expected Results

All tests should pass when:
- Worker is deployed and accessible
- KV storage is working
- Webhooks are configured correctly

---

**Note:** These tests make real API calls to Cloudflare.
