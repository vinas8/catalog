#!/usr/bin/env node
/**
 * API Health Check Tests - SMRI S6.0.03
 * Refactored to use shared testing module
 */

import { TestRunner } from '../../src/modules/testing/test-runner.js';
import { WorkerClient } from '../../src/modules/testing/api-clients.js';
import { assertEquals, assert, assertOK } from '../../src/modules/testing/assertions.js';

const WORKER_URL = process.env.WORKER_URL || 'https://catalog.navickaszilvinas.workers.dev';
const SMRI_VERSION = 'S6.5-11.1-12.03';
const MODULE_VERSION = 'v1.2';
const APP_VERSION = '0.7.2';

// Create test runner
const runner = new TestRunner({ verbose: true });
const client = new WorkerClient(WORKER_URL);

// Shared state
let pingTime = 0;
let productCount = 0;

console.log('\n🏥 API Health Check');
console.log('📋 SMRI: ' + SMRI_VERSION + ' | Module: ' + MODULE_VERSION);
console.log('📦 App Version: ' + APP_VERSION);
console.log('🔗 Worker: ' + WORKER_URL + '\n');

// Define tests
runner.add('Worker URL is valid', async () => {
  assert(WORKER_URL.startsWith('http'), 'URL must start with http');
});

runner.add('Worker is online', async () => {
  const start = Date.now();
  const response = await client.products();
  pingTime = Date.now() - start;
  assertOK(response, 'Worker should respond OK');
});

runner.add('Products API returns data', async () => {
  const response = await client.products();
  assert(Array.isArray(response.data), 'Response should be array');
  productCount = response.data.length;
  assert(productCount > 0, 'Should have products');
});

runner.add('Products have required fields', async () => {
  const response = await client.products();
  const products = response.data;
  const required = ['id', 'name', 'species', 'morph', 'price'];
  
  for (const field of required) {
    assert(field in products[0], `Product missing ${field}`);
  }
});

runner.add('CORS headers present', async () => {
  const response = await client.products();
  const cors = response.headers['access-control-allow-origin'];
  assert(cors && cors !== 'null', 'CORS headers required');
});

runner.add('User products endpoint', async () => {
  const response = await client.userProducts('test');
  assert(
    response.status === 200 || response.status === 404,
    'Should return 200 or 404'
  );
});

runner.add('Response time < 5000ms', async () => {
  assert(pingTime < 5000, `Response too slow: ${pingTime}ms`);
});

runner.add('Valid JSON format', async () => {
  const response = await client.products();
  assert(response.data, 'Should parse as JSON');
  assert(typeof response.data === 'object', 'Should be object/array');
});

runner.add('Stripe products exist', async () => {
  const response = await client.products();
  const products = response.data;
  const stripeProducts = products.filter(p => p.source === 'stripe' && p.stripe_link);
  assert(stripeProducts.length > 0, 'Should have Stripe products');
});

runner.add('Stripe checkout links valid', async () => {
  const response = await client.products();
  const products = response.data;
  const validLinks = products.filter(p => 
    p.stripe_link && p.stripe_link.startsWith('https://buy.stripe.com/')
  );
  assert(validLinks.length > 0, 'Should have valid Stripe links');
});

// Run tests
const results = await runner.run();

// Additional summary
const summary = runner.getSummary();
if (summary.failed === 0) {
  console.log(`\n✅ Worker: ONLINE (${pingTime}ms)`);
  console.log(`✅ Products: ${productCount} in KV`);
  console.log(`✅ API Status: Healthy\n`);
  process.exit(0);
} else {
  process.exit(1);
}
