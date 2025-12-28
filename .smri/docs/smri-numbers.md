# SMRI Module Relation Index

**SMRI** = **S**erpent Town **M**odule **R**elation **I**ndex

Numbers map to **modules and their dependencies**.

---

## S Numbers = Modules

| Number | Module | Icon | Description |
|--------|--------|------|-------------|
| **S0** | Health Checks | 🏥 | System health, startup validation |
| **S1** | Shop | 🛒 | Product catalog, browsing, cart |
| **S2** | Game | 🎮 | Tamagotchi mechanics, stats, care |
| **S3** | Auth | 🔐 | User authentication, hash-based |
| **S4** | Payment | 💳 | Stripe checkout integration |
| **S5** | Worker | ☁️ | Cloudflare Worker backend API |
| **S6** | Utils | 🛠️ | Debug tools, helpers |
| **S11.1** | KV Storage | 💾 | Cloudflare KV database |
| **S11.2** | CF Runtime | ⚡ | Cloudflare Workers runtime |
| **S11.3** | CF CDN | 🌐 | Cloudflare CDN |
| **S12** | Stripe | 💳 | Stripe API (all) |
| **S12.1** | Stripe Checkout | 🛒 | Checkout session |
| **S12.2** | Stripe Webhooks | 🔔 | Webhook events |
| **S13.1** | GitHub Pages | 📄 | Static hosting |

---

## Module Dependencies (Relation Index)

### Level 0 (No Dependencies)
- **S5** (Worker) - Base backend, no dependencies

### Level 1 (Depends on S5)
- **S11.1** (KV) - Requires Worker API
- **S6** (Utils) - Requires Worker

### Level 2 (Depends on S5 + S11.1)
- **S12** (Stripe) - Requires Worker + KV

### Frontend Modules (Depend on S5 + S11.1)
- **S1** (Shop) → S5 (Worker) + S11.1 (KV)
- **S2** (Game) → S5 (Worker) + S11.1 (KV)
- **S3** (Auth) → S5 (Worker) + localStorage
- **S4** (Payment) → S12 (Stripe) + S5 (Worker)

---

## Scenario Numbering (Full Syntax)

**Format:** `S{M}.{RRR}.{II}.html`

- **S** = Scenario prefix
- **M** = Primary module (0-13)
- **RRR** = Relations (comma-separated modules touched)
- **II** = Iteration/version (01, 02, 03...)

### Syntax Characters

**COMMA (`,`)** = Separates ALL touched systems
- Example: `S6.1,2,3,4,5,6,5-1,5-2.03`
- Means: Touches modules 1,2,3,4,5,6 plus external 5-1,5-2

**DASH (`-`)** = External service within module
- `5-1` = Worker external: KV
- `5-2` = Worker external: Stripe
- `5-3` = Worker external: Email
- `11-1` = Cloudflare external 1
- `12-1` = Stripe external 1

**DOT (`.`)** = Separates format parts
- First dot: After primary module
- Second dot: Before iteration number

### Examples Explained

**Simple:** `S1.5.01.html`
- S1 = Shop module (primary)
- .5 = Scenario 5 (within Shop)
- .01 = Version 01

**Multi-step:** `S1.1,2,3,4,5.01.html`
- S1 = Shop module (primary)
- .1,2,3,4,5 = Steps 1-5 (combined journey)
- .01 = Version 01

**With externals:** `S5.5,5-1,5-2.01.html`
- S5 = Worker module (primary)
- .5,5-1,5-2 = Worker + KV + Stripe
- .01 = Version 01

**Complex:** `S6.1,2,3,4,5,6,5-1,5-2.03.html`
- S6 = Utils/Common (primary)
- .1,2,3,4,5,6,5-1,5-2 = ALL modules + externals
- .03 = Version 03 (third iteration)

---

## Module Testing Order

**Must test in dependency order:**

1. Test **S5** (Worker) first - it has no dependencies
2. Test **S11.1** (KV) and **S6** (Utils) - they depend on S5
3. Test **S12** (Stripe) - depends on S5 + S11.1
4. Test **S1, S2, S3, S4** (frontend modules) - depend on everything

**Why?** If Worker (S5) is broken, KV (S11.1) tests will fail too. Test base layer first.

---

## Real Examples from Debug

**From `/debug/healthcheck.html`:**

```html
S5.x (Worker) - Base API endpoints
S11.1.x (KV) - Key-value storage
S12.x (Stripe) - Payment processing
S1.x (Shop) - Product catalog
S2.x (Game) - Tamagotchi
S3.x (Auth) - User login
S4.x (Payment) - Checkout flow
```

**From `/debug/index.html`:**

```javascript
const moduleNames = {
  'S0': { name: 'Health Checks', icon: '🏥' },
  'S1': { name: 'Shop', icon: '🛒' },
  'S2': { name: 'Game', icon: '🎮' },
  'S3': { name: 'Auth', icon: '🔐' },
  'S4': { name: 'Payment', icon: '💳' },
  'S5': { name: 'Worker', icon: '☁️' }
};
```

---

## How to Use SMRI

**When creating scenario:**
1. Identify which **module** it tests
2. Use that module's **S number**
3. Add scenario number within that module
4. Start with version .01

**Example:**
- Testing Shop catalog display?
- Shop = S1
- It's the 5th Shop scenario
- File: `S1.5.01.html`

**When debugging:**
- Check module dependencies
- If S1 (Shop) fails, check if S5 (Worker) and S11.1 (KV) work first
- Test base modules before dependent modules

---

## Quick Reference

```bash
# List scenarios by module
ls .smri/scenarios/S1.*.html  # Shop scenarios
ls .smri/scenarios/S2.*.html  # Game scenarios

# Check debug endpoint
open /debug/index.html        # See all modules
open /debug/healthcheck.html  # See dependencies
```

---

**Source:** `/debug/index.html`, `/debug/healthcheck.html`  
**Created:** 2025-12-28  
**This is what SMRI actually means.**
