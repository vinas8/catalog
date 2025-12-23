# 🎯 SMRI Test Suite

**Location:** http://localhost:8000/smri/

Comprehensive E2E scenario testing & system health validation.

## 📁 Structure

```
/smri/
  index.html          - Main test suite (all 42 scenarios)
  healthcheck.html    - Quick system health check
  scenarios.json      - Scenario definitions
  main.js            - Test executor
  styles.css         - UI styles
```

## 🎯 Features

- **42 SMRI Scenarios** - All documented E2E tests
- **Swagger-style UI** - Expandable test cards with request/response
- **Priority filtering** - P0, P1, P2, P3+
- **Module filtering** - Shop, Game, Auth, Payment, Worker, Common
- **Auto-run** - P0 critical tests on page load
- **Export results** - JSON format for CI/CD

## 🚀 Quick Start

```bash
# Open test suite
open http://localhost:8000/smri/

# Run via .smri command
# Health check auto-runs
```

## 📊 Scenarios

- **P0 (Critical):** 13 scenarios - Must work for business
- **P1 (Gameplay):** 9 scenarios - Core game mechanics
- **P2 (Identity):** 5 scenarios - User flows
- **P3+ (Features):** 15 scenarios - Nice-to-have

Total: 42 scenarios documented, 88% implemented

---

**Version:** 0.5.0  
**Status:** Active Development  
**Related:** S6.0.03 (Health Check scenario)
