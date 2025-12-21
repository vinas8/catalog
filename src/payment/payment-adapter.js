/**
 * Payment Provider Abstraction Layer
 * 
 * Allows easy switching between Stripe, PayPal, Square, etc.
 * by changing one line in config.
 * 
 * Usage:
 * const adapter = PaymentAdapterFactory.create('stripe'); // or 'paypal', 'square'
 * await adapter.createCheckout(product, customer, merchant);
 */

/**
 * Base interface all payment providers must implement
 */
export class PaymentAdapter {
  /**
   * Create checkout session for a product
   * @param {Object} product - Product being purchased
   * @param {Object} customer - Customer info (email, address, user_id)
   * @param {Object} merchant - Merchant info (id, email, fee_config)
   * @returns {Promise<Object>} { checkout_url, session_id }
   */
  async createCheckout(product, customer, merchant) {
    throw new Error('Must implement createCheckout()');
  }

  /**
   * Create subscription for merchant
   * @param {Object} merchant - Merchant info
   * @returns {Promise<Object>} { subscription_url, subscription_id }
   */
  async createMerchantSubscription(merchant) {
    throw new Error('Must implement createMerchantSubscription()');
  }

  /**
   * Process incoming webhook from provider
   * @param {Object} payload - Raw webhook payload
   * @param {Object} headers - HTTP headers (for signature verification)
   * @returns {Promise<Object>} { event_type, data: { order_id, customer, merchant, product } }
   */
  async processWebhook(payload, headers) {
    throw new Error('Must implement processWebhook()');
  }

  /**
   * Verify webhook signature (security)
   * @param {Object} payload - Raw webhook payload
   * @param {string} signature - Signature from headers
   * @param {string} secret - Webhook secret
   * @returns {boolean}
   */
  async verifyWebhookSignature(payload, signature, secret) {
    throw new Error('Must implement verifyWebhookSignature()');
  }

  /**
   * Calculate fees (platform cut + processing)
   * @param {number} amount - Product price
   * @param {Object} feeConfig - { platform_percent, processing_percent, processing_fixed }
   * @returns {Object} { total, platform_fee, processing_fee, merchant_payout }
   */
  calculateFees(amount, feeConfig) {
    const platformFee = amount * (feeConfig.platform_percent / 100);
    const processingFee = (amount * (feeConfig.processing_percent / 100)) + feeConfig.processing_fixed;
    const total = amount + platformFee + processingFee;
    const merchantPayout = amount - platformFee;

    return {
      subtotal: amount,
      platform_fee: platformFee,
      processing_fee: processingFee,
      total: total,
      merchant_payout: merchantPayout
    };
  }
}

/**
 * Factory to create payment adapters
 */
export class PaymentAdapterFactory {
  /**
   * Create a payment adapter by provider name
   * @param {string} provider - 'stripe' | 'paypal' | 'square' | 'mock'
   * @returns {PaymentAdapter}
   */
  static create(provider) {
    switch (provider.toLowerCase()) {
      case 'stripe':
        return new StripeAdapter();
      case 'paypal':
        return new PayPalAdapter();
      case 'square':
        return new SquareAdapter();
      case 'mock':
        return new MockAdapter();
      default:
        throw new Error(`Unknown payment provider: ${provider}`);
    }
  }
}

/**
 * Stripe implementation
 */
