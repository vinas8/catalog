// Shelf Manager - Manages multiple aquarium shelves
// Handles shelf navigation, pagination, and clean all operations

import { getSnakeAvatar } from '../common/snake-avatar.js';

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
        ${this.renderAquariums(snakes)}
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
  
  renderAquariums(snakes) {
    if (snakes.length === 0) {
      return `
        <div class="empty-shelf">
          <div class="empty-icon">🐍</div>
          <p>No snakes on this shelf</p>
        </div>
      `;
    }
    
    return `
      <div class="aquarium-grid">
        ${snakes.map(snake => this.renderSingleAquarium(snake)).join('')}
      </div>
    `;
  }
  
  renderSingleAquarium(snake) {
    const avatar = getSnakeAvatar(snake); // Using imported utility
    const tierClass = `tier-${snake.equipment?.enclosure_tier || 1}`;
    
    return `
      <div class="aquarium ${tierClass}" data-snake-id="${snake.id}">
        <div class="aquarium-tank">
          <div class="snake-avatar ${avatar.state}">
            ${avatar.emoji}
          </div>
        </div>
        <div class="aquarium-label">
          ${snake.nickname}
        </div>
      </div>
    `;
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
    
    // Aquarium clicks
    container.querySelectorAll('.aquarium').forEach(aquarium => {
      aquarium.addEventListener('click', () => {
        const snakeId = aquarium.dataset.snakeId;
        this.onAquariumClick?.(snakeId);
      });
    });
  }
}
