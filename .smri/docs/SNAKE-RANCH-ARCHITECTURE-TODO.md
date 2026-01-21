# Snake Ranch Architecture Refactor TODO

## Current State (v0.7.94)
Snake ranch game directly writes to `localStorage`:
- `localStorage.userProducts` - for /game integration
- `localStorage.snakeCollection` - for /dex integration

**This violates the facade pattern!**

## Proper Architecture

### 1. Game Module Facade
Add to `/src/modules/game/index.js`:
```javascript
export { addCaughtSnake } from './api/snake-manager.js';
```

Create `/src/modules/game/api/snake-manager.js`:
```javascript
export async function addCaughtSnake(snakeData) {
  // Validate snake data
  // Add to userProducts via proper flow
  // Emit event for dex update
  // Return success/failure
}
```

### 2. Snake Ranch Integration
In `/src/modules/snake-game/SnakeRanch.js`:
```javascript
import { addCaughtSnake } from '../game/index.js';

async catchSnake() {
  const result = await addCaughtSnake({
    name: this.currentEncounter.name,
    morph: this.currentEncounter.morph,
    // ...
  });
  
  if (result.success) {
    this.snakes.push(result.snake);
  }
}
```

### 3. Flow Pattern (Optional)
Create a proper flow in `/breeding_flow/packages/flows/catch/`:
- Input: snake data from ranch
- Output: snake added to user collection
- Side effects: Updates dex, triggers game event

## Benefits
- ✅ Clean module boundaries
- ✅ Testable in isolation
- ✅ Single source of truth for snake management
- ✅ Easy to add validation/business rules
- ✅ Can swap storage backend (localStorage → KV)

## Implementation Priority
**Low** - Current localStorage approach works for demo
**High** - Before production release

