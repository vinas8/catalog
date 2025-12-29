# Testing System Documentation

**Version:** 0.7.0  
**Created:** 2025-12-29  
**Status:** Implemented (Phases 1-3 complete)

---

## 📊 Overview

The testing system provides shared utilities for both CLI tests (`npm test`) and browser-based debug hub. All tests and debug pages use common modules to reduce duplication.

**Key Features:**
- ✅ Universal TestRunner (works in Node + browser)
- ✅ API clients for Stripe, KV, Worker
- ✅ Mock data generators
- ✅ Custom assertions
- ✅ Debug adapter for browser execution
- ✅ Expanded `/debug` endpoint with test registry

---

## 🏗️ Architecture

```
src/modules/testing/         # Shared testing utilities (911 LOC)
├── index.js                 # Main exports
├── test-runner.js           # Universal test execution
├── api-clients.js           # Stripe, KV, Worker clients
├── mock-data.js             # Test data generators
├── assertions.js            # Custom assertions
└── debug-adapter.js         # Browser test adapter

tests/                       # Test files (use shared modules)
├── api/
├── integration/
├── e2e/
├── modules/
├── smri/
└── snapshot/

worker/worker.js             # Debug endpoint (test registry)
debug/index.html             # Debug hub (test browser)
```

---

## 🧪 TestRunner Usage

### CLI Tests (Node.js)

```javascript
import { TestRunner } from '../../src/modules/testing/test-runner.js';
import { WorkerClient } from '../../src/modules/testing/api-clients.js';
import { assert } from '../../src/modules/testing/assertions.js';

const runner = new TestRunner({ verbose: true });
const client = new WorkerClient();

runner.add('Worker is online', async () => {
  const response = await client.health();
  assert(response.ok, 'Worker should be healthy');
});

const results = await runner.run();
process.exit(results.filter(r => r.status === 'fail').length > 0 ? 1 : 0);
```

### Browser Tests (Debug Hub)

```html
<script type="module">
import { TestRunner } from './src/modules/testing/test-runner.js';
import { DebugAdapter } from './src/modules/testing/debug-adapter.js';

const runner = new TestRunner();
const adapter = new DebugAdapter(runner, document.getElementById('output'));

runner.add('Test name', async () => {
  // Test code
});

await adapter.runWithUI();
</script>
```

---

## 🔌 API Clients

### StripeClient

```javascript
import { StripeClient } from '../../src/modules/testing/api-clients.js';

const stripe = new StripeClient('sk_test_...');

// List products
const products = await stripe.listProducts(100);

// Create product
const product = await stripe.createProduct({
  name: 'Test Snake',
  description: 'Banana Ball Python'
});

// Create price
const price = await stripe.createPrice(product.id, 45000, 'usd');

// Delete product
await stripe.deleteProduct(product.id);
```

### KVClient

```javascript
import { KVClient } from '../../src/modules/testing/api-clients.js';

const kv = new KVClient(accountId, namespaceId, apiToken);

// List keys
const keys = await kv.listKeys('product:');

// Get value
const value = await kv.get('product:prod_123');

// Put value
await kv.put('product:prod_123', JSON.stringify({ name: 'Snake' }));

// Delete value
await kv.delete('product:prod_123');
```

### WorkerClient

```javascript
import { WorkerClient } from '../../src/modules/testing/api-clients.js';

const worker = new WorkerClient('https://catalog.navickaszilvinas.workers.dev');

// Health check
const health = await worker.health();

// Get products
const products = await worker.products();

// Get user products
const userProducts = await worker.userProducts('user_hash');

// Custom endpoint
const response = await worker.callEndpoint('/custom', { method: 'POST' });
```

---

## �� Mock Data

```javascript
import { generateProduct, generateCustomer, generatePurchase } from '../../src/modules/testing/mock-data.js';

// Generate single product
const product = generateProduct({ name: 'Test Snake', price: 500 });

// Generate customer
const customer = generateCustomer({ email: 'test@example.com' });

// Generate purchase
const purchase = generatePurchase({ customer, product });

// Generate multiple products
const products = generateProducts(10, { species: 'ball_python' });
```

---

## ✅ Assertions

