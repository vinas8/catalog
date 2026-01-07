/**
 * PWA Install Button Component
 * Shows install prompt for Progressive Web App
 */

class PWAInstallButton extends HTMLElement {
  constructor() {
    super();
    this.deferredPrompt = null;
    this.isInstalled = false;
  }

  connectedCallback() {
    this.checkIfInstalled();
    this.render();
    this.setupListeners();
  }

  checkIfInstalled() {
    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      this.isInstalled = true;
    }
    
    // iOS Safari
    if (window.navigator.standalone === true) {
      this.isInstalled = true;
    }
  }

  render() {
    if (this.isInstalled) {
      this.innerHTML = '';
      return;
    }

    this.innerHTML = `
      <button id="pwa-install-btn" style="
        display: none;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border: none;
        padding: 12px 24px;
        border-radius: 8px;
        font-weight: 600;
        font-size: 14px;
        cursor: pointer;
        transition: all 0.2s;
        box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
      ">
        📲 Install App
      </button>
    `;

    // Add hover effect
    const btn = this.querySelector('#pwa-install-btn');
    btn.addEventListener('mouseenter', () => {
      btn.style.transform = 'translateY(-2px)';
      btn.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.4)';
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translateY(0)';
      btn.style.boxShadow = '0 2px 8px rgba(102, 126, 234, 0.3)';
    });
  }

  setupListeners() {
    const installBtn = this.querySelector('#pwa-install-btn');
    if (!installBtn) return;

    // Listen for beforeinstallprompt event
    window.addEventListener('beforeinstallprompt', (e) => {
      console.log('[PWA] Install prompt available');
      e.preventDefault();
      this.deferredPrompt = e;
      installBtn.style.display = 'block';
    });

    // Handle install button click
    installBtn.addEventListener('click', async () => {
      if (!this.deferredPrompt) {
        console.log('[PWA] No install prompt available');
        this.showIOSInstructions();
        return;
      }

      console.log('[PWA] Showing install prompt');
      this.deferredPrompt.prompt();
      
      const { outcome } = await this.deferredPrompt.userChoice;
      console.log('[PWA] User choice:', outcome);
      
      if (outcome === 'accepted') {
        console.log('[PWA] App installed successfully');
        this.showSuccessMessage();
      }
      
      this.deferredPrompt = null;
      installBtn.style.display = 'none';
    });

    // Listen for app installed event
    window.addEventListener('appinstalled', () => {
      console.log('[PWA] App installed');
      this.isInstalled = true;
      installBtn.style.display = 'none';
      this.showSuccessMessage();
    });
  }

  showIOSInstructions() {
    // Detect iOS
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    
    if (isIOS) {
      const modal = document.createElement('div');
      modal.innerHTML = `
        <div style="
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10000;
          padding: 20px;
        " id="ios-install-modal">
          <div style="
            background: white;
            border-radius: 12px;
            padding: 30px;
            max-width: 400px;
            text-align: center;
          ">
            <h3 style="margin-top: 0; color: #333;">Install Snake Muffin</h3>
            <p style="color: #666; margin: 20px 0;">To install this app on iOS:</p>
            <ol style="text-align: left; color: #666; padding-left: 20px;">
              <li>Tap the Share button <span style="font-size: 1.2rem;">⎋</span></li>
              <li>Scroll down and tap "Add to Home Screen"</li>
              <li>Tap "Add" to confirm</li>
            </ol>
            <button onclick="document.getElementById('ios-install-modal').remove()" style="
              background: #667eea;
              color: white;
              border: none;
              padding: 12px 24px;
              border-radius: 8px;
              font-weight: 600;
              cursor: pointer;
              margin-top: 20px;
            ">Got it!</button>
          </div>
        </div>
      `;
      document.body.appendChild(modal);
    }
  }

  showSuccessMessage() {
    const toast = document.createElement('div');
    toast.innerHTML = `
      <div style="
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: #2ea043;
        color: white;
        padding: 16px 24px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        z-index: 10000;
        font-weight: 600;
        animation: slideUp 0.3s ease;
      ">
        ✅ App installed successfully!
      </div>
      <style>
        @keyframes slideUp {
          from { transform: translateX(-50%) translateY(100px); opacity: 0; }
          to { transform: translateX(-50%) translateY(0); opacity: 1; }
        }
      </style>
    `;
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.remove();
    }, 3000);
  }
}

// Register custom element
customElements.define('pwa-install-button', PWAInstallButton);

// Auto-register service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('[PWA] Service Worker registered:', registration.scope);
      
      // Check for updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            console.log('[PWA] New version available');
            showUpdateNotification();
          }
        });
      });
    } catch (error) {
      console.error('[PWA] Service Worker registration failed:', error);
    }
  });
}

function showUpdateNotification() {
  const toast = document.createElement('div');
  toast.innerHTML = `
    <div style="
      position: fixed;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      background: #1f6feb;
      color: white;
      padding: 16px 24px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      z-index: 10000;
      display: flex;
      gap: 12px;
      align-items: center;
    ">
      <span>🔄 New version available!</span>
      <button onclick="window.location.reload()" style="
        background: white;
        color: #1f6feb;
        border: none;
        padding: 8px 16px;
        border-radius: 6px;
        font-weight: 600;
        cursor: pointer;
      ">Update</button>
    </div>
  `;
  document.body.appendChild(toast);
}

export { PWAInstallButton };
