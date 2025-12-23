// Reusable Catalog Renderer
// Used by both catalog.html and game.html

import { getProductsBySpecies, loadCatalog } from '../data/catalog.js';
import { SPECIES_PROFILES } from '../data/species-profiles.js';
import { FEATURE_FLAGS } from '../../config/feature-flags.js';

/**
 * Render catalog items for game.html
 * @param {HTMLElement} container - Container element
 * @param {string} selectedSpecies - Species filter ('all', 'ball_python', 'corn_snake')
 */
export async function renderGameCatalog(container, selectedSpecies = 'all') {
  container.innerHTML = '<div class="loading">Loading catalog...</div>';
  
  try {
    console.log('🔄 Loading products for species:', selectedSpecies);
    const products = await getProductsBySpecies(selectedSpecies);
    console.log('✅ Loaded products:', products);
    
    if (products.length === 0) {
      container.innerHTML = '<div class="empty-state">No snakes available in this category</div>';
      return;
    }
    
    // Render products
    container.innerHTML = products.map(item => `
      <div class="catalog-item" data-species="${item.species}">
        <div class="item-image">${item.image || '🐍'}</div>
        <h3>${item.name}</h3>
        <p class="species-info">${SPECIES_PROFILES[item.species]?.common_name || item.species} - ${item.morph}</p>
        <p class="item-description">${item.description}</p>
        <p class="item-info">${item.info}</p>
        <div class="item-price">$${typeof item.price === 'number' ? item.price.toFixed(2) : item.price}</div>
        <a href="${item.stripe_link}" target="_blank" class="primary-btn">
          💳 Buy with Stripe
        </a>
      </div>
    `).join('');
  } catch (error) {
    console.error('❌ Error loading catalog:', error);
    container.innerHTML = '<div class="error-state">Failed to load catalog. Please try again.</div>';
  }
}

/**
 * Render catalog for catalog.html (includes worker status check)
 * @param {string} selectedSpecies - Species filter
 * @param {Function} getUserHash - Function to get user hash
 */
export async function renderStandaloneCatalog(selectedSpecies = 'all', getUserHash) {
  const availableContainer = document.getElementById('available-snakes');
  const virtualContainer = document.getElementById('virtual-snakes');
  const soldContainer = document.getElementById('sold-snakes');
  const soldCount = document.getElementById('sold-count');

  console.log('🔄 renderStandaloneCatalog START', { selectedSpecies });
  
  availableContainer.innerHTML = '<div class="loading">Loading...</div>';
  virtualContainer.innerHTML = '<div class="loading">Loading...</div>';

  try {
    // Use same approach as debug demo - direct fetch
    console.log('📡 Fetching products from Worker API directly...');
    const workerUrl = 'https://catalog.navickaszilvinas.workers.dev/products';
    const response = await fetch(workerUrl);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Handle array response (same as debug demo)
    const allProducts = Array.isArray(data) ? data : (data.products || []);
    console.log('✅ Loaded products:', allProducts.length);
    
    // Filter by species if needed
    const filteredProducts = selectedSpecies === 'all' 
      ? allProducts 
      : allProducts.filter(p => p.species === selectedSpecies);
    
    console.log('✅ After species filter:', filteredProducts.length, 'products');
    
    // Separate by type
    const realProducts = filteredProducts.filter(p => p.type === 'real');
    const virtualProducts = FEATURE_FLAGS.ENABLE_VIRTUAL_SNAKES 
      ? filteredProducts.filter(p => p.type === 'virtual')
      : [];
    
    console.log('✅ Real products:', realProducts.length, 'Virtual:', virtualProducts.length);
    
    // Products from worker already have status - no need for individual checks!
    // Just ensure default status if missing
    realProducts.forEach(product => {
      if (!product.status) {
        product.status = 'available';
      }
    });
    
    // Separate by availability
    const available = realProducts.filter(p => p.status === 'available');
    const sold = realProducts.filter(p => p.status === 'sold');

    console.log('✅ Available:', available.length, 'Sold:', sold.length);

    const userHash = getUserHash();
    console.log('✅ User hash:', userHash);

    // Render available real snakes
    if (available.length === 0) {
      availableContainer.innerHTML = '<div class="empty-state">No snakes available</div>';
    } else {
      console.log('🎨 Rendering', available.length, 'available snakes');
      availableContainer.innerHTML = available.map(item => renderProductCard(item, userHash, false)).join('');
    }

    // Render virtual snakes
    if (virtualProducts.length === 0) {
      virtualContainer.innerHTML = '<div class="empty-state">No virtual snakes configured</div>';
    } else {
      console.log('🎨 Rendering', virtualProducts.length, 'virtual snakes');
      virtualContainer.innerHTML = virtualProducts.map(item => renderVirtualCard(item)).join('');
    }

    // Render sold snakes
    soldCount.textContent = `(${sold.length})`;
    if (sold.length === 0) {
      soldContainer.innerHTML = '<div class="empty-state">No snakes sold yet</div>';
    } else {
      console.log('🎨 Rendering', sold.length, 'sold snakes');
      soldContainer.innerHTML = sold.map(item => renderProductCard(item, userHash, true)).join('');
    }

    console.log('✅ renderStandaloneCatalog COMPLETE');

  } catch (error) {
    console.error('❌ Catalog render error:', error);
    availableContainer.innerHTML = `<div class="error-state">Failed to load: ${error.message}<br><a href="debug.html">Check Debug Dashboard</a></div>`;
    virtualContainer.innerHTML = `<div class="error-state">Error loading catalog</div>`;
  }
}

