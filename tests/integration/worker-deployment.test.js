/**
 * TDD Tests: Deploy Worker with Webhook Endpoint
 * Group: worker-deployment
 * 
 * Tests that worker deploys successfully with new endpoint
 */

import assert from 'assert';

const GROUP = '🚀 Worker Deployment';

// Test configuration
const WORKER_URL = 'https://catalog.navickaszilvinas.workers.dev';
const TIMEOUT = 10000; // 10 second timeout

// Helper: Fetch with timeout
async function fetchWithTimeout(url, options = {}, timeout = TIMEOUT) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    return response;
  } catch (err) {
    clearTimeout(timeoutId);
    throw err;
  }
}

const tests = [];

// Test 1: Worker is online and responding
tests.push({
  name: 'Worker is online',
  async run() {
    const response = await fetchWithTimeout(`${WORKER_URL}/products`);
    assert(response.ok, `Worker should be online, got status: ${response.status}`);
  }
});

// Test 2: New webhook endpoint exists
tests.push({
  name: '/stripe-product-webhook endpoint exists',
  async run() {
    // Send test POST request
    const response = await fetchWithTimeout(`${WORKER_URL}/stripe-product-webhook`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'test.event',
        data: { object: {} }
      })
    });
    
    // Should not return 404
    assert.notStrictEqual(response.status, 404, 
      'Endpoint should exist (not 404)');
    
    // Should return 200 (event received)
    assert.strictEqual(response.status, 200, 
      'Endpoint should return 200 for test event');
  }
});

// Test 3: Webhook accepts product.created event
tests.push({
  name: 'Webhook accepts product.created event',
  async run() {
    const testEvent = {
      type: 'product.created',
      data: {
        object: {
          id: 'prod_test_deploy',
          name: 'Test Snake',
          metadata: {
            species: 'ball_python',
            morph: 'normal'
          }
        }
      }
    };
    
    const response = await fetchWithTimeout(`${WORKER_URL}/stripe-product-webhook`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testEvent)
    });
    
    assert(response.ok, `Should accept product.created event, got: ${response.status}`);
    
    const data = await response.json();
    assert.strictEqual(data.received, true, 'Should confirm event received');
    assert.strictEqual(data.eventType, 'product.created', 'Should echo event type');
  }
});

// Test 4: Old endpoints still work
tests.push({
  name: 'Legacy endpoints still functional',
  async run() {
    // Test /products endpoint
    const productsRes = await fetchWithTimeout(`${WORKER_URL}/products`);
    assert(productsRes.ok, '/products endpoint should still work');
    
    // Test /user-products endpoint (should return 400 without user param)
    const userProductsRes = await fetchWithTimeout(`${WORKER_URL}/user-products`);
    assert.strictEqual(userProductsRes.status, 400, 
      '/user-products should return 400 without user param');
    
    // Test /product-status endpoint (should return 400 without id param)
    const statusRes = await fetchWithTimeout(`${WORKER_URL}/product-status`);
    assert.strictEqual(statusRes.status, 400,
      '/product-status should return 400 without id param');
  }
});

// Test 5: CORS headers present on webhook endpoint
tests.push({
  name: 'CORS headers configured correctly',
  async run() {
    const response = await fetchWithTimeout(`${WORKER_URL}/stripe-product-webhook`, {
      method: 'OPTIONS'
    });
    
    assert.strictEqual(response.status, 204, 'OPTIONS should return 204');
    
    // Check CORS headers exist
    const headers = response.headers;
    assert(headers.get('access-control-allow-origin'), 
      'Should have CORS origin header');
    assert(headers.get('access-control-allow-methods')?.includes('POST'), 
      'Should allow POST method');
  }
});

// Test runner
async function runTests() {
  console.log(`\n${GROUP}`);
  console.log('='.repeat(50));
  
  let passed = 0;
  let failed = 0;
  
  for (const test of tests) {
    try {
      await test.run();
      console.log(`✅ ${test.name}`);
      passed++;
    } catch (error) {
      console.log(`❌ ${test.name}`);
      console.log(`   ${error.message}`);
      failed++;
    }
  }
  
  console.log('\n' + '='.repeat(50));
  console.log(`Results: ${passed} passed, ${failed} failed`);
  
  if (failed > 0) {
    console.log('\n⚠️  Some tests failing - deploy worker to fix');
    process.exit(1);
  } else {
    console.log('\n✅ Worker deployed successfully!');
    process.exit(0);
  }
}

runTests();
