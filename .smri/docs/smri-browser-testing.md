# 🧪 SMRI Browser Testing System

**Version:** 0.7.2  
**Last Updated:** 2026-01-05  
**Status:** ✅ Production Ready

---

## 📋 Overview

The SMRI Browser Testing System provides **integrated testing** for Snake Muffin with:

1. **HTML Test Runner** (`smri-runner.html`) - Interactive browser-based testing ⭐ **PRIMARY**
2. **CLI Test Runner** (`smri-browser-runner.js`) - Playwright-based automated tests (desktop only)

**Note:** The HTML runner is the **recommended approach** for Copilot CLI, especially on mobile/Termux environments where Playwright is unavailable.

---

## 🎯 Why This Approach?

### ❌ Problems with CLI Browser Testing

The old `test-browser.cjs` approach had limitations:

```javascript
// ❌ OLD: HTTP-only simulation (no real DOM/JS)
const page = await fetchPage('http://localhost:8000/catalog.html');
// Can only check HTTP status, not actual rendering
```

**Limitations:**
- ❌ Can't execute real JavaScript
- ❌ Can't test DOM manipulation
- ❌ Can't validate interactive flows (clicks, forms)
- ❌ No visual validation
- ✅ Only validates HTTP responses

### ✅ Better Approach: HTML-Based Testing (Recommended)

For Copilot CLI and Termux environments, the **HTML runner is superior**:

```html
<!-- ✅ NEW: Real browser testing via HTML page -->
<iframe id="testFrame" src="catalog.html"></iframe>
<script>
  // Execute tests in real browser context
  const iframe = document.getElementById('testFrame');
  const doc = iframe.contentDocument;
  const products = doc.querySelectorAll('.product-card');
  console.log(`✅ Found ${products.length} products`);
</script>
```

**Benefits:**
- ✅ Works on **any platform** (desktop, mobile, Termux)
- ✅ No dependencies (uses native browser)
- ✅ Real browser rendering validation
- ✅ Interactive debugging
- ✅ Live HTML preview in iframe
- ✅ Perfect for **Copilot CLI** workflows

### Playwright (Optional, Desktop Only)

Playwright is available for CI/CD on desktop platforms:

```javascript
// ✅ Playwright: Full automation (desktop only)
const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto('http://localhost:8000/catalog.html');
const productCount = await page.locator('.product-card').count();
```

**When to use:**
- ✅ CI/CD pipelines (GitHub Actions)
- ✅ Automated regression testing
- ✅ Screenshot capture for docs
- ❌ Not available on Android/Termux

---

## 🚀 Usage

### HTML Test Runner (⭐ RECOMMENDED)

**Best for:** Copilot CLI, Termux, manual testing, debugging

1. **Start local server:**
   ```bash
   npm start
   # or
   python3 -m http.server 8000
   ```

2. **Open in browser:**
   ```
   http://localhost:8000/debug/smri-runner.html
   ```

3. **Run tests:**
   - Click "▶️ Run All Tests"
   - Or click individual scenario cards
   - Or use Quick Actions buttons

**Features:**
- 🎨 Live HTML rendering in iframe
- 📊 Real-time statistics
- 📝 Console output logging
- 🖼️ Visual scenario cards
- ⏱️ Execution timing
- ✅ Works on **all platforms** (desktop, mobile, Termux)

---

### CLI Test Runner (Optional, Desktop Only)

**Best for:** CI/CD, GitHub Actions, automated testing

**⚠️ Note:** Requires desktop OS. Not available on Android/Termux.

```bash
# Run all SMRI tests with Playwright
npm run test:smri:browser

# Run specific scenario
node tests/smri/smri-browser-runner.js --scenario=purchase-flow

# Debug mode (visible browser)
node tests/smri/smri-browser-runner.js --headless=false --debug

# No screenshots
node tests/smri/smri-browser-runner.js --no-screenshots
```

