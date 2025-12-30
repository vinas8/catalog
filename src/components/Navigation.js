/**
 * Navigation Component - iOS/Android style bottom nav + desktop top nav
 * Mobile: Fixed bottom navigation (4 items max)
 * Desktop: Traditional top navigation
 * @module components/Navigation
 */

export class Navigation {
  constructor() {
    this.config = null;
    this.currentUser = this.getCurrentUser();
    this.init();
  }

  async init() {
    // Load config dynamically
    try {
      const module = await import('../config/app-config.js');
      this.config = module.APP_CONFIG;
    } catch (e) {
      console.warn('Failed to load app-config, using defaults');
      this.config = { DEBUG: false, NAVIGATION: { primary: [] } };
    }
    
    // Convert all relative paths to absolute paths from root
    this.makePathsAbsolute();
    
    this.render();
    this.attachEventListeners();
  }

  makePathsAbsolute() {
    // Simple approach: detect if on GitHub Pages or localhost
    const pathname = window.location.pathname;
    const isGitHubPages = pathname.includes('/catalog/');
    const rootPath = isGitHubPages ? '/catalog' : '';
    
    console.log('Navigation - pathname:', pathname, 'rootPath:', rootPath || '(root)');
    
    // Convert all navigation links to absolute
    if (this.config?.NAVIGATION?.primary) {
      this.config.NAVIGATION.primary = this.config.NAVIGATION.primary.map(link => ({
        ...link,
        href: this.makeAbsolute(link.href, rootPath)
      }));
    }
    
    if (this.config?.NAVIGATION?.secondary) {
      this.config.NAVIGATION.secondary = this.config.NAVIGATION.secondary.map(link => ({
        ...link,
        href: this.makeAbsolute(link.href, rootPath)
      }));
    }
    
    if (this.config?.NAVIGATION?.debugLink) {
      // Debug link needs special handling - it's a directory
      const debugHref = this.config.NAVIGATION.debugLink.href;
      // Remove trailing slash if present
      const cleanDebug = debugHref.replace(/\/$/, '');
      
      this.config.NAVIGATION.debugLink = {
        ...this.config.NAVIGATION.debugLink,
        href: this.makeAbsolute(cleanDebug + '/index.html', rootPath)
      };
    }
    
    this.rootPath = rootPath;
  }

  makeAbsolute(href, rootPath) {
    // Skip anchors and already absolute URLs
    if (href.startsWith('#') || href.startsWith('http') || href.startsWith('/')) {
      return href;
    }
    // Make absolute from root
    if (rootPath) {
      return rootPath + '/' + href;
    }
    return '/' + href;
  }

  getCurrentUser() {
    // Check for user hash in URL or localStorage
    const hash = window.location.hash.substring(1) || localStorage.getItem('userHash');
    if (!hash) return null;

    // Try to get user info from localStorage cache
    const userStr = localStorage.getItem(`user:${hash}`);
    return userStr ? JSON.parse(userStr) : { hash, name: 'User' };
  }

  render() {
    // Desktop top nav
    const topNav = document.createElement('nav');
    topNav.className = 'top-nav';
    const logoHref = this.makeAbsolute('index.html', this.rootPath);
    topNav.innerHTML = `
      <div class="nav-container">
        <div class="nav-left">
          <a href="${logoHref}" class="nav-logo">
            🐍 <span>Serpent Town</span>
          </a>
          <div class="desktop-nav-links">
            ${this.renderPrimaryLinks('desktop')}
            ${this.config?.DEBUG ? this.renderDebugLink() : ''}
          </div>
        </div>
        <div class="nav-right">
          ${this.renderAuthSection()}
        </div>
      </div>
    `;

    // Mobile bottom nav
    const bottomNav = document.createElement('nav');
    bottomNav.className = 'bottom-nav';
    bottomNav.innerHTML = `
      <div class="bottom-nav-container">
        ${this.renderPrimaryLinks('mobile')}
        ${this.config?.DEBUG ? `
          <a href="${this.config.NAVIGATION.debugLink.href}" class="bottom-nav-item debug-item">
            <span class="nav-icon">${this.config.NAVIGATION.debugLink.icon}</span>
            <span class="nav-label">Debug</span>
          </a>
        ` : ''}
      </div>
    `;

    // Insert navs
    document.body.insertBefore(topNav, document.body.firstChild);
    document.body.appendChild(bottomNav);
    
    // Add padding to body for fixed navs (only if not already set)
    if (!document.body.style.paddingTop) {
      document.body.style.paddingTop = '70px';
    }
    if (!document.body.style.paddingBottom) {
      document.body.style.paddingBottom = '70px';
    }
    
    // Highlight active page
    this.highlightActivePage();
    this.addResponsiveStyles();
  }

