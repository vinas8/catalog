/**
 * Debug Adapter - Makes tests run in browser
 * Adapts Node.js-style tests for browser execution
 * 
 * @version 0.7.0
 */

import { TestRunner } from './test-runner.js';

/**
 * Browser-friendly test adapter
 * Adds DOM output and interactive controls
 */
export class DebugAdapter {
  constructor(runner, outputElement) {
    this.runner = runner;
    this.outputElement = outputElement;
    this.logBuffer = [];
  }

  /**
   * Run tests with browser output
   */
  async runWithUI() {
    this.clearOutput();
    this.showRunning();
    
    const results = await this.runner.run();
    
    this.showResults(results);
    return results;
  }

  /**
   * Run single test with UI
   */
  async runOneWithUI(testName) {
    this.clearOutput();
    this.showRunning();
    
    const result = await this.runner.runOne(testName);
    
    this.showResults([result]);
    return result;
  }

  /**
   * Clear output
   */
  clearOutput() {
    if (this.outputElement) {
      this.outputElement.innerHTML = '';
    }
    this.logBuffer = [];
  }

  /**
   * Show running indicator
   */
  showRunning() {
    this.log('⏳ Running tests...', 'info');
  }

  /**
   * Show test results
   */
  showResults(results) {
    const summary = this.calculateSummary(results);
    
    this.log('', 'info');
    this.log('='.repeat(50), 'info');
    
    results.forEach(result => {
      const icon = result.status === 'pass' ? '✅' : '❌';
      const color = result.status === 'pass' ? 'success' : 'error';
      this.log(`${icon} ${result.name} (${result.duration}ms)`, color);
      
      if (result.error) {
        this.log(`  ${result.error.message}`, 'error');
      }
    });
    
    this.log('', 'info');
    this.log(`✅ Passed: ${summary.passed}`, 'success');
    if (summary.failed > 0) {
      this.log(`❌ Failed: ${summary.failed}`, 'error');
    }
    this.log(`📊 Total: ${summary.total}`, 'info');
    this.log(`📈 Success Rate: ${summary.passRate}%`, 'info');
    this.log('='.repeat(50), 'info');
  }

  /**
   * Calculate summary
   */
  calculateSummary(results) {
    const passed = results.filter(r => r.status === 'pass').length;
    const failed = results.filter(r => r.status === 'fail').length;
    const total = results.length;
    
    return {
      total,
      passed,
      failed,
      passRate: total > 0 ? Math.round((passed / total) * 100) : 0
    };
  }

  /**
   * Log to DOM
   */
  log(message, type = 'info') {
    const colors = {
      info: '#c9d1d9',
      success: '#3fb950',
      error: '#f85149',
      warning: '#d29922'
    };
    
    const line = document.createElement('div');
    line.style.color = colors[type] || colors.info;
    line.style.fontFamily = 'monospace';
    line.style.fontSize = '13px';
    line.style.padding = '2px 0';
    line.textContent = message;
    
    if (this.outputElement) {
      this.outputElement.appendChild(line);
    }
    
    this.logBuffer.push({ message, type, timestamp: Date.now() });
    console.log(message);
  }

  /**
   * Get log buffer (for export)
   */
  getLog() {
    return this.logBuffer;
  }
}

/**
 * Helper: Create debug runner from test file
 */
export function createDebugRunner(tests, config = {}) {
  const runner = new TestRunner({ verbose: true, ...config });
  
  // Add tests
  if (typeof tests === 'function') {
    tests(runner);
  } else if (typeof tests === 'object') {
    runner.addAll(tests);
  }
  
  return runner;
}

/**
 * Helper: Initialize debug page
 */
export function initDebugPage(testDefinition, outputId = 'output') {
  const outputElement = document.getElementById(outputId);
  const runner = createDebugRunner(testDefinition);
  const adapter = new DebugAdapter(runner, outputElement);
  
  // Expose to window for button handlers
  window.debugAdapter = adapter;
  window.debugRunner = runner;
  
  return { runner, adapter };
}
