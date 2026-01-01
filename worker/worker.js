/**
 * Cloudflare Worker for Serpent Town v0.7.0
 * 
 * Version: 0.7.0
 * Last Updated: 2025-12-27
 *
 * Expected bindings:
 * - USER_PRODUCTS (KV namespace) - Stores user's purchased snakes
 * - PRODUCT_STATUS (KV namespace) - Tracks which products are sold
 * - PRODUCTS (KV namespace) - Product catalog
 * - STRIPE_SECRET_KEY (secret) - Stripe API key
 * - MAILTRAP_API_TOKEN (secret) - Mailtrap API key for emails
 * - ADMIN_EMAIL (env var) - Admin notification email
 * - FROM_EMAIL (env var) - Sender email address
 * - SHOP_NAME (env var) - Shop name for emails
 *
 * Endpoints:
 * - POST /stripe-webhook  (Stripe webhook + email notifications)
 * - GET  /user-products?user=<hash>  (Get user's snakes)
 * - GET  /products  (Get product catalog from KV)
 * - GET  /product-status?id=<product_id>  (Check if product is sold)
 * - GET  /session-info?session_id=<id>  (Get Stripe session data)
 * - GET  /version  (Get worker version)
 *
 * Features:
 * - Hash-based user authentication (user ID in URL)
 * - Stores user products in KV
 * - Handles Stripe checkout.session.completed events
 * - Sends order confirmation emails (customer + admin)
 * - Assigns snakes to users by hash
 * - Tracks sold status for unique real snakes
 * - Serves product catalog from KV (not JSON files)
 * - Fetches user hash from Stripe session API
 *
 * Deployment:
 * - wrangler publish
 * - Bind KV namespaces: USER_PRODUCTS, PRODUCT_STATUS, PRODUCTS
 */

import { createEmailService } from './email-service.js';

const WORKER_VERSION = '0.7.0';
const WORKER_UPDATED = '2025-12-27T06:50:00Z';

// Test Registry - Maps all tests to metadata
const TEST_REGISTRY = {
  'api-health-check': { id: 'api-health-check', category: 'api', name: 'Health Check', file: 'tests/api/health-check.test.js', priority: 'P0', duration: 'fast', tags: ['api', 'health', 'smoke'] },
  'integration-stripe-kv-sync': { id: 'integration-stripe-kv-sync', category: 'integration', name: 'Stripe→KV Sync', file: 'tests/integration/stripe-kv-sync.test.js', priority: 'P1', duration: 'medium', tags: ['integration', 'stripe', 'kv'] },
  'integration-worker-deployment': { id: 'integration-worker-deployment', category: 'integration', name: 'Worker Deployment', file: 'tests/integration/worker-deployment.test.js', priority: 'P1', duration: 'slow', tags: ['integration', 'worker'] },
  'integration-webhook-config': { id: 'integration-webhook-config', category: 'integration', name: 'Webhook Config', file: 'tests/integration/stripe-webhook-config.test.js', priority: 'P1', duration: 'fast', tags: ['integration', 'stripe'] },
  'e2e-purchase-flow': { id: 'e2e-purchase-flow', category: 'e2e', name: 'Purchase Flow', file: 'tests/e2e/e2e-purchase-flow.sh', priority: 'P0', duration: 'slow', tags: ['e2e', 'purchase'] },
  'e2e-security-scenarios': { id: 'e2e-security-scenarios', category: 'e2e', name: 'Security Scenarios', file: 'tests/e2e/security-scenarios.test.js', priority: 'P0', duration: 'medium', tags: ['e2e', 'security'] },
  'module-game-tamagotchi': { id: 'module-game-tamagotchi', category: 'modules', name: 'Tamagotchi Logic', file: 'tests/modules/game/tamagotchi.test.js', priority: 'P1', duration: 'fast', tags: ['module', 'game'] },
  'module-shop': { id: 'module-shop', category: 'modules', name: 'Shop Module', file: 'tests/modules/shop/shop.test.js', priority: 'P1', duration: 'fast', tags: ['module', 'shop'] },
  'smri-scenario-runner': { id: 'smri-scenario-runner', category: 'smri', name: 'Scenario Runner', file: 'tests/smri/scenario-runner.test.js', priority: 'P0', duration: 'fast', tags: ['smri'] },
  'snapshot-structure': { id: 'snapshot-structure', category: 'snapshot', name: 'Structure Validation', file: 'tests/snapshot/structure-validation.test.js', priority: 'P2', duration: 'fast', tags: ['snapshot'] }
};

