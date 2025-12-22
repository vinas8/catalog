# Common Module

**Version:** 0.1.0  
**Path:** `src/modules/common/`  
**Status:** ✅ Enabled (Required)  

---

## 📋 Overview

Shared utilities, helpers, and core functions used by all other modules. **Cannot be disabled.**

---

## 🎯 Features

- Date/time utilities
- Random helpers
- Data validation
- Error handling
- Common constants

---

## 📁 Structure

```
src/modules/common/
├── date-utils.js      # Time calculations
├── random-utils.js    # RNG helpers
├── validators.js      # Input validation
├── constants.js       # Shared constants
└── index.js           # Module exports
```

---

## 🔧 Key Functions

### Date Utilities
```javascript
import { getCurrentTimestamp, daysSince } from './modules/common/date-utils.js';

const now = getCurrentTimestamp();
const days = daysSince(purchaseDate);
```

### Random Helpers
```javascript
import { randomChoice, randomRange } from './modules/common/random-utils.js';

const morph = randomChoice(['Banana', 'Pied', 'Pastel']);
const health = randomRange(80, 100);
```

### Validators
```javascript
import { validateEmail, validateHash } from './modules/common/validators.js';

if (validateEmail(email)) {
  // Proceed
}
```

---

## 🧪 Testing

```bash
npm test tests/modules/common/
```

**Tests:**
- `core.test.js` - All common utilities

---

## 🚫 Cannot Be Disabled

This module is required by all other modules. Disabling it will break the application.

---

## 📦 Used By

- **All modules** depend on common utilities

---

## 🔗 Related

- [Module System](./README.md) - Overview
