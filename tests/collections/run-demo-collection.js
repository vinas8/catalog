/**
 * Demo Collection Runner (S6.x)
 * Executes all 9 demo system scenarios sequentially
 * 
 * Usage: npm run test:collection:demo
 */

import { chromium } from 'playwright';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DEMO_COLLECTION = [
  {
    id: 'S6.1,4,5.01',
    name: 'Demo Pipeline: Website Owner Setup',
    url: 'http://localhost:8000/debug/demo-orchestrator.html?pipeline=owner-setup',
    timeout: 90000,
    status: 'not-implemented'
  },
  {
    id: 'S6.1,2,3,4,5.02',
    name: 'Demo Pipeline: Customer Purchase',
    url: 'http://localhost:8000/debug/demo-orchestrator.html?pipeline=customer-purchase',
    timeout: 120000,
    status: 'not-implemented'
  },
  {
    id: 'S6.2,5.03',
    name: 'Demo Pipeline: Farm Gameplay',
    url: 'http://localhost:8000/debug/demo-orchestrator.html?pipeline=farm-gameplay',
    timeout: 90000,
    status: 'not-implemented'
  },
  {
    id: 'S6.5.04',
    name: 'Demo Pipeline: Data Management',
    url: 'http://localhost:8000/debug/demo-orchestrator.html?pipeline=data-management',
    timeout: 60000,
    status: 'not-implemented'
  },
  {
    id: 'S6.1,2,3,4,5.05',
    name: 'Demo Orchestrator: Step Execution',
    url: 'http://localhost:8000/debug/demo-orchestrator.html?test=step-execution',
    timeout: 60000,
    status: 'not-implemented'
  },
  {
    id: 'S6.6.06',
    name: 'Demo UI: Progress Tracking',
    url: 'http://localhost:8000/debug/demo-orchestrator.html?test=progress-ui',
    timeout: 30000,
    status: 'not-implemented'
  },
  {
    id: 'S6.6.07',
    name: 'Demo UI: Auto-advance Control',
    url: 'http://localhost:8000/debug/demo-orchestrator.html?test=auto-advance',
    timeout: 30000,
    status: 'not-implemented'
  },
  {
    id: 'S6.6.08',
    name: 'Demo UI: Checkpoint Save/Restore',
    url: 'http://localhost:8000/debug/demo-orchestrator.html?test=checkpoint',
    timeout: 30000,
    status: 'not-implemented'
  },
  {
    id: 'S6.1,2,3.09',
    name: 'Fluent Customer Journey Design',
    url: 'http://localhost:8000/index.html?demo=fluent-journey',
    timeout: 60000,
    status: 'design-only'
  }
];

