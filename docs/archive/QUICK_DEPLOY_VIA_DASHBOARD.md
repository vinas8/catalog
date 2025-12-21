# 🚀 Quick Deploy via Dashboard (Easier!)

**Skip wrangler CLI - use Cloudflare Dashboard directly**

---

## ✅ Step 1: Create KV Namespace FIRST

1. **In Cloudflare Dashboard:**
   - Click **"Workers & Pages"** in left menu
   - Click **"KV"** tab
   - Click **"Create namespace"**
   - Name: `USER_PRODUCTS`
   - Click **"Add"**
   - **Copy the namespace ID** (save it!)

---

## ✅ Step 2: Create Worker

1. **Click "Workers & Pages"**
2. **Click "Create"** → **"Create Worker"**
3. **Name:** `serpent-town-api`
4. **Click "Deploy"**

---

## ✅ Step 3: Upload Code

1. **Click "Quick Edit"** (in your new worker)

2. **Delete all existing code**

3. **Copy ALL code from:**
   ```bash
   cat /root/catalog/worker/worker.js
   ```

4. **Paste into editor**

5. **Click "Save and Deploy"**

---

## ✅ Step 4: Bind KV to Worker

1. **In worker page, click "Settings"**
2. **Click "Variables"** tab
3. **Under "KV Namespace Bindings":**
   - Click **"Add binding"**
   - Variable name: `USER_PRODUCTS`
   - KV namespace: Select `USER_PRODUCTS`
   - Click **"Save"**

---

## ✅ Step 5: Get Worker URL

Your worker URL will be shown at top:
```
https://serpent-town-api.YOUR_ACCOUNT.workers.dev
```

**Copy this URL!**

---

## ✅ Step 6: Configure Stripe Webhook

1. Go to: https://dashboard.stripe.com/test/webhooks
2. Click "Add endpoint"
3. URL: `https://serpent-town-api.YOUR_ACCOUNT.workers.dev/stripe-webhook`
4. Select event: `checkout.session.completed`
5. Click "Add endpoint"

---

## ✅ Test It!

```bash
# Test your worker
curl https://serpent-town-api.YOUR_ACCOUNT.workers.dev/products
```

Should return JSON with snake products!

---

**Once you have the Worker URL, tell me and I'll update the frontend!** 🐍
