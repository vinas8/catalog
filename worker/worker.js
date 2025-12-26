/**
 * Cloudflare Worker for Snake Muffin v0.5.0
 * 
 * Version: 0.5.0
 * Last Updated: 2025-12-25
 *
 * Expected bindings:
 * - USER_PRODUCTS (KV namespace) - Stores user's purchased snakes
 * - PRODUCT_STATUS (KV namespace) - Tracks which products are sold
 * - PRODUCTS (KV namespace) - Product catalog ⭐ NEW
 * - STRIPE_SECRET_KEY (secret) - Stripe API key for session fetch
 *
 * Endpoints:
 * - POST /stripe-webhook  (Stripe webhook)
 * - GET  /user-products?user=<hash>  (Get user's snakes)
 * - GET  /products  (Get product catalog from KV)
 * - GET  /product-status?id=<product_id>  (Check if product is sold)
 * - GET  /session-info?session_id=<id>  (Get Stripe session data) ⭐ NEW
 * - GET  /version  (Get worker version) ⭐ NEW
 *
 * Features:
 * - Hash-based user authentication (user ID in URL)
 * - Stores user products in KV
 * - Handles Stripe checkout.session.completed events
 * - Assigns snakes to users by hash
 * - Tracks sold status for unique real snakes
 * - Serves product catalog from KV (not JSON files)
 * - Fetches user hash from Stripe session API
 *
 * Deployment:
 * - wrangler publish
 * - Bind KV namespaces: USER_PRODUCTS, PRODUCT_STATUS, PRODUCTS
 */

const WORKER_VERSION = '0.5.0';
const WORKER_UPDATED = '2025-12-25T15:59:00Z';

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const pathname = url.pathname;

    // CORS headers for all requests
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Stripe-Signature',
      'Content-Type': 'application/json'
    };

    // Handle OPTIONS (preflight)
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: corsHeaders
      });
    }

    // Route: POST /stripe-webhook
    if (pathname === '/stripe-webhook' && request.method === 'POST') {
      return handleStripeWebhook(request, env, corsHeaders);
    }

    // Route: GET /user-products?user=HASH
    if (pathname === '/user-products' && request.method === 'GET') {
      return handleGetUserProducts(request, env, corsHeaders);
    }

    // Route: GET /products (available products)
    if (pathname === '/products' && request.method === 'GET') {
      return handleGetProducts(request, env, corsHeaders);
    }

    // Route: GET /product-status?id=PRODUCT_ID
    if (pathname === '/product-status' && request.method === 'GET') {
      return handleGetProductStatus(request, env, corsHeaders);
    }

    // Route: POST /assign-product (manual assignment, for testing)
    if (pathname === '/assign-product' && request.method === 'POST') {
      return handleAssignProduct(request, env, corsHeaders);
    }

    // Route: POST /register-user (save user data after purchase)
    if (pathname === '/register-user' && request.method === 'POST') {
      return handleRegisterUser(request, env, corsHeaders);
    }

    // Route: GET /user-data?user=HASH (get user profile)
    if (pathname === '/user-data' && request.method === 'GET') {
      return handleGetUserData(request, env, corsHeaders);
    }

    // Route: GET /session-info?session_id=xxx (get Stripe session data)
    if (pathname === '/session-info' && request.method === 'GET') {
      return handleGetSessionInfo(request, env, corsHeaders);
    }

    // Route: POST /stripe-product-webhook (Stripe product sync)
    if (pathname === '/stripe-product-webhook' && request.method === 'POST') {
      return handleStripeProductWebhook(request, env, corsHeaders);
    }

    // Route: GET /kv/list-products (proxy to KV API for browser)
    if (pathname === '/kv/list-products' && request.method === 'GET') {
      return handleKVListProducts(env, corsHeaders);
    }

    // Route: GET /kv/get-product?id=PRODUCT_ID (proxy to KV API)
    if (pathname === '/kv/get-product' && request.method === 'GET') {
      return handleKVGetProduct(request, env, corsHeaders);
    }

    // Route: GET /version (get worker version)
    if (pathname === '/version' && request.method === 'GET') {
      return new Response(JSON.stringify({
        version: WORKER_VERSION,
        updated: WORKER_UPDATED,
        timestamp: new Date().toISOString(),
        endpoints: [
          'POST /stripe-webhook',
          'GET /user-products?user=<hash>',
          'GET /products',
          'GET /product-status?id=<id>',
          'GET /session-info?session_id=<id>',
          'GET /version'
        ]
      }), {
        status: 200,
        headers: corsHeaders
      });
    }

    return new Response(JSON.stringify({ error: 'Not found' }), { 
      status: 404,
      headers: corsHeaders
    });
  }
};