export class StripeAdapter extends PaymentAdapter {
  async createCheckout(product, customer, merchant) {
    // Calculate fees
    const fees = this.calculateFees(product.price, {
      platform_percent: 5,
      processing_percent: 2.9,
      processing_fixed: 0.30
    });

    // Create Stripe Checkout Session
    const response = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${STRIPE_SECRET_KEY}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        'payment_method_types[]': 'card',
        'line_items[0][price_data][currency]': 'usd',
        'line_items[0][price_data][product_data][name]': product.name,
        'line_items[0][price_data][unit_amount]': Math.round(fees.total * 100),
        'line_items[0][quantity]': '1',
        'mode': 'payment',
        'success_url': `${SITE_URL}/success.html?session_id={CHECKOUT_SESSION_ID}`,
        'cancel_url': `${SITE_URL}/catalog.html`,
        'client_reference_id': customer.user_id,
        'customer_email': customer.email,
        'metadata[product_id]': product.id,
        'metadata[merchant_id]': merchant.id,
        'metadata[platform_fee]': fees.platform_fee,
        'metadata[merchant_payout]': fees.merchant_payout
      })
    });

    const session = await response.json();
    return {
      checkout_url: session.url,
      session_id: session.id
    };
  }

  async createMerchantSubscription(merchant) {
    // Create Stripe subscription ($15/month)
    const response = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${STRIPE_SECRET_KEY}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        'payment_method_types[]': 'card',
        'line_items[0][price]': 'price_merchant_subscription', // Pre-created price ID
        'line_items[0][quantity]': '1',
        'mode': 'subscription',
        'success_url': `${SITE_URL}/merchant-dashboard.html`,
        'cancel_url': `${SITE_URL}/merchant-register.html`,
        'client_reference_id': merchant.id,
        'customer_email': merchant.email
      })
    });

    const session = await response.json();
    return {
      subscription_url: session.url,
      subscription_id: session.id
    };
  }

  async processWebhook(payload, headers) {
    const event = JSON.parse(payload);

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      
      return {
        event_type: 'purchase_completed',
        data: {
          order_id: session.id,
          customer_id: session.client_reference_id,
          customer_email: session.customer_email,
          merchant_id: session.metadata.merchant_id,
          product_id: session.metadata.product_id,
          platform_fee: parseFloat(session.metadata.platform_fee),
          merchant_payout: parseFloat(session.metadata.merchant_payout),
          total_paid: session.amount_total / 100,
          payment_status: session.payment_status
        }
      };
    }

    return { event_type: 'ignored', data: {} };
  }

  async verifyWebhookSignature(payload, signature, secret) {
    // Stripe signature verification logic
    // In production, use: stripe.webhooks.constructEvent(payload, signature, secret)
    return true;
  }
}

/**
 * PayPal implementation
 */
export class PayPalAdapter extends PaymentAdapter {
  async createCheckout(product, customer, merchant) {
    const fees = this.calculateFees(product.price, {
      platform_percent: 5,
      processing_percent: 2.9,
      processing_fixed: 0.30
    });

    // PayPal Orders API
    const response = await fetch('https://api-m.paypal.com/v2/checkout/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${PAYPAL_ACCESS_TOKEN}`
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [{
          amount: {
            currency_code: 'USD',
            value: fees.total.toFixed(2)
          },
          description: product.name,
          custom_id: JSON.stringify({
            customer_id: customer.user_id,
            merchant_id: merchant.id,
            product_id: product.id,
            platform_fee: fees.platform_fee,
            merchant_payout: fees.merchant_payout
          })
        }],
        application_context: {
          return_url: `${SITE_URL}/success.html`,
          cancel_url: `${SITE_URL}/catalog.html`
        }
      })
    });

    const order = await response.json();
    return {
      checkout_url: order.links.find(link => link.rel === 'approve').href,
      session_id: order.id
    };
  }

  async createMerchantSubscription(merchant) {
    // PayPal Subscriptions API
    const response = await fetch('https://api-m.paypal.com/v1/billing/subscriptions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${PAYPAL_ACCESS_TOKEN}`
      },
      body: JSON.stringify({
        plan_id: 'MERCHANT_PLAN_ID', // Pre-created in PayPal
        subscriber: {
          email_address: merchant.email
        },
        application_context: {
          return_url: `${SITE_URL}/merchant-dashboard.html`,
          cancel_url: `${SITE_URL}/merchant-register.html`
        }
      })
    });

    const subscription = await response.json();
    return {
      subscription_url: subscription.links.find(link => link.rel === 'approve').href,
      subscription_id: subscription.id
    };
  }

  async processWebhook(payload, headers) {
    const event = JSON.parse(payload);

    if (event.event_type === 'CHECKOUT.ORDER.COMPLETED') {
      const order = event.resource;
      const customData = JSON.parse(order.purchase_units[0].custom_id);

      return {
        event_type: 'purchase_completed',
        data: {
          order_id: order.id,
          customer_id: customData.customer_id,
          merchant_id: customData.merchant_id,
          product_id: customData.product_id,
          platform_fee: customData.platform_fee,
          merchant_payout: customData.merchant_payout,
          total_paid: parseFloat(order.purchase_units[0].amount.value),
          payment_status: order.status
        }
      };
    }

    return { event_type: 'ignored', data: {} };
  }

  async verifyWebhookSignature(payload, signature, secret) {
    // PayPal webhook verification
    return true;
  }
}

