// 🧬 Breeding Calculator - Complete Phase 2 Implementation
// Based on .smri/docs/breeding-calculator/ specifications

// ============================================
// DEBUG CONSOLE
// ============================================
const debug = {
  log: (...args) => {
    const output = document.getElementById('debugOutput');
    const time = new Date().toLocaleTimeString();
    const msg = args.map(a => typeof a === 'object' ? JSON.stringify(a) : a).join(' ');
    output.innerHTML += `<div><span style="color:#64748b;">[${time}]</span> ${msg}</div>`;
    output.parentElement.scrollTop = output.parentElement.scrollHeight;
    console.log(...args);
  }
};

// ============================================
// GENETICS DATABASE LOADER
// ============================================
let GENETICS_DB = null;

async function loadGeneticsDatabase() {
  try {
    debug.log('🔄 Loading genetics database...');
    const [morphs, healthRisks, lethalCombos] = await Promise.all([
      fetch('/data/genetics/morphs.json').then(r => r.json()),
      fetch('/data/genetics/health-risks.json').then(r => r.json()),
      fetch('/data/genetics/lethal-combos.json').then(r => r.json())
    ]);
    
    GENETICS_DB = { morphs: morphs.morphs, healthRisks, lethalCombos };
    
    // Build lookups
    GENETICS_DB.morphMap = {};
    GENETICS_DB.morphs.forEach(m => { GENETICS_DB.morphMap[m.id] = m; });
    
    debug.log(`✅ Loaded ${GENETICS_DB.morphs.length} morphs from JSON`);
    return true;
  } catch (err) {
    debug.log(`⚠️  Failed to load JSON: ${err.message}, using fallback`);
    GENETICS_DB = { morphMap: {}, morphs: [], healthRisks: {}, lethalCombos: {} };
    return false;
  }
}

function getMorphValue(id) {
  return GENETICS_DB?.morphMap?.[id]?.market_value_usd || FALLBACK_VALUES[id] || 50;
}

function getHealthRisk(id) {
  const morph = GENETICS_DB?.morphMap?.[id];
  if (morph?.health_risk && morph.health_risk !== 'none') {
    return { risk: morph.health_risk.toUpperCase(), issues: morph.health_issues || [] };
  }
  return FALLBACK_HEALTH[id] || null;
}

function checkLethalCombo(morphs1, morphs2) {
  if (GENETICS_DB?.lethalCombos?.lethal_combinations) {
    for (const combo of GENETICS_DB.lethalCombos.lethal_combinations) {
      const has = (morphs1.includes(combo.morph1) && morphs2.includes(combo.morph2)) ||
                  (morphs1.includes(combo.morph2) && morphs2.includes(combo.morph1));
      if (has) return { reason: combo.description || combo.result };
    }
  }
  for (const combo of FALLBACK_LETHALS) {
    if (combo.morphs.every(m => morphs1.includes(m) && morphs2.includes(m))) {
      return { reason: combo.reason };
    }
  }
  return null;
}

// Fallback constants if JSON fails
const FALLBACK_VALUES = {
  normal: 50, albino: 300, spider: 150, piebald: 600, pastel: 150,
  mojave: 200, lesser: 200, banana: 150, clown: 250, champagne: 150
};

const FALLBACK_HEALTH = {
  spider: { risk: 'HIGH', issues: ['Neurological wobble'] },
  'hidden-gene-woma': { risk: 'HIGH', issues: ['Neurological wobble'] },
  champagne: { risk: 'MODERATE', issues: ['Wobble in some specimens'] }
};

const FALLBACK_LETHALS = [
  { morphs: ['spider', 'spider'], reason: 'Super Spider is lethal' },
  { morphs: ['lesser', 'butter'], reason: 'Lesser x Butter is lethal' }
];

// ============================================
// PHASE 2 GENETICS CALCULATIONS
// ============================================

function calculateInbreedingCoefficient(male, female, allSnakes) {
  let CoI = 0;
  const maleAnc = getAncestors(male, allSnakes, 5);
  const femaleAnc = getAncestors(female, allSnakes, 5);
  const commonAnc = maleAnc.filter(m => femaleAnc.some(f => f.id === m.id));
  
  commonAnc.forEach(ancestor => {
    const n1 = getGenerationsTo(male, ancestor, allSnakes);
    const n2 = getGenerationsTo(female, ancestor, allSnakes);
    if (n1 > 0 && n2 > 0) {
      CoI += Math.pow(0.5, n1 + n2 + 1);
    }
  });
  
  return CoI;
}

