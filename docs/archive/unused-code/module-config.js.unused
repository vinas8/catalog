// Module Configuration - Enable/Disable Features with One Line
// Set enabled: false to disable a module completely

export const MODULE_CONFIG = {
  payment: { 
    enabled: true, 
    path: 'modules/payment',
    description: 'Stripe payment integration and webhooks'
  },
  shop: { 
    enabled: true, 
    path: 'modules/shop',
    description: 'Product catalog, breeding economy, shop UI'
  },
  game: { 
    enabled: true, 
    path: 'modules/game',
    description: 'Tamagotchi mechanics, snake care, stats'
  },
  auth: { 
    enabled: true, 
    path: 'modules/auth',
    description: 'User authentication and hash-based identity'
  },
  common: { 
    enabled: true, 
    path: 'modules/common',
    description: 'Shared utilities and helpers'
  }
};

/**
 * Check if a module is enabled
 * @param {string} moduleName - Module name (payment, shop, game, auth, common)
 * @returns {boolean}
 */
export function isModuleEnabled(moduleName) {
  return MODULE_CONFIG[moduleName]?.enabled || false;
}

/**
 * Get all enabled modules
 * @returns {string[]}
 */
export function getEnabledModules() {
  return Object.keys(MODULE_CONFIG).filter(name => MODULE_CONFIG[name].enabled);
}
