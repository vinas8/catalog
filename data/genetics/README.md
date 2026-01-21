# Ball Python Genetics Database

## 📊 Database Files

### 🎯 Primary Database (Use This!)
**`morphs-comprehensive.json`** - **66 morphs** (v3.0.0)
- **50 base morphs** from morphs.json
- **20 expanded morphs** from morphs-expanded.json  
- **New morphs** with full genetic data
- ✅ Recommended for production use

### 📚 Legacy Files
- **`morphs.json`** - Original 50 morphs (v1.0.0)
- **`morphs-expanded.json`** - Additional 20 morphs (v2.0.0)

### 📋 Reference Data
- **`health-risks.json`** - Health risk categories and scoring
- **`lethal-combos.json`** - Known lethal breeding combinations
- **`gene-types.json`** - Gene type definitions

## 📈 Statistics

```json
{
  "total_morphs": 66,
  "gene_types": {
    "dominant": 6,
    "co-dominant": 32,
    "recessive": 22,
    "incomplete-dominant": 6
  },
  "health_risks": {
    "high": 2,
    "moderate": 3,
    "low": 4,
    "none": 57
  }
}
```

## 🔍 Morph Categories

### High Health Risk (2)
- **Spider** - Neurological wobble in most specimens
- **Hidden Gene Woma (HGW)** - Similar wobble issues

### Moderate Health Risk (3)
- **Champagne** - Wobble in some specimens
- **Cinnamon** (Super) - Head wobble reported
- **Scaleless** - Dehydration & skin injury risks

### Popular Designer Combos
- **Banana Pastel** (co-dom + co-dom)
- **Mojave Lesser** (Blue Eyed Leucistic)
- **Piebald Albino** (recessive + recessive)

## 🧬 Genetic Types Explained

**Dominant (6 morphs)**
- Single copy shows visual trait
- No super form or lethal super
- Examples: Spider, Pinstripe, Spotnose

**Co-Dominant (32 morphs)**
- Single copy shows trait (het form)
- Two copies = super form
- Examples: Banana, Pastel, Mojave, Lesser

**Recessive (22 morphs)**
- Two copies needed for visual
- Single copy = het (hidden carrier)
- Examples: Piebald, Albino, Clown, Ghost

## ⚠️ Lethal Combinations

❌ **Never Breed:**
- Lesser × Butter = Lethal super
- Spider × Spider = No viable super
- HGW × HGW = No viable super

✅ **Safe BEL Combos:**
- Mojave × Lesser = Blue Eyed Leucistic
- Butter × Russo = Blue Eyed Leucistic

## 📖 Data Sources

- **Primary:** [World of Ball Pythons](https://www.worldofballpythons.com/morphs/)
- **Verification:** MorphMarket price data
- **Extraction:** Manual ethical review (see EXTRACTION-GUIDE.md)
- **Last Updated:** 2026-01-20

## 🔄 How to Use

### In Breeding Calculator
```javascript
import { loadGeneticsDatabase } from './src/modules/breeding/genetics-core.js';

// Load comprehensive database (66 morphs)
const data = await loadGeneticsDatabase(false);  
console.log(`Loaded ${data.morph_count} morphs`);
```

### Direct Access
```javascript
const response = await fetch('/data/genetics/morphs-comprehensive.json');
const db = await response.json();

// Find specific morph
const banana = db.morphs.find(m => m.id === 'banana');

// Filter by gene type
const recessives = db.morphs.filter(m => m.gene_type === 'recessive');

// Check health risks
const risky = db.morphs.filter(m => m.health_risk !== 'none');
```

## 📝 Schema

```typescript
interface Morph {
  id: string;                    // Unique slug
  name: string;                  // Display name
  aliases?: string[];            // Alternative names
  gene_type: "dominant" | "co-dominant" | "recessive" | "incomplete-dominant";
  super_form?: string;           // Name of super form (co-dom only)
  market_value_usd: number;      // Typical market price
  rarity: "common" | "uncommon" | "rare" | "very_rare";
  health_risk: "none" | "low" | "moderate" | "high";
  health_issues: string[];       // Documented health concerns
  breeding_notes?: string;       // Important breeding info
  source_url: string;            // WOBP reference URL
  fetched_at: string;            // ISO 8601 timestamp
}
```

## 🛠️ Maintenance

To add new morphs:
1. Follow **EXTRACTION-GUIDE.md** ethical guidelines
2. Add to `morphs-comprehensive.json`
3. Update `morph_count` field
4. Run validation: `jq empty morphs-comprehensive.json`
5. Test in breeding calculator
6. Commit with descriptive message

## ✅ Ethics Statement

All data extracted following ethical guidelines:
- ✅ Factual information only
- ✅ Manual review process
- ✅ Source attribution
- ✅ No verbatim copying
- ✅ Respects robots.txt
- ✅ Educational use only

