// User Authentication via Secure Hash in URL
// User access via: ?user=HASH or /game.html#user=HASH

export class UserAuth {
  
  /**
   * Get user hash from URL
   */
  static getUserHashFromURL() {
    // Check query parameter: ?user=abc123
    const urlParams = new URLSearchParams(window.location.search);
    let hash = urlParams.get('user');
    
    // Check hash parameter: #user=abc123
    if (!hash && window.location.hash) {
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      hash = hashParams.get('user');
    }
    
    // Check plain hash: #abc123 (just the user ID)
    if (!hash && window.location.hash && window.location.hash.length > 1) {
      const plainHash = window.location.hash.substring(1); // Remove #
      // If it's not a key=value format, use it as the user ID
      if (!plainHash.includes('=')) {
        hash = plainHash;
      }
    }
    
    // Debug for mobile
    if (typeof document !== 'undefined') {
      const debugDiv = document.createElement('div');
      debugDiv.style.cssText = 'position:fixed;top:50px;left:10px;background:#0f0;color:#000;padding:10px;z-index:99999;font-size:12px;';
      debugDiv.innerHTML = `URL: ${window.location.href}<br>User Hash: ${hash || 'NONE'}`;
      document.body.appendChild(debugDiv);
      debugDiv.addEventListener('click', () => debugDiv.remove());
    }
    
    console.log('🔑 Hash from URL:', hash);
    return hash;
  }
  
  /**
   * Get or create user from hash
   */
  static async getUserFromHash(hash) {
    if (!hash) return null;
    
    try {
      // Try to load from worker first (preferred)
      try {
        const { WORKER_CONFIG } = await import('../config/worker-config.js');
        const workerUrl = WORKER_CONFIG.getUserEndpoint('USER_DATA', hash);
        const response = await fetch(workerUrl);
        
        if (response.ok) {
          const user = await response.json();
          console.log('👤 Loaded user from worker:', user.user_id);
          return user;
        }
      } catch (workerError) {
        console.log('⚠️ Worker unavailable, creating user from hash');
      }
      
      // Fall back: create user object from hash
      const user = {
        user_id: hash,
        username: `User ${hash.substring(0, 8)}`,
        email: null,
        created_at: new Date().toISOString(),
        loyalty_points: 0,
        loyalty_tier: 'bronze'
      };
      
      console.log('🆕 Created user from hash:', user.user_id);
      return user;
      
    } catch (error) {
      console.error('Error loading user:', error);
      // Even on error, create basic user
      return {
        user_id: hash,
        username: `User ${hash.substring(0, 8)}`,
        email: null,
        created_at: new Date().toISOString(),
        loyalty_points: 0,
        loyalty_tier: 'bronze'
      };
    }
  }
  
  /**
   * Get current user (from URL or localStorage)
   */
  static async getCurrentUser() {
    // First check URL
    const hash = this.getUserHashFromURL();
    
    if (hash) {
      const user = await this.getUserFromHash(hash);
      if (user) {
        // Cache in localStorage
        localStorage.setItem('serpent_user_hash', hash);
        localStorage.setItem('serpent_user', JSON.stringify(user));
        return user;
      }
    }
    
    // Fall back to cached user
    const cachedHash = localStorage.getItem('serpent_user_hash');
    if (cachedHash) {
      const user = await this.getUserFromHash(cachedHash);
      return user;
    }
    
    return null;
  }
  
  /**
   * Get user ID (hash)
   */
  static getUserId() {
    return this.getUserHashFromURL() || localStorage.getItem('serpent_user_hash');
  }
  
  /**
   * Check if user is identified
   */
  static isLoggedIn() {
    return this.getUserId() !== null;
  }
  
  /**
   * Generate secure hash for new user
   */
  static generateUserHash() {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 15);
    return timestamp + random;
  }
  
  /**
   * Create shareable user URL
   */
  static getUserURL(basePath = '/game.html') {
    const hash = this.getUserId();
    if (!hash) return basePath;
    return `${basePath}?user=${hash}`;
  }
  
  /**
   * Show "Get Your Link" modal for new users
   */
  static showGetLinkModal() {
    const hash = this.generateUserHash();
    const url = window.location.origin + this.getUserURL('/game.html');
    const fullURL = url.replace('/game.html', '/game.html') + `?user=${hash}`;
    
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'flex';
    modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h2>🔗 Your Personal Link</h2>
        </div>
        <div style="padding: 2rem;">
          <p style="margin-bottom: 1rem;">
            Save this link to access your snakes from any device:
          </p>
          <input type="text" value="${fullURL}" 
                 style="width: 100%; padding: 0.75rem; border: 2px solid #ddd; border-radius: 6px; font-size: 0.9rem; margin-bottom: 1rem;"
                 readonly onclick="this.select()">
          <div style="display: flex; gap: 1rem;">
            <button class="primary-btn" onclick="navigator.clipboard.writeText('${fullURL}'); alert('Link copied!')">
              📋 Copy Link
            </button>
            <button class="secondary-btn" onclick="window.location.href='${fullURL}'">
              ✅ Use This Link
            </button>
          </div>
          <p style="margin-top: 1.5rem; font-size: 0.9rem; color: #666;">
            ⚠️ Bookmark this link! Anyone with this link can access your snakes.
          </p>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
  }
  
  /**
   * Logout - clear cached hash
   */
  static logout() {
    localStorage.removeItem('serpent_user_hash');
    localStorage.removeItem('serpent_user');
    localStorage.removeItem('serpent_town_save');
    window.location.href = '/';
  }
}

/**
 * Initialize user from URL on page load
 */
export async function initializeUser() {
  const user = await UserAuth.getCurrentUser();
  
  if (user) {
    console.log('👤 User loaded:', user.user_id);
    return user;
  } else {
    console.log('👤 No user in URL - anonymous mode');
    return null;
  }
}

/**
 * Require user hash - show modal if not present
 */
export function requireUser() {
  if (!UserAuth.isLoggedIn()) {
    UserAuth.showGetLinkModal();
    return false;
  }
  return true;
}
