/**
 * URL Configuration - Single source of truth for all system URLs
 * Version: 0.7.94
 * 
 * USAGE:
 * import { URLS } from './config/urls.js';
 * const apiUrl = URLS.API.PRODUCTS;
 */

// Environment detection
const isLocalhost = typeof window !== 'undefined' && 
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

const isGitHubPages = typeof window !== 'undefined' && 
  window.location.hostname.includes('github.io');

// Get dynamic port for localhost
const getPort = () => {
  if (typeof window === 'undefined') return 8000;
  return window.location.port || 8000;
};

/**
 * Main URL Configuration Object
 */
export const URLS = {
  // ========================================
  // FRONTEND URLs
  // ========================================
  FRONTEND: {
    // Base URLs
    BASE: isLocalhost 
      ? `http://localhost:${getPort()}`
      : 'https://vinas8.github.io/catalog',
    
    GITHUB_PAGES: 'https://vinas8.github.io/catalog',
    GITHUB_REPO: 'https://github.com/vinas8/catalog',
    
    // Page Routes
    PAGES: {
      HOME: '/index.html',
      SHOP: '/shop/',
      CATALOG: '/catalog.html',
      GAME: '/game.html',
      COLLECTION: '/collection.html',
      ACCOUNT: '/admin/account.html',
      SUCCESS: '/success.html',
      
      // Learn section
      LEARN: '/tutorial/',
      LEARN_STATIC: '/tutorial/static.html',
      DEX: '/dex/',
      
      // Calculator
      CALC: '/calc/',
      CALC_DEMO: '/calc/calculator.html',
      
      // Demo
      DEMO: '/demo/',
      DEMO_PURCHASE: '/demo/demo-purchase-flow.html',
      DEMO_SNAKE_GAME: '/demo/snake-game.html',
      DEMO_SNAKE_RANCH: '/demo/snake-ranch.html',
      
      // Debug
      DEBUG: '/debug/',
      DEBUG_HUB: '/debug/index.html',
      DEBUG_SMRI_RUNNER: '/debug/smri-runner.html',
      DEBUG_KV_MANAGER: '/admin-kv.html',
      
      // Admin
      ADMIN_IMPORT: '/admin/import.html',
      ADMIN_IMPORT_MODULAR: '/admin/import-modular.html'
    },
    
    // Helper functions
    getPageUrl(page) {
      const base = isLocalhost ? `http://localhost:${getPort()}` : 'https://vinas8.github.io/catalog';
      return `${base}${page}`;
    },
    
    getGameUrl(userHash) {
      return `${this.getPageUrl('/game.html')}?user=${userHash}`;
    }
  },

  // ========================================
  // API / BACKEND URLs (Cloudflare Worker)
  // ========================================
  API: {
    // Base URL
    BASE: 'https://catalog.navickaszilvinas.workers.dev',
    WORKER_URL: 'https://catalog.navickaszilvinas.workers.dev',
    
    // Endpoints
    REGISTER_USER: '/register-user',
    USER_DATA: '/user-data',
    USER_PRODUCTS: '/user-products',
    ASSIGN_PRODUCT: '/assign-product',
    
    // Products
    PRODUCTS: '/products',
    PRODUCT_STATUS: '/product-status',
    
    // Webhooks
    STRIPE_WEBHOOK: '/stripe-webhook',
    
    // KV Management
    CLEAR_KV_ALL: '/clear-kv-all',
    
    // Debug
    DEBUG_ENDPOINT: '/api/debug',
    
    // Helper functions
    getEndpoint(path) {
      return `${this.BASE}${path}`;
    },
    
    getUserEndpoint(path, userId) {
      return `${this.getEndpoint(path)}?user=${userId}`;
    },
    
    getProductStatus(productId) {
      return `${this.BASE}/product-status?id=${productId}`;
    }
  },

  // ========================================
  // EXTERNAL SERVICES
  // ========================================
  EXTERNAL: {
    // Stripe
    STRIPE: {
      API_BASE: 'https://api.stripe.com/v1',
      DASHBOARD: 'https://dashboard.stripe.com',
      WEBHOOKS: 'https://dashboard.stripe.com/webhooks',
      
      // API Endpoints
      CHECKOUT_SESSIONS: 'https://api.stripe.com/v1/checkout/sessions',
      PRODUCTS: 'https://api.stripe.com/v1/products',
      
      // Payment Links (Test Mode)
      // Note: These are test mode links - replace with live in production
      getPaymentLink(productId) {
        return `https://buy.stripe.com/test_${productId}`;
      }
    },
    
    // MorphMarket (Future integration)
    MORPHMARKET: {
      BASE: 'https://www.morphmarket.com',
      API: 'https://api.morphmarket.com',
      // Add specific endpoints when integrated
    },
    
    // World of Ball Pythons (Data source reference)
    WOBP: {
      BASE: 'https://www.worldofballpythons.com',
      TRAITS: 'https://www.worldofballpythons.com/morphs'
    },
    
    // GitHub (For issues, releases, etc.)
    GITHUB: {
      REPO: 'https://github.com/vinas8/catalog',
      ISSUES: 'https://github.com/vinas8/catalog/issues',
      ACTIONS: 'https://github.com/vinas8/catalog/actions'
    }
  },

  // ========================================
  // LOCAL DEVELOPMENT
  // ========================================
  LOCAL: {
    BASE: 'http://localhost:8000',
    
    getUrl(port = 8000) {
      return `http://localhost:${port}`;
    },
    
    getPageUrl(page, port = 8000) {
      return `http://localhost:${port}${page}`;
    }
  },

  // ========================================
  // ENVIRONMENT HELPERS
  // ========================================
  ENV: {
    isLocalhost,
    isGitHubPages,
    isProduction: !isLocalhost,
    
    getCurrentBase() {
      return isLocalhost ? `http://localhost:${getPort()}` : 'https://vinas8.github.io/catalog';
    },
    
    getCurrentOrigin() {
      return typeof window !== 'undefined' ? window.location.origin : '';
    }
  }
};

// ========================================
// LEGACY EXPORTS (for backward compatibility)
// ========================================
export const WORKER_URL = URLS.API.BASE;
export const WORKER_CONFIG = {
  WORKER_URL: URLS.API.WORKER_URL,
  BASE_URL: URLS.API.BASE,
  ENDPOINTS: {
    REGISTER_USER: URLS.API.REGISTER_USER,
    USER_DATA: URLS.API.USER_DATA,
    USER_PRODUCTS: URLS.API.USER_PRODUCTS,
    STRIPE_WEBHOOK: URLS.API.STRIPE_WEBHOOK,
    ASSIGN_PRODUCT: URLS.API.ASSIGN_PRODUCT,
    PRODUCTS: URLS.API.PRODUCTS
  },
  getEndpoint(endpoint) {
    return URLS.API.getEndpoint(this.ENDPOINTS[endpoint]);
  }
};

export const PAGE_URLS = {
  CATALOG: URLS.FRONTEND.PAGES.CATALOG,
  GAME: URLS.FRONTEND.PAGES.GAME,
  SUCCESS: URLS.FRONTEND.PAGES.SUCCESS,
  INDEX: URLS.FRONTEND.PAGES.HOME,
  getGameUrl: URLS.FRONTEND.getGameUrl.bind(URLS.FRONTEND)
};

// ========================================
// DEFAULT EXPORT
// ========================================
export default URLS;