function getAncestors(snake, allSnakes, maxGen, currentGen = 0, visited = new Set()) {
  if (currentGen >= maxGen || !snake || visited.has(snake.id)) return [];
  visited.add(snake.id);
  let ancestors = [];
  
  if (snake.lineage) {
    const father = allSnakes.find(s => s.id === snake.lineage.parent_male_id);
    const mother = allSnakes.find(s => s.id === snake.lineage.parent_female_id);
    if (father) {
      ancestors.push(father);
      ancestors = ancestors.concat(getAncestors(father, allSnakes, maxGen, currentGen + 1, visited));
    }
    if (mother) {
      ancestors.push(mother);
      ancestors = ancestors.concat(getAncestors(mother, allSnakes, maxGen, currentGen + 1, visited));
    }
  }
  
  return ancestors;
}

function getGenerationsTo(snake, ancestor, allSnakes, depth = 0, visited = new Set()) {
  if (depth > 10 || visited.has(snake.id)) return -1;
  if (snake.id === ancestor.id) return 0;
  visited.add(snake.id);
  
  if (!snake.lineage) return -1;
  
  const father = allSnakes.find(s => s.id === snake.lineage.parent_male_id);
  const mother = allSnakes.find(s => s.id === snake.lineage.parent_female_id);
  
  let minGen = Infinity;
  if (father) {
    const fGen = getGenerationsTo(father, ancestor, allSnakes, depth + 1, visited);
    if (fGen >= 0) minGen = Math.min(minGen, fGen + 1);
  }
  if (mother) {
    const mGen = getGenerationsTo(mother, ancestor, allSnakes, depth + 1, visited);
    if (mGen >= 0) minGen = Math.min(minGen, mGen + 1);
  }
  
  return minGen === Infinity ? -1 : minGen;
}

function calculateGeneticDiversity(male, female) {
  if (!male.genetics?.alleles || !female.genetics?.alleles) return 0;
  const mAlleles = new Set(Object.values(male.genetics.alleles));
  const fAlleles = new Set(Object.values(female.genetics.alleles));
  const unique = new Set([...mAlleles, ...fAlleles]);
  const total = Math.max(mAlleles.size, fAlleles.size);
  return total > 0 ? unique.size / (total * 2) : 0;
}

function calculateHeterozygosity(male, female) {
  if (!male.genetics?.alleles || !female.genetics?.alleles) return 0;
  const genes = new Set([...Object.keys(male.genetics.alleles), ...Object.keys(female.genetics.alleles)]);
  let hetCount = 0;
  let totalGenes = 0;
  
  genes.forEach(gene => {
    const mAllele = male.genetics.alleles[gene] || 'wt';
    const fAllele = female.genetics.alleles[gene] || 'wt';
    totalGenes++;
    if (mAllele !== fAllele) hetCount++;
  });
  
  return totalGenes > 0 ? hetCount / totalGenes : 0;
}

function assessMorphHealthRisk(maleMorphs, femaleMorphs) {
  let severity = 'NONE';
  let reasons = [];
  
  maleMorphs.forEach(m => {
    femaleMorphs.forEach(f => {
      const health = getHealthRisk(m);
      if (health && health.risk !== 'NONE') {
        severity = health.risk;
        reasons.push(`${m} + ${f}: ${health.issues.join(', ')}`);
      }
    });
  });
  
  return { severity, reason: reasons.join('; ') };
}

// ============================================
// COMPATIBILITY SCORING (PHASE 2)
// ============================================

