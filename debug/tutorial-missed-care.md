# Tutorial: Missed Care (2-3 Days)

**ID:** tutorial-missed-care  
**SMRI Code:** S2-7.5,11.1.02 (Generated from constants)  
**Priority:** P0 (Critical)  
**Module:** S2-7 (Game → Tutorial)  
**Dependencies:** S2-7 → S5 (Worker) → S11.1 (KV)  
**Duration:** <60 seconds  
**Status:** ✅ Required for MVP

---

## Overview

User returns after 2-3 days of absence. Sees oldest pending event. NO punishment, NO warnings, NO guilt-tripping. System picks up where it left off. Progress continues normally.

---

## Module Dependency Chain

```
S2-7 (Tutorial)
  ↓
S5 (Worker - API endpoints)
  ↓
S11.1 (KV Storage - event queue)
```

---

## Preconditions

- User has at least one snake in collection
- User hash exists: `user_products:hash_abc123`
- Event queue has multiple pending events (created over time)
- User has NOT opened app in 2-3 days
- Last visit: 2025-12-25
- Current: 2025-12-28 (3 days later)

---

## Test Flow

### Step 1: User Returns After Absence
```
INPUT: https://vinas8.github.io/catalog/game.html#hash_abc123
TIME: 3 days since last visit
EXPECT: Page loads normally (no error, no warning)
```

### Step 2: System Fetches Event Queue
```
WORKER REQUEST:
GET https://serpent-town.workers.dev/user-events?user=hash_abc123

WORKER READS KV:
Key: events:hash_abc123
Value: [
  {
    "event_id": "evt_feed_001",
    "type": "care",
    "title": "Feeding reminder",
    "status": "pending",
    "created_at": "2025-12-25T10:00:00Z",  // 3 days old
    "priority": "normal"
  },
  {
    "event_id": "evt_shed_001",
    "type": "biological",
    "title": "Entering shed cycle",
    "status": "pending",
    "created_at": "2025-12-26T14:00:00Z",  // 2 days old
    "priority": "normal"
  },
  {
    "event_id": "evt_growth_001",
    "type": "growth",
    "title": "Growth milestone",
    "status": "pending",
    "created_at": "2025-12-27T18:00:00Z",  // 1 day old
    "priority": "normal"
  }
]

WORKER LOGIC:
- Sort by created_at (oldest first)
- Return ONLY evt_feed_001 (oldest)
- NO status change (still "pending")
- NO warnings about absence

RESPONSE: { event: evt_feed_001 }
```

### Step 3: Display OLDEST Event (Not Multiple)
```
UI RENDERS:
┌─────────────────────────────────────────────┐
│ 🍽️ Feeding Reminder                        │
│                                             │
│ Ball Pythons typically eat every 7-10 days  │
│ as adults. Younger snakes eat more          │
│ frequently (every 5-7 days).                │
│                                             │
│ 📚 Did you know?                            │
│ Snakes can go weeks without food if needed, │
│ but consistent feeding helps maintain       │
│ healthy weight and growth patterns.         │
│                                             │
│ [✓ Mark as Read]                            │
└─────────────────────────────────────────────┘

VALIDATION:
- ✅ Only ONE event visible (oldest)
- ✅ No "You missed X events" message
- ✅ No warnings about absence
- ✅ No guilt-tripping ("Your snake was hungry!")
- ✅ No urgency ("Act now!")
- ✅ Calm, educational tone
- ✅ Same UI as daily check-in
```

### Step 4: User Marks Complete
```
INPUT: Click [✓ Mark as Read]

ACTION:
POST /complete-event
Body: { user: "hash_abc123", event_id: "evt_feed_001" }

WORKER UPDATES KV:
Key: events:hash_abc123
- Set evt_feed_001.status = "complete"
- Set evt_feed_001.completed_at = "2025-12-28T10:00:00Z"

RESPONSE: { success: true }

UI SHOWS: "✅ Got it! See you next time."
```

### Step 5: Next Visit Shows Next Event
```
NEXT VISIT: User returns tomorrow
EXPECT: Shows evt_shed_001 (next oldest)
NO MENTION: of previous 3-day absence
```

