// Comprehensive Snapshot Tests for All App Parts
// Tests HTML, JS, CSS, and all modules

import { readFileSync } from 'fs';

console.log('📸 Serpent Town v3.2 - Comprehensive Snapshot Tests\n');

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

// Load all files
const html = readFileSync('game.html', 'utf-8');
const gameController = readFileSync('src/game-controller.js', 'utf-8');
const css = readFileSync('styles.css', 'utf-8');
const economyJs = readFileSync('src/business/economy.js', 'utf-8');
const equipmentJs = readFileSync('src/business/equipment.js', 'utf-8');
const stripeSyncJs = readFileSync('src/business/stripe-sync.js', 'utf-8');
const speciesJs = readFileSync('src/data/species-profiles.js', 'utf-8');
const morphsJs = readFileSync('src/data/morphs.js', 'utf-8');
const catalogJs = readFileSync('src/data/catalog.js', 'utf-8');
const equipmentCatalogJs = readFileSync('src/data/equipment-catalog.js', 'utf-8');
const shopViewJs = readFileSync('src/ui/shop-view.js', 'utf-8');
const stripeConfigJs = readFileSync('src/config/stripe-config.js', 'utf-8');

console.log('📄 HTML Structure Tests');

test('Has DOCTYPE', () => {
  assert(html.includes('<!DOCTYPE html>'), 'Missing DOCTYPE');
});

test('Has title with game name', () => {
  assert(html.includes('<title>Serpent Town'), 'Missing title');
});

test('Links to styles.css', () => {
  assert(html.includes('href="styles.css"'), 'Missing stylesheet link');
});

test('Links to game controller as module', () => {
  assert(html.includes('type="module"'), 'Missing ES6 module type');
  assert(html.includes('src="src/game-controller.js"'), 'Missing game-controller.js script');
});

test('Has viewport meta tag', () => {
  assert(html.includes('viewport'), 'Missing viewport meta tag');
});

console.log('\n🎨 Header Components');

test('Has game header', () => {
  assert(html.includes('game-header'), 'Missing game header');
});

test('Has game title', () => {
  assert(html.includes('Serpent Town'), 'Missing game title');
});

test('Has gold display element', () => {
  assert(html.includes('id="gold-amount"'), 'Missing gold display');
});

test('Has loyalty tier display', () => {
  assert(html.includes('id="loyalty-tier"'), 'Missing loyalty tier');
});

test('Has shop button', () => {
  assert(html.includes('id="shop-btn"'), 'Missing shop button');
  assert(html.includes('🛒'), 'Missing shop icon');
});

test('Has settings button', () => {
  assert(html.includes('id="settings-btn"'), 'Missing settings button');
  assert(html.includes('⚙️'), 'Missing settings icon');
});

console.log('\n🧭 Navigation System');

test('Has main navigation', () => {
  assert(html.includes('main-nav'), 'Missing main navigation');
});

test('Has farm view button', () => {
  assert(html.includes('data-view="farm"'), 'Missing farm view button');
});

test('Has catalog view button', () => {
  assert(html.includes('data-view="catalog"'), 'Missing catalog view button');
});

test('Has encyclopedia view button', () => {
  assert(html.includes('data-view="encyclopedia"'), 'Missing encyclopedia view button');
});

test('Has calculator view button', () => {
  assert(html.includes('data-view="calculator"'), 'Missing calculator view button');
});

console.log('\n🏡 Farm View Components');

test('Has farm view container', () => {
  assert(html.includes('id="farm-view"'), 'Missing farm view');
});

test('Has snake collection container', () => {
  assert(html.includes('id="snake-collection"'), 'Missing snake collection');
});

test('Has buy virtual snake button', () => {
  assert(html.includes('id="buy-virtual-snake-btn"'), 'Missing buy button');
});

test('Has empty collection state', () => {
  assert(html.includes('id="empty-collection"'), 'Missing empty state');
});

console.log('\n📖 Catalog View Components');

test('Has catalog view container', () => {
  assert(html.includes('id="catalog-view"'), 'Missing catalog view');
});

test('Has catalog items container', () => {
  assert(html.includes('id="catalog-items"'), 'Missing catalog items container');
});

test('Has species filter', () => {
  assert(html.includes('id="species-filter"'), 'Missing species filter');
});

console.log('\n⚙️ Settings Modal');

test('Has settings modal', () => {
  assert(html.includes('id="settings-modal"'), 'Missing settings modal');
});

test('Has speed slider', () => {
  assert(html.includes('id="speed-slider"'), 'Missing speed slider');
});

test('Has speed display', () => {
  assert(html.includes('id="speed-display"'), 'Missing speed display');
});

