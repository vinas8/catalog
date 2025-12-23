/**
 * SMRI Scenario Runner UI Component
 * Module: Debug (src/modules/debug/)
 * 
 * Provides UI for running E2E scenarios by SMRI code
 */

export class ScenarioRunnerUI {
  constructor(config = {}) {
    this.workerUrl = config.workerUrl || 'https://catalog.navickaszilvinas.workers.dev';
    this.runner = null;
    this.registry = null;
  }

  /**
   * Initialize scenario runner
   */
  async init() {
    if (this.runner) return this.runner;
    
    this.log('🔄 Initializing scenario runner...', 'success');
    
    try {
      // Import scenario runner
      this.log('📦 Loading scenario-runner.js...', 'success');
      const module = await import('../common/scenario-runner.js');
      this.runner = module.globalRunner;
      this.registry = module.globalRegistry;
      this.log('✅ scenario-runner.js loaded', 'success');
      
      // Import security scenarios
      this.log('📦 Loading security-scenarios.js...', 'success');
      const securityModule = await import('../common/security-scenarios.js');
      this.log('✅ security-scenarios.js loaded', 'success');
      
      // Register scenarios
      this.registerScenarios(securityModule);
      
      this.log(`✅ Initialized with ${this.registry.getAll().length} scenarios`, 'success');
      return this.runner;
      
    } catch (error) {
      this.handleError(error);
      return null;
    }
  }

  /**
   * Register all security scenarios
   */
  registerScenarios(securityModule) {
    const scenarios = [
      {
        code: 'S3.5.01',
        executor: new securityModule.S3_5_01_HashValidation({ workerUrl: this.workerUrl, verbose: true }),
        metadata: {
          name: 'User Hash Validation',
          description: 'Tests that invalid hash formats are rejected',
          priority: 'P0',
          module: 3,
          relations: [5]
        }
      },
      {
        code: 'S4.5.02',
        executor: new securityModule.S4_5_02_SQLInjection({ workerUrl: this.workerUrl, verbose: true }),
        metadata: {
          name: 'SQL Injection Attempt',
          description: 'Tests that SQL injection patterns are rejected',
          priority: 'P0',
          module: 4,
          relations: [5]
        }
      },
      {
        code: 'S3.5.03',
        executor: new securityModule.S3_5_03_XSSUsername({ workerUrl: this.workerUrl, verbose: true }),
        metadata: {
          name: 'XSS Attempt via Username',
          description: 'Tests that XSS payloads are sanitized',
          priority: 'P0',
          module: 3,
          relations: [5]
        }
      },
      {
        code: 'S4.4.05',
        executor: new securityModule.S4_4_05_CSRFWebhook({ workerUrl: this.workerUrl, verbose: true }),
        metadata: {
          name: 'CSRF Attack on Webhook',
          description: 'Tests that webhooks are rejected without valid signature',
          priority: 'P0',
          module: 4,
          relations: [4]
        }
      },
      {
        code: 'S5.11.2-12.2.01',
        executor: new securityModule.S4_4_01_WebhookSignature({ workerUrl: this.workerUrl, verbose: true }),
        metadata: {
          name: 'Webhook Signature Verification',
          description: 'Tests Stripe signature validation',
          priority: 'P0',
          module: 5,
          relations: ['11.2', '12.2']
        }
      },
      {
        code: 'S4.5.01',
        executor: new securityModule.S4_5_01_SchemaValidation({ workerUrl: this.workerUrl, verbose: true }),
        metadata: {
          name: 'Product Schema Validation',
          description: 'Tests that invalid schemas are rejected',
          priority: 'P0',
          module: 4,
          relations: [5]
        }
      }
    ];

    scenarios.forEach(s => {
      this.registry.register(s.code, s.executor, s.metadata);
    });
  }

  /**
   * Run scenario by code
   */
  async run(code) {
    const statusBadge = document.getElementById('scenario-status-badge');
    const resultDiv = document.getElementById('scenario-result');
    const detailsCard = document.getElementById('scenario-details');
    const detailsDiv = document.getElementById('scenario-info');

    // Initialize if needed
    const runner = await this.init();
    if (!runner) {
      resultDiv.innerHTML = '<div style="color: #da3633;">❌ Failed to initialize. Check logs.</div>';
      return;
    }

    // Show running status
    statusBadge.textContent = 'RUNNING';
    statusBadge.className = 'badge warning';
    statusBadge.style.display = 'inline-block';
    
    resultDiv.innerHTML = '<div style="color: #58a6ff;">⏳ Executing scenario...</div>';
    
    this.log(`▶ Running scenario: ${code}`, 'success');

    try {
      // Get scenario metadata
      const scenario = this.registry.get(code);
      if (!scenario) {
        throw new Error(`Scenario ${code} not found in registry`);
      }

      // Show scenario details
      detailsCard.style.display = 'block';
      detailsDiv.innerHTML = this.renderScenarioDetails(code, scenario);

      // Execute scenario
      const startTime = Date.now();
      const result = await runner.run(code, { useMockKV: false, verbose: true });
      const duration = Date.now() - startTime;

      // Display result
      this.displayResult(result, duration, statusBadge, resultDiv);

    } catch (error) {
      statusBadge.textContent = 'ERROR';
      statusBadge.className = 'badge error';
      resultDiv.innerHTML = `<div style="color: #f85149;">❌ <strong>ERROR:</strong> ${error.message}</div>`;
      this.log(`❌ ${code} ERROR: ${error.message}`, 'error');
      console.error(error);
    }
  }

