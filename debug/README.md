# SMRI Executor

**Version:** 0.5.0  
**Purpose:** Break down SMRI scenarios into clickable, testable steps

## Structure

```
/debug/
  ├── index.html           # Main SMRI Executor dashboard
  ├── healthcheck.html     # Health Check module (READY)
  └── modules/
      ├── stripe.html      # Stripe operations (planned)
      ├── cloudflare.html  # KV operations (planned)
      ├── catalog.html     # Catalog tests (planned)
      ├── game.html        # Game mechanics (planned)
      └── auth.html        # Auth & identity (planned)
```

## Philosophy

Instead of one complex debug hub with 8 tabs, we have:
- **Modular approach** - Each module is a separate page
- **Click-through testing** - Step by step execution
- **Visual feedback** - Progress bars, status indicators
- **SMRI breakdown** - Complex scenarios → simple steps

## Current Status

✅ **Health Check** - 8 tests with progress bar  
⏳ **Other modules** - Planned

## Usage

**Browser:** `http://localhost:8000/debug/`  
**CLI:** `npm run smri`

---

**Old debug MVP archived at:** `docs/debug-mvp/`
