# 🐍 Gamified Snake Shop Implementation Plan

**Date:** 2026-01-02  
**Version:** 0.7.0 → 0.8.0  
**Status:** Ready to Execute

---

## ✅ What I Found in Codebase

### Existing Infrastructure
1. **DEBUG flag:** ✅ `APP_CONFIG.DEBUG` (localhost = true, production = false)
2. **Navigation component:** ✅ `src/components/Navigation.js` (already bottom nav for mobile)
3. **KV namespaces:** ✅ 3 existing:
   - `USER_PRODUCTS` (stores user data with `user:hash` and `userdata:hash` prefixes)
   - `PRODUCTS` (catalog - currently mixed)
   - `PRODUCT_STATUS` (availability tracking)
4. **Aquarium shelf system:** ✅ Already built (`shelf-manager.js`, `snake-detail-view.js`)
5. **User storage:** ✅ In `USER_PRODUCTS` KV with `userdata:{hash}` prefix

### Current Pages
- `index.html` - Landing page
- `catalog.html` - Shop
- `game.html` - Farm/collection (currently mixed?)
- `learn.html` - Interactive tutorial
- `learn-static.html` - Encyclopedia
- `dex.html` - Dex (standalone)
- `account.html` - Account

---

## 🎯 Implementation Tasks

### Phase 1: Data Separation (P0)

#### Task 1.1: Create New KV Namespaces
**File:** `worker/wrangler.toml`

Add:
```toml
[[kv_namespaces]]
binding = "PRODUCTS_REAL"
id = "NEW_ID_1"

[[kv_namespaces]]
binding = "PRODUCTS_VIRTUAL"
id = "NEW_ID_2"

[[kv_namespaces]]
binding = "USERS"
id = "NEW_ID_3"
```

**Action:** Create namespaces in Cloudflare dashboard, get IDs

#### Task 1.2: Migrate Products Data
**New Script:** `scripts/migrate-products-split.sh`

- Read all from `PRODUCTS`
- Split by type (or default all to 'real' initially)
- Write to `PRODUCTS_REAL` / `PRODUCTS_VIRTUAL`
- Backup original
- Add `type` field to all products

#### Task 1.3: Update Worker Endpoints
**File:** `worker/worker.js`

Update endpoints:
- `/products` → query both namespaces, return with type
- `/products/real` → query `PRODUCTS_REAL` only
- `/products/virtual` → query `PRODUCTS_VIRTUAL` only
- `/user-products` → add type filtering

---

### Phase 2: Navigation Updates (P0)

#### Task 2.1: Update Navigation Config
**File:** `src/config/app-config.js`

**Current:**
```javascript
primary: [
  { label: 'Shop', href: 'catalog.html', icon: '🛒' },
  { label: 'Farm', href: 'game.html', icon: '🏡' },
  { label: 'Learn', href: 'learn.html', icon: '📚', submenu: [...] },
  { label: 'Account', href: 'account.html', icon: '👤' }
]
```

**Update submenu:**
```javascript
{ 
  label: 'Learn', 
  href: 'learn.html', 
  icon: '📚',
  submenu: [
    { label: 'Tutorials', href: 'learn.html', icon: '🎮' },
    { label: 'Encyclopedia', href: 'learn-static.html', icon: '📖', submenu: [
      { label: 'Dex', href: 'dex.html', icon: '📚' },
      { label: 'Care Guides', href: 'learn-static.html#care', icon: '🩺' }
    ]},
    { label: 'Morph Calculator', href: 'game.html#calculator', icon: '🎨' }
  ]
}
```

#### Task 2.2: Add Debug Nav Visibility
**File:** `src/components/Navigation.js`

Update render logic:
```javascript
// Line ~120 (in render method)
${this.config.DEBUG ? `
  <a href="${debugHref}" class="nav-link">
    <span class="nav-icon">${this.config.NAVIGATION.debugLink.icon}</span>
    <span class="nav-label">Debug</span>
  </a>
` : ''}
```

---

### Phase 3: Farm = Real Only (P0)

#### Task 3.1: Update game.html Context
**File:** `game.html`

