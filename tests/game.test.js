// Simple Game Tests - v3.2
// Run with: node tests/game.test.js

import { Economy, createInitialGameState } from '../src/business/economy.js';
import { EquipmentShop } from '../src/business/equipment.js';
import { SPECIES_PROFILES } from '../src/data/species-profiles.js';
import { MORPH_TRAITS } from '../src/data/morphs.js';
import { EQUIPMENT_CATALOG } from '../src/data/equipment-catalog.js';

// Test counter
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

console.log('🧪 Running Game Tests...\n');

// === Data Tests ===
console.log('📊 Data Tests');

test('Species profiles exist', () => {
  assert(SPECIES_PROFILES.ball_python, 'Ball Python profile missing');
  assert(SPECIES_PROFILES.corn_snake, 'Corn Snake profile missing');
});

test('Species have required fields', () => {
  const bp = SPECIES_PROFILES.ball_python;
  assert(bp.care, 'Care data missing');
  assert(bp.feeding, 'Feeding data missing');
  assert(bp.shedding, 'Shedding data missing');
  assert(bp.life_stages, 'Life stages missing');
});

test('Morphs database exists', () => {
  assert(MORPH_TRAITS.banana, 'Banana morph missing');
  assert(MORPH_TRAITS.piebald, 'Piebald morph missing');
  assert(MORPH_TRAITS.amelanistic, 'Amelanistic morph missing');
});

test('Equipment catalog has items', () => {
  assert(EQUIPMENT_CATALOG.length >= 15, `Only ${EQUIPMENT_CATALOG.length} items`);
});

test('Equipment has categories', () => {
  const categories = [...new Set(EQUIPMENT_CATALOG.map(e => e.category))];
  assert(categories.length >= 7, `Only ${categories.length} categories`);
});

// === Economy Tests ===
console.log('\n💰 Economy Tests');

test('Create initial game state', () => {
  const state = createInitialGameState();
  assert(state.currency.gold === 1000, 'Starting gold should be 1000');
  assert(state.loyalty_tier === 'bronze', 'Should start as bronze');
  assert(Array.isArray(state.snakes), 'Snakes should be array');
});

test('Money to currency conversion', () => {
  const gold = Economy.moneyToCurrency(100);
  assert(gold === 100, 'Should convert cents 1:1');
});

test('Buy virtual snake', () => {
  const state = createInitialGameState();
  const snake = Economy.buyVirtualSnake('corn_snake', [], state);
  
  assert(snake.species === 'corn_snake', 'Wrong species');
  assert(snake.type === 'virtual', 'Should be virtual');
  assert(state.currency.gold === 500, 'Should deduct 500 gold');
  assert(state.snakes.length === 1, 'Should have 1 snake');
});

test('Virtual snake prices', () => {
  const cornPrice = Economy.getVirtualSnakePrice('corn_snake', []);
  const bpPrice = Economy.getVirtualSnakePrice('ball_python', []);
  
  assert(cornPrice === 500, 'Corn snake should be 500');
  assert(bpPrice === 1000, 'Ball python should be 1000');
});

test('Loyalty tier system', () => {
  const state = createInitialGameState();
  
  state.loyalty_points = 0;
  Economy.updateLoyaltyTier(state);
  assert(state.loyalty_tier === 'bronze', 'Should be bronze');
  
  state.loyalty_points = 100;
  Economy.updateLoyaltyTier(state);
  assert(state.loyalty_tier === 'silver', 'Should be silver');
  
  state.loyalty_points = 500;
  Economy.updateLoyaltyTier(state);
  assert(state.loyalty_tier === 'gold', 'Should be gold');
  
  state.loyalty_points = 1500;
  Economy.updateLoyaltyTier(state);
  assert(state.loyalty_tier === 'platinum', 'Should be platinum');
});

test('Loyalty discounts', () => {
  const bronze = Economy.getTierDiscount('bronze');
  const silver = Economy.getTierDiscount('silver');
  const gold = Economy.getTierDiscount('gold');
  const platinum = Economy.getTierDiscount('platinum');
  
  assert(bronze === 0, 'Bronze should be 0%');
  assert(silver === 0.05, 'Silver should be 5%');
  assert(gold === 0.10, 'Gold should be 10%');
  assert(platinum === 0.15, 'Platinum should be 15%');
});

// === Shop Tests ===
console.log('\n🛒 Shop Tests');

test('Get available equipment', () => {
  const state = createInitialGameState();
  const items = EquipmentShop.getAvailableItems(state);
  
  assert(items.length > 0, 'Should have available items');
  assert(items[0].price_gold !== undefined, 'Items should have prices');
});

test('Buy equipment with gold', () => {
  const state = createInitialGameState();
  const snake = Economy.buyVirtualSnake('corn_snake', [], state);
  
  const result = EquipmentShop.buyEquipment('heat_mat_basic', snake.id, state);
  
  assert(result.success === true, 'Purchase should succeed');
  assert(state.currency.gold === 0, 'Should have 0 gold left (500-500)');
  assert(snake.equipment.heater !== null, 'Heater should be installed');
});

test('Cannot buy without gold', () => {
  const state = createInitialGameState();
  const snake = Economy.buyVirtualSnake('corn_snake', [], state);
  state.currency.gold = 10; // Set low after buying snake
  
  try {
    EquipmentShop.buyEquipment('heat_mat_thermostat', snake.id, state);
    throw new Error('Should have thrown insufficient gold error');
  } catch (error) {
    assert(error.message.includes('Insufficient'), 'Should say insufficient gold');
  }
});

test('Loyalty tier requirements', () => {
  const state = createInitialGameState();
  const snake = Economy.buyVirtualSnake('corn_snake', [], state);
  state.currency.gold = 10000;
  
  try {
    EquipmentShop.buyEquipment('ceramic_heater', snake.id, state);
    throw new Error('Should require silver tier');
  } catch (error) {
    assert(error.message.includes('tier'), 'Should mention tier requirement');
  }
});

// === Results ===
console.log(`\n${'='.repeat(50)}`);
console.log(`✅ Passed: ${passed}`);
console.log(`❌ Failed: ${failed}`);
console.log(`📊 Total: ${passed + failed}`);
console.log(`${passed === (passed + failed) ? '🎉 All tests passed!' : '⚠️ Some tests failed'}`);
console.log('='.repeat(50));

process.exit(failed > 0 ? 1 : 0);
