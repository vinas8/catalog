# Serpent Town - AI Assistant Instructions

## 🎯 Project Quick Facts

**Current Version:** 0.5.0 (from package.json)  
**Documentation:** `docs/v0.5.0.md` (check this file for current version docs)  
**Index:** `README.md` (project overview and navigation)

## 📚 Documentation Structure (CRITICAL)

### Two-File System

1. **README.md** - Project index and quick reference
   - Acts as table of contents
   - Readable, searchable overview
   - Links to detailed docs

2. **docs/v{version}.md** - Complete technical documentation
   - Primary source of truth for version details
   - Current: `docs/v0.5.0.md`
   - Full technical specs, API endpoints, architecture

### Documentation Workflow

**When user asks about the project:**
```
1. Check package.json → get current version (0.5.0)
2. Reference README.md → overview/quick links
3. Reference docs/v0.5.0.md → detailed tech info
```

**When updating documentation:**
```
1. Check package.json for version
2. Update README.md (index/overview)
3. Update docs/v{version}.md (technical details)
4. If version unclear → ASK USER
```

## 🏗️ Architecture Overview

### Core Concept
**Hash-identity, webhook-driven, KV-backed game platform**

- Users identified by client-generated hash (32+ chars)
- Purchases triggered by Stripe webhooks
- Data stored in Cloudflare KV (USER_PRODUCTS namespace)
- Frontend loads from Worker API, not local JSON

### Data Flow
```
User → Catalog → Stripe Checkout
  ↓
Stripe Webhook → Worker → KV Storage
  ↓
Game.html → Worker API → Fetch User Products → Display
```

## 🔧 Tech Stack

- **Frontend:** Plain JavaScript ES6 modules (zero dependencies)
- **Backend:** Cloudflare Workers (`worker/worker.js`)
- **Storage:** Cloudflare KV (key-value store)
- **Payments:** Stripe Checkout + Webhooks
- **Hosting:** GitHub Pages (static) + Cloudflare Workers (API)

## 🚫 CRITICAL RULES

### DO NOT Touch Servers
- ❌ NEVER start/stop/restart servers
- ❌ NEVER run `webhook-server.py` or `upload-server.py`
- ✅ ONLY check status: `.github/skills/check-server-status.sh`
- **User manages servers manually**

### Safe Operations
```
✅ Edit code files (HTML, JS, CSS)
✅ Deploy worker: .github/skills/worker-deploy.sh
✅ Test worker: .github/skills/test-worker.sh
✅ Update data files (products.json)
✅ Run tests: npm test
❌ NO server operations
❌ NO process management
```

## 📁 File Structure

```
/root/catalog/
├── README.md                    # Project index (start here)
├── docs/
│   ├── v0.5.0.md               # Current version docs ← PRIMARY
│   ├── BUSINESS_FACTS.md       # Abstract system rules
│   └── test/E2E_TEST_SCENARIOS.md  # SMRI test scenarios
├── src/
│   ├── modules/
│   │   ├── shop/               # Catalog, products (Module 1)
│   │   ├── game/               # Gameplay logic (Module 2)
│   │   ├── auth/               # User identity (Module 3)
│   │   ├── payment/            # Webhook handling (Module 4)
│   │   ├── worker/             # API routing (Module 5)
│   │   ├── common/             # Shared utils (Module 6)
│   │   └── debug/              # Debug dashboard
│   └── config/
│       └── worker-config.js    # Worker URLs/endpoints
├── worker/
│   └── worker.js               # Cloudflare Worker (backend)
├── catalog.html                # Main shop page
├── game.html                   # Tamagotchi game
└── tests/                      # Test suite (71 tests)
```

## 🎮 Core Modules (SMRI-Based)

### Internal Modules (1-6)
1. **Shop** - Catalog + checkout links
2. **Game** - Gameplay, stats, rendering
3. **Auth** - User hash identity
4. **Payment** - Stripe webhook validation
5. **Worker** - API routing + KV orchestration
6. **Common** - Shared utilities

### External Dependencies
- Cloudflare (11.x): KV, Workers, CDN
- Stripe (12.x): Checkout, Webhooks
- GitHub (13.x): Pages, Actions

## 🧪 Testing

```bash
npm test              # Fast tests (71 tests)
npm run test:slow     # Integration tests
npm run test:e2e      # End-to-end scenarios
npm run test:full     # All tests + E2E + security
```

**Current Status:** 71/71 tests passing ✅

## 🐛 Debug Tools

**Debug Dashboard:** `src/modules/debug/index.html`

- SMRI scenario runner
- API endpoint testing
- KV storage inspection
- Catalog loader testing
- User product inspection

**Access:** `http://localhost:8000/debug.html`

## 🔄 Common Tasks

### Deploy Worker
```bash
.github/skills/worker-deploy.sh
# or manually:
cd worker && wrangler publish worker.js
```

### Test Worker API
```bash
.github/skills/test-worker.sh
# or manually:
curl https://catalog.navickaszilvinas.workers.dev/products
```

