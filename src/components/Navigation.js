/**
 * Navigation Component - Unified navigation for all pages
 * Provides: Main nav links + Profile dropdown
 * @module components/Navigation
 */

export class Navigation {
  constructor() {
    this.currentUser = this.getCurrentUser();
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
          <div class="nav-links">
            <a href="index.html" data-page="home">Home</a>
            <a href="catalog.html" data-page="catalog">Catalog</a>
            <a href="collection.html" data-page="encyclopedia">Encyclopedia</a>
            <a href="game.html" data-page="mysnakes">MySnakes</a>
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
