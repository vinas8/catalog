/**
 * Automated Browser Test for Demo Isolated Purchase Flow
 */
const { chromium } = require('playwright');

async function test() {
  console.log('🚀 Testing demo-isolated-test.html\n');
  
  const browser = await chromium.launch({ headless: false, slowMo: 500 });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log(`  [Browser] ${msg.text()}`));
  page.on('pageerror', err => console.error(`  ❌ ${err.message}`));
  
  try {
    console.log('📄 Loading demo...');
    await page.goto('http://localhost:8000/demo-isolated-test.html');
    await page.waitForTimeout(2000);
    
    console.log('🎬 Clicking scenario...');
    await page.click('.scenario-card');
    
    console.log('⏳ Waiting for setup...');
    await page.waitForTimeout(5000);
    
    const data = await page.evaluate(() => {
      return {
        storage: localStorage.getItem('demo_first_purchase_products'),
        logs: document.querySelectorAll('.demo-log').length
      };
    });
    
    console.log('📊 Results:');
    console.log('  Logs:', data.logs);
    console.log('  Storage:', data.storage ? 'EXISTS' : 'MISSING');
    
    if (data.storage) {
      const products = JSON.parse(data.storage);
      console.log(`  ✅ ${products.length} products loaded`);
      products.forEach(p => console.log(`    - ${p.name}: €${p.price}`));
    } else {
      console.log('  ❌ No demo data!');
    }
    
    await page.waitForTimeout(10000);
    
  } catch (err) {
    console.error('❌ Error:', err.message);
    await page.screenshot({ path: 'error.png' });
  } finally {
    await browser.close();
  }
}

test();
