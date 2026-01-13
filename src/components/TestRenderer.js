/**
 * TestRenderer Component
 * @module components/TestRenderer
 * @version 0.7.7
 * 
 * Reusable test render component with scenario navigation.
 * Used by:
 * - debug/tools/smri-runner.html (conditional - DOM testing only)
 * - debug/releases/demo.html (demo presentations)
 */

export class TestRenderer {
  constructor(options = {}) {
    this.containerId = options.containerId || 'test-renderer';
    this.scenarios = options.scenarios || [];
    this.currentIndex = 0;
    this.onScenarioChange = options.onScenarioChange || null;
    this.showControls = options.showControls !== false; // Default true
    this.container = null;
  }

  /**
   * Initialize the renderer and inject into DOM
   */
  init() {
    this.container = document.getElementById(this.containerId);
    if (!this.container) {
      console.error(`TestRenderer: Container #${this.containerId} not found`);
      return false;
    }
    
    this.render();
    this.attachEventListeners();
    return true;
  }

  /**
   * Render the current scenario
   */
  render() {
    if (!this.container) return;
    
    const scenario = this.scenarios[this.currentIndex];
    if (!scenario) {
      this.container.innerHTML = '<div class="no-scenarios">No scenarios available</div>';
      return;
    }

    this.container.innerHTML = `
      <div class="test-renderer">
        <div class="scenario-header">
          <span class="scenario-badge">${scenario.smri || scenario.id}</span>
          <h3 class="scenario-title">${scenario.title}</h3>
          ${scenario.description ? `<p class="scenario-desc">${scenario.description}</p>` : ''}
        </div>
        
        <div class="scenario-content" id="scenario-content">
          <div class="scenario-frame">
            ${scenario.url ? 
              `<iframe src="${scenario.url}" id="scenario-iframe"></iframe>` :
              `<div class="scenario-placeholder">
                <p>📋 Manual test scenario</p>
                <p class="hint">Follow the steps in the scenario file</p>
              </div>`
            }
          </div>
        </div>
        
        ${this.showControls ? this.renderControls() : ''}
      </div>
    `;
  }

  /**
   * Render navigation controls
   */
  renderControls() {
    const hasPrev = this.currentIndex > 0;
    const hasNext = this.currentIndex < this.scenarios.length - 1;
    const progress = this.scenarios.length > 0 
      ? Math.round(((this.currentIndex + 1) / this.scenarios.length) * 100)
      : 0;

    return `
      <div class="scenario-controls">
        <button 
          class="btn-nav btn-prev" 
          ${!hasPrev ? 'disabled' : ''}
          data-action="prev"
        >
          ← Previous
        </button>
        
        <div class="scenario-info">
          <span class="scenario-count">${this.currentIndex + 1} / ${this.scenarios.length}</span>
          <div class="scenario-progress">
            <div class="progress-bar" style="width: ${progress}%"></div>
          </div>
        </div>
        
        <button 
          class="btn-nav btn-next" 
          ${!hasNext ? 'disabled' : ''}
          data-action="next"
        >
          Next →
        </button>
      </div>
    `;
  }

  /**
   * Attach event listeners to controls
   */
  attachEventListeners() {
    if (!this.container || !this.showControls) return;

    this.container.addEventListener('click', (e) => {
      const action = e.target.closest('[data-action]')?.dataset.action;
      if (!action) return;

      if (action === 'prev') this.prev();
      if (action === 'next') this.next();
    });
  }

  /**
   * Navigate to previous scenario
   */
  prev() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.render();
      this.notifyChange();
    }
  }

  /**
   * Navigate to next scenario
   */
  next() {
    if (this.currentIndex < this.scenarios.length - 1) {
      this.currentIndex++;
      this.render();
      this.notifyChange();
    }
  }

  /**
   * Jump to specific scenario by index
   */
  goTo(index) {
    if (index >= 0 && index < this.scenarios.length) {
      this.currentIndex = index;
      this.render();
      this.notifyChange();
    }
  }

  /**
   * Notify parent of scenario change
   */
  notifyChange() {
    if (this.onScenarioChange) {
      const scenario = this.scenarios[this.currentIndex];
      this.onScenarioChange(scenario, this.currentIndex);
    }
  }

  /**
   * Update scenarios dynamically
   */
  setScenarios(scenarios) {
    this.scenarios = scenarios;
    this.currentIndex = 0;
    this.render();
  }

  /**
   * Get current scenario
   */
  getCurrentScenario() {
    return this.scenarios[this.currentIndex];
  }

  /**
   * Destroy renderer and cleanup
   */
  destroy() {
    if (this.container) {
      this.container.innerHTML = '';
    }
    this.container = null;
    this.scenarios = [];
    this.currentIndex = 0;
  }
}

/**
 * Default styles (can be overridden)
 */
export const DEFAULT_STYLES = `
  .test-renderer {
    display: flex;
    flex-direction: column;
    height: 100%;
    background: white;
    border-radius: 8px;
    overflow: hidden;
  }

  .scenario-header {
    padding: 1rem;
    border-bottom: 2px solid #e0e0e0;
    background: #f5f5f5;
  }

  .scenario-badge {
    display: inline-block;
    padding: 0.25rem 0.5rem;
    background: #4a90e2;
    color: white;
    border-radius: 4px;
    font-size: 0.8rem;
    font-weight: bold;
    margin-bottom: 0.5rem;
  }

  .scenario-title {
    margin: 0.5rem 0 0 0;
    color: #333;
  }

  .scenario-desc {
    margin: 0.5rem 0 0 0;
    color: #666;
    font-size: 0.9rem;
  }

  .scenario-content {
    flex: 1;
    position: relative;
    overflow: hidden;
  }

  .scenario-frame {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }

  #scenario-iframe {
    width: 100%;
    height: 100%;
    border: none;
  }

  .scenario-placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: #999;
  }

  .scenario-placeholder .hint {
    font-size: 0.9rem;
    margin-top: 0.5rem;
  }

  .scenario-controls {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    border-top: 2px solid #e0e0e0;
    background: #fafafa;
  }

  .btn-nav {
    padding: 0.5rem 1rem;
    background: #4a90e2;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 500;
    transition: background 0.2s;
  }

  .btn-nav:hover:not(:disabled) {
    background: #357abd;
  }

  .btn-nav:disabled {
    background: #ccc;
    cursor: not-allowed;
  }

  .scenario-info {
    flex: 1;
    text-align: center;
  }

  .scenario-count {
    display: block;
    font-weight: 600;
    margin-bottom: 0.5rem;
    color: #333;
  }

  .scenario-progress {
    height: 4px;
    background: #e0e0e0;
    border-radius: 2px;
    overflow: hidden;
  }

  .progress-bar {
    height: 100%;
    background: #4a90e2;
    transition: width 0.3s ease;
  }

  .no-scenarios {
    padding: 2rem;
    text-align: center;
    color: #999;
  }
`;

export default TestRenderer;
