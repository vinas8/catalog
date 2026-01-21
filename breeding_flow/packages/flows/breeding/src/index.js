/**
 * Breeding Flow Entry Point
 * @module @serpent-town/breeding-flow
 */

export class BreedingFlow {
  constructor(options = {}) {
    this.containerId = options.containerId || 'breeding-flow-container';
    this.maleMorphs = options.maleMorphs || [];
    this.femaleMorphs = options.femaleMorphs || [];
    this.onComplete = options.onComplete || (() => {});
    this.onCancel = options.onCancel || (() => {});
    
    this.currentStep = 1;
    this.morphDatabase = [];
    
    this.basePath = window.location.hostname.includes('github.io') ? '/catalog' : '';
    this.version = '0.777';
  }
  
  async init() {
    console.log('🧬 Initializing Breeding Flow v' + this.version);
    
    // Load genetics database
    const response = await fetch(`${this.basePath}/data/genetics/morphs-comprehensive.json?v=${this.version}`);
    const data = await response.json();
    this.morphDatabase = data.morphs || [];
    
    console.log(`✅ Loaded ${this.morphDatabase.length} morphs`);
    
    // Load state management
    const stateModule = await import(`${this.basePath}/src/core/state.js?v=${this.version}`);
    this.markProgress = stateModule.markProgress;
    
    // Load genetics engine
    const geneticsModule = await import(`${this.basePath}/src/modules/breeding/genetics-core.js?v=${this.version}`);
    this.calculateOffspring = geneticsModule.calculateOffspring;
    this.checkLethalCombo = geneticsModule.checkLethalCombo;
    this.assessHealthRisk = geneticsModule.assessHealthRisk;
    
    return this;
  }
  
  async start() {
    await this.init();
    this.render();
    
    // Check for URL params
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('male')) {
      this.maleMorphs = urlParams.get('male').split(',');
    }
    if (urlParams.get('female')) {
      this.femaleMorphs = urlParams.get('female').split(',');
      
      if (this.maleMorphs.length > 0 && this.femaleMorphs.length > 0) {
        this.goToResults();
      }
    }
  }
  
  render() {
    // Rendering logic here
    console.log('Rendering flow...');
  }
  
  reset() {
    this.maleMorphs = [];
    this.femaleMorphs = [];
    this.currentStep = 1;
    this.render();
  }
}

export default BreedingFlow;
