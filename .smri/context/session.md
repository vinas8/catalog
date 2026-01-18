# SMRI Session Context
**Generated:** 2026-01-17 10:30:50 UTC  
**Commit:** eece24f  
**Version:** 0.7.7

---

## 🔍 Recent Activity

### Git Log (Last 20 commits)
```
eece24f fix: Demo product now includes Stripe link and correct button selectors
b14cd00 feat: Product page Stripe buyability and E2E tests
60c1e7f fix: Product page demo flow and View Details routing
e490aa2 fix: Add top-level species/morph fields to demo product for URL building
9dcbff8 fix: Use correct .catalog-item selector in demo (not .product-card)
516f057 fix: Demo uses localStorage isolation with ?source=demo_test parameter
c839793 archive: Move broken demo lifecycle files to archive
1237de6 docs: Add comprehensive demo lifecycle implementation documentation
99a7193 feat: Enhance SMRI startup with usage tracking, HEAD comparison, and new commands
cb7deab fix: Add cache busters to common module sub-imports
10fae8f fix: Game loads demo snakes from localStorage when source param present
410e6d2 fix: Use correct TIMEOUTS constant name (NOTIFICATION_DURATION)
f4ba50c fix: Add cache buster to common module import
b7c15a3 fix: Update test to handle versioned script tags
724de27 fix: Correct JavaScript structure in success.html
6b2fd26 feat: Demo purchase follows real purchase flow with success page redirect
c595d1e fix: Update version to 0.7.7 and improve cache busting
19ab6f1 fix: Add cache buster to game-controller import
fe3da39 fix: Add demo purchase buttons and fix Core export
d60034c fix: Add source-aware caching to catalog module to support demo isolation
```

### Git Status
```
 M .smri/context/LAST_UPDATE.txt
 M .smri/context/git-log.txt
 M .smri/context/health.txt
 M .smri/context/session.md
 M tests/e2e/README.md
?? tests/e2e/README-OLD.md
```

---

## 📁 Project Structure

```
.
├── admin
│   ├── account.html
│   ├── import-modular.html
│   ├── import.html
│   └── index.html
├── calc
│   ├── calculator.html
│   └── index.html
├── cloudflare
│   └── product-router.js
├── data
│   ├── backup-20260102-192725
│   ├── cache
│   ├── genetics
│   ├── demo-products.json
│   ├── index.html
│   ├── products-real-test.json
│   └── snakes-collection.csv
├── debug
│   ├── archive
│   ├── archive-pre-executor-focus
│   ├── archive-pre-v0.8.0
│   ├── breeding-calculator
│   ├── calc
│   ├── modules
│   ├── releases
│   ├── templates
│   ├── tools
│   ├── README.md
│   ├── csv-import-manager.js
│   ├── debug-guard.js
│   ├── index.html
│   ├── mcp-test-report.html
│   ├── mobile-console.js
│   ├── redirect.html
│   ├── smri-runner.html
│   ├── smri-scenarios.js
│   ├── smri-tests.js
│   └── test-runner-simple.html
├── demo
│   ├── customer-journeys
│   └── index.html
├── dex
│   ├── modules
│   ├── archive-index-old.html
│   ├── index.html
│   ├── pokedex-style.html
│   ├── simple-grid.html
│   └── trait-style.html
... (truncated, see .smri/context/tree.txt for full)
```

---

## 📚 Core Documentation