function calculateCompatibility(male, female, allSnakes) {
  let score = 100;
  let warnings = [];
  let bonuses = [];
  let metrics = {};
  
  // 1. LETHAL GENETICS
  const lethal = checkLethalCombo(male.morphs, female.morphs);
  if (lethal) {
    return { score: 0, risk: 'FATAL', breed: false, warnings: [lethal.reason], bonuses: [], outcomes: [], metrics: {} };
  }
  
  // 2. INBREEDING COEFFICIENT
  const CoI = calculateInbreedingCoefficient(male, female, allSnakes);
  metrics.CoI = CoI;
  if (CoI > 0.25) {
    score -= 60;
    warnings.push(`Severe inbreeding: ${(CoI*100).toFixed(1)}%`);
  } else if (CoI > 0.125) {
    score -= 30;
    warnings.push(`Moderate inbreeding: ${(CoI*100).toFixed(1)}%`);
  } else if (CoI > 0.0625) {
    score -= 15;
    warnings.push(`Mild inbreeding: ${(CoI*100).toFixed(1)}%`);
  }
  
  // 3. HEALTH RISKS
  const health = assessMorphHealthRisk(male.morphs, female.morphs);
  if (health.severity === 'HIGH') {
    score -= 40;
    warnings.push(health.reason);
  } else if (health.severity === 'MODERATE') {
    score -= 20;
    warnings.push(health.reason);
  }
  
  // 4. AGE
  if (male.age < 2 || female.age < 2) {
    score -= 15;
    warnings.push('Under 2 years (maturity risk)');
  }
  if (female.age > 10) {
    score -= 10;
    warnings.push('Female over 10 years');
  }
  
  // 5. SIZE
  const weightDiff = Math.abs(male.weight - female.weight);
  if (weightDiff > 800) {
    score -= 25;
    warnings.push(`Size mismatch: ${weightDiff}g`);
  } else if (weightDiff > 500) {
    score -= 15;
    warnings.push(`Size difference: ${weightDiff}g`);
  }
  if (female.weight < 1200) {
    score -= 20;
    warnings.push('Female under 1200g');
  }
  
  // 6. GENETIC DIVERSITY
  const diversity = calculateGeneticDiversity(male, female);
  metrics.diversity = diversity;
  if (diversity > 0.8) {
    score += 15;
    bonuses.push('Excellent genetic diversity');
  } else if (diversity > 0.6) {
    score += 8;
    bonuses.push('Good genetic diversity');
  }
  
  // 7. HETEROZYGOSITY
  const heterozygosity = calculateHeterozygosity(male, female);
  metrics.heterozygosity = heterozygosity;
  if (heterozygosity > 0.7) {
    score += 10;
    bonuses.push('High heterozygosity');
  }
  
  // 8. OFFSPRING VALUE
  const outcomes = calculateOffspring(male, female);
  let totalValue = 0;
  outcomes.forEach(o => { totalValue += o.count * o.value; });
  const avgValue = outcomes.length > 0 ? totalValue / outcomes.reduce((sum, o) => sum + o.count, 0) : 0;
  metrics.avgOffspringValue = avgValue;
  
  if (avgValue > 400) {
    score += 20;
    bonuses.push(`High-value offspring: $${avgValue.toFixed(0)}`);
  } else if (avgValue > 200) {
    score += 10;
    bonuses.push(`Good value: $${avgValue.toFixed(0)}`);
  } else if (avgValue < 100) {
    score -= 5;
    warnings.push('Low market value');
  }
  
  // 9. RARE MORPH CHANCE
  const rareChance = outcomes.filter(o => o.value > 400).reduce((sum, o) => sum + o.percentage, 0) / 100;
  if (rareChance > 0.25) {
    score += 15;
    bonuses.push(`${(rareChance*100).toFixed(0)}% rare morph chance`);
  }
  
  const finalScore = Math.max(0, Math.min(100, score));
  const risk = finalScore >= 80 ? 'EXCELLENT' : finalScore >= 60 ? 'GOOD' : finalScore >= 40 ? 'FAIR' : 'POOR';
  
  return { score: finalScore, risk, breed: finalScore >= 50, warnings, bonuses, outcomes, metrics };
}

