#!/usr/bin/env node
// FRONTEND → BACKEND TEST
// Tests from USER'S VIEW: Check HTML pages first, then dig into backend if broken

import { readFileSync } from 'fs';
import { WORKER_CONFIG, PAGE_URLS } from '../../src/config/worker-config.js';

let passed = 0;
let failed = 0;

function test(name, fn) {
  return fn()
    .then(() => {
      console.log(`✅ ${name}`);
      passed++;
    })
    .catch((error) => {
      console.log(`❌ ${name}`);
      console.log(`   💥 ${error.message}`);
      failed++;
    });
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

console.log('👁️  FRONTEND → BACKEND TEST\n');
console.log('Testing from what USER SEES to backend...\n');

// ============================================
// LAYER 1: USER VIEW - Check HTML Files
// ============================================
console.log('📄 LAYER 1: Checking HTML Pages (what user sees)...\n');

await test('✓ catalog.html exists and loads', async () => {
  const html = readFileSync('./catalog.html', 'utf8');
  assert(html.includes('Buy Now'), 'No "Buy Now" button in catalog');
  assert(html.includes('worker-config.js') || html.includes('PAGE_URLS'), 
    'Not importing worker config');
  console.log('   📋 Catalog page has Buy buttons');
});

await test('✓ success.html checks for existing user', async () => {
  const html = readFileSync('./success.html', 'utf8');
  assert(html.includes('serpent_user'), 'Not checking for existing user');
  assert(html.includes('isFirstPurchase'), 'Missing returning user logic');
  assert(html.includes('redirectToGame'), 'Missing game redirect function');
  console.log('   📋 Success page has returning user detection');
});

await test('✓ success.html waits for webhook', async () => {
  const html = readFileSync('./success.html', 'utf8');
  assert(html.includes('checkInterval'), 'Not checking webhook status');
  assert(html.includes('USER_PRODUCTS') || html.includes('user-products'), 
    'Not checking if snake assigned');
  assert(html.includes('maxAttempts'), 'No timeout for webhook check');
  console.log('   📋 Success page waits for snake assignment');
});

await test('✓ register.html has username generator', async () => {
  const html = readFileSync('./register.html', 'utf8');
  assert(html.includes('adjectives'), 'Missing username generator');
  assert(html.includes('generateFunnyUsername'), 'No funny username function');
  assert(html.includes('refresh-username'), 'No refresh button');
  console.log('   📋 Registration has username generator');
});

await test('✓ game.html loads from worker (not local file)', async () => {
  const html = readFileSync('./game.html', 'utf8');
  const controllerJs = readFileSync('./src/modules/game/game-controller.js', 'utf8');
  
  assert(!controllerJs.includes('/data/user-products.json'), 
    '🚨 STILL LOADING FROM LOCAL FILE! Should use worker API');
  assert(controllerJs.includes('WORKER_CONFIG'), 'Not using worker config');
  assert(controllerJs.includes('getUserEndpoint'), 'Not using helper methods');
  
  console.log('   📋 Game loads snakes from worker API');
});

await test('✓ game.html displays user profile', async () => {
  const html = readFileSync('./game.html', 'utf8');
  assert(html.includes('user-profile-display'), 'No profile display element');
  assert(html.includes('username-display'), 'No username display element');
  assert(html.includes('user-welcome'), 'No welcome message element');
  console.log('   📋 Game has profile display elements');
});

// ============================================
// LAYER 2: JAVASCRIPT - Check Logic
// ============================================
console.log('\n📜 LAYER 2: Checking JavaScript Logic...\n');

await test('✓ game-controller.js loads user profile', async () => {
  const js = readFileSync('./src/modules/game/game-controller.js', 'utf8');
  assert(js.includes('loadUserProfile'), 'Missing loadUserProfile function');
  assert(js.includes('USER_DATA'), 'Not fetching user data');
  assert(js.includes('displayUserProfile'), 'Not displaying profile');
  console.log('   📜 Profile loading implemented');
});

await test('✓ game-controller.js loads snakes from worker', async () => {
  const js = readFileSync('./src/modules/game/game-controller.js', 'utf8');
  assert(js.includes('loadUserSnakes'), 'Missing loadUserSnakes function');
  assert(js.includes('USER_PRODUCTS'), 'Not fetching from USER_PRODUCTS endpoint');
  assert(js.includes('WORKER_CONFIG'), 'Not using worker config');
  
  // Make sure it's NOT using local file
  assert(!js.includes("fetch('/data/user-products.json')"), 
    '🚨 STILL USING LOCAL FILE!');
  
  console.log('   📜 Snakes loaded from worker API');
});

await test('✓ Hash is consistent throughout flow', async () => {
  const catalogHtml = readFileSync('./catalog.html', 'utf8');
  const successHtml = readFileSync('./success.html', 'utf8');
  const registerHtml = readFileSync('./register.html', 'utf8');
  
  // Check hash keys are consistent
  assert(catalogHtml.includes('serpent_last_purchase_hash'), 'Catalog missing hash save');
  assert(successHtml.includes('serpent_last_purchase_hash'), 'Success missing hash read');
  assert(registerHtml.includes('serpent_last_purchase_hash'), 'Register missing hash read');
  
  console.log('   📜 Hash consistency verified across pages');
});

// ============================================
// LAYER 3: CONFIG - Check Configuration
// ============================================
console.log('\n⚙️  LAYER 3: Checking Configuration...\n');

await test('✓ Worker config is valid', async () => {
  assert(WORKER_CONFIG.WORKER_URL, 'Worker URL missing');
  assert(WORKER_CONFIG.ENDPOINTS.USER_PRODUCTS, 'USER_PRODUCTS endpoint missing');
  assert(WORKER_CONFIG.ENDPOINTS.USER_DATA, 'USER_DATA endpoint missing');
  console.log(`   ⚙️  Worker: ${WORKER_CONFIG.WORKER_URL}`);
});

await test('✓ Page URLs are configured', async () => {
  assert(PAGE_URLS.GAME, 'Game URL missing');
  assert(PAGE_URLS.REGISTER, 'Register URL missing');
  assert(PAGE_URLS.getGameUrl, 'getGameUrl helper missing');
  console.log(`   ⚙️  Farm URL: ${PAGE_URLS.GAME}`);
});

// ============================================
// LAYER 4: BACKEND - Check Worker API
// ============================================
console.log('\n🔌 LAYER 4: Checking Worker API...\n');

const TEST_HASH = `fronttest_${Date.now()}`;

await test('✓ Worker is reachable', async () => {
  const response = await fetch(WORKER_CONFIG.WORKER_URL);
  assert(response, 'Worker not responding');
  console.log(`   🔌 Worker status: ${response.status}`);
});

await test('✓ Can assign snake to user', async () => {
  const url = WORKER_CONFIG.getEndpoint('ASSIGN_PRODUCT');
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      user_id: TEST_HASH,
      product_id: 'test_snake'
    })
  });
  
  assert(response.ok, `Assignment failed: ${response.status}`);
  console.log('   🔌 Snake assignment works');
});

