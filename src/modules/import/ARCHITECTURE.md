# Modular Import System - Architecture

## Overview

Refactored import system with clean separation of concerns:
- **Sources** read data (CSV, Stripe, KV)
- **Destinations** write data (Stripe, KV)
- **ImportManager** orchestrates the pipeline

## Directory Structure

```
src/modules/import/
├── index.js                      # Main export
├── README.md                     # Documentation
├── IImportSource.js              # Source interface
├── IImportDestination.js         # Destination interface
├── ImportManager.js              # Pipeline orchestrator
├── sources/
│   ├── CSVSource.js             # CSV file/text parser
│   ├── StripeSource.js          # Read from Stripe API
│   └── KVSource.js              # Read from Cloudflare KV
└── destinations/
    ├── StripeDestination.js     # Write to Stripe API
    └── KVDestination.js         # Write to Cloudflare KV
```

## Pipeline Flow

```
┌─────────────┐
│   Source    │  CSV / Stripe / KV / Filesystem
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Validate   │  Parse, check format, normalize
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Destination │  Stripe / KV / Filesystem
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Assign    │  Link snakes to users (1:1)
└─────────────┘
```

## Import Scenarios

### Scenario 1: CSV → Stripe → KV

Owner imports CSV file to populate catalog.

```javascript
import { ImportManager, CSVSource, StripeDestination, KVDestination } from '/src/modules/import/index.js';

const manager = new ImportManager();

// Step 1: CSV → Stripe
manager.setSource(new CSVSource());
manager.setDestination(new StripeDestination());
await manager.runPipeline(csvFile, { cleanup: true });

// Step 2: Stripe → KV
manager.setDestination(new KVDestination());
await manager.import();
```

### Scenario 2: Stripe → KV (Sync)

Sync existing Stripe products to KV storage.

```javascript
const manager = new ImportManager();
manager.setSource(new StripeSource());
manager.setDestination(new KVDestination());

const stripeData = await manager.source.read();
await manager.destination.write(stripeData);
```

### Scenario 3: KV → Export (Backup)

Export KV data to CSV for backup.

```javascript
const manager = new ImportManager();
manager.setSource(new KVSource());

const data = await manager.source.read();
const csv = convertToCSV(data); // Helper function
downloadCSV(csv);
```

### Scenario 4: User Purchases → Assign

After Stripe checkout, assign snake to user.

```javascript
const manager = new ImportManager();
await manager.assignSnakes(['snake_prod_123'], 'user_abc');

// Logs:
// ✅ Assigned Pudding to user_abc
```

## Key Features

### 1. No Logic Duplication

All CSV parsing logic is in `CSVSource.js` - used by both admin and user imports.

### 2. Validation

- Required fields check
- Data type validation
- Business rules (YOB range, gender values)
- Returns detailed errors

### 3. Snake Assignment Rules

```javascript
// Rule: One snake can only belong to one user
await manager.assignSnakes(['snake_1'], 'user_A'); // ✅
await manager.assignSnakes(['snake_1'], 'user_B'); // ❌ Error: already owned

// Re-assignment requires unassign first
```

### 4. Logging

```javascript
const logs = manager.getLogs();
// [
//   { type: 'info', message: '🔍 Validating...', timestamp: '12:34:56' },
//   { type: 'success', message: '✅ Validation passed', timestamp: '12:34:57' }
// ]
```

## Implementation Files

### UI Pages

- `/admin/import-modular.html` - Full UI with pipeline visualization
- `/admin/import.html` - Original (can be refactored to use new system)
- `/import.html` - Public import (can be refactored)

### Demo Integration

- `/demo/index.html` - Updated with import pipeline explanation
  - Game tutorial now checks for snake assignment
  - Owner dashboard explains 5-step import process

## Snake Data Model

```typescript
interface Snake {
  // Core data
  name: string;           // "Pudding"
  morph: string;          // "Banana H. Clown"
  gender: string;         // Male | Female | Unknown
  yob: number;            // 2024
  weight: number | null;  // grams or null
  species: string;        // ball_python | corn_snake
  
  // Ownership
  owner: string | null;   // User ID or null
  status: string;         // available | assigned | sold
  
  // External IDs (when applicable)
  stripeProductId?: string;
  stripePriceId?: string;
  price?: number;
}
```

## Future Extensions

### Planned Sources

- `FileSystemSource` - Read from local filesystem
- `GoogleSheetsSource` - Import from Google Sheets
- `APISource` - Generic REST API source

### Planned Destinations

- `FileSystemDestination` - Export to local files
- `EmailDestination` - Send reports via email
- `WebhookDestination` - Push to external systems

### Advanced Features

- **Batch Assignment** - Assign multiple snakes at once
- **Transfer Ownership** - Move snake between users
- **Import History** - Track all imports with rollback
- **Conflict Resolution** - Handle duplicate names gracefully

## Testing

Run with sample data:

```bash
# Open in browser
open http://localhost:8000/admin/import-modular.html

# Click "Use Sample Data"
# Click "Run Full Pipeline"
# Watch pipeline visualization
```

## Migration Guide

To migrate existing import code:

```javascript
// OLD (monolithic)
async function uploadCSV(file) {
  const text = await file.text();
  const lines = text.split('\n');
  // ... parsing logic ...
  await fetch('/upload-products', { method: 'POST', body: JSON.stringify(products) });
}

// NEW (modular)
import { ImportManager, CSVSource, StripeDestination } from '/src/modules/import/index.js';

async function uploadCSV(file) {
  const manager = new ImportManager();
  manager.setSource(new CSVSource());
  manager.setDestination(new StripeDestination());
  
  const result = await manager.runPipeline(file);
  return result;
}
```

## Summary

✅ **Modular** - Sources and destinations are pluggable  
✅ **Validated** - Strong validation with detailed errors  
✅ **Ownership** - Enforces 1 snake = 1 user rule  
✅ **Reusable** - No duplicate logic across admin/user flows  
✅ **Extensible** - Easy to add new sources/destinations  
✅ **Logged** - Full pipeline visibility  

Now all import flows (admin CSV import, user import, Stripe sync) use the same validated, modular system.
