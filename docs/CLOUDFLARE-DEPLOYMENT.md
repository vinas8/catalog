# Cloudflare Deployment Guide

## 🎯 Current Setup

### Worker Deployment
- **Name:** catalog
- **URL:** https://catalog.navickaszilvinas.workers.dev
- **Method:** Cloudflare API (no wrangler CLI needed)

### KV Namespaces
1. **USER_PRODUCTS** - Stores purchased snakes per user
   - ID: `3b88d32c0a0540a8b557c5fb698ff61a`
   
2. **PRODUCT_STATUS** - Tracks sold/available status
   - ID: `57da5a83146147c8939e4070d4b4d4c1`
   
3. **PRODUCTS** - Product catalog from Stripe
   - ID: `ecbcb79f3df64379863872965f993991`

---

## 🚀 Deployment Methods

### Method 1: Manual Deployment (Current)
```bash
cd worker
bash deploy-with-kv.sh
```

**Pros:**
- ✅ Works without wrangler CLI
- ✅ Uses Cloudflare API directly
- ✅ Automatically binds all KV namespaces

**Cons:**
- ⚠️ Requires API token in .env file
- ⚠️ Manual process

---

### Method 2: GitHub Actions (Recommended)
Automatically deploys when you push to `main` branch.

**Setup:**
1. Add secrets to GitHub repo:
   - `CLOUDFLARE_API_TOKEN`
   - `CLOUDFLARE_ACCOUNT_ID`

2. File already created: `.github/workflows/deploy-worker.yml`

3. Push changes:
```bash
git add .
git commit -m "Update worker"
git push
```

**Pros:**
- ✅ Automatic deployment on push
- ✅ No local CLI needed
- ✅ Secure (secrets in GitHub)
- ✅ Deployment logs visible in GitHub Actions

**How to enable:**
```bash
# 1. Go to GitHub repo settings
https://github.com/vinas8/catalog/settings/secrets/actions

# 2. Add secrets:
CLOUDFLARE_API_TOKEN=2BKglg-h8Vbs-n7NsjRZzHqDj_cTlwYkx2IoBVWY
CLOUDFLARE_ACCOUNT_ID=e24c9f59eed424bd6d04e0f10fe0886f

# 3. Push worker changes
cd /root/catalog
git add worker/
git commit -m "Deploy updated worker"
git push origin main

# 4. Check deployment
https://github.com/vinas8/catalog/actions
```

---

### Method 3: Wrangler CLI (Optional)
If you want to use wrangler locally:

```bash
# Install wrangler
npm install -g wrangler

# Login (one-time)
wrangler login

# Deploy
cd worker
wrangler deploy
```

**Pros:**
- ✅ Official Cloudflare tool
- ✅ Better error messages
- ✅ Supports secrets management

**Cons:**
- ⚠️ Requires CLI installation
- ⚠️ Need to authenticate

---

## 📦 Current Deployment Status

### Worker File: `worker.js`
- ✅ Handles Stripe webhooks
- ✅ Fetches product details from PRODUCTS KV
- ✅ Stores user purchases in USER_PRODUCTS KV
- ✅ Serves collection API

### Configuration: `wrangler.toml`
```toml
name = "catalog"
main = "worker.js"
compatibility_date = "2024-12-21"
workers_dev = true

[[kv_namespaces]]
binding = "USER_PRODUCTS"
id = "3b88d32c0a0540a8b557c5fb698ff61a"

[[kv_namespaces]]
binding = "PRODUCT_STATUS"
id = "57da5a83146147c8939e4070d4b4d4c1"

[[kv_namespaces]]
binding = "PRODUCTS"
id = "ecbcb79f3df64379863872965f993991"
```

---

## 🔄 Deployment Workflow

### For Worker Changes:
1. Edit `worker/worker.js`
2. Run: `cd worker && bash deploy-with-kv.sh`
3. Or push to GitHub (if Actions enabled)

### For Product Updates:
1. Edit `data/products.json`
2. Run: `bash scripts/seed-products-kv.sh`
3. Products now in PRODUCTS KV namespace

### For Frontend Changes:
1. Edit HTML/CSS/JS files
2. Push to GitHub
3. GitHub Pages auto-deploys
4. Live at: https://vinas8.github.io/catalog/

---

## 🎯 Recommended Setup

**Best practice: Use GitHub Actions**

1. **One-time setup:**
   ```bash
   # Add secrets to GitHub
   gh secret set CLOUDFLARE_API_TOKEN
   gh secret set CLOUDFLARE_ACCOUNT_ID
   ```

2. **Daily workflow:**
   ```bash
   # Edit files
   vim worker/worker.js
   
   # Commit and push
   git add .
   git commit -m "Update worker"
   git push
   
   # GitHub Actions deploys automatically!
   ```

3. **Monitor:**
   - Check: https://github.com/vinas8/catalog/actions
   - Logs show deployment status
   - Test: https://catalog.navickaszilvinas.workers.dev/version

---

## 🐛 Troubleshooting

### Error: "Missing entry-point"
- **Cause:** Wrangler looking in wrong directory
- **Fix:** Use `deploy-with-kv.sh` script instead

### Error: "Unauthorized"
- **Cause:** Invalid API token
- **Fix:** Check `.env` or GitHub secrets

### Error: "KV namespace not bound"
- **Cause:** Missing binding in wrangler.toml
- **Fix:** Already fixed in current config

### Worker not updating
- **Cause:** Cache or wrong script
- **Fix:** 
  ```bash
  cd worker
  bash deploy-with-kv.sh
  # Wait 30 seconds for propagation
  curl https://catalog.navickaszilvinas.workers.dev/version
  ```

---

## 📊 Current State

✅ Worker deployed and running
✅ KV namespaces bound
✅ API working: `/user-products`, `/products`, `/stripe-webhook`
✅ GitHub Actions workflow ready
⏳ Needs: GitHub secrets configured
🚀 Ready for: Automatic deployments!

---

## 🎯 Next Steps

1. **Enable GitHub Actions** (recommended):
   ```bash
   gh secret set CLOUDFLARE_API_TOKEN --body "2BKglg-h8Vbs-n7NsjRZzHqDj_cTlwYkx2IoBVWY"
   gh secret set CLOUDFLARE_ACCOUNT_ID --body "e24c9f59eed424bd6d04e0f10fe0886f"
   ```

2. **Test deployment:**
   ```bash
   git add .github/workflows/deploy-worker.yml
   git commit -m "Add GitHub Actions deployment"
   git push
   # Check: https://github.com/vinas8/catalog/actions
   ```

3. **Deploy current worker changes:**
   ```bash
   cd worker
   bash deploy-with-kv.sh
   ```

4. **Sync products to KV:**
   ```bash
   bash scripts/seed-products-kv.sh
   ```

Done! 🎉
