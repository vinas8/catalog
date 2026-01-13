# UI Components

**Presentational Layer** - Visual widgets and interactive layouts.

## 🎯 Purpose

UI components handle **presentation and user interaction** only. They render DOM elements, handle events, and create visual layouts.

## 📦 What's Here

| Component | Purpose |
|-----------|---------|
| `Navigation.js` | Top/bottom navigation bars (mobile + desktop) |
| `SnakeDetailModal.js` | Modal popup for snake details |
| `SplitScreenDemo.js` | Split-screen layout (steps + iframe) |
| `TestRenderer.js` | Test scenario UI with navigation |
| `DebugPanel.js` | Debug information display |
| `BrowserFrame.js` | Iframe wrapper component |
| `PWAInstallButton.js` | Progressive Web App install button |

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
         │ imports
         ↓
┌─────────────────┐
│    Modules      │ ← Business logic layer
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

## 🔗 Related

- **Business Logic:** See `/src/modules/README.md`
- **Configuration:** See `/src/config/`
- **Utilities:** See `/src/utils/`