  /**
   * Show all available scenarios
   */
  async showList() {
    const runner = await this.init();
    if (!runner) return;

    const scenarios = this.registry.getAll();
    const resultDiv = document.getElementById('scenario-result');
    
    resultDiv.innerHTML = `
      <div style="color: #58a6ff; margin-bottom: 16px; font-size: 14px;">
        <strong>Available Scenarios (${scenarios.length})</strong>
      </div>
      <div style="display: grid; gap: 8px;">
        ${scenarios.map(s => this.renderScenarioCard(s)).join('')}
      </div>
    `;

    this.log(`📋 Showing ${scenarios.length} available scenarios`, 'success');
  }

  /**
   * Render scenario details
   */
  renderScenarioDetails(code, scenario) {
    return `
      <div style="display: grid; gap: 8px;">
        <div><strong>Code:</strong> ${code}</div>
        <div><strong>Name:</strong> ${scenario.metadata.name}</div>
        <div><strong>Description:</strong> ${scenario.metadata.description}</div>
        <div><strong>Priority:</strong> <span class="badge">${scenario.metadata.priority}</span></div>
        <div><strong>Module:</strong> ${scenario.metadata.module}</div>
        <div><strong>Relations:</strong> ${JSON.stringify(scenario.metadata.relations)}</div>
      </div>
    `;
  }

  /**
   * Render scenario card for list
   */
  renderScenarioCard(scenario) {
    return `
      <div style="padding: 12px; background: #161b22; border: 1px solid #30363d; border-radius: 6px; cursor: pointer; transition: border-color 0.2s;" 
           onclick="window.scenarioUI.run('${scenario.code}')">
        <div style="font-weight: bold; color: #58a6ff; margin-bottom: 4px;">${scenario.code}</div>
        <div style="font-size: 12px; color: #c9d1d9; margin-bottom: 4px;">${scenario.metadata.name}</div>
        <div style="font-size: 11px; color: #8b949e;">${scenario.metadata.description}</div>
        <div style="margin-top: 6px;">
          <span class="badge">${scenario.metadata.priority}</span>
          <span style="font-size: 11px; color: #8b949e; margin-left: 8px;">Module ${scenario.metadata.module}</span>
        </div>
      </div>
    `;
  }

  /**
   * Display test result
   */
  displayResult(result, duration, statusBadge, resultDiv) {
    if (result.status === 'pass') {
      statusBadge.textContent = 'PASS';
      statusBadge.className = 'badge';
      resultDiv.innerHTML = `
        <div style="color: #3fb950; margin-bottom: 12px;">
          ✅ <strong>PASSED</strong> (${duration}ms)
        </div>
        <div style="color: #c9d1d9; margin-bottom: 8px;"><strong>Result Data:</strong></div>
        <pre style="background: #010409; padding: 12px; border-radius: 6px; overflow-x: auto;">${JSON.stringify(result.data, null, 2)}</pre>
      `;
      this.log(`✅ ${result.code} PASSED (${duration}ms)`, 'success');
    } else {
      statusBadge.textContent = 'FAIL';
      statusBadge.className = 'badge error';
      resultDiv.innerHTML = `
        <div style="color: #f85149; margin-bottom: 12px;">
          ❌ <strong>FAILED</strong> (${duration}ms)
        </div>
        <div style="color: #c9d1d9; margin-bottom: 8px;"><strong>Errors:</strong></div>
        <ul style="margin-left: 20px; color: #f85149;">
          ${result.errors.map(err => `<li>${err}</li>`).join('')}
        </ul>
        <div style="color: #c9d1d9; margin-top: 12px; margin-bottom: 8px;"><strong>Result Data:</strong></div>
        <pre style="background: #010409; padding: 12px; border-radius: 6px; overflow-x: auto;">${JSON.stringify(result.data, null, 2)}</pre>
      `;
      this.log(`❌ ${result.code} FAILED: ${result.errors.join(', ')}`, 'error');
    }
  }

  /**
   * Handle initialization errors
   */
  handleError(error) {
    const errorMsg = `Failed to initialize: ${error.message}`;
    this.log(`❌ ${errorMsg}`, 'error');
    console.error('Full error:', error);
    
    const resultDiv = document.getElementById('scenario-result');
    if (resultDiv) {
      resultDiv.innerHTML = `
        <div style="color: #f85149;">
          <strong>❌ Initialization Error</strong><br><br>
          ${error.message}<br><br>
          <details style="margin-top: 12px;">
            <summary style="cursor: pointer; color: #58a6ff;">Show Details</summary>
            <pre style="margin-top: 8px; padding: 12px; background: #010409; border-radius: 6px; overflow-x: auto;">${error.stack || 'No stack trace'}</pre>
          </details>
          <br>
          <strong>Possible fixes:</strong><br>
          1. Check browser console (F12) for detailed errors<br>
          2. Ensure files exist: src/modules/common/scenario-runner.js<br>
          3. Ensure files exist: src/modules/common/security-scenarios.js<br>
          4. Try refreshing the page<br>
        </div>
      `;
    }
  }

  /**
   * Log to scenario log panel
   */
  log(message, type = 'success') {
    const container = document.getElementById('scenario-log');
    if (!container) return;
    
    const entry = document.createElement('div');
    entry.className = `log-entry ${type}`;
    entry.innerHTML = `
      <div style="font-size: 10px; opacity: 0.6;">${new Date().toISOString()}</div>
      <div>${message}</div>
    `;
    container.appendChild(entry);
    container.scrollTop = container.scrollHeight;
  }

  /**
   * Clear log
   */
  clearLog() {
    const container = document.getElementById('scenario-log');
    if (!container) return;
    
    container.innerHTML = `
      <div class="log-entry" style="color: #8b949e;">
        <div style="font-size: 10px; opacity: 0.6;">${new Date().toISOString()}</div>
        <div>Scenario log cleared. Ready for new executions.</div>
      </div>
    `;
  }
}

export default ScenarioRunnerUI;
