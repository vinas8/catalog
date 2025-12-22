# Auth Module Documentation

**Version:** 0.1.0  
**Status:** ✅ Active  
**Location:** `src/modules/auth/`

---

## 📋 Overview

User authentication using hash-based identification.

---

## ⚙️ Enable/Disable

**File:** `src/modules/auth/index.js`

```javascript
export const ENABLED = false; // Disable
export const ENABLED = true;  // Enable
```

---

## 🔧 API

```javascript
import { UserAuth } from './modules/auth/index.js';
const hash = UserAuth.generateHash(username);
```

---

## 📦 Dependencies

- Requires: `common`
- Used by: `game`, `shop`
