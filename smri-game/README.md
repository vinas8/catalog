# 🐍 SMRI Game - Serpent Town

**Version:** 0.1.0  
**Status:** MVP Prototype  
**Style:** Stardew Valley cozy + Pokémon top-down navigation

---

## 🎮 What is This?

A browser-based snake breeding game with:
- **Shop → Egg → Hatch → Care** progression
- **House interior** with module-based interactions
- **PWA support** for fullscreen mobile play
- **Progressive unlocks** (Shop → Home → Farm → Town)

---

## 🚀 Quick Start

### Local Development

1. **Serve the game:**
   ```bash
   cd /root/catalog/smri-game
   python3 -m http.server 8080
   ```

2. **Open in browser:**
   ```
   http://localhost:8080
   ```

3. **Install as PWA (optional):**
   - Chrome: Click "Install" icon in address bar
   - Mobile: "Add to Home Screen"

---

## 📁 File Structure

```
smri-game/
├── index.html          # Main game (single-page app)
├── styles.css          # Stardew Valley aesthetic
├── game.js             # State machine, click handlers
├── manifest.json       # PWA configuration
├── data/
│   └── modules.json    # Module definitions & progression flags
└── README.md           # This file
```

---

## 🎯 Current MVP Features

### ✅ Implemented

**Game Flow:**
1. Title screen → Start
2. Shop (buy egg for $5 - stubbed)
3. Egg view → Click to hatch (4s progress bar)
4. Snake born! (random morph)
5. Home unlocked → Tutorial overlay

**Home Interior:**
- Single room with 6 modules:
  - 📦 Collection (view snakes/eggs)
  - 🛏️ Care Station (feed - stubbed)
  - 📋 Breeding Board (coming soon)
  - 💻 Snake Dex (coming soon)
  - 📚 Tutorials (list view)
  - 🔒 Admin (reset game)

**Systems:**
- Click-only interaction (no keyboard)
- Fullscreen screen transitions
- localStorage save/load
- Progressive unlock (Shop → Home)
- Tutorial overlay (5 steps, skippable)
- PWA manifest (installable)

### 🔜 Stubbed (Not Yet Working)

- Real Stripe payments (currently just logs)
- Care mechanics (feeding/stats)
- Breeding calculator
- Farm exterior location
- Town map & hotspots
- Multiplayer/community features
- Room expansion system

---

## 🛠️ How to Extend

### Adding a New Module

1. **Edit `data/modules.json`:**
   ```json
   {
     "id": "newmodule",
     "name": "New Module",
     "icon": "🎨",
     "description": "What it does",
     "location": "home",
     "unlocked": false,
     "category": "gameplay"
   }
   ```

2. **Add to house in `index.html`:**
   ```html
   <div class="interactable" data-module="newmodule">
       <span class="icon">🎨</span>
       <span class="label">New Module</span>
   </div>
   ```

3. **Add handler in `game.js`:**
   ```javascript
   function generateModuleContent(module) {
       switch (module.id) {
           case 'newmodule':
               return `<h3>New Module</h3><p>Content here...</p>`;
           // ...
       }
   }
   ```

### Adding a New Location

1. **Add screen HTML in `index.html`:**
   ```html
   <div id="screen-newlocation" class="screen">
       <!-- content -->
   </div>
   ```

2. **Add unlock flag in `game.js` state:**
   ```javascript
   unlocked: {
       newlocation: false,
   }
   ```

3. **Add navigation button:**
   ```html
   <button onclick="switchScreen('newlocation')">Go to New Place</button>
   ```

### Styling Changes

All visual styles in `styles.css` use CSS variables:
```css
:root {
    --bg-primary: #f4e8d8;    /* Main background */
    --bg-dark: #4a7c59;       /* Headers, accents */
    --accent: #d4a373;        /* Buttons, highlights */
    --border: #8b7355;        /* Borders */
}
```

Change these to retheme the entire game instantly.

---

## 🎨 Design Philosophy

### Modular Architecture

