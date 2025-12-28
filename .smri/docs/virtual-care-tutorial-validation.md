# Virtual Snake Care Tutorial - Scenario Validation

**Version:** 0.7.0  
**Created:** 2025-12-28  
**Purpose:** Validate 1-minute-per-day educational care system  
**Status:** CRITICAL DESIGN VALIDATION REQUIRED

---

## ⚠️ FUNDAMENTAL CONFLICT DETECTED

### Current System (v0.7.0)
**Real-time Tamagotchi with stats decay:**
- 8 stats decay per hour (hunger -2.5/hr, water -3/hr)
- Requires frequent care actions (every 1-4 hours)
- LocalStorage tracks continuous state
- Player punished for not checking frequently

### Requested System
**1-minute-per-day educational tutorial:**
- Event-driven (NOT real-time)
- Education-first (NOT survival-based)
- No time pressure (NOT decay-based)
- Progress continues even if ignored (NOT punitive)

**VERDICT:** These systems are **fundamentally incompatible**.

---

## 🚨 CRITICAL VALIDATION QUESTIONS

### Question 1: Does current Tamagotchi system stay?

**If YES:**
- Current decay-based system remains
- Virtual care tutorial is a **separate mode**
- Two parallel systems (real-time + event-based)

**If NO:**
- Current Tamagotchi system must be **removed/replaced**
- Event-based tutorial becomes primary
- Breaking change to existing gameplay

**USER MUST ANSWER THIS FIRST.**

---

### Question 2: Can user complete interaction in 60 seconds?

**Current system: NO**
- Must check 8 stats
- Decide which care actions needed
- Navigate to equipment shop
- Execute multiple actions with cooldowns
- Easily exceeds 60 seconds

**Event-based tutorial: YES**
- ONE event presented
- ONE action needed
- ONE fact learned
- Clear in/out flow

**CONCLUSION:** Event-based design required for 60-second constraint.

---

### Question 3: Does system work if checked once per week?

**Current system: NO**
- Stats decay to zero in 12-40 hours
- Snake dies if not checked for 2-3 days
- No recovery mechanism

**Event-based tutorial: YES**
- Events queue (no expiry)
- No death penalty
- Progress accumulates regardless of frequency

**CONCLUSION:** Event-based design required for infrequent access.

---

### Question 4: Can all care be completed without purchases?

**Current system: PARTIALLY**
- Manual care always available
- Equipment optional (reduces frequency)
- But pressure exists (decay never stops)

**Event-based tutorial: YES**
- No care actions needed (educational only)
- Products shown as context, not requirement
- Progress independent of purchases

**CONCLUSION:** Event-based tutorial removes implicit purchase pressure.

---

### Question 5: Are product recommendations secondary?

**Current system: NO**
- Equipment shop visible in game UI
- Auto-feeders reduce player burden significantly
- Implicit pressure through decay mechanics

**Event-based tutorial: YES**
- Products mentioned in educational context
- "This is what real keepers use" framing
- No pressure, no urgency

**CONCLUSION:** Event-based tutorial aligns with ethical commerce.

---

### Question 6: Is state change deterministic and event-based?

**Current system: NO**
- Time-based decay runs continuously
- State changes happen passively
- LocalStorage updated on interval

**Event-based tutorial: YES**
- Events fire on actions only
- State changes explicit and logged
- No hidden timers

**CONCLUSION:** Event-based tutorial fits GitHub Pages + KV constraints better.

---

## 📋 SCENARIO DEFINITIONS

### Scenario 1: Happy Path (Daily Check-in)

**ID:** `S1.0-HAPPY-DAILY`  
**Priority:** P0 (Critical)  
**Duration:** <60 seconds

**Flow:**
```
1. User opens app (game.html#user_hash)
2. System fetches pending events from KV
3. ONE event displayed prominently:
   "Your Ball Python is entering shed cycle"
4. Educational fact shown:
   "Snakes shed their skin as they grow. During shed, their 
    eyes turn cloudy and they may refuse food. This is normal 
    and healthy. Humidity should be slightly higher (60-70%)."
5. Optional action offered:
   [ Mark as Read ] [ Learn More ]
6. If user clicks "Mark as Read":
   - Event marked complete in KV
   - Progress saved
   - Dex entry updated (shed cycle learned)
7. If user clicks "Learn More":
   - Modal with detailed explanation
   - Optional product mention: "Many keepers use a humid hide"
   - No purchase required
8. User closes app
```

**Validation:**
- ✅ <60 seconds (read + click)
- ✅ ONE event only
- ✅ Educational first
- ✅ No purchase required
- ✅ Progress continues (event logged to KV)

**KV Operations:**
- Read: `events:user_hash` (1 read)
- Write: `events:user_hash` (1 write, mark complete)

---

### Scenario 2: Missed Care (2-3 days absence)

**ID:** `S2.0-MISSED-CARE`  
**Priority:** P0 (Critical)  
**Duration:** <60 seconds

