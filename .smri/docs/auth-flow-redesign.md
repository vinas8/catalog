# Auth Flow Analysis & Redesign Discussion

## Current State Analysis

### What We Have:
1. **register.html** - Shows registration form OR "Welcome Back" based on localStorage
2. **Navigation** - Shows "Login/Register" buttons when logged out, Profile dropdown when logged in
3. **User Detection** - Checks localStorage for 'serpent_user_hash' or 'userHash'

### Current Issues:
- ❌ Login/Register are same page (confusing)
- ❌ No dedicated login page
- ❌ Account page = registration page
- ❌ Hash-based auth in URL (not secure for real use)
- ❌ No password system
- ❌ Profile dropdown has limited functionality

---

## Questions for Team Lead:

### 1. Authentication Strategy
**Q:** What's our auth model?
- A) Email/Password (traditional)
- B) Magic link (email only, no password)
- C) Keep simple hash-based (current, for demo)
- D) Social auth (Google, Discord)

**Current:** Hash-based, generated on registration

---

### 2. User Journey - First Visit
**Scenario:** New user visits site, clicks Shop

**Options:**
- A) **Guest checkout** → Buy with Stripe → Register after purchase
- B) **Force registration** → Must register before buying
- C) **Optional registration** → Can buy as guest, suggested to register

**Recommendation:** A (Guest checkout) - standard e-commerce, less friction

---

### 3. Login vs Register Pages
**Options:**
- A) **Separate pages** - `/login.html` and `/register.html`
- B) **Single page with tabs** - Toggle between login/register
- C) **Modal/overlay** - Login popup over current page
- D) **Inline forms** - Side-by-side on same page

**Recommendation:** B (Single page with tabs) - modern, mobile-friendly

---

### 4. Account Page Structure
**What should Account page show?**

**Logged Out:**
- Login/Register forms

**Logged In:**
- Profile info (name, email, player ID)
- My Snakes (link to Farm)
- Purchase history
- Settings
- Logout

**Question:** Should we split this?
- `/account` - Profile overview
- `/account/orders` - Purchase history  
- `/account/settings` - Settings

**Recommendation:** Single page with sections (simpler for v1)

---

### 5. Navigation Button Behavior
**Current:** 
- Login button → `register.html#login` (doesn't work)
- Register button → `register.html`

**Options:**
- A) Both go to same page with tabs
- B) Login button shows modal
- C) Separate pages

**Recommendation:** A (Same page with tabs)

---

### 6. Post-Purchase Flow
**After buying snake with Stripe:**

**Current flow:**
1. Stripe checkout
2. Redirect to register.html
3. Create account
4. Redirect to game.html

**Questions:**
- Keep this flow?
- Should registration be optional?
- What if user already has account?

---

### 7. Profile Dropdown Contents
**Current:**
- 🏡 My Farm
- 📦 Collection
- ⚙️ Settings
- 🚪 Logout

**Suggestions:**
- Add: 🛒 Orders
- Add: 💎 Loyalty Points (already tracked)
- Add: 🎁 Redeem Code
- Remove: Collection (redundant with Farm)

---

## UX Designer Recommendations

### Proposal: Unified Auth Page

**URL Structure:**
```
/account              → Smart routing based on login state
/account#login        → Login tab
/account#register     → Register tab
```

**Page States:**

**1. Logged Out (Show Tabs):**
```
┌─────────────────────────────┐
│   [Login]  [Register]       │
├─────────────────────────────┤
│                             │
│   Login Tab:                │
│   • Email                   │
│   • Password (or magic link)│
│   • [Login] button          │
│   • "Forgot password?"      │
│                             │
│   Register Tab:             │
│   • Username                │
│   • Email                   │
│   • [Create Account]        │
└─────────────────────────────┘
```

**2. Logged In (Show Dashboard):**
```
┌─────────────────────────────┐
│  👤 Username                │
│  🆔 Player ID: abc123       │
├─────────────────────────────┤
│  Quick Actions:             │
│  🏡 My Farm                 │
│  🛒 My Orders               │
│  💎 Loyalty: Bronze (100 pts)│
├─────────────────────────────┤
│  Settings:                  │
│  • Email: user@email.com    │
│  • Change Password          │
│  • Notifications            │
├─────────────────────────────┤
│  [Logout]                   │
└─────────────────────────────┘
```

---

## Implementation Plan

### Phase 1: Rename & Route
- `register.html` → `account.html`
- Add tab switching (login/register)
- Update all navigation links

### Phase 2: Auth Logic
- Implement chosen auth method
- Handle login/register separately
- Session management

### Phase 3: Account Dashboard
- Show user info
- Quick action cards
- Settings section

### Phase 3: Polish
- Form validation
- Error messages
- Loading states
- Success animations

---

## Questions for You:

1. **Auth method?** Keep simple hash or add email/password?
2. **Guest checkout?** Can users buy without registering?
3. **Page structure?** Single `/account` or multiple pages?
4. **Navigation?** Keep "Account" button or change to "Profile"?
5. **Priority features?** What's most important to build first?

---

## My Recommendation:

**Keep it simple for v1:**
- ✅ Single `/account.html` page
- ✅ Tabs for login/register (when logged out)
- ✅ Dashboard view (when logged in)
- ✅ Keep hash-based auth (add password later)
- ✅ Guest checkout allowed
- ✅ Clean Material Design UI

**What do you think?** 🤔