/**
 * Handle Stripe webhook - assign product to user
 */
async function handleStripeWebhook(request, env, corsHeaders) {
  console.log('📥 Webhook received');
  
  let payload;
  try {
    payload = await request.json();
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), { 
      status: 400,
      headers: corsHeaders
    });
  }

  // Get event type
  const eventType = payload.type || (payload.data && payload.data.object);
  console.log('Event type:', eventType);

  // Handle checkout.session.completed
  if (eventType === 'checkout.session.completed') {
    const session = payload.data?.object || payload;
    
    // Get user hash from client_reference_id
    const userHash = session.client_reference_id;
    
    // Get product from metadata or line items
    const metadata = session.metadata || {};
    const productId = metadata.product_id || session.line_items?.data[0]?.price?.product;

    if (!userHash || !productId) {
      console.log('❌ Missing userHash or productId');
      return new Response(JSON.stringify({ 
        error: 'Missing user hash or product ID',
        userHash,
        productId
      }), { 
        status: 400,
        headers: corsHeaders
      });
    }

    console.log('✅ Assigning product:', productId, 'to user:', userHash);

    // Fetch product details from PRODUCTS KV
    let productDetails = null;
    try {
      const productData = await env.PRODUCTS.get(`product:${productId}`);
      if (productData) {
        productDetails = JSON.parse(productData);
        console.log('📦 Found product details:', productDetails.name);
      } else {
        console.log('⚠️ Product not found in KV, using generic data');
      }
    } catch (err) {
      console.log('⚠️ Error fetching product:', err.message);
    }

    // Create user product entry with actual product details
    const userProduct = {
      assignment_id: `assign_${Date.now()}`,
      user_id: userHash,
      product_id: productId,
      product_type: 'real',
      // Use actual product data if available
      name: productDetails?.name || `Snake ${Date.now()}`,
      nickname: productDetails?.name || `Snake ${Date.now()}`,
      species: productDetails?.species || 'unknown',
      morph: productDetails?.morph || 'normal',
      description: productDetails?.description || '',
      image: productDetails?.images?.[0] || null,
      acquired_at: new Date().toISOString(),
      acquisition_type: 'stripe_purchase',
      payment_id: session.payment_intent || session.id,
      price_paid: session.amount_total,
      currency: session.currency || 'eur',
      stats: {
        hunger: 100,
        water: 100,
        temperature: 80,
        humidity: 50,
        health: 100,
        stress: 10,
        cleanliness: 100,
        happiness: 100
      }
    };

    // Store in KV - key by user hash
    const kvKey = `user:${userHash}`;
    try {
      // Get existing products
      const existing = await env.USER_PRODUCTS.get(kvKey);
      let userProducts = [];
      if (existing) {
        try {
          userProducts = JSON.parse(existing);
        } catch (e) {
          userProducts = [];
        }
      }

      // Add new product
      userProducts.push(userProduct);

      // Save back to KV
      await env.USER_PRODUCTS.put(kvKey, JSON.stringify(userProducts));

      console.log('✅ Saved to USER_PRODUCTS KV');

      // Mark product as sold in PRODUCT_STATUS KV
      if (env.PRODUCT_STATUS) {
        const statusKey = `product:${productId}`;
        const statusData = {
          status: 'sold',
          owner_id: userHash,
          sold_at: new Date().toISOString(),
          payment_id: session.payment_intent || session.id
        };
        await env.PRODUCT_STATUS.put(statusKey, JSON.stringify(statusData));
        console.log('✅ Marked product as sold in PRODUCT_STATUS KV');
      }

      return new Response(JSON.stringify({ 
        success: true,
        message: 'Product assigned to user and marked as sold',
        user_id: userHash,
        product_id: productId
      }), {
        status: 200,
        headers: corsHeaders
      });
    } catch (err) {
      console.error('❌ KV error:', err);
      return new Response(JSON.stringify({ error: 'Database error' }), {
        status: 500,
        headers: corsHeaders
      });
    }
  }

  // Ignore other events
  return new Response(JSON.stringify({ message: 'Event ignored' }), {
    status: 200,
    headers: corsHeaders
  });
}