```javascript
import { assertEquals, assert, assertContains, assertThrows } from '../../src/modules/testing/assertions.js';

// Basic assertions
assertEquals(actual, expected);
assert(value, 'Should be truthy');
assertContains(array, item);
assertContains('hello world', 'world');

// HTTP assertions
assertStatus(response, 200);
assertOK(response);

// Array/Object assertions
assertLength(array, 5);
assertHasProperty(obj, 'name');

// Async assertions
await assertThrows(async () => {
  throw new Error('Expected error');
}, 'Expected error');
```

---

## 🔍 Debug Endpoint API

### GET /debug
List all test categories and SMRI scenarios.

**Response:**
```json
{
  "version": "0.7.0",
  "categories": {
    "api": { "name": "API Tests", "count": 1 },
    "integration": { "name": "Integration Tests", "count": 3 },
    "e2e": { "name": "End-to-End Tests", "count": 2 },
    "modules": { "name": "Module Tests", "count": 2 },
    "smri": { "name": "SMRI Tests", "count": 1 },
    "snapshot": { "name": "Snapshot Tests", "count": 1 }
  },
  "totalTests": 10,
  "smri": { "scenarios": [...], "count": 6 },
  "debugHub": "https://vinas8.github.io/catalog/debug/"
}
```

### GET /debug?category=api
List tests in a category.

**Response:**
```json
{
  "category": { "name": "API Tests", "count": 1 },
  "tests": [
    {
      "id": "api-health-check",
      "name": "Health Check",
      "file": "tests/api/health-check.test.js",
      "priority": "P0",
      "duration": "fast",
      "tags": ["api", "health", "smoke"]
    }
  ]
}
```

### GET /debug?test=api-health-check
Get specific test metadata.

**Response:**
```json
{
  "test": { ...test metadata... },
  "runUrl": "https://vinas8.github.io/catalog/debug/index.html?test=api-health-check",
  "cliCommand": "node tests/api/health-check.test.js"
}
```

---

## 📋 Test Registry

**10 tests currently registered:**

| ID | Category | Priority | Duration |
|----|----------|----------|----------|
| api-health-check | api | P0 | fast |
| integration-stripe-kv-sync | integration | P1 | medium |
| integration-worker-deployment | integration | P1 | slow |
| integration-webhook-config | integration | P1 | fast |
| e2e-purchase-flow | e2e | P0 | slow |
| e2e-security-scenarios | e2e | P0 | medium |
| module-game-tamagotchi | modules | P1 | fast |
| module-shop | modules | P1 | fast |
| smri-scenario-runner | smri | P0 | fast |
| snapshot-structure | snapshot | P2 | fast |

---

## 🎯 Implementation Status

### ✅ Phase 1: Extract Common Code (COMPLETE)
- Created `src/modules/testing/` with 6 modules (911 LOC)
- All utilities tested and working

### ✅ Phase 2: Update Tests (PARTIAL)
- ✅ Refactored `health-check.test.js`
- ⏳ 26 more test files to refactor

### ✅ Phase 3: Expand Debug Endpoint (COMPLETE)
- ✅ Added TEST_REGISTRY (10 tests)
- ✅ Added TEST_CATEGORIES (6 categories)
- ✅ Implemented `/debug`, `/debug?category=X`, `/debug?test=X`
- ✅ Deployed to production worker
- ✅ All endpoints tested

### ⏳ Phase 4: Update Debug Hub (TODO)
- Add category navigation
- Add test browser UI
- Add inline test runner
- Wire up to debug endpoints

### ⏳ Phase 5: Documentation (IN PROGRESS)
- ✅ This document created
- ⏳ Update README
- ⏳ Add testing guide

---

## 📝 Future Improvements

1. **Refactor remaining tests** - Convert all 27 test files to use TestRunner
2. **Debug Hub UI** - Add category browser and inline test runner
3. **Test execution API** - Add `/debug/run?test=X` endpoint
4. **Test coverage tracking** - Track which tests have been refactored
5. **Test dependencies** - Define test execution order and dependencies
6. **Parallel execution** - Run independent tests in parallel
7. **Test snapshots** - Save/compare test outputs
8. **Performance tracking** - Track test execution times

---

## 🔗 Related Documentation

- `.smri/INDEX.md` - SMRI system overview
- `README.md` - Project overview
- `tests/README.md` - Test suite documentation
- `worker/README.md` - Worker API documentation

---

**Last Updated:** 2025-12-29  
**Next:** Phase 4 (Debug Hub UI)