/**
 * Check product status from worker (with timeout)
 */
async function checkProductStatus(productId) {
  try {
    // Add 5 second timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const response = await fetch(`https://catalog.navickaszilvinas.workers.dev/product-status?id=${productId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (response.ok) {
      return await response.json();
    }
    console.warn('Status check failed for', productId, 'status:', response.status);
  } catch (err) {
    if (err.name === 'AbortError') {
      console.warn('Status check timeout for', productId);
    } else {
      console.warn('Could not check status for', productId, err.message);
    }
  }
  // Default to available if check fails
  return { product_id: productId, status: 'available', owner_id: null };
}

/**
 * Render product card (real snake)
 */
function renderProductCard(item, userHash, isSold) {
  // Safely handle price - default to 0 if missing or invalid
  const price = typeof item.price === 'number' && !isNaN(item.price) ? item.price : 0;
  const priceFormatted = price.toFixed(2);
  
  let checkoutUrl = item.stripe_link;
  if (checkoutUrl && checkoutUrl.includes('stripe.com')) {
    checkoutUrl += `?client_reference_id=${userHash}&prefilled_email={CHECKOUT_SESSION_EMAIL}`;
  }

  const soldClass = isSold ? 'sold' : '';
  const soldBadge = isSold ? '<span class="sold-badge">SOLD</span>' : '';
  
  // Hide buy button if no valid stripe link or price
  const canBuy = checkoutUrl && price > 0;
  const buyButton = isSold ? 
    '<button class="primary-btn" disabled style="opacity: 0.5; cursor: not-allowed;">Sold Out</button>' :
    canBuy ? 
      `<a href="${checkoutUrl}" target="_blank" class="primary-btn" rel="noopener" 
         onclick="
           console.log('🛒 Initiating purchase with hash:', '${userHash}');
           localStorage.setItem('serpent_pending_purchase_hash', '${userHash}');
           localStorage.setItem('serpent_last_purchase_hash', '${userHash}');
           localStorage.setItem('serpent_user_hash', '${userHash}');
           sessionStorage.setItem('serpent_purchase_hash', '${userHash}');
           console.log('✅ Hash saved to all storage locations');
         ">
        💳 Buy Now - $${priceFormatted}
      </a>` :
      '<button class="primary-btn" disabled style="opacity: 0.5; cursor: not-allowed;">Price Not Set</button>';

  return `
    <div class="catalog-item ${soldClass}" itemscope itemtype="http://schema.org/Product">
      ${soldBadge}
      <div class="item-image">${item.image || '🐍'}</div>
      <h3 itemprop="name">${item.name}</h3>
      <p class="species-info">${SPECIES_PROFILES[item.species]?.common_name || item.species} - ${item.morph}</p>
      <p itemprop="description">${item.description || ''}</p>
      <p class="item-info">${item.info || ''}</p>
      <div class="item-price" itemprop="offers" itemscope itemtype="http://schema.org/Offer">
        <span itemprop="price">$${priceFormatted}</span>
        <meta itemprop="priceCurrency" content="USD">
      </div>
      ${buyButton}
    </div>
  `;
}

/**
 * Render virtual card
 */
function renderVirtualCard(item) {
  const price = typeof item.price === 'number' && !isNaN(item.price) ? item.price : 0;
  
  return `
    <div class="catalog-item virtual" itemscope itemtype="http://schema.org/Product">
      <span class="virtual-badge">VIRTUAL</span>
      <div class="item-image">${item.image || '🐍'}</div>
      <h3 itemprop="name">${item.name}</h3>
      <p class="species-info">${SPECIES_PROFILES[item.species]?.common_name || item.species} - ${item.morph || 'unknown'}</p>
      <p itemprop="description">${item.description || ''}</p>
      <p class="item-info">${item.info || ''}</p>
      <div class="item-price gold-price">
        <span>🪙 ${price} Gold</span>
      </div>
      <button class="primary-btn" onclick="alert('Open game.html to buy virtual snakes with gold!')">
        🎮 Buy in Game
      </button>
    </div>
  `;
}