test('Has save button', () => {
  assert(html.includes('id="save-btn"'), 'Missing save button');
});

test('Has reset button', () => {
  assert(html.includes('id="reset-btn"'), 'Missing reset button');
});

console.log('\n💻 JavaScript Core');

test('Has SerpentTown class', () => {
  assert(gameController.includes('class SerpentTown'), 'Missing main class');
});

test('Imports Economy module', () => {
  assert(gameController.includes('import { Economy'), 'Missing Economy import');
  assert(gameController.includes('./business/economy.js'), 'Wrong Economy path');
});

test('Imports EquipmentShop module', () => {
  assert(gameController.includes('import { EquipmentShop'), 'Missing EquipmentShop import');
  assert(gameController.includes('./business/equipment.js'), 'Wrong EquipmentShop path');
});

test('Imports shop view', () => {
  assert(gameController.includes('import { openShop'), 'Missing openShop import');
  assert(gameController.includes('./ui/shop-view.js'), 'Wrong shop view path');
});

test('Imports species profiles', () => {
  assert(gameController.includes('import { SPECIES_PROFILES'), 'Missing species import');
  assert(gameController.includes('./data/species-profiles.js'), 'Wrong species path');
});

test('Imports morphs data', () => {
  assert(gameController.includes('import { getMorphsForSpecies'), 'Missing morphs import');
  assert(gameController.includes('./data/morphs.js'), 'Wrong morphs path');
});

test('Imports catalog', () => {
  assert(gameController.includes('import { getProductsBySpecies'), 'Missing catalog import');
  assert(gameController.includes('./data/catalog.js'), 'Wrong catalog path');
});

test('Has async init method', () => {
  assert(gameController.includes('async init()'), 'Missing async init');
});

test('Has game loop', () => {
  assert(gameController.includes('startGameLoop'), 'Missing game loop start');
  assert(gameController.includes('updateGame'), 'Missing game update');
});

test('Has save/load functions', () => {
  assert(gameController.includes('saveGame'), 'Missing save function');
  assert(gameController.includes('loadGame'), 'Missing load function');
});

test('Has render functions', () => {
  assert(gameController.includes('renderFarmView'), 'Missing farm render');
  assert(gameController.includes('renderSnakeCard'), 'Missing snake card render');
  assert(gameController.includes('renderCatalogView'), 'Missing catalog render');
});

console.log('\n💰 Economy Module');

test('Exports Economy class', () => {
  assert(economyJs.includes('export class Economy'), 'Missing Economy export');
});

test('Has moneyToCurrency function', () => {
  assert(economyJs.includes('moneyToCurrency'), 'Missing currency conversion');
});

test('Has buyVirtualSnake function', () => {
  assert(economyJs.includes('buyVirtualSnake'), 'Missing buy virtual snake');
});

test('Has loyalty tier system', () => {
  assert(economyJs.includes('updateLoyaltyTier'), 'Missing loyalty tier update');
  assert(economyJs.includes('getTierDiscount'), 'Missing tier discount');
});

test('Exports createInitialGameState', () => {
  assert(economyJs.includes('export function createInitialGameState'), 'Missing game state init');
});

console.log('\n🛒 Equipment Shop Module');

test('Exports EquipmentShop class', () => {
  assert(equipmentJs.includes('export class EquipmentShop'), 'Missing EquipmentShop export');
});

test('Has getAvailableItems method', () => {
  assert(equipmentJs.includes('getAvailableItems'), 'Missing get available items');
});

test('Has buyEquipment method', () => {
  assert(equipmentJs.includes('buyEquipment'), 'Missing buy equipment');
});

test('Has installEquipment method', () => {
  assert(equipmentJs.includes('installEquipment'), 'Missing install equipment');
});

console.log('\n🔄 Stripe Sync Module');

test('Exports StripeSync class', () => {
  assert(stripeSyncJs.includes('export class StripeSync'), 'Missing StripeSync export');
});

test('Has syncProducts method', () => {
  assert(stripeSyncJs.includes('syncProducts'), 'Missing sync products');
});

test('Has fetchStripeProducts method', () => {
  assert(stripeSyncJs.includes('fetchStripeProducts'), 'Missing fetch Stripe products');
});

test('Has mergeProducts method', () => {
  assert(stripeSyncJs.includes('mergeProducts'), 'Missing merge products');
});

test('Exports initializeCatalog function', () => {
  assert(stripeSyncJs.includes('export async function initializeCatalog'), 'Missing initialize catalog');
});

console.log('\n📦 Data Modules');

