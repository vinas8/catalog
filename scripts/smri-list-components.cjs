#!/usr/bin/env node
/**
 * List all UI components and their usage in scenarios
 * @version 0.7.7
 */

const fs = require('fs');
const path = require('path');

async function main() {
  console.log('🎨 UI Component Coverage\n');
  console.log('=' .repeat(60));
  
  // Load scenarios
  const scenariosPath = path.join(__dirname, '../src/config/smri/scenarios.js');
  const scenariosContent = fs.readFileSync(scenariosPath, 'utf8');
  
  // Import dynamically
  const { getComponentCoverage } = await import(`file://${scenariosPath}`);
  const coverage = getComponentCoverage();
  
  console.log(`\n📊 Overall Coverage: ${coverage.used}/${coverage.total} (${coverage.coverage}%)\n`);
  
  // Used components
  if (coverage.usedList.length > 0) {
    console.log('✅ Components in Use:');
    coverage.usedList.forEach(comp => {
      console.log(`   - ${comp}`);
    });
    console.log('');
  }
  
  // Unused components
  if (coverage.unusedList.length > 0) {
    console.log('⚠️  Unused Components:');
    coverage.unusedList.forEach(comp => {
      console.log(`   - ${comp} (not used in any scenario)`);
    });
    console.log('');
  }
  
  // List all components with details
  const componentsDir = path.join(__dirname, '../src/components');
  const files = fs.readdirSync(componentsDir)
    .filter(f => f.endsWith('.js') && !f.includes('test'));
  
  console.log('📁 All Components:');
  files.forEach(file => {
    const name = file.replace('.js', '');
    const filePath = path.join(componentsDir, file);
    const stats = fs.statSync(filePath);
    const lines = fs.readFileSync(filePath, 'utf8').split('\n').length;
    const used = coverage.usedList.includes(name) ? '✅' : '❌';
    
    console.log(`   ${used} ${name} (${lines} lines, ${(stats.size/1024).toFixed(1)}kb)`);
  });
  
  console.log('\n' + '='.repeat(60));
  console.log('Script: scripts/smri-list-components.cjs');
}

main().catch(console.error);