/**
 * Square implementation  
 */
export class SquareAdapter extends PaymentAdapter {
  async createCheckout(product, customer, merchant) {
    const fees = this.calculateFees(product.price, {
      platform_percent: 5,
      processing_percent: 2.6,
      processing_fixed: 0.10
    });

    // Square Checkout API
    const response = await fetch('https://connect.squareup.com/v2/online-checkout/payment-links', {
      method: 'POST',
      headers: {
        'Square-Version': '2023-10-18',
        'Authorization': `Bearer ${SQUARE_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        order: {
          location_id: SQUARE_LOCATION_ID,
          line_items: [{
            name: product.name,
            quantity: '1',
            base_price_money: {
              amount: Math.round(fees.total * 100),
              currency: 'USD'
            }
          }],
          metadata: {
            customer_id: customer.user_id,
            merchant_id: merchant.id,
            product_id: product.id,
            platform_fee: fees.platform_fee.toString(),
            merchant_payout: fees.merchant_payout.toString()
          }
        },
        checkout_options: {
          redirect_url: `${SITE_URL}/success.html`,
          ask_for_shipping_address: true
        }
      })
    });

    const link = await response.json();
    return {
      checkout_url: link.payment_link.url,
      session_id: link.payment_link.id
    };
  }

  async createMerchantSubscription(merchant) {
    // Square Subscriptions API
    const response = await fetch('https://connect.squareup.com/v2/subscriptions', {
      method: 'POST',
      headers: {
        'Square-Version': '2023-10-18',
        'Authorization': `Bearer ${SQUARE_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        location_id: SQUARE_LOCATION_ID,
        plan_id: 'MERCHANT_SUBSCRIPTION_PLAN_ID',
        customer_id: merchant.square_customer_id
      })
    });

    const subscription = await response.json();
    return {
      subscription_url: `${SITE_URL}/merchant-dashboard.html`,
      subscription_id: subscription.subscription.id
    };
  }

  async processWebhook(payload, headers) {
    const event = JSON.parse(payload);

    if (event.type === 'payment.created') {
      const payment = event.data.object.payment;

      return {
        event_type: 'purchase_completed',
        data: {
          order_id: payment.order_id,
          customer_id: payment.buyer_email_address,
          merchant_id: payment.note || 'unknown',
          product_id: payment.reference_id,
          platform_fee: 5.00, // Parse from metadata in production
          merchant_payout: 95.00,
          total_paid: payment.amount_money.amount / 100,
          payment_status: payment.status
        }
      };
    }

    return { event_type: 'ignored', data: {} };
  }

  async verifyWebhookSignature(payload, signature, secret) {
    // Square webhook verification
    return true;
  }
}

/**
 * Mock adapter for testing (no real payments)
 */
export class MockAdapter extends PaymentAdapter {
  async createCheckout(product, customer, merchant) {
    const fees = this.calculateFees(product.price, {
      platform_percent: 5,
      processing_percent: 3,
      processing_fixed: 0.30
    });

    const SITE_URL = 'https://vinas8.github.io/catalog';
    return {
      checkout_url: `${SITE_URL}/success.html?mock=true&product=${product.id}`,
      session_id: `mock_${Date.now()}`
    };
  }

  async createMerchantSubscription(merchant) {
    const SITE_URL = 'https://vinas8.github.io/catalog';
    return {
      subscription_url: `${SITE_URL}/merchant-dashboard.html?mock=true`,
      subscription_id: `mock_sub_${Date.now()}`
    };
  }

  async processWebhook(payload, headers) {
    return {
      event_type: 'purchase_completed',
      data: {
        order_id: 'mock_order_123',
        customer_id: payload.customer_id,
        merchant_id: payload.merchant_id,
        product_id: payload.product_id,
        platform_fee: 5.00,
        merchant_payout: 95.00,
        total_paid: 103.30,
        payment_status: 'paid'
      }
    };
  }

  async verifyWebhookSignature(payload, signature, secret) {
    return true;
  }
}
