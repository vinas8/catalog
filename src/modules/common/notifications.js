/**
 * Enhanced Notification System
 * SMRI: S0.3 - Common utilities module
 * 
 * Provides toast notifications, order status updates, and purchase confirmations
 */

import { TIMEOUTS } from './constants.js';

/**
 * Show a toast notification
 * @param {string} message - Notification message
 * @param {string} type - Notification type: 'success'|'error'|'info'|'warning'
 * @param {number} duration - Duration in ms (default: 3000)
 */
export function showNotification(message, type = 'info', duration = TIMEOUTS.NOTIFICATION_DURATION) {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  
  // Apply styles
  Object.assign(notification.style, {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    padding: '1rem 1.5rem',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    zIndex: '10000',
    animation: 'slideIn 0.3s ease-out',
    fontWeight: '500',
    maxWidth: '400px'
  });
  
  // Type-specific colors
  const colors = {
    success: { bg: '#10b981', color: '#fff' },
    error: { bg: '#ef4444', color: '#fff' },
    warning: { bg: '#f59e0b', color: '#fff' },
    info: { bg: '#3b82f6', color: '#fff' }
  };
  
  const colorScheme = colors[type] || colors.info;
  notification.style.background = colorScheme.bg;
  notification.style.color = colorScheme.color;
  
  document.body.appendChild(notification);
  
  // Auto-remove
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease-in';
    notification.addEventListener('animationend', () => notification.remove());
  }, duration);
  
  return notification;
}

/**
 * Show purchase confirmation notification
 * @param {Object} purchase - Purchase details
 */
export function showPurchaseNotification(purchase) {
  const { product, price } = purchase;
  const message = `🎉 You bought ${product.name || 'a snake'} for €${price}!`;
  return showNotification(message, 'success', 5000);
}

/**
 * Show order status notification
 * @param {string} status - Order status: 'processing'|'confirmed'|'ready'|'failed'
 * @param {string} details - Additional details
 */
export function showOrderStatus(status, details = '') {
  const messages = {
    processing: '⏳ Processing your order...',
    confirmed: '✅ Order confirmed! Your snake is being prepared.',
    ready: '🐍 Your snake is ready! Check your collection.',
    failed: '❌ Order failed. Please contact support.'
  };
  
  const types = {
    processing: 'info',
    confirmed: 'success',
    ready: 'success',
    failed: 'error'
  };
  
  const message = details ? `${messages[status]} ${details}` : messages[status];
  const type = types[status] || 'info';
  
  return showNotification(message, type, type === 'error' ? 5000 : 3000);
}

/**
 * Show persistent notification (stays until closed)
 * @param {string} message - Notification message
 * @param {string} type - Notification type
 * @returns {HTMLElement} Notification element with close button
 */
export function showPersistentNotification(message, type = 'info') {
  const notification = showNotification(message, type, 999999); // Very long duration
  
  // Add close button
  const closeBtn = document.createElement('button');
  closeBtn.textContent = '✕';
  closeBtn.style.cssText = `
    background: none;
    border: none;
    color: inherit;
    font-size: 1.2rem;
    cursor: pointer;
    margin-left: 1rem;
    padding: 0;
    opacity: 0.7;
  `;
  closeBtn.onmouseover = () => closeBtn.style.opacity = '1';
  closeBtn.onmouseout = () => closeBtn.style.opacity = '0.7';
  closeBtn.onclick = () => notification.remove();
  
  notification.appendChild(closeBtn);
  
  return notification;
}

/**
 * Show notification with action button
 * @param {string} message - Notification message
 * @param {string} actionText - Button text
 * @param {Function} actionCallback - Button click handler
 * @param {string} type - Notification type
 */
export function showActionNotification(message, actionText, actionCallback, type = 'info') {
  const container = document.createElement('div');
  container.className = `notification notification-${type}`;
  
  Object.assign(container.style, {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    padding: '1rem 1.5rem',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    zIndex: '10000',
    animation: 'slideIn 0.3s ease-out',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    maxWidth: '400px',
    background: '#3b82f6',
    color: '#fff'
  });
  
  const text = document.createElement('span');
  text.textContent = message;
  text.style.flex = '1';
  
  const button = document.createElement('button');
  button.textContent = actionText;
  button.style.cssText = `
    background: rgba(255,255,255,0.2);
    border: 1px solid rgba(255,255,255,0.3);
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 600;
    white-space: nowrap;
  `;
  button.onmouseover = () => button.style.background = 'rgba(255,255,255,0.3)';
  button.onmouseout = () => button.style.background = 'rgba(255,255,255,0.2)';
  button.onclick = () => {
    actionCallback();
    container.remove();
  };
  
  container.appendChild(text);
  container.appendChild(button);
  document.body.appendChild(container);
  
  return container;
}

// Add CSS animations if not already present
if (!document.getElementById('notification-styles')) {
  const style = document.createElement('style');
  style.id = 'notification-styles';
  style.textContent = `
    @keyframes slideIn {
      from {
        transform: translateX(400px);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
    
    @keyframes slideOut {
      from {
        transform: translateX(0);
        opacity: 1;
      }
      to {
        transform: translateX(400px);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);
}
