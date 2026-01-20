/**
 * Feature Flags Configuration
 * SMRI: S0.0.02
 * 
 * Centralized feature toggles for experimental features
 */

export const FEATURE_FLAGS = {
  // Core Features
  ENABLE_SHOP: true,
  ENABLE_BREEDING: true,
  ENABLE_GENETICS: true,
  ENABLE_MORPHS: true,
  ENABLE_CATALOG: true,
  ENABLE_DEBUG: true,
  ENABLE_ANALYTICS: false,
  
  // External Flow Modules (from ../../../purchase_flow monorepo)
  USE_EXTERNAL_PURCHASE_FLOW: false,    // Shop → Auth → Payment → Worker flow
  USE_EXTERNAL_TUTORIAL_FLOW: false,    // Tutorial flow (not yet extracted)
  USE_EXTERNAL_BREEDING_FLOW: false,    // Breeding flow (not yet extracted)
  
  // Experimental Features
  ENABLE_PWA_INSTALL: true,             // PWA install prompt
  ENABLE_OFFLINE_MODE: true,            // Service worker
  
  // Business Features
  ENABLE_LOYALTY_PROGRAM: false,        // Loyalty points & tiers
  ENABLE_MULTI_TENANT: false,           // Multiple merchants
  ENABLE_SUBSCRIPTIONS: false,          // Monthly snake care plans
};

/**
 * Check if a feature is enabled
 */
export function isFeatureEnabled(flag) {
  if (!(flag in FEATURE_FLAGS)) {
    console.warn(`⚠️ Unknown feature flag: ${flag}`);
    return false;
  }
  return FEATURE_FLAGS[flag] === true;
}

/**
 * Enable a feature at runtime (for testing)
 */
export function enableFeature(flag) {
  if (flag in FEATURE_FLAGS) {
    FEATURE_FLAGS[flag] = true;
    console.log(`✅ Enabled: ${flag}`);
  }
}

/**
 * Disable a feature at runtime (for testing)
 */
export function disableFeature(flag) {
  if (flag in FEATURE_FLAGS) {
    FEATURE_FLAGS[flag] = false;
    console.log(`❌ Disabled: ${flag}`);
  }
}

/**
 * Get all flags (for debug UI)
 */
export function getAllFeatureFlags() {
  return { ...FEATURE_FLAGS };
}

// Expose to console for easy testing
if (typeof window !== 'undefined') {
  window.featureFlags = {
    check: isFeatureEnabled,
    enable: enableFeature,
    disable: disableFeature,
    all: getAllFeatureFlags
  };
}
