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

  availableContainer.innerHTML = '<div class="loading">Loading...</div>';
  virtualContainer.innerHTML = '<div class="loading">Loading...</div>';

  try {
    // Load ALL products (not just available)
    const allProducts = await loadCatalog();
    
    // Filter by species if needed
    const filteredProducts = selectedSpecies === 'all' 
      ? allProducts 
      : allProducts.filter(p => p.species === selectedSpecies);
    
    // Separate by type
    const realProducts = filteredProducts.filter(p => p.type === 'real');
    const virtualProducts = FEATURE_FLAGS.ENABLE_VIRTUAL_SNAKES 
      ? filteredProducts.filter(p => p.type === 'virtual')
      : [];
    
    // Check status from worker for real snakes
    const statusPromises = realProducts.map(p => checkProductStatus(p.id));
    const statuses = await Promise.all(statusPromises);
    
    // Merge status data
    realProducts.forEach((product, index) => {
      const status = statuses[index];
      product.status = status.status;
      product.owner_id = status.owner_id;
    });
    
    // Separate by availability
    const available = realProducts.filter(p => p.status === 'available');
    const sold = realProducts.filter(p => p.status === 'sold');

    const userHash = getUserHash();

    // Render available real snakes
    if (available.length === 0) {
      availableContainer.innerHTML = '<div class="empty-state">No snakes available</div>';
    } else {
      availableContainer.innerHTML = available.map(item => renderProductCard(item, userHash, false)).join('');
    }

    // Render virtual snakes
    if (virtualProducts.length === 0) {
      virtualContainer.innerHTML = '<div class="empty-state">No virtual snakes configured</div>';
    } else {
      virtualContainer.innerHTML = virtualProducts.map(item => renderVirtualCard(item)).join('');
    }

    // Render sold snakes
    soldCount.textContent = `(${sold.length})`;
    if (sold.length === 0) {
      soldContainer.innerHTML = '<div class="empty-state">No snakes sold yet</div>';
    } else {
      soldContainer.innerHTML = sold.map(item => renderProductCard(item, userHash, true)).join('');
    }

  } catch (error) {
    console.error('Error:', error);
    availableContainer.innerHTML = '<div class="error-state">Failed to load</div>';
    virtualContainer.innerHTML = '<div class="error-state">Failed to load</div>';
  }
}

/**
 * Check product status from worker
 */
async function checkProductStatus(productId) {
  try {
    const response = await fetch(`https://catalog.navickaszilvinas.workers.dev/product-status?id=${productId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    if (response.ok) {
      return await response.json();
    }
    console.warn('Status check failed for', productId, 'status:', response.status);
  } catch (err) {
    console.warn('Could not check status for', productId, err.message);
  }
  // Default to available if check fails
  return { product_id: productId, status: 'available', owner_id: null };
}

/**
 * Render product card (real snake)
 */
function renderProductCard(item, userHash, isSold) {
  let checkoutUrl = item.stripe_link;
  if (checkoutUrl && checkoutUrl.includes('stripe.com')) {
    checkoutUrl += `?client_reference_id=${userHash}&prefilled_email={CHECKOUT_SESSION_EMAIL}`;
  }

  const soldClass = isSold ? 'sold' : '';
  const soldBadge = isSold ? '<span class="sold-badge">SOLD</span>' : '';
  const buyButton = isSold ? 
    '<button class="primary-btn" disabled style="opacity: 0.5; cursor: not-allowed;">Sold Out</button>' :
    `<a href="${checkoutUrl}" target="_blank" class="primary-btn" rel="noopener" 
       onclick="
         console.log('🛒 Initiating purchase with hash:', '${userHash}');
         localStorage.setItem('serpent_pending_purchase_hash', '${userHash}');
         localStorage.setItem('serpent_last_purchase_hash', '${userHash}');
         localStorage.setItem('serpent_user_hash', '${userHash}');
         sessionStorage.setItem('serpent_purchase_hash', '${userHash}');
         console.log('✅ Hash saved to all storage locations');
       ">
      💳 Buy Now - $${item.price.toFixed(2)}
    </a>`;

  return `
    <div class="catalog-item ${soldClass}" itemscope itemtype="http://schema.org/Product">
      ${soldBadge}
      <div class="item-image">${item.image || '🐍'}</div>
      <h3 itemprop="name">${item.name}</h3>
      <p class="species-info">${SPECIES_PROFILES[item.species]?.common_name || item.species} - ${item.morph}</p>
      <p itemprop="description">${item.description}</p>
      <p class="item-info">${item.info}</p>
      <div class="item-price" itemprop="offers" itemscope itemtype="http://schema.org/Offer">
        <span itemprop="price">$${item.price.toFixed(2)}</span>
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
  return `
    <div class="catalog-item virtual" itemscope itemtype="http://schema.org/Product">
      <span class="virtual-badge">VIRTUAL</span>
      <div class="item-image">${item.image || '🐍'}</div>
      <h3 itemprop="name">${item.name}</h3>
      <p class="species-info">${SPECIES_PROFILES[item.species]?.common_name || item.species} - ${item.morph}</p>
      <p itemprop="description">${item.description}</p>
      <p class="item-info">${item.info}</p>
      <div class="item-price gold-price">
        <span>🪙 ${item.price} Gold</span>
      </div>
      <button class="primary-btn" onclick="alert('Open game.html to buy virtual snakes with gold!')">
        🎮 Buy in Game
      </button>
    </div>
  `;
}
