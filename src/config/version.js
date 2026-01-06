/**
 * Version Configuration - Single Source of Truth
 * Version: s0.x.0 (lowercase) | SMRI: S{module}.{relations}.{id} (uppercase)
 */

export const VERSION_CONFIG = {
  CURRENT: 's0.7.7',
  MAJOR: 0,
  MODULE: 7,
  PATCH: 7,
  
  HISTORY: [
    { version: 's0.1.0', date: '2024-01', description: 'MVP - Shop and game' },
    { version: 's0.3.0', date: '2024-06', description: 'SMRI test system' },
    { version: 's0.5.0', date: '2024-12', description: 'Production ready' },
    { version: 's0.7.0', date: '2025-12', description: 'Context separation + KV manager' },
    { version: 's0.7.2', date: '2026-01', description: 'Full KV CRUD + User assignment' },
    { version: 's0.7.7', date: '2026-01-06', description: 'Demo system + Version roadmap' }
  ],
  
  MODULES: {
    shop: 's0.7.7',
    game: 's0.7.7',
    payment: 's0.7.7',
    worker: 's0.7.7',
    auth: 's0.7.7',
    smri: 's0.7.7',
    debug: 's0.7.7'
  },
  
  // SMRI Scenarios: { code, desc, ver, done }
  SMRI_SCENARIOS: [
    // Health Checks (S0.x)
    { code: 'S0.0.01',                    desc: 'Generic debug health check',           ver: 's0.5.0', done: 50  },
    { code: 'S0-1.1.01',                  desc: 'Shop product rendering check',         ver: 's0.5.0', done: 80  },
    { code: 'S0-2.2.01',                  desc: 'Game mechanics health check',          ver: 's0.5.0', done: 0   },
    { code: 'S0-3.3.01',                  desc: 'Auth user validation check',           ver: 's0.5.0', done: 0   },
    { code: 'S0-4.4.01',                  desc: 'Payment Stripe integration check',     ver: 's0.5.0', done: 0   },
    { code: 'S0-5.5,5-1.01',              desc: 'Worker API KV check',                  ver: 's0.5.0', done: 0   },
    { code: 'S0-11.5-1.01',               desc: 'KV storage health check',              ver: 's0.5.0', done: 0   },
    { code: 'S0-12.5-2.01',               desc: 'Stripe webhooks health check',         ver: 's0.5.0', done: 0   },
    { code: 'S0.1,2,3,4,5,5-1,5-2.03',    desc: 'Full system health check',             ver: 's0.5.0', done: 100 },
    
    // Tutorial (S2-7.x) - P0 Critical (6)
    { code: 'S2-7.5,11.1.01',             desc: 'Tutorial: Happy path (daily check-in)',         ver: 's0.6.0', done: 100 },
    { code: 'S2-7.5,11.1.02',             desc: 'Tutorial: Missed care (2-3 days)',              ver: 's0.6.0', done: 100 },
    { code: 'S2-7.1,5,11.1.03',           desc: 'Tutorial: Education-first commerce',            ver: 's0.6.0', done: 100 },
    { code: 'S2-7.1,5,11.1.04',           desc: 'Tutorial: Trust protection (no purchase)',      ver: 's0.6.0', done: 100 },
    { code: 'S2-7.5,11.1.05',             desc: 'Tutorial: Email-driven re-entry',               ver: 's0.6.0', done: 50  },
    { code: 'S2-7.5,11.1.06',             desc: 'Tutorial: Failure case (educational)',          ver: 's0.6.0', done: 100 },
    
    // P0 Critical (13)
    { code: 'S1.1,2,3,4,5.01',            desc: 'Happy path purchase flow',             ver: 's0.6.0', done: 0   },
    { code: 'S1.1,2,3,4.01',              desc: 'Returning user purchase flow',         ver: 's0.6.0', done: 0   },
    { code: 'S1.1.01',                    desc: 'Product availability status check',    ver: 's0.5.0', done: 0   },
    { code: 'S1-2.1,11.1',                desc: 'Real snake detail completeness',       ver: 's0.7.1', done: 100 },
    { code: 'S5.5,5-1,5-2.01',            desc: 'Webhook signature security verify',    ver: 's0.6.0', done: 0   },
    { code: 'S3.3,5.01',                  desc: 'User hash validation check',           ver: 's0.5.0', done: 0   },
    { code: 'S4.4,5.01',                  desc: 'Product schema validation check',      ver: 's0.5.0', done: 0   },
    { code: 'S5.2,5,5-1.01',              desc: 'Game cold start KV',                   ver: 's0.6.0', done: 0   },
    { code: 'S4.4,5,5-2.02',              desc: 'Webhook timeout delay handling',       ver: 's0.7.0', done: 0   },
    { code: 'S4.4,5,5-2.03',              desc: 'Webhook duplicate idempotency check',  ver: 's0.7.0', done: 0   },
    { code: 'S4.1,4,5.04',                desc: 'Product race condition sold',          ver: 's0.7.0', done: 0   },
    { code: 'S3.3,5.02',                  desc: 'Invalid hash rejection security',      ver: 's0.6.0', done: 0   },
    { code: 'S5.5,5-1.01',                desc: 'Corrupted KV data integrity',          ver: 's0.7.0', done: 0   },
    
    // P1 Gameplay (9)
    { code: 'S2.2.01',                    desc: 'View snake stats display',             ver: 's0.5.0', done: 90  },
    { code: 'S2.2.02',                    desc: 'Stats hunger thirst decay',            ver: 's0.5.0', done: 90  },
    { code: 'S2.2.03',                    desc: 'Feed action snake mechanic',           ver: 's0.5.0', done: 90  },
    { code: 'S2.2.04',                    desc: 'Water action snake mechanic',          ver: 's0.5.0', done: 90  },
    { code: 'S2.2.05',                    desc: 'Clean enclosure habitat action',       ver: 's0.5.0', done: 90  },
    { code: 'S2.2.06',                    desc: 'Health degradation decrease mechanic', ver: 's0.5.0', done: 80  },
    { code: 'S2.5,5-1.01',                desc: 'Auto-save game state KV',              ver: 's0.6.0', done: 0   },
    { code: 'S2.4.01',                    desc: 'Buy equipment with gold',              ver: 's0.5.0', done: 70  },
    { code: 'S2.4.02',                    desc: 'Cannot buy insufficient gold',         ver: 's0.5.0', done: 70  },
    
    // P2 Identity (5)
    { code: 'S3.3,4.01',                  desc: 'Register username after purchase',     ver: 's0.6.0', done: 0   },
    { code: 'S3.3.01',                    desc: 'Skip registration anonymous play',     ver: 's0.5.0', done: 50  },
    { code: 'S3.3,4.02',                  desc: 'Loyalty points earning system',        ver: 's0.8.0', done: 0   },
    { code: 'S3.3.02',                    desc: 'Loyalty tier progression upgrade',     ver: 's0.8.0', done: 0   },
    { code: 'S2.2,3.01',                  desc: 'Loyalty tier equipment locked',        ver: 's0.8.0', done: 0   },
    
    // P3+ Features (15)
    { code: 'S0.0.02',                    desc: 'Virtual snakes demo mode',             ver: 's0.9.0', done: 0   },
    { code: 'S0.0.03',                    desc: 'Storage data cleanup utility',         ver: 's0.9.0', done: 0   },
    { code: 'S5.2,5-1.02',                desc: 'Network failure offline handling',     ver: 's0.7.0', done: 0   },
    { code: 'S5.2.03',                    desc: 'LocalStorage deleted state recovery',  ver: 's0.7.0', done: 0   },
    { code: 'S3.3,5.03',                  desc: 'XSS attack username prevention',       ver: 's0.7.0', done: 0   },
    { code: 'S4.4,5,5-2.05',              desc: 'CSRF webhook attack protection',       ver: 's0.7.0', done: 0   },
    { code: 'S5.1,4,5-3.01',              desc: 'Product sync CRUD Stripe',             ver: 's0.8.0', done: 0   },
    { code: 'S5.5,5-1.02',                desc: 'KV data consistency check',            ver: 's0.8.0', done: 0   },
    { code: 'S5.5.04',                    desc: 'Clear Stripe products test',           ver: 's0.7.0', done: 100 },
    { code: 'S5.5.05',                    desc: 'Clear KV storage test',                ver: 's0.7.0', done: 100 },
    { code: 'S5.5.06',                    desc: 'Clear all test data (Stripe+KV)',      ver: 's0.7.0', done: 100 },
    { code: 'S5.1,5-1.01',                desc: 'Load hundred products test',           ver: 's0.8.0', done: 0   },
    { code: 'S5.2,5-1.04',                desc: 'Game twenty snakes multi',             ver: 's0.9.0', done: 0   },
    { code: 'S5.4,5,5-2.02',              desc: 'Concurrent webhooks processing race',  ver: 's0.8.0', done: 0   },
    { code: 'S1.1,2.02',                  desc: 'Buy five different snakes',            ver: 's0.9.0', done: 0   },
    { code: 'S1.1,2.03',                  desc: 'Buy same morph twice',                 ver: 's0.9.0', done: 0   },
    { code: 'S1.1,4.01',                  desc: 'Payment confirmation email receipt',   ver: 's0.8.0', done: 0   },
    { code: 'S4.4,5.02',                  desc: 'SQL injection attack block',           ver: 's0.7.0', done: 0   }
  ],
  
  API: {
    worker: 's0.5.0',
    stripe: '2024-12-18',
    cloudflare: 'v4'
  },
  
  DOCS: {
    main: 'docs/s0.5.0.md',
    release: 'docs/RELEASE-s0.5.0.md',
    index: 'docs/INDEX.md',
    smri: '.smri'
  },
  
  BUILD: {
    name: 'Snake Muffin',
    codename: 'Special One',
    status: 'development',
    target: 'production'
  }
};

