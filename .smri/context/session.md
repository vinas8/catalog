# SMRI Session Context
**Generated:** 2026-01-19 13:22:23 UTC  
**Commit:** 7d2aaed  
**Version:** 0.7.14

---

## 🔍 Recent Activity

### Git Log (Last 20 commits)
```
7d2aaed fix: Remove CSS order and reorder HTML - browser first, controls second
af9ce50 fix: Update Demo.js with top/bottom layout and clickable version
9f554a1 fix: Add cache buster to demo imports for localhost
f1a6e25 docs: Add versioning and SMRI badge rules to INDEX.md
bf66959 fix: Correct demo layout proportions - browser 80%, buttons 20%
d6a0181 feat: Move SMRI decoder to dedicated module
8c7ff0e fix: Explicit browser layout sizing (3/4 top, 1/4 bottom)
37ddb5f feat: Add version display to demo components
56e323c refactor: Improve demo layout - browser on top, remove titles
af702c7 fix: Product navigation now uses query params consistently
fca1ef0 fix: Add basePath to import statement in demo
26ce9ef fix: Demo URLs now work on GitHub Pages
adcb9a0 docs: Add Stripe localhost testing limitation guide
32725c8 fix: Sync shop/index.html with catalog.html for consistency
c7ea18d fix: Demo Buy Now button now shows helpful message instead of doing nothing
ad912a2 fix: Demo Step 7 now uses placeholder link and clearer messaging
0c94713 refactor: Simplify catalog page layout
eece24f fix: Demo product now includes Stripe link and correct button selectors
b14cd00 feat: Product page Stripe buyability and E2E tests
60c1e7f fix: Product page demo flow and View Details routing
```

### Git Status
```
 M .smri/context/INDEX.md
 M .smri/context/LAST_UPDATE.txt
 M .smri/context/git-log.txt
 M .smri/context/health.txt
 M .smri/context/session.md
 M .smri/context/test-full.txt
 M .smri/context/tree.txt
 M package-lock.json
 M package.json
 M tests/modules/shop/game.test.js
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
│   ├── test-browser.cjs
│   ├── test-localstorage-destination.html
│   ├── test-quick.html
│   └── test-runner-simple.html
├── demo
│   ├── customer-journeys
│   └── index.html
├── dex
│   ├── modules
│   ├── archive-index-old.html
│   ├── index.html
... (truncated, see .smri/context/tree.txt for full)
```

---

## 📚 Core Documentation

### .smri/INDEX.md (961 lines)
First 100 lines:
```markdown
# 🐍 Serpent Town - Index & Rules

**Version:** 0.7.11  
**Last Updated:** 2026-01-19  
**Purpose:** SMRI system index and operating rules

---

## 🎯 NEW: Versioning & SMRI Badge Rules (2026-01-19)

### 1. Version Bump on Every Change
```bash
# ALWAYS bump version when making changes
npm version patch --no-git-tag-version  # 0.7.7 → 0.7.8
```

### 2. Display Version Badge in Components
Every interactive component must show version badge:
- **Location:** Bottom-right corner (fixed position)
- **Format:** `S{M}.{RRR}.{II} • v{X.Y.Z}`
- **Example:** `S9.3,2,10.05 • v0.7.11`
- **Clickable:** Opens SMRI decoder modal

### 3. SMRI Decoder Module
Use centralized decoder for consistency:
```javascript
import { showSMRIModal } from '../modules/smri/index.js';

// In component
showSMRIModal(this.smri);  // Shows popup explaining SMRI code
```

### 4. Update SMRI on Changes
- **File changed?** → Bump iteration: `.01 → .02`
- **New dependency?** → Update relations: `.2,5 → .2,5,8`
- **Major refactor?** → Consider new module number

### 5. Module Map (Reference)
```
0: Core/Internal     6: Payment
1: Auth              7: Import
2: Common            8: Debug
3: Game              9: Demo
4: Shop             10: SMRI
5: Testing
```

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
[33m⚠️[0m .smri/INDEX.md: 962 lines (max: 500)
[33m⚠️[0m .smri/context/INDEX.md: 962 lines (max: 500)
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
[31m❌[0m Version Consistency
[32m✅[0m Module Structure
[32m✅[0m SMRI Structure
[31m❌[0m Duplicate Files
[31m❌[0m File Sizes
[32m✅[0m Module Exports

[36mScore: 3/6 (50%)[0m
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
- `INDEX.md` - Complete SMRI index (961 lines)
- `README.md` - Complete project README (309 lines)
- `SMRI.md` - Complete SMRI syntax guide (226 lines)
- `tree.txt` - Full directory tree
- `git-log.txt` - Full git history
- `health.txt` - Complete health check output
- `test-summary.txt` - Test results summary
- `test-full.txt` - Complete test output

To read any file: `cat .smri/context/{filename}`

---

**Context cached at:** 2026-01-19 13:22:24 UTC  
**To update:** Run `bash scripts/smri-update-context.sh`
