# Debug Module Versions

Track implementation versions separate from SMRI scenario codes.

## Version Format

- **SMRI Code:** S6.0.03 (scenario ID - never changes)
- **Module Version:** v1.2 (implementation iteration - bumps with updates)
- **App Version:** 0.5.0 (overall project version)

---

## 🏥 Health Check Module

**SMRI:** S6.0.03  
**Current Version:** v1.2

### Changelog

**v1.2** (2025-12-23)
- Added Stripe products test (checks source=stripe)
- Added Stripe checkout links validation
- Fixed CORS headers check
- Adjusted response time threshold (2s → 5s for Termux)
- Total: 10 tests (up from 8)

**v1.1** (2025-12-23)
- Added progress bar with live updates
- Added test counter (Test X/10)
- Better visual feedback
- Auto-run on page load

**v1.0** (2025-12-23)
- Initial implementation
- 8 basic health tests
- Worker status, products, CORS, endpoints
- CLI version: `npm run smri`

---

## 💳 Stripe Operations Module

**SMRI:** S12.x  
**Current Version:** v0.1 (planned)

Not yet implemented.

---

## ☁️ Cloudflare KV Module

**SMRI:** S11.1.x  
**Current Version:** v0.1 (planned)

Not yet implemented.

---

## 📦 Catalog Tests Module

**SMRI:** S1.x  
**Current Version:** v0.1 (planned)

Not yet implemented.

---

## 🎮 Game Tests Module

**SMRI:** S2.x  
**Current Version:** v0.1 (planned)

Not yet implemented.

---

## 🔐 Auth & Identity Module

**SMRI:** S3.x  
**Current Version:** v0.1 (planned)

Not yet implemented.

---

## Version Bumping Rules

**When to bump module version:**
- Added new tests → Minor version (v1.1 → v1.2)
- Changed test logic → Minor version
- Fixed bugs → Patch version (v1.2.0 → v1.2.1)
- Major refactor → Major version (v1.2 → v2.0)

**SMRI code stays constant** - it represents the scenario, not the implementation.

---

**Last Updated:** 2025-12-23  
**Active Modules:** 1/6
