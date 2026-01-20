/**
 * SMRI Scenario Definitions
 * @version 0.7.7
 * Central registry of all test scenarios
 * 
 * NOTE: All SMRI codes imported from smri-config.js (single source of truth)
 */

import { SMRI_REGISTRY } from '../smri-config.js';

export const SMRI_SCENARIOS = [
  // === HEALTH MODULE (S0) - System health checks ===
  {
    id: 's0-health-generic',
    title: 'S0.0.01: Generic Debug Health',
    smri: SMRI_REGISTRY['healthcheck'],
    module: 'health',
    url: '../debug/healthcheck.html',
    icon: '🏥',
    status: '✅',
    autoRun: true
  },
  {
    id: 's0-game-mechanics',
    title: 'S0.2.01: Game Mechanics Check',
    smri: SMRI_REGISTRY['game-mechanics'],
    module: 'health',
    url: '../../game.html',
    icon: '🎮',
    status: '⏳'
  },
  {
    id: 's0-auth-validation',
    title: 'S0.3.01: Auth Validation',
    smri: SMRI_REGISTRY['auth-validation'],
    module: 'health',
    url: '../../account.html',
    icon: '🔐',
    status: '⏳'
  },
  {
    id: 's0-stripe-integration',
    title: 'S0.4.01: Stripe Integration',
    smri: SMRI_REGISTRY['stripe-integration'],
    module: 'health',
    url: '../../catalog.html',
    icon: '💳',
    status: '⏳'
  },
  {
    id: 's0-worker-kv',
    title: 'S0.5,5-1.01: Worker API & KV',
    smri: SMRI_REGISTRY['worker-kv'],
    module: 'health',
    url: null,
    icon: '⚙️',
    status: '✅',
    autoRun: true
  },

  // === SHOP MODULE (S1) - Purchase flows ===
  {
    id: 's1-happy-path-purchase',
    title: 'S1.1,2,3,4,5.01: Happy Path Purchase',
    smri: SMRI_REGISTRY['happy-path-purchase'],
    module: 'shop',
    url: '../../catalog.html',
    icon: '🛒',
    status: '✅'
  },
  {
    id: 's1-product-availability',
    title: 'S1.1.01: Product Availability',
    smri: SMRI_REGISTRY['product-availability'],
    module: 'shop',
    url: '../../catalog.html',
    icon: '📦',
    status: '✅'
  },
  {
    id: 's1-buy-five-snakes',
    title: 'S1.1,2.02: Buy Five Snakes',
    smri: SMRI_REGISTRY['buy-five-snakes'],
    module: 'shop',
    url: '../../catalog.html',
    icon: '🐍',
    status: '✅'
  },

  // === GAME MODULE (S2) - Care mechanics & tutorial ===
  {
    id: 's2-tutorial-happy-path',
    title: 'S2.7,5,5-1.01: Tutorial Happy Path',
    smri: SMRI_REGISTRY['tutorial-happy-path'],
    module: 'game',
    url: '../../game.html',
    icon: '📚',
    status: '✅'
  },
  {
    id: 's2-tutorial-missed-care',
    title: 'S2.7,5,5-1.02: Tutorial Missed Care',
    smri: SMRI_REGISTRY['tutorial-missed-care'],
    module: 'game',
    url: '../../game.html',
    icon: '⚠️',
    status: '✅'
  },
  {
    id: 's2-gamified-shop',
    title: 'S2.1,2.01: Gamified Shop',
    smri: SMRI_REGISTRY['gamified-shop'],
    module: 'game',
    url: '../../game.html',
    icon: '🎮',
    status: '⏳'
  },

  // === AUTH MODULE (S3) - User authentication ===
  {
    id: 's3-calculator-genetics-data',
    title: 'S3.2,3.01: Calculator Genetics Data',
    smri: SMRI_REGISTRY['calculator-genetics-data'],
    module: 'auth',
    url: '../../calculator.html',
    icon: '🧬',
    status: '⏳'
  },

  // === PAYMENT MODULE (S4) - Stripe integration ===
  {
    id: 's4-email-receipt',
    title: 'S4.1,4.01: Email Receipt',
    smri: SMRI_REGISTRY['email-receipt'],
    module: 'payment',
    url: null,
    icon: '📧',
    status: '✅'
  },

  // === WORKER MODULE (S5) - Backend API ===
  {
    id: 's5-real-snake-completeness',
    title: 'S5.1,2.01: Real Snake Completeness',
    smri: SMRI_REGISTRY['real-snake-completeness'],
    module: 'worker',
    url: null,
    icon: '🔍',
    status: '✅'
  },

  // === COMMON MODULE (S0/S6) - Shared utilities ===
  {
    id: 's0-fluent-customer-journey',
    title: 'S0.1,2,3.09: Fluent Customer Journey',
    smri: 'S0.1,2,3.09',
    module: 'common',
    url: '../../index.html',
    icon: '🗺️',
    status: '✅'
  },

  // === NEW SCENARIOS - Session 2 (2026-01-13) ===
  
  // Enhanced consistency checks
  {
    id: 's0-consistency-validation',
    title: 'S0.0,1,2,6,8.02: Project Consistency Validation',
    smri: 'S0.0,1,2,6,8.02',
    module: 'health',
    description: 'Enhanced .smri checks: file sizes (<500 lines), modularity, best practices',
    url: '../debug/tools/smri-runner.html',
    icon: '🔍',
    status: '⏳'
  },
  
  // TestRenderer component system
  {
    id: 's6-test-renderer',
    title: 'S6.6,8.01: TestRenderer Component Creation',
    smri: 'S6.6,8.01',
    module: 'testing',
    description: 'Modular test render component with Next/Prev navigation',
    url: '../debug/tools/smri-runner.html',
    icon: '🎬',
    status: '⏳'
  },
  {
    id: 's8-conditional-renderer',
    title: 'S8.6,8.01: Conditional TestRenderer in SMRI Runner',
    smri: 'S8.6,8.01',
    module: 'smri',
    description: 'Show TestRenderer only when DOM testing needed',
    url: '../debug/tools/smri-runner.html',
    icon: '🔀',
    status: '⏳'
  },
  {
    id: 's8-demo-collections',
    title: 'S8.1,6,8.02: Demo Scenario Collections',
    smri: 'S8.1,6,8.02',
    module: 'smri',
    description: 'Reuse TestRenderer for demo presentations',
    url: '../debug/releases/demo.html',
    icon: '🎭',
    status: '⏳'
  },
  
  // In-browser shop testing
  {
    id: 's1-shop-frontend-testing',
    title: 'S1.1,6,8.01: In-Browser Shop Frontend Testing',
    smri: 'S1.1,6,8.01',
    module: 'shop',
    description: 'Test user interactions: click product, add to cart, checkout',
    url: '../../catalog.html',
    icon: '🛒',
    status: '⏳'
  }
];

