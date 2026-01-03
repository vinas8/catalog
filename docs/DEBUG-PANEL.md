# 🔍 Debug Panel Component

Global debug panel component available on all pages during development.

## Overview

**Status:** ✅ Active  
**File:** `src/components/DebugPanel.js`  
**Control:** `APP_CONFIG.DEBUG` in `src/config/app-config.js`  
**Integrated:** 11 pages (all main pages)

---

## How It Works

### Automatic Environment Detection

```javascript
// src/config/app-config.js
DEBUG: isLocalhost, // true on localhost, false in production
```

**Localhost** (http://localhost:8000):
- DEBUG = `true`
- 🔍 button appears bottom-right
- Full debug panel available

**Production** (https://vinas8.github.io/catalog):
- DEBUG = `false`
- No debug button visible
- Zero performance overhead

---

## Features

### 🔘 Floating Button
- **Position:** Bottom-right corner
- **Icon:** 🔍
- **Style:** Purple gradient, scales on hover
- **Z-index:** 99998

### 📊 Debug Panel Contents

1. **Page Info**
   - Title
   - Path (current file)
   - Hash (URL fragment)
   - Viewport size

2. **Environment**
   - Environment (local/production)
   - Version number
   - Debug mode status
   - Localhost detection
   - GitHub Pages detection

3. **Quick Links**
   - 🏠 Debug Hub (`/debug/`)
   - 🧪 Test Suite
   - 🎮 Gamified Shop Test
   - 📦 Aquarium Demo
   - 🔗 API Documentation

4. **Live Console**
   - Intercepts `console.log()`
   - Intercepts `console.error()`
   - Intercepts `console.warn()`
   - Shows last 50 messages
   - Color-coded by type
   - Timestamp on each entry
   - Auto-scrolls to bottom

### ⌨️ Keyboard Shortcut

**Ctrl + Shift + D** - Toggle debug panel

---

## Integration

### Pages with Debug Panel

All main pages have it integrated:

```
✓ index.html         (homepage)
✓ catalog.html       (shop)
✓ game.html          (farm)
✓ learn.html         (tutorials)
✓ learn-static.html  (encyclopedia)
✓ dex.html           (species database)
✓ collection.html    (collection view)
✓ account.html       (user account)
✓ success.html       (purchase success)
```

### How It's Added

At the end of each HTML file, before `</body>`:

```html
<!-- Debug Panel (auto-loads only in DEBUG mode) -->
<script type="module">
  import { initDebugPanel } from './src/components/DebugPanel.js';
  initDebugPanel();
</script>
</body>
```

---

## Usage in Code

### Import and Use

```javascript
import { getDebugPanel } from './src/components/DebugPanel.js';

const debug = getDebugPanel();

// Log messages (will appear in debug console)
debug?.log('User clicked button', 'info');
debug?.log('Payment succeeded!', 'success');
debug?.log('API error occurred', 'error');
debug?.log('Slow query detected', 'warn');
```

### Log Types

| Type | Color | Use Case |
|------|-------|----------|
| `log` | Gray | General messages |
| `info` | Cyan | Informational |
| `success` | Green | Success messages |
| `warn` | Yellow | Warnings |
| `error` | Red | Errors |

---

## Configuration

### Enable/Disable Debug Mode

**Method 1: Automatic (Recommended)**
```javascript
// src/config/app-config.js
DEBUG: isLocalhost, // Auto-detects environment
```

**Method 2: Manual Override**
```javascript
// Force enable (even in production)
DEBUG: true,

// Force disable (even on localhost)
DEBUG: false,
```

**Method 3: Runtime Toggle**
```javascript
// In browser console
APP_CONFIG.DEBUG = false; // Disable
location.reload(); // Refresh to apply
```

---

## Styling

### Current Style

```css
/* Floating Button */
width: 50px;
height: 50px;
border-radius: 50%;
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
position: fixed;
bottom: 20px;
right: 20px;

/* Debug Panel */
width: 350px;
max-height: 80vh;
background: rgba(17, 17, 17, 0.98);
border-radius: 12px;
backdrop-filter: blur(10px);
```

### Customize

Edit `src/components/DebugPanel.js`:

```javascript
// Change button position
debugBtn.style.cssText = `
  bottom: 20px;  // Change this
  right: 20px;   // Or this
  ...
`;

// Change panel size
this.panel.style.cssText = `
  width: 350px;      // Make wider/narrower
  max-height: 80vh;  // Adjust height
  ...
`;
```

---

## Testing

### Test Debug Panel

1. **Start local server:**
   ```bash
   python3 -m http.server 8000
   ```

2. **Open any page:**
   ```
   http://localhost:8000/game.html
   ```

3. **Verify:**
   - ✅ 🔍 button visible (bottom-right)
   - ✅ Click to open panel
   - ✅ Panel shows page info
   - ✅ Quick links work
   - ✅ Console logs appear
   - ✅ Ctrl+Shift+D toggles panel

4. **Test production mode:**
   ```
   https://vinas8.github.io/catalog/game.html
   ```
   - ✅ No 🔍 button
   - ✅ Panel doesn't load
   - ✅ No console overhead

---

## Architecture

### Component Structure

```
DebugPanel
├── Floating Button (toggle)
│   └── Event: click → toggle panel
│
└── Debug Panel (collapsible)
    ├── Header
    │   └── Close button
    │
    ├── Page Info Section
    │   ├── Title
    │   ├── Path
    │   ├── Hash
    │   └── Viewport
    │
    ├── Environment Section
    │   ├── Environment
    │   ├── Version
    │   ├── Debug status
    │   ├── Localhost check
    │   └── GitHub Pages check
    │
    ├── Quick Links Section
    │   ├── Debug Hub
    │   ├── Test Suite
    │   ├── Game Test
    │   ├── Aquarium Demo
    │   └── API Docs
    │
    └── Console Section
        └── Live log viewer
            ├── Intercepts console.log
            ├── Intercepts console.error
            ├── Intercepts console.warn
            └── Shows last 50 messages
```

### Singleton Pattern

```javascript
let debugPanelInstance = null;

export function initDebugPanel() {
  if (!APP_CONFIG.DEBUG) return null;
  
  if (!debugPanelInstance) {
    debugPanelInstance = new DebugPanel();
    debugPanelInstance.init();
  }
  
  return debugPanelInstance;
}
```

Only one instance per page, even if called multiple times.

---

## Troubleshooting

### Button Not Appearing

**Cause:** DEBUG mode is disabled

**Solution:**
```javascript
// Check current setting
console.log(APP_CONFIG.DEBUG);

// If false, check if on localhost
console.log(window.location.hostname);

// Force enable (temporary)
APP_CONFIG.DEBUG = true;
location.reload();
```

### Panel Not Opening

**Cause:** JavaScript error or missing import

**Solution:**
1. Open browser DevTools (F12)
2. Check Console for errors
3. Verify import path in HTML:
   ```html
   <script type="module">
     import { initDebugPanel } from './src/components/DebugPanel.js';
   </script>
   ```

### Console Logs Not Showing

**Cause:** Console interception failed

**Solution:**
```javascript
// Check if panel is initialized
const debug = getDebugPanel();
console.log(debug); // Should not be null

// Use direct API
debug?.log('Test message', 'info');
```

---

## Best Practices

### When to Use

✅ **Use for:**
- Development debugging
- Testing features
- Quick access to test pages
- Monitoring console logs
- Environment verification

❌ **Don't use for:**
- Production error tracking (use Sentry/similar)
- User-facing errors (use proper UI notifications)
- Performance monitoring (use browser DevTools)

### Performance

- **Impact:** Minimal when enabled, zero when disabled
- **Load time:** ~10ms to initialize
- **Memory:** ~50KB (panel HTML + console buffer)
- **Network:** None (all inline)

---

## Future Enhancements

### Potential Features

- [ ] Network request monitor
- [ ] LocalStorage/SessionStorage viewer
- [ ] Cookie inspector
- [ ] Performance metrics
- [ ] Screenshot/export logs
- [ ] Custom user-defined tabs
- [ ] Draggable/resizable panel
- [ ] Filter console by type
- [ ] Search in console logs

### Extensibility

Add custom sections:

```javascript
// In DebugPanel.js, add to collectPageInfo()
const customSection = document.createElement('div');
customSection.className = 'debug-section';
customSection.innerHTML = `
  <h4 style="color: #ffd700;">Custom Section</h4>
  <div>Your custom content here</div>
`;
document.getElementById('debug-content').appendChild(customSection);
```

---

## Changelog

### v1.0.0 (2026-01-03)
- ✨ Initial release
- 🎨 Floating button + collapsible panel
- 📊 Page info, environment, quick links
- 📝 Live console log viewer
- ⌨️ Keyboard shortcut (Ctrl+Shift+D)
- 🔧 Smart environment detection
- 📦 Integrated into 11 pages

---

## Support

**Issues?** Check troubleshooting section above.

**Want to customize?** Edit `src/components/DebugPanel.js`.

**Want to disable?** Set `APP_CONFIG.DEBUG = false` in `src/config/app-config.js`.

---

**Last Updated:** 2026-01-03  
**Version:** 1.0.0  
**Maintainer:** Serpent Town Dev Team