function calculateOffspring(male, female) {
  const outcomes = [];
  
  // BEL complex (Mojave × Lesser)
  if (male.morphs.includes('mojave') && female.morphs.includes('lesser')) {
    outcomes.push({ morph: 'BEL', percentage: 25, count: 2, value: getMorphValue('blue_eyed_leucistic') || 800 });
    outcomes.push({ morph: 'Mojave', percentage: 25, count: 2, value: getMorphValue('mojave') });
    outcomes.push({ morph: 'Lesser', percentage: 25, count: 2, value: getMorphValue('lesser') });
    outcomes.push({ morph: 'Normal', percentage: 25, count: 2, value: getMorphValue('normal') });
  } 
  // Spider × any (dominant, no super)
  else if (male.morphs.includes('spider') || female.morphs.includes('spider')) {
    outcomes.push({ morph: 'Spider', percentage: 50, count: 4, value: getMorphValue('spider') });
    outcomes.push({ morph: 'Normal', percentage: 50, count: 4, value: getMorphValue('normal') });
  }
  // Recessive × recessive (same morph)
  else if (male.morphs[0] === female.morphs[0] && ['piebald', 'albino', 'clown'].includes(male.morphs[0])) {
    const morphName = male.morphs[0].charAt(0).toUpperCase() + male.morphs[0].slice(1);
    outcomes.push({ morph: morphName, percentage: 100, count: 8, value: getMorphValue(male.morphs[0]) });
  }
  // Co-dom × co-dom (different morphs)
  else if (male.morphs[0] !== female.morphs[0]) {
    const maleMorph = male.morphs[0].charAt(0).toUpperCase() + male.morphs[0].slice(1);
    const femaleMorph = female.morphs[0].charAt(0).toUpperCase() + female.morphs[0].slice(1);
    outcomes.push({ morph: `${maleMorph} Mix`, percentage: 50, count: 4, value: (getMorphValue(male.morphs[0]) + getMorphValue(female.morphs[0])) / 2 });
    outcomes.push({ morph: 'Normal', percentage: 50, count: 4, value: getMorphValue('normal') });
  }
  // Default
  else {
    const mainMorph = male.genetics?.visual?.[0] || 'normal';
    outcomes.push({ morph: mainMorph.charAt(0).toUpperCase() + mainMorph.slice(1), percentage: 50, count: 4, value: getMorphValue(mainMorph) });
    outcomes.push({ morph: 'Normal', percentage: 50, count: 4, value: getMorphValue('normal') });
  }
  
  return outcomes;
}

// ============================================
// MOCK DATA
// ============================================

const mockMales = [
  { id: 'm1', name: 'Zeus', sex: 'male', age: 3, weight: 1800, morphs: ['mojave'], genetics: { visual: ['mojave'], hets: [], alleles: { mojave: 'Moj', albino: 'wt' } }, lineage: {} },
  { id: 'm2', name: 'Rocky', sex: 'male', age: 4, weight: 2000, morphs: ['spider'], genetics: { visual: ['spider'], hets: [], alleles: { spider: 'Spd', mojave: 'wt' } }, lineage: {} },
  { id: 'm3', name: 'Max', sex: 'male', age: 2.5, weight: 1600, morphs: ['piebald'], genetics: { visual: ['piebald'], hets: [], alleles: { piebald: 'pie', mojave: 'wt' } }, lineage: {} },
  { id: 'm4', name: 'Apollo', sex: 'male', age: 3, weight: 1700, morphs: ['pastel'], genetics: { visual: ['pastel'], hets: ['albino'], alleles: { pastel: 'Pas', albino: 'alb' } }, lineage: {} },
  { id: 'm5', name: 'Titan', sex: 'male', age: 5, weight: 2100, morphs: ['banana'], genetics: { visual: ['banana'], hets: [], alleles: { banana: 'Ban', mojave: 'wt' } }, lineage: {} }
];

const mockFemales = [
  { id: 'f1', name: 'Athena', sex: 'female', age: 4, weight: 1500, morphs: ['lesser'], genetics: { visual: ['lesser'], hets: [], alleles: { lesser: 'Les', albino: 'wt' } }, lineage: {} },
  { id: 'f2', name: 'Luna', sex: 'female', age: 3, weight: 1400, morphs: ['albino'], genetics: { visual: ['albino'], hets: [], alleles: { albino: 'alb', mojave: 'wt' } }, lineage: {} },
  { id: 'f3', name: 'Bella', sex: 'female', age: 2, weight: 1300, morphs: ['pastel'], genetics: { visual: ['pastel'], hets: ['piebald'], alleles: { pastel: 'Pas', piebald: 'pie' } }, lineage: {} },
  { id: 'f4', name: 'Nyx', sex: 'female', age: 6, weight: 1600, morphs: ['clown'], genetics: { visual: ['clown'], hets: [], alleles: { clown: 'clw', mojave: 'wt' } }, lineage: {} },
  { id: 'f5', name: 'Iris', sex: 'female', age: 3.5, weight: 1450, morphs: ['mojave'], genetics: { visual: ['mojave'], hets: [], alleles: { mojave: 'Moj', albino: 'wt' } }, lineage: {} }
];

const allSnakes = [...mockMales, ...mockFemales];

// ============================================
// UI FUNCTIONS
// ============================================

