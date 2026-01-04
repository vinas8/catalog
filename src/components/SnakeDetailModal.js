/**
 * Shared Snake Detail Modal Component
 * Reusable across Shop (catalog.html) and Farm (collection.html)
 * Shows complete snake information with genetics, breeder info, physical stats
 */

import { SPECIES_PROFILES } from '../modules/shop/data/species-profiles.js';

export class SnakeDetailModal {
  constructor(snake, context = 'shop') {
    this.snake = snake;
    this.context = context; // 'shop' or 'farm'
  }

  /**
   * Open modal
   */
  open() {
    // Remove any existing modal
    const existing = document.querySelector('.snake-detail-modal');
    if (existing) existing.remove();

    const modal = this.createModal();
    document.body.appendChild(modal);

    // Animate in
    requestAnimationFrame(() => {
      modal.classList.add('active');
    });

    this.attachEventListeners(modal);
  }

  /**
   * Create modal element
   */
  createModal() {
    const modal = document.createElement('div');
    modal.className = 'snake-detail-modal';
    modal.innerHTML = this.renderContent();
    return modal;
  }

  /**
   * Render modal content
   */
  renderContent() {
    const isReal = this.snake.type === 'real';
    const contextBadge = this.context === 'farm' 
      ? '<span class="context-badge farm">🏡 Your Snake</span>'
      : this.snake.type === 'virtual'
        ? '<span class="context-badge virtual">💫 Virtual</span>'
        : '<span class="context-badge real">🐍 Real Snake</span>';

    return `
      <div class="snake-detail-overlay"></div>
      <div class="snake-detail-content">
        ${this.renderHeader(contextBadge)}
        ${this.renderBasicInfo()}
        ${isReal ? this.renderPhysicalStats() : ''}
        ${isReal ? this.renderGeneticsSection() : ''}
        ${isReal ? this.renderBreederSection() : ''}
        ${this.context === 'farm' ? this.renderCareInfo() : ''}
        ${this.context === 'shop' ? this.renderPurchaseInfo() : ''}
      </div>
    `;
  }

  /**
   * Render header with avatar and name
   */
  renderHeader(contextBadge) {
    const speciesEmoji = this.getSpeciesEmoji();
    const displayName = this.snake.nickname || this.snake.name;

    return `
      <div class="detail-header">
        ${contextBadge}
        <div class="detail-avatar">${speciesEmoji}</div>
        <div class="detail-title">
          <h2>${displayName}</h2>
          <p class="detail-subtitle">
            ${SPECIES_PROFILES[this.snake.species]?.common_name || this.snake.species.replace('_', ' ')}
            ${this.snake.morph ? ` • ${this.snake.morph}` : ''}
          </p>
        </div>
        <button class="btn-close-detail" aria-label="Close">✕</button>
      </div>
    `;
  }

