# 🐍 Serpent Town - Ball Python Breeding Calculator & Morph Dex
## AI Collaboration Request

---

## 📋 PROJECT OVERVIEW

**What:** E-commerce platform for ball pythons with integrated breeding genetics calculator and morph encyclopedia  
**Tech Stack:** Vanilla JavaScript (ES6 modules), HTML/CSS, no frameworks  
**Deployment:** GitHub Pages at https://vinas8.github.io/catalog/  
**Current Version:** 0.7.81  
**Live Calculator:** https://vinas8.github.io/catalog/calc/?v=0.7.81

Think of it as: **"Pokémon breeding mechanics + Etsy shop + Wikipedia for pet snakes"**

---

## 🎯 CURRENT STATE (WHAT WORKS)

✅ **Breeding Calculator (`/calc/index.html`)**
- Autocomplete search with 66 ball python morphs
- Tag-based selection for male/female parents
- Calculate offspring probabilities (Punnett square logic)
- **Lethal combo detection** (Spider×Spider, Lesser×Butter, HGW×HGW) - shows RED alerts
- **Health risk warnings** (wobble syndrome, kinking, etc.)
- Mobile responsive design
- Cache busting working

✅ **Genetics Database (`/data/genetics/morphs-comprehensive.json`)**
- 66 morphs total (6 dominant, 32 co-dominant, 22 recessive)
- Each morph: id, name, aliases, gene_type, super_form, market_value_usd, health_risk, health_issues, breeding_notes, source_url
- Version 3.0.0 (merged from multiple sources)

✅ **Genetics Engine (`/src/modules/breeding/genetics-core.js`)**
- `loadGeneticsDatabase()` - loads morph data
- `calculateCompatibility(male, female)` - compatibility score 0-100
- `calculateOffspring(male, female)` - Punnett square results with probabilities
- `checkLethalCombo()` - detects deadly pairings
- `assessHealthRisk()` - combined health warnings

✅ **Demo System (`/demo/index.html`)**
- Split-screen with iframe showing live pages
- 6-step scenario for calculator (but automation incomplete)

---

## ❌ PROBLEMS TO SOLVE

### 🔴 Priority 1 - Critical

**1. Demo Automation Broken**
- **Current:** Demo loads calculator page but can't click buttons or fill forms
- **Issue:** Cross-origin iframe restrictions prevent `iframe.contentWindow` manipulation
- **Need:** Solution to automate user interactions in demo (fill morph fields, click calculate)
- **Code:** `/demo/index.html` lines 621-790 (Morph Calculator scenario)

