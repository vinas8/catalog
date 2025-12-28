# Scenario VCT-1.0: Happy Path - Daily Check-in

**ID:** VCT-1.0-HAPPY-DAILY  
**Priority:** P0 (Critical)  
**Category:** Virtual Care Tutorial  
**Duration:** <60 seconds  
**Status:** ✅ Required for MVP

---

## Overview

User checks app once per day, sees ONE event, reads educational content, marks complete, leaves. No purchase required. Progress continues.

---

## Preconditions

- User has at least one snake in collection
- User hash exists in KV: `user_products:hash_abc123`
- Event queue exists: `events:hash_abc123` with at least one pending event
- User has not opened app in 24 hours

---

## Test Flow

### Step 1: User Opens App
```
INPUT: Navigate to https://vinas8.github.io/catalog/game.html#hash_abc123
EXPECT: Page loads, fetches pending events from KV
```

### Step 2: System Fetches Events
```
KV READ: events:hash_abc123
RESPONSE: [
  {
    "event_id": "evt_shed_001",
    "type": "biological",
    "title": "Your Ball Python is entering shed cycle",
    "status": "pending",
    "created_at": "2025-12-28T00:00:00Z"
  },
  {
    "event_id": "evt_growth_001",
    "type": "growth",
    "title": "Your snake grew 2cm",
    "status": "pending",
    "created_at": "2025-12-27T00:00:00Z"
  }
]
EXPECT: Oldest event (evt_growth_001) selected for display
```

### Step 3: ONE Event Displayed
```
UI SHOWS:
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
│ [✓ Mark as Read] [Learn More]              │
└─────────────────────────────────────────────┘

EXPECT:
- Only ONE event visible
- No other UI competing for attention
- No stat bars, no dashboards
- Clear call-to-action buttons
```

### Step 4: User Marks as Read
```
INPUT: Click [✓ Mark as Read]
ACTION: Event marked complete
KV WRITE: events:hash_abc123
  - evt_growth_001.status = "complete"
  - evt_growth_001.completed_at = "2025-12-28T21:27:00Z"
SUCCESS MESSAGE: "✅ Got it! See you next time."
EXPECT: Clear completion state
```

### Step 5: Dex Updated (Optional)
```
KV READ: dex:hash_abc123
KV WRITE: dex:hash_abc123
  - Add "growth_patterns" to unlocked_entries
EXPECT: Dex entry unlocked for future reference
```

### Step 6: User Closes App
```
INPUT: User navigates away
DURATION: Total time < 60 seconds
EXPECT: Session complete, progress saved
```

---

## Validation Checklist

- [x] **<60 seconds:** Read + click takes ~30 seconds
- [x] **ONE event only:** No competing UI elements
- [x] **Educational first:** Snake biology is primary content
- [x] **No purchase required:** Progress continues without buying
- [x] **Progress saved:** Event marked complete in KV
- [x] **No pressure:** Calm tone, no urgency
- [x] **Clear completion:** User knows they're done

---

## Success Criteria

**PASS if:**
1. User sees exactly ONE event card
2. Event displays educational content (>50 words)
3. User can mark complete in one click
4. KV updated with completion status
5. Total interaction time <60 seconds
6. No purchase prompts block progress

**FAIL if:**
- Multiple events shown simultaneously
- Stat bars or dashboards visible
- Purchase required to continue
- Interaction exceeds 60 seconds
- Event completion doesn't persist

---

## Anti-Patterns to Avoid

❌ **Multiple events on screen** ("You have 3 pending events")  
❌ **Stat decay warnings** ("Hunger is low!")  
❌ **Purchase CTAs** ("Buy now to continue")  
❌ **Urgency language** ("Don't wait!", "Limited time")  
❌ **Complex navigation** (menus, tabs, dashboards)

---

## KV Operations Summary

| Operation | Key | Type | Purpose |
|-----------|-----|------|---------|
| READ | `events:hash_abc123` | JSON array | Fetch pending events |
| WRITE | `events:hash_abc123` | JSON array | Mark event complete |
| READ | `dex:hash_abc123` | JSON object | Check unlocked entries |
| WRITE | `dex:hash_abc123` | JSON object | Unlock new entry |

**Total:** 2 reads, 2 writes (minimal)

---

## Test Implementation

**Location:** `tests/scenarios/virtual-care-tutorial/VCT-1.0-happy-daily.test.js`

```javascript
describe('VCT-1.0: Happy Path - Daily Check-in', () => {
  it('should display ONE event when user opens app', async () => {
    // Setup: Mock KV with 2 pending events
    mockKV.set('events:hash_abc123', [
      { event_id: 'evt_growth_001', status: 'pending' },
      { event_id: 'evt_shed_001', status: 'pending' }
    ]);
    
    // Action: Load game.html
    await page.goto('game.html#hash_abc123');
    
    // Assert: Only ONE event visible
    const events = await page.$$('.event-card');
    expect(events.length).toBe(1);
  });
  
  it('should mark event complete on click', async () => {
    // Action: Click "Mark as Read"
    await page.click('[data-action="mark-complete"]');
    
    // Assert: KV updated
    const events = mockKV.get('events:hash_abc123');
    expect(events[0].status).toBe('complete');
    expect(events[0].completed_at).toBeTruthy();
  });
  
  it('should complete interaction in <60 seconds', async () => {
    const start = Date.now();
    await page.goto('game.html#hash_abc123');
    await page.click('[data-action="mark-complete"]');
    const duration = Date.now() - start;
    
    expect(duration).toBeLessThan(60000);
  });
});
```

---

**Created:** 2025-12-28  
**Last Updated:** 2025-12-28T21:27:05Z  
**Status:** Ready for implementation
