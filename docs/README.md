# 🐍 Serpent Town v3.4

A snake care simulation game with real money Stripe purchases, equipment shop, and real-time stat management.

**Status:** ✅ Stable Release (Bug fixes + Catalog system)

---

## 🎯 What's New in v3.4

### Bug Fixes
- ✅ Fixed shop modal not appearing
- ✅ Fixed game reset crash
- ✅ Fixed catalog species filter
- ✅ Fixed Stripe payment links

### New Features  
- 🆕 Data-driven catalog system (JSON-based)
- 🆕 Real Stripe product integration
- 🆕 Dynamic species filtering
- 🆕 Loading and error states

**📖 Full Details:** `docs/versions/v3.4-RELEASE-NOTES.md`

---

## 🚀 Quick Start

### Start Game
```bash
cd /root/catalog
python3 -m http.server 8000
```

### Play Game
Open browser: `http://localhost:8000/game.html`

### Add Products
Edit `data/products.json` - see `docs/CATALOG-MANAGEMENT.md`

---

## 📚 Documentation

### Version 3.4 Docs
- **Release Notes:** `docs/versions/v3.4-RELEASE-NOTES.md`
- **Catalog Guide:** `docs/CATALOG-MANAGEMENT.md`
- **Bug Fixes:** `BUG_FIXES.md`
- **Catalog Fix:** `CATALOG_FIX.md`

### Previous Versions
- **v3.2 Docs:** `docs/v3.2.md`

---

## 🎮 Features

### Game Features
- ✅ Real-time snake care simulation
- ✅ Equipment shop (15+ items)
- ✅ Currency economy with loyalty tiers
- ✅ 8 stats tracking (hunger, water, health, etc.)
- ✅ Life stages (Egg → Adult)
- ✅ Game speed control (1x-100x)

### E-Commerce Features (NEW v3.4)
- 🆕 Real Stripe payment integration
- 🆕 Dynamic product catalog from JSON
- 🆕 Species filtering (Ball Python, Corn Snake)
- 🆕 Virtual and real snake purchases
- 🆕 Product status management

---

## 🐍 Current Catalog

### Real Products (Stripe)
- **Super Banana Ball Python** - $450
  - Live Stripe link active
  - Test mode: `test_cNibJ04XLbUsaNQ8uPbjW00`

### Virtual Products (In-Game)
- Ball Pythons: Normal, Pastel
- Corn Snakes: Normal, Amelanistic, Snow

**Add More:** Edit `data/products.json`

---

## 🧪 Testing

### Manual Testing (v3.4)
- ✅ Shop button opens modal
- ✅ Reset game works properly
- ✅ Catalog filter works
- ✅ Stripe links open correctly
- ✅ Loading states display
- ✅ Error handling works

### Automated Tests (v3.2)
```bash
npm test              # Run all tests
```
**Results:** 55/55 passing (100%)

---

## 📊 Project Stats

- **Lines of Code:** ~3,000+ (with v3.4 additions)
- **Dependencies:** 0 (plain JavaScript)
- **Test Coverage:** 55 tests passing
- **Shop Items:** 15+ equipment items
- **Catalog Products:** 6 snakes
- **Loyalty Tiers:** 4 (Bronze → Platinum)

---

## 📦 Architecture

### Technology Stack
- **Frontend:** Plain JavaScript (ES6 modules)
- **Styling:** Plain CSS (no preprocessors)
- **Data:** JSON files
- **Payments:** Stripe Checkout
- **Storage:** LocalStorage

### File Structure
```
/root/catalog/
├── game.html           # Main game page
├── game.js             # Game controller
├── styles.css          # All styles
├── data/
│   └── products.json   # Catalog products
├── src/
│   ├── business/       # Game logic
│   ├── data/          # Data modules (NEW: catalog.js)
│   └── ui/            # UI components
├── docs/
│   ├── versions/      # Version docs (NEW v3.4)
│   └── CATALOG-MANAGEMENT.md
└── tests/             # Test files
```

---

## 🔧 Development

### Adding New Products
1. Get Stripe payment link
2. Edit `data/products.json`
3. Refresh browser - done!

See: `docs/CATALOG-MANAGEMENT.md`

### Code Structure
- **No build process** - just edit and refresh
- **ES6 modules** - import/export
- **Zero dependencies** - no node_modules
- **Plain CSS** - no SASS/LESS

---

## 🌐 Deployment Options

### Local (Current)
```bash
python3 -m http.server 8000
```

### Production
- Static hosting (Netlify, Vercel, GitHub Pages)
- Add Stripe webhook for automatic fulfillment
- Switch from test mode to live mode

---

## 🐍 Snake Types

### Real Snakes
- **Payment:** Stripe (real money)
- **Added:** Via webhook (future) or manual
- **Bonus:** Receive in-game gold
- **Purpose:** Actual sales

### Virtual Snakes
- **Payment:** In-game gold coins  
- **Added:** Immediately
- **Purpose:** Gameplay/testing

---

## 🔒 Security

- ✅ Stripe handles all payment processing
- ✅ No credit card data touches server
- ✅ Test mode for development
- ✅ Client-side validation
- ✅ No sensitive data in JSON

---

## 🆘 Troubleshooting

### Shop Not Opening
- Check console for errors (F12)
- Verify modal CSS loaded
- Try clearing cache

### Catalog Not Loading
- Check `data/products.json` syntax
- Verify JSON is valid
- Check network tab for 404s

### Filter Not Working
- Verify species field in products
- Check species matches: `ball_python` or `corn_snake`

**More Help:** `docs/versions/v3.4-RELEASE-NOTES.md`

---

## 🚀 Quick Links

- **Play:** `http://localhost:8000/game.html`
- **Version Docs:** `docs/versions/v3.4-RELEASE-NOTES.md`
- **Catalog Guide:** `docs/CATALOG-MANAGEMENT.md`
- **Bug Fixes:** `BUG_FIXES.md`

---

## 📝 Version History

- **v3.4** (Dec 2025) - Bug fixes + Catalog system
- **v3.2** (Previous) - Equipment shop + Testing
- **v3.0** (Base) - Initial game release

---

## 🤝 Contributing

### Report Issues
Include:
1. Browser version
2. Steps to reproduce  
3. Console errors
4. Expected vs actual behavior

### Suggest Features
Open an issue with:
- Feature description
- Use case
- Implementation ideas

---

## 📄 License

See project root for license details.

---

**Current Version:** 3.4.0  
**Last Updated:** December 21, 2025  
**Status:** Stable ✅

*Built with plain JavaScript - No frameworks, no dependencies, just code.*
