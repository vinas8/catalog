# Tutorial: Failure Case (Educational)

**ID:** tutorial-failure-educational  
**SMRI Code:** S2-7.5,11.1.06 (Generated from constants)  
**Priority:** P1 (Important)  
**Module:** S2-7 (Game → Tutorial)  
**Dependencies:** S2-7 → S5 (Worker) → S11.1 (KV)  
**Duration:** <60 seconds  
**Status:** ✅ Required for MVP

---

## Overview

User abandons app for 30+ days. Snake enters "hibernation" state (educational metaphor). System explains what happened, why, and what to learn. NO shame, NO pressure. Dex entry unlocked. User can restart with new snake or continue.

---

## Module Dependency Chain

```
S2-7 (Tutorial)
  ↓
S5 (Worker - API endpoints)
  ↓
S11.1 (KV Storage - event history + snake state)
```

---

## Preconditions

- User has snake in collection
- User has not opened app in 30+ days
- Pending events exist from days 1, 3, 5, 10, 20, 30
- Snake has name (e.g., "Monty")
- Snake has species/morph data

---

## Test Flow

### Step 1: User Returns After 30+ Days
```
INPUT: https://vinas8.github.io/catalog/game.html#hash_abc123
TIME: Last visit 30+ days ago
EXPECT: Page loads, checks snake state
```

### Step 2: System Evaluates Absence
```
WORKER REQUEST:
GET /user-snake-status?user=hash_abc123

WORKER LOGIC:
last_visit = KV.get('last_visit:hash_abc123')
days_absent = (NOW - last_visit) / 86400

IF days_absent >= 30:
  snake_state = 'hibernation'  // Educational state
  create_hibernation_event()
  unlock_dex_entry('care_neglect_education')
ELSE:
  snake_state = 'active'
  return_oldest_pending_event()

RESPONSE: { 
  snake_state: 'hibernation',
  days_absent: 32,
  event_type: 'educational_outcome'
}
```

### Step 3: Display Educational Outcome
```
UI RENDERS:

┌─────────────────────────────────────────────┐
│ 🐍 Your Ball Python: Monty                  │
│ Status: Hibernation Mode                    │
│                                             │
│ After 30+ days without care check-ins,     │
│ Monty has entered a hibernation state.     │
│                                             │
│ 📚 What this teaches:                       │
│                                             │
│ In the wild, Ball Pythons can survive long │
│ periods without food, but captive snakes    │
│ rely on consistent care. Regular check-ins  │
│ help ensure:                                │
│                                             │
│ • Proper feeding schedule                  │
│ • Temperature/humidity maintenance         │
│ • Early detection of health issues         │
│ • Stress reduction through routine         │
│                                             │
│ Real keepers commit to:                    │
│ • Daily visual checks                      │
│ • Weekly deep habitat checks               │
│ • Consistent feeding schedule              │
│                                             │
│ 🔓 Dex Entry Unlocked:                     │
│    "Understanding Care Commitment"          │
│                                             │
│ ─────────────────────────────────────────  │
│                                             │
│ What would you like to do?                 │
│                                             │
│ [Start Fresh] [Continue with Monty]        │
│                                             │
└─────────────────────────────────────────────┘

VALIDATION:
- ✅ Educational tone (not shame)
- ✅ Explains real-world care needs
- ✅ Dex entry unlocked (reward for learning)
- ✅ User has choice (restart or continue)
- ✅ NO "your snake died" (not punitive)
- ✅ NO purchase prompts
- ✅ Clear explanation of what happened
```

### Step 4A: User Chooses "Start Fresh"
```
INPUT: Click [Start Fresh]

ACTION:
- Archive current snake (Monty) to dex
- State: "hibernation"
- User can choose new snake
- Start tutorial from beginning
- Keep dex progress

WORKER UPDATES KV:
Key: user_snakes:hash_abc123
- Monty: state = "archived_hibernation"
- Add new snake slot available

UI SHOWS: Snake selection screen
```

### Step 4B: User Chooses "Continue with Monty"
```
INPUT: Click [Continue with Monty]

ACTION:
- Monty state: hibernation → active
- Clear old pending events (30 days old)
- Create fresh "welcome back" event (educational)
- Resume tutorial

WORKER UPDATES KV:
Key: user_snakes:hash_abc123
- Monty: state = "active"
- Reset event queue with fresh start

UI SHOWS: Welcome back event (gentle, no guilt)
```

---

## Validation Checklist

- [x] **Educational, not punitive:** Explains care needs ✅
- [x] **Dex unlock:** Rewards learning ✅
- [x] **User choice:** Restart or continue ✅
- [x] **No shame:** No "you killed your snake" ✅
- [x] **No pressure:** No purchase prompts ✅
- [x] **Clear explanation:** User understands what happened ✅
- [x] **Real-world context:** Links to actual reptile care ✅

