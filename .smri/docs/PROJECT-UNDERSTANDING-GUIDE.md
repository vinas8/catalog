# 🐍 SERPENT TOWN - PROJECT UNDERSTANDING GUIDE

## 🎯 WHAT IS THIS PROJECT?

**Serpent Town** (aka Snake Muffin) is an e-commerce platform for ball python breeders that combines:
1. **Shop** - Buy real snakes with Stripe payments
2. **Breeding Calculator** - Genetics tool for planning breeding projects
3. **Morph Dex** - Encyclopedia of ball python morphs (like Pokédex)
4. **Care Game** - Tamagotchi-style pet care mechanics

Think: **"If Pokémon breeding + Tamagotchi + Etsy had a baby"**

---

## 📁 PROJECT STRUCTURE EXPLAINED

```
catalog/
├── index.html              # Landing page (shop homepage)
├── catalog.html            # Product catalog (browse snakes for sale)
├── product.html            # Individual product page
│
├── /calc/                  # 🧬 BREEDING CALCULATOR
│   └── index.html          # Calculator UI + genetics engine integration
│
├── /dex/                   # 📚 MORPH ENCYCLOPEDIA
│   ├── index.html          # Pokédex-style morph browser
│   └── modules/            # Dex-specific components
│
├── /demo/                  # 🎬 INTERACTIVE DEMOS
│   └── index.html          # Split-screen demo orchestrator
│
├── /game/                  # 🎮 TAMAGOTCHI GAME
│   └── index.html          # Snake care game
│
├── /src/                   # 📦 CORE MODULES (ES6)
│   ├── modules/
│   │   ├── auth/           # User authentication
│   │   ├── breeding/       # ⭐ Genetics engine (FOCUS HERE)
│   │   ├── cart/           # Shopping cart
│   │   ├── common/         # Shared utilities
│   │   ├── config/         # Feature flags
│   │   ├── demo/           # Demo orchestration
│   │   ├── game/           # Game controller
│   │   ├── import/         # CSV import tools
│   │   ├── payment/        # Stripe integration
│   │   ├── shop/           # Shop logic
│   │   └── smri/           # SMRI system (metadata)
│   │
│   └── components/         # Reusable UI components
│
├── /data/                  # 📊 DATA FILES
│   └── genetics/           # ⭐ MORPH DATABASE (FOCUS HERE)
│       ├── morphs-comprehensive.json  # 66 morphs (PRIMARY)
│       ├── health-risks.json
│       └── lethal-combos.json
│
├── /worker/                # ☁️ CLOUDFLARE BACKEND
│   └── worker.js           # Serverless API (Stripe, KV storage)
│
├── /.smri/                 # 📚 DOCUMENTATION SYSTEM
│   ├── INDEX.md            # Project navigation & rules
│   ├── docs/               # Technical documentation
│   ├── scenarios/          # Test scenarios
│   └── logs/               # Daily session notes
│
└── /tests/                 # 🧪 AUTOMATED TESTS
    └── breeding-calculator.test.js
```

---

## 🔍 HOW THE BREEDING CALCULATOR WORKS

### User Flow
```
1. User opens /calc/index.html
   ↓
2. Page loads 66 morphs from /data/genetics/morphs-comprehensive.json
   ↓
3. User types morph name → Autocomplete shows matches
   ↓
4. User selects morphs for male and female parents (tags appear)
   ↓
5. User clicks "Calculate" button
   ↓
6. JavaScript calls genetics-core.js functions:
   - checkLethalCombo()      → ❌ "Spider × Spider = LETHAL"
   - assessHealthRisk()      → ⚠️  "Wobble risk: HIGH"
   - calculateOffspring()    → 📊 "25% Banana, 25% Pastel, 50% Normal"
   - calculateCompatibility() → 💯 "Score: 85/100"
   ↓
7. Results displayed in cards with color-coded alerts
```

### Technical Flow
```javascript
// 1. Load database
const data = await loadGeneticsDatabase(true);
// Returns: { morphs: [...66 morphs], version: "3.0.0" }

// 2. User selects morphs
selectedMaleMorphs = ['banana'];
selectedFemaleMorphs = ['pastel'];

// 3. Calculate on button click
const male = { morphs: ['banana'], genetics: {...} };
const female = { morphs: ['pastel'], genetics: {...} };

const compatibility = calculateCompatibility(male, female);
// Returns: { score: 85, factors: [...] }

const offspring = calculateOffspring(male, female);
// Returns: [
//   { morph: 'Banana Pastel', percentage: 25, value: 300 },
//   { morph: 'Banana', percentage: 25, value: 150 },
//   { morph: 'Pastel', percentage: 25, value: 100 },
//   { morph: 'Normal', percentage: 25, value: 50 }
// ]

const lethalCheck = checkLethalCombo('spider', 'spider');
// Returns: "No viable super" (BLOCKS breeding)
```