test('Species profiles exports', () => {
  assert(speciesJs.includes('export const SPECIES_PROFILES'), 'Missing species profiles export');
  assert(speciesJs.includes('ball_python'), 'Missing Ball Python profile');
  assert(speciesJs.includes('corn_snake'), 'Missing Corn Snake profile');
});

test('Morphs exports', () => {
  assert(morphsJs.includes('export const MORPH_TRAITS'), 'Missing morph traits export');
  assert(morphsJs.includes('banana'), 'Missing banana morph');
  assert(morphsJs.includes('piebald'), 'Missing piebald morph');
});

test('Catalog exports', () => {
  assert(catalogJs.includes('export async function loadCatalog'), 'Missing loadCatalog export');
  assert(catalogJs.includes('export async function getProductsBySpecies'), 'Missing get products function');
});

test('Equipment catalog has items', () => {
  assert(equipmentCatalogJs.includes('export const EQUIPMENT_CATALOG'), 'Missing equipment catalog');
  assert(equipmentCatalogJs.includes('heat_mat'), 'Missing heat mat');
  assert(equipmentCatalogJs.includes('auto_feeder'), 'Missing auto feeder');
});

test('Stripe config exports', () => {
  assert(stripeConfigJs.includes('export const STRIPE_CONFIG'), 'Missing Stripe config');
  assert(stripeConfigJs.includes('publishableKey'), 'Missing publishable key');
  assert(stripeConfigJs.includes('secretKey'), 'Missing secret key');
});

console.log('\n🎨 CSS Styles');

test('Has CSS variables', () => {
  assert(css.includes(':root'), 'Missing CSS variables');
});

test('Has snake card styles', () => {
  assert(css.includes('.snake-card'), 'Missing snake card styles');
});

test('Has real/virtual snake styling', () => {
  assert(css.includes('.snake-card.real'), 'Missing real snake styles');
  assert(css.includes('.snake-card.virtual'), 'Missing virtual snake styles');
});

test('Has modal styles', () => {
  assert(css.includes('.modal'), 'Missing modal styles');
  assert(css.includes('.modal-content'), 'Missing modal content styles');
});

test('Has settings styles', () => {
  assert(css.includes('.settings-body'), 'Missing settings body styles');
});

test('Has shop styles', () => {
  assert(css.includes('.shop-item-card'), 'Missing shop item styles');
});

test('Has catalog grid', () => {
  assert(css.includes('.catalog-grid'), 'Missing catalog grid');
  assert(css.includes('.catalog-item'), 'Missing catalog item styles');
});

test('Has stat bar styles', () => {
  assert(css.includes('.stat-bar'), 'Missing stat bar styles');
  assert(css.includes('.stat-fill'), 'Missing stat fill styles');
});

test('Has responsive styles', () => {
  assert(css.includes('@media'), 'Missing responsive media queries');
});

test('Has notification styles', () => {
  assert(css.includes('.notification'), 'Missing notification styles');
});

console.log('\n🎮 Shop UI Module');

test('Exports ShopView class', () => {
  assert(shopViewJs.includes('export class ShopView'), 'Missing ShopView export');
});

test('Has render method', () => {
  assert(shopViewJs.includes('render()'), 'Missing render method');
});

test('Exports openShop function', () => {
  assert(shopViewJs.includes('export function openShop'), 'Missing openShop export');
});

console.log('\n' + '='.repeat(50));
console.log(`✅ Passed: ${passed}`);
console.log(`❌ Failed: ${failed}`);
console.log(`📊 Total: ${passed + failed}`);
console.log(`📈 Success Rate: ${Math.round(passed / (passed + failed) * 100)}%`);
console.log(passed === (passed + failed) ? '🎉 All tests passed!' : '⚠️ Some tests failed');
console.log('='.repeat(50));

process.exit(failed > 0 ? 1 : 0);

test('Has doctype', () => {
  assert(html.includes('<!DOCTYPE html>'), 'Missing doctype');
});

test('Has title', () => {
  assert(html.includes('<title>'), 'Missing title');
  assert(html.includes('Serpent Town'), 'Wrong title');
});

test('Links to styles.css', () => {
  assert(html.includes('styles.css'), 'Missing stylesheet link');
});

test('Links to game.js', () => {
  assert(html.includes('game.js'), 'Missing script link');
});

console.log('\n🎨 Header Elements');

test('Has header section', () => {
  assert(html.includes('game-header'), 'Missing header');
});

test('Has game title', () => {
  assert(html.includes('Serpent Town'), 'Missing game title');
});

test('Has gold display', () => {
  assert(html.includes('gold-amount'), 'Missing gold display');
  assert(html.includes('1000'), 'Wrong starting gold');
});

test('Has loyalty tier display', () => {
  assert(html.includes('loyalty-tier'), 'Missing loyalty tier');
});

