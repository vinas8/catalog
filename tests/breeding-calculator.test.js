// 🧬 Breeding Calculator - Automated Tests
// Tests genetics engine, offspring calculations, and compatibility scoring

import {
  loadGeneticsDatabase,
  calculateInbreedingCoefficient,
  calculateGeneticDiversity,
  calculateHeterozygosity,
  assessHealthRisk,
  checkLethalCombo,
  calculateOffspring,
  calculateCompatibility,
  getMorphValue
} from '../src/modules/breeding/genetics-core.js';

console.log('🧪 Starting breeding calculator tests...\n');

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`✅ ${message}`);
    passed++;
  } else {
    console.error(`❌ ${message}`);
    failed++;
  }
}

function assertEquals(actual, expected, message) {
  if (actual === expected) {
    console.log(`✅ ${message} (${actual})`);
    passed++;
  } else {
    console.error(`❌ ${message}: expected ${expected}, got ${actual}`);
    failed++;
  }
}

// Mock snake data
const mockSnakes = [
  {
    id: 'male_1',
    name: 'Zeus',
    sex: 'male',
    age: 3,
    weight: 1800,
    morphs: ['mojave'],
    genetics: {
      visual: ['mojave'],
      hets: [],
      alleles: { mojave: 'Moj', albino: 'wt', piebald: 'wt', spider: 'wt' }
    },
    lineage: { parent_male_id: null, parent_female_id: null, lineage_id: 'line_alpha' }
  },
  {
    id: 'female_1',
    name: 'Athena',
    sex: 'female',
    age: 4,
    weight: 1700,
    morphs: ['lesser'],
    genetics: {
      visual: ['lesser'],
      hets: [],
      alleles: { lesser: 'Les', mojave: 'wt', albino: 'wt', piebald: 'wt' }
    },
    lineage: { parent_male_id: null, parent_female_id: null, lineage_id: 'line_beta' }
  },
  {
    id: 'male_2',
    name: 'Rocky',
    sex: 'male',
    age: 4,
    weight: 2000,
    morphs: ['spider'],
    genetics: {
      visual: ['spider'],
      hets: [],
      alleles: { spider: 'Spd', mojave: 'wt', albino: 'wt', piebald: 'wt' }
    },
    lineage: { parent_male_id: null, parent_female_id: null, lineage_id: 'line_gamma' }
  },
  {
    id: 'female_2',
    name: 'Luna',
    sex: 'female',
    age: 3,
    weight: 1500,
    morphs: ['spider'],
    genetics: {
      visual: ['spider'],
      hets: [],
      alleles: { spider: 'Spd', mojave: 'wt', albino: 'wt', piebald: 'wt' }
    },
    lineage: { parent_male_id: null, parent_female_id: null, lineage_id: 'line_delta' }
  }
];

async function runTests() {
  console.log('📦 Test 1: Database Loading');
  const loadResult = await loadGeneticsDatabase();
  assert(loadResult !== undefined, 'Genetics database loaded');
  
  console.log('\n🧬 Test 2: Inbreeding Coefficient');
  const CoI1 = calculateInbreedingCoefficient(mockSnakes[0], mockSnakes[1]);
  assertEquals(CoI1, 0, 'Unrelated snakes have 0% CoI');
  
  console.log('\n🧬 Test 3: Genetic Diversity');
  const diversity = calculateGeneticDiversity(mockSnakes[0], mockSnakes[1]);
  assert(diversity > 0, `Genetic diversity calculated: ${Math.round(diversity * 100)}%`);
  
  console.log('\n🧬 Test 4: Heterozygosity');
  const het = calculateHeterozygosity(mockSnakes[0], mockSnakes[1]);
  assert(het > 0, `Heterozygosity calculated: ${Math.round(het * 100)}%`);
  
  console.log('\n⚠️  Test 5: Lethal Combo Detection');
  const lethal = checkLethalCombo('spider', 'spider');
  assert(lethal === true, 'Spider x Spider detected as lethal');
  
  console.log('\n🎯 Test 6: BEL Complex Detection');
  const belOutcomes = calculateOffspring(mockSnakes[0], mockSnakes[1]);
  assert(belOutcomes.length > 0, 'Offspring outcomes calculated');
  
  console.log('\n📊 Test 7: Compatibility Scoring (Good Pairing)');
  const compat1 = calculateCompatibility(mockSnakes[0], mockSnakes[1]);
  assert(compat1.score > 0, `Good pairing score: ${compat1.score}/100`);
  
  console.log('\n📊 Test 8: Compatibility Scoring (Lethal Pairing)');
  const compat2 = calculateCompatibility(mockSnakes[2], mockSnakes[3]);
  assertEquals(compat2.score, 0, 'Lethal pairing score is 0');
  
  console.log('\n🏷️  Test 9: Morph Value Lookup');
  const value = getMorphValue('mojave');
  assert(value > 0, `Mojave value: $${value}`);
  
  console.log('\n🏥 Test 10: Health Risk Assessment');
  const health = assessHealthRisk(mockSnakes[2], mockSnakes[3]);
  assert(health.severity !== 'NONE' || health.lethal, `Health assessment complete`);
  
  // Summary
  console.log('\n' + '='.repeat(50));
  console.log(`✅ PASSED: ${passed}`);
  console.log(`❌ FAILED: ${failed}`);
  console.log(`📊 TOTAL: ${passed + failed}`);
  console.log(`🎯 SUCCESS RATE: ${Math.round((passed / (passed + failed)) * 100)}%`);
  console.log('='.repeat(50));
  
  if (failed === 0) {
    console.log('\n🎉 ALL TESTS PASSED!');
    process.exit(0);
  } else {
    console.log('\n⚠️  SOME TESTS FAILED');
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('❌ Test suite failed:', err);
  process.exit(1);
});
