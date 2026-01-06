# S0: System Health Check Scenarios

**Module:** S0 - System Health  
**Total Scenarios:** 11  
**Status:** Ready for automation  
**Priority:** P0 (Critical)

---

## S0.0.01 - Generic Debug Health Check

**SMRI Code:** `S0.0.01`  
**URL:** `/debug/healthcheck.html`  
**Auto-run:** Yes  
**Duration:** 30 seconds

### Purpose
Verify all core systems are operational and responding correctly.

### Test Steps
1. Load debug health check page
2. Check frontend connectivity
3. Verify worker API availability (`/api/health`)
4. Test KV read/write operations
5. Validate Stripe API connectivity
6. Check email service status

### Expected Results
- ✅ All systems return HTTP 200
- ✅ Response times < 500ms
- ✅ No error messages in console
- ✅ Green status indicators

### Validation
```javascript
// Execute via debug console
const healthCheck = await fetch('https://catalog.navickaszilvinas.workers.dev/api/health');
const data = await healthCheck.json();
console.assert(data.status === 'ok', 'Health check failed');
```

---

## S0-2.2.01 - Game Mechanics Check

**SMRI Code:** `S0-2.2.01`  
**URL:** `/game.html`  
**Auto-run:** No (requires user interaction)

### Purpose
Verify game mechanics (stats, actions, decay) function correctly.

### Test Steps
1. Load game with test snake
2. Execute "Feed" action
3. Verify hunger stat increases
4. Wait 1 minute (simulated time)
5. Check stat decay occurred

### Expected Results
- ✅ Hunger increases by ~40 points
- ✅ Stress decreases by ~5 points
- ✅ Stats decay over time
- ✅ UI updates correctly

---

## S0-3.3.01 - Auth System Validation

**SMRI Code:** `S0-3.3.01`  
**URL:** `/account.html`

### Purpose
Validate user hash generation and authentication.

### Test Steps
1. Generate new user hash
2. Store in localStorage
3. Verify hash persists on reload
4. Test hash-based API calls
5. Validate security (no XSS)

### Expected Results
- ✅ Hash format: `user_[a-f0-9]{32}`
- ✅ Persistent across sessions
- ✅ API accepts hash
- ✅ No security vulnerabilities

---

## S0-4.4.01 - Payment Stripe Integration

**SMRI Code:** `S0-4.4.01`  
**URL:** `/catalog.html`

### Purpose
Test Stripe payment link generation and redirect.

### Test Steps
1. Load catalog page
2. Click "Buy Now" on any snake
3. Verify Stripe checkout URL generated
4. Check URL format and parameters
5. Validate price_id is correct

### Expected Results
- ✅ Stripe URL format correct
- ✅ Price_id matches product
- ✅ Redirect happens immediately
- ✅ Return URL set properly

---

## S0-5.5,5-1.01 - Worker API & KV Check

**SMRI Code:** `S0-5.5,5-1.01`  
**URL:** Worker endpoint

### Purpose
Validate Cloudflare Worker API and KV operations.

### Test Steps
1. Call `/api/products` endpoint
2. Verify JSON response
3. Test KV read operation
4. Test KV write operation (test namespace)
5. Check response times

### Expected Results
- ✅ Products endpoint returns 200
- ✅ JSON format valid
- ✅ KV operations successful
- ✅ Response time < 200ms

---

## S0-11.5-1.01 - KV Storage Health

**SMRI Code:** `S0-11.5-1.01`  
**URL:** `/admin-kv.html`

### Purpose
Comprehensive KV namespace health check.

### Test Steps
1. List all KV namespaces
2. Check PRODUCTS namespace
3. Check USER_PRODUCTS namespace
4. Verify data integrity
5. Test cleanup operations

### Expected Results
- ✅ All namespaces accessible
- ✅ No corrupted data
- ✅ List operations work
- ✅ Cleanup functions properly

---

## S0-12.5-2.01 - Stripe Webhooks

**SMRI Code:** `S0-12.5-2.01`  
**URL:** Worker webhook endpoint

### Purpose
Test Stripe webhook signature verification and processing.

### Test Steps
1. Send test webhook (checkout.session.completed)
2. Verify signature validation
3. Check event processing
4. Validate KV update occurred
5. Confirm email sent

### Expected Results
- ✅ Webhook accepted (HTTP 200)
- ✅ Signature valid
- ✅ Event processed correctly
- ✅ User product added to KV
- ✅ Email notification sent

---

## S0.0.02 - Virtual Snakes Demo Mode

**SMRI Code:** `S0.0.02`  
**URL:** `/game.html?demo=true`

### Purpose
Test virtual snake (tutorial reward) system without purchases.

### Test Steps
1. Load game in demo mode
2. Verify 3 virtual snakes appear
3. Test care actions on virtual snakes
4. Check stats are independent
5. Validate no real snake data mixed

### Expected Results
- ✅ 3 virtual snakes loaded
- ✅ Each has unique ID (v1, v2, v3)
- ✅ Care actions work
- ✅ Stats tracked separately
- ✅ No real data contamination

---

## S0.0.03 - Storage Cleanup Utility

**SMRI Code:** `S0.0.03`  
**URL:** `/debug/index.html`

### Purpose
Test localStorage and KV cleanup functions.

### Test Steps
1. Populate test data (localStorage)
2. Execute cleanup command
3. Verify test data removed
4. Check real data preserved
5. Test KV namespace cleanup

### Expected Results
- ✅ Test data cleared
- ✅ Real data intact
- ✅ No errors thrown
- ✅ Cleanup logged properly

---

## Automation Status

| Scenario | Automated | Manual | Priority |
|----------|-----------|--------|----------|
| S0.0.01 | ✅ | ✅ | P0 |
| S0-2.2.01 | ⏳ | ✅ | P1 |
| S0-3.3.01 | ⏳ | ✅ | P1 |
| S0-4.4.01 | ⏳ | ✅ | P0 |
| S0-5.5,5-1.01 | ✅ | ✅ | P0 |
| S0-11.5-1.01 | ✅ | ✅ | P0 |
| S0-12.5-2.01 | ⏳ | ✅ | P0 |
| S0.0.02 | ⏳ | ✅ | P2 |
| S0.0.03 | ⏳ | ✅ | P2 |

**Legend:** ✅ Complete | ⏳ In Progress | ❌ Not Started

---

## Execution

**Via Debug Hub:**
```
https://vinas8.github.io/catalog/debug/index.html
```

**Via SMRI Runner:**
```
https://vinas8.github.io/catalog/debug/smri-runner.html
```

**Via Command Line:**
```bash
npm run test:smri:s0
```

---

**Last Updated:** 2026-01-06  
**Owner:** System Health Team  
**Review Date:** Weekly
