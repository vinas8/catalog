# Snapshot Tests (Structure Validation)

⚠️ **Note:** These tests validate file structure and string existence, NOT functional behavior.

## What These Tests Do
- Check if HTML elements exist by ID/class name
- Verify JavaScript exports contain expected strings
- Confirm CSS rules are present in stylesheet

## What These Tests DON'T Do
- Test if buttons actually work when clicked
- Verify if functions execute correctly
- Validate UI state changes
- Check user interaction flows

## Current Coverage
- **71 structure validation tests** - Check strings exist in source files
- **Purpose:** Catch accidental deletions or refactoring mistakes
- **Limitation:** Won't catch logic bugs, typos in variables, or integration issues

## Why Keep These?
Useful for:
1. Quick smoke testing during refactoring
2. Detecting missing elements in HTML
3. Verifying module exports haven't been removed
4. CI/CD basic structure checks

## Not a Replacement For
- Functional/behavioral tests (see `tests/modules/`)
- Integration tests with real DOM (TODO: add JSDOM)
- End-to-end tests (TODO: add Playwright)
- API/backend tests (see `tests/slow/`)

## Running
```bash
node tests/snapshot/structure-validation.test.js
```

## See Also
- Real functional tests: `tests/modules/shop/game.test.js`
- Test audit: See project documentation for test quality analysis
