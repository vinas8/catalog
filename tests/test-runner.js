#!/usr/bin/env node
// Test Runner - v3.2
// Usage: node tests/test-runner.js

import { spawn } from 'child_process';
import { readFileSync, existsSync } from 'fs';

console.log('🧪 Serpent Town v3.2 - Test Suite\n');

// Check if game files exist
console.log('📁 Checking files...');
const files = [
  'game.html',
  'game.js',
  'styles.css',
  'src/business/economy.js',
  'src/business/equipment.js',
  'src/data/species-profiles.js',
  'src/data/morphs.js',
  'src/data/equipment-catalog.js',
  'src/ui/shop-view.js'
];

let fileErrors = 0;
for (const file of files) {
  if (existsSync(file)) {
    console.log(`  ✅ ${file}`);
  } else {
    console.log(`  ❌ ${file} - MISSING`);
    fileErrors++;
  }
}

if (fileErrors > 0) {
  console.log(`\n❌ ${fileErrors} files missing. Aborting tests.`);
  process.exit(1);
}

// Check HTML structure
console.log('\n📄 Checking HTML...');
const html = readFileSync('game.html', 'utf-8');
const htmlChecks = [
  { name: 'Shop button', pattern: /shop-btn/ },
  { name: 'Settings button', pattern: /settings-btn/ },
  { name: 'Settings modal', pattern: /settings-modal/ },
  { name: 'Gold display', pattern: /gold-amount/ },
  { name: 'Snake collection', pattern: /snake-collection/ },
  { name: 'Speed slider', pattern: /speed-slider/ }
];

for (const check of htmlChecks) {
  if (check.pattern.test(html)) {
    console.log(`  ✅ ${check.name}`);
  } else {
    console.log(`  ❌ ${check.name} - MISSING`);
  }
}

// Check JavaScript imports
console.log('\n📦 Checking JavaScript...');
const js = readFileSync('game.js', 'utf-8');
const jsChecks = [
  { name: 'Economy import', pattern: /import.*Economy.*economy\.js/ },
  { name: 'EquipmentShop import', pattern: /import.*EquipmentShop.*equipment\.js/ },
  { name: 'Shop view import', pattern: /import.*shop-view\.js/ },
  { name: 'Species profiles import', pattern: /import.*species-profiles\.js/ },
  { name: 'SerpentTown class', pattern: /class SerpentTown/ },
  { name: 'Game loop', pattern: /startGameLoop/ },
  { name: 'Save game', pattern: /saveGame/ }
];

for (const check of jsChecks) {
  if (check.pattern.test(js)) {
    console.log(`  ✅ ${check.name}`);
  } else {
    console.log(`  ❌ ${check.name} - MISSING`);
  }
}

// Run unit tests
console.log('\n🔬 Running unit tests...');
const testProcess = spawn('node', ['tests/game.test.js']);

testProcess.stdout.on('data', (data) => {
  process.stdout.write(data);
});

testProcess.stderr.on('data', (data) => {
  process.stderr.write(data);
});

testProcess.on('close', (code) => {
  if (code === 0) {
    console.log('\n✅ All tests passed!');
  } else {
    console.log(`\n❌ Tests failed with code ${code}`);
  }
  process.exit(code);
});
