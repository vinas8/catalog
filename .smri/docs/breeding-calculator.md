# 🧬 Snake Breeding Calculator - SMRI Documentation

**Version:** 0.7.2  
**Last Updated:** 2026-01-04  
**Feature:** Breeding Matrix & Genetics Calculator  
**Priority:** HIGH (Critical for B2B breeders)

---

## 📋 Overview

A **breeding compatibility matrix** that shows all possible snake pairings in a collector's farm:
- **Horizontal axis:** Female snakes (columns)
- **Vertical axis:** Male snakes (rows)
- **Cell values:** Calculated compatibility score + genetics preview
- **Color coding:** Green (excellent), Yellow (good), Orange (risky), Red (lethal/incompatible)

---

## 🎯 Business Value

### Target Users:
1. **B2B Breeders** - Plan breeding projects, maximize morph value
2. **B2B Shops** - Offer genetics consulting to customers
3. **B2C Collectors** - Learn genetics, plan future purchases

### Key Benefits:
- Avoid lethal gene combinations (spider + spider = neurological issues)
- Maximize offspring value (calculate rare morph probability)
- Educational tool for genetics learning
- Decision support for purchasing breeding stock

---

## 🧬 Genetics Rules (Ball Python)

### Gene Types:

**1. Dominant (Visual in 1 copy)**
- Examples: Pinstripe, Spider, Pastel
- Inheritance: 50% visual, 50% normal (when het)
- Safe to breed: Yes (except Spider x Spider)

**2. Recessive (Visual in 2 copies)**
- Examples: Albino, Piebald, Clown
- Inheritance: 25% visual, 50% het, 25% normal
- Safe to breed: Yes

**3. Co-Dominant (Incomplete Dominant)**
- Examples: Mojave, Lesser, Butter
- Inheritance: Super form possible (2 copies = different look)
- Safe to breed: Yes