// Filter helpers
export const getScenariosByModule = (moduleName) => 
  SMRI_SCENARIOS.filter(s => s.module === moduleName);

export const getScenariosByStatus = (status) => 
  SMRI_SCENARIOS.filter(s => s.status === status);

export const getAutoRunScenarios = () => 
  SMRI_SCENARIOS.filter(s => s.autoRun === true);

export const getScenarioById = (id) => 
  SMRI_SCENARIOS.find(s => s.id === id);

export const getScenarioBySMRI = (smri) => 
  SMRI_SCENARIOS.find(s => s.smri === smri);

// Statistics
export const getScenarioStats = () => {
  const total = SMRI_SCENARIOS.length;
  const passed = SMRI_SCENARIOS.filter(s => s.status === '✅').length;
  const pending = SMRI_SCENARIOS.filter(s => s.status === '⏳').length;
  const failed = SMRI_SCENARIOS.filter(s => s.status === '❌').length;
  
  return {
    total,
    passed,
    pending,
    failed,
    passRate: total > 0 ? Math.round((passed / total) * 100) : 0
  };
};

// Module Coverage: Check which facade methods are tested
export const getModuleCoverage = () => {
  const MODULE_MAP = {
    'health': 0, 'common': 0,
    'shop': 1,
    'game': 2,
    'auth': 3,
    'payment': 4,
    'worker': 5,
    'testing': 6,
    'breeding': 7,
    'smri': 8,
    'tutorial': 9
  };

  const coverage = {};
  
  // Count scenarios per module
  Object.keys(MODULE_MAP).forEach(mod => {
    const num = MODULE_MAP[mod];
    const scenarios = SMRI_SCENARIOS.filter(s => {
      const smriNum = parseInt(s.smri.match(/^S(\d+)/)?.[1]);
      return smriNum === num || s.module === mod;
    });
    
    coverage[mod] = {
      moduleNum: num,
      scenarios: scenarios.length,
      passed: scenarios.filter(s => s.status === '✅').length,
      pending: scenarios.filter(s => s.status === '⏳').length
    };
  });
  
  return coverage;
};

// Get untested modules
export const getUntestedModules = () => {
  const coverage = getModuleCoverage();
  return Object.entries(coverage)
    .filter(([_, data]) => data.scenarios === 0)
    .map(([mod]) => mod);
};

// Component Coverage: Track which components are used in scenarios
export const getComponentCoverage = () => {
  const ALL_COMPONENTS = [
    'Navigation',
    'SnakeDetailModal',
    'SplitScreenDemo',
    'TestRenderer',
    'BrowserFrame',
    'DebugPanel',
    'PWAInstallButton'
  ];
  
  const usedComponents = new Set();
  
  SMRI_SCENARIOS.forEach(scenario => {
    // Track explicit component usage
    if (scenario.component) {
      usedComponents.add(scenario.component);
    }
    
    // Infer usage from URL patterns
    if (scenario.url?.includes('catalog.html') || scenario.url?.includes('shop')) {
      usedComponents.add('Navigation');
      usedComponents.add('SnakeDetailModal');
    }
    if (scenario.url?.includes('game.html')) {
      usedComponents.add('Navigation');
    }
  });
  
  return {
    total: ALL_COMPONENTS.length,
    used: usedComponents.size,
    usedList: Array.from(usedComponents).sort(),
    unusedList: ALL_COMPONENTS.filter(c => !usedComponents.has(c)),
    coverage: Math.round((usedComponents.size / ALL_COMPONENTS.length) * 100)
  };
};
