# SMRI Session Context
**Generated:** 2026-01-21 05:03:26 UTC  
**Commit:** 8cb2206  
**Version:** 0.7.94

---

## 🔍 Recent Activity

### Git Log (Last 20 commits)
```
8cb2206 Phase 1: Fix SMRI structure - move INDEX.md to docs/, archive obsolete tests
b67ab41 Checkpoint from Copilot CLI for coding agent session
569cc0a v0.7.94 - Document snake ranch architecture TODO
de721bc v0.7.93 - Snake ranch game with encounters (needs facade refactor)
34f8cdd v0.7.85 - Add snake ranch demo with touch controls
5579c38 v0.7.81 - Add comprehensive morphs database: 66 morphs from WOBP (ethical extraction)
81e6939 v0.7.80 - Fix genetics database loading: set APP_BASE_PATH, return data not boolean, better error handling
c8d8952 v0.7.79 - Fix breeding calculator mobile-first responsive design + cache buster in demo
dd3a138 v0.7.78 - Fix breeding calculator: remove MorphMarket iframe, add cache buster, mobile responsive design
4da5976 v0.7.77 - Lucky version 🍀 Add morph calculator demo with genetics, lethal combos & care sheets
965a546 v0.7.76 - Fix Step 7 const reassignment error in demo purchase flow
0de2b3d v0.7.75 - Complete purchase flow integration with test scenarios
34bdbda v0.7.53 - Add purchase flow integration docs
dc2286f feat: Use external PurchaseFlow module instead of API calls
650e539 v0.7.51 - Enable external flow by default with cache busting
554b9f8 fix: Enable external flow by default and fix variable reassignment
3c4bb82 feat: Add external flow integration to demo purchase step
6e98c2e feat: Integrate external purchase flow into demo
fe6fae3 chore: Bump Demo module version to 0.7.50
464ae2a chore: Update demo version to 0.7.50
```

### Git Status
```
 M .smri/context/INDEX.md
 M .smri/context/LAST_UPDATE.txt
 M .smri/context/README.md
 M .smri/context/SMRI.md
 M .smri/context/git-log.txt
 M .smri/context/health.txt
 M .smri/context/session.md
 M .smri/context/tree.txt
 D .smri/docs/INDEX.md
 D breeding_flow/packages/flows/breeding/src/index.js
 D breeding_flow/public/index.html
 D breeding_flow/public/styles.css
 D breeding_flow/scripts/build.js
 M package.json
?? .smri/INDEX.md
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
├── assets
│   └── sprites
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
│   └── test-quick.html
├── demo
│   ├── customer-journeys
│   ├── config.js
│   ├── index.html
│   ├── minimal.html
│   ├── snake-game.html
│   ├── snake-ranch.html
... (truncated, see .smri/context/tree.txt for full)
```

---

## 📚 Core Documentation

### .smri/INDEX.md (1 lines)
First 100 lines:
```markdown
INDEX.md not found
```
... (truncated, see .smri/context/INDEX.md for full)

### README.md (309 lines)
First 80 lines:
```markdown
# 🐍 Snake Muffin v0.7.94

> A snake breeding and care e-commerce game with real Stripe payments

[![Version](https://img.shields.io/badge/version-0.7.94-purple)](https://github.com/vinas8/catalog)
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

**Version:** 0.7.94  
**Status:** ⚠️ BETA - Not Production Ready  
**Tests:** 88/88 passing (100%) ✅

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
snake-game
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
📏 Checking Large Files...[0m 
[33m⚠️[0m .smri/INDEX.md: 1011 lines (max: 500)
[33m⚠️[0m .smri/docs/FLOW-BASED-ARCHITECTURE-RESEARCH.md: 992 lines (max: 500)
[33m⚠️[0m .smri/docs/business-plan/BUSINESS-PLAN-CHAPTERS-3-6.md: 728 lines (max: 500)
[33m⚠️[0m .smri/docs/business-plan/BUSINESS-PLAN-COMPREHENSIVE.md: 1576 lines (max: 500)
[33m⚠️[0m .smri/docs/business-plan/SERPENT-TOWN-BUSINESS-PLAN.md: 777 lines (max: 500)
[33m⚠️[0m .smri/docs/morphmarket-integration.md: 502 lines (max: 500)
[33m⚠️[0m .smri/docs/technical.md: 523 lines (max: 500)
[33m⚠️[0m .smri/scenarios/S6.1,2,3.09-FLUENT-CUSTOMER-JOURNEY.md: 849 lines (max: 500)
[33m⚠️[0m src/modules/demo/Demo.js: 1096 lines (max: 1000)
[33m⚠️[0m src/modules/game/game-controller.js: 1256 lines (max: 1000)
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
- `INDEX.md` - Complete SMRI index (1 lines)
- `README.md` - Complete project README (309 lines)
- `SMRI.md` - Complete SMRI syntax guide (226 lines)
- `tree.txt` - Full directory tree
- `git-log.txt` - Full git history
- `health.txt` - Complete health check output
- `test-summary.txt` - Test results summary
- `test-full.txt` - Complete test output

To read any file: `cat .smri/context/{filename}`

---

**Context cached at:** 2026-01-21 05:03:27 UTC  
**To update:** Run `bash scripts/smri-update-context.sh`
