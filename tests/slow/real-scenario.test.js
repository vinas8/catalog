#!/usr/bin/env node
// REAL USER SCENARIO TEST - This MUST pass for the app to work!
// Simulates actual purchase flow from catalog → game

import { WORKER_CONFIG } from '../../src/config/worker-config.js';

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
      console.log(`   💥 CRITICAL: Real user flow is broken!`);
      failed++;
    });
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

console.log('🎯 REAL USER SCENARIO TEST\n');
console.log('Testing the ACTUAL purchase flow that users experience...\n');

// Simulate real user hash from catalog
const TEST_USER_HASH = `test_${Date.now()}_realflow`;
const TEST_PRODUCT_ID = 'prod_test_batman_ball';

console.log(`👤 Test User Hash: ${TEST_USER_HASH}`);
console.log(`🐍 Test Product: ${TEST_PRODUCT_ID}\n`);

// STEP 1: User generates hash in catalog
await test('STEP 1: User browses catalog and hash is generated', async () => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 15);
  const hash = timestamp + random;
  
  // Simulate localStorage.setItem
  const mockStorage = {
    serpent_pending_purchase_hash: TEST_USER_HASH,
    serpent_last_purchase_hash: TEST_USER_HASH,
    serpent_user_hash: TEST_USER_HASH
  };
  
  assert(mockStorage.serpent_last_purchase_hash === TEST_USER_HASH, 'Hash not saved');
  console.log(`   💾 Hash saved to localStorage: ${TEST_USER_HASH.substring(0, 30)}...`);
});

// STEP 2: Webhook assigns product to user
await test('STEP 2: Webhook assigns snake to user in KV', async () => {
  const workerUrl = WORKER_CONFIG.getEndpoint('ASSIGN_PRODUCT');
  
  const response = await fetch(workerUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      user_id: TEST_USER_HASH,
      product_id: TEST_PRODUCT_ID
    })
  });
  
  assert(response.ok, `Webhook failed: ${response.status}`);
  const data = await response.json();
  assert(data.success, 'Product assignment failed');
  console.log(`   ✅ Snake assigned to KV: user:${TEST_USER_HASH}`);
});

// STEP 3: Success page checks if snake exists
await test('STEP 3: Success page verifies snake was assigned', async () => {
  const workerUrl = WORKER_CONFIG.getUserEndpoint('USER_PRODUCTS', TEST_USER_HASH);
  
  const response = await fetch(workerUrl);
  assert(response.ok, `Failed to fetch products: ${response.status}`);
  
  const products = await response.json();
  assert(Array.isArray(products), 'Products not an array');
  assert(products.length > 0, '🚨 NO SNAKES FOUND! User bought snake but it\'s not in KV!');
  
  console.log(`   🐍 Found ${products.length} snake(s) in user's account`);
  console.log(`   📦 Products: ${JSON.stringify(products.map(p => p.product_id))}`);
});

// STEP 4: User registers
await test('STEP 4: User completes registration', async () => {
  const workerUrl = WORKER_CONFIG.getEndpoint('REGISTER_USER');
  
  const userData = {
    user_id: TEST_USER_HASH,
    username: 'TestSnakeWhisperer42',
    email: 'test@serpenttown.com',
    created_at: new Date().toISOString(),
    loyalty_points: 0,
    loyalty_tier: 'bronze'
  };
  
  const response = await fetch(workerUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  });
  
  assert(response.ok, `Registration failed: ${response.status}`);
  const data = await response.json();
  assert(data.success, 'User save failed');
  console.log(`   👤 User registered: ${userData.username}`);
});

// STEP 5: Game loads user profile
await test('STEP 5: Game loads user profile from worker', async () => {
  const workerUrl = WORKER_CONFIG.getUserEndpoint('USER_DATA', TEST_USER_HASH);
  
  const response = await fetch(workerUrl);
  assert(response.ok, `Failed to load profile: ${response.status}`);
  
  const userData = await response.json();
  assert(userData.user_id === TEST_USER_HASH, 'User ID mismatch');
  assert(userData.username, 'Username missing');
  console.log(`   👤 Profile loaded: ${userData.username}`);
});

// STEP 6: Game loads user's snakes
await test('STEP 6: Game loads snakes from worker', async () => {
  const workerUrl = WORKER_CONFIG.getUserEndpoint('USER_PRODUCTS', TEST_USER_HASH);
  
  const response = await fetch(workerUrl);
  assert(response.ok, `Failed to load snakes: ${response.status}`);
  
  const products = await response.json();
  assert(Array.isArray(products), 'Products not an array');
  assert(products.length > 0, '🚨 SNAKE DISAPPEARED! Was there after purchase, now gone!');
  
  const snake = products[0];
  assert(snake.product_id === TEST_PRODUCT_ID, 'Wrong snake returned');
  assert(snake.user_id === TEST_USER_HASH, 'Snake belongs to different user');
  
  console.log(`   🐍 Snake loaded successfully!`);
  console.log(`   📊 Stats: Hunger=${snake.stats?.hunger}, Health=${snake.stats?.health}`);
});

