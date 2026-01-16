/**
 * Cart Module - Shopping Cart Logic
 * @module modules/cart
 * @version 0.7.7
 * SMRI: S1.3,4.01
 */

export class Cart {
  constructor(options = {}) {
    this.storageKey = options.storageKey || 'serpent_cart';
    this.items = [];
    this.load();
  }

  /**
   * Add product to cart
   * @param {Object} product - Product object with id, name, price
   * @returns {boolean} Success status
   */
  add(product) {
    if (!product || !product.id) {
      console.error('Cart.add(): Invalid product');
      return false;
    }

    // Check if already in cart
    const existing = this.items.find(item => item.id === product.id);
    
    if (existing) {
      console.warn(`Product ${product.name} already in cart`);
      return false;
    }

    this.items.push({
      id: product.id,
      name: product.name,
      price: product.price || 0,
      morph: product.morph,
      species: product.species,
      image: product.image,
      addedAt: Date.now()
    });

    this.save();
    console.log(`✅ Added to cart: ${product.name}`);
    return true;
  }

  /**
   * Remove product from cart
   * @param {string} productId - Product ID to remove
   * @returns {boolean} Success status
   */
  remove(productId) {
    const initialLength = this.items.length;
    this.items = this.items.filter(item => item.id !== productId);
    
    if (this.items.length < initialLength) {
      this.save();
      console.log(`✅ Removed from cart: ${productId}`);
      return true;
    }
    
    return false;
  }

  /**
   * Clear all items from cart
   */
  clear() {
    this.items = [];
    this.save();
    console.log('✅ Cart cleared');
  }

  /**
   * Get all cart items
   * @returns {Array} Cart items
   */
  getItems() {
    return [...this.items];
  }

  /**
   * Get cart total price
   * @returns {number} Total price
   */
  getTotal() {
    return this.items.reduce((sum, item) => sum + (item.price || 0), 0);
  }

  /**
   * Get item count
   * @returns {number} Number of items
   */
  getCount() {
    return this.items.length;
  }

  /**
   * Check if product is in cart
   * @param {string} productId - Product ID
   * @returns {boolean}
   */
  has(productId) {
    return this.items.some(item => item.id === productId);
  }

  /**
   * Load cart from localStorage
   */
  load() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        this.items = JSON.parse(stored);
        console.log(`📦 Cart loaded: ${this.items.length} items`);
      }
    } catch (err) {
      console.error('Cart.load() error:', err);
      this.items = [];
    }
  }

  /**
   * Save cart to localStorage
   */
  save() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.items));
    } catch (err) {
      console.error('Cart.save() error:', err);
    }
  }

  /**
   * Create Stripe checkout session for cart items
   * @param {string} userHash - User identifier
   * @returns {Promise<string>} Stripe checkout URL
   */
  async checkout(userHash) {
    if (this.items.length === 0) {
      throw new Error('Cart is empty');
    }

    console.log('🛒 Creating checkout session for cart...');
    
    // Import worker config
    const { WORKER_CONFIG } = await import('../../config/worker-config.js');
    
    // Create checkout with cart items
    const response = await fetch(`${WORKER_CONFIG.WORKER_URL}/create-checkout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: this.items.map(item => ({
          product_id: item.id,
          name: item.name,
          price: item.price
        })),
        user_hash: userHash
      })
    });

    if (!response.ok) {
      throw new Error(`Checkout failed: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('✅ Checkout URL created:', data.url);
    
    // Save user hash for success page
    localStorage.setItem('serpent_pending_purchase_hash', userHash);
    localStorage.setItem('serpent_user_hash', userHash);
    
    return data.url;
  }

  /**
   * Get cart metadata
   * @returns {Object}
   */
  getMetadata() {
    return {
      count: this.getCount(),
      total: this.getTotal(),
      items: this.items.map(i => ({
        id: i.id,
        name: i.name,
        price: i.price
      }))
    };
  }
}
