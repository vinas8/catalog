#!/usr/bin/env node
/**
 * Create Stripe Payment Links for all products
 * Reads from Stripe API, creates payment links, updates KV
 */

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || 'sk_test_51Sg3s0BjL72pe9Xs4RFYFTBPDDUhUzNTgAUbNUxhRk4pZQGZtpEXQvIFI6o2NZIujJcyGKKGn6Ml2rnoy16yVsf700BDVZxVYI';
const WORKER_URL = 'https://catalog.navickaszilvinas.workers.dev';

async function createPaymentLinks() {
  console.log('🔗 Creating Stripe Payment Links...\n');

  // 1. Fetch all products from Stripe
  console.log('📡 Fetching products from Stripe...');
  const productsRes = await fetch('https://api.stripe.com/v1/products?active=true&limit=100', {
    headers: { 'Authorization': `Bearer ${STRIPE_SECRET_KEY}` }
  });

  if (!productsRes.ok) {
    console.error('❌ Failed to fetch products:', await productsRes.text());
    process.exit(1);
  }

  const { data: products } = await productsRes.json();
  console.log(`✅ Found ${products.length} products\n`);

  const results = [];

  for (const product of products) {
    console.log(`\n📦 Processing: ${product.name} (${product.id})`);

    // Get default price
    const defaultPrice = product.default_price;
    if (!defaultPrice) {
      console.log('   ⚠️  No default price - fetching prices...');
      
      const pricesRes = await fetch(`https://api.stripe.com/v1/prices?product=${product.id}&active=true&limit=1`, {
        headers: { 'Authorization': `Bearer ${STRIPE_SECRET_KEY}` }
      });

      if (!pricesRes.ok) {
        console.log('   ❌ Failed to fetch prices');
        results.push({ name: product.name, success: false, error: 'No price found' });
        continue;
      }

      const { data: prices } = await pricesRes.json();
      if (prices.length === 0) {
        console.log('   ❌ No active prices found');
        results.push({ name: product.name, success: false, error: 'No price' });
        continue;
      }

      product.default_price = prices[0].id;
      console.log(`   ✅ Using price: ${prices[0].id} (€${(prices[0].unit_amount / 100).toFixed(2)})`);
    }

    // Check if payment link already exists
    const linksRes = await fetch(`https://api.stripe.com/v1/payment_links?limit=100`, {
      headers: { 'Authorization': `Bearer ${STRIPE_SECRET_KEY}` }
    });

    if (linksRes.ok) {
      const { data: existingLinks } = await linksRes.json();
      const existing = existingLinks.find(link => 
        link.line_items?.[0]?.price === product.default_price
      );

      if (existing) {
        console.log(`   ✅ Payment link already exists: ${existing.url}`);
        results.push({ 
          name: product.name, 
          success: true, 
          payment_link: existing.url,
          existed: true
        });
        continue;
      }
    }

    // Create payment link
    console.log('   🔗 Creating payment link...');
    
    const linkData = new URLSearchParams({
      'line_items[0][price]': product.default_price,
      'line_items[0][quantity]': '1',
      'after_completion[type]': 'redirect',
      'after_completion[redirect][url]': 'https://vinas8.github.io/catalog/success.html'
    });

    const linkRes = await fetch('https://api.stripe.com/v1/payment_links', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${STRIPE_SECRET_KEY}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: linkData
    });

    if (!linkRes.ok) {
      const error = await linkRes.text();
      console.log(`   ❌ Failed:`, error);
      results.push({ name: product.name, success: false, error });
      continue;
    }

    const paymentLink = await linkRes.json();
    console.log(`   ✅ Created: ${paymentLink.url}`);

    results.push({ 
      name: product.name, 
      success: true, 
      payment_link: paymentLink.url,
      existed: false
    });
  }

  // Summary
  console.log('\n\n📊 Summary:');
  console.log('═'.repeat(60));
  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);
  const created = successful.filter(r => !r.existed);
  const existed = successful.filter(r => r.existed);

  console.log(`✅ Successful: ${successful.length}/${results.length}`);
  console.log(`   🆕 Created: ${created.length}`);
  console.log(`   ♻️  Already existed: ${existed.length}`);
  if (failed.length > 0) {
    console.log(`❌ Failed: ${failed.length}`);
    failed.forEach(f => console.log(`   - ${f.name}: ${f.error}`));
  }

  console.log('\n🎉 Done! Products now have payment links.');
  console.log('💡 Run sync to update KV storage with payment links');
}

createPaymentLinks().catch(err => {
  console.error('❌ Fatal error:', err);
  process.exit(1);
});
