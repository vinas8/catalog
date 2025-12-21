// Stripe Configuration
// IMPORTANT: Never commit real secret keys to GitHub!
// For production, use environment variables

export const STRIPE_CONFIG = {
  // Test mode keys (for development only)
  // In production, load from environment variables
  publishableKey: 'pk_test_YOUR_PUBLISHABLE_KEY', // Replace with your key
  secretKey: null, // Never store in code! Use environment variable
  
  // API settings
  apiVersion: '2023-10-16',
  
  // Feature flags
  enableSync: false,  // Set to true when you have API key configured
  syncInterval: 24 * 60 * 60 * 1000, // 24 hours in ms
  
  // Currency
  defaultCurrency: 'usd',
  
  // Product metadata requirements
  requiredMetadata: [
    'species',
    'morph',
    'product_id'
  ]
};

// Helper to get config
export function getStripeKey() {
  // In production: return process.env.STRIPE_SECRET_KEY
  // For development: Set your key here temporarily (never commit!)
  return STRIPE_CONFIG.enableSync ? STRIPE_CONFIG.secretKey : null;
}

export function getPublishableKey() {
  return STRIPE_CONFIG.publishableKey;
}
