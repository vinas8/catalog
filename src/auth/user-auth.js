// User Authentication & Session Management
// Simple localStorage-based for MVP (upgrade to real auth later)

export class UserAuth {
  
  /**
   * Get currently logged-in user
   */
  static getCurrentUser() {
    const userStr = localStorage.getItem('serpent_user');
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch (e) {
      return null;
    }
  }
  
  /**
   * Set current user session
   */
  static setCurrentUser(user) {
    localStorage.setItem('serpent_user', JSON.stringify(user));
    console.log('👤 User logged in:', user.email);
  }
  
  /**
   * Logout current user
   */
  static logout() {
    localStorage.removeItem('serpent_user');
    localStorage.removeItem('serpent_town_save'); // Clear game data
    window.location.href = '/';
  }
  
  /**
   * Login with email (simple version)
   */
  static async loginWithEmail(email) {
    try {
      // Load users file
      const response = await fetch('/data/users.json');
      let users = await response.json();
      
      // Find existing user
      let user = users.find(u => u.email === email);
      
      if (!user) {
        // Create new user
        user = {
          user_id: 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
          email: email,
          name: email.split('@')[0],
          created_at: new Date().toISOString(),
          loyalty_points: 0,
          loyalty_tier: 'bronze'
        };
        console.log('🆕 Created new user:', user);
        // In production: POST /api/users to save
      }
      
      this.setCurrentUser(user);
      return user;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }
  
  /**
   * Check if user is logged in
   */
  static isLoggedIn() {
    return this.getCurrentUser() !== null;
  }
  
  /**
   * Get user ID
   */
  static getUserId() {
    const user = this.getCurrentUser();
    return user ? user.user_id : null;
  }
  
  /**
   * Get user email
   */
  static getUserEmail() {
    const user = this.getCurrentUser();
    return user ? user.email : null;
  }
  
  /**
   * Show login modal
   */
  static showLoginModal() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'flex';
    modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h2>🔐 Login / Sign Up</h2>
          <button class="close-btn" onclick="this.closest('.modal').remove()">✕</button>
        </div>
        <div style="padding: 2rem;">
          <p style="margin-bottom: 1rem;">Enter your email to continue:</p>
          <input type="email" id="login-email" placeholder="your@email.com" 
                 style="width: 100%; padding: 0.75rem; border: 2px solid #ddd; border-radius: 6px; font-size: 1rem; margin-bottom: 1rem;">
          <button id="login-btn" class="primary-btn" style="width: 100%;">Continue</button>
          <p style="margin-top: 1rem; font-size: 0.9rem; color: #666;">
            We'll remember you for future visits. No password needed!
          </p>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    const emailInput = modal.querySelector('#login-email');
    const loginBtn = modal.querySelector('#login-btn');
    
    const doLogin = async () => {
      const email = emailInput.value.trim();
      if (!email || !email.includes('@')) {
        alert('Please enter a valid email');
        return;
      }
      
      try {
        await UserAuth.loginWithEmail(email);
        modal.remove();
        window.location.reload(); // Refresh to load user data
      } catch (error) {
        alert('Login failed. Please try again.');
      }
    };
    
    loginBtn.addEventListener('click', doLogin);
    emailInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') doLogin();
    });
    
    emailInput.focus();
  }
  
  /**
   * Require login - show modal if not logged in
   */
  static requireLogin() {
    if (!this.isLoggedIn()) {
      this.showLoginModal();
      return false;
    }
    return true;
  }
}

/**
 * Handle auth from URL parameter (?user=email@example.com)
 */
export function handleAuthFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  const email = urlParams.get('user');
  
  if (email && !UserAuth.isLoggedIn()) {
    UserAuth.loginWithEmail(email).then(() => {
      // Clean URL
      window.history.replaceState({}, '', window.location.pathname);
    });
  }
}
