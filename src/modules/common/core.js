// Core logic: the only place with behavior.
// Responsibilities:
// - plugin registry & validation
// - creating runtime pet instances
// - applying decay and actions
// - small helper utilities

import { CARE_STATS, DEFAULTS } from './constants.js';

const _plugins = new Map();

/**
 * Load plugin objects (pure data). Validates plugin contract.
 * Each plugin must be a plain object and must not contain functions.
 */
export function loadPlugins(plugins = []) {
  for (const p of plugins) {
    if (typeof p !== 'object' || p === null) {
      throw new Error('Plugin must be a plain object');
    }
    // ensure no functions inside plugin (shallow check)
    for (const k of Object.keys(p)) {
      if (typeof p[k] === 'function') {
        throw new Error(`Plugin property "${k}" is a function; plugins must not contain functions`);
      }
    }
    if (!p.id) throw new Error('Plugin must have an id');
    _plugins.set(p.id, p);
  }
}

/**
 * Retrieve plugin by id.
 */
export function getPluginById(id) {
  return _plugins.get(id);
}

/**
 * Get care profile for a given entity def (plugin entities should reference a care_profile id).
 * Returns a plain object mapping care stat -> { decay, min }
 */
export function getCareProfileForEntity(entityDef) {
  if (!entityDef || !entityDef.care_profile) return {};
  // search plugins for a care_profiles map
  for (const p of _plugins.values()) {
    if (p.care_profiles && p.care_profiles[entityDef.care_profile]) {
      return p.care_profiles[entityDef.care_profile];
    }
  }
  return {};
}

/**
 * Create an in-memory pet instance for UI interactions.
 * Instance contains:
 * - id
 * - name
 * - care: { hunger, clean }
 */
export function createPetInstance(entityDef, careProfile = {}) {
  const initial = {};
  initial[CARE_STATS.HUNGER] = DEFAULTS.STAT_MAX;
  initial[CARE_STATS.CLEAN] = DEFAULTS.STAT_MAX;
  // Apply any entity-level default overrides
  if (entityDef && entityDef.initial_care) {
    Object.assign(initial, entityDef.initial_care);
  }
  return {
    id: entityDef.id,
    name: entityDef.name,
    care: { ...initial }
  };
}

/**
 * Apply decay to an instance using the care profile.
 * Mutates the instance.care in-place.
 */
export function applyDecay(instance, profile = {}) {
  for (const [stat, cfg] of Object.entries(profile)) {
    if (typeof instance.care[stat] !== 'number') continue;
    const decay = Number(cfg.decay || 0);
    const min = Number(cfg.min ?? DEFAULTS.STAT_MIN);
    instance.care[stat] = Math.max(min, Math.round(instance.care[stat] - decay));
  }
}

/**
 * Apply an action to an instance.
 * Action IDs (MVP): 'feed' => set hunger to max, 'clean' => set clean to max.
 * All logic lives here. Plugins provide labels only.
 */
export function applyAction(actionId, instance, profile = {}) {
  if (!instance || !instance.care) return;
  switch (actionId) {
    case 'feed':
      instance.care[CARE_STATS.HUNGER] = DEFAULTS.STAT_MAX;
      break;
    case 'clean':
      instance.care[CARE_STATS.CLEAN] = DEFAULTS.STAT_MAX;
      break;
    default:
      // unknown actions do nothing
      break;
  }
}

/**
 * Simple client-side demo collection (used if backend not available).
 * Keyed by email.
 */
const DEMO_COLLECTIONS = {
  'demo@serpent.town': ['corn_snake']
};

export function getDemoCollection(email) {
  return DEMO_COLLECTIONS[email] || [];
}

/**
 * Utility: return the full plugins map (for tests)
 */
export function _getPluginsForTest() {
  return _plugins;
}
