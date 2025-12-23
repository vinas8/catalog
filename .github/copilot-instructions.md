# Serpent Town Project Instructions for AI Assistants

## 👋 New Session Greeting

**When starting a NEW session (first user message), greet with:**

```
👋 Welcome to Serpent Town v0.5.0!

Quick commands:
  .smri  - Complete project briefing (tree, docs, API)
  lol    - Random programming joke 😄

Type a command or tell me what you need!
```

**RULES:**
- Only show greeting on FIRST user message of session
- If user types `.smri` or `lol` immediately, execute that command instead
- Keep greeting concise (3 lines max)

---

## 🎯 Project Overview
**Serpent Town v0.5.0** - Snake breeding e-commerce game with Stripe payments and Tamagotchi-style care mechanics.

**Tech Stack:**
- Frontend: Plain JavaScript ES6 modules, HTML, CSS (zero dependencies)
- Backend: Cloudflare Workers (worker/worker.js)
- Payment: Stripe Checkout + Webhooks
- Data: KV storage (USER_PRODUCTS namespace)
- Hosting: GitHub Pages (static) + Cloudflare Workers (backend)

---

## ⚠️ CRITICAL RULES

### DO NOT Touch Servers
- **NEVER** start, stop, restart, or modify running servers
- **NEVER** run `webhook-server.py` or `upload-server.py`
- **ONLY** check server status with the skill: `check-server-status.sh`
- User manages servers manually - they are NOT for AI modification

### Safe Operations Only
- ✅ Edit code files (HTML, JS, CSS)
- ✅ Deploy Cloudflare Worker (use `worker-deploy.sh` skill)
- ✅ Test worker (use `test-worker.sh` skill)
- ✅ Update data files (products.json, user-products.json)
- ✅ Run tests (`npm test`)
- ❌ NO server operations
- ❌ NO process management

---

## 📁 Key Files & Purpose

### Frontend (Static - GitHub Pages)
- `index.html` - Landing page
- `catalog.html` - Snake shop (Stripe checkout links)
- `game.html` - Tamagotchi game (shows purchased snakes)
- `success.html` - Post-purchase thank you page
- `styles.css` - All styling

### Backend (Cloudflare Worker)
- `worker/worker.js` - **MAIN BACKEND** - handles Stripe webhooks, user products
- `worker/test-worker.js` - Test script for worker endpoints

### Data Files
- `data/products.json` - Available snakes catalog
- `data/user-products.json` - Purchased snakes (webhook writes here)
- `data/users.json` - User accounts

### Core Logic
- `src/business/` - Economy, shop, Stripe sync
- `src/data/` - Species data, morphs, catalog loader
- `src/auth/` - User authentication (hash-based)
- `src/config/` - Stripe API keys

---

## 🔄 Business Flow (IMPORTANT)

```
1. User browses catalog.html
2. Clicks "Buy Now" → Stripe Checkout
3. Completes payment
4. Stripe webhook → Cloudflare Worker (/stripe-webhook)
5. Worker writes to KV storage (USER_PRODUCTS)
6. User opens game.html with #user_hash
7. Game fetches from Worker (/user-products?user=hash)
8. Snake appears in game!
```

**Key Concept:** 
- Purchases are stored in Cloudflare KV by user hash
- Worker API provides access to user's snakes
- Frontend fetches from Worker, NOT local JSON files

---

## 🛠️ Common Tasks

### Deploy Worker Changes
```bash
# Use the skill (preferred)
.github/skills/worker-deploy.sh

# Or manually
cd worker && wrangler publish worker.js
```

### Test Worker Endpoints
```bash
# Use the skill
.github/skills/test-worker.sh

# Or manually
cd worker && node test-worker.js
```

### Check Server Status (READ ONLY)
```bash
# Use the skill - reminds you not to modify servers
.github/skills/check-server-status.sh
```

### Run Tests
```bash
npm test              # All 86 tests
npm run test:unit     # Unit tests only
npm run test:snapshot # Snapshot tests only
```

### Update Products
Edit `data/products.json` - follows this structure:
```json
{
  "id": "prod_xxx",
  "name": "Banana Ball Python",
  "species": "ball_python",
  "morph": "banana",
  "price": 450.00,
  "status": "available",
  "stripe_link": "https://buy.stripe.com/test_xxx"
}
```

---

## 🎮 Game Mechanics

### Stats (8 total)
- Hunger, Water, Temperature, Humidity
- Health, Stress, Cleanliness, Happiness

### Decay Rates (per hour at 1x speed)
- Hunger: -2.0 to -2.5
- Water: -3.0
- Cleanliness: -1.0 to -1.5

### Care Actions
- Feed: Hunger +40, Stress -5
- Water: Water +50, Stress -2
- Clean: Cleanliness +30, Stress -10

### Equipment Shop
15+ items including auto-feeders, thermostats, auto-misting systems

---

## 🔐 Stripe Integration

### Payment Links
Each product in `data/products.json` has a `stripe_link` field pointing to Stripe Checkout.

### Webhook Flow
```
Stripe → POST /stripe-webhook → Worker validates → Saves to KV
```

### User Identification
Users identified by hash in URL: `game.html#user_abc123`
Hash passed to Stripe as `client_reference_id`

---

## 📝 Code Style

- Plain JavaScript ES6 modules
- No build step, no transpiling
- No external dependencies
- Modules export functions/objects
- LocalStorage for game state
- Fetch API for network requests

---

## 🧪 Testing

**Status:** 86/86 tests passing (100%) ✅

```bash
npm test  # Always run before committing changes
```

---

## 🚀 Deployment

### Frontend
- GitHub Pages: https://vinas8.github.io/catalog/
- All paths are relative for GH Pages compatibility

