/**
 * SMRI Test Scenarios
 * Comprehensive test scenario definitions for Snake Muffin v0.8.0
 * 
 * Format: { id, title, smri, url, icon, [autoRun] }
 * - id: Unique identifier (kebab-case)
 * - title: Human-readable test name
 * - smri: SMRI scenario code (e.g., 'S1.1,2,3,4,5.01')
 * - url: Page to test (null for API-only tests)
 * - icon: Emoji for UI
 * - autoRun: Auto-execute on page load (optional)
 * 
 * Modules:
 * - S0: System Health (11 scenarios)
 * - S1: Shop (6 scenarios)
 * - S2: Game (10 scenarios)
 * - S3: Auth (7 scenarios)
 * - S4: Payment (6 scenarios)
 * - S5: Worker/KV/Webhooks (13 scenarios)
 */

const SMRI_SCENARIOS = [
  {
    id: 'csv-import',
    title: 'CSV Import & Sync',
    smri: 'S2-csv-import',
    url: null,
    icon: '📤',
    autoRun: true
  },
  // === SHOP MODULE (S1) - 6 scenarios ===
  {
    id: 's1-happy-path',
    title: 'S1: Happy Path Purchase',
    smri: 'S1.1,2,3,4,5.01',
    url: '../catalog.html',
    icon: '🛒',
    status: '📝',
    scenarioFile: '../.smri/scenarios/S1-happy-path-purchase.md'
  },
  {
    id: 's1-returning-user',
    title: 'S1: Returning User Purchase',
    smri: 'S1.1,2,3,4.01',
    url: '../catalog.html',
    icon: '🔄',
    status: '📝',
    scenarioFile: '../.smri/scenarios/S1-returning-user-purchase.md'
  },
  {
    id: 's1-product-availability',
    title: 'S1: Product Availability Check',
    smri: 'S1.1.01',
    url: '../catalog.html',
    icon: '✅',
    status: '📝',
    scenarioFile: '../.smri/scenarios/S1-product-availability.md'
  },
  {
    id: 's1-buy-five',
    title: 'S1: Buy 5 Snakes',
    smri: 'S1.1,2.02',
    url: '../catalog.html',
    icon: '🛍️',
    status: '📝',
    scenarioFile: '../.smri/scenarios/S1-buy-five-snakes.md'
  },
  {
    id: 's1-buy-duplicate',
    title: 'S1: Buy Duplicate Snake',
    smri: 'S1.1,2.03',
    url: '../catalog.html',
    icon: '🐍🐍',
    status: '📝',
    scenarioFile: '../.smri/scenarios/S1-duplicate-morph.md'
  },
  {
    id: 's1-email-receipt',
    title: 'S1: Email Receipt Delivery',
    smri: 'S1.1,4.01',
    url: null,
    icon: '📧',
    status: '📝',
    scenarioFile: '../.smri/scenarios/S1-email-receipt.md'
  },
  // === ORIGINAL SCENARIOS ===
  {
    id: 'purchase-flow',
    title: 'S1: Purchase Flow',
    smri: 'S1-purchase-flow',
    url: '../catalog.html',
    icon: '🛒'
  },
  { id: 'catalog', title: '1. Browse Catalog', url: '../catalog.html', icon: '🛒' },
  { id: 'product', title: '2. Select Product', url: '../catalog.html', icon: '🐍' },
  { id: 'checkout', title: '3. Stripe Checkout', url: null, icon: '💳' },
  { id: 'success', title: '4. Success Page', url: '../success.html', icon: '✅' },
  { id: 'collection', title: '5. View Collection', url: '../collection.html', icon: '📚' },
  { id: 'game', title: '6. Play Game', url: '../game.html', icon: '🎮' },
  {
    id: 'catalog-display',
    title: 'Catalog Product Display',
    smri: 'S1-catalog-display',
    url: '../catalog.html',
    icon: '🛒'
  },
  {
    id: 'success-page',
    title: 'Success Page Validation',
    smri: 'S1-success-page',
    url: '../success.html',
    icon: '✅'
  },
  {
    id: 'collection-view',
    title: 'Collection View',
    smri: 'S2-collection-view',
    url: '../collection.html',
    icon: '📚'
  },
  {
    id: 'game-tamagotchi',
    title: 'Game Tamagotchi Mode',
    smri: 'S2-game-tamagotchi',
    url: '../game.html',
    icon: '🎮'
  },
  {
    id: 'account-page',
    title: 'Account Management',
    smri: 'S3-account-page',
    url: '../account.html',
    icon: '👤'
  },
  // === SYSTEM HEALTH (S0) - 11 scenarios ===
  {
    id: 's0-generic-health',
    title: 'S0: Generic Debug Health',
    smri: 'S0.0.01',
    url: 'healthcheck.html',
    icon: '🏥'
  },
  {
    id: 's0-shop-rendering',
    title: 'S0: Shop Product Rendering',
    smri: 'S0-1.1.01',
    url: '../catalog.html',
    icon: '🛒'
  },
  {
    id: 's0-game-mechanics',
    title: 'S0: Game Mechanics Check',
    smri: 'S0-2.2.01',
    url: '../game.html',
    icon: '🎮'
  },
  {
    id: 's0-auth-validation',
    title: 'S0: Auth User Validation',
    smri: 'S0-3.3.01',
    url: '../account.html',
    icon: '🔐'
  },
  {
    id: 's0-payment-stripe',
    title: 'S0: Payment Stripe Check',
    smri: 'S0-4.4.01',
    url: null,
    icon: '💳'
  },
  {
    id: 's0-worker-api-check',
    title: 'S0: Worker API Check',
    smri: 'S0-5.5,5-1.01',
    url: null,
    icon: '☁️'
  },
  {
    id: 's0-kv-health',
    title: 'S0: KV Storage Health',
    smri: 'S0-11.5-1.01',
    url: null,
    icon: '💾'
  },
  {
    id: 's0-webhooks',
    title: 'S0: Stripe Webhooks',
    smri: 'S0-12.5-2.01',
    url: null,
    icon: '🔔'
  },
  {
    id: 's0-full-system',
    title: 'S0: Full System Health',
    smri: 'S0.1,2,3,4,5,5-1,5-2.03',
    url: 'healthcheck.html',
    icon: '✅'
  },
  {
    id: 's0-virtual-demo',
    title: 'S0: Virtual Snakes Demo',
    smri: 'S0.0.02',
    url: '../catalog.html',
    icon: '👻'
  },
  {
    id: 's0-cleanup',
    title: 'S0: Storage Cleanup',
    smri: 'S0.0.03',
    url: 'data-manager.html',
    icon: '🗑️'
  },
  // === GAME MODULE (S2) - 10 scenarios ===
  {
    id: 's2-stats-display',
    title: 'S2: View Snake Stats',
    smri: 'S2.2.01',
    url: '../game.html',
    icon: '📊'
  },
  {
    id: 's2-hunger-decay',
    title: 'S2: Hunger/Thirst Decay',
    smri: 'S2.2.02',
    url: '../game.html',
    icon: '⏱️'
  },
  {
    id: 's2-feed-water',
    title: 'S2: Feed & Water Actions',
    smri: 'S2.2.03',
    url: '../game.html',
    icon: '🍖'
  },
  {
    id: 's2-clean-habitat',
    title: 'S2: Clean Habitat Action',
    smri: 'S2.2.04',
    url: '../game.html',
    icon: '🧹'
  },
  {
    id: 's2-equipment-shop',
    title: 'S2: Equipment Shop Purchase',
    smri: 'S2.2.05',
    url: '../game.html',
    icon: '🛠️'
  },
  {
    id: 's2-auto-save',
    title: 'S2: Auto-Save to KV',
    smri: 'S2.5,5-1.01',
    url: '../game.html',
    icon: '💾'
  },
  {
    id: 's2-multi-snake',
    title: 'S2: Multi-Snake Management',
    smri: 'S2.2.06',
    url: '../game.html',
    icon: '🐍🐍🐍'
  },
  {
    id: 's2-death-event',
    title: 'S2: Snake Death Event',
    smri: 'S2.2.07',
    url: '../game.html',
    icon: '💀'
  },
  {
    id: 's2-breeding-check',
    title: 'S2: Breeding Compatibility',
    smri: 'S2.2.08',
    url: 'calc/index.html',
    icon: '🧬'
  },
  {
    id: 's2-offspring-calculate',
    title: 'S2: Offspring Calculation',
    smri: 'S2.2.09',
    url: 'calc/index.html',
    icon: '🥚'
  },
  // === AUTH MODULE (S3) - 7 scenarios ===
  {
    id: 's3-anonymous-user',
    title: 'S3: Anonymous User Creation',
    smri: 'S3.3.01',
    url: '../account.html',
    icon: '👤'
  },
  {
    id: 's3-hash-validation',
    title: 'S3: Hash Validation',
    smri: 'S3.3.02',
    url: '../account.html',
    icon: '🔐'
  },
  {
    id: 's3-multi-device',
    title: 'S3: Multi-Device Sync',
    smri: 'S3.3,5-1.01',
    url: '../account.html',
    icon: '📱💻'
  },
  {
    id: 's3-loyalty-points',
    title: 'S3: Loyalty Points System',
    smri: 'S3.3.03',
    url: '../account.html',
    icon: '⭐'
  },
  {
    id: 's3-purchase-history',
    title: 'S3: Purchase History View',
    smri: 'S3.3,5-1.02',
    url: '../account.html',
    icon: '📜'
  },
  {
    id: 's3-data-export',
    title: 'S3: User Data Export',
    smri: 'S3.3.04',
    url: '../account.html',
    icon: '📦'
  },
  {
    id: 's3-data-wipe',
    title: 'S3: Account Data Wipe',
    smri: 'S3.3.05',
    url: '../account.html',
    icon: '🗑️'
  },
  // === PAYMENT MODULE (S4) - 6 scenarios ===
  {
    id: 's4-stripe-session',
    title: 'S4: Create Stripe Session',
    smri: 'S4.4,5.01',
    url: null,
    icon: '💳'
  },
  {
    id: 's4-webhook-success',
    title: 'S4: Webhook Success Event',
    smri: 'S4.4,5-2.01',
    url: null,
    icon: '✅'
  },
  {
    id: 's4-webhook-failure',
    title: 'S4: Webhook Failure Event',
    smri: 'S4.4,5-2.02',
    url: null,
    icon: '❌'
  },
  {
    id: 's4-idempotency',
    title: 'S4: Payment Idempotency',
    smri: 'S4.4,5-2.03',
    url: null,
    icon: '🔁'
  },
  {
    id: 's4-refund-check',
    title: 'S4: Refund Processing',
    smri: 'S4.4.02',
    url: null,
    icon: '💸'
  },
  {
    id: 's4-email-receipt',
    title: 'S4: Email Receipt Delivery',
    smri: 'S4.4,5-2.04',
    url: null,
    icon: '📧'
  },
  // === WORKER MODULE (S5) - 13 scenarios ===
  {
    id: 's5-products-endpoint',
    title: 'S5: /products Endpoint',
    smri: 'S5.5,5-1.01',
    url: null,
    icon: '🔌'
  },
  {
    id: 's5-upload-products',
    title: 'S5: /upload-products API',
    smri: 'S5.5.01',
    url: null,
    icon: '📤'
  },
  {
    id: 's5-sync-stripe-kv',
    title: 'S5: Sync Stripe → KV',
    smri: 'S5.5,5-1.02',
    url: null,
    icon: '🔄'
  },
  {
    id: 's5-kv-read-write',
    title: 'S5: KV Read/Write/Delete',
    smri: 'S5.5-1.01',
    url: null,
    icon: '💾'
  },
  {
    id: 's5-kv-list',
    title: 'S5: KV List Keys',
    smri: 'S5.5-1.02',
    url: null,
    icon: '📋'
  },
  {
    id: 's5-user-save',
    title: 'S5: User State Save',
    smri: 'S5.3,5-1.01',
    url: null,
    icon: '💾'
  },
  {
    id: 's5-user-load',
    title: 'S5: User State Load',
    smri: 'S5.3,5-1.02',
    url: null,
    icon: '📥'
  },
  {
    id: 's5-webhook-signature',
    title: 'S5: Webhook Signature Verify',
    smri: 'S5.5-2.01',
    url: null,
    icon: '🔒'
  },
  {
    id: 's5-webhook-success',
    title: 'S5: Webhook Success Handler',
    smri: 'S5.4,5-2.01',
    url: null,
    icon: '✅'
  },
  {
    id: 's5-error-recovery',
    title: 'S5: Error Recovery Logic',
    smri: 'S5.5.02',
    url: null,
    icon: '🔧'
  },
  {
    id: 's5-rate-limiting',
    title: 'S5: Rate Limiting Check',
    smri: 'S5.5.03',
    url: null,
    icon: '⏱️'
  },
  {
    id: 's5-game-state-sync',
    title: 'S5: Game State Sync',
    smri: 'S5.2,5-1.04',
    url: '../game.html',
    icon: '🐍'
  },
  {
    id: 's5-concurrent-webhooks',
    title: 'S5: Concurrent Webhooks',
    smri: 'S5.4,5,5-2.02',
    url: null,
    icon: '⚡'
  },
  {
    id: 'breeding-calculator',
    title: 'Breeding Calculator',
    smri: 'S2-breeding-calc',
    url: 'calc/index.html',
    icon: '🧬'
  },
  {
    id: 'healthcheck',
    title: 'System Healthcheck',
    smri: 'S0-healthcheck',
    url: 'healthcheck.html',
    icon: '🏥'
  },
  {
    id: 'worker-api',
    title: 'Worker API Check',
    smri: 'S5-worker-api',
    url: null,
    icon: '☁️'
  },
  {
    id: 'kv-storage',
    title: 'KV Storage Test',
    smri: 'S5-1-kv-storage',
    url: null,
    icon: '💾'
  },
  {
    id: 'import-page',
    title: 'CSV Import Page',
    smri: 'S1-csv-import',
    url: '../import.html',
    icon: '📥'
  }
];

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { SMRI_SCENARIOS };
}
