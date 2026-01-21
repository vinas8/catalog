# 🧬 MORPH CALCULATOR & DEX - COMPLETE CONTEXT

## 📊 CURRENT STATE (v0.7.81)

### Files & Structure
```
/calc/
  └── index.html                 # Breeding calculator UI (1047 lines)

/dex/
  ├── index.html                 # Morph encyclopedia main page
  ├── modules/
  │   ├── morph-data-loader.js   # Loads genetics data
  │   └── snake-dex-container.js # Pokedex-style UI component

/src/modules/breeding/
  ├── genetics-core.js           # Core genetics engine (1255 lines)
  ├── morph-sync.js              # MorphMarket sync logic
  └── index.js                   # Module facade

/data/genetics/
  ├── morphs-comprehensive.json  # 66 morphs (v3.0.0) ✨ NEW
  ├── morphs.json                # 50 base morphs (v1.0.0)
  ├── morphs-expanded.json       # 20 expanded morphs (v2.0.0)
  ├── health-risks.json          # Health risk categories
  ├── lethal-combos.json         # 3 lethal combinations
  ├── gene-types.json            # Gene type definitions
  └── README.md                  # Database documentation

/demo/index.html
  └── Scenario: "🧬 Morph Calculator & Dex" (6 steps)
```

### Database Statistics
```json
{
  "total_morphs": 66,
  "gene_types": {
    "dominant": 6,
    "co-dominant": 32,
    "recessive": 22
  },
  "health_risks": {
    "high": 2,      // Spider, HGW
    "moderate": 3,  // Champagne, Cinnamon, Scaleless
    "low": 4,
    "none": 57
  },
  "lethal_combos": 3  // Spider×Spider, Lesser×Butter, HGW×HGW
}
```

## 🎯 CURRENT FEATURES

### Breeding Calculator (/calc/index.html)
✅ **Working:**
- Loads 66 morphs from comprehensive database
- Autocomplete search with aliases
- Tag-based morph selection (male + female)
- Calculate button triggers genetics engine
- Compatibility scoring (0-100)
- Offspring probability calculations
- Lethal combo detection (RED alerts)
- Health risk warnings (YELLOW alerts)
- Market value analysis
- Genetic diversity metrics (CoI, heterozygosity)
- Mobile responsive design
- Cache busting (?v=0.7.81)

❌ **Missing/Broken:**
- Demo button functionality incomplete
- No care sheet integration
- No visual morph previews
- Results display could be prettier
- No save/share functionality
- No breeding project planning
- Limited Punnett square visualization

### Dex (/dex/index.html)
✅ **Working:**
- Morph data loader module exists
- Snake-dex-container component
- Pokedex-style layout

❌ **Missing/Broken:**
- Not integrated with comprehensive database
- No search functionality
- No filtering by gene type/health risk
- No detailed morph pages
- No care sheets displayed
- Not linked from breeding calculator
- No demo scenario coverage

## 🔬 GENETICS ENGINE (genetics-core.js)

### Core Functions
```javascript
// Database
loadGeneticsDatabase(useComprehensive=true)  // Returns morph data

// Calculations
calculateCompatibility(male, female)         // Score 0-100
calculateOffspring(male, female)             // Punnett square results
assessHealthRisk(male, female)               // Combined health risks
checkLethalCombo(morph1, morph2)            // Detects lethal pairs

// Advanced Metrics
calculateInbreedingCoefficient(male, female) // CoI percentage
calculateGeneticDiversity(male, female)      // Diversity score
calculateHeterozygosity(male, female)        // Het percentage
getMorphValue(morphId)                       // Market price USD
```

### Known Issues
- Returns boolean instead of data (FIXED in v0.7.80)
- Needs better Punnett square logic for complex combos
- Market values need updating
- No line breeding tracking
- No multi-generation projections

## 🎬 DEMO SCENARIO (Step-by-Step)

Current flow in `/demo/index.html`:
```
Step 1: Load Morph Database    ✅ Loads calc page
Step 2: Test Safe Combo        ⚠️  Manual interaction needed
Step 3: Test Lethal Combo      ⚠️  Manual interaction needed
Step 4: View Morph Dex         ❌ Just loads page, no interaction
Step 5: View Care Sheets       ❌ No care sheets exist
Step 6: Business Logic Summary ✅ Shows in console
```

## 🐛 KNOWN BUGS

1. **Database Loading** - Fixed in v0.7.80 but needs testing
2. **MorphMarket iframe** - Removed (blocked by X-Frame-Options)
3. **Mobile responsive** - Fixed in v0.7.79 but could be better
4. **Demo Steps 2-5** - Not automated, just load pages
5. **Dex integration** - Not using comprehensive database
6. **Care sheets** - Don't exist anywhere

## 💡 IMPROVEMENT IDEAS

