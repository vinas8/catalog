/**
 * Snake Rendering Test
 * Tests that game.html properly renders snakes for users with products
 */

import { readFileSync } from 'fs';

console.log('🧪 Snake Rendering Test\n');

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`✅ ${name}`);
    passed++;
  } catch (error) {
    console.log(`❌ ${name}: ${error.message}`);
    failed++;
  }
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

// Load files
const gameHtml = readFileSync('game.html', 'utf-8');
const gameController = readFileSync('src/modules/game/game-controller.js', 'utf-8');

console.log('📄 HTML Structure Tests');

test('Has snake-collection container', () => {
  assert(gameHtml.includes('id="snake-collection"'), 'Missing snake-collection element');
});

test('Has empty-collection state', () => {
  assert(gameHtml.includes('id="empty-collection"'), 'Missing empty-collection element');
});

test('Has farm-view container', () => {
  assert(gameHtml.includes('id="farm-view"'), 'Missing farm-view element');
});

console.log('\n🎮 Game Controller Tests');

test('Has renderFarmView function', () => {
  assert(gameController.includes('renderFarmView()'), 'Missing renderFarmView function');
});

test('Has null check for snake-collection', () => {
  assert(
    gameController.includes("getElementById('snake-collection')") &&
    gameController.includes('if (!container'),
    'Missing null check for snake-collection'
  );
});

test('Has null check for empty-collection', () => {
  assert(
    gameController.includes("getElementById('empty-collection')") &&
    gameController.includes('!emptyState'),
    'Missing null check for empty-collection'
  );
});

test('Handles empty snakes array', () => {
  assert(
    gameController.includes('snakes.length === 0') ||
    gameController.includes('snakes.length == 0'),
    'Missing empty snakes check'
  );
});

test('Renders snake cards', () => {
  assert(gameController.includes('renderSnakeCard'), 'Missing renderSnakeCard function');
});

test('Maps snakes to HTML', () => {
  assert(
    gameController.includes('.map(snake =>') ||
    gameController.includes('.map((snake)'),
    'Missing snake mapping'
  );
});

console.log('\n==================================================');
console.log(`✅ Passed: ${passed}`);
console.log(`❌ Failed: ${failed}`);
console.log(`📊 Total: ${passed + failed}`);
console.log('==================================================');

if (failed > 0) {
  console.log('⚠️ Some tests failed');
  process.exit(1);
} else {
  console.log('🎉 All tests passed!');
}
