# Stripe Sync Workflow - v3.4

## 🎯 Goal

Fetch products from Stripe → Generate `products.json` → Deploy to GitHub Pages

## 📋 How It Works

```
Stripe Dashboard → sync-stripe.py → products.json → GitHub Pages
     (Products)      (Termux/Local)    (Static Data)    (Live Site)
```

### Why This Approach?

- ✅ **GitHub Pages** = Static hosting (no backend, no API calls possible)
- ✅ **Termux** = Can run Python scripts with Stripe API
- ✅ **products.json** = Static data file, works on GitHub Pages
- ✅ **Manual sync** = Run locally, commit when updated

## 🚀 Setup

### 1. Install Dependencies

```bash
pip install requests
```

### 2. Get Stripe API Key

1. Go to https://dashboard.stripe.com/test/apikeys
2. Copy your **Secret Key** (starts with `sk_test_...`)
3. **Never commit this key!**

### 3. Set Environment Variable

```bash
export STRIPE_SECRET_KEY='sk_test_YOUR_KEY_HERE'
```

Or add to `.bashrc` for persistence:
```bash
echo 'export STRIPE_SECRET_KEY="sk_test_YOUR_KEY_HERE"' >> ~/.bashrc
source ~/.bashrc
```

## 🔄 Sync Products

### Run Sync Script

```bash
cd /root/catalog
python3 sync-stripe.py
```

### What It Does

1. Fetches all active products from Stripe API
2. Fetches prices for each product
3. Converts to catalog format
4. Saves to `data/products.json`

### Expected Output

```
🐍 Stripe Product Sync - v3.4
==================================================
🔄 Fetching products from Stripe...
✅ Found 6 products in Stripe
Processing: Batman Ball...
Processing: Normal Ball Python...
...
✅ Saved 6 products to data/products.json

📋 Products:
  - Batman Ball ($1000.0) - ball_python
  - Normal Ball Python ($49.99) - ball_python
  ...
```

## 📤 Deploy to GitHub Pages

### 1. Commit Changes

```bash
git add data/products.json
git commit -m "Update products from Stripe - $(date)"
git push origin main
```

### 2. GitHub Pages Auto-Deploys

- GitHub detects the push
- Rebuilds the site
- New products appear within ~30 seconds

## 🎨 Stripe Product Metadata

To get the best results, add metadata to your Stripe products:

### Required Metadata Fields

| Field | Example | Description |
|-------|---------|-------------|
| `species` | `ball_python` | For filtering |
| `morph` | `banana` | Morph type |
| `payment_link` | `https://buy.stripe.com/...` | Full payment URL |

### Optional Metadata Fields

| Field | Example | Description |
|-------|---------|-------------|
| `sex` | `male` | Snake sex |
| `birth_year` | `2024` | Birth year |
| `weight_grams` | `150` | Weight in grams |
| `info` | `Male • 2024 • Captive Bred` | Quick info line |
| `image` | `🐍` | Emoji or URL |

### How to Add Metadata in Stripe

1. Go to Stripe Dashboard → Products
2. Click on a product
3. Scroll to "Metadata"
4. Add key-value pairs
5. Save

Example:
```
species: ball_python
morph: banana
sex: male
birth_year: 2024
weight_grams: 150
payment_link: https://buy.stripe.com/test_cNibJ04XLbUsaNQ8uPbjW00
```

## 🔍 Product Format

The script converts Stripe products to this format:

```json
{
  "id": "prod_XXXXX",
  "name": "Batman Ball",
  "species": "ball_python",
  "morph": "banana",
  "price": 1000,
  "info": "Male • 2024 • Captive Bred",
  "sex": "male",
  "birth_year": 2024,
  "weight_grams": 150,
  "description": "Beautiful banana morph",
  "status": "available",
  "image": "🐍",
  "stripe_link": "https://buy.stripe.com/test_..."
}
```

## 🔄 Workflow Summary

### Regular Updates

```bash
# 1. Update products in Stripe Dashboard
# 2. Run sync script in Termux
python3 sync-stripe.py

# 3. Review changes
cat data/products.json

# 4. Commit and push
git add data/products.json
git commit -m "Sync products from Stripe"
git push

# 5. Wait ~30 seconds for GitHub Pages to deploy
```

## ⚙️ Advanced: Automatic Sync

### Option 1: Cron Job (Termux)

```bash
# Install cron
pkg install cronie

# Edit crontab
crontab -e

# Add line (sync every hour):
0 * * * * cd /root/catalog && python3 sync-stripe.py && git add data/products.json && git commit -m "Auto-sync" && git push
```

### Option 2: GitHub Actions (Future)

Store Stripe key in GitHub Secrets and run sync on schedule. Requires GitHub Actions setup.

## 🚫 GitHub Pages Limitations

**Cannot do on GitHub Pages:**
- ❌ Run Python/Node.js scripts
- ❌ Make Stripe API calls
- ❌ Process webhooks
- ❌ Execute server-side code

**Must do locally (Termux):**
- ✅ Run sync script
- ✅ Fetch from Stripe API
- ✅ Generate products.json
- ✅ Commit and push

## 🐞 Troubleshooting

### "STRIPE_SECRET_KEY not set"
```bash
export STRIPE_SECRET_KEY='sk_test_YOUR_KEY'
```

### "requests not installed"
```bash
pip install requests
```

### "No products found"
- Check Stripe Dashboard has active products
- Verify API key is correct (test mode vs live mode)

### "Permission denied"
```bash
chmod +x sync-stripe.py
```

## 📚 Files

- `sync-stripe.py` - Sync script (Termux)
- `data/products.json` - Generated catalog (committed to git)
- `src/data/catalog.js` - Reads products.json (frontend)

## 🔐 Security Notes

- ✅ Never commit `STRIPE_SECRET_KEY` to git
- ✅ Use test mode keys for development
- ✅ Switch to live mode keys for production
- ✅ Add `.env` to `.gitignore` if storing keys in file

---

**Version:** 3.4  
**Last Updated:** December 21, 2025
