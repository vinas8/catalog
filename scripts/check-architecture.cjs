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
  analyzeFileOrganization();
  const complexityValid = analyzeCodeComplexity();

  // Summary
  log(COLORS.blue, '\n📊 Architecture Health:', '');
  
  const checks = [
    { name: 'Facade Pattern', passed: facadeValid },
    { name: 'No Circular Dependencies', passed: circularValid },
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
    process.exit(0);
  } else {
    log(COLORS.yellow, '\n⚠️', 'Architecture needs improvement');
    process.exit(1);
  }
}

main();
