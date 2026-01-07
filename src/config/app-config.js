/**
 * Application Configuration
 * Central config for app name, branding, and global settings
 */

// Environment detection
const isLocalhost = typeof window !== 'undefined' && 
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
const isGitHubPages = typeof window !== 'undefined' && 
  window.location.hostname.includes('github.io');

export const APP_CONFIG = {
  // Application Identity
  NAME: 'Snake Muffin',
  DISPLAY_NAME: 'Snake Muffin',
  TAGLINE: 'Snake Care & Breeding Game',
  
  // Version
  VERSION: '0.5.0',
  
  // Environment
  ENVIRONMENT: isLocalhost ? 'local' : 'production',
  IS_LOCAL: isLocalhost,
  IS_GITHUB_PAGES: isGitHubPages,
  
  // Debug mode - controls console logs and debug UI
  DEBUG: isLocalhost, // true in localhost, false in production
  
  // URLs - Dynamic based on environment
  BASE_URL: isLocalhost 
    ? (typeof window !== 'undefined' ? `http://localhost:${window.location.port || 8000}` : 'http://localhost:8000')
    : 'https://vinas8.github.io/catalog',
  
  GITHUB_REPO: 'https://github.com/vinas8/catalog',
  GITHUB_USERNAME: 'vinas8',
  GITHUB_PAGES: 'https://vinas8.github.io/catalog',
  
  // Helper to get page URL
  getPageUrl(page) {
    if (typeof window === 'undefined') return `/${page}.html`;
    const base = isLocalhost ? `http://localhost:${window.location.port || 8000}` : 'https://vinas8.github.io/catalog';
    return `${base}/${page}.html`;
  },
  
  // Helper to get current origin
  getOrigin() {
    return typeof window !== 'undefined' ? window.location.origin : '';
  },
  
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
  },
  
  // Navigation Configuration
  // UX Psychology: 4 items optimal for mobile bottom nav (Miller's Law: 5±2 chunks)
  // E-commerce + Breeding Game: Shop → Farm → Learn → Account
  NAVIGATION: {
    // Primary navigation (shows everywhere - optimized for mobile bottom nav)
    // Standard iOS/Android: Icon on top, label below, 4 items is optimal
    primary: [
      { label: 'Shop', href: 'shop/', icon: '🛒', iconSmall: '🛒', description: 'Buy snakes' },
      { label: 'Farm', href: 'game/', icon: '🏡', iconSmall: '🏡', description: 'My real snakes' },
      { label: 'Learn', href: 'tutorial/', icon: '📚', iconSmall: '📚', description: 'Tutorials & encyclopedia', 
        submenu: [
          { label: 'Tutorials', href: 'tutorial/', icon: '🎮', description: 'Practice with virtual snakes' },
          { label: 'Encyclopedia', href: 'tutorial/static.html', icon: '📖', description: 'Care guides & reference',
            submenu: [
              { label: 'Dex', href: 'dex/', icon: '📚', description: 'Snake species database' },
              { label: 'Care Guides', href: 'tutorial/static.html#care', icon: '🩺', description: 'How to care' },
              { label: 'Genetics', href: 'tutorial/static.html#genetics', icon: '🧬', description: 'Morph inheritance' }
            ]
          },
          { label: 'Morph Calculator', href: 'calc/', icon: '🎨', description: 'Breeding calculator' }
        ]
      },
      { label: 'Account', href: 'admin/account.html', icon: '👤', iconSmall: '👤', description: 'Profile' }
    ],
    // Secondary links (desktop only - top nav overflow)
    secondary: [
      { label: 'Home', href: 'index.html', icon: '🏠' }
    ],
    // Debug link only shows when DEBUG is true
    debugLink: { label: 'Debug', href: 'debug/', icon: '🔍', iconSmall: '🔍' }
  }
};

// Legacy support (for backward compatibility)
export const GAME_NAME = APP_CONFIG.NAME;
export const GAME_DISPLAY_NAME = APP_CONFIG.DISPLAY_NAME;
