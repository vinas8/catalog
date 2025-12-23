/**
 * SMRI Scenario Runner - Universal workflow executor
 * Used by both debug.html and E2E tests
 * 
 * Scenarios follow SMRI notation: S.M.RRR.II
 * - S = Scenario prefix
 * - M = Module owner (1-6 internal, 11+ external)
 * - RRR = Relations (can include sub-services like 11.2, 12.1)
 * - II = Instance number (01-99)
 * 
 * Internal Modules (1-6):
 * 1 = Shop
 * 2 = Game
 * 3 = Auth
 * 4 = Payment
 * 5 = Worker
 * 6 = Common
 * 
 * External Services (11+):
 * 11 = Cloudflare
 *   11.1 = KV
 *   11.2 = Workers Runtime
 *   11.3 = CDN
 * 12 = Stripe
 *   12.1 = Checkout
 *   12.2 = Webhooks
 *   12.3 = API
 * 13 = GitHub
 *   13.1 = Pages
 *   13.2 = Actions
 * 
 * Examples:
 * - S5.11.2-12.2.01 = Worker (5) relates to Cloudflare.KV (11.2) + Stripe.Webhooks (12.2)
 * - S4.12.2.01 = Payment (4) relates to Stripe.Webhooks (12.2)
 * - S1.2-4.01 = Shop (1) relates to Game (2) and Payment (4)
 */

// Configuration
const DEFAULT_WORKER_URL = 'https://catalog.navickaszilvinas.workers.dev';

/**
 * Scenario execution result structure
 */
export class ScenarioResult {
  constructor(code, status, data = {}, errors = []) {
    this.code = code;
    this.status = status; // 'pass', 'fail', 'pending'
    this.data = data;
    this.errors = errors;
    this.timestamp = new Date().toISOString();
  }

  toJSON() {
    return {
      code: this.code,
      status: this.status,
      data: this.data,
      errors: this.errors,
      timestamp: this.timestamp
    };
  }
}

/**
 * Base Scenario Executor
 * Override execute() in subclasses
 */
export class ScenarioExecutor {
  constructor(config = {}) {
    this.config = {
      workerUrl: config.workerUrl || DEFAULT_WORKER_URL,
      mockKV: config.mockKV || null,
      verbose: config.verbose || false,
      ...config
    };
  }

  /**
   * Execute scenario - override in subclasses
   * @param {Object} params - Scenario-specific parameters
   * @returns {Promise<ScenarioResult>}
   */
  async execute(params = {}) {
    throw new Error('execute() must be implemented by subclass');
  }

