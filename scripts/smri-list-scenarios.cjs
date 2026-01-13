#!/usr/bin/env node

/**
 * SMRI List Scenarios
 * Shows all scenarios with status, module coverage, and untested modules
 * 
 * Usage: node scripts/smri-list-scenarios.cjs
 */

const COLORS = {
  reset: '\x1b[0m',
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
};

async function main() {
  console.log(COLORS.cyan + '═══════════════════════════════════════════' + COLORS.reset);
  console.log(COLORS.cyan + '  📊 SMRI Scenarios List' + COLORS.reset);
  console.log(COLORS.cyan + '═══════════════════════════════════════════' + COLORS.reset);

  // Dynamic import for ES modules
  const scenariosModule = await import('../src/config/smri/scenarios.js');
  const { getScenarioStats, getModuleCoverage, getUntestedModules } = scenariosModule;

  const stats = getScenarioStats();
  
  console.log('\nTotal:', stats.total, '| ✅', stats.passed, '('+stats.passRate+'%)', '| ⏳', stats.pending, '| ❌', stats.failed);
  
  // Module coverage
  console.log('\n📈 Module Coverage:\n');
  const coverage = getModuleCoverage();
  
  Object.entries(coverage).forEach(([mod, data]) => {
    const bar = '█'.repeat(Math.max(1, data.scenarios));
    const status = data.scenarios === 0 ? COLORS.red + '⚠️ ' : COLORS.green + '✅';
    console.log(
      status + COLORS.reset,
      'S' + data.moduleNum,
      mod.padEnd(10),
      bar,
      data.scenarios, 'scenarios (' + data.passed + ' ✅)'
    );
  });
  
  // Untested modules
  const untested = getUntestedModules();
  if (untested.length > 0) {
    console.log('\n' + COLORS.red + '🔴 Untested Modules:' + COLORS.reset, untested.join(', '));
    console.log(COLORS.yellow + '💡 Create scenarios for these modules to improve coverage' + COLORS.reset);
  } else {
    console.log('\n' + COLORS.green + '✅ All modules have test coverage!' + COLORS.reset);
  }
  
  console.log('\n' + COLORS.cyan + 'Script: scripts/smri-list-scenarios.cjs' + COLORS.reset);
}

main().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
