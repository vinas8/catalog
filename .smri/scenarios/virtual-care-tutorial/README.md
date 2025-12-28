# Virtual Care Tutorial Scenarios

**Version:** 0.7.0  
**Created:** 2025-12-28  
**Purpose:** Event-driven 1-minute-per-day educational snake care system

---

## Overview

6 critical scenarios that define and validate the virtual care tutorial system. These scenarios MUST pass before implementation is considered complete.

---

## Scenario List

| ID | Name | Priority | Status | Duration |
|----|------|----------|--------|----------|
| VCT-1.0 | Happy Path - Daily Check-in | P0 | ✅ Defined | <60s |
| VCT-2.0 | Missed Care - 2-3 Days Absence | P0 | ✅ Defined | <60s |
| VCT-3.0 | Education-First Commerce | P0 | 🚧 In Progress | <60s |
| VCT-4.0 | Trust Protection | P0 | 🚧 In Progress | <60s |
| VCT-5.0 | Email-Driven Re-Entry | P1 | 🚧 In Progress | <60s |
| VCT-6.0 | Failure Case (Educational) | P1 | 🚧 In Progress | <60s |

---

## Key Principles

All scenarios validate:

1. **<60 second interaction** - Read + action completes quickly
2. **ONE event per session** - No competing UI
3. **Education first** - Snake biology is primary content
4. **No purchase required** - Progress never blocked
5. **Event-driven state** - No continuous timers
6. **Positive framing** - No punishment or guilt

---

## Anti-Patterns to Avoid

Every scenario explicitly tests for these violations:

- ❌ Multiple events shown simultaneously
- ❌ Stat bars or decay meters
- ❌ Purchase CTAs blocking progress
- ❌ Urgency language ("Don't wait!")
- ❌ Punishment for absence ("Your snake suffered")
- ❌ Forced reading (must complete all now)

---

## Test Implementation

Tests located in: `tests/scenarios/virtual-care-tutorial/`

Run with:
```bash
npm run test:scenarios
```

---

## Related Documentation

- **Validation Doc:** `.smri/docs/virtual-care-tutorial-validation.md`
- **Gamification Plan:** `.smri/docs/gamification-plan.md`
- **Business Rules:** `.smri/docs/business.md`

---

**Last Updated:** 2025-12-28T21:27:05Z
