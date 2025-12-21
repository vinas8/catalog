# 🔐 GitHub Secrets Setup for Worker Deployment

## ✅ Add these secrets to your GitHub repo:

Go to: https://github.com/vinas8/catalog/settings/secrets/actions

---

## 1. CLOUDFLARE_API_TOKEN

**Value:**
```
2BKglg-h8Vbs-n7NsjRZzHqDj_cTlwYkx2IoBVWY
```

**Steps:**
1. Click "New repository secret"
2. Name: `CLOUDFLARE_API_TOKEN`
3. Secret: (paste token above)
4. Click "Add secret"

---

## 2. CLOUDFLARE_ACCOUNT_ID

**Value:**
```
e24c9f59eed424bd6d04e0f10fe0886f
```

**Steps:**
1. Click "New repository secret"
2. Name: `CLOUDFLARE_ACCOUNT_ID`
3. Secret: (paste ID above)
4. Click "Add secret"

---

## ✅ After adding secrets:

Push code to trigger deployment:
```bash
cd /root/catalog
git add .
git commit -m "Add worker deployment workflow"
git push origin main
```

Watch deployment at:
https://github.com/vinas8/catalog/actions

---

## 🎯 What This Does

- Automatically deploys worker on every push to main
- Uses GitHub Actions (free for public repos)
- Worker will be available at:
  `https://serpent-town-api.YOUR_SUBDOMAIN.workers.dev`

---

## 🚀 Alternative: Deploy via Cloudflare Pages

Since you mentioned "Deploy command: npx wrangler deploy":

1. Go to: https://dash.cloudflare.com/e24c9f59eed424bd6d04e0f10fe0886f/workers-and-pages
2. Click "Create"
3. Click "Pages" → "Connect to Git"
4. Select repository: `vinas8/catalog`
5. Build settings:
   - Build command: (leave empty)
   - Build output: (leave empty)
   - Root directory: `/worker`
6. Click "Save and Deploy"

This will auto-deploy worker from your repo!
