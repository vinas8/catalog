# SMRI Session Context
**Generated:** 2026-01-29 10:41:36 UTC  
**Commit:** 1fbd08f  
**Version:** 0.9.0

---

## 🔍 Recent Activity

### Git Log (Last 20 commits)
```
1fbd08f Add debug mode and cache busting
77e4624 🎉 FINAL: Clean minimal backend - should work!
314adfe Update to working backend URL - final deployment
695e185 Add CORS fix guide and updated minimal script
603750c Add minimal working Apps Script version
bca157b Update backend URL - ready for live testing
da2a34b Fix Apps Script CORS headers issue
920ae37 Add SMRI booking flow test script
1ce75ce Add backend URL - no user login required
efd7e53 Add setup summary
f9a576f Add backend solution - no user login required
34a6d0c Add booking system with Google Calendar integration
cd65671 docs: Add comprehensive README for complete RPG game
b0d4edf feat: Complete RPG with combat, enemies (bats), health, hitboxes - Full Godot tutorial implementation
eea0417 feat: Add mobile touch controls (D-pad + action buttons)
e3ca988 feat: Add working RPG game with player movement (based on Godot tutorial)
bff342a feat: Add Godot source code and JavaScript translation guide
6fabc85 docs: Update plan - Phase 1 clone RPG foundation, Phase 2 add farming mechanics
ac67c27 fix: Correct debug-loader.js path in calc, add direct test
7c10ec9 docs: Add Godot Action RPG video list - clarify this is Zelda-like combat, not farming
```

### Git Status
```
 M .smri/context/LAST_UPDATE.txt
 M .smri/context/git-log.txt
 M .smri/context/health.txt
 M .smri/context/modules.txt
 M .smri/context/session.md
 M .smri/context/tree.txt
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
│   ├── calc-debug.html
│   ├── calc-search-test.html
│   ├── calc-test-simple.html
│   ├── csv-import-manager.js
│   ├── debug-guard.js
│   ├── index.html
│   ├── location-viewer.html
│   ├── mcp-test-report.html
│   ├── mobile-console.js
│   ├── redirect.html
│   ├── smri-runner.html
│   ├── smri-scenarios.js
│   ├── smri-tests.js
│   ├── test-browser.cjs
│   ├── test-calc-debug.html
│   ├── test-calc-direct.html
│   └── test-quick.html
├── demo
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
# 🐍 Snake Muffin v0.8.0

> A snake breeding and care e-commerce game with real Stripe payments

[![Version](https://img.shields.io/badge/version-0.8.0-purple)](https://github.com/vinas8/catalog)
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

**Version:** 0.8.0  
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
booking
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
[31m❌[0m Version Consistency
[31m❌[0m Module Structure
[32m✅[0m SMRI Structure
[31m❌[0m Duplicate Files
[31m❌[0m File Sizes
[32m✅[0m Module Exports

[36mScore: 2/6 (33%)[0m
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

**Context cached at:** 2026-01-29 10:41:37 UTC  
**To update:** Run `bash scripts/smri-update-context.sh`
