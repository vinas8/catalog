/**
 * Cloudflare Worker for Serpent Town v0.3.0 - Marketplace Edition
 *
 * Expected bindings:
 * - USER_PRODUCTS (KV namespace) - Stores user's purchased snakes
 * - MERCHANTS (KV namespace) - Merchant accounts and subscriptions
 * - ORDERS (KV namespace) - Order history with shipping addresses
 * - PRODUCTS (KV namespace) - Product catalog
 *
 * Endpoints:
 * - POST /payment-webhook          (Universal webhook for all providers)
 * - GET  /user-products?user=<hash>
 * - GET  /products                 (Get products from KV)
 * - POST /merchant/register        (Register new merchant)
 * - POST /merchant/add-product     (Add product to catalog)
 * - GET  /merchant/orders?id=<merchant_id>
 * - GET  /merchant/products?id=<merchant_id>
 * - GET  /order?id=<order_id>
 */

// Import payment adapter (will be bundled by wrangler)
import { PaymentAdapterFactory } from '../src/payment/payment-adapter.js';
import { PAYMENT_PROVIDER } from '../src/payment/config.js';

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const pathname = url.pathname;

    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS,PUT,DELETE',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Content-Type': 'application/json'
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    // Payment webhook (provider-agnostic)
    if (pathname === '/payment-webhook' && request.method === 'POST') {
      return handlePaymentWebhook(request, env, corsHeaders);
    }

    // User endpoints
    if (pathname === '/user-products' && request.method === 'GET') {
      return handleGetUserProducts(request, env, corsHeaders);
    }

    if (pathname === '/register-user' && request.method === 'POST') {
      return handleRegisterUser(request, env, corsHeaders);
    }

    if (pathname === '/user-data' && request.method === 'GET') {
      return handleGetUserData(request, env, corsHeaders);
    }

    // Merchant endpoints
    if (pathname === '/merchant/register' && request.method === 'POST') {
      return handleMerchantRegister(request, env, corsHeaders);
    }

    if (pathname === '/merchant/add-product' && request.method === 'POST') {
      return handleMerchantAddProduct(request, env, corsHeaders);
    }

    if (pathname === '/merchant/products' && request.method === 'GET') {
      return handleGetMerchantProducts(request, env, corsHeaders);
    }

    if (pathname === '/merchant/orders' && request.method === 'GET') {
      return handleGetMerchantOrders(request, env, corsHeaders);
    }

    // Product endpoints
    if (pathname === '/products' && request.method === 'GET') {
      return handleGetProducts(request, env, corsHeaders);
    }

    if (pathname === '/product-status' && request.method === 'GET') {
      return handleGetProductStatus(request, env, corsHeaders);
    }

    // Order endpoints
    if (pathname === '/order' && request.method === 'GET') {
      return handleGetOrder(request, env, corsHeaders);
    }

    return new Response(JSON.stringify({ error: 'Not found' }), { 
      status: 404, 
      headers: corsHeaders 
    });
  }
};

/**
 * Universal payment webhook handler (works with any provider)
 */
