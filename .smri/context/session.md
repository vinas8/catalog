# SMRI Session Context
**Generated:** 2026-01-14 13:56:57 UTC  
**Commit:** f98dca0  
**Version:** 0.7.7

---

## 🔍 Recent Activity

### Git Log (Last 20 commits)
```
f98dca0 feat: Add product deduplication by name
f5ff601 fix: Allow products to show without Stripe payment links
13ef918 fix: Show all products in catalog and add cache clear button
2a8de19 fix: SMRI cleanup - remove violation files and fix demo flow
eb58826 feat: Add demo module with split-screen scenario system
e349009 feat: Enhance critical rules display in startup output
f1ae2a6 fix: Remove time-based cache expiration
676fb7a feat: Add smart context caching system
82d37e8 fix: Update Claude instructions to match simplified format
20190f9 refactor: Simplify AI instructions to reference startup script
33fe173 fix: Update AI instructions to run startup script
338240b fix: Add date to context file header and load display
58c6481 feat: Add context flag system for fast .smri loads
ea90e3b fix: Add explicit instruction to run startup script first
2922e34 feat: Create unified smri-startup.sh script
c49bca9 docs: Add AI-START-HERE.md with explicit .smri load instructions
e19c920 fix: Add directory tree check to hybrid protocol
e74d01c fix: Update SESSION-START with hybrid approach (context + dynamic checks)
0421734 docs: Add session context and smart start instructions
9d6c643 feat: Add UI component coverage tracking
```

### Git Status
```
 M .smri/context/git-log.txt
 M .smri/context/session.md
```

---

## 📁 Project Structure

```
.
├── admin
│   ├── account.html
│   ├── import.html
│   └── index.html
├── calc
│   ├── calculator.html
│   └── index.html
├── cloudflare
├── data
│   ├── backup-20260102-192725
│   ├── cache
│   ├── genetics
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
│   ├── demo-split-screen.html
│   ├── index.html
│   ├── mcp-test-report.html
│   ├── mobile-console.js
│   ├── purchase-flow-demo.html
│   ├── smri-runner.html
│   ├── smri-scenarios.js
│   ├── smri-tests.js
│   ├── test-runner-simple.html
│   └── visual-demo.html
├── dex
│   ├── modules
│   ├── archive-index-old.html
│   ├── index.html
│   ├── pokedex-style.html
│   ├── simple-grid.html
│   └── trait-style.html
├── docs
│   ├── archive
│   ├── customer
│   ├── owner
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
common
config
demo
game
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
[33m⚠️[0m src/modules/game/game-controller.js: 1210 lines (max: 1000)
[33m⚠️[0m worker/worker.js: 2153 lines (max: 1000)
[34m
📦 Checking Module Exports...[0m 
[32m✅[0m PUBLIC-API.md exists
[32m✅[0m module-functions.js exists
[34m
📊 Summary:[0m 
[32m✅[0m Version Consistency
[32m✅[0m Module Structure
[32m✅[0m SMRI Structure
[31m❌[0m Duplicate Files
[31m❌[0m File Sizes
[32m✅[0m Module Exports

[36mScore: 4/6 (67%)[0m
[33m
⚠️[0m Some checks failed - review above
[36m
Script: scripts/check-consistency.cjs[0m
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

To read any file: `cat .smri/context/{filename}`

---

**Context cached at:** 2026-01-14 13:56:58 UTC  
**To update:** Run `bash scripts/smri-update-context.sh`
