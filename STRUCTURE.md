# 📁 Serpent Town - Directory Structure

## 🎯 Organized Structure (v0.7.7+)

```
/catalog/
├── 🏠 index.html              # Homepage
├── 🎨 styles.css              # Global styles
│
├── 🧮 /calc/                  # Breeding Calculator
│   ├── index.html             # Integrated calculator (70 morphs)
│   └── calculator.html        # Legacy calculator
│
├── 📚 /tutorial/              # Learning & Tutorials
│   ├── index.html             # Interactive tutorials
│   ├── farm.html              # Farm tutorial
│   └── static.html            # Static care guides
│
├── 🛒 /shop/                  # E-commerce
│   ├── index.html             # Product catalog
│   ├── collection.html        # User collection
│   └── success.html           # Purchase success
│
├── 🎮 /game/                  # Tamagotchi Game
│   └── index.html             # Main game
│
├── 📖 /dex/                   # Morph Encyclopedia
│   └── index.html             # Morph database browser
│
├── ⚙️ /admin/                 # Admin Tools
│   ├── index.html             # KV manager
│   ├── account.html           # User account
│   └── import.html            # Bulk import
│
├── 🔍 /debug/                 # Debug Hub
│   ├── index.html             # Debug dashboard
│   ├── smri-runner.html       # Test runner
│   ├── healthcheck.html       # System health
│   └── ...                    # Other debug tools
│
├── 📊 /data/                  # Data Files
│   └── genetics/              # Genetics database
│       ├── index.html         # Data browser
│       ├── morphs.json        # 50 base morphs
│       ├── morphs-expanded.json # 20 expanded
│       └── ...                # Health, gene types, etc.
│
└── 💻 /src/                   # Source Code
    ├── modules/               # Feature modules
    ├── components/            # Reusable components
    ├── config/                # Configuration
    └── utils/                 # Utilities
```

## 🔗 URL Structure

| Old URL | New URL | Purpose |
|---------|---------|---------|
| `calculator-integrated.html` | `/calc/` | Breeding calculator |
| `learn.html` | `/tutorial/` | Interactive tutorials |
| `catalog.html` | `/shop/` | Product catalog |
| `game.html` | `/game/` | Tamagotchi game |
| `dex.html` | `/dex/` | Morph encyclopedia |
| `admin-kv.html` | `/admin/` | Admin tools |

## ✅ Benefits

1. **Clean URLs**: `/calc/` instead of `/calculator-integrated.html`
2. **Logical Grouping**: Related pages in same directory
3. **Scalability**: Easy to add new pages without cluttering root
4. **SEO Friendly**: Better URL structure
5. **Developer UX**: Easier to navigate codebase

## 🔄 Backward Compatibility

Old HTML files still exist in root for backward compatibility.
Will be deprecated in v0.8.0.

---

**Last Updated:** 2026-01-07  
**Version:** 0.7.7
