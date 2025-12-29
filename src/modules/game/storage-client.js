/**
 * LocalStorage Client - Universal adapter for game state persistence
 * Supports multiple storage backends: localStorage, KV, IndexedDB
 * 
 * Architecture:
 * - LocalStorageClient (base) - CRUD operations
 * - GameStorageClient (extends) - Game-specific operations
 * - Adapters: LocalStorageAdapter, KVAdapter, IndexedDBAdapter
 */

/**
 * Storage Adapter Interface
 */
class StorageAdapter {
  async get(key) { throw new Error('Not implemented'); }
  async set(key, value) { throw new Error('Not implemented'); }
  async delete(key) { throw new Error('Not implemented'); }
  async list(prefix) { throw new Error('Not implemented'); }
  async clear() { throw new Error('Not implemented'); }
}

/**
 * LocalStorage Adapter (browser localStorage)
 */
export class LocalStorageAdapter extends StorageAdapter {
  constructor(namespace = 'serpent_town') {
    super();
    this.namespace = namespace;
  }

  _getKey(key) {
    return `${this.namespace}:${key}`;
  }

  async get(key) {
    const data = localStorage.getItem(this._getKey(key));
    return data ? JSON.parse(data) : null;
  }

  async set(key, value) {
    localStorage.setItem(this._getKey(key), JSON.stringify(value));
  }

  async delete(key) {
    localStorage.removeItem(this._getKey(key));
  }

  async list(prefix = '') {
    const keys = [];
    const searchKey = this._getKey(prefix);
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith(searchKey)) {
        keys.push(key.replace(`${this.namespace}:`, ''));
      }
    }
    
    return keys;
  }

  async clear() {
    const keys = await this.list('');
    keys.forEach(key => this.delete(key));
  }
}

/**
 * Cloudflare KV Adapter (worker KV storage)
 */
export class KVAdapter extends StorageAdapter {
  constructor(workerUrl, namespace = 'USER_PRODUCTS') {
    super();
    this.workerUrl = workerUrl;
    this.namespace = namespace;
  }

  async get(key) {
    const response = await fetch(`${this.workerUrl}/kv/${this.namespace}/${key}`);
    return response.ok ? await response.json() : null;
  }

