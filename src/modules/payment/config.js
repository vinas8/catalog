/**
 * Payment Provider Configuration
 * 
 * ⚠️ CHANGE THIS ONE LINE TO SWITCH PROVIDERS ⚠️
 */

// Switch between: 'stripe' | 'paypal' | 'square' | 'mock'
export const PAYMENT_PROVIDER = 'stripe';

// Fee configuration (industry standard)
export const FEE_CONFIG = {
  // Platform commission
  platform_percent: 5,        // 5% to Snake Muffin
  
  // Payment processing (provider-dependent)
  stripe: {
    processing_percent: 2.9,  // 2.9%
    processing_fixed: 0.30    // $0.30
  },
  paypal: {
    processing_percent: 2.9,
    processing_fixed: 0.30
  },
  square: {
    processing_percent: 2.6,
    processing_fixed: 0.10
  },
  mock: {
    processing_percent: 3.0,
    processing_fixed: 0.30
  }
};

// Merchant subscription pricing
export const MERCHANT_SUBSCRIPTION = {
  price: 15.00,              // $15/month
  currency: 'usd',
  billing_interval: 'month'
};

// Site URLs (for redirects)
export const SITE_URL = 'https://vinas8.github.io/catalog';
export const WORKER_URL = 'https://serpent-town.your-subdomain.workers.dev';
