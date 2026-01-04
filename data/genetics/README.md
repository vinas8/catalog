# Ball Python Genetics Database

**Version:** 1.0.0  
**Source:** World of Ball Pythons (WOBP)  
**Last Updated:** 2026-01-04  
**Status:** ✅ 10/50 morphs complete (20%)

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

### Morphs (10/50)
✅ Banana, Pastel, Spider, Piebald, Albino, Mojave, Clown, Champagne, Hidden Gene Woma, Lesser

### Gene Types (4/4)
✅ Dominant, Co-dominant, Recessive, Incomplete Dominant

### Health Risks (5 documented)
✅ Spider wobble, HGW wobble, Champagne wobble, Super Champagne issues, Super Banana fertility

### Lethal Combos (3 documented)
✅ Lesser x Butter, Spider x Spider, HGW x HGW

---

## 📊 Data Quality

**Ethical Extraction:** ✅ Verified
- Respects robots.txt (allows crawling)
- Manual review of each morph
- Factual data only (no verbatim copying)
- Source attribution included
- Fetched timestamps recorded

**Validation:**
- ✅ JSON syntax validated
- ✅ Schema consistency checked
- ⏳ Cross-reference with MorphMarket (pending)
- ⏳ Breeding calculator integration (pending)

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

### Remaining Morphs (40 to extract)
**Co-dominant:** Fire, Orange Dream, Enchi, Cypress, Black Pastel, Cinnamon, Leopard, Spotnose, YellowBelly, Phantom, Vanilla, Gravel, Bamboo, Mahogany, Butter

**Dominant:** Pinstripe, Desert Ghost, Calico, Genetic Stripe, Banded, Confusion, Puzzle

**Recessive:** Axanthic, Ghost, Lavender Albino, Toffee, Ultramel, Candy, Blue Eyed Leucistic, Sunset, Monsoon, Russo Leucistic, Acid, Scaleless, Caramel Albino, GHI, Ringer

### Integration Tasks
1. ✅ JSON files created
2. ⏳ Load data in breeding calculator
3. ⏳ Replace hardcoded constants
4. ⏳ Create debug viewer page
5. ⏳ Create SMRI test scenario
6. ⏳ Cross-validate with MorphMarket

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
