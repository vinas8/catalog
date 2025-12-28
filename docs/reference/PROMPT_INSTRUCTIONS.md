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

### 📋 SMRI Command System

**Keywords:** .smri, smri, help, update, recent, commit, health check, project briefing, documentation

---

#### **`.smri`** - Complete Project Briefing

Run complete system onboarding + health check:

1. **Display Directory Tree**
   ```bash
   find /root/catalog -type f -o -type d | grep -v node_modules | grep -v '\.git' | grep -v venv | grep -v __pycache__ | sort
   ```

2. **Version Check**
   - Show current version from `package.json`
   - Display `/root/catalog/README.md`
   - Auto-update README if version mismatch

3. **Load Complete API Documentation**
   - Display `/root/catalog/docs/v{version}.md` (API reference)
   - If version doc doesn't exist, show latest available

4. **Display SMRI Index**
   - Show `/root/catalog/src/SMRI.md` (quick reference)

5. **Display Command List**
   ```
   📋 SMRI COMMANDS:
   .smri          - Complete project briefing (you are here)
   .smri help     - Show command list
   .smri update   - Update SMRI from latest docs
   .smri update recent - Document recent commit changes
   ```

6. **Ask: "📍 Where did we leave off?"**

**Purpose:** Complete project onboarding in one command.

---

#### **`.smri help`** - Quick Command List

Display concise help:

```
📋 SMRI COMMANDS:

.smri                    Complete project briefing
.smri help               Show this command list
.smri progress           Show progress (tests, E2E, debug, features)
.smri update             Update SMRI from latest docs
.smri update recent      Document recent commit

📖 Full docs: docs/reference/PROMPT_INSTRUCTIONS.md
```

---

#### **`.smri progress`** - Progress Dashboard

Show comprehensive progress across all areas:

**Display Format:**

```
📊 SERPENT TOWN PROGRESS DASHBOARD
Version: 0.7.0 | Date: {current_date}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🧪 TESTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Unit Tests:        86/86   100% ✅
E2E Scenarios:     26/42    62% 🚧
Test Files:        26 files
Test Cases:        389 total
Coverage:          Unit tests passing

🎯 E2E SCENARIOS (from .smri manifest)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
P0 (Critical):     13 scenarios - 85% ✅
P1 (Gameplay):     9 scenarios  - 55% 🚧
P2 (Identity):     5 scenarios  - 60% 🚧
P3+ (Features):    15 scenarios - 30% 📋

Top P0 Scenarios:
✅ S1.1.01 - Product Status Check
✅ S5.5.01 - Webhook Signature Validation
✅ S6.0.03 - Health Check System
🚧 S1.1,2,3,4,5.01 - Happy Path Purchase
🚧 S1.1,2,3,4.01 - Returning User Flow

🛠️ DEBUG TOOLS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Debug Pages:       14 tools
- healthcheck.html          ✅
- customer-debug.html       ✅
- data-inspector.html       ✅
- purchase-flow-demo.html   ✅
- test-scenarios.html       ✅
+ 9 more tools

🚀 FEATURES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Modules:           6 core modules
Exported APIs:     25+ functions
Code:              ~4,200 lines

Core Features:
✅ Stripe Checkout Integration
✅ Cloudflare Worker Backend
✅ KV Storage Sync
✅ Email Notifications (v0.7.0)
✅ Tamagotchi Game Mechanics
✅ Snake Breeding System
✅ Equipment Shop (15+ items)
🚧 Snake Genetics System (planned)

📈 OVERALL PROGRESS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Development:       85% 🚀
Production Ready:  Core features ✅
Next Milestone:    Complete P0 E2E scenarios

Type .smri to see full project briefing
```

**Data Sources:**
1. `npm test` output - Unit test status
2. `.smri` manifest - E2E scenario list (617 lines)
3. `tests/` directory - Test file count
4. `debug/` directory - Debug tool count
5. `src/modules/` - Module and feature count
6. `package.json` - Current version
7. Git history - Recent progress

**Purpose:** Quick snapshot of project health and progress.

---

#### **`.smri update`** - Update SMRI from Docs

Synchronize `src/SMRI.md` with latest documentation:

1. Check version from `package.json`
2. Scan `docs/v{version}.md`, `docs/STRIPE-KV-SYNC.md`, `docs/EMAIL_IMPLEMENTATION_SUMMARY.md`
3. Update SMRI.md: version, test status, new features, doc links
4. Report changes made

---

#### **`.smri update recent`** - Document Recent Commit

Document changes from latest (or specified) commit:

**Usage:**
- `.smri update recent` - Document latest commit
- `.smri update recent commit abc123` - Document specific commit

**Process:**
1. Get commit info: `git log --oneline -1` (or specified)
2. Extract changes: `git show --stat {commit}`, `git diff {commit}^..{commit}`
3. Update SMRI.md "Recent Updates" section with:
   - Commit hash, message, date, author
   - Files changed with line counts
   - Key changes description
   - Impact summary
4. Report update completion

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