### .smri/INDEX.md (920 lines)
First 100 lines:
```markdown
# 🐍 Serpent Town - Index & Rules

**Version:** 0.7.7  
**Last Updated:** 2026-01-14  
**Purpose:** SMRI system index and operating rules

---

## 🚨 AI: STOP! READ THIS FIRST

**When user types `.smri`, DO THIS FIRST:**

```bash
bash scripts/smri-startup.sh
```

**DO NOT manually load INDEX.md, README.md, etc.**  
**The script handles EVERYTHING automatically.**

After script completes, you can read this INDEX.md if needed for additional context.

---

## 📖 What is .smri?

**SMRI** = **S**erpent Town **M**aster **R**eference **I**ndex

A consolidated documentation system where **ALL** project documentation lives:
- **INDEX.md** (this file) - Navigation, rules, AI instructions
- **docs/** - Focused topic docs (business, technical, deployment)
- **scenarios/** - Test scenarios in structured format
- **logs/** - Daily session conversation history

**Goal:** Single source of truth. **NO scattered docs**. Everything in `.smri/`.

---

## 🚨 CRITICAL RULES FOR AI ASSISTANTS

### 0. HARD RULE: Only ONE file in .smri root
**ONLY `INDEX.md` allowed in `/root/catalog/.smri/`**
- ❌ NO `.smri/AI-GUIDE.md`
- ❌ NO `.smri/README.md`
- ❌ NO `.smri/RULES.md`
- ✅ Use `.smri/logs/` for notes
- ✅ Use `.smri/docs/` for documentation

### 0.5. ANTI-SCATTER RULE: Follow Defined Structure
**WHY WE LOAD .smri: To prevent scattered files everywhere**

**PROBLEM:** Files get scattered across project:
- ❌ Multiple demo files in different locations
- ❌ Duplicate test runners (root, debug/, debug/tools/, debug/archive/)
- ❌ Similar files with slight differences
- ❌ No clear "source of truth"

**SOLUTION:** Strict structure enforcement
```
/debug/
  ├── index.html              ← Main debug hub (ONLY ONE)
  ├── tools/
  │   ├── smri-runner.html    ← Test executor (ONLY ONE)
  │   ├── kv-manager.html     ← KV management
  │   └── healthcheck.html    ← Health checks
  ├── purchase-flow-demo.html ← Purchase demo (ONLY ONE)
  ├── visual-demo.html        ← Visual demo (ONLY ONE)
  └── archive/                ← Old versions (NEVER use)
```

**RULES:**
1. **Before creating ANY file:** Check if it exists using `find` or `tree`
2. **If similar file exists:** Update existing, DON'T create new
3. **If old version exists:** Archive it, then create ONE new version
4. **Never create duplicates:** smri-runner-v2.html, demo-new.html, test-final.html
5. **Follow the map:** `.smri/INDEX.md` defines structure - stick to it

**AI ACTION REQUIRED:**
```bash
# Before creating any file, ALWAYS run:
cd /root/catalog && find . -name "*similar-name*" -type f
tree -L 3 debug/

# If duplicates found:
# 1. Move old to archive
# 2. Update/create ONE canonical version
# 3. Document in .smri/logs/
```

**This prevents:** "Where's the demo? There are 5 demo files!"  
**This ensures:** "The demo is at `/debug/visual-demo.html` - that's the only one."

### 1. Use Git to Verify Structure
**ALWAYS run before creating files:**
```bash
cd /root/catalog && git status .smri/
tree -L 3 .smri/
```

**After changes:**
```bash
```
... (truncated, see .smri/context/INDEX.md for full)

### README.md (309 lines)
First 80 lines:
```markdown
# 🐍 Snake Muffin v0.7.7

> A snake breeding and care e-commerce game with real Stripe payments

