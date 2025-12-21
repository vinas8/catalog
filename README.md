# 🐍 Serpent Town

**Version 0.1.0** - Snake breeding e-commerce game with Stripe payments and Tamagotchi-style care mechanics.

[![Tests](https://img.shields.io/badge/tests-86%2F86%20passing-brightgreen)]()
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue)]()

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run tests
npm test

# Deploy worker
.github/skills/worker-deploy.sh

# Check server status
.github/skills/check-server-status.sh
```

## 📚 Documentation

- **[Complete Technical Docs](docs/v0.1.0.md)** - Primary reference for v0.1.0
- **[Setup Guide](SETUP.md)** - Installation and deployment
- **[Cloudflare Setup](CLOUDFLARE-SETUP-COMPLETE.md)** - Worker configuration
- **[API Credentials](docs/API_CREDENTIALS.md)** - API access for AI assistants
- **[Changes Log](CHANGES_SUMMARY.md)** - Version history

## 🎮 Live Demo

- **Frontend**: https://vinas8.github.io/catalog/
- **Backend**: Cloudflare Workers + KV Storage
- **Payments**: Stripe Checkout + Webhooks

## 🏗️ Tech Stack

- **Frontend**: Vanilla JavaScript ES6 modules (zero dependencies)
- **Backend**: Cloudflare Workers
- **Storage**: Cloudflare KV
- **Payments**: Stripe API
- **Hosting**: GitHub Pages + Cloudflare

## 📁 Project Structure

```
/src/               - Core game logic (3,600+ LOC)
  /business/        - Economy, shop, Stripe sync
  /data/            - Species, morphs, catalog
  /auth/            - User authentication
  /config/          - API keys and configuration
/worker/            - Cloudflare Worker backend
/data/              - JSON data files
/tests/             - Test suite (86 tests, 100% pass)
/docs/              - Documentation
```

## 🔑 Key Features

- **Snake Breeding System** - Ball Pythons & Corn Snakes
- **Tamagotchi Care** - 8 stats (hunger, water, temp, etc.)
- **Stripe Integration** - Secure checkout + webhooks
- **Equipment Shop** - 15+ items (auto-feeders, thermostats, etc.)
- **Morph System** - 10+ morphs (Banana, Piebald, Pastel, etc.)

## 🧪 Testing

```bash
npm test              # All 86 tests
npm run test:unit     # Unit tests only
npm run test:snapshot # Snapshot tests
```

**Status**: 86/86 tests passing ✅

## 🛠️ Development

**Available Scripts:**
- `.github/skills/worker-deploy.sh` - Deploy Cloudflare Worker
- `.github/skills/test-worker.sh` - Test worker endpoints
- `.github/skills/check-server-status.sh` - Check server status (read-only)

**Important**: AI assistants should NOT start/stop servers. Use status check only.

## 📦 Business Flow

```
User → Catalog → Stripe Checkout → Payment
  ↓
Webhook → Worker → KV Storage
  ↓
Game fetches user's snakes → Tamagotchi gameplay
```

## 🔐 API Access

AI assistants have programmatic access via `.env`:
- Cloudflare (Worker deployment, KV storage)
- Stripe (Payment links, webhooks)
- GitHub (Repo operations, workflows)

Verify connections: `bash scripts/verify-api-connections.sh`

## 📄 License

MIT

## 🤝 Contributing

See [docs/v0.1.0.md](docs/v0.1.0.md) for architecture details and contribution guidelines.

---

**Repository**: https://github.com/vinas8/catalog  
**Version**: 0.1.0  
**Last Updated**: 2025-12-21
