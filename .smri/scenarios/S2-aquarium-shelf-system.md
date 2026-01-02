# S2-aquarium-shelf-system - Aquarium Shelf Collection System

**ID:** S2-aquarium-shelf-system  
**Version:** 1.0  
**Priority:** P0  
**Status:** Draft  
**Created:** 2026-01-02

---

## Overview

Redesign game.html to display snake collection as aquarium shelves instead of card grid. Users can manage multiple snakes across shelves, swipe between shelves, and view individual snake stats in mobile-friendly detail view.

---

## User Story

**As a** snake collector  
**I want** to view my snakes in aquarium shelves  
**So that** I can visually organize and manage multiple snakes like a real collection

---

## Requirements

### Core Features
1. **Shelf System**
   - Max 10 aquariums per shelf
   - Auto-create new shelves when > 10 snakes
   - Swipe/scroll between shelves
   - Show current shelf indicator (e.g., "Shelf 1 of 3")

2. **Aquarium Display**
   - Visual tank/terrarium per snake
   - Snake emoji/avatar inside (changes by state)
   - Snake name label
   - Click to expand detail view

3. **Clean All Button**
   - 🧹 emoji button
   - Cleans all aquariums on current shelf
   - Shows confirmation feedback
   - Updates all snake cleanliness stats

4. **Detail View**
   - Full-screen or modal overlay
   - Mobile-friendly stats table
   - All 8 stats displayed
   - Feeding schedule info
   - Care history
   - Close button to return to shelf

5. **NO Manual Feeding Buttons**
   - Automatic care system
   - Stats shown as read-only
   - Calendar shows next auto-feed time

---

## Technical Architecture

### Modules (Plain Static JS)

```
src/modules/game/
├── shelf-manager.js      # Main shelf controller
├── aquarium-shelf.js     # Single shelf renderer
├── snake-aquarium.js     # Individual tank component
├── snake-detail-view.js  # Expanded stats modal
└── game-controller.js    # Updated to use shelf system
```

### Data Structure

```javascript
gameState = {
  snakes: [
    {
      id: 'snake-1',
      nickname: 'Banana',
      stats: { ... },
      enclosure_tier: 3,
      last_fed: '2026-01-02T12:00:00Z',
      last_cleaned: '2026-01-02T08:00:00Z'
    }
  ],
  ui: {
    current_shelf: 0,
    shelves_per_page: 1
  }
}
```

---

## UI Layout

### Mobile (< 768px)
```
┌─────────────────────────┐
│  🧹 Clean All    1/3 ◄ ►│
├─────────────────────────┤
│  ┌───┐ ┌───┐ ┌───┐     │
│  │🐍 │ │😋 │ │🤢 │     │ ← Aquariums (scroll horizontal)
│  └───┘ └───┘ └───┘     │
│  Name1  Name2  Name3    │
└─────────────────────────┘
```

### Desktop (> 768px)
```
┌────────────────────────────────────┐
│    🧹 Clean All Shelf    1 of 3  ◄ ►│
├────────────────────────────────────┤
│ ┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌───┐    │
│ │🐍 │ │😋 │ │🤢 │ │🔵 │ │😊 │    │
│ └───┘ └───┘ └───┘ └───┘ └───┘    │
│ Name1 Name2 Name3 Name4 Name5     │
│                                    │
│ ┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌───┐    │
│ │🐍 │ │😰 │ │🐍 │ │🐍 │ │🐍 │    │
│ └───┘ └───┘ └───┘ └───┘ └───┘    │
│ Name6 Name7 Name8 Name9 Name10    │
└────────────────────────────────────┘
```

---

## Test Scenarios

### Scenario 1: Single Snake
- User has 1 snake
- Shows 1 shelf, 1 aquarium
- No shelf navigation arrows
- Clean All cleans 1 tank

### Scenario 2: Full Shelf (10 snakes)
- User has 10 snakes
- Shows 1 shelf, 10 aquariums (2 rows)
- No navigation arrows
- Clean All cleans all 10

### Scenario 3: Multiple Shelves (25 snakes)
- User has 25 snakes
- Shows shelf 1 (10), 2 (10), 3 (5)
- Navigation arrows enabled
- Clean All only affects current shelf
- Swipe to next shelf

### Scenario 4: Detail View
- User clicks aquarium
- Modal/overlay opens
- Shows stats table
- Close returns to shelf view
- Navigation remains on same shelf

### Scenario 5: Clean All Action
- User clicks 🧹 Clean All
- All aquariums flash green
- All cleanliness stats → 100%
- Show notification "✅ Cleaned 10 aquariums!"
- Stats update visually

---

## Snake Avatar States

| State | Emoji | Condition |
|-------|-------|-----------|
| Normal | 🐍 | All stats healthy |
| Hungry | 😋 | hunger < 30% |
| Sick | 🤢 | health < 30% |
| Shedding | 🔵 | shed_cycle.stage = 'blue' |
| Happy | 😊 | happiness > 80% |
| Stressed | 😰 | stress > 70% |

---

## Mobile Stats Table Format

```
┌──────────────────────────┐
│     🐍 Banana (Close X)  │
├──────────────────────────┤
│ Stat         Value  Bar  │
├──────────────────────────┤
│ 🍖 Hunger     85%  ████▓ │
│ 💧 Water     100%  █████ │
│ 🌡️ Temp       80%  ████░ │
│ 💦 Humidity   60%  ███░░ │
│ 💚 Health    100%  █████ │
│ 😰 Stress     15%  █░░░░ │
│ 🧹 Clean      95%  ████▓ │
│ 😊 Happy      90%  ████▓ │
├──────────────────────────┤
│ 📅 Next Feed: 3 days     │
│ 🧹 Last Clean: 2h ago    │
│ 🔄 Shed: Normal (5d ago) │
└──────────────────────────┘
```

---

## Debug Access

**Quick Access:** `/debug/aquarium-shelf-demo.html`  
**Scenario Runner:** `S2-aquarium-shelf-system`

Test data presets:
- 1 snake (single aquarium)
- 10 snakes (full shelf)
- 25 snakes (3 shelves)
- Mixed states (hungry, sick, happy)

---

## Success Criteria

- ✅ Displays snakes in aquarium shelves (max 10 per shelf)
- ✅ Swipe/scroll between shelves works
- ✅ Clean All button updates all snakes on current shelf
- ✅ Click aquarium opens detail view
- ✅ Detail view shows mobile-friendly stats table
- ✅ No manual feeding buttons (auto care system)
- ✅ Snake avatars change by state
- ✅ Works on mobile (< 768px) and desktop
- ✅ All tests pass (unit + integration)

---

## Dependencies

- `src/modules/game/game-controller.js` (main controller)
- `src/modules/game/constants.js` (stat definitions)
- `styles.css` (aquarium shelf styles)

---

## Related Scenarios

- S2-tutorial-happy-path (basic snake care)
- S2-tutorial-missed-care (stat decay system)

---

**Status:** Ready for implementation  
**Next Step:** Create shelf-manager.js module
