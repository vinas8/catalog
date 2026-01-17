// Shop UI Module
// Based on v3.2_FINAL.md specification

import { EquipmentShop, formatPrice, getShopCategories } from '../business/equipment.js';
import { Economy } from '../business/economy.js';

export class ShopView {
  constructor(gameState, onPurchase) {
    this.gameState = gameState;
    this.onPurchase = onPurchase;
    this.selectedCategory = 'all';
    this.selectedSnake = null;
  }
  
  // Render shop modal
  render() {
    const modal = document.createElement('div');
    modal.id = 'shop-modal';
    modal.className = 'modal';
    modal.innerHTML = `
      <div class="modal-content shop-modal-content">
        <div class="modal-header">
          <h2>🛒 Equipment Shop</h2>
          <button class="close-btn" onclick="this.closest('.modal').remove()">✕</button>
        </div>
        
        <div class="shop-info">
          <div class="currency-display">
            <span class="gold-icon">🪙</span>
            <span class="gold-amount">${this.gameState.currency.gold}</span>
            <span class="gold-label">Gold</span>
          </div>
          <div class="loyalty-display">
            <span class="tier-badge tier-${this.gameState.loyalty_tier}">
              ${this.gameState.loyalty_tier.toUpperCase()}
            </span>
            <span class="discount-info">
              ${Economy.getTierBenefits(this.gameState.loyalty_tier).discount} Discount
            </span>
          </div>
        </div>
        
        <div class="shop-categories">
          ${this.renderCategories()}
        </div>
        
        <div class="shop-items-container">
          <div id="shop-items" class="shop-items">
            ${this.renderItems()}
          </div>
        </div>
      </div>
    `;
    
    // Add event listeners
    this.attachEventListeners(modal);
    
    return modal;
  }
  
  renderCategories() {
    const categories = [
      { id: 'all', name: 'All Items', icon: '🏪' },
      ...getShopCategories()
    ];
    
    return categories.map(cat => `
      <button 
        class="category-btn ${this.selectedCategory === cat.id ? 'active' : ''}"
        data-category="${cat.id}">
        ${cat.icon} ${cat.name}
      </button>
    `).join('');
  }
  
  renderItems() {
    const items = EquipmentShop.getAvailableItems(this.gameState);
    const filtered = this.selectedCategory === 'all' 
      ? items 
      : items.filter(item => item.category === this.selectedCategory);
    
    if (filtered.length === 0) {
      return '<div class="no-items">No items available in this category</div>';
    }
    
    return filtered.map(item => this.renderItemCard(item)).join('');
  }
  
  renderItemCard(item) {
    const canAfford = this.gameState.currency.gold >= item.price_gold;
    const hasDiscount = item.discount_applied > 0;
    
    return `
      <div class="shop-item-card ${!canAfford ? 'cannot-afford' : ''} ${item.premium ? 'premium' : ''}">
        <div class="item-icon">${item.image}</div>
        <div class="item-details">
          <h3 class="item-name">${item.name}</h3>
          <p class="item-description">${item.description}</p>
          
          ${this.renderItemEffects(item)}
          
          ${item.requires_loyalty ? `
            <div class="item-requirement">
              Requires: <span class="tier-badge tier-${item.requires_loyalty}">${item.requires_loyalty}</span>
            </div>
          ` : ''}
        </div>
        
        <div class="item-purchase">
          <div class="item-price">
            ${hasDiscount ? `
              <span class="original-price">${item.original_price_gold}</span>
            ` : ''}
            <span class="current-price">
              ${formatPrice(item.price_gold, item.price_usd)}
            </span>
          </div>
          
          ${canAfford || item.price_usd ? `
            <button 
              class="buy-btn ${item.premium ? 'premium-btn' : ''}"
              data-item-id="${item.id}"
              data-price-gold="${item.price_gold}"
              ${item.price_usd ? `data-price-usd="${item.price_usd}"` : ''}>
              ${item.price_usd ? '💳 Buy' : '🪙 Buy'}
            </button>
          ` : `
            <button class="buy-btn" disabled>
              Insufficient Gold
            </button>
          `}
        </div>
      </div>
    `;
  }
  
  renderItemEffects(item) {
    const effects = [];
    
    if (item.effects.automation) effects.push('⚙️ Automatic');
    if (item.effects.temperature_bonus) effects.push(`🌡️ +${item.effects.temperature_bonus} temp`);
    if (item.effects.humidity_boost) effects.push(`💧 +${item.effects.humidity_boost}% humidity`);
    if (item.effects.stress_reduction) effects.push(`😌 -${item.effects.stress_reduction} stress`);
    if (item.effects.happiness_bonus) effects.push(`😊 +${item.effects.happiness_bonus} happiness`);
    
    if (effects.length === 0) return '';
    
    return `
      <div class="item-effects">
        ${effects.join(' • ')}
      </div>
    `;
  }
  