Add data attribute:
```html
<div id="app" data-context="real">
```

#### Task 3.2: Update Game Controller
**File:** `src/modules/game/game-controller.js`

Add filtering:
```javascript
async loadUserSnakes() {
  const context = document.getElementById('app')?.dataset.context || 'real';
  const response = await fetch(`${WORKER_URL}/user-products?user=${userId}&type=${context}`);
  // ... filter snakes by type
  this.gameState.snakes = snakes.filter(s => s.type === context);
}
```

#### Task 3.3: Update Shelf Manager
**File:** `src/modules/game/shelf-manager.js`

Add type prop:
```javascript
constructor(gameState, type = 'real') {
  this.gameState = gameState;
  this.type = type; // 'real' or 'virtual'
  this.currentShelfIndex = 0;
  this.snakesPerShelf = 10;
}

// Filter snakes by type
get filteredSnakes() {
  return this.gameState.snakes.filter(s => s.type === this.type);
}
```

---

### Phase 4: Learn = Virtual Only (P0)

#### Task 4.1: Update learn.html Context
**File:** `learn.html`

Add data attribute:
```html
<div id="app" data-context="virtual">
```

#### Task 4.2: Virtual Snake Display
Use same shelf system, different data source:
```javascript
// In learn.html script
const shelfManager = new ShelfManager(gameState, 'virtual');
shelfManager.render(container);
```

---

### Phase 5: Customer Tags (P1)

#### Task 5.1: Create Tags Schema
**New Module:** `src/modules/common/customer-tags.js`

```javascript
export const CUSTOMER_TAGS = {
  COLLECTOR: 'collector',
  NEWBIE: 'newbie',
  BUYER: 'buyer',
  B2B: 'b2b',
  BOT_BLOCKED: 'bot_blocked'
};

export const TAG_RULES = {
  collector: {
    auto: (user) => user.products?.length >= 10,
    description: 'Owns 10+ snakes'
  },
  newbie: {
    auto: (user) => user.tutorial_completed === false,
    description: 'Tutorial not completed'
  },
  buyer: {
    auto: (user) => user.products?.length > 0,
    description: 'Has purchased at least 1 snake'
  }
};
```

#### Task 5.2: Add Tags to User Model
**File:** `worker/worker.js`

Update user profile structure:
```javascript
const userProfile = {
  user_id: userId,
  email: email,
  products: [...],
  tags: [], // Auto-calculated + manual
  tags_manual: [], // Admin-assigned only
  created_at: timestamp,
  updated_at: timestamp
};
```

#### Task 5.3: Auto-Tag on User Load
**File:** `src/modules/auth/user-auth.js`

```javascript
async loadUser(userId) {
  const user = await fetchUser(userId);
  user.tags = calculateAutoTags(user);
  return user;
}
```

---

### Phase 6: Real Snake Detail Format (P1)

#### Task 6.1: Update Product Schema
**File:** `src/modules/shop/data/product-schema.js` (create)

```javascript
export const REAL_SNAKE_SCHEMA = {
  id: String,
  type: 'real',
  name: String,
  species: String,
  morph: String,
  genetics: {
    traits: [String],
    hets: [String], // Heterozygous traits
    visual: [String]
  },
  sex: 'male' | 'female' | 'unknown',
  age: {
    hatch_date: Date,
    months: Number
  },
  weight_grams: Number,
  length_cm: Number,
  breeder: {
    id: String,
    name: String,
    location: String
  },
  images: [String],
  price: Number,
  available: Boolean
};
```

#### Task 6.2: Update Snake Detail View
**File:** `src/modules/game/snake-detail-view.js`

Add genetics section:
```javascript
renderGeneticsSection() {
  if (this.snake.type !== 'real') return '';
  
  return `
    <div class="genetics-section">
      <h3>🧬 Genetics</h3>
      <div class="genetics-traits">
        <div class="trait-group">
          <label>Visual:</label>
          <span>${this.snake.genetics.visual.join(', ')}</span>
        </div>
        <div class="trait-group">
          <label>Het for:</label>
          <span>${this.snake.genetics.hets.join(', ')}</span>
        </div>
      </div>
      <div class="breeder-info">
        <label>Breeder:</label>
        <span>${this.snake.breeder.name}</span>
      </div>
    </div>
  `;
}
```

