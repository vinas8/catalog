// Main Game Logic - Serpent Town v0.7.7
// User authentication via URL hash + user-specific data loading

console.log('🚀 GAME-CONTROLLER.JS TOP - Module file is executing!');

// Module imports (dynamic loading below)
import { 
  getSnakeAvatar,
  DEFAULT_SNAKE_STATS, 
  DEFAULT_SNAKE_WEIGHT,
  TIMEOUTS,
  STRING_LIMITS
} from '../common/index.js?v=0.7.7';
import { SnakeDetailView } from './snake-detail-view.js';
import { UI_CONFIG } from '../../config/ui-config.js';

// Dynamic imports
let Economy, createInitialGameState, EquipmentShop, openShop;
let SPECIES_PROFILES, getLifeStage, getFeedingSchedule;
let getMorphsForSpecies, getProductsBySpecies, loadCatalog;
let renderGameCatalog, UserAuth, initializeUser;

// Main game class
class SerpentTown {
  constructor() {
    this.gameState = null;
    this.economy = null;
    this.shop = null;
  }
  
  async init() {
    // Initialization happens in initGame() below
  }
}

async function loadAllModules() {
  try {
    console.log('📦 Loading economy module...');
    const economyModule = await import('../shop/business/economy.js');
    Economy = economyModule.Economy;
    createInitialGameState = economyModule.createInitialGameState;
    
    console.log('📦 Loading equipment module...');
    const equipmentModule = await import('../shop/business/equipment.js');
    EquipmentShop = equipmentModule.EquipmentShop;
    
    console.log('📦 Loading shop-view module...');
    const shopViewModule = await import('../shop/ui/shop-view.js');
    openShop = shopViewModule.openShop;
    
    console.log('📦 Loading species-profiles module...');
    const speciesModule = await import('../shop/data/species-profiles.js');
    SPECIES_PROFILES = speciesModule.SPECIES_PROFILES;
    getLifeStage = speciesModule.getLifeStage;
    getFeedingSchedule = speciesModule.getFeedingSchedule;
    
    console.log('📦 Loading morphs module...');
    const morphsModule = await import('../shop/data/morphs.js');
    getMorphsForSpecies = morphsModule.getMorphsForSpecies;
    
    console.log('📦 Loading catalog module...');
    const catalogModule = await import('../shop/data/catalog.js');
    getProductsBySpecies = catalogModule.getProductsBySpecies;
    loadCatalog = catalogModule.loadCatalog;
    
    console.log('📦 Loading catalog-renderer module...');
    const rendererModule = await import('../shop/ui/catalog-renderer.js');
    renderGameCatalog = rendererModule.renderGameCatalog;
    
    console.log('📦 Loading user-auth module...');
    const authModule = await import('../auth/user-auth.js');
    UserAuth = authModule.UserAuth;
    initializeUser = authModule.initializeUser;
    
    console.log('✅ All modules loaded successfully!');
    return true;
  } catch (error) {
    console.error('❌ Failed to load modules:', error);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    return false;
  }
}

class SnakeMuffin {
  constructor() {
    this.currentUser = null;
    this.gameState = null;
    this.gameLoop = null;
    this.lastUpdate = Date.now();
    
    // Detect context from data-context attribute
    const appElement = document.getElementById('app') || document.querySelector('[data-context]');
    this.context = appElement?.dataset.context || 'real'; // 'real' or 'virtual'
    console.log(`🎯 Context detected: ${this.context}`);
    
    this.init();
  }
  
