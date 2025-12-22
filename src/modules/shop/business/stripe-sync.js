// Stripe Integration Module
// Handles syncing products between Stripe API and local JSON catalog

import { STRIPE_PRODUCTS } from '../data/catalog.js';

export class StripeSync {
  
  /**
   * Sync products with Stripe API
   * - Fetch products from Stripe
   * - Merge with local JSON
   * - Update existing, add new, preserve local-only products
   */
  static async syncProducts(stripeApiKey) {
    try {
      // Fetch products from Stripe
      const stripeProducts = await this.fetchStripeProducts(stripeApiKey);
      
      // Merge with local catalog
      const merged = this.mergeProducts(stripeProducts, STRIPE_PRODUCTS);
      
      return {
        success: true,
        products: merged,
        stats: {
          total: merged.length,
          from_stripe: stripeProducts.length,
          local_only: merged.length - stripeProducts.length
        }
      };
    } catch (error) {
      console.error('Stripe sync error:', error);
      return {
        success: false,
        error: error.message,
        products: STRIPE_PRODUCTS // Return local catalog on error
      };
    }
  }
  
  /**
   * Fetch products from Stripe API
   */
  static async fetchStripeProducts(apiKey) {
    const response = await fetch('https://api.stripe.com/v1/products?active=true&expand[]=data.default_price', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Stripe API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Transform Stripe products to our format
    return data.data.map(product => this.transformStripeProduct(product));
  }
  
  /**
   * Transform Stripe product to our catalog format
   */
  static transformStripeProduct(stripeProduct) {
    const price = stripeProduct.default_price;
    
    return {
      product_id: stripeProduct.metadata?.product_id || stripeProduct.id,
      stripe_product_id: stripeProduct.id,
      stripe_price_id: price?.id || null,
      species: stripeProduct.metadata?.species || 'ball_python',
      morph: stripeProduct.metadata?.morph || 'normal',
      name: stripeProduct.name,
      description: stripeProduct.description || '',
      info: stripeProduct.metadata?.info || '',
      price: price ? (price.unit_amount / 100) : 0,
      currency: price?.currency || 'usd',
      image: stripeProduct.images?.[0] || '🐍',
      stripe_link: this.buildPaymentLink(stripeProduct.id, price?.id),
      in_stock: stripeProduct.active,
      metadata: {
        sex: stripeProduct.metadata?.sex || 'unknown',
        weight_grams: parseInt(stripeProduct.metadata?.weight_grams) || 0,
        birth_date: stripeProduct.metadata?.birth_date || null,
        breeder: stripeProduct.metadata?.breeder || null
      }
    };
  }
  
  /**
   * Merge Stripe products with local catalog
   * Logic:
   * - If product_id exists in local → UPDATE with Stripe data
   * - If product_id new from Stripe → ADD to catalog
   * - If product_id only in local → KEEP (multi-tenant)
   */
  static mergeProducts(stripeProducts, localProducts) {
    const merged = [...localProducts]; // Start with local products
    const localIds = new Set(localProducts.map(p => p.product_id));
    
    for (const stripeProduct of stripeProducts) {
      const productId = stripeProduct.product_id;
      const existingIndex = merged.findIndex(p => p.product_id === productId);
      
      if (existingIndex >= 0) {
        // UPDATE: Product exists in local catalog
        console.log(`Updating product: ${productId}`);
        merged[existingIndex] = {
          ...merged[existingIndex], // Keep local fields
          ...stripeProduct,          // Override with Stripe data
          updated_from_stripe: new Date().toISOString()
        };
      } else {
        // ADD: New product from Stripe
        console.log(`Adding new product from Stripe: ${productId}`);
        merged.push({
          ...stripeProduct,
          added_from_stripe: new Date().toISOString()
        });
      }
    }
    
    // Local-only products are preserved (not in Stripe)
    const localOnlyCount = merged.filter(p => !p.stripe_product_id).length;
    console.log(`Preserved ${localOnlyCount} local-only products`);
    
    return merged;
  }
  
  /**
   * Build Stripe Payment Link URL
   */
  static buildPaymentLink(productId, priceId) {
    if (!priceId) return '#';
    // This would be replaced with actual payment link from Stripe
    return `https://buy.stripe.com/test_${productId}`;
  }
  
  /**
   * Sync with local cache
   * Save merged products to localStorage or file
   */
  static saveToCatalog(products) {
    try {
      localStorage.setItem('catalog_cache', JSON.stringify({
        products: products,
        last_sync: new Date().toISOString()
      }));
      return true;
    } catch (error) {
      console.error('Failed to save catalog:', error);
      return false;
    }
  }
  
  /**
   * Load from local cache
   */
  static loadFromCache() {
    try {
      const cached = localStorage.getItem('catalog_cache');
      if (!cached) return null;
      
      const data = JSON.parse(cached);
      const lastSync = new Date(data.last_sync);
      const hoursSinceSync = (Date.now() - lastSync) / (1000 * 60 * 60);
      
      // Cache valid for 24 hours
      if (hoursSinceSync < 24) {
        return data.products;
      }
      return null;
    } catch (error) {
      console.error('Failed to load cache:', error);
      return null;
    }
  }
}

/**
 * Initialize catalog - load from cache or sync with Stripe
 */
export async function initializeCatalog(stripeApiKey = null) {
  // Try loading from cache first
  const cached = StripeSync.loadFromCache();
  if (cached) {
    console.log('Using cached catalog');
    return cached;
  }
  
  // If Stripe API key provided, sync
  if (stripeApiKey) {
    console.log('Syncing with Stripe...');
    const result = await StripeSync.syncProducts(stripeApiKey);
    
    if (result.success) {
      StripeSync.saveToCatalog(result.products);
      return result.products;
    }
  }
  
  // Fallback to local catalog
  console.log('Using local catalog');
  return STRIPE_PRODUCTS;
}