### Priority 1: Core Functionality
- [ ] Fix demo automation (actual clicks, not just page loads)
- [ ] Integrate dex with comprehensive database
- [ ] Add care sheet data and display
- [ ] Improve Punnett square visualization
- [ ] Add morph image placeholders or links

### Priority 2: User Experience
- [ ] Better results presentation (cards, charts)
- [ ] Save breeding projects to localStorage
- [ ] Share breeding combinations via URL params
- [ ] Print-friendly care sheets for customers
- [ ] Mobile app-like experience (PWA)

### Priority 3: Business Features
- [ ] Profit calculator (costs vs offspring value)
- [ ] Multi-generation breeding projects
- [ ] Line breeding coefficient warnings
- [ ] Breeding goal planner (target morphs)
- [ ] Market trend analysis

### Priority 4: Content
- [ ] Add all WOBP morphs (currently 66, could be 200+)
- [ ] Care sheets with temp/humidity requirements
- [ ] Feeding schedules by age/size
- [ ] Health issue descriptions with photos
- [ ] Breeding ethics guidelines

## 📋 DATA STRUCTURE

### Morph Object Schema
```typescript
interface Morph {
  id: string;                    // "banana", "pastel"
  name: string;                  // "Banana", "Pastel"
  aliases?: string[];            // ["Coral Glow"]
  gene_type: "dominant" | "co-dominant" | "recessive";
  super_form?: string;           // "Super Banana"
  market_value_usd: number;      // 150
  rarity: "common" | "uncommon" | "rare";
  health_risk: "none" | "low" | "moderate" | "high";
  health_issues: string[];       // ["Fertility concerns in super males"]
  breeding_notes?: string;       // "Super form viable but check fertility"
  source_url: string;            // WOBP reference
  fetched_at: string;            // ISO timestamp
}
```

### Missing Care Sheet Schema (NEEDS TO BE CREATED)
```typescript
interface CareSheet {
  morph_id: string;
  temperature: {
    basking: { min: 88, max: 92, unit: "F" },
    cool: { min: 78, max: 82, unit: "F" },
    night: { min: 75, max: 80, unit: "F" }
  },
  humidity: { min: 50, max: 60, unit: "%" },
  feeding: {
    hatchling: "1 fuzzy mouse every 5-7 days",
    juvenile: "1 small mouse every 7 days",
    adult: "1 medium rat every 10-14 days"
  },
  enclosure: {
    hatchling: "10-20 gallon",
    juvenile: "20-40 gallon", 
    adult: "40-75 gallon"
  },
  substrate: ["aspen", "cypress mulch", "paper towels"],
  hide_spots: 2,
  water: "Fresh water always available",
  special_notes?: string
}
```

## 🔗 URLs

**Live:**
- Breeding Calc: https://vinas8.github.io/catalog/calc/?v=0.7.81
- Morph Dex: https://vinas8.github.io/catalog/dex/
- Demo Flow: https://vinas8.github.io/catalog/demo/?v=0.7.81

**Local:**
- http://localhost:8000/calc/?v=0.7.81
- http://localhost:8000/dex/
- http://localhost:8000/demo/?v=0.7.81

## 🎨 DESIGN NOTES

Current design:
- Purple gradient background (#667eea → #764ba2)
- White cards with shadows
- Mobile-first responsive (768px breakpoint)
- Autocomplete dropdowns
- Tag-based selection
- Color-coded alerts (red=lethal, yellow=warning, green=safe)

## 🔧 TECHNICAL DETAILS

**Module Pattern:**
- Breeding calculator = standalone HTML page
- Genetics engine = ES6 module
- Dex = separate component system
- Demo = orchestrator that loads all above

**Data Flow:**
```
User Input → Autocomplete Search → Select Morphs → 
Calculate Button → genetics-core.js → 
Punnett Square + Risk Assessment → 
Display Results (compatibility, offspring, warnings)
```

**Cache Strategy:**
- URL param: ?v=0.7.81
- window.APP_BASE_PATH for GitHub Pages
- localStorage for user breeding projects (NOT IMPLEMENTED)

## 📝 NEXT STEPS

**For Discussion with Other AI:**
1. How to improve demo automation?
2. What care sheet data structure is best?
3. Should we integrate with MorphMarket API for live prices?
4. How to visualize Punnett squares better?
5. What business features are most valuable?
6. Mobile app vs PWA approach?

**Immediate Improvements Needed:**
1. Create care sheet JSON files
2. Integrate dex with comprehensive database
3. Add actual morph images (or placeholders)
4. Improve demo step automation
5. Add save/share breeding projects
6. Better visual design for results

---

**Version:** 0.7.81
**Last Updated:** 2026-01-20
**Status:** Working but needs polish
**Priority:** HIGH - Core business feature
