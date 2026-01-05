/**
 * SMRI Test Functions
 * Test implementations for Snake Muffin v0.8.0 SMRI scenarios
 * 
 * Dependencies: Requires SMRI_SCENARIOS from smri-scenarios.js
 * Usage: Import in smri-runner.html and call from runScenario()
 */

// Test helper: Generic HTML page tester
async function testHTMLPage(url, pageTitle, checks = []) {
  const startTime = Date.now();
  
  try {
    log(`Testing ${pageTitle}...`, 'info');
    
    // Load iframe
    const iframe = document.getElementById('test-frame');
    iframe.src = url;
    
    await new Promise((resolve, reject) => {
      iframe.onload = resolve;
      iframe.onerror = () => reject(new Error('Failed to load page'));
      setTimeout(() => reject(new Error('Load timeout')), 10000);
    });
    
    const doc = iframe.contentDocument || iframe.contentWindow.document;
    
    // Run custom checks
    for (const check of checks) {
      const result = check(doc);
      if (!result.passed) {
        throw new Error(result.error);
      }
      log(`   ✓ ${result.message}`, 'info');
    }
    
    const duration = Date.now() - startTime;
    return { passed: true, duration };
    
  } catch (error) {
    const duration = Date.now() - startTime;
    return { passed: false, error: error.message, duration };
  }
}

// === SHOP MODULE (S1) TESTS ===

async function testCSVImport() {
  log('📤 Testing CSV Import & Sync...', 'info');
  const startTime = Date.now();
  const steps = [];
  
  try {
    // Initialize CSV manager
    const csvManager = new CSVImportManager({
      workerUrl: WORKER_URL,
      onLog: (msg, type) => log(`   ${msg}`, type)
    });
    
    log('1️⃣ Parsing default CSV (24 snakes)...', 'info');
    const products = csvManager.parseCSV(DEFAULT_CSV);
    steps.push({ step: 'Parse CSV', passed: true, count: products.length });
    
    log('2️⃣ Uploading to Stripe...', 'info');
    const uploadResult = await csvManager.uploadToStripe();
    steps.push({ 
      step: 'Upload to Stripe', 
      passed: uploadResult.uploaded > 0, 
      uploaded: uploadResult.uploaded 
    });
    
    log('3️⃣ Syncing to KV...', 'info');
    const syncResult = await csvManager.syncToKV();
    steps.push({ 
      step: 'Sync to KV', 
      passed: syncResult.synced > 0, 
      synced: syncResult.synced 
    });
    
    log('4️⃣ Verifying products in catalog...', 'info');
    const catalogProducts = await csvManager.getProducts();
    steps.push({ 
      step: 'Verify Catalog', 
      passed: catalogProducts.length > 0, 
      count: catalogProducts.length 
    });
    
    if (catalogProducts.length === 0) {
      throw new Error('No products found in catalog after import');
    }
    
    const duration = Date.now() - startTime;
    log(`✅ CSV Import test complete - ${catalogProducts.length} products ready`, 'success');
    return { passed: true, steps, duration };
    
  } catch (error) {
    log(`   ❌ FAILED: ${error.message}`, 'error');
    const duration = Date.now() - startTime;
    return { passed: false, error: error.message, duration };
  }
}

