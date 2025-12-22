# 🐍 Serpent Town

**Version 0.3.0** - Marketplace Edition with payment provider abstraction

[![Tests](https://img.shields.io/badge/tests-passing-brightgreen)]()
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue)]()
[![Version](https://img.shields.io/badge/version-0.3.0-purple)]()

---

## 📖 Version History & Documentation

**Current Version:** [v0.3.0](docs/v0.3.0.md) ← **MARKETPLACE FEATURES!**

### Version Index

| Version | Release Date | Status | Documentation | Key Features |
|---------|--------------|--------|---------------|--------------|
| **v0.3.0** | 2025-12-21 | ✅ Current | [docs/v0.3.0.md](docs/v0.3.0.md) | Marketplace, merchants, payment abstraction |
| v0.2.0 | 2025-12-21 | Archived | [docs/v0.2.0.md](docs/v0.2.0.md) | Sold tracking, 3-section catalog, dev dashboard |
| v0.1.0 | 2025-12-21 | Archived | [docs/v0.1.0.md](docs/v0.1.0.md) | Initial release, Stripe integration, KV storage |

---

## 🎯 v0.3.0 Features

### 🏪 Marketplace System (NEW!)
- ✅ **Merchant Accounts:** Users can sell their snakes
- ✅ **Merchant Dashboard:** Manage products, orders, earnings
- ✅ **Multi-Vendor Catalog:** Products from multiple sellers
- ✅ **Order Management:** Automatic order creation with shipping
- ✅ **Revenue Model:** $15/month subscription + 5% commission

### 💳 Payment Provider Abstraction (NEW!)
- ✅ **Switch Providers in 1 Line:** Stripe, PayPal, Square, Mock
- ✅ **Provider-Agnostic API:** No code changes when switching
- ✅ **Fee Transparency:** Calculate platform + processing fees
- ✅ **Universal Webhooks:** One endpoint for all providers

### E-Commerce & Catalog
- ✅ **3-Section Catalog:** Available / Virtual / Sold (collapsible)
- ✅ **Sold Status Tracking:** Real snakes marked sold for all users via Cloudflare KV
- ✅ **Virtual Snakes:** Unlimited copies, buy with in-game gold
- ✅ **Stripe Integration:** Secure payments with webhook automation

### Developer Tools
- ✅ **Developer Dashboard:** All-in-one hub at `dashboard.html`
- ✅ **Debug Console:** Test game controller, API, data files at `debug-test.html`
- ✅ **Data Cleanup:** Fresh start tools at `cleanup.html`
- ✅ **Quick Start:** Demo mode with 3 free snakes at `start.html`

### Game Mechanics
- ✅ **Tamagotchi Care:** 8 stats (hunger, water, temp, humidity, health, stress, cleanliness, happiness)
- ✅ **Equipment Shop:** 15+ items (auto-feeders, thermostats, auto-misters)
- ✅ **Multiple Species:** Ball Pythons, Corn Snakes
- ✅ **10+ Morphs:** Banana, Piebald, Pastel, Albino, etc.
- ✅ **Game Speed:** 1x-100x for testing

### Architecture
- ✅ **Zero Dependencies:** Pure ES6 modules
- ✅ **Cloudflare Workers:** Serverless backend
- ✅ **KV Storage:** 4 namespaces (USER_PRODUCTS, MERCHANTS, ORDERS, PRODUCTS)
- ✅ **GitHub Pages:** Static hosting
- ✅ **Payment Abstraction:** Switch Stripe/PayPal/Square with 1 line

---

## 🚀 Quick Start

### For Players
```bash
# Visit live site
https://vinas8.github.io/catalog/

# Or run locally
python3 -m http.server 8000
# Open: http://localhost:8000/catalog.html
```

### For Merchants
```bash
# Visit merchant registration
https://vinas8.github.io/catalog/merchant-register.html

# Subscribe ($15/month)
# Access dashboard to add products
```

### For Developers
```bash
cd /root/catalog
npm test  # Run all tests (86+ passing)
node tests/marketplace.test.js  # Test marketplace features

# Deploy worker
cd worker
wrangler publish worker.js
```

---

## 💰 Revenue Model

### Industry Standard Hybrid Model

**Merchant:** Pays $15/month subscription  
**Customer:** Pays product price + 5% platform fee + 3% processing  
**Platform:** Earns subscription + 5% commission

### Example Transaction ($100 product)

| Component | Amount | Recipient |
|-----------|--------|-----------|
| Product price | $100.00 | Merchant |
| Platform fee (5%) | $5.00 | Serpent Town |
| Processing fee | $3.20 | Payment Provider |
| **Customer pays** | **$108.20** | - |
| **Merchant receives** | **$95.00** | Merchant |

---

## 🔄 Payment Provider Switching

### Change ONE line to switch providers:

```javascript
// src/payment/config.js
export const PAYMENT_PROVIDER = 'stripe';  // Change to 'paypal' or 'square'
```

### Supported Providers

| Provider | Fees | Status |
|----------|------|--------|
| **Stripe** | 2.9% + $0.30 | ✅ Complete |
| **PayPal** | 2.9% + $0.30 | ✅ Complete |
| **Square** | 2.6% + $0.10 | ✅ Complete (cheapest!) |
| **Mock** | 3% + $0.30 | ✅ Testing |

**No other code changes needed!** Business logic, UI, and database remain identical.

---

## 📁 Project Structure

```
/root/catalog/
├── src/
│   ├── payment/              ← NEW! Payment abstraction
│   │   ├── payment-adapter.js  (Switch providers here)
│   │   ├── config.js           (Configure provider in 1 line)
│   │   └── README.md
│   ├── auth/
│   ├── business/
│   ├── data/
│   └── ui/
├── worker/
│   ├── worker.js               (Current: v3.4, Stripe only)
│   └── worker-v0.3.0.js        ← NEW! Provider-agnostic
├── merchant-register.html      ← NEW! Merchant onboarding
├── merchant-dashboard.html     ← NEW! Merchant portal
├── catalog.html                (Shop)
├── game.html                   (Tamagotchi game)
├── index.html                  (Landing page)
└── tests/
    ├── marketplace.test.js     ← NEW! Marketplace tests
    └── [86+ other tests]
```

---

## 🧪 Testing

### Run All Tests
```bash
npm test  # 86+ tests passing
```

### Test Marketplace Features
```bash
node tests/marketplace.test.js
```

**Test Coverage:**
- ✅ Payment adapter factory
- ✅ Fee calculations
- ✅ Provider switching
- ✅ Mock payments
- ✅ Webhook processing
- ⚠️ Worker API (requires deployment)

---

## 📚 Documentation

**Quick Reference:** This file (README.md)  
**Complete Guide:** [docs/v0.3.0.md](docs/v0.3.0.md)  
**Payment System:** [src/payment/README.md](src/payment/README.md)  
**Setup Guide:** [SETUP.md](SETUP.md)  
**Cloudflare Setup:** [CLOUDFLARE-SETUP-COMPLETE.md](CLOUDFLARE-SETUP-COMPLETE.md)

---

## 🔐 Security & Privacy

- ✅ Webhook signature verification (all providers)
- ✅ HTTPS only (enforced by Cloudflare)
- ✅ No API keys in frontend
- ✅ Customer addresses only visible to their merchant
- ✅ Hashed user IDs (unpredictable)

---

## 🎮 User Flows

### Customer Flow
1. Browse catalog → Find snake from merchant
2. Click "Buy Now" → Enter shipping address
3. Complete payment (Stripe/PayPal/Square)
4. Snake appears in game
5. Merchant receives order

### Merchant Flow
1. Register at `merchant-register.html`
2. Subscribe ($15/month)
3. Add products via dashboard
4. Receive orders with customer addresses
5. Ship products
6. Get paid (95% of sale)

---

## 📊 Stats

- **Lines of Code:** ~4,000+
- **Dependencies:** 0
- **Tests:** 86+ (100% passing)
- **Species:** 2 (Ball Python, Corn Snake)
- **Morphs:** 10+
- **Equipment:** 15+ items
- **Payment Providers:** 4 (Stripe, PayPal, Square, Mock)

---

## 🔗 Links

**Live Site:** https://vinas8.github.io/catalog/  
**Merchant Portal:** https://vinas8.github.io/catalog/merchant-register.html  
**Worker API:** https://serpent-town.vinatier8.workers.dev  
**Repository:** https://github.com/vinas8/catalog

---

## 🚀 Deployment

```bash
# Deploy frontend (GitHub Pages)
git push origin main

# Deploy worker (Cloudflare)
cd worker
wrangler publish worker.js

# Test
npm test
node tests/marketplace.test.js
```

---

## 💡 Next Steps (v0.4.0)

- [ ] Product photo uploads
- [ ] Customer reviews/ratings
- [ ] Shipping integrations (USPS, FedEx)
- [ ] Multi-currency support
- [ ] Mobile app

---

## 📄 License

MIT License

---

**Current Version:** 0.3.0  
**Release Date:** December 21, 2025  
**Status:** ✅ Ready for Deployment

---

## 🚀 Quick Start

```bash
# 1. Install (testing only, no dependencies for runtime)
npm install

# 2. Run tests
npm test

# 3. Start local server
python -m http.server 8000

# 4. Open browser
http://localhost:8000/dashboard.html    # Developer tools
http://localhost:8000/start.html        # Get 3 free demo snakes
http://localhost:8000/catalog.html      # Buy real snakes
http://localhost:8000/game.html         # Play game
```

---

## 📚 Documentation Structure

**For AI Assistants:** Always check `package.json` for current version, then read the corresponding docs file.

```
README.md (THIS FILE)
  ↓
  Version Index (table above)
  ↓
  docs/v0.2.0.md ← COMPLETE TECHNICAL DOCS
    - Architecture
    - API endpoints
    - Data flow
    - Deployment
    - Testing
    - File structure
    - Changelog
```

### Quick Links

- **[v0.2.0 Technical Docs](docs/v0.2.0.md)** ← Primary reference
- **[Setup Guide](SETUP.md)** - Installation & deployment
- **[Cloudflare Setup](CLOUDFLARE-SETUP-COMPLETE.md)** - Worker configuration
- **[Changes Log](CHANGES_SUMMARY.md)** - Version history
- **[API Credentials](docs/API_CREDENTIALS.md)** - API access guide

---

## 🏗️ Architecture (Quick Reference)

```
┌─────────────────────────────────────┐
│ Frontend (GitHub Pages)             │
│ - catalog.html (3-section layout)   │
│ - game.html (Tamagotchi care)       │
│ - dashboard.html (dev tools)        │
└─────────────────────────────────────┘
         ↓ API calls
┌─────────────────────────────────────┐
│ Backend (Cloudflare Workers)        │
│ - Stripe webhook handler            │
│ - Product status checker (NEW)      │
│ - User products API                 │
└─────────────────────────────────────┘
         ↓ Stores in
┌─────────────────────────────────────┐
│ Cloudflare KV Storage               │
│ - USER_PRODUCTS (ownership)         │
│ - PRODUCT_STATUS (sold tracking) ⚡  │
└─────────────────────────────────────┘
```

**Data Flow:**
1. User buys snake → Stripe webhook → Worker
2. Worker writes to both KV namespaces
3. Frontend reads from worker API
4. Game displays snake

See [docs/v0.2.0.md](docs/v0.2.0.md) for complete architecture details.

---

## 🛠️ Developer Commands

```bash
# Testing
npm test                              # All 86 tests
npm run test:unit                     # Unit tests
npm run test:snapshot                 # Snapshot tests

# Cloudflare Worker
cd worker && wrangler publish         # Deploy worker
bash .github/skills/test-worker.sh    # Test endpoints
bash worker/create-product-status-kv.sh  # Create KV namespace

# Data Cleanup
open http://localhost:8000/cleanup.html  # Browser data
bash scripts/clean-kv.sh              # KV data (nuclear)

# Server (Read-only for AI!)
bash .github/skills/check-server-status.sh  # Status only
```

---

## 🎮 For Players

1. **Demo Mode (Free):** Visit `start.html` → Get 3 virtual snakes instantly
2. **Buy Real Snake:** Visit `catalog.html` → Stripe checkout → Snake arrives in game
3. **Play Game:** Visit `game.html` → Care for your snakes Tamagotchi-style

---

## 🧪 Testing

**Status:** 86/86 tests passing (100%) ✅

```bash
npm test  # Always run before committing
```

Test coverage:
- Core game mechanics
- Species & morph data
- Economy & shop
- Catalog loading
- User authentication
- Product conversion
- Integration tests

---

## 📦 Tech Stack

- **Frontend:** Vanilla JavaScript ES6 modules (zero dependencies!)
- **Backend:** Cloudflare Workers (serverless)
- **Storage:** Cloudflare KV (2 namespaces)
- **Payments:** Stripe Checkout + Webhooks
- **Hosting:** GitHub Pages + Cloudflare
- **Testing:** Node.js built-in test runner

---

## 🔐 API Access (For AI Assistants)

AI assistants have programmatic access via `.env` file:
- Cloudflare (Worker deployment, KV management)
- Stripe (Payment links, webhooks)
- GitHub (Repository operations, workflows)

Verify: `bash scripts/verify-api-connections.sh`

See [docs/API_CREDENTIALS.md](docs/API_CREDENTIALS.md) for details.

---

## 🐛 Known Issues

None critical in v0.2.0.

Minor:
- PRODUCT_STATUS namespace must be created manually (scripted)
- Virtual snake purchase UI ready, backend in progress
- Breeding mechanics in development

---

## 🔮 Roadmap (v0.3.0)

- Breeding mechanics (genetics calculator functional)
- More species (Boa Constrictors, King Snakes)
- Multiplayer trading
- Achievement system
- Virtual snake purchase with gold

---

## 🤝 Contributing

**Code Style:**
- Plain JavaScript ES6 modules
- No build step required
- Zero external dependencies
- Test before committing (`npm test`)

See [docs/v0.2.0.md](docs/v0.2.0.md) for complete contribution guidelines.

---

## 📄 License

MIT

---

## 🎯 AI Assistant Instructions

**When asked about the project:**

1. Check `package.json` for current version (currently **v0.2.0**)
2. Read **README.md** (this file) for overview and feature index
3. Read **docs/v0.2.0.md** for complete technical details
4. Use version index table to find specific version documentation

**Quick aliases:**
- "What's in v0.2.0?" → Read docs/v0.2.0.md
- "How to deploy?" → Read SETUP.md and docs/v0.2.0.md deployment section
- "Architecture?" → Read docs/v0.2.0.md architecture section

**Remember:** README is the index, version docs have the details!

---

**Repository:** https://github.com/vinas8/catalog  
**Version:** 0.2.0  
**Live Demo:** https://vinas8.github.io/catalog/  
**Last Updated:** 2025-12-21

