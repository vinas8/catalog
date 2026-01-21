// Breeding Calculator - Core Genetics Engine
// Phase 2: Advanced genetics with CoI, diversity, heterozygosity, health risks
// Extracted from debug/calc/app.js for reuse in farm and debug tools

// ============================================================================
// GENETICS DATABASE LOADER
// ============================================================================

let morphsData = null;
let healthRisksData = null;
let lethalCombosData = null;
let morphMap = new Map();
let morphValueMap = new Map();
let healthRiskMap = new Map();

export async function loadGeneticsDatabase(useExpandedData = true) {
  try {
    const basePath = window.APP_BASE_PATH || '';
    
    // Load morphs database (use comprehensive v3.0 with 66+ morphs!)
    const morphFile = useExpandedData 
      ? `${basePath}/data/genetics/morphs-comprehensive.json`  // v3.0 - 66 morphs
      : `${basePath}/data/genetics/morphs.json`;               // v1.0 - 50 morphs (legacy)
    
    console.log('📂 Fetching:', morphFile);
    const morphsResponse = await fetch(morphFile);
    
    if (!morphsResponse.ok) {
      throw new Error(`Failed to fetch ${morphFile}: ${morphsResponse.status} ${morphsResponse.statusText}`);
    }
    
    morphsData = await morphsResponse.json();
    
    // Load health risks
    const healthFile = `${basePath}/data/genetics/health-risks.json`;
    console.log('📂 Fetching:', healthFile);
    const healthResponse = await fetch(healthFile);
    if (healthResponse.ok) {
      healthRisksData = await healthResponse.json();
    }
    
    // Load lethal combos
    const lethalFile = `${basePath}/data/genetics/lethal-combos.json`;
    console.log('📂 Fetching:', lethalFile);
    const lethalResponse = await fetch(lethalFile);
    if (lethalResponse.ok) {
      lethalCombosData = await lethalResponse.json();
    }
    
    // Build lookup maps from base morphs
    morphsData.morphs.forEach(morph => {
      morphMap.set(morph.id, morph);
      const value = morph.market_value_usd?.median || morph.market_value_usd || 200;
      morphValueMap.set(morph.id, value);
      healthRiskMap.set(morph.id, morph.health_risk || 'NONE');
    });
    
    // Add popular combos to lookup if available
    if (morphsData.popular_combos) {
      morphsData.popular_combos.forEach(combo => {
        morphMap.set(combo.id, combo);
        morphValueMap.set(combo.id, combo.market_value_usd || 300);
        healthRiskMap.set(combo.id, combo.health_risk || 'NONE');
      });
    }
    
    const baseCount = morphsData.morphs.length;
    const comboCount = morphsData.popular_combos?.length || 0;
    console.log(`✅ Loaded ${baseCount} morphs + ${comboCount} combos from genetics database v${morphsData.version}`);
    
    return morphsData; // Return the actual data
  } catch (error) {
    console.error('❌ Failed to load genetics database:', error.message);
    console.error('   Full error:', error);
    return null;
  }
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export function getMorphValue(morphId) {
  if (morphValueMap.has(morphId)) {
    return morphValueMap.get(morphId);
  }
  // Fallback values
  const fallbackValues = {
    'banana': 150, 'spider': 100, 'piebald': 300, 'mojave': 150,
    'pastel': 75, 'lesser': 100, 'albino': 300, 'clown': 250,
    'champagne': 200, 'hidden-gene-woma': 400, 'super-pastel': 150,
    'blue-eyed-leucistic': 500
  };
  return fallbackValues[morphId] || 200;
}

export function getHealthRisk(morphId) {
  if (healthRiskMap.has(morphId)) {
    return healthRiskMap.get(morphId);
  }
  // Fallback health risks
  const fallbackRisks = {
    'spider': 'HIGH', 'hidden-gene-woma': 'HIGH', 'super-champagne': 'HIGH',
    'champagne': 'MODERATE', 'super-cinnamon': 'MODERATE',
    'super-banana': 'LOW', 'super-black-pastel': 'LOW'
  };
  return fallbackRisks[morphId] || 'NONE';
}

export function checkLethalCombo(morph1, morph2) {
  if (!lethalCombosData) {
    // Fallback lethal combos
    const lethals = [
      { m1: 'lesser', m2: 'butter', result: 'Fatal' },
      { m1: 'spider', m2: 'spider', result: 'No viable super' },
      { m1: 'hidden-gene-woma', m2: 'hidden-gene-woma', result: 'No viable super' }
    ];
    for (let combo of lethals) {
      if ((combo.m1 === morph1 && combo.m2 === morph2) ||
          (combo.m1 === morph2 && combo.m2 === morph1)) {
        return combo.result;
      }
    }
    return null;
  }
  
  for (let combo of lethalCombosData.lethal_combinations) {
    if ((combo.morph1 === morph1 && combo.morph2 === morph2) ||
        (combo.morph1 === morph2 && combo.morph2 === morph1)) {
      return combo.result;
    }
  }
  return null;
}

// ============================================================================
// PHASE 2: ADVANCED GENETICS CALCULATIONS
// ============================================================================

// Wright's Coefficient of Inbreeding
export function calculateInbreedingCoefficient(male, female, generations = 5) {
  const visited = new Set();
  const commonAncestors = [];
  
  function getAncestors(snake, depth) {
    if (depth === 0 || !snake.lineage) return [];
    const ancestors = [];
    
    if (snake.lineage.parent_male_id) {
      const id = snake.lineage.parent_male_id;
      if (!visited.has(id)) {
        visited.add(id);
        ancestors.push({ id, depth });
      }
    }
    
    if (snake.lineage.parent_female_id) {
      const id = snake.lineage.parent_female_id;
      if (!visited.has(id)) {
        visited.add(id);
        ancestors.push({ id, depth });
      }
    }
    
    return ancestors;
  }
  
  const maleAncestors = getAncestors(male, generations);
  visited.clear();
  const femaleAncestors = getAncestors(female, generations);
  
  for (let ma of maleAncestors) {
    for (let fa of femaleAncestors) {
      if (ma.id === fa.id) {
        commonAncestors.push({ id: ma.id, n1: ma.depth, n2: fa.depth });
      }
    }
  }
  
  let coi = 0;
  for (let ancestor of commonAncestors) {
    coi += Math.pow(0.5, ancestor.n1 + ancestor.n2 + 1);
  }
  
  return coi;
}

// Genetic Diversity Score
export function calculateGeneticDiversity(male, female) {
  const maleAlleles = new Set(Object.keys(male.genetics?.alleles || {}));
  const femaleAlleles = new Set(Object.keys(female.genetics?.alleles || {}));
  
  const totalAlleles = new Set([...maleAlleles, ...femaleAlleles]);
  const sharedAlleles = new Set([...maleAlleles].filter(a => femaleAlleles.has(a)));
  
  if (totalAlleles.size === 0) return 100;
  
  const diversity = ((totalAlleles.size - sharedAlleles.size) / totalAlleles.size) * 100;
  return Math.round(diversity);
}

// Heterozygosity Calculation
export function calculateHeterozygosity(male, female) {
  const maleAlleles = male.genetics?.alleles || {};
  const femaleAlleles = female.genetics?.alleles || {};
  
  const allGenes = new Set([...Object.keys(maleAlleles), ...Object.keys(femaleAlleles)]);
  let hetCount = 0;
  
  for (let gene of allGenes) {
    const m = maleAlleles[gene] || [];
    const f = femaleAlleles[gene] || [];
    
    if (m.length > 0 && f.length > 0 && m[0] !== f[0]) {
      hetCount++;
    }
  }
  
  if (allGenes.size === 0) return 0;
  
  const heterozygosity = (hetCount / allGenes.size) * 100;
  return Math.round(heterozygosity);
}

// Health Risk Assessment
export function assessHealthRisk(male, female) {
  const allMorphs = [
    ...(male.morphs || []),
    ...(female.morphs || [])
  ];
  
  let maxRisk = 'NONE';
  let riskCount = 0;
  
  for (let morph of allMorphs) {
    const risk = getHealthRisk(morph);
    if (risk === 'HIGH') {
      maxRisk = 'HIGH';
      riskCount++;
    } else if (risk === 'MODERATE' && maxRisk !== 'HIGH') {
      maxRisk = 'MODERATE';
      riskCount++;
    } else if (risk === 'LOW' && maxRisk === 'NONE') {
      maxRisk = 'LOW';
      riskCount++;
    }
  }
  
  return { level: maxRisk, count: riskCount };
}

// ============================================================================
// OFFSPRING CALCULATOR (PUNNETT SQUARE LOGIC)
// ============================================================================

export function calculateOffspring(male, female) {
  const outcomes = [];
  
  // Check for lethal combinations
  for (let mMorph of male.morphs || []) {
    for (let fMorph of female.morphs || []) {
      const lethal = checkLethalCombo(mMorph, fMorph);
      if (lethal) {
        outcomes.push({
          morph: `${mMorph} × ${fMorph}`,
          percentage: 0,
          count: 0,
          value: 0,
          lethal: true,
          description: lethal
        });
        return outcomes;
      }
    }
  }
  
  // BEL complex (Mojave × Lesser = 25% BEL)
  const hasMojave = (male.morphs?.includes('mojave') || female.morphs?.includes('mojave'));
  const hasLesser = (male.morphs?.includes('lesser') || female.morphs?.includes('lesser'));
  
  if (hasMojave && hasLesser) {
    outcomes.push(
      { morph: 'Blue Eyed Leucistic', percentage: 25, count: 1, value: getMorphValue('blue-eyed-leucistic') },
      { morph: 'Mojave', percentage: 25, count: 1, value: getMorphValue('mojave') },
      { morph: 'Lesser', percentage: 25, count: 1, value: getMorphValue('lesser') },
      { morph: 'Normal', percentage: 25, count: 1, value: 50 }
    );
    return outcomes;
  }
  
  // Dominant gene (Spider, HGW) = 50% show trait
  const dominantMorphs = ['spider', 'hidden-gene-woma'];
  for (let morph of dominantMorphs) {
    if (male.morphs?.includes(morph) || female.morphs?.includes(morph)) {
      outcomes.push(
        { morph: morph.charAt(0).toUpperCase() + morph.slice(1), percentage: 50, count: 2, value: getMorphValue(morph) },
        { morph: 'Normal', percentage: 50, count: 2, value: 50 }
      );
      return outcomes;
    }
  }
  
  // Recessive × same recessive = 100% visual
  const recessiveMorphs = ['piebald', 'albino', 'clown'];
  for (let morph of recessiveMorphs) {
    if (male.morphs?.includes(morph) && female.morphs?.includes(morph)) {
      outcomes.push({
        morph: morph.charAt(0).toUpperCase() + morph.slice(1),
        percentage: 100,
        count: 4,
        value: getMorphValue(morph)
      });
      return outcomes;
    }
  }
  
  // Different morphs = mix
  const maleMorph = male.morphs?.[0] || 'Normal';
  const femaleMorph = female.morphs?.[0] || 'Normal';
  
  if (maleMorph !== femaleMorph) {
    outcomes.push({
      morph: `${maleMorph} Mix`,
      percentage: 100,
      count: 4,
      value: (getMorphValue(maleMorph) + getMorphValue(femaleMorph)) / 2
    });
  } else {
    outcomes.push({
      morph: maleMorph,
      percentage: 100,
      count: 4,
      value: getMorphValue(maleMorph)
    });
  }
  
  return outcomes;
}

// ============================================================================
// COMPATIBILITY SCORING (10 FACTORS - PHASE 2)
// ============================================================================

export function calculateCompatibility(male, female) {
  let score = 100;
  const factors = [];
  
  // Factor 1: Lethal genetics
  for (let mMorph of male.morphs || []) {
    for (let fMorph of female.morphs || []) {
      const lethal = checkLethalCombo(mMorph, fMorph);
      if (lethal) {
        score = 0;
        factors.push({ name: 'Lethal Combination', score: -100, detail: lethal });
        return { score: 0, factors };
      }
    }
  }
  
  // Factor 2: Inbreeding Coefficient
  const coi = calculateInbreedingCoefficient(male, female);
  if (coi > 0.25) {
    score -= 60;
    factors.push({ name: 'Inbreeding (Very High)', score: -60, detail: `CoI: ${(coi * 100).toFixed(1)}%` });
  } else if (coi > 0.125) {
    score -= 30;
    factors.push({ name: 'Inbreeding (High)', score: -30, detail: `CoI: ${(coi * 100).toFixed(1)}%` });
  } else if (coi > 0.0625) {
    score -= 15;
    factors.push({ name: 'Inbreeding (Moderate)', score: -15, detail: `CoI: ${(coi * 100).toFixed(1)}%` });
  } else if (coi > 0) {
    factors.push({ name: 'Inbreeding (Low)', score: 0, detail: `CoI: ${(coi * 100).toFixed(1)}%` });
  }
  
  // Factor 3: Health risks
  const healthRisk = assessHealthRisk(male, female);
  if (healthRisk.level === 'HIGH') {
    score -= 40;
    factors.push({ name: 'Health Risk (High)', score: -40, detail: `${healthRisk.count} high-risk morphs` });
  } else if (healthRisk.level === 'MODERATE') {
    score -= 20;
    factors.push({ name: 'Health Risk (Moderate)', score: -20, detail: `${healthRisk.count} moderate-risk morphs` });
  } else if (healthRisk.level === 'LOW') {
    score -= 5;
    factors.push({ name: 'Health Risk (Low)', score: -5, detail: `${healthRisk.count} low-risk morphs` });
  }
  
  // Factor 4: Age compatibility
  if (male.age < 2 || female.age < 2) {
    score -= 15;
    factors.push({ name: 'Age (Too Young)', score: -15, detail: 'Under 2 years' });
  } else if (female.age > 10) {
    score -= 10;
    factors.push({ name: 'Age (Older Female)', score: -10, detail: 'Female over 10 years' });
  } else if (male.age > 15 || female.age > 15) {
    score -= 5;
    factors.push({ name: 'Age (Senior)', score: -5, detail: 'Over 15 years' });
  }
  
  // Factor 5: Size/weight compatibility
  const weightDiff = Math.abs(male.weight - female.weight);
  if (weightDiff > 800) {
    score -= 25;
    factors.push({ name: 'Size Mismatch (Large)', score: -25, detail: `${weightDiff}g difference` });
  } else if (weightDiff > 500) {
    score -= 15;
    factors.push({ name: 'Size Mismatch (Moderate)', score: -15, detail: `${weightDiff}g difference` });
  }
  
  if (female.weight < 1200) {
    score -= 20;
    factors.push({ name: 'Female Underweight', score: -20, detail: `${female.weight}g (min 1200g)` });
  }
  
  // Factor 6: Genetic diversity bonus
  const diversity = calculateGeneticDiversity(male, female);
  if (diversity > 80) {
    score += 15;
    factors.push({ name: 'High Genetic Diversity', score: 15, detail: `${diversity}%` });
  } else if (diversity > 60) {
    score += 8;
    factors.push({ name: 'Good Genetic Diversity', score: 8, detail: `${diversity}%` });
  }
  
  // Factor 7: Heterozygosity bonus
  const heterozygosity = calculateHeterozygosity(male, female);
  if (heterozygosity > 70) {
    score += 10;
    factors.push({ name: 'High Heterozygosity', score: 10, detail: `${heterozygosity}%` });
  }
  
  // Factor 8: Offspring value
  const offspring = calculateOffspring(male, female);
  const avgValue = offspring.reduce((sum, o) => sum + (o.value * o.percentage / 100), 0);
  
  if (avgValue > 400) {
    score += 20;
    factors.push({ name: 'High Offspring Value', score: 20, detail: `Avg $${Math.round(avgValue)}` });
  } else if (avgValue > 200) {
    score += 10;
    factors.push({ name: 'Good Offspring Value', score: 10, detail: `Avg $${Math.round(avgValue)}` });
  } else if (avgValue < 100) {
    score -= 5;
    factors.push({ name: 'Low Offspring Value', score: -5, detail: `Avg $${Math.round(avgValue)}` });
  }
  
  // Factor 9: Rare morph potential
  const rareChance = offspring.filter(o => o.value > 300).reduce((sum, o) => sum + o.percentage, 0);
  if (rareChance > 25) {
    score += 15;
    factors.push({ name: 'Rare Morph Potential', score: 15, detail: `${rareChance}% chance` });
  }
  
  // Cap score 0-100
  score = Math.max(0, Math.min(100, score));
  
  return { score, factors };
}