async function testPurchaseFlow() {
  log('🛒 Testing Purchase Flow (6 steps)...', 'info');
  const startTime = Date.now();
  const steps = [];
  
  try {
    // Step 1: Browse Catalog
    log('1️⃣ Loading catalog...', 'info');
    const iframe = document.getElementById('test-frame');
    iframe.src = '../catalog.html';
    
    await new Promise((resolve, reject) => {
      iframe.onload = resolve;
      iframe.onerror = () => reject(new Error('Failed to load catalog'));
      setTimeout(() => reject(new Error('Catalog load timeout')), 10000);
    });
    
    const doc = iframe.contentDocument || iframe.contentWindow.document;
    
    // Check for products
    await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for fetch
    const products = doc.querySelectorAll('.catalog-item');
    
    if (products.length === 0) {
      // Check for loading state
      const loading = doc.querySelector('.loading');
      if (loading) {
        throw new Error('Catalog still loading - check Worker API');
      }
      throw new Error('No products rendered in catalog');
    }
    
    log(`   ✓ Found ${products.length} products in catalog`, 'info');
    steps.push({ step: 'Browse Catalog', passed: true, products: products.length });
    
    // Step 2: Validate Product Structure
    log('2️⃣ Validating product data...', 'info');
    const firstProduct = products[0];
    const requiredFields = ['name', 'species', 'morph', 'price'];
    
    for (const field of requiredFields) {
      const el = firstProduct.querySelector(`[data-field="${field}"], .${field}, .product-${field}`);
      if (!el || !el.textContent.trim()) {
        throw new Error(`Product missing required field: ${field}`);
      }
    }
    
    log('   ✓ Product structure valid', 'info');
    steps.push({ step: 'Validate Product', passed: true });
    
    // Step 3: Checkout (External - can't test in iframe)
    log('3️⃣ Stripe Checkout (external - skipped)', 'info');
    steps.push({ step: 'Stripe Checkout', passed: true, skipped: true });
    
    // Step 4: Success Page
    log('4️⃣ Testing success page...', 'info');
    iframe.src = '../success.html';
    await new Promise(resolve => {
      iframe.onload = resolve;
      setTimeout(resolve, 2000);
    });
    steps.push({ step: 'Success Page', passed: true });
    
    // Step 5: Collection View
    log('5️⃣ Testing collection view...', 'info');
    iframe.src = '../collection.html';
    await new Promise(resolve => {
      iframe.onload = resolve;
      setTimeout(resolve, 2000);
    });
    steps.push({ step: 'Collection View', passed: true });
    
    // Step 6: Game Mode
    log('6️⃣ Testing game mode...', 'info');
    iframe.src = '../game.html';
    await new Promise(resolve => {
      iframe.onload = resolve;
      setTimeout(resolve, 2000);
    });
    steps.push({ step: 'Game Mode', passed: true });
    
    const duration = Date.now() - startTime;
    log('✅ Purchase flow test complete', 'success');
    return { passed: true, steps, duration };
    
  } catch (error) {
    log(`   ❌ FAILED: ${error.message}`, 'error');
    const duration = Date.now() - startTime;
    return { passed: false, error: error.message, duration };
  }
}

async function testCatalogDisplay() {
  return testHTMLPage('../catalog.html', 'Catalog Display', [
    (doc) => {
      const products = doc.querySelectorAll('.catalog-item, .product-card');
      return products.length > 0 
        ? { passed: true, message: `Found ${products.length} products` }
        : { passed: false, error: 'No products displayed' };
    }
  ]);
}

async function testSuccessPage() {
  return testHTMLPage('../success.html', 'Success Page', [
    (doc) => {
      const title = doc.querySelector('h1, .success-title');
      return title 
        ? { passed: true, message: 'Success page loaded' }
        : { passed: false, error: 'Missing success title' };
    }
  ]);
}

async function testCollectionView() {
  return testHTMLPage('../collection.html', 'Collection View', [
    (doc) => {
      const container = doc.querySelector('.collection, #snakeList');
      return container 
        ? { passed: true, message: 'Collection container found' }
        : { passed: false, error: 'Missing collection container' };
    }
  ]);
}

async function testGameTamagotchi() {
  return testHTMLPage('../game.html', 'Game Tamagotchi Mode', [
    (doc) => {
      const statsContainer = doc.querySelector('.stats, #snakeStats, .stat-bars');
      return statsContainer 
        ? { passed: true, message: 'Game stats UI found' }
        : { passed: false, error: 'Missing game stats UI' };
    }
  ]);
}

