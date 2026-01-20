# 🛒 Purchase Flow Integration Guide

**Last Updated:** 2026-01-20  
**Version:** 0.7.51  
**SMRI:** S1.1,3,4,5.01

---

## 🏗️ Architecture Overview

### Monorepo Structure

```
/root/purchase_flow/          # External monorepo
├── packages/
│   ├── flows/
│   │   └── purchase/         # @serpent-town/flow-purchase
│   │       ├── src/
│   │       │   └── index.js  # PurchaseFlow facade class
│   │       └── package.json
│   │
│   ├── modules/
│   │   ├── shop/             # M1: ShopModule
│   │   ├── auth/             # M3: AuthModule
│   │   ├── payment/          # M4: PaymentModule
│   │   └── worker/           # M5: WorkerModule
│   │
│   └── shared/
│       └── utils/            # EventBus, etc.
│
├── server.js                 # Demo server (port 8005)
├── demo.html                 # Standalone demo
└── LOCAL-USAGE.md           # Integration guide
```

### Module Dependencies (SMRI: S1.1,3,4,5.01)

```
PurchaseFlow (Facade)
    ├─→ M1: ShopModule      (Browse products, filters)
    ├─→ M3: AuthModule      (User authentication)
    ├─→ M4: PaymentModule   (Stripe checkout)
    └─→ M5: WorkerModule    (KV storage, fulfillment)
```

**Note:** M2 (Game) is NOT part of purchase flow - it's a separate concern in catalog.

---

## 🔗 Integration Points

### 1. Catalog Feature Flag System

**File:** `/root/catalog/src/modules/config/feature-flags.js`

```javascript
export const FEATURE_FLAGS = {
  USE_EXTERNAL_PURCHASE_FLOW: true,  // Toggle external module
  // ... other flags
};
```

### 2. Demo Integration

**File:** `/root/catalog/demo/index.html`

```javascript
// Import external flow module
import { PurchaseFlow } from '../purchase_flow/packages/flows/purchase/src/index.js';

// Initialize flow
const flow = new PurchaseFlow({
  workerUrl: 'http://localhost:8005',
  debugMode: true
});

await flow.init();

// Use facade method
const session = await flow.purchaseProduct('prod_demo');
```

### 3. Demo Module Support

**File:** `/root/catalog/src/modules/demo/Demo.js`

```javascript
constructor(options = {}) {
  this.purchaseFlow = options.purchaseFlow || null;  // External flow class
  // ...
}
```

---

## 🚀 Development Workflow

### Start Servers

```bash
# Terminal 1: Catalog (port 8000)
cd /root/catalog
python3 -m http.server 8000

# Terminal 2: Purchase Flow Demo (port 8005)
cd /root/purchase_flow
node server.js
```

### Test Integration

1. **Catalog Demo with External Flow:**
   ```
   http://localhost:8000/demo/?v=0.7.51
   ```
   - Run to Step 7
   - Should see: "💳 Using external purchase flow MODULE..."
   - Confirms real module usage

2. **Standalone Flow Demo:**
   ```
   http://localhost:8005/demo
   ```
   - Tests flow independently
   - Mock products & API

3. **Feature Flag Demo:**
   ```
   http://localhost:8000/demo-purchase-flow.html?v=0.7.51
   ```
   - Toggle flag ON/OFF
   - Shows UI graying behavior

### Toggle Feature Flag

```javascript
// Enable
window.featureFlags.enable('USE_EXTERNAL_PURCHASE_FLOW');

// Disable
window.featureFlags.disable('USE_EXTERNAL_PURCHASE_FLOW');

// Check status
window.featureFlags.all();
```

---

## 📦 Installation Methods

### Method 1: Local Path (Current)

```bash
cd /root/catalog
npm install ../purchase_flow/packages/flows/purchase
```

### Method 2: npm link

```bash
# In purchase_flow
cd /root/purchase_flow/packages/flows/purchase
npm link

# In catalog
cd /root/catalog
npm link @serpent-town/flow-purchase
```

### Method 3: npm Registry (Future)

```bash
npm install @serpent-town/flow-purchase
```

---

## 🧪 Testing

### Unit Tests

```bash
# Catalog tests
cd /root/catalog
npm test                    # 60 tests
npm run test:smri          # 14 scenario tests

# Purchase flow demo tests
bash tests/test-purchase-flow-demo.sh  # 10 integration tests
```

### Manual Testing Checklist

- [ ] Feature flag toggle works (gray ↔ green buttons)
- [ ] Demo Step 7 uses external module
- [ ] API calls go to localhost:8005
- [ ] Session created with real flow
- [ ] Fallback to simulation if server down
- [ ] Console shows "🎉 Used real PurchaseFlow module!"

---

## 🎯 Key Benefits

### Before (Inline Code)
❌ Purchase logic scattered in catalog  
❌ Hard to test independently  
❌ No reusability  
❌ Tight coupling  

### After (External Module)
✅ Purchase logic in separate monorepo  
✅ Can test flow independently  
✅ Reusable across projects  
✅ Feature flag for safe rollout  
✅ Clean dependency graph  

---

## 📊 Dependency Graph

```
Catalog (/root/catalog)
    ├─→ src/modules/config/feature-flags.js
    ├─→ demo/index.html
    └─→ src/modules/demo/Demo.js
            ↓ (when flag enabled)
    @serpent-town/flow-purchase (/root/purchase_flow)
        ├─→ PurchaseFlow (facade)
        │   ├─→ ShopModule (M1)
        │   ├─→ AuthModule (M3)
        │   ├─→ PaymentModule (M4)
        │   └─→ WorkerModule (M5)
        └─→ EventBus (shared/utils)
```

---

## 🐛 Troubleshooting

### Flow Server Not Running
```bash
cd /root/purchase_flow
nohup node server.js > server.log 2>&1 &
curl http://localhost:8005/api/health
```

### Module Not Found Error
```bash
cd /root/catalog
npm install ../purchase_flow/packages/flows/purchase
```

### Feature Flag Not Working
```javascript
// In browser console
window.featureFlags.all()
// Should show: USE_EXTERNAL_PURCHASE_FLOW: true
```

### Cache Not Busting
- Hard refresh: Ctrl+Shift+R
- Use versioned URL: `?v=0.7.51`
- Check version matches: Demo.js, demo/index.html, package.json

---

## 📝 Version History

- **v0.7.51** - External module integration complete
- **v0.7.50** - Feature flag system & demo page
- **v0.7.49** - Initial purchase flow research

---

## 🔮 Future Improvements

1. [ ] Add PM2 for flow server process management
2. [ ] Publish to npm registry
3. [ ] Add E2E tests with Playwright
4. [ ] Extract tutorial flow (S2.x)
5. [ ] Extract breeding flow (S3.x)
6. [ ] Add retry logic with exponential backoff
7. [ ] Add more SMRI codes to flow modules

---

## 📚 Related Documentation

- `.smri/INDEX.md` - Main SMRI index
- `.smri/docs/FLOW-BASED-ARCHITECTURE-RESEARCH.md` - Architecture research
- `.smri/docs/PURCHASE-FLOW-DEPENDENCY-GRAPH.md` - Dependency analysis
- `/root/purchase_flow/LOCAL-USAGE.md` - Flow usage guide