### Check Server Status (READ ONLY)
```bash
.github/skills/check-server-status.sh
```

### Run Tests
```bash
npm test
```

## 🎯 SMRI Mental Model

**Format:** `S M.RRR.II`
- **S** = Scenario
- **M** = Module owner (1-6)
- **RRR** = Relations (internal/external)
- **II** = Instance number

**Example:** `S1.2.01` = Shop module scenario #01

**Key Concept:** Every scenario has ONE owning module.

## 🔐 Security (P0)

- Hash validation (no XSS/SQLi)
- Webhook signature verification
- Output sanitization (not storage mutation)
- No cross-user data access
- No admin backdoors

## 💡 Special Commands (Custom for this project)

> **Note:** These are project-specific commands, not standard GitHub Copilot CLI features. They appear in search/grep results for discoverability.

### `.smri` - System Health & E2E Status  
**Keywords:** .smri, smri, health check, e2e, scenarios, project briefing

**When user types ".smri":** Run complete system briefing + health check:

1. **Display Directory Tree**
   ```bash
   find /root/catalog -type f -o -type d | grep -v node_modules | grep -v '\.git' | sort
   ```

2. **Version Check**
   - Show current version from `package.json`
   - Display `/root/catalog/README.md`
   - Auto-update README if version mismatch

3. **SMRI Health Check (S6.0.03)**
   ```bash
   # Check server
   ps aux | grep "python.*8000"
   
   # Test Worker (if accessible)
   curl -s {WORKER_URL}/products | jq 'length'
   ```
   
   Report:
   ```
   🏥 SYSTEM HEALTH (S6.0.03)
   ✅ Server: Running on :8000
   ✅ Worker: ONLINE (###ms)  
   ✅ Products: ## from KV
   ✅ UI: 8 modules verified
   ✅ Tests: 86/86 passing
   ```

4. **E2E Scenario Status**
   Parse `docs/test/E2E_TEST_SCENARIOS.md`:
   ```
   📊 SMRI E2E SCENARIOS
   Total: 42 scenarios
   - P0 (Must-Work): 13 - 100% ✅
   - P1 (Gameplay): 9 - 100% ✅  
   - P2 (Identity): 5 - 100% ✅
   - P3+: 14 - ~50% ⚠️
   
   NEW: S6.0.03 (Health Check) ✅
   Implementation: 88% (36/41)
   ```

5. **Quick Access**
   ```
   🔗 http://localhost:8000/debug.html
   🔗 http://localhost:8000/catalog.html
   🔗 http://localhost:8000/game.html
   ```

6. **Load Documentation**
   - Display `docs/v{version}.md` (API reference)
   - Display `src/SMRI.md` (quick index)

7. **Ask: "📍 Where did we leave off?"**

**Purpose:** Holistic view = structure + health + E2E status + business value

### `lol` - Code Humor
**Keywords:** lol, joke, fun, programming humor, snake jokes

**When user says "lol":** Respond with a random programming/snake joke before continuing with the task.

Examples:
- "Why do Python programmers prefer dark mode? Because light attracts bugs! 🐛"
- "What's a snake's favorite programming language? Python, obviously! 🐍"
- "Why do programmers always confuse Halloween and Christmas? Because Oct 31 == Dec 25! 🎃🎄"
- "How do snakes deploy code? They use pip install! 🐍📦"

## 📈 Recent Changes (v0.5.0)

### Latest Fix: Catalog Loading Issue (2025-12-23)

**Problem:** Catalog showed "Loading..." forever.

**Cause:** Products in KV had missing `price` field → `item.price.toFixed(2)` crashed.

**Solution:** Added null-safe price handling in `catalog-renderer.js`:
```javascript
const price = typeof item.price === 'number' ? item.price : 0;
const priceFormatted = price.toFixed(2);
```

**Result:** Catalog now works even with incomplete product data.

**See:** `FIX_CATALOG_LOADING.md` for full details.

## 🎓 Working Philosophy

1. **Documentation-first** - Docs define behavior
2. **Test-driven** - Tests enforce behavior
3. **Debug-ready** - Debug tools execute workflows
4. **Zero dependencies** - Plain JavaScript only
5. **Surgical changes** - Minimal code modifications
6. **Always test** - Run `npm test` after changes

## 🔗 Important Links

- **Worker URL:** https://catalog.navickaszilvinas.workers.dev
- **Frontend:** https://vinas8.github.io/catalog/
- **Repository:** https://github.com/vinas8/catalog
- **Local Dev:** http://localhost:8000

## 📝 Key Principles

1. **Stateless** - No server-side sessions
2. **Event-driven** - Webhook-triggered updates
3. **KV-backed** - Cloudflare KV is source of truth
4. **Hash-identity** - Client-generated user IDs
5. **Debuggable** - Debug tools share logic with tests

---

**Version:** 0.5.0  
**Last Updated:** 2025-12-23  
**For:** AI Assistants working on Serpent Town

**Remember:** Always check `package.json` for current version, then reference `docs/v{version}.md` for technical details!
