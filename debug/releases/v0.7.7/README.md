# 🐍 Serpent Town v0.7.7 - Release Demo

**Release Date:** 2026-01-04  
**Status:** Current Release

## What's New in v0.7.7

### 🧬 Genetics System
- 70 ball python morphs (50 base + 20 expanded)
- Breeding calculator with health risk assessment
- Lethal combo detection
- Market value analysis

### 📊 Data Hub
- Centralized data repository at `/data/`
- Genetics data browser at `/data/genetics/`
- Trait database viewer
- Real-time stats

### 🎯 SMRI System
- 69 test scenarios defined
- 11 scenarios complete (29% progress)
- Clean documentation structure in `.smri/`

### 📁 File Organization
- Clean directory structure: `/calc/`, `/shop/`, `/game/`, etc.
- No more root clutter
- Backward compatibility maintained

### 🐛 Debug Console
- Unified debug-loader.js on all pages
- Mobile-friendly overlay
- Works on localhost + `?debug=1`

## Demo Scenarios

### S6.1,2,3.09 - Customer Journey
Browse catalog → Purchase snake → Care tutorial

### S6.1,4,5.01 - Owner Journey  
Setup storefront → Manage inventory → View analytics

### S6.2,5.03 - Gameplay Demo
Feed → Water → Clean virtual snake

### S6.5.04 - Data Management
KV sync → Stripe integration → Data validation

## Test Coverage
- Game tests: 15/15 ✅
- Snapshot tests: 48+ ✅
- SMRI scenarios: 11/69 ✅ (16%)

## Known Issues
- Calculator uses MorphMarket iframe (limited by CORS)
- Some SMRI scenarios are placeholders
- 14 duplicate root HTML files (v0.8.0 cleanup)

## Links
- Live Demo: https://vinas8.github.io/catalog/
- Calculator: https://vinas8.github.io/catalog/calc/
- Data Hub: https://vinas8.github.io/catalog/data/
- Debug Hub: https://vinas8.github.io/catalog/debug/
