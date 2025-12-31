# 🐛 Debug Console System

**Version:** 0.7.0+  
**Status:** ✅ Active on all pages  
**Last Updated:** 2025-12-31

---

## 📱 Mobile Debug Console

A floating debug console that appears on mobile and desktop when DEBUG mode is enabled.

### Features

- ✅ Auto-loads when `localhost` detected
- ✅ Can be enabled with `?debug=1` URL parameter
- ✅ Intercepts all console.log, warn, error, info
- ✅ Catches uncaught errors and promise rejections
- ✅ Floating toggle button (bottom-right)
- ✅ Clear button for resetting logs
- ✅ Auto-shows on errors
- ✅ Scrollable log history
- ✅ Color-coded messages

---

## 🎯 How to Enable

### Method 1: Localhost (Auto-enabled)
```
http://localhost:8000/game.html
```
Debug console automatically loads!

### Method 2: URL Parameter
```
https://vinas8.github.io/catalog/game.html?debug=1
```
Works on production too!

### Method 3: URL Parameter with User
```
https://vinas8.github.io/catalog/game.html?user=abc123&debug=1
```
Debug + user ID both work!

---

## 🎨 Visual Guide

### Toggle Button
- **Location:** Bottom-right corner
- **Icon:** 📋 (closed) / ❌ (open)
- **Style:** Green border, floating button
- **Size:** 50x50px circular

### Clear Button
- **Location:** Next to toggle button (left)
- **Icon:** 🗑️
- **Style:** Yellow border
- **Visibility:** Only shown when console is open

### Console Panel
- **Location:** Bottom of screen (above nav)
- **Height:** Max 40vh (40% of screen)
- **Style:** Black background, green text
- **Font:** Courier New monospace
- **Scroll:** Auto-scrolls to latest log

---

## 💻 Log Colors

| Type | Color | Example |
|------|-------|---------|
| **log** | Green | `console.log('Message')` |
| **info** | Cyan | `console.info('Info')` |
| **warn** | Yellow | `console.warn('Warning')` |
| **error** | Red | `console.error('Error')` |
| **success** | Green | `debugLog('Success', 'success')` |

---

## 🛠️ Usage

### In JavaScript

```javascript
// Normal console works automatically
console.log('This appears in debug console');
console.error('This shows in red and auto-opens console');
console.warn('This shows in yellow');
console.info('This shows in cyan');

// Global helper (added by debug-loader)
window.debugLog('Custom message', 'success');
```

### Auto-Error Display

Errors automatically open the console:

```javascript
// This will auto-show console with red text
throw new Error('Something broke!');

// Unhandled promise rejection also caught
Promise.reject('Failed!');
```

---

## 📁 Implementation

### Files

- `src/utils/debug-loader.js` - Main debug loader
- Auto-included in all pages via `<script>` tag

### Pages with Debug Console

✅ `game.html` - My Snakes (farm)  
✅ `account.html` - Login/Register  
✅ `catalog.html` - Shop  
✅ `success.html` - Payment success  
✅ `index.html` - Landing page  

### How It Works

1. **Page loads** → `debug-loader.js` runs
2. **Checks environment** → Localhost or `?debug=1`
3. **If DEBUG mode** → Injects console HTML/CSS/JS
4. **Intercepts console** → Redirects to visual console
5. **Catches errors** → Auto-displays them

---

## 🔧 Configuration

Debug mode is controlled by:

```javascript
// src/config/app-config.js
export const APP_CONFIG = {
  DEBUG: isLocalhost, // true in localhost, false in production
  // ...
};
```

---

## 📊 Example Output

```
[15:30:45] LOG: 🚀 Game controller initializing...
[15:30:46] INFO: 📦 Loading economy module...
[15:30:46] LOG: ✅ Economy module loaded
[15:30:47] WARN: ⚠️ Worker unavailable, using fallback
[15:30:48] ERROR: ❌ Failed to load user data
```

---

## 🎮 Testing

### Test the Debug Console

1. Visit: `http://localhost:8000/game.html`
2. Look for green 📋 button bottom-right
3. Click to open console
4. Open browser DevTools
5. Type: `console.log('Test')`
6. See it appear in both places!

### Test Error Handling

```javascript
// In browser console
console.error('Test error');
// Debug console auto-opens with red text!
```

### Test Custom Logs

```javascript
window.debugLog('Custom success message', 'success');
window.debugLog('Custom warning', 'warn');
```

---

## 🐛 Troubleshooting

### Console Not Showing

1. Check if localhost or `?debug=1` is set
2. Open browser console - look for: `✅ Mobile debug console ready!`
3. Check for errors in browser console
4. Verify `src/utils/debug-loader.js` exists

### Button Not Visible

1. Check z-index conflicts (should be 999999)
2. Look for CSS overrides
3. Check if body has enough height
4. Try clicking where it should be (it might be hidden)

### Logs Not Appearing

1. Console must be open (click 📋 button)
2. Check if console methods are intercepted
3. Look for errors in browser DevTools
4. Try `window.debugLog('test')` directly

---

## 🚀 Production Notes

- Debug console **disabled by default** in production
- Enable with `?debug=1` for live debugging
- No performance impact when disabled
- Safe to leave in production builds
- Useful for user support (ask users to add `?debug=1`)

---

## 📱 Mobile Support

- Works on iOS and Android
- Touch-friendly buttons (50px min size)
- Respects safe-area-inset (notches)
- Doesn't interfere with navigation
- Auto-scrolls to latest message

---

**Built with ❤️ and 🐛**  
**Debug System v1.0**
