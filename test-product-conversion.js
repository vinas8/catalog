// Quick test of product conversion logic
const sampleUserProduct = {
  assignment_id: "assign_123",
  product_id: "prod_RWqy0mKd6t5WKo",
  user_id: "user_abc",
  nickname: "Banana Baby",
  product_type: "real",
  acquired_at: "2025-12-21T17:00:00Z",
  acquisition_type: "purchase"
};

const sampleCatalogProduct = {
  id: "prod_RWqy0mKd6t5WKo",
  name: "Banana Ball Python",
  species: "ball_python",
  morph: "banana",
  price: 450.00
};

function createSnakeFromProduct(userProduct, catalogProduct = null) {
  return {
    id: userProduct.assignment_id || userProduct.id,
    product_id: userProduct.product_id,
    user_id: userProduct.user_id,
    nickname: userProduct.nickname || catalogProduct?.name || 'Unnamed Snake',
    species: catalogProduct?.species || userProduct.species || 'ball_python',
    morph: catalogProduct?.morph || userProduct.morph || 'normal',
    type: userProduct.product_type || 'real',
    sex: catalogProduct?.sex || userProduct.sex || 'unknown',
    birth_date: catalogProduct?.birth_year || userProduct.birth_year || 2024,
    weight_grams: catalogProduct?.weight_grams || userProduct.weight_grams || 100,
    length_cm: 30,
    acquired_date: userProduct.acquired_at || new Date().toISOString(),
    acquisition_type: userProduct.acquisition_type || 'purchase',
    stats: userProduct.stats || {
      hunger: 80,
      water: 100,
      temperature: 80,
      humidity: 50,
      health: 100,
      stress: 10,
      cleanliness: 100,
      happiness: 80
    },
    equipment: userProduct.equipment || {
      heater: null,
      mister: null,
      thermometer: false,
      hygrometer: false
    },
    shed_cycle: userProduct.shed_cycle || {
      stage: 'normal',
      last_shed: new Date().toISOString(),
      days_since_last: 0
    },
    created_at: userProduct.acquired_at || new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
}

console.log('🔄 Testing product conversion...\n');
console.log('Input (User Product):');
console.log(JSON.stringify(sampleUserProduct, null, 2));
console.log('\nInput (Catalog Product):');
console.log(JSON.stringify(sampleCatalogProduct, null, 2));

const result = createSnakeFromProduct(sampleUserProduct, sampleCatalogProduct);
console.log('\n✅ Output (Game Snake):');
console.log(JSON.stringify(result, null, 2));
