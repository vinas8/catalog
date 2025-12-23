# Debug MVP Archive

**Status:** Archived (2025-12-23)  
**Reason:** Replaced with simpler `/debug/` structure

## What Was Archived

### Old Debug Hub (`debug-module-src/`)
- Complex multi-tab debug interface
- 8 modules (scenarios, catalog, users, test, admin, stripe, monitor, logs)
- 1,591 lines of HTML/CSS/JS
- **Issue:** Browser cache prevented updates

### Old HTML Files
- `debug-old.html` - Previous debug version
- `debug-old-backup.html` - Backup copy
- `test-debug-*.{py,sh,mjs,cjs}` - Test scripts

## Replacement

**New structure:**
- `/debug/index.html` - Simple SMRI health check (auto-run)
- `/debug/modules/` - Future modular debug tools
- `tests/api/health-check.test.js` - CLI health check
- `npm run smri` - Quick command

## Why Changed?

1. **Browser cache issues** - Changes weren't visible
2. **Too complex** - 8 modules for simple health check
3. **Better CLI approach** - `npm run smri` works better
4. **Maintenance** - Simpler = easier to update

## If You Need Old Code

All original files preserved in this directory:
- `debug-module-src/` - Full module source
- `debug-old*.html` - Old HTML files
- Test scripts intact

---

**Version:** 0.5.0  
**Archived:** 2025-12-23
