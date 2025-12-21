# Serpent Town Cloudflare Worker

Backend API for Serpent Town - Handles Stripe webhooks and user data storage.

## 🎯 What This Does

- Receives Stripe payment webhooks
- Assigns snakes to users by hash
- Stores user products in Cloudflare KV
- Provides API for frontend to load user snakes

## 📁 Files

- `worker.js` - Main worker code
- `wrangler.toml` - Configuration
- `SETUP.md` - Complete setup guide
- `test-worker.js` - Testing script
- `package.json` - NPM scripts

## 🚀 Quick Start

```bash
# 1. Install Wrangler
npm install -g wrangler

# 2. Login
wrangler login

# 3. Create KV namespace
npm run kv:create

# 4. Update wrangler.toml with KV ID

# 5. Deploy
npm run deploy
```

**See SETUP.md for detailed instructions!**

## 📡 API Endpoints

### POST /stripe-webhook
Receives Stripe payments, assigns snakes to users

### GET /user-products?user=HASH
Returns user's snakes

### POST /assign-product (testing)
Manually assign product to user

## 🧪 Testing

```bash
# Update WORKER_URL in test-worker.js
# Then run:
node test-worker.js
```

## 📊 Architecture

```
Stripe Payment
    ↓
POST /stripe-webhook
    ↓
Save to Workers KV
    ↓
Frontend GET /user-products?user=HASH
    ↓
Load user's snakes
```

## 💰 Cost

**FREE** - Cloudflare free tier covers:
- 100K requests/day
- 1GB KV storage
- 100K KV reads/day

## 🔗 Links

- Setup Guide: `SETUP.md`
- Main Docs: `../docs/CLOUDFLARE-VS-FIREBASE.md`
- Worker Code: `worker.js`

---

**Version:** 3.4.0  
**Last Updated:** December 21, 2025
