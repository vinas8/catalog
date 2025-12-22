# Game Module

**Version:** 0.1.0  
**Path:** `src/modules/game/`  
**Status:** ✅ Enabled  

---

## 📋 Overview

Tamagotchi-style snake care game with stats, decay, equipment shop, and breeding mechanics.

---

## 🎯 Features

- **8-stat system** (Hunger, Water, Temp, Humidity, Health, Stress, Cleanliness, Happiness)
- **Stat decay** over time (real-time or accelerated)
- **Care actions** (Feed, Water, Clean)
- **Equipment shop** (Auto-feeders, thermostats, misting systems)
- **Breeding system** (Unlock new morphs)
- **Species dex** (Track all owned morphs)

---

## 📁 Structure

```
src/modules/game/
├── game-state.js           # LocalStorage persistence
├── snake-care.js           # Care actions & stat updates
├── equipment-shop.js       # Shop items & upgrades
├── breeding.js             # Genetics & offspring
├── species-dex.js          # Collection tracker
├── plugins/
│   ├── decay-plugin.js     # Stat decay over time
│   └── equipment-effects.js # Auto-equipment logic
└── index.js                # Module exports
```

---

## 📊 Stats System

### Base Stats (0-100 scale)
| Stat | Decay Rate (per hour) | Critical Threshold |
|------|----------------------|-------------------|
| Hunger | -2.0 to -2.5 | < 20 |
| Water | -3.0 | < 15 |
| Temperature | -1.5 | < 30 or > 95 |
| Humidity | -2.0 | < 40 |
| Cleanliness | -1.0 to -1.5 | < 25 |
| Health | -0.5 (if other stats low) | < 30 |
| Stress | +1.0 (increases) | > 70 |
| Happiness | -0.5 | < 40 |

### Care Actions
```javascript
// Feed snake
feed(snakeId) // Hunger +40, Stress -5

// Give water
water(snakeId) // Water +50, Stress -2

// Clean enclosure
clean(snakeId) // Cleanliness +30, Stress -10
```

---

## 🛒 Equipment Shop

### Auto-Maintenance Items
| Item | Cost (Gold) | Effect |
|------|------------|--------|
| Auto-Feeder | 500 | Hunger +10/day |
| Auto-Waterer | 400 | Water +15/day |
| Auto-Mister | 600 | Humidity +8/day |
| Thermostat | 800 | Temp stable ±2° |

### Upgrades
| Item | Cost | Effect |
|------|------|--------|
| Premium Substrate | 300 | Cleanliness decay -50% |
| UV Light | 450 | Happiness +5, Health +2 |
| Hide Box | 200 | Stress -10 |

---

## 🧬 Breeding System

**Requirements:**
- 2 snakes of same species
- Both Happiness > 70
- Both Health > 80
- Cooldown: 30 days (in-game)

**Genetics:**
```javascript
breedSnakes(snake1, snake2) => offspring {
  species: same as parents,
  morph: genetic_combination(parent1.morph, parent2.morph),
  traits: inherited_mix(parent1, parent2)
}
```

---

## 🧪 Testing

```bash
npm test tests/modules/game/
```

**Tests:**
- `tamagotchi.test.js` - Stats, decay, care actions
- `snakes.test.js` - Snake lifecycle
- `plants.test.js` - Enclosure plants
- `dex.test.js` - Species collection

---

## 🚫 Disable This Module

**Edit `src/modules/game/index.js`:**
```javascript
export const ENABLED = false;
```

**Effect:** Shop-only mode (no Tamagotchi gameplay).

---

## 📦 Dependencies

- **Shop Module**: Purchase snakes to add to farm
- **Common Module**: Date utilities, random helpers
- **LocalStorage**: Game state persistence

---

## 🔗 Related

- [Shop Module](./shop.md) - Buy snakes
- [Common Module](./common.md) - Shared utilities
- [Game Page](../../game.html) - Main game UI
