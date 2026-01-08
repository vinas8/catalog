// Currency and economy system
// Based on v3.2_FINAL.md specification
// Handles real money → gold conversion, purchases, loyalty system

import { SPECIES_PROFILES } from '../data/species-profiles.js';
import { calculateMorphPrice } from '../data/morphs.js';
import { ECONOMY_CONFIG } from '../../../config/economy-config.js';

export class Economy {
  
  // Convert real money (USD cents) to in-game gold
  static moneyToCurrency(usdCents) {
    return ECONOMY_CONFIG.usdCentsToGold(usdCents);
  }
  
  // Convert USD dollars to gold
  static dollarsToGold(usdDollars) {
    return ECONOMY_CONFIG.usdDollarsToGold(usdDollars);
  }
  
  // When player buys real snake with real money
  static onRealPurchase(product, gameState) {
    const priceCents = product.unit_amount || Math.floor(product.price_usd * 100);
    
    // Create snake from product
    const snake = this.createSnakeFromProduct(product);
    snake.type = 'real';
    snake.acquisition_type = 'purchase';
    
    // Add to collection
    gameState.snakes.push(snake);
    
    // Bonus: Give in-game currency equal to purchase price
    const bonusGold = this.moneyToCurrency(priceCents);
    gameState.currency.gold += bonusGold;
    
    // Loyalty points
    const loyaltyPoints = ECONOMY_CONFIG.calculateLoyaltyPoints(priceCents);
    gameState.loyalty_points += loyaltyPoints;
    
    // Update loyalty tier
    this.updateLoyaltyTier(gameState);
    
    // Save transaction history
    gameState.transaction_history.push({
      type: 'real_purchase',
      timestamp: new Date().toISOString(),
      product_id: product.product_id,
      snake_id: snake.id,
      usd_cents: priceCents,
      bonus_gold: bonusGold,
      loyalty_points: loyaltyPoints
    });
    
    return {
      snake_id: snake.id,
      bonus_gold: bonusGold,
      new_loyalty_points: gameState.loyalty_points,
      new_tier: gameState.loyalty_tier
    };
  }
  
  // Buy virtual snake with in-game gold
  static buyVirtualSnake(species, morphIds, gameState) {
    const price = this.getVirtualSnakePrice(species, morphIds);
    
    if (gameState.currency.gold < price) {
      throw new Error(`Insufficient gold. Need ${price}, have ${gameState.currency.gold}`);
    }
    
    // Deduct gold
    gameState.currency.gold -= price;
    
    // Create virtual snake
    const snake = this.createVirtualSnake(species, morphIds);
    gameState.snakes.push(snake);
    
    // Track transaction
    gameState.transaction_history.push({
      type: 'virtual_purchase',
      timestamp: new Date().toISOString(),
      species: species,
      morphs: morphIds,
      snake_id: snake.id,
      gold_cost: price
    });
    
    return snake;
  }
  
  // Calculate price for virtual snake
  static getVirtualSnakePrice(species, morphIds = []) {
    const basePrice = ECONOMY_CONFIG.getVirtualBasePrice(species);
    
    if (!morphIds || morphIds.length === 0) {
      return basePrice; // Normal morph
    }
    
    // Calculate with morph multipliers
    return calculateMorphPrice(basePrice, morphIds);
  }
  
