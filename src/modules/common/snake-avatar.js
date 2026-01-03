// Snake Avatar Utility
// Shared logic for determining snake avatar emoji and state

/**
 * Get snake avatar emoji and state based on current stats
 * @param {Object} snake - Snake object with stats
 * @returns {Object} - { emoji: string, state: string }
 */
export function getSnakeAvatar(snake) {
  if (!snake || !snake.stats) {
    return { emoji: '🐍', state: 'normal' };
  }
  
  // Priority order: health → shedding → hunger → happiness → stress
  if (snake.stats.health < 30) {
    return { emoji: '🤢', state: 'sick' };
  }
  
  if (snake.shed_cycle?.stage === 'blue' || snake.shed_cycle?.stage === 'shedding') {
    return { emoji: '🔵', state: 'shedding' };
  }
  
  if (snake.stats.hunger < 30) {
    return { emoji: '😋', state: 'hungry' };
  }
  
  if (snake.stats.happiness > 80) {
    return { emoji: '😊', state: 'happy' };
  }
  
  if (snake.stats.stress > 70) {
    return { emoji: '😰', state: 'stressed' };
  }
  
  return { emoji: '🐍', state: 'normal' };
}
