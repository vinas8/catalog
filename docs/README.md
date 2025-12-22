# Documentation Index - Serpent Town v0.3.0

## 🏗️ Core Documentation

- **[COPILOT-RULES.md](COPILOT-RULES.md)** - **🤖 Architectural rules for AI assistants** ⭐
- **[architecture/](architecture/)** - **System architecture and design** (2 docs)
  - [ARCHITECTURE.md](architecture/ARCHITECTURE.md) - Module system
  - [KV-ARCHITECTURE.md](architecture/KV-ARCHITECTURE.md) - KV storage design
- **[SETUP.md](SETUP.md)** - Installation and deployment guide
- **[API_CREDENTIALS.md](API_CREDENTIALS.md)** - API access for AI assistants

## 📦 Module Documentation

- **[modules/README.md](modules/README.md)** - Modules overview and index
- [payment.md](modules/payment.md) - Stripe payments and webhooks
- [shop.md](modules/shop.md) - Product catalog and breeding economy
- [game.md](modules/game.md) - Tamagotchi mechanics and stats
- [auth.md](modules/auth.md) - User authentication
- [common.md](modules/common.md) - Shared utilities

## 🔧 API Reference

- **[project-api.md](project-api.md)** - Core API reference
- **[test-api.md](test-api.md)** - Testing utilities

## 📚 Additional Resources

- **[encyclopedia/](encyclopedia/)** - Snake species and morph database
- **[photos/](photos/)** - Game screenshots and visual documentation
- **[releases/](releases/)** - Version release notes
- **[temp/](temp/)** - Temporary docs and historical setup guides (not current)

## 📁 Documentation Structure

```
/docs/
├── README.md              # This file (documentation index)
├── COPILOT-RULES.md       # AI assistant guidelines ⭐
├── ARCHITECTURE.md        # Module system and design principles
├── KV-ARCHITECTURE.md     # KV storage architecture ⭐ NEW
├── SETUP.md              # Setup and deployment
├── API_CREDENTIALS.md    # API keys management
├── project-api.md        # Core API reference
├── test-api.md           # Testing API
├── modules/              # Per-module documentation
│   ├── README.md         # Modules index
│   ├── payment.md
│   ├── shop.md
│   ├── game.md
│   ├── auth.md
│   └── common.md
├── releases/             # Release notes by version
│   ├── v0.1.0-release-notes.md
│   └── v0.0.x-consolidation.md
├── encyclopedia/         # Species and morph data
├── photos/              # Screenshots
└── temp/                # Temporary docs and historical setup guides
    └── test/            # Test session summaries
```

---

**Version**: 0.3.0  
**Last Updated**: 2025-12-22  
**Modules**: 5 (payment, shop, game, auth, common)
