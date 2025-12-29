# Tutorial System Collection (S2-7.x)

**Collection ID:** `COL-S2-7-tutorial`  
**Module:** S2 (Game) - Tutorial Subsystem  
**Priority:** P0 (Critical)  
**Total Scenarios:** 6  
**Estimated Duration:** 5-6 minutes

## Purpose
Event-driven care tutorial system that teaches users snake care mechanics through interactive scenarios. Tests user retention, education-first commerce, and trust-building flows.

## Scenarios in Collection

### 1. S2-7.x.01 - Happy Path (Daily Check-in)
- **File:** `debug/tutorial-happy-path.html`
- **Duration:** <60s
- **Tests:** Daily care routine, positive reinforcement
- **Status:** ✅ 100% complete

### 2. S2-7.x.02 - Missed Care (2-3 days)
- **File:** `debug/tutorial-missed-care.html`
- **Duration:** <60s
- **Tests:** Stat decay, recovery mechanics, re-engagement
- **Status:** ✅ 100% complete

### 3. S2-7.x.03 - Education-First Commerce
- **File:** `debug/tutorial-education-commerce.html`
- **Duration:** <60s
- **Tests:** Browse catalog without purchase pressure
- **Status:** ✅ 100% complete

### 4. S2-7.x.04 - Trust Protection
- **File:** `debug/tutorial-trust-protection.html`
- **Duration:** <60s
- **Tests:** No forced purchase, transparent care requirements
- **Status:** ✅ 100% complete

### 5. S2-7.x.05 - Email-Driven Re-entry
- **File:** `debug/tutorial-email-reentry.html`
- **Duration:** <60s
- **Tests:** Email notification triggers, multi-day gaps
- **Status:** 🚧 50% complete

### 6. S2-7.x.06 - Failure Case (Educational)
- **File:** `debug/tutorial-failure-educational.html`
- **Duration:** <60s
- **Tests:** Death scenario, educational failure message
- **Status:** ✅ 100% complete

## Execution Instructions

### Quick Run (CLI)
```bash
npm run test:collection:tutorial
```

### Manual Sequential Execution
```bash
# Run each tutorial in order
open http://localhost:8000/debug/tutorial-happy-path.html
# Wait for completion, then next...
open http://localhost:8000/debug/tutorial-missed-care.html
# Continue through all 6...
```

### Via Debug Hub
```bash
# Navigate to debug hub
open http://localhost:8000/debug/

# Click any tutorial card in Quick Access section
# All 6 scenarios accessible from hub
```

## Success Criteria
- [ ] All 6 scenarios load without errors
- [ ] Event timers trigger correctly
- [ ] LocalStorage persists game state
- [ ] Stats decay at expected rates
- [ ] User can complete full flow in <6 minutes
- [ ] No console errors during execution

## Dependencies
- **LocalStorage:** Game state persistence
- **Event System:** Timer-based stat decay
- **Worker API:** `/user-products` endpoint
- **GitHub Pages:** Static HTML hosting
- **Playwright:** (optional) Automated runner

## Related Collections
- `COL-S1-purchase` - Purchase flow collection
- `COL-S0-health` - System health checks

## Metadata
- **Created:** 2025-12-29
- **Last Updated:** 2025-12-29
- **Version:** s0.7.0
- **Owner:** AI/Human collaborative
