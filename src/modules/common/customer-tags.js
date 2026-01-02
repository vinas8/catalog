// Customer Tags System
// Auto-tagging and manual tagging for customer segmentation

export const CUSTOMER_TAGS = {
  COLLECTOR: 'collector',
  NEWBIE: 'newbie',
  BUYER: 'buyer',
  B2B: 'b2b',
  BOT_BLOCKED: 'bot_blocked',
  TUTORIAL_GRADUATE: 'tutorial_graduate',
  POWER_USER: 'power_user'
};

export const TAG_RULES = {
  collector: {
    auto: (user) => {
      const realSnakes = user.products?.filter(p => p.type === 'real') || [];
      return realSnakes.length >= 10;
    },
    description: 'Owns 10+ real snakes',
    priority: 1
  },
  
  power_user: {
    auto: (user) => {
      const realSnakes = user.products?.filter(p => p.type === 'real') || [];
      return realSnakes.length >= 25;
    },
    description: 'Owns 25+ real snakes',
    priority: 0
  },
  
  buyer: {
    auto: (user) => {
      const realSnakes = user.products?.filter(p => p.type === 'real') || [];
      return realSnakes.length > 0;
    },
    description: 'Has purchased at least 1 real snake',
    priority: 3
  },
  
  newbie: {
    auto: (user) => {
      return user.tutorial_completed !== true;
    },
    description: 'Tutorial not completed',
    priority: 4
  },
  
  tutorial_graduate: {
    auto: (user) => {
      return user.tutorial_completed === true;
    },
    description: 'Completed tutorial',
    priority: 2
  }
};

/**
 * Calculate automatic tags for a user
 * @param {Object} user - User object with products and metadata
 * @returns {Array<string>} - Array of tag names
 */
export function calculateAutoTags(user) {
  if (!user) return [];
  
  const tags = [];
  
  // Evaluate all tag rules
  for (const [tagName, rule] of Object.entries(TAG_RULES)) {
    if (rule.auto && rule.auto(user)) {
      tags.push(tagName);
    }
  }
  
  // Sort by priority (lower number = higher priority)
  tags.sort((a, b) => {
    const priorityA = TAG_RULES[a]?.priority ?? 999;
    const priorityB = TAG_RULES[b]?.priority ?? 999;
    return priorityA - priorityB;
  });
  
  return tags;
}

/**
 * Merge auto and manual tags, removing duplicates
 * @param {Array<string>} autoTags - Automatically assigned tags
 * @param {Array<string>} manualTags - Manually assigned tags
 * @returns {Array<string>} - Merged unique tags
 */
export function mergeTags(autoTags = [], manualTags = []) {
  return [...new Set([...autoTags, ...manualTags])];
}

/**
 * Check if user has a specific tag
 * @param {Object} user - User object
 * @param {string} tag - Tag name to check
 * @returns {boolean}
 */
export function hasTag(user, tag) {
  const allTags = mergeTags(user.tags, user.tags_manual);
  return allTags.includes(tag);
}

/**
 * Get tag display info
 * @param {string} tagName - Tag name
 * @returns {Object} - Display information
 */
export function getTagInfo(tagName) {
  const rule = TAG_RULES[tagName];
  if (!rule) return { description: tagName, emoji: '🏷️' };
  
  const emojis = {
    collector: '🏆',
    power_user: '⭐',
    buyer: '🛒',
    newbie: '🌱',
    tutorial_graduate: '🎓',
    b2b: '🏢',
    bot_blocked: '🚫'
  };
  
  return {
    description: rule.description,
    emoji: emojis[tagName] || '🏷️',
    priority: rule.priority
  };
}
