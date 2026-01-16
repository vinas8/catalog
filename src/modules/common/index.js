/**
 * Common Module - Core System & Constants
 * Enable/Disable: Set ENABLED = true/false (required by other modules)
 */

export const ENABLED = true;

export * from './core.js?v=0.7.7';  // Export all functions from core
export * from './constants.js?v=0.7.7';
export { getSnakeAvatar } from './snake-avatar.js?v=0.7.7';
