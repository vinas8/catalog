/**
 * Debug Panel Component
 * Shows debug info and quick links when DEBUG mode is enabled
 * Controlled by APP_CONFIG.DEBUG (true in localhost, false in production)
 */

import { APP_CONFIG } from '../config/app-config.js';

export class DebugPanel {
  constructor() {
    this.isVisible = false;
    this.panel = null;
  }
  
  /**
   * Initialize and inject debug panel into page
   * Only shows if DEBUG is true
   */
  init() {
    if (!APP_CONFIG.DEBUG) return;
    
    this.createPanel();
    this.attachEventListeners();
    this.collectPageInfo();
  }
  
  createPanel() {
    // Create floating debug button
    const debugBtn = document.createElement('button');
    debugBtn.id = 'debug-toggle-btn';
    debugBtn.innerHTML = '🔍';
    debugBtn.title = 'Debug Panel';
    debugBtn.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: 3px solid white;
      font-size: 24px;
      cursor: pointer;
      z-index: 99998;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
      transition: all 0.3s ease;
    `;
    
    debugBtn.addEventListener('mouseenter', () => {
      debugBtn.style.transform = 'scale(1.1)';
    });
    debugBtn.addEventListener('mouseleave', () => {
      debugBtn.style.transform = 'scale(1)';
    });
    
    // Create debug panel
    this.panel = document.createElement('div');
    this.panel.id = 'debug-panel';
    this.panel.style.cssText = `
      position: fixed;
      bottom: 80px;
      right: 20px;
      width: 350px;
      max-height: 80vh;
      background: rgba(17, 17, 17, 0.98);
      color: #fff;
      border-radius: 12px;
      padding: 20px;
      z-index: 99999;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
      overflow-y: auto;
      display: none;
      font-family: 'Monaco', 'Courier New', monospace;
      font-size: 12px;
      line-height: 1.6;
      backdrop-filter: blur(10px);
    `;
    
    this.panel.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; border-bottom: 2px solid #667eea; padding-bottom: 10px;">
        <h3 style="margin: 0; color: #667eea; font-size: 16px;">🔍 Debug Panel</h3>
        <button id="debug-close-btn" style="background: transparent; border: none; color: #fff; cursor: pointer; font-size: 20px;">✕</button>
      </div>
      
      <div id="debug-content">
        <div class="debug-section">
          <h4 style="color: #ffd700; margin: 10px 0 5px 0;">Page Info</h4>
          <div id="debug-page-info"></div>
        </div>
        
        <div class="debug-section">
          <h4 style="color: #ffd700; margin: 15px 0 5px 0;">Environment</h4>
          <div id="debug-env-info"></div>
        </div>
        
        <div class="debug-section">
          <h4 style="color: #ffd700; margin: 15px 0 5px 0;">Quick Links</h4>
          <div id="debug-quick-links"></div>
        </div>
        
        <div class="debug-section">
          <h4 style="color: #ffd700; margin: 15px 0 5px 0;">Console</h4>
          <div id="debug-console" style="background: #000; padding: 10px; border-radius: 6px; max-height: 200px; overflow-y: auto; font-size: 11px;"></div>
        </div>
      </div>
    `;
    
    document.body.appendChild(debugBtn);
    document.body.appendChild(this.panel);
    
    // Store reference to button
    this.toggleBtn = debugBtn;
  }
  