const TEST_CATEGORIES = {
  'api': { name: 'API Tests', count: 1, description: 'Worker API validation' },
  'integration': { name: 'Integration Tests', count: 3, description: 'Multi-service integration' },
  'e2e': { name: 'End-to-End Tests', count: 2, description: 'Complete user journeys' },
  'modules': { name: 'Module Tests', count: 2, description: 'Individual module tests' },
  'smri': { name: 'SMRI Tests', count: 1, description: 'Scenario system tests' },
  'snapshot': { name: 'Snapshot Tests', count: 1, description: 'Structure validation' }
};

// SMRI Scenarios (tutorial flows)
const SMRI_SCENARIOS = [
  { id: 'S2-tutorial-happy-path', module: 'S2', name: 'Daily Care Tutorial', priority: 'P0', url: 'https://vinas8.github.io/catalog/debug/tutorial-happy-path.html' },
  { id: 'S2-tutorial-missed-care', module: 'S2', name: 'Missed Care (2-3 days)', priority: 'P0', url: 'https://vinas8.github.io/catalog/debug/tutorial-missed-care.html' },
  { id: 'S2-tutorial-education-commerce', module: 'S2', name: 'Education-First Commerce', priority: 'P0', url: 'https://vinas8.github.io/catalog/debug/tutorial-education-commerce.html' },
  { id: 'S2-tutorial-trust-protection', module: 'S2', name: 'Trust Protection', priority: 'P0', url: 'https://vinas8.github.io/catalog/debug/tutorial-trust-protection.html' },
  { id: 'S2-tutorial-email-reentry', module: 'S2', name: 'Email-Driven Re-entry', priority: 'P1', url: 'https://vinas8.github.io/catalog/debug/tutorial-email-reentry.html' },
  { id: 'S2-tutorial-failure-educational', module: 'S2', name: 'Failure Case', priority: 'P1', url: 'https://vinas8.github.io/catalog/debug/tutorial-failure-educational.html' }
];

