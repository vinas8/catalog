/**
 * SMRI Runner Module
 * Modular test runner system using BrowserFrame component
 * @version 1.0.0
 */

import { BrowserFrame } from '../../src/components/BrowserFrame.js';

export class SMRIRunner {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId);
    this.options = {
      scenarios: options.scenarios || [],
      autoLoad: options.autoLoad || false,
      showPipeline: options.showPipeline !== false,
      ...options
    };
    
    this.browser = null;
    this.currentScenario = null;
    this.results = {
      passed: 0,
      failed: 0,
      total: 0,
      history: []
    };
    
    this.init();
  }

  init() {
    this.render();
    this.initBrowser();
    this.attachEvents();
    
    if (this.options.autoLoad && this.options.scenarios.length > 0) {
      this.runScenario(this.options.scenarios[0].id);
    }
  }

  render() {
    this.container.innerHTML = `
      <div class="smri-runner">
        <!-- Status Bar -->
        <div class="smri-status" id="smri-status">
          <span class="status-icon">✅</span>
          <span class="status-text">Ready - Select a test to run</span>
          <div class="status-stats">
            <span id="stats-passed">0 passed</span> · 
            <span id="stats-failed">0 failed</span> · 
            <span id="stats-total">0 total</span>
          </div>
        </div>

        <!-- Control Bar -->
        <div class="smri-controls">
          <button class="smri-btn primary" onclick="window.smriRunner.runAll()">
            ▶️ Run All
          </button>
          <button class="smri-btn secondary" onclick="window.smriRunner.stopTests()">
            ⏸️ Stop
          </button>
          <button class="smri-btn" onclick="window.smriRunner.clearResults()">
            🗑️ Clear
          </button>
          ${this.options.showPipeline ? `
          <button class="smri-btn" onclick="window.smriRunner.togglePipeline()">
            📍 Pipeline
          </button>
          ` : ''}
          <button class="smri-btn" onclick="window.smriRunner.exportResults()">
            💾 Export
          </button>
        </div>

        <!-- Pipeline (optional) -->
        ${this.options.showPipeline ? `
        <div class="smri-pipeline" id="smri-pipeline" style="display: none;">
          <div class="pipeline-header">
            <span>Pipeline Mode</span>
            <span id="pipeline-step">Step 1 of 6</span>
          </div>
          <div class="pipeline-controls">
            <button onclick="window.smriRunner.prevStep()">◀ Prev</button>
            <button onclick="window.smriRunner.nextStep()">Next ▶</button>
            <button onclick="window.smriRunner.resetPipeline()">🔄 Reset</button>
          </div>
        </div>
        ` : ''}

        <!-- Browser Frame Container -->
        <div id="smri-browser-container"></div>

        <!-- Scenarios Grid -->
        <div class="smri-scenarios" id="smri-scenarios"></div>
      </div>
    `;

    this.applyStyles();
    this.renderScenarios();
  }

  applyStyles() {
    if (document.getElementById('smri-runner-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'smri-runner-styles';
    style.textContent = `
      .smri-runner {
        max-width: 1600px;
        margin: 0 auto;
      }

      .smri-status {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 20px;
        border-radius: 12px;
        margin-bottom: 20px;
        display: flex;
        align-items: center;
        gap: 15px;
        flex-wrap: wrap;
      }

      .status-icon {
        font-size: 24px;
      }

      .status-text {
        flex: 1;
        font-weight: 600;
        font-size: 16px;
      }

      .status-stats {
        font-size: 14px;
        opacity: 0.9;
      }

      .smri-controls {
        display: flex;
        gap: 10px;
        margin-bottom: 20px;
        flex-wrap: wrap;
      }

      .smri-btn {
        background: #3a3a3a;
        color: white;
        border: none;
        padding: 10px 20px;
        border-radius: 8px;
        cursor: pointer;
        font-size: 14px;
        font-weight: 600;
        transition: all 0.2s;
      }

      .smri-btn:hover {
        background: #4a4a4a;
        transform: translateY(-1px);
      }

      .smri-btn.primary {
        background: #238636;
      }

      .smri-btn.primary:hover {
        background: #2ea043;
      }

      .smri-btn.secondary {
        background: #1f6feb;
      }

      .smri-btn.secondary:hover {
        background: #0969da;
      }

      .smri-pipeline {
        background: #161b22;
        border: 2px solid #30363d;
        border-radius: 10px;
        padding: 15px;
        margin-bottom: 20px;
      }

      .pipeline-header {
        display: flex;
        justify-content: space-between;
        margin-bottom: 15px;
        font-weight: 600;
        color: #58a6ff;
      }

      .pipeline-controls {
        display: flex;
        gap: 10px;
      }

      .pipeline-controls button {
        flex: 1;
        background: #238636;
        color: white;
        border: none;
        padding: 10px;
        border-radius: 6px;
        cursor: pointer;
        font-weight: 600;
      }

      #smri-browser-container {
        margin-bottom: 30px;
      }

      .smri-scenarios {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: 15px;
      }

      .scenario-card {
        background: #161b22;
        border: 2px solid #30363d;
        padding: 20px;
        border-radius: 10px;
        cursor: pointer;
        transition: all 0.2s;
      }

      .scenario-card:hover {
        border-color: #58a6ff;
        transform: translateY(-2px);
      }

      .scenario-card.active {
        border-color: #3fb950;
        background: rgba(63,185,80,0.1);
      }

      .scenario-card.passed {
        border-color: #3fb950;
        background: rgba(63,185,80,0.05);
      }

      .scenario-card.failed {
        border-color: #f85149;
        background: rgba(248,81,73,0.05);
      }

      .scenario-icon {
        font-size: 32px;
        margin-bottom: 10px;
      }

      .scenario-title {
        font-weight: 600;
        font-size: 16px;
        margin-bottom: 8px;
        color: #c9d1d9;
      }

      .scenario-smri {
        font-size: 12px;
        color: #8b949e;
        font-family: monospace;
        margin-bottom: 10px;
      }

      .scenario-status {
        font-size: 13px;
        color: #58a6ff;
      }

      @media (max-width: 768px) {
        .smri-scenarios {
          grid-template-columns: 1fr;
        }
      }
    `;
    document.head.appendChild(style);
  }

  initBrowser() {
    this.browser = new BrowserFrame('smri-browser-container', {
      height: '700px',
      showControls: true,
      showURL: true,
      allowFullscreen: true
    });

    // Listen to browser events
    document.getElementById('smri-browser-container').addEventListener('browserframe:loaded', (e) => {
      this.onPageLoaded(e.detail.url);
    });
  }

  renderScenarios() {
    const container = document.getElementById('smri-scenarios');
    container.innerHTML = this.options.scenarios.map(scenario => `
      <div class="scenario-card" data-id="${scenario.id}" onclick="window.smriRunner.runScenario('${scenario.id}')">
        <div class="scenario-icon">${scenario.icon}</div>
        <div class="scenario-title">${scenario.title}</div>
        <div class="scenario-smri">${scenario.smri}</div>
        <div class="scenario-status">⏸️ Not run</div>
      </div>
    `).join('');
  }

  attachEvents() {
    // Make runner accessible globally for onclick handlers
    window.smriRunner = this;
  }

  runScenario(id) {
    const scenario = this.options.scenarios.find(s => s.id === id);
    if (!scenario) return;

    this.currentScenario = scenario;
    
    // Update status
    this.updateStatus('🔄', `Running: ${scenario.title}`, 'info');
    
    // Update card
    this.updateCard(id, 'active', '⏳ Running...');
    
    // Load in browser
    this.browser.load(scenario.url);
    
    console.log(`[SMRI] Running test: ${scenario.title} (${scenario.smri})`);
  }

  onPageLoaded(url) {
    if (!this.currentScenario) return;
    
    // Mark as passed (basic test - page loaded)
    this.results.passed++;
    this.results.total++;
    this.results.history.push({
      scenario: this.currentScenario.id,
      status: 'passed',
      timestamp: new Date().toISOString()
    });
    
    this.updateStatus('✅', `Loaded: ${this.currentScenario.title}`, 'success');
    this.updateCard(this.currentScenario.id, 'passed', '✅ Passed');
    this.updateStats();
    
    console.log(`[SMRI] ✅ Test passed: ${this.currentScenario.title}`);
  }

  updateStatus(icon, text, type = 'info') {
    const status = document.getElementById('smri-status');
    if (!status) return;
    
    const iconEl = status.querySelector('.status-icon');
    const textEl = status.querySelector('.status-text');
    
    if (iconEl) iconEl.textContent = icon;
    if (textEl) textEl.textContent = text;
  }

  updateCard(id, status, statusText) {
    const card = document.querySelector(`[data-id="${id}"]`);
    if (!card) return;
    
    card.className = `scenario-card ${status}`;
    const statusEl = card.querySelector('.scenario-status');
    if (statusEl) statusEl.textContent = statusText;
  }

  updateStats() {
    const passedEl = document.getElementById('stats-passed');
    const failedEl = document.getElementById('stats-failed');
    const totalEl = document.getElementById('stats-total');
    
    if (passedEl) passedEl.textContent = `${this.results.passed} passed`;
    if (failedEl) failedEl.textContent = `${this.results.failed} failed`;
    if (totalEl) totalEl.textContent = `${this.results.total} total`;
  }

  async runAll() {
    console.log('[SMRI] Running all tests...');
    for (const scenario of this.options.scenarios) {
      this.runScenario(scenario.id);
      await this.sleep(2000); // Wait 2s between tests
    }
  }

  stopTests() {
    console.log('[SMRI] Tests stopped');
    this.updateStatus('⏸️', 'Tests stopped', 'warning');
  }

  clearResults() {
    this.results = { passed: 0, failed: 0, total: 0, history: [] };
    this.updateStats();
    this.browser.close();
    
    // Reset all cards
    document.querySelectorAll('.scenario-card').forEach(card => {
      card.className = 'scenario-card';
      const status = card.querySelector('.scenario-status');
      if (status) status.textContent = '⏸️ Not run';
    });
    
    this.updateStatus('✅', 'Ready - Select a test to run', 'info');
    console.log('[SMRI] Results cleared');
  }

  exportResults() {
    const data = JSON.stringify(this.results, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `smri-results-${Date.now()}.json`;
    a.click();
    console.log('[SMRI] Results exported');
  }

  togglePipeline() {
    const pipeline = document.getElementById('smri-pipeline');
    if (pipeline) {
      pipeline.style.display = pipeline.style.display === 'none' ? 'block' : 'none';
    }
  }

  prevStep() {
    console.log('[SMRI] Previous step');
  }

  nextStep() {
    console.log('[SMRI] Next step');
  }

  resetPipeline() {
    console.log('[SMRI] Pipeline reset');
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
