# SMRI Reference Guide

**Version:** 0.7.45  
**Single Source of Truth:** `src/config/smri-config.js`

---

## 🎯 Rules for Using SMRI Codes

### 1. **ALWAYS** Use Registry Keys in Code
```javascript
// ❌ WRONG - Hardcoded
const smri = 'S1.1,2,3,4,5.01';

// ✅ CORRECT - From registry
import { SMRI_REGISTRY } from './config/smri-config.js';
const smri = SMRI_REGISTRY['happy-path-purchase'];
```

### 2. **ALWAYS** Reference Keys in Documentation
```markdown
<!-- ❌ WRONG - Hardcoded number -->
Test S1.1,2,3,4,5.01 for purchase flow

<!-- ✅ CORRECT - Reference key -->
Test `happy-path-purchase` (S1.1,2,3,4,5.01) for purchase flow
```

### 3. **NEVER** Duplicate SMRI Codes
- **Master Registry:** `src/config/smri-config.js` (91 codes)
- **All other files:** Import from registry

---

## 📚 Complete SMRI Registry

### Health Checks (S0.x)
| Key | Code | Description |
|-----|------|-------------|
| `healthcheck` | S0.0.01 | Generic debug health check |
| `health-generic` | S0.0.01 | Generic debug health check |
| `demo-mode` | S0.0.02 | Virtual snakes demo mode |
| `cleanup` | S0.0.03 | Storage data cleanup utility |
| `shop-rendering` | S0.1.01 | Shop product rendering check |
| `game-mechanics` | S0.2.01 | Game mechanics health check |
| `auth-validation` | S0.3.01 | Auth user validation check |
| `stripe-integration` | S0.4.01 | Payment Stripe integration |
| `worker-kv` | S0.5,5-1.01 | Worker API & KV check |
| `kv-storage` | S0.11,5-1.01 | KV storage health check |
| `webhooks` | S0.12,5-2.01 | Stripe webhooks health check |
| `all-health-checks` | S0.1,2,3,4,5,5-1,5-2.01 | Full system health |
| `all-health-checks-full` | S0.0,1,2,3,4,5.01 | Complete health check |

### Shop Module (S1.x)
| Key | Code | Description |
|-----|------|-------------|
| `catalog-display` | S1.1.01 | Product catalog display |
| `product-availability` | S1.1.01 | Product availability status |
| `csv-import` | S1.1.02 | CSV product import |
| `buy-five-snakes` | S1.1,2.02 | Buy five different snakes |
| `duplicate-morph` | S1.1,2.03 | Buy same morph twice |
| `email-receipt` | S1.1,4.01 | Payment confirmation email |
| `returning-user-purchase` | S1.1,2,3,4.01 | Returning customer purchase |
| `happy-path-purchase` | S1.1,2,3,4,5.01 | Happy path purchase flow |
| `purchase-flow` | S1.1,2,3,4,5.01 | Complete purchase flow |
| `real-snake-completeness` | S1.2,11.1.01 | Real snake data validation |
| `success-page` | S1.5.01 | Purchase success page |

### Game Module (S2.x)
| Key | Code | Description |
|-----|------|-------------|
| `stats-display` | S2.2.01 | View snake stats display |
| `hunger-decay` | S2.2.02 | Stats hunger thirst decay |
| `feed-water` | S2.2.03 | Feed action snake mechanic |
| `clean-habitat` | S2.2.04 | Clean enclosure habitat action |
| `equipment-shop` | S2.2.05 | Equipment shop purchase |
| `multi-snake` | S2.2.06 | Multi-snake management |
| `death-event` | S2.2.07 | Snake death event handling |
| `breeding-check` | S2.2.08 | Breeding compatibility check |
| `offspring-calculate` | S2.2.09 | Offspring genetics calculation |
| `auto-save` | S2.5,5-1.01 | Auto-save game state to KV |
| `breeding-calc` | S2.2,3.01 | Breeding calculator |
| `collection-view` | S2.2.10 | Collection view display |
| `game-tamagotchi` | S2.2.11 | Tamagotchi game mechanics |
| `aquarium-shelf-system` | S2.2.12 | Aquarium shelf display system |
| `gamified-shop` | S2.1,2.01 | Gamified shop interface |

### Tutorial (S2.7.x)
| Key | Code | Description |
|-----|------|-------------|
| `tutorial-happy-path` | S2.7,5,5-1.01 | Tutorial: Happy path |
| `tutorial-missed-care` | S2.7,5,5-1.02 | Tutorial: Missed care |
| `tutorial-education-commerce` | S2.1,7,5,5-1.03 | Tutorial: Education-first |
| `tutorial-trust-protection` | S2.1,7,5,5-1.04 | Tutorial: Trust protection |
| `tutorial-email-reentry` | S2.7,5,5-1.05 | Tutorial: Email re-entry |
| `tutorial-failure-educational` | S2.7,5,5-1.06 | Tutorial: Failure case |

