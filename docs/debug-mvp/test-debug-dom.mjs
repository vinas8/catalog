#!/usr/bin/env node
/**
 * Browser simulation test for debug page (no Playwright needed)
 * Simulates DOM operations and event handling
 */

import { readFileSync } from 'fs';
import { JSDOM } from 'jsdom';

console.log('🧪 Debug Page Browser Simulation Test\n');
console.log('='*60);

async function testDebugPage() {
  try {
    // Load the HTML file
    console.log('\n1️⃣  Loading debug page HTML...');
    const html = readFileSync('./src/modules/debug/index.html', 'utf-8');
    console.log(`   ✅ Loaded: ${html.length} bytes`);
    
    // Parse with JSDOM (simulates browser)
    console.log('\n2️⃣  Creating virtual DOM...');
    const dom = new JSDOM(html, {
      url: 'http://localhost:8000/src/modules/debug/index.html',
      runScripts: 'dangerously',
      resources: 'usable',
      beforeParse(window) {
        // Mock console for the page
        window.console = console;
      }
    });
    
    const { window } = dom;
    const { document } = window;
    
    console.log('   ✅ Virtual DOM created');
    
    // Wait for scripts to load
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check structure
    console.log('\n3️⃣  Checking page structure...');
    
    const modules = ['scenarios', 'catalog', 'users', 'admin', 'stripe', 'monitor', 'logs'];
    let modulesFound = 0;
    let tabsFound = 0;
    
    modules.forEach(mod => {
      const moduleDiv = document.getElementById(`module-${mod}`);
      const tabButton = document.querySelector(`[data-module="${mod}"]`);
      
      if (moduleDiv) {
        modulesFound++;
        console.log(`   ✅ module-${mod} div exists`);
      }
      
      if (tabButton) {
        tabsFound++;
      }
    });
    
    console.log(`\n   📊 Found ${modulesFound}/7 module divs`);
    console.log(`   📊 Found ${tabsFound}/7 tab buttons`);
    
    // Check dropdown
    const dropdown = document.getElementById('module-selector');
    console.log(`   ${dropdown ? '✅' : '❌'} Dropdown exists`);
    
    // Check if switchModule exists
    console.log('\n4️⃣  Checking JavaScript functions...');
    if (typeof window.switchModule === 'function') {
      console.log('   ✅ switchModule() function exists');
      
      // Test switching to catalog
      console.log('\n5️⃣  Testing module switch to "catalog"...');
      
      const catalogBefore = document.getElementById('module-catalog');
      console.log(`   📊 Before: catalog active = ${catalogBefore.classList.contains('active')}`);
      
      // Call switchModule
      window.switchModule('catalog');
      
      const catalogAfter = document.getElementById('module-catalog');
      const scenariosAfter = document.getElementById('module-scenarios');
      
      console.log(`   📊 After: catalog active = ${catalogAfter.classList.contains('active')}`);
      console.log(`   📊 After: scenarios active = ${scenariosAfter.classList.contains('active')}`);
      
      if (catalogAfter.classList.contains('active') && !scenariosAfter.classList.contains('active')) {
        console.log('   ✅ SUCCESS! Module switching works!');
      } else {
        console.log('   ❌ FAILED! Module did not switch correctly');
      }
      
      // Test dropdown event
      console.log('\n6️⃣  Testing dropdown event...');
      if (dropdown) {
        dropdown.value = 'users';
        const event = new window.Event('change', { bubbles: true });
        dropdown.dispatchEvent(event);
        
        await new Promise(resolve => setTimeout(resolve, 100));
        
        const usersModule = document.getElementById('module-users');
        if (usersModule.classList.contains('active')) {
          console.log('   ✅ Dropdown event works!');
        } else {
          console.log('   ❌ Dropdown event failed');
        }
      }
      
      // Test tab click
      console.log('\n7️⃣  Testing tab click event...');
      const adminTab = document.querySelector('[data-module="admin"]');
      if (adminTab) {
        adminTab.click();
        
        await new Promise(resolve => setTimeout(resolve, 100));
        
        const adminModule = document.getElementById('module-admin');
        if (adminModule.classList.contains('active')) {
          console.log('   ✅ Tab click works!');
        } else {
          console.log('   ❌ Tab click failed');
        }
      }
      
    } else {
      console.log('   ❌ switchModule() function NOT FOUND');
    }
    
    console.log('\n' + '='*60);
    console.log('📊 TEST COMPLETE\n');
    
  } catch (error) {
    console.error(`\n❌ ERROR: ${error.message}`);
    console.error(error.stack);
  }
}

testDebugPage();