### Backend
- Cloudflare Workers: https://serpent-town.your-subdomain.workers.dev
- KV namespace: USER_PRODUCTS (bound to worker)

---

## 📚 Documentation

**CRITICAL DOCUMENTATION RULES:**

### Two Core Documents
1. **README.md** - Project index and quick reference (readable, searchable, acts as table of contents)
2. **docs/v{version}.md** - Complete technical documentation for current version

### Documentation Workflow
**When user asks about the project:**
1. Check `package.json` for current version (currently **v0.5.0**)
2. Reference **README.md** for overview and quick links
3. Reference **docs/v0.5.0.md** for detailed technical information

**When updating/creating documentation:**
1. Always check `package.json` for current version
2. Update both README.md (index/overview) AND docs/v{version}.md (details)
3. Keep README.md readable and searchable as the project index
4. If version is unclear, ask the user before documenting

### File Priority
- **README.md** → Index, overview, quick start, links to detailed docs
- **docs/v0.5.0.md** → Complete technical reference (PRIMARY for details)
- **src/SMRI.md** → Project index and quick reference
- **docs/reference/PROMPT_INSTRUCTIONS.md** → Complete AI assistant guidelines
- **SETUP.md** → Setup/deployment guide
- **CLOUDFLARE-SETUP-COMPLETE.md** → Cloudflare-specific setup
- **CHANGES_SUMMARY.md** → Change log

---

## 🎯 When User Asks For...

**"Deploy the worker"** → Use `worker-deploy.sh` skill

**"Test the webhook"** → Use `test-worker.sh` skill

**"Check if servers running"** → Use `check-server-status.sh` skill (READ ONLY)

**"Add a new snake"** → Edit `data/products.json`

**"Fix a bug"** → Edit the relevant file, then run `npm test`

**"Start the server"** → ⚠️ STOP! Remind user you don't manage servers

---

## ⚡ Quick Reference

**Repository:** https://github.com/vinas8/catalog  
**Version:** 0.5.0  
**Lines of Code:** ~3,600  
**Dependencies:** 0  
**Tests:** 86/86 (100%) ✅  
**Status:** In Development 🚧

**Species:** Ball Python, Corn Snake  
**Morphs:** 10+ (Banana, Piebald, Pastel, etc.)  
**Shop Items:** 15+

---

## 🤝 Working Style

1. **Always check what exists** before creating/modifying
2. **Run tests** after code changes
3. **Use skills** for deployment and testing
4. **Never touch servers** - user manages those
5. **Ask before** major architectural changes
6. **Keep it simple** - no unnecessary dependencies

---

## 🔐 API Credentials Access

AI assistants have programmatic access to these services via `.env` file:

### Available APIs:
- **Cloudflare**: Worker deployment, KV storage management
- **Stripe**: Payment link configuration, webhook management  
- **GitHub**: Repository operations, workflow triggers

### Verification Script:
```bash
bash scripts/verify-api-connections.sh
```

### Adding GitHub Token:
1. Go to: https://github.com/settings/tokens/new
2. Name: `Serpent Town AI Access`
3. Scopes: `repo`, `workflow`
4. Copy token
5. Add to `.env`: `GITHUB_TOKEN=your_token_here`

### Example AI Commands:
- "Deploy worker to Cloudflare"
- "Update Stripe payment link redirect URL"
- "Check GitHub Actions status"
- "List items in KV storage"

---

**Remember:** This is a production project. Make surgical, minimal changes. Test everything. Never break working code.

## 😄 Special Commands

**When user says "lol"** → Respond with a random programming/snake joke before continuing with the task.

Examples:
- "Why do Python programmers prefer dark mode? Because light attracts bugs! 🐛"
- "What's a snake's favorite programming language? Python, obviously! 🐍"
- "Why do programmers always confuse Halloween and Christmas? Because Oct 31 == Dec 25! 🎃🎄"
- "How do snakes deploy code? They use pip install! 🐍📦"

**When user types ".smri"** → Run a complete project briefing in this exact order:

1. **Display COMPLETE Directory Tree**
   - Run: `find /root/catalog -type f -o -type d | grep -v node_modules | grep -v '\.git' | grep -v venv | grep -v __pycache__ | sort`
   - Show **entire project structure** (not just src/)
   - Format as readable tree with file counts

2. **Load & Display README.md**
   - Check current version from `package.json`
   - Display `/root/catalog/README.md` (project overview)
   - Note any version mismatches between README and package.json

3. **Check & Update README Version**
   - Compare README version badges/numbers with package.json version
   - If mismatch found, **automatically update** README.md:
     - Line 1: `# 🐍 Serpent Town v{version}`
     - Line 7: `[![Version](https://img.shields.io/badge/version-{version}-purple)]()`
     - Bottom section: `**Version:** {version}`
   - Show before/after diff of changes made

4. **Load Complete API Documentation**
   - Display `/root/catalog/docs/v{version}.md` (use version from package.json)
   - Show full API definitions, endpoints, and module reference
   - If version doc doesn't exist, show latest available in docs/

5. **Display SMRI Index**
   - Show `/root/catalog/src/SMRI.md` (quick reference and project index)

6. **Summary Output**
   - Project version and status
   - Module count and test status (86/86 passing)
   - Quick command reference
   - Links to key documentation files

7. **Session Continuation Prompt**
   - End with: "📍 **Where did we leave off?** (or type what you need help with)"
   - Wait for user to provide context or new task

**Purpose:** Complete project onboarding in one command. Shows structure, documentation, APIs, and current state. Always asks user to pick up where they left off.

**Keywords for search:** .smri, smri, project index, structure, overview, quickref, api, documentation, onboarding
