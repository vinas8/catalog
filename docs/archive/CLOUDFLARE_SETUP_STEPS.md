# Cloudflare Setup - Step by Step

## 📸 Reference
See: `docs/photos/purchase-flow-diagram.jpg` - Shows Cloudflare Dashboard

## 🎯 What We Need

1. **Workers** - For webhook handler (assigns snakes)
2. **KV Namespace** - For storing user products

---

## Step 1: Create Worker

1. In Cloudflare Dashboard (dash.cloudflare.com)
2. Click **"Workers"** (Build serverless functions, sites, and apps)
3. Click **"Create Worker"**
4. Name it: `serpent-town-api`
5. Click **"Deploy"**

---

## Step 2: Create KV Namespace

1. In Workers dashboard
2. Go to **"KV"** tab on left sidebar
3. Click **"Create namespace"**
4. Name: `USER_PRODUCTS`
5. Copy the namespace ID

---

## Step 3: Bind KV to Worker

1. Go to your worker: `serpent-town-api`
2. Click **"Settings"** → **"Variables"**
3. Under **"KV Namespace Bindings"**:
   - Variable name: `USER_PRODUCTS`
   - KV namespace: Select `USER_PRODUCTS`
4. Click **"Save"**

---

## Step 4: Deploy Worker Code

```bash
cd /root/catalog/worker
wrangler login
wrangler publish worker.js
```

---

## Step 5: Configure Stripe Webhook

1. Get your Worker URL (e.g., `https://serpent-town-api.YOUR_SUBDOMAIN.workers.dev`)
2. Go to Stripe Dashboard → Webhooks
3. Add endpoint: `https://serpent-town-api.YOUR_SUBDOMAIN.workers.dev/stripe-webhook`
4. Select event: `checkout.session.completed`

---

## ✅ Test Flow

```bash
# Test webhook endpoint
curl https://serpent-town-api.YOUR_SUBDOMAIN.workers.dev/stripe-webhook

# Test user products endpoint
curl https://serpent-town-api.YOUR_SUBDOMAIN.workers.dev/user-products?user=test
```

---

## 🚀 Ready to Deploy?

Once Worker is deployed, tell me the URL and we'll:
1. Update worker code with correct settings
2. Configure Stripe webhook
3. Test complete purchase flow
