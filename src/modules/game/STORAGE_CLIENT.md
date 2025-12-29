# GameStorageClient Architecture

## Overview
Universal storage client for game state persistence with pluggable backends.

## Architecture

```
┌─────────────────────────────────────┐
│      GameStorageClient              │
│  (Game-specific operations)         │
├─────────────────────────────────────┤
│    LocalStorageClient (base)        │
│    - CRUD operations                │
│    - Event system                   │
│    - Auto-save                      │
├─────────────────────────────────────┤
│         StorageAdapter              │
│  (Pluggable backends)               │
└─────────────────────────────────────┘
           ▲
           │
    ┌──────┴──────┬──────────┐
    │             │          │
LocalStorage   KVAdapter  IndexedDB
  Adapter                 Adapter
```

## Features

### 1. Pluggable Backends
- **LocalStorageAdapter**: Browser localStorage (default)
- **KVAdapter**: Cloudflare Workers KV
- **IndexedDBAdapter**: Browser IndexedDB (planned)

### 2. Event System
```javascript
storage.on('set', ({ key, value }) => {
  console.log(`Saved: ${key}`);
});

storage.on('autosave', () => {
  console.log('Auto-saving...');
});

storage.on('adapter_changed', ({ adapter }) => {
  console.log(`Switched to: ${adapter}`);
});
```

### 3. Auto-save
- Configurable interval (default: 30s)
- Emits 'autosave' event
- Can be started/stopped

### 4. Game-Specific Operations
- `getGameState()` / `setGameState()`
- `getSnake()` / `setSnake()` / `getAllSnakes()`
- `getTutorialProgress()` / `markTutorialComplete()`
- `getUser()` / `setUser()`

### 5. Backup/Restore
- `exportAll()` - Full backup
- `importAll()` - Restore from backup

## Usage Examples

### Basic Usage
```javascript
import { createGameStorage } from './storage-client.js';

// Create client (localStorage backend)
const storage = createGameStorage({ 
  backend: 'localStorage',
  namespace: 'serpent_town'
});

// Save game state
await storage.setGameState({
  snakes: [
    { id: 1, name: 'Banana', hunger: 80 }
  ],
  gold: 150,
  lastSaved: Date.now()
});

// Load game state
const state = await storage.getGameState();
console.log(state.gold); // 150
```

### Switch Backend (localStorage → KV)
```javascript
import { KVAdapter } from './storage-client.js';

// Start with localStorage
const storage = createGameStorage({ backend: 'localStorage' });

// Switch to KV when user logs in
const kvAdapter = new KVAdapter(
  'https://catalog.navickaszilvinas.workers.dev',
  'USER_PRODUCTS'
);

storage.setAdapter(kvAdapter);

// Now all operations use KV
await storage.setGameState({ ... });
```

### Event Listeners (Tutorial System)
```javascript
// Tutorial runner watches storage events
storage.on('set', ({ key, value }) => {
  if (key.startsWith('snake:')) {
    console.log('Snake updated:', value);
    updateTutorialUI(value);
  }
});

storage.on('autosave', () => {
  showNotification('Progress saved!');
});
```

### Snake Operations
```javascript
// Get specific snake
const snake = await storage.getSnake('snake_001');

// Update snake
await storage.setSnake('snake_001', {
  ...snake,
  hunger: snake.hunger - 10
});

// Get all snakes
const allSnakes = await storage.getAllSnakes();

// Delete snake
await storage.deleteSnake('snake_001');
```

### Tutorial Progress
```javascript
// Get progress
const progress = await storage.getTutorialProgress();
// { completed: ['S2-7.x.01'], current: 'S2-7.x.02' }

// Mark complete
await storage.markTutorialComplete('S2-7.x.02');

// Update progress
await storage.setTutorialProgress({
  completed: ['S2-7.x.01', 'S2-7.x.02'],
  current: 'S2-7.x.03',
  started_at: Date.now()
});
```

### Backup/Restore
```javascript
// Export all data
const backup = await storage.exportAll();
/*
{
  version: '1.0.0',
  exported_at: '2025-12-29T04:00:00.000Z',
  data: {
    game_state: { ... },
    snake:snake_001: { ... },
    tutorial_progress: { ... }
  }
}
*/

// Download backup
const blob = new Blob([JSON.stringify(backup)], { type: 'application/json' });
const url = URL.createObjectURL(blob);
// ... download logic

// Import backup
await storage.importAll(backup);
```

## Integration with Tutorial System

### tutorial-collection-runner.html
```javascript
import { createGameStorage } from '../src/modules/game/storage-client.js';

// Initialize storage
const storage = createGameStorage({
  backend: 'localStorage',
  autoSave: true,
  saveInterval: 10000 // 10s for tutorials
});

// Listen for game events
storage.on('set', ({ key, value }) => {
  if (key.startsWith('snake:')) {
    updateScenarioStatus(key, value);
  }
});

// Before running scenario
await storage.setTutorialProgress({
  current: 'S2-7.x.01',
  started_at: Date.now()
});

// After scenario completes
await storage.markTutorialComplete('S2-7.x.01');
```

### game-controller.js (refactored)
```javascript
import { createGameStorage } from './storage-client.js';

class SnakeMuffin {
  constructor() {
    // Replace direct localStorage calls
    this.storage = createGameStorage({
      backend: 'localStorage',
      autoSave: true
    });
    
    // Listen to auto-save events
    this.storage.on('autosave', () => this.saveGame());
  }

  async loadGame() {
    return await this.storage.getGameState();
  }

  async saveGame() {
    await this.storage.setGameState(this.gameState);
  }

  async switchToKV(userHash) {
    const kvAdapter = new KVAdapter(WORKER_URL, 'USER_PRODUCTS');
    this.storage.setAdapter(kvAdapter);
    // All future saves go to KV
  }
}
```

## Benefits

1. **Testability**: Mock adapters for testing
2. **Flexibility**: Switch backends without code changes
3. **Events**: Track storage operations
4. **Type Safety**: Consistent API across backends
5. **Tutorial Integration**: Event-driven scenario tracking
6. **Backup/Restore**: Easy data export/import
7. **Namespace Isolation**: Multiple storage instances

## Migration Path

### Phase 1: Add Client (current)
- Create `storage-client.js`
- Keep existing localStorage calls

### Phase 2: Refactor game-controller.js
- Replace localStorage with GameStorageClient
- Test with localStorage backend

### Phase 3: Add KV Support
- Implement user login → switch to KV
- Test hybrid localStorage + KV

### Phase 4: Tutorial Integration
- Update tutorial-collection-runner.html
- Add event tracking for scenarios

## File Structure
```
src/modules/game/
├── storage-client.js          (NEW - this file)
├── game-controller.js         (REFACTOR - use storage-client)
└── plugins/
    └── tutorial-tracker.js    (NEW - tracks tutorial progress)
```
