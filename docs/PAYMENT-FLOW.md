# Payment Flow Setup - Serpent Town v3.4

## 🔄 Current Flow

```
Customer → Catalog Page → Click "Buy Now" → Stripe Checkout → Success Page → Back to Catalog
```

## ✅ What's Configured

### Current Setup (Localhost)
- **After Payment:** Redirects to `http://localhost:8000/catalog.html?success=true`
- **Success Message:** Green notification appears automatically
- **URL Cleanup:** Query parameter removed after 5 seconds

### Payment Link Settings
- **Link ID:** `plink_1Sg3yBBjL72pe9XsSLo7qqin`
- **Product:** Batman Ball - €1000
- **Redirect URL:** `http://localhost:8000/catalog.html?success=true`

## 🚀 For Production Deployment

### Update Return URL in Stripe

When deploying to your domain, update the payment link:

```bash
curl -X POST \
  -u "YOUR_STRIPE_SECRET_KEY:" \
  -d "after_completion[type]=redirect" \
  -d "after_completion[redirect][url]=https://yourdomain.com/success.html" \
  https://api.stripe.com/v1/payment_links/plink_1Sg3yBBjL72pe9XsSLo7qqin
```

Or update in Stripe Dashboard:
1. Go to **Payment Links**
2. Click on your link
3. Under **After payment** → Set to **Redirect to URL**
4. Enter: `https://yourdomain.com/success.html`

## 📄 Pages

### catalog.html
- Shows success notification if `?success=true` in URL
- Automatically removes query parameter after 5 seconds

### success.html (Optional)
- Dedicated thank you page
- Shows next steps
- Links to continue shopping or play game
- Better for SEO and professional appearance

## 🎨 Customization

### Change Success Message

Edit `catalog.html` around line 35:

```javascript
notification.innerHTML = '✅ Your custom message here!';
```

### Change Success Page

Edit `success.html`:
- Update email address
- Modify shipping timeline
- Add order tracking link
- Customize branding

## 🔗 URL Options

### Option 1: Return to Catalog (Current)
```
after_completion[redirect][url]=https://yourdomain.com/catalog.html?success=true
```
**Pros:** Keeps shopping flow, shows more products
**Cons:** Less professional

### Option 2: Dedicated Success Page (Recommended)
```
after_completion[redirect][url]=https://yourdomain.com/success.html
```
**Pros:** Professional, clear next steps, better UX
**Cons:** Requires extra page

### Option 3: Homepage
```
after_completion[redirect][url]=https://yourdomain.com/
```
**Pros:** Simple
**Cons:** User might get lost

## 🎯 Recommended Production Setup

1. Use **success.html** for return URL
2. Add **order tracking** integration
3. Send **confirmation email** via Stripe webhook
4. Add **customer account** page
5. Show **order history**

## 📧 Email Notifications

Stripe automatically sends:
- ✅ Payment receipt to customer
- ✅ Payment notification to you

To customize:
1. Go to Stripe Dashboard → **Settings** → **Emails**
2. Customize receipt email template
3. Add your branding/logo

## 🔄 Testing

### Test the Flow

1. Go to catalog page
2. Click "Buy Now" on any product
3. Use test card: `4242 4242 4242 4242`
4. Complete payment
5. Should redirect back with success message

### Test Cards

```
Success: 4242 4242 4242 4242
Decline: 4000 0000 0000 0002
3D Secure: 4000 0025 0000 3155
```

Any future expiry date and any 3-digit CVC works.

## 🐛 Troubleshooting

### Redirect Not Working
- Check payment link settings in Stripe Dashboard
- Verify URL is correct (https for production)
- Clear browser cache

### Success Message Not Showing
- Check browser console for errors
- Verify `?success=true` is in URL
- Check JavaScript is loading

### URL Still Has ?success=true
- Wait 5 seconds (auto-removes)
- Or manually remove with browser history

## 📊 Analytics

Track successful purchases:

```javascript
// Add to catalog.html after payment success
if (urlParams.get('success') === 'true') {
  // Google Analytics
  gtag('event', 'purchase', {
    transaction_id: Date.now(),
    value: 1000,
    currency: 'EUR'
  });
  
  // Facebook Pixel
  fbq('track', 'Purchase', {value: 1000, currency: 'EUR'});
}
```

## 🔐 Security Notes

- ✅ Payment handled entirely by Stripe (PCI compliant)
- ✅ No credit card data touches your server
- ✅ Stripe handles 3D Secure authentication
- ✅ All transactions encrypted

---

**Last Updated:** December 21, 2025  
**Version:** 3.4
