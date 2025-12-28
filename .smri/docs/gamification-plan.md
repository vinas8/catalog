# Gamification Plan - Snake Breeding & Collection

**Version:** 0.7.0  
**Last Updated:** 2025-12-28  
**Status:** Planning Phase  
**Priority:** Future Enhancement

---

## Overview

Plan to enhance Serpent Town with advanced gamification features using **plain JavaScript only** (GitHub Pages compatible):

1. **DNA/Breeding Calculator** - Genetics probabilities, Punnett squares
2. **Enhanced Dex/Collection** - Locked → unlocked progression
3. **Advanced Tamagotchi** - Growth stages, happiness, breeding readiness
4. **Customer Preference System** - Buy based on featured morphs/collections

---

## Current State Analysis

### ✅ What We Have (v0.7.0)

**Tech Constraints:**
- ✅ Pure HTML/CSS/JS (ES6 modules)
- ✅ No build step (GitHub Pages compatible)
- ✅ Zero dependencies (except Playwright for tests)
- ✅ Static files only

**State & Persistence:**
- ✅ LocalStorage for game state
- ✅ Cloudflare KV for purchases (backend)
- ✅ Single user per hash (no accounts yet)

**Data Model:**
- ✅ Snakes defined in JSON (`data/products.json`)
- ✅ Morphs in `src/modules/shop/data/morphs.js`
- ✅ Species profiles in `src/modules/shop/data/species-profiles.js`
- ✅ 24 breeding snakes + 1 for sale

**Current Features:**
- ✅ Product list/shop (`catalog.html`)
- ✅ Collection system (`game.html`)
- ✅ Basic Tamagotchi (8 stats, care actions)
- ✅ Equipment shop (15+ items)

**UI:**
- ✅ DOM-based (no Canvas)
- ✅ Mobile-responsive CSS
- ✅ Desktop-first design

### ❌ What We Need

**DNA/Breeding:**
- ❌ Genetics calculator (Punnett squares)
- ❌ Dominant/recessive trait system
- ❌ Probability calculations
- ❌ Breeding pairs UI

**Collection/Dex:**
- ❌ Locked morphs (not yet discovered)
- ❌ Unlock animations
- ❌ Rarity system
- ❌ Collection completion tracking

**Advanced Tamagotchi:**
- ❌ Growth stages (baby → juvenile → adult)
- ❌ Breeding readiness (age, health requirements)
- ❌ Happiness-based mechanics
- ❌ Life cycle (egg → hatch → grow → breed)

**Customer System:**
- ❌ Customer preference AI
- ❌ Featured morph demand
- ❌ Dynamic pricing based on rarity

---

## Feature Priority

### Phase 1: Enhanced Collection/Dex (Next)
**Goal:** Visual progression, rarity system  
**Effort:** 2-3 days  
**Value:** High (motivation to collect more)

**Tasks:**
1. Add `locked` state to morphs
2. Unlock animation when first purchased
3. Rarity tiers (Common, Uncommon, Rare, Legendary)
4. Collection completion % tracker
5. "Shiny" variants (1% chance)

### Phase 2: DNA/Breeding Calculator (High Priority)
**Goal:** Genetics simulation, breeding pairs  
**Effort:** 5-7 days  
**Value:** High (core gameplay loop)

**Tasks:**
1. Define gene system (dominant/recessive)
2. Punnett square calculator
3. Breeding pair selector UI
4. Probability display (25%/50%/75%/100%)
5. Egg incubation timer (60-90 days)
6. Hatch animation

### Phase 3: Advanced Tamagotchi (Medium Priority)
**Goal:** Life cycle, growth stages  
**Effort:** 3-4 days  
**Value:** Medium (depth, but not core)

**Tasks:**
1. Growth stages (0-3mo, 3-12mo, 12mo+)
2. Size/weight progression
3. Breeding readiness indicator
4. Age-based care requirements
5. Lifecycle events (shed, eat, hide)

### Phase 4: Customer Preference System (Future)
**Goal:** AI-driven demand, dynamic pricing  
**Effort:** 4-5 days  
**Value:** Low (nice-to-have)

**Tasks:**
1. Customer profiles (preferences)
2. Morph demand tracking
3. Dynamic pricing algorithm
4. "Trending" morphs UI
5. Special customer orders

---

