import { IImportDestination } from '../IImportDestination.js';

/**
 * KV Import Destination
 * Writes products to Cloudflare KV storage
 */
export class KVDestination extends IImportDestination {
  constructor(workerUrl = 'https://catalog.navickaszilvinas.workers.dev') {
    super();
    this.workerUrl = workerUrl;
  }

  async write(snakes) {
    try {
      const res = await fetch(`${this.workerUrl}/sync-stripe-to-kv`, {
        method: 'POST'
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || 'Sync failed');
      }

      return {
        success: true,
        written: result.synced,
        total: result.total
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
    return {
      success: false,
      error: 'Clear not implemented for KV'
    };
  }

  getMetadata() {
    return {
      name: 'KV Destination',
      type: 'kv',
      description: 'Export to Cloudflare KV'
    };
  }
}