  // Create snake instance from real product
  static createSnakeFromProduct(product) {
    const snake = {
      id: 'snake_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      product_id: product.product_id || null,
      species: product.species,
      morph: product.morph || 'normal',
      
      // Identity
      nickname: product.nickname || this.generateDefaultName(product.species),
      sex: product.sex || (Math.random() > 0.5 ? 'male' : 'female'),
      birth_date: product.birth_date || new Date().toISOString(),
      acquired_date: new Date().toISOString(),
      acquisition_type: 'purchase',
      type: 'real',
      
      // Physical (defaults)
      weight_grams: product.weight_grams || 50,
      length_cm: product.length_cm || 30,
      life_stage: 'hatchling',
      
      // Stats (all start at 100)
      stats: {
        hunger: 80,
        water: 100,
        temperature: 80,
        humidity: 50,
        health: 100,
        stress: 10,
        cleanliness: 100,
        happiness: 80
      },
      
      // Care tracking
      last_fed: new Date().toISOString(),
      last_watered: new Date().toISOString(),
      last_cleaned: new Date().toISOString(),
      last_handled: null,
      
      // Shedding
      shed_cycle: {
        stage: 'normal',
        last_shed: new Date().toISOString(),
        days_since_last: 0,
        estimated_next: null,
        stuck_shed_history: 0
      },
      
      // Health
      health_log: [],
      current_illnesses: [],
      vet_visits: 0,
      
      // Breeding (will be populated based on morphs)
      genetics: product.genetics || {},
      times_bred: 0,
      offspring_count: 0,
      breeding_cooldown_until: null,
      
      // Equipment
      enclosure_id: null,
      equipment: {
        heater: null,
        mister: null,
        thermometer: false,
        hygrometer: false,
        substrate: null,
        hides: [],
        decor: []
      },
      
      // Metadata
      in_vacation_mode: false,
      vacation_until: null,
      notes: '',
      favorite: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    return snake;
  }
  
  // Create virtual snake
  static createVirtualSnake(species, morphIds = []) {
    const snake = this.createSnakeFromProduct({
      species: species,
      morph: morphIds.length > 0 ? morphIds.join('_') : 'normal'
    });
    snake.type = 'virtual';
    snake.acquisition_type = 'virtual_purchase';
    return snake;
  }
  
  // Generate random name
  static generateDefaultName(species) {
    const names = {
      ball_python: ['Monty', 'Slinky', 'Noodle', 'Pretzel', 'Banana Joe', 'Slider'],
      corn_snake: ['Kernels', 'Maize', 'Autumn', 'Ember', 'Rusty', 'Cornbread']
    };
    const list = names[species] || ['Snake'];
    return list[Math.floor(Math.random() * list.length)];
  }
  
  // Loyalty tier system
  static updateLoyaltyTier(gameState) {
    const points = gameState.loyalty_points;
    
    let newTier = 'bronze';
    if (points >= 1500) newTier = 'platinum';
    else if (points >= 500) newTier = 'gold';
    else if (points >= 100) newTier = 'silver';
    
    gameState.loyalty_tier = newTier;
    
    // Update shop discount
    gameState.shop_discount = this.getTierDiscount(newTier);
    
    return newTier;
  }
  
  static getTierDiscount(tier) {
    const discounts = {
      'bronze': 0,
      'silver': 0.05,  // 5% off
      'gold': 0.10,    // 10% off
      'platinum': 0.15 // 15% off
    };
    return discounts[tier] || 0;
  }
  
  // Get tier benefits description
  static getTierBenefits(tier) {
    const benefits = {
      'bronze': {
        discount: '0%',
        perks: ['Basic equipment access']
      },
      'silver': {
        discount: '5%',
        perks: ['5% shop discount', 'Premium equipment access', 'Monthly bonus gold']
      },
      'gold': {
        discount: '10%',
        perks: ['10% shop discount', 'Elite equipment access', 'Auto-feeder unlock', 'Weekly bonus gold']
      },
      'platinum': {
        discount: '15%',
        perks: ['15% shop discount', 'All equipment unlocked', 'Daily bonus gold', 'Exclusive morphs']
      }
    };
    return benefits[tier] || benefits['bronze'];
  }
  
  // Apply discount to price
  static applyDiscount(price, gameState) {
    const discount = gameState.shop_discount || 0;
    return Math.floor(price * (1 - discount));
  }
}

// Initialize game state structure
export function createInitialGameState() {
  return {
    player_id: 'player_' + Date.now(),
    created_at: new Date().toISOString(),
    
    // Currency
    currency: {
      gold: 1000 // Starting gold
    },
    
    // Loyalty system
    loyalty_points: 0,
    loyalty_tier: 'bronze',
    shop_discount: 0,
    
    // Collections
    snakes: [],
    equipment_inventory: [],
    
    // History
    transaction_history: [],
    
    // Game settings
    game_speed: 1, // multiplier
    vacation_mode: false,
    
    // Metadata
    last_save: new Date().toISOString(),
    version: '3.4.0'
  };
}
