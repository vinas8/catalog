
---

## 🔬 Deep Dive: Professional Breeding Formula (Research-Based)

**Last Research Update:** 2026-01-04  
**Sources:** Ball python breeding guides, reptile genetics literature, professional breeder practices

### Complete Compatibility Score Algorithm

```javascript
function calculateAdvancedCompatibility(male, female, allSnakes = []) {
  let score = 100;
  let penalties = [];
  let bonuses = [];
  
  // ═══════════════════════════════════════════════════════
  // CRITICAL FACTORS (Can disqualify pairing)
  // ═══════════════════════════════════════════════════════
  
  // 1. LETHAL GENETICS (-100, instant fail)
  if (isLethalCombo(male.morphs, female.morphs)) {
    return {
      score: 0,
      risk: 'FATAL',
      breed: false,
      reason: 'Lethal gene combination',
      warnings: ['Super Spider/Champagne = embryonic death or severe defects']
    };
  }
  
  // 2. INBREEDING COEFFICIENT (Wright's Coefficient of Inbreeding)
  const CoI = calculateInbreedingCoefficient(male, female, allSnakes);
  if (CoI > 0.25) {
    score -= 60;
    penalties.push(`Severe inbreeding: CoI=${(CoI*100).toFixed(1)}% (>25% threshold)`);
  } else if (CoI > 0.125) {
    score -= 30;
    penalties.push(`Moderate inbreeding: CoI=${(CoI*100).toFixed(1)}% (12.5-25%)`);
  } else if (CoI > 0.0625) {
    score -= 15;
    penalties.push(`Mild inbreeding: CoI=${(CoI*100).toFixed(1)}% (6.25-12.5%)`);
  }
  
  // 3. MORPH-SPECIFIC HEALTH RISKS
  const healthRisk = assessMorphHealthRisk(male.morphs, female.morphs);
  if (healthRisk.severity === 'HIGH') {
    score -= 40;
    penalties.push(healthRisk.reason);
  } else if (healthRisk.severity === 'MODERATE') {
    score -= 20;
    penalties.push(healthRisk.reason);
  }
  
  // ═══════════════════════════════════════════════════════
  // PHYSICAL COMPATIBILITY
  // ═══════════════════════════════════════════════════════
  
  // 4. AGE COMPATIBILITY
  if (male.age < 2 || female.age < 2) {
    score -= 15;
    penalties.push('Snake(s) under 2 years old (sexual maturity risk)');
  }
  if (female.age > 10) {
    score -= 10;
    penalties.push('Female over 10 years (reduced fertility)');
  }
  if (male.age > 15 || female.age > 15) {
    score -= 5;
    penalties.push('Advanced age (breeding decline)');
  }
  
  // 5. SIZE COMPATIBILITY (Critical for female safety)
  const weightRatio = male.weight / female.weight;
  const weightDiff = Math.abs(male.weight - female.weight);
  
  if (weightDiff > 800) {
    score -= 25;
    penalties.push(`Extreme size mismatch (${weightDiff}g difference)`);
  } else if (weightDiff > 500) {
    score -= 15;
    penalties.push(`Large size difference (${weightDiff}g)`);
  }
  
  if (female.weight < 1200) {
    score -= 20;
    penalties.push('Female under 1200g (egg-binding risk)');
  }
  
  if (weightRatio > 1.5) {
    score -= 10;
    penalties.push('Male significantly larger (breeding difficulty)');
  }
  
  // 6. BREEDING HISTORY
  if (female.clutches_produced > 5) {
    score -= 5;
    penalties.push('Female has 5+ clutches (reproductive exhaustion)');
  }
  
  if (female.last_clutch_date) {
    const monthsSinceLastClutch = calculateMonthsSince(female.last_clutch_date);
    if (monthsSinceLastClutch < 12) {
      score -= 15;
      penalties.push(`Only ${monthsSinceLastClutch} months since last clutch (< 12 mo recommended)`);
    }
  }
  
  // ═══════════════════════════════════════════════════════
  // GENETIC QUALITY & DIVERSITY
  // ═══════════════════════════════════════════════════════
  
  // 7. GENETIC DIVERSITY BONUS
  const diversityScore = calculateGeneticDiversity(male, female);
  if (diversityScore > 0.8) {
    score += 15;
    bonuses.push('Excellent genetic diversity (unrelated lines)');
  } else if (diversityScore > 0.6) {
    score += 8;
    bonuses.push('Good genetic diversity');
  }
  
  // 8. HETEROZYGOSITY ADVANTAGE
  const heterozygosity = calculateHeterozygosity(male.genetics, female.genetics);
  if (heterozygosity > 0.7) {
    score += 10;
    bonuses.push('High heterozygosity (hybrid vigor potential)');
  }
  
  // ═══════════════════════════════════════════════════════
  // ECONOMIC VALUE
  // ═══════════════════════════════════════════════════════
  
  // 9. OFFSPRING VALUE ESTIMATION
  const offspringData = calculateDetailedOffspring(male, female);
  const avgOffspringValue = offspringData.totalValue / offspringData.clutchSize;
  
  if (avgOffspringValue > 400) {
    score += 20;
    bonuses.push(`High-value offspring (avg $${avgOffspringValue}/snake)`);
  } else if (avgOffspringValue > 200) {
    score += 10;
    bonuses.push(`Good value offspring (avg $${avgOffspringValue}/snake)`);
  } else if (avgOffspringValue < 100) {
    score -= 5;
    penalties.push('Low market value offspring');
  }
  
  // 10. RARE MORPH POTENTIAL
  const rareMorphChance = calculateRareMorphProbability(male.genetics, female.genetics);
  if (rareMorphChance > 0.25) {
    score += 15;
    bonuses.push(`${(rareMorphChance*100).toFixed(0)}% chance of rare morph`);
  }
  
  // ═══════════════════════════════════════════════════════
  // FINAL CALCULATION
  // ═══════════════════════════════════════════════════════
  
  const finalScore = Math.max(0, Math.min(100, score));
  const risk = finalScore >= 80 ? 'EXCELLENT' : 
               finalScore >= 60 ? 'GOOD' : 
               finalScore >= 40 ? 'RISKY' : 'BAD';
  
  return {
    score: finalScore,
    risk,
    breed: finalScore >= 50,
    penalties,
    bonuses,
    metrics: {
      CoI,
      diversityScore,
      heterozygosity,
      avgOffspringValue,
      rareMorphChance
    },
    offspring: offspringData
  };
}
```

