var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// worker.js
var WORKER_VERSION = "0.5.0";
var WORKER_UPDATED = "2025-12-25T15:59:00Z";
var worker_default = {
  async fetch(request, env) {
    const url = new URL(request.url);
    const pathname = url.pathname;
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Stripe-Signature",
      "Content-Type": "application/json"
    };
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: corsHeaders
      });
    }
    if (pathname === "/stripe-webhook" && request.method === "POST") {
      return handleStripeWebhook(request, env, corsHeaders);
    }
    if (pathname === "/user-products" && request.method === "GET") {
      return handleGetUserProducts(request, env, corsHeaders);
    }
    if (pathname === "/products" && request.method === "GET") {
      return handleGetProducts(request, env, corsHeaders);
    }
    if (pathname === "/product-status" && request.method === "GET") {
      return handleGetProductStatus(request, env, corsHeaders);
    }
    if (pathname === "/assign-product" && request.method === "POST") {
      return handleAssignProduct(request, env, corsHeaders);
    }
    if (pathname === "/register-user" && request.method === "POST") {
      return handleRegisterUser(request, env, corsHeaders);
    }
    if (pathname === "/user-data" && request.method === "GET") {
      return handleGetUserData(request, env, corsHeaders);
    }
    if (pathname === "/session-info" && request.method === "GET") {
      return handleGetSessionInfo(request, env, corsHeaders);
    }
    if (pathname === "/stripe-product-webhook" && request.method === "POST") {
      return handleStripeProductWebhook(request, env, corsHeaders);
    }
    if (pathname === "/kv/list-products" && request.method === "GET") {
      return handleKVListProducts(env, corsHeaders);
    }
    if (pathname === "/kv/get-product" && request.method === "GET") {
      return handleKVGetProduct(request, env, corsHeaders);
    }
    if (pathname === "/version" && request.method === "GET") {
      return new Response(JSON.stringify({
        version: WORKER_VERSION,
        updated: WORKER_UPDATED,
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        endpoints: [
          "POST /stripe-webhook",
          "GET /user-products?user=<hash>",
          "GET /products",
          "GET /product-status?id=<id>",
          "GET /session-info?session_id=<id>",
          "GET /version"
        ]
      }), {
        status: 200,
        headers: corsHeaders
      });
    }
    return new Response(JSON.stringify({ error: "Not found" }), {
      status: 404,
      headers: corsHeaders
    });
  }
};
async function handleStripeWebhook(request, env, corsHeaders) {
  console.log("\u{1F4E5} Webhook received");
  let payload;
  try {
    payload = await request.json();
  } catch (err) {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), {
      status: 400,
      headers: corsHeaders
    });
  }
  const eventType = payload.type || payload.data && payload.data.object;
  console.log("Event type:", eventType);
  if (eventType === "checkout.session.completed") {
    const session = payload.data?.object || payload;
    const userHash = session.client_reference_id;
    const metadata = session.metadata || {};
    let productId = metadata.product_id;
    if (!productId && env.STRIPE_SECRET_KEY) {
      try {
        console.log("\u{1F50D} Fetching session line items from Stripe API...");
        const stripeResponse = await fetch(
          `https://api.stripe.com/v1/checkout/sessions/${session.id}?expand[]=line_items`,
          {
            headers: {
              "Authorization": `Bearer ${env.STRIPE_SECRET_KEY}`
            }
          }
        );
        if (stripeResponse.ok) {
          const expandedSession = await stripeResponse.json();
          if (expandedSession.line_items?.data?.[0]?.price?.product) {
            productId = expandedSession.line_items.data[0].price.product;
            console.log("\u2705 Got product from line items:", productId);
          }
        }
      } catch (err) {
        console.error("\u274C Error fetching line items:", err.message);
      }
    }
    if (!userHash || !productId) {
      console.log("\u274C Missing userHash or productId");
      return new Response(JSON.stringify({
        error: "Missing user hash or product ID",
        userHash,
        productId
      }), {
        status: 400,
        headers: corsHeaders
      });
    }
    console.log("\u2705 Assigning product:", productId, "to user:", userHash);
    let productDetails = null;
    try {
      const productData = await env.PRODUCTS.get(`product:${productId}`);
      if (productData) {
        productDetails = JSON.parse(productData);
        console.log("\u{1F4E6} Found product details:", productDetails.name);
      } else {
        console.log("\u26A0\uFE0F Product not found in KV, using generic data");
      }
    } catch (err) {
      console.log("\u26A0\uFE0F Error fetching product:", err.message);
    }
    const userProduct = {
      assignment_id: `assign_${Date.now()}`,
      user_id: userHash,
      product_id: productId,
      product_type: "real",
      // Use actual product data if available
      name: productDetails?.name || `Snake ${Date.now()}`,
      nickname: productDetails?.name || `Snake ${Date.now()}`,
      species: productDetails?.species || "unknown",
      morph: productDetails?.morph || "normal",
      description: productDetails?.description || "",
      image: productDetails?.images?.[0] || null,
      acquired_at: (/* @__PURE__ */ new Date()).toISOString(),
      acquisition_type: "stripe_purchase",
      payment_id: session.payment_intent || session.id,
      price_paid: session.amount_total,
      currency: session.currency || "eur",
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
    const kvKey = `user:${userHash}`;
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
      console.log("\u2705 Saved to USER_PRODUCTS KV");
      if (env.PRODUCT_STATUS) {
        const statusKey = `product:${productId}`;
        const statusData = {
          status: "sold",
          owner_id: userHash,
          sold_at: (/* @__PURE__ */ new Date()).toISOString(),
          payment_id: session.payment_intent || session.id
        };
        await env.PRODUCT_STATUS.put(statusKey, JSON.stringify(statusData));
        console.log("\u2705 Marked product as sold in PRODUCT_STATUS KV");
      }
      return new Response(JSON.stringify({
        success: true,
        message: "Product assigned to user and marked as sold",
        user_id: userHash,
        product_id: productId
      }), {
        status: 200,
        headers: corsHeaders
      });
    } catch (err) {
      console.error("\u274C KV error:", err);
      return new Response(JSON.stringify({ error: "Database error" }), {
        status: 500,
        headers: corsHeaders
      });
    }
  }
  return new Response(JSON.stringify({ message: "Event ignored" }), {
    status: 200,
    headers: corsHeaders
  });
}
__name(handleStripeWebhook, "handleStripeWebhook");
async function handleGetProductStatus(request, env, corsHeaders) {
  const url = new URL(request.url);
  const productId = url.searchParams.get("id");
  if (!productId) {
    return new Response(JSON.stringify({ error: "Missing product ID" }), {
      status: 400,
      headers: corsHeaders
    });
  }
  try {
    if (!env.PRODUCT_STATUS) {
      return new Response(JSON.stringify({
        product_id: productId,
        status: "available",
        owner_id: null
      }), {
        status: 200,
        headers: corsHeaders
      });
    }
    const statusKey = `product:${productId}`;
    const statusData = await env.PRODUCT_STATUS.get(statusKey);
    if (!statusData) {
      return new Response(JSON.stringify({
        product_id: productId,
        status: "available",
        owner_id: null
      }), {
        status: 200,
        headers: corsHeaders
      });
    }
    const parsedStatus = JSON.parse(statusData);
    parsedStatus.product_id = productId;
    return new Response(JSON.stringify(parsedStatus), {
      status: 200,
      headers: corsHeaders
    });
  } catch (err) {
    console.error("\u274C Error checking product status:", err);
    return new Response(JSON.stringify({
      error: "Failed to check status",
      details: err.message
    }), {
      status: 500,
      headers: corsHeaders
    });
  }
}
__name(handleGetProductStatus, "handleGetProductStatus");
async function handleGetUserProducts(request, env, corsHeaders) {
  const url = new URL(request.url);
  const userHash = url.searchParams.get("user");
  if (!userHash) {
    return new Response(JSON.stringify({ error: "Missing user parameter" }), {
      status: 400,
      headers: corsHeaders
    });
  }
  const kvKey = `user:${userHash}`;
  try {
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
  } catch (err) {
    console.error("KV error:", err);
    return new Response(JSON.stringify({ error: "Database error" }), {
      status: 500,
      headers: corsHeaders
    });
  }
}
__name(handleGetUserProducts, "handleGetUserProducts");
async function handleGetProducts(request, env, corsHeaders) {
  try {
    if (!env.PRODUCTS) {
      console.warn("\u26A0\uFE0F PRODUCTS namespace not bound, using default snakes");
      const defaultProducts = [
        {
          id: "prod_TdKcnyjt5Jk0U2",
          name: "Batman Ball",
          description: "Premium Ball Python",
          images: ["https://files.stripe.com/links/MDB8YWNjdF8xU2czczBCakw3MnBlOVhzfGZsX3Rlc3RfWFB6ckpsNG9yUThEbGVObnBLeTlIOW5i00TIJlhXUK"],
          species: "ball_python",
          morph: "banana",
          price: 1e3,
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
    const indexData = await env.PRODUCTS.get("_index:products");
    if (!indexData) {
      console.warn("\u26A0\uFE0F Product index not found in KV");
      return new Response(JSON.stringify([]), {
        status: 200,
        headers: corsHeaders
      });
    }
    const productIds = JSON.parse(indexData);
    console.log(`\u{1F4E6} Loading ${productIds.length} products from KV`);
    const products = [];
    for (const id of productIds) {
      const key = `product:${id}`;
      const productData = await env.PRODUCTS.get(key);
      if (productData) {
        products.push(JSON.parse(productData));
      }
    }
    console.log(`\u2705 Returning ${products.length} products from KV`);
    return new Response(JSON.stringify(products), {
      status: 200,
      headers: corsHeaders
    });
  } catch (err) {
    console.error("\u274C Error loading products from KV:", err);
    return new Response(JSON.stringify({
      error: "Failed to load products",
      details: err.message,
      message: "Fallback to GitHub Pages: /data/products.json"
    }), {
      status: 500,
      headers: corsHeaders
    });
  }
}
__name(handleGetProducts, "handleGetProducts");
async function handleAssignProduct(request, env, corsHeaders) {
  let body;
  try {
    body = await request.json();
  } catch (err) {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), {
      status: 400,
      headers: corsHeaders
    });
  }
  const { user_id, product_id } = body;
  if (!user_id || !product_id) {
    return new Response(JSON.stringify({
      error: "Missing user_id or product_id"
    }), {
      status: 400,
      headers: corsHeaders
    });
  }
  const userProduct = {
    assignment_id: `assign_${Date.now()}`,
    user_id,
    product_id,
    product_type: "real",
    nickname: `Snake ${Date.now()}`,
    acquired_at: (/* @__PURE__ */ new Date()).toISOString(),
    acquisition_type: "manual_test",
    payment_id: null,
    price_paid: 0,
    currency: "test",
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
    return new Response(JSON.stringify({ error: "Database error" }), {
      status: 500,
      headers: corsHeaders
    });
  }
}
__name(handleAssignProduct, "handleAssignProduct");
async function handleRegisterUser(request, env, corsHeaders) {
  let body;
  try {
    body = await request.json();
  } catch (err) {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), {
      status: 400,
      headers: corsHeaders
    });
  }
  const { user_id, username, email, stripe_session_id } = body;
  if (!user_id || !username || !email) {
    return new Response(JSON.stringify({
      error: "Missing required fields: user_id, username, email"
    }), {
      status: 400,
      headers: corsHeaders
    });
  }
  const userProfile = {
    user_id,
    username,
    email,
    created_at: (/* @__PURE__ */ new Date()).toISOString(),
    loyalty_points: 0,
    loyalty_tier: "bronze",
    stripe_session_id: stripe_session_id || null
  };
  const kvKey = `userdata:${user_id}`;
  try {
    await env.USER_PRODUCTS.put(kvKey, JSON.stringify(userProfile));
    console.log("\u2705 User registered:", user_id, username);
    return new Response(JSON.stringify({
      success: true,
      user: userProfile
    }), {
      status: 200,
      headers: corsHeaders
    });
  } catch (err) {
    console.error("\u274C User registration error:", err);
    return new Response(JSON.stringify({ error: "Database error" }), {
      status: 500,
      headers: corsHeaders
    });
  }
}
__name(handleRegisterUser, "handleRegisterUser");
async function handleGetUserData(request, env, corsHeaders) {
  const url = new URL(request.url);
  const userHash = url.searchParams.get("user");
  if (!userHash) {
    return new Response(JSON.stringify({ error: "Missing user parameter" }), {
      status: 400,
      headers: corsHeaders
    });
  }
  const kvKey = `userdata:${userHash}`;
  try {
    const userData = await env.USER_PRODUCTS.get(kvKey);
    if (!userData) {
      return new Response(JSON.stringify({
        error: "User not found"
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
    console.error("\u274C Get user data error:", err);
    return new Response(JSON.stringify({ error: "Database error" }), {
      status: 500,
      headers: corsHeaders
    });
  }
}
__name(handleGetUserData, "handleGetUserData");
async function handleStripeProductWebhook(eventOrRequest, env, corsHeaders) {
  console.log("\u{1F4E5} Product webhook received");
  let event;
  if (eventOrRequest.json) {
    try {
      event = await eventOrRequest.json();
    } catch (err) {
      return new Response(JSON.stringify({ error: "Invalid JSON" }), {
        status: 400,
        headers: corsHeaders
      });
    }
  } else {
    event = eventOrRequest;
  }
  const eventType = event.type;
  console.log("Event type:", eventType);
  try {
    switch (eventType) {
      case "product.created":
      case "product.updated":
        await updateProductInKV(event.data.object, env);
        break;
      case "product.deleted":
        await deleteProductFromKV(event.data.object.id, env);
        break;
      case "price.created":
      case "price.updated":
        await updatePriceInKV(event.data.object, env);
        break;
      default:
        console.log("Ignoring event type:", eventType);
    }
    if (corsHeaders) {
      return new Response(JSON.stringify({ received: true, eventType }), {
        status: 200,
        headers: corsHeaders
      });
    }
  } catch (err) {
    console.error("\u274C Webhook error:", err);
    if (corsHeaders) {
      return new Response(JSON.stringify({ error: err.message }), {
        status: 500,
        headers: corsHeaders
      });
    }
    throw err;
  }
}
__name(handleStripeProductWebhook, "handleStripeProductWebhook");
async function updateProductInKV(stripeProduct, env) {
  console.log("\u{1F4DD} Updating product:", stripeProduct.id);
  const product = {
    id: stripeProduct.id,
    name: stripeProduct.name,
    description: stripeProduct.description || "",
    images: stripeProduct.images || [],
    species: stripeProduct.metadata?.species || "ball_python",
    morph: stripeProduct.metadata?.morph || "normal",
    sex: stripeProduct.metadata?.sex || "unknown",
    birth_year: parseInt(stripeProduct.metadata?.birth_year || "2024"),
    weight_grams: parseInt(stripeProduct.metadata?.weight_grams || "100"),
    type: "real",
    status: "available",
    source: "stripe"
  };
  const key = `product:${product.id}`;
  await env.PRODUCTS.put(key, JSON.stringify(product));
  console.log("\u2705 Product saved to KV:", product.id);
  await rebuildProductIndex(env);
}
__name(updateProductInKV, "updateProductInKV");
async function deleteProductFromKV(productId, env) {
  console.log("\u{1F5D1}\uFE0F Deleting product:", productId);
  const key = `product:${productId}`;
  await env.PRODUCTS.delete(key);
  console.log("\u2705 Product deleted from KV:", productId);
  await rebuildProductIndex(env);
}
__name(deleteProductFromKV, "deleteProductFromKV");
async function updatePriceInKV(stripePrice, env) {
  console.log("\u{1F4B0} Updating price for product:", stripePrice.product);
  const productKey = `product:${stripePrice.product}`;
  const productData = await env.PRODUCTS.get(productKey);
  if (!productData) {
    console.warn("\u26A0\uFE0F Product not found for price update:", stripePrice.product);
    return;
  }
  const product = JSON.parse(productData);
  product.price = stripePrice.unit_amount / 100;
  product.currency = stripePrice.currency;
  await env.PRODUCTS.put(productKey, JSON.stringify(product));
  console.log("\u2705 Price updated for product:", stripePrice.product);
}
__name(updatePriceInKV, "updatePriceInKV");
async function rebuildProductIndex(env) {
  console.log("\u{1F504} Rebuilding product index...");
  const list = await env.PRODUCTS.list({ prefix: "product:" });
  const productIds = list.keys.map((k) => k.name.replace("product:", ""));
  await env.PRODUCTS.put("_index:products", JSON.stringify(productIds));
  console.log("\u2705 Product index rebuilt:", productIds.length, "products");
}
__name(rebuildProductIndex, "rebuildProductIndex");
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
    console.error("\u274C KV list error:", error);
    return new Response(JSON.stringify({
      error: "Failed to list products",
      message: error.message
    }), {
      status: 500,
      headers: corsHeaders
    });
  }
}
__name(handleKVListProducts, "handleKVListProducts");
async function handleKVGetProduct(request, env, corsHeaders) {
  const url = new URL(request.url);
  const productId = url.searchParams.get("id");
  if (!productId) {
    return new Response(JSON.stringify({ error: "Missing product ID" }), {
      status: 400,
      headers: corsHeaders
    });
  }
  try {
    const productKey = `product:${productId}`;
    const productData = await env.PRODUCTS.get(productKey);
    if (!productData) {
      return new Response(JSON.stringify({
        error: "Product not found",
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
    console.error("\u274C KV get error:", error);
    return new Response(JSON.stringify({
      error: "Failed to get product",
      message: error.message
    }), {
      status: 500,
      headers: corsHeaders
    });
  }
}
__name(handleKVGetProduct, "handleKVGetProduct");
async function handleGetSessionInfo(request, env, corsHeaders) {
  const url = new URL(request.url);
  const sessionId = url.searchParams.get("session_id");
  if (!sessionId) {
    return new Response(JSON.stringify({ error: "Missing session_id" }), {
      status: 400,
      headers: corsHeaders
    });
  }
  try {
    const stripeKey = env.STRIPE_SECRET_KEY;
    if (!stripeKey) {
      return new Response(JSON.stringify({ error: "Stripe key not configured" }), {
        status: 500,
        headers: corsHeaders
      });
    }
    const stripeResponse = await fetch(`https://api.stripe.com/v1/checkout/sessions/${sessionId}`, {
      headers: {
        "Authorization": `Bearer ${stripeKey}`
      }
    });
    if (!stripeResponse.ok) {
      return new Response(JSON.stringify({
        error: "Failed to fetch session from Stripe",
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
    console.error("\u274C Session fetch error:", error);
    return new Response(JSON.stringify({
      error: "Failed to fetch session",
      message: error.message
    }), {
      status: 500,
      headers: corsHeaders
    });
  }
}
__name(handleGetSessionInfo, "handleGetSessionInfo");
export {
  worker_default as default,
  handleStripeProductWebhook
};
//# sourceMappingURL=worker.js.map

--cdcbee0c79ea9147155b716b8078de2c70d17bdc63a0ff65a4c304b5e612--