## GitHub Examples to Study

### Genetics/Breeding Calculators

**Search Terms:**
- "genetics calculator javascript"
- "punnett square js"
- "breeding simulator javascript"
- "mendelian genetics js"

**Example Repos:**
```
# Look for:
- Simple gene representation (objects/strings)
- Probability calculations
- Punnett square visualization
- No external dependencies
```

### Collection/Dex Systems

**Search Terms:**
- "pokemon dex javascript"
- "collection tracker js"
- "unlock progression javascript"
- "achievement system js"

**Example Repos:**
```
# Look for:
- Locked/unlocked state management
- Progress tracking
- Rarity systems
- LocalStorage persistence
```

### Virtual Pet/Tamagotchi

**Search Terms:**
- "tamagotchi javascript github"
- "virtual pet js"
- "idle game timer js"
- "growth stages javascript"

**Example Repos:**
```
# Look for:
- Timer-based mechanics
- Stat decay systems
- Growth progression
- Save/load state
```

### Idle/Timer Mechanics

**Search Terms:**
- "idle game javascript"
- "timer based game js"
- "incremental game javascript"
- "offline progress js"

**Example Repos:**
```
# Look for:
- Offline time calculation
- Auto-save systems
- Reward intervals
- Progress bars
```

---

## Proposed Architecture

### File Structure (New)

```
src/modules/breeding/
  ├── index.js                  # Main breeding module
  ├── genetics-calculator.js    # Punnett square logic
  ├── breeding-pairs.js         # Pair selection
  ├── egg-incubator.js          # Timer-based hatching
  └── ui/
      ├── breeding-view.js      # Breeding UI
      └── calculator-view.js    # Genetics calculator UI

src/modules/collection/
  ├── index.js                  # Collection module
  ├── dex-manager.js            # Locked/unlocked state
  ├── rarity-system.js          # Common/rare/legendary
  └── ui/
      └── dex-view.js           # Dex UI with unlock animations

src/modules/game/lifecycle/
  ├── growth-stages.js          # Baby → juvenile → adult
  ├── breeding-readiness.js     # Age/health requirements
  └── lifecycle-events.js       # Shed, eat, hide

data/genetics/
  ├── ball-python-genes.json    # Dominant/recessive traits
  └── corn-snake-genes.json     # Gene definitions
```

### Data Schemas

**Gene Definition:**
```json
{
  "gene_id": "banana",
  "display_name": "Banana",
  "type": "dominant",
  "alleles": ["Ba", "ba"],
  "visual_effect": "Yellow with purple blush",
  "compatibility": ["all"],
  "rarity": "uncommon"
}
```

**Breeding Pair:**
```json
{
  "pair_id": "pair_001",
  "male_id": "snake_001",
  "female_id": "snake_002",
  "status": "breeding",
  "started_at": "2025-12-28T21:00:00Z",
  "expected_eggs": 4,
  "incubation_days": 60,
  "hatch_date": "2026-02-26T21:00:00Z"
}
```

**Dex Entry:**
```json
{
  "morph_id": "banana",
  "name": "Banana Ball Python",
  "rarity": "uncommon",
  "locked": false,
  "first_unlocked": "2025-12-28T21:00:00Z",
  "owned_count": 3,
  "shiny": false,
  "description": "Bright yellow with purple blush"
}
```

---

## Implementation Strategy

### Simplest Viable Approach

**Avoid Overengineering:**
1. Start with **Punnett square only** (no complex genetics)
2. Use **simple probability** (50%/50%, 25%/75%)
3. DOM-based UI (no Canvas)
4. LocalStorage for everything (no backend changes)
5. Manual unlock (no auto-discovery)

**Minimal Genetics System:**
```javascript
// Simple 2-allele model
const parents = {
  male: { gene1: 'Ba', gene2: 'ba' },    // Banana het
  female: { gene1: 'ba', gene2: 'ba' }   // Normal
};

// Punnett square: 4 outcomes
const offspring = [
  { gene1: 'Ba', gene2: 'ba', phenotype: 'Banana', probability: 0.5 },
  { gene1: 'ba', gene2: 'ba', phenotype: 'Normal', probability: 0.5 }
];
```

