# SMRI Constants and Versioning Strategy

**Problem:** Hardcoded S numbers everywhere = pain when relations change

**Solution:** 
1. Use descriptive filenames (not S numbers)
2. Store S numbers in one constant file
3. Generate S numbers dynamically from relations

---

## File Naming Strategy

### ❌ OLD (Hardcoded)
```
.smri/scenarios/S7.1.01-happy-path.md
debug/S7.1.01.html
```

### ✅ NEW (Descriptive)
```
.smri/scenarios/tutorial-happy-path.md
debug/tutorial-happy-path.html
```

**S number stored INSIDE file as constant:**
```javascript
const SCENARIO = {
  id: 'tutorial-happy-path',
  module: 'S2-7',      // Game → Tutorial submodule
  relations: ['5', '11.1'],  // Worker, KV
  version: '01',
  get smri() {
    return `S${this.module}.${this.relations.join(',')}.${this.version}`;
  }
};
// Returns: "S2-7.5,11.1.01"
```

---

## Constants File

**Location:** `src/config/smri-config.js`

```javascript
export const SMRI_MODULES = {
  HEALTH: 'S0',
  SHOP: 'S1',
  GAME: 'S2',
  AUTH: 'S3',
  PAYMENT: 'S4',
  WORKER: 'S5',
  UTILS: 'S6',
  KV: 'S11.1',
  STRIPE: 'S12',
  GITHUB_PAGES: 'S13.1'
};

export const SMRI_SUBMODULES = {
  GAME_TUTORIAL: 'S2-7',  // Tutorial under Game
  GAME_INVENTORY: 'S2-8', // Inventory under Game
  // Add more as needed
};

export function buildSmriCode(module, relations, version = '01') {
  const relStr = Array.isArray(relations) ? relations.join(',') : relations;
  return `S${module}.${relStr}.${version}`;
}

// Usage:
// buildSmriCode('2-7', ['5', '11.1'], '01') → "S2-7.5,11.1.01"
```

---

## Scenario File Format

**Filename:** `tutorial-happy-path.md` (descriptive)

**Header:**
```yaml
---
id: tutorial-happy-path
module: S2-7
relations: [S5, S11.1]
version: 01
priority: P0
smri_generated: S2-7.5,11.1.01
---
```

**Benefits:**
- Relations can change without renaming files
- S number generated from constants
- Git history preserved (no file renames)
- Easy to search by description, not number

---

## Debug Page Implementation

**Filename:** `debug/tutorial-happy-path.html`

**Header:**
```html
<script type="module">
import { buildSmriCode, SMRI_SUBMODULES } from '../src/config/smri-config.js';

const SCENARIO = {
  id: 'tutorial-happy-path',
  module: SMRI_SUBMODULES.GAME_TUTORIAL,
  relations: ['5', '11.1'],
  version: '01'
};

const smriCode = buildSmriCode(
  SCENARIO.module.replace('S', ''),
  SCENARIO.relations,
  SCENARIO.version
);

document.getElementById('smri-code').textContent = smriCode;
// Displays: "S2-7.5,11.1.01"
</script>
```

---

## Where S Numbers MUST Appear

### 1. Page Title (Generated)
```html
<title>🐍 Tutorial Happy Path | SMRI: S2-7.5,11.1.01</title>
```

### 2. Debug Index (Grouped by Module)
```javascript
// debug/index.html
const scenarios = [
  { file: 'tutorial-happy-path.html', module: 'S2-7', ... },
  // S number calculated on-the-fly
];
```

### 3. SMRI Docs (Reference Table)
```markdown
| Scenario | File | SMRI Code |
|----------|------|-----------|
| Tutorial Happy Path | tutorial-happy-path.md | S2-7.5,11.1.01 |
```

---

## Migration Plan

1. **Keep current files** (don't break git history)
2. **Add constants file** (src/config/smri-config.js)
3. **New scenarios use descriptive names**
4. **Eventually rename S7.1.01 → tutorial-happy-path** (when stable)

---

## Example: Adding New Relation

**Scenario:** Tutorial now needs Auth (S3)

### ❌ OLD Way (Hardcoded)
```
Rename: S7.5,11.1.01 → S7.3,5,11.1.01
Update: 15 files with hardcoded "S7.5,11.1.01"
Git: Messy history with renames
```

### ✅ NEW Way (Constants)
```javascript
// Just update relations array
const SCENARIO = {
  relations: ['3', '5', '11.1'],  // Added S3
  // ...
};
// S number auto-updates to S2-7.3,5,11.1.01
```

---

**Created:** 2025-12-28  
**Approved for:** All new scenarios (S2-7.x onwards)
