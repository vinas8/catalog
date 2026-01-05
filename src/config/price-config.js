// Snake Price Configuration
// Centralized pricing for all snakes in catalog
// Used by catalog.html and worker API

export const PRICE_CONFIG = {
  // Base prices by species (in EUR)
  basePrices: {
    ball_python: 150,
    corn_snake: 100
  },
  
  // Morph price multipliers (matches morphs.js)
  morphMultipliers: {
    // Ball Python morphs
    banana: 4.0,        // €600 (150 * 4)
    piebald: 10.0,      // €1500 (150 * 10)
    pastel: 2.0,        // €300 (150 * 2)
    spider: 3.0,        // €450 (150 * 3)
    clown: 8.0,         // €1200 (150 * 8)
    albino: 6.0,        // €900 (150 * 6)
    
    // Corn Snake morphs
    amelanistic: 3.0,   // €300 (100 * 3)
    anerythristic: 2.5, // €250 (100 * 2.5)
    hypomelanistic: 2.0,// €200 (100 * 2)
    charcoal: 2.5,      // €250 (100 * 2.5)
    bloodred: 4.0,      // €400 (100 * 4)
    
    // Special combo morphs
    snow: 5.0,          // €500 (100 * 5)
    ghost: 4.0,         // €400 (100 * 4)
    blizzard: 8.0       // €800 (100 * 8)
  },
  
  // Calculate price for a snake
  calculatePrice(species, morph) {
    const basePrice = this.basePrices[species] || 150;
    const multiplier = this.morphMultipliers[morph] || 1.0;
    return Math.round(basePrice * multiplier);
  },
  
  // Get price with currency symbol
  formatPrice(species, morph, currency = '€') {
    const price = this.calculatePrice(species, morph);
    return `${currency}${price}`;
  }
};

// Example usage:
// PRICE_CONFIG.calculatePrice('ball_python', 'banana') // 600
// PRICE_CONFIG.calculatePrice('corn_snake', 'snow')    // 500
// PRICE_CONFIG.formatPrice('ball_python', 'piebald')   // "€1500"

export default PRICE_CONFIG;
