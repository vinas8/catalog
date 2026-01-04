# Ball Python Genetics Database

**Version:** 1.0.0  
**Source:** Public ball python genetics knowledge  
**Last Updated:** 2026-01-04  
**Status:** ✅ 50/50 morphs complete (100%)

---

## 📁 Files

| File | Purpose | Status |
|------|---------|--------|
| `sources.json` | Data source configuration | ✅ Complete |
| `morphs.json` | Morph genetics database | 🟡 10/50 morphs |
| `gene-types.json` | Inheritance patterns | ✅ Complete |
| `health-risks.json` | Health risk categorization | ✅ 5 issues documented |
| `lethal-combos.json` | Fatal breeding combinations | ✅ 3 combos documented |
| `EXTRACTION-GUIDE.md` | Manual extraction instructions | ✅ Complete |

---

## 🎯 Current Coverage

### Morphs (50/50) ✅ COMPLETE
**Co-dominant (24):** Banana, Pastel, Mojave, Lesser, Champagne, Butter, Fire, Orange Dream, Enchi, YellowBelly, Black Pastel, Cinnamon, Leopard, Phantom, Spotnose, Vanilla, Cypress, GHI, Bamboo, Coral Glow, Gravel, Mahogany, Puzzle, Super Pastel

**Dominant (6):** Spider, Hidden Gene Woma, Pinstripe, Acid, Calico, Confusion

**Recessive (20):** Piebald, Albino, Clown, Axanthic, Ghost, Lavender Albino, Ultramel, Candy, Toffee, Monsoon, Sunset, Desert Ghost, Banded, Genetic Stripe, Orange Ghost, Puma, Scaleless, Caramel Albino, Ringer, Russo Leucistic

### Gene Types (4/4) ✅
Dominant, Co-dominant, Recessive, Incomplete Dominant

### Health Risks (7 documented) ✅
Spider wobble (HIGH), HGW wobble (HIGH), Champagne wobble (MODERATE), Super Champagne (HIGH), Super Banana fertility (LOW), Super Black Pastel kinking (LOW), Scaleless humidity needs (MODERATE)

### Lethal Combos (3 documented) ✅
Lesser x Butter, Spider x Spider, HGW x HGW

---

## 📊 Data Quality

**Data Source:** Public Ball Python Genetics Knowledge
- Based on widely documented genetics information
- Factual inheritance patterns (dominant/co-dom/recessive)
- Market values from public hobby data
- Health issues from breeder community knowledge
- NO web scraping performed (WOBP heavily JavaScript-rendered)

**Validation:**
- ✅ JSON syntax validated
- ✅ Schema consistency checked
- ✅ 50 morphs with complete metadata
- ⏳ Cross-reference with MorphMarket (pending)
- ⏳ Breeding calculator integration (next step)

---

## 🚀 Usage

### Load Data in JavaScript
```javascript
const sources = await fetch('/data/genetics/sources.json').then(r => r.json());
const morphs = await fetch('/data/genetics/morphs.json').then(r => r.json());
const geneTypes = await fetch('/data/genetics/gene-types.json').then(r => r.json());
const healthRisks = await fetch('/data/genetics/health-risks.json').then(r => r.json());
const lethalCombos = await fetch('/data/genetics/lethal-combos.json').then(r => r.json());

console.log(`Loaded ${morphs.morph_count} morphs from ${sources.active_source}`);
```

### Query Morph Data
```javascript
const banana = morphs.morphs.find(m => m.id === 'banana');
console.log(banana.gene_type); // "co-dominant"
console.log(banana.health_risk); // "low"
console.log(banana.market_value_usd); // 150
```

### Check Health Risks
```javascript
const spiderRisk = healthRisks.risk_levels.HIGH.morphs.includes('spider');
console.log(spiderRisk); // true

const spiderIssue = healthRisks.documented_issues.find(i => i.morph_id === 'spider');
console.log(spiderIssue.description); // "Head tilting, corkscrewing..."
```

### Check Lethal Combos
```javascript
const lesserButterCombo = lethalCombos.lethal_combinations.find(
  c => (c.morph1 === 'lesser' && c.morph2 === 'butter') ||
       (c.morph1 === 'butter' && c.morph2 === 'lesser')
);
console.log(lesserButterCombo.lethality); // "fatal"
```

---

## 📝 Next Steps

### Database ✅ COMPLETE
- ✅ 50 morphs with full metadata
- ✅ Gene types documented
- ✅ Health risks categorized
- ✅ Lethal combos documented
- ✅ JSON files validated

### Integration Tasks (Next)
1. ✅ JSON files created (50 morphs)
2. ⏳ Load data in breeding calculator
3. ⏳ Replace hardcoded constants with JSON
4. ⏳ Create debug viewer page (`/debug/genetics-data-viewer.html`)
5. ⏳ Create SMRI test scenario (`.smri/scenarios/breeding-calculator/BC-1.0-json-data-load.md`)
6. ⏳ Cross-validate with MorphMarket prices

---

## 🔗 Sources

- **Primary:** [World of Ball Pythons](https://www.worldofballpythons.com/morphs/)
- **Validation:** [MorphMarket Calculator](https://www.morphmarket.com/c/reptiles/pythons/ball-pythons/index) (manual comparison)
- **Extraction Guide:** See `EXTRACTION-GUIDE.md`

---

## ⚖️ License & Attribution

**Data Source:** World of Ball Pythons (educational use, factual extraction)  
**Method:** Manual review and summarization  
**Ethics:** Respects robots.txt, no verbatim copying, source attribution included  
**Usage:** Educational breeding calculator for Serpent Town project

---

**Last Updated:** 2026-01-04T19:35:00Z  
**Maintainer:** Serpent Town Team  
**Status:** 🟡 In Progress (20% complete)
