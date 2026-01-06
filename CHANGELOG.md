# Changelog

## [0.7.7] - 2026-01-06

### Added
- **Demo System Plan** - Comprehensive interactive demo for v0.7.7
  - 4 pipelines: Owner Setup, Customer Purchase, Farm Gameplay, Data Management
  - SMRI-driven execution with visual feedback
  - Auto-advance and manual control capabilities
- **Version Roadmap** - Clear path to 1.0.0
  - v0.7.7: Demo & Refinement (present to owner)
  - v0.8.0: Business Requirements (clean version after analysis)
  - v0.9.0: Business Logic Complete (production testing)
  - v1.0.0: Final MVP Launch

### Fixed
- **KV Clear Operations** - Removed protection, now fully destructive
  - All namespaces can be cleared completely
  - Added all 6 namespaces to worker mapping
  - Deployed to production worker
- **Buy Button** - Restored direct Stripe payment links
  - Removed localhost debug redirect workaround
  - Opens Stripe checkout in new tab
- **Debug Hub** - Updated all links to working tools
  - Removed archived tool references
  - Points to current working files

---

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