async function handlePaymentWebhook(request, env, corsHeaders) {
  console.log('📥 Payment webhook received');

  let payload;
  try {
    payload = await request.text();
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Invalid payload' }), { 
      status: 400, 
      headers: corsHeaders 
    });
  }

  // Get adapter for current payment provider
  const adapter = PaymentAdapterFactory.create(PAYMENT_PROVIDER);

  // Process webhook
  const result = await adapter.processWebhook(payload, Object.fromEntries(request.headers));

  if (result.event_type === 'purchase_completed') {
    const { order_id, customer_id, merchant_id, product_id, platform_fee, merchant_payout, total_paid } = result.data;

    // 1. Create order record
    const order = {
      order_id,
      customer_id,
      merchant_id,
      product_id,
      total_paid,
      platform_fee,
      merchant_payout,
      payment_provider: PAYMENT_PROVIDER,
      created_at: new Date().toISOString(),
      status: 'pending_shipment'
    };

    await env.ORDERS.put(`order:${order_id}`, JSON.stringify(order));

    // 2. Assign product to customer
    const userProduct = {
      assignment_id: `assign_${Date.now()}`,
      user_id: customer_id,
      product_id,
      merchant_id,
      order_id,
      acquired_at: new Date().toISOString(),
      acquisition_type: 'marketplace_purchase',
      price_paid: total_paid,
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

    const userKey = `user:${customer_id}`;
    const existing = await env.USER_PRODUCTS.get(userKey);
    let userProducts = existing ? JSON.parse(existing) : [];
    userProducts.push(userProduct);
    await env.USER_PRODUCTS.put(userKey, JSON.stringify(userProducts));

    // 3. Mark product as sold
    await env.USER_PRODUCTS.put(`product:sold:${product_id}`, JSON.stringify({
      status: 'sold',
      owner_id: customer_id,
      sold_at: new Date().toISOString(),
      order_id
    }));

    // 4. Add to merchant's orders
    const merchantOrderKey = `merchant:orders:${merchant_id}`;
    const merchantOrders = await env.ORDERS.get(merchantOrderKey);
    let orders = merchantOrders ? JSON.parse(merchantOrders) : [];
    orders.push(order_id);
    await env.ORDERS.put(merchantOrderKey, JSON.stringify(orders));

    console.log('✅ Order processed:', order_id);

    return new Response(JSON.stringify({ 
      success: true, 
      order_id,
      message: 'Order processed successfully'
    }), {
      status: 200,
      headers: corsHeaders
    });
  }

  return new Response(JSON.stringify({ message: 'Event ignored' }), {
    status: 200,
    headers: corsHeaders
  });
}

/**
 * Register new merchant
 */
async function handleMerchantRegister(request, env, corsHeaders) {
  let body;
  try {
    body = await request.json();
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
      status: 400,
      headers: corsHeaders
    });
  }

  const { merchant_id, email, business_name } = body;

  if (!merchant_id || !email || !business_name) {
    return new Response(JSON.stringify({ 
      error: 'Missing required fields: merchant_id, email, business_name' 
    }), {
      status: 400,
      headers: corsHeaders
    });
  }

  const merchant = {
    merchant_id,
    email,
    business_name,
    created_at: new Date().toISOString(),
    subscription_status: 'pending',
    subscription_id: null,
    total_sales: 0,
    total_products: 0
  };

  await env.MERCHANTS.put(`merchant:${merchant_id}`, JSON.stringify(merchant));

  return new Response(JSON.stringify({ 
    success: true, 
    merchant 
  }), {
    status: 200,
    headers: corsHeaders
  });
}

/**
 * Add product to catalog (merchant action)
 */
