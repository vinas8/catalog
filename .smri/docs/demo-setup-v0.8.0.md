# 🎬 v0.8.0 Demo Setup Guide

**Version:** 0.8.0 (planned)  
**Last Updated:** 2026-01-08  
**Purpose:** First-step setup for presenting Serpent Town demo

---

## 🎯 Overview

This guide ensures the demo environment is ready with **real test data** before showing any features to stakeholders.

**Philosophy:** "Data first, demo second" - No empty catalog screenshots!

---

## ✅ Step 1: KV Data Setup (ESSENTIAL - DO THIS FIRST!)

### Why This Matters
- Empty catalogs look broken ❌
- Test data proves functionality ✅
- Shows real products immediately 🐍

### Quick Setup (2 minutes)

1. **Open KV Manager:**
   ```
   http://localhost:8000/debug/tools/kv-manager.html
   ```

2. **OR use CSV Import (easier for bulk):**
   ```
   http://localhost:8000/import.html
   ```
   Also linked from Debug Hub: `http://localhost:8000/debug/index.html`

3. **Load Test Data:**
   - Find the "PRODUCTS" namespace card
   - Click "➕ Add Key" button
   - Key Name: `all`
   - Paste this JSON:

   ```json
   [
     {
       "id": "real-bp-001",
       "type": "real",
       "name": "Pudding",
       "species": "ball_python",
       "morph": "Banana Het Clown",
       "price": 35000,
       "currency": "EUR",
       "available": true,
       "sold": false
     },
     {
       "id": "real-bp-002",
       "type": "real",
       "name": "Taohu",
       "species": "ball_python",
       "morph": "Super Mojave",
       "price": 45000,
       "currency": "EUR",
       "available": true,
       "sold": false
     },
     {
       "id": "real-bp-003",
       "type": "real",
       "name": "Almond",
       "species": "ball_python",
       "morph": "Hurricane Butter Fire Yellow Belly Het Clown",
       "price": 65000,
       "currency": "EUR",
       "available": true,
       "sold": false
     },
     {
       "id": "real-cs-001",
       "type": "real",
       "name": "Mochi",
       "species": "corn_snake",
       "morph": "Salmon Hypo Bloodred",
       "price": 18000,
       "currency": "EUR",
       "available": true,
       "sold": false
     },
     {
       "id": "real-cs-002",
       "type": "real",
       "name": "Lavender",
       "species": "corn_snake",
       "morph": "Lavender Tessera",
       "price": 25000,
       "currency": "EUR",
       "available": true,
       "sold": false
     }
   ]
   ```

4. **Click "💾 Save"**

5. **Verify:** Open catalog
   ```
   http://localhost:8000/catalog.html
   ```
   Should show 5 snakes! 🐍🐍🐍🐍🐍

---

## 🔍 Step 2: Health Check (Verify Everything Works)

1. **Open Health Check:**
   ```
   http://localhost:8000/debug/tools/healthcheck.html
   ```

2. **Run All Checks:**
   - ✅ Worker API: Online
   - ✅ KV Storage: 5 products loaded
   - ✅ Stripe: Connected (test mode)
   - ✅ Frontend: All pages load

3. **If any fail:** Stop and fix before demo!

---

## 🎬 Step 3: Demo Pipelines (Now Ready!)

Once data is loaded, run these interactive demos:

### Customer Journey Demo
```
http://localhost:8000/debug/releases/v0.7.7/demo.html
```
- Browse catalog (shows 5 snakes ✅)
- Click "Buy Now" (Stripe test mode)
- Complete purchase
- See snake in collection

### Owner Dashboard Demo
```
http://localhost:8000/debug/releases/v0.7.7/demo.html
```
- KV Manager: View all data
- CSV Import: Add more snakes
- Analytics: Sales tracking

### Gameplay Demo
```
http://localhost:8000/debug/releases/v0.7.7/demo.html
```
- Feed, water, clean mechanics
- Stats decay over time
- Equipment shop

---

## 📊 Quick Verification Checklist

Before presenting, check these URLs:

| Check | URL | Expected |
|-------|-----|----------|
| Catalog loads | `/catalog.html` | 5 snakes visible |
| Game loads | `/game.html` | Care interface appears |
| Collection empty | `/collection.html` | "No snakes yet" message |
| Debug hub | `/debug/index.html` | All sections expand |
| KV Manager | `/debug/tools/kv-manager.html` | Shows 5+ keys in PRODUCTS |

---

## 🚨 Common Issues

### "Catalog shows 0 products"
**Fix:** Run Step 1 again - KV data not loaded

### "Worker API unreachable"
**Fix:** Check if worker is deployed:
```bash
cd /root/catalog/worker
bash cloudflare-deploy.sh
```

### "Import page won't load"
**Fix:** Server might be down, restart:
```bash
python3 -m http.server 8000
```

---

## 🎯 Demo Script (30 seconds)

**For stakeholders:**

1. "First, let me show our catalog" → Open `/catalog.html`
   - 5 real snakes with prices ✅

2. "Each snake has unique genetics" → Click a snake card
   - Morph info, care requirements

3. "Customer can purchase" → Click "Buy Now"
   - Stripe checkout (test mode)

4. "Behind the scenes" → Open `/debug/tools/kv-manager.html`
   - Real-time KV storage
   - Product metadata

**Total time:** < 1 minute to prove core functionality! 🚀

---

## 🔄 Reset Demo (Clean Slate)

To start fresh between demos:

1. **Clear KV data:**
   - Open KV Manager
   - Click "🗑️ Clear All" on PRODUCTS namespace

2. **Re-import test data:**
   - Follow Step 1 again

3. **Verify empty state:**
   - Catalog shows "0 products"
   - Collection is empty

---

## 📚 Reference

- **Full test data:** `/data/products-real-test.json`
- **SMRI scenarios:** `/debug/smri-scenarios.js`
- **Worker config:** `/worker/wrangler.toml`
- **Stripe test cards:** https://stripe.com/docs/testing

---

**Built with ❤️ and 🐍**  
**v0.8.0 Demo System**  
**Data-First Presentation Strategy**
