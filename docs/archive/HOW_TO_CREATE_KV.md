# 📦 How to Create KV Namespace

**KV = Key-Value storage for user's purchased snakes**

---

## 🎯 Step-by-Step with Screenshots

### 1. Go to Workers & Pages

In Cloudflare Dashboard left sidebar:
- Click **"Workers & Pages"**

### 2. Find KV Tab

You'll see tabs at top:
- Overview
- **KV** ← Click this!
- R2
- Queues
- etc.

### 3. Create Namespace

- Click big **"Create namespace"** button
- Or **"+ Create"** button

### 4. Name It

- **Namespace name:** `USER_PRODUCTS`
- Click **"Add"** or **"Create"**

### 5. Copy the ID

After creation, you'll see:
- Namespace: `USER_PRODUCTS`
- **ID:** `a1b2c3d4e5f6g7h8...` ← Copy this!

---

## 🖼️ What It Looks Like

```
┌─────────────────────────────────────┐
│ KV Namespaces                       │
├─────────────────────────────────────┤
│                                     │
│  [+ Create namespace]               │
│                                     │
│  ┌──────────────────────────────┐  │
│  │ Namespace name               │  │
│  │ USER_PRODUCTS                │  │
│  └──────────────────────────────┘  │
│                                     │
│  [Cancel]  [Add]                    │
│                                     │
└─────────────────────────────────────┘
```

---

## ✅ After Creation

You'll see it listed:
```
USER_PRODUCTS
ID: abc123def456...
Created: just now
```

**Save that ID! You'll need it.**

---

## 🔍 Can't Find KV?

**Try these paths:**

1. Dashboard home → **"Workers & Pages"** → **"KV"** tab
2. Or direct URL: `https://dash.cloudflare.com/YOUR_ACCOUNT_ID/workers/kv/namespaces`
3. Or search bar: type "KV"

---

## 🎯 What KV Does

Stores data like:
```json
{
  "user:abc123": [
    {
      "product_id": "prod_Batman",
      "nickname": "Batman Ball",
      "acquired_at": "2025-12-21..."
    }
  ]
}
```

This is how we save which snakes each user owns! 🐍

---

## ➡️ Next Step

After creating KV, go back to:
`docs/QUICK_DEPLOY_VIA_DASHBOARD.md` - Step 2
