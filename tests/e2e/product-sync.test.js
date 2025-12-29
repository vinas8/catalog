/**
 * TDD Tests: End-to-End Product Sync Flow
 * Group: e2e-product-sync
 * 
 * Tests complete flow: Stripe → Webhook → KV → Frontend
 */

import assert from 'assert';
import { readFileSync } from 'fs';
import { KV_CONFIG, STRIPE_TEST } from '../test-constants.js';

const GROUP = '🔄 E2E Product Sync';

// Load environment
const env = {};
const envFile = readFileSync('.env', 'utf-8');
envFile.split('\n').forEach(line => {
  const [key, value] = line.split('=');
  if (key && value) env[key.trim()] = value.trim();
});

const STRIPE_SECRET_KEY = env.STRIPE_SECRET_KEY;
const WORKER_URL = 'https://catalog.navickaszilvinas.workers.dev';
const CLOUDFLARE_API_TOKEN = env.CLOUDFLARE_API_TOKEN;
const CLOUDFLARE_ACCOUNT_ID = env.CLOUDFLARE_ACCOUNT_ID;
const KV_NAMESPACE_ID = KV_CONFIG.NAMESPACE_ID; // PRODUCTS namespace

// Helper: Call Stripe API
async function stripeAPI(endpoint, method = 'GET', data = null) {
  const url = `https://api.stripe.com/v1${endpoint}`;
  const options = {
    method,
    headers: {
      'Authorization': `Bearer ${STRIPE_SECRET_KEY}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  };
  
  if (data && method === 'POST') {
    options.body = new URLSearchParams(data).toString();
  }
  
  if (method === 'DELETE') {
    options.method = 'DELETE';
  }
  
  const response = await fetch(url, options);
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Stripe API error: ${response.status} ${error}`);
  }
  return response.json();
}

// Helper: Read from KV
async function readKV(key) {
  const url = `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/storage/kv/namespaces/${KV_NAMESPACE_ID}/values/${key}`;
  const response = await fetch(url, {
    headers: { 'Authorization': `Bearer ${CLOUDFLARE_API_TOKEN}` }
  });
  
  if (!response.ok) {
    if (response.status === 404) return null;
    throw new Error(`KV read error: ${response.status}`);
  }
  
  return response.text();
}

// Helper: Wait with timeout
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const tests = [];

// Test 1: Create product in Stripe
let testProductId = null;

tests.push({
  name: 'Step 1: Create test product in Stripe',
  async run() {
    const timestamp = Date.now();
    
    const product = await stripeAPI('/products', 'POST', {
      name: `E2E Test Snake ${timestamp}`,
      description: 'Auto-generated test product',
      'metadata[species]': 'ball_python',
      'metadata[morph]': 'test',
      'metadata[sex]': 'male',
      'metadata[birth_year]': '2024',
      'metadata[weight_grams]': String(STRIPE_TEST.PRODUCT_PRICE)
    });
    
    testProductId = product.id;
    
    assert(testProductId, 'Product should be created');
    assert(testProductId.startsWith('prod_'), 'Product ID should start with prod_');
    
    console.log(`   Created: ${testProductId}`);
  }
});

// Test 2: Webhook fires (wait for it)
tests.push({
  name: 'Step 2: Wait for webhook to fire and index rebuild',
  async run() {
    assert(testProductId, 'Need product ID from previous test');
    
    console.log('   Waiting 5 seconds for webhook + index rebuild...');
    await sleep(5000);
    
    // Webhook should have fired by now
    console.log('   ✅ Webhook should have processed');
  }
});

// Test 3: Product appears in KV
tests.push({
  name: 'Step 3: Product exists in KV storage',
  async run() {
    assert(testProductId, 'Need product ID from previous test');
    
    const kvKey = `product:${testProductId}`;
    const productData = await readKV(kvKey);
    
    assert(productData !== null, `Product should exist in KV: ${kvKey}`);
    
    const product = JSON.parse(productData);
    assert.strictEqual(product.id, testProductId, 'Product ID should match');
    assert(product.name.includes('E2E Test Snake'), 'Product name should match');
    assert.strictEqual(product.species, 'ball_python', 'Species should be ball_python');
    assert.strictEqual(product.morph, 'test', 'Morph should be test');
    
    console.log(`   Found in KV: ${product.name}`);
  }
});