### Auth Module (S3.x)
| Key | Code | Description |
|-----|------|-------------|
| `anonymous-user` | S3.3.01 | Skip registration anonymous |
| `hash-validation` | S3.3.02 | User hash validation check |
| `loyalty-points` | S3.3.03 | Loyalty points earning |
| `data-export` | S3.3.04 | User data export |
| `data-wipe` | S3.3.05 | User data wipe |
| `multi-device` | S3.3,5-1.01 | Multi-device sync |
| `purchase-history` | S3.3,5-1.02 | Purchase history display |
| `account-page` | S3.3.06 | Account page view |
| `calculator-genetics-data` | S3.2,3.01 | Calculator genetics data |

### Payment Module (S4.x)
| Key | Code | Description |
|-----|------|-------------|
| `stripe-session` | S4.4,5.01 | Stripe checkout session |
| `refund-check` | S4.4.02 | Refund processing check |
| `webhook-success` | S4.4,5-2.01 | Webhook success handling |
| `webhook-failure` | S4.4,5-2.02 | Webhook failure handling |
| `idempotency` | S4.4,5-2.03 | Webhook idempotency check |
| `email-receipt-payment` | S4.4,5-2.04 | Email receipt delivery |

### Worker Module (S5.x)
| Key | Code | Description |
|-----|------|-------------|
| `products-endpoint` | S5.5,5-1.01 | Products API endpoint |
| `upload-products` | S5.5.01 | Upload products to Stripe |
| `sync-stripe-kv` | S5.5,5-1.02 | Sync Stripe with KV |
| `kv-read-write` | S5.5-1.01 | KV read/write operations |
| `kv-list` | S5.5-1.02 | KV list all keys |
| `user-save` | S5.3,5-1.01 | Save user state to KV |
| `user-load` | S5.3,5-1.02 | Load user state from KV |
| `webhook-signature` | S5.5-2.01 | Webhook signature verify |
| `webhook-handler` | S5.4,5-2.01 | Webhook request handler |
| `error-recovery` | S5.5.02 | Error recovery handling |
| `rate-limiting` | S5.5.03 | API rate limiting |
| `game-state-sync` | S5.2,5-1.04 | Game state sync to KV |
| `worker-api` | S5.5.04 | Worker API health |
| `kv-storage-worker` | S5.5-1.03 | KV storage operations |

### Demo System (S9.x)
| Key | Code | Description |
|-----|------|-------------|
| `demo-first-purchase` | S1.1,2,3.01 | Demo: First purchase |
| `demo-debug-test` | S9.0,8.01 | Demo: Debug test mode |
| `demo-clear-localStorage` | S9.0,8.02 | Demo: Clear localStorage |
| `demo-shop-browse` | S9.1,2.01 | Demo: Shop browsing |
| `demo-stripe-checkout` | S9.4.01 | Demo: Stripe checkout |
| `demo-game-tamagotchi` | S9.6.02 | Demo: Tamagotchi game |
| `demo-breeding` | S9.3.01 | Demo: Breeding system |
| `demo-tutorial` | S2.7,5,5-1.01 | Demo: Tutorial flow |
| `demo-owner-dashboard` | S6.1,4,5.01 | Demo: Owner dashboard |
| `demo-minimal` | S9.0.01 | Demo: Minimal test |
| `demo-test-placeholder` | S0.0.0 | Demo: Test placeholder |
| `demo-snake-care-full` | S2.2,3,4,5.01 | Demo: Full snake care |
| `demo-breeder-scenario` | S3.1,2,3.01 | Demo: Breeder scenario |

### Components (S9.x, S10.x)
| Key | Code | Description |
|-----|------|-------------|
| `component-split-screen-demo` | S9.3,2.04 | Split-screen demo component |
| `component-demo-system` | S9.2,8,5,10.06 | Demo system component |
| `smri-decoder` | S10.2,5.01 | SMRI decoder module |

### E2E Tests
| Key | Code | Description |
|-----|------|-------------|
| `fluent-customer-journey` | S1.1,2,3.09 | Fluent customer journey E2E |

---

## 🔧 Usage Examples

### In JavaScript Modules
```javascript
import { SMRI_REGISTRY, getSmriCode } from './config/smri-config.js';

// Direct access
const code = SMRI_REGISTRY['happy-path-purchase']; // 'S1.1,2,3,4,5.01'

// Getter function
const code2 = getSmriCode('tutorial-happy-path'); // 'S2.7,5,5-1.01'
```

### In Scenario Definitions
```javascript
import { SMRI_REGISTRY } from '../config/smri-config.js';

const scenarios = [
  {
    id: 'purchase-test',
    title: 'Happy Path Purchase',
    smri: SMRI_REGISTRY['happy-path-purchase'],
    // ...
  }
];
```

### In Documentation
```markdown
## Test Scenarios

1. **Happy Path Purchase** (`happy-path-purchase`)  
   SMRI: S1.1,2,3,4,5.01  
   Tests the complete purchase flow from catalog to success page.

2. **Tutorial Flow** (`tutorial-happy-path`)  
   SMRI: S2.7,5,5-1.01  
   Tests the tutorial with daily check-ins.
```

---

## ⚠️ Important Notes

1. **Never** hardcode SMRI numbers in `.js` files
2. **Never** duplicate SMRI codes across files
3. **Always** import from `src/config/smri-config.js`
4. **Exception:** `src/config/version.js` tracks history (OK to hardcode)
5. **Documentation:** Reference keys first, show codes in parentheses

---

**Last Updated:** 2026-01-20  
**Maintained by:** SMRI System v0.7.45
