# SMRI Session Context
**Generated:** 2026-01-20 06:20:14 UTC  
**Commit:** a50de85  
**Version:** 0.7.48

---

## 🔍 Recent Activity

### Git Log (Last 20 commits)
```
a50de85 v0.7.48 - Add comprehensive flow-based architecture research
5f907dc v0.7.47 - Add purchase flow dependency graph documentation
914cb29 v0.7.46 - Fix 404 on product pages & demo scroll animation
c21231e v0.7.45 - Complete SMRI consolidation: all codes use registry constants
e9b8c70 v0.7.44 - Add missing SMRI codes to registry (S0.0.0, S2.2,3,4,5.01, S3.1,2,3.01, S0.0,1,2,3,4,5.01)
2cb6cd3 v0.7.44 - Centralize SMRI codes into constants (Demo, SplitScreenDemo)
d5aa040 v0.7.43 - Add SMRI modal CSS + versioning workflow docs
9dede95 debug: Add minimal demo page to test
29393dd fix: Wrap top-level await in async IIFE
ee04480 debug: Add error handling to demo page to show white screen cause
e2b3ea5 debug: Update test page for v675258e troubleshooting
675258e feat: Complete layout redesign for mobile - compact runner
0b7f9c9 feat: Add SMRI codes to each step for reusability
598ac34 fix: Actually make steps horizontal with proper layout
55ce91c feat: Steps now display horizontally instead of vertical list
db4c536 feat: Reorganize layout - scenarios on top, larger steps area
5abaabd feat: Remove 'Select a Scenario' heading for cleaner UI
aa02026 feat: Horizontal scenario selector to save space
4030b28 fix: Demo now creates available product first, then simulates purchase
e0d3de7 feat: Add SMRI memory system (like store_memory but for INDEX.md)
```

### Git Status
```
 M .smri/context/INDEX.md
 M .smri/context/LAST_UPDATE.txt
 M .smri/context/git-log.txt
 M .smri/context/health.txt
 M .smri/context/session.md
 M .smri/context/test-full.txt
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
│   ├── index.html
│   ├── minimal.html
│   └── test.html
├── dex
│   ├── modules
... (truncated, see .smri/context/tree.txt for full)
```

---

## 📚 Core Documentation

### .smri/INDEX.md (1010 lines)
First 100 lines:
```markdown
# 🐍 Serpent Town - Index & Rules

**Version:** 0.7.11  
**Last Updated:** 2026-01-19  
**Purpose:** SMRI system index and operating rules

---

## 🎯 Versioning & SMRI Badge Rules

### 1. Version Bump Workflow (CRITICAL)
**On EVERY fix/change, update 3 files:**
```bash
# 1. Bump package.json
npm version patch --no-git-tag-version  # 0.7.7 → 0.7.8

# 2. Update module version (e.g., src/modules/demo/Demo.js)
this.version = '0.7.8';

# 3. Update HTML cache buster (e.g., demo/index.html)
const cacheBuster = urlParams.get('v') || '0.7.8';
```

**Test BEFORE providing version to user:**
```bash
# Option 1: curl test
curl http://localhost:8000/demo/?v=0.7.8

# Option 2: Browser test with cache busting
http://localhost:8000/demo/?v=0.7.8
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

### 0. DEBUGGING RULE: Check Console FIRST, Not Cache
**When page is blank or broken:**

❌ **WRONG approach:**
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
📏 Checking Large Files...[0m 
[33m⚠️[0m .smri/INDEX.md: 1011 lines (max: 500)
[33m⚠️[0m .smri/context/INDEX.md: 1011 lines (max: 500)
[33m⚠️[0m .smri/docs/FLOW-BASED-ARCHITECTURE-RESEARCH.md: 992 lines (max: 500)
[33m⚠️[0m .smri/docs/business-plan/BUSINESS-PLAN-CHAPTERS-3-6.md: 728 lines (max: 500)
[33m⚠️[0m .smri/docs/business-plan/BUSINESS-PLAN-COMPREHENSIVE.md: 1576 lines (max: 500)
[33m⚠️[0m .smri/docs/business-plan/SERPENT-TOWN-BUSINESS-PLAN.md: 777 lines (max: 500)
[33m⚠️[0m .smri/docs/morphmarket-integration.md: 502 lines (max: 500)
[33m⚠️[0m .smri/docs/technical.md: 523 lines (max: 500)
[33m⚠️[0m .smri/scenarios/S6.1,2,3.09-FLUENT-CUSTOMER-JOURNEY.md: 849 lines (max: 500)
[33m⚠️[0m src/modules/game/game-controller.js: 1255 lines (max: 1000)
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
- `INDEX.md` - Complete SMRI index (1010 lines)
- `README.md` - Complete project README (309 lines)
- `SMRI.md` - Complete SMRI syntax guide (226 lines)
- `tree.txt` - Full directory tree
- `git-log.txt` - Full git history
- `health.txt` - Complete health check output
- `test-summary.txt` - Test results summary
- `test-full.txt` - Complete test output

To read any file: `cat .smri/context/{filename}`

---

**Context cached at:** 2026-01-20 06:20:15 UTC  
**To update:** Run `bash scripts/smri-update-context.sh`
