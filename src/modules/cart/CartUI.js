/**
 * Cart UI Component
 * @module modules/cart/CartUI
 * @version 0.7.7
 * SMRI: S1.3,4.01
 */

import { Cart } from './Cart.js';

export class CartUI {
  constructor(options = {}) {
    this.cart = options.cart || new Cart();
    this.containerId = options.containerId || 'cart-ui';
    this.onCheckout = options.onCheckout || null;
    this.onChange = options.onChange || null;
  }

  /**
   * Render cart UI
   */
  render() {
    const container = document.getElementById(this.containerId);
    if (!container) {
      console.error(`CartUI: Container #${this.containerId} not found`);
      return;
    }

    const items = this.cart.getItems();
    const total = this.cart.getTotal();
    const count = this.cart.getCount();

    container.innerHTML = `
      <div class="cart-panel">
        <div class="cart-header">
          <h3>🛒 Cart (${count})</h3>
          ${count > 0 ? `<button class="cart-clear-btn" onclick="cartUI.clearCart()">Clear</button>` : ''}
        </div>
        
        ${count === 0 ? `
          <div class="cart-empty">
            <p>Your cart is empty</p>
            <p class="muted">Add snakes from the catalog</p>
          </div>
        ` : `
          <div class="cart-items">
            ${items.map(item => this.renderItem(item)).join('')}
          </div>
          
          <div class="cart-footer">
            <div class="cart-total">
              <span>Total:</span>
              <span class="cart-total-price">€${total.toFixed(2)}</span>
            </div>
            <button class="cart-checkout-btn" onclick="cartUI.checkout()">
              Checkout
            </button>
          </div>
        `}
      </div>
    `;

    this.injectStyles();
  }

  /**
   * Render single cart item
   */
  renderItem(item) {
    return `
      <div class="cart-item" data-id="${item.id}">
        <div class="cart-item-info">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-morph">${item.morph || ''}</div>
        </div>
        <div class="cart-item-price">€${(item.price || 0).toFixed(2)}</div>
        <button class="cart-item-remove" onclick="cartUI.removeItem('${item.id}')">×</button>
      </div>
    `;
  }

  /**
   * Add item to cart
   */
  addItem(product) {
    const success = this.cart.add(product);
    if (success) {
      this.render();
      if (this.onChange) {
        this.onChange(this.cart.getMetadata());
      }
    }
    return success;
  }

  /**
   * Remove item from cart
   */
  removeItem(productId) {
    const success = this.cart.remove(productId);
    if (success) {
      this.render();
      if (this.onChange) {
        this.onChange(this.cart.getMetadata());
      }
    }
    return success;
  }

  /**
   * Clear cart
   */
  clearCart() {
    if (confirm('Clear all items from cart?')) {
      this.cart.clear();
      this.render();
      if (this.onChange) {
        this.onChange(this.cart.getMetadata());
      }
    }
  }

  /**
   * Checkout
   */
  checkout() {
    const items = this.cart.getItems();
    if (items.length === 0) {
      alert('Cart is empty');
      return;
    }

    if (this.onCheckout) {
      this.onCheckout(items);
    } else {
      console.warn('CartUI: No onCheckout handler defined');
      alert('Checkout not configured');
    }
  }

  /**
   * Inject CSS styles
   */
  injectStyles() {
    if (document.getElementById('cart-ui-styles')) return;

    const style = document.createElement('style');
    style.id = 'cart-ui-styles';
    style.textContent = `
      .cart-panel {
        background: white;
        border: 1px solid #e0e0e0;
        border-radius: 8px;
        padding: 1rem;
      }

      .cart-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
        padding-bottom: 0.5rem;
        border-bottom: 1px solid #e0e0e0;
      }

      .cart-header h3 {
        margin: 0;
        font-size: 1.2rem;
      }

      .cart-clear-btn {
        background: #f44336;
        color: white;
        border: none;
        padding: 0.4rem 0.8rem;
        border-radius: 4px;
        cursor: pointer;
        font-size: 0.9rem;
      }

      .cart-empty {
        text-align: center;
        padding: 2rem 1rem;
        color: #666;
      }

      .cart-items {
        max-height: 300px;
        overflow-y: auto;
        margin-bottom: 1rem;
      }

      .cart-item {
        display: flex;
        align-items: center;
        padding: 0.75rem;
        margin-bottom: 0.5rem;
        background: #f8f9fa;
        border-radius: 6px;
      }

      .cart-item-info {
        flex: 1;
      }

      .cart-item-name {
        font-weight: 600;
        margin-bottom: 0.25rem;
      }

      .cart-item-morph {
        font-size: 0.85rem;
        color: #666;
      }

      .cart-item-price {
        font-weight: 600;
        margin-right: 1rem;
        color: #4caf50;
      }

      .cart-item-remove {
        background: #f44336;
        color: white;
        border: none;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        cursor: pointer;
        font-size: 1.2rem;
        line-height: 1;
        padding: 0;
      }

      .cart-footer {
        border-top: 1px solid #e0e0e0;
        padding-top: 1rem;
      }

      .cart-total {
        display: flex;
        justify-content: space-between;
        font-size: 1.1rem;
        font-weight: 600;
        margin-bottom: 1rem;
      }

      .cart-total-price {
        color: #4caf50;
      }

      .cart-checkout-btn {
        width: 100%;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border: none;
        padding: 0.8rem;
        border-radius: 6px;
        cursor: pointer;
        font-size: 1rem;
        font-weight: 600;
      }

      .cart-checkout-btn:hover {
        opacity: 0.9;
      }
    `;
    document.head.appendChild(style);
  }
}
