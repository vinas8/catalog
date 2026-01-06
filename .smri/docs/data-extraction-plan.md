# 🗄️ Comprehensive Data Extraction Plan

**Version:** 0.7.7  
**Created:** 2026-01-06  
**Status:** 📋 Planning Phase

---

## 🎯 Goal

Extract comprehensive ball python genetics data from multiple sources and integrate into unified database for breeding calculator and game features.

---

## 📊 Target Sources

### 1. World of Ball Pythons (WOBP) - PRIMARY
**URL:** https://www.worldofballpythons.com/morphs/  
**Coverage:** 400+ morphs  
**Current:** 50 morphs extracted manually  

**Data to Extract:**
- ✅ Morph names & aliases (50 done)
- ✅ Gene types (dominant/co-dom/recessive) (50 done)
- ✅ Health risks (10 documented)
- ✅ Breeding notes (50 done)
- ⏳ Visual traits (partial)
- ⏳ Combo compatibility (partial)
- ⏳ Remaining 350+ morphs

**Method:** Browser automation (Puppeteer/Playwright)  
**Ethics:** Manual review required, respect robots.txt

---

### 2. MorphMarket - VALIDATION & PRICES
**URL:** https://www.morphmarket.com/  
**Calculator:** https://www.morphmarket.com/c/reptiles/pythons/ball-pythons/genetic-calculator/

**Data to Extract:**
- ⏳ Current market prices (live data)
- ⏳ Morph availability stats
- ⏳ Popular combo listings
- ⏳ Seller inventory trends

**Integration:** 
- Embed calculator via iframe (✅ done in calculator-integrated.html)
- Manual price validation (15 test cases planned)
- Cannot automate due to 403 protection

**Method:** Manual updates + iframe integration

---

### 3. Additional Structured Sources
**Priority targets for comprehensive data:**

#### A. The Reptile Database
**URL:** http://www.reptile-database.org/  
**Data:** Scientific taxonomy, subspecies, wild genetics

#### B. Ball Python Genetics Wiki
**URL:** Various community wikis  
**Data:** Community-validated combos, breeding outcomes

#### C. Academic Papers
**Sources:** PubMed, Google Scholar  
**Data:** Genetic research, health studies, inbreeding coefficients

#### D. Breeder Forums
**URL:** Ball-Pythons.net, Reddit r/ballpython  
**Data:** Real breeding outcomes, health observations

---

## 🏗️ Extraction Architecture

### Phase 1: WOBP Complete Extraction ⏳
**Goal:** Extract all 400+ morphs from World of Ball Pythons

**Tools:**
```javascript
// Puppeteer-based scraper
const puppeteer = require('puppeteer');

async function extractWOBPMorphs() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  // Get morph list
  await page.goto('https://www.worldofballpythons.com/morphs/');
  const morphLinks = await page.$$eval('a.morph-link', links => 
    links.map(a => ({ name: a.textContent, url: a.href }))
  );
  
  // Extract each morph (with 2-3 sec delay)
  for (const morph of morphLinks) {
    await page.goto(morph.url);
    await page.waitForTimeout(2000); // Respect rate limit
    
    const data = await page.evaluate(() => ({
      name: document.querySelector('h1').textContent,
      geneType: document.querySelector('.gene-type').textContent,
      description: document.querySelector('.description').textContent,
      healthRisks: document.querySelector('.health').textContent
    }));
    
    // Store in morphs-complete.json
    saveMorphData(data);
  }
}
```

**Output:** `data/genetics/morphs-complete.json` (400+ morphs)

---

### Phase 2: MorphMarket Price Sync 🔄
**Goal:** Keep market prices up-to-date

**Method:** Manual monthly updates via iframe comparison

**Files:**
- `data/genetics/prices-snapshot-YYYY-MM.json` (monthly snapshots)
- Script to merge prices into main database

---

### Phase 3: Multi-Source Validation ✅
**Goal:** Cross-validate health risks, lethal combos, genetics