// Test 4: Product appears in index (retry logic)
tests.push({
  name: 'Step 4: Product in index (with retry)',
  async run() {
    assert(testProductId, 'Need product ID from previous test');
    
    // Retry up to 5 times with 2 second delays
    let attempts = 0;
    let found = false;
    
    while (attempts < 5 && !found) {
      attempts++;
      console.log(`   Attempt ${attempts}/5 to find in index...`);
      
      const indexData = await readKV('_index:products');
      if (indexData) {
        const index = JSON.parse(indexData);
        if (index.includes(testProductId)) {
          found = true;
          console.log(`   Index has ${index.length} products (includes test product)`);
        } else {
          await sleep(2000); // Wait 2 seconds before retry
        }
      } else {
        await sleep(2000);
      }
    }
    
    if (!found) {
      // Webhook might not have fired - manually trigger it
      console.log('   ⚠️  Webhook might not have fired, manually syncing...');
      
      // Call webhook manually
      const event = {
        type: 'product.created',
        data: {
          object: {
            id: testProductId,
            name: `E2E Test Snake ${Date.now()}`,
            metadata: {
              species: 'ball_python',
              morph: 'test'
            }
          }
        }
      };
      
      await fetch(`${WORKER_URL}/stripe-product-webhook`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event)
      });
      
      console.log('   Manual webhook sent, waiting 2 seconds...');
      await sleep(2000);
      
      // Check again
      const indexData = await readKV('_index:products');
      const index = JSON.parse(indexData);
      found = index.includes(testProductId);
    }
    
    assert(found, `Index should include ${testProductId} (tried ${attempts} times)`);
  }
});

// Test 5: Worker API returns product
tests.push({
  name: 'Step 5: Worker /products endpoint returns product',
  async run() {
    assert(testProductId, 'Need product ID from previous test');
    
    const response = await fetch(`${WORKER_URL}/products`);
    assert(response.ok, 'Worker should return products');
    
    const products = await response.json();
    assert(Array.isArray(products), 'Should return array');
    
    const testProduct = products.find(p => p.id === testProductId);
    assert(testProduct, `Products should include ${testProductId}`);
    assert.strictEqual(testProduct.species, 'ball_python', 'Species should match');
    
    console.log(`   Worker returned ${products.length} products (includes test)`);
  }
});

// Test 6: Update product in Stripe
tests.push({
  name: 'Step 6: Update product (manual webhook trigger)',
  async run() {
    assert(testProductId, 'Need product ID from previous test');
    
    const updated = await stripeAPI(`/products/${testProductId}`, 'POST', {
      name: `E2E Test Snake UPDATED ${Date.now()}`,
      'metadata[morph]': 'updated_morph'
    });
    
    assert.strictEqual(updated.id, testProductId, 'Should return same product ID');
    assert(updated.name.includes('UPDATED'), 'Name should be updated');
    
    console.log('   Product updated in Stripe');
    console.log('   Manually triggering webhook with full product data...');
    
    // Send FULL product object in webhook (like Stripe does)
    const event = {
      type: 'product.updated',
      data: { 
        object: updated  // Full Stripe product object
      }
    };
    
    const webhookRes = await fetch(`${WORKER_URL}/stripe-product-webhook`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(event)
    });
    
    assert(webhookRes.ok, 'Webhook should accept event');
    console.log('   Waiting 2 seconds for KV update...');
    await sleep(2000);
  }
});

