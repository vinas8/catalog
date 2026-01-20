/**
 * Demo Module - Unified Interactive Demo System
 * @module modules/demo/Demo
 * @version 0.7.13
 * 
 * Features:
 * - Mobile-first responsive split-screen layout
 * - Step-by-step scenario execution
 * - In-browser action execution (clicks, forms, etc.)
 * - Background API calls (import, sync, etc.)
 * - Auto-play mode
 * - Progress tracking & logging
 * 
 * SMRI: S9.2,8,5,10.03
 */

import { showSMRIModal } from '../smri/index.js';
import { SMRI_REGISTRY } from '../../config/smri-config.js';

export class Demo {
  constructor(options = {}) {
    this.containerId = options.containerId || 'demo-root';
    this.scenarios = options.scenarios || [];
    this.workerUrl = options.workerUrl || 'https://catalog.navickaszilvinas.workers.dev';
    this.baseUrl = options.baseUrl || window.location.origin;
    this.version = '0.7.50';
    this.smri = SMRI_REGISTRY['component-demo-system'];
    
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
        width: 100vw;
        background: #0a0e14;
        color: #c9d1d9;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        overflow: hidden;
      }
      
      body {
        margin: 0;
        padding: 0;
        overflow: hidden;
      }

      /* Scenario selector - dropdown under URL bar */
      .demo-scenarios {
        position: absolute;
        top: calc(100% + 1px);
        left: 8px;
        right: 8px;
        display: none;
        background: #161b22;
        border: 2px solid #1f6feb;
        border-radius: 6px;
        max-height: 400px;
        overflow-y: auto;
        overflow-x: hidden;
        z-index: 9998;
        box-shadow: 0 8px 16px rgba(0,0,0,0.8);
      }
      
      .demo-scenarios.expanded {
        display: block !important;
      }

      .scenario-grid {
        display: block;
        padding: 6px;
      }

