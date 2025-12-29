# Tutorial: Education-First Commerce

**ID:** tutorial-education-commerce  
**SMRI Code:** S2-7.1,5,11.1.03 (Generated from constants)  
**Priority:** P0 (Critical)  
**Module:** S2-7 (Game → Tutorial)  
**Dependencies:** S2-7 → S1 (Shop) → S5 (Worker) → S11.1 (KV)  
**Duration:** <60 seconds  
**Status:** ✅ Required for MVP

---

## Overview

User encounters care-related event. System shows educational content FIRST (primary). Product recommendation appears as optional, contextual help (secondary). User can complete event WITHOUT purchasing. Commerce is subtle and trust-based.

---

## Module Dependency Chain

```
S2-7 (Tutorial)
  ↓
S1 (Shop - optional product link)
  ↓
S5 (Worker - API endpoints)
  ↓
S11.1 (KV Storage - event queue)
```

**Why S1 added:**
- Event may suggest relevant product
- Link to shop (optional)
- Does NOT block progress

---

## Preconditions

- User has at least one snake in collection
- User has completed 2+ events without buying
- Current event: Temperature-related care
- Shop has relevant product (thermometer/thermostat)
- User has NOT purchased temperature equipment

---

## Test Flow

### Step 1: User Opens App (Normal Entry)
```
INPUT: https://vinas8.github.io/catalog/game.html#hash_abc123
EXPECT: Page loads, fetches pending events
```

### Step 2: System Fetches Event with Commerce Context
```
WORKER REQUEST:
GET https://serpent-town.workers.dev/user-events?user=hash_abc123

WORKER READS KV:
Key: events:hash_abc123
Value: [
  {
    "event_id": "evt_temp_001",
    "type": "care",
    "title": "Temperature check",
    "description": "Ball Pythons need ambient temperature of 78-80°F with a basking spot at 88-92°F...",
    "educational_content": {
      "primary": "Temperature regulation is crucial for snake health...",
      "facts": ["Snakes are ectothermic", "Digestion requires warmth", ...]
    },
    "commerce_suggestion": {
      "optional": true,
      "product_id": "prod_thermometer_001",
      "context": "Many keepers use digital thermometers to monitor...",
      "cta": "View thermometers",
      "position": "after_education"
    },
    "status": "pending",
    "created_at": "2025-12-29T00:00:00Z"
  }
]

RESPONSE: Returns event with commerce_suggestion marked as optional
```

### Step 3: Display Event - Education FIRST
```
UI RENDERS:

┌─────────────────────────────────────────────┐
│ 🌡️ Temperature Check                        │
│                                             │
│ Ball Pythons need ambient temperature of   │
│ 78-80°F with a basking spot at 88-92°F.    │
│ Proper temperature is essential for         │
│ digestion, immune function, and activity.   │
│                                             │
│ 📚 Why temperature matters:                 │
│ • Snakes are ectothermic (rely on          │
│   external heat)                            │
│ • Digestion stops below 75°F               │
│ • Basking spot helps thermoregulation      │
│ • Gradient allows snake to choose temp     │
│                                             │
│ ─────────────────────────────────────────  │
│                                             │
│ 💡 Optional: Many keepers use digital      │
│    thermometers to monitor temperatures     │
│    accurately.                              │
│                                             │
│    [View Thermometers →] (opens shop)      │
│                                             │
│ ─────────────────────────────────────────  │
│                                             │
│ [✓ Mark as Read]                            │
└─────────────────────────────────────────────┘

VALIDATION:
- ✅ Educational content is PRIMARY (top, larger)
- ✅ >100 words of educational content
- ✅ Product mention is SECONDARY (bottom, smaller)
- ✅ Product labeled as "Optional"
- ✅ No urgency language
- ✅ Mark as Read button visible WITHOUT clicking shop link
- ✅ Visual separation (line between education and commerce)
```

### Step 4A: User Ignores Product, Marks Complete
```
INPUT: Click [✓ Mark as Read] (without clicking shop link)

ACTION:
POST /complete-event
Body: { 
  user: "hash_abc123", 
  event_id: "evt_temp_001",
  commerce_action: "ignored"
}

WORKER UPDATES KV:
Key: events:hash_abc123
- Set evt_temp_001.status = "complete"
- Set evt_temp_001.completed_at = "2025-12-29T10:00:00Z"
- Set evt_temp_001.commerce_clicked = false

RESPONSE: { success: true }

UI SHOWS: "✅ Got it! See you next time."

NEXT EVENT: Shows normally (NO mention of skipped product)
```

### Step 4B: User Clicks Product Link (Optional)
```
INPUT: Click [View Thermometers →]

ACTION:
Opens: catalog.html?category=temperature&ref=tutorial
Tracks: commerce_clicked = true (analytics only)

USER WORKFLOW:
1. Views shop products
2. Can close shop, return to game
3. Event still completable
4. NO pressure to buy

COMPLETION:
User returns to game → Click [✓ Mark as Read] → Done
```

