# 🎨 UI Components

**Presentational Layer** - Visual widgets and interactive layouts.

## 🎯 Purpose

UI components handle **presentation and user interaction** only. They render DOM elements, handle events, and create visual layouts.

## 🏗️ SMRI Integration

**Components don't have dedicated SMRI numbers (S0-S9 are for business logic modules).**

Instead, components are tracked via **scenario usage**:

```javascript
// Scenario using SplitScreenDemo
{
  id: 's1-shop-catalog',
  title: 'S1.1,2.05: Shop Catalog',
  smri: 'S1.1,2.05',
  module: 'shop',              // Primary module (S1)
  component: 'SplitScreenDemo', // UI component used
  url: '../debug/demo-split-screen.html'
}
```

**Check component coverage:** `npm run smri:list:components`

## 📦 What's Here

| Component | Purpose | Coverage |
|-----------|---------|----------|
| `Navigation.js` | Top/bottom navigation bars | ✅ Used |
| `SnakeDetailModal.js` | Modal popup for snake details | ✅ Used |
| `SplitScreenDemo.js` | Split-screen layout (steps + iframe) | ⏳ Planned |
| `TestRenderer.js` | Test scenario UI with navigation | ⏳ Internal |
| `DebugPanel.js` | Debug information display | ⏳ Internal |
| `BrowserFrame.js` | Iframe wrapper component | ⏳ Internal |
| `PWAInstallButton.js` | Progressive Web App install button | ⏳ Planned |

## 🔒 Rules

### ✅ Allowed
- Import from `/src/modules/` (business logic)
- Import from `/src/config/` (configuration)
- Import from `/src/utils/` (utilities)
- Manipulate DOM directly
- Handle user events (click, input, etc.)
- Use `document`, `window`, browser APIs

### ❌ Not Allowed
- Business logic (calculations, game rules)
- Data storage/retrieval
- Direct API calls (use modules instead)
- Being imported by `/src/modules/` (modules must be pure)

## 🏗️ Architecture

```
┌─────────────────┐
│   Components    │ ← Presentation layer (UI)
│  (this folder)  │
└────────┬────────┘
         │ imports ✅
         ↓
┌─────────────────┐
│    Modules      │ ← Business logic layer (S0-S9)
│  /src/modules/  │
└─────────────────┘
```

**Components** depend on **Modules**, never the reverse.

## 💡 Quick Decision

**"Should this go in `/components/` or `/modules/`?"**

Ask yourself:
- Does it render UI? → **Component**
- Does it manipulate DOM? → **Component**
- Is it pure logic? → **Module**
- Does it calculate/process data? → **Module**

## 📚 Examples

**Component:** `Navigation.js`
```javascript
// ✅ Renders DOM, handles clicks
export class Navigation {
  render() {
    const nav = document.createElement('nav');
    nav.innerHTML = '<a href="/shop">Shop</a>';
    return nav;
  }
}
```

**Module:** `shop/economy.js`
```javascript
// ✅ Pure calculation, no DOM
export function calculatePrice(species, morph) {
  return basePrices[species] * morphMultipliers[morph];
}
```

## 🎯 Generic vs Domain-Specific

### Generic Components (Reusable)
- `Navigation` - Works across all pages
- `SplitScreenDemo` - Used for all interactive demos
- `TestRenderer` - SMRI test runner UI
- `BrowserFrame` - Generic iframe wrapper

### Domain-Specific Components
- `SnakeDetailModal` - Uses S1 (shop) + S2 (game) data
- Still tested via integration scenarios

**Philosophy:** Most components should be **generic** and **reusable**.

## 🔗 Related

- **Business Logic:** See `/src/modules/README.md`
- **Configuration:** See `/src/config/`
- **Component Coverage:** Run `npm run smri:list:components`
- **Scenarios:** See `src/config/smri/scenarios.js`
