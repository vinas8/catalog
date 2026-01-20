/**
 * SplitScreenDemo Component
 * @module components/SplitScreenDemo
 * @version 0.7.9
 * 
 * Split-screen demo component for interactive scenarios:
 * - Top: Live browser iframe (2/3 height)
 * - Bottom: Scenario steps/instructions (1/3 height)
 * 
 * Used by:
 * - debug/tools/smri-runner.html (SMRI scenarios)
 * - debug/releases/demo.html (presentations)
 * - All interactive demos
 * 
 * SMRI: S9.3,2.03
 */

import { SMRI_REGISTRY } from '../config/smri-config.js';

export class SplitScreenDemo {
  constructor(options = {}) {
    this.containerId = options.containerId || 'split-demo';
    this.scenarios = options.scenarios || [];
    this.currentIndex = 0;
    this.currentStepIndex = 0;
    this.autoAdvance = options.autoAdvance || false;
    this.autoDelay = options.autoDelay || 3000;
    this.onScenarioChange = options.onScenarioChange || null;
    this.container = null;
    this.iframe = null;
    this.version = '0.7.10';
    this.smri = SMRI_REGISTRY['component-split-screen-demo'];
    this.moduleMap = {
      0: 'Core/Internal',
      1: 'Auth',
      2: 'Common',
      3: 'Game',
      4: 'Shop',
      5: 'Testing',
      6: 'Payment',
      7: 'Import',
      8: 'Debug',
      9: 'Demo'
    };
  }

  /**
   * Initialize split-screen demo
   */
  init() {
    this.container = document.getElementById(this.containerId);
    if (!this.container) {
      console.error(`SplitScreenDemo: Container #${this.containerId} not found`);
      return false;
    }

    this.injectStyles();
    this.render();
    this.attachEventListeners();
    return true;
  }

