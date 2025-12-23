# Debug Module (SMRI-Compliant)

**Location:** `src/modules/debug/`  
**Purpose:** Universal debug hub for Serpent Town development

## Structure

```
src/modules/debug/
├── index.html              # Main debug interface
├── components/
│   └── scenario-ui.js      # SMRI scenario runner UI
├── styles/
│   └── (future: extracted CSS)
└── README.md               # This file
```

## Features

### 🎯 SMRI Scenarios Tab
- Run E2E test scenarios by code (e.g., `S4.5.02`)
- View scenario details (module, relations, priority)
- See execution results (PASS/FAIL with timing)
- Browse all registered scenarios
- Quick access buttons for P0 security tests

### 📦 Catalog Tab
- Test product API endpoints
- View catalog data
- Check product availability

### 👤 Users Tab
- Test user management endpoints
- Register users
- Fetch user data

### 🔐 Admin Tab
- Manual product assignment (dev tool)
- Admin operations

### 💳 Stripe Tab
- Test Stripe integration
- View webhook events

### 📊 Monitor Tab
- System health checks
- API latency metrics

### 📝 Logs Tab
- View execution logs
- Filter by type

## Usage

### Open Debug Hub

```bash
# Option 1: Direct link
open http://localhost:8000/src/modules/debug/index.html

# Option 2: Via redirect
open http://localhost:8000/debug.html
```

### Run SMRI Scenario

1. Click "🎯 SMRI Scenarios" tab (first tab)
2. Enter scenario code: `S4.5.02`
3. Click "▶ Run Scenario"
4. View result (PASS/FAIL with details)

### Quick Access

Use quick buttons for common tests:
- S3.5.01 - Hash Validation
- S4.5.02 - SQL Injection
- S3.5.03 - XSS Attempt
- S4.4.05 - CSRF Attack

## Module Organization (SMRI)

This debug module follows SMRI principles:

- **Module Number:** Not assigned (dev tool)
- **Relations:** Uses all modules (1-6) + external services (11-13)
- **Purpose:** Cross-cutting dev tooling

**Dependencies:**
- Common module (6) - scenario-runner.js, security-scenarios.js
- All modules for API testing

## Components

### `scenario-ui.js`

**Purpose:** SMRI scenario execution UI

**Exports:**
- `ScenarioRunnerUI` - Class for scenario UI management

**Methods:**
- `init()` - Initialize scenario runner
- `run(code)` - Execute scenario by SMRI code
- `showList()` - Display all scenarios
- `clearLog()` - Clear execution log

**Usage:**
```javascript
import { ScenarioRunnerUI } from './components/scenario-ui.js';

const ui = new ScenarioRunnerUI({ workerUrl: 'https://...' });
await ui.init();
await ui.run('S4.5.02');
```

## Integration with Tests

The debug UI and E2E tests share the same scenario executors:

**Debug UI** → `scenario-ui.js` → `scenario-runner.js` → Executors  
**E2E Tests** → `security-scenarios.test.js` → `scenario-runner.js` → Executors

This ensures manual and automated testing use identical logic.

## Adding New Scenarios

To add a new scenario to the debug UI:

1. Create executor in `src/modules/common/security-scenarios.js` (or new file)
2. Register in `scenario-ui.js`:

```javascript
this.registry.register('S{M}.{RRR}.{II}', new YourExecutor({
  workerUrl: this.workerUrl,
  verbose: true
}), {
  name: 'Scenario Name',
  description: 'What it tests',
  priority: 'P0',
  module: 4,
  relations: [5]
});
```

3. Scenario appears in debug UI automatically

## Configuration

**Worker URL:**  
Set in index.html:
```javascript
window.WORKER_URL = 'https://catalog.navickaszilvinas.workers.dev';
```

**Verbose Logging:**  
Scenarios run with `verbose: true` for detailed logs

## Files

- **index.html** - Main interface (1100 lines)
- **scenario-ui.js** - Scenario UI component (350 lines)

## Future Improvements

- [ ] Extract shared CSS to `styles/debug.css`
- [ ] Create `api-tester.js` component for API tab
- [ ] Create `monitor.js` component for monitoring
- [ ] Add KV inspector component
- [ ] Add scenario replay functionality
- [ ] Add before/after diff view for KV changes

## Related Documentation

- SMRI System: `docs/test/E2E_TEST_SCENARIOS.md`
- Scenario Runner: `src/modules/common/scenario-runner.js`
- Fabric Integration: `docs/guides/SMRI-FABRIC-INTEGRATION.md`

---

**Status:** ✅ Operational  
**Version:** 1.0.0  
**Last Updated:** 2025-12-22
