# Debug & Testing Hub

**Version:** 0.7.0  
**Purpose:** Interactive testing, tutorials, and debug tools

## Structure

```
/debug/
  ├── index.html                           # Main dashboard
  ├── healthcheck.html                     # System health check
  ├── data-manager.html                    # KV data viewer
  ├── complete-customer-journey.html       # Full purchase flow
  │
  ├── Tutorial Scenarios (HTML + MD)
  ├── tutorial-happy-path.html             # S7.1.01 - Daily check-in
  ├── tutorial-missed-care.html            # S2-7.5,11.1.02 - 2-3 day absence
  ├── tutorial-education-commerce.html     # S2-7.1,5,11.1.03 - Products optional
  ├── tutorial-trust-protection.html       # S2-7.1,5,11.1.04 - No purchase pressure
  ├── tutorial-email-reentry.html          # S2-7.5,11.1.05 - Email notifications
  └── tutorial-failure-educational.html    # S2-7.5,11.1.06 - 30-day hibernation
  │
  └── modules/                             # Module-specific tests
      ├── stripe.html                      # Stripe operations
      └── README.md                        # Module index
```

## Philosophy

- **Modular approach** - Each module/scenario is a separate page
- **Click-through testing** - Step by step execution
- **Visual feedback** - Progress bars, status indicators
- **SMRI breakdown** - Complex scenarios → simple steps
- **Documentation** - Each HTML has corresponding .md spec

## Tutorial Scenarios

All scenarios validate **<60s interaction**, **weekly check-ins**, and **no purchase pressure**.

| Scenario | SMRI Code | Priority | Status |
|----------|-----------|----------|--------|
| Happy Path | S7.1.01 | P0 | ✅ Ready |
| Missed Care | S2-7.5,11.1.02 | P0 | ✅ Ready |
| Education-Commerce | S2-7.1,5,11.1.03 | P0 | ✅ Ready |
| Trust Protection | S2-7.1,5,11.1.04 | P0 | ✅ Ready |
| Email Re-entry | S2-7.5,11.1.05 | P1 | ⚠️ Needs email service |
| Failure (30d) | S2-7.5,11.1.06 | P1 | ✅ Ready |

**Markdown specs** contain complete validation criteria, KV operations, and edge cases.

## Usage

**Main Dashboard:**
```
http://localhost:8000/debug/
```

**Individual Tutorials:**
```
http://localhost:8000/debug/tutorial-happy-path.html
http://localhost:8000/debug/tutorial-education-commerce.html
```

**CLI Test Runner:**
```bash
npm run smri  # Runs health check test suite
```

## File Organization

- **`.html`** files - Interactive debug/test pages (browser)
- **`.md`** files - Complete scenario specifications (AI reference)
- **`modules/`** - Module-specific tests (Stripe, KV, etc.)

---

**Migration Note:** Scenarios moved from `.smri/scenarios/` to `/debug/` (v0.7.0)
