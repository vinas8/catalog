/**
 * TestRunner - Universal test execution engine
 * Works in both Node.js (CLI) and browser (debug hub)
 * 
 * @version 0.7.0
 */

export class TestResult {
  constructor(name, status, duration = 0, error = null, data = {}) {
    this.name = name;
    this.status = status; // 'pass', 'fail', 'skip', 'pending'
    this.duration = duration; // ms
    this.error = error;
    this.data = data;
    this.timestamp = new Date().toISOString();
  }

  toJSON() {
    return {
      name: this.name,
      status: this.status,
      duration: this.duration,
      error: this.error ? {
        message: this.error.message,
        stack: this.error.stack
      } : null,
      data: this.data,
      timestamp: this.timestamp
    };
  }
}

export class TestRunner {
  constructor(config = {}) {
    this.config = {
      verbose: config.verbose || false,
      timeout: config.timeout || 30000, // 30s default
      stopOnFailure: config.stopOnFailure || false,
      ...config
    };
    
    this.tests = [];
    this.results = [];
    this.currentTest = null;
  }

  /**
   * Add a test
   * @param {string} name - Test name
   * @param {Function} fn - Test function (async or sync)
   * @param {Object} options - Test options (skip, timeout, priority, etc.)
   */
  add(name, fn, options = {}) {
    this.tests.push({
      name,
      fn,
      options: {
        skip: options.skip || false,
        timeout: options.timeout || this.config.timeout,
        priority: options.priority || 'P2',
        tags: options.tags || [],
        category: options.category || 'unit',
        ...options
      }
    });
    return this;
  }

  /**
   * Add multiple tests from an object
   * @param {Object} tests - { 'test name': function, ... }
   * @param {Object} commonOptions - Options for all tests
   */
  addAll(tests, commonOptions = {}) {
    for (const [name, fn] of Object.entries(tests)) {
      this.add(name, fn, commonOptions);
    }
    return this;
  }

  /**
   * Run all tests
   * @returns {Promise<TestResult[]>}
   */
  async run() {
    this.results = [];
    const startTime = Date.now();
    
    this.log('info', `Running ${this.tests.length} tests...`);
    
    for (const test of this.tests) {
      if (test.options.skip) {
        this.results.push(new TestResult(test.name, 'skip'));
        this.log('skip', `⊝ ${test.name}`);
        continue;
      }
      
      const result = await this.executeTest(test);
      this.results.push(result);
      
      if (result.status === 'fail' && this.config.stopOnFailure) {
        this.log('error', 'Stopping on failure');
        break;
      }
    }
    
    const duration = Date.now() - startTime;
    this.logSummary(duration);
    
    return this.results;
  }

  /**
   * Execute a single test
   * @param {Object} test - Test object
   * @returns {Promise<TestResult>}
   */
  async executeTest(test) {
    this.currentTest = test;
    const startTime = Date.now();
    
    try {
      // Create timeout promise
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Test timeout')), test.options.timeout)
      );
      
      // Race test execution against timeout
      const testPromise = Promise.resolve(test.fn());
      await Promise.race([testPromise, timeoutPromise]);
      
      const duration = Date.now() - startTime;
      this.log('pass', `✓ ${test.name} (${duration}ms)`);
      
      return new TestResult(test.name, 'pass', duration);
      
    } catch (error) {
      const duration = Date.now() - startTime;
      this.log('fail', `✗ ${test.name} (${duration}ms)`);
      this.log('error', `  ${error.message}`);
      
      return new TestResult(test.name, 'fail', duration, error);
    } finally {
      this.currentTest = null;
    }
  }

  /**
   * Run a single test by name
   * @param {string} name - Test name
   * @returns {Promise<TestResult>}
   */
  async runOne(name) {
    const test = this.tests.find(t => t.name === name);
    if (!test) {
      throw new Error(`Test not found: ${name}`);
    }
    return this.executeTest(test);
  }

  /**
   * Get test summary
   */
  getSummary() {
    const passed = this.results.filter(r => r.status === 'pass').length;
    const failed = this.results.filter(r => r.status === 'fail').length;
    const skipped = this.results.filter(r => r.status === 'skip').length;
    const total = this.results.length;
    
    return {
      total,
      passed,
      failed,
      skipped,
      passRate: total > 0 ? Math.round((passed / total) * 100) : 0,
      duration: this.results.reduce((sum, r) => sum + r.duration, 0)
    };
  }

  /**
   * Log summary
   */
  logSummary(totalDuration) {
    const summary = this.getSummary();
    
    this.log('info', '');
    this.log('info', '='.repeat(50));
    this.log('info', `✅ Passed: ${summary.passed}`);
    if (summary.failed > 0) {
      this.log('error', `❌ Failed: ${summary.failed}`);
    }
    if (summary.skipped > 0) {
      this.log('skip', `⊝ Skipped: ${summary.skipped}`);
    }
    this.log('info', `📊 Total: ${summary.total}`);
    this.log('info', `📈 Success Rate: ${summary.passRate}%`);
    this.log('info', `⏱️ Duration: ${totalDuration}ms`);
    this.log('info', '='.repeat(50));
  }

  /**
   * Log helper
   */
  log(level, ...args) {
    if (!this.config.verbose && level !== 'error' && level !== 'fail') {
      return;
    }
    
    const prefix = {
      'info': 'ℹ️',
      'pass': '✓',
      'fail': '✗',
      'error': '❌',
      'skip': '⊝'
    }[level] || '';
    
    console.log(prefix, ...args);
  }

  /**
   * Clear all tests and results
   */
  clear() {
    this.tests = [];
    this.results = [];
    this.currentTest = null;
  }
}

/**
 * Helper: Create a test suite
 * @param {string} name - Suite name
 * @param {Object} config - Suite config
 * @returns {TestRunner}
 */
export function createTestSuite(name, config = {}) {
  const runner = new TestRunner({ ...config, verbose: true });
  runner.suiteName = name;
  return runner;
}
