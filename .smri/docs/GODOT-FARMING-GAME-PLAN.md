# Godot Farming Game - Implementation Plan

**SMRI Code:** S9.2,6.01 (New farming module, uses game+testing)

## 📺 Tutorial Source
**Playlist:** https://youtube.com/playlist?list=PL9FzW-m48fn2SlrW0KoLT4n5egNdX-W9a&si=sREWspajKQlKFQGa

**Goal:** Clone Stardew Valley-type mechanics from tutorial series, implement in JavaScript/HTML5 for web, integrate with existing Snake Muffin game.

---

## 🎯 Core Features to Clone from Tutorial

### 1. **Farming System**
- [ ] Tilling soil
- [ ] Planting seeds
- [ ] Watering crops
- [ ] Growth stages (day-based)
- [ ] Harvesting
- [ ] Seasonal crops
- [ ] Crop quality system

### 2. **Animal Husbandry** 
- [ ] Animal housing (coops, barns)
- [ ] Feeding animals
- [ ] Collecting products (eggs, milk, etc.)
- [ ] Animal happiness/health
- [ ] **Integration:** Merge with existing snake care system

### 3. **Time System**
- [ ] Day/night cycle
- [ ] Energy system (stamina)
- [ ] Calendar (seasons, days)
- [ ] Weather system
- [ ] Sleep/save mechanic

### 4. **Economy**
- [ ] Selling crops/products
- [ ] Buying seeds/animals
- [ ] **Integration:** Use existing Stripe shop for real money items
- [ ] In-game currency for daily items

### 5. **Tools & Crafting**
- [ ] Watering can
- [ ] Hoe
- [ ] Axe
- [ ] Pickaxe
- [ ] Tool upgrades
- [ ] Crafting recipes

### 6. **World/Map**
- [ ] Tile-based grid system
- [ ] Farm layout
- [ ] Town/village area
- [ ] Shops
- [ ] NPC houses

### 7. **NPCs & Social**
- [ ] Dialogue system
- [ ] Gift-giving
- [ ] Friendship levels
- [ ] Quests/missions

---

## 🏗️ Architecture Plan

### Current Snake Muffin Structure
```
src/modules/
├── game/           ← Tamagotchi care (8 vital stats)
├── shop/           ← Product catalog
├── payment/        ← Stripe integration
└── breeding/       ← Genetics calculator
```

### New Farming Module Structure
```
src/modules/farming/
├── index.js                 ← Main facade
├── farm-controller.js       ← Game loop, time system
├── crops.js                 ← Crop data, growth logic
├── animals.js               ← Farm animals (chickens, cows, etc.)
├── tools.js                 ← Tool system, upgrades
├── world.js                 ← Tile map, collision
├── npc.js                   ← NPC dialogue, quests
└── data/
    ├── crops.json
    ├── animals.json
    ├── recipes.json
    └── npcs.json
```

---

## 🔄 Integration with Existing Systems

### 1. **Game Controller**
- Expand `game/game-controller.js` to support farming mechanics
- Add farming stats alongside snake care stats
- Unified time system (real-time vs in-game time)

### 2. **Shop System**
- Real money: Premium seeds, rare animals, cosmetics
- In-game currency: Daily seeds, basic tools
- Reuse `shop/` module

### 3. **Collection/Inventory**
- Expand to include crops, materials, crafted items
- Keep existing snake collection separate

### 4. **Storage**
- Use Cloudflare KV for user farm state
- LocalStorage for temporary/cache
- Save format: farm layout, crop positions, inventory

---

## 📝 Implementation Phases

### Phase 1: Core Farming (Week 1-2)
- [ ] Watch tutorials 1-5, take notes
- [ ] Create basic tile grid system
- [ ] Implement crop planting/growth
- [ ] Add watering mechanic
- [ ] Simple day/night cycle

### Phase 2: Tools & Energy (Week 3)
- [ ] Watch tutorials 6-10
- [ ] Tool system (hoe, watering can)
- [ ] Energy/stamina system
- [ ] Tool animations
- [ ] Sleep/save mechanic

### Phase 3: Animals & Economy (Week 4)
- [ ] Watch tutorials 11-15
- [ ] Add chickens, cows
- [ ] Product collection
- [ ] Shop for seeds/animals
- [ ] Currency system

### Phase 4: NPCs & Polish (Week 5-6)
- [ ] Watch remaining tutorials
- [ ] NPC dialogue
- [ ] Quest system
- [ ] Weather effects
- [ ] UI polish

---

## 🎨 Visual Style

**Option A:** Canvas-based pixel art (like tutorial)
**Option B:** HTML/CSS grid with sprites
**Option C:** Hybrid (Canvas for farm, HTML for UI)

**Recommendation:** Start with HTML/CSS grid for rapid prototyping, migrate to Canvas if performance issues.

---

## 📊 Tutorial Analysis Plan

### Method 1: Manual Notes
- Watch each video
- Document mechanics, formulas, systems
- Screenshot key diagrams

### Method 2: AI Transcription (Recommended)
- Use YouTube auto-captions
- Feed to AI for summarization
- Extract: mechanics, data structures, formulas

### Method 3: Code Analysis
- If tutorial provides GitHub repo
- Study Godot scripts
- Translate GDScript → JavaScript

---

## 🚀 Next Actions

1. **Immediate:**
   - [ ] Get YouTube video transcripts/captions
   - [ ] Create detailed notes document per video
   - [ ] Map Godot concepts → Web concepts

2. **Short-term:**
   - [ ] Prototype tile grid system
   - [ ] Test crop growth timing
   - [ ] Design farm UI mockup

3. **Long-term:**
   - [ ] Full game loop implementation
   - [ ] Multiplayer/social features?
   - [ ] Mobile app version?

---

## 📌 Key Decisions Needed

- **Godot → Web:** Use Godot export to HTML5 or pure JavaScript rewrite?
- **Real-time vs Turn-based:** How fast should crops grow?
- **Monetization:** What items are paid vs free?
- **Scope:** Full Stardew clone or simplified version?

---

**Status:** 📝 Planning  
**Created:** 2026-01-23  
**Last Updated:** 2026-01-23
