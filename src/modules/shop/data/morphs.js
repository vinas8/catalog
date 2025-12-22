// Genetic morphs database for Ball Pythons and Corn Snakes
// Based on v3.2_FINAL.md genetics specification

export const MORPH_TRAITS = {
  // Ball Python morphs
  banana: {
    id: 'banana',
    name: 'Banana',
    species: ['ball_python'],
    type: 'co-dominant',
    allele_dominant: 'Ban',
    allele_wild: '+',
    description: 'Yellow and tan with lavender blushing',
    super_form: 'Super Banana (coral glow effect)',
    price_multiplier: 4.0 // 4x base price
  },
  
  piebald: {
    id: 'piebald',
    name: 'Piebald',
    species: ['ball_python'],
    type: 'recessive',
    allele_recessive: 'pied',
    allele_wild: '+',
    description: 'White patches with normal colored sections',
    super_form: null,
    price_multiplier: 10.0
  },
  
  pastel: {
    id: 'pastel',
    name: 'Pastel',
    species: ['ball_python'],
    type: 'co-dominant',
    allele_dominant: 'Pas',
    allele_wild: '+',
    description: 'Lighter, brighter colors with reduced black',
    super_form: 'Super Pastel (very light and bright)',
    price_multiplier: 2.0
  },
  
  spider: {
    id: 'spider',
    name: 'Spider',
    species: ['ball_python'],
    type: 'dominant',
    allele_dominant: 'Sp',
    allele_wild: '+',
    description: 'Thin pattern with lots of webbing',
    super_form: null, // lethal
    price_multiplier: 3.0,
    health_warning: 'May have neurological issues (wobble)'
  },
  
  clown: {
    id: 'clown',
    name: 'Clown',
    species: ['ball_python'],
    type: 'recessive',
    allele_recessive: 'cl',
    allele_wild: '+',
    description: 'Head pattern reduced, body has unique pattern',
    super_form: null,
    price_multiplier: 8.0
  },
  
  // Corn Snake morphs
  amelanistic: {
    id: 'amelanistic',
    name: 'Amelanistic (Albino)',
    species: ['corn_snake'],
    type: 'recessive',
    allele_recessive: 'amel',
    allele_wild: '+',
    description: 'No black pigment, red and orange only',
    super_form: null,
    price_multiplier: 3.0
  },
  
  anerythristic: {
    id: 'anerythristic',
    name: 'Anerythristic',
    species: ['corn_snake'],
    type: 'recessive',
    allele_recessive: 'anery',
    allele_wild: '+',
    description: 'No red pigment, black and gray only',
    super_form: null,
    price_multiplier: 2.5
  },
  
  bloodred: {
    id: 'bloodred',
    name: 'Blood Red',
    species: ['corn_snake'],
    type: 'recessive',
    allele_recessive: 'blood',
    allele_wild: '+',
    description: 'Deep red color, reduced pattern',
    super_form: null,
    price_multiplier: 4.0
  },
  
  motley: {
    id: 'motley',
    name: 'Motley',
    species: ['corn_snake'],
    type: 'recessive',
    allele_recessive: 'mot',
    allele_wild: '+',
    description: 'Pattern disrupted into stripes and spots',
    super_form: null,
    price_multiplier: 2.0
  },
  
  tessera: {
    id: 'tessera',
    name: 'Tessera',
    species: ['corn_snake'],
    type: 'dominant',
    allele_dominant: 'Tess',
    allele_wild: '+',
    description: 'Unique pattern with side markings',
    super_form: null,
    price_multiplier: 5.0
  }
};

// Combo morphs (common combinations)
export const COMBO_MORPHS = {
  ball_python: {
    banana_pastel: {
      name: 'Banana Pastel',
      traits: ['banana', 'pastel'],
      price_multiplier: 6.0
    },
    pied_banana: {
      name: 'Banana Pied',
      traits: ['banana', 'piebald'],
      price_multiplier: 15.0
    },
    super_banana_pastel: {
      name: 'Super Banana Pastel',
      traits: ['banana', 'pastel'],
      requires_super: ['banana'],
      price_multiplier: 12.0
    }
  },
  corn_snake: {
    snow: {
      name: 'Snow',
      traits: ['amelanistic', 'anerythristic'],
      description: 'White with pink/red eyes',
      price_multiplier: 5.0
    },
    ghost: {
      name: 'Ghost',
      traits: ['anerythristic', 'hypomelanistic'],
      price_multiplier: 4.0
    },
    blizzard: {
      name: 'Blizzard',
      traits: ['amelanistic', 'anerythristic'],
      special: true,
      price_multiplier: 8.0
    }
  }
};

// Get morph info
export function getMorphInfo(morphId) {
  return MORPH_TRAITS[morphId];
}

// Get all morphs for a species
export function getMorphsForSpecies(speciesId) {
  return Object.values(MORPH_TRAITS).filter(morph => 
    morph.species.includes(speciesId)
  );
}

// Calculate morph price
export function calculateMorphPrice(basePrice, morphIds) {
  let totalMultiplier = 1.0;
  
  for (const morphId of morphIds) {
    const morph = MORPH_TRAITS[morphId];
    if (morph) {
      totalMultiplier *= morph.price_multiplier;
    }
  }
  
  return Math.floor(basePrice * totalMultiplier);
}

// Check if morph combination is valid
export function isValidMorphCombo(morphIds, species) {
  const morphs = morphIds.map(id => MORPH_TRAITS[id]).filter(Boolean);
  
  // All morphs must be for the same species
  for (const morph of morphs) {
    if (!morph.species.includes(species)) {
      return false;
    }
  }
  
  return true;
}
