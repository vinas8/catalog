/**
 * SMRI Configuration - Central Source of Truth
 * Format: S{M}.{RRR}.{II}
 * 
 * - S = Scenario prefix
 * - M = Primary module (0-13)
 * - RRR = Relations (comma-separated)
 * - II = Iteration (01-99)
 * 
 * Separators:
 * - DOT (.) = Separates parts
 * - COMMA (,) = Separates modules
 * - DASH (-) = External services (5-1=KV, 5-2=Stripe)
 */

/**
 * SMRI Registry - URL to S Number mapping
 * Key: URL/identifier (kebab-case)
 * Value: SMRI code (S{M}.{RRR}.{II})
 */
export const SMRI_REGISTRY = {
  // === S0: Health Checks ===
  'healthcheck': 'S0.0.01',
  'health-generic': 'S0.0.01',
  'demo-mode': 'S0.0.02',
  'cleanup': 'S0.0.03',
  'shop-rendering': 'S0.1.01',
  'game-mechanics': 'S0.2.01',
  'auth-validation': 'S0.3.01',
  'stripe-integration': 'S0.4.01',
  'worker-kv': 'S0.5,5-1.01',
  'kv-storage': 'S0.11,5-1.01',
  'webhooks': 'S0.12,5-2.01',
  'all-health-checks': 'S0.1,2,3,4,5,5-1,5-2.01',

  // === S1: Shop ===
  'catalog-display': 'S1.1.01',
  'product-availability': 'S1.1.01',
  'csv-import': 'S1.1.02',
  'buy-five-snakes': 'S1.1,2.02',
  'duplicate-morph': 'S1.1,2.03',
  'email-receipt': 'S1.1,4.01',
  'returning-user-purchase': 'S1.1,2,3,4.01',
  'happy-path-purchase': 'S1.1,2,3,4,5.01',
  'purchase-flow': 'S1.1,2,3,4,5.01',
  'real-snake-completeness': 'S1.2,11.1.01',
  'success-page': 'S1.5.01',

  // === S2: Game ===
  'stats-display': 'S2.2.01',
  'hunger-decay': 'S2.2.02',
  'feed-water': 'S2.2.03',
  'clean-habitat': 'S2.2.04',
  'equipment-shop': 'S2.2.05',
  'multi-snake': 'S2.2.06',
  'death-event': 'S2.2.07',
  'breeding-check': 'S2.2.08',
  'offspring-calculate': 'S2.2.09',
  'auto-save': 'S2.5,5-1.01',
  'breeding-calc': 'S2.2,3.01',
  'collection-view': 'S2.2.10',
  'game-tamagotchi': 'S2.2.11',
  'aquarium-shelf-system': 'S2.2.12',
  'gamified-shop': 'S2.1,2.01',
  
  // === S2: Tutorial (S2.7.x) ===
  'tutorial-happy-path': 'S2.7,5,5-1.01',
  'tutorial-missed-care': 'S2.7,5,5-1.02',
  'tutorial-education-commerce': 'S2.1,7,5,5-1.03',
  'tutorial-trust-protection': 'S2.1,7,5,5-1.04',
  'tutorial-email-reentry': 'S2.7,5,5-1.05',
  'tutorial-failure-educational': 'S2.7,5,5-1.06',

  // === S3: Auth ===
  'anonymous-user': 'S3.3.01',
  'hash-validation': 'S3.3.02',
  'loyalty-points': 'S3.3.03',
  'data-export': 'S3.3.04',
  'data-wipe': 'S3.3.05',
  'multi-device': 'S3.3,5-1.01',
  'purchase-history': 'S3.3,5-1.02',
  'account-page': 'S3.3.06',
  'calculator-genetics-data': 'S3.2,3.01',

  // === S4: Payment ===
  'stripe-session': 'S4.4,5.01',
  'refund-check': 'S4.4.02',
  'webhook-success': 'S4.4,5-2.01',
  'webhook-failure': 'S4.4,5-2.02',
  'idempotency': 'S4.4,5-2.03',
  'email-receipt-payment': 'S4.4,5-2.04',

  // === S5: Worker ===
  'products-endpoint': 'S5.5,5-1.01',
  'upload-products': 'S5.5.01',
  'sync-stripe-kv': 'S5.5,5-1.02',
  'kv-read-write': 'S5.5-1.01',
  'kv-list': 'S5.5-1.02',
  'user-save': 'S5.3,5-1.01',
  'user-load': 'S5.3,5-1.02',
  'webhook-signature': 'S5.5-2.01',
  'webhook-handler': 'S5.4,5-2.01',
  'error-recovery': 'S5.5.02',
  'rate-limiting': 'S5.5.03',
  'game-state-sync': 'S5.2,5-1.04',
  'worker-api': 'S5.5.04',
  'kv-storage-worker': 'S5.5-1.03',

  // === E2E & Debug UI ===
  'fluent-customer-journey': 'S1.1,2,3.09',
};

/**
 * Get SMRI code by URL/identifier
 */
export function getSmriCode(urlKey) {
  return SMRI_REGISTRY[urlKey] || null;
}

/**
 * Get URL/identifier by SMRI code
 */
export function getUrlBySmri(smriCode) {
  return Object.keys(SMRI_REGISTRY).find(key => SMRI_REGISTRY[key] === smriCode) || null;
}
