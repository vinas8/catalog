/**
 * SMRI Test Scenarios
 * @version 0.7.7
 */

export const scenarios = [
  {
    id: 'purchase-flow',
    title: 'Purchase Flow',
    smri: 'S1.1,2,3,4,5.01',
    url: '../catalog.html',
    icon: '🛒',
    description: 'Complete purchase flow from catalog to game'
  },
  {
    id: 'healthcheck',
    title: 'Healthcheck Page',
    smri: 'S0.0,1,2,3,4,5.01',
    url: 'healthcheck.html',
    icon: '🏥',
    description: 'System health check across all modules'
  },
  {
    id: 'worker-api',
    title: 'Worker API',
    smri: 'S5.1,2.01',
    url: null,
    icon: '🔌',
    description: 'Test Cloudflare Worker API endpoints'
  },
  {
    id: 'tutorial-flow',
    title: 'Tutorial Happy Path',
    smri: 'S2.7,5,5-1.01',
    url: '../game.html',
    icon: '📚',
    description: 'Complete tutorial flow with care actions'
  },
  {
    id: 'collection-view',
    title: 'Collection View',
    smri: 'S2.8,1,5.01',
    url: '../collection.html',
    icon: '📦',
    description: 'View and manage snake collection'
  }
];
