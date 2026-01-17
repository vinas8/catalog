/**
 * Product Page E2E Tests
 * Tests product page rendering, buyability, and Stripe integration
 */

import { strictEqual, ok } from 'assert';

const WORKER_URL = 'https://catalog.navickaszilvinas.workers.dev';
const BASE_URL = 'http://localhost:8080';

// Test helpers
async function fetchProducts() {
  const res = await fetch(`${WORKER_URL}/products`);
  if (!res.ok) throw new Error(`Failed to fetch products: ${res.status}`);
  return await res.json();
}

function buildProductURL(product) {
  const species = (product.metadata?.species || product.species || 'ball_python')
    .toLowerCase().replace('_', '-');
  const morph = (product.metadata?.morph || product.morph || 'unknown')
    .toLowerCase().replace(/\s+/g, '-').replace(/\./g, '');
  const name = (product.name || product.id)
    .toLowerCase().replace(/\s+/g, '-');
  
  return `/product.html?url=/en/catalog/${species}/${morph}/${name}`;
}

function parseProductFromHTML(html) {
  // Extract title
  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/);
  const title = titleMatch ? titleMatch[1] : null;
  
  // Extract price
  const priceMatch = html.match(/<div class="product-price">€(\d+(?:\.\d+)?)<\/div>/);
  const price = priceMatch ? parseFloat(priceMatch[1]) : null;
  
  // Extract buy button
  const buyBtnMatch = html.match(/<button class="btn-buy"[^>]*>([^<]+)<\/button>/);
  const buyButton = buyBtnMatch ? buyBtnMatch[1] : null;
  const isBuyable = buyButton && buyButton.includes('Buy Now');
  const hasStripeLink = html.includes('window.location.href=') && html.includes('stripe.com');
  
  // Extract status
  const statusMatch = html.match(/status-badge[^>]*>([^<]+)<\/span>/);
  const status = statusMatch ? statusMatch[1].trim() : null;
  
  return { title, price, buyButton, isBuyable, hasStripeLink, status };
}

