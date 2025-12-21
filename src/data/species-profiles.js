// Species-specific care profiles and requirements
// Based on v3.2_FINAL.md specification

export const SPECIES_PROFILES = {
  ball_python: {
    id: 'ball_python',
    common_name: 'Ball Python',
    scientific_name: 'Python regius',
    
    // Care requirements
    care: {
      temperature: {
        hot_spot: { min: 88, max: 92, unit: 'F' },
        cool_side: { min: 78, max: 82, unit: 'F' },
        nighttime: { min: 75, max: 80, unit: 'F' }
      },
      humidity: {
        min: 50,
        max: 60,
        unit: '%',
        shedding_boost: 70 // increase during shed
      }
    },
    
    // Feeding schedule by life stage
    feeding: {
      hatchling: {
        food: 'pinkie mouse',
        frequency_days: 5,
        size_guide: '10-15% body weight'
      },
      juvenile: {
        food: 'fuzzy/small mouse',
        frequency_days: 7,
        size_guide: '10-15% body weight'
      },
      adult: {
        food: 'adult mouse/small rat',
        frequency_days: 10,
        size_guide: '10-15% body weight'
      }
    },
    
    // Shedding cycle
    shedding: {
      frequency_days: {
        hatchling: 21,
        juvenile: 30,
        adult: 45
      },
      stages: ['normal', 'pre_shed', 'blue_eyes', 'clear', 'shedding'],
      stuck_shed_risk: {
        low_humidity: 0.3, // 30% chance if humidity < min
        high_humidity: 0.0
      }
    },
    
    // Health thresholds
    health: {
      temp_illness_threshold: {
        too_cold: 70,
        too_hot: 95
      },
      common_illnesses: ['respiratory_infection', 'stuck_shed', 'mites', 'scale_rot'],
      vet_cost_gold: 500
    },
    
    // Life stages
    life_stages: {
      egg: {
        duration_days: 55,
        min_weight_grams: 0,
        max_weight_grams: 80
      },
      hatchling: {
        duration_days: 180,
        min_weight_grams: 50,
        max_weight_grams: 200
      },
      juvenile: {
        duration_days: 730, // 2 years
        min_weight_grams: 200,
        max_weight_grams: 800
      },
      adult: {
        duration_days: null, // permanent
        min_weight_grams: 800,
        max_weight_grams: 2000
      }
    },
    
    // Breeding info
    genetics: {
      sexual_maturity_months: 18,
      breeding_season: 'Nov-March',
      clutch_size: { min: 3, max: 11, avg: 6 },
      incubation_days: 55,
      breeding_cooldown_days: 365
    },
    
    // Stat decay rates (per hour)
    stat_decay: {
      hunger: 2,
      water: 3,
      cleanliness: 1,
      stress: -0.5 // stress naturally decreases
    }
  },
  
  corn_snake: {
    id: 'corn_snake',
    common_name: 'Corn Snake',
    scientific_name: 'Pantherophis guttatus',
    
    care: {
      temperature: {
        hot_spot: { min: 85, max: 90, unit: 'F' },
        cool_side: { min: 75, max: 80, unit: 'F' },
        nighttime: { min: 70, max: 75, unit: 'F' }
      },
      humidity: {
        min: 40,
        max: 50,
        unit: '%',
        shedding_boost: 60
      }
    },
    
    feeding: {
      hatchling: {
        food: 'pinkie mouse',
        frequency_days: 5,
        size_guide: '10-15% body weight'
      },
      juvenile: {
        food: 'fuzzy/small mouse',
        frequency_days: 7,
        size_guide: '10-15% body weight'
      },
      adult: {
        food: 'adult mouse',
        frequency_days: 10,
        size_guide: '10-15% body weight'
      }
    },
    
    shedding: {
      frequency_days: {
        hatchling: 21,
        juvenile: 35,
        adult: 60
      },
      stages: ['normal', 'pre_shed', 'blue_eyes', 'clear', 'shedding'],
      stuck_shed_risk: {
        low_humidity: 0.25,
        high_humidity: 0.0
      }
    },
    
    health: {
      temp_illness_threshold: {
        too_cold: 65,
        too_hot: 92
      },
      common_illnesses: ['respiratory_infection', 'stuck_shed', 'mites'],
      vet_cost_gold: 400
    },
    
    life_stages: {
      egg: {
        duration_days: 60,
        min_weight_grams: 0,
        max_weight_grams: 10
      },
      hatchling: {
        duration_days: 180,
        min_weight_grams: 6,
        max_weight_grams: 50
      },
      juvenile: {
        duration_days: 730,
        min_weight_grams: 50,
        max_weight_grams: 300
      },
      adult: {
        duration_days: null,
        min_weight_grams: 300,
        max_weight_grams: 900
      }
    },
    
    genetics: {
      sexual_maturity_months: 18,
      breeding_season: 'March-May',
      clutch_size: { min: 12, max: 24, avg: 16 },
      incubation_days: 60,
      breeding_cooldown_days: 365
    },
    
    stat_decay: {
      hunger: 2.5,
      water: 3,
      cleanliness: 1.5,
      stress: -0.5
    }
  }
};

// Helper functions
export function getSpeciesProfile(speciesId) {
  return SPECIES_PROFILES[speciesId];
}

export function getLifeStage(snake) {
  const profile = SPECIES_PROFILES[snake.species];
  if (!profile) return 'unknown';
  
  const ageInDays = Math.floor((Date.now() - new Date(snake.birth_date)) / (1000 * 60 * 60 * 24));
  
  // Check by age and weight
  for (const [stage, requirements] of Object.entries(profile.life_stages)) {
    if (snake.weight_grams >= requirements.min_weight_grams && 
        snake.weight_grams <= requirements.max_weight_grams) {
      return stage;
    }
  }
  
  return 'adult';
}

export function getFeedingSchedule(snake) {
  const profile = SPECIES_PROFILES[snake.species];
  const stage = snake.life_stage || getLifeStage(snake);
  return profile.feeding[stage];
}

export function getShedFrequency(snake) {
  const profile = SPECIES_PROFILES[snake.species];
  const stage = snake.life_stage || getLifeStage(snake);
  return profile.shedding.frequency_days[stage];
}