**Flow:**
```
1. User returns after 3 days
2. System fetches pending events (3 events queued)
3. ONLY OLDEST event shown:
   "Your Ball Python shed successfully"
4. Clear explanation:
   "While you were away, your snake completed its shed cycle.
    This is a natural process that happens every 4-8 weeks."
5. NO punishment message
6. NO multiple tasks
7. Progress indicator: "2 more events pending"
8. User marks as read
9. Next visit shows next event
```

**Validation:**
- ✅ ONE event at a time (not overwhelming)
- ✅ NO punishment language
- ✅ Clear recovery path (queue system)
- ✅ Progress continues regardless of absence
- ✅ <60 seconds interaction

**KV Operations:**
- Read: `events:user_hash` (1 read)
- Write: `events:user_hash` (1 write, pop oldest)

---

### Scenario 3: Education-First Commerce

**ID:** `S3.0-COMMERCE-CONTEXT`  
**Priority:** P0 (Critical)  
**Duration:** <60 seconds

**Flow:**
```
1. User opens app
2. Event shown: "Temperature dropped overnight"
3. Educational explanation:
   "Ball Pythons are cold-blooded and need external heat. 
    In the wild, they bask on warm rocks. In captivity, 
    keepers provide heat sources to maintain 80-85°F."
4. Fact highlighted: "Cold snakes don't digest food properly"
5. THEN, secondary panel (collapsible):
   "How real keepers maintain temperature:"
   - Heat mats (attach under enclosure)
   - Ceramic heaters (overhead heat)
   - Thermostats (automatic regulation)
   [ See Products ] (optional link)
6. User can:
   - Ignore product section entirely → Progress continues
   - Click "See Products" → Catalog opens (no pressure)
   - Mark event as read without looking at products
```

**Validation:**
- ✅ Education comes FIRST (primary content)
- ✅ Product mention is SECONDARY (collapsible)
- ✅ Optional link (not forced)
- ✅ Progress continues if ignored
- ✅ No urgency language ("buy now", "don't wait")
- ✅ <60 seconds (even if reading product section)

**KV Operations:**
- Read: `events:user_hash` (1 read)
- Write: `events:user_hash` (1 write)
- Optional read: `products` (if user clicks "See Products")

---

### Scenario 4: Trust Protection (No Purchase Blocking)

**ID:** `S4.0-TRUST-PROTECT`  
**Priority:** P0 (Critical)  
**Duration:** <60 seconds

**Flow:**
```
1. User has seen 10 events
2. None resulted in purchases
3. System continues showing events normally
4. NO changes to:
   - Event frequency
   - Event priority
   - Educational content quality
   - Progress speed
5. NO messages like:
   - "Your snake needs equipment" ❌
   - "Upgrade to continue" ❌
   - "Limited time offer" ❌
6. Product mentions remain optional and contextual
```

**Validation:**
- ✅ Progress never blocked by purchase
- ✅ No pressure tactics
- ✅ Consistent experience regardless of spending
- ✅ Educational value maintained

**Anti-Patterns Tested:**
- ❌ Event gated behind purchase
- ❌ "Your snake is suffering without X"
- ❌ Urgency timers
- ❌ Multiple CTAs competing for attention

---

### Scenario 5: Email-Driven Re-Entry

**ID:** `S5.0-EMAIL-ENTRY`  
**Priority:** P1 (High)  
**Duration:** <60 seconds

**Flow:**
```
1. User receives email (sent by Worker on event trigger):
   Subject: "Your Ball Python has a new milestone"
   Body: "Your snake grew 2cm this week! Learn about growth patterns."
   Link: https://vinas8.github.io/catalog/game.html#user_hash&event=growth_001
2. User clicks link
3. App opens directly to that ONE event
4. Event displayed with educational content
5. User reads, marks complete
6. App shows: "All caught up! See you next time."
7. User closes app
```

**Validation:**
- ✅ Direct link to specific event
- ✅ ONE event resolved per click
- ✅ Clear completion state
- ✅ No dashboard/navigation required
- ✅ <60 seconds end-to-end

**KV Operations:**
- Read: `events:user_hash` (1 read, specific event)
- Write: `events:user_hash` (1 write, mark complete)

---

### Scenario 6: Failure Case (Educational, Not Punitive)

**ID:** `S6.0-FAILURE-EDUCATIONAL`  
**Priority:** P1 (High)  
**Duration:** <60 seconds

**Flow:**
```
1. User ignores app for 30 days
2. System generates "neglect outcome" event
3. User returns
4. Event shown:
   "Your Ball Python stopped eating"
5. EDUCATIONAL explanation (not guilt):
   "Snakes can survive months without food, but prolonged 
    neglect causes stress. In the wild, this happens during 
    droughts or cold seasons. Captive snakes need consistent 
    care."
6. Dex entry unlocked:
   "Fasting Behavior: Learn why snakes refuse food"
7. NO monetization pressure
8. Recovery path offered:
   "Start fresh with a new snake?" [Catalog]
   OR
   "Learn care basics first" [Tutorial]
```

**Validation:**
- ✅ Educational framing (WHY it happened)
- ✅ Dex entry reward (learning from failure)
- ✅ NO guilt or punishment language
- ✅ Clear recovery options
- ✅ NO forced purchase to recover
- ✅ <60 seconds to understand outcome

