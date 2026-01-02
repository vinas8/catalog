# 📚 API Documentation for GitHub Copilot

**Date:** 2026-01-02  
**For:** Future Copilot sessions working on Serpent Town  
**Purpose:** Understand available APIs and testing workflow

---

## 🎯 Quick Start: How to Work with APIs

### 1. **Always Check Healthcheck First**
```bash
# Open in browser
https://vinas8.github.io/catalog/debug/healthcheck.html

# Or use curl to test endpoints
curl https://catalog.navickaszilvinas.workers.dev/health
curl https://catalog.navickaszilvinas.workers.dev/kv/list-products
curl https://catalog.navickaszilvinas.workers.dev/user-products?user=test_hash
```

### 2. **API Testing Workflow**
```
Step 1: Need new API endpoint? 
  → Check healthcheck.html - does it exist?
  
Step 2: Test with curl in terminal
  → curl -X GET/POST {WORKER_URL}/endpoint
  → Verify response format
  
Step 3: If new endpoint needed:
  → Add to worker/worker.js first
  → Deploy worker: cd worker && bash cloudflare-deploy.sh
  → Add test to healthcheck.html
  → Document in this prompt for future sessions
  
Step 4: Combine endpoints in scenarios
  → Use tested endpoints in E2E scenarios
  → Reference healthcheck tests as examples
```

### 3. **Never Guess - Always Verify**
- ✅ **DO:** `curl {endpoint}` to see actual response
- ✅ **DO:** Check healthcheck.html for endpoint list
- ✅ **DO:** Test in Data Manager UI first
- ❌ **DON'T:** Assume endpoint exists without testing
- ❌ **DON'T:** Create duplicate endpoints

---

## 📡 Available API Endpoints (25 total)

### ☁️ Worker Core Endpoints (4)
```bash
# Health check - used by monitoring, CI/CD
GET /health
Response: { "status": "healthy", "version": "0.7.0", "timestamp": "..." }

# Version info - used by deployment verification
GET /version
Response: { "version": "0.7.0", "updated": "...", "endpoints": [...] }

# Test CORS
curl -I https://catalog.navickaszilvinas.workers.dev/health
# Look for: access-control-allow-origin

# Debug info - test registry
GET /debug
GET /debug?category=api
GET /debug?test=api-health-check
```

---

### 🗄️ KV Storage - Product Endpoints (6)

```bash
# List all products (PRIMARY - use this!)
GET /kv/list-products
Response: { "count": 50, "keys": [ { "name": "product_abc123", ... } ] }
Used by: catalog.html, shop, Data Manager

# Get single product
GET /kv/get-product?id=product_abc123
Response: { "id": "...", "name": "Ball Python", "price": 200, ... }
Used by: product detail views

# Check if product is sold
GET /product-status?id=product_abc123
Response: { "available": true/false, "soldTo": "user_hash", ... }
Used by: S1.0.01 (product availability check)

# Count customers
GET /kv/customer-count
Response: { "count": 47 }
Used by: Data Manager dashboard

# Get user statistics
GET /kv/user-stats
Response: { "totalUsers": 47, "totalProducts": 50, "totalAssignments": 12 }
Used by: Data Manager analytics

# List all KV keys (admin)
GET /kv/list-all
Response: { "allKeys": [...], "count": 150 }
Used by: Data Manager KV inspector
```

---

### 👤 KV Storage - User Data Endpoints (4)

```bash
# Get user's purchased products (CRITICAL for game.html)
GET /user-products?user=b2c6456eb79a
Response: [ { "id": "snake1", "name": "...", "purchaseDate": "..." }, ... ]
Used by: S2 (game), S3 (auth), S4 (payment verification)

# List all customers
GET /kv/list-customers
Response: { "customers": ["hash1", "hash2", ...], "count": 47 }
Used by: Data Manager

# List user-product assignments
GET /kv/list-user-products
Response: { "userProducts": [ { "user": "hash", "products": [...] } ] }
Used by: Data Manager user view

# Get Stripe session info (after purchase)
GET /session-info?session_id=cs_test_abc123
Response: { "customer_email": "...", "amount_total": 20000, "metadata": {...} }
Used by: S4.x (payment scenarios)
Requires: Stripe API key in worker
```

---

### 💳 Stripe Integration Endpoints (5)

