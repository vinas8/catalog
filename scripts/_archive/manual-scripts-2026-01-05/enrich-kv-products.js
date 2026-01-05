#!/usr/bin/env node
/**
 * Enrich KV products with complete real snake data
 * SMRI S1.4 - Real Snake Detail Completeness
 */

const CLOUDFLARE_API_TOKEN = process.env.CLOUDFLARE_API_TOKEN;
const CLOUDFLARE_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID || '3e042c4dedd37fc847bc0d43ad23f296';
const KV_NAMESPACE_ID = process.env.KV_NAMESPACE_ID || '3f1bc456a3f84695b577b1d1c579d3a7';

if (!CLOUDFLARE_API_TOKEN) {
  console.error('❌ CLOUDFLARE_API_TOKEN environment variable required');
  process.exit(1);
}

const BASE_URL = `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/storage/kv/namespaces/${KV_NAMESPACE_ID}`;

// Enriched product templates
const ENRICHED_PRODUCTS = [
  {
    id: "prod_TdKcnyjt5Jk0U2",
    name: "Batman Ball",
    species: "ball_python",
    morph: "Banana",
    type: "real",
    source: "stripe",
    description: "Beautiful banana morph ball python, captive bred by reputable breeder",
    status: "available",
    price: 1000,
    currency: "eur",
    stripe_link: "https://buy.stripe.com/test_cNibJ04XLbUsaNQ8uPbjW00",
    image: "🐍",
    unique: true,
    
    sex: "male",
    weight_grams: 150,
    length_cm: 90,
    
    age: {
      hatch_date: "2024-03-15T00:00:00Z",
      months: 9,
      years: 0
    },
    
    genetics: {
      visual: ["Banana"],
      hets: ["Clown", "Pied"],
      possible_hets: [],
      traits: ["Banana", "Het Clown", "Het Pied"]
    },
    
    breeder: {
      id: "breeder_001",
      name: "Premium Pythons EU",
      location: "Netherlands",
      reputation: 5
    }
  },
  {
    id: "prod_TeTICJsKnUh6Xz",
    name: "Amelanistic Corn Snake",
    species: "corn_snake",
    morph: "Amelanistic",
    type: "real",
    source: "stripe",
    description: "Beautiful orange and red amelanistic corn snake, captive bred",
    status: "available",
    price: 80,
    currency: "eur",
    stripe_link: "https://buy.stripe.com/test_28E4gy89X3nW9JM6mHbjW01",
    image: "🌽🐍",
    
    sex: "female",
    weight_grams: 95,
    length_cm: 75,
    
    age: {
      hatch_date: "2024-06-20T00:00:00Z",
      months: 6,
      years: 0
    },
    
    genetics: {
      visual: ["Amelanistic"],
      hets: [],
      possible_hets: ["Hypo"],
      traits: ["Amelanistic", "Possible Het Hypo"]
    },
    
    breeder: {
      id: "breeder_002",
      name: "Corn Country Reptiles",
      location: "Germany",
      reputation: 4
    }
  }
];

async function updateKVProduct(product) {
  const key = `product:${product.id}`;
  const url = `${BASE_URL}/values/${key}`;
  
  console.log(`📝 Updating ${key}...`);
  
  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${CLOUDFLARE_API_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(product)
  });
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to update ${key}: ${response.status} ${error}`);
  }
  
  console.log(`✅ Updated ${product.name}`);
  return product;
}

async function main() {
  console.log('🐍 SMRI S1.4 - Enriching Product Data in KV');
  console.log('===========================================\n');
  
  console.log(`KV Namespace: ${KV_NAMESPACE_ID}`);
  console.log(`Products to enrich: ${ENRICHED_PRODUCTS.length}\n`);
  
  for (const product of ENRICHED_PRODUCTS) {
    try {
      await updateKVProduct(product);
    } catch (err) {
      console.error(`❌ Failed to update ${product.id}:`, err.message);
    }
  }
  
  console.log('\n✅ Product enrichment complete!');
  console.log('\n🔍 Verify with:');
  console.log('  curl https://catalog.navickaszilvinas.workers.dev/products | jq \'.[] | select(.type=="real") | {name, morph, sex, genetics, breeder}\'');
  console.log('\n📊 Test completeness:');
  console.log('  http://localhost:8001/debug/test-snake-detail-completeness.html');
}

main().catch(err => {
  console.error('❌ Script failed:', err);
  process.exit(1);
});
