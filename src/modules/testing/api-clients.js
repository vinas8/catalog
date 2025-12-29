/**
 * API Clients - Reusable clients for Stripe, KV, and Worker
 * Used by tests and debug hub
 * 
 * @version 0.7.0
 */

const DEFAULT_WORKER_URL = 'https://catalog.navickaszilvinas.workers.dev';

/**
 * Stripe API Client
 */
export class StripeClient {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseUrl = 'https://api.stripe.com/v1';
  }

  async listProducts(limit = 100) {
    const res = await fetch(`${this.baseUrl}/products?limit=${limit}`, {
      headers: { 'Authorization': `Bearer ${this.apiKey}` }
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  }

  async createProduct(data) {
    const body = new URLSearchParams({
      name: data.name,
      description: data.description || ''
    });
    
    const res = await fetch(`${this.baseUrl}/products`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body
    });
    
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  }

  async deleteProduct(productId) {
    const res = await fetch(`${this.baseUrl}/products/${productId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${this.apiKey}` }
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  }

  async createPrice(productId, amount, currency = 'usd') {
    const body = new URLSearchParams({
      product: productId,
      unit_amount: amount.toString(),
      currency
    });
    
    const res = await fetch(`${this.baseUrl}/prices`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body
    });
    
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  }

  async listPrices(limit = 100) {
    const res = await fetch(`${this.baseUrl}/prices?limit=${limit}`, {
      headers: { 'Authorization': `Bearer ${this.apiKey}` }
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  }
}

/**
 * Cloudflare KV Client
 */
export class KVClient {
  constructor(accountId, namespaceId, apiToken) {
    this.accountId = accountId;
    this.namespaceId = namespaceId;
    this.apiToken = apiToken;
    this.baseUrl = `https://api.cloudflare.com/client/v4/accounts/${accountId}/storage/kv/namespaces/${namespaceId}`;
  }

  async listKeys(prefix = '', limit = 1000) {
    const url = prefix 
      ? `${this.baseUrl}/keys?prefix=${prefix}&limit=${limit}`
      : `${this.baseUrl}/keys?limit=${limit}`;
      
    const res = await fetch(url, {
      headers: { 'Authorization': `Bearer ${this.apiToken}` }
    });
    
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return data.result || [];
  }

  async get(key) {
    const res = await fetch(`${this.baseUrl}/values/${key}`, {
      headers: { 'Authorization': `Bearer ${this.apiToken}` }
    });
    
    if (res.status === 404) return null;
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.text();
  }

  async put(key, value) {
    const res = await fetch(`${this.baseUrl}/values/${key}`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${this.apiToken}` },
      body: typeof value === 'string' ? value : JSON.stringify(value)
    });
    
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  }

  async delete(key) {
    const res = await fetch(`${this.baseUrl}/values/${key}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${this.apiToken}` }
    });
    
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  }

  async deleteMany(keys) {
    const results = [];
    for (const key of keys) {
      try {
        await this.delete(key);
        results.push({ key, success: true });
      } catch (error) {
        results.push({ key, success: false, error: error.message });
      }
    }
    return results;
  }
}

/**
 * Worker API Client
 */
export class WorkerClient {
  constructor(baseUrl = DEFAULT_WORKER_URL) {
    this.baseUrl = baseUrl;
  }

  async callEndpoint(path, options = {}) {
    const url = `${this.baseUrl}${path}`;
    const res = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    });
    
    const data = await res.json().catch(() => null);
    
    return {
      status: res.status,
      ok: res.ok,
      data,
      headers: Object.fromEntries(res.headers.entries())
    };
  }

  async health() {
    return this.callEndpoint('/health');
  }

  async version() {
    return this.callEndpoint('/version');
  }

  async products() {
    return this.callEndpoint('/products');
  }

  async userProducts(userHash) {
    return this.callEndpoint(`/user-products?user=${userHash}`);
  }

  async productStatus(productId) {
    return this.callEndpoint(`/product-status?id=${productId}`);
  }

  async listKVProducts() {
    return this.callEndpoint('/kv/list-products');
  }

  async getKVProduct(productId) {
    return this.callEndpoint(`/kv/get-product?id=${productId}`);
  }

  async debug(scenario) {
    return this.callEndpoint(`/debug?scenario=${scenario}`);
  }
}

/**
 * Helper: Create clients from environment
 */
export function createClients(env = {}) {
  return {
    stripe: env.STRIPE_SECRET_KEY 
      ? new StripeClient(env.STRIPE_SECRET_KEY) 
      : null,
    kv: env.CLOUDFLARE_ACCOUNT_ID && env.KV_NAMESPACE_ID && env.CLOUDFLARE_API_TOKEN
      ? new KVClient(env.CLOUDFLARE_ACCOUNT_ID, env.KV_NAMESPACE_ID, env.CLOUDFLARE_API_TOKEN)
      : null,
    worker: new WorkerClient(env.WORKER_URL || DEFAULT_WORKER_URL)
  };
}