### Key Formulas Explained

#### 1. **Inbreeding Coefficient (CoI)** - Wright's Formula

```javascript
// CoI = Σ[(1/2)^n * (1 + F_A)]
// n = generations between mates and common ancestor
// F_A = inbreeding coefficient of common ancestor

function calculateInbreedingCoefficient(male, female, allSnakes) {
  let CoI = 0;
  
  // Find common ancestors (5 generations back)
  const maleAncestors = getAncestors(male, allSnakes, 5);
  const femaleAncestors = getAncestors(female, allSnakes, 5);
  
  const commonAncestors = maleAncestors.filter(a => 
    femaleAncestors.some(b => b.id === a.id)
  );
  
  if (commonAncestors.length === 0) return 0; // Unrelated
  
  commonAncestors.forEach(ancestor => {
    const pathMale = getGenerationsTo(male, ancestor, allSnakes);
    const pathFemale = getGenerationsTo(female, ancestor, allSnakes);
    const n = pathMale + pathFemale;
    
    // Simplified: assume F_A = 0
    CoI += Math.pow(0.5, n);
  });
  
  return CoI;
}

// Thresholds:
// 0%       → Unrelated (ideal)
// 6.25%    → Cousins (acceptable)
// 12.5%    → Half-siblings (caution)
// 25%      → Full siblings/parent-offspring (avoid)
// >25%     → Close inbreeding (severe risk)
```

#### 2. **Genetic Diversity Score**

```javascript
function calculateGeneticDiversity(male, female) {
  const uniqueMorphs = new Set([...male.morphs, ...female.morphs]).size;
  const totalMorphs = male.morphs.length + female.morphs.length;
  
  const diversity = uniqueMorphs / Math.max(totalMorphs, 1);
  
  // Lineage bonus: different bloodlines
  const lineageBonus = male.lineage_id !== female.lineage_id ? 1.2 : 0.8;
  
  return Math.min(1.0, diversity * lineageBonus);
}
```

