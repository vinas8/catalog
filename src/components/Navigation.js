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
    
    this.render();
    this.attachEventListeners();
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
    topNav.innerHTML = `
      <div class="nav-container">
        <div class="nav-left">
          <a href="index.html" class="nav-logo">
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
    
    // Add padding to body for fixed navs
    document.body.style.paddingTop = '70px';
    document.body.style.paddingBottom = '70px';
    
    // Highlight active page
    this.highlightActivePage();
    this.addResponsiveStyles();
  }

  renderPrimaryLinks(context = 'desktop') {
    if (!this.config?.NAVIGATION?.primary) return '';
    
    if (context === 'mobile') {
      return this.config.NAVIGATION.primary
        .map(link => `
          <a href="${link.href}" class="bottom-nav-item" data-page="${link.label.toLowerCase()}">
            <span class="nav-icon">${link.icon}</span>
            <span class="nav-label">${link.label}</span>
          </a>
        `).join('');
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
    if (this.currentUser) {
      return `
        <div class="profile-dropdown">
          <button class="profile-button" id="profileButton">
            <span>${this.currentUser.name}</span>
            <span class="dropdown-arrow">▼</span>
          </button>
          <div class="profile-menu" id="profileMenu" style="display: none;">
            <a href="#profile">Profile</a>
            <a href="#purchases">Purchases</a>
            <a href="#settings">Settings</a>
            <hr>
            <a href="#logout" id="logoutButton">Logout</a>
          </div>
        </div>
      `;
    } else {
      return `
        <div class="auth-buttons">
          <a href="register.html" class="btn-login">Login</a>
          <a href="register.html" class="btn-register">Register</a>
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
      /* Desktop Top Nav */
      .top-nav {
        background: var(--bg);
        border-bottom: 3px solid var(--pastel-yellow);
        box-shadow: 0 2px 4px var(--shadow);
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 1000;
      }
      
      .desktop-nav-links {
        display: flex;
        gap: 0.5rem;
        align-items: center;
      }
      
      /* Mobile Bottom Nav - iOS/Android style */
      .bottom-nav {
        display: none;
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        background: var(--bg);
        border-top: 2px solid var(--pastel-yellow);
        box-shadow: 0 -2px 8px var(--shadow);
        z-index: 1000;
        padding-bottom: env(safe-area-inset-bottom); /* iOS notch support */
      }
      
      .bottom-nav-container {
        display: flex;
        justify-content: space-around;
        align-items: center;
        max-width: 600px;
        margin: 0 auto;
        padding: 0.5rem 0;
      }
      
      .bottom-nav-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 0.25rem;
        padding: 0.5rem 0.75rem;
        text-decoration: none;
        color: var(--muted);
        border-radius: 12px;
        transition: all 0.2s;
        min-width: 60px;
        text-align: center;
      }
      
      .bottom-nav-item .nav-icon {
        font-size: 1.5rem;
        transition: transform 0.2s;
      }
      
      .bottom-nav-item .nav-label {
        font-size: 0.7rem;
        font-weight: 600;
        letter-spacing: 0.3px;
      }
      
      .bottom-nav-item:active {
        transform: scale(0.95);
      }
      
      .bottom-nav-item.active {
        color: var(--purple);
      }
      
      .bottom-nav-item.active .nav-icon {
        transform: scale(1.1);
      }
      
      .bottom-nav-item.debug-item {
        color: #ff6b6b;
        border: 1px solid #ff6b6b;
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