  attachEventListeners(modal) {
    // Category buttons
    modal.querySelectorAll('.category-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.selectedCategory = btn.dataset.category;
        this.updateItems(modal);
      });
    });
    
    // Buy buttons
    modal.querySelectorAll('.buy-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const itemId = btn.dataset.itemId;
        const priceGold = parseInt(btn.dataset.priceGold);
        const priceUsd = btn.dataset.priceUsd ? parseFloat(btn.dataset.priceUsd) : null;
        
        this.handlePurchase(itemId, priceGold, priceUsd, modal);
      });
    });
  }
  
  updateItems(modal) {
    const itemsContainer = modal.querySelector('#shop-items');
    itemsContainer.innerHTML = this.renderItems();
    
    // Update category buttons
    modal.querySelectorAll('.category-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.category === this.selectedCategory);
    });
    
    // Re-attach buy button listeners
    modal.querySelectorAll('.buy-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const itemId = btn.dataset.itemId;
        const priceGold = parseInt(btn.dataset.priceGold);
        const priceUsd = btn.dataset.priceUsd ? parseFloat(btn.dataset.priceUsd) : null;
        
        this.handlePurchase(itemId, priceGold, priceUsd, modal);
      });
    });
  }
  
  handlePurchase(itemId, priceGold, priceUsd, modal) {
    // If has real money option, show payment choice
    if (priceUsd) {
      this.showPaymentChoice(itemId, priceGold, priceUsd, modal);
      return;
    }
    
    // Show snake selection modal if buying with gold
    this.showSnakeSelection(itemId, modal);
  }
  
  showSnakeSelection(itemId, shopModal) {
    if (this.gameState.snakes.length === 0) {
      this.showNotification('❌ You need to buy a snake first!', 'error');
      return;
    }
    
    const selectionModal = document.createElement('div');
    selectionModal.className = 'modal snake-selection-modal';
    selectionModal.style.display = 'flex';  // Ensure modal is visible
    selectionModal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h3>Select Snake</h3>
          <button class="close-btn" onclick="this.closest('.snake-selection-modal').remove()">✕</button>
        </div>
        <div class="snake-list">
          ${this.gameState.snakes.map(snake => `
            <div class="snake-option" data-snake-id="${snake.id}">
              <div class="snake-info">
                <strong>${snake.nickname}</strong>
                <span class="muted">${snake.species} - ${snake.morph}</span>
              </div>
              <button class="select-btn">Select</button>
            </div>
          `).join('')}
        </div>
      </div>
    `;
    
    selectionModal.querySelectorAll('.select-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const snakeId = e.target.closest('.snake-option').dataset.snakeId;
        this.completePurchase(itemId, snakeId, shopModal);
        selectionModal.remove();
      });
    });
    
    document.body.appendChild(selectionModal);
  }
  
  completePurchase(itemId, snakeId, modal) {
    try {
      const result = EquipmentShop.buyEquipment(itemId, snakeId, this.gameState);
      
      // Update UI
      modal.querySelector('.gold-amount').textContent = result.remaining_gold;
      this.updateItems(modal);
      
      // Show success message
      this.showNotification(`✅ Purchased ${result.item.name}!`, 'success');
      
      // Callback
      if (this.onPurchase) {
        this.onPurchase(result);
      }
      
    } catch (error) {
      this.showNotification(`❌ ${error.message}`, 'error');
    }
  }
  
  showPaymentChoice(itemId, priceGold, priceUsd, modal) {
    const choiceModal = document.createElement('div');
    choiceModal.className = 'modal payment-choice-modal';
    choiceModal.style.display = 'flex';  // Ensure modal is visible
    choiceModal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h3>Choose Payment Method</h3>
          <button class="close-btn" onclick="this.closest('.payment-choice-modal').remove()">✕</button>
        </div>
        <div class="payment-options">
          <button class="payment-option gold-option" data-method="gold">
            <span class="icon">🪙</span>
            <span class="label">Pay with Gold</span>
            <span class="price">${priceGold} gold</span>
          </button>
          <button class="payment-option usd-option" data-method="usd">
            <span class="icon">💳</span>
            <span class="label">Pay with Card</span>
            <span class="price">$${priceUsd.toFixed(2)} USD</span>
          </button>
        </div>
      </div>
    `;
    
    choiceModal.querySelector('.gold-option').addEventListener('click', () => {
      choiceModal.remove();
      this.showSnakeSelection(itemId, modal);
    });
    
    choiceModal.querySelector('.usd-option').addEventListener('click', () => {
      // Redirect to Stripe payment link (to be implemented)
      const result = EquipmentShop.buyPremiumEquipment(itemId, this.gameState);
      window.open(result.stripe_payment_link, '_blank');
      choiceModal.remove();
    });
    
    document.body.appendChild(choiceModal);
  }
  
  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    notification.addEventListener('animationend', () => notification.remove());
  }
}

// Open shop modal
export function openShop(gameState, onPurchase) {
  try {
    const existingModal = document.querySelector('#shop-modal');
    if (existingModal) existingModal.remove();
    
    const shopView = new ShopView(gameState, onPurchase);
    const modal = shopView.render();
    modal.style.display = 'flex';  // Ensure modal is visible
    document.body.appendChild(modal);
  } catch (error) {
    console.error('Error opening shop:', error);
    throw error;
  }
}