**2. Database Not Loading in Dex**
- **Current:** `/dex/` morph encyclopedia exists but uses old data files
- **Need:** Update dex to use `/data/genetics/morphs-comprehensive.json` instead
- **Files:** Likely in `/dex/` folder (haven't checked structure yet)

### 🟡 Priority 2 - Important

**3. Care Sheets Missing**
- **Current:** No temperature, humidity, feeding schedule data
- **Need:** Design JSON structure for care sheets
- **Questions:**
  - Temperature ranges (hot spot, cool side, night drop)?
  - Humidity ranges by age/morph?
  - Feeding schedule (prey size, frequency by age)?
  - Special care for morphs with health issues (Spider needs extra care)?
- **Suggested file:** `/data/genetics/care-sheets.json`

**4. Results Visualization Basic**
- **Current:** Plain text list of outcomes with percentages
- **Need:** 
  - Visual Punnett square grid (like biology textbooks)
  - Color-coded outcome cards
  - Charts/graphs for probability distribution
  - Morph images (if available)

### 🟢 Priority 3 - Nice to Have

**5. No Save/Share Features**
- **Need:** 
  - Save breeding projects to localStorage
  - Share combinations via URL params (`?male=banana,spider&female=piebald`)
  - Export results as PDF/image

**6. Morph Images Missing**
- **Current:** No photos of morphs
- **Need:** Decide on image strategy (hosted, external links, placeholders)

---

## 🧬 HOW BALL PYTHON GENETICS WORK

### Three Gene Types:

**Dominant (Simple):**
- 1 copy = visual morph
- No "super" form exists
- Example: Spider, Pinstripe
- Punnett: 50% morph, 50% normal (if one parent has gene)

**Co-Dominant:**
- 1 copy = het visual (morph visible)
- 2 copies = "super" form (enhanced appearance)
- Example: Banana, Pastel, Mojave
- Punnett: 25% super, 50% het, 25% normal (if both parents het)

**Recessive:**
- 1 copy = hidden het (looks normal)
- 2 copies = visual morph
- Example: Piebald, Albino, Clown
- Punnett: 25% visual, 50% het, 25% normal (if both parents het)

### Lethal Combos (MUST PREVENT):
- **Spider × Spider** → 25% die (super Spider is lethal)
- **Lesser × Butter** → 25% die (BEL complex incompatibility)
- **Hidden Gene Woma × Hidden Gene Woma** → wobble syndrome

### Health Risks:
- **Spider:** Wobble syndrome (neurological)
- **Champagne:** Wobble in super form
- **Scaleless:** Temperature regulation issues
- **Cinnamon (super):** Fertility issues

---

## 📁 KEY FILES & STRUCTURE

```
/calc/
  index.html                    # Main calculator UI (~1100 lines, all-in-one)
                                # HTML + CSS + JavaScript in single file
                                # Sets window.APP_BASE_PATH for GitHub Pages
                                # Loads genetics-core.js with cache buster

/src/modules/breeding/
  genetics-core.js              # Genetics engine (~1255 lines)
                                # Core functions for calculations
                                # Lines 16-65: Database loading
                                # Lines 67-79: Price lookups
                                # Lines 81+: Breeding calculations

/data/genetics/
  morphs-comprehensive.json     # PRIMARY DATABASE (66 morphs, v3.0.0)
  morphs.json                   # OLD (50 morphs, keep for fallback)
  morphs-expanded.json          # OLD (20 morphs, keep for fallback)
  README.md                     # Database documentation

/demo/
  index.html                    # Demo orchestrator
                                # Lines 621-790: Calculator scenario
                                # Split-screen iframe layout
                                # Step-by-step automation (broken)

/dex/
  [unknown structure]           # Morph encyclopedia
                                # NEEDS UPDATE to use comprehensive DB

/.smri/docs/
  PROJECT-UNDERSTANDING-GUIDE.md    # Full project explanation (this context)
  MORPH-CALCULATOR-COMPLETE-CONTEXT.md  # Technical details
```

---

## 🔧 TECHNICAL DETAILS

### Path Resolution (GitHub Pages):
```javascript
// calc/index.html sets this before imports:
window.APP_BASE_PATH = window.location.hostname.includes('github.io') 
  ? '/catalog' 
  : '';

// Used in fetch:
fetch(`${basePath}/data/genetics/morphs-comprehensive.json?v=0.7.81`)
```

### Cache Busting:
```javascript
// Pattern used everywhere:
import(`${basePath}/module.js?v=${version}`)
// Current version: 0.7.81
```

### Mobile-First CSS:
```css
/* Base = mobile (single column) */
.container { padding: 10px; }

/* Tablet/Desktop */
@media (min-width: 768px) {
  .container { padding: 20px; }
}

/* Key: input { font-size: 16px; } prevents iOS zoom */
```

### Database Schema:
```json
{
  "version": "3.0.0",
  "morphs": [
    {
      "id": "banana",
      "name": "Banana",
      "aliases": ["Coral Glow"],
      "gene_type": "co-dominant",
      "super_form": "Super Banana",
      "market_value_usd": { "low": 75, "high": 200 },
      "rarity": "common",
      "health_risk": "low",
      "health_issues": [],
      "breeding_notes": "Male-maker gene (produces more males)",
      "source_url": "https://www.worldofballpythons.com/morphs/banana/"
    }
  ],
  "lethal_combos": [
    { "morph1": "spider", "morph2": "spider", "severity": "lethal" }
  ]
}
```

---

## ❓ SPECIFIC QUESTIONS FOR DISCUSSION

### 1. Demo Automation
**Problem:** Can't interact with iframe due to CORS  
**Options:**
- Use Puppeteer/Playwright for real browser automation?
- PostMessage API for parent ↔ iframe communication?
- Abandon iframe, use fetch + DOM manipulation instead?
- Just show screenshots/video instead of live demo?

### 2. Care Sheet Structure
**What should it include?**
```json
{
  "general": {
    "temperature": {
      "hot_spot": "88-92°F",
      "cool_side": "78-80°F", 
      "night_drop": "75°F"
    },
    "humidity": "50-60%",
    "feeding": {
      "hatchling": "Every 5-7 days (hopper mice)",
      "adult": "Every 10-14 days (small rats)"
    }
  },
  "morph_specific": {
    "spider": {
      "notes": "May need assisted feeding due to wobble",
      "humidity": "55-65% (slightly higher)"
    }
  }
}
```
Is this structure good? What else needed?

### 3. Punnett Square Visualization
**Current:** Text list like "25% Super Banana, 50% Banana, 25% Normal"  
**Want:** Visual 2×2 or 4×4 grid with color coding  
**How to implement?**
- Canvas/SVG for drawing?
- CSS Grid with styled cells?
- External library (Chart.js, D3)?
- ASCII art good enough?

### 4. Integration with Dex
**Dex** = Morph encyclopedia (like Pokédex)  
**Should it:**
- Share same JSON database?
- Show care sheets per morph?
- Link to calculator with morph pre-selected?
- Display morph images/gallery?

### 5. Version 0.777 (Lucky Version)
**User wants:**
- Version 0.777 as stable release
- Both demos working (purchase flow + calculator/dex)
- All functionality showcased
- Care sheets for customer printing
- Comprehensive morph info

**Is this realistic as next milestone?** What's minimum viable?

---

## 🎬 DEMO SCENARIO (WHAT IT SHOULD DO)

**Current Flow (Partially Working):**

1. ✅ **Load Calculator** - Opens `/calc/?source=demo_test`
2. ❌ **Select Male Morphs** - Should type "Banana" + "Spider" (doesn't work)
3. ❌ **Select Female Morphs** - Should type "Piebald" + "Het Clown" (doesn't work)
4. ❌ **Click Calculate** - Should click button (doesn't work)
5. ❌ **Show Results** - Should display outcomes (doesn't work)
6. ❌ **Show Lethal Warning** - If Spider×Spider selected (doesn't work)

**What Works Now:**
- Demo loads the calculator page in iframe
- Can display static messages
- Can wait/pause between steps

**What Doesn't:**
- Can't fill form fields
- Can't click buttons
- Can't verify results appeared

---

## 🚀 HOW TO TEST

### Local Development:
```bash
# From /root/catalog/
python3 -m http.server 8000

# Then visit:
http://localhost:8000/calc/
http://localhost:8000/demo/?scenario=morph
```

### Production:
```
https://vinas8.github.io/catalog/calc/?v=0.7.81
https://vinas8.github.io/catalog/demo/
```

### Test Cases:
1. **Lethal Combo:** Male=Spider, Female=Spider → RED alert
2. **Health Risk:** Male=Champagne, Female=Spider → YELLOW warning
3. **Normal Breeding:** Male=Banana, Female=Piebald → Outcomes shown
4. **Mobile:** Open on phone → Should be responsive
5. **Cache Bust:** Change ?v=0.7.81 to ?v=0.7.82 → Fresh load

---

## 💡 IMPROVEMENT IDEAS (FROM PREVIOUS AI)

### Quick Wins:
- Add "Random" button (pick random morphs for demo)
- Add "Clear" button (reset selections)
- Add loading spinner during calculation
- Show total offspring count (not just percentages)

### Medium Effort:
- Autocomplete shows morph type badge (dominant/co-dom/recessive)
- Results grouped by visual outcome (all normals together)
- "Compare" mode (calculate multiple pairings side-by-side)
- Price estimation for offspring (market value * probability)

### Advanced:
- Multi-gene calculator (3+ morphs per parent)
- Line breeding calculator (track inbreeding coefficient)
- Genetic timeline (show inheritance across generations)
- Community features (share, comment, rate combinations)

---

## 🎯 WHAT I NEED FROM YOU

**Please help me with:**

1. **Demo Automation Solution**
   - How to make demo steps actually work?
   - Code examples for iframe interaction or alternatives

2. **Care Sheet Design**
   - Review proposed JSON structure
   - What other data fields needed?
   - How to handle morph-specific variations?

3. **Dex Integration Plan**
   - How to connect calculator ↔ dex?
   - Should dex be separate app or integrated?
   - Data structure for encyclopedia entries?

4. **Visualization Strategy**
   - Best approach for Punnett square display?
   - How to make results more visual/engaging?
   - Any good libraries for genetics visualization?

5. **Version 0.777 Roadmap**
   - What features are realistic for "lucky version"?
   - Priority order for implementation?
   - Testing strategy?

**Discussion Points:**
- Is MorphMarket API integration worth it? (live pricing)
- Should we add user accounts? (save breeding projects)
- Need image hosting solution for morph photos?
- Worth supporting other species? (corn snakes, leopard geckos)

---

## 📊 SUCCESS CRITERIA

**Version 0.777 should:**
- ✅ Demo fully automated (clicks buttons, fills forms)
- ✅ Care sheets available and printable
- ✅ Dex integrated with comprehensive database
- ✅ Results beautifully visualized
- ✅ Mobile perfect
- ✅ All 66 morphs working
- ✅ Lethal combos prevented
- ✅ Health warnings clear

**User can:**
- Select morphs easily
- See visual breeding outcomes
- Understand health risks
- Print care sheets
- Browse morph encyclopedia
- Share breeding combinations
- Use on any device

---

## 🔗 REFERENCES

- **World of Ball Pythons:** https://www.worldofballpythons.com/morphs/
- **MorphMarket:** https://www.morphmarket.com/c/reptiles/pythons/ball-pythons
- **Live Calculator:** https://vinas8.github.io/catalog/calc/?v=0.7.81
- **Demo System:** https://vinas8.github.io/catalog/demo/

---

## 📝 NOTES

- Project uses **vanilla JavaScript** (no React/Vue/Angular)
- Must work on **GitHub Pages** (static hosting, no backend)
- Mobile-first approach (most users on phones)
- Ethics-focused (prevent lethal combos, warn about health)
- Customer education priority (care sheets, genetics explained)

---

**Ready to discuss improvements! What should we tackle first?** 🚀
