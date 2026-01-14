# Import Module

Modular import system for Serpent Town catalog management.

## Architecture

```
Sources (read from)     Pipeline          Destinations (write to)
├── CSVSource          ┌─────────────┐    ├── StripeDestination
├── StripeSource   ──► │ImportManager│ ──►├── KVDestination  
└── KVSource           └─────────────┘    └── (Future: FileSystem)
```

## Pipeline Steps

1. **Cleanup** - Clear existing data (optional)
2. **Validate** - Parse and validate source data
3. **Import** - Write to destination
4. **Assign** - Link snakes to users (ensures 1 snake = 1 owner)

## Usage

### Basic Import (CSV → Stripe → KV)

```javascript
import { 
  ImportManager, 
  CSVSource, 
  StripeDestination,
  KVDestination 
} from '/src/modules/import/index.js';

// Setup
const manager = new ImportManager();
const csvSource = new CSVSource();
const stripeDestination = new StripeDestination();

manager.setSource(csvSource);
manager.setDestination(stripeDestination);

// Run pipeline
const result = await manager.runPipeline(csvFile, {
  cleanup: true,     // Clear Stripe first
  assign: false      // Don't assign yet
});

// Sync to KV
manager.setDestination(new KVDestination());
await manager.import();
```

### Import with Snake Assignment

```javascript
const result = await manager.runPipeline(csvFile, {
  cleanup: true,
  assign: true,
  userId: 'user_123',
  snakeIds: ['snake_1', 'snake_2']
});
```

### Manual Steps

```javascript
// Step by step control
await manager.cleanup();
await manager.validate(rawData);
await manager.import();
await manager.assignSnakes(['snake_1'], 'user_123');

// Check logs
const logs = manager.getLogs();
logs.forEach(log => console.log(`[${log.type}] ${log.message}`));
```

## Interfaces

### IImportSource

All sources must implement:
- `validate(rawData)` - Parse and validate
- `read()` - Return normalized array
- `getMetadata()` - Return {name, type, description}

### IImportDestination

All destinations must implement:
- `write(snakes)` - Write data
- `clear()` - Delete all data
- `getMetadata()` - Return {name, type, description}

## Data Format

### Normalized Snake Object

```javascript
{
  name: "Pudding",
  morph: "Banana H. Clown",
  gender: "Male",
  yob: 2024,
  weight: null,
  species: "ball_python",
  owner: null,           // User ID or null
  status: "available"    // available | assigned | sold
}
```

## Sources

### CSVSource
- Reads: File or text string
- Validates: Headers, required fields, data types
- Required columns: Name, Morph, Gender, YOB

### StripeSource
- Reads: Stripe API products
- Auto-normalizes from Stripe metadata

### KVSource
- Reads: Cloudflare KV products
- Direct read, no transformation

## Destinations

### StripeDestination
- Writes: Creates Stripe products
- Clears: Deletes all products

### KVDestination
- Writes: Syncs from Stripe to KV
- Clears: Not implemented (manual)

## Rules

1. **One Snake, One Owner** - Snake can only be assigned to one user
2. **Validate Before Import** - Always validate() before import()
3. **Cleanup is Optional** - Use cleanup: false to append
4. **Logs Are Stateful** - Call clearLogs() between runs

## Extension

To add new source/destination:

```javascript
import { IImportSource } from './IImportSource.js';

export class MySource extends IImportSource {
  async validate(rawData) { /* ... */ }
  async read() { /* ... */ }
  getMetadata() {
    return { name: 'My Source', type: 'custom', description: '...' };
  }
}
```

## Examples

See:
- `/import.html` - UI implementation
- `/admin/import.html` - Admin version
- `/demo/index.html` - Tutorial integration
