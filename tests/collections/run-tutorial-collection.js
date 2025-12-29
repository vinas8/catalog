/**
 * Tutorial Collection Runner (S2-7.x)
 * Executes all 6 tutorial scenarios sequentially
 * 
 * Usage: npm run test:collection:tutorial
 */

import { chromium } from 'playwright';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const TUTORIAL_COLLECTION = [
  {
    id: 'S2-7.x.01',
    name: 'Happy Path',
    url: 'http://localhost:8000/debug/tutorial-happy-path.html',
    timeout: 60000
  },
  {
    id: 'S2-7.x.02',
    name: 'Missed Care',
    url: 'http://localhost:8000/debug/tutorial-missed-care.html',
    timeout: 60000
  },
  {
    id: 'S2-7.x.03',
    name: 'Education-First Commerce',
    url: 'http://localhost:8000/debug/tutorial-education-commerce.html',
    timeout: 60000
  },
  {
    id: 'S2-7.x.04',
    name: 'Trust Protection',
    url: 'http://localhost:8000/debug/tutorial-trust-protection.html',
    timeout: 60000
  },
  {
    id: 'S2-7.x.05',
    name: 'Email Re-entry',
    url: 'http://localhost:8000/debug/tutorial-email-reentry.html',
    timeout: 60000
  },
  {
    id: 'S2-7.x.06',
    name: 'Failure Case',
    url: 'http://localhost:8000/debug/tutorial-failure-educational.html',
    timeout: 60000
  }
];

async function runTutorialCollection() {
  console.log('🐍 Starting Tutorial Collection Runner (S2-7.x)\n');
  console.log(`📊 Total scenarios: ${TUTORIAL_COLLECTION.length}`);
  console.log(`⏱️  Estimated time: ${TUTORIAL_COLLECTION.length} minutes\n`);

  let browser;
  try {
    browser = await chromium.launch({ headless: false, slowMo: 100 });
  } catch (error) {
    console.log('⚠️  Playwright not installed. Installing now...');
    console.log('   Run: npm install -D playwright && npx playwright install chromium\n');
    console.log('💡 Alternative: Open URLs manually in browser:\n');
    TUTORIAL_COLLECTION.forEach(scenario => {
      console.log(`   ${scenario.id}: ${scenario.url}`);
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

  for (const scenario of TUTORIAL_COLLECTION) {
    console.log(`\n🧪 Testing: ${scenario.id} - ${scenario.name}`);
    console.log(`   URL: ${scenario.url}`);

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
      await page.screenshot({ 
        path: `tests/collections/screenshots/${scenario.id.replace(/\./g, '-')}.png`,
        fullPage: true 
      });

      console.log(`   ✅ Screenshot saved`);

      // Wait a bit to observe (optional)
      await page.waitForTimeout(2000);

      results.passed.push(scenario);
      console.log(`   ✅ PASSED`);

    } catch (error) {
      console.error(`   ❌ FAILED: ${error.message}`);
      results.failed.push({ ...scenario, error: error.message });

      // Take failure screenshot
      await page.screenshot({ 
        path: `tests/collections/screenshots/${scenario.id.replace(/\./g, '-')}-FAILED.png` 
      }).catch(() => {});
    }
  }

  await browser.close();

  // Print summary
  console.log('\n\n' + '='.repeat(60));
  console.log('📊 COLLECTION RESULTS');
  console.log('='.repeat(60));
  console.log(`✅ Passed: ${results.passed.length}/${TUTORIAL_COLLECTION.length}`);
  console.log(`❌ Failed: ${results.failed.length}/${TUTORIAL_COLLECTION.length}`);
  console.log(`⏭️  Skipped: ${results.skipped.length}/${TUTORIAL_COLLECTION.length}`);

  if (results.failed.length > 0) {
    console.log('\n❌ FAILED SCENARIOS:');
    results.failed.forEach(scenario => {
      console.log(`   - ${scenario.id}: ${scenario.error}`);
    });
  }

  const success = results.failed.length === 0;
  console.log('\n' + (success ? '✅ COLLECTION PASSED' : '❌ COLLECTION FAILED'));
  console.log('='.repeat(60) + '\n');

  process.exit(success ? 0 : 1);
}

// Run if called directly
runTutorialCollection().catch(error => {
  console.error('❌ Collection runner failed:', error);
  process.exit(1);
});

export { runTutorialCollection, TUTORIAL_COLLECTION };
