# Business Logic & Snake Collection

**Version:** 0.7.0  
**Last Updated:** 2025-12-28  
**Consolidated from:** `/docs/business/`, `/docs/BUSINESS_RULES.md`

---

## Overview

Serpent Town's business logic covers snake breeding, care mechanics, equipment economy, and the farm collection system. With 24 breeding snakes and farm levels unlocked at 10+ and 20+ snakes.

---

## Game Mechanics

### 8 Vital Stats

All snakes have 8 stats (0-100):
- **Hunger** - Food level
- **Water** - Hydration
- **Temperature** - Body heat (species-specific)
- **Humidity** - Environmental moisture
- **Health** - Overall condition
- **Stress** - Mental state
- **Cleanliness** - Enclosure hygiene
- **Happiness** - Contentment

### Decay Rates (per hour at 1x speed)

| Stat | Decay Rate | Notes |
|------|------------|-------|
| Hunger | -2.0 to -2.5 | Varies by species |
| Water | -3.0 | Constant |
| Cleanliness | -1.0 to -1.5 | Depends on enclosure |
| Temperature | ±2.0 | Auto-regulated with equipment |
| Humidity | ±1.5 | Auto-maintained with misting |
| Health | -0.5 | When other stats low |
| Stress | +1.0 | When hungry/dirty |
| Happiness | -0.5 | When stressed |

### Care Actions

| Action | Effect | Cooldown |
|--------|--------|----------|
| **Feed** | Hunger +40, Stress -5 | 1 hour |
| **Water** | Water +50, Stress -2 | 30 minutes |
| **Clean** | Cleanliness +30, Stress -10 | 2 hours |
| **Handle** | Stress -15, Happiness +10 | 4 hours |

---

## Equipment Shop

### Automation Items (15+)

**Temperature:**
- Heat mat (€50) - Maintains 80-85°F
- Ceramic heater (€75) - Precision control
- Thermostat (€100) - Auto-regulation

**Humidity:**
- Manual mister (€30) - One-time use
- Auto-misting system (€150) - Scheduled sprays
- Fogger (€120) - Constant humidity

**Feeding:**
- Auto-feeder (€200) - Scheduled feeding
- Food warmer (€80) - Optimal prey temp

**Comfort:**
- Hide box (€40) - Stress reduction
- Climbing branch (€60) - Enrichment
- UV light (€90) - Vitamin D

### Gold Economy

- Earn gold by caring for snakes (10 gold/action)
- Purchase equipment with gold
- Equipment reduces manual care frequency
- Auto-feeders can feed every 6 hours

---

## Species Profiles

### Ball Python

**Stats:**
- Temperature: 80-85°F optimal
- Humidity: 50-60%
- Feeding: Every 7-10 days (adults)
- Temperament: Docile, shy

**Care Level:** Beginner  
**Price Range:** €150-€2000 (depending on morph)

### Corn Snake

**Stats:**
- Temperature: 75-85°F optimal
- Humidity: 40-50%
- Feeding: Every 5-7 days (adults)
- Temperament: Active, friendly

**Care Level:** Beginner  
**Price Range:** €100-€500

---

## Snake Morphs

### Ball Python Morphs (10+)
- **Banana** - Yellow/tan with purple blush
- **Piebald** - White with patches of pattern
- **Pastel** - Lighter, brighter colors
- **Albino** - No melanin, red eyes
- **Lesser Platinum** - Silver/grey tones
- **Clown** - Dorsal stripe, head stamp
- **Spider** - Reduced pattern, head wobble gene
- **Enchi** - Brightened colors
- **Mojave** - Purple/brown, clean pattern
- **Cinnamon** - Brown/red tones

### Corn Snake Morphs
- **Amelanistic** - No black pigment
- **Snow** - White/pink, red eyes
- **Ghost** - Hypomelanistic + anerythristic
- **Hypo** - Reduced black pigment
- **Bloodred** - Deep red/orange

---

## Snake Collection Farm

### Farm System Overview

**Concept:** When you own 10+ snakes, you unlock "farm" features for breeding and collection management.

### Farm Levels

| Level | Requirement | Benefits |
|-------|-------------|----------|
| **Level 0** | 0-9 snakes | Basic care only |
| **Level 1** | 10-19 snakes | Breeding UI unlocked |
| **Level 2** | 20+ snakes | Advanced breeding, genetics calculator |

