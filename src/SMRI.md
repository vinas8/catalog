# 🐍 Serpent Town Project Index (SMRI)

**Version:** 0.7.0  
**Status:** ⚠️ BETA - Not Production Ready  
**Tests:** 77/77 passing (100%) ✅

---

## 📋 SMRI Commands

Type these commands for quick access:

- **`.smri`** - Complete project briefing (tree, docs, API, status)
- **`.smri help`** - Show this command list
- **`.smri progress`** - Show progress (tests, E2E, debug tools, features)
- **`.smri update`** - Update SMRI from latest docs
- **`.smri update recent`** - Document recent commit changes

---

## 🎯 What is Serpent Town?

A snake breeding e-commerce game combining:
- **Shop**: Buy real snakes with Stripe payments
- **Game**: Tamagotchi-style care mechanics
- **Business**: Real product catalog with morphs & genetics

---

## 🏗️ Architecture

```
Frontend (GitHub Pages - Static)
    ↓
Cloudflare Worker (Backend API)
    ↓
KV Storage (User Products)
    ↓
Stripe (Payments & Webhooks)
```

---

## 📁 Project Structure

### `/src/modules/` - Core Logic (ES6 Modules)
- **`auth/`** - User authentication (hash-based)
- **`common/`** - Shared utilities, constants, security
- **`debug/`** - Debug tools & UI
- **`game/`** - Tamagotchi game controller & plugins
- **`payment/`** - Stripe integration adapter
- **`shop/`** - Catalog, business logic, UI components

### `/src/config/` - Configuration
- `app-config.js` - Main app settings
- `feature-flags.js` - Feature toggles
- `stripe-config.js` - Stripe API keys
- `worker-config.js` - Cloudflare Worker config

### Root Files
- `catalog.html` - Shop frontend
- `game.html` - Tamagotchi game
- `success.html` - Post-purchase page
- `index.html` - Landing page

### Backend
- `worker/worker.js` - Cloudflare Worker (webhooks, API)
- `worker/test-worker.js` - Worker test suite

### Data
- `data/products.json` - Available snakes
- `data/user-products.json` - Purchased snakes (local dev)
- `data/users.json` - User accounts

---

## 🎮 Game Mechanics

**8 Stats:** Hunger, Water, Temperature, Humidity, Health, Stress, Cleanliness, Happiness

**Care Actions:**
- Feed: Hunger +40, Stress -5
- Water: Water +50, Stress -2
- Clean: Cleanliness +30, Stress -10

**Equipment Shop:** 15+ items (auto-feeders, thermostats, misting systems)

---

## 💰 Business Flow

1. User browses `catalog.html`
2. Clicks "Buy Now" → Stripe Checkout
3. Payment complete → Stripe webhook → Cloudflare Worker
4. Worker saves to KV storage (USER_PRODUCTS namespace)
5. User opens `game.html#user_hash`
6. Game fetches from Worker API `/user-products?user=hash`
7. Snake appears in game! 🐍

---

## 🛠️ What AI Can Do

### ✅ Safe Operations
- Edit code files (HTML, JS, CSS)
- Deploy Cloudflare Worker (`worker-deploy.sh`)
- Test worker endpoints (`test-worker.sh`)
- Update data files (products.json, user-products.json)
- Run tests (`npm test`)
- Check server status (`check-server-status.sh` - READ ONLY)

### ❌ Prohibited Operations
- **NEVER** start/stop/restart servers
- **NEVER** run `webhook-server.py` or `upload-server.py`
- **NEVER** modify running server processes

---

## 🚀 Quick Commands

**Deploy Worker:**
```bash
.github/skills/worker-deploy.sh
```

**Test Worker:**
```bash
.github/skills/test-worker.sh
```

**Run Tests:**
```bash
npm test
```

**Check Servers (READ ONLY):**
```bash
.github/skills/check-server-status.sh
```

---

## 📊 Tech Stack

- **Frontend:** Plain JavaScript ES6 modules, HTML, CSS (zero dependencies)
- **Backend:** Cloudflare Workers
- **Payments:** Stripe Checkout + Webhooks
- **Storage:** Cloudflare KV (USER_PRODUCTS namespace)
- **Hosting:** GitHub Pages (static) + Cloudflare Workers (backend)

---

## 🔑 Key Concepts

**User Hash:** Users identified by `game.html#user_abc123`  
**KV Storage:** Cloudflare key-value store for user products  
**Webhook Flow:** Stripe → Worker → KV → Game  
**No Build Step:** Pure ES6 modules, no transpiling  

---

## 📝 Module Entry Points

| Module | Entry Point | Purpose |
|--------|-------------|---------|
| Common | `src/modules/common/index.js` | Utilities, constants |
| Shop | `src/modules/shop/index.js` | Catalog, business logic |
| Game | `src/modules/game/index.js` | Tamagotchi controller |
| Payment | `src/modules/payment/index.js` | Stripe adapter |
| Auth | `src/modules/auth/index.js` | User authentication |

---

## 🐍 Species & Morphs

**Species:** Ball Python, Corn Snake  
**Morphs:** Banana, Piebald, Pastel, Albino, Amelanistic, Snow, Ghost, Hypo, Bloodred, Butter

---

## 📚 Documentation

- **README.md** - Project overview & quick start
- **docs/v0.5.0.md** - Complete technical reference (PRIMARY)
- **docs/STRIPE-KV-SYNC.md** - Stripe→KV workflow (v0.7.0)
- **docs/EMAIL_IMPLEMENTATION_SUMMARY.md** - Email notifications (v0.7.0)
- **docs/DEPLOYMENT_v0.7.0.md** - Latest deployment guide
- **SETUP.md** - Setup & deployment guide

---

## 🎯 AI Assistant Guidelines

1. **Always check what exists** before creating/modifying
2. **Run tests** after code changes (`npm test`)
3. **Use skills** for deployment and testing
4. **Never touch servers** - user manages those
5. **Ask before** major architectural changes
6. **Keep it simple** - no unnecessary dependencies
7. **Make surgical changes** - modify as few lines as possible

---

**Repository:** https://github.com/vinas8/catalog  
**Lines of Code:** ~4,200  
**Dependencies:** 1 (playwright for E2E tests)  
**Latest:** v0.7.0 - Email notifications & Stripe→KV sync  
**Ready to help!** 🚀

---

## 🆕 Recent Updates (v0.7.0)

**Latest Commit:** `600a74e` - Complete Stripe→KV sync with correct name structure

**New Features:**
- ✅ Email notifications via Resend API
- ✅ Stripe→KV automatic sync
- ✅ Snake collection farm system
- ✅ Separate nickname from morph field
- ✅ Enhanced debug hub

**Type `.smri update recent` to see full commit details**
