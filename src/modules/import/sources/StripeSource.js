import { IImportSource } from '../IImportSource.js';

/**
 * Stripe Import Source
 * Reads products from Stripe API
 */
export class StripeSource extends IImportSource {
  constructor(workerUrl = 'https://catalog.navickaszilvinas.workers.dev') {
    super();
    this.workerUrl = workerUrl;
    this.data = null;
  }

  async validate(rawData) {
    return { valid: true };
  }

  async read() {
    try {
      const res = await fetch(`${this.workerUrl}/stripe-products`);
      if (!res.ok) {
        throw new Error(`Failed to fetch from Stripe: ${res.statusText}`);
      }

      const products = await res.json();
      this.data = products.map(p => this._normalizeFromStripe(p));
      return this.data;
      
    } catch (err) {
      throw new Error(`Stripe read failed: ${err.message}`);
    }
  }

  getMetadata() {
    return {
      name: 'Stripe Source',
      type: 'stripe',
      description: 'Import from Stripe products'
    };
  }

  _normalizeFromStripe(product) {
    return {
      name: product.name,
      morph: product.metadata?.morph || 'Unknown',
      gender: product.metadata?.gender || 'Unknown',
      yob: parseInt(product.metadata?.yob) || new Date().getFullYear(),
      weight: product.metadata?.weight ? parseFloat(product.metadata.weight) : null,
      species: product.metadata?.species || 'ball_python',
      stripeProductId: product.id,
      stripePriceId: product.default_price,
      price: product.default_price_data?.unit_amount / 100 || 0,
      owner: null,
      status: 'available'
    };
  }
}