#### 3. **Heterozygosity Index**

```javascript
function calculateHeterozygosity(maleGenetics, femaleGenetics) {
  let hetLoci = 0;
  let totalLoci = 0;
  
  const allGenes = ['albino', 'piebald', 'spider', 'pastel', 'mojave', 'lesser'];
  
  allGenes.forEach(gene => {
    const maleAllele = maleGenetics[gene] || 'wt';
    const femaleAllele = femaleGenetics[gene] || 'wt';
    
    if (maleAllele !== femaleAllele) hetLoci++;
    totalLoci++;
  });
  
  return hetLoci / totalLoci;
}
```

#### 4. **Morph Health Risk Database**

```javascript
const MORPH_HEALTH_DATABASE = {
  'spider': {
    risk: 'MODERATE',
    issues: ['Wobble syndrome (neurological)'],
    avoidWith: ['spider', 'woma', 'hidden_gene_woma', 'champagne']
  },
  'champagne': {
    risk: 'MODERATE',
    issues: ['Wobble, duck billing'],
    avoidWith: ['champagne', 'spider']
  },
  'spider_champagne': {
    risk: 'HIGH',
    issues: ['Compound neurological defects'],
    avoidWith: ['ALL']
  }
};

function assessMorphHealthRisk(maleMorphs, femaleMorphs) {
  let severity = 'NONE';
  let reasons = [];
  
  maleMorphs.forEach(mMorph => {
    femaleMorphs.forEach(fMorph => {
      if (MORPH_HEALTH_DATABASE[mMorph]) {
        const morphData = MORPH_HEALTH_DATABASE[mMorph];
        
        if (morphData.avoidWith.includes(fMorph) || 
            morphData.avoidWith.includes('ALL')) {
          severity = morphData.risk;
          reasons.push(`${mMorph} + ${fMorph}: ${morphData.issues.join(', ')}`);
        }
      }
    });
  });
  
  return { severity, reason: reasons.join('; ') };
}
```

---

## 📊 Scoring Thresholds (Research-Based)

| Category | Score | CoI | Health | Size | Age | Value/Snake |
|----------|-------|-----|--------|------|-----|-------------|
| **EXCELLENT** | 80-100 | <6.25% | No risk | F>1500g, diff<300g | 2-8 yrs | >$300 |
| **GOOD** | 60-79 | <12.5% | Minor | F>1200g, diff<500g | 2-10 yrs | >$150 |
| **RISKY** | 40-59 | <25% | Moderate | Mismatch | Young/old | >$75 |
| **BAD** | 0-39 | ≥25% | High/Lethal | Dangerous | Too young | Low |

---

## 📚 Research Sources

**Scientific Literature:**
- Wright's Coefficient of Inbreeding (1922) - Population genetics
- Reptile Genetics & Color Mutations - Bechtel & Bechtel (2020)
- Inbreeding Depression in Reptiles - Madsen et al. (1999)

**Professional Resources:**
- World of Ball Pythons - Morph calculator methodology
- NERD (New England Reptile Distributors) - Breeding guides
- MorphMarket - Market value data
- Ball Python Forums - Community best practices

**Health Studies:**
- Spider Wobble Syndrome - Veterinary research
- Neurological Issues in Designer Morphs - Reptile journals
- Egg Retention & Dystocia - Size/age studies

---

## 🎯 Implementation Phases

### Phase 1: Basic (✅ Complete)
- Lethal combo detection
- Age/size compatibility
- Simple offspring value
- Color-coded matrix

### Phase 2: Advanced (🚧 Next)
- **Inbreeding coefficient (CoI)**
- **Genetic diversity scoring**
- **Morph health risk database**
- **Detailed Punnett square**

### Phase 3: Professional
- Lineage tracking (5+ generations)
- Breeding history analysis
- Market value API
- Project planner

### Phase 4: AI/ML
- ML offspring prediction
- Market trend analysis
- Optimal pairing recommendations
- Portfolio optimization

---

**Updated:** 2026-01-04T18:26:00Z  
**Status:** Research complete, ready for Phase 2 implementation 🐍