function generateMatrix() {
  debug.log('🔨 Generating breeding matrix...');
  const table = document.getElementById('breedingMatrix');
  let html = '<thead><tr><th>♂ \\ ♀</th>';
  
  mockFemales.forEach(f => {
    html += `<th>${f.name}<br><small>${f.morphs[0]}</small></th>`;
  });
  html += '</tr></thead><tbody>';
  
  let cellCount = 0;
  mockMales.forEach(male => {
    html += `<tr><th>${male.name}<br><small>${male.morphs[0]}</small></th>`;
    mockFemales.forEach(female => {
      const compat = calculateCompatibility(male, female, allSnakes);
      const scoreClass = compat.score >= 80 ? 'excellent' : compat.score >= 60 ? 'good' : compat.score >= 40 ? 'fair' : 'poor';
      const indicator = compat.score >= 80 ? '🟢' : compat.score >= 60 ? '🟡' : compat.score >= 40 ? '🟠' : '🔴';
      
      html += `<td><div class="breeding-cell score-${scoreClass}" data-male="${male.id}" data-female="${female.id}" data-score="${compat.score}" onclick="showDetails('${male.id}', '${female.id}')">`;
      html += `<div class="cell-score">${compat.score}</div>`;
      const displayMorph = compat.outcomes[0]?.morph || `${male.morphs[0]}×${female.morphs[0]}`;
      html += `<div class="cell-morph">${displayMorph}</div>`;
      html += `<div class="cell-value">$${(compat.metrics.avgOffspringValue || 0).toFixed(0)}</div>`;
      html += `<div class="cell-indicator">${indicator}</div>`;
      html += `</div></td>`;
      cellCount++;
    });
    html += '</tr>';
  });
  
  html += '</tbody>';
  table.innerHTML = html;
  debug.log(`✅ Matrix generated: ${mockMales.length}×${mockFemales.length} = ${cellCount} cells`);
}

function showDetails(maleId, femaleId) {
  const male = mockMales.find(m => m.id === maleId);
  const female = mockFemales.find(f => f.id === femaleId);
  const compat = calculateCompatibility(male, female, allSnakes);
  
  let html = `<h2 class="modal-title">${male.name} × ${female.name}</h2>`;
  html += `<div class="stats">`;
  html += `<div class="stat-box"><div class="stat-label">Compatibility</div><div class="stat-value">${compat.score}</div></div>`;
  html += `<div class="stat-box"><div class="stat-label">Risk Level</div><div class="stat-value">${compat.risk}</div></div>`;
  html += `<div class="stat-box"><div class="stat-label">Avg Value</div><div class="stat-value">$${compat.metrics.avgOffspringValue.toFixed(0)}</div></div>`;
  html += `</div>`;
  
  if (compat.warnings.length) {
    html += `<div class="warning-box"><h4>⚠️  Warnings</h4>`;
    compat.warnings.forEach(w => html += `<p>• ${w}</p>`);
    html += `</div>`;
  }
  
  if (compat.bonuses.length) {
    html += `<div class="success-box"><h4>✅ Bonuses</h4>`;
    compat.bonuses.forEach(b => html += `<p>• ${b}</p>`);
    html += `</div>`;
  }
  
  html += `<div class="advanced-metrics"><h3>🔬 Advanced Genetics</h3><div class="stats">`;
  html += `<div class="stat-box"><div class="stat-label">CoI</div><div class="stat-value">${(compat.metrics.CoI * 100).toFixed(1)}%</div></div>`;
  html += `<div class="stat-box"><div class="stat-label">Diversity</div><div class="stat-value">${(compat.metrics.diversity * 100).toFixed(0)}%</div></div>`;
  html += `<div class="stat-box"><div class="stat-label">Heterozygosity</div><div class="stat-value">${(compat.metrics.heterozygosity * 100).toFixed(0)}%</div></div>`;
  html += `</div></div>`;
  
  html += `<div class="outcomes"><h3>🥚 Expected Offspring</h3>`;
  compat.outcomes.forEach(o => {
    html += `<div class="outcome-row"><span><strong>${o.morph}</strong> (${o.percentage}%)</span><span>${o.count} snakes @ $${o.value}</span></div>`;
  });
  html += `</div>`;
  
  document.getElementById('modalContent').innerHTML = html;
  document.getElementById('detailModal').classList.add('active');
}

function closeModal() {
  document.getElementById('detailModal').classList.remove('active');
}

// ============================================
// INITIALIZATION
// ============================================

async function init() {
  debug.log('🚀 Initializing Breeding Calculator...');
  await loadGeneticsDatabase();
  generateMatrix();
  debug.log('✅ Ready!');
}

window.onload = init;