```bash
# All Stripe data comes through KV
# Products are synced: CSV → Stripe → product.created webhook → KV

# Check Stripe product count (via KV)
GET /kv/list-products
# Same endpoint, data originates from Stripe

# Stripe API health (external)
curl https://status.stripe.com/api/v2/status.json
Response: { "status": { "description": "All Systems Operational" } }

# Payment links are in product data
GET /kv/get-product?id=product_abc
Response: { ..., "stripe_link": "https://buy.stripe.com/...", ... }

# Checkout session (server-side only)
# Use Stripe SDK in worker, not direct endpoint
```

---

### ⚙️ GitHub API Endpoints (3)

```bash
# List workflows
curl https://api.github.com/repos/vinas8/catalog/actions/workflows
Response: { "total_count": 5, "workflows": [...] }

# Latest workflow run
curl https://api.github.com/repos/vinas8/catalog/actions/runs?per_page=1
Response: { "workflow_runs": [ { "status": "completed", "conclusion": "success", ... } ] }

# GitHub Pages status
curl -I https://vinas8.github.io/catalog/
# Should return 200 OK
```

---

### 🔗 Webhook Endpoints (3) - POST only

```bash
# Purchase webhook (checkout.session.completed)
POST /stripe-webhook
Body: Stripe event payload
Action: Assigns product to user hash
Test: stripe trigger checkout.session.completed
Used by: S4.4.x, S12.2.x

# Product sync webhook (product.created)
POST /stripe-product-webhook
Body: Stripe product event
Action: Sync product to KV
Trigger: Automatic when CSV import creates Stripe product
Used by: CSV import flow, S12.x

# Assign virtual snake (tutorial rewards)
POST /assign-virtual-snake
Body: { "userHash": "...", "snakeData": {...} }
Action: Give user a virtual snake reward
Used by: S2 (tutorial completion)
```

---

## 🔧 Worker Deployment & Updates

### Current Deployment Method
```bash
cd /root/catalog/worker
bash cloudflare-deploy.sh
```

### ⚠️ QUESTION: Is this correct?
**Please evaluate:**
1. Do other Cloudflare Workers use a different update method?
2. Should we use `wrangler publish` directly?
3. Do we need GitHub Actions for auto-deployment?
4. Is our deployment script following best practices?

### Current Script Analysis Needed
```bash
# Review current deployment script
cat /root/catalog/worker/cloudflare-deploy.sh

# Check if it:
# - Uses wrangler CLI correctly
# - Updates KV bindings properly
# - Sets secrets/environment variables
# - Validates before deploying
# - Has rollback capability
```

### Deployment Checklist
- [ ] Are KV namespaces bound correctly?
- [ ] Are secrets (STRIPE_SECRET_KEY) set?
- [ ] Does worker.js version match package.json?
- [ ] Are we using `wrangler publish` or `wrangler deploy`?
- [ ] Do we have staging vs production environments?

---

## 🎯 How to Add New Endpoints

### Step-by-Step Process

#### 1. **Design & Document**
```markdown
# Example: New endpoint for snake breeding
Endpoint: GET /breed-compatibility?snake1=id1&snake2=id2
Purpose: Check if two snakes can breed
Used by: S2 (game breeding mechanic)
Response: { "compatible": true/false, "reason": "..." }
```

#### 2. **Implement in Worker**
```javascript
// In worker/worker.js
if (pathname === '/breed-compatibility' && request.method === 'GET') {
  return handleBreedCompatibility(request, env, corsHeaders);
}

async function handleBreedCompatibility(request, env, corsHeaders) {
  const url = new URL(request.url);
  const snake1 = url.searchParams.get('snake1');
  const snake2 = url.searchParams.get('snake2');
  
  // Logic here...
  
  return new Response(JSON.stringify({ compatible: true }), {
    headers: corsHeaders
  });
}
```

#### 3. **Add to Healthcheck**
```javascript
// In debug/healthcheck.html
{
  id: 26,
  name: 'GET /breed-compatibility',
  method: 'GET',
  endpoint: '/breed-compatibility?snake1=test1&snake2=test2',
  description: 'Used by: S2 (breeding mechanic)',
  run: async () => {
    const res = await fetch(WORKER_URL + '/breed-compatibility?snake1=test1&snake2=test2');
    const data = await res.json();
    return { compatible: data.compatible, reason: data.reason };
  }
}
```

#### 4. **Test with curl**
```bash
curl "https://catalog.navickaszilvinas.workers.dev/breed-compatibility?snake1=test1&snake2=test2"
```

