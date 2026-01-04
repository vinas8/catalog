# 🎯 Breeding Calculator - Implementation Roadmap

**Version:** 0.7.2  
**Last Updated:** 2026-01-04  
**Code:** `/debug/breeding-calculator.html`

---

## 📊 Current Status

### Code Stats
- **File:** `debug/breeding-calculator.html`
- **Total Lines:** 1092 (HTML + CSS + JS)
- **JavaScript:** Lines 630-1092 (462 lines)
- **Constants:** Lines 792-810
- **Main Logic:** Lines 813-967

### Phase Progress
- ✅ **Phase 1:** Complete
- 🚧 **Phase 2:** Ready to implement (formulas ready)
- 📋 **Phase 3:** Planned
- 💡 **Phase 4:** Conceptual

---

## 📦 Phase 1: Basic Calculator (✅ Complete)

### Features Implemented
1. **Matrix UI**
   - 5×5 grid (males × females)
   - Color-coded cells (🟢🟡🟠🔴)
   - Hover effects, click for details

2. **Basic Scoring**
   - Starting score: 100
   - Age penalty: -15 (< 2 years)
   - Size penalty: -20 (diff > 500g)
   - Value bonus: +10/+20 ($1000/$2000 thresholds)

3. **Lethal Detection**
   - Spider × Spider = Score 0
   - Champagne × Champagne = Score 0

4. **Offspring Preview**
   - Simplified Punnett square
   - First outcome shown in cell
   - Click for full genetics

5. **Debug Console**
   - Green terminal-style output
   - Shows generation progress
   - Cell count verification

### Code Locations
```javascript
// Lines 792-796: LETHAL_COMBOS
// Lines 799-810: MORPH_VALUES  
// Lines 813-867: calculateCompatibility()
// Lines 883-963: calculateOffspring()
// Lines 965-1016: generateMatrix()
```

---

## 🔬 Phase 2: Advanced Genetics (🚧 Next)

### Ready to Implement
All formulas documented in `formulas.md` with exact code snippets.

#### 1. Inbreeding Coefficient (CoI)
**Location:** Add after line 835 in `calculateCompatibility()`  
**Functions needed:**
- `calculateInbreedingCoefficient(male, female, allSnakes)`
- `getAncestors(snake, allSnakes, generations)`
- `getGenerationsTo(snake, ancestor, allSnakes)`

**Scoring:**
- CoI > 25%: -60 points
- CoI 12.5-25%: -30 points
- CoI 6.25-12.5%: -15 points

**Data Required:**
- Add `lineage.parent_male_id` to snake data
- Add `lineage.parent_female_id` to snake data
- Track 5 generations back

#### 2. Morph Health Risk Database
**Location:** Add after line 796 (after `LETHAL_COMBOS`)  
**Constant:** `MORPH_HEALTH_DATABASE`

```javascript
const MORPH_HEALTH_DATABASE = {
  'spider': { risk: 'MODERATE', avoidWith: [...] },
  'champagne': { risk: 'MODERATE', avoidWith: [...] },
  'woma': { risk: 'LOW', avoidWith: [...] }
};
```

**Function:** `assessMorphHealthRisk(maleMorphs, femaleMorphs)`  
**Scoring:**
- HIGH risk: -40 points
- MODERATE risk: -20 points

#### 3. Genetic Diversity
**Location:** Add after CoI calculation  
**Function:** `calculateGeneticDiversity(male, female)`

**Scoring:**
- Diversity > 0.8: +15 points
- Diversity > 0.6: +8 points

**Data Required:**
- Add `lineage_id` field to track bloodlines

#### 4. Heterozygosity Index
**Location:** Add after diversity calculation  
**Function:** `calculateHeterozygosity(maleGenetics, femaleGenetics)`

**Scoring:**
- Heterozygosity > 0.7: +10 points

**Data Required:**
- Expand `genetics` object with allele details

