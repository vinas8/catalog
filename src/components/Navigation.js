/**
 * Navigation Component - Unified responsive navigation for all pages
 * Provides: Main nav links + Profile dropdown + Debug mode support
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
      this.config = { DEBUG: false, NAVIGATION: { mainLinks: [], secondaryLinks: [] } };
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
    const nav = document.createElement('nav');
    nav.className = 'unified-nav';
    nav.innerHTML = `
      <div class="nav-container">
        <div class="nav-left">
          <a href="index.html" class="nav-logo">
            🐍 <span>Serpent Town</span>
          </a>
          <button class="mobile-menu-toggle" id="mobileMenuToggle">☰</button>
          <div class="nav-links" id="navLinks">
            ${this.renderMainLinks()}
            ${this.renderSecondaryLinks()}
            ${this.config?.DEBUG ? this.renderDebugLink() : ''}
          </div>
        </div>
        <div class="nav-right">
          ${this.renderAuthSection()}
        </div>
      </div>
    `;

    // Insert at top of body
    document.body.insertBefore(nav, document.body.firstChild);
    
    // Highlight active page
    this.highlightActivePage();
    this.addResponsiveStyles();
  }

  renderMainLinks() {
    if (!this.config?.NAVIGATION?.mainLinks) return '';
    return this.config.NAVIGATION.mainLinks
      .map(link => `<a href="${link.href}" class="nav-link" data-page="${link.label.toLowerCase()}">${link.icon} ${link.label}</a>`)
      .join('');
  }

  renderSecondaryLinks() {
    if (!this.config?.NAVIGATION?.secondaryLinks) return '';
    return this.config.NAVIGATION.secondaryLinks
      .map(link => `<a href="${link.href}" class="nav-link secondary" data-page="${link.label.toLowerCase()}">${link.icon} ${link.label}</a>`)
      .join('');
  }

  renderDebugLink() {
    if (!this.config?.NAVIGATION?.debugLink) return '';
    const link = this.config.NAVIGATION.debugLink;
    return `<a href="${link.href}" class="nav-link debug-link" style="color: #ff6b6b;">${link.icon} ${link.label}</a>`;
  }

  addResponsiveStyles() {
    // Inject responsive styles if not already present
    if (document.getElementById('nav-responsive-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'nav-responsive-styles';
    style.textContent = `
      .unified-nav { background: #2d3748; border-bottom: 2px solid #4a5568; padding: 0.75rem 1rem; }
      .nav-container { display: flex; justify-content: space-between; align-items: center; max-width: 1400px; margin: 0 auto; }
      .nav-left { display: flex; align-items: center; gap: 2rem; flex: 1; }
      .nav-logo { color: #fff; text-decoration: none; font-weight: bold; font-size: 1.25rem; display: flex; align-items: center; gap: 0.5rem; }
      .nav-logo:hover { color: #667eea; }
      .nav-links { display: flex; gap: 1rem; align-items: center; flex-wrap: wrap; }
      .nav-link { color: #cbd5e0; text-decoration: none; padding: 0.5rem 1rem; border-radius: 6px; transition: all 0.2s; white-space: nowrap; }
      .nav-link:hover { background: rgba(255,255,255,0.1); color: #fff; }
      .nav-link.active { background: #667eea; color: #fff; }
      .nav-link.secondary { font-size: 0.9rem; opacity: 0.8; }
      .nav-link.debug-link { border: 1px solid #ff6b6b; }
      .mobile-menu-toggle { display: none; background: none; border: none; color: #fff; font-size: 1.5rem; cursor: pointer; }
      .nav-right { display: flex; gap: 1rem; align-items: center; }
      .auth-buttons { display: flex; gap: 0.5rem; }
      .btn-register, .btn-login { padding: 0.5rem 1rem; border-radius: 6px; text-decoration: none; transition: all 0.2s; }
      .btn-register { background: #667eea; color: #fff; }
      .btn-register:hover { background: #5568d3; }
      .btn-login { border: 1px solid #667eea; color: #667eea; }
      .btn-login:hover { background: rgba(102,126,234,0.1); }
      
      @media (max-width: 768px) {
        .mobile-menu-toggle { display: block; }
        .nav-links { display: none; flex-direction: column; position: absolute; top: 60px; left: 0; right: 0; background: #2d3748; padding: 1rem; border-top: 1px solid #4a5568; z-index: 1000; }
        .nav-links.active { display: flex; }
        .nav-link { width: 100%; text-align: left; }
      }
    `;
    document.head.appendChild(style);
  }

  renderAuthSection() {
    if (this.currentUser) {
      return `
        <div class="profile-dropdown">
          <button class="profile-button" id="profileButton">
            <img src="${this.currentUser.profile_picture || 'img/default-avatar.png'}" 
                 alt="Profile" 
                 class="profile-pic">
            <span>${this.currentUser.name}</span>
            <span class="dropdown-arrow">▼</span>
          </button>
          <div class="profile-menu" id="profileMenu" style="display: none;">
            <a href="#profile">Edit Profile</a>
            <a href="#purchases">My Purchases</a>
            <a href="#settings">Settings</a>
            <hr>
            <a href="#logout" id="logoutButton">Logout</a>
          </div>
        </div>
      `;
    } else {
      return `
        <div class="auth-buttons">
          <a href="register.html" class="btn-register">Register</a>
          <a href="register.html#login" class="btn-login">Login</a>
        </div>
      `;
    }
  }

  highlightActivePage() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const links = document.querySelectorAll('.nav-links a');
    
    links.forEach(link => {
      const href = link.getAttribute('href');
      if (href === currentPage || 
          (currentPage === '' && href === 'index.html')) {
        link.classList.add('active');
      }
    });
  }

  attachEventListeners() {
    // Mobile menu toggle
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const navLinks = document.getElementById('navLinks');
    
    if (mobileMenuToggle) {
      mobileMenuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
      });
    }
    
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
}

// Auto-initialize on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new Navigation());
} else {
  new Navigation();
}

export default Navigation;