#### 5. **Deploy**
```bash
cd worker
bash cloudflare-deploy.sh
# Wait 30 seconds for global propagation
curl https://catalog.navickaszilvinas.workers.dev/version
```

#### 6. **Use in Scenarios**
```javascript
// Now safe to use in E2E tests, game logic, etc.
const checkBreeding = async (snake1Id, snake2Id) => {
  const res = await fetch(`${WORKER_URL}/breed-compatibility?snake1=${snake1Id}&snake2=${snake2Id}`);
  return await res.json();
};
```

---

## 🚨 Common Mistakes to Avoid

### ❌ Don't Do This
```javascript
// Assuming endpoint exists without checking
const products = await fetch('/api/products'); // Wrong URL!
const data = await res.json(); // Might not be JSON!
```

### ✅ Do This Instead
```javascript
// Check healthcheck.html first, then use correct URL
const products = await fetch('https://catalog.navickaszilvinas.workers.dev/kv/list-products');
if (!products.ok) {
  console.error('API error:', products.status);
  return;
}
const data = await products.json();
```

### ❌ Don't Create Duplicate Endpoints
```javascript
// Bad: Creating new endpoint when one exists
GET /list-all-products  // Already have /kv/list-products!
```

### ✅ Use Existing Endpoints
```javascript
// Good: Check healthcheck.html, reuse existing
GET /kv/list-products  // Documented, tested, reliable
```

---

## 📝 Prompt for New Copilot Session

**Copy-paste this when starting a new session:**

```
I'm working on Serpent Town (catalog project). Before implementing anything:

1. Check /root/catalog/debug/healthcheck.html for existing API endpoints
2. Test endpoints with curl: https://catalog.navickaszilvinas.workers.dev/{endpoint}
3. If endpoint exists - use it. If not - add to worker first, then healthcheck
4. Verify worker deployment process in /root/catalog/worker/cloudflare-deploy.sh

Current setup:
- Worker URL: https://catalog.navickaszilvinas.workers.dev
- 25 documented API endpoints in healthcheck.html
- Deployment: cd worker && bash cloudflare-deploy.sh

Questions to investigate:
1. Is our Cloudflare Worker deployment method correct?
2. Should we use wrangler publish vs wrangler deploy?
3. Do we need GitHub Actions auto-deployment?
4. Are KV bindings and secrets properly configured?

Please review:
- /root/catalog/worker/cloudflare-deploy.sh
- /root/catalog/worker/wrangler.toml
- Compare with Cloudflare Workers best practices
```

---

## 🔍 Quick Reference: Deployment Investigation

### Files to Check
```bash
# Deployment script
cat /root/catalog/worker/cloudflare-deploy.sh

# Wrangler config
cat /root/catalog/worker/wrangler.toml

# Worker code
cat /root/catalog/worker/worker.js | head -50

# Package versions
cat /root/catalog/worker/package.json
```

### Questions for Investigation
1. **Are we using the right wrangler command?**
   - `wrangler publish` (deprecated?)
   - `wrangler deploy` (modern?)

2. **Are KV namespaces bound correctly?**
   - USER_PRODUCTS
   - PRODUCT_STATUS
   - PRODUCTS

3. **Are secrets managed properly?**
   - STRIPE_SECRET_KEY
   - MAILTRAP_API_TOKEN

4. **Do we have environment separation?**
   - Production vs staging
   - Testing environment

5. **Is deployment automated?**
   - GitHub Actions on push to main?
   - Manual only?

---

## 📊 Summary

**25 API Endpoints Available:**
- ☁️ 4 Worker Core
- 🗄️ 6 KV Products
- 👤 4 KV User Data
- 💳 5 Stripe Integration
- ⚙️ 3 GitHub API
- 🔗 3 Webhooks

**Always:**
1. Check healthcheck.html first
2. Test with curl before implementing
3. Add new endpoints to worker → deploy → add to healthcheck → use in scenarios
4. Document which SMRI scenarios use each endpoint

**Never:**
- Assume endpoints exist
- Create duplicate endpoints
- Skip testing with curl
- Deploy without updating healthcheck

---

**Next Session TODO:**
- [ ] Review cloudflare-deploy.sh script
- [ ] Verify wrangler.toml configuration
- [ ] Check if using modern wrangler commands
- [ ] Evaluate GitHub Actions auto-deployment
- [ ] Confirm KV bindings are correct
- [ ] Document secrets management process
