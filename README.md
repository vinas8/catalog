# 🐍 Serpent Town v0.5.0

Snake breeding e-commerce game with Stripe payments and Tamagotchi-style care mechanics.

[![Tests](https://img.shields.io/badge/tests-86%2F86%20passing-brightgreen)]()
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue)]()
[![Version](https://img.shields.io/badge/version-0.5.0-purple)]()
[![Status](https://img.shields.io/badge/status-in%20development-yellow)]()

---

## 🤖 For AI Assistants (New Session Setup)

```bash
# Step 1: Load project instructions
cat .github/copilot-instructions.md

# Step 2: Run complete project briefing
# Type: .smri
# This shows: directory tree + README + API docs + SMRI index
```

**Custom Commands:**
- `.smri` - Complete project briefing (tree, docs, APIs)
- `lol` - Programming joke (for fun)

---

## 🎯 SMRI System

**SMRI** = **S**cenario-**M**odule-**R**elation-**I**nstance notation for E2E testing

📋 **[.smri Manifest](.smri)** - Single source of truth (42 scenarios, v2.0 notation)

### Quick Reference
- **Format:** `S{M}.{RRR}.{II}` where lower M = higher priority
- **Example:** `S1.1,2,3,4,5.01` = Shop scenario touching 5 modules
- **Status:** 1/42 implemented, 88% E2E coverage, 69/71 tests passing

### Links
- 🏥 [Health Check](/smri/S6.1,2,3,4,5,6.03.html) - System status (S6.0.03)
- 📊 [All Scenarios](/smri/) - Complete test suite
- 📖 [E2E Docs](docs/test/E2E_TEST_SCENARIOS.md) - Full specifications

---

## 📖 Documentation

📚 **[Complete Documentation Index](docs/DOCUMENTATION_INDEX.md)** - All docs organized by topic

### Quick Links

- **[🎯 Main Purchase Flow](docs/MAIN_PURCHASE_FLOW.md)** - Complete E2E flow (⭐ START HERE)
- **[🚀 Developer Reference](docs/DEVELOPER_REFERENCE.md)** - Command cheatsheet
- **[☁️ Cloudflare API](docs/CLOUDFLARE_API_EXAMPLES.md)** - KV storage & curl examples
- **[🧩 Module System](docs/modules/README.md)** - Modular architecture
- **[⚙️ Setup Guide](docs/SETUP.md)** - Installation & deployment
- **[📚 API Reference](docs/project-api.md)** - API endpoints
- **[🔐 Credentials](docs/API_CREDENTIALS.md)** - API keys setup

### Module Docs

- **[💳 Payment](docs/modules/payment.md)** - Stripe integration
- **[🛒 Shop](docs/modules/shop.md)** - Product catalog & economy
- **[🎮 Game](docs/modules/game.md)** - Tamagotchi mechanics
- **[🔐 Auth](docs/modules/auth.md)** - User authentication
- **[🔧 Common](docs/modules/common.md)** - Shared utilities

---

## 🚀 Quick Start

```bash
# 1. Clone & Install
git clone https://github.com/vinas8/catalog.git
cd catalog
npm install

# 2. Run tests
npm test

# 3. Start local server
python -m http.server 8000

# 4. Open in browser
http://localhost:8000/dashboard.html    # Developer dashboard
http://localhost:8000/start.html        # Demo mode (3 free snakes)
http://localhost:8000/catalog.html      # Buy snakes with Stripe
http://localhost:8000/game.html         # Play Tamagotchi game
```

---

## 🎯 Key Features

- ✅ **Modular Architecture** - Enable/disable features with feature flags
- ✅ **5 Core Modules** - Payment, Shop, Game, Auth, Common
- ✅ **Feature Flags** - Toggle virtual snakes, breeding, marketplace
- ✅ **Real-Time Product Status** - KV-backed availability tracking
- ✅ **Tamagotchi Care** - 8 stats, equipment shop, multiple species
- ✅ **Stripe Integration** - Secure payments with webhooks
- ✅ **Zero Dependencies** - Pure ES6 modules
- ✅ **86/86 Tests Passing** - 100% test coverage

---

## 🏗️ Architecture

```
Frontend (GitHub Pages) → Backend (Cloudflare Workers) → Storage (KV)
```

### Modular Structure
```
src/modules/
├── payment/    # Stripe webhooks & checkout
├── shop/       # Catalog, economy, UI
├── game/       # Tamagotchi mechanics
├── auth/       # User authentication
└── common/     # Shared utilities
```

**Enable/disable features:** Edit `src/config/feature-flags.js`

```javascript
// src/config/feature-flags.js
export const FEATURE_FLAGS = {
  ENABLE_VIRTUAL_SNAKES: false,  // ❌ Disabled
  ENABLE_BREEDING: false,
  ENABLE_MARKETPLACE: false
};
```

See [Module Docs](docs/modules/README.md) for details.

---

## 🛠️ For Developers

**Developer Dashboard:** http://localhost:8000/dashboard.html

**Quick Commands:**
```bash
npm test                  # Run all tests
npm test:payment          # Test payment module
npm test:game             # Test game module
npm test:shop             # Test shop module
cd worker && wrangler publish  # Deploy worker
bash scripts/clean-kv.sh  # Clean KV data
```

**Module Management:**
```javascript
// Disable a module (src/module-config.js)
export const MODULE_CONFIG = {
  payment: { enabled: false },  // Turns off Stripe
  game: { enabled: false },     // Shop-only mode
};
```

**Full guide:** [Module System](docs/modules/README.md)

---

## 📄 License

MIT

---

**Repository:** https://github.com/vinas8/catalog  
**Version:** 0.5.0  
**Live Demo:** https://vinas8.github.io/catalog/  
**Documentation:** [docs/](docs/)  
**Modules:** [docs/modules/](docs/modules/)