/**
 * Handle GET /product-status?id=PRODUCT_ID - check if product is sold
 */
async function handleGetProductStatus(request, env, corsHeaders) {
  const url = new URL(request.url);
  const productId = url.searchParams.get('id');

  if (!productId) {
    return new Response(JSON.stringify({ error: 'Missing product ID' }), {
      status: 400,
      headers: corsHeaders
    });
  }

  try {
    if (!env.PRODUCT_STATUS) {
      // If PRODUCT_STATUS not bound, assume all available
      return new Response(JSON.stringify({ 
        product_id: productId,
        status: 'available',
        owner_id: null
      }), {
        status: 200,
        headers: corsHeaders
      });
    }

    const statusKey = `product:${productId}`;
    const statusData = await env.PRODUCT_STATUS.get(statusKey);

    if (!statusData) {
      // Product not in KV = available
      return new Response(JSON.stringify({ 
        product_id: productId,
        status: 'available',
        owner_id: null
      }), {
        status: 200,
        headers: corsHeaders
      });
    }

    // Parse and enrich status data
    const parsedStatus = JSON.parse(statusData);
    parsedStatus.product_id = productId; // Add product_id to response
    
    return new Response(JSON.stringify(parsedStatus), {
      status: 200,
      headers: corsHeaders
    });

  } catch (err) {
    console.error('❌ Error checking product status:', err);
    return new Response(JSON.stringify({ 
      error: 'Failed to check status',
      details: err.message
    }), {
      status: 500,
      headers: corsHeaders
    });
  }
}

/**
 * Get user's products by hash
 */
async function handleGetUserProducts(request, env, corsHeaders) {
  const url = new URL(request.url);
  const userHash = url.searchParams.get('user');

  if (!userHash) {
    return new Response(JSON.stringify({ error: 'Missing user parameter' }), {
      status: 400,
      headers: corsHeaders
    });
  }

  const kvKey = `user:${userHash}`;
  try {
    const data = await env.USER_PRODUCTS.get(kvKey);
    
    if (!data) {
      // No products yet - return empty array
      return new Response(JSON.stringify([]), {
        status: 200,
        headers: corsHeaders
      });
    }

    return new Response(data, {
      status: 200,
      headers: corsHeaders
    });
  } catch (err) {
    console.error('KV error:', err);
    return new Response(JSON.stringify({ error: 'Database error' }), {
      status: 500,
      headers: corsHeaders
    });
  }
}

/**
 * Get all available products (with fallback to defaults)
 */
