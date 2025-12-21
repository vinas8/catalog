// Equipment shop and purchase system
// Based on v3.2_FINAL.md specification

import { EQUIPMENT_CATALOG, getEquipmentById, getAvailableEquipment } from '../data/equipment-catalog.js';
import { Economy } from './economy.js';
import { SPECIES_PROFILES } from '../data/species-profiles.js';

export class EquipmentShop {
  
  // Get all equipment available to player based on loyalty tier
  static getAvailableItems(gameState) {
    const available = getAvailableEquipment(gameState.loyalty_tier);
    
    // Apply discount to prices
    return available.map(item => ({
      ...item,
      original_price_gold: item.price_gold,
      price_gold: Economy.applyDiscount(item.price_gold, gameState),
      discount_applied: gameState.shop_discount
    }));
  }
  
  // Get equipment by category
  static getItemsByCategory(category, gameState) {
    const available = this.getAvailableItems(gameState);
    return available.filter(item => item.category === category);
  }
  
  // Buy equipment with gold
  static buyEquipment(equipmentId, snakeId, gameState) {
    const item = getEquipmentById(equipmentId);
    
    if (!item) {
      throw new Error('Equipment not found');
    }
    
    // Check loyalty requirement
    if (item.requires_loyalty) {
      const tierOrder = ['bronze', 'silver', 'gold', 'platinum'];
      const playerTierIndex = tierOrder.indexOf(gameState.loyalty_tier);
      const requiredTierIndex = tierOrder.indexOf(item.requires_loyalty);
      
      if (playerTierIndex < requiredTierIndex) {
        throw new Error(`Requires ${item.requires_loyalty} tier (you are ${gameState.loyalty_tier})`);
      }
    }
    
    // Calculate price with discount
    const finalPrice = Economy.applyDiscount(item.price_gold, gameState);
    
    // Check funds
    if (gameState.currency.gold < finalPrice) {
      throw new Error(`Insufficient gold. Need ${finalPrice}, have ${gameState.currency.gold}`);
    }
    
    // Deduct gold
    gameState.currency.gold -= finalPrice;
    
    // Find snake
    const snake = gameState.snakes.find(s => s.id === snakeId);
    if (!snake) {
      throw new Error('Snake not found');
    }
    
    // Install equipment on snake
    this.installEquipment(snake, item);
    
    // Add to inventory
    gameState.equipment_inventory.push({
      id: 'equip_' + Date.now(),
      equipment_id: equipmentId,
      snake_id: snakeId,
      purchased_at: new Date().toISOString(),
      price_paid: finalPrice
    });
    
    // Track transaction
    gameState.transaction_history.push({
      type: 'equipment_purchase',
      timestamp: new Date().toISOString(),
      equipment_id: equipmentId,
      snake_id: snakeId,
      gold_cost: finalPrice,
      discount: gameState.shop_discount
    });
    
    return {
      success: true,
      item: item,
      price_paid: finalPrice,
      remaining_gold: gameState.currency.gold
    };
  }
  
  // Buy equipment with real money (premium items)
  static buyPremiumEquipment(equipmentId, gameState) {
    const item = getEquipmentById(equipmentId);
    
    if (!item || !item.price_usd) {
      throw new Error('This item cannot be purchased with real money');
    }
    
    // This would integrate with Stripe
    // For now, simulate the purchase
    const result = {
      success: true,
      item: item,
      stripe_payment_link: `https://buy.stripe.com/test_${equipmentId}`,
      price_usd: item.price_usd
    };
    
    return result;
  }
  
