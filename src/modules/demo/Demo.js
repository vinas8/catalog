/**
 * Demo Module - Unified Interactive Demo System
 * @module modules/demo/Demo
 * @version 0.7.7
 * 
 * Features:
 * - Mobile-first responsive split-screen layout
 * - Step-by-step scenario execution
 * - In-browser action execution (clicks, forms, etc.)
 * - Background API calls (import, sync, etc.)
 * - Auto-play mode
 * - Progress tracking & logging
 * 
 * SMRI: S9.2,8,5.01
 */

export class Demo {
  constructor(options = {}) {
    this.containerId = options.containerId || 'demo-root';
    this.scenarios = options.scenarios || [];
    this.workerUrl = options.workerUrl || 'https://catalog.navickaszilvinas.workers.dev';
    this.baseUrl = options.baseUrl || window.location.origin;
    
    this.currentScenario = null;
    this.currentStep = 0;
    this.autoPlaying = false;
    this.autoPlayDelay = options.autoPlayDelay || 3000;
    
    this.logs = [];
    this.container = null;
    this.iframe = null;
  }

  /**
   * Initialize demo system
   */
  init() {
    this.container = document.getElementById(this.containerId);
    if (!this.container) {
      console.error(`Demo: Container #${this.containerId} not found`);
      return false;
    }

    this.injectStyles();
    this.renderScenarioSelector();
    return true;
  }

  /**
   * Inject CSS styles (mobile-first)
   */
  injectStyles() {
    if (document.getElementById('demo-styles')) return;

    const style = document.createElement('style');
    style.id = 'demo-styles';
    style.textContent = `
      .demo-layout {
        display: flex;
        flex-direction: column;
        height: 100vh;
        background: #0a0e14;
        color: #c9d1d9;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      }

      /* Mobile-first: vertical layout */
      .demo-control-panel {
        background: #161b22;
        border-bottom: 2px solid #30363d;
        overflow-y: auto;
        max-height: 50vh;
      }

      .demo-browser-panel {
        flex: 1;
        display: flex;
        flex-direction: column;
        background: white;
        overflow: hidden;
      }

      /* Desktop: side-by-side */
      @media (min-width: 1024px) {
        .demo-layout {
          flex-direction: row;
        }

        .demo-control-panel {
          width: 400px;
          max-height: 100vh;
          border-bottom: none;
          border-right: 2px solid #30363d;
        }
      }

      /* Header */
      .demo-header {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        padding: 20px;
        color: white;
      }

      .demo-header h1 {
        font-size: 24px;
        margin-bottom: 8px;
      }

      .demo-header p {
        font-size: 14px;
        opacity: 0.9;
      }

      /* Scenario selector */
      .demo-scenarios {
        padding: 20px;
      }

      .demo-scenarios h2 {
        color: #58a6ff;
        font-size: 18px;
        margin-bottom: 15px;
      }

      .scenario-grid {
        display: grid;
        gap: 12px;
      }

      .scenario-card {
        background: linear-gradient(135deg, #1f6feb 0%, #0969da 100%);
        border: 2px solid #1f6feb;
        padding: 16px;
        border-radius: 10px;
        cursor: pointer;
        transition: all 0.3s;
      }

      .scenario-card:hover {
        transform: translateY(-3px);
        box-shadow: 0 8px 20px rgba(31, 111, 235, 0.4);
      }

      .scenario-title {
        font-size: 16px;
        font-weight: 600;
        color: white;
        margin-bottom: 5px;
      }

      .scenario-code {
        font-size: 12px;
        color: rgba(255,255,255,0.7);
        margin-bottom: 8px;
      }

      .scenario-desc {
        font-size: 13px;
        color: rgba(255,255,255,0.9);
      }

      /* Steps panel */
      .demo-steps {
        padding: 20px;
      }

      .step-item {
        background: #0d1117;
        border: 2px solid #30363d;
        border-radius: 10px;
        padding: 12px;
        margin-bottom: 10px;
        cursor: pointer;
        transition: all 0.3s;
      }

      .step-item:hover {
        border-color: #1f6feb;
        transform: translateX(5px);
      }

      .step-item.active {
        border-color: #1f6feb;
        background: linear-gradient(135deg, #1f6feb15, #0969da15);
      }

      .step-item.completed {
        border-color: #238636;
        background: linear-gradient(135deg, #23863615, #2ea04315);
      }

      .step-number {
        display: inline-block;
        width: 28px;
        height: 28px;
        border-radius: 50%;
        background: #21262d;
        color: #8b949e;
        text-align: center;
        line-height: 28px;
        font-size: 14px;
        font-weight: 600;
        margin-right: 10px;
      }

      .step-item.active .step-number {
        background: #1f6feb;
        color: white;
      }

      .step-item.completed .step-number {
        background: #238636;
        color: white;
      }

      .step-title {
        font-size: 14px;
        font-weight: 600;
        color: #c9d1d9;
      }

      .step-desc {
        font-size: 12px;
        color: #8b949e;
        margin-top: 4px;
        margin-left: 38px;
      }

      /* Controls */
      .demo-controls {
        padding: 15px 20px;
        border-top: 2px solid #30363d;
        display: flex;
        gap: 10px;
        flex-wrap: wrap;
      }

      .demo-btn {
        background: #238636;
        color: white;
        border: none;
        padding: 10px 16px;
        border-radius: 6px;
        cursor: pointer;
        font-size: 14px;
        font-weight: 600;
        transition: all 0.2s;
        flex: 1;
        min-width: 80px;
      }

      .demo-btn:hover {
        background: #2ea043;
        transform: translateY(-1px);
      }

      .demo-btn:disabled {
        background: #30363d;
        cursor: not-allowed;
        transform: none;
      }

      .demo-btn.secondary {
        background: #21262d;
      }

      .demo-btn.secondary:hover {
        background: #30363d;
      }

      .demo-btn.back {
        flex: none;
        width: 100%;
        background: #21262d;
      }

      /* Browser */
      .demo-browser-controls {
        background: #161b22;
        padding: 12px;
        display: flex;
        gap: 10px;
        align-items: center;
        border-bottom: 2px solid #30363d;
      }

      .demo-url-bar {
        flex: 1;
        background: #0d1117;
        border: 1px solid #30363d;
        color: #58a6ff;
        padding: 8px 12px;
        border-radius: 6px;
        font-family: monospace;
        font-size: 13px;
      }

      .demo-browser-content {
        flex: 1;
        position: relative;
        background: white;
        overflow: hidden;
      }

      .demo-iframe {
        width: 100%;
        height: 100%;
        border: none;
      }

      .demo-status-overlay {
        position: absolute;
        top: 20px;
        right: 20px;
        background: rgba(35, 134, 54, 0.95);
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        font-size: 14px;
        font-weight: 600;
        z-index: 1000;
        max-width: 300px;
        display: none;
        box-shadow: 0 4px 15px rgba(0,0,0,0.3);
      }

      .demo-status-overlay.show {
        display: block;
      }

      .demo-status-overlay.executing {
        background: rgba(245, 158, 11, 0.95);
      }

      .demo-status-overlay.error {
        background: rgba(220, 38, 38, 0.95);
      }

      /* Log panel */
      .demo-log-panel {
        background: #0d1117;
        border-top: 2px solid #30363d;
        padding: 15px;
        max-height: 200px;
        overflow-y: auto;
        font-family: 'SF Mono', Monaco, monospace;
        font-size: 12px;
        display: none;
      }

      .demo-log-panel.show {
        display: block;
      }

      .demo-log-entry {
        padding: 4px 0;
        color: #8b949e;
      }

      .demo-log-entry.success {
        color: #3fb950;
      }

      .demo-log-entry.info {
        color: #58a6ff;
      }

      .demo-log-entry.warning {
        color: #fbbf24;
      }

      .demo-log-entry.error {
        color: #f87171;
      }

      /* Utilities */
      .demo-hidden {
        display: none !important;
      }
    `;
    document.head.appendChild(style);
  }

