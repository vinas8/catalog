#!/usr/bin/env node
/**
 * Fetch products from Stripe with payment links and update worker
 */

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || 'sk_test_51Sg3s0BjL72pe9Xs4RFYFTBPDDUhUzNTgAUbNUxhRk4pZQGZtpEXQvIFI6o2NZIujJcyGKKGn6Ml2rnoy16yVsf700BDVZxVYI';
const WORKER_URL = 'https://catalog.navickaszilvinas.workers.dev';

async function updateProductsWithLinks() {
  console.log('🔄 Fetching products and payment links from Stripe...\n');

  // Fetch all payment links
  const linksRes = await fetch('https://api.stripe.com/v1/payment_links?limit=100', {
    headers: { 'Authorization': `Bearer ${STRIPE_SECRET_KEY}` }
  });

  if (!linksRes.ok) {
    console.error('❌ Failed to fetch payment links');
    process.exit(1);
  }

  const { data: paymentLinks } = await linksRes.json();
  console.log(`✅ Found ${paymentLinks.length} payment links`);

  // Map price_id -> payment_link_url
  const priceToLink = {};
  paymentLinks.forEach(link => {
    const priceId = link.line_items?.[0]?.price;
    if (priceId) {
      priceToLink[priceId] = link.url;
    }
  });

  console.log(`📋 Mapped ${Object.keys(priceToLink).length} prices to links\n`);

  // Fetch all products
  const productsRes = await fetch('https://api.stripe.com/v1/products?active=true&limit=100', {
    headers: { 'Authorization': `Bearer ${STRIPE_SECRET_KEY}` }
  });

  if (!productsRes.ok) {
    console.error('❌ Failed to fetch products');
    process.exit(1);
  }

  const { data: products } = await productsRes.json();
  console.log(`✅ Found ${products.length} products\n`);

  // Update each product with its payment link
  let updated = 0;
  let skipped = 0;

  for (const product of products) {
    // Get price
    let priceId = product.default_price;
    
    if (!priceId) {
      const pricesRes = await fetch(`https://api.stripe.com/v1/prices?product=${product.id}&active=true&limit=1`, {
        headers: { 'Authorization': `Bearer ${STRIPE_SECRET_KEY}` }
      });

      if (pricesRes.ok) {
        const { data: prices } = await pricesRes.json();
        if (prices.length > 0) {
          priceId = prices[0].id;
        }
      }
    }

    if (!priceId) {
      console.log(`⚠️  ${product.name}: No price found`);
      skipped++;
      continue;
    }

    const paymentLink = priceToLink[priceId];
    
    if (!paymentLink) {
      console.log(`⚠️  ${product.name}: No payment link for price ${priceId}`);
      skipped++;
      continue;
    }

    // Update product metadata with payment link
    const updateData = new URLSearchParams({
      'metadata[stripe_link]': paymentLink
    });

    const updateRes = await fetch(`https://api.stripe.com/v1/products/${product.id}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${STRIPE_SECRET_KEY}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: updateData
    });

    if (updateRes.ok) {
      console.log(`✅ ${product.name}: ${paymentLink.substring(0, 50)}...`);
      updated++;
    } else {
      console.log(`❌ ${product.name}: Update failed`);
      skipped++;
    }
  }

  console.log('\n\n📊 Summary:');
  console.log('═'.repeat(60));
  console.log(`✅ Updated: ${updated}`);
  console.log(`⚠️  Skipped: ${skipped}`);
  console.log(`📦 Total: ${products.length}`);
  console.log('\n🎉 Done! Products now have payment links in metadata.');
  console.log('💡 Refresh catalog page to see "Buy Now" buttons!');
}

updateProductsWithLinks().catch(err => {
  console.error('❌ Fatal error:', err);
  process.exit(1);
});