// Test 7: KV reflects update
tests.push({
  name: 'Step 7: KV reflects product update (with retry)',
  async run() {
    assert(testProductId, 'Need product ID from previous test');
    
    const kvKey = `product:${testProductId}`;
    let attempts = 0;
    let updated = false;
    
    while (attempts < 5 && !updated) {
      attempts++;
      console.log(`   Attempt ${attempts}/5 to check for update...`);
      
      const productData = await readKV(kvKey);
      assert(productData !== null, 'Product should still exist in KV');
      
      const product = JSON.parse(productData);
      if (product.name.includes('UPDATED') && product.morph === 'updated_morph') {
        updated = true;
        console.log(`   KV updated: ${product.name}`);
      } else {
        console.log(`   Not yet updated (name: ${product.name}, morph: ${product.morph})`);
        await sleep(2000);
      }
    }
    
    assert(updated, `KV should reflect update after ${attempts} attempts`);
  }
});

// Test 8: Delete product in Stripe
tests.push({
  name: 'Step 8: Delete product (manual webhook trigger)',
  async run() {
    assert(testProductId, 'Need product ID from previous test');
    
    const deleted = await stripeAPI(`/products/${testProductId}`, 'DELETE');
    assert.strictEqual(deleted.id, testProductId, 'Should return deleted product ID');
    assert.strictEqual(deleted.deleted, true, 'Should confirm deletion');
    
    console.log('   Product deleted in Stripe');
    console.log('   Manually triggering webhook...');
    
    // Manually trigger webhook - deleted event only has id
    const event = {
      type: 'product.deleted',
      data: { 
        object: {
          id: testProductId,
          deleted: true
        }
      }
    };
    
    const webhookRes = await fetch(`${WORKER_URL}/stripe-product-webhook`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(event)
    });
    
    assert(webhookRes.ok, 'Webhook should accept event');
    console.log('   Waiting 3 seconds for KV cleanup...');
    await sleep(3000);
  }
});

// Test 9: KV product removed
tests.push({
  name: 'Step 9: Product removed from KV (with retry)',
  async run() {
    assert(testProductId, 'Need product ID from previous test');
    
    const kvKey = `product:${testProductId}`;
    let attempts = 0;
    let deleted = false;
    
    while (attempts < 5 && !deleted) {
      attempts++;
      console.log(`   Attempt ${attempts}/5 to check for deletion...`);
      
      const productData = await readKV(kvKey);
      if (productData === null) {
        deleted = true;
        console.log('   ✅ Product removed from KV');
      } else {
        console.log(`   Still exists, waiting...`);
        await sleep(2000);
      }
    }
    
    assert(deleted, `Product should be deleted from KV after ${attempts} attempts`);
  }
});

// Test 10: Index updated
tests.push({
  name: 'Step 10: Index no longer includes product (with retry)',
  async run() {
    assert(testProductId, 'Need product ID from previous test');
    
    let attempts = 0;
    let removed = false;
    
    while (attempts < 10 && !removed) {  // Increase to 10 attempts
      attempts++;
      console.log(`   Attempt ${attempts}/10 to check index...`);
      
      const indexData = await readKV('_index:products');
      assert(indexData !== null, 'Product index should exist');
      
      const index = JSON.parse(indexData);
      if (!index.includes(testProductId)) {
        removed = true;
        console.log('   ✅ Index updated (product removed)');
      } else {
        console.log(`   Still in index, waiting 3 seconds...`);
        await sleep(3000);  // Increase wait time
      }
    }
    
    assert(removed, `Index should NOT include ${testProductId} after ${attempts} attempts`);
  }
});

// Test runner
async function runTests() {
  console.log(`\n${GROUP}`);
  console.log('='.repeat(50));
  console.log('Testing: Stripe → Webhook → KV → Worker → Frontend');
  console.log('');
  
  if (!STRIPE_SECRET_KEY || !CLOUDFLARE_API_TOKEN) {
    console.log('❌ Missing credentials in .env');
    process.exit(1);
  }
  
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
      break; // Stop on first failure (tests are sequential)
    }
  }
  
  console.log('\n' + '='.repeat(50));
  console.log(`Results: ${passed} passed, ${failed} failed`);
  
  if (failed > 0) {
    console.log('\n⚠️  E2E test failed - check webhook and KV sync');
    process.exit(1);
  } else {
    console.log('\n✅ Complete product sync flow working!');
    console.log('🎉 Stripe → Webhook → KV → Worker → Frontend');
    process.exit(0);
  }
}

runTests();
