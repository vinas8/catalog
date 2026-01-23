// Simple Debug Overlay - No dependencies
// Shows console logs on screen

class SimpleDebugPanel {
  constructor() {
    this.logs = [];
    this.panel = null;
    this.init();
  }
  
  init() {
    // Create panel
    this.panel = document.createElement('div');
    this.panel.id = 'simple-debug-panel';
    this.panel.innerHTML = `
      <div style="
        position: fixed;
        bottom: 10px;
        right: 10px;
        width: 400px;
        max-height: 500px;
        background: rgba(0, 0, 0, 0.95);
        color: #0f0;
        font-family: monospace;
        font-size: 12px;
        border: 2px solid #0f0;
        border-radius: 8px;
        z-index: 99999;
        overflow: hidden;
      ">
        <div style="
          background: #0f0;
          color: #000;
          padding: 8px;
          font-weight: bold;
          display: flex;
          justify-content: space-between;
        ">
          <span>🐛 DEBUG CONSOLE</span>
          <button onclick="window.simpleDebug.clear()" style="
            background: #000;
            color: #0f0;
            border: 1px solid #0f0;
            padding: 3px 8px;
            cursor: pointer;
            font-family: monospace;
          ">Clear</button>
        </div>
        <div id="simple-debug-logs" style="
          padding: 10px;
          max-height: 450px;
          overflow-y: auto;
          line-height: 1.4;
        "></div>
      </div>
    `;
    
    document.body.appendChild(this.panel);
    
    // Intercept console
    const originalLog = console.log;
    const originalError = console.error;
    const originalWarn = console.warn;
    
    console.log = (...args) => {
      this.add(args.join(' '), 'log');
      originalLog.apply(console, args);
    };
    
    console.error = (...args) => {
      this.add(args.join(' '), 'error');
      originalError.apply(console, args);
    };
    
    console.warn = (...args) => {
      this.add(args.join(' '), 'warn');
      originalWarn.apply(console, args);
    };
    
    this.add('Debug panel ready', 'log');
  }
  
  add(msg, type = 'log') {
    const time = new Date().toLocaleTimeString();
    const colors = {
      log: '#0f0',
      error: '#f00',
      warn: '#ff0'
    };
    
    this.logs.push({ msg, type, time });
    if (this.logs.length > 100) this.logs.shift();
    
    const logsDiv = document.getElementById('simple-debug-logs');
    if (logsDiv) {
      logsDiv.innerHTML = this.logs.map(l => `
        <div style="margin: 4px 0; padding: 4px; border-left: 3px solid ${colors[l.type]}; color: ${colors[l.type]};">
          <span style="color: #666; font-size: 10px;">[${l.time}]</span> ${l.msg}
        </div>
      `).join('');
      logsDiv.scrollTop = logsDiv.scrollHeight;
    }
  }
  
  clear() {
    this.logs = [];
    const logsDiv = document.getElementById('simple-debug-logs');
    if (logsDiv) logsDiv.innerHTML = '';
    this.add('Logs cleared', 'log');
  }
}

// Auto-init
if (typeof window !== 'undefined' && document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.simpleDebug = new SimpleDebugPanel();
  });
} else if (typeof window !== 'undefined') {
  window.simpleDebug = new SimpleDebugPanel();
}