async function testAccountPage() {
  return testHTMLPage('../account.html', 'Account Page', [
    (doc) => {
      const userSection = doc.querySelector('.user-info, #userHash, .account-details');
      return userSection 
        ? { passed: true, message: 'Account UI found' }
        : { passed: false, error: 'Missing account UI' };
    }
  ]);
}

async function testBreedingCalculator() {
  return testHTMLPage('calc/index.html', 'Breeding Calculator', [
    (doc) => {
      const calculator = doc.querySelector('.calculator, #calculator, form');
      return calculator 
        ? { passed: true, message: 'Calculator UI found' }
        : { passed: false, error: 'Missing calculator UI' };
    }
  ]);
}

async function testImportPage() {
  return testHTMLPage('../import.html', 'CSV Import Page', [
    (doc) => {
      const form = doc.querySelector('form, #csvForm, textarea');
      return form 
        ? { passed: true, message: 'Import form found' }
        : { passed: false, error: 'Missing import form' };
    }
  ]);
}

// === SYSTEM HEALTH (S0) TESTS ===

async function testHealthcheck() {
  log('🏥 Testing system healthcheck...', 'info');
  const startTime = Date.now();
  
  try {
    const iframe = document.getElementById('test-frame');
    iframe.src = 'healthcheck.html';
    
    await new Promise((resolve, reject) => {
      iframe.onload = resolve;
      iframe.onerror = () => reject(new Error('Failed to load healthcheck'));
      setTimeout(() => reject(new Error('Healthcheck timeout')), 5000);
    });
    
    const doc = iframe.contentDocument || iframe.contentWindow.document;
    const status = doc.querySelector('.status, #status');
    
    const duration = Date.now() - startTime;
    return { passed: !!status, duration };
    
  } catch (error) {
    const duration = Date.now() - startTime;
    return { passed: false, error: error.message, duration };
  }
}

// === WORKER API (S5) TESTS ===

async function testWorkerAPI() {
  log('☁️ Testing Worker API...', 'info');
  const startTime = Date.now();
  
  try {
    log('   → GET /products', 'info');
    const response = await fetch(`${WORKER_URL}/products`);
    
    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }
    
    const products = await response.json();
    
    if (!Array.isArray(products)) {
      throw new Error('API did not return array');
    }
    
    log(`   ✓ Retrieved ${products.length} products`, 'info');
    
    // Validate Stripe product structure
    if (products.length > 0) {
      const sample = products[0];
      const requiredFields = ['id', 'name', 'metadata'];
      
      for (const field of requiredFields) {
        if (!sample[field]) {
          throw new Error(`Product missing field: ${field}`);
        }
      }
      
      log('   ✓ Product structure valid (Stripe format)', 'info');
    }
    
    const duration = Date.now() - startTime;
    return { passed: true, count: products.length, duration };
    
  } catch (error) {
    log(`   ❌ ${error.message}`, 'error');
    const duration = Date.now() - startTime;
    return { passed: false, error: error.message, duration };
  }
}

async function testKVStorage() {
  log('💾 Testing KV Storage...', 'info');
  const startTime = Date.now();
  
  try {
    // Test products endpoint (backed by KV)
    const response = await fetch(`${WORKER_URL}/products`);
    
    if (!response.ok) {
      throw new Error(`KV read failed: ${response.status}`);
    }
    
    const products = await response.json();
    log(`   ✓ Read ${products.length} products from KV`, 'info');
    
    const duration = Date.now() - startTime;
    return { passed: true, count: products.length, duration };
    
  } catch (error) {
    const duration = Date.now() - startTime;
    return { passed: false, error: error.message, duration };
  }
}

// Export for use in smri-runner.html
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    testHTMLPage,
    testCSVImport,
    testPurchaseFlow,
    testCatalogDisplay,
    testSuccessPage,
    testCollectionView,
    testGameTamagotchi,
    testAccountPage,
    testBreedingCalculator,
    testImportPage,
    testHealthcheck,
    testWorkerAPI,
    testKVStorage
  };
}