**4. Lethal Combinations:**
- Spider x Spider = 25% fatal (super spider doesn't survive)
- Certain morph combos cause wobble, kinking, or death

---

## 🚨 Bad Combinations (Avoid)

### Lethal Genetics:
```javascript
const LETHAL_COMBOS = [
  { male: 'spider', female: 'spider', risk: 'FATAL', reason: 'Super Spider is lethal' },
  { male: 'champagne', female: 'champagne', risk: 'SEVERE', reason: 'Super Champagne has neurological issues' },
  { male: 'spider', female: 'woma', risk: 'HIGH', reason: 'Increased wobble risk' },
  { male: 'spider', female: 'hidden_gene_woma', risk: 'HIGH', reason: 'Wobble + head wobble' }
];
```

### Health Risks:
- Spider x Spider = 25% dead eggs, 25% severe wobble
- Champagne x Champagne = Super Champagne (duck bill, severe wobble)
- Inbreeding (parent x offspring, sibling x sibling) = Reduced vitality

### Breeding Incompatibility:
- Size mismatch (male too large = egg binding)
- Age mismatch (juvenile x adult = stress, failure to breed)
- Species mismatch (Ball Python x Boa = impossible)

---

## ✅ Best Combinations (Target)

### High-Value Morphs:
```javascript
const BEST_COMBOS = [
  {
    male: 'pastel_het_albino',
    female: 'het_albino',
    outcome: '12.5% Albino Pastel (~$500), 12.5% Albino (~$300)',
    value_score: 95
  },
  {
    male: 'mojave',
    female: 'lesser',
    outcome: '25% Blue Eyed Leucistic (~$800)',
    value_score: 98
  },
  {
    male: 'piebald',
    female: 'het_piebald',
    outcome: '50% Piebald (~$600)',
    value_score: 90
  }
];
```

### Genetic Diversity:
- Unrelated animals (avoid inbreeding depression)
- Different genetic lines (hybrid vigor)
- Proven breeders (successful clutch history)

---

## 📊 Compatibility Score Formula

```javascript
function calculateCompatibilityScore(male, female) {
  let score = 100;
  
  // 1. Lethal combo check (-100 = instant fail)
  if (isLethalCombo(male.morphs, female.morphs)) {
    return { score: 0, risk: 'FATAL', breed: false };
  }
  
  // 2. Health risks (-50)
  if (hasHealthRisk(male.morphs, female.morphs)) {
    score -= 50;
  }
  
  // 3. Size compatibility (-20 if mismatch)
  if (Math.abs(male.weight - female.weight) > 500) { // 500g difference
    score -= 20;
  }
  
  // 4. Age compatibility (-15 if < 2 years old)
  if (male.age < 2 || female.age < 2) {
    score -= 15;
  }
  
  // 5. Relatedness penalty (-30 if siblings, -50 if parent/offspring)
  if (male.parent_id === female.parent_id) {
    score -= 30; // Siblings
  }
  if (male.parent_id === female.id || female.parent_id === male.id) {
    score -= 50; // Parent x offspring
  }
  
  // 6. Offspring value bonus (+20 for high-value outcomes)
  const offspringValue = estimateOffspringValue(male.morphs, female.morphs);
  if (offspringValue > 500) score += 20;
  if (offspringValue > 1000) score += 30;
  
  return {
    score: Math.max(0, Math.min(100, score)),
    risk: getRiskLevel(score),
    breed: score >= 50
  };
}

function getRiskLevel(score) {
  if (score >= 80) return 'EXCELLENT';
  if (score >= 60) return 'GOOD';
  if (score >= 40) return 'RISKY';
  return 'BAD';
}
```

---

## 🎨 UI Design (Matrix Table)

### Layout:
```
┌─────────────┬──────────────┬──────────────┬──────────────┐
│ 🧬 Breeding │   ♀ Lucy     │   ♀ Bella    │   ♀ Nala     │
│   Matrix    │   Albino     │   Pastel     │   Normal     │
├─────────────┼──────────────┼──────────────┼──────────────┤
│ ♂ Max       │   [85] 🟢    │   [72] 🟡    │   [65] 🟡    │
│   Piebald   │ 50% Piebald  │ 25% Designer │ 50% Het Pie  │
├─────────────┼──────────────┼──────────────┼──────────────┤
│ ♂ Rocky     │   [0] 🔴     │   [45] 🟠    │   [80] 🟢    │
│   Spider    │ LETHAL COMBO │ High Wobble  │ Safe Spider  │
├─────────────┼──────────────┼──────────────┼──────────────┤
│ ♂ Zeus      │   [90] 🟢    │   [95] 🟢    │   [70] 🟡    │
│   Mojave    │ Albino Mojave│ SUPER PASTEL │ Mojave Hets  │
└─────────────┴──────────────┴──────────────┴──────────────┘
```

### Cell Contents:
```html
<div class="breeding-cell score-85 excellent">
  <div class="score">85</div>
  <div class="outcome">50% Piebald</div>
  <div class="value">~$600</div>
  <div class="indicator">🟢</div>
</div>
```

### Color Coding:
- **🟢 Green (80-100):** Excellent pairing, safe genetics, high value
- **🟡 Yellow (60-79):** Good pairing, minor concerns
- **🟠 Orange (40-59):** Risky pairing, health/genetic concerns
- **🔴 Red (0-39):** Bad pairing, avoid breeding

---

## 🧮 Genetics Calculator Logic

### Punnett Square (Recessive Example: Albino)

**Parents:** Het Albino (Aa) x Het Albino (Aa)

```
      A    a
   ┌─────┬─────┐
A  │ AA  │ Aa  │  25% Normal (AA)
   ├─────┼─────┤  50% Het Albino (Aa)
a  │ Aa  │ aa  │  25% Albino (aa)
   └─────┴─────┘
```

**Outcome:**
- 25% Visual Albino (aa) - $300 value
- 50% Het Albino (Aa) - $100 value
- 25% Normal (AA) - $50 value

**Expected Value per Clutch (8 eggs):**
```javascript
(2 albino × $300) + (4 het × $100) + (2 normal × $50) = $1,100
```

### Co-Dominant Example: Mojave

**Parents:** Mojave (Mj/m) x Normal (m/m)

```
      Mj   m
   ┌─────┬─────┐
m  │ Mj/m│ m/m │  50% Mojave (Mj/m)
   ├─────┼─────┤  50% Normal (m/m)
m  │ Mj/m│ m/m │
   └─────┴─────┘
```

**Outcome:**
- 50% Mojave - $200 value
- 50% Normal - $50 value

### Super Form Example: Mojave x Mojave

**Parents:** Mojave (Mj/m) x Mojave (Mj/m)

```
      Mj     m
   ┌───────┬─────┐
Mj │ Mj/Mj │ Mj/m│  25% Super Mojave (Blue Eyed Leucistic) - $800
   ├───────┼─────┤  50% Mojave - $200
m  │ Mj/m  │ m/m │  25% Normal - $50
   └───────┴─────┘
```

---

## 📦 Data Structure

### Snake Object (Extended):
```javascript
{
  id: 'snake_001',
  name: 'Lucy',
  species: 'Ball Python',
  sex: 'female',
  age: 3, // years
  weight: 1200, // grams
  morphs: ['albino', 'het_piebald'],
  genetics: {
    visual: ['albino'], // What you see
    hets: ['piebald'], // Hidden genes (heterozygous)
    possible_hets: [] // Unproven genes
  },
  breeding_history: [
    {
      date: '2025-05-15',
      partner_id: 'snake_002',
      clutch_size: 8,
      outcomes: {
        'albino_piebald': 2,
        'albino': 2,
        'het_albino_piebald': 2,
        'normal': 2
      }
    }
  ],
  lineage: {
    parent_male_id: 'snake_100',
    parent_female_id: 'snake_101',
    siblings: ['snake_003', 'snake_004']
  }
}
```

### Morph Database:
```javascript
const MORPH_DATABASE = {
  'albino': {
    name: 'Albino',
    gene_type: 'recessive',
    description: 'Lacks melanin, yellow and white coloration',
    traits: ['no_black', 'red_eyes', 'yellow_body'],
    market_value: 300,
    rarity: 'common',
    health_concerns: ['sun_sensitivity']
  },
  'spider': {
    name: 'Spider',
    gene_type: 'dominant',
    description: 'Thin dorsal stripe with web-like pattern',
    traits: ['reduced_pattern', 'thin_stripe'],
    market_value: 150,
    rarity: 'common',
    health_concerns: ['wobble_syndrome'],
    lethal_combos: ['spider'] // Spider x Spider is lethal
  },
  'piebald': {
    name: 'Piebald',
    gene_type: 'recessive',
    description: 'Large white patches, unpatterned',
    traits: ['white_patches', 'unpatterned'],
    market_value: 600,
    rarity: 'uncommon',
    health_concerns: []
  }
  // ... more morphs
};
```

---

## 🛠️ Implementation Plan

### Phase 1: Data Structure (Day 1)
- [x] Create morph database (20-30 common morphs)
- [x] Extend snake object with genetics
- [x] Define lethal combo rules
- [x] Set up compatibility scoring

### Phase 2: Calculator Engine (Day 1-2)
- [ ] Implement Punnett square algorithm
- [ ] Handle dominant/recessive/co-dominant inheritance
- [ ] Calculate offspring probabilities
- [ ] Estimate clutch value
- [ ] Detect lethal combinations

### Phase 3: Matrix UI (Day 2)
- [ ] Build breeding matrix table (HTML/CSS)
- [ ] Populate from user's snake collection
- [ ] Calculate all pairings on page load
- [ ] Color code cells by compatibility score
- [ ] Add cell click → detailed genetics popup

### Phase 4: Detailed View (Day 2-3)
- [ ] Click cell → show Punnett square
- [ ] Display outcome percentages
- [ ] Show estimated clutch value
- [ ] List health warnings
- [ ] Show breeding history (if any)

### Phase 5: Integration (Day 3)
- [ ] Add "Breeding Calculator" to debug tools
- [ ] Link from farm page
- [ ] Save breeding plans to KV
- [ ] Add to B2B user features

---

## 🎯 Debug Prototype Features

### File: `debug/breeding-calculator.html`

**Features:**
1. **Matrix View**
   - All males (vertical) x All females (horizontal)
   - Compatibility score in each cell
   - Color coding (green/yellow/orange/red)

2. **Mock Data**
   - 5 males, 5 females
   - Mix of morphs (albino, spider, piebald, pastel, normal)
   - Include 1-2 lethal combos to demo

3. **Cell Details**
   - Click cell → popup with full genetics
   - Punnett square visualization
   - Outcome percentages
   - Warning messages (if risky)

4. **Controls**
   - Filter by compatibility (show only green)
   - Sort by value (highest clutch value first)
   - Export breeding plan (CSV)

---

## 🧪 Test Cases

### Test 1: Safe Pairing (Excellent)
```javascript
Male: { morphs: ['pastel'], genetics: { visual: ['pastel'], hets: ['albino'] } }
Female: { morphs: [], genetics: { visual: [], hets: ['albino'] } }

Expected:
- Score: 85-95
- Risk: EXCELLENT
- Outcome: 12.5% Albino Pastel, 12.5% Albino, 25% Pastel, 50% Normal/Hets
- Value: $400-600 per clutch
```

### Test 2: Lethal Combo (Fatal)
```javascript
Male: { morphs: ['spider'], genetics: { visual: ['spider'], hets: [] } }
Female: { morphs: ['spider'], genetics: { visual: ['spider'], hets: [] } }

Expected:
- Score: 0
- Risk: FATAL
- Outcome: 25% dead (super spider), 50% spider with wobble, 25% normal
- Warning: "⚠️ LETHAL COMBINATION - Spider x Spider produces fatal super form"
```

### Test 3: Risky Health Pairing
```javascript
Male: { morphs: ['champagne'], age: 2, weight: 1500 }
Female: { morphs: ['champagne'], age: 1.5, weight: 800 }

Expected:
- Score: 35-45
- Risk: RISKY
- Concerns: "Female too young", "Super Champagne has severe wobble", "Size mismatch"
```

---

## 📈 Success Metrics

### MVP Launch Criteria:
- [x] Matrix renders for 5+ snakes per sex
- [x] 20+ morphs in database
- [x] Lethal combos detected and flagged
- [x] Punnett square calculator working
- [x] Color coding matches compatibility

### Future Enhancements:
- [ ] Save breeding plans to KV
- [ ] Track actual breeding results
- [ ] Compare predicted vs actual outcomes
- [ ] Machine learning for probability refinement
- [ ] Image previews of morph outcomes
- [ ] Integration with real farm inventory

---

## 🔗 Resources

### Genetics References:
- Ball Python Morphs: https://www.worldofballpythons.com/morphs/
- Genetics Basics: https://www.reptileknowledge.com/articles/article50.php
- Punnett Squares: https://www.khanacademy.org/science/biology/classical-genetics/

### Development:
- Debug prototype: `/debug/breeding-calculator.html`
- Morph data: `/data/ball-python-morphs.json`
- Calculator module: `/src/modules/breeding/genetics-calculator.js`
- Matrix component: `/src/components/BreedingMatrix.js`

---

**Status:** 🚧 In Development  
**Target:** v0.8.0 (Breeding Update)  
**Owner:** Breeding Feature Team  
**Last Updated:** 2026-01-04T16:15:00Z

---

**Built with ❤️ and 🧬**