---

## Validation Questions (ANSWERED)

### 1. Works if checked weekly?
**YES** ✅
- Failure only after 30+ days (not 7)
- User has generous grace period
- Weekly checks keep snake active

### 2. ≤60 seconds interaction?
**YES** ✅
- Read explanation (~30s)
- Make choice (~5s)
- Total: ~35 seconds

### 3. No purchase required?
**YES** ✅
- Educational outcome free
- Restart free
- Continue free
- NO "buy to revive" mechanics

### 4. Products optional + contextual + secondary?
**YES** ✅
- NO product mentions in failure state
- Pure education
- Focus on learning

### 5. Deterministic events (no hidden timers)?
**YES** ✅
- Hibernation at exactly 30 days absence
- No hidden decay
- Predictable threshold

### 6. GitHub Pages + Cloudflare KV compatible?
**YES** ✅
- Static HTML/JS
- Worker calculates absence duration
- State stored in KV

---

## Success Criteria

**PASS if:**
1. Failure occurs at 30+ days (not sooner)
2. Educational tone (not shame/guilt)
3. Real-world care info provided (>100 words)
4. Dex entry unlocked (positive outcome)
5. User can restart OR continue
6. NO purchase prompts
7. NO "your snake died" language

**FAIL if:**
- Failure occurs <30 days
- Punitive tone ("You failed!", "Snake died")
- No educational content
- No dex unlock
- Forced restart (no continue option)
- Purchase prompt to "revive"
- Dark pattern mechanics

---

## Anti-Patterns to Avoid

❌ **Shame:** "You neglected your snake!"  
❌ **Death:** "Your snake died" (punitive)  
❌ **Pay-to-revive:** "Buy item to restore snake"  
❌ **Early failure:** Hibernation before 30 days  
❌ **No explanation:** Just "Snake unavailable"  
❌ **Forced restart:** Can't continue with same snake  
❌ **No learning:** Failure without education

---

## Dex Entry Content

**Title:** Understanding Care Commitment

**Unlocked by:** 30-day absence (educational outcome)

**Content:**
```
Ball Pythons in captivity require consistent care:

DAILY CHECKS:
• Visual health assessment
• Water bowl check
• Temperature spot-check

WEEKLY TASKS:
• Deep habitat inspection
• Spot-clean substrate
• Check heating elements

MONTHLY MAINTENANCE:
• Full substrate change
• Equipment deep clean
• Health records update

Real keepers understand:
This isn't a low-maintenance pet. Success 
comes from building care into your routine, 
not waiting for problems to appear.

Many first-time keepers underestimate the 
time commitment. If life gets busy, consider:
• Rehoming to experienced keeper
• Pet-sitting arrangements
• Care schedule reminders

You unlocked this through experience—now 
you know what real reptile care requires.
```

**Badge:** 🎓 Care Commitment Scholar

---

## KV Operations Summary

| Operation | Key | Type | Purpose |
|-----------|-----|------|---------|
| READ | `last_visit:hash_abc123` | Timestamp | Calculate absence |
| READ | `user_snakes:hash_abc123` | Object | Get snake state |
| WRITE | `user_snakes:hash_abc123` | Object | Update to hibernation |
| WRITE | `dex:hash_abc123` | Array | Unlock entry |
| WRITE | `events:hash_abc123` | Array | Clear old, add educational |

**Total:** 2 reads, 3 writes

---

## Edge Cases

### User returns after 60 days
- ✅ Same hibernation outcome
- ✅ Dex already unlocked (no duplicate)
- ✅ User can still restart or continue

### User has multiple snakes
- ✅ Each snake tracked independently
- ✅ Active snakes unaffected
- ✅ Can continue with active snake, restart with hibernated

### User restarts then abandons again
- ✅ New snake can also hibernate
- ✅ Dex entry already unlocked
- ✅ Educational message shorter (seen before)

### User continues but immediately abandons
- ✅ After another 30 days → hibernation again
- ✅ System patient, not punitive
- ✅ User always has choices

---

## Debug Page

**URL:** http://localhost:8000/debug/tutorial-failure-educational.html

**Test Steps:**
1. Set last_visit to 30+ days ago
2. Click "Run Test"
3. Verifies hibernation state triggered
4. Displays educational outcome
5. Check dex entry unlocked
6. Test "Start Fresh" button
7. Test "Continue" button
8. Verify both paths work

---

**Created:** 2025-12-29  
**Last Updated:** 2025-12-29T01:40:53Z  
**Status:** Ready for implementation  
**SMRI Code (Generated):** S2-7.5,11.1.06  
**Key Validation:** Educational failure, not punitive
