# Changelog

## [0.8.0] - 2026-01-05

### Fixed
- **Critical: Catalog Rendering** - Fixed products not displaying despite 222 in KV
  - Products now extract data from Stripe `metadata` object
  - Species filter uses `metadata.species` instead of `p.species`
  - All Stripe products correctly identified as "real" and "available"
- **Critical: SMRI Test Validation** - Worker API test now validates Stripe product structure
  - Checks `id`, `name`, `metadata` instead of incorrect `price` field
  - Removed legacy structure validation that failed on Stripe products
- **Purchase Flow** - End-to-end flow now works with Stripe product format

### Changed
- **Code Cleanup** - Archived old/duplicate files to `debug/archive-pre-v0.8.0/`
  - Removed 3 duplicate breeding calculator files (3,624 lines total)
  - Documented archive with README explaining replacements
- **Product Rendering** - Unified `renderProductCard()` to handle both Stripe and legacy formats
  - Extracts: name, morph, species, gender, yob, price from metadata
  - Generates checkout URLs for Stripe products
  - Handles missing fields with sensible defaults

### Improved
- **Test Coverage** - 12 SMRI scenarios, 11/13 passing (85%)
  - Fixed 2 critical test failures (Worker API, Purchase Flow)
  - All major pages and systems covered
- **Stripe Integration** - Better handling of Stripe product structure throughout codebase
  - Catalog, tests, and rendering all unified on Stripe format

### Technical
- Products: 222 in KV (all from Stripe)
- Test execution: ~93 seconds for full suite
- Debug files: Organized and archived
- SMRI compliance: All core files under 500 lines (except large admin tools)

**Commits:** 73153b4, 0013c5b

---

## [0.7.5] - 2026-01-05

### Added
- **CSV Import Manager:** Modular component for CSV → Stripe → KV sync (`debug/csv-import-manager.js`)
- **Auto-Import Test:** SMRI test scenario that auto-runs CSV import on page load
- **Default Product Data:** 24 embedded snakes (17 Ball Pythons, 7 Corn Snakes) for instant testing
- **Pipeline Navigation:** 6-step purchase flow buttons in SMRI runner (Browse → Checkout → Success → Collection → Game)
- **Debug Console:** Real-time log viewer with auto-scroll, iframe console capture, color-coded messages
- **Species Auto-Detection:** Automatic Corn Snake vs Ball Python classification based on morph keywords

### Improved
- **SMRI Runner:** Now has 4 test scenarios (CSV Import, Purchase Flow, Healthcheck, Worker API)
- **Test Validation:** Catalog rendering properly validates `.catalog-item` elements with detailed counts
- **User Experience:** Visual pipeline progress indicator, step navigation, iframe reload button

### Fixed
- **Catalog Product Loading:** Products now properly load from KV to storefront
- **Test Selectors:** Fixed `.product-card` → `.catalog-item` selector mismatch
- **Product Structure Validation:** Checks for h3 name, .item-price, and buttons

### Documentation
- Added comprehensive SMRI browser testing guide (`.smri/docs/smri-browser-testing.md`)
- Updated session logs with detailed implementation notes
- CSV import flow documentation

**Commits:** ec29fed, eaccff2, 316c573

---

## [s0.5.0] - 2024-12-23

### Changed
- **Version Scheme:** Switched from `v0.x.0` to `s0.x.0` ("special one" format)
- **Single Source of Truth:** Created `src/config/version.js` for centralized version management
- **Documentation:** Updated all docs to use s0.x.0 notation
- **SMRI Integration:** Added SMRI scenario versioning to config (42 scenarios tracked)

### Added
- `src/config/version.js` - Central version configuration
- `src/config/index.js` - Config barrel exports
- Version helper functions: `getVersion()`, `getFullVersion()`, `getModuleVersion()`
- Module-specific version tracking (shop, game, payment, worker, auth, smri)

### Files Updated
- `package.json` - version: `s0.5.0`
- `README.md` - title and version badge
- `docs/v0.5.0.md` → `docs/s0.5.0.md`
- `docs/RELEASE-v0.5.0.md` → `docs/RELEASE-s0.5.0.md`
- `.github/copilot-instructions.md` - all version references
- `src/config/app-config.js` - now imports VERSION from version.js

---

## [0.5.0] - 2024-12-22
Production-ready release with full Cloudflare integration.

## [0.3.0] - 2024-06
SMRI system and E2E testing framework.

## [0.1.0] - 2024-01
Initial MVP - Basic shop and Tamagotchi game.
