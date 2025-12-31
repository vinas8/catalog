/**
 * Universal Debug Console Loader
 * Include this in <head> to auto-load debug console when DEBUG is enabled
 * Usage: <script src="src/utils/debug-loader.js"></script>
 */

(function() {
  // Check if we're in debug mode
  const isLocalhost = window.location.hostname === 'localhost' || 
                      window.location.hostname === '127.0.0.1';
  
  // Also check URL parameter: ?debug=1
  const urlParams = new URLSearchParams(window.location.search);
  const debugParam = urlParams.get('debug') === '1' || urlParams.get('debug') === 'true';
  
  const IS_DEBUG = isLocalhost || debugParam;
  
  console.log('🔍 Debug mode:', IS_DEBUG ? 'ENABLED' : 'DISABLED');
  
  if (!IS_DEBUG) {
    console.log('ℹ️ Debug console disabled (production mode)');
    return;
  }

  console.log('📱 Loading mobile debug console...');
  
  // Create console overlay
  const consoleDiv = document.createElement('div');
  consoleDiv.id = 'mobile-debug-console';
  consoleDiv.style.cssText = `
    position: fixed;
    bottom: 80px;
    left: 0;
    right: 0;
    max-height: 40vh;
    overflow-y: auto;
    background: rgba(0, 0, 0, 0.95);
    color: #0f0;
    font-family: 'Courier New', monospace;
    font-size: 11px;
    padding: 10px;
    z-index: 999998;
    border-top: 2px solid #0f0;
    display: none;
    box-shadow: 0 -4px 20px rgba(0, 255, 0, 0.3);
  `;
  
  // Toggle button
  const toggleBtn = document.createElement('button');
  toggleBtn.textContent = '📋';
  toggleBtn.title = 'Toggle Debug Console';
  toggleBtn.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 999999;
    padding: 12px 16px;
    background: #000;
    color: #0f0;
    border: 2px solid #0f0;
    border-radius: 50%;
    font-size: 20px;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(0, 255, 0, 0.4);
    transition: all 0.2s;
    width: 50px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
  `;
  
  // Clear button
  const clearBtn = document.createElement('button');
  clearBtn.textContent = '🗑️';
  clearBtn.title = 'Clear Console';
  clearBtn.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 80px;
    z-index: 999999;
    padding: 10px 14px;
    background: #000;
    color: #ff0;
    border: 2px solid #ff0;
    border-radius: 50%;
    font-size: 16px;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(255, 255, 0, 0.4);
    display: none;
    width: 45px;
    height: 45px;
    align-items: center;
    justify-content: center;
  `;
  
  let consoleVisible = false;
  
  toggleBtn.onclick = () => {
    consoleVisible = !consoleVisible;
    consoleDiv.style.display = consoleVisible ? 'block' : 'none';
    clearBtn.style.display = consoleVisible ? 'flex' : 'none';
    toggleBtn.style.background = consoleVisible ? '#0f0' : '#000';
    toggleBtn.style.color = consoleVisible ? '#000' : '#0f0';
    toggleBtn.textContent = consoleVisible ? '❌' : '📋';
    
    if (consoleVisible) {
      addLog('🟢 Console opened', 'info');
    }
  };
  
  clearBtn.onclick = () => {
    consoleDiv.innerHTML = '';
    addLog('🗑️ Console cleared', 'info');
  };
  
  // Helper to add log
  function addLog(msg, type = 'log') {
    const colors = {
      log: '#0f0',
      warn: '#ff0',
      error: '#f00',
      info: '#0ff',
      success: '#0f0'
    };
    
    const logLine = document.createElement('div');
    logLine.style.cssText = `
      color: ${colors[type] || '#0f0'};
      margin-bottom: 4px;
      border-bottom: 1px solid #333;
      padding-bottom: 3px;
      font-size: 11px;
      line-height: 1.4;
      word-wrap: break-word;
    `;
    
    const timestamp = new Date().toLocaleTimeString();
    logLine.textContent = `[${timestamp}] ${type.toUpperCase()}: ${msg}`;
    
    consoleDiv.appendChild(logLine);
    consoleDiv.scrollTop = consoleDiv.scrollHeight;
    
    // Auto-show on error
    if (type === 'error') {
      consoleVisible = true;
      consoleDiv.style.display = 'block';
      clearBtn.style.display = 'flex';
      toggleBtn.style.background = '#0f0';
      toggleBtn.style.color = '#000';
      toggleBtn.textContent = '❌';
    }
  }
  
  // Add to page when DOM ready
  function injectConsole() {
    if (document.body) {
      document.body.appendChild(consoleDiv);
      document.body.appendChild(toggleBtn);
      document.body.appendChild(clearBtn);
      addLog('✅ Mobile debug console loaded!', 'info');
    }
  }
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectConsole);
  } else {
    injectConsole();
  }
  
  // Intercept console methods
  const originalLog = console.log;
  const originalWarn = console.warn;
  const originalError = console.error;
  const originalInfo = console.info;
  
  console.log = function(...args) {
    const msg = args.map(a => typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)).join(' ');
    addLog(msg, 'log');
    originalLog.apply(console, args);
  };
  
  console.warn = function(...args) {
    const msg = args.map(a => typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)).join(' ');
    addLog(msg, 'warn');
    originalWarn.apply(console, args);
  };
  
  console.error = function(...args) {
    const msg = args.map(a => typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)).join(' ');
    addLog(msg, 'error');
    originalError.apply(console, args);
  };
  
  console.info = function(...args) {
    const msg = args.map(a => typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)).join(' ');
    addLog(msg, 'info');
    originalInfo.apply(console, args);
  };
  
  // Catch unhandled errors
  window.addEventListener('error', (event) => {
    addLog(`UNCAUGHT: ${event.message} at ${event.filename}:${event.lineno}`, 'error');
  });
  
  // Catch unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    addLog(`PROMISE REJECTION: ${event.reason}`, 'error');
  });
  
  // Expose global debug helper
  window.debugLog = (msg, type = 'log') => {
    addLog(msg, type);
  };
  
  console.log('✅ Mobile debug console ready!');
})();
