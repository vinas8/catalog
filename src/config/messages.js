/**
 * 🗣️ UI Messages Configuration
 * Central location for all user-facing messages
 * Supports debug mode to hide/show messages
 */

export const DEBUG_MODE = localStorage.getItem('serpent_debug_mode') === 'true';

export const MESSAGES = {
  // Purchase & Payment
  PURCHASE: {
    SUCCESS: '✅ Purchase successful! Your snake is ready.',
    PENDING: '⏳ Processing your purchase...',
    ERROR: '❌ Purchase failed. Please contact support.',
    ALREADY_OWNED: '🐍 You already own this snake!',
    NOT_AVAILABLE: '⚠️ This snake is no longer available.',
    WEBHOOK_TIMEOUT: '⏱️ Payment processing is taking longer than expected. Check back in a minute.',
  },

  // Authentication
  AUTH: {
    HASH_GENERATED: '🔐 User ID created successfully.',
    HASH_INVALID: '❌ Invalid user ID. Please try again.',
    REGISTRATION_SUCCESS: '✅ Registration complete! Welcome to Serpent Town.',
    REGISTRATION_FAILED: '❌ Registration failed. Please try again.',
    USERNAME_TAKEN: '⚠️ Username already taken. Please choose another.',
    USERNAME_INVALID: '❌ Username must be 3-20 characters, letters and numbers only.',
  },

  // Game Actions
  GAME: {
    FEED_SUCCESS: '🍖 Fed successfully! Hunger decreased.',
    FEED_NOT_HUNGRY: '🤔 Your snake is not hungry right now.',
    WATER_SUCCESS: '💧 Watered successfully! Thirst decreased.',
    WATER_NOT_THIRSTY: '🤔 Your snake is not thirsty right now.',
    CLEAN_SUCCESS: '🧹 Cleaned successfully! Enclosure is spotless.',
    CLEAN_NOT_DIRTY: '✨ Enclosure is already clean.',
    HEALTH_CRITICAL: '🚨 CRITICAL! Your snake needs immediate care!',
    HEALTH_LOW: '⚠️ Warning: Snake health is low.',
    SAVE_SUCCESS: '💾 Game saved successfully.',
    SAVE_ERROR: '❌ Failed to save game. Try again.',
    LOAD_SUCCESS: '📂 Game loaded successfully.',
    LOAD_ERROR: '❌ Failed to load game data.',
  },

  // Equipment Shop
  SHOP: {
    BUY_SUCCESS: '✅ Equipment purchased successfully!',
    BUY_NO_GOLD: '💰 Not enough gold. Keep caring for your snakes!',
    BUY_ERROR: '❌ Purchase failed. Please try again.',
    INSTALL_SUCCESS: '🔧 Equipment installed successfully!',
    ALREADY_OWNED: '⚠️ You already own this item.',
    REQUIRES_TIER: '🏆 Requires higher loyalty tier to unlock.',
  },

  // Network & API
  NETWORK: {
    LOADING: '⏳ Loading...',
    ERROR: '❌ Network error. Please check your connection.',
    TIMEOUT: '⏱️ Request timed out. Please try again.',
    API_ERROR: '❌ Server error. Please try again later.',
    KV_ERROR: '❌ Database error. Contact support.',
    WORKER_OFFLINE: '🔌 Backend is offline. Using cached data.',
  },

  // Validation
  VALIDATION: {
    REQUIRED_FIELD: '⚠️ This field is required.',
    INVALID_EMAIL: '❌ Please enter a valid email address.',
    INVALID_NUMBER: '❌ Please enter a valid number.',
    OUT_OF_RANGE: '❌ Value must be between {min} and {max}.',
  },

  // Debug Messages (only shown in debug mode)
  DEBUG: {
    KV_WRITE: '📝 KV Write: {key} = {value}',
    KV_READ: '📖 KV Read: {key}',
    WEBHOOK_RECEIVED: '🔔 Webhook received: {event}',
    SIGNATURE_VALID: '✅ Webhook signature valid',
    SIGNATURE_INVALID: '❌ Webhook signature invalid',
    STATE_UPDATED: '🔄 State updated: {module}',
    API_CALL: '🌐 API Call: {method} {url}',
  },

  // Stripe Integration
  STRIPE: {
    REDIRECT_TO_CHECKOUT: '🛒 Redirecting to checkout...',
    CHECKOUT_CANCELLED: '⚠️ Checkout cancelled. Your cart is still here.',
    PAYMENT_SUCCESS: '✅ Payment successful!',
    PAYMENT_FAILED: '❌ Payment failed. Please try again.',
    WEBHOOK_PROCESSED: '✅ Purchase confirmed by payment processor.',
  },

  // General UI
  UI: {
    WELCOME: '👋 Welcome to Serpent Town!',
    GOODBYE: '👋 Thanks for playing! See you soon.',
    CONFIRM_ACTION: '❓ Are you sure you want to do this?',
    COPIED_TO_CLIPBOARD: '📋 Copied to clipboard!',
    FEATURE_COMING_SOON: '🚧 This feature is coming soon!',
    MAINTENANCE: '🔧 System maintenance in progress...',
  },
};

/**
 * Get a message by path (e.g., 'PURCHASE.SUCCESS')
 * @param {string} path - Dot-notation path to message
 * @param {object} vars - Variables to interpolate {key: value}
 * @returns {string} The message
 */
export function getMessage(path, vars = {}) {
  const parts = path.split('.');
  let message = MESSAGES;
  
  for (const part of parts) {
    message = message[part];
    if (!message) {
      console.warn(`Message not found: ${path}`);
      return path;
    }
  }

  // Interpolate variables
  if (typeof message === 'string' && Object.keys(vars).length > 0) {
    return message.replace(/\{(\w+)\}/g, (match, key) => vars[key] || match);
  }

  return message;
}

/**
 * Log a debug message (only if debug mode is enabled)
 * @param {string} path - Message path
 * @param {object} vars - Variables
 */
export function logDebug(path, vars = {}) {
  if (DEBUG_MODE) {
    console.log(getMessage(`DEBUG.${path}`, vars));
  }
}

/**
 * Show a user notification (can be hidden in debug mode)
 * @param {string} path - Message path
 * @param {object} vars - Variables
 * @param {string} type - Notification type (info, success, warning, error)
 */
export function showMessage(path, vars = {}, type = 'info') {
  const message = getMessage(path, vars);
  
  // In debug mode, only log to console instead of showing UI notifications
  if (DEBUG_MODE) {
    console.log(`[${type.toUpperCase()}] ${message}`);
    return;
  }

  // Show notification in UI (implement your notification system here)
  if (window.showNotification) {
    window.showNotification(message, type);
  } else {
    console.log(`[${type.toUpperCase()}] ${message}`);
  }
}

/**
 * Toggle debug mode
 */
export function toggleDebugMode() {
  const current = localStorage.getItem('serpent_debug_mode') === 'true';
  localStorage.setItem('serpent_debug_mode', !current ? 'true' : 'false');
  window.location.reload();
}

// Export for use in browser console
if (typeof window !== 'undefined') {
  window.SerpentMessages = { getMessage, logDebug, showMessage, toggleDebugMode, MESSAGES };
}