**Current Status:** 24 breeding snakes = **Level 2 Farm** ✅

### Collection Data

**24 Breeding Snakes:**
- 17 Ball Pythons (various morphs)
- 7 Corn Snakes (various morphs)

**1 Baby for Sale:**
- Baby Ball Python - €150

**Total:** 25 snakes in collection

### Data Structure

Each snake has 18 fields:
1. **ID** - Unique identifier (1-25)
2. **Name** - Full name ("Pudding Banana H. Clown")
3. **Short Name** - Nickname ("Pudding")
4. **Species** - ball_python or corn_snake
5. **Morph** - Genetic pattern
6. **Gender** - Male or Female
7. **YOB** - Year of Birth (2021, 2023, 2024)
8. **Age (months)** - Calculated from YOB
9. **Weight (grams)** - Current weight
10. **Length (cm)** - Current length
11. **Status** - farm_breeding or available_for_sale
12. **For Sale** - true/false
13. **Price** - EUR (if for sale)
14. **Breeding Potential** - high, proven_breeder, future
15. **Health Status** - excellent, good, fair
16. **Temperament** - docile, calm, shy, active
17. **Feeding Schedule** - weekly, every_5_days, etc.
18. **Last Fed** - ISO timestamp

**Missing from Original Data:**
- Weight (all null) - Estimated based on age/species
- Length (not provided) - Estimated
- Age (not calculated) - Derived from YOB
- All metadata fields - Added by system

---

## Breeding System (Future)

**Status:** Not yet implemented  
**Planned Features:**
- Pair compatible snakes
- Incubate eggs (60-90 days)
- Hatch babies with genetic combinations
- Genetics calculator (dominant/recessive traits)
- Breeding cooldown (females: 1 year)

---

## Business Rules

### Purchase Flow
1. User browses catalog (real snakes only)
2. Pays via Stripe Checkout
3. Webhook assigns snake to user's KV storage
4. Snake appears in game.html with full stats
5. Email confirmations sent (customer + admin)

### Farm Snakes (24 breeding)
- **NOT for sale** - Farm inventory only
- **Purpose:** Breeding, collection display
- **Status:** `farm_breeding` in KV
- **Visible:** In collection view, not catalog

### Sale Snakes (1 baby)
- **FOR sale** - Listed in catalog
- **Price:** €150 (baby Ball Python)
- **Status:** `available_for_sale` in KV
- **Stripe link:** Active payment link

---

## Stripe Sync Workflow

### 4-Step Process (v0.7.0)

**Script 1:** `scripts/1-clear-stripe-products.sh`
- Clears all test Stripe products
- Safety: Requires "DELETE" confirmation

**Script 2:** `scripts/2-upload-products-to-stripe.sh`
- Reads `data/new-products-2025.json`
- Creates 24 Stripe products
- Uses idempotency keys (no duplicates)

**Script 3:** `scripts/3-import-stripe-to-kv.sh`
- Fetches from Stripe API
- Transforms to KV format
- Uploads to Cloudflare PRODUCTS namespace

**Script 4:** `scripts/4-verify-sync.sh`
- Verifies Stripe count
- Verifies KV count
- Checks data integrity

---

## Economics

### Pricing Strategy
- **Baby snakes:** €100-€200
- **Adults (common morph):** €300-€600
- **Adults (rare morph):** €800-€2000
- **Proven breeders:** +50% premium

### Gold System (In-Game Currency)
- **Earn:** 10 gold per care action
- **Spend:** Equipment (€1 = 100 gold)
- **Future:** Breeding fees, upgrades

---

## Quick Reference

### Commands
```bash
# Sync Stripe → KV
bash scripts/sync-products-master.sh

# Verify sync
bash scripts/4-verify-sync.sh

# Clear test data
bash scripts/clear-test-data.sh
```

### API Endpoints
- `GET /products` - Catalog (for sale only)
- `GET /user-products?user=hash` - User's collection
- `POST /stripe-webhook` - Purchase handler

---

## Sources

Consolidated from:
- `/docs/business/MISSING-FIELDS.md` - Data field documentation
- `/docs/BUSINESS_RULES.md` - Business logic
- `/docs/STRIPE-KV-SYNC-WORKFLOW.md` - Sync process
- `data/new-products-2025.json` - Collection data
- `/STRIPE-SYNC-COMPLETE.md` - v0.7.0 implementation

---

**Last Updated:** 2025-12-28T20:54:38Z