  /**
   * Inject CSS styles
   */
  injectStyles() {
    if (document.getElementById('split-demo-styles')) return;

    const style = document.createElement('style');
    style.id = 'split-demo-styles';
    style.textContent = `
      .split-demo-container {
        display: flex;
        flex-direction: column;
        height: calc(100vh - 100px);
        gap: 20px;
        background: #0a0e14;
        border-radius: 12px;
        overflow: hidden;
      }

      .split-demo-left {
        flex: 0 0 20vh;
        background: #161b22;
        border: 2px solid #30363d;
        border-radius: 12px;
        padding: 15px;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        order: 2;
      }

      .split-demo-right {
        flex: 0 0 calc(80vh - 140px);
        background: white;
        border: 3px solid #30363d;
        border-radius: 12px;
        overflow: hidden;
        position: relative;
        order: 1;
        min-height: 66vh;
      }

      .split-demo-header {
        margin-bottom: 20px;
      }

      .split-demo-title {
        font-size: 20px;
        color: #58a6ff;
        margin-bottom: 8px;
      }

      .split-demo-meta {
        font-size: 13px;
        color: #8b949e;
      }

      .split-demo-steps {
        flex: 1;
        margin-bottom: 20px;
      }

      .split-demo-step {
        background: #0d1117;
        border: 1px solid #30363d;
        border-radius: 8px;
        padding: 15px;
        margin-bottom: 12px;
      }

      .split-demo-step-number {
        display: inline-block;
        background: #238636;
        color: white;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        text-align: center;
        line-height: 24px;
        font-size: 12px;
        font-weight: bold;
        margin-right: 8px;
      }

      .split-demo-step-text {
        color: #c9d1d9;
        font-size: 14px;
        line-height: 1.6;
      }

      .split-demo-step.complete .split-demo-step-number {
        background: #1f6feb;
      }

      .split-demo-controls {
        display: flex;
        gap: 10px;
        padding-top: 15px;
        border-top: 1px solid #30363d;
      }

      .split-demo-btn {
        flex: 1;
        background: #238636;
        color: white;
        border: none;
        padding: 12px;
        border-radius: 8px;
        cursor: pointer;
        font-size: 14px;
        font-weight: 600;
        transition: all 0.2s;
      }

      .split-demo-btn:hover {
        background: #2ea043;
        transform: translateY(-1px);
      }

      .split-demo-btn:disabled {
        background: #30363d;
        cursor: not-allowed;
        transform: none;
      }

      .split-demo-btn.primary {
        background: #1f6feb;
      }

      .split-demo-btn.primary:hover {
        background: #388bfd;
      }

      .split-demo-iframe {
        width: 100%;
        height: 100%;
        border: none;
        display: block;
      }

      .split-demo-loading {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        color: #8b949e;
        font-size: 16px;
      }

      /* Version footer */
      .split-demo-version {
        position: fixed;
        bottom: 10px;
        right: 10px;
        font-size: 10px;
        color: #58a6ff;
        background: rgba(13, 17, 23, 0.9);
        padding: 4px 8px;
        border-radius: 4px;
        z-index: 9999;
        cursor: pointer;
        transition: all 0.2s;
      }

      .split-demo-version:hover {
        background: rgba(13, 17, 23, 1);
        transform: translateY(-2px);
      }

      /* SMRI Decoder Modal */
      .smri-modal {
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: rgba(0, 0, 0, 0.8);
        z-index: 10000;
        align-items: center;
        justify-content: center;
      }

      .smri-modal.show {
        display: flex;
      }

      .smri-modal-content {
        background: #0d1117;
        border: 2px solid #30363d;
        border-radius: 12px;
        padding: 30px;
        max-width: 500px;
        color: #c9d1d9;
      }

      .smri-modal-header {
        font-size: 20px;
        color: #58a6ff;
        margin-bottom: 20px;
        font-weight: bold;
      }

      .smri-modal-body {
        line-height: 1.8;
      }

      .smri-code {
        font-family: 'SF Mono', Monaco, monospace;
        background: #161b22;
        padding: 2px 6px;
        border-radius: 3px;
        color: #79c0ff;
      }

      .smri-close {
        margin-top: 20px;
        background: #238636;
        color: white;
        border: none;
        padding: 10px 20px;
        border-radius: 6px;
        cursor: pointer;
        font-weight: 600;
      }

      .smri-close:hover {
        background: #2ea043;
      }

      /* Mobile responsive */
      @media (max-width: 1024px) {
        .split-demo-container {
          height: auto;
        }

        .split-demo-left {
          max-height: 40vh;
        }

        .split-demo-right {
          min-height: 400px;
        }
      }
    `;
    document.head.appendChild(style);
  }

  /**
   * Render split-screen UI
   */
  render() {
    if (!this.container) return;

    const scenario = this.scenarios[this.currentIndex];
    if (!scenario) {
      this.container.innerHTML = '<div style="color: #8b949e; padding: 20px;">No scenarios available</div>';
      return;
    }

    this.container.innerHTML = `
      <div class="split-demo-container">
        <!-- Top Panel: Browser (2/3 height) -->
        <div class="split-demo-right">
          <div class="split-demo-loading">Loading...</div>
          <iframe 
            class="split-demo-iframe" 
            id="demo-iframe"
            src="${scenario.url || 'about:blank'}"
          ></iframe>
        </div>

        <!-- Bottom Panel: Steps & Controls (1/3 height) -->
        <div class="split-demo-left">
          <div class="split-demo-steps">
            ${this.renderSteps(scenario)}
          </div>

          <div class="split-demo-controls">
            <button class="split-demo-btn" id="prev-btn" ${this.currentIndex === 0 ? 'disabled' : ''}>
              ← Previous
            </button>
            <button class="split-demo-btn primary" id="next-btn" ${this.currentIndex === this.scenarios.length - 1 ? 'disabled' : ''}>
              Next →
            </button>
          </div>
        </div>
      </div>
      <div class="split-demo-version" id="smri-badge">${this.getCurrentSMRI()} • v${this.version}</div>
    `;

    this.iframe = document.getElementById('demo-iframe');
  }

  /**
   * Render scenario steps
   */
  renderSteps(scenario) {
    const steps = scenario.steps || [];
    
    if (steps.length === 0) {
      return '<div style="color: #8b949e; padding: 15px;">No steps defined for this scenario.</div>';
    }

    return steps.map((step, index) => `
      <div class="split-demo-step ${step.complete ? 'complete' : ''}">
        <span class="split-demo-step-number">${index + 1}</span>
        <span class="split-demo-step-text">${step.text || step}</span>
      </div>
    `).join('');
  }