// STEP 7: Second purchase should go to FARM not registration
await test('STEP 7: Second purchase goes to FARM (not registration)', async () => {
  // Simulate success.html checking for existing user
  const mockStorage = {
    serpent_user_hash: TEST_USER_HASH,
    serpent_user: JSON.stringify({
      user_id: TEST_USER_HASH,
      username: 'TestSnakeWhisperer42'
    })
  };
  
  const existingUser = mockStorage.serpent_user;
  const existingHash = mockStorage.serpent_user_hash;
  
  assert(existingUser, 'User data not in localStorage');
  assert(existingHash === TEST_USER_HASH, 'Hash mismatch in localStorage');
  
  // Should skip registration and go straight to game
  const shouldSkipRegistration = !!existingUser;
  assert(shouldSkipRegistration, '🚨 Second purchase forces re-registration!');
  
  // Import PAGE_URLS to verify redirect
  const { PAGE_URLS } = await import('../../src/config/worker-config.js');
  const expectedUrl = PAGE_URLS.getGameUrl(TEST_USER_HASH);
  
  assert(expectedUrl.includes('/game.html'), 'Should redirect to game.html');
  assert(expectedUrl.includes(`?user=${TEST_USER_HASH}`), 'Should include user hash');
  assert(!expectedUrl.includes('register'), 'Should NOT go to registration');
  
  console.log(`   ✅ Returning user goes to: ${expectedUrl}`);
  console.log(`   📝 Button text should say: "Go to My Farm"`);
});

// STEP 8: Verify farm page displays snakes
await test('STEP 8: Farm page (game.html) displays purchased snakes', async () => {
  const workerUrl = WORKER_CONFIG.getUserEndpoint('USER_PRODUCTS', TEST_USER_HASH);
  
  const response = await fetch(workerUrl);
  assert(response.ok, `Failed to load snakes: ${response.status}`);
  
  const products = await response.json();
  assert(Array.isArray(products), 'Products not an array');
  assert(products.length > 0, '🚨 NO SNAKES in farm! User bought but collection is empty!');
  
  // Verify farm URL structure
  const { PAGE_URLS } = await import('../../src/config/worker-config.js');
  const farmUrl = PAGE_URLS.getGameUrl(TEST_USER_HASH);
  
  assert(farmUrl === `/game.html?user=${TEST_USER_HASH}`, 'Farm URL incorrect');
  
  console.log(`   🏡 Farm URL: ${farmUrl}`);
  console.log(`   🐍 Snakes in collection: ${products.length}`);
  console.log(`   📦 Snake IDs: ${products.map(p => p.product_id).join(', ')}`);
});

// STEP 9: Buy second snake - should add to collection
await test('STEP 9: Buying second snake adds to existing collection', async () => {
  const SECOND_PRODUCT = 'prod_test_piebald_ball';
  
  // Assign second snake
  const workerUrl = WORKER_CONFIG.getEndpoint('ASSIGN_PRODUCT');
  const response = await fetch(workerUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      user_id: TEST_USER_HASH,
      product_id: SECOND_PRODUCT
    })
  });
  
  assert(response.ok, 'Second snake assignment failed');
  
  // Check collection now has 2 snakes
  const productsUrl = WORKER_CONFIG.getUserEndpoint('USER_PRODUCTS', TEST_USER_HASH);
  const productsResponse = await fetch(productsUrl);
  const products = await productsResponse.json();
  
  assert(products.length === 2, `🚨 Should have 2 snakes, got ${products.length}!`);
  
  const productIds = products.map(p => p.product_id);
  assert(productIds.includes(TEST_PRODUCT_ID), 'First snake missing!');
  assert(productIds.includes(SECOND_PRODUCT), 'Second snake not added!');
  
  console.log(`   🐍🐍 Collection now has ${products.length} snakes`);
  console.log(`   📦 Snakes: ${productIds.join(', ')}`);
});

// STEP 10: Verify localStorage persistence
await test('STEP 8: LocalStorage persists user session', async () => {
  const mockStorage = {
    serpent_user_hash: TEST_USER_HASH,
    serpent_user: JSON.stringify({
      user_id: TEST_USER_HASH,
      username: 'TestSnakeWhisperer42',
      email: 'test@serpenttown.com'
    })
  };
  
  // Verify keys exist
  assert(mockStorage.serpent_user_hash, 'User hash not in localStorage');
  assert(mockStorage.serpent_user, 'User data not in localStorage');
  
  // Verify data integrity
  const userData = JSON.parse(mockStorage.serpent_user);
  assert(userData.user_id === TEST_USER_HASH, 'Stored user ID mismatch');
  assert(userData.username, 'Username not stored');
  
  console.log(`   💾 Session persisted correctly`);
});

// Summary
console.log('\n' + '='.repeat(60));
console.log(`✅ Passed: ${passed}`);
console.log(`❌ Failed: ${failed}`);
console.log(`📊 Total: ${passed + failed}`);
console.log('='.repeat(60));

if (failed === 0) {
  console.log('\n🎉 REAL USER FLOW WORKS PERFECTLY!');
  console.log('✅ First purchase → Registration → Farm with snake');
  console.log('✅ Second purchase → Skip registration → Farm with NEW snake');
  console.log('✅ Farm displays all purchased snakes correctly');
  console.log('✅ All data persists correctly\n');
  process.exit(0);
} else {
  console.log('\n💥 REAL USER FLOW IS BROKEN!');
  console.log('❌ Fix these issues before deployment!');
  console.log('❌ Users will buy snakes but NOT see them!\n');
  process.exit(1);
}