**Minimal Dex:**
```javascript
const dex = {
  'banana': { locked: false, owned: 3 },
  'piebald': { locked: true, owned: 0 },  // Not yet discovered
  'albino': { locked: false, owned: 1 }
};
```

---

## Constraints

### Hard Requirements

✅ **GitHub Pages Compatible:**
- No server-side code
- Pure static files
- No build step (or optional Vite)

✅ **Plain JavaScript:**
- No React/Vue/Angular
- No Phaser/PixiJS engines
- ES6 modules only

✅ **Data-Driven:**
- JSON files for genes/morphs
- Easy to add new morphs
- No hardcoded genetics

✅ **Mobile-Friendly:**
- Touch controls
- Responsive design
- Small screen support

### Soft Preferences

⚠️ **Keep Simple:**
- Start with 2-gene system (expand later)
- DOM over Canvas (easier maintenance)
- LocalStorage over IndexedDB (simpler)

⚠️ **Extensible:**
- Modular architecture
- Plugin system for new features
- Easy to add species

---

## Next Steps

### 1. Research Phase (1-2 days)
- [ ] Search GitHub for plain-JS genetics examples
- [ ] Find Punnett square visualizations
- [ ] Study collection/dex systems
- [ ] Review timer-based mechanics

### 2. Design Phase (1 day)
- [ ] Finalize gene data structure
- [ ] Design breeding UI mockup
- [ ] Plan dex unlock flow
- [ ] Define growth stages

### 3. Implementation Phase (2-3 weeks)
- [ ] Phase 1: Enhanced Dex (2-3 days)
- [ ] Phase 2: Genetics Calculator (5-7 days)
- [ ] Phase 3: Advanced Tamagotchi (3-4 days)
- [ ] Phase 4: Customer System (4-5 days)

### 4. Testing Phase (3-5 days)
- [ ] Unit tests for genetics logic
- [ ] E2E breeding flow tests
- [ ] Dex unlock tests
- [ ] Performance testing

---

## Questions for User

### Tech Constraints
1. ✅ Pure HTML/CSS/JS? **YES**
2. ✅ Build step allowed? **NO** (GitHub Pages static)
3. ✅ ES modules? **YES** (already using)

### State & Persistence
4. ✅ LocalStorage or backend? **LocalStorage for game, KV for purchases**
5. ✅ Single user or accounts? **Single user per hash**

### Data Model
6. ✅ Where are snakes defined? **JSON + modules**
7. ❓ Gene representation? **TBD** (strings? objects? bitmasks?)

### Current Features
8. ✅ Product list? **YES** (catalog.html)
9. ✅ Collection system? **YES** (game.html)

### UI Scope
10. ✅ Canvas or DOM? **DOM-based**
11. ✅ Mobile-first? **Desktop-first, mobile-responsive**

### Priority
12. ❓ Which first? **User to decide:**
    - Dex/collection enhancement?
    - DNA calculator?
    - Advanced Tamagotchi?
    - Customer preference system?

---

## Copy-Paste Prompt for Copilot

**Use this when ready to start implementation:**

```
I want to gamify my e-commerce using plain JavaScript only (GitHub Pages compatible).
The game loop is:

- Collect snakes
- Each snake has morphs/genes
- DNA/breeding calculator (probabilities, Punnett squares)
- Dex/collection (locked → unlocked)
- Virtual snake/Tamagotchi mode (feed, grow, timers, happiness)
- Optional: customers buy based on collections/featured morphs

Current state:
- Pure HTML/CSS/JS (ES6 modules)
- LocalStorage for game state
- Snakes in JSON, morphs in modules
- Basic Tamagotchi already working (8 stats, care actions)
- 24 breeding snakes in collection

I need you to:
1. Find plain-JS GitHub repos for genetics calculators, dex systems, virtual pets
2. Recommend specific patterns/files/functions to copy
3. Give architecture advice that fits my repo

Constraints:
❌ No frameworks (React, Vue, Phaser)
❌ No backend required
✅ GitHub Pages compatible
✅ Data-driven (JSON-first)
✅ Easy to extend

Start with Phase 1: Enhanced Dex/Collection (locked morphs, rarity, unlock animations).
```

---

## Sources

- User-provided gamification prompt (2025-12-28)
- Current codebase analysis (v0.7.0)
- Existing modules: game, shop, collection

---

**Last Updated:** 2025-12-28T21:09:38Z