---

## 📁 File Structure

```
tests/smri/
├── scenario-runner.test.js     # Basic SMRI runner (markdown-based)
├── smri-browser-runner.js      # NEW: Playwright CLI runner
└── screenshots/                # Auto-generated screenshots
    ├── catalog-loaded.png
    └── healthcheck.png

debug/
├── smri-runner.html           # NEW: Interactive HTML runner
├── healthcheck.html           # Original health check
└── purchase-flow-demo.html    # Original purchase flow demo
```

---

## 🧪 Test Scenarios

### 1. Purchase Flow (🛒)

**Tests:**
1. Load `catalog.html`
2. Check products rendered
3. Validate product structure (image, title, price, button)
4. Capture screenshot

**CLI:**
```bash
node tests/smri/smri-browser-runner.js --scenario=purchase-flow
```

**HTML:**
Click "🛒 Purchase Flow" button or card

---

### 2. Healthcheck Page (🏥)

**Tests:**
1. Load `healthcheck.html`
2. Check page title
3. Validate service groups exist
4. Capture full-page screenshot

**CLI:**
```bash
node tests/smri/smri-browser-runner.js --scenario=healthcheck
```

**HTML:**
Click "🏥 Healthcheck" button or card

---

### 3. Worker API (🔌)

**Tests:**
1. Fetch `/products` from Worker
2. Validate HTTP status (200)
3. Check response is array
4. Validate product structure

**CLI:**
```bash
node tests/smri/smri-browser-runner.js --scenario=worker-api
```

**HTML:**
Click "🔌 Worker API" button or card

---

## 🎨 HTML Runner Features

### Visual Scenario Cards

```
┌─────────────────────────────┐
│ 🛒 Purchase Flow            │
│ S2-purchase-flow            │
├─────────────────────────────┤
│ ⏳ Running...               │  ← Status updates live
└─────────────────────────────┘
```

**States:**
- ⏸️ **Not run** - Default state
- ⏳ **Running** - Test in progress (pulse animation)
- ✅ **Passed** - Test succeeded (green border)
- ❌ **Failed** - Test failed (red border + error)

### Live Statistics

```
┌─────────┬─────────┬─────────┬─────────┐
│ Passed  │ Failed  │ Total   │ Duration│
│   2     │   0     │   2     │  2456ms │
└─────────┴─────────┴─────────┴─────────┘
```

### Console Output

```
[12:34:56] 🛒 Testing Purchase Flow...
[12:34:57]    ✅ Catalog loaded
[12:34:58]    ✅ Found 12 products
[12:34:58] ✅ PASSED in 1234ms
```

### Live Render Preview

The iframe shows **actual browser rendering** during test execution:
- See catalog loading in real-time
- Watch products render
- Debug visual issues

---

## 🔄 Integration with Existing Tests

### Test Suite Hierarchy

```
npm test                        # 88 tests (unit + snapshot + SMRI)
├── npm run test:unit          # 15 unit tests
├── npm run test:snapshot      # 71 snapshot tests
└── npm run test:smri          # 2 SMRI scenario tests (markdown)

npm run test:smri:browser      # NEW: Playwright browser tests
```

### Comparison

| Feature | old test-browser.cjs | NEW smri-browser-runner.js |
|---------|---------------------|---------------------------|
| Real browser | ❌ HTTP only | ✅ Chromium |
| JS execution | ❌ Simulated | ✅ Real |
| DOM testing | ❌ No | ✅ Full access |
| Screenshots | ❌ No | ✅ Yes |
| Interactive | ❌ No | ✅ Yes |
| Speed | ⚡ Fast | 🐢 Slower (real browser) |

**When to use:**
- ✅ Use **Playwright runner** for full E2E validation
- ✅ Use **old HTTP test** for quick smoke tests
- ✅ Use **HTML runner** for manual testing + debugging

---

## 🛠️ Extending the System