function handleDebugEndpoint(url, corsHeaders) {
  const category = url.searchParams.get('category');
  const testId = url.searchParams.get('test');
  
  // Get specific test
  if (testId) {
    const test = TEST_REGISTRY[testId];
    if (!test) {
      return new Response(JSON.stringify({ error: 'Test not found', testId }), {
        status: 404,
        headers: corsHeaders
      });
    }
    return new Response(JSON.stringify({
      test,
      runUrl: `https://vinas8.github.io/catalog/debug/index.html?test=${testId}`,
      cliCommand: `node ${test.file}`
    }, null, 2), {
      status: 200,
      headers: corsHeaders
    });
  }
  
  // Get tests in category
  if (category) {
    const categoryInfo = TEST_CATEGORIES[category];
    if (!categoryInfo) {
      return new Response(JSON.stringify({ error: 'Category not found', category }), {
        status: 404,
        headers: corsHeaders
      });
    }
    const tests = Object.values(TEST_REGISTRY).filter(t => t.category === category);
    return new Response(JSON.stringify({
      category: categoryInfo,
      tests,
      count: tests.length
    }, null, 2), {
      status: 200,
      headers: corsHeaders
    });
  }
  
  // List all categories and scenarios
  return new Response(JSON.stringify({
    version: WORKER_VERSION,
    categories: TEST_CATEGORIES,
    totalTests: Object.keys(TEST_REGISTRY).length,
    smri: {
      scenarios: SMRI_SCENARIOS,
      count: SMRI_SCENARIOS.length
    },
    debugHub: 'https://vinas8.github.io/catalog/debug/',
    timestamp: new Date().toISOString()
  }, null, 2), {
    status: 200,
    headers: corsHeaders
  });
}

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

    // Route: POST /api/customer (alias for /register-user, backward compatibility)
    if (pathname === '/api/customer' && request.method === 'POST') {
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

    // Route: GET /kv/customer-count (count registered customers)
    if (pathname === '/kv/customer-count' && request.method === 'GET') {
      return handleKVCustomerCount(env, corsHeaders);
    }

    // Route: GET /health (health check)
    if (pathname === '/health' && request.method === 'GET') {
      return new Response(JSON.stringify({
        status: 'healthy',
        version: WORKER_VERSION,
        timestamp: new Date().toISOString()
      }), {
        status: 200,
        headers: corsHeaders
      });
    }

    // Route: GET /debug (Test registry & scenarios)
    if (pathname === '/debug' && request.method === 'GET') {
      return handleDebugEndpoint(url, corsHeaders);
    }

    // Route: GET /version (get worker version)
    if (pathname === '/version' && request.method === 'GET') {
      return new Response(JSON.stringify({
        version: WORKER_VERSION,
        updated: WORKER_UPDATED,
        timestamp: new Date().toISOString(),
        endpoints: [
          'GET /health',
          'GET /debug',
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

    // Route: POST /upload-products (Upload products to Stripe)
    if (pathname === '/upload-products' && request.method === 'POST') {
      return handleUploadProducts(request, env, corsHeaders);
    }

    // Route: POST /sync-stripe-to-kv (Sync from Stripe to KV)
    if (pathname === '/sync-stripe-to-kv' && request.method === 'POST') {
      return handleSyncStripeToKV(env, corsHeaders);
    }

    // Route: POST /clear-stripe-products (Clear all Stripe products)
    if (pathname === '/clear-stripe-products' && request.method === 'POST') {
      return handleClearStripeProducts(env, corsHeaders);
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
    
    // Get product from metadata or fetch session with line_items
    const metadata = session.metadata || {};
    let productId = metadata.product_id;
    
    // If no product_id in metadata, fetch session with expanded line_items
    if (!productId && env.STRIPE_SECRET_KEY) {
      try {
        console.log('🔍 Fetching session line items from Stripe API...');
        const stripeResponse = await fetch(
          `https://api.stripe.com/v1/checkout/sessions/${session.id}?expand[]=line_items`,
          {
            headers: {
              'Authorization': `Bearer ${env.STRIPE_SECRET_KEY}`
            }
          }
        );
        
        if (stripeResponse.ok) {
          const expandedSession = await stripeResponse.json();
          if (expandedSession.line_items?.data?.[0]?.price?.product) {
            productId = expandedSession.line_items.data[0].price.product;
            console.log('✅ Got product from line items:', productId);
          }
        }
      } catch (err) {
        console.error('❌ Error fetching line items:', err.message);
      }
    }

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

      // 📧 Send order confirmation emails
      try {
        console.log('📧 Sending order confirmation emails...');
        
        const emailService = createEmailService(env);
        
        // Prepare order data for emails
        const orderData = {
          orderId: session.id,
          customerEmail: session.customer_details?.email || session.customer_email || 'unknown@example.com',
          customerName: session.customer_details?.name || 'Valued Customer',
          items: [{
            name: productDetails?.name || 'Snake',
            quantity: 1,
            amount: session.amount_total
          }],
          totalAmount: session.amount_total,
          currency: session.currency || 'eur',
          shopName: env.SHOP_NAME || 'Serpent Town'
        };

        // Send customer confirmation
        const customerResult = await emailService.sendCustomerOrderConfirmation(orderData);
        if (customerResult.success) {
          console.log('✅ Customer email sent:', customerResult.messageId);
        } else {
          console.error('❌ Customer email failed:', customerResult.error);
        }

        // Send admin notification
        const adminResult = await emailService.sendAdminOrderNotification(orderData);
        if (adminResult.success) {
          console.log('✅ Admin email sent:', adminResult.messageId);
        } else {
          console.error('❌ Admin email failed:', adminResult.error);
        }
      } catch (emailError) {
        console.error('⚠️ Email sending error:', emailError.message);
        // Don't fail the webhook if emails fail
      }

      return new Response(JSON.stringify({ 
        success: true,
        message: 'Product assigned to user and marked as sold',
        user_id: userHash,
        product_id: productId,
        emails_sent: true
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
        const product = JSON.parse(productData);
        
        // Check if product is sold (filter out sold products)
        if (env.PRODUCT_STATUS) {
          const statusKey = `status:${id}`;
          const statusValue = await env.PRODUCT_STATUS.get(statusKey);
          if (statusValue === 'sold') {
            console.log(`⏭️ Skipping sold product: ${id}`);
            continue; // Skip sold products
          }
        }
        
        products.push(product);
      }
    }

    console.log(`✅ Returning ${products.length} available products from KV`);
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

  if (!user_id || !username) {
    return new Response(JSON.stringify({ 
      error: 'Missing required fields: user_id, username' 
    }), {
      status: 400,
      headers: corsHeaders
    });
  }

  // Create user profile
  const userProfile = {
    user_id,
    username,
    email: email || null,
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
 * Handle GET /kv/customer-count - Count registered customers
 */
async function handleKVCustomerCount(env, corsHeaders) {
  try {
    // List all keys with 'userdata:' prefix
    const keys = await env.USER_PRODUCTS.list({ prefix: 'userdata:' });
    
    return new Response(JSON.stringify({
      success: true,
      count: keys.keys.length,
      customers: keys.keys.map(k => k.name.replace('userdata:', ''))
    }), {
      status: 200,
      headers: corsHeaders
    });
  } catch (error) {
    console.error('❌ Customer count error:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to count customers',
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

/**
 * Upload products to Stripe
 */
async function handleUploadProducts(request, env, corsHeaders) {
  try {
    const { products } = await request.json();
    
    if (!products || !Array.isArray(products)) {
      return new Response(JSON.stringify({ error: 'Products array required' }), {
        status: 400,
        headers: corsHeaders
      });
    }

    const stripeKey = env.STRIPE_SECRET_KEY;
    if (!stripeKey) {
      return new Response(JSON.stringify({ error: 'Stripe key not configured' }), {
        status: 500,
        headers: corsHeaders
      });
    }

    const results = [];
    
    for (const product of products) {
      try {
        // Create product in Stripe
        const productData = new URLSearchParams({
          name: product.name,
          description: `${product.morph} - ${product.gender}, ${product.yob}`
        });
        
        const productResponse = await fetch('https://api.stripe.com/v1/products', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${stripeKey}`,
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: productData
        });

        if (!productResponse.ok) {
          const error = await productResponse.text();
          results.push({ name: product.name, success: false, error });
          continue;
        }

        const stripeProduct = await productResponse.json();

        // Create price
        const priceData = new URLSearchParams({
          product: stripeProduct.id,
          unit_amount: Math.round(product.price * 100),
          currency: 'eur'
        });

        const priceResponse = await fetch('https://api.stripe.com/v1/prices', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${stripeKey}`,
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: priceData
        });

        if (!priceResponse.ok) {
          results.push({ name: product.name, success: false, error: 'Price creation failed' });
          continue;
        }

        const price = await priceResponse.json();

        results.push({ 
          name: product.name, 
          success: true, 
          product_id: stripeProduct.id,
          price_id: price.id 
        });
      } catch (err) {
        results.push({ name: product.name, success: false, error: err.message });
      }
    }

    const successCount = results.filter(r => r.success).length;

    return new Response(JSON.stringify({ 
      success: true,
      total: products.length,
      uploaded: successCount,
      failed: products.length - successCount,
      results
    }), {
      status: 200,
      headers: corsHeaders
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: corsHeaders
    });
  }
}

/**
 * Sync products from Stripe to KV
 */
async function handleSyncStripeToKV(env, corsHeaders) {
  try {
    const stripeKey = env.STRIPE_SECRET_KEY;
    if (!stripeKey) {
      return new Response(JSON.stringify({ error: 'Stripe key not configured' }), {
        status: 500,
        headers: corsHeaders
      });
    }

    const response = await fetch('https://api.stripe.com/v1/products?limit=100', {
      headers: {
        'Authorization': `Bearer ${stripeKey}`
      }
    });

    if (!response.ok) {
      return new Response(JSON.stringify({ error: 'Failed to fetch from Stripe' }), {
        status: response.status,
        headers: corsHeaders
      });
    }

    const { data: products } = await response.json();
    
    const results = [];
    for (const product of products) {
      try {
        await env.PRODUCTS.put(`product:${product.id}`, JSON.stringify(product));
        results.push({ id: product.id, name: product.name, success: true });
      } catch (err) {
        results.push({ id: product.id, name: product.name, success: false, error: err.message });
      }
    }

    const successCount = results.filter(r => r.success).length;

    return new Response(JSON.stringify({
      success: true,
      total: products.length,
      synced: successCount,
      failed: products.length - successCount,
      results
    }), {
      status: 200,
      headers: corsHeaders
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: corsHeaders
    });
  }
}

/**
 * Clear all products from Stripe
 */
async function handleClearStripeProducts(env, corsHeaders) {
  try {
    const stripeKey = env.STRIPE_SECRET_KEY;
    if (!stripeKey) {
      return new Response(JSON.stringify({ error: 'Stripe key not configured' }), {
        status: 500,
        headers: corsHeaders
      });
    }

    const response = await fetch('https://api.stripe.com/v1/products?limit=100', {
      headers: {
        'Authorization': `Bearer ${stripeKey}`
      }
    });

    if (!response.ok) {
      return new Response(JSON.stringify({ error: 'Failed to fetch from Stripe' }), {
        status: response.status,
        headers: corsHeaders
      });
    }

    const { data: products } = await response.json();
    
    const results = [];
    for (const product of products) {
      try {
        const deleteResponse = await fetch(`https://api.stripe.com/v1/products/${product.id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${stripeKey}`
          }
        });

        const result = await deleteResponse.json();
        results.push({ 
          id: product.id, 
          name: product.name, 
          success: result.deleted === true 
        });
      } catch (err) {
        results.push({ id: product.id, name: product.name, success: false, error: err.message });
      }
    }

    const successCount = results.filter(r => r.success).length;

    return new Response(JSON.stringify({
      success: true,
      total: products.length,
      deleted: successCount,
      failed: products.length - successCount,
      results
    }), {
      status: 200,
      headers: corsHeaders
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: corsHeaders
    });
  }
}
