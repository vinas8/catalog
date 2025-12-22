# Slow Tests (API Integration)

**Purpose:** Integration tests that make real HTTP calls to external services

**Execution Time:** 5-8 seconds per test

## Tests
- `frontend-to-backend.test.js` (6.1s) - Full stack validation with real API calls
- `real-scenario.test.js` (7.9s) - Real purchase flow simulation with API calls
- `worker-api.test.js` (5.9s) - Worker API endpoint testing

## Run
```bash
npm run test:slow
```

**Why slow:** These tests make real HTTP requests to Cloudflare Worker endpoints, not mocked responses.
