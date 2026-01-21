# URL Configuration Guide

**Version:** 0.7.94  
**File:** `src/config/urls.js`  
**Purpose:** Single source of truth for all system URLs

---

## 📋 Quick Reference

### Import URLs
```javascript
// Import the full config
import { URLS } from './config/urls.js';

// Or import specific parts
import { WORKER_URL, PAGE_URLS } from './config/urls.js';
```

### Usage Examples
```javascript
// Frontend URLs
const homePage = URLS.FRONTEND.PAGES.HOME;
const gameUrl = URLS.FRONTEND.getGameUrl(userHash);

// API URLs
const productsUrl = URLS.API.PRODUCTS;
const productStatus = URLS.API.getProductStatus(productId);

// External services
const stripeCheckout = URLS.EXTERNAL.STRIPE.CHECKOUT_SESSIONS;
const githubRepo = URLS.EXTERNAL.GITHUB.REPO;

// Environment detection
if (URLS.ENV.isLocalhost) {
  console.log('Running locally');
}
```

---

## 🏗️ Structure

### 1. FRONTEND URLs (`URLS.FRONTEND`)
All frontend pages and routes:
- `BASE` - Dynamic base URL (localhost or GitHub Pages)
- `GITHUB_PAGES` - Production URL
- `GITHUB_REPO` - Repository URL
- `PAGES` - All page routes
  - Shop, Game, Collection, Account
  - Learn section (tutorials, dex, calc)
  - Demo pages
  - Debug tools
  - Admin pages

**Helper Methods:**
- `getPageUrl(page)` - Build full URL for a page
- `getGameUrl(userHash)` - Build game URL with user hash

### 2. API URLs (`URLS.API`)
Cloudflare Worker backend:
- `BASE` / `WORKER_URL` - API base URL
- All API endpoints:
  - User: `/register-user`, `/user-data`, `/user-products`
  - Products: `/products`, `/product-status`
  - Webhooks: `/stripe-webhook`
  - Admin: `/clear-kv-all`
  - Debug: `/api/debug`

**Helper Methods:**
- `getEndpoint(path)` - Build full endpoint URL
- `getUserEndpoint(path, userId)` - Build user-specific URL
- `getProductStatus(productId)` - Build product status URL

### 3. EXTERNAL URLs (`URLS.EXTERNAL`)
Third-party services:

#### Stripe (`URLS.EXTERNAL.STRIPE`)
- `API_BASE` - Stripe API base
- `DASHBOARD` - Stripe dashboard
- `WEBHOOKS` - Webhook configuration page
- `CHECKOUT_SESSIONS` - Create checkout sessions
- `PRODUCTS` - Manage products
- `getPaymentLink(productId)` - Generate payment link

#### MorphMarket (`URLS.EXTERNAL.MORPHMARKET`)
- `BASE` - MorphMarket homepage
- `API` - API base (future)

#### World of Ball Pythons (`URLS.EXTERNAL.WOBP`)
- `BASE` - WOBP homepage
- `TRAITS` - Morph traits database

#### GitHub (`URLS.EXTERNAL.GITHUB`)
- `REPO` - Repository URL
- `ISSUES` - Issues page
- `ACTIONS` - GitHub Actions

### 4. LOCAL URLs (`URLS.LOCAL`)
Development URLs:
- `BASE` - Default localhost URL
- `getUrl(port)` - Build localhost URL with custom port
- `getPageUrl(page, port)` - Build page URL for localhost

### 5. ENVIRONMENT (`URLS.ENV`)
Environment detection:
- `isLocalhost` - Running on localhost?
- `isGitHubPages` - Running on GitHub Pages?
- `isProduction` - Production environment?
- `getCurrentBase()` - Get current base URL
- `getCurrentOrigin()` - Get current origin

---

## 🔄 Migration Guide

### Replace Hardcoded URLs

**Before:**
```javascript
const workerUrl = 'https://catalog.navickaszilvinas.workers.dev';
const productsUrl = `${workerUrl}/products`;
```

**After:**
```javascript
import { URLS } from './config/urls.js';
const productsUrl = URLS.API.getEndpoint(URLS.API.PRODUCTS);
```

### Common Replacements

| Old Hardcoded URL | New Config Path |
|-------------------|-----------------|
| `'https://catalog.navickaszilvinas.workers.dev'` | `URLS.API.BASE` |
| `'https://vinas8.github.io/catalog'` | `URLS.FRONTEND.BASE` |
| `'https://api.stripe.com/v1'` | `URLS.EXTERNAL.STRIPE.API_BASE` |
| `'https://github.com/vinas8/catalog'` | `URLS.EXTERNAL.GITHUB.REPO` |
| `'http://localhost:8000'` | `URLS.LOCAL.BASE` |

---

## 📝 Adding New URLs

### 1. Determine Category
- Is it a frontend page? → `URLS.FRONTEND.PAGES`
- Is it an API endpoint? → `URLS.API`
- Is it an external service? → `URLS.EXTERNAL`

### 2. Add to Config
```javascript
// In src/config/urls.js
export const URLS = {
  API: {
    // Add new endpoint
    NEW_ENDPOINT: '/new-endpoint',
    
    // Or add helper method
    getNewEndpoint(param) {
      return `${this.BASE}/new-endpoint?param=${param}`;
    }
  }
};
```

### 3. Update Documentation
Add to this file under the appropriate section.

### 4. Test
```javascript
import { URLS } from './config/urls.js';
console.log(URLS.API.NEW_ENDPOINT); // Should work
```

---

## 🚨 Rules

### DO ✅
- Use `URLS` config for ALL URLs
- Add new URLs to config before using them
- Use helper methods for dynamic URLs
- Document new URLs in this guide

### DON'T ❌
- Hardcode URLs in components/modules
- Create duplicate URL constants
- Skip environment detection for base URLs
- Forget to update this documentation

---

## 🧪 Testing

### Test URL Generation
```javascript
import { URLS } from './config/urls.js';

// Test frontend URLs
console.log(URLS.FRONTEND.BASE);
console.log(URLS.FRONTEND.getPageUrl('/demo/'));

// Test API URLs
console.log(URLS.API.getEndpoint(URLS.API.PRODUCTS));
console.log(URLS.API.getUserEndpoint(URLS.API.USER_DATA, 'user123'));

// Test environment
console.log('Localhost?', URLS.ENV.isLocalhost);
console.log('Current base:', URLS.ENV.getCurrentBase());
```

### Test in Browser
```javascript
// Open browser console on any page
import('./src/config/urls.js').then(({ URLS }) => {
  console.table({
    'Frontend Base': URLS.FRONTEND.BASE,
    'API Base': URLS.API.BASE,
    'Is Local': URLS.ENV.isLocalhost,
    'Is Production': URLS.ENV.isProduction
  });
});
```

---

## 📊 URL Inventory

### Frontend Pages (24)
- Home, Shop, Catalog, Game, Collection
- Account, Success, Learn, Dex, Calc
- 4 Demo pages
- 4 Debug tools
- 2 Admin pages

### API Endpoints (10)
- 3 User endpoints
- 3 Product endpoints
- 1 Webhook endpoint
- 1 Admin endpoint
- 2 Debug endpoints

### External Services (4)
- Stripe (payment processing)
- MorphMarket (future integration)
- WOBP (data source)
- GitHub (repository)

**Total URLs: 38+**

---

## 🔗 Related Files

- `src/config/worker-config.js` - Legacy worker config (will be deprecated)
- `src/config/app-config.js` - App configuration
- `src/config/index.js` - Main config barrel export

---

**Last Updated:** 2026-01-21  
**Maintainer:** Development Team