async function handleGetProducts(request, env, corsHeaders) {
  try {
    // Check if PRODUCTS namespace is bound
    if (!env.PRODUCTS) {
      console.warn('⚠️ PRODUCTS namespace not bound, using default snakes');
      
      // Return default snakes with Stripe link
      const defaultProducts = [
        {
          id: "prod_TdKcnyjt5Jk0U2",
          name: "Batman Ball",
          description: "Premium Ball Python",
          images: ["https://files.stripe.com/links/MDB8YWNjdF8xU2czczBCakw3MnBlOVhzfGZsX3Rlc3RfWFB6ckpsNG9yUThEbGVObnBLeTlIOW5i00TIJlhXUK"],
          species: "ball_python",
          morph: "banana",
          price: 1000.00,
          currency: "eur",
          stripe_link: "https://buy.stripe.com/test_cNibJ04XLbUsaNQ8uPbjW00",
          status: "available",
          source: "stripe"
        }
      ];
      
      return new Response(JSON.stringify({
        products: defaultProducts,
        count: defaultProducts.length,
        source: "fallback"
      }), {
        status: 200,
        headers: corsHeaders
      });
    }

    // Get product index
    const indexData = await env.PRODUCTS.get('_index:products');
    if (!indexData) {
      console.warn('⚠️ Product index not found in KV');
      return new Response(JSON.stringify([]), {
        status: 200,
        headers: corsHeaders
      });
    }

    const productIds = JSON.parse(indexData);
    console.log(`📦 Loading ${productIds.length} products from KV`);

    // Fetch all products
    const products = [];
    for (const id of productIds) {
      const key = `product:${id}`;
      const productData = await env.PRODUCTS.get(key);
      if (productData) {
        products.push(JSON.parse(productData));
      }
    }

    console.log(`✅ Returning ${products.length} products from KV`);
    return new Response(JSON.stringify(products), {
      status: 200,
      headers: corsHeaders
    });

  } catch (err) {
    console.error('❌ Error loading products from KV:', err);
    return new Response(JSON.stringify({
      error: 'Failed to load products',
      details: err.message,
      message: 'Fallback to GitHub Pages: /data/products.json'
    }), {
      status: 500,
      headers: corsHeaders
    });
  }
}

/**
 * Manual assignment (for testing)
 */
async function handleAssignProduct(request, env, corsHeaders) {
  let body;
  try {
    body = await request.json();
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
      status: 400,
      headers: corsHeaders
    });
  }

  const { user_id, product_id } = body;

  if (!user_id || !product_id) {
    return new Response(JSON.stringify({ 
      error: 'Missing user_id or product_id' 
    }), {
      status: 400,
      headers: corsHeaders
    });
  }

  const userProduct = {
    assignment_id: `assign_${Date.now()}`,
    user_id: user_id,
    product_id: product_id,
    product_type: 'real',
    nickname: `Snake ${Date.now()}`,
    acquired_at: new Date().toISOString(),
    acquisition_type: 'manual_test',
    payment_id: null,
    price_paid: 0,
    currency: 'test',
    stats: {
      hunger: 100,
      water: 100,
      health: 100,
      happiness: 100
    }
  };

  const kvKey = `user:${user_id}`;
  try {
    const existing = await env.USER_PRODUCTS.get(kvKey);
    let userProducts = [];
    if (existing) {
      try {
        userProducts = JSON.parse(existing);
      } catch (e) {
        userProducts = [];
      }
    }

    userProducts.push(userProduct);
    await env.USER_PRODUCTS.put(kvKey, JSON.stringify(userProducts));

    return new Response(JSON.stringify({ 
      success: true,
      user_product: userProduct
    }), {
      status: 200,
      headers: corsHeaders
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Database error' }), {
      status: 500,
      headers: corsHeaders
    });
  }
}

/**
 * Register new user after purchase
 */
async function handleRegisterUser(request, env, corsHeaders) {
  let body;
  try {
    body = await request.json();
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
      status: 400,
      headers: corsHeaders
    });
  }

  const { user_id, username, email, stripe_session_id } = body;

  if (!user_id || !username || !email) {
    return new Response(JSON.stringify({ 
      error: 'Missing required fields: user_id, username, email' 
    }), {
      status: 400,
      headers: corsHeaders
    });
  }

  // Create user profile
  const userProfile = {
    user_id,
    username,
    email,
    created_at: new Date().toISOString(),
    loyalty_points: 0,
    loyalty_tier: 'bronze',
    stripe_session_id: stripe_session_id || null
  };

  // Store in KV under 'userdata:' prefix
  const kvKey = `userdata:${user_id}`;
  try {
    await env.USER_PRODUCTS.put(kvKey, JSON.stringify(userProfile));
    
    console.log('✅ User registered:', user_id, username);

    return new Response(JSON.stringify({ 
      success: true,
      user: userProfile
    }), {
      status: 200,
      headers: corsHeaders
    });
  } catch (err) {
    console.error('❌ User registration error:', err);
    return new Response(JSON.stringify({ error: 'Database error' }), {
      status: 500,
      headers: corsHeaders
    });
  }
}

