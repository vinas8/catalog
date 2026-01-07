# 🐍 SMRI Game - PWA Installation Guide

## 📱 How to Install as PWA

### Desktop (Chrome/Edge)

1. **Start local server:**
   ```bash
   cd /root/catalog
   python3 -m http.server 8000
   ```

2. **Open in browser:**
   ```
   http://localhost:8000/smri-game/
   ```

3. **Look for install icon:**
   - Chrome: Click ⊕ icon in address bar (right side)
   - Edge: Click 🖥️ "App available" in address bar
   
4. **Click "Install"** - App opens in standalone window

---

### Mobile (iOS Safari)

1. **Open in Safari:**
   ```
   http://your-server-ip:8000/smri-game/
   ```

2. **Tap Share button** (📤 at bottom)

3. **Scroll down → "Add to Home Screen"**

4. **Tap "Add"** - Icon appears on home screen

5. **Launch from home screen** - Opens fullscreen!

---

### Mobile (Android Chrome)

1. **Open in Chrome:**
   ```
   http://your-server-ip:8000/smri-game/
   ```

2. **Tap ⋮ menu** (top right)

3. **Select "Add to Home screen"** or "Install app"

4. **Tap "Add"/"Install"**

5. **Launch from home screen** - Opens fullscreen!

---

## 🔍 Troubleshooting

### "Install icon doesn't appear"

**Requirements for PWA install prompt:**
- ✅ Must be served over **HTTPS** (or localhost)
- ✅ Must have valid `manifest.json`
- ✅ Must have icons (192px, 512px)
- ✅ Must have Service Worker registered
- ✅ Must visit page 2-3 times (Chrome heuristic)

**Quick fix:**
1. Open DevTools (F12)
2. Go to "Application" tab
3. Check "Manifest" - should show icon previews
4. Check "Service Workers" - should show "activated and running"

### "Manifest errors"

If DevTools shows manifest errors:
- Check icon paths: `/catalog/img/icon-*.png`
- Check start_url matches your server path
- Clear cache and reload

### "Service Worker not registering"

```javascript
// Check in DevTools Console:
navigator.serviceWorker.getRegistrations()
  .then(regs => console.log(regs));
```

**If empty:**
- Make sure you're on `http://localhost` (not `file://`)
- Check `sw.js` path is correct
- Check for console errors

---

## 🌐 Production Deployment

### GitHub Pages

1. **Update paths in `manifest.json`:**
   ```json
   "start_url": "/catalog/smri-game/",
   "scope": "/catalog/smri-game/",
   "icons": [
     { "src": "/catalog/img/icon-192.png", ... }
   ]
   ```

2. **Update paths in `sw.js`:**
   ```javascript
   const urlsToCache = [
     '/catalog/smri-game/',
     '/catalog/smri-game/index.html',
     // ...
   ];
   ```

3. **Push to GitHub** - Auto-deploys

4. **Visit:** `https://yourusername.github.io/catalog/smri-game/`

5. **Install prompt appears** after 2-3 visits

---

### Custom Domain (HTTPS required)

1. **Update manifest.json:**
   ```json
   "start_url": "/smri-game/",
   "scope": "/smri-game/",
   "icons": [
     { "src": "/img/icon-192.png", ... }
   ]
   ```

2. **Update sw.js paths** (remove `/catalog` prefix)

3. **Deploy to HTTPS server**

4. **Test install:**
   - Chrome DevTools → Lighthouse
   - Run "Progressive Web App" audit
   - Should score 90+ for installable

---

## 🎨 Customize Icons

Current icons are generic. To add custom snake icon:

1. **Create 192x192 and 512x512 PNG icons**

2. **Save to `/root/catalog/img/`:**
   ```
   smri-icon-192.png
   smri-icon-512.png
   ```

3. **Update manifest.json:**
   ```json
   "icons": [
     { "src": "/catalog/img/smri-icon-192.png", ... },
     { "src": "/catalog/img/smri-icon-512.png", ... }
   ]
   ```

4. **Clear cache and reinstall**

---

## ✅ Verify Installation

**After installing, check:**

1. **Standalone window** - No browser UI (address bar, tabs)
2. **Fullscreen mode** - Uses entire screen height
3. **Offline works** - Disconnect WiFi, still loads cached version
4. **Home screen icon** - Shows custom icon and name

---

## 📊 PWA Features Enabled

✅ **Installable** - Add to home screen  
✅ **Offline support** - Service Worker caching  
✅ **Fullscreen** - Native app feel  
✅ **Fast loading** - Cached assets  
✅ **Responsive** - Mobile + desktop  

---

**Need help?** Check console logs for Service Worker registration status.

