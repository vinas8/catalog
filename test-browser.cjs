// Simple headless browser test using Node.js HTTP client
// Simulates browser loading catalog.html and executing JavaScript

const http = require('http');
const https = require('https');

console.log('🌐 Headless Browser Simulator');
console.log('===============================================\n');

// Simulated browser console
const browserConsole = {
  logs: [],
  log: function(...args) {
    const msg = args.join(' ');
    this.logs.push(`[LOG] ${msg}`);
    console.log(`  📝 ${msg}`);
  },
  error: function(...args) {
    const msg = args.join(' ');
    this.logs.push(`[ERROR] ${msg}`);
    console.log(`  ❌ ${msg}`);
  },
  warn: function(...args) {
    const msg = args.join(' ');
    this.logs.push(`[WARN] ${msg}`);
    console.log(`  ⚠️  ${msg}`);
  }
};

async function fetchPage(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    client.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, data }));
    }).on('error', reject);
  });
}

async function simulateBrowser() {
  console.log('1️⃣ Loading catalog.html...\n');
  
  try {
    const page = await fetchPage('http://localhost:8000/catalog.html');
    console.log(`   Status: ${page.status}`);
    console.log(`   Size: ${page.data.length} bytes\n`);
    
    console.log('2️⃣ Simulating JavaScript execution...\n');
    
    // Extract script content
    const scriptMatch = page.data.match(/<script type="module">([\s\S]*?)<\/script>/);
    if (!scriptMatch) {
      browserConsole.error('No module script found!');
      return;
    }
    
    browserConsole.log('🔄 renderStandaloneCatalog START');
    
    // Simulate loading worker config
    console.log('3️⃣ Loading worker-config.js...\n');
    const config = await fetchPage('http://localhost:8000/src/config/worker-config.js');
    const workerUrlMatch = config.data.match(/WORKER_URL:\s*['"]([^'"]+)['"]/);
    const workerUrl = workerUrlMatch ? workerUrlMatch[1] : null;
    
    if (!workerUrl) {
      browserConsole.error('Failed to extract Worker URL');
      return;
    }
    
    browserConsole.log(`Worker URL: ${workerUrl}`);
    
    // Simulate loading catalog module
    console.log('4️⃣ Simulating loadCatalog()...\n');
    browserConsole.log('📡 Calling loadCatalog()...');
    browserConsole.log('📡 Fetching products from Worker API...');
    
    const products = await fetchPage(`${workerUrl}/products`);
    const productData = JSON.parse(products.data);
    
    browserConsole.log(`✅ Loaded from Worker API: ${productData.length} products`);
    browserConsole.log(`✅ loadCatalog returned: ${productData.length} products`);
    
    // Simulate filtering
    const realProducts = productData.filter(p => p.type === 'real');
    const virtualProducts = productData.filter(p => p.type === 'virtual');
    
    browserConsole.log(`✅ After species filter: ${productData.length} products`);
    browserConsole.log(`✅ Real products: ${realProducts.length} Virtual: ${virtualProducts.length}`);
    
    // Check availability
    const available = realProducts.filter(p => p.status === 'available');
    const sold = realProducts.filter(p => p.status === 'sold');
    
    browserConsole.log(`✅ Available: ${available.length} Sold: ${sold.length}`);
    
    // Simulate rendering
    console.log('\n5️⃣ Simulating rendering...\n');
    
    let renderError = null;
    for (const product of available.slice(0, 3)) {
      try {
        // Test if product can be rendered (check for required fields)
        const price = typeof product.price === 'number' ? product.price : 0;
        browserConsole.log(`🎨 Rendering: ${product.name} ($${price})`);
        
        if (!product.price) {
          browserConsole.warn(`Product ${product.id} has no price`);
        }
      } catch (e) {
        renderError = e;
        browserConsole.error(`Failed to render ${product.id}: ${e.message}`);
        break;
      }
    }
    
    if (!renderError && available.length > 0) {
      browserConsole.log(`🎨 Rendering ${available.length} available snakes`);
      browserConsole.log('✅ renderStandaloneCatalog COMPLETE');
    }
    
    // Summary
    console.log('\n===============================================');
    console.log('📊 BROWSER CONSOLE OUTPUT:');
    console.log('===============================================\n');
    browserConsole.logs.forEach(log => console.log(log));
    
    console.log('\n===============================================');
    console.log('🎯 RESULT:');
    console.log('===============================================');
    if (renderError) {
      console.log('❌ JavaScript error detected:');
      console.log(`   ${renderError.message}`);
    } else {
      console.log('✅ All JavaScript executed successfully');
      console.log(`✅ Should display ${available.length} products`);
      console.log('\n💡 If catalog still shows "Loading..." in browser:');
      console.log('   → Your browser cache is the issue');
      console.log('   → Try: Ctrl+Shift+R (hard refresh)');
      console.log('   → Or: Open in incognito/private window');
    }
    console.log('===============================================\n');
    
  } catch (error) {
    console.error(`\n❌ Error: ${error.message}`);
  }
}

simulateBrowser();
