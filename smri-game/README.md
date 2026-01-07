# 🐍 Serpent Town - SMRI Game Hub

**Version:** 1.0.0  
**Status:** ✅ Production Ready  
**Type:** Single-file town navigation hub

---

## What Is This?

A **beautiful town map** that connects all your snake breeding modules.

**One HTML file. No dependencies. Just works.**

---

## 🏘️ Buildings

| Icon | Building | Links To |
|------|----------|----------|
| 🏪 | Snake Shop | `/catalog/catalog.html` - Buy snakes with Stripe |
| 📖 | Snake Dex | `/catalog/dex.html` - Pokédex-style encyclopedia |
| 🎒 | My Collection | `/catalog/collection.html` - View purchased snakes |
| 🎮 | Care Station | `/catalog/game.html` - Tamagotchi care game |
| 🧮 | Genetics Calculator | `/catalog/calculator.html` - Breeding calculator |
| 🧬 | Breeding Center | `/catalog/calc/index.html` - Advanced genetics |
| 📚 | Tutorial Center | `/catalog/tutorial/index.html` - Learn the game |
| 🌾 | Snake Farm | 🔒 Locked - Coming soon |
| 🔧 | Admin Panel | `/catalog/admin-kv.html` - Debug tools |

---

## 🌐 Live URL

**https://vinas8.github.io/catalog/smri-game/**

---

## 🎨 Features

- ✅ **Single HTML file** (7KB total)
- ✅ **All CSS inline** (no external dependencies)
- ✅ **Instant load** (no build step)
- ✅ **Stardew Valley aesthetic** (3D buttons, gradient background)
- ✅ **Mobile responsive** (works on all devices)
- ✅ **9 clickable buildings** (direct navigation)

---

## 🚀 How It Works

```html
<!-- Click a building -->
<div class="building" onclick="navigate('/catalog/catalog.html')">
    <div class="building-icon">🏪</div>
    <div class="building-title">Snake Shop</div>
</div>

<script>
function navigate(path) {
    window.location.href = path;
}
</script>
```

That's it. Simple, clean, fast.

---

## 📊 Technical Details

**File structure:**
```
smri-game/
└── index.html    (7KB - everything in one file)
```

**No:**
- ❌ External CSS files
- ❌ External JS files
- ❌ Build tools
- ❌ Dependencies
- ❌ Complex state management

**Just:**
- ✅ One HTML file
- ✅ Inline CSS
- ✅ Inline JS
- ✅ Works everywhere

---

## 🎮 Local Development

```bash
cd /root/catalog
python3 -m http.server 8000
```

Visit: http://localhost:8000/smri-game/

---

## 🔧 How to Add a Building

1. **Copy a building div:**
   ```html
   <div class="building" onclick="navigate('/catalog/your-page.html')">
       <div class="building-icon">🆕</div>
       <div class="building-title">New Building</div>
       <div class="building-desc">Description here</div>
   </div>
   ```

2. **Done!** No state management, no config files, no complexity.

---

## ✅ What Changed (v1.0.0)

### Before (v0.x.x):
- Multiple files (HTML, CSS, JS, JSON)
- External dependencies
- Complex screen system
- State management
- Service workers
- PWA configuration
- ~20KB total

### After (v1.0.0):
- **ONE FILE**
- **7KB total**
- **Zero dependencies**
- **Zero complexity**
- **Just works**

---

## 🌟 Philosophy

**Simplicity wins.**

No frameworks. No build tools. No complexity.  
Just a beautiful town map that links to your real modules.

Clean. Fast. Reliable.

---

**Built with ❤️ and 🐍**  
**Serpent Town v1.0.0**