---

## 🧬 GENETICS ENGINE EXPLAINED

### What is Ball Python Genetics?

Ball pythons have 3 gene types:

**1. Dominant** (6 morphs)
- One copy = visual trait shows
- No "super" form
- Example: **Spider** (but has health issues)

**2. Co-Dominant** (32 morphs)
- One copy = visual trait (het)
- Two copies = "super" form (enhanced)
- Example: **Banana**
  - 1 copy = Banana (yellow with purple blush)
  - 2 copies = Super Banana (bright yellow, no pattern)

**3. Recessive** (22 morphs)
- One copy = hidden (het = carrier)
- Two copies = visual trait shows
- Example: **Piebald** (white with color patches)
  - Het Piebald = looks normal, carries gene
  - Piebald = white snake with patches

### Punnett Square Example

**Banana (co-dom) × Normal**
```
        B (Banana)   + (Normal)
     ┌──────────────┬──────────────┐
     │              │              │
  +  │   B+         │    ++        │
     │  (Banana)    │  (Normal)    │
     │              │              │
     └──────────────┴──────────────┘

Result: 50% Banana, 50% Normal
```

**Banana × Banana**
```
        B (Banana)   + (Normal)
     ┌──────────────┬──────────────┐
  B  │   BB         │    B+        │
     │(Super Banana)│  (Banana)    │
     ├──────────────┼──────────────┤
  +  │   B+         │    ++        │
     │  (Banana)    │  (Normal)    │
     └──────────────┴──────────────┘

Result: 25% Super Banana, 50% Banana, 25% Normal
```

---

## 🚨 HEALTH RISKS & ETHICS

### Lethal Combinations (MUST AVOID)
```javascript
{
  "lethal_combos": [
    {
      "morph1": "spider",
      "morph2": "spider",
      "result": "No viable super - embryos die",
      "action": "BLOCK breeding"
    },
    {
      "morph1": "lesser",
      "morph2": "butter", 
      "result": "Super Lesser Butter is lethal",
      "action": "BLOCK breeding"
    }
  ]
}
```

### Health Issues
- **Spider** - Neurological wobble (head tilting, corkscrewing)
- **HGW** (Hidden Gene Woma) - Similar wobble issues
- **Champagne** - Moderate wobble risk
- **Scaleless** - Dehydration, skin injury risk

**Our calculator detects these and shows warnings!**

---

## 📊 DATA STRUCTURE

### Morph Object (morphs-comprehensive.json)
```json
{
  "id": "banana",
  "name": "Banana",
  "aliases": ["Coral Glow"],
  "gene_type": "co-dominant",
  "super_form": "Super Banana",
  "market_value_usd": 150,
  "rarity": "common",
  "health_risk": "low",
  "health_issues": [
    "Super form males may show reduced fertility (not all specimens)"
  ],
  "breeding_notes": "Super form viable but check male fertility",
  "source_url": "https://www.worldofballpythons.com/morphs/banana/",
  "fetched_at": "2026-01-04T19:30:00Z"
}
```

### Why This Matters
- **id**: Used in code lookups
- **gene_type**: Determines Punnett square logic
- **health_risk**: Triggers warnings in UI
- **market_value_usd**: Calculates offspring profitability
- **super_form**: Only for co-dominant morphs

---

## 🎮 DEMO SYSTEM EXPLAINED

The demo system at `/demo/index.html` is a **split-screen orchestrator**:

```
┌─────────────────────────────────────────────┐
│  🔍 URL Bar: /calc/index.html              │
├─────────────────────────────────────────────┤
│                                             │
│  📋 Step List          │  🖼️ Live Browser   │
│                        │                    │
│  ✅ Step 1: Load DB    │  [Calculator UI]  │
│  ⏸️ Step 2: Safe Combo │                    │
│  ⏸️ Step 3: Lethal     │                    │
│                        │                    │
│  [Run Auto-Play] ▶    │                    │
│                        │                    │
└─────────────────────────────────────────────┘
```