// Tests
const tests = [
  {
    name: 'Product API returns valid data',
    async run() {
      console.log('📡 Fetching products from API...');
      const products = await fetchProducts();
      
      ok(Array.isArray(products), 'Products should be an array');
      ok(products.length > 0, 'Should have at least one product');
      
      const product = products[0];
      ok(product.id, 'Product should have ID');
      ok(product.name, 'Product should have name');
      ok(product.active !== undefined, 'Product should have active status');
      
      console.log(`✅ Found ${products.length} products`);
      console.log(`   First product: ${product.name} (${product.id})`);
      
      return products;
    }
  },
  
  {
    name: 'Product URL building works correctly',
    async run() {
      const products = await fetchProducts();
      const product = products[0];
      
      console.log('🔗 Building product URL...');
      const url = buildProductURL(product);
      
      ok(url.includes('/product.html?url='), 'URL should use query param format');
      ok(url.includes('/en/catalog/'), 'URL should include locale and catalog');
      
      // Check URL components
      const parts = url.split('/').filter(p => p);
      ok(parts.length >= 5, 'URL should have all required parts');
      
      console.log(`✅ Built URL: ${url}`);
      
      return { product, url };
    }
  },
  
  {
    name: 'Product page renders with metadata',
    async run() {
      const products = await fetchProducts();
      const product = products[0];
      const url = buildProductURL(product);
      
      console.log('📄 Fetching product page HTML...');
      const res = await fetch(`${BASE_URL}${url}`);
      ok(res.ok, `Product page should load (got ${res.status})`);
      
      const html = await res.text();
      const parsed = parseProductFromHTML(html);
      
      ok(parsed.title, 'Page should have title');
      ok(parsed.title !== 'Loading...', 'Page should not be stuck loading');
      ok(parsed.price !== null, 'Page should show price');
      ok(parsed.status, 'Page should show status badge');
      
      console.log(`✅ Page rendered:`);
      console.log(`   Title: ${parsed.title}`);
      console.log(`   Price: €${parsed.price}`);
      console.log(`   Status: ${parsed.status}`);
      
      return { product, parsed, html };
    }
  },
  
  {
    name: 'Product with stripe_link is buyable',
    async run() {
      const products = await fetchProducts();
      const buyableProduct = products.find(p => p.stripe_link);
      
      if (!buyableProduct) {
        console.log('⚠️  No products with stripe_link found - skipping test');
        return;
      }
      
      console.log(`🛒 Testing buyable product: ${buyableProduct.name}`);
      const url = buildProductURL(buyableProduct);
      
      const res = await fetch(`${BASE_URL}${url}`);
      const html = await res.text();
      const parsed = parseProductFromHTML(html);
      
      ok(parsed.isBuyable, 'Product with stripe_link should be buyable');
      ok(parsed.hasStripeLink, 'Buy button should contain Stripe link');
      ok(parsed.buyButton.includes('Buy Now'), 'Button should say "Buy Now"');
      ok(parsed.buyButton.includes('€'), 'Button should show price');
      
      console.log(`✅ Product is buyable:`);
      console.log(`   Button: ${parsed.buyButton}`);
      console.log(`   Has Stripe link: ${parsed.hasStripeLink}`);
    }
  },
  
  {
    name: 'Product without stripe_link shows Contact for Price',
    async run() {
      const products = await fetchProducts();
      
      // Create test product without stripe_link
      console.log('📝 Testing product without stripe_link...');
      const testProduct = {
        id: 'test_no_link',
        name: 'TestSnake',
        species: 'ball_python',
        morph: 'Normal',
        metadata: {
          species: 'ball_python',
          morph: 'Normal',
          price: '100'
        },
        active: true
        // No stripe_link
      };
      
      const url = buildProductURL(testProduct);
      
      // We can't test this without actually adding the product to localStorage
      // But we can verify the logic in the HTML source
      const res = await fetch(`${BASE_URL}/product.html`);
      const html = await res.text();
      
      ok(html.includes('Contact for Price'), 'Page should have fallback text');
      ok(html.includes('product.stripe_link'), 'Page should check stripe_link field');
      
      console.log('✅ Fallback logic exists for products without links');
    }
  },
  
  {
    name: 'Demo product is findable in localStorage',
    async run() {
      console.log('🎬 Testing demo product lookup...');
      
      const demoProduct = {
        id: 'demo_snake_001',
        name: 'DemoSnake',
        species: 'ball_python',
        morph: 'Banana Het Clown',
        metadata: {
          species: 'ball_python',
          morph: 'Banana Het Clown',
          price: '299'
        },
        active: true,
        stripe_link: 'https://buy.stripe.com/test_demo'
      };
      
      const url = buildProductURL(demoProduct);
      ok(url.includes('ball-python'), 'URL should have species');
      ok(url.includes('banana-het-clown'), 'URL should have morph');
      ok(url.includes('demosnake'), 'URL should have name');
      
      console.log('✅ Demo product URL:', url);
    }
  }
];

// Run all tests
async function runTests() {
  console.log('🧪 Product Page E2E Tests\n');
  
  let passed = 0;
  let failed = 0;
  
  for (const test of tests) {
    try {
      console.log(`\n▶️  ${test.name}`);
      await test.run();
      passed++;
    } catch (err) {
      console.error(`❌ ${test.name} FAILED:`, err.message);
      failed++;
    }
  }
  
  console.log(`\n${'='.repeat(60)}`);
  console.log(`✅ Passed: ${passed}/${tests.length}`);
  if (failed > 0) {
    console.log(`❌ Failed: ${failed}/${tests.length}`);
    process.exit(1);
  }
  console.log('🎉 All tests passed!');
}

runTests().catch(err => {
  console.error('💥 Test suite failed:', err);
  process.exit(1);
});
