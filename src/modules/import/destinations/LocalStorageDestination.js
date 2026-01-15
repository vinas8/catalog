import { IImportDestination } from '../IImportDestination.js';

/**
 * LocalStorage Import Destination
 * Writes products to browser localStorage with namespace isolation
 * Perfect for demos and testing without touching real KV/Stripe
 */
export class LocalStorageDestination extends IImportDestination {
  constructor(namespace = 'demo') {
    super();
    this.namespace = namespace;
    this.storageKey = `${namespace}_products`;
  }

  async write(snakes) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(snakes));
      localStorage.setItem(`${this.storageKey}_timestamp`, Date.now().toString());
      
      return {
        success: true,
        written: snakes.length,
        total: snakes.length
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
      Object.keys(localStorage)
        .filter(key => key.startsWith(this.namespace))
        .forEach(key => localStorage.removeItem(key));
      
      return {
        success: true,
        cleared: true
      };
    } catch (err) {
      return {
        success: false,
        error: err.message
      };
    }
  }

  getMetadata() {
    return {
      name: 'LocalStorage Destination',
      type: 'localStorage',
      description: `Export to localStorage (${this.namespace})`
    };
  }
}
