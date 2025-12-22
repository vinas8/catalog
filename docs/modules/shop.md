# Shop Module

**Version:** 0.1.0  
**Path:** `src/modules/shop/`  
**Status:** ✅ Enabled  

---

## 📋 Overview

Product catalog, breeding economy, marketplace UI. Manages snake listings, prices, and availability.

---

## 🎯 Features

- Product catalog loading
- Species filtering (Ball Python, Corn Snake)
- Breeding economics and gold coin system
- Shop UI rendering
- Virtual vs Real product separation

---

## 📁 Structure

```
src/modules/shop/
├── business/
│   ├── economy.js          # Gold coin pricing
│   ├── shop-manager.js     # Purchase logic
│   └── stripe-sync.js      # Sync with Stripe
├── data/
│   ├── catalog.js          # Product loader
│   ├── morphs.js           # Morph definitions
│   └── species-profiles.js # Species data
├── ui/
│   └── catalog-renderer.js # Render shop UI
└── index.js                # Module exports
```

---

## 🔧 Configuration

**Products** (`data/products.json`):
```json
{
  "id": "prod_xxx",
  "name": "Banana Ball Python",
  "species": "ball_python",
  "morph": "banana",
  "price": 450.00,
  "type": "real",
  "status": "available",
  "stripe_link": "https://buy.stripe.com/test_xxx"
}
```

**Species Profiles** (`src/modules/shop/data/species-profiles.js`):
```javascript
export const SPECIES_PROFILES = {
  ball_python: {
    common_name: 'Ball Python',
    scientific_name: 'Python regius',
    care_level: 'Beginner',
    adult_size: '3-5 feet'
  }
};
```

---

## 🎮 Economy System

### Gold Coins (In-Game Currency)
- Earned by breeding snakes
- Used to buy virtual snakes
- Exchange rate: 1 rare morph = 500-1000 gold

### Pricing Tiers
| Tier | Gold Cost | Example |
|------|-----------|---------|
| Common | 100-300 | Normal Ball Python |
| Uncommon | 400-800 | Pastel, Spider |
| Rare | 900-1500 | Banana, Pied |
| Ultra Rare | 2000+ | Designer morphs |

---

## 🧪 Testing

```bash
npm test tests/modules/shop/
```

**Tests:**
- `shop.test.js` - Catalog loading, filtering
- `game.test.js` - Economy integration

---

## 🚫 Disable This Module

**Edit `src/modules/shop/index.js`:**
```javascript
export const ENABLED = false;
```

**Effect:** Catalog page won't load products. Game-only mode.

---

## 📦 Dependencies

- **Payment Module**: For Stripe checkout
- **Common Module**: Date utilities, helpers
- **Game Module**: Snake stats on purchase

---

## 🔗 Related

- [Payment Module](./payment.md) - Handles Stripe
- [Game Module](./game.md) - Uses shop data
- [Product Data](../../data/products.json) - Snake catalog
