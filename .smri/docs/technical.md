# Technical Reference

**Version:** 0.7.0  
**Last Updated:** 2025-12-28  
**Consolidated from:** `/docs/architecture/`, `/docs/modules/`, `/docs/v0.5.0.md`, `/docs/DEVELOPER_REFERENCE.md`

---

## Overview

Technical deep dive into Serpent Town's architecture, modules, KV storage, API endpoints, and file structure.

---

## Architecture

### System Components

```
┌─────────────────────────────────────────────────────────────┐
│                     SERPENT TOWN v0.7.0                     │
└─────────────────────────────────────────────────────────────┘

┌──────────────┐    ┌─────────────────┐    ┌──────────────┐
│   Frontend   │───▶│  Worker API     │───▶│  Cloudflare  │
│ GitHub Pages │◀───│  (Backend)      │◀───│     KV       │
└──────────────┘    └─────────────────┘    └──────────────┘
       │                     │                     
       │                     ▼                     
       │            ┌──────────────┐               
       └───────────▶│    Stripe    │               
                    └──────────────┘               
                            │
                            ▼
                    ┌──────────────┐
                    │    Email     │
                    │   Service    │
                    └──────────────┘
```

### Request Flow

1. **User Action** → Browser loads `catalog.html` from GitHub Pages
2. **API Call** → Frontend fetches `/products` from Cloudflare Worker
3. **KV Lookup** → Worker queries PRODUCTS namespace
4. **Response** → Worker returns JSON, frontend renders catalog
5. **Purchase** → User clicks "Buy" → Stripe Checkout
6. **Webhook** → Stripe calls `/stripe-webhook` on Worker
7. **Storage** → Worker writes to USER_PRODUCTS KV
8. **Email** → Worker sends confirmation via Mailtrap/SendGrid
9. **Game** → User opens `game.html#hash`, fetches `/user-products?user=hash`

---

## Modular Architecture

### Module Registry

Each module is self-contained and can be enabled/disabled:

| Module | Path | Purpose | Dependencies |
|--------|------|---------|--------------|
| **common** | `src/modules/common/` | Utilities, constants | None |
| **auth** | `src/modules/auth/` | User authentication | common |
| **shop** | `src/modules/shop/` | Catalog, economy | common |
| **game** | `src/modules/game/` | Tamagotchi mechanics | common, shop |
| **payment** | `src/modules/payment/` | Stripe integration | common |

### Module Structure

```
src/modules/{module-name}/
  ├── index.js          # Main export
  ├── config.js         # Module configuration
  ├── business/         # Business logic
  ├── data/             # Data models
  └── ui/               # UI components
```

### Enable/Disable Modules

**File:** `src/module-config.js`

```javascript
export const MODULE_CONFIG = {
  payment: { 
    enabled: true,
    path: 'modules/payment',
    description: 'Stripe payment integration'
  },
  shop: { enabled: true, ... },
  game: { enabled: true, ... }
};
```

---

## File Structure

```
/root/catalog/
├── index.html              # Landing page
├── catalog.html            # Snake shop
├── game.html              # Tamagotchi game
├── success.html           # Post-purchase
├── README.md              # Project overview
├── CHANGELOG.md           # Version history
│
├── src/
│   ├── config/
│   │   ├── app-config.js       # Main app settings
│   │   ├── feature-flags.js    # Feature toggles
│   │   ├── stripe-config.js    # Stripe keys
│   │   ├── worker-config.js    # Worker URLs
│   │   └── messages.js         # UI messages (150+)
│   │
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── index.js
│   │   │   └── user-auth.js
│   │   ├── common/
│   │   │   ├── index.js
│   │   │   ├── core.js
│   │   │   └── constants.js
│   │   ├── game/
│   │   │   ├── index.js
│   │   │   ├── game-controller.js
│   │   │   └── plugins/
│   │   │       ├── tamagotchi.js
│   │   │       ├── snakes.js
│   │   │       ├── shop.js
│   │   │       ├── dex.js
│   │   │       └── plants.js
│   │   ├── payment/
│   │   │   ├── index.js
│   │   │   └── payment-adapter.js
│   │   └── shop/
│   │       ├── index.js
│   │       ├── business/
│   │       │   ├── economy.js
│   │       │   ├── equipment.js
│   │       │   └── stripe-sync.js
│   │       ├── data/
│   │       │   ├── catalog.js
│   │       │   ├── morphs.js
│   │       │   └── species-profiles.js
│   │       └── ui/
│   │           ├── catalog-renderer.js
│   │           └── shop-view.js
│   │
│   ├── components/
│   │   └── Navigation.js
│   │
│   └── utils/
│       └── logger.js
│
├── worker/
│   ├── worker.js              # Main backend API
│   ├── email-service.js       # Email provider abstraction
│   ├── test-worker.js         # Test suite
│   ├── wrangler.toml          # Cloudflare config
│   └── README.md
│
├── data/
│   ├── products.json          # Available snakes
│   ├── users.json             # User accounts
│   └── user-products.json     # Local dev purchases
│
├── tests/                     # 86 tests
│   ├── unit/
│   ├── integration/
│   ├── e2e/
│   └── snapshot/
│
├── scripts/                   # 30+ automation scripts
│   ├── 1-clear-stripe-products.sh
│   ├── 2-upload-products-to-stripe.sh
│   ├── 3-import-stripe-to-kv.sh
│   ├── 4-verify-sync.sh
│   └── ...
│
└── .smri/                     # Documentation system
    ├── INDEX.md
    ├── docs/
    │   ├── business.md
    │   ├── deployment.md
    │   └── technical.md
    └── logs/
        └── 2025-12-28.md
```

