# 🐍 Serpent Town v0.2.0

Snake breeding e-commerce game with Stripe payments and Tamagotchi-style care mechanics.

[![Tests](https://img.shields.io/badge/tests-86%2F86%20passing-brightgreen)]()
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue)]()
[![Version](https://img.shields.io/badge/version-0.2.0-purple)]()

---

## 📖 Documentation

**Full documentation is in the [`docs/`](docs/) directory**

### Quick Links

- **[📑 INDEX](docs/INDEX.md)** - Project overview & version index (START HERE)
- **[📘 v0.2.0 Technical Docs](docs/v0.2.0.md)** - Current version details
- **[⚙️ Setup Guide](docs/SETUP.md)** - Installation & deployment
- **[☁️ Cloudflare Setup](docs/CLOUDFLARE-SETUP-COMPLETE.md)** - Worker configuration
- **[📝 Changelog](docs/CHANGES_SUMMARY.md)** - Version history

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

- ✅ **3-Section Catalog** - Available / Virtual / Sold (collapsible)
- ✅ **Sold Status Tracking** - Real snakes marked sold via Cloudflare KV
- ✅ **Developer Dashboard** - All tools in one place
- ✅ **Tamagotchi Care** - 8 stats, equipment shop, multiple species
- ✅ **Stripe Integration** - Secure payments with webhooks
- ✅ **Zero Dependencies** - Pure ES6 modules
- ✅ **86/86 Tests Passing** - 100% test coverage

---

## 🏗️ Architecture

```
Frontend (GitHub Pages) → Backend (Cloudflare Workers) → Storage (KV)
```

See [docs/v0.2.0.md](docs/v0.2.0.md) or [docs/INDEX.md](docs/INDEX.md) for complete details.

---

## 🛠️ For Developers

**Developer Dashboard:** http://localhost:8000/dashboard.html

**Quick Commands:**
```bash
npm test                              # Run all tests
cd worker && wrangler publish         # Deploy worker
bash scripts/clean-kv.sh              # Clean KV data
```

**Full guide:** [docs/INDEX.md](docs/INDEX.md)

---

## 📄 License

MIT

---

**Repository:** https://github.com/vinas8/catalog  
**Version:** 0.2.0  
**Live Demo:** https://vinas8.github.io/catalog/  
**Documentation:** [docs/](docs/)
