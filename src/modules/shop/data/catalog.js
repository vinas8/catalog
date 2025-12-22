/**
 * Catalog - Product loading from Worker API (KV)
 * JSON files only for tests and virtual snakes
 */

let catalogCache = null;

/**
 * Load catalog from Worker API (production) or fallback to JSON (tests)
 * @returns {Promise<Array>} Array of product items
 */
export async function loadCatalog() {
  if (catalogCache) {
    return catalogCache;
  }
  
  try {
    // Import worker config
    const { WORKER_CONFIG } = await import('../../../config/worker-config.js');
    
    // Try Worker API first (production - real snakes from KV)
    console.log('📡 Fetching products from Worker API...');
    const workerUrl = `${WORKER_CONFIG.WORKER_URL}/products`;
    const response = await fetch(workerUrl);
    
    if (response.ok) {
      const data = await response.json();
      
      // Handle different response formats
      catalogCache = Array.isArray(data) ? data : (data.products || []);
      console.log('✅ Loaded from Worker API:', catalogCache.length, 'products');
      return catalogCache;
    }
    
    console.warn('⚠️ Worker API failed, trying fallback...');
    
  } catch (error) {
    console.warn('⚠️ Worker API error:', error.message);
  }
  
  // Fallback to JSON (tests/development only)
  try {
    console.log('📄 Falling back to JSON file...');
    const cacheBuster = Date.now();
    const response = await fetch(`./docs/temp/test-data/products.json?v=${cacheBuster}`);
    
    if (!response.ok) {
      throw new Error(`Failed to load catalog: ${response.status}`);
    }
    
    catalogCache = await response.json();
    console.log('✅ Loaded from JSON:', catalogCache);
    return catalogCache;
    
  } catch (error) {
    console.error('❌ All catalog sources failed:', error);
    return [];
  }
}

/**
 * Get all available products
 * @returns {Promise<Array>}
 */
export async function getAvailableProducts() {
  const catalog = await loadCatalog();
  return catalog.filter(product => product.status === 'available');
}

/**
 * Filter products by species
 * @param {string} species - Species to filter by (e.g., 'ball_python', 'corn_snake')
 * @returns {Promise<Array>}
 */
export async function getProductsBySpecies(species) {
  const products = await getAvailableProducts();
  if (!species || species === 'all') {
    return products;
  }
  return products.filter(product => product.species === species);
}

/**
 * Get product by ID
 * @param {string} id - Product ID
 * @returns {Promise<Object|null>}
 */
export async function getProductById(id) {
  const catalog = await loadCatalog();
  return catalog.find(product => product.id === id) || null;
}

/**
 * Get all unique species in catalog
 * @returns {Promise<Array>}
 */
export async function getCatalogSpecies() {
  const catalog = await loadCatalog();
  const species = [...new Set(catalog.map(p => p.species))];
  return species;
}

/**
 * Clear the cache (useful for reloading)
 */
export function clearCatalogCache() {
  catalogCache = null;
}