**Sources:**
1. WOBP (primary)
2. SnakeDB (health risks) ✅ done
3. Wikipedia (citations) ✅ done
4. Breeder forums (real observations)
5. Academic papers (scientific backing)

**Output:** Confidence scores per data point
```json
{
  "morph": "Spider",
  "health_risk": "HIGH",
  "wobble_syndrome": {
    "confirmed": true,
    "sources": ["WOBP", "SnakeDB", "Wikipedia", "Research_Paper_2019"],
    "confidence": 100
  }
}
```

---

### Phase 4: Integrated Component 🎯
**Goal:** Single interface combining all sources

**Location:** `/debug/calc/` (breeding calculator)

**Features:**
- MorphMarket calculator iframe (✅ done in calculator-integrated.html)
- WOBP data integration (50/400 morphs done)
- Live price updates (manual monthly)
- Multi-source validation badges
- Health warning system (✅ done)

**UI Layout:**
```
┌─────────────────────────────────────────┐
│  🧬 Serpent Town Breeding Calculator    │
├─────────────────────────────────────────┤
│  [Male]  [Female]                       │
│  Banana  Piebald    [Calculate]         │
│                                          │
│  ✅ Compatibility: 85/100                │
│  ⚠️  Health Warning: Check offspring     │
│  💰 Clutch Value: $1,200-$2,500          │
├─────────────────────────────────────────┤
│  📊 Industry Standard (MorphMarket)     │
│  ┌───────────────────────────────────┐  │
│  │  [MorphMarket iframe embedded]    │  │
│  │  Pastel x Banana = Pastel Banana  │  │
│  │  50% Pastel Banana, 50% Normal    │  │
│  └───────────────────────────────────┘  │
├─────────────────────────────────────────┤
│  🔬 Advanced Analysis (Serpent Town)    │
│  • Inbreeding Coefficient: 0.0%         │
│  • Genetic Diversity: High              │
│  • Health Risk Score: 5/100 (low)       │
│  • Sources: WOBP ✅ SnakeDB ✅ Wiki ✅   │
└─────────────────────────────────────────┘
```

---

## 📁 Data Structure (Unified)

### morphs-unified.json (Target)
```json
{
  "version": "3.0.0",
  "last_updated": "2026-01-06T19:45:00Z",
  "total_morphs": 450,
  "sources": ["WOBP", "MorphMarket", "SnakeDB", "Wikipedia", "Academic"],
  "morphs": [
    {
      "id": "banana",
      "name": "Banana",
      "aliases": ["Coral Glow"],
      "gene_type": "co-dominant",
      "super_form": "Super Banana",
      
      "market_data": {
        "price_usd": {
          "current": 150,
          "range": [100, 250],
          "last_updated": "2026-01-06",
          "source": "MorphMarket"
        },
        "availability": "common",
        "avg_listings": 250
      },
      
      "genetics": {
        "inheritance": "co-dominant",
        "alleles": ["Ba", "ba"],
        "super_viable": true,
        "source": "WOBP"
      },
      
      "health": {
        "risk_level": "low",
        "issues": [
          {
            "description": "Super form males may show reduced fertility",
            "severity": "mild",
            "frequency": "rare",
            "sources": ["WOBP", "Breeder_Forums"],
            "confidence": 75
          }
        ]
      },
      
      "visual_traits": {
        "base_color": "yellow",
        "pattern": "reduced",
        "eye_color": "normal",
        "description": "Bright yellow with lavender blushing, reduced pattern"
      },
      
      "sources": {
        "wobp": "https://www.worldofballpythons.com/morphs/banana/",
        "morphmarket": "https://www.morphmarket.com/reptiles/pythons/ball-pythons/banana/",
        "snakedb": "validated",
        "wikipedia": "https://en.wikipedia.org/wiki/Ball_python#Morphs"
      },
      
      "fetched_at": "2026-01-06T19:30:00Z",
      "validated_by": ["WOBP", "SnakeDB", "Wikipedia"]
    }
  ]
}
```

