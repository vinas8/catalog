# UX Analysis: Tutorial Collection Runner Navigation Placement

## 📊 Current Situation

**Page:** `debug/tutorial-collection-runner.html`  
**Purpose:** Run all 6 SMRI tutorial scenarios at once (S2-7.x)  
**Current Access:** Only via debug hub link

## 🎯 UX Analysis

### Who Uses This?
- **Developers** - Testing/validation
- **QA/Testers** - E2E scenario validation  
- **Power Users** - Advanced debugging (rare)

### Usage Frequency
- **Low** - Specialized testing tool
- **Context-specific** - Only when validating scenarios

## 🧭 Navigation Placement Recommendation

### ❌ DON'T Add to Primary Nav
**Reasons:**
1. Too technical for average users
2. Creates navigation bloat (already at 5 items - optimal)
3. Breaks Miller's Law (5±2 chunks)
4. Confuses e-commerce customers

### ✅ DO: Keep in Debug Submenu

**Implementation:**
```
Primary Nav (Mobile Bottom / Desktop Top):
🛒 Shop | 🏡 Farm | 📚 Dex | 🎨 Morphs | 👤 Account

Debug Menu (when DEBUG=true):
🔍 Debug (click) →
  ├── 🏥 Health Check
  ├── 🔍 Customer Debug
  ├── 📊 Data Manager
  ├── 🐍 Tutorial Runner ← HERE
  └── 📋 Scenario Hub
```

### Proposed UX Structure

**Option A: Debug Dropdown (Desktop)**
```
[🔍 Debug ▼]
  Health Check
  Customer Management
  Data Manager
  Tutorial Runner  ← Add here
  Full Debug Hub
```

**Option B: Debug Hub Landing (Current - RECOMMENDED)**
```
Primary Nav → [🔍 Debug] → Debug Hub
  ↓
Debug Hub shows cards:
- Health Check
- Customer Debug
- Data Manager
- Tutorial Runner  ← Already linked
- Scenario Modules (grid)
```

## ✅ Recommended Solution

**Keep current structure** with enhancement:

1. **Primary Nav:** No change (5 items perfect)
2. **Debug Hub:** Make runner card more prominent
3. **Quick Access:** Add keyboard shortcut (Shift+T when in debug mode)

### Enhanced Debug Hub Card

```html
<div class="module-card featured">
  <div class="module-icon">🐍</div>
  <h3>Tutorial Collection Runner</h3>
  <p>Run all 6 scenarios at once (S2-7.x)</p>
  <span class="badge">Quick Test</span>
  <a href="tutorial-collection-runner.html" class="btn-primary">
    Run Now
  </a>
</div>
```

## 📱 Mobile Consideration

**Bottom Nav (5 items):**
- NO room for debug items
- Debug link only in desktop OR burger menu
- Tutorial runner stays in debug hub

## 🎨 Visual Hierarchy

**Priority Levels:**
1. **P0 (Primary Nav):** Shop, Farm, Dex, Morphs, Account
2. **P1 (Debug Hub Featured):** Health Check, Data Manager
3. **P2 (Debug Hub Secondary):** Tutorial Runner ← HERE
4. **P3 (Scenario Grid):** Individual scenarios

## 📋 Implementation Steps

1. ✅ Keep current debug hub structure
2. Add "Featured" styling to tutorial runner card
3. Add keyboard shortcut (Shift+T)
4. Add tooltip: "Quick test all scenarios"
5. Consider adding progress indicator badge

## 🔄 Alternative: Settings Submenu (NOT RECOMMENDED)

Could add "Developer Tools" in Account dropdown:
```
👤 Account →
  Profile
  Settings
  ⚙️ Developer Tools →
    Tutorial Runner
```

**Why NOT:**
- Confuses regular users
- Increases cognitive load
- Settings !== Testing tools
