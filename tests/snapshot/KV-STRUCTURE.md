# Cloudflare KV Storage Structure

## Namespace: `USER_PRODUCTS`
Binding ID: `ecbcb79f3df64379863872965f993991`

## Key Structure

### Index Key
```
_index:products
```
**Value:** Array of all product IDs
```json
["prod_TdKcnyjt5Jk0U2", "prod_TeTICJsKnUh6Xz", "prod_default_banana_ball", ...]
```

### Product Keys
**Format:** `product:{product_id}`

**Examples:**
- `product:prod_TdKcnyjt5Jk0U2`
- `product:prod_default_banana_ball`
- `product:virtual_bp_001`

### Product Value Schema
```json
{
  "id": "prod_TdKcnyjt5Jk0U2",
  "name": "Batman Ball",
  "species": "ball_python",
  "morph": "banana",
  "price": 1000.0,
  "type": "real|virtual",
  "source": "stripe|game",
  "status": "available|sold",
  "stripe_link": "https://buy.stripe.com/test_...",
  "description": "Beautiful banana morph ball python",
  "sex": "male|female|unknown",
  "birth_year": 2024,
  "weight_grams": 150,
  "owner_id": null,
  "image": "🐍",
  "unique": true
}
```

## Product Types

### Real Products (Stripe)
- `type: "real"`
- `source: "stripe"`
- Has `stripe_link` for checkout
- Unique snakes (`unique: true`)
- Tracked in KV after sync

### Virtual Products (Game)
- `type: "virtual"`
- `source: "game"`
- Purchasable with in-game currency (gold)
- Not unique (`unique: false`)
- Practice/learning snakes

### Default Products
- Pre-seeded products with IDs like `prod_default_*`
- Fallback when Stripe isn't synced
- `status: "available"`

## Current Products in KV (13 total)

### Real Snakes (Stripe)
1. `prod_TdKcnyjt5Jk0U2` - Batman Ball (Banana Ball Python) - €1000
2. `prod_TeTICJsKnUh6Xz` - Amelanistic Corn Snake - €80
3. `prod_stripe_snake_001` - Premium Ball Python - €100

### Test Products
4. `prod_TeV7aKdYeOOpNA` - E2E Test Snake (UPDATED)
5. `prod_TeV8Gz6PhsQEdN` - E2E Test Snake
6. `prod_TeV8xDZZKVb18g` - E2E Test Snake
7. `prod_TeV9LqBinir9Tt` - E2E Test Snake
8. `prod_test_deploy` - Test Snake

### Default Products
9. `prod_default_banana_ball` - Banana Ball Python - $450
10. `prod_default_corn_amel` - Amelanistic Corn Snake - $80
11. `prod_default_piebald_ball` - Piebald Ball Python - $600

### Virtual Products
12. `virtual_bp_001` - Virtual Ball Python - 100 gold
13. `virtual_cs_001` - Virtual Corn Snake - 50 gold

## Sync Process

### From Stripe → KV
1. Worker fetches products from Stripe API
2. Transforms to internal schema
3. Writes to KV with `product:{id}` keys
4. Updates `_index:products` array

### From Game → KV
1. Virtual products created in-game
2. Stored in KV for persistence
3. Available across sessions

## API Endpoints

### Worker Routes
- `GET /products` - List all available products
- `GET /products/:id` - Get single product
- `POST /stripe-webhook` - Sync from Stripe events
- `GET /user-products?user={hash}` - Get user's purchased snakes

## Notes
- All test products have pattern `E2E Test Snake {timestamp}`
- Stripe links format: `https://buy.stripe.com/test_{id}`
- Price in cents for Stripe products
- Gold amount for virtual products
- Index maintained for fast listing
