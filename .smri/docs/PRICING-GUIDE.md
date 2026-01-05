# 🐍 Snake Pricing Guide

**Last Updated:** 2026-01-05  
**Version:** 0.8.0

---

## 📊 Current Pricing

### Base Prices (Normal Morph)
- **Ball Python:** €150
- **Corn Snake:** €100

### Price Calculation
```javascript
Final Price = Base Price × Morph Multiplier
```

---

## 💰 Ball Python Morphs

| Morph | Multiplier | Price | Notes |
|-------|------------|-------|-------|
| Normal | 1.0× | €150 | Wild type |
| Pastel | 2.0× | €300 | Co-dominant |
| Spider | 3.0× | €450 | Dominant (wobble risk) |
| Banana | 4.0× | €600 | Co-dominant |
| Albino | 6.0× | €900 | Recessive |
| Clown | 8.0× | €1,200 | Recessive |
| Piebald | 10.0× | €1,500 | Recessive (high white) |

---

## 🌽 Corn Snake Morphs

| Morph | Multiplier | Price | Notes |
|-------|------------|-------|-------|
| Normal | 1.0× | €100 | Wild type |
| Hypomelanistic | 2.0× | €200 | Reduced black |
| Anerythristic | 2.5× | €250 | No red pigment |
| Charcoal | 2.5× | €250 | Dark gray |
| Amelanistic | 3.0× | €300 | Albino |
| Ghost | 4.0× | €400 | Combo morph |
| Bloodred | 4.0× | €400 | Solid red |
| Snow | 5.0× | €500 | Combo (amel + aner) |
| Blizzard | 8.0× | €800 | Special combo |

---

## 🛠️ How to Change Prices

### Option 1: Update Base Prices (All Snakes)
**File:** `/src/config/price-config.js`

```javascript
basePrices: {
  ball_python: 200,  // Change from 150 to 200
  corn_snake: 150    // Change from 100 to 150
}
```

### Option 2: Update Morph Multipliers
**File:** `/src/config/price-config.js`

```javascript
morphMultipliers: {
  banana: 5.0,   // Change from 4.0 to 5.0 (€150 → €750)
  piebald: 12.0  // Change from 10.0 to 12.0 (€150 → €1800)
}
```

### Option 3: Set Individual Product Price (Overrides)
**File:** `catalog.html` (line 89)

The catalog checks for price in this order:
1. `product.metadata.price` (Stripe metadata - highest priority)
2. `product.price` (Product object)
3. Default: `150` (fallback)

**To override for specific product:**
- In Stripe Dashboard: Add metadata field `price: 250`
- In KV storage: Set `price: 250` on product object

---

## 🎯 Price Strategy

### Market-Based Pricing
```
Common morphs:     €100-300   (1-2× base)
Popular morphs:    €300-600   (2-4× base)
Designer morphs:   €600-1200  (4-8× base)
Ultra-rare morphs: €1200-2000 (8-13× base)
```

### Virtual Snake Pricing (In-Game Gold)
**File:** `/src/modules/shop/business/economy.js`

```javascript
basePrice = {
  'ball_python': 1000 gold,  // Base for virtual
  'corn_snake': 500 gold     // Base for virtual
}
```

**Virtual vs Real:**
- Virtual: Can be bought unlimited times with in-game gold
- Real: Purchased once with real money, unique to user

---

## 📈 Dynamic Pricing (Future)

Consider implementing:
- **Seasonal pricing** (breeding season discounts)
- **Rarity-based** (adjust multipliers based on availability)
- **Loyalty discounts** (5-10% off for repeat customers)
- **Bundle deals** (buy 2+ snakes, get discount)

---

## 🧮 Examples

### Calculate Specific Snake Price

```javascript
import PRICE_CONFIG from './src/config/price-config.js';

// Banana Ball Python
const price1 = PRICE_CONFIG.calculatePrice('ball_python', 'banana');
// Result: €600 (150 × 4.0)

// Snow Corn Snake
const price2 = PRICE_CONFIG.calculatePrice('corn_snake', 'snow');
// Result: €500 (100 × 5.0)

// Formatted
const formatted = PRICE_CONFIG.formatPrice('ball_python', 'piebald');
// Result: "€1500"
```

---

## 🔧 Implementation Checklist

After changing prices, update:
- [ ] `/src/config/price-config.js` (central config)
- [ ] Stripe product metadata (if using Stripe)
- [ ] KV storage products (if applicable)
- [ ] Test in `catalog.html` (visual check)
- [ ] Update `.smri/scenarios/S1-*.md` (test data)

---

## 💡 Pro Tips

1. **Keep multipliers consistent** with `/src/modules/shop/data/morphs.js`
2. **Test before deploy:** Check catalog page loads correctly
3. **Document changes:** Update this file when prices change
4. **Consider psychology:** €149 looks cheaper than €150
5. **Currency conversion:** If selling international, use USD/GBP/EUR rates

---

## 🌍 Currency Notes

**Current:** €EUR (Euro)  
**Location:** `catalog.html` line 113, 124  
**To change currency symbol:** Update all instances of `€` to `$` or `£`

**Multi-currency support:** Consider implementing:
```javascript
const CURRENCY = {
  EUR: { symbol: '€', rate: 1.0 },
  USD: { symbol: '$', rate: 1.10 },
  GBP: { symbol: '£', rate: 0.85 }
};
```

---

**Questions?** Check `/src/config/price-config.js` for live prices.
