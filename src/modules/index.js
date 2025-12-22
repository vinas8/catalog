/**
 * Serpent Town - Module Registry
 * Control which modules are active
 */

import * as common from './common/index.js';
import * as auth from './auth/index.js';
import * as payment from './payment/index.js';
import * as game from './game/index.js';
import * as shop from './shop/index.js';

export const MODULES = {
  common: { enabled: common.ENABLED, module: common },
  auth: { enabled: auth.ENABLED, module: auth },
  payment: { enabled: payment.ENABLED, module: payment },
  game: { enabled: game.ENABLED, module: game },
  shop: { enabled: shop.ENABLED, module: shop }
};

/**
 * Get active modules
 */
export function getActiveModules() {
  return Object.entries(MODULES)
    .filter(([_, config]) => config.enabled)
    .reduce((acc, [name, config]) => {
      acc[name] = config.module;
      return acc;
    }, {});
}

/**
 * Check if module is enabled
 */
export function isModuleEnabled(moduleName) {
  return MODULES[moduleName]?.enabled || false;
}

/**
 * Get module by name (returns null if disabled)
 */
export function getModule(moduleName) {
  const moduleConfig = MODULES[moduleName];
  if (!moduleConfig || !moduleConfig.enabled) {
    return null;
  }
  return moduleConfig.module;
}