- **Screens** = Full-page views (title, shop, home, etc.)
- **Modules** = Interactable house items (open fullscreen panels)
- **State** = Single source of truth (saved to localStorage)

### Replaceable Visuals

Current: Emoji + simple CSS  
Future: SVG assets, sprite sheets, animations  
**Code doesn't change** - just swap icon sources.

### Progressive Unlock

- Start: Shop only
- After first egg: Home unlocks
- After first breeding: Farm unlocks
- After first sale: Town unlocks

This keeps early game simple, reveals complexity gradually.

---

## 📊 Technical Details

**Tech Stack:**
- Plain HTML/CSS/JS (no frameworks)
- ES6 modules (native browser support)
- LocalStorage for save system
- PWA manifest for install

**Browser Support:**
- Chrome/Edge 90+
- Safari 14+
- Firefox 88+
- Mobile browsers (iOS/Android)

**Performance:**
- No build step (instant load)
- Minimal dependencies (zero npm packages)
- Lazy loading (future: load modules on demand)

---

## 🐛 Known Issues

1. **No backend** - All data client-side only
2. **No real payments** - Stripe integration stubbed
3. **No multiplayer** - Community features disabled
4. **Basic visuals** - Placeholder emoji/ASCII

These are intentional for MVP. Real implementations coming in future versions.

---

## 🗺️ Roadmap

### v0.2.0 - Care Mechanics
- Real feeding/watering system
- 8-stat tracking (hunger, water, health, etc.)
- Snake growth stages (hatchling → adult)
- Death/game over conditions

### v0.3.0 - Breeding System
- Genetics calculator
- Breeding pairs
- Morph inheritance
- Egg incubation

### v0.4.0 - Economy
- Real Stripe integration
- Sell snakes to NPCs
- Dynamic pricing (morph rarity)
- Market fluctuations

### v0.5.0 - Locations
- Farm exterior (barn, garden)
- Town map (hotspots)
- Other players' farms (view-only)

### v1.0.0 - Multiplayer
- Online community
- Player-to-player trading
- Leaderboards
- Live chat

---

## 📝 Save System

**Save Format (localStorage):**
```json
{
  "version": "0.1.0",
  "player": { "name": "Player", "location": "home" },
  "inventory": {
    "eggs": 0,
    "snakes": [
      {
        "id": "snake_123456",
        "species": "Ball Python",
        "morph": "Banana",
        "born": 1704672000000,
        "fed": false,
        "happiness": 100
      }
    ]
  },
  "unlocked": {
    "shop": true,
    "home": true,
    "farm": false,
    "town": false
  },
  "tutorial": { "completed": true, "step": 5 }
}
```

**Version Migration:**
- Auto-detects old saves
- Migrates to new format
- Logs changes to console

---

## 🔧 Development Tips

**Debug Mode:**
- Open browser console (F12)
- Type `state` to inspect current game state
- Type `saveGame()` to force save
- Type `localStorage.clear()` to reset

**Testing Purchase Flow:**
- Click "Buy Egg" (no real payment)
- Watch console for Stripe stub log
- Egg instantly added to inventory

**Hatching Speed:**
- Current: 4 seconds (progress += 5 every 200ms)
- To change: Edit `startHatching()` interval in `game.js`

---

## 📚 Related Docs

- **SMRI Project:** `/root/catalog/.smri/INDEX.md`
- **Main Game:** `/root/catalog/game.html`
- **Existing Modules:** `/root/catalog/src/modules/`

---

## 🤝 Contributing

This is a prototype within the larger SMRI (Serpent Town) project.

**To add features:**
1. Check `.smri/INDEX.md` for project rules
2. Follow modular architecture (modules.json → game.js → HTML)
3. Keep visuals simple (replace later, not now)
4. Test on mobile (PWA fullscreen)

---

## 📄 License

Part of the Serpent Town project - see main LICENSE file.

---

**Built with ❤️ and 🐍**  
**Ready to play! 🚀**
