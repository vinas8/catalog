# Snake Data & Genetics Calculator Research

## Goal
Build Snake Dex + Morph Calculator with LEGAL data sources

## Data Needed
1. **Snake Species Info**
   - Common names
   - Scientific names
   - Care requirements
   - Size, lifespan, temperament
   - Images (public domain)

2. **Ball Python Morphs**
   - Morph names
   - Genetics (dominant, recessive, co-dominant)
   - Visual traits
   - Breeding outcomes

3. **Genetics Calculator Logic**
   - Punnett square calculations
   - Morph inheritance patterns
   - Probability calculations

---

## Legal Data Sources

### 1. iNaturalist API
- **URL:** https://api.inaturalist.org/
- **Data:** Species observations, photos, taxonomy
- **License:** CC BY / CC0 depending on user
- **Good for:** Species info, images

### 2. GBIF (Global Biodiversity Info)
- **URL:** https://www.gbif.org/
- **Data:** Species occurrence data
- **License:** Open data
- **Good for:** Scientific data, distribution

### 3. Wikipedia/Wikidata
- **Data:** Species articles, images
- **License:** CC BY-SA (attributed)
- **Good for:** Care sheets, general info

### 4. Reptile Database
- **URL:** http://www.reptile-database.org/
- **Data:** Comprehensive reptile taxonomy
- **License:** Free for non-commercial use (check)
- **Good for:** Scientific names, taxonomy

---

## GitHub Projects to Check

### Search Terms:
- "ball python genetics"
- "reptile genetics calculator"
- "morph calculator"
- "snake breeding calculator"
- "punnett square calculator"

### Expected Finds:
- Genetics calculation algorithms
- Morph databases (JSON/CSV)
- Calculator implementations
- Data structures for morphs

---

## Implementation Plan

### Phase 1: Research
- [ ] Search GitHub for existing projects
- [ ] Check iNaturalist API capabilities
- [ ] Review Wikipedia reptile data
- [ ] Find CC0/public domain images

### Phase 2: Data Structure
```json
{
  "species": "Python regius",
  "common_name": "Ball Python",
  "morphs": [
    {
      "name": "Albino",
      "gene_type": "recessive",
      "description": "Lacks melanin",
      "traits": ["yellow", "white", "red eyes"]
    }
  ]
}
```

### Phase 3: Calculator Logic
- Implement Punnett squares
- Handle dominant/recessive/co-dominant
- Calculate offspring probabilities

### Phase 4: UI/UX
- Browse morphs gallery
- Interactive calculator
- Visual trait previews

---

## Next Steps
1. Search GitHub for projects
2. Check iNaturalist API
3. Create mock data structure
4. Build calculator prototype

---

## GitHub Search Results

**Search completed:** No existing ball python genetics calculators found
- Searched: "ball python genetics calculator" - 0 results
- Searched: "reptile morph calculator" - 0 results  
- Searched JSON morph data - Only unrelated results

**Conclusion:** We need to build from scratch ✅

---

## Recommended Approach

### Data Sources (100% Legal):

**1. iNaturalist API**
```bash
# Species data API
https://api.inaturalist.org/v1/taxa/26645  # Ball Python
```

**2. Wikipedia/Wikidata**
- Ball Python morphs articles
- Care guides
- CC BY-SA licensed

**3. Create Our Own Database**
Start with common morphs:
- Normal
- Albino
- Piebald
- Pastel
- Mojave
- etc.

---

## SMRI Plan: Snake Dex + Genetics Calculator

### Phase 1: Data Structure (Week 1)
```javascript
// data/ball-python-morphs.json
{
  "morphs": [
    {
      "id": "albino",
      "name": "Albino",
      "gene_type": "recessive",
      "description": "Lacks melanin, yellow/white coloration",
      "traits": ["no_black", "red_eyes", "yellow_body"],
      "rarity": "common"
    }
  ]
}
```

### Phase 2: Calculator Logic (Week 1-2)
- Punnett square algorithm
- Probability calculations
- Handle dominant/recessive/co-dominant
- Visual trait predictions

### Phase 3: UI/UX (Week 2)
- Dex gallery with filters
- Interactive calculator
- Breeding simulator
- Results visualization

### Phase 4: Integration (Week 2)
- Add to existing dex.html
- Link from navigation
- Save breeding history

---

## Next Action Items

- [ ] Create ball-python-morphs.json with 10-20 common morphs
- [ ] Build genetics calculator engine
- [ ] Design calculator UI mockup
- [ ] Integrate with current dex page
- [ ] Test breeding combinations

**Ready to start building!** 🐍
