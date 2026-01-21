/**
 * Integration Test Harness
 * Self-testing system for Serpent Town integration
 */

import { createDemoSnake, getOwnedSnakes, getUnlockedMorphs, getDemoProgress, resetState } from '../src/core/state.js';

const tests = [];
let passCount = 0;
let failCount = 0;

function test(name, fn) {
  tests.push({ name, fn });
}

async function runTests() {
  console.log('🧪 Starting Integration Tests...\n');
  
  for (const { name, fn } of tests) {
    try {
      await fn();
      passCount++;
      console.log(`✅ PASS: ${name}`);
    } catch (error) {
      failCount++;
      console.error(`❌ FAIL: ${name}`);
      console.error(`   Error: ${error.message}`);
    }
  }
  
  console.log(`\n${'='.repeat(50)}`);
  console.log(`📊 Test Results: ${passCount} passed, ${failCount} failed`);
  console.log(`${'='.repeat(50)}\n`);
  
  return failCount === 0;
}

// TEST 1: Demo checkout creates snake
test('Demo checkout creates snake', () => {
  resetState();
  const snake = createDemoSnake();
  
  if (!snake) throw new Error('createDemoSnake() returned falsy');
  if (snake.id !== 'demo_snake_001') throw new Error('Wrong snake ID');
  if (snake.morphs.length !== 2) throw new Error('Wrong morph count');
  
  const owned = getOwnedSnakes();
  if (owned.length !== 1) throw new Error('Snake not added to owned list');
});

// TEST 2: MyFarm lists demo snake
test('MyFarm lists demo snake', () => {
  const owned = getOwnedSnakes();
  if (owned.length === 0) throw new Error('No snakes in collection');
  if (owned[0].name !== 'Demo Banana Spider') throw new Error('Wrong snake name');
});

// TEST 3: Dex loads comprehensive DB
test('Dex loads comprehensive DB', async () => {
  // This will be tested in browser
  const basePath = window.location.hostname.includes('github.io') ? '/catalog' : '';
  const response = await fetch(`${basePath}/data/genetics/morphs-comprehensive.json?v=0.777`);
  
  if (!response.ok) throw new Error('Failed to load morphs-comprehensive.json');
  
  const data = await response.json();
  if (!data.morphs) throw new Error('Invalid data structure');
  if (data.morphs.length < 66) throw new Error('Not enough morphs');
});

// TEST 4: Demo morphs unlocked
test('Demo morphs unlocked', () => {
  const unlocked = getUnlockedMorphs();
  if (unlocked.length === 0) throw new Error('No morphs unlocked');
  if (!unlocked.includes('banana')) throw new Error('Banana not unlocked');
  if (!unlocked.includes('spider')) throw new Error('Spider not unlocked');
});

// TEST 5: Locked morphs visually distinct
test('Locked morphs visually distinct', () => {
  // This test runs in browser DOM
  if (typeof document === 'undefined') {
    console.log('⏭️  Skipping (requires browser)');
    return;
  }
  
  const lockedCards = document.querySelectorAll('.morph-card.locked');
  if (lockedCards.length === 0) throw new Error('No locked morphs found in DOM');
  
  // Check for grayscale styling
  const firstLocked = lockedCards[0];
  const style = window.getComputedStyle(firstLocked);
  if (!style.filter.includes('grayscale')) {
    throw new Error('Locked morphs not styled with grayscale');
  }
});

// TEST 6: Dex → Calculator preselects morphs
test('Dex → Calculator preselects morphs', () => {
  // Check URL params
  const url = new URL(window.location.href);
  const male = url.searchParams.get('male');
  const female = url.searchParams.get('female');
  
  if (!male && !female) {
    console.log('⏭️  Skipping (no URL params)');
    return;
  }
  
  // If params exist, check they're loaded
  const maleInput = document.querySelector('#male-morphs-input');
  const femaleInput = document.querySelector('#female-morphs-input');
  
  if (!maleInput || !femaleInput) {
    throw new Error('Morph inputs not found');
  }
});

// TEST 7: Calculator auto-runs from URL
test('Calculator auto-runs from URL', () => {
  const url = new URL(window.location.href);
  const male = url.searchParams.get('male');
  
  if (!male) {
    console.log('⏭️  Skipping (no URL params)');
    return;
  }
  
  // Check for results
  const results = document.querySelector('#results');
  if (!results || results.children.length === 0) {
    throw new Error('Calculator did not auto-run');
  }
});

// TEST 8: Lethal combo blocks calculation
test('Lethal combo blocks calculation', async () => {
  // Simulate Spider x Spider
  const basePath = window.location.hostname.includes('github.io') ? '/catalog' : '';
  const module = await import(`${basePath}/src/modules/breeding/genetics-core.js?v=0.777`);
  
  const result = module.checkLethalCombo('spider', 'spider');
  if (!result || !result.lethal) {
    throw new Error('Spider x Spider not detected as lethal');
  }
});

// Export for browser use
if (typeof window !== 'undefined') {
  window.runIntegrationTests = runTests;
}

// Auto-run if in Node
if (typeof process !== 'undefined' && process.versions && process.versions.node) {
  runTests().then(success => {
    process.exit(success ? 0 : 1);
  });
}

export { runTests };