  async set(key, value) {
    await fetch(`${this.workerUrl}/kv/${this.namespace}/${key}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(value)
    });
  }

  async delete(key) {
    await fetch(`${this.workerUrl}/kv/${this.namespace}/${key}`, {
      method: 'DELETE'
    });
  }

  async list(prefix = '') {
    const response = await fetch(`${this.workerUrl}/kv/${this.namespace}?prefix=${prefix}`);
    return response.ok ? await response.json() : [];
  }

  async clear() {
    // Not recommended in production - requires confirmation
    throw new Error('KV clear() not implemented for safety');
  }
}

/**
 * Base LocalStorage Client
 * Provides CRUD operations with event hooks
 */
export class LocalStorageClient {
  constructor(adapter, options = {}) {
    this.adapter = adapter;
    this.options = {
      autoSave: true,
      saveInterval: 30000, // 30 seconds
      enableEvents: true,
      ...options
    };
    
    this.eventListeners = {};
    this.saveTimer = null;
    
    if (this.options.autoSave) {
      this.startAutoSave();
    }
  }

  /**
   * CRUD Operations
   */
  async get(key) {
    const value = await this.adapter.get(key);
    this._emit('get', { key, value });
    return value;
  }

  async set(key, value) {
    await this.adapter.set(key, value);
    this._emit('set', { key, value });
    return value;
  }

  async delete(key) {
    await this.adapter.delete(key);
    this._emit('delete', { key });
  }

  async list(prefix = '') {
    const keys = await this.adapter.list(prefix);
    this._emit('list', { prefix, keys });
    return keys;
  }

  async clear() {
    await this.adapter.clear();
    this._emit('clear', {});
  }

  /**
   * Event System
   */
  on(event, callback) {
    if (!this.eventListeners[event]) {
      this.eventListeners[event] = [];
    }
    this.eventListeners[event].push(callback);
  }

  off(event, callback) {
    if (!this.eventListeners[event]) return;
    this.eventListeners[event] = this.eventListeners[event].filter(cb => cb !== callback);
  }

  _emit(event, data) {
    if (!this.options.enableEvents) return;
    if (!this.eventListeners[event]) return;
    
    this.eventListeners[event].forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        console.error(`Event handler error for '${event}':`, error);
      }
    });
  }

  /**
   * Auto-save
   */
  startAutoSave() {
    if (this.saveTimer) return;
    
    this.saveTimer = setInterval(() => {
      this._emit('autosave', { timestamp: Date.now() });
    }, this.options.saveInterval);
  }

  stopAutoSave() {
    if (this.saveTimer) {
      clearInterval(this.saveTimer);
      this.saveTimer = null;
    }
  }

  /**
   * Switch adapter (e.g., localStorage → KV)
   */
  setAdapter(adapter) {
    this.adapter = adapter;
    this._emit('adapter_changed', { adapter: adapter.constructor.name });
  }
}

/**
 * Game-specific Storage Client
 * Extends base client with game state operations
 */
export class GameStorageClient extends LocalStorageClient {
  constructor(adapter, options = {}) {
    super(adapter, options);
    this.gameStateKey = options.gameStateKey || 'game_state';
    this.userKey = options.userKey || 'user';
  }

  /**
   * Game State Operations
   */
  async getGameState() {
    return await this.get(this.gameStateKey);
  }

  async setGameState(state) {
    return await this.set(this.gameStateKey, state);
  }

  async updateGameState(updates) {
    const current = await this.getGameState() || {};
    const updated = { ...current, ...updates };
    return await this.setGameState(updated);
  }

  async deleteGameState() {
    return await this.delete(this.gameStateKey);
  }

  /**
   * User Operations
   */
  async getUser() {
    return await this.get(this.userKey);
  }

  async setUser(user) {
    return await this.set(this.userKey, user);
  }

  /**
   * Snake Operations (game-specific)
   */
  async getSnake(snakeId) {
    return await this.get(`snake:${snakeId}`);
  }

  async setSnake(snakeId, snakeData) {
    return await this.set(`snake:${snakeId}`, snakeData);
  }

  async getAllSnakes() {
    const keys = await this.list('snake:');
    const snakes = await Promise.all(
      keys.map(key => this.get(key))
    );
    return snakes.filter(Boolean);
  }

  async deleteSnake(snakeId) {
    return await this.delete(`snake:${snakeId}`);
  }

  /**
   * Tutorial State Operations
   */
  async getTutorialProgress() {
    return await this.get('tutorial_progress') || {
      completed: [],
      current: null,
      started_at: null
    };
  }

  async setTutorialProgress(progress) {
    return await this.set('tutorial_progress', progress);
  }

  async markTutorialComplete(tutorialId) {
    const progress = await this.getTutorialProgress();
    const completed = progress.completed || [];
    if (!completed.includes(tutorialId)) {
      completed.push(tutorialId);
      progress.completed = completed;
      progress.current = null;
    }
    return await this.setTutorialProgress(progress);
  }

  /**
   * Full export/import (backup/restore)
   */
  async exportAll() {
    const keys = await this.list('');
    const data = {};
    
    for (const key of keys) {
      data[key] = await this.get(key);
    }
    
    return {
      version: '1.0.0',
      exported_at: new Date().toISOString(),
      data
    };
  }

  async importAll(backup) {
    if (!backup.version || !backup.data) {
      throw new Error('Invalid backup format');
    }
    
    // Clear existing data first
    await this.clear();
    
    // Import all data
    for (const [key, value] of Object.entries(backup.data)) {
      await this.set(key, value);
    }
    
    this._emit('import_complete', { itemCount: Object.keys(backup.data).length });
  }
}

/**
 * Factory function for easy initialization
 */
export function createGameStorage(options = {}) {
  const {
    backend = 'localStorage', // 'localStorage' | 'kv' | 'indexedDB'
    namespace = 'serpent_town',
    workerUrl = null,
    ...clientOptions
  } = options;

  let adapter;
  
  switch (backend) {
    case 'localStorage':
      adapter = new LocalStorageAdapter(namespace);
      break;
    case 'kv':
      if (!workerUrl) throw new Error('workerUrl required for KV backend');
      adapter = new KVAdapter(workerUrl, namespace);
      break;
    default:
      throw new Error(`Unknown backend: ${backend}`);
  }

  return new GameStorageClient(adapter, clientOptions);
}

/**
 * Example Usage:
 * 
 * // Create client with localStorage backend
 * const storage = createGameStorage({ backend: 'localStorage' });
 * 
 * // Save game state
 * await storage.setGameState({ snakes: [...], gold: 100 });
 * 
 * // Load game state
 * const state = await storage.getGameState();
 * 
 * // Listen to events
 * storage.on('set', ({ key, value }) => console.log('Saved:', key));
 * storage.on('autosave', () => console.log('Auto-saving...'));
 * 
 * // Switch to KV backend
 * storage.setAdapter(new KVAdapter('https://worker.dev', 'USER_PRODUCTS'));
 * 
 * // Export backup
 * const backup = await storage.exportAll();
 * 
 * // Import backup
 * await storage.importAll(backup);
 */