async function runDemoCollection() {
  console.log('🎬 Starting Demo Collection Runner (S6.x)\n');
  console.log(`📊 Total scenarios: ${DEMO_COLLECTION.length}`);
  
  const notImplemented = DEMO_COLLECTION.filter(s => s.status === 'not-implemented').length;
  const designOnly = DEMO_COLLECTION.filter(s => s.status === 'design-only').length;
  
  console.log(`⚠️  Not implemented: ${notImplemented}`);
  console.log(`📝 Design only: ${designOnly}`);
  console.log(`⏱️  Estimated time: ${Math.ceil(DEMO_COLLECTION.length * 1.5)} minutes\n`);

  let browser;
  try {
    browser = await chromium.launch({ headless: false, slowMo: 100 });
  } catch (error) {
    console.log('⚠️  Playwright not installed. Installing now...');
    console.log('   Run: npm install -D playwright && npx playwright install chromium\n');
    console.log('💡 Alternative: Open URLs manually in browser:\n');
    DEMO_COLLECTION.forEach(scenario => {
      console.log(`   ${scenario.id}: ${scenario.url} [${scenario.status}]`);
    });
    process.exit(1);
  }

  const context = await browser.newContext();
  const page = await context.newPage();

  const results = {
    passed: [],
    failed: [],
    skipped: []
  };

  for (const scenario of DEMO_COLLECTION) {
    console.log(`\n🧪 Testing: ${scenario.id} - ${scenario.name}`);
    console.log(`   URL: ${scenario.url}`);
    console.log(`   Status: ${scenario.status}`);

    // Skip not-implemented scenarios for now
    if (scenario.status === 'not-implemented') {
      console.log(`   ⏭️  SKIPPED (not implemented yet)`);
      results.skipped.push(scenario);
      continue;
    }

    try {
      // Navigate to scenario
      await page.goto(scenario.url, { waitUntil: 'networkidle', timeout: scenario.timeout });

      // Wait for page to be interactive
      await page.waitForSelector('body', { timeout: 5000 });

      // Check for critical errors
      const errors = await page.evaluate(() => {
        const errorElements = document.querySelectorAll('.error, .alert-danger');
        return Array.from(errorElements).map(el => el.textContent);
      });

      if (errors.length > 0) {
        throw new Error(`Page errors detected: ${errors.join(', ')}`);
      }

      // Check if scenario loaded successfully
      const title = await page.title();
      console.log(`   ✅ Title: ${title}`);

      // Take screenshot
      const screenshotName = scenario.id.replace(/[.,]/g, '-');
      await page.screenshot({ 
        path: `tests/collections/screenshots/${screenshotName}.png`,
        fullPage: true 
      });

      console.log(`   ✅ Screenshot saved`);

      // Wait to observe
      await page.waitForTimeout(2000);

      results.passed.push(scenario);
      console.log(`   ✅ PASSED`);

    } catch (error) {
      console.error(`   ❌ FAILED: ${error.message}`);
      results.failed.push({ ...scenario, error: error.message });

      // Take failure screenshot
      const screenshotName = scenario.id.replace(/[.,]/g, '-');
      await page.screenshot({ 
        path: `tests/collections/screenshots/${screenshotName}-FAILED.png` 
      }).catch(() => {});
    }
  }

  await browser.close();

  // Print summary
  console.log('\n\n' + '='.repeat(60));
  console.log('📊 DEMO COLLECTION RESULTS');
  console.log('='.repeat(60));
  console.log(`✅ Passed: ${results.passed.length}/${DEMO_COLLECTION.length}`);
  console.log(`❌ Failed: ${results.failed.length}/${DEMO_COLLECTION.length}`);
  console.log(`⏭️  Skipped: ${results.skipped.length}/${DEMO_COLLECTION.length}`);

  if (results.failed.length > 0) {
    console.log('\n❌ FAILED SCENARIOS:');
    results.failed.forEach(scenario => {
      console.log(`   - ${scenario.id}: ${scenario.error}`);
    });
  }

  if (results.skipped.length > 0) {
    console.log('\n⏭️  SKIPPED SCENARIOS (not implemented):');
    results.skipped.forEach(scenario => {
      console.log(`   - ${scenario.id}: ${scenario.name}`);
    });
  }

  const implementedCount = DEMO_COLLECTION.length - results.skipped.length;
  const success = results.failed.length === 0 && implementedCount > 0;
  
  console.log('\n📈 IMPLEMENTATION STATUS:');
  console.log(`   Implemented: ${implementedCount}/${DEMO_COLLECTION.length} (${Math.round((implementedCount/DEMO_COLLECTION.length)*100)}%)`);
  console.log(`   Ready to test: ${results.skipped.length === DEMO_COLLECTION.length ? 'NO' : 'YES'}`);
  
  console.log('\n' + (success ? '✅ COLLECTION PASSED' : results.skipped.length === DEMO_COLLECTION.length ? '⚠️  COLLECTION NOT READY (all skipped)' : '❌ COLLECTION FAILED'));
  console.log('='.repeat(60) + '\n');

  // Exit with appropriate code
  // 0 = success, 1 = failure, 2 = not ready (all skipped)
  if (results.skipped.length === DEMO_COLLECTION.length) {
    process.exit(2); // Not ready
  } else if (success) {
    process.exit(0); // Success
  } else {
    process.exit(1); // Failure
  }
}

// Run if called directly
runDemoCollection().catch(error => {
  console.error('❌ Collection runner failed:', error);
  process.exit(1);
});

export { runDemoCollection, DEMO_COLLECTION };
