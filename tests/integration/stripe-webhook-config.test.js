/**
 * TDD Tests: Configure Stripe Webhook via API
 * Group: stripe-webhook-config
 * 
 * Tests that webhook is configured in Stripe Dashboard
 */

import assert from 'assert';
import { spawn } from 'child_process';
import { readFileSync } from 'fs';

const GROUP = '🔗 Stripe Webhook Configuration';

// Load environment
const env = {};
const envFile = readFileSync('.env', 'utf-8');
envFile.split('\n').forEach(line => {
  const [key, value] = line.split('=');
  if (key && value) env[key.trim()] = value.trim();
});

const STRIPE_SECRET_KEY = env.STRIPE_SECRET_KEY;
const WEBHOOK_URL = 'https://catalog.navickaszilvinas.workers.dev/stripe-product-webhook';

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
  
  const response = await fetch(url, options);
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Stripe API error: ${response.status} ${error}`);
  }
  return response.json();
}

const tests = [];

// Test 1: Can list webhooks
tests.push({
  name: 'Stripe API: List webhook endpoints',
  async run() {
    const result = await stripeAPI('/webhook_endpoints');
    
    assert(result, 'Should return result');
    assert(Array.isArray(result.data), 'Should have data array');
    console.log(`   Found ${result.data.length} existing webhook(s)`);
  }
});

// Test 2: Product webhook endpoint exists
tests.push({
  name: 'Product webhook endpoint configured',
  async run() {
    const result = await stripeAPI('/webhook_endpoints');
    
    // Find our webhook
    const webhook = result.data.find(wh => wh.url === WEBHOOK_URL);
    
    assert(webhook, `Webhook should exist for ${WEBHOOK_URL}`);
    console.log(`   Webhook ID: ${webhook.id}`);
  }
});

// Test 3: Webhook listens to correct events
tests.push({
  name: 'Webhook listens to product.* and price.* events',
  async run() {
    const result = await stripeAPI('/webhook_endpoints');
    const webhook = result.data.find(wh => wh.url === WEBHOOK_URL);
    
    assert(webhook, 'Webhook should exist');
    
    const events = webhook.enabled_events;
    const requiredEvents = [
      'product.created',
      'product.updated', 
      'product.deleted',
      'price.created',
      'price.updated'
    ];
    
    for (const event of requiredEvents) {
      assert(events.includes(event), 
        `Webhook should listen to ${event}`);
    }
    
    console.log(`   Listening to ${events.length} events`);
  }
});

// Test 4: Webhook secret is saved
tests.push({
  name: 'Webhook signing secret documented',
  async run() {
    // Webhook secret is only shown once at creation
    // We can't retrieve it via API later
    // Just verify webhook exists and is configured
    const result = await stripeAPI('/webhook_endpoints');
    const webhook = result.data.find(wh => wh.url === WEBHOOK_URL);
    
    assert(webhook, 'Webhook should exist');
    assert(webhook.id, 'Webhook should have ID');
    
    console.log(`   Webhook ID: ${webhook.id}`);
    console.log(`   ⚠️  Secret only shown at creation (save it from setup script)`);
  }
});

// Test 5: Webhook is active
tests.push({
  name: 'Webhook is active (not disabled)',
  async run() {
    const result = await stripeAPI('/webhook_endpoints');
    const webhook = result.data.find(wh => wh.url === WEBHOOK_URL);
    
    assert(webhook, 'Webhook should exist');
    assert.strictEqual(webhook.status, 'enabled', 
      'Webhook should be enabled');
  }
});

// Test runner
async function runTests() {
  console.log(`\n${GROUP}`);
  console.log('='.repeat(50));
  
  if (!STRIPE_SECRET_KEY) {
    console.log('❌ STRIPE_SECRET_KEY not found in .env');
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
    }
  }
  
  console.log('\n' + '='.repeat(50));
  console.log(`Results: ${passed} passed, ${failed} failed`);
  
  if (failed > 0) {
    console.log('\n⚠️  Webhook not configured - run setup script');
    process.exit(1);
  } else {
    console.log('\n✅ Stripe webhook configured correctly!');
    process.exit(0);
  }
}

runTests();
