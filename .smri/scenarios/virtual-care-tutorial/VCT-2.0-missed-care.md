# Scenario VCT-2.0: Missed Care - 2-3 Days Absence

**ID:** VCT-2.0-MISSED-CARE  
**Priority:** P0 (Critical)  
**Category:** Virtual Care Tutorial  
**Duration:** <60 seconds  
**Status:** ✅ Required for MVP

---

## Overview

User returns after 2-3 days of absence. System shows ONLY oldest pending event. NO punishment language. Clear recovery path. Progress continues normally.

---

## Preconditions

- User has not opened app in 3 days
- 3 events queued in KV: `events:hash_abc123`
- Events created on Day 1, Day 2, Day 3
- User opens app on Day 4

---

## Test Flow

### Step 1: User Returns After Absence
```
INPUT: Navigate to https://vinas8.github.io/catalog/game.html#hash_abc123
LAST VISIT: 2025-12-25 (3 days ago)
CURRENT DATE: 2025-12-28
EXPECT: No error, no punishment message
```

### Step 2: System Fetches Queued Events
```
KV READ: events:hash_abc123
RESPONSE: [
  {
    "event_id": "evt_shed_complete_001",
    "created_at": "2025-12-25T10:00:00Z",
    "status": "pending",
    "title": "Your Ball Python shed successfully"
  },
  {
    "event_id": "evt_feeding_002",
    "created_at": "2025-12-26T10:00:00Z",
    "status": "pending",
    "title": "Feeding time: Your snake ate"
  },
  {
    "event_id": "evt_behavior_003",
    "created_at": "2025-12-27T10:00:00Z",
    "status": "pending",
    "title": "Your snake is hiding (normal behavior)"
  }
]
EXPECT: Oldest event (evt_shed_complete_001) displayed first
```

### Step 3: ONE Event Shown (Not All 3)
```
UI SHOWS:
┌─────────────────────────────────────────────┐
│ 🐍 Your Ball Python shed successfully      │
│                                             │
│ While you were away, your snake completed   │
│ its shed cycle. This is a natural process   │
│ that happens every 4-8 weeks as snakes grow.│
│                                             │
│ 📚 Shedding Facts:                          │
│ • Eyes turn cloudy before shed              │
│ • Skin comes off in one piece when healthy │
│ • Increased humidity helps the process     │
│                                             │
│ ℹ️ 2 more events pending                   │
│                                             │
│ [✓ Mark as Read] [Learn More]              │
└─────────────────────────────────────────────┘

EXPECT:
- NO punishment language ("Your snake suffered")
- NO urgency ("Act now!")
- CLEAR queue indicator ("2 more events")
- POSITIVE framing ("shed successfully")
```

### Step 4: User Marks Event Complete
```
INPUT: Click [✓ Mark as Read]
ACTION: Pop oldest event from queue
KV WRITE: events:hash_abc123
  - evt_shed_complete_001.status = "complete"
  - Remove from pending queue
EXPECT: Event removed, 2 events remain
```

### Step 5: Next Event Preview (Optional)
```
UI SHOWS (briefly):
"Next: Feeding time update"
[Continue] or auto-dismiss after 3 seconds

EXPECT:
- User knows what's next
- Not forced to read all 3 now
- Can close app and return later
```

### Step 6: User Closes App
```
INPUT: User navigates away
REMAINING EVENTS: 2 pending
EXPECT:
- Progress saved
- No penalty for not reading all 3
- Next visit shows next event
```

---

## Validation Checklist

- [x] **ONE event at a time:** Even with 3 pending, only 1 shown
- [x] **NO punishment:** Language is neutral/positive
- [x] **Clear queue indicator:** User knows 2 more pending
- [x] **Recovery path:** Just keep clicking through
- [x] **Progress continues:** No stat penalty for absence
- [x] **<60 seconds:** Read + click takes ~30 seconds
- [x] **No forced marathon:** User can leave and return

---

## Success Criteria

**PASS if:**
1. Only ONE event displayed despite 3 pending
2. No punishment/guilt language present
3. Queue size clearly indicated ("2 more")
4. User can mark complete and leave
5. Remaining events persist for next visit
6. Total interaction <60 seconds

**FAIL if:**
- All 3 events shown simultaneously
- Punishment language ("Your snake suffered")
- Forced to read all before leaving
- Progress blocked by absence
- Negative tone or urgency

---

## Anti-Patterns to Avoid

❌ **Event overload** ("You missed 3 events! Read all now")  
❌ **Punishment** ("Your snake is unhappy from neglect")  
❌ **Guilt trip** ("Your snake needed you")  
❌ **Forced marathon** (must read all to unlock app)  
❌ **Stat penalties** ("Health decreased by 30")

---

## Positive Patterns to Use

✅ **Queue transparency** ("2 more events pending")  
✅ **Neutral framing** ("While you were away...")  
✅ **Progress indicator** ("Event 1 of 3")  
✅ **Graceful continuation** ("Come back anytime to see next")  
✅ **Educational focus** (still teaching, not punishing)

---

## KV Operations Summary

| Operation | Key | Type | Purpose |
|-----------|-----|------|---------|
| READ | `events:hash_abc123` | JSON array | Fetch all pending events |
| WRITE | `events:hash_abc123` | JSON array | Mark oldest complete, pop from queue |

**Total:** 1 read, 1 write (minimal)

---

## Test Implementation

**Location:** `tests/scenarios/virtual-care-tutorial/VCT-2.0-missed-care.test.js`

```javascript
describe('VCT-2.0: Missed Care - 2-3 Days Absence', () => {
  it('should show only ONE event when 3 are pending', async () => {
    // Setup: 3 events in queue
    mockKV.set('events:hash_abc123', [
      { event_id: 'evt_1', created_at: '2025-12-25', status: 'pending' },
      { event_id: 'evt_2', created_at: '2025-12-26', status: 'pending' },
      { event_id: 'evt_3', created_at: '2025-12-27', status: 'pending' }
    ]);
    
    await page.goto('game.html#hash_abc123');
    
    const events = await page.$$('.event-card');
    expect(events.length).toBe(1);
  });
  
  it('should display queue indicator', async () => {
    const queueText = await page.textContent('.queue-indicator');
    expect(queueText).toContain('2 more events');
  });
  
  it('should NOT show punishment language', async () => {
    const content = await page.textContent('.event-card');
    expect(content).not.toMatch(/suffer|unhappy|neglect|died/i);
  });
  
  it('should pop event from queue on complete', async () => {
    await page.click('[data-action="mark-complete"]');
    
    const events = mockKV.get('events:hash_abc123');
    expect(events.length).toBe(2);
    expect(events[0].event_id).toBe('evt_2'); // Oldest removed
  });
});
```

---

**Created:** 2025-12-28  
**Last Updated:** 2025-12-28T21:27:05Z  
**Status:** Ready for implementation