/**
 * Get user profile data
 */
async function handleGetUserData(request, env, corsHeaders) {
  const url = new URL(request.url);
  const userHash = url.searchParams.get('user');

  if (!userHash) {
    return new Response(JSON.stringify({ error: 'Missing user parameter' }), {
      status: 400,
      headers: corsHeaders
    });
  }

  const kvKey = `userdata:${userHash}`;
  try {
    const userData = await env.USER_PRODUCTS.get(kvKey);
    
    if (!userData) {
      return new Response(JSON.stringify({ 
        error: 'User not found' 
      }), {
        status: 404,
        headers: corsHeaders
      });
    }

    return new Response(userData, {
      status: 200,
      headers: corsHeaders
    });
  } catch (err) {
    console.error('❌ Get user data error:', err);
    return new Response(JSON.stringify({ error: 'Database error' }), {
      status: 500,
      headers: corsHeaders
    });
  }
}

/**
 * Handle Stripe Product Webhook - Auto-sync products to KV
 * Events: product.created, product.updated, product.deleted, price.updated
 */
export async function handleStripeProductWebhook(eventOrRequest, env, corsHeaders) {
  console.log('📥 Product webhook received');
  
  let event;
  
  // Handle both Request objects (from Worker) and plain event objects (from tests)
  if (eventOrRequest.json) {
    // It's a Request object from the Worker
    try {
      event = await eventOrRequest.json();
    } catch (err) {
      return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
        status: 400,
        headers: corsHeaders
      });
    }
  } else {
    // It's a plain event object from tests
    event = eventOrRequest;
  }
  
  const eventType = event.type;
  console.log('Event type:', eventType);
  
  try {
    switch (eventType) {
      case 'product.created':
      case 'product.updated':
        await updateProductInKV(event.data.object, env);
        break;
      
      case 'product.deleted':
        await deleteProductFromKV(event.data.object.id, env);
        break;
      
      case 'price.created':
      case 'price.updated':
        await updatePriceInKV(event.data.object, env);
        break;
      
      default:
        console.log('Ignoring event type:', eventType);
    }
    
    // Return Response if called from Worker, void if called from test
    if (corsHeaders) {
      return new Response(JSON.stringify({ received: true, eventType }), {
        status: 200,
        headers: corsHeaders
      });
    }
  } catch (err) {
    console.error('❌ Webhook error:', err);
    if (corsHeaders) {
      return new Response(JSON.stringify({ error: err.message }), {
        status: 500,
        headers: corsHeaders
      });
    }
    throw err;
  }
}

/**
 * Convert Stripe product to our schema and save to KV
 */
async function updateProductInKV(stripeProduct, env) {
  console.log('📝 Updating product:', stripeProduct.id);
  
  // Convert Stripe format to our format
  const product = {
    id: stripeProduct.id,
    name: stripeProduct.name,
    description: stripeProduct.description || '',
    images: stripeProduct.images || [],
    species: stripeProduct.metadata?.species || 'ball_python',
    morph: stripeProduct.metadata?.morph || 'normal',
    sex: stripeProduct.metadata?.sex || 'unknown',
    birth_year: parseInt(stripeProduct.metadata?.birth_year || '2024'),
    weight_grams: parseInt(stripeProduct.metadata?.weight_grams || '100'),
    type: 'real',
    status: 'available',
    source: 'stripe'
  };
  
  // Save to KV
  const key = `product:${product.id}`;
  await env.PRODUCTS.put(key, JSON.stringify(product));
  console.log('✅ Product saved to KV:', product.id);
  
  // Rebuild product index
  await rebuildProductIndex(env);
}

