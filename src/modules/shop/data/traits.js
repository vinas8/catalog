/**
 * Trait-based collection system
 * Data-driven from real snake collection (24 snakes, 34 unique traits)
 * Supports discovery progression and educational gameplay
 */

export const TRAIT_DATABASE = {
  // === TIER 1: HIGH FREQUENCY (3-4 snakes) ===
  
  spotnose: {
    id: 'spotnose',
    name: 'Spotnose',
    species: ['ball_python'],
    inheritance: 'dominant',
    rarity: 'uncommon',
    frequency: 4,
    price_multiplier: 2.5,
    care_notes: 'Bright spot on the nose, enhances color in combinations',
    ethical_warnings: null,
    
    education: {
      basic: 'Spotnose is a dominant trait - only one parent needs it to produce visual offspring.',
      advanced: 'Spotnose brightens overall coloration and is highly sought after in combo morphs.'
    }
  },
  
  fire: {
    id: 'fire',
    name: 'Fire',
    species: ['ball_python'],
    inheritance: 'co-dominant',
    rarity: 'uncommon',
    frequency: 3,
    price_multiplier: 2.0,
    care_notes: 'Strong feeders - monitor weight to prevent obesity',
    ethical_warnings: null,
    super_form: 'Black-Eyed Leucistic (Super Fire)',
    
    education: {
      basic: 'Fire is co-dominant. One copy produces Fire, two copies produce Black-Eyed Leucistic.',
      advanced: 'Fire ball pythons have excellent appetites. Feed adults every 10-14 days to prevent overfeeding.',
      genetics: 'Fire x Fire = 25% Normal, 50% Fire, 25% BEL (Super Fire)'
    }
  },
  
  hypo: {
    id: 'hypo',
    name: 'Hypomelanistic',
    species: ['ball_python', 'corn_snake'],
    inheritance: 'recessive',
    rarity: 'uncommon',
    frequency: 3,
    price_multiplier: 2.0,
    care_notes: 'Reduced black pigment creates lighter, brighter colors',
    ethical_warnings: null,
    
    education: {
      basic: 'Hypo is recessive - both parents must carry it to produce visual offspring.',
      advanced: 'Hypo works in multiple species and creates beautiful color enhancement.'
    }
  },
  
  salmon: {
    id: 'salmon',
    name: 'Salmon',
    species: ['corn_snake'],
    inheritance: 'unknown',
    rarity: 'uncommon',
    frequency: 3,
    price_multiplier: 1.5,
    care_notes: 'Beautiful peach/orange coloration',
    ethical_warnings: null,
    
    education: {
      basic: 'Salmon is a color variant with beautiful peach tones.',
      advanced: 'The genetic basis of Salmon is not yet fully understood, but it breeds consistently.'
    }
  },
  
  // === EXISTING DATABASE (Verified) ===
  
  clown: {
    id: 'clown',
    name: 'Clown',
    species: ['ball_python'],
    inheritance: 'recessive',
    rarity: 'ultra_common',
    frequency: 8,
    price_multiplier: 8.0,
    care_notes: 'Reduced head pattern, unique feeding response',
    ethical_warnings: null,
    
    education: {
      basic: 'Clown is one of the most popular ball python morphs, first bred in 1999.',
      advanced: 'Clown features reduced head pattern and distinct body markings. Often has strong feeding response.',
      genetics: 'Clown x Clown = 100% Clown. Clown x Normal = 100% het Clown.'
    }
  },
  
  pastel: {
    id: 'pastel',
    name: 'Pastel',
    species: ['ball_python'],
    inheritance: 'co-dominant',
    rarity: 'common',
    frequency: 5,
    price_multiplier: 2.0,
    care_notes: 'Lighter, brighter colors with reduced black',
    ethical_warnings: null,
    super_form: 'Super Pastel',
    
    education: {
      basic: 'Pastel is co-dominant, making it easy to work with in breeding.',
      advanced: 'Pastel brightens colors and is an excellent foundation for complex combos.',
      genetics: 'Pastel x Pastel = 25% Normal, 50% Pastel, 25% Super Pastel'
    }
  },
  
  banana: {
    id: 'banana',
    name: 'Banana',
    species: ['ball_python'],
    inheritance: 'co-dominant',
    rarity: 'exotic',
    frequency: 1,
    price_multiplier: 4.0,
    care_notes: 'Yellow and tan with lavender blushing',
    ethical_warnings: null,
    super_form: 'Super Banana (Coral Glow effect)',
    
    education: {
      basic: 'Banana is a highly sought-after co-dominant morph with vibrant yellow coloration.',
      advanced: 'Banana can produce both male and female visual offspring, unlike some sex-linked traits.',
      genetics: 'Banana x Banana = 25% Normal, 50% Banana, 25% Super Banana'
    }
  },
  
  spider: {
    id: 'spider',
    name: 'Spider',
    species: ['ball_python'],
    inheritance: 'dominant',
    rarity: 'exotic',
    frequency: 1,
    price_multiplier: 3.0,
    care_notes: 'Thin pattern with lots of webbing',
    ethical_warnings: 'May exhibit neurological wobble - ethical concerns exist',
    
    education: {
      basic: 'Spider is a dominant trait with unique webbed pattern.',
      advanced: 'Spider is linked to neurological issues (wobble). Many breeders avoid this morph for ethical reasons.',
      ethics: 'The Spider gene causes varying degrees of wobble (head tremors). Consider ethical implications before breeding.'
    }
  },
  
  piebald: {
    id: 'piebald',
    name: 'Piebald',
    species: ['ball_python'],
    inheritance: 'recessive',
    rarity: 'exotic',
    frequency: 1,
    price_multiplier: 10.0,
    care_notes: 'White patches with normal colored sections',
    ethical_warnings: null,
    
    education: {
      basic: 'Piebald is one of the most expensive recessive morphs due to its stunning white patches.',
      advanced: 'Piebald pattern is unpredictable - each snake is unique.',
      genetics: 'Piebald x Piebald = 100% Piebald. Piebald x Normal = 100% het Piebald.'
    }
  },
  
  tessera: {
    id: 'tessera',
    name: 'Tessera',
    species: ['corn_snake'],
    inheritance: 'dominant',
    rarity: 'uncommon',
    frequency: 3,
    price_multiplier: 5.0,
    care_notes: 'Unique pattern with side markings',
    ethical_warnings: null,
    
    education: {
      basic: 'Tessera is a dominant mutation discovered in 2009.',
      advanced: 'Tessera creates a striking pattern that differs significantly from wild-type corn snakes.'
    }
  },
  
  bloodred: {
    id: 'bloodred',
    name: 'Blood Red',
    species: ['corn_snake'],
    inheritance: 'recessive',
    rarity: 'rare',
    frequency: 2,
    price_multiplier: 4.0,
    care_notes: 'Deep red color, reduced pattern',
    ethical_warnings: null,
    
    education: {
      basic: 'Blood Red is a recessive trait with intense red coloration.',
      advanced: 'Blood Red reduces pattern and intensifies red pigment.'
    }
  },
  
  // === TIER 2: MODERATE FREQUENCY (2 snakes) ===
  
  enchi: {
    id: 'enchi',
    name: 'Enchi',
    species: ['ball_python'],
    inheritance: 'co-dominant',
    rarity: 'rare',
    frequency: 2,
    price_multiplier: 2.5,
    care_notes: 'Enhanced colors and pattern reduction',
    ethical_warnings: null,
    
    education: {
      basic: 'Enchi is a popular co-dominant that brightens colors.',
      advanced: 'Enchi works beautifully in complex combos like Enchi Fire.'
    }
  },
  
  lesser: {
    id: 'lesser',
    name: 'Lesser',
    species: ['ball_python'],
    inheritance: 'co-dominant',
    rarity: 'rare',
    frequency: 2,
    price_multiplier: 2.0,
    care_notes: 'Part of the Blue-Eyed Leucistic complex',
    ethical_warnings: null,
    super_form: 'Blue-Eyed Leucistic (BEL)',
    
    education: {
      basic: 'Lesser is part of the BEL (Blue-Eyed Leucistic) complex.',
      advanced: 'Lesser x Lesser, or Lesser x Butter/Mojave = BEL.'
    }
  },
  
  yellow: {
    id: 'yellow',
    name: 'Yellow Belly',
    species: ['ball_python'],
    inheritance: 'co-dominant',
    rarity: 'rare',
    frequency: 2,
    price_multiplier: 2.0,
    care_notes: 'Clean belly, part of BEL complex',
    ethical_warnings: null,
    super_form: 'Ivory (Super Yellow Belly)',
    
    education: {
      basic: 'Yellow Belly is co-dominant and part of the BEL complex.',
      advanced: 'Super Yellow Belly is called Ivory - a clean white snake.'
    }
  },
  
  opal: {
    id: 'opal',
    name: 'Opal',
    species: ['corn_snake'],
    inheritance: 'recessive',
    rarity: 'rare',
    frequency: 2,
    price_multiplier: 3.0,
    care_notes: 'Lavender and white coloration',
    ethical_warnings: null,
    
    education: {
      basic: 'Opal is a recessive combination of Amelanistic and Lavender.',
      advanced: 'Opal creates stunning lavender tones on a white background.'
    }
  }
};