  renderPrimaryLinks(context = 'desktop') {
    if (!this.config?.NAVIGATION?.primary) return '';
    
    if (context === 'mobile') {
      return this.config.NAVIGATION.primary
        .map(link => {
          const icon = link.iconSmall || link.icon;
          return `
            <a href="${link.href}" class="bottom-nav-item" data-page="${link.label.toLowerCase()}" title="${link.description}">
              <span class="nav-icon">${icon}</span>
              <span class="nav-label">${link.label}</span>
            </a>
          `;
        }).join('');
    }
    
    return this.config.NAVIGATION.primary
      .map(link => `
        <a href="${link.href}" class="nav-link" data-page="${link.label.toLowerCase()}" title="${link.description}">
          ${link.icon} <span>${link.label}</span>
        </a>
      `).join('');
  }

  renderDebugLink() {
    if (!this.config?.NAVIGATION?.debugLink) return '';
    const link = this.config.NAVIGATION.debugLink;
    return `<a href="${link.href}" class="nav-link debug-link">${link.icon} <span>${link.label}</span></a>`;
  }

  renderAuthSection() {
    // Auth links are already absolute
    if (this.currentUser) {
      const farmHref = this.makeAbsolute('game.html', this.rootPath);
      const collectionHref = this.makeAbsolute('collection.html', this.rootPath);
      
      return `
        <div class="profile-dropdown">
          <button class="profile-button" id="profileButton">
            <span>${this.currentUser.name}</span>
            <span class="dropdown-arrow">▼</span>
          </button>
          <div class="profile-menu" id="profileMenu" style="display: none;">
            <a href="${farmHref}">🏡 My Farm</a>
            <a href="${collectionHref}">📦 Collection</a>
            <a href="#settings">⚙️ Settings</a>
            <hr>
            <a href="#logout" id="logoutButton">🚪 Logout</a>
          </div>
        </div>
      `;
    } else {
      const registerHref = this.makeAbsolute('register.html', this.rootPath);
      
      return `
        <div class="auth-buttons">
          <a href="${registerHref}#login" class="btn-login">Login</a>
          <a href="${registerHref}" class="btn-register">Register</a>
        </div>
      `;
    }
  }

  highlightActivePage() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const links = document.querySelectorAll('.nav-link, .bottom-nav-item');
    
