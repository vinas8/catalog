/**
 * SMRI Browser Test Runner with Playwright
 * 
 * Executes SMRI scenarios in real browser with:
 * - HTML rendering validation
 * - Interactive flow testing
 * - Screenshot capture
 * - Console log analysis
 * 
 * Usage:
 *   node tests/smri/smri-browser-runner.js
 *   node tests/smri/smri-browser-runner.js --scenario purchase-flow
 *   node tests/smri/smri-browser-runner.js --headless false --debug
 */

import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const WORKER_URL = 'https://catalog.navickaszilvinas.workers.dev';
const BASE_URL = 'http://localhost:8000';

class SMRIBrowserRunner {
  constructor(options = {}) {
    this.options = {
      headless: options.headless !== false,
      debug: options.debug || false,
      screenshots: options.screenshots !== false,
      scenario: options.scenario || null
    };
    
    this.results = {
      passed: 0,
      failed: 0,
      total: 0,
      scenarios: []
    };
    
    this.browser = null;
    this.page = null;
  }

  async init() {
    console.log('🚀 Starting Playwright browser...\n');
    this.browser = await chromium.launch({ 
      headless: this.options.headless,
      slowMo: this.options.debug ? 100 : 0
    });
    this.page = await this.browser.newPage();
    
    // Capture console logs
    this.page.on('console', msg => {
      if (this.options.debug) {
        const type = msg.type();
        const text = msg.text();
        const prefix = type === 'error' ? '❌' : type === 'warning' ? '⚠️' : '📝';
        console.log(`   ${prefix} [${type}] ${text}`);
      }
    });
  }

  async cleanup() {
    if (this.browser) {
      await this.browser.close();
    }
  }

  async testPurchaseFlow() {
    console.log('🛒 Testing Purchase Flow...\n');
    const steps = [];
    
    try {
      // Step 1: Load catalog
      console.log('1️⃣ Loading catalog.html...');
      await this.page.goto(`${BASE_URL}/catalog.html`);
      await this.page.waitForLoadState('networkidle');
      steps.push({ step: 'Load catalog', passed: true });
      
      // Step 2: Check products loaded
      console.log('2️⃣ Checking products loaded...');
      const productCount = await this.page.locator('.product-card').count();
      if (productCount === 0) {
        throw new Error('No products found on page');
      }
      console.log(`   ✅ Found ${productCount} products`);
      steps.push({ step: 'Products loaded', passed: true, data: { count: productCount } });
      
      // Step 3: Check first product structure
      console.log('3️⃣ Validating product structure...');
      const firstProduct = this.page.locator('.product-card').first();
      const hasImage = await firstProduct.locator('img').count() > 0;
      const hasTitle = await firstProduct.locator('h3, .product-title').count() > 0;
      const hasPrice = await firstProduct.locator('.price, [class*="price"]').count() > 0;
      const hasBuyButton = await firstProduct.locator('button, .buy-btn').count() > 0;
      
      if (!hasImage || !hasTitle || !hasPrice || !hasBuyButton) {
        throw new Error(`Product structure invalid: img=${hasImage}, title=${hasTitle}, price=${hasPrice}, button=${hasBuyButton}`);
      }
      console.log('   ✅ Product structure valid');
      steps.push({ step: 'Product structure', passed: true });
      
      // Step 4: Screenshot
      if (this.options.screenshots) {
        const screenshotPath = path.join(__dirname, '../smri/screenshots/catalog-loaded.png');
        await this.page.screenshot({ path: screenshotPath });
        console.log(`   📸 Screenshot saved: ${screenshotPath}`);
      }
      
      return { passed: true, steps };
      
    } catch (error) {
      console.log(`   ❌ FAILED: ${error.message}`);
      steps.push({ step: 'Error', passed: false, error: error.message });
      return { passed: false, steps, error: error.message };
    }
  }

  async testHealthcheck() {
    console.log('🏥 Testing Healthcheck Page...\n');
    const steps = [];
    
    try {
      // Load healthcheck
      console.log('1️⃣ Loading healthcheck.html...');
      await this.page.goto(`${BASE_URL}/debug/healthcheck.html`);
      await this.page.waitForLoadState('networkidle');
      steps.push({ step: 'Load healthcheck', passed: true });
      
      // Check title
      const title = await this.page.title();
      if (!title.includes('Health Check')) {
        throw new Error(`Invalid title: ${title}`);
      }
      console.log(`   ✅ Title: ${title}`);
      steps.push({ step: 'Title check', passed: true });
      
      // Check service groups exist
      const serviceGroups = await this.page.locator('.service-group').count();
      if (serviceGroups === 0) {
        throw new Error('No service groups found');
      }
      console.log(`   ✅ Found ${serviceGroups} service groups`);
      steps.push({ step: 'Service groups', passed: true, data: { count: serviceGroups } });
      
      // Screenshot
      if (this.options.screenshots) {
        const screenshotPath = path.join(__dirname, '../smri/screenshots/healthcheck.png');
        await this.page.screenshot({ path: screenshotPath, fullPage: true });
        console.log(`   📸 Screenshot saved: ${screenshotPath}`);
      }
      
      return { passed: true, steps };
      
    } catch (error) {
      console.log(`   ❌ FAILED: ${error.message}`);
      steps.push({ step: 'Error', passed: false, error: error.message });
      return { passed: false, steps, error: error.message };
    }
  }

