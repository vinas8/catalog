# Webhook Wait & Registration Fix

## 🐛 Issues Fixed

### 1. Snake Not Assigned
**Problem:** User redirected before webhook completes
**Solution:** success.html now polls worker API every second for up to 10 seconds

### 2. Registration on Every Purchase
**Problem:** Registration page shown even for returning customers  
**Solution:** Check localStorage for existing user, skip registration if found

## 🔄 New Flow

### First Purchase:
```
Stripe → success.html
  ↓ (wait for webhook, 1-10 seconds)
  ↓ (check: no existing user)
  → register.html (create account)
  → game.html (play!)
```

### Second+ Purchase:
```
Stripe → success.html
  ↓ (wait for webhook, 1-10 seconds)
  ↓ (check: user exists in localStorage)
  → game.html (skip registration!)
```

## 💻 Implementation

**success.html changes:**
- Polls `/user-products?user=<hash>` every 1 second
- Waits until products.length > 0 (snake assigned)
- Checks `localStorage.getItem('serpent_user')`
- If exists → game.html
- If not → register.html

**Benefits:**
- ✅ Waits for webhook completion
- ✅ No duplicate registrations
- ✅ Better UX for returning customers
- ✅ Shows loading state while waiting

## 🧪 Test Scenarios

**Scenario 1: First-time buyer**
1. Buy snake → success.html shows "Processing..."
2. Waits 1-10 seconds for webhook
3. Shows "Redirecting to registration"
4. Register → Game

**Scenario 2: Returning buyer**
1. Buy second snake → success.html shows "Processing..."
2. Waits for webhook
3. Shows "Welcome back! Redirecting to game"
4. Game (no registration!)

**Scenario 3: Webhook timeout**
1. If webhook takes >10 seconds
2. Shows error message
3. User can refresh or contact support
