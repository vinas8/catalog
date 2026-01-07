/**
 * BrowserFrame Component
 * In-app browser for testing/demo pages with proper controls
 * Usage: new BrowserFrame(containerId, options)
 */

export class BrowserFrame {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId);
    this.options = {
      height: options.height || '600px',
      showControls: options.showControls !== false,
      showURL: options.showURL !== false,
      allowFullscreen: options.allowFullscreen !== false,
      ...options
    };
    
    this.currentURL = null;
    this.iframe = null;
    this.render();
  }

  render() {
    this.container.innerHTML = `
      <div class="browser-frame">
        ${this.options.showControls ? this.renderControls() : ''}
        <div class="browser-viewport" style="height: ${this.options.height}">
          <iframe 
            id="${this.container.id}-iframe" 
            frameborder="0"
            ${this.options.allowFullscreen ? 'allowfullscreen' : ''}
          ></iframe>
        </div>
      </div>
    `;
    
    this.iframe = this.container.querySelector('iframe');
    this.applyStyles();
    this.attachEvents();
  }

  renderControls() {
    return `
      <div class="browser-controls">
        <button class="browser-btn browser-back" title="Back">◀</button>
        <button class="browser-btn browser-forward" title="Forward">▶</button>
        <button class="browser-btn browser-reload" title="Reload">⟳</button>
        ${this.options.showURL ? `
          <input 
            type="text" 
            class="browser-url" 
            placeholder="Enter URL..." 
            readonly
          />
        ` : ''}
        <button class="browser-btn browser-fullscreen" title="Fullscreen">⛶</button>
        <button class="browser-btn browser-close" title="Close">✕</button>
      </div>
    `;
  }

  applyStyles() {
    if (document.getElementById('browser-frame-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'browser-frame-styles';
    style.textContent = `
      .browser-frame {
        background: #1a1a1a;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 8px 30px rgba(0,0,0,0.5);
      }
      
      .browser-controls {
        display: flex;
        gap: 8px;
        padding: 12px;
        background: #2a2a2a;
        border-bottom: 1px solid #404040;
        align-items: center;
      }
      
      .browser-btn {
        background: #3a3a3a;
        color: #e0e0e0;
        border: none;
        padding: 8px 14px;
        border-radius: 6px;
        cursor: pointer;
        font-size: 14px;
        transition: all 0.2s;
        font-weight: 600;
      }
      
      .browser-btn:hover {
        background: #4a4a4a;
        transform: translateY(-1px);
      }
      
      .browser-btn:active {
        transform: translateY(0);
      }
      
      .browser-btn:disabled {
        opacity: 0.4;
        cursor: not-allowed;
      }
      
      .browser-url {
        flex: 1;
        background: #1a1a1a;
        border: 1px solid #404040;
        color: #e0e0e0;
        padding: 8px 14px;
        border-radius: 6px;
        font-size: 13px;
        font-family: monospace;
        outline: none;
      }
      
      .browser-url:focus {
        border-color: #667eea;
      }
      
      .browser-viewport {
        position: relative;
        background: white;
      }
      
      .browser-viewport iframe {
        width: 100%;
        height: 100%;
        border: none;
      }
      
      .browser-loading {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        color: #667eea;
        font-size: 18px;
        font-weight: 600;
      }
      
      @media (max-width: 768px) {
        .browser-controls {
          padding: 8px;
          gap: 6px;
        }
        
        .browser-btn {
          padding: 6px 10px;
          font-size: 12px;
        }
        
        .browser-url {
          font-size: 11px;
          padding: 6px 10px;
        }
      }
    `;
    document.head.appendChild(style);
  }

  attachEvents() {
    const controls = this.container.querySelector('.browser-controls');
    if (!controls) return;
    
    const backBtn = controls.querySelector('.browser-back');
    const forwardBtn = controls.querySelector('.browser-forward');
    const reloadBtn = controls.querySelector('.browser-reload');
    const fullscreenBtn = controls.querySelector('.browser-fullscreen');
    const closeBtn = controls.querySelector('.browser-close');
    const urlInput = controls.querySelector('.browser-url');
    
    if (backBtn) backBtn.onclick = () => this.goBack();
    if (forwardBtn) forwardBtn.onclick = () => this.goForward();
    if (reloadBtn) reloadBtn.onclick = () => this.reload();
    if (fullscreenBtn) fullscreenBtn.onclick = () => this.toggleFullscreen();
    if (closeBtn) closeBtn.onclick = () => this.close();
    
    // Track iframe navigation
    if (this.iframe) {
      this.iframe.onload = () => {
        this.onLoad();
        if (urlInput) {
          try {
            urlInput.value = this.iframe.contentWindow.location.href;
          } catch (e) {
            urlInput.value = this.currentURL || 'about:blank';
          }
        }
      };
    }
  }

  load(url) {
    this.currentURL = url;
    if (this.iframe) {
      this.showLoading();
      this.iframe.src = url;
    }
    this.dispatchEvent('load', { url });
  }

  goBack() {
    if (this.iframe && this.iframe.contentWindow) {
      this.iframe.contentWindow.history.back();
    }
  }

  goForward() {
    if (this.iframe && this.iframe.contentWindow) {
      this.iframe.contentWindow.history.forward();
    }
  }

  reload() {
    if (this.iframe) {
      this.showLoading();
      this.iframe.contentWindow.location.reload();
    }
  }

  close() {
    this.load('about:blank');
    this.dispatchEvent('close');
  }

  toggleFullscreen() {
    const viewport = this.container.querySelector('.browser-viewport');
    if (!document.fullscreenElement) {
      viewport.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }

  showLoading() {
    const viewport = this.container.querySelector('.browser-viewport');
    if (!viewport.querySelector('.browser-loading')) {
      const loader = document.createElement('div');
      loader.className = 'browser-loading';
      loader.textContent = '⟳ Loading...';
      viewport.appendChild(loader);
    }
  }

  hideLoading() {
    const loader = this.container.querySelector('.browser-loading');
    if (loader) loader.remove();
  }

  onLoad() {
    this.hideLoading();
    this.dispatchEvent('loaded', { url: this.currentURL });
  }

  dispatchEvent(name, detail = {}) {
    const event = new CustomEvent(`browserframe:${name}`, { detail });
    this.container.dispatchEvent(event);
  }

  destroy() {
    this.container.innerHTML = '';
  }
}

// Usage Example:
// const browser = new BrowserFrame('browser-container', {
//   height: '800px',
//   showControls: true,
//   showURL: true
// });
// browser.load('/catalog.html');
