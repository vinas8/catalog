/**
 * Economy Configuration
 * Snake Muffin v0.7.7
 * 
 * Central config for all economy-related values:
 * - Currency conversion rates
 * - Virtual snake pricing
 * - Loyalty system
 * - Transaction costs
 */

export const ECONOMY_CONFIG = {
  // === Currency Conversion ===
  USD_TO_GOLD_RATE: 100,          // $1 USD = 100 gold
  LOYALTY_POINTS_PER_DOLLAR: 1,   // 1 loyalty point per $1 spent
  
  // === Virtual Snake Base Prices (gold) ===
  VIRTUAL_PRICES: {
    ball_python: 1000,
    corn_snake: 500,
    default: 1000
  },
  
  // === Loyalty Tiers ===
  LOYALTY_TIERS: {
    BRONZE: { min: 0, max: 99, name: 'Bronze' },
    SILVER: { min: 100, max: 499, name: 'Silver' },
    GOLD: { min: 500, max: 999, name: 'Gold' },
    PLATINUM: { min: 1000, max: Infinity, name: 'Platinum' }
  },
  
  // === Action Costs (gold) ===
  ACTION_COSTS: {
    FEED: 10,
    WATER: 5,
    CLEAN: 15,
    VET_CHECK: 50,
    EQUIPMENT_BASE: 50
  },
  
  // === Starting Currency ===
  STARTING_GOLD: 1000,
  
  // === Gold Earning Rates ===
  GOLD_PER_CARE_ACTION: 5,        // Earn 5 gold per successful care action
  GOLD_PER_DAY_ACTIVE: 50,        // Daily login bonus
  
  // === Price Calculation Helpers ===
  /**
   * Get virtual snake base price by species
   * @param {string} species - Species name (ball_python, corn_snake)
   * @returns {number} Base price in gold
   */
  getVirtualBasePrice(species) {
    return this.VIRTUAL_PRICES[species] || this.VIRTUAL_PRICES.default;
  },
  
  /**
   * Convert USD cents to gold
   * @param {number} usdCents - Amount in USD cents
   * @returns {number} Gold amount
   */
  usdCentsToGold(usdCents) {
    return usdCents; // 1 cent = 1 gold (rate of 100 gold per $1)
  },
  
  /**
   * Convert USD dollars to gold
   * @param {number} usdDollars - Amount in USD dollars
   * @returns {number} Gold amount
   */
  usdDollarsToGold(usdDollars) {
    return Math.floor(usdDollars * this.USD_TO_GOLD_RATE);
  },
  
  /**
   * Calculate loyalty points from USD cents
   * @param {number} usdCents - Amount in USD cents
   * @returns {number} Loyalty points earned
   */
  calculateLoyaltyPoints(usdCents) {
    return Math.floor(usdCents / 100) * this.LOYALTY_POINTS_PER_DOLLAR;
  },
  
  /**
   * Get loyalty tier from points
   * @param {number} points - Current loyalty points
   * @returns {object} Tier info {name, min, max}
   */
  getLoyaltyTier(points) {
    for (const [key, tier] of Object.entries(this.LOYALTY_TIERS)) {
      if (points >= tier.min && points <= tier.max) {
        return { ...tier, key };
      }
    }
    return this.LOYALTY_TIERS.BRONZE;
  }
};

// Export individual values for backward compatibility
export const USD_TO_GOLD_RATE = ECONOMY_CONFIG.USD_TO_GOLD_RATE;
export const VIRTUAL_PRICES = ECONOMY_CONFIG.VIRTUAL_PRICES;
export const LOYALTY_TIERS = ECONOMY_CONFIG.LOYALTY_TIERS;
export const STARTING_GOLD = ECONOMY_CONFIG.STARTING_GOLD;
