# User Authentication System - v3.4

## 🔐 Hash-Based Authentication

Users are identified by a **secure hash in the URL**. No passwords, no email required!

### How It Works

1. **User visits:** `https://serpenttown.com/game.html?user=ABC123XYZ`
2. **Hash extracted:** `ABC123XYZ`
3. **User loaded:** From `users.json` by `user_id`
4. **Snakes loaded:** From `user-products.json` filtered by `user_id`

### URL Formats

```
?user=HASH          - Query parameter (recommended)
#user=HASH          - Hash parameter (alternative)
```

### Security

✅ **Hash is unguessable** - Generated with timestamp + random  
✅ **No password needed** - Just bookmark the link  
✅ **Shareable** - Send link to access from any device  
⚠️ **Anyone with link can access** - Treat like a password!

## 👤 User Flow

### New User

1. Visit site without `?user=` parameter
2. System shows "Get Your Link" modal
3. User receives unique URL: `game.html?user=ABC123XYZ`
4. User bookmarks/saves this URL
5. Always use this URL to access their snakes

### Returning User

1. Open bookmarked URL with their hash
2. System loads their user_id from URL
3. Loads their snakes from `user-products.json`
4. Ready to play!

### After Purchase (Stripe)

1. User buys snake on catalog page
2. Stripe redirects to: `success.html?user=ABC123XYZ`
3. Webhook processes payment:
   - Updates `products.json` (mark snake as sold)
   - Adds entry to `user-products.json` (assign to user)
4. User clicks "View My Snakes" → Goes to `game.html?user=ABC123XYZ`
5. New snake appears in their collection!

## 📊 Data Flow

### users.json
```json
{
  "user_id": "ABC123XYZ",  // ← This is the hash
  "email": "user@example.com",  // From Stripe (optional)
  "name": "User ABC123",
  "created_at": "2025-12-21T00:00:00Z",
  "loyalty_points": 1000,
  "loyalty_tier": "gold"
}
```

### user-products.json
```json
{
  "assignment_id": "assign_001",
  "user_id": "ABC123XYZ",  // ← Links to user
  "product_id": "prod_TdKcnyjt5Jk0U2",
  "product_type": "real",
  "nickname": "My Batman Ball",
  "stats": {...}
}
```

## 🔄 Implementation

### Game Controller (game-controller.js)

```javascript
import { UserAuth, initializeUser } from './auth/user-auth.js';

async init() {
  // Load user from URL
  this.currentUser = await initializeUser();
  
  if (this.currentUser) {
    // Load user-specific snakes
    await this.loadUserSnakes();
  } else {
    // Demo/guest mode
    this.gameState = createInitialGameState();
  }
}

async loadUserSnakes() {
  const userProducts = await fetch('/data/user-products.json').then(r => r.json());
  const mySnakes = userProducts.filter(up => up.user_id === this.currentUser.user_id);
  // Convert to game state...
}
```

### UserAuth API

```javascript
// Get user hash from URL
const hash = UserAuth.getUserHashFromURL();
// → "ABC123XYZ"

// Load user data
const user = await UserAuth.getUserFromHash(hash);
// → {user_id: "ABC123XYZ", ...}

// Check if logged in
if (UserAuth.isLoggedIn()) {
  // User has hash in URL
}

// Generate new hash
const newHash = UserAuth.generateUserHash();
// → "m8k3n2pqr5t"

// Get shareable URL
const url = UserAuth.getUserURL('/game.html');
// → "/game.html?user=ABC123XYZ"
```

## 🎨 UI Components

### "Get Your Link" Modal

Shown when user visits without `?user=` parameter:

```
┌─────────────────────────────┐
│ 🔗 Your Personal Link       │
├─────────────────────────────┤
│ Save this link to access    │
│ your snakes:                │
│                             │
│ [game.html?user=ABC123XYZ]  │
│                             │
│ [📋 Copy]  [✅ Use Link]    │
│                             │
│ ⚠️ Bookmark this link!      │
└─────────────────────────────┘
```

### User Info Header

Shows in game when logged in:

```
👤 User: ABC123XYZ (Gold Tier)
🔗 Your Link | 🚪 Logout
```

## 🔄 Stripe Integration

### Payment Link Setup

Add user hash to Stripe metadata:

```javascript
// In catalog.html
const userHash = UserAuth.getUserId();
const stripeLink = `${product.stripe_link}?client_reference_id=${userHash}`;
```

### Webhook Processing

When payment completes:

```javascript
// webhook receives:
{
  client_reference_id: "ABC123XYZ",  // User hash
  product_id: "prod_TdKcnyjt5Jk0U2"
}

// Update user-products.json:
{
  "user_id": "ABC123XYZ",  // ← From client_reference_id
  "product_id": "prod_TdKcnyjt5Jk0U2",
  "acquired_at": "2025-12-21T12:00:00Z"
}
```

## 🔒 Security Considerations

### Safe ✅
- Hash is unpredictable (timestamp + random)
- No sensitive data in URL
- Users can regenerate link if compromised
- localStorage caches hash (convenience)

### Risks ⚠️
- URL visible in browser history
- Can be shared (feature or bug?)
- No 2FA or additional security
- Treat link like a password

### Mitigations

**For higher security (future):**
1. Add email verification step
2. Implement session expiry
3. Add device fingerprinting
4. Require re-auth for purchases
5. Add 2FA option

## 📱 Mobile Support

Works perfectly on mobile:
- Hash in URL
- Works with any browser
- No app installation needed
- Bookmark on home screen

## 🔄 Migration from Old System

If user has localStorage data without hash:

```javascript
const oldData = localStorage.getItem('serpent_town_save');
if (oldData && !UserAuth.isLoggedIn()) {
  // Show modal: "Import your old snakes?"
  // Generate new hash
  // Migrate data to user-products.json
}
```

## 🎯 Testing

### Test User URLs

```
Demo User: ?user=demo123
Test User: ?user=test456  
Your User: ?user=YOUR_HASH_HERE
```

### Test Flow

1. Open: `http://localhost:8000/game.html`
2. Should show "Get Your Link" modal
3. Copy generated link
4. Open link → Should load empty collection
5. Buy snake from catalog
6. Return to game link → Snake appears!

---

**Version:** 3.4  
**Last Updated:** December 21, 2025  
**Status:** ✅ Implemented
