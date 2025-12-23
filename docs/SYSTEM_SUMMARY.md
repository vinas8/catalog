# Serpent Town — System Summary (SMRI-Based)

**Version:** v0.5.0  
**Date:** 2025-12-22  
**Status:** 🟢 Validated against E2E scenarios + Business Facts

---

## 1. What This System Is

Serpent Town is a **hash-identity, webhook-driven, KV-backed game platform** where users buy snakes via a payment processor and then care for them in a Tamagotchi-style game.

### Design Principles
- ✅ **Stateless** - No server-side sessions
- ✅ **Event-driven** - Webhooks trigger state changes
- ✅ **Documentation-first** - E2E scenarios define behavior
- ✅ **Test-driven** - Tests enforce scenarios
- ✅ **Debuggable** - Debug hub executes real workflows

Everything is structured around **SMRI** (Scenario–Module–Relation–Instance).

---

## 2. SMRI Is the Core Mental Model

SMRI is how we:
- 📖 **Understand** the system
- 📝 **Describe** behavior
- ✅ **Write tests**
- 🐛 **Build debug tools**
- 📊 **Generate user stories**
- 📈 **Track coverage**

### SMRI Rules
1. Every scenario has exactly **one owning module**
2. Scenarios may relate to **multiple internal modules**
3. External services are **dependencies, never owners**
4. Relationships are **explicit and traceable**

### Format
```
S M.RRR.II
│ │  │  └─ Instance (01-99)
│ │  └──── Relations (which modules connected)
│ └─────── Module owner (1-6)
└───────── Scenario prefix
```

**Examples:**
- `S1.0.01` = Shop standalone
- `S1.2.01` = Shop → Game
- `S5.11.2-12.2.01` = Worker → Cloudflare.KV + Stripe.Webhooks
- `S1.2345.01` = Shop → Game, Auth, Payment, Worker (critical path)

---

## 3. Real Modules (Only These Exist)

### Internal Modules (1–6)

| # | Module | Purpose | Code Path |
|---|--------|---------|-----------|
| 1 | **Shop** | Catalog + checkout links | `src/modules/shop/` |
| 2 | **Game** | Gameplay, stats, rendering | `src/modules/game/` |
| 3 | **Auth** | User hash identity + profile | `src/modules/auth/` |
| 4 | **Payment** | Webhook + signature validation | `src/modules/payment/` |
| 5 | **Worker** | API routing + KV orchestration | `worker/worker.js` |
| 6 | **Common** | Shared utilities (no business logic) | `src/modules/common/` |

### External Services (Dependencies)

| # | Service | Sub-modules |
|---|---------|-------------|
| 11 | **Cloudflare** | 11.1=KV, 11.2=Workers, 11.3=CDN |
| 12 | **Stripe** | 12.1=Checkout, 12.2=Webhooks, 12.3=API |
| 13 | **GitHub** | 13.1=Pages, 13.2=Actions |

---

## 4. Core Architecture Patterns

### Identity
- User identity = **client-generated hash** (32+ chars)
- No passwords, no sessions, no OAuth
- Hash passed through Stripe as `client_reference_id`
- localStorage = cache only (KV is source of truth)

### Ownership
- Ownership created **only by webhook confirmation**
- No webhook → no snake (even if payment succeeded)
- Multi-purchase: Appends to same `user:{hash}` KV entry
- Collection size unlimited

### Storage
- **KV = source of truth**
- localStorage = disposable performance cache
- Eventual consistency accepted (60s propagation)
- Cold starts fully supported (game loads from KV)

### Payments
- Webhook-driven, signature-verified (HMAC-SHA256)
- Idempotent handling (same webhook can fire multiple times)
- One payment provider active at a time (currently Stripe)

---

## 5. Gameplay Model

### Stats System
- **8 stats per snake:** Hunger, Water, Temperature, Humidity, Health, Stress, Cleanliness, Happiness
- **Range:** 0–100 (boundaries enforced)
- **Time-based decay** (even when game closed, timestamp-based)

