# S7.1.01 - Happy Path (Daily Check-in)

**ID:** S7.1.01  
**Priority:** P0 (Critical)  
**Module:** S7 (Event Tutorial)  
**Dependencies:** S7 → S5 (Worker) → S11.1 (KV)  
**Duration:** <60 seconds  
**Status:** ✅ Required for MVP

---

## Overview

User checks app once per day, sees ONE event card, reads educational content, marks complete, leaves. No purchase required. Progress continues.

---

## Module Dependency Chain

```
S7 (Event Tutorial)
  ↓
S5 (Worker - API endpoints)
  ↓
S11.1 (KV Storage - event queue)
```

**Why this chain:**
- S7 displays events from KV
- S5 provides API to read/write events
- S11.1 stores event queue per user

---

## Preconditions

- User has at least one snake in collection
- User hash exists: `user_products:hash_abc123`
- Event queue exists: `events:hash_abc123` with ≥1 pending event
- User has not opened app in 24 hours

---

## Test Flow

### Step 1: User Opens App
```
INPUT: https://vinas8.github.io/catalog/game.html#hash_abc123
EXPECT: Page loads, fetches pending events from Worker API
API CALL: GET /user-events?user=hash_abc123
```

### Step 2: System Fetches Events
```
WORKER REQUEST:
GET https://serpent-town.workers.dev/user-events?user=hash_abc123

WORKER READS KV:
Key: events:hash_abc123
Value: [
  {
    "event_id": "evt_growth_001",
    "type": "growth",
    "title": "Your snake grew 2cm",
    "status": "pending",
    "created_at": "2025-12-27T00:00:00Z"
  },
  {
    "event_id": "evt_shed_001",
    "type": "biological",
    "title": "Entering shed cycle",
    "status": "pending",
    "created_at": "2025-12-28T00:00:00Z"
  }
]

RESPONSE: Returns oldest event (evt_growth_001)
```

### Step 3: ONE Event Displayed
```
UI RENDERS:
┌─────────────────────────────────────────────┐
│ 🐍 Your Ball Python grew 2cm               │
│                                             │
│ Snakes grow throughout their lives, with    │
│ the fastest growth in their first 3 years.  │
│ Ball Pythons can reach 4-5 feet as adults.  │
│                                             │
│ 📚 Did you know?                            │
│ Growth rate depends on feeding frequency    │
│ and prey size. Healthy juveniles grow      │
│ 12-18 inches in their first year.          │
│                                             │
│ [✓ Mark as Read]                            │
└─────────────────────────────────────────────┘

VALIDATION:
- ✅ Only ONE event visible
- ✅ No stat bars
- ✅ No dashboards
- ✅ No competing UI elements
- ✅ Clear educational content (>50 words)
- ✅ Simple action button
```

### Step 4: User Marks Complete
```
INPUT: Click [✓ Mark as Read]

ACTION:
POST /complete-event
Body: { user: "hash_abc123", event_id: "evt_growth_001" }

WORKER UPDATES KV:
Key: events:hash_abc123
- Set evt_growth_001.status = "complete"
- Set evt_growth_001.completed_at = "2025-12-28T22:00:00Z"

RESPONSE: { success: true }

UI SHOWS: "✅ Got it! See you next time."
```

### Step 5: User Closes App
```
DURATION: ~30 seconds (read + click)
EXPECT: Session complete, progress saved to KV
NEXT VISIT: Will show evt_shed_001 (next in queue)
```

---

## Validation Checklist

- [x] **<60 seconds:** Read + click = ~30 seconds ✅
- [x] **ONE event only:** No multiple cards ✅
- [x] **Educational first:** Snake biology is primary ✅
- [x] **No purchase required:** Progress without buying ✅
- [x] **Progress saved:** KV updated with completion ✅
- [x] **No pressure:** Calm tone, no urgency ✅
- [x] **Clear completion:** User knows they're done ✅

---

## Validation Questions (ANSWERED)

### 1. Works if checked weekly?
**YES** ✅
- Events queue in KV (no expiry)
- Oldest shown first
- No punishment for absence
- User can be gone 7+ days, returns, sees oldest event

### 2. ≤60 seconds interaction?
**YES** ✅
- Read educational content (~20s)
- Click "Mark as Read" (~2s)
- Wait for confirmation (~3s)
- Total: ~25 seconds

### 3. No purchase required?
**YES** ✅
- Event completes regardless of purchases
- No product mentions in this scenario
- Progress continues without buying

### 4. Products optional + contextual + secondary?
**YES** ✅ (N/A for this scenario)
- This scenario has NO product mentions
- See S7.1.03 for commerce scenario

### 5. Deterministic events (no hidden timers)?
**YES** ✅
- Events created explicitly (growth milestone reached)
- No continuous decay
- State changes only on user action

### 6. GitHub Pages + Cloudflare KV compatible?
**YES** ✅
- Static HTML/JS (GitHub Pages)
- Worker API handles KV reads/writes
- No server-side rendering needed

---

## Success Criteria

**PASS if:**
1. User sees exactly ONE event card
2. Event displays educational content (>50 words)
3. User can mark complete in one click
4. KV updated with completion status
5. Total interaction <60 seconds
6. No purchase prompts

**FAIL if:**
- Multiple events shown simultaneously
- Stat bars or dashboards visible
- Purchase required to continue
- Interaction exceeds 60 seconds
- Event completion doesn't persist in KV

---

## Anti-Patterns to Avoid

❌ **Multiple events on screen** ("You have 3 pending events")  
❌ **Stat decay warnings** ("Hunger is low!")  
❌ **Purchase CTAs** ("Buy now to continue")  
❌ **Urgency language** ("Don't wait!", "Limited time")  
❌ **Complex navigation** (menus, tabs, dashboards)  
❌ **Real-time updates** (no WebSockets, no polling)

---

## KV Operations Summary

| Operation | Key | Type | Purpose |
|-----------|-----|------|---------|
| READ | `events:hash_abc123` | Array | Fetch pending events |
| WRITE | `events:hash_abc123` | Array | Mark event complete |

**Total:** 1 read, 1 write (minimal)

---

## Debug Page

**URL:** http://localhost:8000/debug/S7.1.01.html

**Test Steps:**
1. Click "Run Test"
2. Simulates fetching event from KV
3. Displays ONE event card
4. Click "Mark as Read"
5. Verifies KV write occurs
6. Shows pass/fail result

---

**Created:** 2025-12-28  
**Last Updated:** 2025-12-28T22:04:51Z  
**Status:** Ready for implementation
