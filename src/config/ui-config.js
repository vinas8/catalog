/**
 * UI Configuration
 * Snake Muffin v0.7.7
 * 
 * Central config for all UI-related values:
 * - Visual constants (emojis, icons)
 * - Animation durations
 * - Notification timeouts
 * - Request timeouts
 */

export const UI_CONFIG = {
  // === Enclosure Tier Visuals ===
  TIER_EMOJIS: {
    1: '🪵',
    2: '🪵🌿',
    3: '🪵🌿💡',
    4: '🪵🌿💡🌡️',
    5: '🪵🌿💡🌡️💦'
  },
  
  // === Notification Durations (milliseconds) ===
  NOTIFICATION_DURATION: 3000,      // Standard notification (3 seconds)
  DEBUG_MESSAGE_DURATION: 8000,     // Debug messages (8 seconds)
  ERROR_MESSAGE_DURATION: 5000,     // Error messages (5 seconds)
  SUCCESS_MESSAGE_DURATION: 2000,   // Quick success (2 seconds)
  
  // === Animation Durations (milliseconds) ===
  FADE_OUT: 300,                    // Standard fade out
  FADE_IN: 300,                     // Standard fade in
  SLIDE_IN: 200,                    // Slide animations
  SLIDE_OUT: 200,
  MODAL_TRANSITION: 400,            // Modal open/close
  
  // === Request Timeouts (milliseconds) ===
  FETCH_TIMEOUT: 5000,              // API fetch timeout (5 seconds)
  API_TIMEOUT: 10000,               // Extended API timeout (10 seconds)
  NETWORK_TIMEOUT: 5000,            // Network requests
  
  // === Auto-Save ===
  AUTO_SAVE_INTERVAL: 30000,        // Save game every 30 seconds
  
  // === URL Check Interval ===
  URL_CHECK_INTERVAL: 1000,         // Check URL changes every 1 second
  
  // === Stat Bar Colors ===
  STAT_COLORS: {
    high: '#28a745',      // Green (>70%)
    medium: '#d29922',    // Yellow (40-70%)
    low: '#da3633',       // Red (<40%)
    critical: '#8b0000'   // Dark red (<20%)
  },
  
  // === Status Emojis ===
  STATUS_EMOJIS: {
    healthy: '💚',
    warning: '⚠️',
    critical: '🚨',
    dead: '💀',
    happy: '😊',
    sad: '😢',
    hungry: '🍖',
    thirsty: '💧'
  },
  
  // === Loading States ===
  LOADING_TEXT: 'Loading...',
  LOADING_DOTS_INTERVAL: 500,       // Animate loading dots every 500ms
  
  // === Pagination ===
  ITEMS_PER_PAGE: 12,               // Products per page in catalog
  SNAKES_PER_SHELF: 5,              // Snakes per shelf in game
  
  // === Helpers ===
  /**
   * Get tier emoji by tier number
   * @param {number} tier - Tier number (1-5)
   * @returns {string} Emoji string
   */
  getTierEmoji(tier) {
    return this.TIER_EMOJIS[tier] || this.TIER_EMOJIS[1];
  },
  
  /**
   * Get stat color by value
   * @param {number} value - Stat value (0-100)
   * @returns {string} Color hex code
   */
  getStatColor(value) {
    if (value < 20) return this.STAT_COLORS.critical;
    if (value < 40) return this.STAT_COLORS.low;
    if (value < 70) return this.STAT_COLORS.medium;
    return this.STAT_COLORS.high;
  },
  
  /**
   * Get status emoji by health value
   * @param {number} health - Health value (0-100)
   * @returns {string} Status emoji
   */
  getHealthEmoji(health) {
    if (health === 0) return this.STATUS_EMOJIS.dead;
    if (health < 20) return this.STATUS_EMOJIS.critical;
    if (health < 50) return this.STATUS_EMOJIS.warning;
    return this.STATUS_EMOJIS.healthy;
  }
};

// Export individual values for backward compatibility
export const TIER_EMOJIS = UI_CONFIG.TIER_EMOJIS;
export const NOTIFICATION_DURATION = UI_CONFIG.NOTIFICATION_DURATION;
export const FADE_OUT = UI_CONFIG.FADE_OUT;
export const FETCH_TIMEOUT = UI_CONFIG.FETCH_TIMEOUT;