---

## KV Storage Architecture

### Namespace Structure

```
USER_PRODUCTS (3b88d32c0a0540a8b557c5fb698ff61a)
  └── user:{hash} → Array of assignments

PRODUCT_STATUS (57da5a83146147c8939e4070d4b4d4c1)
  └── product:{id} → { status, owner_id, sold_at }

PRODUCTS (ecbcb79f3df64379863872965f993991)
  ├── product:{id} → Product details
  └── _index:products → Array of all product IDs
```

### Data Schemas

**Product:**
```json
{
  "id": "prod_xxx",
  "name": "Banana Ball Python",
  "species": "ball_python",
  "morph": "banana",
  "price": 450.00,
  "type": "real",
  "status": "available",
  "stripe_link": "https://buy.stripe.com/test_xxx"
}
```

**User Assignment:**
```json
{
  "assignment_id": "assign_1234567890",
  "user_id": "hash_abc123",
  "product_id": "prod_xxx",
  "name": "Banana Ball Python",
  "species": "ball_python",
  "morph": "banana",
  "acquired_at": "2025-12-28T20:00:00Z",
  "acquisition_type": "stripe_purchase",
  "payment_id": "cs_test_xxx",
  "price_paid": 450.00,
  "currency": "eur",
  "stats": {
    "hunger": 100,
    "water": 100,
    "temperature": 80,
    "humidity": 50,
    "health": 100,
    "stress": 10,
    "cleanliness": 100,
    "happiness": 100
  }
}
```

### KV Operations

**Read:**
```javascript
// Get user products
const products = await env.USER_PRODUCTS.get(`user:${hash}`, 'json');

// Get single product
const product = await env.PRODUCTS.get(`product:${id}`, 'json');
```

**Write:**
```javascript
// Save user assignment
await env.USER_PRODUCTS.put(`user:${hash}`, JSON.stringify(assignments));

// Mark as sold
await env.PRODUCT_STATUS.put(`product:${id}`, JSON.stringify({
  status: 'sold',
  owner_id: hash,
  sold_at: new Date().toISOString()
}));
```

---

## API Endpoints

### Worker API

**Base:** `https://catalog.navickaszilvinas.workers.dev`

| Endpoint | Method | Purpose | Auth |
|----------|--------|---------|------|
| `/version` | GET | Worker version info | None |
| `/products` | GET | Catalog (for sale only) | None |
| `/product-status?id=X` | GET | Check if sold | None |
| `/user-products?user=X` | GET | User's snakes | User hash |
| `/stripe-webhook` | POST | Handle payments | Stripe signature |
| `/session-info?session_id=X` | GET | Checkout session data | None |

### Request/Response Examples

**GET /products**
```bash
curl https://catalog.navickaszilvinas.workers.dev/products
```
Response:
```json
[
  {
    "id": "prod_xxx",
    "name": "Banana Ball Python",
    "price": 450.00,
    "stripe_link": "https://buy.stripe.com/..."
  }
]
```

**GET /user-products?user=hash**
```bash
curl "https://catalog.navickaszilvinas.workers.dev/user-products?user=abc123"
```
Response:
```json
[
  {
    "assignment_id": "assign_xxx",
    "name": "Banana Ball Python",
    "stats": { "hunger": 85, "water": 90, ... }
  }
]
```

