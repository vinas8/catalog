# Godot RPG → Farming Game - Implementation Plan

**SMRI Code:** S9.2,6.01 (New farming module, uses game+testing)

## 📺 Tutorial Source
**Playlist:** https://youtube.com/playlist?list=PL9FzW-m48fn2SlrW0KoLT4n5egNdX-W9a&si=sREWspajKQlKFQGa

**Strategy:** 
1. **Phase 1:** Clone Action RPG tutorial (movement, sprites, map, animations) 
2. **Phase 2:** Evolve into Stardew Valley farming gameplay

**Goal:** Start with solid game foundation (movement, world, rendering), then add farming/life-sim mechanics.

---

## 🎯 PHASE 1: Clone Action RPG Foundation (Videos 1-22)

### 1. **Player Movement & Animation** (Videos 1-6)
- [ ] Basic 8-directional movement
- [ ] Delta time for smooth motion
- [ ] AnimationPlayer equivalent in JavaScript
- [ ] Sprite sheet animations
- [ ] Animation state tree

### 2. **World & Rendering** (Videos 7-8)
- [ ] Tile-based map system
- [ ] Autotile/tileset rendering
- [ ] YSort (depth sorting)
- [ ] Collision layers
- [ ] Canvas rendering engine

### 3. **Combat System** (Videos 9-13)
- [ ] Attack animations
- [ ] State machine (idle, move, attack, roll)
- [ ] Hitbox/Hurtbox system
- [ ] Knockback physics
- [ ] Roll/dodge mechanic

### 4. **Enemy AI** (Videos 14-21)
- [ ] Enemy stats system
- [ ] Basic AI behaviors (wander, chase)
- [ ] Pathfinding
- [ ] Soft collisions
- [ ] Death/spawn effects

### 5. **UI & Polish** (Videos 18, 22)
- [ ] Health/hearts display
- [ ] Camera follow player
- [ ] Camera limits
- [ ] Sound effects
- [ ] Hit flash effects

---

## 🌾 PHASE 2: Add Farming/Stardew Elements

### 1. **Replace Combat with Farming Tools**
- [ ] Hoe tool (replace sword attack animation)
- [ ] Watering can (use attack hitbox for area)
- [ ] Axe and Pickaxe
- [ ] Tool upgrade system

### 2. **Crop System**
- [ ] Tilling soil (change tile state)
- [ ] Planting seeds (inventory → tile)
- [ ] Watering (tile moisture state)
- [ ] Growth stages (time-based)
- [ ] Harvesting (collect to inventory)
- [ ] Seasonal system

### 3. **Animal Husbandry & Snakes** 
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

## 📝 Implementation Timeline

### Week 1-2: Core Game Engine (Videos 1-8)
- [ ] Day 1-2: Player movement system
- [ ] Day 3-4: Animation system
- [ ] Day 5-6: Tile-based world rendering
- [ ] Day 7: Collision system
- [ ] Day 8-9: Canvas optimization
- [ ] Day 10: Camera system

**Deliverable:** Player can walk around a tile-based world

### Week 3: State Machine & Interaction (Videos 9-13)
- [ ] Day 1-2: State machine pattern
- [ ] Day 3-4: Action/interaction hitboxes
- [ ] Day 5: Roll/dash mechanic
- [ ] Day 6-7: Knockback & physics

**Deliverable:** Player can interact with world (attack → till soil)

### Week 4: Entity System (Videos 14-21)
- [ ] Day 1-3: Entity/stats system
- [ ] Day 4-5: AI behaviors (for animals)
- [ ] Day 6-7: Spawning system

**Deliverable:** Moving entities (enemies → animals)

### Week 5-6: Convert to Farming Mechanics
- [ ] Day 1-2: Replace combat with farming tools
- [ ] Day 3-4: Crop planting/growth system
- [ ] Day 5-6: Inventory & storage
- [ ] Day 7-8: Time/day cycle
- [ ] Day 9-10: Shop & economy

**Deliverable:** Playable farming game

### Week 7-8: Snake Integration & Polish
- [ ] Day 1-3: Integrate snake breeding system
- [ ] Day 4-5: NPCs & dialogue
- [ ] Day 6-8: UI/UX polish
- [ ] Day 9-10: Testing & bug fixes

**Deliverable:** Full game with snakes + farming

---

## 🎨 Visual Style

**Option A:** Canvas-based pixel art (like tutorial)
**Option B:** HTML/CSS grid with sprites
**Option C:** Hybrid (Canvas for farm, HTML for UI)

**Recommendation:** Start with HTML/CSS grid for rapid prototyping, migrate to Canvas if performance issues.

---

## 🎓 Tutorial → JavaScript Translation Guide

### Godot → JavaScript Mapping

| Godot Concept | JavaScript Equivalent |
|---------------|----------------------|
| `Node2D` | Canvas sprite object |
| `KinematicBody2D` | Entity with collision |
| `move_and_slide()` | Custom physics function |
| `AnimationPlayer` | Sprite sheet animator |
| `AnimationTree` | State machine class |
| `Area2D` (hitbox) | Collision rectangle |
| `TileMap` | 2D array + tile rendering |
| `YSort` | Z-index sorting |
| `Signal` | EventEmitter/callbacks |
| `Vector2` | `{x, y}` object |
| `delta` | `deltaTime` from RAF |

### Key Videos to Watch First

**Priority 1 (Foundation):**
- Video 1-3: Movement basics
- Video 7-8: Tile system
- Video 9: State machines

**Priority 2 (Mechanics):**
- Video 5-6: Animation system
- Video 10: Signals/events
- Video 20: Camera

**Priority 3 (Optional for MVP):**
- Combat videos (adapt to farming)
- Enemy AI (adapt to animals)
- UI/polish videos

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
