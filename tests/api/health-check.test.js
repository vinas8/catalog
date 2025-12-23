#!/usr/bin/env node
/**
 * API Health Check Tests - SMRI S6.0.03
 */

const WORKER_URL = process.env.WORKER_URL || 'https://catalog.navickaszilvinas.workers.dev';

let passed = 0;
let failed = 0;
let pingTime = 0;
let productCount = 0;

function log(emoji, msg) {
  console.log(`${emoji} ${msg}`);
}

async function test(name, fn) {
  try {
    const start = Date.now();
    await fn();
    const duration = Date.now() - start;
    log('✅', `${name} (${duration}ms)`);
    passed++;
  } catch (error) {
    log('❌', `${name}: ${error.message}`);
    failed++;
  }
}

async function runHealthCheck() {
  console.log('\n🏥 API Health Check - SMRI S6.0.03\n');
  
  await test('Worker URL is valid', async () => {
    if (!WORKER_URL.startsWith('http')) throw new Error('Invalid URL');
  });
  
  await test('Worker is online', async () => {
    const start = Date.now();
    const res = await fetch(WORKER_URL + '/products');
    pingTime = Date.now() - start;
    if (!res.ok) throw new Error(`Status ${res.status}`);
  });
  
  await test('Products API returns data', async () => {
    const res = await fetch(WORKER_URL + '/products');
    const data = await res.json();
    if (!Array.isArray(data)) throw new Error('Not an array');
    productCount = data.length;
    if (productCount === 0) throw new Error('No products');
  });
  
  await test('Products have required fields', async () => {
    const res = await fetch(WORKER_URL + '/products');
    const products = await res.json();
    const required = ['id', 'name', 'species', 'morph', 'price'];
    for (const field of required) {
      if (!(field in products[0])) throw new Error(`Missing ${field}`);
    }
  });
  
  await test('CORS headers present', async () => {
    const res = await fetch(WORKER_URL + '/products');
    const cors = res.headers.get('access-control-allow-origin');
    if (!cors || cors === 'null') throw new Error('No CORS');
  });
  
  await test('User products endpoint', async () => {
    const res = await fetch(`${WORKER_URL}/user-products?user=test`);
    if (res.status !== 200 && res.status !== 404) throw new Error(`Status ${res.status}`);
  });
  
  // Test 7: Response time is acceptable (relaxed for Termux)
  await test('Response time < 5000ms', async () => {
    if (pingTime > 5000) throw new Error(`Slow: ${pingTime}ms`);
  });
  
  await test('Valid JSON format', async () => {
    const res = await fetch(WORKER_URL + '/products');
    const text = await res.text();
    JSON.parse(text);
  });
  
  // Test 9: Stripe products exist
  let stripeCount = 0;
  await test('Stripe products exist', async () => {
    const res = await fetch(WORKER_URL + '/products');
    const products = await res.json();
    const stripeProducts = products.filter(p => p.source === 'stripe' && p.stripe_link);
    stripeCount = stripeProducts.length;
    if (stripeCount === 0) throw new Error('No Stripe products');
  });
  
  // Test 10: Stripe links are valid
  await test('Stripe checkout links valid', async () => {
    const res = await fetch(WORKER_URL + '/products');
    const products = await res.json();
    const validLinks = products.filter(p => 
      p.stripe_link && p.stripe_link.startsWith('https://buy.stripe.com/')
    );
    if (validLinks.length === 0) throw new Error('No valid Stripe links');
  });
  
  console.log('\n' + '='.repeat(50));
  console.log(`📊 Passed: ${passed}`);
  console.log(`📊 Failed: ${failed}`);
  console.log(`📊 Total: ${passed + failed}`);
  
  if (failed === 0) {
    console.log('🎉 All health checks passed!');
    console.log('='.repeat(50));
    console.log(`\n✅ Worker: ONLINE (${pingTime}ms)`);
    console.log(`✅ Products: ${productCount} in KV`);
    console.log(`✅ Stripe Products: ${stripeCount}`);
    console.log(`✅ API Status: Healthy\n`);
  } else {
    console.log(`⚠️ ${failed} check(s) failed`);
    console.log('='.repeat(50) + '\n');
    process.exit(1);
  }
}

runHealthCheck().catch(err => {
  console.error('💥 Crashed:', err);
  process.exit(1);
});
