/**
 * Global Application State Management
 * Single source of truth for Serpent Town
 * Persists to localStorage automatically
 */

const STATE_KEY = 'serpent_town_state';
const VERSION = '0.777';

// Initialize global state
window.APP_STATE = {
  version: VERSION,
  ownedSnakes: [],
  unlockedMorphs: [],
  demoProgress: {
    checkout: false,
    farm: false,
    dex: false,
    calculator: false
  },
  settings: {
    soundEnabled: true,
    theme: 'light'
  }
};

/**
 * Load state from localStorage
 */
export function loadState() {
  try {
    const saved = localStorage.getItem(STATE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      
      // Merge with default state (in case new fields added)
      window.APP_STATE = {
        ...window.APP_STATE,
        ...parsed,
        version: VERSION // Always use current version
      };
      
      console.log('✅ State loaded:', window.APP_STATE);
      return window.APP_STATE;
    }
  } catch (error) {
    console.error('❌ Failed to load state:', error);
  }
  
  console.log('🆕 Using fresh state');
  return window.APP_STATE;
}

/**
 * Save state to localStorage
 */
export function saveState() {
  try {
    localStorage.setItem(STATE_KEY, JSON.stringify(window.APP_STATE));
    console.log('💾 State saved');
    return true;
  } catch (error) {
    console.error('❌ Failed to save state:', error);
    return false;
  }
}

/**
 * Add a snake to owned collection
 */
export function addSnake(snake) {
  if (!snake || !snake.id) {
    console.error('❌ Invalid snake object');
    return false;
  }
  
  // Check if already owned
  const exists = window.APP_STATE.ownedSnakes.find(s => s.id === snake.id);
  if (exists) {
    console.warn('⚠️ Snake already owned:', snake.id);
    return false;
  }
  
  window.APP_STATE.ownedSnakes.push(snake);
  
  // Unlock morphs from this snake
  if (snake.morphs && Array.isArray(snake.morphs)) {
    snake.morphs.forEach(morph => unlockMorph(morph));
  }
  
  saveState();
  console.log('🐍 Snake added:', snake.name);
  return true;
}

/**
 * Unlock a morph (lowercase ID)
 */
export function unlockMorph(morphId) {
  const id = morphId.toLowerCase();
  
  if (!window.APP_STATE.unlockedMorphs.includes(id)) {
    window.APP_STATE.unlockedMorphs.push(id);
    console.log('🔓 Morph unlocked:', id);
    saveState();
    return true;
  }
  
  return false;
}

/**
 * Check if morph is unlocked
 */
export function isMorphUnlocked(morphId) {
  return window.APP_STATE.unlockedMorphs.includes(morphId.toLowerCase());
}

/**
 * Update demo progress
 */
export function markProgress(step) {
  if (window.APP_STATE.demoProgress.hasOwnProperty(step)) {
    window.APP_STATE.demoProgress[step] = true;
    saveState();
    console.log('✅ Progress marked:', step);
    return true;
  }
  
  console.error('❌ Invalid progress step:', step);
  return false;
}

/**
 * Get all owned snakes
 */
export function getOwnedSnakes() {
  return window.APP_STATE.ownedSnakes || [];
}

/**
 * Get unlocked morphs
 */
export function getUnlockedMorphs() {
  return window.APP_STATE.unlockedMorphs || [];
}

/**
 * Get demo progress
 */
export function getDemoProgress() {
  return window.APP_STATE.demoProgress || {};
}

/**
 * Reset state (for testing)
 */
export function resetState() {
  window.APP_STATE = {
    version: VERSION,
    ownedSnakes: [],
    unlockedMorphs: [],
    demoProgress: {
      checkout: false,
      farm: false,
      dex: false,
      calculator: false
    },
    settings: {
      soundEnabled: true,
      theme: 'light'
    }
  };
  saveState();
  console.log('🔄 State reset');
}

/**
 * Create demo snake for testing
 */
export function createDemoSnake() {
  const demoSnake = {
    id: "demo_snake_001",
    name: "Demo Banana Spider",
    morphs: ["banana", "spider"],
    rarity: "demo",
    price: 0,
    dateAcquired: new Date().toISOString(),
    image: "🐍"
  };
  
  const added = addSnake(demoSnake);
  if (added) {
    markProgress('checkout');
    console.log('🎬 Demo snake created!');
  }
  
  return demoSnake;
}

// Auto-load state on module import
loadState();

// Export global object for direct access
export default window.APP_STATE;
