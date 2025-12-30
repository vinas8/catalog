# 🧬 Genetics Calculator Code Analysis

## Files Analyzed:
1. **snake-game/Genetics.js** (11KB) - Full breeding simulation
2. **punnett-square.js** (726 bytes) - Simple Punnett square

---

## 🎯 Key Learnings

### 1. **Punnett Square Algorithm** (Simple Version)

```javascript
// From punnett-square.js
cross(mom, dad) {
  const square = [];
  _.each(mom, (momTrait) => {
    _.each(dad, (dadTrait) => {
      square.push([momTrait, dadTrait]);
    });
  });
  return square;
}
```

**What it does:**
- Takes mom alleles: `['A', 'a']`
- Takes dad alleles: `['A', 'a']`
- Creates all combos: `[['A','A'], ['A','a'], ['a','A'], ['a','a']]`
- Result: 25% AA, 50% Aa, 25% aa

**Perfect for us!** Simple & clean ✅

---

### 2. **Snake Game Breeding Engine** (Advanced)

```javascript
// Genotype structure
genotype = {
  'albino': ['+', '+'],      // Wild type (normal)
  'hypo': ['hypo', '+'],     // Heterozygous
  'anaconda': ['ana', 'ana'] // Homozygous (visual)
}

// Breeding logic
for (const geneId of allGenes) {
  const p1Alleles = parent1.genotype[geneId];
  const p2Alleles = parent2.genotype[geneId];
  
  // Pick random allele from each parent
  const allele1 = p1Alleles[random(0,1)];
  const allele2 = p2Alleles[random(0,1)];
  
  childGenotype[geneId] = [allele1, allele2];
}
```

**Key Features:**
- ✅ Multiple genes per snake
- ✅ Inheritance types (recessive, dominant, co-dominant)
- ✅ Heterozygous vs homozygous
- ✅ Species-specific genes
- ✅ Clutch size simulation

---

## 🏗️ Our Implementation Plan

### Data Structure:

```javascript
// Ball Python Morph Data
{
  "genes": {
    "albino": {
      "name": "Albino",
      "inheritance": "recessive",
      "visual_traits": ["yellow", "white", "red_eyes"],
      "rarity": "common"
    },
    "piebald": {
      "name": "Piebald",
      "inheritance": "recessive",
      "visual_traits": ["white_patches", "irregular_pattern"],
      "rarity": "uncommon"
    },
    "pastel": {
      "name": "Pastel",
      "inheritance": "co-dominant",
      "visual_traits": ["bright_yellow", "reduced_black"],
      "rarity": "common"
    }
  }
}
```

### Calculator Logic:

```javascript
class MorphCalculator {
  // Calculate offspring from 2 parents
  calculate(parent1Morph, parent2Morph) {
    const results = {};
    
    // For each gene
    for (const gene of allGenes) {
      const p1 = parent1Morph[gene] || ['+', '+'];
      const p2 = parent2Morph[gene] || ['+', '+'];
      
      // Generate Punnett square
      const combos = this.punnettSquare(p1, p2);
      
      // Count percentages
      combos.forEach(combo => {
        const phenotype = this.getPhenotype(combo, gene);
        results[phenotype] = (results[phenotype] || 0) + 25;
      });
    }
    
    return results;
  }
  
  punnettSquare(alleles1, alleles2) {
    return [
      [alleles1[0], alleles2[0]],
      [alleles1[0], alleles2[1]],
      [alleles1[1], alleles2[0]],
      [alleles1[1], alleles2[1]]
    ];
  }
}
```

---

## 🎨 UI Design (Inspired by MorphMarket)

### Layout:
```
┌─────────────────────────────────────┐
│     🧬 Ball Python Genetics         │
├─────────────────────────────────────┤
│                                     │
│  Parent 1         Parent 2          │
│  ┌────────┐      ┌────────┐        │
│  │ Normal │  ×   │ Albino │        │
│  │  🐍    │      │  🐍    │        │
│  └────────┘      └────────┘        │
│                                     │
│         [Calculate] 🧮              │
│                                     │
├─────────────────────────────────────┤
│  Possible Offspring:                │
│                                     │
│  ⚪ Normal (Het Albino)    50%     │
│  🟡 Albino                 50%     │
│                                     │
│  📊 Punnett Square:                │
│     ┌─────┬─────┐                  │
│     │ +A  │ +A  │  50% Het         │
│     ├─────┼─────┤                  │
│     │ AA  │ AA  │  50% Visual      │
│     └─────┴─────┘                  │
└─────────────────────────────────────┘
```

---

## ✅ What We Learned:

### 1. **Punnett Square is Simple!**
   - Just nested loops
   - 4 combinations for 2 alleles
   - Count & calculate percentages

### 2. **Genetics Engine Structure:**
   - Genotype: `{ gene: [allele1, allele2] }`
   - Wild type: `['+', '+']`
   - Het: `['gene', '+']`
   - Homo: `['gene', 'gene']`

### 3. **Inheritance Types:**
   - **Recessive:** Need 2 copies to show (aa)
   - **Dominant:** 1 copy shows (Aa or AA)
   - **Co-dominant:** Both show blended (Aa ≠ AA)

### 4. **Ball Python Specific:**
   - Co-dominant morphs are common
   - Multiple genes = combo morphs
   - Need to handle super forms

---

## 📝 Next Steps:

### Phase 1: Data (Today)
- [ ] Create `ball-python-morphs.json`
- [ ] Add 10-20 common morphs
- [ ] Define inheritance patterns

### Phase 2: Calculator (Today)
- [ ] Implement Punnett square function
- [ ] Handle inheritance types
- [ ] Calculate percentages
- [ ] Handle combos

### Phase 3: UI (Tomorrow)
- [ ] Parent selection dropdowns
- [ ] Results display
- [ ] Visual trait badges
- [ ] Save calculations

---

## 🎯 Code We'll Use:

**From punnett-square.js:**
- ✅ Simple cross() logic
- ✅ Clean structure

**From snake-game:**
- ✅ Genotype data structure
- ✅ Inheritance types
- ✅ Multiple gene handling

**Our additions:**
- ✅ Ball python specific morphs
- ✅ Material Design UI
- ✅ Visual trait display
- ✅ Combo morph names

---

**Status:** Ready to build! 🚀
**Time estimate:** 4-6 hours for MVP
**Complexity:** Medium (we have great examples!)
