# 📧 Email Notifications Setup Guide

## Overview

Serpent Town v0.7.0 includes order confirmation emails sent via **Mailtrap Transactional Email API** (dev/testing) or production email services (SendGrid/Resend).

---

## 🔧 Configuration

### Required Environment Variables

Set these in Cloudflare Dashboard → Workers → catalog → Settings → Variables:

| Variable | Type | Description | Example |
|----------|------|-------------|---------|
| `MAILTRAP_API_TOKEN` | Secret | Mailtrap API token (dev) | `Bearer abc123...` |
| `STRIPE_SECRET_KEY` | Secret | Stripe API key | `sk_test_...` |
| `SHOP_NAME` | Text | Your shop name | `Serpent Town` |
| `FROM_EMAIL` | Text | Sender email | `orders@serpenttown.com` |
| `ADMIN_EMAIL` | Text | Admin notification email | `admin@serpenttown.com` |

### Alternative Providers (Production)

Instead of `MAILTRAP_API_TOKEN`, you can use:
- `SENDGRID_API_KEY` - SendGrid
- `RESEND_API_KEY` - Resend

---

## 📥 Mailtrap Setup (Development)

### 1. Create Mailtrap Account

1. Go to [mailtrap.io](https://mailtrap.io)
2. Sign up for free account
3. Navigate to **Email API** → **Transactional Emails**

### 2. Get API Token

1. Go to **Settings** → **API Tokens**
2. Click **Create Token**
3. Copy the token (starts with `Bearer ...`)

### 3. Set up Sender Domain

1. Go to **Sending Domains**
2. Add your domain or use Mailtrap's test domain
3. Verify DNS records (for custom domain)

### 4. Configure Worker

Add to Cloudflare secrets:

```bash
# Via Cloudflare API
curl -X PUT "https://api.cloudflare.com/client/v4/accounts/{account_id}/workers/scripts/catalog/secrets" \
  -H "Authorization: Bearer {cf_token}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "MAILTRAP_API_TOKEN",
    "text": "your_mailtrap_token_here",
    "type": "secret_text"
  }'
```

Or via Dashboard:
1. Cloudflare Dashboard → Workers & Pages
2. Select `catalog` worker
3. Settings → Variables
4. Add secret: `MAILTRAP_API_TOKEN`

---

## 📨 Email Templates

### Customer Confirmation Email

**Subject:** `Serpent Town - Order Confirmation #{orderId}`

**Content:**
- Thank you message
- Order details (ID, date)
- Items purchased with prices
- Total amount
- "View Your Snake" button → game.html
- Support contact info

**HTML:** Beautiful responsive template with gradient header

### Admin Notification Email

**Subject:** `Serpent Town - New Order #{orderId}`

**Content:**
- Order ID and timestamp
- Customer name and email
- Items ordered
- Total amount
- Admin-focused layout

---

## 🧪 Testing

### Test Order Flow

1. Make a test purchase on your site
2. Stripe webhook triggers
3. Worker assigns product to user
4. Worker sends 2 emails:
   - Customer confirmation
   - Admin notification

### Check Mailtrap

1. Go to Mailtrap → **Email Testing** → **Inbox**
2. View received emails
3. Check HTML rendering
4. Verify all data is correct

### Debug Logs

Check Cloudflare Worker logs:

```bash
wrangler tail
```

Look for:
- `📧 Sending order confirmation emails...`
- `✅ Customer email sent: {messageId}`
- `✅ Admin email sent: {messageId}`
- Or `❌ Email failed: {error}`

---

## 🚀 Production Setup

### Switch to Production Email Service

1. **Choose Provider:**
   - **SendGrid** - Most popular, generous free tier
   - **Resend** - Developer-friendly, modern API

2. **Get API Key:**
   - SendGrid: Dashboard → Settings → API Keys
   - Resend: Dashboard → API Keys

3. **Update Worker Secrets:**

```bash
# Remove Mailtrap token
# Add production key
curl -X PUT "..." \
  -d '{"name": "SENDGRID_API_KEY", "text": "SG.xxx", "type": "secret_text"}'
```

4. **Verify Sender Domain:**
   - Both providers require domain verification
   - Add DNS records (SPF, DKIM, DMARC)
   - Use real email addresses

5. **Test in Production:**
   - Make real purchase
   - Check emails are delivered
   - Monitor bounce/spam rates

---

## 📋 Email Service Architecture

### Abstracted Interface

The email service uses an abstract provider pattern:

```javascript
// Auto-detects which provider to use
const emailService = createEmailService(env);

// Sends with whichever provider is configured
await emailService.sendCustomerOrderConfirmation(orderData);
await emailService.sendAdminOrderNotification(orderData);
```

### Provider Priority

1. Mailtrap (if `MAILTRAP_API_TOKEN` set)
2. SendGrid (if `SENDGRID_API_KEY` set)
3. Resend (if `RESEND_API_KEY` set)
4. Error (if none set)

### Easy Switching

Change providers by simply updating secrets—no code changes needed.

---

## 🔐 Security Best Practices

### Never Commit Secrets

❌ **DON'T:**
```javascript
const apiToken = 'abc123...'; // Hardcoded!
```

✅ **DO:**
```javascript
const apiToken = env.MAILTRAP_API_TOKEN; // From secrets
```

### Use Environment-Specific Configs

- **Development:** Mailtrap (catches all emails)
- **Staging:** Mailtrap or real service to test addresses
- **Production:** SendGrid/Resend to real customers

### Validate Email Addresses

The worker checks for valid email before sending:

```javascript
customerEmail: session.customer_details?.email || 'unknown@example.com'
```

---

## 🐛 Troubleshooting

### Emails Not Sending

1. **Check logs:** `wrangler tail`
2. **Verify API token:** Test in Postman/curl
3. **Check provider status:** mailtrap.io/status
4. **Verify sender email:** Must be verified domain

### Emails in Spam

1. **Add SPF/DKIM records**
2. **Use verified sender domain**
3. **Avoid spammy words in subject**
4. **Include unsubscribe link** (for production)

### Rate Limits

- **Mailtrap free:** 1,000 emails/month
- **SendGrid free:** 100 emails/day
- **Resend free:** 3,000 emails/month

Monitor usage in provider dashboard.

---

## 📊 Monitoring

### Key Metrics

Track in Cloudflare/provider dashboards:

- Emails sent (success/failure)
- Delivery rate
- Open rate (if tracking pixels enabled)
- Click rate (for CTAs)
- Bounce rate

### Alerts

Set up alerts for:
- Email send failures
- High bounce rate
- API rate limit warnings

---

## 🔄 Deployment Checklist

- [ ] Mailtrap account created
- [ ] API token generated
- [ ] Sender domain configured
- [ ] Cloudflare secrets set
- [ ] Environment variables updated
- [ ] Worker redeployed
- [ ] Test purchase completed
- [ ] Emails received and verified
- [ ] Production provider ready (optional)

---

## 📚 API Documentation

### Mailtrap API

**Endpoint:** `https://send.api.mailtrap.io/api/send`

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Body:**
```json
{
  "from": {"email": "orders@serpenttown.com"},
  "to": [{"email": "customer@example.com"}],
  "subject": "Order Confirmation",
  "html": "<html>...</html>",
  "category": "order_confirmation"
}
```

**Response:**
```json
{
  "success": true,
  "message_id": "abc-123-def"
}
```

### Full Docs

- Mailtrap: https://api-docs.mailtrap.io/
- SendGrid: https://docs.sendgrid.com/
- Resend: https://resend.com/docs

---

## 💡 Tips

- Use Mailtrap for development—it catches all emails
- Test email templates in multiple email clients
- Keep subject lines under 50 characters
- Use responsive HTML templates
- Include plain text fallback
- Add unsubscribe link for production
- Monitor deliverability metrics

---

**Questions?** Check the worker logs or test with `wrangler tail`!
