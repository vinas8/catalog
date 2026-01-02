// Snake Detail View - Mobile-friendly stats table modal

export class SnakeDetailView {
  constructor(snake, gameState) {
    this.snake = snake;
    this.gameState = gameState;
  }
  
  open() {
    const modal = this.createModal();
    document.body.appendChild(modal);
    
    // Animate in
    requestAnimationFrame(() => {
      modal.classList.add('active');
    });
    
    this.attachEventListeners(modal);
  }
  
  createModal() {
    const modal = document.createElement('div');
    modal.className = 'snake-detail-modal';
    modal.innerHTML = this.renderContent();
    return modal;
  }
  
  renderContent() {
    return `
      <div class="snake-detail-overlay"></div>
      <div class="snake-detail-content">
        ${this.renderHeader()}
        ${this.renderStatsTable()}
        ${this.renderGeneticsSection()}
        ${this.renderBreederSection()}
        ${this.renderCareInfo()}
      </div>
    `;
  }
  
  renderHeader() {
    const avatar = this.getSnakeAvatar();
    
    return `
      <div class="detail-header">
        <div class="detail-avatar">${avatar.emoji}</div>
        <div class="detail-title">
          <h2>${this.snake.nickname}</h2>
          <p class="detail-subtitle">${this.snake.species.replace('_', ' ')} • ${this.snake.morph}</p>
        </div>
        <button class="btn-close-detail">✕</button>
      </div>
    `;
  }
  
  renderStatsTable() {
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
      <div class="stats-table">
        ${stats.map(stat => this.renderStatRow(stat)).join('')}
      </div>
    `;
  }
  
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
  
  renderCareInfo() {
    const nextFeed = this.getNextFeedingTime();
    const lastClean = this.getLastCleanedTime();
    const shedInfo = this.getShedInfo();
    
    return `
      <div class="care-info">
        <div class="care-item">
          <span class="care-icon">📅</span>
          <span class="care-label">Next Feed:</span>
          <span class="care-value">${nextFeed}</span>
        </div>
        <div class="care-item">
          <span class="care-icon">🧹</span>
          <span class="care-label">Last Clean:</span>
          <span class="care-value">${lastClean}</span>
        </div>
        <div class="care-item">
          <span class="care-icon">🔄</span>
          <span class="care-label">Shed:</span>
          <span class="care-value">${shedInfo}</span>
        </div>
      </div>
    `;
  }
  
  renderGeneticsSection() {
    // Only show genetics for real snakes
    if (this.snake.type !== 'real' || !this.snake.genetics) return '';
    
    const genetics = this.snake.genetics;
    const hasGenetics = genetics.visual?.length > 0 || genetics.hets?.length > 0;
    
    if (!hasGenetics) return '';
    
    return `
      <div class="genetics-section">
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
  
  renderBreederSection() {
    // Only show breeder info for real snakes
    if (this.snake.type !== 'real' || !this.snake.breeder) return '';
    
    const breeder = this.snake.breeder;
    
    return `
      <div class="breeder-section">
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
        </div>
      </div>
    `;
  }
    if (this.snake.stats.health < 30) {
      return { emoji: '🤢', state: 'sick' };
    }
    if (this.snake.shed_cycle?.stage === 'blue' || this.snake.shed_cycle?.stage === 'shedding') {
      return { emoji: '🔵', state: 'shedding' };
    }
    if (this.snake.stats.hunger < 30) {
      return { emoji: '😋', state: 'hungry' };
    }
    if (this.snake.stats.happiness > 80) {
      return { emoji: '😊', state: 'happy' };
    }
    if (this.snake.stats.stress > 70) {
      return { emoji: '😰', state: 'stressed' };
    }
    return { emoji: '🐍', state: 'normal' };
  }
  
  getNextFeedingTime() {
    if (!this.snake.last_fed) return 'Feed now';
    const lastFed = new Date(this.snake.last_fed);
    const nextFeed = new Date(lastFed.getTime() + 7 * 24 * 60 * 60 * 1000);
    const now = new Date();
    
    if (nextFeed < now) return 'Overdue!';
    
    const daysUntil = Math.ceil((nextFeed - now) / (24 * 60 * 60 * 1000));
    return `${daysUntil} day${daysUntil !== 1 ? 's' : ''}`;
  }
  
  getLastCleanedTime() {
    if (!this.snake.last_cleaned) return 'Never';
    const cleaned = new Date(this.snake.last_cleaned);
    const now = new Date();
    const diffMs = now - cleaned;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  }
  
  getShedInfo() {
    const stage = this.snake.shed_cycle?.stage || 'normal';
    const daysSince = this.snake.shed_cycle?.days_since_last || 0;
    return `${stage} (${daysSince}d ago)`;
  }
  
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
  }
  
  close(modal) {
    modal.classList.remove('active');
    setTimeout(() => {
      modal.remove();
    }, 300);
  }
}
