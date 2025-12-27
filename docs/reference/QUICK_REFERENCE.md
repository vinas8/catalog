# 🎮 Quick Reference Guide - Serpent Town Debug & Testing

**Version:** 0.5.0  
**Last Updated:** 2025-12-27

---

## 🚀 Quick Start

### View All Test Scenarios
```bash
# Open in browser
open debug/test-scenarios.html

# Or visit online
https://vinas8.github.io/catalog/debug/test-scenarios.html
```

### Run System Health Check
```bash
# Open in browser
open debug/healthcheck.html

# Or visit online
https://vinas8.github.io/catalog/debug/healthcheck.html
```

### View Scenario Specifications
```bash
# Open .smri file
cat .smri

# Or search for specific scenario
grep "S1.1,2,3,4,5.01" .smri -A 30
```

---

## 🧪 Testing Commands

### Unit Tests
```bash
# Run all tests
npm test

# Run unit tests only
npm run test:unit

# Run snapshot tests
npm run test:snapshot

# Watch mode
npm test -- --watch
```

### E2E Tests (via Debug Hub)
```bash
# Open test scenarios page
open debug/test-scenarios.html

# Filter by priority
# Use buttons in web UI: P0, P1, P2, P3

# Filter by module
# Use buttons: Shop, Game, Auth, Payment, Worker

# Run individual test
# Click "Run Test" button on scenario card

# Run all implemented tests
# Click "Run All Tests" button
```

---

## 📝 Messages Configuration

### Usage in Code
```javascript
// Import messages
import { getMessage, showMessage, logDebug } from './src/config/messages.js';

// Get a message
const msg = getMessage('PURCHASE.SUCCESS');
// Returns: "✅ Purchase successful! Your snake is ready."

// Show notification to user
showMessage('GAME.FEED_SUCCESS');
// Shows UI notification (or console in debug mode)

// Log debug info
logDebug('KV_WRITE', { key: 'user:123', value: 'data' });
// Only logs if debug mode enabled

// Message with variables
const msg = getMessage('VALIDATION.OUT_OF_RANGE', { min: 0, max: 100 });
// Returns: "❌ Value must be between 0 and 100."
```

### Toggle Debug Mode
```javascript
// In browser console
SerpentMessages.toggleDebugMode();
// Reload page to apply

// Or via localStorage
localStorage.setItem('serpent_debug_mode', 'true');
window.location.reload();
```

### Available Message Categories
- `PURCHASE` - Purchase and payment messages
- `AUTH` - Authentication messages
- `GAME` - Game action messages
- `SHOP` - Equipment shop messages
- `NETWORK` - API and network messages
- `VALIDATION` - Form validation messages
- `DEBUG` - Debug-only messages
- `STRIPE` - Stripe integration messages
- `UI` - General UI messages

---

## 🗄️ Data Management

### Clear KV Data
```bash
# ⚠️ WARNING: Deletes ALL KV data!
bash scripts/clear-kv-data.sh

# Prompts for confirmation: type "yes"
# Clears: USER_PRODUCTS, PRODUCT_STATUS, USERS
```

### Verify KV Status
```bash
# List all keys
cd worker
npx wrangler kv:key list --namespace-id=$CLOUDFLARE_KV_NAMESPACE_ID

# Count keys
npx wrangler kv:key list --namespace-id=$CLOUDFLARE_KV_NAMESPACE_ID | jq '. | length'

# Get specific key
npx wrangler kv:key get "user:abc123" --namespace-id=$CLOUDFLARE_KV_NAMESPACE_ID
```

### Create Stripe Products
```bash
# ⚠️ WARNING: Creates products in Stripe!
bash scripts/create-stripe-products.sh

# Reads: data/snakes-inventory.json
# Creates: 24 products + payment links
# Saves: data/stripe-products-created.json

# Prompts for confirmation: type "yes"
```

### Verify Stripe Products
```bash
# View created products
cat data/stripe-products-created.json | jq '.[] | {name, price_eur, stripe_payment_link}'

# Count products
cat data/stripe-products-created.json | jq '. | length'
# Should output: 24

# Check specific product
cat data/stripe-products-created.json | jq '.[] | select(.name == "Pudding")'
```

---

## 🔍 Searching & Navigation

### Find Scenario by ID
```bash
# Search in .smri
grep "S1.1,2,3,4,5.01" .smri -A 50

# Find test file
find smri -name "*S1.1,2,3,4,5.01*"
```

### Search Messages
```bash
# Find message by key
grep "PURCHASE.SUCCESS" src/config/messages.js -A 2

# Find usage in code
grep -r "getMessage.*PURCHASE" src/
```

### Search Documentation
```bash
# Find in docs
grep -r "webhook" docs/ --include="*.md"

# Find TODO items
grep -r "TODO\|FIXME" src/ --include="*.js"

# Find hardcoded strings
grep -r "alert\|console.log" src/ --include="*.js" | grep -v "messages.js"
```

---

## 🌐 Worker Operations