  attachEventListeners() {
    // Toggle button
    this.toggleBtn.addEventListener('click', () => {
      this.isVisible = !this.isVisible;
      this.panel.style.display = this.isVisible ? 'block' : 'none';
    });
    
    // Close button
    document.getElementById('debug-close-btn')?.addEventListener('click', () => {
      this.isVisible = false;
      this.panel.style.display = 'none';
    });
    
    // Keyboard shortcut: Ctrl + Shift + D
    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        e.preventDefault();
        this.toggleBtn.click();
      }
    });
    
    // Intercept console.log for debug console
    this.interceptConsole();
  }
  
  collectPageInfo() {
    // Page info
    const pageInfo = document.getElementById('debug-page-info');
    if (pageInfo) {
      const pageName = document.title || 'Unknown';
      const pathname = window.location.pathname.split('/').pop() || 'index.html';
      
      pageInfo.innerHTML = `
        <div style="color: #aaa;">
          <strong style="color: #fff;">Title:</strong> ${pageName}<br>
          <strong style="color: #fff;">Path:</strong> ${pathname}<br>
          <strong style="color: #fff;">Hash:</strong> ${window.location.hash || '(none)'}<br>
          <strong style="color: #fff;">Viewport:</strong> ${window.innerWidth} × ${window.innerHeight}
        </div>
      `;
    }
    
    // Environment info
    const envInfo = document.getElementById('debug-env-info');
    if (envInfo) {
      envInfo.innerHTML = `
        <div style="color: #aaa;">
          <strong style="color: #fff;">Environment:</strong> ${APP_CONFIG.ENVIRONMENT}<br>
          <strong style="color: #fff;">Version:</strong> ${APP_CONFIG.VERSION}<br>
          <strong style="color: #fff;">Debug Mode:</strong> <span style="color: #28a745;">ON</span><br>
          <strong style="color: #fff;">Localhost:</strong> ${APP_CONFIG.IS_LOCAL ? '✅' : '❌'}<br>
          <strong style="color: #fff;">GitHub Pages:</strong> ${APP_CONFIG.IS_GITHUB_PAGES ? '✅' : '❌'}
        </div>
      `;
    }
    
    // Quick links
    const quickLinks = document.getElementById('debug-quick-links');
    if (quickLinks) {
      const links = [
        { label: '🏠 Debug Hub', href: '/debug/' },
        { label: '🧪 Tests', href: '/debug/test-suite.html' },
        { label: '🎮 Game Test', href: '/debug/gamified-shop-test.html' },
        { label: '📦 Aquarium Demo', href: '/debug/aquarium-shelf-demo.html' },
        { label: '🔗 API Docs', href: '/prompts/api-documentation-for-copilot.md' }
      ];
      
      quickLinks.innerHTML = links.map(link => 
        `<a href="${link.href}" style="display: block; padding: 6px 10px; margin: 3px 0; background: #667eea; color: white; text-decoration: none; border-radius: 6px; transition: all 0.2s;" 
            onmouseover="this.style.background='#764ba2'" 
            onmouseout="this.style.background='#667eea'">
          ${link.label}
        </a>`
      ).join('');
    }
    
    // Initial console message
    this.logToDebugConsole('Debug panel initialized', 'info');
  }
  
  interceptConsole() {
    const consoleDiv = document.getElementById('debug-console');
    if (!consoleDiv) return;
    
    const originalLog = console.log;
    const originalError = console.error;
    const originalWarn = console.warn;
    
    console.log = (...args) => {
      originalLog.apply(console, args);
      this.logToDebugConsole(args.join(' '), 'log');
    };
    
    console.error = (...args) => {
      originalError.apply(console, args);
      this.logToDebugConsole(args.join(' '), 'error');
    };
    
    console.warn = (...args) => {
      originalWarn.apply(console, args);
      this.logToDebugConsole(args.join(' '), 'warn');
    };
  }
  
  logToDebugConsole(message, type = 'log') {
    const consoleDiv = document.getElementById('debug-console');
    if (!consoleDiv) return;
    
    const colors = {
      log: '#aaa',
      info: '#4ECDC4',
      warn: '#FFC107',
      error: '#FF6B6B',
      success: '#28A745'
    };
    
    const timestamp = new Date().toLocaleTimeString();
    const logEntry = document.createElement('div');
    logEntry.style.cssText = `
      color: ${colors[type] || colors.log};
      margin: 2px 0;
      word-wrap: break-word;
    `;
    logEntry.textContent = `[${timestamp}] ${message}`;
    
    consoleDiv.appendChild(logEntry);
    consoleDiv.scrollTop = consoleDiv.scrollHeight;
    
    // Keep only last 50 logs
    while (consoleDiv.children.length > 50) {
      consoleDiv.removeChild(consoleDiv.firstChild);
    }
  }
  
  /**
   * Public API to log custom messages
   */
  log(message, type = 'log') {
    this.logToDebugConsole(message, type);
  }
}

// Create singleton instance
let debugPanelInstance = null;

/**
 * Initialize debug panel
 * Call this at the end of page load
 */
export function initDebugPanel() {
  if (!APP_CONFIG.DEBUG) {
    console.log('Debug mode disabled (production)');
    return null;
  }
  
  if (!debugPanelInstance) {
    debugPanelInstance = new DebugPanel();
    debugPanelInstance.init();
  }
  
  return debugPanelInstance;
}

/**
 * Get debug panel instance
 */
export function getDebugPanel() {
  return debugPanelInstance;
}

// Auto-initialize if loaded as module
if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', () => {
    initDebugPanel();
  });
}