[![Version](https://img.shields.io/badge/version-0.7.7-purple)](https://github.com/vinas8/catalog)
[![Status](https://img.shields.io/badge/status-beta-orange)](https://github.com/vinas8/catalog)
[![Live Demo](https://img.shields.io/badge/demo-live-success)](https://vinas8.github.io/catalog/)
[![License](https://img.shields.io/badge/license-MIT-blue)](LICENSE)

⚠️ **Beta Software** - Not production ready. Use at your own risk.

## 🎯 What is Snake Muffin?

Snake Muffin is a unique web application combining:
- **E-commerce** - Buy real ball pythons with Stripe payments
- **Pet Care Game** - Tamagotchi-style snake care mechanics
- **Collection Management** - Track and manage your purchased snakes

## ✨ Features

### 🛒 Shop & Purchase
- Browse available ball pythons
- Secure Stripe Checkout integration
- Real-time payment processing
- Automatic product delivery

### 🎮 Care Mechanics
- 8 vital stats (hunger, water, temperature, humidity, health, stress, cleanliness, happiness)
- Feed, water, and clean your snakes
- Stats decay over time (requires care)
- Equipment shop (auto-feeders, thermostats, etc.)

### 📊 Collection
- View all purchased snakes
- Track individual stats per snake
- Species and morph information
- Purchase history

## 🚀 Live Demo

**Frontend:** https://vinas8.github.io/catalog/  
**API:** https://catalog.navickaszilvinas.workers.dev

## 🏗️ Architecture

```
┌─────────────────┐      ┌──────────────────┐      ┌─────────────────┐
│  GitHub Pages   │      │ Cloudflare Worker │      │     Stripe      │
│   (Frontend)    │─────▶│    (Backend)      │◀─────│   (Payments)    │
└─────────────────┘      └──────────────────┘      └─────────────────┘
                                  │
                                  ▼
                         ┌──────────────────┐
                         │  Cloudflare KV   │
                         │    (Storage)     │
                         └──────────────────┘
```

### Tech Stack

**Frontend:**
- Plain JavaScript (ES6 modules)
- No framework, no build step
- HTML5 + CSS3

**Backend:**
- Cloudflare Workers (serverless)
- Cloudflare KV (storage)
- Stripe API integration

**Deployment:**
- GitHub Pages (static frontend)
- Cloudflare Workers (API)
- GitHub Actions (CI/CD)

## 📁 Project Structure

```
catalog/
├── index.html              # Landing page
```
... (truncated, see .smri/context/README.md for full)

### src/SMRI.md (226 lines)
First 50 lines:
```markdown
# 🐍 Serpent Town Project Index (SMRI)

**Version:** 0.7.7  
**Status:** ⚠️ BETA - Not Production Ready  
**Tests:** 88/88 passing (98%) ✅

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
```
... (truncated, see .smri/context/SMRI.md for full)

---

## 📦 Modules & Components

### Modules (src/modules/)
```
auth
breeding
cart
common
config
demo
game
import
payment
shop
smri
testing
tutorial
```

### Components (src/components/)
```
BrowserFrame.js
DebugPanel.js
Navigation.js
PWAInstallButton.js
SnakeDetailModal.js
SplitScreenDemo.js
TestRenderer.js
```

---

## 🏥 Health Status

```
[34m
📏 Checking Large Files...[0m 
[33m⚠️[0m .smri/INDEX.md: 921 lines (max: 500)
[33m⚠️[0m .smri/context/INDEX.md: 921 lines (max: 500)
[33m⚠️[0m .smri/docs/business-plan/BUSINESS-PLAN-CHAPTERS-3-6.md: 728 lines (max: 500)
[33m⚠️[0m .smri/docs/business-plan/BUSINESS-PLAN-COMPREHENSIVE.md: 1576 lines (max: 500)
[33m⚠️[0m .smri/docs/business-plan/SERPENT-TOWN-BUSINESS-PLAN.md: 777 lines (max: 500)
[33m⚠️[0m .smri/docs/morphmarket-integration.md: 502 lines (max: 500)
[33m⚠️[0m .smri/docs/technical.md: 523 lines (max: 500)
[33m⚠️[0m .smri/scenarios/S6.1,2,3.09-FLUENT-CUSTOMER-JOURNEY.md: 849 lines (max: 500)
[33m⚠️[0m src/modules/game/game-controller.js: 1215 lines (max: 1000)
[33m⚠️[0m worker/worker.js: 2271 lines (max: 1000)
[34m
📦 Checking Module Exports...[0m 
[32m✅[0m PUBLIC-API.md exists
[32m✅[0m module-functions.js exists
[34m
📊 Summary:[0m 
[32m✅[0m Version Consistency
[32m✅[0m Module Structure
[32m✅[0m SMRI Structure
[32m✅[0m Duplicate Files
[31m❌[0m File Sizes
[32m✅[0m Module Exports

[36mScore: 5/6 (83%)[0m
[33m
⚠️[0m Some checks failed - review above
[36m
Script: scripts/check-consistency.cjs[0m
```

---

## 🧪 Test Summary

```
🎉 All tests passed!
🎉 All tests passed!
🎉 All scenario tests passed!
```

---

## 📖 Full Documentation Available

All complete files are cached in `.smri/context/`:
- `INDEX.md` - Complete SMRI index (920 lines)
- `README.md` - Complete project README (309 lines)
- `SMRI.md` - Complete SMRI syntax guide (226 lines)
- `tree.txt` - Full directory tree
- `git-log.txt` - Full git history
- `health.txt` - Complete health check output
- `test-summary.txt` - Test results summary
- `test-full.txt` - Complete test output

To read any file: `cat .smri/context/{filename}`

---

**Context cached at:** 2026-01-17 10:30:50 UTC  
**To update:** Run `bash scripts/smri-update-context.sh`
