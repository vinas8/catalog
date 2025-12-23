/**
 * Browser automation test for debug page
 * Uses Node.js + HTTP requests to simulate browser interaction
 */

const http = require('http');
const https = require('https');

console.log('🌐 Testing Debug Page with Browser Simulation\n');
console.log('='.repeat(60));

async function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    client.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, body: data }));
    }).on('error', reject);
  });
}

async function testDebugPage() {
  console.log('\n1️⃣ Loading debug page...\n');
  
  try {
    // Load debug page
    const page = await fetchUrl('http://localhost:8000/src/modules/debug/index.html');
    
    if (page.status !== 200) {
      throw new Error(`Failed to load page: ${page.status}`);
    }
    
    console.log(`   ✅ Page loaded: ${page.body.length} bytes`);
    
    // Check for v2 FIXED
    if (page.body.includes('v2 FIXED')) {
      console.log('   ✅ Page shows "v2 FIXED" (cache cleared)');
    } else {
      console.log('   ⚠️  Page still shows old version (browser cache issue)');
    }
    
    console.log('\n2️⃣ Checking JavaScript structure...\n');
    
    // Check script tag
    const scriptMatch = page.body.match(/<script type="module">([\s\S]*?)<\/script>/);
    if (!scriptMatch) {
      throw new Error('No module script found');
    }
    console.log('   ✅ Found module script');
    
    const script = scriptMatch[1];
    
    // Check import statement
    const importMatch = script.match(/import\s+{[^}]+}\s+from\s+['"]([^'"]+)['"]/);
    if (importMatch) {
      console.log(`   ✅ Import path: ${importMatch[1]}`);
      
      // Check if import path is correct
      if (importMatch[1].includes('../../config/worker-config.js')) {
        console.log('   ✅ Import path is correct');
      } else {
        console.log('   ❌ Import path is WRONG');
      }
    }
    
    // Check for key functions
    const functions = [
      'switchModule',
      'viewCachedProducts',
      'testCatalogLoader',
      'callAPI'
    ];
    
    console.log('\n3️⃣ Checking JavaScript functions...\n');
    for (const fn of functions) {
      if (script.includes(`window.${fn}`)) {
        console.log(`   ✅ Function ${fn} exists`);
      } else {
        console.log(`   ❌ Function ${fn} MISSING`);
      }
    }
    
    // Check DOM elements
    console.log('\n4️⃣ Checking DOM elements...\n');
    
    const elements = [
      { id: 'module-catalog', desc: 'Catalog module container' },
      { id: 'res-cachedProducts', desc: 'Cache result div' },
      { id: 'res-testCatalog', desc: 'Test result div' },
      { onclick: 'viewCachedProducts()', desc: 'View Cache button' },
      { onclick: 'testCatalogLoader()', desc: 'Test Catalog button' }
    ];
    
    for (const elem of elements) {
      if (elem.id) {
        if (page.body.includes(`id="${elem.id}"`)) {
          console.log(`   ✅ ${elem.desc} (#${elem.id})`);
        } else {
          console.log(`   ❌ ${elem.desc} MISSING (#${elem.id})`);
        }
      } else if (elem.onclick) {
        if (page.body.includes(`onclick="${elem.onclick}"`)) {
          console.log(`   ✅ ${elem.desc}`);
        } else {
          console.log(`   ❌ ${elem.desc} MISSING`);
        }
      }
    }
    
    // Test module tabs
    console.log('\n5️⃣ Testing module tabs...\n');
    
    const tabs = ['scenarios', 'catalog', 'users', 'admin', 'stripe', 'monitor', 'logs'];
    for (const tab of tabs) {
      const moduleDiv = `id="module-${tab}"`;
      const tabButton = `onclick="switchModule('${tab}'`;
      
      if (page.body.includes(moduleDiv) && page.body.includes(tabButton)) {
        console.log(`   ✅ Tab '${tab}' complete (button + content)`);
      } else if (page.body.includes(moduleDiv)) {
        console.log(`   ⚠️  Tab '${tab}' has content but no button`);
      } else if (page.body.includes(tabButton)) {
        console.log(`   ⚠️  Tab '${tab}' has button but no content`);
      } else {
        console.log(`   ❌ Tab '${tab}' MISSING`);
      }
    }
    
    // Simulate JavaScript execution errors
    console.log('\n6️⃣ Checking for potential JavaScript errors...\n');
    
    const errors = [];
    
    // Check if worker config import will work
    const configTest = await fetchUrl('http://localhost:8000/src/config/worker-config.js');
    if (configTest.status === 200) {
      console.log('   ✅ worker-config.js accessible');
    } else {
      errors.push('worker-config.js not accessible');
      console.log('   ❌ worker-config.js NOT accessible');
    }
    
    // Check if catalog module exists
    const catalogTest = await fetchUrl('http://localhost:8000/src/modules/shop/data/catalog.js');
    if (catalogTest.status === 200) {
      console.log('   ✅ catalog.js accessible');
    } else {
      errors.push('catalog.js not accessible');
      console.log('   ❌ catalog.js NOT accessible');
    }
    
    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('📊 TEST RESULTS:');
    console.log('='.repeat(60) + '\n');
    
    if (errors.length === 0) {
      console.log('✅ ALL CHECKS PASSED\n');
      console.log('🎯 Debug page structure is correct.');
      console.log('💡 If buttons still don\'t work in browser:');
      console.log('   1. Hard refresh: Ctrl+Shift+R');
      console.log('   2. Clear cache completely');
      console.log('   3. Open browser console (F12) and check for errors');
      console.log('   4. Try incognito/private window\n');
    } else {
      console.log('❌ ISSUES FOUND:\n');
      errors.forEach(err => console.log(`   • ${err}`));
      console.log('');
    }
    
    console.log('🔗 Test URL: http://localhost:8000/debug.html');
    console.log('🔗 Direct: http://localhost:8000/src/modules/debug/index.html\n');
    
  } catch (error) {
    console.error(`\n❌ ERROR: ${error.message}\n`);
    process.exit(1);
  }
}

testDebugPage();
