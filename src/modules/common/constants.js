// Single source of truth for entity types and care stat names
export const ENTITY_TYPES = {
  SNAKE: "snake",
  PLANT: "plant"
};

export const CARE_STATS = {
  HUNGER: "hunger",
  WATER: "water",
  TEMPERATURE: "temperature",
  HUMIDITY: "humidity",
  HEALTH: "health",
  STRESS: "stress",
  CLEANLINESS: "cleanliness",
  HAPPINESS: "happiness",
  CLEAN: "clean" // Legacy alias
};

// Shared keys and default limits
export const SHARED_KEYS = {
  COLLECTION_KV_PREFIX: "collection:"
};

export const DEFAULTS = {
  STAT_MAX: 100,
  STAT_MIN: 0
};

// === GAME CONSTANTS (No Magic Values) ===

/**
 * Default initial stats for new snakes
 * Used when creating virtual or purchased snakes
 */
export const DEFAULT_SNAKE_STATS = {
  hunger: 80,
  water: 100,
  temperature: 80,
  humidity: 50,
  health: 100,
  stress: 0,
  cleanliness: 100,
  happiness: 80
};

/**
 * Default snake weight in grams
 */
export const DEFAULT_SNAKE_WEIGHT = 100;

/**
 * Timeout durations in milliseconds
 */
export const TIMEOUTS = {
  DEBUG_MESSAGE_AUTO_REMOVE: 5000, // 5 seconds
  FETCH_TIMEOUT: 10000, // 10 seconds
  ANIMATION_DURATION: 300 // 0.3 seconds
};

/**
 * String truncation limits
 */
export const STRING_LIMITS = {
  URL_DISPLAY_LENGTH: 50,
  MAX_NAME_LENGTH: 100,
  MAX_DESCRIPTION_LENGTH: 500
};

/**
 * Stat modification amounts
 */
export const STAT_CHANGES = {
  FEED_HUNGER: 40,
  FEED_STRESS_REDUCE: 5,
  WATER_AMOUNT: 50,
  WATER_STRESS_REDUCE: 2,
  CLEAN_AMOUNT: 30,
  CLEAN_STRESS_REDUCE: 10,
  DECAY_RATE_PER_HOUR: 5
};

/**
 * Care action costs (gold)
 */
export const ACTION_COSTS = {
  FEED: 10,
  WATER: 5,
  CLEAN: 15,
  EQUIPMENT_BASE: 50
};

/**
 * Snake age categories (in months)
 */
export const AGE_CATEGORIES = {
  HATCHLING: { min: 0, max: 6 },
  JUVENILE: { min: 6, max: 18 },
  ADULT: { min: 18, max: 120 },
  SENIOR: { min: 120, max: 999 }
};

/**
 * Temperature ranges (Celsius)
 */
export const TEMPERATURE_RANGES = {
  MIN_SAFE: 26,
  IDEAL_LOW: 28,
  IDEAL_HIGH: 32,
  MAX_SAFE: 35
};

/**
 * Humidity ranges (percentage)
 */
export const HUMIDITY_RANGES = {
  MIN_SAFE: 40,
  IDEAL_LOW: 50,
  IDEAL_HIGH: 60,
  MAX_SAFE: 80
};
