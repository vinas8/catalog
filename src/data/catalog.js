// Catalog loader - loads available snakes from products.json
// This serves as an adapter between the JSON file and the game

let catalogCache = null;

/**
 * Load catalog from products.json
 * @returns {Promise<Array>} Array of product items
 */
export async function loadCatalog() {
  if (catalogCache) {
    return catalogCache;
  }
  
  try {
    // Add cache buster to force fresh load
    const cacheBuster = Date.now();
    const response = await fetch(`/data/products.json?v=${cacheBuster}`);
    if (!response.ok) {
      throw new Error(`Failed to load catalog: ${response.status}`);
    }
    catalogCache = await response.json();
    console.log('📦 Loaded catalog:', catalogCache);
    return catalogCache;
  } catch (error) {
    console.error('Error loading catalog:', error);
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
