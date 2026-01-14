# Import Module

Modular import system for Serpent Town catalog management.

## Primary Workflow

**CSV is the source of truth** - reliable, version-controlled, easy to edit.

```
┌──────────────────────────────────────────────┐
│  CSV File (Source of Truth)                 │
│  - Easy to edit in Excel/Google Sheets      │
│  - Version controlled in Git                 │
│  - Reliable backup format                   │
└──────────────┬───────────────────────────────┘
               │
               ▼
       ┌───────────────┐
       │ ImportManager │
       └───┬───────┬───┘
           │       │
           ▼       ▼
    ┌─────────┐ ┌────┐
    │ Stripe  │ │ KV │
    │ +Links  │ │    │
    └─────────┘ └────┘
```

**Main Flow:** CSV → Stripe (creates products + prices + payment links) → KV

## Architecture

```
Sources (READ)          Pipeline          Destinations (WRITE)
├── CSVSource ★        ┌─────────────┐    ├── StripeDestination ★
├── StripeSource   ──► │ImportManager│ ──►├── KVDestination ★
├── KVSource           └─────────────┘    ├── FileSystemDestination
└── APISource                             └── DatabaseDestination

★ = Primary workflow
```

### Flow Examples

**Primary (Recommended):**
```
CSV → Stripe → KV              (Main workflow: import & sync)
```

**Alternative Flows:**
```
CSV → KV                       (Direct import, skip Stripe)
CSV → FileSystem               (Export to JSON backup)
Stripe → KV                    (Sync existing products)
KV → Stripe                    (Restore from backup)
Stripe → CSV                   (Export catalog for editing)
```

**Why CSV First?**
- ✅ Easy to edit (Excel, Google Sheets, etc.)
- ✅ Version controlled (Git tracks changes)
- ✅ Reliable backup format
- ✅ No API rate limits or dependencies
- ✅ Human-readable and auditable

**Key Concept:** Sources and Destinations are **independent**  
- CSV can be a **SOURCE** (read from file)
- Stripe can be a **SOURCE** (read from API) AND **DESTINATION** (write to API)
- Mix and match any source with any destination!

## Pipeline Steps

1. **Cleanup** - Clear existing data (optional)
2. **Validate** - Parse and validate source data
3. **Import** - Write to destination
4. **Assign** - Link snakes to users (ensures 1 snake = 1 owner)

## Usage

### Primary Workflow: CSV → Stripe → KV

**Step 1: Prepare CSV (source of truth)**
```csv
Name,Morph,Gender,YOB,Weight,Price
Pudding,Banana Het Clown,Male,2024,,299
Mochi,Albino Pied,Female,2023,450g,450
Taohu,Super Mojave,Male,2024,,350
```

**Step 2: Import to Stripe (creates products + prices + payment links)**
```javascript
import { ImportManager, CSVSource, StripeDestination } from '/src/modules/import/index.js';

const manager = new ImportManager();
manager.setSource(new CSVSource());
manager.setDestination(new StripeDestination());

const result = await manager.runPipeline(csvFile, {
  cleanup: true  // Clear old products first
});
// ✅ Products in Stripe with payment links automatically created
```

**Step 3: Sync to KV (for fast frontend access)**
```javascript
manager.setSource(new StripeSource());
manager.setDestination(new KVDestination());
await manager.import();
// ✅ Products now in Stripe AND KV with payment links
```

**Result:** CSV → Stripe (with checkout links) → KV (fast API) → Catalog displays "Buy Now" buttons ✅

### Example 1: CSV → Stripe (with payment links)

```javascript
import { ImportManager, CSVSource, StripeDestination } from '/src/modules/import/index.js';

const manager = new ImportManager();
manager.setSource(new CSVSource());
manager.setDestination(new StripeDestination());

// Import creates products + prices + payment links automatically
const result = await manager.runPipeline(csvFile, {
  cleanup: true      // Clear old products first
});
// ✅ Products now in Stripe with payment links
```

### Example 2: CSV → Stripe → KV (full pipeline)

```javascript
// Step 1: CSV to Stripe
manager.setSource(new CSVSource());
manager.setDestination(new StripeDestination());
await manager.runPipeline(csvFile, { cleanup: true });

// Step 2: Stripe to KV (sync)
manager.setSource(new StripeSource());
manager.setDestination(new KVDestination());
await manager.import();
// ✅ Products in Stripe AND KV with payment links
```

### Example 3: Stripe → CSV (export catalog)

```javascript
manager.setSource(new StripeSource());
manager.setDestination(new CSVDestination());

const result = await manager.import();
// ✅ result.data = CSV string ready to download
```

### Example 4: KV → Stripe (restore from backup)

```javascript
manager.setSource(new KVSource());
manager.setDestination(new StripeDestination());
await manager.import();
// ✅ Restored products to Stripe from KV backup
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
- **Writes:** Creates Stripe products + prices + payment links
- **Clears:** Deletes all products from Stripe
- **Use for:** Uploading new inventory, restoring from backup

### KVDestination
- **Writes:** Stores products in Cloudflare KV
- **Clears:** Clears KV namespace
- **Use for:** Fast product lookup, caching

### CSVDestination (Future)
- **Writes:** Generates CSV file from products
- **Use for:** Export catalog, backups, reports

### FileSystemDestination (Future)
- **Writes:** Saves to JSON file
- **Use for:** Local backups, development

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
