#!/usr/bin/env node

/**
 * SMRI List Functions
 * Shows all module functions and exports
 * 
 * Usage: node scripts/smri-list-functions.cjs
 */

const COLORS = {
  reset: '\x1b[0m',
  cyan: '\x1b[36m',
  green: '\x1b[32m',
};

async function main() {
  console.log(COLORS.cyan + '═══════════════════════════════════════════' + COLORS.reset);
  console.log(COLORS.cyan + '  📚 Module Functions List' + COLORS.reset);
  console.log(COLORS.cyan + '═══════════════════════════════════════════' + COLORS.reset);

  // Dynamic import for ES modules
  const moduleFuncsModule = await import('../src/config/smri/module-functions.js');
  const { MODULE_FUNCTIONS } = moduleFuncsModule;

  const modules = Object.keys(MODULE_FUNCTIONS);
  
  let totalFunctions = 0;
  let totalExports = 0;
  
  console.log('\nModules:', modules.length, '\n');
  
  modules.forEach(mod => {
    const data = MODULE_FUNCTIONS[mod];
    const funcCount = data.functions?.length || 0;
    const exportCount = data.exports?.length || 0;
    totalFunctions += funcCount;
    totalExports += exportCount;
    
    console.log(COLORS.green + '• ' + mod + COLORS.reset + ' - ' + funcCount + ' functions, ' + exportCount + ' exports');
  });
  
  console.log('\n📊 Total: ' + totalFunctions + ' functions, ' + totalExports + ' exports');
  console.log('\n💡 Full API docs: src/PUBLIC-API.md');
  console.log(COLORS.cyan + '\nScript: scripts/smri-list-functions.cjs' + COLORS.reset);
}

main().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
