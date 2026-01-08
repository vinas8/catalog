// Shelf Manager - Manages multiple terrarium shelves
// Handles shelf navigation, pagination, and clean all operations

import { getSnakeAvatar } from '../common/snake-avatar.js';
import { UI_CONFIG } from '../../config/ui-config.js';

export class ShelfManager {
  constructor(gameState, type = 'real') {
    this.gameState = gameState;
    this.type = type; // 'real' or 'virtual'
    this.currentShelfIndex = 0;
    this.snakesPerShelf = 10;
  }
  
  get totalSnakes() {
    return this.filteredSnakes.length;
  }
  
  get filteredSnakes() {
    // Filter snakes by type (real or virtual)
    return this.gameState.snakes.filter(s => s.type === this.type);
  }
  
  get totalShelves() {
    return Math.ceil(this.totalSnakes / this.snakesPerShelf);
  }
  
  getCurrentShelfSnakes() {
    const start = this.currentShelfIndex * this.snakesPerShelf;
    const end = start + this.snakesPerShelf;
    return this.filteredSnakes.slice(start, end);
  }
  
  nextShelf() {
    if (this.currentShelfIndex < this.totalShelves - 1) {
      this.currentShelfIndex++;
      return true;
    }
    return false;
  }
  
  previousShelf() {
    if (this.currentShelfIndex > 0) {
      this.currentShelfIndex--;
      return true;
    }
    return false;
  }
  
  cleanAllOnCurrentShelf() {
    const snakes = this.getCurrentShelfSnakes();
    const cleaned = snakes.length;
    
    snakes.forEach(snake => {
      snake.stats.cleanliness = 100;
      snake.last_cleaned = new Date().toISOString();
    });
    
    return cleaned;
  }
  
  render(container) {
    if (!container) return;
    
    const snakes = this.getCurrentShelfSnakes();
    
    const html = `
      <div class="shelf-container">
        ${this.renderShelfHeader()}
        ${this.renderTerrariums(snakes)}
      </div>
    `;
    
    container.innerHTML = html;
    this.attachEventListeners(container);
  }
  
  renderShelfHeader() {
    const showNav = this.totalShelves > 1;
    
    return `
      <div class="shelf-header">
        <button class="btn-clean-all" id="btn-clean-all">
          🧹 Clean All
        </button>
        
        ${showNav ? `
          <div class="shelf-navigation">
            <button class="btn-shelf-nav" id="btn-prev-shelf" ${this.currentShelfIndex === 0 ? 'disabled' : ''}>
              ◄
            </button>
            <span class="shelf-indicator">
              Shelf ${this.currentShelfIndex + 1} of ${this.totalShelves}
            </span>
            <button class="btn-shelf-nav" id="btn-next-shelf" ${this.currentShelfIndex === this.totalShelves - 1 ? 'disabled' : ''}>
              ►
            </button>
          </div>
        ` : ''}
      </div>
    `;
  }
  
  renderTerrariums(snakes) {
    if (snakes.length === 0) {
      return `
        <div class="empty-shelf">
          <div class="empty-icon">🐍</div>
          <p>No snakes on this shelf</p>
        </div>
      `;
    }
    
    return `
      <div class="terrarium-grid">
        ${snakes.map(snake => this.renderSingleTerrarium(snake)).join('')}
      </div>
    `;
  }
  
  renderSingleTerrarium(snake) {
    const avatar = getSnakeAvatar(snake); // Using imported utility
    const tier = snake.equipment?.enclosure_tier || 1;
    
    return `
      <div class="terrarium-container tier-${tier}" data-snake-id="${snake.id}">
        <!-- Terrarium Lid -->
        <div class="terrarium-lid">
          <div class="lid-handle">
            <div class="handle-grip"></div>
          </div>
          <div class="lid-label">${snake.nickname}</div>
        </div>
        
        <!-- Terrarium Glass Tank -->
        <div class="terrarium-glass">
          <!-- Snake inside tank -->
          <div class="tank-interior">
            <div class="snake-avatar ${avatar.state}">
              ${avatar.emoji}
            </div>
            <div class="enclosure-decorations">
              ${this.renderTierDecorations(tier)}
            </div>
          </div>
          
          <!-- Tank label/info strip -->
          <div class="tank-info-strip">
            <span class="tank-tier">Tier ${tier}</span>
            <span class="tank-temp">🌡️ ${snake.stats.temperature}%</span>
            <span class="tank-humidity">💧 ${snake.stats.humidity}%</span>
          </div>
        </div>
        
        <!-- Quick Action Buttons -->
        <div class="tank-quick-actions">
          <button class="tank-action-btn" data-action="feed" data-snake-id="${snake.id}" title="Feed">
            🍖
          </button>
          <button class="tank-action-btn" data-action="water" data-snake-id="${snake.id}" title="Water">
            💧
          </button>
          <button class="tank-action-btn" data-action="clean" data-snake-id="${snake.id}" title="Clean">
            🧹
          </button>
          <button class="tank-action-btn vet-btn" data-action="vet" data-snake-id="${snake.id}" title="Vet Check">
            🩺
          </button>
        </div>
      </div>
    `;
  }
  
  renderTierDecorations(tier) {
    return UI_CONFIG.getTierEmoji(tier);
  }
  
  attachEventListeners(container) {
    // Clean All button
    const cleanBtn = container.querySelector('#btn-clean-all');
    if (cleanBtn) {
      cleanBtn.addEventListener('click', () => {
        const count = this.cleanAllOnCurrentShelf();
        this.onCleanAll?.(count);
        this.render(container);
      });
    }
    
    // Navigation buttons
    const prevBtn = container.querySelector('#btn-prev-shelf');
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        if (this.previousShelf()) {
          this.render(container);
        }
      });
    }
    
    const nextBtn = container.querySelector('#btn-next-shelf');
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        if (this.nextShelf()) {
          this.render(container);
        }
      });
    }
    
    // Tank action buttons (feed, water, clean, vet)
    container.querySelectorAll('.tank-action-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent terrarium click
        const action = btn.dataset.action;
        const snakeId = btn.dataset.snakeId;
        this.onActionClick?.(action, snakeId);
      });
    });
    
    // Terrarium clicks (open detail view)
    container.querySelectorAll('.terrarium-container, .terrarium-glass').forEach(terrarium => {
      terrarium.addEventListener('click', (e) => {
        // Don't trigger if clicking action buttons
        if (e.target.closest('.tank-action-btn')) return;
        
        const snakeId = terrarium.dataset.snakeId || e.target.closest('[data-snake-id]')?.dataset.snakeId;
        if (snakeId) {
          // Add opening animation
          const container = e.target.closest('.terrarium-container');
          if (container) {
            container.classList.add('opening');
            setTimeout(() => {
              this.onTerrariumClick?.(snakeId);
              container.classList.remove('opening');
            }, 300);
          } else {
            this.onTerrariumClick?.(snakeId);
          }
        }
      });
    });
  }
}
