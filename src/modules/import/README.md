# Import Module

Modular import system for Serpent Town catalog management.

## Primary Workflow

**KV is the source of truth** - all website data lives here.  
**Stripe is payment processor** - handles checkout only.  
**LocalStorage is cache** - mirrors KV for fast access.

```
┌──────────────────────────────────────────────┐
│  CSV File (Data Entry)                       │
│  - Easy to edit in Excel/Google Sheets       │
│  - Version controlled in Git                 │
└──────────────┬───────────────────────────────┘
               │
               ▼
       ┌───────────────┐
       │      KV       │ ★ SOURCE OF TRUTH
       │  (CloudFlare) │    All website data
       └───┬───────┬───┘
           │       │
           ▼       ▼
    ┌─────────┐ ┌──────────────┐
    │ Stripe  │ │LocalStorage  │
    │ Payment │ │   (Cache)    │
    │  Links  │ │              │
    └────┬────┘ └──────────────┘
         │
         ▼
    Stripe Webhook
         │
         ▼
    KV (update ownership)
```

**Main Flow:**  
1. CSV → KV (import data)
2. KV → Stripe (create payment products + links)
3. Stripe → KV (save payment links back)
4. KV → LocalStorage (cache for fast frontend)
5. Purchase → Stripe webhook → KV (update ownership)

## Architecture

```
Sources (READ)          Pipeline          Destinations (WRITE)
├── CSVSource ★        ┌─────────────┐    ├── KVDestination ★
├── StripeSource   ──► │ImportManager│ ──►├── StripeDestination
├── KVSource           └─────────────┘    ├── LocalStorageDestination
└── APISource                             └── FileSystemDestination

★ = Primary workflow
```

**Data Flow:**
```
CSV → KV → Stripe → KV (with links) → LocalStorage
```

**Responsibilities:**
- **KV**: Source of truth for all website data
- **Stripe**: Payment processing + checkout links
- **LocalStorage**: Fast cache (mirrors KV)

### Flow Examples

**Primary (Recommended):**
```
CSV → KV → Stripe → KV (with payment links) → LocalStorage
  1      2      3              4                    5
```

**Step-by-step:**
1. Import CSV to KV (source of truth)
2. Export KV to Stripe (create payment products)
3. Stripe creates payment links
4. Sync payment links back to KV
5. Cache KV to LocalStorage

**Alternative Flows:**
```
CSV → KV                       (Direct import, no Stripe needed)
KV → Stripe                    (Create payment products)
Stripe → KV                    (Sync payment links/status)
KV → LocalStorage              (Update cache)
KV → CSV                       (Export backup)
```

**Why KV is Source of Truth?**
- ✅ All website data in one place
- ✅ Fast global access (CloudFlare CDN)
- ✅ Survives Stripe rate limits
- ✅ Can work without Stripe (testing, demos)
- ✅ LocalStorage mirrors KV (not Stripe)

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

### Primary Workflow: CSV → KV → Stripe → KV → LocalStorage

**Step 1: Prepare CSV (data entry)**
```csv
Name,Morph,Gender,YOB,Weight,Price
Pudding,Banana Het Clown,Male,2024,,299
Mochi,Albino Pied,Female,2023,450g,450
Taohu,Super Mojave,Male,2024,,350
```

**Step 2: Import CSV to KV (source of truth)**
```javascript
import { ImportManager, CSVSource, KVDestination } from '/src/modules/import/index.js';

const manager = new ImportManager();
manager.setSource(new CSVSource());
manager.setDestination(new KVDestination());

await manager.runPipeline(csvFile, { cleanup: true });
// ✅ Products now in KV (source of truth)
```

**Step 3: Export KV to Stripe (create payment products)**
```javascript
manager.setSource(new KVSource());
manager.setDestination(new StripeDestination());
await manager.import();
// ✅ Stripe products created with payment links
```

**Step 4: Sync payment links back to KV**
```javascript
manager.setSource(new StripeSource());
manager.setDestination(new KVDestination());
await manager.import();
// ✅ KV now has products WITH payment links
```

**Step 5: Cache KV to LocalStorage (automatic in frontend)**
```javascript
// Frontend: catalog.html
const products = await fetch('/products'); // From KV
localStorage.setItem('products_cache', JSON.stringify(products));
// ✅ LocalStorage mirrors KV for fast access
```

**Result:** CSV → KV (source) → Stripe (payments) → KV (updated) → LocalStorage (cache)

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
