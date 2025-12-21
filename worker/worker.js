/**
 * Cloudflare Worker for Serpent Town v3.4
 *
 * Expected bindings:
 * - USER_PRODUCTS (KV namespace) - Stores user's purchased snakes
 *
 * Endpoints:
 * - POST /stripe-webhook  (Stripe webhook)
 * - GET  /user-products?user=<hash>  (Get user's snakes)
 * - GET  /products  (Get available products)
 *
 * Features:
 * - Hash-based user authentication (user ID in URL)
 * - Stores user products in KV
 * - Handles Stripe checkout.session.completed events
 * - Assigns snakes to users by hash
 *
 * Deployment:
 * - wrangler publish
 * - Bind KV namespace: USER_PRODUCTS
 */

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

    // Create user product entry
    const userProduct = {
      assignment_id: `assign_${Date.now()}`,
      user_id: userHash,
      product_id: productId,
      product_type: 'real',
      nickname: `Snake ${Date.now()}`, // User can rename later
      acquired_at: new Date().toISOString(),
      acquisition_type: 'stripe_purchase',
      payment_id: session.payment_intent || session.id,
      price_paid: session.amount_total / 100,
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

      console.log('✅ Saved to KV');

      return new Response(JSON.stringify({ 
        success: true,
        message: 'Product assigned to user',
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
 * Get all available products (from GitHub Pages fallback)
 */
async function handleGetProducts(request, env, corsHeaders) {
  // For now, just return a message
  // In production, this could proxy to GitHub Pages or maintain a cache
  return new Response(JSON.stringify({
    message: 'Load products from GitHub Pages: /data/products.json'
  }), {
    status: 200,
    headers: corsHeaders
  });
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
