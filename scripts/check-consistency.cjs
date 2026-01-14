#!/usr/bin/env node

/**
 * Project Consistency Checker
 * Validates architecture, modularity, and file organization
 * 
 * Usage: node scripts/check-consistency.cjs
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
};

function log(color, prefix, message) {
  console.log(`${color}${prefix}${COLORS.reset} ${message}`);
}

// Check version consistency across files
function checkVersionConsistency() {
  log(COLORS.blue, '\n📋 Checking Version Consistency...', '');
  
  const files = {
    'package.json': JSON.parse(fs.readFileSync('package.json', 'utf8')).version,
    '.smri/INDEX.md': null,
    'README.md': null,
    'src/SMRI.md': null,
  };

  // Extract versions from markdown files
  Object.keys(files).forEach(file => {
    if (file.endsWith('.md') && fs.existsSync(file)) {
      const content = fs.readFileSync(file, 'utf8');
      const match = content.match(/\*\*Version:\*\*\s*([\d.]+)/i) || 
                    content.match(/version-(\d+\.\d+\.\d+)-/);
      files[file] = match ? match[1] : 'NOT FOUND';
    }
  });

  const baseVersion = files['package.json'];
  let allMatch = true;

  Object.entries(files).forEach(([file, version]) => {
    if (version === baseVersion) {
      log(COLORS.green, '✅', `${file}: ${version}`);
    } else if (version === 'NOT FOUND') {
      log(COLORS.yellow, '⚠️', `${file}: Version tag not found`);
      allMatch = false;
    } else {
      log(COLORS.red, '❌', `${file}: ${version} (expected ${baseVersion})`);
      allMatch = false;
    }
  });

  return allMatch;
}

// Check module structure
function checkModuleStructure() {
  log(COLORS.blue, '\n🏗️  Checking Module Structure...', '');
  
  const modulesPath = 'src/modules';
  if (!fs.existsSync(modulesPath)) {
    log(COLORS.red, '❌', 'src/modules directory not found!');
    return false;
  }

  const modules = fs.readdirSync(modulesPath, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name);

  const expectedModules = ['common', 'shop', 'game', 'auth', 'payment', 'testing', 'breeding', 'smri', 'tutorial'];
  let allValid = true;

  modules.forEach(module => {
    const modulePath = path.join(modulesPath, module);
    const hasIndex = fs.existsSync(path.join(modulePath, 'index.js'));
    
    if (hasIndex) {
      log(COLORS.green, '✅', `${module}/ - has index.js`);
    } else {
      log(COLORS.red, '❌', `${module}/ - missing index.js`);
      allValid = false;
    }
  });

  // Check for unexpected modules
  const unexpected = modules.filter(m => !expectedModules.includes(m));
  if (unexpected.length > 0) {
    log(COLORS.yellow, '⚠️', `Unexpected modules: ${unexpected.join(', ')}`);
  }

  return allValid;
}

// Check for duplicate files
function checkDuplicates() {
  log(COLORS.blue, '\n🔍 Checking for Duplicates...', '');
  
  const patterns = [
    { pattern: /smri-runner.*\.html$/, dir: 'debug' },
    { pattern: /demo.*\.html$/, dir: 'debug' },
    { pattern: /test.*\.html$/, dir: 'debug' },
    { pattern: /.*\.backup/, dir: '.' },
    { pattern: /.*-old\.html$/, dir: '.' },
  ];

  let foundDuplicates = false;

  patterns.forEach(({ pattern, dir }) => {
    const files = findFiles(dir, pattern);
    // Exclude archive directories
    const nonArchiveFiles = files.filter(f => !f.includes('/archive'));
    
    // Allow up to 3 specialized files (different purposes)
    const threshold = 3;
    
    if (nonArchiveFiles.length > threshold) {
      log(COLORS.yellow, '⚠️', `Found ${nonArchiveFiles.length} files matching ${pattern}:`);
      nonArchiveFiles.forEach(f => console.log(`   - ${f}`));
      foundDuplicates = true;
    } else if (nonArchiveFiles.length > 1) {
      log(COLORS.green, '✅', `${pattern}: ${nonArchiveFiles.length} specialized files (within threshold)`);
    } else if (files.length > nonArchiveFiles.length) {
      // Info: some files in archives
      log(COLORS.green, '✅', `${pattern}: ${nonArchiveFiles.length} active (${files.length - nonArchiveFiles.length} archived)`);
    }
  });

  if (!foundDuplicates) {
    log(COLORS.green, '✅', 'No duplicates in active files');
  }

  return !foundDuplicates;
}

// Check SMRI structure
function checkSMRIStructure() {
  log(COLORS.blue, '\n📁 Checking SMRI Structure...', '');
  
  const smriPath = '.smri';
  if (!fs.existsSync(smriPath)) {
    log(COLORS.red, '❌', '.smri directory not found!');
    return false;
  }

  // Check for files in root (only INDEX.md allowed)
  const rootFiles = fs.readdirSync(smriPath, { withFileTypes: true })
    .filter(d => d.isFile())
    .map(d => d.name);

  let valid = true;
  if (rootFiles.length === 1 && rootFiles[0] === 'INDEX.md') {
    log(COLORS.green, '✅', 'Only INDEX.md in .smri root');
  } else {
    log(COLORS.red, '❌', `Unexpected files in .smri root: ${rootFiles.join(', ')}`);
    valid = false;
  }

  // Check subdirectories
  const expectedDirs = ['docs', 'scenarios', 'logs'];
  expectedDirs.forEach(dir => {
    const exists = fs.existsSync(path.join(smriPath, dir));
    if (exists) {
      log(COLORS.green, '✅', `.smri/${dir}/ exists`);
    } else {
      log(COLORS.yellow, '⚠️', `.smri/${dir}/ not found`);
    }
  });

  return valid;
}

// Check file sizes
function checkFileSizes() {
  log(COLORS.blue, '\n📏 Checking Large Files...', '');
  
  const maxSize = {
    '.md': 500,  // lines
    '.js': 1000, // lines
  };

  const largeFiles = [];
  
  function scanDirectory(dir, exclude = ['node_modules', 'venv', '.git', 'data/backup*']) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    entries.forEach(entry => {
      const fullPath = path.join(dir, entry.name);
      
      if (exclude.some(pattern => fullPath.includes(pattern))) {
        return;
      }

      if (entry.isDirectory()) {
        scanDirectory(fullPath, exclude);
      } else if (entry.isFile()) {
        const ext = path.extname(entry.name);
        if (maxSize[ext]) {
          const lines = fs.readFileSync(fullPath, 'utf8').split('\n').length;
          if (lines > maxSize[ext]) {
            largeFiles.push({ path: fullPath, lines, max: maxSize[ext] });
          }
        }
      }
    });
  }

  scanDirectory('.');

  if (largeFiles.length > 0) {
    largeFiles.forEach(({ path, lines, max }) => {
      log(COLORS.yellow, '⚠️', `${path}: ${lines} lines (max: ${max})`);
    });
  } else {
    log(COLORS.green, '✅', 'No oversized files found');
  }

  return largeFiles.length === 0;
}

// Check module exports
function checkModuleExports() {
  log(COLORS.blue, '\n📦 Checking Module Exports...', '');
  
  const configPath = 'src/config/smri/module-functions.js';
  if (!fs.existsSync(configPath)) {
    log(COLORS.red, '❌', 'module-functions.js not found!');
    return false;
  }

  const publicApiPath = 'src/PUBLIC-API.md';
  if (!fs.existsSync(publicApiPath)) {
    log(COLORS.yellow, '⚠️', 'PUBLIC-API.md not found');
  } else {
    log(COLORS.green, '✅', 'PUBLIC-API.md exists');
  }

  log(COLORS.green, '✅', 'module-functions.js exists');
  return true;
}

// Helper: Find files matching pattern
function findFiles(dir, pattern, results = []) {
  if (!fs.existsSync(dir)) return results;
  
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  entries.forEach(entry => {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory() && !['node_modules', 'venv', '.git'].includes(entry.name)) {
      findFiles(fullPath, pattern, results);
    } else if (entry.isFile() && pattern.test(entry.name)) {
      results.push(fullPath);
    }
  });
  
  return results;
}

// Main execution
function main() {
  console.log(COLORS.cyan + '═══════════════════════════════════════════' + COLORS.reset);
  console.log(COLORS.cyan + '  🐍 Serpent Town - Consistency Checker' + COLORS.reset);
  console.log(COLORS.cyan + '═══════════════════════════════════════════' + COLORS.reset);

  const checks = [
    { name: 'Version Consistency', fn: checkVersionConsistency },
    { name: 'Module Structure', fn: checkModuleStructure },
    { name: 'SMRI Structure', fn: checkSMRIStructure },
    { name: 'Duplicate Files', fn: checkDuplicates },
    { name: 'File Sizes', fn: checkFileSizes },
    { name: 'Module Exports', fn: checkModuleExports },
  ];

  const results = checks.map(check => ({
    name: check.name,
    passed: check.fn()
  }));

  // Summary
  log(COLORS.blue, '\n📊 Summary:', '');
  const passed = results.filter(r => r.passed).length;
  const total = results.length;
  const percentage = Math.round((passed / total) * 100);

  results.forEach(({ name, passed }) => {
    log(passed ? COLORS.green : COLORS.red, 
        passed ? '✅' : '❌', 
        name);
  });

  console.log(`\n${COLORS.cyan}Score: ${passed}/${total} (${percentage}%)${COLORS.reset}`);

  if (passed === total) {
    log(COLORS.green, '\n🎉', 'All checks passed!');
    process.exit(0);
  } else {
    log(COLORS.yellow, '\n⚠️', 'Some checks failed - review above');
    console.log(COLORS.cyan + '\nScript: scripts/check-consistency.cjs' + COLORS.reset);
    process.exit(1);
  }
}

main();
