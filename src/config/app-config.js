/**
 * Application Configuration
 * Central config for app name, branding, and global settings
 */

export const APP_CONFIG = {
  // Application Identity
  NAME: 'SnakeMuffin',
  DISPLAY_NAME: 'SnakeMuffin',
  TAGLINE: 'Snake Care & Breeding Game',
  
  // Version
  VERSION: '0.5.0',
  
  // URLs
  GITHUB_REPO: 'https://github.com/vinas8/catalog',
  HOMEPAGE: 'https://vinas8.github.io/catalog/',
  
  // Branding
  EMOJI: '🐍',
  COLORS: {
    primary: '#667eea',
    secondary: '#764ba2',
    success: '#28a745',
    error: '#da3633',
    warning: '#d29922'
  },
  
  // Features
  FEATURES: {
    catalog: true,
    game: true,
    breeding: false, // Coming soon
    multiplayer: false // Coming soon
  }
};

// Legacy support (for backward compatibility)
export const GAME_NAME = APP_CONFIG.NAME;
export const GAME_DISPLAY_NAME = APP_CONFIG.DISPLAY_NAME;
