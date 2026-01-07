// SPDX-FileCopyrightText: 2024-2026 vinas8 (Serpent Town)
// SPDX-License-Identifier: MIT
// 
// Adapted from: PokeRogue pokemon-species.ts (AGPL-3.0)
// Original: https://github.com/pagefaultgames/pokerogue
// Copyright: 2024-2025 Pagefault Games
//
// Modifications: Adapted Pokemon species structure for snake breeding game

/**
 * Snake Species Data Structure
 * Based on PokeRogue's PokemonSpecies pattern
 */

export class SnakeSpecies {
  constructor(
    id,                    // Unique identifier
    speciesId,             // Species number (1 = Ball Python, 2 = Corn Snake, etc.)
    name,                  // Display name
    species,               // Scientific species name
    morph,                 // Morph type (Normal, Banana, Pied, etc.)
    lengthM,               // Length in meters
    weightG,               // Weight in grams
    price,                 // Price in currency
    rarity,                // common, uncommon, rare, legendary
    genes = [],            // Genetic traits array
    breedingCompatibility = [], // Compatible morphs for breeding
    careRequirements = {}  // Temperature, humidity, etc.
  ) {
    this.id = id;
    this.speciesId = speciesId;
    this.name = name;
    this.species = species;
    this.morph = morph;
    this.lengthM = lengthM;
    this.weightG = weightG;
    this.price = price;
    this.rarity = rarity;
    this.genes = genes;
    this.breedingCompatibility = breedingCompatibility;
    this.careRequirements = careRequirements;
  }

  /**
   * Get display name with morph
   */
  getFullName() {
    return `${this.morph} ${this.name}`;
  }

  /**
   * Check if this snake can breed with another
   */
  canBreedWith(otherSpecies) {
    return this.breedingCompatibility.includes(otherSpecies.id);
  }

  /**
   * Get rarity color for UI
   */
  getRarityColor() {
    const colors = {
      common: '#6c757d',
      uncommon: '#28a745',
      rare: '#007bff',
      legendary: '#ffc107'
    };
    return colors[this.rarity] || colors.common;
  }
}

/**
 * Initialize all snake species
 * Based on PokeRogue's initSpecies() pattern
 */
export function initSnakeSpecies() {
  const species = [];

  // Ball Pythons (Species ID: 1)
  species.push(
    new SnakeSpecies(
      'bp_normal',
      1,
      'Ball Python',
      'Python regius',
      'Normal',
      1.2,
      1500,
      50,
      'common',
      ['wild_type'],
      ['bp_banana', 'bp_pied', 'bp_pastel'],
      { tempMin: 26, tempMax: 32, humidity: 60 }
    ),
    new SnakeSpecies(
      'bp_banana',
      1,
      'Ball Python',
      'Python regius',
      'Banana',
      1.2,
      1500,
      150,
      'uncommon',
      ['banana_gene'],
      ['bp_normal', 'bp_pastel', 'bp_pied'],
      { tempMin: 26, tempMax: 32, humidity: 60 }
    ),
    new SnakeSpecies(
      'bp_pied',
      1,
      'Ball Python',
      'Python regius',
      'Piebald',
      1.2,
      1500,
      200,
      'rare',
      ['pied_recessive'],
      ['bp_normal', 'bp_banana'],
      { tempMin: 26, tempMax: 32, humidity: 60 }
    ),
    new SnakeSpecies(
      'bp_pastel',
      1,
      'Ball Python',
      'Python regius',
      'Pastel',
      1.2,
      1500,
      100,
      'uncommon',
      ['pastel_codominant'],
      ['bp_normal', 'bp_banana'],
      { tempMin: 26, tempMax: 32, humidity: 60 }
    ),
    new SnakeSpecies(
      'bp_super_pastel',
      1,
      'Ball Python',
      'Python regius',
      'Super Pastel',
      1.2,
      1500,
      300,
      'rare',
      ['pastel_codominant', 'pastel_codominant'],
      ['bp_pastel', 'bp_banana'],
      { tempMin: 26, tempMax: 32, humidity: 60 }
    )
  );

  // Corn Snakes (Species ID: 2)
  species.push(
    new SnakeSpecies(
      'cs_normal',
      2,
      'Corn Snake',
      'Pantherophis guttatus',
      'Normal',
      1.5,
      900,
      40,
      'common',
      ['wild_type'],
      ['cs_amelanistic', 'cs_anerythristic'],
      { tempMin: 24, tempMax: 29, humidity: 50 }
    ),
    new SnakeSpecies(
      'cs_amelanistic',
      2,
      'Corn Snake',
      'Pantherophis guttatus',
      'Amelanistic',
      1.5,
      900,
      80,
      'uncommon',
      ['amelanistic_recessive'],
      ['cs_normal', 'cs_anerythristic'],
      { tempMin: 24, tempMax: 29, humidity: 50 }
    ),
    new SnakeSpecies(
      'cs_anerythristic',
      2,
      'Corn Snake',
      'Pantherophis guttatus',
      'Anerythristic',
      1.5,
      900,
      90,
      'uncommon',
      ['anerythristic_recessive'],
      ['cs_normal', 'cs_amelanistic'],
      { tempMin: 24, tempMax: 29, humidity: 50 }
    ),
    new SnakeSpecies(
      'cs_snow',
      2,
      'Corn Snake',
      'Pantherophis guttatus',
      'Snow (Amel + Anery)',
      1.5,
      900,
      250,
      'rare',
      ['amelanistic_recessive', 'anerythristic_recessive'],
      ['cs_amelanistic', 'cs_anerythristic'],
      { tempMin: 24, tempMax: 29, humidity: 50 }
    )
  );

  return species;
}

/**
 * Get species by ID
 */
export function getSnakeSpeciesById(id) {
  const allSpecies = initSnakeSpecies();
  return allSpecies.find(s => s.id === id);
}

/**
 * Get all species of a given type
 */
export function getSnakeSpeciesByType(speciesId) {
  const allSpecies = initSnakeSpecies();
  return allSpecies.filter(s => s.speciesId === speciesId);
}

/**
 * Get species by rarity
 */
export function getSnakeSpeciesByRarity(rarity) {
  const allSpecies = initSnakeSpecies();
  return allSpecies.filter(s => s.rarity === rarity);
}