---

## 🚀 Implementation Plan

### Week 1: Puppeteer Scraper Setup
- [ ] Create `/scripts/data-extraction/wobp-scraper.js`
- [ ] Test on 10 morphs (verify data quality)
- [ ] Add rate limiting (2-3 sec delay)
- [ ] Implement error handling & resume capability
- [ ] Output to `morphs-raw-YYYY-MM-DD.json`

### Week 2: Complete WOBP Extraction
- [ ] Run scraper for all 400+ morphs (~10-15 hours)
- [ ] Manual review & cleanup (2-3 hours)
- [ ] Merge with existing 50 morphs
- [ ] Validate JSON structure
- [ ] Create `morphs-complete.json`

### Week 3: MorphMarket Integration
- [ ] Update iframe embedding (already done in calculator-integrated.html)
- [ ] Add price sync component
- [ ] Manual price validation (15 test cases)
- [ ] Document monthly update workflow

### Week 4: Multi-Source Validation
- [ ] Cross-reference health risks (5 sources)
- [ ] Add confidence scores
- [ ] Document discrepancies
- [ ] Create validation report

### Week 5: Unified Database
- [ ] Merge all sources into `morphs-unified.json`
- [ ] Update `genetics-core.js` to use new schema
- [ ] Update calculator UI
- [ ] Test with 50 breeding scenarios

### Week 6: Production Integration
- [ ] Update `/debug/calc/` to use unified data
- [ ] Add multi-source badges in UI
- [ ] Deploy to production
- [ ] Create documentation

---

## 📊 Expected Outcomes

**Data Coverage:**
- 400+ morphs (vs. current 50)
- 100+ combos (vs. current 10)
- Live market prices (vs. static estimates)
- Multi-source validation (vs. single source)

**Calculator Improvements:**
- More accurate compatibility scoring
- Real-time price estimates
- Health warnings with confidence scores
- Industry-standard validation (MorphMarket parity)

**Game Features:**
- Realistic breeding outcomes
- Dynamic market prices
- Rare morph discovery system
- Health management challenges

---

## ⚠️ Risks & Mitigations

### Risk 1: WOBP Scraping Ethics
**Mitigation:**
- Respect robots.txt ✅
- Rate limit to 1 req/2-3 sec ✅
- Manual review all data ✅
- Attribute sources ✅
- Educational use only ✅

### Risk 2: MorphMarket 403 Errors
**Mitigation:**
- Use iframe embedding (allowed) ✅
- Manual price updates (not automated)
- Focus on calculator parity, not scraping

### Risk 3: Data Staleness
**Mitigation:**
- Monthly price snapshots
- Quarterly full re-extraction
- User-submitted corrections
- Version tracking

### Risk 4: Data Quality
**Mitigation:**
- Multi-source validation
- Confidence scoring
- Manual review of health data
- Test suite (15 breeding scenarios)

---

## 📝 Next Steps (Immediate)

1. **Create Puppeteer scraper** (1-2 hours)
2. **Test on 10 morphs** (30 min)
3. **Run full extraction** (overnight, ~10 hours)
4. **Manual review** (2-3 hours)
5. **Update calculator** (1 hour)

**Total time:** ~15-20 hours over 1 week

---

## 🔗 Related Files

- **Current data:** `/data/genetics/morphs.json` (50 morphs)
- **Expanded:** `/data/genetics/morphs-expanded.json` (70 morphs)
- **Integrated calc:** `/calculator-integrated.html`
- **Genetics engine:** `/src/modules/breeding/genetics-core.js`
- **Extraction guide:** `/data/genetics/EXTRACTION-GUIDE.md`

---

**Status:** 📋 Ready to implement  
**Approval needed:** Yes (automated scraping requires user consent)  
**Estimated completion:** 1-2 weeks

---

**Built with ❤️ and 🐍**