test('Has shop button', () => {
  assert(html.includes('shop-btn'), 'Missing shop button');
  assert(html.includes('🛒'), 'Missing shop icon');
});

test('Has settings button', () => {
  assert(html.includes('settings-btn'), 'Missing settings button');
  assert(html.includes('⚙️'), 'Missing settings icon');
});

console.log('\n🧭 Navigation');

test('Has main navigation', () => {
  assert(html.includes('main-nav'), 'Missing navigation');
});

test('Has farm view button', () => {
  assert(html.includes('data-view="farm"'), 'Missing farm button');
});

test('Has catalog view button', () => {
  assert(html.includes('data-view="catalog"'), 'Missing catalog button');
});

test('Has encyclopedia view button', () => {
  assert(html.includes('data-view="encyclopedia"'), 'Missing encyclopedia button');
});

test('Has calculator view button', () => {
  assert(html.includes('data-view="calculator"'), 'Missing calculator button');
});

console.log('\n🏡 Farm View');

test('Has farm view', () => {
  assert(html.includes('farm-view'), 'Missing farm view');
});

test('Has snake collection container', () => {
  assert(html.includes('snake-collection'), 'Missing snake collection');
});

test('Has buy virtual snake button', () => {
  assert(html.includes('buy-virtual-snake-btn'), 'Missing buy button');
});

test('Has empty state', () => {
  assert(html.includes('empty-collection'), 'Missing empty state');
});

console.log('\n⚙️ Settings Modal');

test('Has settings modal', () => {
  assert(html.includes('settings-modal'), 'Missing settings modal');
});

test('Has speed slider', () => {
  assert(html.includes('speed-slider'), 'Missing speed slider');
});

test('Has save button', () => {
  assert(html.includes('save-btn'), 'Missing save button');
});

test('Has reset button', () => {
  assert(html.includes('reset-btn'), 'Missing reset button');
});

console.log('\n📱 Views');

test('Has catalog view', () => {
  assert(html.includes('catalog-view'), 'Missing catalog view');
});

test('Has encyclopedia view', () => {
  assert(html.includes('encyclopedia-view'), 'Missing encyclopedia view');
});

test('Has calculator view', () => {
  assert(html.includes('calculator-view'), 'Missing calculator view');
});

console.log('\n💻 JavaScript');

test('Has SerpentTown class', () => {
  assert(gameController.includes('class SerpentTown'), 'Missing main class');
});

test('Imports Economy', () => {
  assert(gameController.includes('Economy'), 'Missing Economy import');
});

test('Imports EquipmentShop', () => {
  assert(gameController.includes('EquipmentShop'), 'Missing EquipmentShop import');
});

test('Imports openShop', () => {
  assert(gameController.includes('openShop'), 'Missing openShop import');
});

test('Has game loop', () => {
  assert(gameController.includes('startGameLoop'), 'Missing game loop');
  assert(gameController.includes('updateGame'), 'Missing update function');
});

test('Has save/load', () => {
  assert(gameController.includes('saveGame'), 'Missing save function');
  assert(gameController.includes('loadGame'), 'Missing load function');
});

test('Has render functions', () => {
  assert(gameController.includes('renderFarmView'), 'Missing farm render');
  assert(gameController.includes('renderSnakeCard'), 'Missing snake card render');
});

console.log('\n🎨 CSS');

test('Has color variables', () => {
  assert(css.includes(':root'), 'Missing CSS variables');
});

test('Has snake card styles', () => {
  assert(css.includes('.snake-card'), 'Missing snake card styles');
});

test('Has real/virtual styling', () => {
  assert(css.includes('.snake-card.real'), 'Missing real snake styles');
  assert(css.includes('.snake-card.virtual'), 'Missing virtual snake styles');
});

test('Has modal styles', () => {
  assert(css.includes('.modal'), 'Missing modal styles');
});

test('Has settings styles', () => {
  assert(css.includes('.settings-body'), 'Missing settings styles');
});

test('Has responsive styles', () => {
  assert(css.includes('@media'), 'Missing responsive styles');
});

test('Has stat bar styles', () => {
  assert(css.includes('.stat-bar'), 'Missing stat styles');
  assert(css.includes('.stat-fill'), 'Missing stat fill styles');
});

console.log('\n' + '='.repeat(50));
console.log(`✅ Passed: ${passed}`);
console.log(`❌ Failed: ${failed}`);
console.log(`📊 Total: ${passed + failed}`);
console.log(passed === (passed + failed) ? '🎉 All checks passed!' : '⚠️ Some checks failed');
console.log('='.repeat(50));

process.exit(failed > 0 ? 1 : 0);
