# Data Model - Serpent Town v3.4

## 🗂️ Three JSON Files

### 1. `products.json` - Available Products
All snakes available for purchase (both real and virtual)

```json
{
  "id": "prod_TdKcnyjt5Jk0U2",
  "name": "Batman Ball",
  "type": "real",              // "real" or "virtual"
  "source": "stripe",           // "stripe" or "game"
  "unique": true,               // true = only one available
  "owner_id": null,             // null = available, "user_id" = sold
  "status": "available",        // "available" or "sold"
  "stripe_link": "https://...", // Stripe payment link (null for virtual)
  "price": 1000.0,
  // ... other product details
}
```

**Types:**
- **Real snakes** (`type: "real"`, `source: "stripe"`)
  - Unique products (only 1 available)
  - From Stripe API
  - Purchased with real money
  - `unique: true`
  
- **Virtual snakes** (`type: "virtual"`, `source: "game"`)
  - Unlimited stock
  - For gameplay
  - Purchased with in-game gold
  - `unique: false`

### 2. `users.json` - User Accounts

```json
{
  "user_id": "user_demo_001",
  "email": "demo@example.com",
  "name": "Demo User",
  "created_at": "2025-12-21T00:00:00Z",
  "loyalty_points": 0,
  "loyalty_tier": "bronze"
}
```

### 3. `user-products.json` - User's Collection

```json
{
  "assignment_id": "assign_001",
  "user_id": "user_demo_001",
  "product_id": "prod_TdKcnyjt5Jk0U2",
  "product_type": "real",        // "real" or "virtual"
  "nickname": "My First Snake",
  "acquired_at": "2025-12-21T00:00:00Z",
  "acquisition_type": "stripe_purchase", // "stripe_purchase" or "game_purchase"
  "payment_id": "pi_stripe_123",  // Stripe payment intent ID
  "price_paid": 1000.00,
  "currency": "eur",              // "eur" or "gold"
  "stats": {
    "hunger": 80,
    "water": 100,
    "health": 100,
    "happiness": 80
  }
}
```

## 🔄 Purchase Flow

### Real Snake Purchase (Stripe)

1. **User clicks "Buy Now"** on real snake
2. **Stripe checkout** opens
3. **Payment completes**
4. **Webhook fires** (or manual processing)
5. **Update products.json:**
   ```json
   {
     "id": "prod_TdKcnyjt5Jk0U2",
     "owner_id": "user_123",
     "status": "sold"
   }
   ```
6. **Add to user-products.json:**
   ```json
   {
     "assignment_id": "assign_new",
     "user_id": "user_123",
     "product_id": "prod_TdKcnyjt5Jk0U2",
     "product_type": "real",
     "acquisition_type": "stripe_purchase"
   }
   ```

### Virtual Snake Purchase (Game)

1. **User clicks "Buy Virtual Snake"** in game
2. **Pays with in-game gold**
3. **Add to user-products.json:**
   ```json
   {
     "assignment_id": "assign_new",
     "user_id": "user_123",
     "product_id": "virtual_bp_001",
     "product_type": "virtual",
     "acquisition_type": "game_purchase",
     "currency": "gold"
   }
   ```
4. **Products.json unchanged** (unlimited stock)

## 📊 Display Logic

### Catalog Page (`/catalog.html`)

**Filter by availability:**
```javascript
const available = products.filter(p => 
  p.status === "available" && p.owner_id === null
);
```

**Separate sections:**
- **Real Snakes** - Show first (from Stripe)
- **Virtual Snakes** - Show second OR hide if user has real snakes

### Game - My Snakes Page

**Filter by user:**
```javascript
const mySnakes = userProducts.filter(up => 
  up.user_id === currentUserId
);
```

**Group by type:**
```javascript
const realSnakes = mySnakes.filter(s => s.product_type === "real");
const virtualSnakes = mySnakes.filter(s => s.product_type === "virtual");
```

**Display:**
```
My Collection
├── Real Snakes (3)
│   ├── Batman Ball 🐍
│   ├── Pastel Python 🐍
│   └── Snow Corn 🐍
└── Virtual Snakes (collapsed if has real) (2)
    ├── Practice Python 🐍
    └── Test Corn 🐍
```

## 🔐 Business Rules

### Real Snakes
✅ **Each snake is unique** - Can only belong to ONE user  
✅ **Once sold, removed from catalog**  
✅ **Cannot be "returned"** (special case handling needed)  
✅ **Tied to Stripe payment**  

### Virtual Snakes
✅ **Unlimited stock** - Many users can have same virtual snake  
✅ **Always available in catalog**  
✅ **Purchased with gold coins**  
✅ **Used for learning/practice**  

### Display Priority
1. If user has **real snakes** → Show real snakes prominently
2. Virtual snakes section → **Collapsed** by default
3. If user has **only virtual** → Show virtual prominently

## 🔄 Sync Script Updates

### sync-stripe.sh

When fetching from Stripe, mark as real:

```json
{
  "id": "prod_from_stripe",
  "type": "real",
  "source": "stripe",
  "unique": true,
  "owner_id": null,
  "status": "available"
}
```

Add virtual products manually or via admin panel.

## 📝 API Endpoints (Future)

```
GET  /api/products              - All available products
GET  /api/products?type=real    - Only real snakes
GET  /api/products?type=virtual - Only virtual snakes

GET  /api/users/:id/products    - User's collection
POST /api/purchase/stripe       - Complete Stripe purchase
POST /api/purchase/virtual      - Buy virtual snake
```

## 🎮 Game Integration

### Load User's Snakes

```javascript
async function loadMySnakes(userId) {
  const userProducts = await fetch(`/data/user-products.json`).then(r => r.json());
  const mySnakes = userProducts.filter(up => up.user_id === userId);
  
  // Get full product details
  const products = await fetch(`/data/products.json`).then(r => r.json());
  
  return mySnakes.map(us => ({
    ...us,
    productDetails: products.find(p => p.id === us.product_id)
  }));
}
```

## 🔒 Security Notes

- ✅ Real snake purchases must verify Stripe webhook signature
- ✅ User can only see their own snakes
- ✅ Cannot assign already-owned snake to another user
- ✅ Virtual purchases must verify user has enough gold

## 📊 Stats Tracking

Track per user-product:
- Care frequency
- Health over time
- Breeding history (future)
- Growth progression

---

**Version:** 3.4  
**Last Updated:** December 21, 2025
