/**
 * Mock Data Generators - Test data factories
 * 
 * @version 0.7.0
 */

/**
 * Generate a test product
 */
export function generateProduct(overrides = {}) {
  const id = `prod_test_${Date.now()}_${Math.random().toString(36).substring(7)}`;
  
  return {
    id,
    name: overrides.name || 'Test Snake',
    species: overrides.species || 'ball_python',
    morph: overrides.morph || 'banana',
    gender: overrides.gender || 'male',
    yob: overrides.yob || new Date().getFullYear(),
    price: overrides.price || 450.00,
    status: overrides.status || 'available',
    stripe_link: overrides.stripe_link || null,
    ...overrides
  };
}

/**
 * Generate a test customer
 */
export function generateCustomer(overrides = {}) {
  const hash = overrides.hash || `test_${Math.random().toString(36).substring(2, 15)}`;
  
  return {
    hash,
    email: overrides.email || `test_${hash}@example.com`,
    name: overrides.name || 'Test User',
    created: overrides.created || new Date().toISOString(),
    ...overrides
  };
}

/**
 * Generate a test purchase
 */
export function generatePurchase(overrides = {}) {
  const customer = overrides.customer || generateCustomer();
  const product = overrides.product || generateProduct();
  
  return {
    session_id: `cs_test_${Math.random().toString(36).substring(2)}`,
    customer_hash: customer.hash,
    product_id: product.id,
    amount: product.price,
    currency: 'usd',
    status: 'complete',
    timestamp: new Date().toISOString(),
    ...overrides
  };
}

/**
 * Generate multiple products
 */
export function generateProducts(count, overrides = {}) {
  return Array.from({ length: count }, (_, i) => 
    generateProduct({ ...overrides, name: `Test Snake ${i + 1}` })
  );
}

/**
 * Generate snake morphs dataset
 */
export function generateMorphs() {
  return [
    'banana', 'piebald', 'pastel', 'albino', 'clown',
    'spider', 'mojave', 'ghost', 'butter', 'leopard'
  ];
}

/**
 * Generate species dataset
 */
export function generateSpecies() {
  return [
    { id: 'ball_python', name: 'Ball Python', scientific: 'Python regius' },
    { id: 'corn_snake', name: 'Corn Snake', scientific: 'Pantherophis guttatus' }
  ];
}

/**
 * Generate test user hash
 */
export function generateHash() {
  return 'test_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
}

/**
 * Generate test Stripe session
 */
export function generateStripeSession(overrides = {}) {
  return {
    id: `cs_test_${Math.random().toString(36).substring(2)}`,
    object: 'checkout.session',
    status: 'complete',
    payment_status: 'paid',
    client_reference_id: overrides.client_reference_id || generateHash(),
    customer_email: overrides.customer_email || 'test@example.com',
    mode: 'payment',
    ...overrides
  };
}