await test('✓ Can retrieve assigned snake', async () => {
  const url = WORKER_CONFIG.getUserEndpoint('USER_PRODUCTS', TEST_HASH);
  const response = await fetch(url);
  assert(response.ok, `Fetch failed: ${response.status}`);
  
  const products = await response.json();
  assert(Array.isArray(products), 'Products not an array');
  assert(products.length > 0, '🚨 Snake was assigned but NOT retrievable!');
  
  console.log(`   🔌 Retrieved ${products.length} snake(s)`);
});

await test('✓ Can register user', async () => {
  const url = WORKER_CONFIG.getEndpoint('REGISTER_USER');
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      user_id: TEST_HASH,
      username: 'FrontendTest',
      email: 'test@test.com',
      created_at: new Date().toISOString(),
      loyalty_points: 0,
      loyalty_tier: 'bronze'
    })
  });
  
  assert(response.ok, `Registration failed: ${response.status}`);
  console.log('   🔌 User registration works');
});

await test('✓ Can retrieve user profile', async () => {
  const url = WORKER_CONFIG.getUserEndpoint('USER_DATA', TEST_HASH);
  const response = await fetch(url);
  assert(response.ok, `Profile fetch failed: ${response.status}`);
  
  const user = await response.json();
  assert(user.user_id === TEST_HASH, 'User ID mismatch');
  assert(user.username === 'FrontendTest', 'Username mismatch');
  
  console.log('   🔌 Profile retrieval works');
});

// ============================================
// SUMMARY
// ============================================
console.log('\n' + '='.repeat(60));
console.log(`✅ Passed: ${passed}`);
console.log(`❌ Failed: ${failed}`);
console.log(`📊 Total: ${passed + failed}`);
console.log('='.repeat(60));

if (failed === 0) {
  console.log('\n✨ ALL LAYERS WORK!\n');
  console.log('Layer 1: HTML pages are correct ✓');
  console.log('Layer 2: JavaScript logic works ✓');
  console.log('Layer 3: Configuration valid ✓');
  console.log('Layer 4: Worker API functional ✓');
  console.log('\nIf user still sees no snakes:');
  console.log('→ Check localStorage has user hash');
  console.log('→ Check URL has ?user=HASH parameter');
  console.log('→ Open debug.html to diagnose\n');
  process.exit(0);
} else {
  console.log('\n💥 ISSUE FOUND!\n');
  console.log('The failed test shows where the problem is.');
  console.log('Fix from FRONTEND (HTML) to BACKEND (API)\n');
  process.exit(1);
}
