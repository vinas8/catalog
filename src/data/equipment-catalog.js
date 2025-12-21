// Equipment shop catalog
// Based on v3.2_FINAL.md specification

export const EQUIPMENT_CATALOG = [
  // Heating equipment
  {
    id: 'heat_mat_basic',
    name: 'Heat Mat (Basic)',
    category: 'heating',
    description: 'Maintains temperature, requires daily checking',
    price_gold: 500,
    price_usd: null, // virtual only
    effects: {
      temperature_stability: 'low',
      automation: false,
      temperature_bonus: 5
    },
    image: '🔥',
    requires_loyalty: null
  },
  {
    id: 'heat_mat_thermostat',
    name: 'Heat Mat + Thermostat',
    category: 'heating',
    description: 'Auto-regulates temperature perfectly',
    price_gold: 2000,
    price_usd: null,
    effects: {
      temperature_stability: 'high',
      automation: true,
      temperature_bonus: 10
    },
    image: '🔥🌡️',
    requires_loyalty: null
  },
  {
    id: 'ceramic_heater',
    name: 'Ceramic Heat Emitter',
    category: 'heating',
    description: 'Professional heating solution',
    price_gold: 3500,
    price_usd: null,
    effects: {
      temperature_stability: 'high',
      automation: true,
      temperature_bonus: 15
    },
    image: '🔥🔥',
    requires_loyalty: 'silver'
  },
  
  // Humidity equipment
  {
    id: 'mister_manual',
    name: 'Manual Mister',
    category: 'humidity',
    description: 'Spray bottle for humidity control',
    price_gold: 100,
    price_usd: null,
    effects: {
      humidity_boost: 10,
      automation: false,
      humidity_stability: 'low'
    },
    image: '💦',
    requires_loyalty: null
  },
  {
    id: 'mister_auto',
    name: 'Automatic Misting System',
    category: 'humidity',
    description: 'Maintains humidity automatically',
    price_gold: 5000,
    price_usd: null,
    effects: {
      humidity_boost: 20,
      automation: true,
      humidity_stability: 'high'
    },
    image: '💦⚙️',
    requires_loyalty: 'gold'
  },
  
  // Monitoring equipment
  {
    id: 'thermometer_basic',
    name: 'Basic Thermometer',
    category: 'monitoring',
    description: 'Check temperature manually',
    price_gold: 50,
    price_usd: null,
    effects: {
      monitoring: 'temperature',
      accuracy: 'basic'
    },
    image: '🌡️',
    requires_loyalty: null
  },
  {
    id: 'hygrometer_basic',
    name: 'Basic Hygrometer',
    category: 'monitoring',
    description: 'Check humidity manually',
    price_gold: 50,
    price_usd: null,
    effects: {
      monitoring: 'humidity',
      accuracy: 'basic'
    },
    image: '💧',
    requires_loyalty: null
  },
  {
    id: 'monitoring_station',
    name: 'Digital Monitoring Station',
    category: 'monitoring',
    description: 'Auto-tracks temp & humidity with alerts',
    price_gold: 1500,
    price_usd: null,
    effects: {
      monitoring: 'both',
      accuracy: 'high',
      automation: true,
      alerts: true
    },
    image: '📊',
    requires_loyalty: 'silver'
  },
  
  // Feeding equipment
  {
    id: 'feeding_tongs',
    name: 'Feeding Tongs',
    category: 'feeding',
    description: 'Safe feeding tool',
    price_gold: 200,
    price_usd: null,
    effects: {
      safety_bonus: 5,
      stress_reduction: 2
    },
    image: '🥢',
    requires_loyalty: null
  },
  {
    id: 'auto_feeder',
    name: 'Auto-Feeder (Premium)',
    category: 'feeding',
    description: 'Feeds snake on schedule automatically',
    price_gold: 10000,
    price_usd: 49.99, // can buy with real money
    effects: {
      feeding_automation: true,
      schedule_frequency: 'auto'
    },
    image: '🍖⚙️',
    requires_loyalty: 'gold',
    premium: true
  },
  
  // Substrate & decor
  {
    id: 'substrate_basic',
    name: 'Paper Towel Substrate',
    category: 'substrate',
    description: 'Basic, cheap, easy to clean',
    price_gold: 50,
    price_usd: null,
    effects: {
      cleanliness_decay_rate: 1.0,
      humidity_retention: 'low'
    },
    image: '📄',
    requires_loyalty: null
  },
  {
    id: 'substrate_aspen',
    name: 'Aspen Bedding',
    category: 'substrate',
    description: 'Natural substrate, good for burrowing',
    price_gold: 300,
    price_usd: null,
    effects: {
      cleanliness_decay_rate: 1.2,
      humidity_retention: 'medium',
      happiness_bonus: 5
    },
    image: '🌾',
    requires_loyalty: null
  },
  {
    id: 'substrate_coconut',
    name: 'Coconut Husk',
    category: 'substrate',
    description: 'Holds humidity well, natural look',
    price_gold: 500,
    price_usd: null,
    effects: {
      cleanliness_decay_rate: 1.5,
      humidity_retention: 'high',
      happiness_bonus: 10
    },
    image: '🥥',
    requires_loyalty: null
  },
  {
    id: 'hide_basic',
    name: 'Basic Hide',
    category: 'decor',
    description: 'Essential hiding spot',
    price_gold: 200,
    price_usd: null,
    effects: {
      stress_reduction: 10,
      happiness_bonus: 5
    },
    image: '🏠',
    requires_loyalty: null
  },
  {
    id: 'hide_deluxe',
    name: 'Deluxe Cave Hide',
    category: 'decor',
    description: 'Premium hiding spot with humidity chamber',
    price_gold: 1000,
    price_usd: null,
    effects: {
      stress_reduction: 20,
      happiness_bonus: 15,
      humidity_boost: 5
    },
    image: '🏰',
    requires_loyalty: 'silver'
  },
  
  // Complete setups
  {
    id: 'starter_kit',
    name: 'Starter Kit',
    category: 'bundle',
    description: 'Everything you need to start: heat mat, thermometer, hide, substrate',
    price_gold: 800,
    price_usd: 9.99, // can buy with real money
    includes: ['heat_mat_basic', 'thermometer_basic', 'hide_basic', 'substrate_basic'],
    discount: 0.20, // 20% off individual prices
    image: '📦',
    requires_loyalty: null
  },
  {
    id: 'pro_kit',
    name: 'Professional Setup',
    category: 'bundle',
    description: 'Professional-grade equipment: thermostat, monitoring, auto-misting',
    price_gold: 9000,
    price_usd: 79.99,
    includes: ['heat_mat_thermostat', 'monitoring_station', 'mister_auto', 'hide_deluxe', 'substrate_coconut'],
    discount: 0.25,
    image: '📦⭐',
    requires_loyalty: 'silver'
  }
];

// Helper functions
export function getEquipmentById(id) {
  return EQUIPMENT_CATALOG.find(item => item.id === id);
}

export function getEquipmentByCategory(category) {
  return EQUIPMENT_CATALOG.filter(item => item.category === category);
}

export function getAvailableEquipment(loyaltyTier) {
  const tierOrder = ['bronze', 'silver', 'gold', 'platinum'];
  const playerTierIndex = tierOrder.indexOf(loyaltyTier || 'bronze');
  
  return EQUIPMENT_CATALOG.filter(item => {
    if (!item.requires_loyalty) return true;
    const requiredIndex = tierOrder.indexOf(item.requires_loyalty);
    return playerTierIndex >= requiredIndex;
  });
}

export function calculateBundlePrice(bundleId) {
  const bundle = EQUIPMENT_CATALOG.find(item => item.id === bundleId);
  if (!bundle || !bundle.includes) return bundle.price_gold;
  
  let totalPrice = 0;
  for (const itemId of bundle.includes) {
    const item = getEquipmentById(itemId);
    if (item) totalPrice += item.price_gold;
  }
  
  return Math.floor(totalPrice * (1 - bundle.discount));
}
