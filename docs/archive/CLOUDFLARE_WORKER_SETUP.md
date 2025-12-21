# 🚀 Cloudflare Worker Setup - Complete Instructions

**Screenshot Reference:** `docs/photos/cloudflare-dashboard-workers-menu.jpg`

---

## ✅ Step 1: Create Worker (5 minutes)

### In Cloudflare Dashboard:

1. **Click "Workers"** (You're already on this screen!)
   - Says: "Build serverless functions, sites, and apps"

2. **Click "Create Worker" button**
   - Or "Create Application" → "Create Worker"

3. **Name your worker:**
   - Name: `serpent-town-api`
   - Click **"Deploy"**

4. **Copy your Worker URL:**
   - Example: `https://serpent-town-api.YOUR_USERNAME.workers.dev`
   - Save this URL! You'll need it.

---

## ✅ Step 2: Create KV Namespace (2 minutes)

### In Workers Dashboard:

1. **Click "KV" in left sidebar**
   - Under "Storage" or "Workers" section

2. **Click "Create namespace"**

3. **Enter details:**
   - Namespace name: `USER_PRODUCTS`
   - Click **"Add"**

4. **Copy the Namespace ID**
   - Looks like: `a1b2c3d4e5f6...`
   - Save this! You'll need it.

---

## ✅ Step 3: Bind KV to Worker (3 minutes)

### Link storage to your worker:

1. **Go back to your Worker:** `serpent-town-api`

2. **Click "Settings" tab**

3. **Scroll to "Variables"**

4. **Under "KV Namespace Bindings":**
   - Click **"Add binding"**
   - Variable name: `USER_PRODUCTS`
   - KV namespace: Select `USER_PRODUCTS` (from dropdown)
   - Click **"Save"**

---

## ✅ Step 4: Deploy Worker Code (5 minutes)

### Upload our webhook handler:

1. **In worker editor:**
   - Click **"Quick Edit"** or **"Edit Code"**

2. **Copy this code:**

```bash
# On your computer, run:
cd /root/catalog/worker
cat worker.js
```

3. **Paste into Cloudflare editor**
   - Replace ALL existing code
   - Click **"Save and Deploy"**

4. **Test it works:**
   - Click **"Send request"** button
   - Should see JSON response (not error)

---

## ✅ Step 5: Update wrangler.toml (2 minutes)

### Configure local deployment:

**Edit `/root/catalog/worker/wrangler.toml`:**

Replace:
```toml
id = "YOUR_KV_NAMESPACE_ID"
```

With YOUR actual namespace ID from Step 2.

---

## ✅ Step 6: Configure Stripe Webhook (5 minutes)

### Tell Stripe where to send payment events:

1. **Go to:** https://dashboard.stripe.com/test/webhooks

2. **Click "Add endpoint"**

3. **Enter webhook URL:**
   ```
   https://serpent-town-api.YOUR_USERNAME.workers.dev/stripe-webhook
   ```
   (Use YOUR worker URL from Step 1)

4. **Select events:**
   - Click "Select events"
   - Check: `checkout.session.completed`
   - Click "Add events"

5. **Click "Add endpoint"**

6. **Copy webhook signing secret:**
   - Shows: `whsec_...`
   - Save this for later (optional, for signature verification)

---

## ✅ Step 7: Update Frontend URLs (2 minutes)

### Point game to your Worker:

**Edit `/root/catalog/register.html`:**

Find line ~246:
```javascript
const workerUrl = 'https://serpent-town.vinatier8.workers.dev/register-user';
```

Replace with YOUR worker URL:
```javascript
const workerUrl = 'https://serpent-town-api.YOUR_USERNAME.workers.dev/register-user';
```

**Also update in `game.html` (if it calls worker)**

---

## ✅ Step 8: Test Everything! (10 minutes)

### Test 1: Worker is alive
```bash
curl https://serpent-town-api.YOUR_USERNAME.workers.dev/products
```
Should return JSON with products.

### Test 2: Webhook endpoint
```bash
curl -X POST https://serpent-town-api.YOUR_USERNAME.workers.dev/stripe-webhook \
  -H "Content-Type: application/json" \
  -d '{"type":"test"}'
```
Should return: `{"message":"Event ignored"}`

### Test 3: Complete purchase flow
1. Go to: http://localhost:8000/catalog.html
2. Click "Buy Batman Ball"
3. Complete test payment in Stripe
4. Should redirect: success.html → register.html → game.html
5. Snake should appear in game!

---

## 🐛 Troubleshooting

**Worker not deploying?**
- Make sure KV namespace is bound in Settings → Variables

**Webhook not receiving events?**
- Check Stripe Dashboard → Webhooks → View logs
- Verify URL matches your worker URL exactly

**Snake not appearing in game?**
- Check browser console for errors
- Verify worker URL is correct in register.html
- Test: `curl https://YOUR_WORKER/user-products?user=YOUR_HASH`

---

## 📋 Quick Checklist

- [ ] Worker created and deployed
- [ ] KV namespace created
- [ ] KV bound to worker
- [ ] Worker code uploaded
- [ ] wrangler.toml updated with KV ID
- [ ] Stripe webhook configured
- [ ] Frontend URLs updated
- [ ] Test purchase completed successfully

---

## 🎉 Success Criteria

When everything works:
1. Make test purchase → Stripe checkout
2. Complete payment
3. Redirect to success.html (shows Stripe data in footer)
4. Auto-redirect to register.html (email pre-filled)
5. Submit registration
6. Redirect to game.html
7. **See Batman Ball in your game!** 🐍

---

## 📞 Need Help?

Share:
1. Your Worker URL
2. Any error messages from browser console
3. Stripe webhook delivery logs

And I'll help debug! 🚀