      .scenario-card {
        background: linear-gradient(135deg, #1f6feb 0%, #0969da 100%);
        border: 2px solid #1f6feb;
        padding: 8px 12px;
        border-radius: 6px;
        cursor: pointer;
        transition: all 0.2s;
        margin-bottom: 6px;
        display: block;
      }

      .scenario-card:hover {
        transform: translateY(-1px);
        box-shadow: 0 3px 10px rgba(31, 111, 235, 0.3);
      }
      
      .scenario-card.hidden {
        display: none !important;
      }

      .scenario-grid {
        display: flex;
        flex-direction: column;
        gap: 6px;
        overflow-y: auto;
        overflow-x: hidden;
        padding: 0;
        scrollbar-width: thin;
        height: 100%;
      }

      .scenario-card {
        background: linear-gradient(135deg, #1f6feb 0%, #0969da 100%);
        border: 2px solid #1f6feb;
        padding: 8px 12px;
        border-radius: 6px;
        cursor: pointer;
        transition: all 0.2s;
        flex-shrink: 0;
      }

      .scenario-card:hover {
        transform: translateY(-1px);
        box-shadow: 0 3px 10px rgba(31, 111, 235, 0.3);
      }
      
      .scenario-card.hidden {
        display: none;
      }

      .scenario-title {
        font-size: 12px;
        font-weight: 600;
        color: white;
        margin-bottom: 2px;
      }

      .scenario-code {
        font-size: 9px;
        color: rgba(255,255,255,0.6);
        margin-bottom: 3px;
      }

      .scenario-desc {
        font-size: 10px;
        color: rgba(255,255,255,0.85);
        line-height: 1.2;
      }

      /* Browser in middle */
      .demo-browser-panel {
        flex: 1 1 0;
        min-height: 0;
        display: flex;
        flex-direction: column;
        background: white;
        overflow: visible;
      }

      /* Steps on bottom */
      .demo-control-panel {
        flex: 0 0 50px;
        background: #0d1117;
        border-top: 1px solid #30363d;
        overflow-x: auto;
        overflow-y: hidden;
        display: flex;
        flex-direction: row;
        padding: 8px;
        gap: 4px;
        align-items: center;
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

      /* Steps runner - horizontal, bigger text */
      .demo-steps-runner {
        flex: 1;
        display: flex;
        gap: 4px;
        overflow-x: auto;
        padding: 8px;
        align-items: center;
        scrollbar-width: thin;
        background: #0d1117;
      }

      .step-indicator {
        padding: 8px 12px;
        background: #21262d;
        border: 1px solid #30363d;
        border-radius: 4px;
        font-size: 13px;
        white-space: nowrap;
        color: #c9d1d9;
        transition: all 0.2s;
        flex-shrink: 0;
        cursor: pointer;
      }
      
      .step-indicator:hover {
        background: #30363d;
      }

      .step-indicator.active {
        background: #1f6feb;
        color: white;
        border-color: #1f6feb;
        font-weight: 600;
      }

      .step-indicator.completed {
        background: #238636;
        color: white;
        border-color: #238636;
      }

      /* Step control buttons - minimal inline */
      .step-control-btn {
        background: #21262d;
        color: #c9d1d9;
        border: 1px solid #30363d;
        padding: 8px 12px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 13px;
        transition: all 0.2s;
        flex-shrink: 0;
      }
      
      .step-control-btn:hover {
        background: #30363d;
      }
      
      .step-control-btn:disabled {
        opacity: 0.3;
        cursor: not-allowed;
      }
      
      .step-control-btn.play {
        background: #238636;
        color: white;
        border-color: #238636;
      }
      
      .step-control-btn.pause {
        background: #f85149;
        color: white;
        border-color: #f85149;
      }

      .step-control-btn:hover {
        background: #30363d;
      }

      .step-control-btn:disabled {
        opacity: 0.3;
        cursor: not-allowed;
      }

      .step-control-btn.play {
        background: #238636;
        color: white;
        border-color: #238636;
      }

      .step-control-btn.pause {
        background: #f85149;
        color: white;
        border-color: #f85149;
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
        font-size: 13px;
        font-weight: 600;
        color: #c9d1d9;
      }

      .step-desc {
        font-size: 11px;
        color: #8b949e;
        margin-top: 6px;
        line-height: 1.3;
      }

      /* Controls */
      .demo-controls {
        padding: 10px 15px;
        border-top: 2px solid #30363d;
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
      }

      .demo-btn {
        background: #238636;
        color: white;
        border: none;
        padding: 8px 14px;
        border-radius: 6px;
        cursor: pointer;
        font-size: 13px;
        font-weight: 600;
        transition: all 0.2s;
        flex: 1;
        min-width: 70px;
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
        position: relative;
        overflow: visible;
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

      /* Version footer */
      .demo-version {
        position: fixed;
        bottom: 60px;
        right: 10px;
        font-size: 10px;
        color: #58a6ff;
        background: rgba(13, 17, 23, 0.9);
        padding: 4px 8px;
        border-radius: 4px;
        z-index: 9997;
        cursor: pointer;
        transition: all 0.2s;
        user-select: none;
      }

      .demo-version:hover {
        background: rgba(13, 17, 23, 1);
        transform: translateY(-2px);
      }

      /* SMRI Modal */
      .smri-modal {
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        z-index: 99999;
        align-items: center;
        justify-content: center;
      }

      .smri-modal.show {
        display: flex;
      }

      .smri-modal-content {
        background: #0d1117;
        border: 1px solid #30363d;
        border-radius: 8px;
        padding: 24px;
        max-width: 500px;
        width: 90%;
        color: #c9d1d9;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
      }

      .smri-modal-header {
        font-size: 18px;
        font-weight: 600;
        margin-bottom: 16px;
        color: #58a6ff;
      }

      .smri-modal-body {
        line-height: 1.6;
        margin-bottom: 20px;
      }

      .smri-modal-footer {
        display: flex;
        justify-content: flex-end;
      }

      .smri-close {
        background: #21262d;
        color: #c9d1d9;
        border: 1px solid #30363d;
        padding: 8px 16px;
        border-radius: 6px;
        cursor: pointer;
        font-size: 14px;
        transition: background 0.2s;
      }

      .smri-close:hover {
        background: #2ea043;
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
        <div class="demo-browser-panel">
          <div class="demo-browser-controls">
            <button class="demo-btn secondary" id="demo-reload">🔄</button>
            <input type="text" class="demo-url-bar" id="demo-url" value="" placeholder="Type URL or search scenarios...">
            <button class="demo-btn secondary" id="demo-toggle-log">📋</button>
            <div class="demo-scenarios" id="demo-scenarios">
              <div class="scenario-grid">
                ${this.scenarios.map((s, i) => `
                  <div class="scenario-card" data-index="${i}" data-search="${(s.title + ' ' + s.description).toLowerCase()}">
                    <div class="scenario-title">${s.icon || '📋'} ${s.title}</div>
                    <div class="scenario-code">${s.smri || ''}</div>
                    <div class="scenario-desc">${s.description || ''}</div>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
          <div class="demo-browser-content">
            <iframe class="demo-iframe" id="demo-iframe" src="about:blank"></iframe>
            <div class="demo-status-overlay" id="demo-status"></div>
          </div>
          <div class="demo-log-panel" id="demo-log"></div>
        </div>
        <div class="demo-control-panel" id="demo-control-panel">
          <!-- Steps appear here after selecting scenario -->
        </div>
      </div>
      <div class="demo-version" id="demo-version-badge">${this.smri} • v${this.version}</div>
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
        // Collapse scenarios after selection
        document.querySelector('.demo-scenarios')?.classList.remove('expanded');
      });
    });

    // Browser controls
    document.getElementById('demo-reload')?.addEventListener('click', () => this.reloadIframe());
    document.getElementById('demo-toggle-log')?.addEventListener('click', () => this.toggleLog());
    
    // URL bar - make editable and toggle scenarios
    const urlBar = document.getElementById('demo-url');
    const scenarios = document.getElementById('demo-scenarios');
    
    console.log('🔍 URL bar:', urlBar);
    console.log('🔍 Scenarios:', scenarios);
    
    if (urlBar && scenarios) {
      // Show ALL scenarios on focus/click
      urlBar.addEventListener('focus', () => {
        console.log('✅ URL bar focused');
        // Show all cards first
        document.querySelectorAll('.scenario-card').forEach(card => {
          card.classList.remove('hidden');
        });
        scenarios.classList.add('expanded');
        console.log('✅ Added expanded class');
      });
      
      urlBar.addEventListener('click', (e) => {
        e.stopPropagation();
        console.log('✅ URL bar clicked');
        // Show all cards
        document.querySelectorAll('.scenario-card').forEach(card => {
          card.classList.remove('hidden');
        });
        scenarios.classList.add('expanded');
        console.log('✅ Added expanded class');
        console.log('📊 Scenarios display:', window.getComputedStyle(scenarios).display);
        console.log('📊 Scenarios z-index:', window.getComputedStyle(scenarios).zIndex);
        console.log('📊 Scenarios top:', window.getComputedStyle(scenarios).top);
      });
      
      // Filter scenarios while typing
      urlBar.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        const cards = document.querySelectorAll('.scenario-card');
        
        if (!query) {
          // Empty query - show all
          cards.forEach(card => card.classList.remove('hidden'));
          scenarios?.classList.add('expanded');
        } else if (query.startsWith('/') || query.startsWith('http')) {
          // Typing URL - hide all scenarios
          cards.forEach(card => card.classList.add('hidden'));
        } else {
          // Filter scenarios by search text
          let visibleCount = 0;
          cards.forEach(card => {
            const searchText = card.dataset.search || '';
            if (searchText.includes(query)) {
              card.classList.remove('hidden');
              visibleCount++;
            } else {
              card.classList.add('hidden');
            }
          });
          
          // Keep expanded if any visible
          if (visibleCount > 0) {
            scenarios?.classList.add('expanded');
          }
        }
      });
      
      // Navigate on Enter
      urlBar.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          const url = e.target.value;
          if (url.startsWith('/') || url.startsWith('http')) {
            this.loadIframe(url);
            this.log(`🔗 Navigated to: ${url}`, 'info');
            scenarios?.classList.remove('expanded');
          }
        }
      });
    }
    
    // Hide scenarios when clicking outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.demo-browser-controls')) {
        scenarios?.classList.remove('expanded');
      }
    });
    
    // Version badge - clickable SMRI decoder
    const versionBadge = document.getElementById('demo-version-badge');
    if (versionBadge) {
      versionBadge.addEventListener('click', () => this.showSMRIDecoder());
    }
  }

  /**
   * Show SMRI decoder modal
   */
  async showSMRIDecoder() {
    try {
      await showSMRIModal(this.smri);
    } catch (err) {
      this.log(`⚠️ SMRI modal error: ${err.message}`, 'warning');
      alert(`SMRI Code: ${this.smri}\n\nS = Serpent Town\n9 = Demo module\n2,8,5,10 = Dependencies (common, debug, testing, smri)\n04 = Iteration 4`);
    }
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
      <div class="demo-steps-runner" id="demo-steps-runner">
        ${(this.currentScenario.steps || []).map((step, i) => `
          <div class="step-indicator ${i === this.currentStep ? 'active' : ''} ${i < this.currentStep ? 'completed' : ''}" data-step="${i}" title="${step.title}">
            ${i + 1}. ${step.title.replace(/Step \d+: /, '')}
          </div>
        `).join('')}
      </div>
    `;

    // Auto-scroll active step into view
    setTimeout(() => {
      const activeStep = controlPanel.querySelector('.step-indicator.active');
      if (activeStep) {
        activeStep.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }, 100);

    // Attach step event listeners
    document.querySelectorAll('.step-indicator').forEach(item => {
      item.addEventListener('click', () => {
        const step = parseInt(item.dataset.step);
        this.goToStep(step);
      });
    });

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
  /**
   * Load URL in iframe and optionally scroll to top
   */
  loadIframe(url) {
    const fullUrl = url.startsWith('http') ? url : `${this.baseUrl}${url}`;
    this.iframe = document.getElementById('demo-iframe');
    const currentUrl = this.iframe?.src || '';
    document.getElementById('demo-url').value = fullUrl;
    
    if (this.iframe) {
      // Only reload and scroll to top if URL is different
      if (currentUrl !== fullUrl) {
        this.iframe.src = fullUrl;
        // Scroll to top only on new page load
        this.iframe.onload = () => {
          try {
            this.iframe.contentWindow.scrollTo(0, 0);
          } catch (e) {
            // CORS - can't access cross-origin iframe
          }
        };
      }
      // Same URL - keep scroll position (don't reload)
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
