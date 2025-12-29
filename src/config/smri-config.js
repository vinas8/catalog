/**
 * SMRI Module and Scenario Configuration
 * Central source of truth for SMRI codes
 * Use these constants instead of hardcoding S numbers
 */

export const SMRI_MODULES = {
  HEALTH: '0',
  SHOP: '1',
  GAME: '2',
  AUTH: '3',
  PAYMENT: '4',
  WORKER: '5',
  UTILS: '6',
  KV: '11.1',
  CF_RUNTIME: '11.2',
  CF_CDN: '11.3',
  STRIPE: '12',
  STRIPE_CHECKOUT: '12.1',
  STRIPE_WEBHOOKS: '12.2',
  GITHUB_PAGES: '13.1'
};

export const SMRI_SUBMODULES = {
  GAME_TUTORIAL: '2-7',    // Tutorial under Game
  GAME_INVENTORY: '2-8',   // Inventory under Game
  GAME_CARE: '2-9',        // Care mechanics under Game
  // Add more as needed
};

/**
 * Build SMRI code from module, relations, and version
 * @param {string} module - Module number (e.g., '2-7', '1', '5')
 * @param {string[]} relations - Array of relation numbers (e.g., ['5', '11.1'])
 * @param {string} version - Version number (default '01')
 * @returns {string} Complete SMRI code (e.g., 'S2-7.5,11.1.01')
 */
export function buildSmriCode(module, relations, version = '01') {
  const relStr = Array.isArray(relations) ? relations.join(',') : relations;
  return `S${module}.${relStr}.${version}`;
}

/**
 * Scenario metadata structure
 */
export class SmriScenario {
  constructor({ id, module, relations, version = '01', priority = 'P1', description = '' }) {
    this.id = id;
    this.module = module;
    this.relations = relations;
    this.version = version;
    this.priority = priority;
    this.description = description;
  }

  get smriCode() {
    return buildSmriCode(this.module, this.relations, this.version);
  }

  get fullName() {
    return `${this.smriCode} - ${this.description}`;
  }
}

/**
 * Tutorial scenarios (S2-7.x)
 */
export const TUTORIAL_SCENARIOS = {
  HAPPY_PATH: new SmriScenario({
    id: 'tutorial-happy-path',
    module: SMRI_SUBMODULES.GAME_TUTORIAL,
    relations: [SMRI_MODULES.WORKER, SMRI_MODULES.KV],
    version: '01',
    priority: 'P0',
    description: 'Happy Path (Daily Check-in)'
  }),
  
  MISSED_CARE: new SmriScenario({
    id: 'tutorial-missed-care',
    module: SMRI_SUBMODULES.GAME_TUTORIAL,
    relations: [SMRI_MODULES.WORKER, SMRI_MODULES.KV],
    version: '02',
    priority: 'P0',
    description: 'Missed Care (2-3 Days)'
  }),
  
  EDUCATION_COMMERCE: new SmriScenario({
    id: 'tutorial-education-commerce',
    module: SMRI_SUBMODULES.GAME_TUTORIAL,
    relations: [SMRI_MODULES.SHOP, SMRI_MODULES.WORKER, SMRI_MODULES.KV],
    version: '03',
    priority: 'P0',
    description: 'Education-First Commerce'
  }),
  
  TRUST_PROTECTION: new SmriScenario({
    id: 'tutorial-trust-protection',
    module: SMRI_SUBMODULES.GAME_TUTORIAL,
    relations: [SMRI_MODULES.SHOP, SMRI_MODULES.WORKER, SMRI_MODULES.KV],
    version: '04',
    priority: 'P0',
    description: 'Trust Protection'
  }),
  
  EMAIL_REENTRY: new SmriScenario({
    id: 'tutorial-email-reentry',
    module: SMRI_SUBMODULES.GAME_TUTORIAL,
    relations: [SMRI_MODULES.WORKER, SMRI_MODULES.KV],
    version: '05',
    priority: 'P1',
    description: 'Email-Driven Re-entry'
  }),
  
  FAILURE_EDUCATIONAL: new SmriScenario({
    id: 'tutorial-failure-educational',
    module: SMRI_SUBMODULES.GAME_TUTORIAL,
    relations: [SMRI_MODULES.WORKER, SMRI_MODULES.KV],
    version: '06',
    priority: 'P1',
    description: 'Failure Case (Educational)'
  })
};

/**
 * Get all tutorial scenarios as array
 */
export function getTutorialScenarios() {
  return Object.values(TUTORIAL_SCENARIOS);
}

/**
 * Get scenario by ID
 */
export function getScenarioById(id) {
  return Object.values(TUTORIAL_SCENARIOS).find(s => s.id === id);
}

/**
 * Example usage:
 * 
 * import { TUTORIAL_SCENARIOS } from './src/config/smri-config.js';
 * 
 * const scenario = TUTORIAL_SCENARIOS.HAPPY_PATH;
 * console.log(scenario.smriCode);  // "S2-7.5,11.1.01"
 * console.log(scenario.fullName);  // "S2-7.5,11.1.01 - Happy Path (Daily Check-in)"
 */