/**
 * Delete product from KV
 */
async function deleteProductFromKV(productId, env) {
  console.log('🗑️ Deleting product:', productId);
  
  const key = `product:${productId}`;
  await env.PRODUCTS.delete(key);
  console.log('✅ Product deleted from KV:', productId);
  
  // Rebuild product index
  await rebuildProductIndex(env);
}

/**
 * Update product price from Stripe price object
 */
async function updatePriceInKV(stripePrice, env) {
  console.log('💰 Updating price for product:', stripePrice.product);
  
  // Get existing product
  const productKey = `product:${stripePrice.product}`;
  const productData = await env.PRODUCTS.get(productKey);
  
  if (!productData) {
    console.warn('⚠️ Product not found for price update:', stripePrice.product);
    return;
  }
  
  const product = JSON.parse(productData);
  
  // Update price (convert cents to dollars)
  product.price = stripePrice.unit_amount / 100;
  product.currency = stripePrice.currency;
  
  // Save back to KV
  await env.PRODUCTS.put(productKey, JSON.stringify(product));
  console.log('✅ Price updated for product:', stripePrice.product);
}

/**
 * Rebuild the product index after changes
 */
async function rebuildProductIndex(env) {
  console.log('🔄 Rebuilding product index...');
  
  // List all product keys
  const list = await env.PRODUCTS.list({ prefix: 'product:' });
  const productIds = list.keys.map(k => k.name.replace('product:', ''));
  
  // Save index
  await env.PRODUCTS.put('_index:products', JSON.stringify(productIds));
  console.log('✅ Product index rebuilt:', productIds.length, 'products');
}

/**
 * Handler: GET /all-users
 * Returns all registered users sorted by registration date (newest first)
 */
async function handleGetAllUsers(env, corsHeaders) {
  try {
    const USER_PRODUCTS = env.USER_PRODUCTS;
    
    // List all keys with userdata: prefix
    const list = await USER_PRODUCTS.list({ prefix: 'userdata:' });
    
    if (!list || !list.keys || list.keys.length === 0) {
      return new Response(JSON.stringify({ users: [], count: 0 }), {
        status: 200,
        headers: corsHeaders
      });
    }
    
    // Fetch all users
    const userPromises = list.keys.map(async (key) => {
      const userData = await USER_PRODUCTS.get(key.name, { type: 'json' });
      return userData;
    });
    
    let users = await Promise.all(userPromises);
    users = users.filter(u => u !== null);
    
    // Sort by created_at (newest first)
    users.sort((a, b) => {
      const dateA = new Date(a.created_at || 0);
      const dateB = new Date(b.created_at || 0);
      return dateB - dateA;
    });
    
    return new Response(JSON.stringify({ 
      users, 
      count: users.length,
      sorted_by: 'created_at',
      order: 'newest_first'
    }), {
      status: 200,
      headers: corsHeaders
    });
    
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: corsHeaders
    });
  }
}

/**
 * Handler: GET /all-purchases
 * Returns all purchase records sorted by date (newest first)
 */
async function handleGetAllPurchases(env, corsHeaders) {
  try {
    const USER_PRODUCTS = env.USER_PRODUCTS;
    
    // List all keys with user: prefix
    const list = await USER_PRODUCTS.list({ prefix: 'user:' });
    
    if (!list || !list.keys || list.keys.length === 0) {
      return new Response(JSON.stringify({ purchases: [], count: 0 }), {
        status: 200,
        headers: corsHeaders
      });
    }
    
    // Fetch all user products
    const productPromises = list.keys.map(async (key) => {
      const data = await USER_PRODUCTS.get(key.name, { type: 'json' });
      return data;
    });
    
    let allData = await Promise.all(productPromises);
    allData = allData.filter(d => d !== null);
    
    // Flatten all products from all users
    let allPurchases = [];
    for (const userData of allData) {
      if (Array.isArray(userData)) {
        allPurchases.push(...userData);
      }
    }
    
    // Sort by acquired_at (newest first)
    allPurchases.sort((a, b) => {
      const dateA = new Date(a.acquired_at || 0);
      const dateB = new Date(b.acquired_at || 0);
      return dateB - dateA;
    });
    
    return new Response(JSON.stringify({ 
      purchases: allPurchases, 
      count: allPurchases.length,
      sorted_by: 'acquired_at',
      order: 'newest_first'
    }), {
      status: 200,
      headers: corsHeaders
    });
    
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: corsHeaders
    });
  }
}


