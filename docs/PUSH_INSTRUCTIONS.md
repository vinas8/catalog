# How to Push v0.1.0 to GitHub

## Issue
GitHub blocks pushes with Stripe secret keys in code.

## Solution

### 1. Set Your Keys Locally

Create `.env.local` (gitignored):
```bash
STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_KEY
STRIPE_SECRET_KEY=sk_test_YOUR_KEY
STRIPE_ENABLE_SYNC=true
```

### 2. Update stripe-config.js

Keys should be set to placeholders in code:
```javascript
publishableKey: 'pk_test_YOUR_PUBLISHABLE_KEY',
secretKey: null, // Load from environment
```

### 3. Commit & Push

```bash
git add -A
git commit -m "v0.1.0 - No secret keys in code"
git push origin main
git push origin v0.1.0
```

## For Production

Use environment variables:
- Never commit real keys
- Store in hosting platform (Netlify/Vercel)
- Or use server-side API

## Current Status

- ✅ Tag v0.1.0 created
- ⏳ Waiting for clean push (no keys in files)
- ✅ Documentation complete (docs/v0.1.md)
- ✅ 89 tests passing