  /**
   * Attach event listeners
   */
  attachEventListeners() {
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const smriBadge = document.getElementById('smri-badge');
    const smriModal = document.getElementById('smri-modal');
    const smriClose = document.getElementById('smri-close');

    if (prevBtn) {
      prevBtn.addEventListener('click', () => this.previous());
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => this.next());
    }

    if (smriBadge) {
      smriBadge.addEventListener('click', () => this.showSMRIDecoder());
    }

    if (smriClose) {
      smriClose.addEventListener('click', () => this.hideSMRIDecoder());
    }

    if (smriModal) {
      smriModal.addEventListener('click', (e) => {
        if (e.target === smriModal) this.hideSMRIDecoder();
      });
    }

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.hideSMRIDecoder();
      } else if (e.key === 'ArrowLeft') {
        this.previous();
      } else if (e.key === 'ArrowRight') {
        this.next();
      }
    });

    // Auto-advance
    if (this.autoAdvance && this.currentIndex < this.scenarios.length - 1) {
      setTimeout(() => this.next(), this.autoDelay);
    }
  }

  /**
   * Navigate to next scenario
   */
  next() {
    if (this.currentIndex < this.scenarios.length - 1) {
      this.currentIndex++;
      this.render();
      this.attachEventListeners();
      
      if (this.onScenarioChange) {
        this.onScenarioChange(this.scenarios[this.currentIndex], this.currentIndex);
      }
    }
  }

  /**
   * Navigate to previous scenario
   */
  previous() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.render();
      this.attachEventListeners();
      
      if (this.onScenarioChange) {
        this.onScenarioChange(this.scenarios[this.currentIndex], this.currentIndex);
      }
    }
  }

  /**
   * Navigate to specific scenario
   */
  goTo(index) {
    if (index >= 0 && index < this.scenarios.length) {
      this.currentIndex = index;
      this.render();
      this.attachEventListeners();
      
      if (this.onScenarioChange) {
        this.onScenarioChange(this.scenarios[this.currentIndex], this.currentIndex);
      }
    }
  }

  /**
   * Reload current iframe
   */
  reload() {
    if (this.iframe) {
      this.iframe.src = this.iframe.src;
    }
  }

  /**
   * Get current SMRI code (scenario or step-specific)
   */
  getCurrentSMRI() {
    const scenario = this.scenarios[this.currentIndex];
    if (!scenario) return this.smri;
    
    // Use step-specific SMRI if available
    const steps = scenario.steps || [];
    const currentStep = steps[this.currentStepIndex];
    if (currentStep && currentStep.smri) {
      return currentStep.smri;
    }
    
    // Use scenario SMRI if available
    return scenario.smri || this.smri;
  }

  /**
   * Update version badge with current SMRI
   */
  updateVersionBadge() {
    const badge = document.getElementById('smri-badge');
    if (badge) {
      badge.textContent = `${this.getCurrentSMRI()} • v${this.version}`;
    }
  }

  /**
   * Show SMRI decoder modal
   */
  showSMRIDecoder() {
    const currentSMRI = this.getCurrentSMRI();
    showSMRIModal(currentSMRI);
  }

  /**
   * Hide SMRI decoder modal (handled by SMRI module)
   */
  hideSMRIDecoder() {
    const modal = document.getElementById('smri-modal');
    if (modal) {
      modal.classList.remove('show');
    }
  }
}

// Auto-init if data attribute present
document.addEventListener('DOMContentLoaded', () => {
  const containers = document.querySelectorAll('[data-split-demo]');
  containers.forEach(container => {
    const scenariosData = container.getAttribute('data-scenarios');
    if (scenariosData) {
      try {
        const scenarios = JSON.parse(scenariosData);
        const demo = new SplitScreenDemo({
          containerId: container.id,
          scenarios
        });
        demo.init();
      } catch (e) {
        console.error('SplitScreenDemo: Invalid scenarios data', e);
      }
    }
  });
});
