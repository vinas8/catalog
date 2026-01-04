// ====================================
// DEBUG CONSOLE MODULE
// ====================================
// Provides visual debug logging with mobile support

export class DebugConsole {
  constructor(containerId = 'debugOutput') {
    this.container = document.getElementById(containerId);
    this.logs = [];
    this.maxLogs = 100;
  }

  log(...args) {
    const timestamp = new Date().toLocaleTimeString();
    const msg = args.map(a => {
      if (typeof a === 'object') {
        try {
          return JSON.stringify(a, null, 2);
        } catch (e) {
          return String(a);
        }
      }
      return String(a);
    }).join(' ');
    
    this.logs.push({ timestamp, msg });
    
    // Keep only last N logs
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }
    
    // Update UI
    this.render();
    
    // Also log to console
    console.log(`[${timestamp}]`, ...args);
  }

  error(...args) {
    const msg = args.join(' ');
    this.log(`❌ ERROR: ${msg}`);
    console.error(...args);
  }

  warn(...args) {
    const msg = args.join(' ');
    this.log(`⚠️  WARNING: ${msg}`);
    console.warn(...args);
  }

  success(...args) {
    const msg = args.join(' ');
    this.log(`✅ ${msg}`);
  }

  info(...args) {
    const msg = args.join(' ');
    this.log(`ℹ️  ${msg}`);
  }

  clear() {
    this.logs = [];
    this.render();
  }

  render() {
    if (!this.container) return;
    
    this.container.innerHTML = this.logs
      .map(({ timestamp, msg }) => `<div><span style="color: #64748b;">[${timestamp}]</span> ${this.escapeHtml(msg)}</div>`)
      .join('');
    
    // Auto-scroll to bottom
    this.container.parentElement.scrollTop = this.container.parentElement.scrollHeight;
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

// Create singleton instance
export const debug = new DebugConsole();

// Convenience exports
export const log = (...args) => debug.log(...args);
export const error = (...args) => debug.error(...args);
export const warn = (...args) => debug.warn(...args);
export const success = (...args) => debug.success(...args);
export const info = (...args) => debug.info(...args);
export const clear = () => debug.clear();