**Current Issue:**
Steps load pages but don't fill forms/click buttons automatically.

**Goal:**
Full automation like Selenium tests but in-browser.

---

## 🔧 KEY FILES TO UNDERSTAND

### 1. `/calc/index.html` (Calculator UI)
- All-in-one file: HTML + CSS + JavaScript
- Loads genetics-core.js module
- Has autocomplete, tags, results display
- ~1047 lines

### 2. `/src/modules/breeding/genetics-core.js` (Brain)
- Core genetics calculations
- Punnett square logic
- Health risk assessment
- Lethal combo detection
- ~1255 lines
- **Most important file for improvements**

### 3. `/data/genetics/morphs-comprehensive.json` (Database)
- 66 morphs with full data
- Source of truth for all genetics
- JSON format, easy to expand

### 4. `/demo/index.html` (Demo Orchestrator)
- Split-screen demo system
- Scenario-based testing
- Iframe manipulation
- Auto-play mode

---

## 🚀 HOW TO TEST/RUN

### Local Development
```bash
# 1. Start local server (already running on port 8000)
python3 -m http.server 8000

# 2. Open in browser
http://localhost:8000/calc/?v=0.7.81       # Calculator
http://localhost:8000/dex/                  # Dex
http://localhost:8000/demo/?v=0.7.81       # Demo
```

### Live Production
```
https://vinas8.github.io/catalog/calc/?v=0.7.81
https://vinas8.github.io/catalog/dex/
https://vinas8.github.io/catalog/demo/?v=0.7.81
```

### Testing Calculator
1. Open `/calc/?v=0.7.81`
2. Type "banana" in male morph input
3. Select "Banana" from dropdown
4. Type "spider" in female morph input
5. Select "Spider" from dropdown
6. Click "Calculate"
7. Should show **RED ALERT** warning about wobble risk

---

## 💡 COMMON TASKS

### Add a New Morph
1. Edit `data/genetics/morphs-comprehensive.json`
2. Add new object following schema
3. Update `morph_count` field
4. Test: `jq empty morphs-comprehensive.json`
5. Reload calc page with `?v=NEW_VERSION`

### Fix a Calculation Bug
1. Open `src/modules/breeding/genetics-core.js`
2. Find relevant function (e.g., `calculateOffspring`)
3. Update logic
4. Test in `/calc/`
5. Bump version number

### Add a Care Sheet
1. Create `data/genetics/care-sheets.json`
2. Define schema (see MORPH-CALCULATOR-COMPLETE-CONTEXT.md)
3. Add care sheet data per morph
4. Update dex to display care sheets
5. Link from calculator results

---

## 📖 DOCUMENTATION TO READ

1. **`.smri/INDEX.md`** - Project rules & navigation
2. **`.smri/docs/MORPH-CALCULATOR-COMPLETE-CONTEXT.md`** - This feature
3. **`data/genetics/README.md`** - Database documentation
4. **`README.md`** - Project overview
5. **`.smri/docs/technical.md`** - Architecture details

---

## 🎯 CURRENT FOCUS

**Working on:** Morph Calculator & Dex improvements
**Version:** 0.7.81
**Priority:** HIGH - Core business feature

**Next Steps:**
1. Discuss improvements with other AI
2. Implement care sheets
3. Improve demo automation
4. Better results visualization
5. Integrate dex with comprehensive database

---

## ❓ QUICK FAQ

**Q: Why 66 morphs, not more?**
A: Ethical manual extraction takes time. We can add more, but each needs verification.

**Q: Why vanilla JS, no React?**
A: Keep it simple, fast, no build step. Easy to deploy on GitHub Pages.

**Q: What's SMRI?**
A: Serpent Town Master Reference Index - our documentation system. Ignore for now.

**Q: Can I add my own morphs?**
A: Yes! Edit `morphs-comprehensive.json` and follow the schema.

**Q: Why breeding calculator for snakes?**
A: Ball python breeding is big business. Breeders need tools to plan projects, avoid health issues, and maximize profit.

**Q: What's the end goal?**
A: Full e-commerce platform where breeders can sell snakes, buyers can plan care, and everyone learns genetics.

---

**🎓 YOU NOW UNDERSTAND THE PROJECT!**

**To help improve:**
1. Read MORPH-CALCULATOR-COMPLETE-CONTEXT.md
2. Test the live calculator
3. Identify pain points
4. Suggest improvements
5. We implement together!