  /**
   * Render basic information table
   */
  renderBasicInfo() {
    const info = [];

    // Species
    info.push({
      label: 'Species',
      value: SPECIES_PROFILES[this.snake.species]?.common_name || this.snake.species.replace('_', ' ')
    });

    // Morph
    if (this.snake.morph) {
      info.push({ label: 'Morph', value: this.snake.morph });
    }

    // Sex (critical for real snakes)
    if (this.snake.sex) {
      const sexDisplay = {
        'male': '♂️ Male',
        'female': '♀️ Female',
        'unknown': '❓ Unknown'
      }[this.snake.sex] || this.snake.sex;
      info.push({ label: 'Sex', value: sexDisplay });
    }

    // Age (critical for real snakes)
    if (this.snake.age) {
      const ageDisplay = this.formatAge(this.snake.age);
      if (ageDisplay) {
        info.push({ label: 'Age', value: ageDisplay });
      }
    }

    // Birth year fallback
    if (!this.snake.age && this.snake.birth_year) {
      const age = new Date().getFullYear() - this.snake.birth_year;
      info.push({ label: 'Age', value: `~${age} year${age !== 1 ? 's' : ''}` });
    }

    return `
      <div class="detail-section basic-info">
        <h3>📋 Basic Information</h3>
        <div class="info-table">
          ${info.map(item => `
            <div class="info-row">
              <span class="info-label">${item.label}:</span>
              <span class="info-value">${item.value}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  /**
   * Render physical stats (real snakes only)
   */
  renderPhysicalStats() {
    const stats = [];

    // Weight
    if (this.snake.weight_grams) {
      stats.push({
        label: 'Weight',
        value: `${this.snake.weight_grams}g`
      });
    }

    // Length
    if (this.snake.length_cm) {
      stats.push({
        label: 'Length',
        value: `${this.snake.length_cm}cm`
      });
    }

    if (stats.length === 0) return '';

    return `
      <div class="detail-section physical-stats">
        <h3>📏 Physical Stats</h3>
        <div class="info-table">
          ${stats.map(item => `
            <div class="info-row">
              <span class="info-label">${item.label}:</span>
              <span class="info-value">${item.value}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  /**
   * Render genetics section (real snakes only)
   */
  renderGeneticsSection() {
    if (!this.snake.genetics) return '';

    const genetics = this.snake.genetics;
    const hasGenetics = genetics.visual?.length > 0 || genetics.hets?.length > 0;

    if (!hasGenetics) return '';

    return `
      <div class="detail-section genetics-section">
        <h3>🧬 Genetics</h3>
        <div class="genetics-content">
          ${genetics.visual?.length > 0 ? `
            <div class="genetics-row">
              <span class="genetics-label">Visual Traits:</span>
              <span class="genetics-value">${genetics.visual.join(', ')}</span>
            </div>
          ` : ''}
          
          ${genetics.hets?.length > 0 ? `
            <div class="genetics-row">
              <span class="genetics-label">Het for:</span>
              <span class="genetics-value">${genetics.hets.join(', ')}</span>
            </div>
          ` : ''}
          
          ${genetics.possible_hets?.length > 0 ? `
            <div class="genetics-row">
              <span class="genetics-label">Possible Het:</span>
              <span class="genetics-value">${genetics.possible_hets.join(', ')}</span>
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }

  /**
   * Render breeder section (real snakes only)
   */
  renderBreederSection() {
    if (!this.snake.breeder) return '';

    const breeder = this.snake.breeder;

    return `
      <div class="detail-section breeder-section">
        <h3>👤 Breeder Information</h3>
        <div class="breeder-content">
          <div class="breeder-row">
            <span class="breeder-label">Breeder:</span>
            <span class="breeder-value">${breeder.name || 'Unknown'}</span>
          </div>
          ${breeder.location ? `
            <div class="breeder-row">
              <span class="breeder-label">Location:</span>
              <span class="breeder-value">${breeder.location}</span>
            </div>
          ` : ''}
          ${breeder.reputation ? `
            <div class="breeder-row">
              <span class="breeder-label">Reputation:</span>
              <span class="breeder-value">${'⭐'.repeat(breeder.reputation)}</span>
            </div>
          ` : ''}
          ${breeder.id ? `
            <div class="breeder-row">
              <span class="breeder-label">Breeder ID:</span>
              <span class="breeder-value">${breeder.id}</span>
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }

  /**
   * Render care info (farm context only)
   */
  renderCareInfo() {
    if (!this.snake.stats) return '';

    const stats = [
      { name: 'Hunger', icon: '🍖', key: 'hunger', color: '#ff6b6b' },
      { name: 'Water', icon: '💧', key: 'water', color: '#4ecdc4' },
      { name: 'Temperature', icon: '🌡️', key: 'temperature', color: '#ff9f43' },
      { name: 'Humidity', icon: '💦', key: 'humidity', color: '#5f27cd' },
      { name: 'Health', icon: '💚', key: 'health', color: '#28a745' },
      { name: 'Stress', icon: '😰', key: 'stress', color: '#ee5a6f' },
      { name: 'Cleanliness', icon: '🧹', key: 'cleanliness', color: '#48dbfb' },
      { name: 'Happiness', icon: '😊', key: 'happiness', color: '#ffd700' }
    ];

    return `
      <div class="detail-section care-section">
        <h3>💚 Care Stats</h3>
        <div class="stats-table">
          ${stats.map(stat => this.renderStatRow(stat)).join('')}
        </div>
      </div>
    `;
  }

  /**
   * Render stat row
   */
  renderStatRow(stat) {
    const value = Math.round(this.snake.stats[stat.key] || 0);
    const barWidth = Math.max(0, Math.min(100, value));

    return `
      <div class="stat-row">
        <div class="stat-info">
          <span class="stat-icon">${stat.icon}</span>
          <span class="stat-name">${stat.name}</span>
        </div>
        <div class="stat-value">${value}%</div>
        <div class="stat-bar-container">
          <div class="stat-bar-fill" style="width: ${barWidth}%; background: ${stat.color};"></div>
        </div>
      </div>
    `;
  }

  /**
   * Render purchase info (shop context only)
   */
  renderPurchaseInfo() {
    const price = typeof this.snake.price === 'number' ? this.snake.price : 0;
    const priceFormatted = price.toFixed(2);
    const isSold = this.snake.status === 'sold';
    const hasStripeLink = this.snake.stripe_link && this.snake.stripe_link.includes('stripe.com');

    return `
      <div class="detail-section purchase-section">
        <div class="purchase-info">
          <div class="purchase-price">€${priceFormatted}</div>
          ${isSold 
            ? '<button class="btn-purchase" disabled>🔒 Sold Out</button>'
            : hasStripeLink
              ? `<a href="${this.snake.stripe_link}" target="_blank" class="btn-purchase">
                   💳 Buy Now
                 </a>`
              : '<button class="btn-purchase" disabled>❌ Not Available</button>'
          }
        </div>
      </div>
    `;
  }

  /**
   * Get species emoji
   */
  getSpeciesEmoji() {
    const emojiMap = {
      'ball_python': '🐍',
      'corn_snake': '🌽🐍',
      'boa_constrictor': '🐍',
      'king_snake': '👑🐍'
    };
    return emojiMap[this.snake.species] || '🐍';
  }

  /**
   * Format age display
   */
  formatAge(age) {
    if (age.hatch_date) {
      const hatchDate = new Date(age.hatch_date);
      const now = new Date();
      const diffMs = now - hatchDate;
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      const months = Math.floor(diffDays / 30);
      const years = Math.floor(months / 12);

      if (years > 0) {
        const remainingMonths = months % 12;
        return remainingMonths > 0 
          ? `${years}y ${remainingMonths}m`
          : `${years} year${years !== 1 ? 's' : ''}`;
      } else if (months > 0) {
        return `${months} month${months !== 1 ? 's' : ''}`;
      } else {
        return `${diffDays} day${diffDays !== 1 ? 's' : ''}`;
      }
    }

    if (age.years !== undefined) {
      return `${age.years} year${age.years !== 1 ? 's' : ''}`;
    }

    if (age.months !== undefined) {
      return `${age.months} month${age.months !== 1 ? 's' : ''}`;
    }

    return null;
  }

  /**
   * Attach event listeners
   */
  attachEventListeners(modal) {
    // Close button
    const closeBtn = modal.querySelector('.btn-close-detail');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.close(modal));
    }

    // Click overlay to close
    const overlay = modal.querySelector('.snake-detail-overlay');
    if (overlay) {
      overlay.addEventListener('click', () => this.close(modal));
    }

    // ESC key to close
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        this.close(modal);
        document.removeEventListener('keydown', handleEsc);
      }
    };
    document.addEventListener('keydown', handleEsc);
  }

  /**
   * Close modal
   */
  close(modal) {
    modal.classList.remove('active');
    setTimeout(() => {
      modal.remove();
    }, 300);
  }
}

/**
 * Helper function to open detail modal
 * @param {Object} snake - Snake data
 * @param {string} context - 'shop' or 'farm'
 */
export function openSnakeDetail(snake, context = 'shop') {
  const modal = new SnakeDetailModal(snake, context);
  modal.open();
}