**KV Operations:**
- Read: `events:user_hash` (1 read)
- Write: `dex:user_hash` (1 write, unlock entry)
- Write: `events:user_hash` (1 write, log outcome)

---

## 🔄 PROPOSED SYSTEM: EVENT-DRIVEN CARE TUTORIAL

### Core Principles

1. **Event-Based, Not Time-Based**
   - Events fire on triggers (growth, shed, feeding time)
   - NOT on continuous decay
   - State changes are explicit

2. **Queue System**
   - Events queue in KV (`events:user_hash`)
   - Oldest shown first
   - No expiry (user can be absent indefinitely)

3. **One Event Per Session**
   - App shows ONLY one event at a time
   - Clear completion state
   - User never overwhelmed

4. **Educational First**
   - Primary content: snake biology/behavior
   - Secondary content: care recommendations
   - Tertiary content: products (optional)

5. **No Punitive Mechanics**
   - No death penalty
   - No stat decay requiring constant attention
   - Neglect outcomes are educational opportunities

### Event Types

**Growth Events:**
- "Your snake grew 2cm"
- "Your snake gained 50g"
- Educational: Growth patterns by age

**Biological Events:**
- "Entering shed cycle"
- "Shed completed"
- Educational: Shedding process

**Behavioral Events:**
- "Refused food (normal)"
- "Hiding more than usual"
- Educational: Natural behaviors

**Milestone Events:**
- "Reached breeding size"
- "First year complete"
- Educational: Life stages

**Care Reminder Events:**
- "Feeding window open"
- "Water should be refreshed"
- Educational: Hydration needs

**Failure Events (if extreme neglect):**
- "Snake stopped eating (educational)"
- Educational: Why captive animals need consistency

### Data Structure

**Event Schema:**
```json
{
  "event_id": "evt_growth_001",
  "user_id": "hash_abc123",
  "snake_id": "snake_001",
  "type": "growth",
  "title": "Your Ball Python grew 2cm",
  "description": "Snakes grow throughout their lives...",
  "educational_content": {
    "fact": "Ball Pythons grow fastest in first 3 years",
    "detail": "...",
    "dex_unlock": "growth_patterns"
  },
  "optional_products": [
    {
      "product_id": "prod_scale",
      "context": "Many keepers track growth with a digital scale",
      "link": "/catalog.html#prod_scale"
    }
  ],
  "created_at": "2025-12-28T21:00:00Z",
  "completed_at": null,
  "status": "pending"
}
```

**KV Storage:**
```
Key: events:user_hash
Value: Array of event objects (pending, oldest first)

Key: dex:user_hash  
Value: Object { unlocked_entries: [...] }

Key: tutorial_progress:user_hash
Value: { events_completed: 15, days_active: 8, ... }
```

---

## ⚠️ IMPLEMENTATION BLOCKER

### The Current System Must Change

**DECISION REQUIRED FROM USER:**

**Option A: Dual System (Complex)**
- Keep current real-time Tamagotchi
- Add new "Tutorial Mode" (separate system)
- User chooses mode on first load
- Two parallel state systems

**Option B: Replace System (Breaking Change)**
- Remove current Tamagotchi stat decay
- Replace with event-driven tutorial
- All existing LocalStorage state becomes invalid
- Cleaner architecture, single system

**Option C: Hybrid (Compromise)**
- Keep Tamagotchi for "active mode"
- Add tutorial as "learning mode"
- User can switch between modes
- Shared snake collection

**RECOMMENDATION:** Option B (Replace)
- Aligns with ethical commerce goal
- Simpler to maintain (one system)
- Better fits GitHub Pages + KV constraints
- Reduces player stress/pressure

---

## 📊 VALIDATION SUMMARY

| Requirement | Current System | Event Tutorial | Status |
|-------------|----------------|----------------|--------|
| <60 sec interaction | ❌ NO | ✅ YES | **Tutorial required** |
| Works if checked weekly | ❌ NO | ✅ YES | **Tutorial required** |
| No purchase required | ⚠️ Partial | ✅ YES | **Tutorial better** |
| Products secondary | ❌ NO | ✅ YES | **Tutorial required** |
| Event-driven state | ❌ NO | ✅ YES | **Tutorial required** |
| GitHub Pages compatible | ✅ YES | ✅ YES | **Both OK** |

**VERDICT:** Current Tamagotchi system fails 4 of 6 requirements. Event-driven tutorial required.

---

## 🎯 NEXT STEPS (PENDING USER DECISION)

1. **User decides:** Option A, B, or C?
2. **If Option B chosen:**
   - Create `.smri/scenarios/virtual-care-tutorial/` directory
   - Implement 6 scenarios as test files
   - Refactor `src/modules/game/` to event-driven model
   - Remove stat decay logic
   - Implement event queue system in KV
3. **If Option A or C chosen:**
   - Design mode switcher UI
   - Separate modules for each system
   - Ensure state isolation

---

**CRITICAL:** No code should be written until user confirms which option to pursue.

**Last Updated:** 2025-12-28T21:23:09Z