---

## Configuration System

### App Config

**File:** `src/config/app-config.js`

```javascript
export const APP_CONFIG = {
  DEBUG: isLocalhost,
  ENVIRONMENT: isLocalhost ? 'local' : 'production',
  BASE_URL: isLocalhost ? 'http://localhost:8000' : 'https://vinas8.github.io/catalog',
  WORKER_URL: 'https://catalog.navickaszilvinas.workers.dev'
};
```

### Feature Flags

**File:** `src/config/feature-flags.js`

```javascript
export const FEATURE_FLAGS = {
  ENABLE_VIRTUAL_SNAKES: true,
  ENABLE_BREEDING: false,
  ENABLE_MARKETPLACE: false,
  ENABLE_DEBUG_UI: true
};
```

### Messages Config

**File:** `src/config/messages.js`

150+ UI messages organized by category:
- PURCHASE (confirmations, errors)
- AUTH (login, logout)
- GAME (care actions, stats)
- SHOP (checkout, cart)
- NETWORK (loading, errors)

```javascript
import { getMessage, showMessage } from './config/messages.js';

showMessage('PURCHASE.SUCCESS'); // ✅ Purchase successful!
```

---

## Testing

### Test Structure

```
tests/
├── unit/                      # Fast unit tests
├── integration/               # API integration tests
│   ├── stripe-kv-sync.test.js
│   └── worker-deployment.test.js
├── e2e/                       # End-to-end scenarios
│   ├── full-user-journey-test.sh
│   └── product-sync.test.js
├── snapshot/                  # Data structure validation
│   └── structure-validation.test.js
└── modules/                   # Per-module tests
    ├── auth/
    ├── common/
    ├── game/
    ├── payment/
    └── shop/
```

### Run Tests

```bash
npm test              # All 86 tests
npm run test:unit     # Unit only
npm run test:snapshot # Snapshot only
```

---

## Security

### Authentication

- **Hash-based identity**: User identified by URL hash `#user_abc123`
- **No passwords**: Simplified authentication for MVP
- **Stripe handles payments**: PCI-compliant

### Secrets Management

**Cloudflare:** All secrets stored as encrypted environment variables
- `STRIPE_SECRET_KEY`
- `MAILTRAP_API_TOKEN`
- `CLOUDFLARE_API_TOKEN`

**Never commit secrets:** Use `.env` (gitignored) for local dev

### Webhook Verification

```javascript
// Verify Stripe signature
const signature = request.headers.get('stripe-signature');
const event = await stripe.webhooks.constructEvent(
  body, signature, webhookSecret
);
```

---

## Performance

### Frontend
- **Zero dependencies** - No framework overhead
- **ES6 modules** - Native browser support
- **LocalStorage** - Instant state persistence
- **No build step** - Direct source serving

### Backend
- **Cloudflare Workers** - Edge computing (<50ms response)
- **KV Storage** - Global, low-latency reads
- **Email async** - Non-blocking (webhook completes fast)

### Metrics
- Page load: ~500ms
- API response: ~50-100ms
- Webhook processing: ~200-500ms (with email)

---

## Development

### Local Setup

```bash
# Clone repo
git clone https://github.com/vinas8/catalog.git
cd catalog

# Start local server
python -m http.server 8000

# Open browser
http://localhost:8000
```

### Worker Development

```bash
cd worker

# Test locally
wrangler dev

# Deploy
wrangler publish
```

---

## Quick Commands

```bash
# Test everything
npm test

# Deploy worker
cd worker && wrangler publish

# Sync Stripe → KV
bash scripts/sync-products-master.sh

# Clear test data
bash scripts/clear-test-data.sh

# Monitor logs
wrangler tail --name catalog
```

---

## Sources

Consolidated from:
- `/docs/architecture/ARCHITECTURE.md` - System architecture
- `/docs/architecture/KV-ARCHITECTURE.md` - KV storage design
- `/docs/modules/` - Module documentation (5 modules)
- `/docs/v0.5.0.md` - Technical API reference
- `/docs/DEVELOPER_REFERENCE.md` - Quick reference
- `/docs/reference/PROJECT-STRUCTURE.md` - File structure
- `/docs/api/` - API examples

---

**Last Updated:** 2025-12-28T21:01:57Z
