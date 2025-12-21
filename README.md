# 🐍 Serpent Town v0.1.0

Snake care simulation game with Stripe integration.

**Status:** ✅ Core Features Complete  
**Tests:** 86/86 passing (100%) ✅  
**License:** MIT

---

## 🎯 Core Business Logic

**How it works:**

1. **Catalog** (`catalog.html`) - Browse and buy real snakes via Stripe
2. **Stripe Payment** - User completes payment
3. **Webhook** - Stripe webhook writes purchase to `data/user-products.json`
4. **Game** (`game.html`) - User sees their purchased snake in the game

**Purchase Flow:**
```
Catalog → Stripe Checkout → Success → Webhook → user-products.json → Game shows snake
```

---

## Quick Start

```bash
cd catalog
python3 -m http.server 8000
# Open: http://localhost:8000/game.html
```

**Note:** Full purchase flow requires webhook server (see Deployment section)

---

## Features

- 🐍 **Snake Care Simulation** - 8 real-time stats (hunger, water, health, etc.)
- 🛒 **Equipment Shop** - 15+ items with automation (auto-feeder, auto-misting)
- 💳 **Stripe Integration** - Buy real snakes via Stripe Checkout
- 💰 **Currency & Loyalty** - Gold coins, 4 tiers (Bronze → Platinum)
- 📱 **Mobile Responsive** - Works on all devices
- 💾 **Auto-save** - LocalStorage persistence

---

## Documentation

**Complete documentation:** [docs/v0.1.0.md](docs/v0.1.0.md)

Quick links:
- **Game Mechanics** - Stats, decay rates, care actions
- **Equipment Shop** - All items, prices, effects
- **Species Profiles** - Ball Python, Corn Snake care guides
- **Stripe Setup** - Product catalog management
- **API Reference** - Module exports and usage
- **Deployment** - Local, GitHub Pages, static hosting

---

## Testing

```bash
npm test              # All 86 tests
npm run test:unit     # 15 unit tests
npm run test:snapshot # 71 snapshot tests
```

**Results:** ✅ 86/86 passing (100%)

---

## Architecture

### Core Files
```
catalog/
├── index.html              # Landing page
├── catalog.html            # Snake shop (Stripe checkout)
├── game.html               # Game UI (shows purchased snakes)
├── success.html            # Post-purchase thank you page
├── styles.css              # All styling
│
├── data/
│   ├── products.json       # Available snakes (catalog)
│   ├── user-products.json  # Purchased snakes (WEBHOOK WRITES HERE)
│   └── users.json          # User accounts
│
├── src/
│   ├── auth/               # User authentication
│   ├── business/           # Economy, shop, Stripe sync
│   ├── config/             # Stripe API keys
│   ├── data/               # Species, morphs, catalog loader
│   └── ui/                 # Shop view
│
├── tests/                  # 86 tests
└── docs/
    └── v0.1.0.md          # Complete documentation
```

### Data Flow

**Purchase Flow:**
```
1. User browses catalog.html
2. Clicks "Buy Now" → Stripe Checkout
3. Completes payment
4. Stripe webhook → Your server
5. Server writes to data/user-products.json:
   {
     "user_id": "user_123",
     "product_id": "prod_xyz",
     "acquired_at": "2025-12-21...",
     "payment_id": "pi_stripe_xyz"
   }
6. User opens game.html
7. Game loads user-products.json
8. Snake appears in game!
```

**Tech Stack:**
- Plain JavaScript ES6 modules
- Zero frontend dependencies
- Stripe API (checkout links + webhooks)
- LocalStorage (game state)
- JSON files (data persistence)
- Backend needed for webhooks
- ~3,600 lines of code

---

## Deployment

### Local Development (Static Files Only)
```bash
python3 -m http.server 8000
```
**Note:** This runs the game, but Stripe purchases won't appear automatically (no webhook server).

### Full Production Setup (With Webhooks)

**Required for real purchases to appear in game:**

1. **Backend server** to handle Stripe webhooks
2. **Write endpoint** that updates `data/user-products.json`
3. **Stripe webhook configured** to POST to your server

**Webhook Flow:**
```
Stripe → Your Server → POST /api/purchase → Updates user-products.json
```

**Example backend needed:**
- Python/Flask
- Node.js/Express
- Cloudflare Worker
- Any server that can write JSON files

See `docs/v0.1.0.md` for detailed webhook implementation guide.

### GitHub Pages
Repository: https://github.com/vinas8/catalog

**Fixed:** All paths now relative for proper GH Pages support ✅

Access: https://vinas8.github.io/catalog/

**Note:** GH Pages is static-only, so purchases need external webhook server.

---

## Game Mechanics

### Stats (8 total)
- Hunger, Water, Temperature, Humidity
- Health, Stress, Cleanliness, Happiness

### Decay Rates (per hour at 1x speed)
- Hunger: -2.0 to -2.5
- Water: -3.0
- Cleanliness: -1.0 to -1.5

### Care Actions
- Feed: Hunger +40, Stress -5
- Water: Water +50, Stress -2
- Clean: Cleanliness +30, Stress -10

### Equipment Automation
- Auto-feeder: Feeds every 7 days
- Auto-misting: Maintains humidity
- Thermostat: Auto-temperature control

---

## Species

### Ball Python
- Temp: 88-92°F hot, 78-82°F cool
- Humidity: 50-60% (70% shedding)
- Feeding: Every 5-10 days
- Adult weight: 1200-2000g

### Corn Snake  
- Temp: 85-90°F hot, 75-80°F cool
- Humidity: 40-50% (60% shedding)
- Feeding: Every 5-10 days
- Adult weight: 400-900g

**Morphs:** 10+ available (Banana, Piebald, Pastel, Amelanistic, etc.)

---

## Managing Products

Edit `data/products.json`:

```json
{
  "id": "unique-id",
  "name": "Banana Ball Python",
  "species": "ball_python",
  "morph": "banana",
  "price": 450.00,
  "status": "available",
  "stripe_link": "https://buy.stripe.com/test_xxx",
  "info": "Male • 2024 • Captive Bred"
}
```

Refresh browser - done!

---

## Browser Support

- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Mobile browsers
- ❌ IE not supported

---

## Statistics

- **Version:** 0.1.0
- **Release:** December 21, 2025
- **Lines of Code:** ~3,600
- **Dependencies:** 0
- **Tests:** 86/86 (100%) ✅
- **Shop Items:** 15+
- **Species:** 2
- **Morphs:** 10+

---

## Documentation

- **📖 Complete Guide:** [docs/v0.1.0.md](docs/v0.1.0.md) - All technical documentation
- **🎉 What's New:** [docs/releases/v0.1.0-release-notes.md](docs/releases/v0.1.0-release-notes.md) - Latest features
- **🧪 Tests:** `npm test` - 86/86 passing
- **📊 Previous Work:** [docs/releases/v0.0.x-consolidation.md](docs/releases/v0.0.x-consolidation.md)

---

## Support

- **Repository:** https://github.com/vinas8/catalog
- **Version:** 0.1.0
- **Issues:** GitHub Issues

---

## License

MIT License - Free to use and modify

---

**Built with plain JavaScript. No frameworks. No dependencies. Just code.**

*Play now: http://localhost:8000/game.html*
