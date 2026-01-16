# Demo Lifecycle - Broken Implementation Archive

**Date:** 2026-01-16  
**Reason:** Demo isolated test not working

## What Was Attempted

1. **Demo lifecycle hooks** (onStart/onEnd) in Demo.js
2. **Source parameter** support in catalog.js and game-controller.js
3. **Namespace isolation** with LocalStorageDestination

## Why It Failed

- CSV import creates products with `id` field
- Game controller needs `assignment_id` or `product_id`
- Even after adding `|| up.id` fallback, still doesn't work
- Demo "View Owned Snake" step shows empty game

## Archived Files

- `demo-isolated-test.html` - Main demo test page
- `test-demo-flow.html` - Simplified test
- `test-demo-debug.html` - Debug version
- `DEMO-LIFECYCLE-IMPLEMENTATION.md` - Documentation

## Notes

The concept was good:
- Isolated demo data in localStorage
- CSV import for quick setup
- ?source= parameter to load demo data

But execution had issues with product ID mapping between:
- CSV imported products (id field)
- Stripe products (product_id, assignment_id)
- Game controller expectations

## Decision

Archive the broken implementation. If needed later, can:
1. Revisit with better understanding of product ID flow
2. Or use different approach (direct product creation)
3. Or fix the mapping between CSV and game expectations

**Status:** ARCHIVED - Not working, moved out of main codebase
