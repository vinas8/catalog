/**
 * SMRI Test Runner Module
 * @version 0.7.7
 * @module modules/smri/SMRIRunner
 */

export class SMRIRunner {
  constructor(options = {}) {
    this.workerUrl = options.workerUrl || 'https://catalog.navickaszilvinas.workers.dev';
    this.basePath = window.location.origin + window.location.pathname.replace(/\/[^/]*$/, '');
    this.scenarios = options.scenarios || [];
    
    this.results = {
      passed: 0,
      failed: 0,
      total: 0,
      duration: 0,
      scenarios: []
    };
    
    this.currentStep = 0;
    this.debugLogs = [];
    this.debugAutoScroll = true;
  }

  init() {
    this.initScenarios();
    this.attachEventHandlers();
    this.updateStats();
  }

  initScenarios() {
    const scenarioGrid = document.getElementById('scenarioGrid');
    if (!scenarioGrid) return;
    
    scenarioGrid.innerHTML = this.scenarios.map(s => `
      <div class="scenario-card" data-id="${s.id}">
        <div class="scenario-title">${s.icon} ${s.title}</div>
        <div class="scenario-id">${s.smri}</div>
        <div class="scenario-status">
          <span class="icon">⏸️</span>
          <span>Not run</span>
        </div>
      </div>
    `).join('');
    
    document.querySelectorAll('.scenario-card').forEach(card => {
      card.addEventListener('click', () => {
        const id = card.dataset.id;
        this.runScenario(id);
      });
    });
  }

  attachEventHandlers() {
    const runAllBtn = document.getElementById('runAll');
    const clearBtn = document.getElementById('clearConsole');
    const autoScrollCheck = document.getElementById('autoScrollCheck');
    
    if (runAllBtn) runAllBtn.addEventListener('click', () => this.runAll());
    if (clearBtn) clearBtn.addEventListener('click', () => this.clearConsole());
    if (autoScrollCheck) {
      autoScrollCheck.addEventListener('change', (e) => {
        this.debugAutoScroll = e.target.checked;
      });
    }
  }

  log(message, type = 'info') {
    const time = new Date().toLocaleTimeString();
    const consoleOutput = document.getElementById('consoleOutput');
    if (!consoleOutput) return;
    
    const entry = document.createElement('div');
    entry.className = 'log-entry';
    entry.innerHTML = `
      <span class="log-time">${time}</span>
      <span class="log-message" style="color: ${this.getLogColor(type)}">${message}</span>
    `;
    
    consoleOutput.appendChild(entry);
    if (this.debugAutoScroll) consoleOutput.scrollTop = consoleOutput.scrollHeight;
  }

  getLogColor(type) {
    const colors = {
      info: '#58a6ff',
      success: '#3fb950',
      error: '#f85149',
      warning: '#d29922'
    };
    return colors[type] || colors.info;
  }

  clearConsole() {
    const consoleOutput = document.getElementById('consoleOutput');
    if (consoleOutput) consoleOutput.innerHTML = '';
    this.debugLogs = [];
  }

  updateScenarioCard(id, status, message) {
    const card = document.querySelector(`[data-id="${id}"]`);
    if (!card) return;
    
    const statusEl = card.querySelector('.scenario-status');
    const icons = { running: '⏳', passed: '✅', failed: '❌', pending: '⏸️' };
    
    statusEl.innerHTML = `
      <span class="icon">${icons[status] || '⏸️'}</span>
      <span>${message}</span>
    `;
    card.className = `scenario-card status-${status}`;
  }

  updateStats() {
    const passedEl = document.getElementById('stats-passed');
    const failedEl = document.getElementById('stats-failed');
    const totalEl = document.getElementById('stats-total');
    
    if (passedEl) passedEl.textContent = `${this.results.passed} passed`;
    if (failedEl) failedEl.textContent = `${this.results.failed} failed`;
    if (totalEl) totalEl.textContent = `${this.results.total} total`;
  }

  updateGlobalStatus() {
    const globalStatus = document.getElementById('globalStatus');
    if (!globalStatus) return;
    
    if (this.results.total === 0) {
      globalStatus.textContent = 'Ready';
      globalStatus.style.background = 'rgba(255,255,255,0.2)';
    } else if (this.results.failed === 0) {
      globalStatus.textContent = `✅ All Passed (${this.results.passed}/${this.results.total})`;
      globalStatus.style.background = '#238636';
    } else {
      globalStatus.textContent = `⚠️ ${this.results.failed} Failed`;
      globalStatus.style.background = '#da3633';
    }
  }

  loadInRender(url) {
    const renderFrame = document.getElementById('renderFrame');
    const renderPanel = document.getElementById('renderPanel');
    
    if (!renderFrame || !renderPanel) return;
    
    renderPanel.style.display = 'block';
    if (url) {
      this.log(`Loading: ${url}`, 'info');
      renderFrame.src = url;
    }
  }

  async runScenario(id) {
    const scenario = this.scenarios.find(s => s.id === id);
    if (!scenario) {
      this.log(`Scenario ${id} not found`, 'error');
      return;
    }
    
    this.log(`\n${'='.repeat(50)}\n🧪 Running: ${scenario.title}\n${'='.repeat(50)}`, 'info');
    this.updateScenarioCard(id, 'running', 'Running...');
    
    let result;
    const startTime = performance.now();
    
    try {
      if (scenario.url) this.loadInRender(scenario.url);
      result = await this.executeTest(scenario);
    } catch (error) {
      result = { passed: false, error: error.message, duration: performance.now() - startTime };
    }
    
    result.duration = Math.round(performance.now() - startTime);
    
    this.results.total++;
    this.results.duration += result.duration;
    
    if (result.passed) {
      this.results.passed++;
      this.log(`✅ PASSED in ${result.duration}ms\n`, 'success');
      this.updateScenarioCard(id, 'passed', `Passed (${result.duration}ms)`);
    } else {
      this.results.failed++;
      this.log(`❌ FAILED: ${result.error}\n`, 'error');
      this.updateScenarioCard(id, 'failed', result.error);
    }
    
    this.updateStats();
    this.updateGlobalStatus();
    return result;
  }

  async executeTest(scenario) {
    if (scenario.testFn) return await scenario.testFn(this);
    return { passed: true, duration: 0 };
  }

  async runAll() {
    this.log('🚀 Running all tests...', 'info');
    this.results = { passed: 0, failed: 0, total: 0, duration: 0, scenarios: [] };
    
    for (const scenario of this.scenarios) {
      await this.runScenario(scenario.id);
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    this.log(`\n${'='.repeat(50)}\n📊 All tests complete!\n${'='.repeat(50)}`, 'info');
  }

  getSummary() {
    return {
      ...this.results,
      passRate: this.results.total > 0 
        ? Math.round((this.results.passed / this.results.total) * 100) 
        : 0
    };
  }
}
