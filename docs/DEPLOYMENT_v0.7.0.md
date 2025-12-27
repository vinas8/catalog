# 🚀 Deployment Guide - v0.7.0 Email Notifications

## Pre-Deployment Checklist

- [ ] Mailtrap account created
- [ ] API token obtained
- [ ] Email service tested locally
- [ ] Environment variables prepared
- [ ] Worker code reviewed

---

## Step 1: Set Cloudflare Secrets

### Via Cloudflare API

```bash
# Set Mailtrap API token
curl -X PUT "https://api.cloudflare.com/client/v4/accounts/e24c9f59eed424bd6d04e0f10fe0886f/workers/scripts/catalog/secrets" \
  -H "Authorization: Bearer 2BKglg-h8Vbs-n7NsjRZzHqDj_cTlwYkx2IoBVWY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "MAILTRAP_API_TOKEN",
    "text": "YOUR_MAILTRAP_TOKEN_HERE",
    "type": "secret_text"
  }'
```

### Via Cloudflare Dashboard

1. Go to: https://dash.cloudflare.com
2. Workers & Pages → `catalog`
3. Settings → Variables
4. Click "Add variable"
5. Type: **Secret**
6. Name: `MAILTRAP_API_TOKEN`
7. Value: Your Mailtrap token
8. Save

---

## Step 2: Update Environment Variables

Already in `wrangler.toml`:

```toml
[vars]
ENVIRONMENT = "production"
SHOP_NAME = "Serpent Town"
FROM_EMAIL = "orders@serpenttown.com"
ADMIN_EMAIL = "admin@serpenttown.com"
```

**Update if needed:**
- `FROM_EMAIL` - Must be verified in Mailtrap
- `ADMIN_EMAIL` - Your admin email address
- `SHOP_NAME` - Displayed in email templates

---

## Step 3: Deploy Worker

### Via Cloudflare API (Recommended)

```bash
cd /root/catalog/worker

# Deploy worker with email service
curl -X PUT "https://api.cloudflare.com/client/v4/accounts/e24c9f59eed424bd6d04e0f10fe0886f/workers/scripts/catalog" \
  -H "Authorization: Bearer 2BKglg-h8Vbs-n7NsjRZzHqDj_cTlwYkx2IoBVWY" \
  -F "worker.js=@worker.js;type=application/javascript+module" \
  -F "email-service.js=@email-service.js;type=application/javascript+module" \
  -F 'metadata={"main_module":"worker.js","compatibility_date":"2024-12-21","bindings":[{"type":"kv_namespace","name":"USER_PRODUCTS","namespace_id":"3b88d32c0a0540a8b557c5fb698ff61a"},{"type":"kv_namespace","name":"PRODUCT_STATUS","namespace_id":"57da5a83146147c8939e4070d4b4d4c1"},{"type":"kv_namespace","name":"PRODUCTS","namespace_id":"ecbcb79f3df64379863872965f993991"}]};type=application/json'
```

### Via Wrangler (if available)

```bash
cd /root/catalog/worker
wrangler publish
```

---

## Step 4: Verify Deployment

### Check Worker Version

```bash
curl https://catalog.navickaszilvinas.workers.dev/version
```

**Expected:**
```json
{
  "version": "0.7.0",
  "updated": "2025-12-27T06:50:00Z"
}
```

### Check Environment Variables

Worker logs should show:
```
📧 Using Mailtrap email provider
```

---

## Step 5: Test Email Notifications

### Option A: Test Script

```bash
cd /root/catalog
bash scripts/test-email-notifications.sh
```

### Option B: Manual Webhook

```bash
curl -X POST "https://catalog.navickaszilvinas.workers.dev/stripe-webhook" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "checkout.session.completed",
    "data": {
      "object": {
        "id": "cs_test_123",
        "client_reference_id": "test_user_123",
        "amount_total": 1000,
        "currency": "eur",
        "customer_details": {
          "email": "test@example.com",
          "name": "Test User"
        },
        "metadata": {
          "product_id": "prod_TdKcnyjt5Jk0U2"
        }
      }
    }
  }'
```

### Option C: Real Purchase

1. Go to: https://vinas8.github.io/catalog/catalog.html
2. Click "Buy Now" on any snake
3. Complete Stripe checkout (test mode)
4. Check Mailtrap inbox for emails

---

## Step 6: Verify Emails in Mailtrap

1. Log in to: https://mailtrap.io
2. Go to **Email Testing** → **Inbox**
3. Look for 2 new emails:
   - **Customer:** "Serpent Town - Order Confirmation #{id}"
   - **Admin:** "Serpent Town - New Order #{id}"
4. Click each email to verify:
   - HTML renders correctly
   - All data is present
   - Links work
   - Images load

---

## Step 7: Monitor Logs

### Via Wrangler

```bash
wrangler tail --name catalog
```

### Via Cloudflare Dashboard

1. Workers & Pages → `catalog`
2. Logs → Real-time logs
3. Filter for `📧` emoji

**Look for:**
```
📧 Sending order confirmation emails...
✅ Customer email sent: msg_abc123
✅ Admin email sent: msg_def456
```

---

## Troubleshooting

### ❌ "No email provider configured"

**Issue:** Missing API token

**Fix:**
```bash
# Check secrets are set
curl "https://api.cloudflare.com/client/v4/accounts/{account}/workers/scripts/catalog/settings" \
  -H "Authorization: Bearer {token}" | grep MAILTRAP
```

### ❌ "Mailtrap API error: 401"

**Issue:** Invalid API token

**Fix:**
1. Generate new token in Mailtrap
2. Update Cloudflare secret
3. Redeploy worker

### ❌ "Mailtrap API error: 422"

**Issue:** Invalid sender email

**Fix:**
1. Verify sender domain in Mailtrap
2. Update `FROM_EMAIL` in wrangler.toml
3. Redeploy worker

### ❌ Emails not received

**Issue:** Wrong email address or spam filter

**Fix:**
1. Check Mailtrap inbox (not your real inbox)
2. For production: check spam folder
3. Verify email address in webhook data

---

## Production Checklist

Before switching to production email service:

- [ ] Domain verified in email provider
- [ ] SPF/DKIM records added to DNS
- [ ] Sender email verified
- [ ] Unsubscribe link added to templates
- [ ] Privacy policy link added
- [ ] Test emails to real addresses
- [ ] Monitor deliverability rates
- [ ] Set up bounce handling
- [ ] Configure rate limits

---

## Rollback Plan

If issues arise:

### Revert to v0.6.0

```bash
# Download backup
cp /root/catalog/docs/worker/worker-cloudflare-backup.js /root/catalog/worker/worker.js

# Redeploy
curl -X PUT "..." # (use deployment command from Step 3)
```

### Disable Email Notifications

Remove the email sending code (lines 296-329 in worker.js) and redeploy.

---

## Success Metrics

After deployment, monitor:

- ✅ Emails sent per order
- ✅ Email delivery rate (should be 100% in Mailtrap)
- ✅ No errors in worker logs
- ✅ Customer receives confirmation within 1 minute
- ✅ Admin receives notification within 1 minute

---

## Next Steps

1. **Test with real purchase** - Verify end-to-end
2. **Update documentation** - Add email info to README
3. **Plan production migration** - Switch to SendGrid/Resend
4. **Add email preferences** - Let users opt-in/out
5. **Track open rates** - Add analytics (optional)

---

**Deployment complete! 🎉**

Check Mailtrap inbox after next purchase.
