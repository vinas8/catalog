// Mobile Console Logger - Displays console logs on screen
// Include this first: <script src="/debug/mobile-console.js"></script>

(function() {
  // Create console overlay
  const consoleDiv = document.createElement('div');
  consoleDiv.id = 'mobile-console';
  consoleDiv.style.cssText = `
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    max-height: 50vh;
    overflow-y: auto;
    background: rgba(0, 0, 0, 0.95);
    color: #0f0;
    font-family: monospace;
    font-size: 10px;
    padding: 10px;
    z-index: 999999;
    border-top: 2px solid #0f0;
    display: none;
  `;
  
  // Toggle button
  const toggleBtn = document.createElement('button');
  toggleBtn.textContent = '📋 Console';
  toggleBtn.style.cssText = `
    position: fixed;
    bottom: 10px;
    right: 10px;
    z-index: 9999999;
    padding: 10px;
    background: #000;
    color: #0f0;
    border: 2px solid #0f0;
    border-radius: 5px;
    font-size: 14px;
    font-weight: bold;
  `;
  
  let consoleVisible = false;
  toggleBtn.onclick = () => {
    consoleVisible = !consoleVisible;
    consoleDiv.style.display = consoleVisible ? 'block' : 'none';
    toggleBtn.textContent = consoleVisible ? '❌ Hide' : '📋 Console';
  };
  
  // Add to page when DOM ready
  if (document.body) {
    document.body.appendChild(consoleDiv);
    document.body.appendChild(toggleBtn);
  } else {
    document.addEventListener('DOMContentLoaded', () => {
      document.body.appendChild(consoleDiv);
      document.body.appendChild(toggleBtn);
    });
  }
  
  // Helper to add log
  function addLog(msg, type = 'log') {
    const colors = {
      log: '#0f0',
      warn: '#ff0',
      error: '#f00',
      info: '#0ff'
    };
    
    const logLine = document.createElement('div');
    logLine.style.color = colors[type] || '#0f0';
    logLine.style.marginBottom = '5px';
    logLine.style.borderBottom = '1px solid #333';
    logLine.style.paddingBottom = '3px';
    
    const timestamp = new Date().toLocaleTimeString();
    logLine.textContent = `[${timestamp}] ${type.toUpperCase()}: ${msg}`;
    
    consoleDiv.appendChild(logLine);
    consoleDiv.scrollTop = consoleDiv.scrollHeight;
    
    // Auto-show on error
    if (type === 'error') {
      consoleVisible = true;
      consoleDiv.style.display = 'block';
      toggleBtn.textContent = '❌ Hide';
    }
  }
  
  // Intercept console methods
  const originalLog = console.log;
  const originalWarn = console.warn;
  const originalError = console.error;
  const originalInfo = console.info;
  
  console.log = function(...args) {
    addLog(args.join(' '), 'log');
    originalLog.apply(console, args);
  };
  
  console.warn = function(...args) {
    addLog(args.join(' '), 'warn');
    originalWarn.apply(console, args);
  };
  
  console.error = function(...args) {
    addLog(args.join(' '), 'error');
    originalError.apply(console, args);
  };
  
  console.info = function(...args) {
    addLog(args.join(' '), 'info');
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
  
  console.log('📱 Mobile console logger loaded!');
})();