async function handleMerchantAddProduct(request, env, corsHeaders) {
  let body;
  try {
    body = await request.json();
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
      status: 400,
      headers: corsHeaders
    });
  }

  const { merchant_id, product } = body;

  if (!merchant_id || !product) {
    return new Response(JSON.stringify({ 
      error: 'Missing merchant_id or product' 
    }), {
      status: 400,
      headers: corsHeaders
    });
  }

  // Generate product ID
  const product_id = `prod_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  const fullProduct = {
    ...product,
    id: product_id,
    merchant_id,
    created_at: new Date().toISOString(),
    status: 'available'
  };

  // Store product
  await env.PRODUCTS.put(`product:${product_id}`, JSON.stringify(fullProduct));

  // Add to merchant's products list
  const merchantProductsKey = `merchant:products:${merchant_id}`;
  const merchantProducts = await env.PRODUCTS.get(merchantProductsKey);
  let products = merchantProducts ? JSON.parse(merchantProducts) : [];
  products.push(product_id);
  await env.PRODUCTS.put(merchantProductsKey, JSON.stringify(products));

  // Update merchant stats
  const merchantData = await env.MERCHANTS.get(`merchant:${merchant_id}`);
  if (merchantData) {
    const merchant = JSON.parse(merchantData);
    merchant.total_products++;
    await env.MERCHANTS.put(`merchant:${merchant_id}`, JSON.stringify(merchant));
  }

  return new Response(JSON.stringify({ 
    success: true, 
    product: fullProduct 
  }), {
    status: 200,
    headers: corsHeaders
  });
}

/**
 * Get merchant's products
 */
async function handleGetMerchantProducts(request, env, corsHeaders) {
  const url = new URL(request.url);
  const merchantId = url.searchParams.get('id');

  if (!merchantId) {
    return new Response(JSON.stringify({ error: 'Missing merchant ID' }), {
      status: 400,
      headers: corsHeaders
    });
  }

  const merchantProductsKey = `merchant:products:${merchantId}`;
  const productIds = await env.PRODUCTS.get(merchantProductsKey);

  if (!productIds) {
    return new Response(JSON.stringify([]), {
      status: 200,
      headers: corsHeaders
    });
  }

  const ids = JSON.parse(productIds);
  const products = [];

  for (const id of ids) {
    const productData = await env.PRODUCTS.get(`product:${id}`);
    if (productData) {
      products.push(JSON.parse(productData));
    }
  }

  return new Response(JSON.stringify(products), {
    status: 200,
    headers: corsHeaders
  });
}

/**
 * Get merchant's orders
 */
async function handleGetMerchantOrders(request, env, corsHeaders) {
  const url = new URL(request.url);
  const merchantId = url.searchParams.get('id');

  if (!merchantId) {
    return new Response(JSON.stringify({ error: 'Missing merchant ID' }), {
      status: 400,
      headers: corsHeaders
    });
  }

  const merchantOrdersKey = `merchant:orders:${merchantId}`;
  const orderIds = await env.ORDERS.get(merchantOrdersKey);

  if (!orderIds) {
    return new Response(JSON.stringify([]), {
      status: 200,
      headers: corsHeaders
    });
  }

  const ids = JSON.parse(orderIds);
  const orders = [];

  for (const id of ids) {
    const orderData = await env.ORDERS.get(`order:${id}`);
    if (orderData) {
      orders.push(JSON.parse(orderData));
    }
  }

  return new Response(JSON.stringify(orders), {
    status: 200,
    headers: corsHeaders
  });
}

/**
 * Get all products from KV
 */
async function handleGetProducts(request, env, corsHeaders) {
  // Get list of all product IDs
  const productList = await env.PRODUCTS.list({ prefix: 'product:' });
  const products = [];

  for (const key of productList.keys) {
    if (key.name.startsWith('product:') && !key.name.includes(':sold:')) {
      const productData = await env.PRODUCTS.get(key.name);
      if (productData) {
        products.push(JSON.parse(productData));
      }
    }
  }

  return new Response(JSON.stringify(products), {
    status: 200,
    headers: corsHeaders
  });
}

/**
 * Get product status
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

  const statusKey = `product:sold:${productId}`;
  const statusData = await env.USER_PRODUCTS.get(statusKey);

  if (!statusData) {
    return new Response(JSON.stringify({ 
      product_id: productId,
      status: 'available',
      owner_id: null
    }), {
      status: 200,
      headers: corsHeaders
    });
  }

  return new Response(statusData, {
    status: 200,
    headers: corsHeaders
  });
}

/**
 * Get user's products
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
  const data = await env.USER_PRODUCTS.get(kvKey);

  if (!data) {
    return new Response(JSON.stringify([]), {
      status: 200,
      headers: corsHeaders
    });
  }

  return new Response(data, {
    status: 200,
    headers: corsHeaders
  });
}

/**
 * Register user
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

  const userProfile = {
    user_id,
    username,
    email,
    created_at: new Date().toISOString(),
    loyalty_points: 0,
    loyalty_tier: 'bronze',
    stripe_session_id: stripe_session_id || null
  };

  const kvKey = `userdata:${user_id}`;
  await env.USER_PRODUCTS.put(kvKey, JSON.stringify(userProfile));

  return new Response(JSON.stringify({ 
    success: true,
    user: userProfile
  }), {
    status: 200,
    headers: corsHeaders
  });
}

/**
 * Get user data
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
}

/**
 * Get order details
 */
async function handleGetOrder(request, env, corsHeaders) {
  const url = new URL(request.url);
  const orderId = url.searchParams.get('id');

  if (!orderId) {
    return new Response(JSON.stringify({ error: 'Missing order ID' }), {
      status: 400,
      headers: corsHeaders
    });
  }

  const orderData = await env.ORDERS.get(`order:${orderId}`);

  if (!orderData) {
    return new Response(JSON.stringify({ 
      error: 'Order not found' 
    }), {
      status: 404,
      headers: corsHeaders
    });
  }

  return new Response(orderData, {
    status: 200,
    headers: corsHeaders
  });
}
