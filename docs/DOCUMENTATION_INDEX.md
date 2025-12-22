# 📚 Serpent Town Documentation Index

Complete guide to all documentation for developers and AI assistants.

---

## 🚀 Getting Started

1. **[README.md](../README.md)** - Project overview and quick start
2. **[Developer Reference](DEVELOPER_REFERENCE.md)** - Command cheatsheet (⭐ START HERE)
3. **[Setup Guide](SETUP.md)** - Installation and deployment

---

## 🛠️ Developer Tools

### Essential References
- **[Developer Reference Card](DEVELOPER_REFERENCE.md)** - Quick commands, common issues
- **[Cloudflare API Examples](CLOUDFLARE_API_EXAMPLES.md)** - Complete curl reference with examples
- **[API Credentials](API_CREDENTIALS.md)** - How to get and use API keys

### Debugging
- **[Debug Page](../d.html)** - Browser-based API tester
- **[Test Scripts](../scripts/)** - Helper bash scripts

---

## 🏗️ Architecture

### Module System
- **[Module Overview](modules/README.md)** - Modular architecture
- **[Payment Module](modules/payment.md)** - Stripe integration
- **[Shop Module](modules/shop.md)** - Product catalog & economy
- **[Game Module](modules/game.md)** - Tamagotchi mechanics
- **[Auth Module](modules/auth.md)** - User authentication
- **[Common Module](modules/common.md)** - Shared utilities

### Configuration
- **[Feature Flags](../src/config/feature-flags.js)** - Enable/disable features
- **[Worker Config](../src/config/worker-config.js)** - API URLs

---

## 📖 API Documentation

- **[API Reference](project-api.md)** - Endpoint documentation
- **[Worker Endpoints](CLOUDFLARE_API_EXAMPLES.md#-worker-api-endpoints)** - Public API
- **[KV Storage](CLOUDFLARE_API_EXAMPLES.md#-kv-storage-structure)** - Data structure

---

## 🔧 Operations

### Deployment
- **[Setup Guide](SETUP.md)** - Full deployment instructions
- **[Cloudflare Setup](../CLOUDFLARE-SETUP-COMPLETE.md)** - Cloudflare-specific setup

### Maintenance
- **[KV Management](CLOUDFLARE_API_EXAMPLES.md#-kv-namespace-products)** - Managing products
- **[Test Scripts](../scripts/)** - Automated helpers

---

## 📝 Change Logs

- **[Changes Summary](../CHANGES_SUMMARY.md)** - Recent updates
- **[Virtual Snakes Disabled](VIRTUAL_SNAKES_DISABLED.md)** - Feature flag example

---

## 🎯 By Task

### I want to...

**Add a new product:**
1. Read: [Cloudflare API Examples § Add Product](CLOUDFLARE_API_EXAMPLES.md#adupdate-a-product)
2. Run: `bash scripts/rebuild-product-index.sh`

**Debug API issues:**
1. Open: `/d.html` in browser
2. Read: [Developer Reference § Common Issues](DEVELOPER_REFERENCE.md#-common-issues)

**Deploy changes:**
1. Read: [Setup Guide § Deployment](SETUP.md)
2. Run: `cd worker && wrangler publish`

**Toggle a feature:**
1. Edit: `src/config/feature-flags.js`
2. Read: [Feature Flags Example](VIRTUAL_SNAKES_DISABLED.md)

**Understand the architecture:**
1. Read: [Module System](modules/README.md)
2. Check: [Module Diagrams](modules/payment.md)

**Fix "products not showing":**
1. Check: [Developer Reference § Common Issues](DEVELOPER_REFERENCE.md#products-not-showing)
2. Run: `bash scripts/rebuild-product-index.sh`

---

## 📊 Documentation Stats

- **Total docs:** 15+ files
- **Code examples:** 100+ curl commands
- **Test coverage:** 86/86 tests (100%)
- **Lines documented:** ~20,000

---

## 🤖 For AI Assistants

**When user asks about:**
- Commands → [Developer Reference](DEVELOPER_REFERENCE.md)
- Cloudflare/KV → [Cloudflare API Examples](CLOUDFLARE_API_EXAMPLES.md)
- Architecture → [Module System](modules/README.md)
- Deployment → [Setup Guide](SETUP.md)
- Bugs → [Developer Reference § Common Issues](DEVELOPER_REFERENCE.md#-common-issues)

**Always check:**
1. `package.json` for current version
2. README.md for project overview
3. This index for specific docs

---

**Last Updated:** 2025-12-22  
**Version:** 0.3.0  
**Maintainer:** AI Assistant + Human Developer
