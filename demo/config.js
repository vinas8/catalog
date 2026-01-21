// Demo version config - imports from global version
export { VERSION_CONFIG } from '../src/config/version.js';
export const DEMO_VERSION = VERSION_CONFIG?.CACHE_BUSTER || '0.7.92';