// Helper functions

export function getTraitInfo(traitId) {
  return TRAIT_DATABASE[traitId];
}

export function getTraitsBySpecies(speciesId) {
  return Object.values(TRAIT_DATABASE).filter(trait =>
    trait.species.includes(speciesId)
  );
}

export function getTraitsByRarity(rarity) {
  return Object.values(TRAIT_DATABASE).filter(trait =>
    trait.rarity === rarity
  );
}

export function getAllTraits() {
  return Object.values(TRAIT_DATABASE);
}

export function calculateTraitValue(traitIds) {
  let totalMultiplier = 1.0;
  
  for (const traitId of traitIds) {
    const trait = TRAIT_DATABASE[traitId];
    if (trait) {
      totalMultiplier *= trait.price_multiplier;
    }
  }
  
  return totalMultiplier;
}

// Parse morph string into trait tokens (best effort)
export function parseMorphString(morphStr) {
  if (!morphStr) return [];
  
  const ignore = new Set(['pos', 'het', 'h', 'poss', 'h.', '50%', '66%']);
  const words = morphStr.toLowerCase()
    .split(/[\s\(\)\.]/)
    .map(w => w.trim())
    .filter(w => w && w.length > 2 && !ignore.has(w) && !w.endsWith('%'));
  
  // Match against known traits
  const matchedTraits = [];
  const traitIds = Object.keys(TRAIT_DATABASE);
  
  for (const word of words) {
    // Direct match
    if (traitIds.includes(word)) {
      matchedTraits.push(word);
    }
    // Partial match (e.g., "belly" matches "yellow")
    else {
      const partial = traitIds.find(id => 
        id.includes(word) || word.includes(id)
      );
      if (partial && !matchedTraits.includes(partial)) {
        matchedTraits.push(partial);
      }
    }
  }
  
  return matchedTraits;
}

// Get discovery level (for progression)
export function getDiscoveryLevel(exposureCount) {
  if (exposureCount === 0) return 'unseen';
  if (exposureCount < 3) return 'seen';
  return 'understood';
}

export const RARITY_TIERS = {
  ultra_common: { label: 'Ultra Common', color: '#8b949e' },
  common: { label: 'Common', color: '#58a6ff' },
  uncommon: { label: 'Uncommon', color: '#a371f7' },
  rare: { label: 'Rare', color: '#f778ba' },
  exotic: { label: 'Exotic', color: '#ffa657' }
};
