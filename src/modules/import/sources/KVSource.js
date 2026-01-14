import { IImportSource } from '../IImportSource.js';

/**
 * KV Import Source
 * Reads snakes from Cloudflare KV storage
 */
export class KVSource extends IImportSource {
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
      const res = await fetch(`${this.workerUrl}/products`);
      if (!res.ok) {
        throw new Error(`Failed to fetch from KV: ${res.statusText}`);
      }

      this.data = await res.json();
      return this.data;
      
    } catch (err) {
      throw new Error(`KV read failed: ${err.message}`);
    }
  }

  getMetadata() {
    return {
      name: 'KV Source',
      type: 'kv',
      description: 'Import from Cloudflare KV'
    };
  }
}
