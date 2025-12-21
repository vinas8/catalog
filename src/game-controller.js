// Main Game Logic - Serpent Town v3.4
// User authentication via URL hash + user-specific data loading

import { Economy, createInitialGameState } from './business/economy.js';
import { EquipmentShop } from './business/equipment.js';
import { openShop } from './ui/shop-view.js';
import { SPECIES_PROFILES, getLifeStage, getFeedingSchedule } from './data/species-profiles.js';
import { getMorphsForSpecies } from './data/morphs.js';
import { getProductsBySpecies } from './data/catalog.js';
import { UserAuth, initializeUser } from './auth/user-auth.js';

class SerpentTown {
  constructor() {
    this.currentUser = null;
    this.gameState = null;
    this.gameLoop = null;
    this.lastUpdate = Date.now();
    
    this.init();
  }
  
  async init() {
    console.log('🐍 Serpent Town v3.4 - Starting...');
    
    // Load user from URL
    this.currentUser = await initializeUser();
    
    if (this.currentUser) {
      console.log('👤 Logged in as:', this.currentUser.user_id);
      // Load user-specific snakes
      await this.loadUserSnakes();
    } else {
      console.log('👤 No user - using demo/guest mode');
      this.gameState = this.loadGame() || createInitialGameState();
    }
    
    // Set up UI event listeners
    this.setupEventListeners();
    
    // Render initial UI
    this.render();
    
    // Start game loop
    this.startGameLoop();
    
    // Auto-save every 30 seconds
    setInterval(() => this.saveGame(), 30000);
    
    console.log('✅ Game initialized!');
  }
  
  async loadUserSnakes() {
    try {
      // Load user's snakes from user-products.json
      const response = await fetch('/data/user-products.json');
      const userProducts = await response.json();
      
      // Filter by current user
      const mySnakes = userProducts.filter(up => up.user_id === this.currentUser.user_id);
      
      console.log(`🐍 Loaded ${mySnakes.length} snakes for user`);
      
      // Create game state with user's snakes
      this.gameState = this.loadGame() || createInitialGameState();
      this.gameState.user_id = this.currentUser.user_id;
      this.gameState.snakes = await this.convertUserProductsToSnakes(mySnakes);
      
    } catch (error) {
      console.error('Error loading user snakes:', error);
      this.gameState = createInitialGameState();
    }
  }
  
  async convertUserProductsToSnakes(userProducts) {
    // Load products to get full details
    const productsResponse = await fetch('/data/products.json');
    const products = await productsResponse.json();
    
    return userProducts.map(up => {
      const product = products.find(p => p.id === up.product_id);
      
      return {
        id: up.assignment_id,
        product_id: up.product_id,
        user_id: up.user_id,
        nickname: up.nickname,
        species: product?.species || 'ball_python',
        morph: product?.morph || 'normal',
        type: up.product_type, // 'real' or 'virtual'
        sex: product?.sex || 'unknown',
        birth_date: product?.birth_year || 2024,
        weight_grams: product?.weight_grams || 100,
        length_cm: 30,
        acquired_date: up.acquired_at,
        acquisition_type: up.acquisition_type,
        stats: up.stats || {
          hunger: 80,
          water: 100,
          temperature: 80,
          humidity: 50,
          health: 100,
          stress: 10,
          cleanliness: 100,
          happiness: 80
        },
        equipment: {
          heater: null,
          mister: null,
          thermometer: false,
          hygrometer: false
        },
        shed_cycle: {
          stage: 'normal',
          last_shed: new Date().toISOString(),
          days_since_last: 0
        },
        created_at: up.acquired_at,
        updated_at: new Date().toISOString()
      };
    });
  }
  
