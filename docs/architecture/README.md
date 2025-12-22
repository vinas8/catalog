# Architecture Documentation Index

**Last Updated:** 2025-12-22  
**Purpose:** All architectural design documents for Serpent Town

---

## 📁 Architecture Documents

### Core Architecture
- **[ARCHITECTURE.md](ARCHITECTURE.md)** - Module system and design principles
- **[KV-ARCHITECTURE.md](KV-ARCHITECTURE.md)** - KV storage architecture and data flow

---

## 🏗️ Architecture Overview

### Modular System
- 5 core modules (payment, shop, game, auth, common)
- Enable/disable with one line
- Tests mirror module structure
- Docs mirror module structure

### Data Architecture
- **Production:** Cloudflare KV storage
- **Testing:** docs/temp/test-data/
- **Development:** JSON fallback when worker unavailable

### Worker Architecture
- Cloudflare Workers for backend
- 3 KV namespaces: PRODUCTS, USER_PRODUCTS, PRODUCT_STATUS
- RESTful API endpoints

---

**Related:**
- [COPILOT-RULES.md](../COPILOT-RULES.md) - Implementation rules
- [Module Docs](../modules/) - Per-module details
