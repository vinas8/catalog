/**
 * SMRI Test Runner - Common module for scenario collection execution
 * Extracted from healthcheck.html pattern
 * 
 * Usage:
 *   import { TestRunner } from './test-runner.js';
 *   const runner = new TestRunner(config);
 *   runner.renderTests();
 *   runner.runAllTests();
 */

export class TestRunner {
  constructor(config) {
    this.config = {
      containerId: 'test-list',
      progressBarId: 'progress-bar',
      progressTextId: 'progress-text',
      progressContainerId: 'progress-container',
      autoRun: false,
      autoRunDelay: 500,
      testDelay: 200,
      ...config
    };
    
    this.testGroups = config.testGroups || [];
    this.testResults = {};
  }

  /**
   * Get all tests from all groups
   */
  getAllTests() {
    return this.testGroups.flatMap(group => group.tests);
  }

  /**
   * Render test cards to DOM
   */
  renderTests() {
    const container = document.getElementById(this.config.containerId);
    if (!container) {
      console.error(`Container #${this.config.containerId} not found`);
      return;
    }

    container.innerHTML = this.testGroups.map(group => `
      <div class="service-group">
        <div class="service-header">
          <h2>${group.icon} ${group.name}</h2>
          <span class="service-badge">${group.module}</span>
        </div>
        ${group.tests.map(test => `
          <div class="test-card">
            <div class="test-header" data-test-id="${test.id}">
              <span class="test-number">${test.number}</span>
              <span class="test-method">${test.method}</span>
              <span class="test-title">${test.name}</span>
              <span class="test-status" id="status-${test.id}">⏳</span>
            </div>
            <div class="test-body" id="body-${test.id}">
              <div class="test-section">
                <h4>Endpoint</h4>
                <div class="code-block">
                  <a href="${test.endpoint}" target="_blank" style="color: #58a6ff; text-decoration: none;">
                    ${test.endpoint} ↗
                  </a>
                </div>
              </div>
              ${test.description ? `
                <div class="test-section">
                  <h4>Description</h4>
                  <p>${test.description}</p>
                </div>
              ` : ''}
              <div class="test-section">
                <h4>Response</h4>
                <div class="code-block" id="response-${test.id}">Not run yet</div>
              </div>
              ${test.expected ? `
                <div class="test-section">
                  <h4>Expected</h4>
                  <div class="code-block">${test.expected}</div>
                </div>
              ` : ''}
            </div>
          </div>
        `).join('')}
      </div>
    `).join('');

    // Add click handlers after render
    document.querySelectorAll('.test-header').forEach(header => {
      header.addEventListener('click', () => {
        const testId = header.dataset.testId;
        const body = document.getElementById(`body-${testId}`);
        if (body) {
          body.classList.toggle('show');
        }
      });
    });
  }

  /**
   * Run a single test
   */
  async runSingleTest(id) {
    const test = this.getAllTests().find(t => t.id === id);
    if (!test) {
      console.error(`Test ${id} not found`);
      return;
    }

    const statusEl = document.getElementById(`status-${id}`);
    const responseEl = document.getElementById(`response-${id}`);
    
    if (!statusEl || !responseEl) {
      console.error(`Elements for test ${id} not found`);
      return;
    }

    statusEl.textContent = '⏳';
    responseEl.innerHTML = '<div style="color: #58a6ff;">Running...</div>';
    
    try {
      console.log(`🧪 Running test: ${id}`, test);
      const result = await test.run();
      console.log(`✅ Test ${id} passed:`, result);
      
      statusEl.textContent = '✅';
      statusEl.className = 'test-status status-ok';
      
      // Format result based on type
      let resultHtml;
      if (typeof result === 'object' && result !== null) {
        resultHtml = `<pre style="margin: 0; color: #3fb950;">${JSON.stringify(result, null, 2)}</pre>`;
      } else if (typeof result === 'string') {
        resultHtml = `<div style="color: #3fb950;">${result}</div>`;
      } else {
        resultHtml = `<div style="color: #3fb950;">Test passed</div>`;
      }
      
      responseEl.innerHTML = resultHtml;
      this.testResults[id] = { status: 'ok', result };
    } catch (error) {
      console.error(`❌ Test ${id} failed:`, error);
      console.error('Error details:', {
        message: error?.message,
        stack: error?.stack,
        name: error?.name,
        type: typeof error,
        error: error
      });
      
      statusEl.textContent = '❌';
      statusEl.className = 'test-status status-error';
      
      const errorMessage = error?.message || error?.toString() || String(error) || 'Unknown error';
      const stackTrace = error?.stack || 'No stack trace available';
      
      responseEl.innerHTML = `
        <div style="color: #f85149; margin-bottom: 10px;">
          <strong>Error:</strong> ${errorMessage}
        </div>
        <details>
          <summary style="cursor: pointer; color: #8b949e; font-size: 11px;">Stack Trace</summary>
          <pre style="margin: 5px 0 0 0; color: #8b949e; font-size: 10px; max-height: 200px; overflow: auto;">${stackTrace}</pre>
        </details>
      `;
      
      this.testResults[id] = { status: 'error', error: errorMessage, stack: stackTrace };
    }
  }

  /**
   * Run all tests sequentially
   */
  async runAllTests() {
    const progressBar = document.getElementById(this.config.progressBarId);
    const progressText = document.getElementById(this.config.progressTextId);
    const progressContainer = document.getElementById(this.config.progressContainerId);
    
    if (progressContainer) progressContainer.style.display = 'block';
    if (progressText) progressText.style.display = 'block';
    
    this.testResults = {};
    
    const allTests = this.getAllTests();
    
    for (let i = 0; i < allTests.length; i++) {
      const percent = Math.round(((i + 1) / allTests.length) * 100);
      
      if (progressBar) {
        progressBar.style.width = percent + '%';
        progressBar.textContent = percent + '%';
      }
      
      if (progressText) {
        progressText.innerHTML = `🔍 Test ${i + 1}/${allTests.length} - <strong>${allTests[i].name}</strong>`;
      }
      
      await this.runSingleTest(allTests[i].id);
      await new Promise(r => setTimeout(r, this.config.testDelay));
    }
    
    if (progressText) {
      progressText.innerHTML = '✅ All tests complete!';
      progressText.style.color = '#3fb950';
    }
    
    const passed = Object.values(this.testResults).filter(r => r.status === 'ok').length;
    const failed = allTests.length - passed;
    
    console.log(`Tests: ${passed}/${allTests.length} passed`);
    
    return { passed, failed, total: allTests.length };
  }

  /**
   * Initialize and optionally auto-run
   */
  init() {
    this.renderTests();
    
    if (this.config.autoRun) {
      window.addEventListener('load', () => {
        setTimeout(() => this.runAllTests(), this.config.autoRunDelay);
      });
    }
  }
}

/**
 * Example Usage:
 * 
 * const runner = new TestRunner({
 *   containerId: 'test-list',
 *   autoRun: true,
 *   testGroups: [
 *     {
 *       name: 'Worker API',
 *       icon: '☁️',
 *       module: 'S5.x',
 *       tests: [
 *         {
 *           id: 'worker-root',
 *           number: '1.1',
 *           method: 'GET',
 *           name: 'Root endpoint',
 *           endpoint: 'https://worker.dev/',
 *           run: async () => {
 *             const res = await fetch('https://worker.dev/');
 *             return await res.json();
 *           }
 *         }
 *       ]
 *     }
 *   ]
 * });
 * 
 * runner.init();
 */
