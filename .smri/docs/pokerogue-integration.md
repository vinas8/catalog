# PokeRogue Integration Plan - Serpent Town v0.7.7

**Created:** 2026-01-07  
**Status:** 🚧 Planning Phase  
**License:** AGPL-3.0 (must credit & share source)

---

## 🎯 Goal

Adapt **PokeRogue's TypeScript game engine** for Serpent Town's snake breeding game while respecting AGPL-3.0 license.

**Repository:** https://github.com/pagefaultgames/pokerogue

---

## 📋 What We Can Use

### ✅ Usable Components (TypeScript → JS)

#### 1. **Data Structures** (`src/data/`)
- `pokemon-species.ts` → Snake species data model
- `pokemon-data.ts` → Snake individual data
- `nature.ts` → Personality traits
- `type.ts` → Morph categories
- `exp.ts` → Growth/leveling system

**Example:**
```typescript
// PokeRogue Pokemon
new PokemonSpecies(
  SpeciesId.BULBASAUR, 
  1, false, false, false, 
  "Seed Pokémon", 
  PokemonType.GRASS, 
  PokemonType.POISON, 
  0.7, 6.9, 
  AbilityId.OVERGROW,
  ...
)

// Adapt to Snake
new SnakeSpecies(
  SpeciesId.BALL_PYTHON,
  1, "Normal Ball Python",
  MorphType.NORMAL,
  null,
  1.2, 1500, // length (m), weight (g)
  50, // price
  "common"
)
```

#### 2. **UI Handlers** (`src/ui/handlers/`)
- `pokedex-ui-handler.ts` → Snake Dex UI
- `party-ui-handler.ts` → Collection management
- `summary-ui-handler.ts` → Individual snake stats
- `egg-gacha-ui-handler.ts` → Breeding mechanics
- `starter-select-ui-handler.ts` → Shop selection

#### 3. **UI Components** (`src/ui/`)
- Grid layouts
- Stat panels
- Filter systems
- Navigation patterns

---

## 🚫 What We CAN'T Use

- ❌ **Pokemon assets** (copyrighted by Nintendo/Game Freak)
- ❌ **Pokemon names/sprites** (trademark infringement)
- ❌ **Battle animations** specific to Pokemon
- ⚠️ **Any code without proper attribution**

---

## 📜 License Compliance (AGPL-3.0)

### Requirements:
1. ✅ **Attribution** - Credit PokeRogue in our README
2. ✅ **Share Source** - Our code stays open-source (already MIT)
3. ✅ **License Notice** - Add SPDX headers to adapted files
4. ✅ **Changelog** - Document what we adapted

### Attribution Template:
```markdown
## Credits

**Game Engine:**  
Portions of this project's data structures and UI patterns are adapted from [PokeRogue](https://github.com/pagefaultgames/pokerogue) (AGPL-3.0).  
Original authors: Pagefault Games  
Modifications: Adapted for snake breeding mechanics
```

---

## 🔧 Integration Strategy

### Phase 1: Data Model Port (TypeScript → JavaScript)
```bash
# Convert PokeRogue data structures
/tmp/pokerogue/src/data/pokemon-species.ts → /root/catalog/src/data/snake-species.js
/tmp/pokerogue/src/data/pokemon-data.ts → /root/catalog/src/data/snake-data.js
```

**Tasks:**
- [ ] Create `src/data/snake-species.js` from Pokemon species structure
- [ ] Port growth/experience system (`exp.ts`)
- [ ] Adapt nature/personality system
- [ ] Add SPDX license headers

### Phase 2: UI System Port
```bash
# Adapt UI handlers
/tmp/pokerogue/src/ui/handlers/pokedex-ui-handler.ts → /root/catalog/dex/snake-dex.js
/tmp/pokerogue/src/ui/handlers/party-ui-handler.ts → /root/catalog/src/modules/collection/party.js
```

**Tasks:**
- [ ] Port Pokedex grid layout to Snake Dex
- [ ] Adapt stat panel rendering
- [ ] Implement filter/search system
- [ ] Create navigation patterns