  async init() {
    console.log('🐍 Snake Muffin v0.7.7 - Starting...');
    
    // Load user from URL
    this.currentUser = await initializeUser();
    
    if (this.currentUser) {
      console.log('👤 Logged in as:', this.currentUser.user_id);
      // Load full user profile from worker
      await this.loadUserProfile();
      // Load user-specific snakes
      await this.loadUserSnakes();
    } else {
      console.log('👤 No user - using demo/guest mode');
      this.gameState = this.loadGame() || createInitialGameState();
    }
    
    // Set up UI event listeners
    this.setupEventListeners();
    
    // Render initial UI AFTER snakes are loaded
    console.log('🎨 Rendering UI with snakes:', this.gameState?.snakes?.length || 0);
    this.render();
    
    // Start game loop
    this.startGameLoop();
    
    // Auto-save every 30 seconds
  }
  
  
  async loadUserProfile() {
    try {
      // Import worker config
      const { WORKER_CONFIG } = await import('../../config/worker-config.js');
      
      // Try loading from worker first
      const workerUrl = WORKER_CONFIG.getUserEndpoint('USER_DATA', this.currentUser.user_id);
      const response = await fetch(workerUrl);
      
      if (response.ok) {
        const userData = await response.json();
        this.currentUser = { ...this.currentUser, ...userData };
        console.log('✅ User profile loaded from worker:', userData.username);
        this.displayUserProfile(userData);
      } else {
        console.log('⚠️ User profile not in worker, checking localStorage');
        const cached = localStorage.getItem('serpent_user');
        if (cached) {
          const userData = JSON.parse(cached);
          this.displayUserProfile(userData);
        }
      }
    } catch (error) {
      console.log('⚠️ Could not load user profile from worker:', error.message);
      // Try localStorage fallback
      const cached = localStorage.getItem('serpent_user');
      if (cached) {
        const userData = JSON.parse(cached);
        this.displayUserProfile(userData);
      }
    }
  }
  
  displayUserProfile(userData) {
    const welcomeEl = document.getElementById('user-welcome');
    const profileDisplay = document.getElementById('user-profile-display');
    const usernameDisplay = document.getElementById('username-display');
    
    if (userData.username) {
      if (welcomeEl) welcomeEl.textContent = `Welcome back, ${userData.username}! 🎮`;
      if (usernameDisplay) usernameDisplay.textContent = userData.username;
      if (profileDisplay) profileDisplay.style.display = 'block';
    }
  }
  
  async loadUserSnakes() {
    // Mobile debug helper
    const debug = (msg) => {
      console.log(msg);
      if (typeof window !== 'undefined' && document.body) {
        const debugDiv = document.createElement('div');
        debugDiv.style.cssText = 'position:fixed;top:10px;left:10px;background:#000;color:#0f0;padding:5px;z-index:99999;font-size:10px;';
        debugDiv.textContent = msg;
        document.body.appendChild(debugDiv);
        setTimeout(() => debugDiv.remove(), TIMEOUTS.DEBUG_MESSAGE_AUTO_REMOVE);
      }
    };

    try {
      debug('🔄 Starting loadUserSnakes...');
      
      // Check for demo mode
      const urlParams = new URLSearchParams(window.location.search);
      const demoSource = urlParams.get('source');
      
      if (demoSource) {
        debug(`🎬 DEMO MODE: Loading from "${demoSource}"`);
        const storageKey = `${demoSource}_products`;
        const demoData = localStorage.getItem(storageKey);
        
        if (demoData) {
          const products = JSON.parse(demoData);
          const ownedProducts = products.filter(p => p.owner === 'demo_user_123' && p.status === 'sold');
          
          debug(`🐍 Found ${ownedProducts.length} owned demo snakes`);
          
          this.gameState = this.loadGame() || createInitialGameState();
          this.gameState.user_id = this.currentUser.user_id;
          this.gameState.snakes = await this.convertUserProductsToSnakes(ownedProducts);
          
          debug(`✅ Loaded ${this.gameState.snakes.length} demo snakes`);
          return;
        } else {
          debug(`❌ No demo data found for "${demoSource}"`);
          this.gameState = createInitialGameState();
          this.gameState.user_id = this.currentUser.user_id;
          this.gameState.snakes = [];
          return;
        }
      }
      
      // Import worker config
      const { WORKER_CONFIG } = await import('../../config/worker-config.js');
      debug(`✅ Config loaded: ${WORKER_CONFIG.WORKER_URL}`);
      
      // Load user's snakes from Cloudflare Worker KV
      const workerUrl = WORKER_CONFIG.getUserEndpoint('USER_PRODUCTS', this.currentUser.user_id);
      debug(`🔄 Fetching from: ${workerUrl.substring(0, STRING_LIMITS.URL_DISPLAY_LENGTH)}...`);
      console.log(`🔄 Fetching snakes from: ${workerUrl}`);
      
      const response = await fetch(workerUrl);
      debug(`📡 Response: ${response.status}`);
      
      if (!response.ok) {
        debug(`⚠️ No snakes - status ${response.status}`);
        console.warn(`⚠️ Worker returned ${response.status}, no snakes found`);
        this.gameState = this.loadGame() || createInitialGameState();
        this.gameState.user_id = this.currentUser.user_id;
        this.gameState.snakes = [];
        return;
      }
      
      const userProducts = await response.json();
      debug(`🐍 Got ${userProducts.length} snakes!`);
      
      console.log(`🐍 Loaded ${userProducts.length} snakes for user ${this.currentUser.user_id}`);
      
      // Create game state with user's snakes
      this.gameState = this.loadGame() || createInitialGameState();
      this.gameState.user_id = this.currentUser.user_id;
      this.gameState.snakes = await this.convertUserProductsToSnakes(userProducts);
      
      debug(`✅ Converted to ${this.gameState.snakes.length} game snakes`);
      
    } catch (error) {
      debug(`❌ ERROR: ${error.message}`);
      console.error('Error loading user snakes from worker:', error);
      console.log('📝 Starting with empty collection');
      this.gameState = createInitialGameState();
      this.gameState.user_id = this.currentUser.user_id;
      this.gameState.snakes = [];
    }
  }
  