  /**
   * Render scenario selector
   */
  renderScenarioSelector() {
    this.container.innerHTML = `
      <div class="demo-layout">
        <div class="demo-control-panel">
          <div class="demo-header">
            <h1>🎬 Interactive Demos</h1>
            <p>Watch scenarios execute live</p>
          </div>
          <div class="demo-scenarios">
            <h2>Select a Scenario</h2>
            <div class="scenario-grid">
              ${this.scenarios.map((s, i) => `
                <div class="scenario-card" data-index="${i}">
                  <div class="scenario-title">${s.icon || '📋'} ${s.title}</div>
                  <div class="scenario-code">${s.smri || ''}</div>
                  <div class="scenario-desc">${s.description || ''}</div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
        <div class="demo-browser-panel">
          <div class="demo-browser-controls">
            <button class="demo-btn secondary" id="demo-reload">🔄</button>
            <input type="text" class="demo-url-bar" id="demo-url" readonly value="Select a scenario to begin">
            <button class="demo-btn secondary" id="demo-toggle-log">📋</button>
          </div>
          <div class="demo-browser-content">
            <iframe class="demo-iframe" id="demo-iframe" src="about:blank"></iframe>
            <div class="demo-status-overlay" id="demo-status"></div>
          </div>
          <div class="demo-log-panel" id="demo-log"></div>
        </div>
      </div>
    `;

    this.attachEventListeners();
  }

  /**
   * Attach event listeners
   */
  attachEventListeners() {
    // Scenario cards
    document.querySelectorAll('.scenario-card').forEach(card => {
      card.addEventListener('click', () => {
        const index = parseInt(card.dataset.index);
        this.loadScenario(index);
      });
    });

    // Browser controls
    document.getElementById('demo-reload')?.addEventListener('click', () => this.reloadIframe());
    document.getElementById('demo-toggle-log')?.addEventListener('click', () => this.toggleLog());
  }

  /**
   * Load and display scenario
   */
  async loadScenario(index) {
    if (index < 0 || index >= this.scenarios.length) return;

    this.currentScenario = this.scenarios[index];
    this.currentStep = 0;
    this.logs = [];

    this.log(`🎬 Loaded: ${this.currentScenario.title}`, 'info');
    
    // Execute onStart lifecycle hook BEFORE rendering steps
    if (this.currentScenario.onStart) {
      this.log('🔧 Setting up demo environment...', 'info');
      try {
        await this.currentScenario.onStart(this);
        this.log('✅ Demo environment ready', 'success');
      } catch (err) {
        this.log(`❌ Setup failed: ${err.message}`, 'error');
        return; // Don't proceed if setup fails
      }
    }
    
    // Now render steps after setup is complete
    this.renderStepsView();
  }

  /**
   * Render steps view
   */
  renderStepsView() {
    const controlPanel = document.querySelector('.demo-control-panel');
    
    controlPanel.innerHTML = `
      <div class="demo-header">
        <h1>${this.currentScenario.icon || '🎬'} ${this.currentScenario.title}</h1>
        <p>${this.currentScenario.smri || ''} • ${this.currentScenario.steps?.length || 0} steps</p>
      </div>
      <div class="demo-steps">
        ${(this.currentScenario.steps || []).map((step, i) => `
          <div class="step-item ${i === this.currentStep ? 'active' : ''} ${i < this.currentStep ? 'completed' : ''}" data-step="${i}">
            <span class="step-number">${i + 1}</span>
            <span class="step-title">${step.title}</span>
            <div class="step-desc">${step.description || ''}</div>
          </div>
        `).join('')}
      </div>
      <div class="demo-controls">
        <button class="demo-btn back" id="demo-back">← Back to Scenarios</button>
        <button class="demo-btn secondary" id="demo-prev" ${this.currentStep === 0 ? 'disabled' : ''}>←</button>
        <button class="demo-btn" id="demo-next">${this.currentStep === (this.currentScenario.steps?.length || 0) - 1 ? '✓ Done' : 'Next →'}</button>
        <button class="demo-btn secondary" id="demo-autoplay">${this.autoPlaying ? '⏸' : '▶'}</button>
      </div>
    `;

    // Attach step event listeners
    document.querySelectorAll('.step-item').forEach(item => {
      item.addEventListener('click', () => {
        const step = parseInt(item.dataset.step);
        this.goToStep(step);
      });
    });

    document.getElementById('demo-back')?.addEventListener('click', () => this.renderScenarioSelector());
    document.getElementById('demo-prev')?.addEventListener('click', () => this.prevStep());
    document.getElementById('demo-next')?.addEventListener('click', () => this.nextStep());
    document.getElementById('demo-autoplay')?.addEventListener('click', () => this.toggleAutoPlay());

    // Execute first step
    this.executeStep(this.currentStep);
  }

  /**
   * Execute a step
   */
  async executeStep(stepIndex) {
    const step = this.currentScenario.steps[stepIndex];
    if (!step) return;

    this.log(`🔄 Step ${stepIndex + 1}: ${step.title}`, 'info');
    this.showStatus(`Executing: ${step.title}`, 'executing');

    try {
      // Load URL if specified
      if (step.url) {
        this.loadIframe(step.url);
        await this.wait(500);
      }

      // Execute action if specified
      if (step.action) {
        await step.action(this);
      }

      // Execute API call if specified
      if (step.api) {
        const result = await this.executeAPI(step.api);
        this.log(`✅ API call successful: ${JSON.stringify(result).substring(0, 100)}`, 'success');
      }

      this.log(`✅ Step ${stepIndex + 1} completed`, 'success');
      this.showStatus(`✓ ${step.title}`, 'success');
      
      // Auto-advance to next step
      await this.wait(2000);
      if (this.currentStep < (this.currentScenario.steps?.length || 0) - 1) {
        this.nextStep();
      } else {
        this.log('🎉 All steps completed!', 'success');
      }

    } catch (error) {
      this.log(`❌ Step ${stepIndex + 1} failed: ${error.message}`, 'error');
      this.showStatus(`✗ ${step.title}: ${error.message}`, 'error');
    }
  }

  /**
   * Execute API call
   */
  async executeAPI(apiConfig) {
    const url = apiConfig.url.startsWith('http') ? apiConfig.url : `${this.workerUrl}${apiConfig.url}`;
    
    this.log(`📡 API: ${apiConfig.method || 'GET'} ${url}`, 'info');

    const response = await fetch(url, {
      method: apiConfig.method || 'GET',
      headers: apiConfig.headers || { 'Content-Type': 'application/json' },
      body: apiConfig.body ? JSON.stringify(apiConfig.body) : undefined
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  }

  /**
   * Navigation methods
   */
  goToStep(stepIndex) {
    if (stepIndex < 0 || stepIndex >= (this.currentScenario.steps?.length || 0)) return;
    this.currentStep = stepIndex;
    this.renderStepsView();
  }

  nextStep() {
    if (this.currentStep < (this.currentScenario.steps?.length || 0) - 1) {
      this.currentStep++;
      this.renderStepsView();
    } else {
      this.log('🎉 Scenario completed!', 'success');
      this.showStatus('✓ All steps completed', 'success');
      
      // Execute onEnd lifecycle hook
      if (this.currentScenario.onEnd) {
        this.executeScenarioEnd();
      }
    }
  }

  async executeScenarioEnd() {
    this.log('🔧 Cleaning up demo...', 'info');
    try {
      await this.currentScenario.onEnd(this);
      this.log('✅ Demo cleanup complete', 'success');
    } catch (err) {
      this.log(`❌ Cleanup failed: ${err.message}`, 'error');
    }
  }

  prevStep() {
    if (this.currentStep > 0) {
      this.currentStep--;
      this.renderStepsView();
    }
  }

  /**
   * Auto-play mode
   */
  toggleAutoPlay() {
    this.autoPlaying = !this.autoPlaying;
    
    if (this.autoPlaying) {
      this.log('▶ Auto-play started', 'info');
      this.autoPlayNext();
    } else {
      this.log('⏸ Auto-play paused', 'info');
    }

    document.getElementById('demo-autoplay').textContent = this.autoPlaying ? '⏸' : '▶';
  }

  async autoPlayNext() {
    if (!this.autoPlaying) return;

    await this.wait(this.autoPlayDelay);
    
    if (this.currentStep < (this.currentScenario.steps?.length || 0) - 1) {
      this.nextStep();
      this.autoPlayNext();
    } else {
      this.autoPlaying = false;
      document.getElementById('demo-autoplay').textContent = '▶';
      this.log('⏹ Auto-play finished', 'info');
    }
  }

  /**
   * Browser controls
   */
  loadIframe(url) {
    const fullUrl = url.startsWith('http') ? url : `${this.baseUrl}${url}`;
    this.iframe = document.getElementById('demo-iframe');
    document.getElementById('demo-url').value = fullUrl;
    
    if (this.iframe) {
      this.iframe.src = fullUrl;
    }
  }

  reloadIframe() {
    if (this.iframe) {
      this.iframe.src = this.iframe.src;
      this.log('🔄 Page reloaded', 'info');
    }
  }

  /**
   * Status overlay
   */
  showStatus(message, type = 'info') {
    const overlay = document.getElementById('demo-status');
    if (!overlay) return;

    overlay.textContent = message;
    overlay.className = `demo-status-overlay show ${type}`;

    if (type !== 'executing') {
      setTimeout(() => {
        overlay.classList.remove('show');
      }, 3000);
    }
  }

  /**
   * Logging
   */
  log(message, type = 'info') {
    const timestamp = new Date().toLocaleTimeString();
    this.logs.push({ timestamp, message, type });

    const logPanel = document.getElementById('demo-log');
    if (!logPanel) return;

    const entry = document.createElement('div');
    entry.className = `demo-log-entry ${type}`;
    entry.textContent = `[${timestamp}] ${message}`;
    
    logPanel.appendChild(entry);
    logPanel.scrollTop = logPanel.scrollHeight;

    console.log(`[Demo] ${message}`);
  }

  toggleLog() {
    const logPanel = document.getElementById('demo-log');
    if (logPanel) {
      logPanel.classList.toggle('show');
    }
  }

  /**
   * Utilities
   */
  wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Auto-init if data attribute present
document.addEventListener('DOMContentLoaded', () => {
  const containers = document.querySelectorAll('[data-demo]');
  containers.forEach(container => {
    const scenariosData = container.getAttribute('data-scenarios');
    if (scenariosData) {
      try {
        const scenarios = JSON.parse(scenariosData);
        const demo = new Demo({
          containerId: container.id,
          scenarios
        });
        demo.init();
      } catch (e) {
        console.error('Demo: Invalid scenarios data', e);
      }
    }
  });
});
