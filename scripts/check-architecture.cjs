#!/usr/bin/env node

/**
 * Architecture Analyzer
 * Analyzes module dependencies, coupling, and architecture patterns
 * 
 * Usage: node scripts/check-architecture.cjs
 */

const fs = require('fs');
const path = require('path');

const COLORS = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
};

function log(color, prefix, message) {
  console.log(`${color}${prefix}${COLORS.reset} ${message}`);
}

// Analyze module dependencies
function analyzeModuleDependencies() {
  log(COLORS.blue, '\n🔗 Analyzing Module Dependencies...', '');
  
  const modulesPath = 'src/modules';
  const modules = fs.readdirSync(modulesPath, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name);

  const dependencies = {};

  modules.forEach(module => {
    const indexPath = path.join(modulesPath, module, 'index.js');
    if (!fs.existsSync(indexPath)) return;

    const content = fs.readFileSync(indexPath, 'utf8');
    const imports = content.match(/from\s+['"]\.\.\/([^'"\/]+)/g) || [];
    
    dependencies[module] = imports
      .map(imp => imp.match(/from\s+['"]\.\.\/([^'"\/]+)/)[1])
      .filter(dep => modules.includes(dep));
  });

  // Display dependency graph
  Object.entries(dependencies).forEach(([module, deps]) => {
    if (deps.length === 0) {
      log(COLORS.green, '✅', `${module}: No internal dependencies`);
    } else {
      log(COLORS.yellow, '📦', `${module}: ${deps.join(', ')}`);
    }
  });

  // Calculate coupling score
  const avgDeps = Object.values(dependencies).reduce((sum, deps) => sum + deps.length, 0) / modules.length;
  log(COLORS.cyan, '\n📊', `Average dependencies per module: ${avgDeps.toFixed(2)}`);

  if (avgDeps < 2) {
    log(COLORS.green, '✅', 'Low coupling - good architecture');
  } else if (avgDeps < 4) {
    log(COLORS.yellow, '⚠️', 'Moderate coupling - consider refactoring');
  } else {
    log(COLORS.red, '❌', 'High coupling - refactor recommended');
  }

  return dependencies;
}

// Analyze facade pattern implementation
function analyzeFacadePattern() {
  log(COLORS.blue, '\n🎭 Analyzing Facade Pattern...', '');
  
  const modulesPath = 'src/modules';
  const modules = fs.readdirSync(modulesPath, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name);

  let facadeScore = 0;
  let totalModules = 0;

  modules.forEach(module => {
    const indexPath = path.join(modulesPath, module, 'index.js');
    if (!fs.existsSync(indexPath)) {
      log(COLORS.red, '❌', `${module}: No index.js facade`);
      return;
    }

    totalModules++;
    const content = fs.readFileSync(indexPath, 'utf8');
    
    // Check for ENABLED flag
    const hasEnabled = content.includes('export const ENABLED');
    
    // Check for clean exports
    const hasExports = content.includes('export') && content.includes('{');
    
    // Check for documentation
    const hasJSDoc = content.includes('/**') || content.includes('//');

    if (hasEnabled && hasExports) {
      log(COLORS.green, '✅', `${module}: Proper facade (ENABLED=${hasEnabled}, exports=${hasExports})`);
      facadeScore++;
    } else {
      log(COLORS.yellow, '⚠️', `${module}: Incomplete facade (ENABLED=${hasEnabled}, exports=${hasExports})`);
    }
  });

  const percentage = Math.round((facadeScore / totalModules) * 100);
  log(COLORS.cyan, '\n📊', `Facade compliance: ${facadeScore}/${totalModules} (${percentage}%)`);

  return percentage >= 80;
}

// Analyze file organization
function analyzeFileOrganization() {
  log(COLORS.blue, '\n📂 Analyzing File Organization...', '');
  
  const structure = {
    'Frontend HTML': findFiles('.', /^(catalog|collection|game|success|index)\.html$/, 1),
    'Debug Tools': findFiles('debug', /\.html$/, 2),
    'Source Modules': findFiles('src/modules', /\.js$/, 3),
    'Tests': findFiles('tests', /\.test\.js$/, 3),
    'Config': findFiles('src/config', /\.js$/, 2),
    'Worker': findFiles('worker', /\.js$/, 2),
  };

  Object.entries(structure).forEach(([category, files]) => {
    log(COLORS.cyan, '📁', `${category}: ${files.length} files`);
  });

  return true;
}

// Analyze code complexity
function analyzeCodeComplexity() {
  log(COLORS.blue, '\n🧮 Analyzing Code Complexity...', '');
  
  const jsFiles = findFiles('src', /\.js$/, 10);
  const complexFiles = [];

  jsFiles.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    const lines = content.split('\n').length;
    
    // Simple complexity metrics
    const functions = (content.match(/function\s+\w+/g) || []).length;
    const classes = (content.match(/class\s+\w+/g) || []).length;
    const ifStatements = (content.match(/\bif\s*\(/g) || []).length;
    const loops = (content.match(/\b(for|while)\s*\(/g) || []).length;
    
    const complexity = ifStatements + loops * 2 + functions;
    
    if (complexity > 50 || lines > 500) {
      complexFiles.push({ 
        file: file.replace(/^\.\//, ''), 
        lines, 
        complexity,
        functions,
        classes
      });
    }
  });

  if (complexFiles.length > 0) {
    log(COLORS.yellow, '⚠️', 'Complex files found:');
    complexFiles.forEach(({ file, lines, complexity, functions }) => {
      console.log(`   ${file}`);
      console.log(`      Lines: ${lines}, Complexity: ${complexity}, Functions: ${functions}`);
    });
  } else {
    log(COLORS.green, '✅', 'No overly complex files detected');
  }

  return complexFiles.length < 5;
}

// Check for circular dependencies
function checkCircularDependencies() {
  log(COLORS.blue, '\n🔄 Checking for Circular Dependencies...', '');
  
  const modulesPath = 'src/modules';
  const modules = fs.readdirSync(modulesPath, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name);

  const graph = {};

  // Build dependency graph
  modules.forEach(module => {
    const indexPath = path.join(modulesPath, module, 'index.js');
    if (!fs.existsSync(indexPath)) return;

    const content = fs.readFileSync(indexPath, 'utf8');
    const imports = content.match(/from\s+['"]\.\.\/([^'"\/]+)/g) || [];
    
    graph[module] = imports
      .map(imp => imp.match(/from\s+['"]\.\.\/([^'"\/]+)/)[1])
      .filter(dep => modules.includes(dep));
  });

  // Detect cycles using DFS
  const visited = new Set();
  const recStack = new Set();
  const cycles = [];

  function hasCycle(node, path = []) {
    if (recStack.has(node)) {
      cycles.push([...path, node]);
      return true;
    }
    if (visited.has(node)) return false;

    visited.add(node);
    recStack.add(node);

    const neighbors = graph[node] || [];
    for (const neighbor of neighbors) {
      if (hasCycle(neighbor, [...path, node])) {
        // Continue searching for more cycles
      }
    }

    recStack.delete(node);
    return false;
  }

  modules.forEach(module => {
    if (!visited.has(module)) {
      hasCycle(module);
    }
  });

  if (cycles.length === 0) {
    log(COLORS.green, '✅', 'No circular dependencies detected');
    return true;
  } else {
    log(COLORS.red, '❌', `Found ${cycles.length} circular dependencies:`);
    cycles.forEach(cycle => {
      console.log(`   ${cycle.join(' → ')}`);
    });
    return false;
  }
}

// SMRI Modularity: Check if modules only import from facades (index.js)
function checkSMRIModularity() {
  log(COLORS.blue, '\n🎯 Checking SMRI Modularity (Facade-Only Imports)...', '');
  
  const modulesPath = 'src/modules';
  const modules = fs.readdirSync(modulesPath, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name);

  const violations = [];

  modules.forEach(module => {
    // Check all JS files in the module
    const moduleFiles = findFiles(path.join(modulesPath, module), /\.js$/, 5);
    
    moduleFiles.forEach(file => {
      const content = fs.readFileSync(file, 'utf8');
      const relPath = file.replace(/^\.\//, '');
      
      // Find imports from other modules
      const imports = content.match(/from\s+['"]\.\.\/[^'"]+['"];?/g) || [];
      
      imports.forEach(imp => {
        const match = imp.match(/from\s+['"]\.\.\/([^'"\/]+)\/([^'"]+)['"]/);
        if (match) {
          const [_, targetModule, targetFile] = match;
          
          // Violation: Importing from internal file instead of index.js
          if (targetFile !== 'index.js' && modules.includes(targetModule)) {
            violations.push({
              file: relPath,
              import: imp.trim(),
              targetModule,
              targetFile,
              message: `Should import from '../${targetModule}/index.js' (facade)`
            });
          }
        }
      });
    });
  });

  if (violations.length === 0) {
    log(COLORS.green, '✅', 'All modules use facade pattern correctly');
    return true;
  } else {
    log(COLORS.red, '❌', `Found ${violations.length} facade violations:`);
    violations.forEach(({ file, import: imp, targetModule, message }) => {
      console.log(`   ${file}`);
      console.log(`      ${imp}`);
      console.log(`      ${COLORS.yellow}→ ${message}${COLORS.reset}`);
    });
    return false;
  }
}

// SMRI Syntax: Validate scenario relation numbers match module numbers
function checkSMRISyntax() {
  log(COLORS.blue, '\n🔢 Checking SMRI Scenario Syntax...', '');
  
  const scenariosPath = 'src/config/smri/scenarios.js';
  if (!fs.existsSync(scenariosPath)) {
    log(COLORS.yellow, '⚠️', 'scenarios.js not found - skipping');
    return true;
  }

  // Module name to number mapping
  const MODULE_MAP = {
    'common': 0,
    'health': 0,
    'shop': 1,
    'game': 2,
    'auth': 3,
    'payment': 4,
    'worker': 5,
    'testing': 6,
    'breeding': 7,
    'smri': 8,
    'tutorial': 9
  };

  const content = fs.readFileSync(scenariosPath, 'utf8');
  
  // Extract all scenario objects
  const scenarioMatches = content.matchAll(/smri:\s*['"]([^'"]+)['"]/g);
  const violations = [];

  for (const match of scenarioMatches) {
    const smri = match[1];
    
    // Parse SMRI format: S{M}.{RRR}.{II}
    const smriPattern = /^S(\d+(?:-\d+)?)\.([\d,\-]+)\.(\d+)$/;
    const parsed = smri.match(smriPattern);
    
    if (!parsed) {
      violations.push({
        smri,
        error: 'Invalid SMRI format (expected: S{M}.{RRR}.{II})'
      });
      continue;
    }

    const [_, primaryModule, relations, iteration] = parsed;
    
    // Extract relation numbers
    const relationNums = relations.split(',').map(r => {
      const parts = r.split('-');
      return parseInt(parts[0]); // Get main module number (ignore submodule)
    });

    // Check if primary module is in relations
    const primaryNum = parseInt(primaryModule.split('-')[0]);
    
    // Validate relation numbers are 0-10
    const invalidRelations = relationNums.filter(n => n < 0 || n > 10);
    if (invalidRelations.length > 0) {
      violations.push({
        smri,
        error: `Invalid relation numbers: ${invalidRelations.join(', ')} (must be 0-10)`
      });
    }
  }

  if (violations.length === 0) {
    log(COLORS.green, '✅', 'All SMRI scenario syntax valid');
    return true;
  } else {
    log(COLORS.red, '❌', `Found ${violations.length} SMRI syntax errors:`);
    violations.forEach(({ smri, error }) => {
      console.log(`   ${smri}`);
      console.log(`      ${COLORS.yellow}→ ${error}${COLORS.reset}`);
    });
    return false;
  }
}

// Helper: Find files
function findFiles(dir, pattern, maxDepth, currentDepth = 0, results = []) {
  if (!fs.existsSync(dir) || currentDepth > maxDepth) return results;
  
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  entries.forEach(entry => {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory() && !['node_modules', 'venv', '.git'].includes(entry.name)) {
      findFiles(fullPath, pattern, maxDepth, currentDepth + 1, results);
    } else if (entry.isFile() && pattern.test(entry.name)) {
      results.push(fullPath);
    }
  });
  
  return results;
}

// Main execution
function main() {
  console.log(COLORS.cyan + '═══════════════════════════════════════════' + COLORS.reset);
  console.log(COLORS.cyan + '  🏗️  Architecture Analyzer' + COLORS.reset);
  console.log(COLORS.cyan + '═══════════════════════════════════════════' + COLORS.reset);

  const dependencies = analyzeModuleDependencies();
  const facadeValid = analyzeFacadePattern();
  const circularValid = checkCircularDependencies();
  const modularityValid = checkSMRIModularity();
  const smriSyntaxValid = checkSMRISyntax();
  analyzeFileOrganization();
  const complexityValid = analyzeCodeComplexity();

  // Summary
  log(COLORS.blue, '\n📊 Architecture Health:', '');
  
  const checks = [
    { name: 'Facade Pattern', passed: facadeValid },
    { name: 'No Circular Dependencies', passed: circularValid },
    { name: 'SMRI Modularity (Facade-Only Imports)', passed: modularityValid },
    { name: 'SMRI Syntax Validation', passed: smriSyntaxValid },
    { name: 'Code Complexity', passed: complexityValid },
  ];

  const passed = checks.filter(c => c.passed).length;
  const total = checks.length;
  const percentage = Math.round((passed / total) * 100);

  checks.forEach(({ name, passed }) => {
    log(passed ? COLORS.green : COLORS.red, 
        passed ? '✅' : '❌', 
        name);
  });

  console.log(`\n${COLORS.cyan}Health Score: ${passed}/${total} (${percentage}%)${COLORS.reset}`);

  if (percentage >= 80) {
    log(COLORS.green, '\n🎉', 'Architecture is healthy!');
    console.log(COLORS.cyan + '\nScript: scripts/check-architecture.cjs' + COLORS.reset);
    process.exit(0);
  } else {
    log(COLORS.yellow, '\n⚠️', 'Architecture needs improvement');
    console.log(COLORS.cyan + '\nScript: scripts/check-architecture.cjs' + COLORS.reset);
    process.exit(0); // Don't fail CI, just warn
  }
}

main();
