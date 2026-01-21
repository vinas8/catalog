/**
 * Config Barrel Export
 * Re-exports all configuration modules
 */

export { APP_CONFIG, GAME_NAME, GAME_DISPLAY_NAME } from './app-config.js';
export { FEATURE_FLAGS } from './feature-flags.js';
export { STRIPE_CONFIG } from './stripe-config.js';
export { WORKER_CONFIG, PAGE_URLS } from './worker-config.js';
export { URLS, WORKER_URL } from './urls.js';
export { 
  VERSION_CONFIG, 
  VERSION, 
  MODULE_VERSION,
  SMRI_TOTAL_SCENARIOS,
  getVersion,
  getFullVersion,
  getModuleVersion,
  getSMRIScenario,
  isCompatibleVersion
} from './version.js';
