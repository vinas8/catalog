#!/usr/bin/env node
/**
 * Function Catalog Scanner
 * Scans all src/ JS files and generates catalog
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Get git commit info
const gitHash = execSync('git log -1 --format="%h"').toString().trim();
const gitMessage = execSync('git log -1 --format="%s"').toString().trim();
const today = new Date().toISOString().split('T')[0];

function scanDirectory(dir, results = []) {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory() && !fullPath.includes('node_modules')) {
      scanDirectory(fullPath, results);
    } else if (file.endsWith('.js')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      const relativePath = fullPath.replace(process.cwd() + '/', '');
      
      // Count exports
      const exportClass = (content.match(/export\s+class\s+\w+/g) || []).length;
      const exportFunction = (content.match(/export\s+(?:async\s+)?function\s+\w+/g) || []).length;
      const exportConst = (content.match(/export\s+const\s+\w+\s*=/g) || []).length;
      
      const totalExports = exportClass + exportFunction + exportConst;
      
      if (totalExports > 0) {
        results.push({
          file: relativePath,
          exports: totalExports,
          classes: exportClass,
          functions: exportFunction,
          constants: exportConst
        });
      }
    }
  }
  
  return results;
}

// Scan src directory
const results = scanDirectory('src');
const totalExports = results.reduce((sum, r) => sum + r.exports, 0);

// Generate catalog header
console.log(`# 🔍 Complete Function Catalog

**Version:** 0.7.7  
**Last Scanned:** ${today}  
**Git Commit:** \`${gitHash}\` - ${gitMessage}  
**Files Scanned:** ${results.length} JavaScript files  
**Total Exports:** ${totalExports} (classes, functions, constants)

> Complete catalog of ALL functions, classes, and methods in the project.
> Auto-updated on \`.smri\` load by checking git hash.

---

## 🔄 Auto-Update System

This catalog is **automatically regenerated** when:
1. User runs \`.smri\` command
2. Git commit hash has changed since last scan
3. Script scans all \`src/**/*.js\` files
4. Updates this file with new exports/functions

**Last scanned at commit:** \`${gitHash}\`

---

## 📊 Statistics

**Total Files:** ${results.length}  
**Total Exports:** ${totalExports}  
**Classes:** ${results.reduce((sum, r) => sum + r.classes, 0)}  
**Functions:** ${results.reduce((sum, r) => sum + r.functions, 0)}  
**Constants:** ${results.reduce((sum, r) => sum + r.constants, 0)}

---

## 📁 Files by Directory

`);

// Group by directory
const byDir = {};
results.forEach(r => {
  const dir = r.file.split('/').slice(0, 2).join('/');
  if (!byDir[dir]) byDir[dir] = [];
  byDir[dir].push(r);
});

// Output by directory
for (const [dir, files] of Object.entries(byDir).sort()) {
  const totalExp = files.reduce((sum, f) => sum + f.exports, 0);
  console.log(`### ${dir}/ (${files.length} files, ${totalExp} exports)\n`);
  
  files.sort((a, b) => b.exports - a.exports).slice(0, 10).forEach(f => {
    const shortPath = f.file.replace(`${dir}/`, '');
    console.log(`- **${shortPath}** - ${f.exports} exports (${f.classes}c, ${f.functions}f, ${f.constants}const)`);
  });
  
  if (files.length > 10) {
    console.log(`- ... and ${files.length - 10} more files`);
  }
  console.log('');
}

console.log(`---

## 🔍 Usage

**View catalog:**
\`\`\`bash
cat .smri/docs/FUNCTION-CATALOG.md
\`\`\`

**Search functions:**
\`\`\`javascript
import { searchFunctions } from './config/smri/module-functions.js';
const results = searchFunctions('buy');
\`\`\`

**Update manually:**
\`\`\`bash
node scripts/scan-functions.js > .smri/docs/FUNCTION-CATALOG.md
\`\`\`

---

**Generated:** ${today}  
**Git Hash:** \`${gitHash}\`  
**Auto-updated by:** \`.smri\` command
`);