  setupEventListeners() {
    // Shop button
    document.getElementById('shop-btn').addEventListener('click', () => {
      try {
        openShop(this.gameState, (result) => {
          this.saveGame();
          this.render();
        });
      } catch (error) {
        console.error('Failed to open shop:', error);
        this.showNotification('❌ Failed to open shop', 'error');
      }
    });

    // Settings button
    document.getElementById('settings-btn').addEventListener('click', () => {
      document.getElementById('settings-modal').style.display = 'flex';
    });
    
    // Navigation buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.switchView(e.target.dataset.view);
      });
    });
    
    // Buy virtual snake button
    document.getElementById('buy-virtual-snake-btn').addEventListener('click', () => {
      this.showBuyVirtualSnakeModal();
    });
    
    // Species filter for catalog
    const speciesFilter = document.getElementById('species-filter');
    if (speciesFilter) {
      speciesFilter.addEventListener('change', (e) => {
        this.renderCatalogView();
      });
    }
    
    // Game speed slider
    const speedSlider = document.getElementById('speed-slider');
    const speedDisplay = document.getElementById('speed-display');
    
    speedSlider.addEventListener('input', (e) => {
      const speed = parseInt(e.target.value);
      this.gameState.game_speed = speed;
      speedDisplay.textContent = `${speed}x`;
    });
    
    // Debug buttons (hidden by default)
    const debugBtn = document.getElementById('add-gold-btn');
    if (debugBtn) {
      debugBtn.addEventListener('click', () => {
        this.gameState.currency.gold += 1000;
        this.render();
      });
    }
    
    const saveBtn = document.getElementById('save-btn');
    if (saveBtn) {
      saveBtn.addEventListener('click', () => this.saveGame());
    }
    
    const resetBtn = document.getElementById('reset-btn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        if (confirm('⚠️ Reset game? This will delete all progress!')) {
          this.resetGame();
        }
      });
    }

    // Enable debug mode with keyboard shortcut (Ctrl+Shift+D)
    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        const debugGroup = document.querySelector('.setting-group[style*="none"]');
        if (debugGroup) {
          debugGroup.style.display = 'block';
          this.showNotification('Debug mode enabled', 'success');
        }
      }
    });
  }
  
  switchView(viewName) {
    // Hide all views
    document.querySelectorAll('.view-content').forEach(view => {
      view.classList.remove('active');
    });
    
    // Deactivate all nav buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    
    // Show selected view
    document.getElementById(`${viewName}-view`).classList.add('active');
    
    // Activate nav button
    document.querySelector(`[data-view="${viewName}"]`).classList.add('active');
    
    // Render view-specific content
    switch(viewName) {
      case 'farm':
        this.renderFarmView();
        break;
      case 'catalog':
        this.renderCatalogView();
        break;
      case 'encyclopedia':
        this.renderEncyclopediaView();
        break;
      case 'calculator':
        this.renderCalculatorView();
        break;
    }
  }
  
  render() {
    this.renderHeader();
    this.renderFarmView();
  }
  
  renderHeader() {
    document.getElementById('gold-amount').textContent = this.gameState.currency.gold;
    document.getElementById('loyalty-tier').textContent = this.gameState.loyalty_tier.toUpperCase();
    document.getElementById('loyalty-tier').className = `tier-badge tier-${this.gameState.loyalty_tier}`;
  }
  
  renderFarmView() {
    const container = document.getElementById('snake-collection');
    const emptyState = document.getElementById('empty-collection');
    
    if (this.gameState.snakes.length === 0) {
      container.style.display = 'none';
      emptyState.style.display = 'block';
      return;
    }
    
    container.style.display = 'grid';
    emptyState.style.display = 'none';
    
    container.innerHTML = this.gameState.snakes.map(snake => this.renderSnakeCard(snake)).join('');
    
    // Attach event listeners to action buttons
    this.attachSnakeActionListeners();
  }
  
  renderSnakeCard(snake) {
    const lifeStage = getLifeStage(snake);
    const profile = SPECIES_PROFILES[snake.species];
    
    return `
      <div class="snake-card ${snake.type}" data-snake-id="${snake.id}">
        <div class="snake-header">
          <div class="snake-name">${snake.nickname}</div>
          <div class="snake-species">
            ${profile.common_name} - ${snake.morph}
          </div>
          <div class="snake-info">
            <span class="badge">${lifeStage}</span>
            <span class="muted">${snake.sex} • ${snake.weight_grams}g • ${snake.length_cm}cm</span>
          </div>
        </div>
        
        <div class="snake-stats">
          ${this.renderStatBar('hunger', snake.stats.hunger)}
          ${this.renderStatBar('water', snake.stats.water)}
          ${this.renderStatBar('temperature', snake.stats.temperature)}
          ${this.renderStatBar('humidity', snake.stats.humidity)}
          ${this.renderStatBar('health', snake.stats.health)}
          ${this.renderStatBar('stress', snake.stats.stress)}
          ${this.renderStatBar('cleanliness', snake.stats.cleanliness)}
          ${this.renderStatBar('happiness', snake.stats.happiness)}
        </div>
        
        <div class="shedding-info">
          <small>Shed: ${snake.shed_cycle.stage} (${snake.shed_cycle.days_since_last} days since last)</small>
        </div>
        
        <div class="snake-actions">
          <button class="action-btn" data-action="feed" data-snake-id="${snake.id}">🍖 Feed</button>
          <button class="action-btn" data-action="water" data-snake-id="${snake.id}">💧 Water</button>
          <button class="action-btn" data-action="clean" data-snake-id="${snake.id}">🧹 Clean</button>
          <button class="action-btn" data-action="equipment" data-snake-id="${snake.id}">🛠️ Equipment</button>
        </div>
      </div>
    `;
  }
  
  renderStatBar(statName, value) {
    const displayName = statName.charAt(0).toUpperCase() + statName.slice(1);
    const percentage = Math.max(0, Math.min(100, value));
    
    return `
      <div class="stat-bar">
        <div class="stat-label">
          <span>${displayName}</span>
          <span>${Math.round(percentage)}%</span>
        </div>
        <div class="stat-progress">
          <div class="stat-fill ${statName}" style="width: ${percentage}%"></div>
        </div>
      </div>
    `;
  }
  
  attachSnakeActionListeners() {
    document.querySelectorAll('.action-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const action = e.target.dataset.action;
        const snakeId = e.target.dataset.snakeId;
        this.handleSnakeAction(action, snakeId);
      });
    });
  }
  
  handleSnakeAction(action, snakeId) {
    const snake = this.gameState.snakes.find(s => s.id === snakeId);
    if (!snake) return;
    
    switch(action) {
      case 'feed':
        snake.stats.hunger = Math.min(100, snake.stats.hunger + 50);
        snake.last_fed = new Date().toISOString();
        this.showNotification(`Fed ${snake.nickname}!`, 'success');
        break;
        
      case 'water':
        snake.stats.water = 100;
        snake.last_watered = new Date().toISOString();
        this.showNotification(`Watered ${snake.nickname}!`, 'success');
        break;
        
      case 'clean':
        snake.stats.cleanliness = 100;
        snake.last_cleaned = new Date().toISOString();
        this.showNotification(`Cleaned ${snake.nickname}'s enclosure!`, 'success');
        break;
        
      case 'equipment':
        this.showEquipmentModal(snake);
        return;
    }
    
    snake.updated_at = new Date().toISOString();
    this.saveGame();
    this.render();
  }
  
  showBuyVirtualSnakeModal() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h2>Buy Virtual Snake</h2>
          <button class="close-btn" onclick="this.closest('.modal').remove()">✕</button>
        </div>
        <div style="padding: 1.5rem;">
          <div class="form-group">
            <label>Species:</label>
            <select id="virtual-species">
              <option value="ball_python">Ball Python (1000 gold)</option>
              <option value="corn_snake">Corn Snake (500 gold)</option>
            </select>
          </div>
          <div class="form-group">
            <label>Morph:</label>
            <select id="virtual-morph">
              <option value="">Normal</option>
            </select>
          </div>
          <button class="primary-btn" id="confirm-buy-virtual">Buy Snake</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // Update morph options when species changes
    const speciesSelect = modal.querySelector('#virtual-species');
    const morphSelect = modal.querySelector('#virtual-morph');
    
    speciesSelect.addEventListener('change', () => {
      const species = speciesSelect.value;
      const morphs = getMorphsForSpecies(species);
      
      morphSelect.innerHTML = '<option value="">Normal</option>' + 
        morphs.map(m => `<option value="${m.id}">${m.name} (${Math.floor(m.price_multiplier)}x)</option>`).join('');
    });
    
    // Buy button
    modal.querySelector('#confirm-buy-virtual').addEventListener('click', () => {
      const species = speciesSelect.value;
      const morph = morphSelect.value;
      
      try {
        const snake = Economy.buyVirtualSnake(species, morph ? [morph] : [], this.gameState);
        this.showNotification(`Bought ${snake.nickname}!`, 'success');
        this.saveGame();
        this.render();
        modal.remove();
      } catch (error) {
        this.showNotification(error.message, 'error');
      }
    });
  }
  
  showEquipmentModal(snake) {
    openShop(this.gameState, (result) => {
      this.saveGame();
      this.render();
    });
  }
  
  async renderCatalogView() {
    const container = document.getElementById('catalog-items');
    const speciesFilter = document.getElementById('species-filter');
    const selectedSpecies = speciesFilter ? speciesFilter.value : 'all';
    
    // Show loading state
    container.innerHTML = '<div class="loading">Loading catalog...</div>';
    
    try {
      // Load products from JSON file
      console.log('🔄 Loading products for species:', selectedSpecies);
      const products = await getProductsBySpecies(selectedSpecies);
      console.log('✅ Loaded products:', products);
      
      if (products.length === 0) {
        container.innerHTML = '<div class="empty-state">No snakes available in this category</div>';
        return;
      }
      
      // Render products
      container.innerHTML = products.map(item => `
        <div class="catalog-item" data-species="${item.species}">
          <div class="item-image">${item.image || '🐍'}</div>
          <h3>${item.name}</h3>
          <p class="species-info">${SPECIES_PROFILES[item.species]?.common_name || item.species} - ${item.morph}</p>
          <p class="item-description">${item.description}</p>
          <p class="item-info">${item.info}</p>
          <div class="item-price">$${typeof item.price === 'number' ? item.price.toFixed(2) : item.price}</div>
          <a href="${item.stripe_link}" target="_blank" class="primary-btn">
            💳 Buy with Stripe
          </a>
        </div>
      `).join('');
    } catch (error) {
      console.error('❌ Error loading catalog:', error);
      container.innerHTML = '<div class="error-state">Failed to load catalog. Please try again.</div>';
    }
  }
  
  renderEncyclopediaView() {
    console.log('Encyclopedia view (to be implemented with markdown files)');
  }
  
  renderCalculatorView() {
    // Populate snake dropdowns
    const parent1Select = document.getElementById('parent1-select');
    const parent2Select = document.getElementById('parent2-select');
    
    const snakeOptions = this.gameState.snakes.map(snake => 
      `<option value="${snake.id}">${snake.nickname} (${snake.species})</option>`
    ).join('');
    
    parent1Select.innerHTML = '<option value="">Select a snake...</option>' + snakeOptions;
    parent2Select.innerHTML = '<option value="">Select a snake...</option>' + snakeOptions;
  }
  
  startGameLoop() {
    this.gameLoop = setInterval(() => {
      this.updateGame();
    }, 1000); // Update every second
  }
  
  updateGame() {
    const now = Date.now();
    const deltaTime = (now - this.lastUpdate) / 1000; // seconds
    const gameSpeed = this.gameState.game_speed || 1;
    const adjustedDelta = deltaTime * gameSpeed;
    
    // Update each snake
    for (const snake of this.gameState.snakes) {
      if (snake.in_vacation_mode) continue;
      
      this.updateSnakeStats(snake, adjustedDelta);
    }
    
    this.lastUpdate = now;
    
    // Re-render if on farm view
    if (document.getElementById('farm-view').classList.contains('active')) {
      this.renderFarmView();
    }
  }
  
  updateSnakeStats(snake, deltaTime) {
    const profile = SPECIES_PROFILES[snake.species];
    const decayRates = profile.stat_decay;
    
    // Decay stats (per hour, so divide by 3600)
    const hourlyDecay = deltaTime / 3600;
    
    snake.stats.hunger = Math.max(0, snake.stats.hunger - (decayRates.hunger * hourlyDecay));
    snake.stats.water = Math.max(0, snake.stats.water - (decayRates.water * hourlyDecay));
    snake.stats.cleanliness = Math.max(0, snake.stats.cleanliness - (decayRates.cleanliness * hourlyDecay));
    snake.stats.stress = Math.max(0, snake.stats.stress + (decayRates.stress * hourlyDecay));
    
    // Equipment effects
    if (snake.equipment.heater?.automation) {
      snake.stats.temperature = Math.min(100, snake.stats.temperature + 0.1);
    } else {
      snake.stats.temperature = Math.max(0, snake.stats.temperature - 0.05);
    }
    
    if (snake.equipment.mister?.automation) {
      snake.stats.humidity = Math.min(100, snake.stats.humidity + 0.1);
    } else {
      snake.stats.humidity = Math.max(0, snake.stats.humidity - 0.05);
    }
    
    // Health calculation
    if (snake.stats.hunger < 30 || snake.stats.water < 30) {
      snake.stats.health = Math.max(0, snake.stats.health - 0.1);
    } else if (snake.stats.hunger > 70 && snake.stats.water > 70) {
      snake.stats.health = Math.min(100, snake.stats.health + 0.05);
    }
    
    // Happiness calculation
    const avgCare = (snake.stats.hunger + snake.stats.water + snake.stats.cleanliness) / 3;
    snake.stats.happiness = Math.max(0, Math.min(100, avgCare - snake.stats.stress));
  }
  
  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => notification.remove(), 3000);
  }
  
  saveGame() {
    try {
      this.gameState.last_save = new Date().toISOString();
      localStorage.setItem('serpent_town_save', JSON.stringify(this.gameState));
      console.log('💾 Game saved');
      this.showNotification('💾 Game saved', 'success');
    } catch (error) {
      console.error('Failed to save game:', error);
      this.showNotification('❌ Save failed', 'error');
    }
  }
  
  loadGame() {
    try {
      const saved = localStorage.getItem('serpent_town_save');
      if (saved) {
        console.log('📂 Loading saved game');
        return JSON.parse(saved);
      }
    } catch (error) {
      console.error('Failed to load game:', error);
    }
    return null;
  }
  
  resetGame() {
    // Stop the game loop before resetting
    if (this.gameLoop) {
      clearInterval(this.gameLoop);
      this.gameLoop = null;
    }
    
    // Clear save data
    localStorage.removeItem('serpent_town_save');
    
    // Close settings modal
    const settingsModal = document.getElementById('settings-modal');
    if (settingsModal) {
      settingsModal.style.display = 'none';
    }
    
    // Reload the page
    location.reload();
  }
}

// Initialize game when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.game = new SerpentTown();
  });
} else {
  window.game = new SerpentTown();
}

export default SerpentTown;
