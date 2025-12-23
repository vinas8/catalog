# Changelog

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
