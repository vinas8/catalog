# SMRI Collections

Collections group related scenarios for batch execution.

## Available Collections

### Tutorial System (`COL-S2-7-tutorial`)
- **Path:** `.smri/collections/tutorial-system.md`
- **Scenarios:** 6 (S2-7.x.01 through S2-7.x.06)
- **Run:** `npm run test:collection:tutorial`
- **Duration:** ~5-6 minutes

## Creating New Collections

1. Create collection spec in `.smri/collections/{name}.md`
2. Create runner script in `tests/collections/run-{name}-collection.js`
3. Add npm script to `package.json`: `"test:collection:{name}"`
4. Update this README

## Collection Format

```markdown
# Collection Name

**Collection ID:** COL-{module}-{name}
**Priority:** P0/P1/P2
**Total Scenarios:** N
**Duration:** X minutes

## Scenarios
- Scenario 1
- Scenario 2

## Execution
npm run test:collection:{name}
```

## Runner Template

```javascript
// tests/collections/run-{name}-collection.js
import { chromium } from 'playwright';

const SCENARIOS = [
  { id: '...', url: '...', timeout: 60000 }
];

async function runCollection() {
  // Launch browser, iterate scenarios, capture results
}

runCollection();
```
