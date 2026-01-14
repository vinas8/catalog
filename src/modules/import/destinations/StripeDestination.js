import { IImportDestination } from '../IImportDestination.js';

/**
 * Stripe Import Destination
 * Writes products to Stripe API
 */
export class StripeDestination extends IImportDestination {
  constructor(workerUrl = 'https://catalog.navickaszilvinas.workers.dev') {
    super();
    this.workerUrl = workerUrl;
  }

  async write(snakes) {
    try {
      const products = snakes.map(snake => ({
        name: snake.name,
        morph: snake.morph,
        gender: snake.gender,
        yob: snake.yob,
        weight: snake.weight || 'TBD',
        species: snake.species,
        price: snake.price || 150.00
      }));

      const res = await fetch(`${this.workerUrl}/upload-products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ products })
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || 'Upload failed');
      }

      return {
        success: true,
        written: result.uploaded,
        total: result.total,
        results: result.results
      };

    } catch (err) {
      return {
        success: false,
        written: 0,
        errors: [err.message]
      };
    }
  }

  async clear() {
    try {
      const res = await fetch(`${this.workerUrl}/clear-stripe-products`, {
        method: 'POST'
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || 'Clear failed');
      }

      return {
        success: true,
        deleted: result.deleted
      };

    } catch (err) {
      return {
        success: false,
        deleted: 0,
        error: err.message
      };
    }
  }

  getMetadata() {
    return {
      name: 'Stripe Destination',
      type: 'stripe',
      description: 'Export to Stripe products'
    };
  }
}