---

### Phase 7: Debug Flag Integration (P0)

#### Task 7.1: Update All Debug Pages
**Files:** All `debug/*.html`

Add guard at top:
```javascript
import { APP_CONFIG } from '../src/config/app-config.js';

if (!APP_CONFIG.DEBUG) {
  document.body.innerHTML = '<h1>404 - Page not found</h1>';
  throw new Error('Debug pages disabled in production');
}
```

#### Task 7.2: Add Debug Link Conditional
**File:** `src/components/Navigation.js`

Already done ✅ (checked earlier)

---

## 📋 Migration Checklist

### Pre-Migration
- [ ] Backup current PRODUCTS KV
- [ ] Backup current USER_PRODUCTS KV
- [ ] Create new KV namespaces (get IDs)
- [ ] Test migration script locally

### Migration Steps
1. [ ] Create PRODUCTS_REAL, PRODUCTS_VIRTUAL, USERS namespaces
2. [ ] Run migration script (split products)
3. [ ] Update wrangler.toml with new namespace IDs
4. [ ] Deploy worker with new endpoints
5. [ ] Test /products/real and /products/virtual
6. [ ] Update frontend to use new endpoints
7. [ ] Test Farm (real only)
8. [ ] Test Learn (virtual only)
9. [ ] Verify no mixing occurs

### Post-Migration
- [ ] Monitor logs for errors
- [ ] Verify all purchases go to correct namespace
- [ ] Test tutorial virtual snake creation
- [ ] Confirm tags auto-calculate
- [ ] Check debug pages only show when DEBUG=true

---

## 🧪 Testing Strategy

### Unit Tests
- [ ] Test product type filtering
- [ ] Test shelf manager with type parameter
- [ ] Test customer tag auto-calculation
- [ ] Test debug flag guards

### Integration Tests
- [ ] Purchase real snake → appears in Farm only
- [ ] Complete tutorial → get virtual snake → appears in Learn only
- [ ] Navigate between Farm/Learn → no data leakage
- [ ] Customer tags update on user actions

### E2E Tests
- [ ] Full customer journey: Tutorial → Learn → Shop → Farm
- [ ] Debug pages inaccessible in production
- [ ] Navigation submenu works (Learn → Encyclopedia → Dex)

---

## 🚀 Deployment Order

1. **Worker First** (backend changes)
   - Deploy new KV namespaces
   - Update worker endpoints
   - Test API responses

2. **Frontend Second** (UI changes)
   - Update navigation config
   - Update game.html (Farm context)
   - Update learn.html (Learn context)
   - Deploy to GitHub Pages

3. **Data Migration** (once both deployed)
   - Run migration script
   - Verify data split correctly
   - Monitor for issues

---

## 📊 Success Criteria

- ✅ Farm shows only real snakes
- ✅ Learn shows only virtual snakes
- ✅ Shop can sell both (adds to correct namespace)
- ✅ Customer tags auto-assign correctly
- ✅ Debug pages invisible in production
- ✅ Dex accessible via Learn → Encyclopedia submenu
- ✅ All tests passing
- ✅ No data mixing between real/virtual

---

## ⏱️ Estimated Timeline

- **Phase 1 (Data):** 2-3 hours (KV setup + migration)
- **Phase 2 (Nav):** 1 hour (config updates)
- **Phase 3-4 (Farm/Learn):** 2 hours (context filtering)
- **Phase 5 (Tags):** 2 hours (schema + auto-calc)
- **Phase 6 (Detail):** 1 hour (genetics display)
- **Phase 7 (Debug):** 30 min (guards)

**Total:** ~8-9 hours active work + testing

---

## 🔄 Rollback Plan

If issues occur:
1. Revert worker deployment (previous version)
2. Point frontend back to old PRODUCTS namespace
3. Keep new namespaces for re-attempt
4. Analyze logs, fix issues, redeploy

---

**Ready to execute?** Say "start Phase 1" to begin.
