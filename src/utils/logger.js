/**
 * Logger utility with debug mode support
 * Only logs when APP_CONFIG.DEBUG is true
 */

import { APP_CONFIG } from '../config/app-config.js';

export const logger = {
  log(...args) {
    if (APP_CONFIG.DEBUG) {
      console.log(...args);
    }
  },
  
  debug(...args) {
    if (APP_CONFIG.DEBUG) {
      console.debug(...args);
    }
  },
  
  info(...args) {
    if (APP_CONFIG.DEBUG) {
      console.info(...args);
    }
  },
  
  warn(...args) {
    // Always show warnings
    console.warn(...args);
  },
  
  error(...args) {
    // Always show errors
    console.error(...args);
  },
  
  // Time logging for performance
  time(label) {
    if (APP_CONFIG.DEBUG) {
      console.time(label);
    }
  },
  
  timeEnd(label) {
    if (APP_CONFIG.DEBUG) {
      console.timeEnd(label);
    }
  }
};

export default logger;