### Deploy Worker
```bash
cd worker
npx wrangler publish worker.js

# Or use skill
.github/skills/worker-deploy.sh
```

### Test Worker
```bash
cd worker
node test-worker.js

# Or use skill
.github/skills/test-worker.sh
```

### Worker Logs
```bash
cd worker
npx wrangler tail

# Filter for errors
npx wrangler tail | grep "ERROR"

# Follow specific request
npx wrangler tail --format json | jq 'select(.event.request.url | contains("/stripe-webhook"))'
```

---

## 📊 Status Dashboards

### Project Status
```bash
# View .smri summary
head -20 .smri

# Check test status
npm test

# Count scenarios
grep "^S[0-9]" .smri | wc -l
# Should output: 42

# Count implemented
grep "implemented: true" .smri | wc -l
```

### File Structure
```bash
# View project tree
tree -L 2 -I 'node_modules|venv'

# Count files by type
find . -name "*.js" | wc -l
find . -name "*.html" | wc -l
find . -name "*.md" | wc -l
```

---

## 🎯 Common Tasks

### Adding a New Scenario

1. **Add to .smri**
```bash
nano .smri
# Add under appropriate priority section
# Follow SMRI notation: S{M}.{RRR}.{II}
```

2. **Create test page**
```bash
# Copy template
cp smri/scenarios/template.html smri/scenarios/S{ID}.html
# Edit test logic
```

3. **Add to debug hub**
```bash
# Update debug/test-scenarios.html
# Add to scenarios array with metadata
```

4. **Update counts**
```bash
# Update .smri header
# - total_scenarios
# - implemented count
# - test_coverage percentage
```

### Debugging Purchase Flow

1. **Check user hash**
```javascript
// In browser console
localStorage.getItem('serpent_user_hash')
```

2. **Monitor webhook**
```bash
# Watch worker logs
cd worker && npx wrangler tail
```

3. **Check KV data**
```bash
# List user products
npx wrangler kv:key get "user:{hash}" --namespace-id=$CLOUDFLARE_KV_NAMESPACE_ID
```

4. **Test polling**
```bash
# Open success page
open "success.html?session_id=test_123"
# Check browser console for polling attempts
```

### Updating Product Prices

1. **Edit inventory**
```bash
nano data/snakes-inventory.json
# Update price_eur values
```

2. **Regenerate Stripe products**
```bash
# Archive old products in Stripe Dashboard
# Run creator script
bash scripts/create-stripe-products.sh
```

3. **Update catalog**
```bash
nano catalog.html
# Update payment links from stripe-products-created.json
```

---

## 🔐 Environment Variables

```bash
# View available credentials (secrets hidden)
cat .env | grep -v "sk_\|whsec_"

# Check if credentials set
grep "CLOUDFLARE_API_TOKEN" .env
grep "STRIPE_PUBLISHABLE_KEY" .env

# Verify API access
bash scripts/verify-api-connections.sh
```

---

## 📚 Documentation Paths

| Document | Purpose | Location |
|----------|---------|----------|
| .smri | Test scenarios & business rules | `/.smri` |
| README | Project overview | `/README.md` |
| Enhancement Progress | Current work status | `/docs/ENHANCEMENT_PROGRESS.md` |
| Cleanup Plan | Documentation cleanup | `/docs/DOCUMENTATION_CLEANUP_PLAN.md` |
| Setup Guide | Deployment instructions | `/docs/SETUP.md` |
| API Reference | Worker API docs | `/docs/api/` |
| Messages Config | UI messages | `/src/config/messages.js` |

---

## 🆘 Troubleshooting

### Tests Failing
```bash
# Clean install
rm -rf node_modules
npm install

# Clear cache
npm cache clean --force

# Run specific test
npm test -- --grep "scenario-name"
```

### Worker Not Deploying
```bash
# Check credentials
cat worker/.env

# Check wrangler.toml
cat worker/wrangler.toml

# Login to Cloudflare
cd worker
npx wrangler login
```

### KV Operations Failing
```bash
# Verify namespace ID
echo $CLOUDFLARE_KV_NAMESPACE_ID

# Check bindings
cat worker/wrangler.toml | grep -A 3 "kv_namespaces"

# Test connection
npx wrangler kv:key list --namespace-id=$CLOUDFLARE_KV_NAMESPACE_ID
```

---

## 🎓 Learning Resources

### SMRI Notation
- Read: `.smri` header (lines 15-53)
- Examples: Lines 89-148 in `.smri`
- Interactive: `debug/test-scenarios.html`

### Test Writing
- Template: `smri/scenarios/template.html` (if exists)
- Example: `smri/scenarios/S1.1,2,3,4,5.01.html`
- Guide: `docs/guides/writing-tests.md` (if exists)

### Message Usage
- Reference: `src/config/messages.js`
- Examples: Search for `getMessage` in src/

---

**📌 Bookmark This File!**

Save path: `/docs/reference/QUICK_REFERENCE.md`

**Last Updated:** 2025-12-27  
**Version:** 0.5.0