  // Install equipment on a snake's enclosure
  static installEquipment(snake, item) {
    const category = item.category;
    
    switch(category) {
      case 'heating':
        snake.equipment.heater = {
          type: item.id,
          name: item.name,
          working: true,
          automation: item.effects.automation || false,
          installed_at: new Date().toISOString()
        };
        break;
        
      case 'humidity':
        snake.equipment.mister = {
          type: item.id,
          name: item.name,
          working: true,
          automation: item.effects.automation || false,
          installed_at: new Date().toISOString()
        };
        break;
        
      case 'monitoring':
        if (item.effects.monitoring === 'temperature' || item.effects.monitoring === 'both') {
          snake.equipment.thermometer = {
            type: item.id,
            accuracy: item.effects.accuracy,
            installed_at: new Date().toISOString()
          };
        }
        if (item.effects.monitoring === 'humidity' || item.effects.monitoring === 'both') {
          snake.equipment.hygrometer = {
            type: item.id,
            accuracy: item.effects.accuracy,
            installed_at: new Date().toISOString()
          };
        }
        break;
        
      case 'feeding':
        if (item.effects.feeding_automation) {
          const profile = SPECIES_PROFILES[snake.species];
          const feedingSchedule = profile.feeding[snake.life_stage];
          
          snake.equipment.auto_feeder = {
            enabled: true,
            type: item.id,
            schedule_days: feedingSchedule.frequency_days,
            last_fed: new Date().toISOString(),
            installed_at: new Date().toISOString()
          };
        }
        break;
        
      case 'substrate':
        snake.equipment.substrate = {
          type: item.id,
          name: item.name,
          installed_at: new Date().toISOString()
        };
        break;
        
      case 'decor':
        if (!snake.equipment.hides) snake.equipment.hides = [];
        snake.equipment.hides.push({
          type: item.id,
          name: item.name,
          installed_at: new Date().toISOString()
        });
        break;
        
      case 'bundle':
        // Install all items in bundle
        if (item.includes) {
          for (const includedId of item.includes) {
            const includedItem = getEquipmentById(includedId);
            if (includedItem) {
              this.installEquipment(snake, includedItem);
            }
          }
        }
        break;
    }
    
    // Update snake's updated_at timestamp
    snake.updated_at = new Date().toISOString();
  }
  
  // Remove/uninstall equipment
  static uninstallEquipment(snake, category) {
    switch(category) {
      case 'heating':
        snake.equipment.heater = null;
        break;
      case 'humidity':
        snake.equipment.mister = null;
        break;
      case 'monitoring':
        snake.equipment.thermometer = false;
        snake.equipment.hygrometer = false;
        break;
      case 'feeding':
        snake.equipment.auto_feeder = null;
        break;
      case 'substrate':
        snake.equipment.substrate = null;
        break;
    }
    
    snake.updated_at = new Date().toISOString();
  }
  
  // Get total value of installed equipment
  static getEquipmentValue(snake) {
    let totalValue = 0;
    
    if (snake.equipment.heater) {
      const item = getEquipmentById(snake.equipment.heater.type);
      if (item) totalValue += item.price_gold;
    }
    if (snake.equipment.mister) {
      const item = getEquipmentById(snake.equipment.mister.type);
      if (item) totalValue += item.price_gold;
    }
    if (snake.equipment.substrate) {
      const item = getEquipmentById(snake.equipment.substrate.type);
      if (item) totalValue += item.price_gold;
    }
    if (snake.equipment.hides) {
      for (const hide of snake.equipment.hides) {
        const item = getEquipmentById(hide.type);
        if (item) totalValue += item.price_gold;
      }
    }
    
    return totalValue;
  }
  
  // Check if equipment is working properly
  static checkEquipmentStatus(snake) {
    const issues = [];
    
    if (!snake.equipment.heater) {
      issues.push('No heating equipment installed');
    } else if (!snake.equipment.heater.working) {
      issues.push('Heater is broken');
    }
    
    if (!snake.equipment.thermometer && !snake.equipment.hygrometer) {
      issues.push('No monitoring equipment installed');
    }
    
    if (!snake.equipment.hides || snake.equipment.hides.length === 0) {
      issues.push('No hide boxes installed (stress risk)');
    }
    
    return {
      ok: issues.length === 0,
      issues: issues
    };
  }
}

// Shop UI helpers
export function formatPrice(priceGold, priceUsd = null) {
  if (priceUsd) {
    return `$${priceUsd.toFixed(2)} or ${priceGold} gold`;
  }
  return `${priceGold} gold`;
}

export function getShopCategories() {
  return [
    { id: 'heating', name: 'Heating', icon: '🔥' },
    { id: 'humidity', name: 'Humidity', icon: '💦' },
    { id: 'monitoring', name: 'Monitoring', icon: '📊' },
    { id: 'feeding', name: 'Feeding', icon: '🍖' },
    { id: 'substrate', name: 'Substrate', icon: '🌾' },
    { id: 'decor', name: 'Decor & Hides', icon: '🏠' },
    { id: 'bundle', name: 'Bundles', icon: '📦' }
  ];
}
