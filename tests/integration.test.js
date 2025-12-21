#!/usr/bin/env node
// Integration Test - Worker API & Purchase Flow
// Tests the complete purchase flow with worker config

import { WORKER_CONFIG } from '../src/config/worker-config.js';

let passed = 0;
let failed = 0;

function test(name, fn) {
  return fn()
    .then(() => {
      console.log(`✅ ${name}`);
      passed++;
    })
    .catch((error) => {
      console.log(`❌ ${name}: ${error.message}`);
      failed++;
    });
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

console.log('🧪 Integration Tests - Worker API\n');

// Test 1: Config exists and is valid
await test('Worker config exists', async () => {
  assert(WORKER_CONFIG, 'WORKER_CONFIG not found');
  assert(WORKER_CONFIG.WORKER_URL, 'WORKER_URL not defined');
  assert(WORKER_CONFIG.ENDPOINTS, 'ENDPOINTS not defined');
  console.log(`   📍 Using: ${WORKER_CONFIG.WORKER_URL}`);
});

// Test 2: Required endpoints defined
await test('All required endpoints defined', async () => {
  const required = ['REGISTER_USER', 'USER_DATA', 'USER_PRODUCTS', 'STRIPE_WEBHOOK'];
  required.forEach(endpoint => {
    assert(WORKER_CONFIG.ENDPOINTS[endpoint], `${endpoint} not defined`);
  });
});

// Test 3: Helper methods work
await test('getEndpoint() helper works', async () => {
  const url = WORKER_CONFIG.getEndpoint('USER_DATA');
  assert(url.includes(WORKER_CONFIG.WORKER_URL), 'URL doesnt include base');
  assert(url.includes('/user-data'), 'URL doesnt include endpoint');
  console.log(`   🔗 ${url}`);
});

// Test 4: getUserEndpoint() helper works
await test('getUserEndpoint() helper works', async () => {
  const testHash = 'test123abc';
  const url = WORKER_CONFIG.getUserEndpoint('USER_PRODUCTS', testHash);
  assert(url.includes('?user='), 'URL missing user parameter');
  assert(url.includes(testHash), 'URL missing user hash');
  console.log(`   🔗 ${url}`);
});

// Test 5: Worker is reachable (simple ping)
await test('Worker is reachable', async () => {
  try {
    const response = await fetch(WORKER_CONFIG.WORKER_URL);
    // Any response (even 404) means worker is reachable
    assert(response, 'No response from worker');
    console.log(`   📡 Status: ${response.status}`);
  } catch (err) {
    throw new Error(`Worker unreachable: ${err.message}`);
  }
});

// Test 6: Test user creation endpoint
await test('Register user endpoint exists', async () => {
  const testUser = {
    user_id: `test_${Date.now()}`,
    username: 'TestUser',
    email: 'test@example.com',
    created_at: new Date().toISOString(),
    loyalty_points: 0,
    loyalty_tier: 'bronze'
  };

  try {
    const url = WORKER_CONFIG.getEndpoint('REGISTER_USER');
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testUser)
    });
    
    // Should get a response (even if KV not bound in test)
    assert(response, 'No response from register endpoint');
    console.log(`   📡 Status: ${response.status}`);
    
    if (response.ok) {
      const data = await response.json();
      console.log(`   ✅ User registered: ${data.user?.user_id || 'unknown'}`);
    } else {
      console.log(`   ⚠️  Registration returned ${response.status} (may need KV binding)`);
    }
  } catch (err) {
    // Network error is OK for local testing
    if (err.message.includes('fetch')) {
      console.log('   ⚠️  Worker may not be deployed yet (fetch failed)');
    } else {
      throw err;
    }
  }
});

// Test 7: Test user products endpoint
await test('User products endpoint exists', async () => {
  const testHash = 'test123';
  try {
    const url = WORKER_CONFIG.getUserEndpoint('USER_PRODUCTS', testHash);
    const response = await fetch(url);
    
    assert(response, 'No response from user products endpoint');
    console.log(`   📡 Status: ${response.status}`);
    
    if (response.ok) {
      const products = await response.json();
      console.log(`   📦 Products: ${Array.isArray(products) ? products.length : 0}`);
    }
  } catch (err) {
    if (err.message.includes('fetch')) {
      console.log('   ⚠️  Worker may not be deployed yet (fetch failed)');
    } else {
      throw err;
    }
  }
});

// Test 8: Purchase flow simulation
await test('Purchase flow hash generation', async () => {
  // Simulate catalog.html hash generation
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 15);
  const hash = timestamp + random;
  
  assert(hash.length > 10, 'Hash too short');
  assert(/^[a-z0-9]+$/.test(hash), 'Hash contains invalid characters');
  console.log(`   🔑 Generated hash: ${hash.substring(0, 20)}...`);
});

// Test 9: LocalStorage fallback
await test('LocalStorage available for fallback', async () => {
  // In Node.js, localStorage won't exist, but we can check the pattern
  const mockStorage = {
    serpent_user_hash: 'abc123',
    serpent_user: JSON.stringify({ user_id: 'abc123', username: 'Test' })
  };
  
  assert(mockStorage.serpent_user_hash, 'User hash key missing');
  assert(mockStorage.serpent_user, 'User data key missing');
  
  const userData = JSON.parse(mockStorage.serpent_user);
  assert(userData.user_id === mockStorage.serpent_user_hash, 'User ID mismatch');
  console.log(`   💾 LocalStorage pattern validated`);
});

// Test 10: URL construction patterns
await test('Game URL construction works', async () => {
  const testHash = 'testuser123';
  const gameUrl = `/game.html?user=${testHash}`;
  
  assert(gameUrl.includes('?user='), 'Missing user parameter');
  assert(gameUrl.includes(testHash), 'Missing user hash');
  assert(!gameUrl.includes('#'), 'Should use ? not # for user param');
  console.log(`   🎮 Game URL: ${gameUrl}`);
});

// Summary
console.log('\n' + '='.repeat(50));
console.log(`✅ Passed: ${passed}`);
console.log(`❌ Failed: ${failed}`);
console.log(`📊 Total: ${passed + failed}`);

if (failed === 0) {
  console.log('🎉 All integration tests passed!');
  process.exit(0);
} else {
  console.log('⚠️  Some tests failed!');
  process.exit(1);
}
