// ====================================
// GENETICS DATA LOADER
// ====================================
// Loads ball python genetics database from JSON files
// and builds fast lookup maps

export let GENETICS_DATA = null;

export async function loadGeneticsData() {
  try {
    console.log('🔄 Loading genetics database...');
    const [sources, morphs, geneTypes, healthRisks, lethalCombos] = await Promise.all([
      fetch('/data/genetics/sources.json').then(r => r.json()),
      fetch('/data/genetics/morphs.json').then(r => r.json()),
      fetch('/data/genetics/gene-types.json').then(r => r.json()),
      fetch('/data/genetics/health-risks.json').then(r => r.json()),
      fetch('/data/genetics/lethal-combos.json').then(r => r.json())
    ]);
    
    GENETICS_DATA = { sources, morphs, geneTypes, healthRisks, lethalCombos };
    
    console.log(`✅ Loaded ${morphs.morph_count} morphs from genetics database`);
    console.log(`   Source: ${sources.sources[sources.active_source].name}`);
    console.log(`   Co-dom: ${morphs.morphs.filter(m => m.gene_type === 'co-dominant').length}, Dom: ${morphs.morphs.filter(m => m.gene_type === 'dominant').length}, Rec: ${morphs.morphs.filter(m => m.gene_type === 'recessive').length}`);
    
    // Build lookup maps for fast access
    buildGeneticsLookups();
    
    return true;
  } catch (err) {
    console.error('❌ Failed to load genetics data:', err);
    console.warn('⚠️  Falling back to hardcoded constants');
    return false;
  }
}

// Build fast lookup maps from loaded data
function buildGeneticsLookups() {
  if (!GENETICS_DATA) return;
  
  // Build morph value lookup
  GENETICS_DATA.morphValueMap = {};
  GENETICS_DATA.morphs.morphs.forEach(m => {
    GENETICS_DATA.morphValueMap[m.id] = m.market_value_usd;
  });
  
  // Build health risk lookup
  GENETICS_DATA.healthRiskMap = {};
  GENETICS_DATA.morphs.morphs.forEach(m => {
    if (m.health_risk && m.health_risk !== 'none') {
      GENETICS_DATA.healthRiskMap[m.id] = {
        risk: m.health_risk.toUpperCase(),
        issues: m.health_issues || [],
        avoidWith: [] // Could be added to JSON later
      };
    }
  });
  
  // Build lethal combo lookup
  GENETICS_DATA.lethalComboMap = [];
  GENETICS_DATA.lethalCombos.lethal_combinations.forEach(c => {
    GENETICS_DATA.lethalComboMap.push({
      morphs: [c.morph1, c.morph2],
      reason: c.description || c.result
    });
  });
  
  console.log(`📊 Lookups: ${Object.keys(GENETICS_DATA.morphValueMap).length} morphs, ${Object.keys(GENETICS_DATA.healthRiskMap).length} risks, ${GENETICS_DATA.lethalComboMap.length} lethal combos`);
}

// Get morph value (USD) - uses JSON data if loaded
export function getMorphValue(morphId) {
  if (GENETICS_DATA?.morphValueMap?.[morphId]) {
    return GENETICS_DATA.morphValueMap[morphId];
  }
  // Fallback to hardcoded values
  const MORPH_VALUES = {
    'normal': 50,
    'albino': 300,
    'spider': 150,
    'piebald': 600,
    'pastel': 150,
    'mojave': 200,
    'lesser': 200,
    'albino_pastel': 500,
    'blue_eyed_leucistic': 800,
    'piebald_pastel': 800
  };
  return MORPH_VALUES[morphId] || 50;
}

// Get health risk info - uses JSON data if loaded
export function getHealthRisk(morphId) {
  if (GENETICS_DATA?.healthRiskMap?.[morphId]) {
    return GENETICS_DATA.healthRiskMap[morphId];
  }
  // Fallback to hardcoded
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
    'woma': {
      risk: 'LOW',
      issues: ['Mild head wobble in some lines'],
      avoidWith: ['spider']
    }
  };
  return MORPH_HEALTH_DATABASE[morphId];
}

// Check lethal combo - uses JSON data if loaded
export function checkLethalCombo(morphs1, morphs2) {
  // Try JSON data first
  if (GENETICS_DATA?.lethalComboMap) {
    for (const combo of GENETICS_DATA.lethalComboMap) {
      const hasAllMorphs = combo.morphs.every(m => 
        morphs1.includes(m) || morphs2.includes(m)
      );
      if (hasAllMorphs) return combo;
    }
  }
  
  // Fallback to hardcoded
  const LETHAL_COMBOS = [
    { morphs: ['spider', 'spider'], reason: 'Super Spider is lethal (neurological defects)' },
    { morphs: ['champagne', 'champagne'], reason: 'Super Champagne has severe wobble' }
  ];
  
  for (const combo of LETHAL_COMBOS) {
    const hasAll = combo.morphs.every(m => 
      morphs1.includes(m) && morphs2.includes(m)
    );
    if (hasAll) {
      return { reason: combo.reason };
    }
  }
  return null;
}

// Get all morphs (for autocomplete, etc.)
export function getAllMorphs() {
  if (GENETICS_DATA?.morphs?.morphs) {
    return GENETICS_DATA.morphs.morphs;
  }
  return [];
}

// Get morph by ID
export function getMorphById(morphId) {
  if (GENETICS_DATA?.morphs?.morphs) {
    return GENETICS_DATA.morphs.morphs.find(m => m.id === morphId);
  }
  return null;
}
