/**
 * Cart Module - Facade Export
 * @module modules/cart
 * @version 0.7.7
 * SMRI: S1.3,4.01
 * 
 * PUBLIC API (exported):
 *  - Cart (class)
 *  - CartUI (class)
 *  - addToCart (function)
 */

export { Cart } from './Cart.js';
export { CartUI } from './CartUI.js';

// Internal singleton instances (not exported)
let cartInstance = null;
let cartUIInstance = null;

/**
 * Get cart singleton (internal helper)
 * @private
 * @returns {Cart}
 */
function getCart() {
  if (!cartInstance) {
    cartInstance = new Cart();
  }
  return cartInstance;
}

/**
 * Add product to cart and show notification
 * SMRI: S1.3,4.01 - Add to Cart Facade
 * @public
 * @param {Object} product - Product to add
 * @returns {boolean} Success status
 */
export function addToCart(product) {
  const cart = getCart();
  const success = cart.add(product);
  
  if (success) {
    showCartPopup(`✅ Added ${product.name} to cart`);
    updateCartBadge();
  } else {
    showCartPopup(`⚠️ ${product.name} is already in cart`, 'warning');
  }
  
  return success;
}

/**
 * Show cart notification popup (internal helper)
 * @private
 * @param {string} message - Message to show
 * @param {string} type - 'success' | 'warning' | 'error'
 */
function showCartPopup(message, type = 'success') {
  // Remove existing popup
  const existing = document.getElementById('cart-popup');
  if (existing) existing.remove();
  
  const popup = document.createElement('div');
  popup.id = 'cart-popup';
  popup.className = `cart-popup cart-popup-${type}`;
  popup.textContent = message;
  
  document.body.appendChild(popup);
  
  // Animate in
  setTimeout(() => popup.classList.add('cart-popup-show'), 10);
  
  // Auto remove
  setTimeout(() => {
    popup.classList.remove('cart-popup-show');
    setTimeout(() => popup.remove(), 300);
  }, 3000);
}

/**
 * Update cart badge count in UI (internal helper)
 * @private
 */
function updateCartBadge() {
  const cart = getCart();
  const count = cart.getCount();
  
  const badges = document.querySelectorAll('.cart-badge');
  badges.forEach(badge => {
    badge.textContent = count;
    badge.style.display = count > 0 ? 'block' : 'none';
  });
}

/**
 * Initialize cart UI (internal - use CartUI class directly)
 * @private
 * @param {Object} options - Configuration options
 */
function initCartUI(options = {}) {
  const cart = getCart();
  cartUIInstance = new CartUI({ ...options, cart });
  return cartUIInstance;
}