---

## Validation Checklist

- [x] **Works after 2-3 day absence:** YES ✅
- [x] **No punishment:** No negative consequences ✅
- [x] **No warnings:** No "You were gone too long" ✅
- [x] **Oldest event first:** Queue sorted by created_at ✅
- [x] **ONE event only:** No "catch-up" multiple cards ✅
- [x] **Same UX as daily:** Identical to happy path ✅
- [x] **<60 seconds:** Read + click = ~30 seconds ✅
- [x] **Progress continues:** Events still valid ✅

---

## Validation Questions (ANSWERED)

### 1. Works if checked weekly?
**YES** ✅
- Events queue indefinitely in KV
- Oldest shown first
- User can be gone 7+ days, returns, sees oldest event
- No expiration, no penalties

### 2. ≤60 seconds interaction?
**YES** ✅
- Same as happy path
- Read educational content (~20s)
- Click "Mark as Read" (~2s)
- Total: ~25 seconds

### 3. No purchase required?
**YES** ✅
- Event completes regardless of purchases
- No "buy to continue" prompts
- Progress unblocked

### 4. Products optional + contextual + secondary?
**YES** ✅ (N/A for this scenario)
- No product mentions in missed care scenario
- See S2-7.1,5,11.1.03 for commerce scenario

### 5. Deterministic events (no hidden timers)?
**YES** ✅
- Events created at specific milestones
- No decay between visits
- State frozen while user is away
- Events don't expire or escalate

### 6. GitHub Pages + Cloudflare KV compatible?
**YES** ✅
- Static HTML/JS (GitHub Pages)
- Worker API handles KV reads/writes
- No server-side state management

---

## Success Criteria

**PASS if:**
1. User absent 2-3 days → sees oldest event
2. No warnings or guilt messages shown
3. Same UX as daily check-in (no visual difference)
4. Event queue persists correctly
5. Oldest event marked complete → next oldest shown on next visit
6. Total interaction <60 seconds

**FAIL if:**
- Multiple events shown simultaneously
- Warning message: "You've been gone X days"
- Different UI from happy path
- Events expired or deleted
- User pressured to catch up quickly
- Purchase prompt appears

---

## Anti-Patterns to Avoid

❌ **Guilt-tripping:** "Your snake missed you!"  
❌ **Warnings:** "You haven't checked in 3 days"  
❌ **Catch-up pressure:** "You have 5 pending events - complete them now!"  
❌ **Event expiration:** Deleting old events  
❌ **Stat decay:** "Health dropped to 20% while you were gone"  
❌ **Urgency:** "Complete these before they expire!"  
❌ **Visual differences:** Red warnings, error states

---

## KV Operations Summary

| Operation | Key | Type | Purpose |
|-----------|-----|------|---------|
| READ | `events:hash_abc123` | Array | Fetch all pending events |
| SORT | In-memory | Array | Sort by created_at (oldest first) |
| WRITE | `events:hash_abc123` | Array | Mark oldest complete |

**Total:** 1 read, 1 write (same as happy path)

---

## Edge Cases

### User absent 30+ days
- ✅ Still works
- ✅ Shows oldest event
- ✅ No special handling
- ✅ See S2-7.5,11.1.06 for failure scenario (educational)

### User returns multiple times in one day
- ✅ Each visit shows next oldest event
- ✅ No artificial delays
- ✅ User can complete all pending events if desired

### Event queue empty
- ✅ Show "All caught up!" message
- ✅ No new events until next milestone
- ✅ User can close app

---

## Debug Page

**URL:** http://localhost:8000/debug/tutorial-missed-care.html

**Test Steps:**
1. Set last_visit to 3 days ago
2. Click "Run Test"
3. Simulates fetching events from KV
4. Displays OLDEST event only
5. Verify no warnings shown
6. Click "Mark as Read"
7. Verifies next visit shows next event

---

**Created:** 2025-12-29  
**Last Updated:** 2025-12-29T01:18:05Z  
**Status:** Ready for implementation  
**SMRI Code (Generated):** S2-7.5,11.1.02
