// Cloudflare Worker Configuration
// Single source of truth for all worker API URLs

export const WORKER_CONFIG = {
  // Production worker URL
  WORKER_URL: 'https://catalog.navickaszilvinas.workers.dev',
  
  // API Endpoints
  ENDPOINTS: {
    REGISTER_USER: '/register-user',
    USER_DATA: '/user-data',
    USER_PRODUCTS: '/user-products',
    STRIPE_WEBHOOK: '/stripe-webhook',
    ASSIGN_PRODUCT: '/assign-product',
    PRODUCTS: '/products'
  },
  
  // Helper method to build full URL
  getEndpoint(endpoint) {
    return `${this.WORKER_URL}${this.ENDPOINTS[endpoint]}`;
  },
  
  // Helper for user-specific endpoints
  getUserEndpoint(endpoint, userId) {
    return `${this.getEndpoint(endpoint)}?user=${userId}`;
  }
};

// Frontend Page URLs (use relative paths for GitHub Pages compatibility)
export const PAGE_URLS = {
  CATALOG: '/catalog.html',
  GAME: '/game.html',
  SUCCESS: '/success.html',
  REGISTER: '/register.html',
  INDEX: '/index.html',
  
  // Helper to build game URL with user hash
  getGameUrl(userHash, origin = '') {
    return `${origin}${this.GAME}?user=${userHash}`;
  },
  
  // Helper to build registration URL
  getRegisterUrl(sessionId, userHash, email, origin = '') {
    let url = `${origin}${this.REGISTER}?session_id=${sessionId || 'none'}`;
    url += `&user_hash=${userHash}`;
    if (email) {
      url += `&email=${encodeURIComponent(email)}`;
    }
    return url;
  }
};

// Export individual URLs for convenience
export const WORKER_URL = WORKER_CONFIG.WORKER_URL;
export const API_ENDPOINTS = WORKER_CONFIG.ENDPOINTS;