/**
 * Handle GET /kv/list-products - List all product keys in KV
 */
async function handleKVListProducts(env, corsHeaders) {
  try {
    const keys = await env.PRODUCTS.list();
    return new Response(JSON.stringify({
      success: true,
      result: keys.keys,
      count: keys.keys.length
    }), {
      status: 200,
      headers: corsHeaders
    });
  } catch (error) {
    console.error('❌ KV list error:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to list products',
      message: error.message 
    }), {
      status: 500,
      headers: corsHeaders
    });
  }
}

/**
 * Handle GET /kv/get-product?id=PRODUCT_ID - Get product from KV
 */
async function handleKVGetProduct(request, env, corsHeaders) {
  const url = new URL(request.url);
  const productId = url.searchParams.get('id');
  
  if (!productId) {
    return new Response(JSON.stringify({ error: 'Missing product ID' }), {
      status: 400,
      headers: corsHeaders
    });
  }
  
  try {
    const productKey = `product:${productId}`;
    const productData = await env.PRODUCTS.get(productKey);
    
    if (!productData) {
      return new Response(JSON.stringify({ 
        error: 'Product not found',
        product_id: productId 
      }), {
        status: 404,
        headers: corsHeaders
      });
    }
    
    return new Response(JSON.stringify({
      success: true,
      result: JSON.parse(productData)
    }), {
      status: 200,
      headers: corsHeaders
    });
  } catch (error) {
    console.error('❌ KV get error:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to get product',
      message: error.message 
    }), {
      status: 500,
      headers: corsHeaders
    });
  }
}

/**
 * Handle GET /session-info?session_id=xxx - Get Stripe session client_reference_id
 */
async function handleGetSessionInfo(request, env, corsHeaders) {
  const url = new URL(request.url);
  const sessionId = url.searchParams.get('session_id');
  
  if (!sessionId) {
    return new Response(JSON.stringify({ error: 'Missing session_id' }), {
      status: 400,
      headers: corsHeaders
    });
  }
  
  try {
    // Fetch session from Stripe
    const stripeKey = env.STRIPE_SECRET_KEY;
    if (!stripeKey) {
      return new Response(JSON.stringify({ error: 'Stripe key not configured' }), {
        status: 500,
        headers: corsHeaders
      });
    }
    
    const stripeResponse = await fetch(`https://api.stripe.com/v1/checkout/sessions/${sessionId}`, {
      headers: {
        'Authorization': `Bearer ${stripeKey}`
      }
    });
    
    if (!stripeResponse.ok) {
      return new Response(JSON.stringify({ 
        error: 'Failed to fetch session from Stripe',
        status: stripeResponse.status 
      }), {
        status: stripeResponse.status,
        headers: corsHeaders
      });
    }
    
    const session = await stripeResponse.json();
    
    return new Response(JSON.stringify({
      client_reference_id: session.client_reference_id,
      user_hash: session.client_reference_id,
      session_id: session.id,
      amount_total: session.amount_total,
      currency: session.currency,
      customer_email: session.customer_details?.email
    }), {
      status: 200,
      headers: corsHeaders
    });
    
  } catch (error) {
    console.error('❌ Session fetch error:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to fetch session',
      message: error.message 
    }), {
      status: 500,
      headers: corsHeaders
    });
  }
}
