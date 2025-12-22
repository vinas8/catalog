# Test Data

**Purpose:** Data files for local testing only

## Files:

- `products.json` - Test product catalog (NOT used in production)
- `users.json` - Test user data

## Production Data Sources:

- **Real snakes:** Cloudflare KV via Worker API (`/products`)
- **Virtual snakes:** Generated in-game (future: also KV)
- **User data:** Cloudflare KV via Worker API (`/user-products`)

## Usage:

These files are ONLY for:
- Unit tests
- Local development fallback when Worker unavailable
- Reference/documentation

**Production uses Worker API + KV exclusively.**