### Decay Rates (per hour at 1x speed)
- Hunger: -2.0 to -2.5
- Water: -3.0
- Cleanliness: -1.0 to -1.5

### Care Actions
- **Feed:** Hunger +40, Stress -5, Cost: 10 gold
- **Water:** Water +50, Stress -2, Free
- **Clean:** Cleanliness +30, Stress -10, Cost: 5 gold

### Health Degradation
- Triggers when: Hunger<20, Water<20, or Cleanliness<20
- Health at 0 → "Critical" state
- Death disabled by feature flag (`ENABLE_DEATH = false`)

### Scalability
- Game works with **1 snake or 20+ snakes**
- No performance degradation with large collections

---

## 6. Security Model (P0 Priority)

- ✅ **Hash validation** blocks XSS/SQLi attempts
- ✅ **Webhook signature** required (CSRF-safe)
- ✅ **Output sanitization** (not storage mutation)
- ✅ **No cross-user access** (hash mismatch returns empty array)
- ✅ **No admin backdoors** to user data

---

## 7. Data Integrity & Reliability

- ✅ **Schema validation** before KV writes
- ✅ **Idempotent webhooks** (duplicate-safe)
- ✅ **Race-condition safe** for real products (first webhook wins)
- ✅ **Corrupted data handled gracefully** (returns empty array, no crash)
- ✅ **Network failures never crash UI** (retry button + error message)

---

## 8. End-to-End Documentation Drives Everything

**Primary Spec:** `docs/test/E2E_TEST_SCENARIOS.md`

Contains:
- **45 production scenarios** (S1.x through S6.x)
- **2 dev tools** (DEV prefix)
- **3 future features** (FUT prefix, disabled by flags)
- **Priorities:** P0 (critical) through P6 (future)
- **Coverage matrix** by module
- **Ownership matrix** (which module owns which scenario)
- **Expected results** for each scenario

### From E2E Docs We Derive:
1. **Tests** - Each scenario becomes a test
2. **Debug workflows** - Scenarios executable in debug hub
3. **Business facts** - Abstract rules extracted
4. **Future user stories** - Gap analysis → new scenarios

---

## 9. BUSINESS_FACTS.md = Abstraction Layer

**Location:** `docs/BUSINESS_FACTS_V3_FABRIC_METHOD.md`

Extracts:
- **Implementation-agnostic rules** (can swap Stripe for PayPal?)
- **Invariants** (what must always be true)
- **Constraints** (EUR-only, 60s consistency delay)
- **System patterns** (hash-identity, webhook-driven, KV-backed)

### Answers the Question:
> "What must always be true, regardless of technology?"

### Fabric-Based Extraction Confirms:
- **67 atomic facts** (single, verifiable statements)
- **Stable abstractions** (payment processor interface, KV store interface)
- **Clean separation of concerns** (modules have clear boundaries)

---

## 10. Debug Is a First-Class System Component

**Hub:** `debug.html` (redirects to `src/modules/debug/index.html`)

Features:
- ✅ **Mirrors real modules** (uses same code paths)
- ✅ **Runs SMRI workflows** (execute scenarios interactively)
- ✅ **Inspects KV + localStorage** (see all state)
- ✅ **Replays edge cases** (webhook delays, race conditions)
- ✅ **Used by humans and tests** (shared executors)

### Key Rule:
**Debug workflows and test workflows must share logic.**
- `src/modules/common/scenario-runner.js` - Shared executor
- `src/modules/common/security-scenarios.js` - Shared scenario definitions

---

## 11. Testing Philosophy

### TDD Workflow
1. Pick scenario from E2E_TEST_SCENARIOS.md
2. Write **failing test** matching scenario flow
3. Implement **minimal fix** to pass test
4. **Refactor** while keeping tests green
5. Mark scenario as ✅ **Implemented**

### Test Design Principles
- Each test uses **unique hash** (parallel execution safe)
- Tests call **same flows as debug** (no test-only code paths)
- **No flaky state** (cleanup between tests)
- **Fast feedback** (unit tests <1s, E2E <5s)

