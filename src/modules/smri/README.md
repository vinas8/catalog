# SMRI Module

**Version:** 0.7.7  
**Type:** Test Runner  
**Status:** ✅ Active

## 📦 What is SMRI?

SMRI (Serpent Town Master Reference Index) is a modular test runner system for executing automated scenarios.

## 🏗️ Architecture

```
src/modules/smri/
├── index.js          # Module entry point
├── SMRIRunner.js     # Main test runner class
├── scenarios.js      # Test scenario definitions
├── pipeline.js       # Purchase pipeline steps
└── README.md         # This file
```

## 📚 Usage

### Import in HTML
```html
<script type="module">
  import { SMRIRunner, scenarios } from '../src/modules/smri/index.js';
  
  const runner = new SMRIRunner({ scenarios });
  runner.init();
</script>
```

### Import in other modules
```javascript
import { SMRIRunner } from '../smri/SMRIRunner.js';
import { scenarios } from '../smri/scenarios.js';
import { pipelineSteps } from '../smri/pipeline.js';
```

## 🔗 Links to Other Modules

### Dependencies
- `src/components/BrowserFrame.js` - For iframe rendering (optional)
- None required - standalone module

### Used By
- `debug/smri-runner-modular-NEW.html` - Main UI (NEW)
- `debug/tools/smri-runner.html` - Legacy UI (deprecated)

### Related Modules
- `src/modules/testing/` - Unit test framework
- `src/modules/game/` - Game scenarios
- `src/modules/shop/` - Purchase flow scenarios

## 📋 Scenarios

Current scenarios (from `scenarios.js`):
1. **S1.1,2,3,4,5.01** - Purchase Flow (catalog → game)
2. **S0.0,1,2,3,4,5.01** - Healthcheck (all modules)
3. **S5.1,2.01** - Worker API
4. **S2.7,5,5-1.01** - Tutorial Happy Path
5. **S2.8,1,5.01** - Collection View

## 🎯 API

### SMRIRunner Class

```javascript
const runner = new SMRIRunner({
  workerUrl: 'https://catalog.navickaszilvinas.workers.dev',
  scenarios: [...] // Array of scenario objects
});

// Initialize UI
runner.init();

// Run single scenario
await runner.runScenario('purchase-flow');

// Run all scenarios
await runner.runAll();

// Get results
const summary = runner.getSummary();
// { passed, failed, total, duration, passRate }
```

## 🔄 Integration with Other Modules

### Testing Module
```javascript
import { SMRIRunner } from '../smri/SMRIRunner.js';
import { TestRunner } from '../testing/test-runner.js';

// SMRI for E2E scenarios, TestRunner for unit tests
```

### Game Module
```javascript
import { scenarios } from '../smri/scenarios.js';

// Use tutorial scenarios in game
const tutorialScenario = scenarios.find(s => s.id === 'tutorial-flow');
```

## 📊 Status

- ✅ Module created and working
- ✅ Linked from debug hub
- ✅ ES6 modules (zero dependencies)
- ⏳ TODO: Add more test scenarios
- ⏳ TODO: API endpoint tests
- ⏳ TODO: Integration with CI/CD

---

**Created:** 2026-01-08  
**Last Updated:** 2026-01-08
