#!/usr/bin/env node

/**
 * Dead Facade Finder
 * Finds exported methods that are never imported/used anywhere
 * 
 * Usage: node scripts/find-dead-facades.cjs
 */

const fs = require('fs');
const path = require('path');

const COLORS = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
};

function log(color, prefix, message) {
  console.log(`${color}${prefix}${COLORS.reset} ${message}`);
}

// Get all exported functions from module facades
function getModuleExports() {
  const modules = fs.readdirSync('src/modules', { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name);

  const exports = {};

  modules.forEach(mod => {
    const indexPath = path.join('src/modules', mod, 'index.js');
    if (!fs.existsSync(indexPath)) return;

    const content = fs.readFileSync(indexPath, 'utf8');
    exports[mod] = [];

    // Find named exports: export { Thing }
    const namedExports = content.matchAll(/export\s+\{\s*([^}]+)\s*\}/g);
    for (const match of namedExports) {
      const names = match[1].split(',').map(n => n.trim().split(/\s+as\s+/)[0]);
      exports[mod].push(...names);
    }

    // Find direct exports: export const Thing
    const directExports = content.matchAll(/export\s+(?:const|class|function)\s+(\w+)/g);
    for (const match of directExports) {
      exports[mod].push(match[1]);
    }
  });

  return exports;
}

// Search for usage of an export across the codebase
function findUsages(exportName, moduleName) {
  const usages = [];
  const searchDirs = ['src', 'tests', 'debug', 'worker'];
  
  searchDirs.forEach(dir => {
    if (!fs.existsSync(dir)) return;
    
    const files = findFiles(dir, /\.(js|html)$/, 10);
    
    files.forEach(file => {
      // Skip the module's own index.js
      if (file.includes(`src/modules/${moduleName}/index.js`)) return;
      
      const content = fs.readFileSync(file, 'utf8');
      const regex = new RegExp(`\\b${exportName}\\b`, 'g');
      const matches = content.match(regex);
      
      if (matches && matches.length > 0) {
        usages.push({ file: file.replace(/^\.\//, ''), count: matches.length });
      }
    });
  });
  
  return usages;
}

// Helper: Find files recursively
function findFiles(dir, pattern, maxDepth, currentDepth = 0, results = []) {
  if (!fs.existsSync(dir) || currentDepth > maxDepth) return results;
  
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  entries.forEach(entry => {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory() && !['node_modules', 'venv', '.git', 'archive'].includes(entry.name)) {
      findFiles(fullPath, pattern, maxDepth, currentDepth + 1, results);
    } else if (entry.isFile() && pattern.test(entry.name)) {
      results.push(fullPath);
    }
  });
  
  return results;
}

// Main analysis
function main() {
  console.log(COLORS.cyan + '═══════════════════════════════════════════' + COLORS.reset);
  console.log(COLORS.cyan + '  🔍 Dead Facade Finder' + COLORS.reset);
  console.log(COLORS.cyan + '═══════════════════════════════════════════' + COLORS.reset);

  const moduleExports = getModuleExports();
  const deadMethods = [];
  const usedMethods = [];

  Object.entries(moduleExports).forEach(([mod, exports]) => {
    log(COLORS.cyan, `\n📦 ${mod}:`, '');
    
    exports.forEach(exp => {
      if (exp === 'ENABLED') return; // Skip ENABLED flag
      
      const usages = findUsages(exp, mod);
      
      if (usages.length === 0) {
        log(COLORS.red, '  ❌', `${exp} - NOT USED`);
        deadMethods.push({ module: mod, method: exp });
      } else {
        log(COLORS.green, '  ✅', `${exp} - ${usages.length} usage(s)`);
        usedMethods.push({ module: mod, method: exp, usages: usages.length });
      }
    });
  });

  // Summary
  log(COLORS.cyan, '\n📊 Summary:', '');
  console.log(`Total Exports: ${usedMethods.length + deadMethods.length}`);
  console.log(`${COLORS.green}✅ Used: ${usedMethods.length}${COLORS.reset}`);
  console.log(`${COLORS.red}❌ Dead: ${deadMethods.length}${COLORS.reset}\n`);

  if (deadMethods.length > 0) {
    log(COLORS.red, '🔴 Dead Facade Methods:', '(candidates for removal)\n');
    deadMethods.forEach(({ module, method }) => {
      console.log(`  src/modules/${module}/index.js - export { ${method} }`);
    });
    console.log(`\n${COLORS.yellow}💡 These methods are exported but never imported anywhere${COLORS.reset}`);
    console.log(`${COLORS.yellow}💡 Consider removing or creating tests for them${COLORS.reset}`);
  } else {
    log(COLORS.green, '✅', 'All facade methods are being used!');
  }

  console.log(COLORS.cyan + '\nScript: scripts/find-dead-facades.cjs' + COLORS.reset);

  // Exit code
  process.exit(deadMethods.length > 0 ? 1 : 0);
}

main();