### Phase 3: Game Mechanics
```bash
# Breeding system
/tmp/pokerogue/src/data/egg.ts → /root/catalog/src/modules/breeding/egg-system.js
```

**Tasks:**
- [ ] Port egg/breeding mechanics
- [ ] Adapt evolution chains for snake morphs
- [ ] Create genetics calculator logic

---

## 🎨 What We Build From Scratch

### Original Serpent Town Code:
- ✅ **Snake-specific logic** (care stats, feeding, temperature)
- ✅ **Stripe integration** (payments, webhooks)
- ✅ **Cloudflare Worker** (backend API)
- ✅ **Shop/catalog** (already working)
- ✅ **Tutorial system** (SMRI scenarios)

### Adapted from PokeRogue:
- 🔄 **Data structure patterns** (how to organize species)
- 🔄 **UI layout patterns** (grid, panels, navigation)
- 🔄 **Stat calculation systems** (experience, growth)

---

## 📁 File Structure After Integration

```
catalog/
├── src/
│   ├── data/
│   │   ├── snake-species.js       (adapted from pokemon-species.ts)
│   │   ├── snake-data.js          (adapted from pokemon-data.ts)
│   │   ├── morph-types.js         (adapted from type.ts)
│   │   ├── growth-rates.js        (adapted from exp.ts)
│   │   └── ATTRIBUTION.md         (PokeRogue credits)
│   ├── modules/
│   │   ├── dex/
│   │   │   ├── snake-dex-ui.js   (adapted from pokedex-ui-handler.ts)
│   │   │   └── dex-filters.js
│   │   ├── collection/
│   │   │   └── party-ui.js       (adapted from party-ui-handler.ts)
│   │   └── breeding/
│   │       └── egg-system.js     (adapted from egg.ts)
├── dex.html                       (Snake Dex page)
└── CREDITS.md                     (Full attribution)
```

---

## 🚀 Implementation Steps

### Step 1: Set Up Attribution (Now)
```bash
# Create credits file
echo "# Credits\n\n**Game Engine:**\nPortions adapted from PokeRogue (AGPL-3.0)\nhttps://github.com/pagefaultgames/pokerogue" > /root/catalog/CREDITS.md

# Update README
# Add PokeRogue attribution section
```

### Step 2: Port Data Structures (Week 1)
```bash
# Convert TypeScript → JavaScript
# Test with existing snake data
# Validate structure matches shop/collection
```

### Step 3: UI Components (Week 2)
```bash
# Build Snake Dex with PokeRogue grid layout
# Implement stat panels
# Add filtering/search
```

### Step 4: Advanced Features (Week 3+)
```bash
# Breeding mechanics
# Genetics calculator
# Growth/experience system
```

---

## ✅ Benefits of Using PokeRogue

1. **Proven Architecture** - Battle-tested game engine
2. **Rich Data Models** - Comprehensive stat/species system
3. **Professional UI** - Polished, responsive interfaces
4. **Active Development** - Maintained, documented codebase
5. **Legal Use** - AGPL-3.0 allows adaptation with attribution

---

## ⚠️ Risks & Mitigation

| Risk | Mitigation |
|------|------------|
| **License Violation** | Add proper SPDX headers, credits file |
| **TypeScript Complexity** | Convert only what we need to plain JS |
| **Over-Engineering** | Start with data models, add UI incrementally |
| **Maintenance Burden** | Document all adaptations clearly |

---

## 📊 Progress Tracking

- [ ] **Phase 1:** Data model port (0%)
- [ ] **Phase 2:** UI system port (0%)
- [ ] **Phase 3:** Game mechanics (0%)
- [ ] **Attribution:** Credits file created
- [ ] **Testing:** Integrated components work

---

## 🐍 Next Actions

1. **Create CREDITS.md** with PokeRogue attribution
2. **Port snake-species.js** from pokemon-species.ts
3. **Test data structure** with existing shop data
4. **Build prototype Snake Dex** using PokeRogue UI patterns

---

**Status:** Ready to begin Phase 1 🚀  
**License:** Compliant with AGPL-3.0  
**Built with ❤️ and 🐍**