### Add New Scenario (CLI)

```javascript
// In smri-browser-runner.js

async testMyNewFeature() {
  console.log('🎯 Testing My New Feature...\n');
  const steps = [];
  
  try {
    // Your test steps
    console.log('1️⃣ Loading page...');
    await this.page.goto(`${BASE_URL}/my-page.html`);
    steps.push({ step: 'Load page', passed: true });
    
    // Validate something
    const element = await this.page.locator('.my-element');
    if (!element) throw new Error('Element not found');
    steps.push({ step: 'Find element', passed: true });
    
    return { passed: true, steps };
  } catch (error) {
    return { passed: false, error: error.message, steps };
  }
}

// In runAll()
await this.runScenario('My New Feature', this.testMyNewFeature);
```

### Add New Scenario (HTML)

```javascript
// In smri-runner.html

// 1. Add to scenarios array
const scenarios = [
  // ... existing scenarios
  {
    id: 'my-feature',
    title: 'My New Feature',
    smri: 'S3-my-feature',
    url: 'my-page.html',
    icon: '🎯'
  }
];

// 2. Add test function
async function testMyFeature() {
  log('🎯 Testing My Feature...', 'info');
  const startTime = Date.now();
  
  try {
    renderFrame.src = 'my-page.html';
    await new Promise(resolve => {
      renderFrame.onload = resolve;
      setTimeout(resolve, 3000);
    });
    
    log('   ✅ Feature works!', 'success');
    const duration = Date.now() - startTime;
    return { passed: true, duration };
    
  } catch (error) {
    log(`   ❌ FAILED: ${error.message}`, 'error');
    const duration = Date.now() - startTime;
    return { passed: false, error: error.message, duration };
  }
}

// 3. Add to runScenario()
if (id === 'my-feature') {
  result = await testMyFeature();
}
```

---

## 📊 Best Practices

### 1. Use Both Runners

- **CLI Runner** - CI/CD, automated regression testing
- **HTML Runner** - Manual testing, debugging, demos

### 2. Screenshot Everything

Screenshots are invaluable for:
- Visual regression testing
- Bug reports
- Documentation

### 3. Meaningful Logs

```javascript
// ❌ Bad
log('Test passed');

// ✅ Good
log('   ✅ Found 12 products (expected >0)', 'success');
```

### 4. Error Messages

```javascript
// ❌ Bad
throw new Error('Failed');

// ✅ Good
throw new Error(`Product structure invalid: img=${hasImage}, title=${hasTitle}, price=${hasPrice}`);
```

---

## 🚦 Quick Start

### For Developers

```bash
# 1. Install dependencies (if not already)
npm install

# 2. Start server
npm start

# 3. Run CLI tests
npm run test:smri:browser

# 4. Open HTML runner
open http://localhost:8000/debug/smri-runner.html
```

### For QA/Testing

1. Open: `http://localhost:8000/debug/smri-runner.html`
2. Click "▶️ Run All Tests"
3. Watch tests execute with live rendering
4. Check results in console output

---

## 🐛 Troubleshooting

### "Cannot find module 'playwright'"

```bash
npm install
```

### "ERR_CONNECTION_REFUSED"

Start local server:
```bash
npm start
```

### Tests timing out

Increase timeouts in `smri-browser-runner.js`:
```javascript
await this.page.waitForLoadState('networkidle', { timeout: 10000 });
```

### Screenshots not saving

Check permissions:
```bash
chmod +w tests/smri/screenshots/
```

---

## 📚 Related Documentation

- **[.smri/INDEX.md](../.smri/INDEX.md)** - SMRI system rules
- **[healthcheck.html](../../debug/healthcheck.html)** - Original health check
- **[Playwright Docs](https://playwright.dev)** - Official Playwright documentation

---

**Built with ❤️ and 🐍**  
**SMRI Browser Testing System v1.0**  
**Last Updated:** 2026-01-05
