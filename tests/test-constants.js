/**
 * Test Constants - Single Source of Truth
 * 
 * All test counts, timeouts, and magic numbers defined here.
 * Code should import and use these instead of hardcoding values.
 */

// ============================================
// TEST COUNTS (Actual working tests)
// ============================================

export const TEST_COUNTS = {
  // Real automated tests
  UNIT: 15,              // tests/modules/shop/game.test.js
  SNAPSHOT: 71,          // tests/snapshot/structure-validation.test.js
  SMRI_SCENARIOS: 2,     // tests/smri/scenario-runner.test.js
  
  // Totals
  TOTAL_AUTOMATED: 88,   // Sum of above
  TOTAL_PASSING: 86,     // Known passing tests
  TOTAL_FAILING: 2,      // Known failing tests (missing titles)
  
  // Roadmap (not automated yet)
  ROADMAP_SCENARIOS: 59, // src/config/version.js SMRI_SCENARIOS array
  ROADMAP_COMPLETED: 9,  // Scenarios marked 100% in version.js
  
  // UI Mockups (visual only, not automated)
  TUTORIAL_MOCKUPS: 6,   // /debug/tutorial-*.html files
  
  // Pass rates
  get PASS_RATE() {
    return Math.round((this.TOTAL_PASSING / this.TOTAL_AUTOMATED) * 100);
  },
  
  get ROADMAP_PROGRESS() {
    return Math.round((this.ROADMAP_COMPLETED / this.ROADMAP_SCENARIOS) * 100);
  }
};

// ============================================
// TEST TIMEOUTS
// ============================================

export const TEST_TIMEOUTS = {
  UNIT: 5000,            // 5 seconds for unit tests
  INTEGRATION: 10000,    // 10 seconds for integration tests
  E2E: 20000,            // 20 seconds for E2E tests
  WORKER_API: 15000,     // 15 seconds for worker API calls
  SLOW: 30000            // 30 seconds for slow tests
};

// ============================================
// SMRI MODULE CODES
// ============================================

export const SMRI_MODULES = {
  HEALTH: 'S0',
  SHOP: 'S1',
  GAME: 'S2',
  AUTH: 'S3',
  PAYMENT: 'S4',
  WORKER: 'S5',
  COMMON: 'S6'
};

// Old S7 module (deprecated, merged into S2-tutorial)
export const SMRI_DEPRECATED = {
  TUTORIAL_OLD: 'S7'  // Use S2-tutorial-* instead
};

// ============================================
// GAME CONSTANTS
// ============================================

export const GAME_DEFAULTS = {
  STARTING_GOLD: 1000,
  STAT_MAX: 100,
  STAT_MIN: 0,
  LOYALTY_POINTS_START: 0
};

export const LOYALTY_TIERS = {
  BRONZE: {
    name: 'Bronze',
    points_required: 0,
    discount: 0
  },
  SILVER: {
    name: 'Silver',
    points_required: 100,
    discount: 0.05  // 5%
  },
  GOLD: {
    name: 'Gold',
    points_required: 500,
    discount: 0.10  // 10%
  },
  PLATINUM: {
    name: 'Platinum',
    points_required: 1500,
    discount: 0.15  // 15%
  }
};

export const VIRTUAL_SNAKE_PRICES = {
  BALL_PYTHON: 1000,
  CORN_SNAKE: 800
};

// ============================================
// EQUIPMENT CATALOG
// ============================================

export const EQUIPMENT_REQUIREMENTS = {
  MIN_ITEMS: 15  // Minimum equipment items required in catalog
};

// ============================================
// STRIPE TEST DATA
// ============================================

export const STRIPE_TEST = {
  PRODUCT_PRICE: 100.00,     // $100 test product
  PRICE_CENTS: 10000,        // 100.00 * 100
  WEIGHT_GRAMS: 150,
  CURRENCY: 'eur'
};

// ============================================
// CLOUDFLARE KV
// ============================================

export const KV_CONFIG = {
  NAMESPACE_ID: 'ecbcb79f3df64379863872965f993991',
  COLLECTION_PREFIX: 'collection:'
};

// ============================================
// USER HASH GENERATION
// ============================================

export const USER_HASH = {
  LENGTH: 15,  // Random hash length for tests
  get generate() {
    return Math.random().toString(36).substring(2, 2 + this.LENGTH);
  }
};

// ============================================
// TEST ASSERTIONS
// ============================================

export const ASSERTIONS = {
  SNAPSHOT_MIN_PASSED: 68,   // Minimum passing snapshot tests
  SNAPSHOT_TOTAL: 71,        // Total snapshot tests
  UNIT_MIN_PASSED: 15,       // Minimum passing unit tests
  UNIT_TOTAL: 15             // Total unit tests
};

// ============================================
// HELPERS
// ============================================

export function getTestSummary() {
  return {
    automated: {
      unit: TEST_COUNTS.UNIT,
      snapshot: TEST_COUNTS.SNAPSHOT,
      smri: TEST_COUNTS.SMRI_SCENARIOS,
      total: TEST_COUNTS.TOTAL_AUTOMATED,
      passing: TEST_COUNTS.TOTAL_PASSING,
      failing: TEST_COUNTS.TOTAL_FAILING,
      passRate: TEST_COUNTS.PASS_RATE
    },
    roadmap: {
      scenarios: TEST_COUNTS.ROADMAP_SCENARIOS,
      completed: TEST_COUNTS.ROADMAP_COMPLETED,
      progress: TEST_COUNTS.ROADMAP_PROGRESS
    },
    mockups: {
      tutorials: TEST_COUNTS.TUTORIAL_MOCKUPS
    }
  };
}

export function getSMRICode(module, feature, version = null) {
  const versionSuffix = version ? `-${version}` : '';
  return `${module}-${feature}${versionSuffix}`;
}

export default {
  TEST_COUNTS,
  TEST_TIMEOUTS,
  SMRI_MODULES,
  SMRI_DEPRECATED,
  GAME_DEFAULTS,
  LOYALTY_TIERS,
  VIRTUAL_SNAKE_PRICES,
  EQUIPMENT_REQUIREMENTS,
  STRIPE_TEST,
  KV_CONFIG,
  USER_HASH,
  ASSERTIONS,
  getTestSummary,
  getSMRICode
};
