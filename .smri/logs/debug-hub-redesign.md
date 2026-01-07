# Debug Hub Reorganization Summary

## Current Status
- Started reorganization but file got messy
- Reset to last commit (7e77811)
- Need clean implementation

## Target Structure (4 Positions)

### Position 1: 🎬 Demo System (v0.8.0) - OPEN
- Interactive slideshow with REAL storefront
- Customer journey + Owner journey
- Buttons: Play Demo, Clear Data, Fill Demo Data, Execute Pipeline
- Shows system actually running
- Unified debug console integrated
- SMRI codes: S6.1,2,3.09, S6.1,4,5.01, S6.2,5.03, S6.5.04

### Position 2: 🧪 SMRI Test Scenarios - FOLDED
- All 69 scenarios organized by category
- In-browser test executor
- Run buttons for each scenario
- Already implemented (from commit 7e77811)

### Position 3: ⚙️ Admin Tools - FOLDED
- KV Manager
- Admin KV Panel  
- Account Settings
- Data management tools

### Position 4: 🛠️ Debug Tools - FOLDED
- Health checks
- Purchase flow demo
- Cache test
- Trait database
- Other utilities

## Implementation Plan
1. Keep current file structure
2. Add demo system section at top (Position 1, open)
3. Wrap SMRI section in <details> (Position 2, closed)
4. Split current "Debug Tools" into Admin (Pos 3) + Debug (Pos 4)
5. Add demo JavaScript functions
6. Ensure debug-loader.js is included

## Demo System Functions Needed
```javascript
function playDemo() {
  console.log('[DEMO] Starting interactive demo...');
  // TODO: Implement S6 demo scenarios
}

function clearDemoData() {
  console.log('[DEMO] Clearing demo data...');
  // Call KV clear endpoint
}

function fillDemoData() {
  console.log('[DEMO] Filling demo data...');
  // Load sample products, users, etc.
}

function executePipeline() {
  console.log('[DEMO] Executing pipeline...');
  // Run automated workflows
}
```

## Files to Update
- /root/catalog/debug/index.html (main changes)
- Verify debug-loader.js included
- Tests still pass

## Next Steps
Make targeted edits to add demo section without breaking existing structure.
