/**
 * Shop Module - E-commerce & Economy
 * Enable/Disable: Set ENABLED = true/false
 */

export const ENABLED = true;

export { Economy, createInitialGameState } from './business/economy.js';
export { EquipmentShop } from './business/equipment.js';
export { StripeSync } from './business/stripe-sync.js';
export { SPECIES_PROFILES } from './data/species-profiles.js';
export { MORPHS_BY_SPECIES } from './data/morphs.js';
export { TRAIT_DATABASE, getTraitInfo, parseMorphString, getAllTraits } from './data/traits.js';
export { EQUIPMENT_CATALOG } from './data/equipment-catalog.js';
export { initializeCatalog } from './data/catalog.js';
export { ShopView, openShop } from './ui/shop-view.js';
export { CatalogRenderer } from './ui/catalog-renderer.js';
