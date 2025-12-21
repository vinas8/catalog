// Test script for Cloudflare Worker
// Run: node test-worker.js

const WORKER_URL = 'https://YOUR_WORKER.workers.dev';  // Replace with your worker URL

async function testWorker() {
  console.log('🧪 Testing Cloudflare Worker...\n');

  // Test 1: Assign a test product
  console.log('Test 1: Assign product to user');
  try {
    const response = await fetch(`${WORKER_URL}/assign-product`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: 'test_user_123',
        product_id: 'prod_test_snake'
      })
    });
    const data = await response.json();
    console.log('✅ Response:', data);
  } catch (err) {
    console.log('❌ Error:', err.message);
  }

  // Test 2: Get user products
  console.log('\nTest 2: Get user products');
  try {
    const response = await fetch(`${WORKER_URL}/user-products?user=test_user_123`);
    const data = await response.json();
    console.log('✅ Products:', data);
  } catch (err) {
    console.log('❌ Error:', err.message);
  }

  // Test 3: Simulate Stripe webhook
  console.log('\nTest 3: Simulate Stripe webhook');
  try {
    const response = await fetch(`${WORKER_URL}/stripe-webhook`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'checkout.session.completed',
        data: {
          object: {
            client_reference_id: 'webhook_test_user',
            id: 'cs_test_123',
            payment_intent: 'pi_test_123',
            amount_total: 100000,
            currency: 'eur',
            metadata: {
              product_id: 'prod_webhook_snake'
            }
          }
        }
      })
    });
    const data = await response.json();
    console.log('✅ Webhook response:', data);
  } catch (err) {
    console.log('❌ Error:', err.message);
  }

  // Test 4: Verify webhook saved data
  console.log('\nTest 4: Verify webhook saved data');
  try {
    const response = await fetch(`${WORKER_URL}/user-products?user=webhook_test_user`);
    const data = await response.json();
    console.log('✅ Webhook user products:', data);
  } catch (err) {
    console.log('❌ Error:', err.message);
  }

  console.log('\n✅ All tests complete!');
}

testWorker();
