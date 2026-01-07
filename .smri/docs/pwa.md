# 📱 PWA (Progressive Web App) Guide

**Version:** 0.7.7  
**Created:** 2026-01-07

---

## 🎯 What is PWA?

Snake Muffin is now a **Progressive Web App**, meaning:
- ✅ **Installable** on home screen (Android, iOS, desktop)
- ✅ **Works offline** after first visit
- ✅ **Fast loading** with smart caching
- ✅ **Native feel** like a real app
- ✅ **Auto-updates** when new version available

---

## 📦 PWA Components

### 1. **manifest.json**
App metadata and configuration:
```json
{
  "name": "Snake Muffin - Snake Care & Breeding",
  "short_name": "Snake Muffin",
  "start_url": "/",
  "display": "standalone",
  "theme_color": "#667eea",
  "icons": [...],
  "shortcuts": [
    { "name": "Shop Snakes", "url": "/catalog.html" },
    { "name": "My Collection", "url": "/collection.html" },
    { "name": "Play Game", "url": "/game.html" }
  ]
}
```

### 2. **sw.js (Service Worker)**
Handles offline caching and asset management:
- **Cache Strategy:** Cache-first for static assets
- **Runtime Cache:** Network-first for dynamic content
- **Offline Fallback:** Shows offline.html when no connection
- **Auto-Update:** Notifies users of new versions

### 3. **PWAInstallButton Component**
Custom web component that:
- Detects if app is already installed
- Shows "Install App" button when available
- Handles iOS Safari special instructions
- Shows success notification after install

### 4. **offline.html**
Beautiful fallback page shown when offline

---

## 🚀 Installation Instructions

### **Android (Chrome, Edge, Samsung Internet)**

1. Visit https://vinas8.github.io/catalog/
2. Click **"Install App"** button on homepage
3. Or: Tap browser menu → "Install app" / "Add to Home Screen"
4. Confirm installation
5. App icon appears on home screen! 🎉

### **iOS (Safari)**

1. Visit https://vinas8.github.io/catalog/
2. Tap **Share button** (⎋) at bottom of screen
3. Scroll down and tap **"Add to Home Screen"**
4. Edit name if desired, tap **"Add"**
5. App icon appears on home screen! 🎉

**Note:** iOS doesn't show the install button - Safari requires manual steps.

### **Desktop (Chrome, Edge, Brave)**

1. Visit https://vinas8.github.io/catalog/
2. Look for **install icon** in address bar (⊕)
3. Or click **"Install App"** button on homepage
4. Click "Install" in popup
5. App opens in standalone window! 🎉

---

## 🎨 Icons & Screenshots

### **Required Icons:**
- `img/icon-192.png` - 192x192px (minimum)
- `img/icon-512.png` - 512x512px (high-res)
- `img/icon-shop.png` - 96x96px (shortcut)
- `img/icon-collection.png` - 96x96px (shortcut)
- `img/icon-game.png` - 96x96px (shortcut)

### **Screenshots (optional but recommended):**
- `img/screenshot-game.png` - 1280x720px (desktop)
- `img/screenshot-shop.png` - 750x1334px (mobile)

### **Generate Icons:**
Open `img/icon-gen.html` in browser to generate placeholder icons.

---

## 🧪 Testing PWA

### **Lighthouse Audit:**
```bash
# Chrome DevTools → Lighthouse → PWA
# Should score 90+ for PWA readiness
```

### **Service Worker Status:**
```javascript
// Chrome DevTools → Application → Service Workers
// Should show "activated and running"
```

### **Manifest Validation:**
```bash
# Chrome DevTools → Application → Manifest
# Should show all fields correctly parsed
```

### **Offline Test:**
1. Install app
2. Open DevTools → Network → Offline checkbox
3. Refresh page
4. Should show cached content or offline.html

---

## 📊 Caching Strategy

### **Precached Assets (on install):**
- index.html, catalog.html, collection.html, game.html
- styles.css
- Core JS modules (config, shop, game, common)
- Navigation component

### **Runtime Cached (as accessed):**
- Additional JS modules
- Images
- Data files

### **Never Cached:**
- API requests to Cloudflare Worker
- Stripe checkout
- External resources (CDNs)

---

## 🔄 Update Flow

When new version deployed:

1. Service Worker detects update
2. Downloads new assets in background
3. Shows **"New version available!"** toast
4. User clicks **"Update"** → page reloads
5. New version active! ✅

---

## 🛠️ Development

### **Test Service Worker Locally:**
```bash
# Must use localhost or HTTPS
python3 -m http.server 8000
# Open: http://localhost:8000
```

### **Clear Cache:**
```javascript
// Chrome DevTools → Application → Clear Storage
// Or programmatically:
navigator.serviceWorker.getRegistrations().then(regs => {
  regs.forEach(reg => reg.unregister());
});
```

### **Debugging:**
```javascript
// Service Worker logs
// Chrome DevTools → Application → Service Workers → console
```

---

## 📝 Best Practices

✅ **DO:**
- Keep cached assets under 50MB total
- Update cache version when deploying
- Test offline functionality before release
- Provide clear install instructions
- Handle update notifications gracefully

❌ **DON'T:**
- Cache API responses (they change frequently)
- Cache user-specific data
- Force install (let user choose)
- Block UI during SW registration

---

## 🔐 Security Notes

- Service Workers require **HTTPS** (or localhost)
- Only same-origin requests are cached
- User can uninstall anytime (Settings → Apps)
- No special permissions needed
- All cached data is local to device

---

## 🎯 Browser Support

| Browser | Install | Offline | Shortcuts |
|---------|---------|---------|-----------|
| Chrome (Android) | ✅ | ✅ | ✅ |
| Safari (iOS) | ⚠️ Manual | ✅ | ❌ |
| Edge (Desktop) | ✅ | ✅ | ✅ |
| Firefox (Android) | ✅ | ✅ | ❌ |
| Samsung Internet | ✅ | ✅ | ✅ |

⚠️ = Requires manual steps (no install prompt)

---

## 📚 Resources

- [MDN: Progressive Web Apps](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
- [web.dev: PWA Checklist](https://web.dev/pwa-checklist/)
- [Can I Use: Service Workers](https://caniuse.com/serviceworkers)
- [PWA Builder](https://www.pwabuilder.com/)

---

## 🐛 Troubleshooting

### **Install button not showing:**
- Check HTTPS (required for PWA)
- Check manifest.json is loading
- Try different browser
- Clear cache and hard reload

### **Offline not working:**
- Check Service Worker is active (DevTools → Application)
- Verify assets are cached (Application → Cache Storage)
- Test with DevTools offline mode

### **Icons not appearing:**
- Check icon paths in manifest.json
- Verify icons exist and are correct size
- Clear app data and reinstall

---

**Built with ❤️ and 🐍**  
**PWA Ready!** v0.7.7
