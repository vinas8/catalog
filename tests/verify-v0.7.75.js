#!/usr/bin/env node
/**
 * Comprehensive Verification Test for v0.7.75
 * Tests local system before deployment
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const root = join(__dirname, '..');

const VERSION = '0.7.75';
let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    const result = fn();
    if (result) {
      console.log(`✅ ${name}`);
      passed++;
    } else {
      console.log(`❌ ${name}`);
      failed++;
    }
  } catch (err) {
    console.log(`❌ ${name} - ${err.message}`);
    failed++;
  }
}

console.log('🐍 Snake Muffin v0.7.75 - System Verification\n');

// Test 1: Package.json version
test('package.json version is 0.7.75', () => {
  const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
  return pkg.version === VERSION;
});

// Test 2: Demo.js version
test('Demo.js version is 0.7.75', () => {
  const demo = readFileSync(join(root, 'src/modules/demo/Demo.js'), 'utf8');
  return demo.includes(`version = '${VERSION}'`) && demo.includes(`@version ${VERSION}`);
});

// Test 3: demo-purchase-flow.html version
test('demo-purchase-flow.html version is 0.7.75', () => {
  const html = readFileSync(join(root, 'demo-purchase-flow.html'), 'utf8');
  return html.includes(`v${VERSION}`) && html.includes(`CACHE_VERSION = '${VERSION}'`);
});

// Test 4: INDEX.md version
test('INDEX.md version is 0.7.75', () => {
  const index = readFileSync(join(root, '.smri/INDEX.md'), 'utf8');
  return index.includes(`**Version:** ${VERSION}`);
});

// Test 5: No localhost:8005 in production files
test('No localhost:8005 in demo files', () => {
  const demo = readFileSync(join(root, 'demo/index.html'), 'utf8');
  const purchaseDemo = readFileSync(join(root, 'demo-purchase-flow.html'), 'utf8');
  return !demo.includes('localhost:8005') && !purchaseDemo.includes('localhost:8005');
});

// Test 6: Flow module import exists
test('Purchase flow module import in demo-purchase-flow.html', () => {
  const html = readFileSync(join(root, 'demo-purchase-flow.html'), 'utf8');
  return html.includes('@serpent-town/flow-purchase') && html.includes('PurchaseFlow');
});

// Test 7: Cloudflare Worker URL configured
test('Cloudflare Worker URL configured', () => {
  const html = readFileSync(join(root, 'demo-purchase-flow.html'), 'utf8');
  return html.includes('catalog.navickaszilvinas.workers.dev');
});

// Test 8: Test scenario functions exist
test('Test scenario functions exist', () => {
  const html = readFileSync(join(root, 'demo-purchase-flow.html'), 'utf8');
  return html.includes('testDisabledFlow') && html.includes('testEnabledFlow');
});

// Test 9: Feature flags module exists
test('Feature flags module exists', () => {
  const flags = readFileSync(join(root, 'src/modules/config/feature-flags.js'), 'utf8');
  return flags.includes('USE_EXTERNAL_PURCHASE_FLOW');
});

// Test 10: Flow module files exist
test('@serpent-town/flow-purchase module exists', () => {
  const flowIndex = readFileSync(join(root, 'node_modules/@serpent-town/flow-purchase/src/index.js'), 'utf8');
  return flowIndex.includes('PurchaseFlow') && flowIndex.includes('ShopModule');
});

// Test 11: README.md version
test('README.md version is 0.7.75', () => {
  const readme = readFileSync(join(root, 'README.md'), 'utf8');
  return readme.includes(`v${VERSION}`);
});

// Test 12: Demo flowUrl removed
test('Demo.js has no flowUrl property', () => {
  const demo = readFileSync(join(root, 'src/modules/demo/Demo.js'), 'utf8');
  return !demo.includes('this.flowUrl');
});

console.log('\n' + '='.repeat(50));
console.log(`📊 RESULTS: ${passed} passed, ${failed} failed`);
console.log('='.repeat(50));

if (failed === 0) {
  console.log('\n✅ All tests passed! Ready for deployment.\n');
  process.exit(0);
} else {
  console.log('\n❌ Some tests failed. Review above.\n');
  process.exit(1);
}