  async testWorkerAPI() {
    console.log('🔌 Testing Worker API...\n');
    const steps = [];
    
    try {
      // Test /products endpoint
      console.log('1️⃣ Testing /products endpoint...');
      const response = await this.page.goto(`${WORKER_URL}/products`);
      const status = response.status();
      
      if (status !== 200) {
        throw new Error(`API returned ${status}`);
      }
      
      const json = await response.json();
      if (!Array.isArray(json)) {
        throw new Error('API did not return array');
      }
      
      console.log(`   ✅ API returned ${json.length} products`);
      steps.push({ step: 'API request', passed: true, data: { count: json.length } });
      
      // Check product structure
      if (json.length > 0) {
        const product = json[0];
        const hasRequired = product.id && product.name && product.price;
        if (!hasRequired) {
          throw new Error('Product missing required fields');
        }
        console.log(`   ✅ Product structure valid`);
        steps.push({ step: 'Product validation', passed: true });
      }
      
      return { passed: true, steps };
      
    } catch (error) {
      console.log(`   ❌ FAILED: ${error.message}`);
      steps.push({ step: 'Error', passed: false, error: error.message });
      return { passed: false, steps, error: error.message };
    }
  }

  async runScenario(name, testFn) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`🧪 SCENARIO: ${name}`);
    console.log('='.repeat(60));
    
    const startTime = Date.now();
    const result = await testFn.call(this);
    const duration = Date.now() - startTime;
    
    result.name = name;
    result.duration = duration;
    
    this.results.total++;
    if (result.passed) {
      this.results.passed++;
      console.log(`\n✅ PASSED in ${duration}ms`);
    } else {
      this.results.failed++;
      console.log(`\n❌ FAILED in ${duration}ms`);
    }
    
    this.results.scenarios.push(result);
  }

  async runAll() {
    console.log('🐍 SMRI Browser Test Runner with Playwright\n');
    console.log(`Configuration:`);
    console.log(`  • Headless: ${this.options.headless}`);
    console.log(`  • Debug: ${this.options.debug}`);
    console.log(`  • Screenshots: ${this.options.screenshots}`);
    console.log(`  • Base URL: ${BASE_URL}\n`);
    
    await this.init();
    
    try {
      // Run scenarios
      if (!this.options.scenario || this.options.scenario === 'purchase-flow') {
        await this.runScenario('Purchase Flow', this.testPurchaseFlow);
      }
      
      if (!this.options.scenario || this.options.scenario === 'healthcheck') {
        await this.runScenario('Healthcheck Page', this.testHealthcheck);
      }
      
      if (!this.options.scenario || this.options.scenario === 'worker-api') {
        await this.runScenario('Worker API', this.testWorkerAPI);
      }
      
    } finally {
      await this.cleanup();
    }
    
    this.printSummary();
  }

  printSummary() {
    console.log('\n' + '='.repeat(60));
    console.log('📊 SUMMARY');
    console.log('='.repeat(60));
    console.log(`✅ Passed: ${this.results.passed}`);
    console.log(`❌ Failed: ${this.results.failed}`);
    console.log(`📊 Total:  ${this.results.total}`);
    console.log(`⏱️  Time:   ${this.results.scenarios.reduce((sum, s) => sum + s.duration, 0)}ms`);
    
    if (this.results.failed > 0) {
      console.log('\n❌ Failed scenarios:');
      this.results.scenarios
        .filter(s => !s.passed)
        .forEach(s => console.log(`   - ${s.name}: ${s.error}`));
    }
    
    console.log('='.repeat(60));
    
    process.exit(this.results.failed > 0 ? 1 : 0);
  }
}

// Parse CLI args
const args = process.argv.slice(2);
const options = {
  headless: !args.includes('--headless=false') && !args.includes('--no-headless'),
  debug: args.includes('--debug'),
  screenshots: !args.includes('--no-screenshots'),
  scenario: args.find(arg => arg.startsWith('--scenario='))?.split('=')[1]
};

// Run
const runner = new SMRIBrowserRunner(options);
runner.runAll().catch(console.error);