  async convertUserProductsToSnakes(userProducts) {
    // Debug
    const debug = (msg) => {
      const debugDiv = document.createElement('div');
      debugDiv.style.cssText = 'position:fixed;top:200px;left:10px;background:#f0f;color:#fff;padding:5px;z-index:99999;font-size:10px;max-width:300px;';
      debugDiv.textContent = msg;
      document.body.appendChild(debugDiv);
      setTimeout(() => debugDiv.remove(), TIMEOUTS.DEBUG_MESSAGE_AUTO_REMOVE);
    };
    
    debug(`🔄 Converting ${userProducts.length} products...`);
    
    try {
      // Import worker config
      const { WORKER_CONFIG } = await import('../../config/worker-config.js');
      
      // Load products catalog from worker API (not local file)
      const productsUrl = WORKER_CONFIG.getEndpoint('PRODUCTS');
      debug(`🔄 Fetching catalog from worker...`);
      
      const productsResponse = await fetch(productsUrl);
      if (!productsResponse.ok) {
        debug('⚠️ Worker catalog not available, using product data from purchase');
        // Convert using only the data from user products
        return userProducts.map((up, index) => ({
          id: up.assignment_id || up.product_id,
          product_id: up.product_id,
          nickname: up.nickname || up.name || `Snake ${index + 1}`,
          species: up.species || 'ball_python',
          morph: up.morph || 'normal',
          type: up.product_type || 'real',
          sex: up.sex || up.gender || 'unknown',
          birth_date: up.birth_date || up.yob || 2024,
          weight_grams: DEFAULT_SNAKE_WEIGHT,
          length_cm: 30,
          acquired_date: up.acquired_at || up.purchased_at,
          stats: up.stats || DEFAULT_SNAKE_STATS,
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
          created_at: up.acquired_at || new Date().toISOString(),
          updated_at: new Date().toISOString()
        }));
      }
      
      const products = await productsResponse.json();
      debug(`✅ Loaded ${products.length} products from worker`);
      
      return userProducts.map(up => {
      const product = products.find(p => p.id === up.product_id);
      
      return {
        id: up.assignment_id,
        product_id: up.product_id,
        user_id: up.user_id,
        nickname: up.nickname || up.name || product?.name || `Snake ${products.indexOf(product) + 1}`,
        species: product?.species || up.species || 'ball_python',
        morph: product?.morph || up.morph || 'normal',
        type: up.product_type, // 'real' or 'virtual'
        sex: product?.sex || up.sex || up.gender || 'unknown',
        birth_date: product?.birth_year || up.yob || 2024,
        weight_grams: product?.weight_grams || up.weight_grams || 100,
        length_cm: product?.length_cm || up.length_cm || 30,
        acquired_date: up.acquired_at || up.purchased_at,
        acquisition_type: up.acquisition_type || up.source || 'purchase',
        stats: up.stats || { ...DEFAULT_SNAKE_STATS },
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
    } catch (error) {
      console.error('Error converting products:', error);
      debug(`❌ Error: ${error.message}`);
      // Return minimal data on error
      return userProducts.map(up => this.createSnakeFromProduct(up, null));
    }
  }
  
  createSnakeFromProduct(userProduct, catalogProduct = null) {
    // Create a snake object from user product data
    return {
      id: userProduct.assignment_id || userProduct.id || userProduct.product_id,
      product_id: userProduct.product_id,
      user_id: userProduct.user_id,
      nickname: userProduct.nickname || userProduct.name || catalogProduct?.name || 'Unnamed Snake',
      species: catalogProduct?.species || userProduct.species || 'ball_python',
      morph: catalogProduct?.morph || userProduct.morph || 'normal',
      type: userProduct.product_type || 'real',
      sex: catalogProduct?.sex || userProduct.sex || userProduct.gender || 'unknown',
      birth_date: catalogProduct?.birth_year || userProduct.birth_year || userProduct.yob || 2024,
      weight_grams: catalogProduct?.weight_grams || userProduct.weight_grams || 100,
      length_cm: catalogProduct?.length_cm || userProduct.length_cm || 30,
      acquired_date: userProduct.acquired_at || userProduct.purchased_at || new Date().toISOString(),
      acquisition_type: userProduct.acquisition_type || userProduct.source || 'purchase',
      stats: userProduct.stats || DEFAULT_SNAKE_STATS,
      equipment: userProduct.equipment || {
        heater: null,
        mister: null,
        thermometer: false,
        hygrometer: false
      },
      shed_cycle: userProduct.shed_cycle || {
        stage: 'normal',
        last_shed: new Date().toISOString(),
        days_since_last: 0
      },
      created_at: userProduct.acquired_at || new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  }
  
  setupEventListeners() {
    // Shop button
    const shopBtn = document.getElementById('shop-btn');
    if (shopBtn) {
      shopBtn.addEventListener('click', () => {
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
    }

    // Settings button
    const settingsBtn = document.getElementById('settings-btn');
    if (settingsBtn) {
      settingsBtn.addEventListener('click', () => {
        const modal = document.getElementById('settings-modal');
        if (modal) modal.style.display = 'flex';
      });
    }
    
    // Navigation buttons (optional, may not exist after redesign)
    const navButtons = document.querySelectorAll('.nav-btn');
    if (navButtons.length > 0) {
      navButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
          this.switchView(e.target.dataset.view);
        });
      });
    }
    
    // Buy virtual snake button
    const buyVirtualBtn = document.getElementById('buy-virtual-snake-btn');
    if (buyVirtualBtn) {
      buyVirtualBtn.addEventListener('click', () => {
        this.showBuyVirtualSnakeModal();
      });
    }
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
    
    if (speedSlider) {
      speedSlider.addEventListener('input', (e) => {
        const speed = parseInt(e.target.value);
        this.gameState.game_speed = speed;
        if (speedDisplay) speedDisplay.textContent = `${speed}x`;
        this.saveGame();
      });
    }
    
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
    // External page navigation
    if (viewName === 'catalog') {
      // Preserve user hash when navigating to catalog
      const userHash = new URLSearchParams(window.location.search).get('user');
      window.location.href = userHash ? `catalog.html?user=${userHash}` : 'catalog.html';
      return;
    }
    
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
    // Update currency displays (optional - may not exist after header removal)
    const goldAmount = document.getElementById('gold-amount');
    const loyaltyTier = document.getElementById('loyalty-tier');
    
    if (goldAmount) {
      goldAmount.textContent = this.gameState.currency.gold;
    }
    if (loyaltyTier) {
      loyaltyTier.textContent = this.gameState.loyalty_tier.toUpperCase();
      loyaltyTier.className = `tier-badge tier-${this.gameState.loyalty_tier}`;
    }
  }
  
  renderFarmView() {
    console.log('🎨 renderFarmView CALLED');
    const container = document.getElementById('snake-collection');
    const emptyState = document.getElementById('empty-collection');
    
    console.log('📦 Elements found:', {
      container: !!container,
      emptyState: !!emptyState,
      snakes: this.gameState?.snakes?.length,
      context: this.context
    });
    
    // Check if elements exist
    if (!container || !emptyState) {
      console.error('❌ Farm view elements not found!', {
        container: !!container,
        emptyState: !!emptyState
      });
      return;
    }
    
    // Debug
    const debug = (msg) => {
      console.log('🐛 DEBUG:', msg);
      const debugDiv = document.createElement('div');
      debugDiv.style.cssText = 'position:fixed;bottom:10px;left:10px;background:#ff0;color:#000;padding:5px;z-index:99999;font-size:10px;max-width:300px;';
      debugDiv.textContent = msg;
      document.body.appendChild(debugDiv);
      setTimeout(() => debugDiv.remove(), TIMEOUTS.DEBUG_MESSAGE_AUTO_REMOVE);
    };
    
    debug(`🎯 Context: ${this.context}`);
    
    if (!this.gameState || !this.gameState.snakes) {
      debug('❌ No gameState or snakes array!');
      console.error('❌ No gameState or snakes!');
      return;
    }
    
    // 🔒 CRITICAL: Filter snakes by context
    // Farm (real) = show only type:'real'
    // Learn (virtual) = show only type:'virtual'
    const filteredSnakes = this.gameState.snakes.filter(snake => {
      const expectedType = this.context === 'real' ? 'real' : 'virtual';
      return snake.type === expectedType;
    });
    
    debug(`🔍 Filtered: ${filteredSnakes.length} ${this.context} snakes (from ${this.gameState.snakes.length} total)`);
    console.log(`🔍 Context filter: ${this.context} → ${filteredSnakes.length} snakes`);
    
    if (filteredSnakes.length === 0) {
      debug(`⚠️ No ${this.context} snakes`);
      console.log(`⚠️ Zero ${this.context} snakes - showing empty state`);
      container.style.display = 'none';
      emptyState.style.display = 'block';
      return;
    }
    
    debug(`✅ Rendering ${filteredSnakes.length} ${this.context} snakes to DOM`);
    console.log(`✅ Rendering ${filteredSnakes.length} ${this.context} snakes!`);
    
    container.style.display = 'grid';
    emptyState.style.display = 'none';
    
    const html = filteredSnakes.map(snake => this.renderSnakeCard(snake)).join('');
    console.log(`📝 Generated HTML length: ${html.length} characters`);
    container.innerHTML = html;
    console.log('✅ HTML inserted into container');
    
    // Attach event listeners to action buttons
    this.attachSnakeActionListeners();
    console.log('✅ Event listeners attached');
  }
  
  renderSnakeCard(snake) {
    const lifeStage = getLifeStage(snake);
    const profile = SPECIES_PROFILES[snake.species];
    const avatar = getSnakeAvatar(snake); // Using imported utility
    const enclosureLevel = snake.equipment?.enclosure_tier || 1;
    const nextFeedingTime = this.getNextFeedingTime(snake);
    const needsAttention = this.checkNeedsAttention(snake);
    
    return `
      <div class="snake-card ${snake.type} ${needsAttention ? 'needs-attention' : ''}" data-snake-id="${snake.id}">
        <!-- Interactive Terrarium Container -->
        <div class="snake-avatar-section">
          <div class="terrarium-container tier-${enclosureLevel}">
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
                  ${this.renderEnclosureBg(enclosureLevel)}
                </div>
              </div>
              
              <!-- Tank label/info strip -->
              <div class="tank-info-strip">
                <span class="tank-tier">Tier ${enclosureLevel}</span>
                <span class="tank-temp">🌡️ ${snake.stats.temperature}%</span>
                <span class="tank-humidity">💧 ${snake.stats.humidity}%</span>
              </div>
            </div>
            
            <!-- Quick Action Buttons (on tank) -->
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
          ${needsAttention ? '<div class="attention-badge">❗ Needs Care</div>' : ''}
        </div>
        
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
        
        <!-- Feeding Schedule -->
        <div class="feeding-schedule">
          <div class="schedule-header">
            <span>📅 Next Feeding</span>
            <span class="time-label">${nextFeedingTime}</span>
          </div>
          <div class="care-reminders">
            ${this.renderCareReminders(snake)}
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
          <small>🔄 Shed: ${snake.shed_cycle.stage} (${snake.shed_cycle.days_since_last} days since last)</small>
        </div>
        
        <div class="snake-actions">
          <button class="action-btn" data-action="feed" data-snake-id="${snake.id}">🍖 Feed</button>
          <button class="action-btn" data-action="water" data-snake-id="${snake.id}">💧 Water</button>
          <button class="action-btn" data-action="clean" data-snake-id="${snake.id}">🧹 Clean</button>
          <button class="action-btn" data-action="upgrade" data-snake-id="${snake.id}">⬆️ Upgrade</button>
        </div>
      </div>
    `;
  }
  
  renderEnclosureBg(tier) {
    return UI_CONFIG.getTierEmoji(tier);
  }
  
  getNextFeedingTime(snake) {
    if (!snake.last_fed) return 'Feed now';
    const lastFed = new Date(snake.last_fed);
    const nextFeed = new Date(lastFed.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days
    const now = new Date();
    
    if (nextFeed < now) return 'Overdue!';
    
    const daysUntil = Math.ceil((nextFeed - now) / (24 * 60 * 60 * 1000));
    return `${daysUntil} day${daysUntil !== 1 ? 's' : ''}`;
  }
  
  checkNeedsAttention(snake) {
    return snake.stats.hunger < 30 || 
           snake.stats.water < 30 || 
           snake.stats.health < 50 || 
           snake.stats.cleanliness < 30;
  }
  
  renderCareReminders(snake) {
    const reminders = [];
    if (snake.stats.hunger < 30) reminders.push('🍖 Hungry');
    if (snake.stats.water < 30) reminders.push('💧 Thirsty');
    if (snake.stats.cleanliness < 30) reminders.push('🧹 Dirty cage');
    if (snake.shed_cycle.stage === 'blue') reminders.push('🔵 Pre-shed');
    
    if (reminders.length === 0) return '<span class="all-good">✅ All good!</span>';
    return reminders.map(r => `<span class="reminder">${r}</span>`).join(' ');
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
    // Tank action buttons (feed, water, clean, vet)
    document.querySelectorAll('.tank-action-btn, .action-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent card click
        const action = e.target.dataset.action;
        const snakeId = e.target.dataset.snakeId;
        this.handleSnakeAction(action, snakeId);
      });
    });
    
    // Click terrarium container to open/view details
    document.querySelectorAll('.terrarium-container, .terrarium-glass, .enclosure-display').forEach(container => {
      container.style.cursor = 'pointer';
      container.addEventListener('click', (e) => {
        // Don't trigger if clicking action buttons
        if (e.target.closest('.tank-action-btn') || e.target.closest('.action-btn')) return;
        
        const card = e.target.closest('.snake-card');
        if (card) {
          const snakeId = card.dataset.snakeId;
          // Add opening animation
          const terrarium = card.querySelector('.terrarium-container');
          if (terrarium) {
            terrarium.classList.add('opening');
            setTimeout(() => {
              this.showSnakeDetailModal(snakeId);
              terrarium.classList.remove('opening');
            }, 300);
          } else {
            this.showSnakeDetailModal(snakeId);
          }
        }
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
        
      case 'vet':
        // Vet check - improves health
        snake.stats.health = Math.min(100, snake.stats.health + 20);
        snake.stats.stress = Math.max(0, snake.stats.stress - 10);
        snake.last_vet_check = new Date().toISOString();
        this.showNotification(`🩺 ${snake.nickname} checked by vet! Health improved.`, 'success');
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
        
      case 'upgrade':
        this.showUpgradeModal(snake);
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
  
  showUpgradeModal(snake) {
    const currentTier = snake.equipment?.enclosure_tier || 1;
    const upgrades = [
      { tier: 1, name: 'Basic Tub', cost: 0, features: '🪵 Hide spot' },
      { tier: 2, name: 'Standard Enclosure', cost: 500, features: '🪵🌿 Hide + Plants' },
      { tier: 3, name: 'Deluxe Habitat', cost: 1500, features: '🪵🌿💡 + LED Lighting' },
      { tier: 4, name: 'Premium Setup', cost: 3000, features: '🪵🌿💡🌡️ + Auto Climate' },
      { tier: 5, name: 'Luxury Bioactive', cost: 5000, features: '🪵🌿💡🌡️💦 Full Auto' }
    ];
    
    const modal = document.createElement('div');
    modal.className = 'modal upgrade-modal';
    modal.style.display = 'flex';
    
    const upgradeOptions = upgrades.map(u => `
      <div class="upgrade-option ${u.tier === currentTier ? 'current' : ''} ${u.tier <= currentTier ? 'unlocked' : ''}">
        <div class="upgrade-tier">Tier ${u.tier}</div>
        <div class="upgrade-name">${u.name}</div>
        <div class="upgrade-features">${u.features}</div>
        <div class="upgrade-cost">${u.cost === 0 ? 'Free' : `${u.cost} 🪙`}</div>
        ${u.tier === currentTier ? '<span class="current-badge">✅ Current</span>' : ''}
        ${u.tier > currentTier ? `<button class="upgrade-btn" data-tier="${u.tier}" data-cost="${u.cost}">Upgrade</button>` : ''}
      </div>
    `).join('');
    
    modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h2>🏠 Upgrade Enclosure - ${snake.nickname}</h2>
          <button class="close-btn" onclick="this.closest('.modal').remove()">✕</button>
        </div>
        <div class="modal-body">
          <div class="current-balance">
            <span>💰 Gold:</span>
            <span class="balance-amount">${this.gameState.currency?.gold || 0}</span>
          </div>
          <div class="upgrade-grid">
            ${upgradeOptions}
          </div>
          <div class="upgrade-benefits">
            <h3>Benefits:</h3>
            <ul>
              <li>Higher tiers reduce stat decay</li>
              <li>Better enclosures = happier snakes</li>
              <li>Unlock automation features</li>
            </ul>
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add event listeners
    modal.querySelectorAll('.upgrade-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const tier = parseInt(btn.dataset.tier);
        const cost = parseInt(btn.dataset.cost);
        
        if ((this.gameState.currency?.gold || 0) >= cost) {
          snake.equipment = snake.equipment || {};
          snake.equipment.enclosure_tier = tier;
          this.gameState.currency.gold -= cost;
          this.showNotification(`Upgraded ${snake.nickname}'s enclosure to Tier ${tier}!`, 'success');
          this.saveGame();
          this.render();
          modal.remove();
        } else {
          this.showNotification('Not enough gold!', 'error');
        }
      });
    });
  }
  
  showSnakeDetailModal(snakeId) {
    const snake = this.gameState.snakes.find(s => s.id === snakeId);
    if (!snake) return;
    
    const detailView = new SnakeDetailView(snake);
    const modal = document.createElement('div');
    modal.className = 'modal snake-detail-modal';
    modal.style.display = 'flex';
    
    modal.innerHTML = `
      <div class="modal-content large">
        <div class="modal-header">
          <h2>🐍 ${snake.nickname}</h2>
          <button class="close-btn" onclick="this.closest('.modal').remove()">✕</button>
        </div>
        <div class="modal-body">
          ${detailView.render()}
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // Close on backdrop click
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.remove();
      }
    });
  }
  
  async renderCatalogView() {
    const container = document.getElementById('catalog-items');
    const speciesFilter = document.getElementById('species-filter');
    const selectedSpecies = speciesFilter ? speciesFilter.value : 'all';
    
    // Use reusable catalog renderer
    await renderGameCatalog(container, selectedSpecies);
  }
  
  renderEncyclopediaView() {
    const container = document.querySelector('#encyclopedia-view .encyclopedia-categories');
    if (!container) return;
    
    // Add click handlers to category cards
    container.querySelectorAll('.category-card').forEach(card => {
      card.addEventListener('click', () => {
        const category = card.dataset.category;
        this.showNotification(`📚 Encyclopedia: ${category} (Coming soon!)`, 'info');
      });
    });
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
    
    setTimeout(() => notification.remove(), TIMEOUTS.NOTIFICATION_DURATION);
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
console.log('🎮 game-controller.js loaded!');

if (document.readyState === 'loading') {
  console.log('⏳ Waiting for DOMContentLoaded...');
  document.addEventListener('DOMContentLoaded', async () => {
    console.log('✅ DOM Ready - Loading modules...');
    const modulesLoaded = await loadAllModules();
    if (modulesLoaded) {
      try {
        window.game = new SnakeMuffin();
        console.log('✅ SnakeMuffin created!');
      } catch (error) {
        console.error('❌ Failed to create SnakeMuffin:', error);
      }
    } else {
      console.error('❌ Cannot create SnakeMuffin - modules failed to load');
    }
  });
} else {
  console.log('✅ DOM Already Ready - Loading modules...');
  (async () => {
    const modulesLoaded = await loadAllModules();
    if (modulesLoaded) {
      try {
        window.game = new SnakeMuffin();
        console.log('✅ SnakeMuffin created!');
      } catch (error) {
        console.error('❌ Failed to create SnakeMuffin:', error);
      }
    } else {
      console.error('❌ Cannot create SnakeMuffin - modules failed to load');
    }
  })();
}

export default SnakeMuffin;