#### 5. Extended Age/Size Checks
**Location:** Replace lines 832-842  
**New thresholds:**
- Female > 10 years: -10 points
- Age > 15 years: -5 points
- Size diff > 800g: -25 points
- Female < 1200g: -20 points
- Weight ratio > 1.5: -10 points

### Implementation Steps
1. Update mock data with lineage info
2. Add helper functions (getAncestors, etc.)
3. Add MORPH_HEALTH_DATABASE constant
4. Update calculateCompatibility() with new formulas
5. Test with known inbred/outbred pairs
6. Update UI to show new metrics (CoI %, diversity)

### Estimated Time
- 4-6 hours (with testing)
- 100-150 new lines of code

---

## 🏢 Phase 3: Professional Features (📋 Planned)

### Features
1. **Lineage Tracker**
   - Visual family tree
   - 5+ generation display
   - Ancestor highlighting

2. **Breeding History**
   - Track clutch dates
   - Hatch rates
   - Offspring records
   - `clutches_produced` field
   - `last_clutch_date` tracking

3. **Market Value API**
   - Real-time pricing from MorphMarket
   - Quarterly updates
   - Rare morph detection

4. **Breeding Project Planner**
   - Multi-year planning
   - Goal setting (target morphs)
   - ROI calculator
   - Timeline projections

5. **Export Features**
   - PDF breeding plan
   - CSV compatibility matrix
   - Print-friendly format

### Data Requirements
- Database integration (replace mock data)
- User authentication
- Persistent storage (KV or DB)

### Estimated Time
- 2-3 weeks full development

---

## 🤖 Phase 4: AI/ML Enhancement (💡 Conceptual)

### Features
1. **ML Offspring Prediction**
   - Train on 10,000+ clutch records
   - Predict actual outcomes (not just Punnett)
   - Account for environmental factors

2. **Market Trend Analysis**
   - Predict morph value changes
   - Identify emerging trends
   - Recommend high-ROI pairings

3. **Optimal Pairing Recommendations**
   - AI suggests best pairs from collection
   - Multi-objective optimization:
     - Maximize value
     - Minimize health risk
     - Maximize diversity
   - Genetic algorithm for portfolio

4. **Breeding Portfolio Optimizer**
   - Plan entire season
   - Balance risk/reward
   - Resource allocation (cages, time)

### Technology Stack
- TensorFlow.js (client-side ML)
- Worker AI (Cloudflare)
- Historical clutch database

### Estimated Time
- 3-6 months (with data collection)

---

## 🔧 Technical Debt

### Known Issues
1. **Simplified genetics** - Only handles single-gene scenarios
2. **No compound morphs** - Can't calculate Spider Pastel Piebald
3. **Fixed clutch size** - Should vary by female size/age
4. **Mock data only** - No real snake integration yet

### To Fix in Phase 2
- More realistic Punnett squares
- Compound morph handling
- Variable clutch size formula

---

## 📁 File References

### Current Files
- **Code:** `/debug/breeding-calculator.html` (1092 lines)
- **Formulas:** `.smri/docs/breeding-calculator/formulas.md` (352 lines)
- **Research:** `.smri/docs/breeding-calculator/research.md` (242 lines)
- **This File:** `.smri/docs/breeding-calculator/implementation.md`

### Related
- **Genetics Engine:** `.smri/research/snake-game-genetics.js`
- **Punnett Tool:** `.smri/research/punnett-square.js`

---

## 🚀 Next Actions

### Immediate (Phase 2)
1. Review `formulas.md` - All code snippets ready
2. Update mock snake data with lineage
3. Copy functions from `formulas.md` into HTML
4. Test with UI
5. Deploy to GitHub Pages

### Short-term (Phase 3)
1. Design database schema
2. Build lineage tracker UI
3. Integrate with main game
4. Add user authentication

### Long-term (Phase 4)
1. Collect real breeding data
2. Train ML models
3. Build AI recommendation engine

---

**Last Updated:** 2026-01-04T18:36:00Z  
**Ready for:** Phase 2 implementation 🐍