// Exports
export const VERSION = VERSION_CONFIG.CURRENT;
export const MODULE_VERSION = `s0.${VERSION_CONFIG.MODULE}.0`;
export const SMRI_TOTAL_SCENARIOS = VERSION_CONFIG.SMRI_SCENARIOS.length;

// Version Functions
export function getVersion() { 
  return VERSION_CONFIG.CURRENT; 
}

export function getFullVersion() { 
  return `${VERSION_CONFIG.BUILD.name} ${VERSION_CONFIG.CURRENT} (${VERSION_CONFIG.BUILD.codename})`; 
}

export function getModuleVersion(moduleName) { 
  return VERSION_CONFIG.MODULES[moduleName] || VERSION_CONFIG.CURRENT; 
}

// SMRI Functions
export function getSMRIScenario(code) {
  return VERSION_CONFIG.SMRI_SCENARIOS.find(s => s.code === code) || null;
}

export function getSMRICode(description) {
  return VERSION_CONFIG.SMRI_SCENARIOS.find(s => 
    s.desc.toLowerCase().includes(description.toLowerCase())
  )?.code || null;
}

export function getSMRIByVersion(version) {
  return VERSION_CONFIG.SMRI_SCENARIOS.filter(s => s.ver === version);
}

export function getSMRICompleted() {
  return VERSION_CONFIG.SMRI_SCENARIOS.filter(s => s.done === 100);
}

export function getSMRIInProgress() {
  return VERSION_CONFIG.SMRI_SCENARIOS.filter(s => s.done > 0 && s.done < 100);
}

export function getSMRINotStarted() {
  return VERSION_CONFIG.SMRI_SCENARIOS.filter(s => s.done === 0);
}

export function getSMRIStats() {
  const total = VERSION_CONFIG.SMRI_SCENARIOS.length;
  const completed = VERSION_CONFIG.SMRI_SCENARIOS.filter(s => s.done === 100).length;
  const inProgress = VERSION_CONFIG.SMRI_SCENARIOS.filter(s => s.done > 0 && s.done < 100).length;
  const notStarted = VERSION_CONFIG.SMRI_SCENARIOS.filter(s => s.done === 0).length;
  const avgProgress = Math.round(VERSION_CONFIG.SMRI_SCENARIOS.reduce((sum, s) => sum + s.done, 0) / total);
  
  return {
    total,
    completed,
    inProgress,
    notStarted,
    avgProgress,
    completionRate: Math.round((completed / total) * 100)
  };
}

export default VERSION_CONFIG;