---

## 12. Product Model

### Real Products
- **One-time sale**, unique owner
- Price: €45-€1500
- Disappear from catalog when sold
- Stored in KV: `product:{id}` → `{status: 'sold', owner_id: hash}`

### Virtual Products (Future)
- **Unlimited availability**
- In-game gold purchase (not real money)
- Always available in catalog
- Feature flag: `ENABLE_VIRTUAL_SNAKES = false`

### Constraints
- **Inventory unlimited** (digital goods, never "out of stock")
- **EUR-only pricing** (Stripe account configuration)
- **No refunds** in v0.5.0 (manual admin process)

---

## 13. Feature Flags & Future

### Disabled Features
- `ENABLE_VIRTUAL_SNAKES = false` - Gold-based snake purchases
- `ENABLE_BREEDING = false` - Breed two snakes → baby snake
- `ENABLE_DEATH = false` - Snakes can die (currently just "critical")

### Planned Features
- **KV → DB migration** (PostgreSQL for filtering/sorting)
- **Real-time sync** (WebSocket/SSE for instant updates)
- **Multi-payment** (Stripe + PayPal simultaneously)
- **Multi-currency** (USD, GBP beyond EUR)

### Architecture Support
Current design **already supports** these without rewrites:
- Payment processor abstraction in place
- Storage abstraction in place
- Module boundaries clean

---

## 14. Big Picture (One Sentence)

> **Serpent Town is a webhook-driven, hash-identity game system where SMRI-based documentation defines behavior, tests enforce it, debug tools execute it, and business facts abstract it — all without hidden state or ambiguous ownership.**

---

## Quick Reference

### Key Files
- `docs/test/E2E_TEST_SCENARIOS.md` - **PRIMARY SPEC** (45 scenarios)
- `docs/BUSINESS_FACTS_V3_FABRIC_METHOD.md` - Abstract rules (67 facts)
- `src/modules/common/scenario-runner.js` - Shared test executor
- `debug.html` - Debug hub (scenario UI)
- `worker/worker.js` - Backend API

### Key Commands
```bash
npm test                    # Run all tests (86/86 passing)
npm run test:e2e:security   # Security scenarios only
node tests/e2e/security-scenarios.test.js  # Direct execution
```

### Key URLs
- Catalog: `https://vinas8.github.io/catalog/catalog.html`
- Game: `https://vinas8.github.io/catalog/game.html?user={hash}`
- Debug: `https://vinas8.github.io/catalog/debug.html`
- Worker: `https://serpent-town.workers.dev/`

---

## Module Ownership Matrix

| From/To | Shop(1) | Game(2) | Auth(3) | Pay(4) | Wrkr(5) | Cmn(6) |
|---------|---------|---------|---------|--------|---------|--------|
| **Shop(1)** | S10x | S12x | S13x | - | - | - |
| **Game(2)** | S21x | S20x | S23x | - | S25x | - |
| **Auth(3)** | - | - | S30x | S34x | S35x | - |
| **Pay(4)** | - | - | - | S44x | S45x | - |
| **Wrkr(5)** | S51x | S52x | - | S54x | S50x | - |
| **Common(6)** | - | - | - | - | - | S60x |

**Reading:** Row = Owner, Column = Relates to, Empty = No scenarios yet

---

## Coverage Summary

| Module | Scenarios | Status |
|--------|-----------|--------|
| Shop (1) | 6 | 🟢 Complete |
| Game (2) | 10 | 🟢 Complete |
| Auth (3) | 8 | 🟢 Complete |
| Payment (4) | 8 | 🟢 Complete |
| Worker (5) | 10 | 🟢 Complete |
| Common (6) | 2 | 🟡 Minimal (expected) |
| **Total Production** | **44** | **100%** |
| DEV Tools | 2 | 🔵 Dev Only |
| Future Features | 3 | ⚪ Disabled |
| **Grand Total** | **49** | - |

---

**Status:** ✅ Validated  
**Last Updated:** 2025-12-22  
**Maintained By:** AI Assistant + Team