---

## Validation Checklist

- [x] **Education first:** >100 words before product ✅
- [x] **Product secondary:** Smaller, below, optional ✅
- [x] **No blocking:** Can complete without buying ✅
- [x] **Contextual:** Product matches event topic ✅
- [x] **Subtle:** No urgency, no pressure ✅
- [x] **Clear labeling:** "Optional" visible ✅
- [x] **Visual separation:** Line/spacing between sections ✅
- [x] **Progress continues:** Next event shows normally ✅

---

## Validation Questions (ANSWERED)

### 1. Works if checked weekly?
**YES** ✅
- Event completable regardless of purchase
- Commerce suggestion doesn't expire
- User can ignore product forever

### 2. ≤60 seconds interaction?
**YES** ✅
- Read educational content (~30s)
- Optionally glance at product mention (~5s)
- Click "Mark as Read" (~2s)
- Total: ~35 seconds

### 3. No purchase required?
**YES** ✅ (Critical validation)
- Event completes WITHOUT clicking product link
- Progress continues normally
- No penalties for ignoring products

### 4. Products optional + contextual + secondary?
**YES** ✅ (This scenario validates it)
- Product labeled "Optional"
- Matches event context (temperature → thermometer)
- Appears AFTER educational content
- Visually de-emphasized
- No urgency language

### 5. Deterministic events (no hidden timers)?
**YES** ✅
- Event created at milestone (e.g., 5 events completed)
- Commerce suggestion static (doesn't change)
- No time pressure

### 6. GitHub Pages + Cloudflare KV compatible?
**YES** ✅
- Static HTML/JS (GitHub Pages)
- Worker API handles event + commerce data
- Shop link opens catalog.html (static page)

---

## Success Criteria

**PASS if:**
1. Educational content appears FIRST and is PRIMARY
2. Product mention labeled "Optional"
3. User can complete event without clicking product link
4. Visual hierarchy: education large, product small
5. No urgency language ("limited time", "buy now")
6. Product contextually relevant to event topic
7. Separation between education and commerce sections

**FAIL if:**
- Product appears before educational content
- "Mark as Read" blocked until product viewed
- Product mention not labeled optional
- Urgency language present
- Product unrelated to event topic
- Education and commerce visually equal

---

## Anti-Patterns to Avoid

❌ **Commerce first:** Product at top, education below  
❌ **Blocking progress:** "View product to continue"  
❌ **Urgency:** "Limited time!", "Buy now to save snake"  
❌ **Equal weight:** Product as prominent as education  
❌ **Irrelevant products:** Advertising unrelated items  
❌ **Pressure:** "Other keepers bought this"  
❌ **Frequency:** Every event has product mention

---

## Commerce Frequency Rules

**NOT every event has products:**
- Educational-only events: ~70%
- Events with optional product: ~30%
- User sees product mention ~1 per 3 events

**Product relevance required:**
- Temperature event → thermometer/thermostat
- Feeding event → feeding tongs/scales
- Habitat event → substrate/hides
- NO generic "Shop all products" links

---

## KV Operations Summary

| Operation | Key | Type | Purpose |
|-----------|-----|------|---------|
| READ | `events:hash_abc123` | Array | Fetch event with commerce data |
| WRITE | `events:hash_abc123` | Array | Mark complete + track commerce_clicked |
| READ | `products:category=temperature` | Array | (Optional) If user clicks link |

**Total:** 1 read, 1 write (same as happy path)

---

## Edge Cases

### User completes 10 events, never clicks products
- ✅ System continues normally
- ✅ No warnings or prompts
- ✅ Trust maintained

### User clicks product but doesn't buy
- ✅ Event still completable
- ✅ No follow-up pressure
- ✅ Analytics tracks interest (for future)

### Product out of stock
- ✅ Show "Currently unavailable"
- ✅ Still provide educational value
- ✅ Event completable

### User already owns product
- ✅ System detects purchase history
- ✅ Shows "You own this!" badge
- ✅ No duplicate suggestions

---

## Analytics (Non-Blocking)

Track for product-market fit:
- `commerce_shown`: How many events showed products
- `commerce_clicked`: How many users clicked links
- `commerce_converted`: How many completed purchase
- `commerce_ignored`: How many ignored (majority expected)

**Purpose:** Improve product relevance, NOT pressure users

---

## Debug Page

**URL:** http://localhost:8000/debug/tutorial-education-commerce.html

**Test Steps:**
1. Click "Run Test"
2. Displays event with education FIRST
3. Product mention appears BELOW with "Optional" label
4. Click "Mark as Read" WITHOUT clicking product
5. Verifies completion succeeds
6. Click "View Product" (optional test)
7. Verifies shop link works but event still completable

---

**Created:** 2025-12-29  
**Last Updated:** 2025-12-29T01:27:33Z  
**Status:** Ready for implementation  
**SMRI Code (Generated):** S2-7.1,5,11.1.03  
**Key Validation:** Commerce is optional, not required