    links.forEach(link => {
      const href = link.getAttribute('href');
      if (href === currentPage || 
          (currentPage === '' && href === 'index.html')) {
        link.classList.add('active');
      }
    });
  }

  attachEventListeners() {
    // Profile dropdown
    const profileButton = document.getElementById('profileButton');
    const profileMenu = document.getElementById('profileMenu');
    const logoutButton = document.getElementById('logoutButton');

    if (profileButton) {
      profileButton.addEventListener('click', (e) => {
        e.stopPropagation();
        const isVisible = profileMenu.style.display === 'block';
        profileMenu.style.display = isVisible ? 'none' : 'block';
      });

      // Close dropdown when clicking outside
      document.addEventListener('click', () => {
        if (profileMenu) {
          profileMenu.style.display = 'none';
        }
      });
    }

    if (logoutButton) {
      logoutButton.addEventListener('click', (e) => {
        e.preventDefault();
        this.logout();
      });
    }
  }

  logout() {
    localStorage.removeItem('userHash');
    localStorage.removeItem(`user:${this.currentUser.hash}`);
    window.location.href = 'index.html';
  }

  // Update user info (call after login/registration)
  static updateUser(userData) {
    localStorage.setItem('userHash', userData.hash);
    localStorage.setItem(`user:${userData.hash}`, JSON.stringify(userData));
    window.location.reload();
  }

  addResponsiveStyles() {
    if (document.getElementById('nav-responsive-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'nav-responsive-styles';
    style.textContent = `
      /* Desktop Top Nav - Clean iOS/Android Style */
      .top-nav {
        background: rgba(255, 255, 255, 0.92);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        border-bottom: 0.5px solid rgba(0, 0, 0, 0.1);
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 1000;
        padding: 0.5rem 1rem;
      }
      
      .nav-container {
        max-width: 1400px;
        margin: 0 auto;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
      }
      
      .nav-left {
        display: flex;
        align-items: center;
        gap: 1.5rem;
        flex: 1;
      }
      
      .nav-logo {
        text-decoration: none;
        font-weight: 600;
        font-size: 1.1rem;
        color: var(--color-text);
        display: flex;
        align-items: center;
        gap: 0.5rem;
        transition: opacity 0.2s;
      }
      
      .nav-logo:hover {
        opacity: 0.7;
      }
      
      .desktop-nav-links {
        display: flex;
        gap: 0.25rem;
        align-items: center;
      }
      
      .nav-link {
        text-decoration: none;
        color: var(--color-text);
        font-size: 0.9rem;
        font-weight: 500;
        padding: 0.5rem 1rem;
        border-radius: 8px;
        transition: background 0.15s;
        display: flex;
        align-items: center;
        gap: 0.4rem;
        -webkit-tap-highlight-color: transparent;
      }
      
      .nav-link:hover {
        background: rgba(0, 0, 0, 0.05);
      }
      
      .nav-link.active {
        background: var(--color-primary-lighter);
        font-weight: 600;
      }
      
      .nav-link.debug-link {
        color: #ff3b30;
        border: 1px solid rgba(255, 59, 48, 0.3);
      }
      
      .nav-right {
        display: flex;
        align-items: center;
        gap: 0.75rem;
      }
      
      .auth-buttons {
        display: flex;
        gap: 0.5rem;
      }
      
      .btn-login, .btn-register {
        text-decoration: none;
        font-size: 0.9rem;
        font-weight: 600;
        padding: 0.5rem 1rem;
        border-radius: 8px;
        transition: all 0.15s;
        -webkit-tap-highlight-color: transparent;
      }
      
      .btn-login {
        color: var(--color-text);
        background: transparent;
      }
      
      .btn-login:hover {
        background: rgba(0, 0, 0, 0.05);
      }
      
      .btn-register {
        background: var(--color-accent);
        color: white;
      }
      
      .btn-register:hover {
        background: var(--color-accent-dark);
      }
      
      /* Profile Dropdown */
      .profile-dropdown {
        position: relative;
      }
      
      .profile-button {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem 1rem;
        background: rgba(0, 0, 0, 0.05);
        border: none;
        border-radius: 20px;
        font-size: 0.9rem;
        font-weight: 500;
        cursor: pointer;
        transition: background 0.15s;
      }
      
      .profile-button:hover {
        background: rgba(0, 0, 0, 0.08);
      }
      
      .profile-menu {
        position: absolute;
        top: calc(100% + 0.5rem);
        right: 0;
        background: white;
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        min-width: 200px;
        overflow: hidden;
      }
      
      .profile-menu a {
        display: block;
        padding: 0.75rem 1rem;
        color: var(--color-text);
        text-decoration: none;
        font-size: 0.9rem;
        transition: background 0.15s;
      }
      
      .profile-menu a:hover {
        background: rgba(0, 0, 0, 0.05);
      }
      
      .profile-menu hr {
        border: none;
        border-top: 1px solid rgba(0, 0, 0, 0.1);
        margin: 0.25rem 0;
      }
      
      /* Mobile Bottom Nav - iOS/Android style */
      .bottom-nav {
        display: none;
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(255, 255, 255, 0.92); /* iOS translucent */
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        border-top: 0.5px solid rgba(0, 0, 0, 0.1);
        box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
        z-index: 1000;
        padding-bottom: env(safe-area-inset-bottom); /* iOS notch support */
      }
      
      .bottom-nav-container {
        display: flex;
        justify-content: space-around;
        align-items: flex-start;
        max-width: 600px;
        margin: 0 auto;
        padding: 0.4rem 0.5rem calc(0.2rem + env(safe-area-inset-bottom)) 0.5rem;
      }
      
      .bottom-nav-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 0.25rem;
        padding: 0.4rem 0.5rem;
        text-decoration: none;
        color: #8e8e93; /* iOS gray */
        border-radius: 8px;
        transition: all 0.15s ease-out;
        flex: 1;
        max-width: 75px;
        text-align: center;
        -webkit-tap-highlight-color: transparent;
      }
      
      .bottom-nav-item .nav-icon {
        font-size: 1.4rem;
        line-height: 1;
        transition: transform 0.15s ease-out;
      }
      
      .bottom-nav-item .nav-label {
        font-size: 0.65rem;
        font-weight: 500;
        letter-spacing: -0.2px;
        line-height: 1.2;
      }
      
      .bottom-nav-item:active {
        transform: scale(0.92);
      }
      
      .bottom-nav-item.active {
        color: var(--purple);
      }
      
      .bottom-nav-item.active .nav-icon {
        transform: translateY(-2px);
      }
      
      .bottom-nav-item.debug-item {
        color: #ff3b30; /* iOS red */
        flex: 0.7;
      }
      
      /* Responsive breakpoint */
      @media (max-width: 768px) {
        /* Hide desktop nav links */
        .desktop-nav-links {
          display: none !important;
        }
        
        /* Show bottom nav */
        .bottom-nav {
          display: block;
        }
        
        /* Adjust top nav for mobile */
        .nav-left {
          flex: 1;
        }
        
        .nav-right .auth-buttons {
          gap: 0.25rem;
        }
        
        .btn-register, .btn-login {
          padding: 0.5rem 0.75rem;
          font-size: 0.85rem;
        }
      }
      
      @media (max-width: 480px) {
        .nav-logo span {
          display: none; /* Hide "Serpent Town" text on small screens */
        }
        
        .btn-register, .btn-login {
          padding: 0.4rem 0.6rem;
          font-size: 0.8rem;
        }
      }
    `;
    document.head.appendChild(style);
  }
}

// Auto-initialize on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new Navigation());
} else {
  new Navigation();
}

export default Navigation;
