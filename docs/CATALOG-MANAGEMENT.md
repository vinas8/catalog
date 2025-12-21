# Catalog Management Guide - v3.4

Quick reference for managing snake products in Serpent Town.

---

## 📋 Quick Start

### Current Live Stripe Product
```
Super Banana Ball Python
Link: test_cNibJ04XLbUsaNQ8uPbjW00
Full URL: https://buy.stripe.com/test_cNibJ04XLbUsaNQ8uPbjW00
```

---

## 🔧 Adding a New Snake

### Step 1: Create Stripe Product
1. Go to Stripe Dashboard
2. Create new product
3. Set price and details
4. Copy payment link (format: `test_XXXXXXXXXXXXXX`)

### Step 2: Add to products.json
Edit `/root/catalog/data/products.json`:

```json
{
  "id": "BP-UNIQUE-001",
  "name": "Your Snake Name",
  "species": "ball_python",
  "morph": "morph_name", 
  "price": 299.99,
  "info": "Male • 2024 • Captive Bred",
  "sex": "male",
  "birth_year": 2024,
  "weight_grams": 200,
  "description": "Detailed description of the snake",
  "status": "available",
  "image": "🐍",
  "stripe_link": "https://buy.stripe.com/test_YOUR_LINK_HERE"
}
```

### Step 3: Test
1. Refresh browser
2. Select species in filter
3. Verify snake appears
4. Click "Buy with Stripe" to test link

---

## 📝 Product Field Guide

### Required Fields

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `id` | string | Unique identifier | `"BP-BANANA-001"` |
| `name` | string | Display name | `"Super Banana Ball Python"` |
| `species` | string | Species key for filtering | `"ball_python"` or `"corn_snake"` |
| `morph` | string | Morph/color pattern | `"banana"`, `"normal"`, `"pastel"` |
| `price` | number | Price in USD | `450` or `49.99` |
| `status` | string | Availability | `"available"`, `"sold"`, `"reserved"` |
| `stripe_link` | string | Full Stripe payment URL | `"https://buy.stripe.com/test_XXX"` |

### Optional Fields

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `info` | string | Quick details | `"Male • 2024 • Captive Bred"` |
| `sex` | string | Sex of snake | `"male"`, `"female"` |
| `birth_year` | number | Year hatched | `2024` |
| `weight_grams` | number | Current weight | `150` |
| `description` | string | Detailed description | `"Beautiful morph with..."` |
| `image` | string | Emoji or URL | `"🐍"` |

---

## 🎯 Species Values

Currently supported species filters:

```json
"species": "ball_python"   // Ball Python
"species": "corn_snake"    // Corn Snake
```

### Adding New Species:
1. Add to `src/data/species-profiles.js`
2. Add filter option in `game.html` (line 70-74)
3. Add products with new species to `products.json`

---

## 🔄 Product Status

### Status Values:

```json
"status": "available"  // Shows in catalog ✅
"status": "sold"       // Hidden - snake sold ❌
"status": "reserved"   // Hidden - pending sale ⏳
```

### Changing Status:
Edit product in `products.json`:
```json
{
  "id": "BP-BANANA-001",
  "status": "sold"  // Change to "sold" when purchased
}
```

---

## 💰 Pricing

### Format:
```json
"price": 450      // Whole number
"price": 49.99    // Decimal for cents
```

### Display:
- Shows as: `$450.00` or `$49.99`
- Automatically formatted in UI

---

## 🔗 Stripe Links

### Format:
```
Test Mode: https://buy.stripe.com/test_XXXXXXXXXXXXXX
Live Mode: https://buy.stripe.com/XXXXXXXXXXXXXX
```

### Current Active Link:
```
Product: Super Banana Ball Python
Code: test_cNibJ04XLbUsaNQ8uPbjW00
Full: https://buy.stripe.com/test_cNibJ04XLbUsaNQ8uPbjW00
```

### Testing Links:
1. Click "Buy with Stripe" button
2. Should open Stripe checkout
3. Verify correct product shows
4. Use test card: `4242 4242 4242 4242`

---

## 🐍 Real vs Virtual Snakes

### Real Snakes
- **Payment:** Stripe (real money)
- **Status:** Use actual Stripe link
- **Example:** Super Banana Ball Python
- **Purpose:** Actual sales

### Virtual Snakes  
- **Payment:** In-game gold
- **Status:** Use placeholder link or none
- **Example:** Other snakes in catalog
- **Purpose:** Testing/gameplay only

To mark as virtual/example:
```json
{
  "stripe_link": "https://buy.stripe.com/test_example_placeholder"
}
```

---

## 📂 File Locations

```
/root/catalog/
├── data/
│   └── products.json          ← Edit this to add/modify products
├── src/
│   └── data/
│       └── catalog.js         ← Catalog loader (don't edit)
├── game.js                    ← Main game logic
└── docs/
    └── versions/
        └── v3.4-RELEASE-NOTES.md
```

---

## 🧪 Testing Checklist

After adding/modifying products:

- [ ] JSON syntax is valid (no trailing commas!)
- [ ] All required fields present
- [ ] `species` matches available filters
- [ ] `status` is "available" for new products
- [ ] `stripe_link` is complete URL with https://
- [ ] Price is reasonable number
- [ ] Refresh page and verify product appears
- [ ] Test filter shows/hides product correctly
- [ ] Click Stripe link opens correct checkout

---

## ⚠️ Common Mistakes

### ❌ Invalid JSON Syntax
```json
{
  "price": 450,  ← Trailing comma (last item)
}
```

### ✅ Correct
```json
{
  "price": 450
}
```

### ❌ Missing Required Field
```json
{
  "name": "Snake",
  "price": 100
  // Missing: id, species, status, stripe_link
}
```

### ✅ Correct
```json
{
  "id": "CS-001",
  "name": "Snake",
  "species": "corn_snake",
  "price": 100,
  "status": "available",
  "stripe_link": "https://..."
}
```

---

## 🔍 Troubleshooting

### Product Not Showing
1. Check `status` is `"available"`
2. Verify JSON syntax is valid
3. Check browser console for errors
4. Clear cache and refresh

### Filter Not Working
1. Verify `species` field matches filter value
2. Check species is `"ball_python"` or `"corn_snake"`
3. No typos in species name

### Stripe Link Broken
1. Verify full URL with `https://`
2. Test link in new tab manually
3. Check Stripe dashboard product is active

---

## 📞 Quick Commands

### Validate JSON:
```bash
cd /root/catalog
python3 -c "import json; json.load(open('data/products.json'))" && echo "✅ Valid JSON"
```

### View Products:
```bash
cat data/products.json | python3 -m json.tool
```

### Count Products:
```bash
cat data/products.json | python3 -c "import json,sys; print(f'{len(json.load(sys.stdin))} products')"
```

---

## 📊 Current Catalog Stats

As of v3.4:
- **Total Products:** 6
- **Ball Pythons:** 3
- **Corn Snakes:** 3
- **Real Stripe Products:** 1 (Super Banana)
- **Virtual/Example:** 5

---

## 🆘 Need Help?

### Documentation:
- Full Release Notes: `docs/versions/v3.4-RELEASE-NOTES.md`
- Bug Fixes: `BUG_FIXES.md`
- Catalog Fix: `CATALOG_FIX.md`

### Quick Support:
1. Check console for errors (F12)
2. Verify JSON syntax
3. Test in different browser
4. Check Stripe dashboard

---

**Last Updated:** December 21, 2025  
**Version:** 3.4  
**Maintainer:** Serpent Town Team