  /**
   * Helper: Call Worker endpoint
   */
  async callWorker(endpoint, options = {}) {
    const url = `${this.config.workerUrl}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    });

    const data = await response.json().catch(() => ({}));
    
    return {
      status: response.status,
      ok: response.ok,
      data,
      headers: Object.fromEntries(response.headers.entries())
    };
  }

  /**
   * Helper: Validate hash format
   */
  validateHash(hash) {
    return /^[a-zA-Z0-9]{32,}$/.test(hash);
  }

  /**
   * Helper: Generate test hash
   */
  generateTestHash() {
    return 'test_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
  }

  /**
   * Helper: Log (if verbose)
   */
  log(...args) {
    if (this.config.verbose) {
      console.log(`[${this.constructor.name}]`, ...args);
    }
  }
}

/**
 * Scenario Registry - Maps SMRI codes to executors
 */
export class ScenarioRegistry {
  constructor() {
    this.scenarios = new Map();
  }

  /**
   * Register a scenario executor
   * @param {string} code - SMRI code (e.g., 'S3.5.01')
   * @param {ScenarioExecutor} executor - Executor instance
   * @param {Object} metadata - Description, priority, etc.
   */
  register(code, executor, metadata = {}) {
    this.scenarios.set(code, {
      code,
      executor,
      metadata: {
        name: metadata.name || code,
        description: metadata.description || '',
        priority: metadata.priority || 'P3',
        module: this.parseModule(code),
        relations: this.parseRelations(code),
        ...metadata
      }
    });
  }

  /**
   * Get executor by SMRI code
   */
  get(code) {
    return this.scenarios.get(code);
  }

  /**
   * Get all scenarios
   */
  getAll() {
    return Array.from(this.scenarios.values());
  }

  /**
   * Get scenarios by module
   */
  getByModule(moduleNumber) {
    return this.getAll().filter(s => s.metadata.module === moduleNumber);
  }

  /**
   * Get scenarios by priority
   */
  getByPriority(priority) {
    return this.getAll().filter(s => s.metadata.priority === priority);
  }

  /**
   * Parse module number from SMRI code
   * S3.5.01 -> 3
   */
  parseModule(code) {
    const match = code.match(/^S(\d)/);
    return match ? parseInt(match[1]) : null;
  }

  /**
   * Parse relations from SMRI code
   * Handles both simple (2,4,5) and complex (11.2, 12.1) relations
   * S3.45.01 -> [4, 5]
   * S5.11.2-12.2.01 -> ['11.2', '12.2']
   */
  parseRelations(code) {
    const match = code.match(/^S\d+\.([^.]+)\./);
    if (!match) return [];
    
    const relations = match[1];
    if (relations === '0') return [];
    
    // Check if contains sub-services (dots or hyphens)
    if (relations.includes('-')) {
      // Complex: "11.2-12.2" -> ['11.2', '12.2']
      return relations.split('-').map(r => r.trim());
    } else if (relations.includes('.')) {
      // Single sub-service: "11.2" -> ['11.2']
      return [relations];
    } else {
      // Simple: "245" -> [2, 4, 5]
      return relations.split('').map(Number);
    }
  }

  /**
   * Search scenarios
   */
  search(query) {
    const lowerQuery = query.toLowerCase();
    return this.getAll().filter(s => 
      s.code.toLowerCase().includes(lowerQuery) ||
      s.metadata.name.toLowerCase().includes(lowerQuery) ||
      s.metadata.description.toLowerCase().includes(lowerQuery)
    );
  }
}

/**
 * KV Mock for testing (in-memory)
 */
export class MockKV {
  constructor() {
    this.store = new Map();
    this.writes = [];
    this.reads = [];
  }

  async get(key) {
    this.reads.push({ key, timestamp: Date.now() });
    return this.store.get(key) || null;
  }

  async put(key, value) {
    this.writes.push({ key, value, timestamp: Date.now() });
    this.store.set(key, value);
  }

  async delete(key) {
    this.writes.push({ key, value: null, timestamp: Date.now(), deleted: true });
    this.store.delete(key);
  }

  async list(prefix = '') {
    const keys = Array.from(this.store.keys())
      .filter(k => k.startsWith(prefix))
      .map(name => ({ name }));
    return { keys };
  }

  clear() {
    this.store.clear();
    this.writes = [];
    this.reads = [];
  }

  getWrites() {
    return [...this.writes];
  }

  getReads() {
    return [...this.reads];
  }

  snapshot() {
    return {
      store: Object.fromEntries(this.store),
      writes: this.writes.length,
      reads: this.reads.length
    };
  }
}

/**
 * Scenario Runner - Main orchestrator
 */
export class ScenarioRunner {
  constructor(config = {}) {
    this.config = config;
    this.registry = new ScenarioRegistry();
    this.mockKV = new MockKV();
    this.results = [];
  }

  /**
   * Run a scenario by SMRI code
   * @param {string} code - SMRI code
   * @param {Object} params - Scenario parameters
   * @returns {Promise<ScenarioResult>}
   */
  async run(code, params = {}) {
    const scenario = this.registry.get(code);
    
    if (!scenario) {
      return new ScenarioResult(
        code,
        'fail',
        {},
        [`Scenario ${code} not found in registry`]
      );
    }

    try {
      // Clear mock KV before run (if using mocks)
      if (params.useMockKV !== false) {
        this.mockKV.clear();
      }

      // Execute scenario
      const result = await scenario.executor.execute({
        ...params,
        mockKV: this.mockKV
      });

      // Store result
      this.results.push(result);

      return result;
    } catch (error) {
      const failResult = new ScenarioResult(
        code,
        'fail',
        {},
        [error.message]
      );
      this.results.push(failResult);
      return failResult;
    }
  }

  /**
   * Run multiple scenarios
   */
  async runBatch(codes, params = {}) {
    const results = [];
    for (const code of codes) {
      const result = await this.run(code, params);
      results.push(result);
    }
    return results;
  }

  /**
   * Get execution history
   */
  getHistory() {
    return [...this.results];
  }

  /**
   * Clear history
   */
  clearHistory() {
    this.results = [];
  }

  /**
   * Get statistics
   */
  getStats() {
    const total = this.results.length;
    const passed = this.results.filter(r => r.status === 'pass').length;
    const failed = this.results.filter(r => r.status === 'fail').length;
    const pending = this.results.filter(r => r.status === 'pending').length;

    return {
      total,
      passed,
      failed,
      pending,
      passRate: total > 0 ? (passed / total * 100).toFixed(1) : 0
    };
  }
}

// Export singleton instance
export const globalRunner = new ScenarioRunner();
export const globalRegistry = globalRunner.registry;

// Module name mapping (internal + external)
export const MODULE_NAMES = {
  // Internal modules (1-6)
  1: 'Shop',
  2: 'Game',
  3: 'Auth',
  4: 'Payment',
  5: 'Worker',
  6: 'Common',
  
  // External services (11-19)
  11: 'Cloudflare',
  '11.1': 'Cloudflare.KV',
  '11.2': 'Cloudflare.Workers',
  '11.3': 'Cloudflare.CDN',
  
  12: 'Stripe',
  '12.1': 'Stripe.Checkout',
  '12.2': 'Stripe.Webhooks',
  '12.3': 'Stripe.API',
  
  13: 'GitHub',
  '13.1': 'GitHub.Pages',
  '13.2': 'GitHub.Actions'
};

// Helper to check if module is external
export function isExternalModule(moduleId) {
  return moduleId >= 11 || String(moduleId).includes('.');
}

export default {
  ScenarioRunner,
  ScenarioRegistry,
  ScenarioExecutor,
  ScenarioResult,
  MockKV,
  globalRunner,
  globalRegistry,
  MODULE_NAMES
};
