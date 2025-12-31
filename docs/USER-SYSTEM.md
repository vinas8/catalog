# 🎮 User System - Quick Reference

**Version:** 0.7.0+  
**Status:** ✅ Fully Operational  
**Last Updated:** 2025-12-31

---

## 🚀 Quick Start

### Create a New Player

```bash
# Interactive mode
./scripts/create-player.sh

# With parameters
./scripts/create-player.sh "PlayerName" "email@example.com"
```

### Access Your Game

```
https://vinas8.github.io/catalog/game.html?user=YOUR_USER_ID
```

---

## 📡 API Endpoints

### Base URL
```
https://catalog.navickaszilvinas.workers.dev
```

### 1. Create User

**Endpoint:** `POST /register-user` (or `/api/customer`)

**Request:**
```json
{
  "user_id": "unique_user_id",
  "username": "PlayerName",
  "email": "player@example.com"  // Optional
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "user_id": "unique_user_id",
    "username": "PlayerName",
    "email": "player@example.com",
    "created_at": "2025-12-31T05:00:00Z",
    "loyalty_points": 0,
    "loyalty_tier": "bronze",
    "stripe_session_id": null
  }
}
```

### 2. Get User Data

**Endpoint:** `GET /user-data?user=USER_ID`

**Response:**
```json
{
  "user_id": "unique_user_id",
  "username": "PlayerName",
  "email": "player@example.com",
  "created_at": "2025-12-31T05:00:00Z",
  "loyalty_points": 0,
  "loyalty_tier": "bronze"
}
```

### 3. Get User Snakes

**Endpoint:** `GET /user-products?user=USER_ID`

**Response:**
```json
[
  {
    "assignment_id": "assign_12345",
    "user_id": "unique_user_id",
    "product_id": "snake_id",
    "product_type": "real",
    "nickname": "My Snake",
    "species": "ball_python",
    "morph": "banana",
    "acquired_at": "2025-12-31T05:00:00Z",
    "stats": {
      "hunger": 100,
      "water": 100,
      "health": 100,
      "happiness": 100
    }
  }
]
```

### 4. Assign Snake to User

**Endpoint:** `POST /assign-product`

**Request:**
```json
{
  "user_id": "unique_user_id",
  "product_id": "snake_product_id",
  "assignment_id": "assign_timestamp",
  "name": "Snake Name",
  "species": "ball_python",
  "morph": "banana",
  "product_type": "real",
  "price": 10000,
  "currency": "eur",
  "acquired_at": "2025-12-31T05:00:00Z"
}
```

**Response:**
```json
{
  "success": true,
  "user_product": { /* assigned snake data */ }
}
```

---

## 🛠️ Tools

### 1. Browser Test Console

Open: `https://vinas8.github.io/catalog/test-user-flow.html`

Features:
- Create users
- Get user data
- View user snakes
- Assign test snakes
- Real-time console output

### 2. CLI Player Creation

```bash
./scripts/create-player.sh
```

Features:
- Interactive username/email input
- Auto-generates unique user ID
- Optional test snake assignment
- Outputs game URL
- Saves user ID to `.last_user_id`

### 3. Account Page

URL: `https://vinas8.github.io/catalog/account.html`

Features:
- Login with existing user ID
- Create new account
- Auto-redirects to game with user ID

---

## 🔑 User ID Format

User IDs are base36-encoded timestamps + random:

```javascript
const userId = Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
// Example: "mtc2nze1nzi5"
```

**Properties:**
- Unique per creation
- URL-safe (lowercase alphanumeric)
- 12-16 characters
- No special characters

---

## 📝 Example Flow

### Full User Journey

```bash
# 1. Create player
./scripts/create-player.sh
# Enter: MyUsername
# Enter: myemail@example.com
# Assign test snake: y

# 2. Output shows:
#    User ID: abc123xyz789
#    Game URL: https://vinas8.github.io/catalog/game.html?user=abc123xyz789

# 3. Visit game URL
# 4. See your assigned snake!
# 5. Care for it, buy more, breed them
```

---

## 🐛 Troubleshooting

### "User not found"
- Check user ID is correct
- User might not be registered in KV yet
- Try creating user again

### "No snakes"
- User exists but has no snakes yet
- Use test console or CLI to assign a snake
- Or purchase one via Stripe checkout

### "Worker unavailable"
- Check worker deployment: `cd worker && wrangler deploy`
- Verify KV bindings are set up
- Check worker logs: `wrangler tail`

---

## 🧪 Test User Created

**Username:** NasSnakeBreeder  
**User ID:** `mtc2nze1nzi5`  
**Email:** nas@serpenttown.com  
**Game URL:** https://vinas8.github.io/catalog/game.html?user=mtc2nze1nzi5  
**Snakes:** 1 (Banana Ball Python)

---

## 📚 Related Files

- `account.html` - Login/register UI
- `worker/worker.js` - API backend
- `src/modules/auth/user-auth.js` - Frontend auth module
- `scripts/create-player.sh` - CLI player creation
- `test-user-flow.html` - Browser test console

---

**Built with ❤️ and 🐍**  
**Serpent Town v0.7.0+**
