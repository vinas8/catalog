// Product Schema Definitions
// Defines structure for real and virtual snake products

/**
 * Real Snake Product Schema
 * Used for purchasable snakes in shop
 */
export const REAL_SNAKE_SCHEMA = {
  // Identity
  id: String,
  type: 'real',
  
  // Basic Info
  name: String,
  species: String, // 'ball_python', 'corn_snake', etc.
  morph: String,
  
  // Genetics (critical for real snakes)
  genetics: {
    visual: [String], // Visual traits: ['Banana', 'Piebald']
    hets: [String],   // Heterozygous: ['Albino', 'Clown']
    possible_hets: [String], // Possible hets (unproven)
    traits: [String]  // All combined traits
  },
  
  // Physical
  sex: String, // 'male', 'female', 'unknown'
  age: {
    hatch_date: String, // ISO date
    months: Number,
    years: Number
  },
  weight_grams: Number,
  length_cm: Number,
  
  // Breeder Info (important for real snakes)
  breeder: {
    id: String,
    name: String,
    location: String,
    reputation: Number // 1-5 stars
  },
  
  // Media
  images: [String], // URLs
  videos: [String], // URLs (optional)
  
  // Commerce
  price: Number,
  currency: String, // 'USD'
  available: Boolean,
  sold: Boolean,
  reserved: Boolean,
  
  // Metadata
  created_at: String,
  updated_at: String,
  stripe_product_id: String,
  stripe_price_id: String
};

/**
 * Virtual Snake Product Schema
 * Used for tutorial/practice snakes
 */
export const VIRTUAL_SNAKE_SCHEMA = {
  // Identity
  id: String,
  type: 'virtual',
  
  // Basic Info
  name: String,
  species: String,
  morph: String,
  
  // Physical (simpler for virtual)
  sex: String,
  age: {
    months: Number
  },
  weight_grams: Number,
  length_cm: Number,
  
  // Virtual-specific
  tutorial_level: Number, // Which tutorial level unlocks this
  difficulty: String, // 'beginner', 'intermediate', 'advanced'
  
  // Media
  images: [String],
  
  // Commerce (virtual snakes are free or earned)
  price: 0,
  unlock_method: String, // 'tutorial', 'achievement', 'purchase'
  
  // Metadata
  created_at: String,
  updated_at: String
};

/**
 * Product Type Guard
 */
export function isRealSnake(product) {
  return product.type === 'real';
}

export function isVirtualSnake(product) {
  return product.type === 'virtual';
}

/**
 * Validate product has required fields
 */
export function validateRealProduct(product) {
  const required = ['id', 'name', 'species', 'morph', 'sex', 'price'];
  const missing = required.filter(field => !product[field]);
  
  if (missing.length > 0) {
    throw new Error(`Real product missing required fields: ${missing.join(', ')}`);
  }
  
  // Ensure genetics object exists
  if (!product.genetics) {
    product.genetics = { visual: [], hets: [], traits: [] };
  }
  
  // Ensure breeder object exists
  if (!product.breeder) {
    product.breeder = { id: 'unknown', name: 'Unknown Breeder', location: 'Unknown' };
  }
  
  return true;
}

export function validateVirtualProduct(product) {
  const required = ['id', 'name', 'species', 'morph'];
  const missing = required.filter(field => !product[field]);
  
  if (missing.length > 0) {
    throw new Error(`Virtual product missing required fields: ${missing.join(', ')}`);
  }
  
  // Ensure price is 0
  product.price = 0;
  
  return true;
}

/**
 * Create default product based on type
 */
export function createDefaultProduct(type = 'real') {
  const base = {
    id: `${type}-${Date.now()}`,
    type: type,
    name: 'Unnamed Snake',
    species: 'ball_python',
    morph: 'Normal',
    sex: 'unknown',
    images: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  
  if (type === 'real') {
    return {
      ...base,
      genetics: { visual: ['Normal'], hets: [], traits: ['Normal'] },
      age: { hatch_date: new Date().toISOString(), months: 0, years: 0 },
      weight_grams: 100,
      length_cm: 30,
      breeder: { id: 'default', name: 'Default Breeder', location: 'Unknown' },
      price: 0,
      currency: 'USD',
      available: true,
      sold: false
    };
  } else {
    return {
      ...base,
      age: { months: 6 },
      weight_grams: 100,
      length_cm: 30,
      tutorial_level: 1,
      difficulty: 'beginner',
      price: 0,
      unlock_method: 'tutorial'
    };
  }
}
