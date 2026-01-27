/**
 * Stripe Webhook Handlers
 * Handles Stripe checkout webhooks, product webhooks, and session info
 */

import { createEmailService } from '../email-service.js';

/**
 * Handle Stripe checkout webhook (POST /stripe-webhook)
 * Processes checkout.session.completed events
 */
export async function handleStripeWebhook(request, env, corsHeaders) {
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

  const eventType = payload.type || (payload.data && payload.data.object);
  console.log('Event type:', eventType);

  if (eventType === 'checkout.session.completed') {
    return await handleCheckoutCompleted(payload, env, corsHeaders);
  }

  // Ignore other events
  return new Response(JSON.stringify({ message: 'Event ignored' }), {
    status: 200,
    headers: corsHeaders
  });
}

/**
 * Handle checkout.session.completed event
 */
async function handleCheckoutCompleted(payload, env, corsHeaders) {
  const session = payload.data?.object || payload;
  
  const userHash = session.client_reference_id;
  let productId = session.metadata?.product_id;
  
  // Fetch product ID from line items if not in metadata
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

  // Fetch product details from KV
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

  // Create user product entry
  const userProduct = {
    assignment_id: `assign_${Date.now()}`,
    user_id: userHash,
    product_id: productId,
    product_type: 'real',
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

  // Store in KV
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
    console.log('✅ Saved to USER_PRODUCTS KV');

    // Mark product as sold
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

    // Send order confirmation emails
    try {
      console.log('📧 Sending order confirmation emails...');
      
      const emailService = createEmailService(env);
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

      const customerResult = await emailService.sendCustomerOrderConfirmation(orderData);
      if (customerResult.success) {
        console.log('✅ Customer email sent:', customerResult.messageId);
      } else {
        console.error('❌ Customer email failed:', customerResult.error);
      }

      const adminResult = await emailService.sendAdminOrderNotification(orderData);
      if (adminResult.success) {
        console.log('✅ Admin email sent:', adminResult.messageId);
      } else {
        console.error('❌ Admin email failed:', adminResult.error);
      }
    } catch (emailError) {
      console.error('⚠️ Email sending error:', emailError.message);
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

/**
 * Handle GET /session-info?session_id=xxx
 * Fetch Stripe session information
 */
export async function handleGetSessionInfo(request, env, corsHeaders) {
  const url = new URL(request.url);
  const sessionId = url.searchParams.get('session_id');
  
  if (!sessionId) {
    return new Response(JSON.stringify({ error: 'Missing session_id parameter' }), {
      status: 400,
      headers: corsHeaders
    });
  }
  
  if (!env.STRIPE_SECRET_KEY) {
    return new Response(JSON.stringify({ error: 'Stripe API key not configured' }), {
      status: 500,
      headers: corsHeaders
    });
  }
  
  try {
    console.log(`🔍 Fetching Stripe session: ${sessionId}`);
    
    const stripeResponse = await fetch(
      `https://api.stripe.com/v1/checkout/sessions/${sessionId}`,
      {
        headers: {
          'Authorization': `Bearer ${env.STRIPE_SECRET_KEY}`
        }
      }
    );
    
    if (!stripeResponse.ok) {
      const errorText = await stripeResponse.text();
      console.error('❌ Stripe API error:', stripeResponse.status, errorText);
      return new Response(JSON.stringify({ 
        error: 'Stripe API error',
        status: stripeResponse.status
      }), {
        status: stripeResponse.status,
        headers: corsHeaders
      });
    }
    
    const session = await stripeResponse.json();
    console.log('✅ Session fetched:', session.id);
    
    return new Response(JSON.stringify({
      id: session.id,
      client_reference_id: session.client_reference_id,
      user_hash: session.client_reference_id,
      customer_email: session.customer_details?.email || session.customer_email,
      customer_name: session.customer_details?.name,
      amount_total: session.amount_total,
      currency: session.currency,
      payment_status: session.payment_status,
      payment_intent: session.payment_intent
    }), {
      status: 200,
      headers: corsHeaders
    });
    
  } catch (err) {
    console.error('❌ Error fetching session:', err.message);
    return new Response(JSON.stringify({ 
      error: 'Failed to fetch session',
      message: err.message
    }), {
      status: 500,
      headers: corsHeaders
    });
  }
}
