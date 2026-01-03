/**
 * Worker Configuration Constants
 * Version, test registry, and SMRI scenarios
 */

export const WORKER_VERSION = '0.7.1';
export const WORKER_UPDATED = '2026-01-03T12:20:00Z';

// Test Registry - Maps all tests to metadata
export const TEST_REGISTRY = {
  'api-health-check': { id: 'api-health-check', category: 'api', name: 'Health Check', file: 'tests/api/health-check.test.js', priority: 'P0', duration: 'fast', tags: ['api', 'health', 'smoke'] },
  'integration-stripe-kv-sync': { id: 'integration-stripe-kv-sync', category: 'integration', name: 'Stripe→KV Sync', file: 'tests/integration/stripe-kv-sync.test.js', priority: 'P1', duration: 'medium', tags: ['integration', 'stripe', 'kv'] },
  'integration-worker-deployment': { id: 'integration-worker-deployment', category: 'integration', name: 'Worker Deployment', file: 'tests/integration/worker-deployment.test.js', priority: 'P1', duration: 'slow', tags: ['integration', 'worker'] },
  'integration-webhook-config': { id: 'integration-webhook-config', category: 'integration', name: 'Webhook Config', file: 'tests/integration/stripe-webhook-config.test.js', priority: 'P1', duration: 'fast', tags: ['integration', 'stripe'] },
  'e2e-purchase-flow': { id: 'e2e-purchase-flow', category: 'e2e', name: 'Purchase Flow', file: 'tests/e2e/e2e-purchase-flow.sh', priority: 'P0', duration: 'slow', tags: ['e2e', 'purchase'] },
  'e2e-security-scenarios': { id: 'e2e-security-scenarios', category: 'e2e', name: 'Security Scenarios', file: 'tests/e2e/security-scenarios.test.js', priority: 'P0', duration: 'medium', tags: ['e2e', 'security'] },
  'module-game-tamagotchi': { id: 'module-game-tamagotchi', category: 'modules', name: 'Tamagotchi Logic', file: 'tests/modules/game/tamagotchi.test.js', priority: 'P1', duration: 'fast', tags: ['module', 'game'] },
  'module-shop': { id: 'module-shop', category: 'modules', name: 'Shop Module', file: 'tests/modules/shop/shop.test.js', priority: 'P1', duration: 'fast', tags: ['module', 'shop'] },
  'smri-scenario-runner': { id: 'smri-scenario-runner', category: 'smri', name: 'Scenario Runner', file: 'tests/smri/scenario-runner.test.js', priority: 'P0', duration: 'fast', tags: ['smri'] },
  'snapshot-structure': { id: 'snapshot-structure', category: 'snapshot', name: 'Structure Validation', file: 'tests/snapshot/structure-validation.test.js', priority: 'P2', duration: 'fast', tags: ['snapshot'] }
};

export const TEST_CATEGORIES = {
  'api': { name: 'API Tests', count: 1, description: 'Worker API validation' },
  'integration': { name: 'Integration Tests', count: 3, description: 'Multi-service integration' },
  'e2e': { name: 'End-to-End Tests', count: 2, description: 'Complete user journeys' },
  'modules': { name: 'Module Tests', count: 2, description: 'Individual module tests' },
  'smri': { name: 'SMRI Tests', count: 1, description: 'Scenario system tests' },
  'snapshot': { name: 'Snapshot Tests', count: 1, description: 'Structure validation' }
};

// SMRI Scenarios (tutorial flows)
export const SMRI_SCENARIOS = [
  { id: 'S2-tutorial-happy-path', module: 'S2', name: 'Daily Care Tutorial', priority: 'P0', url: 'https://vinas8.github.io/catalog/debug/tutorial-happy-path.html' },
  { id: 'S2-tutorial-missed-care', module: 'S2', name: 'Missed Care (2-3 days)', priority: 'P0', url: 'https://vinas8.github.io/catalog/debug/tutorial-missed-care.html' },
  { id: 'S2-tutorial-education-commerce', module: 'S2', name: 'Education-First Commerce', priority: 'P0', url: 'https://vinas8.github.io/catalog/debug/tutorial-education-commerce.html' },
  { id: 'S2-tutorial-trust-protection', module: 'S2', name: 'Trust Protection', priority: 'P0', url: 'https://vinas8.github.io/catalog/debug/tutorial-trust-protection.html' },
  { id: 'S2-tutorial-email-reentry', module: 'S2', name: 'Email-Driven Re-entry', priority: 'P1', url: 'https://vinas8.github.io/catalog/debug/tutorial-email-reentry.html' },
  { id: 'S2-tutorial-failure-educational', module: 'S2', name: 'Failure Case', priority: 'P1', url: 'https://vinas8.github.io/catalog/debug/tutorial-failure-educational.html' }
];
