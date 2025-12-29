# Tutorial: Email-Driven Re-entry

**ID:** tutorial-email-reentry  
**SMRI Code:** S2-7.5,11.1.05 (Generated from constants)  
**Priority:** P1 (Important)  
**Module:** S2-7 (Game → Tutorial)  
**Dependencies:** S2-7 → S5 (Worker) → S11.1 (KV)  
**Duration:** <60 seconds  
**Status:** ⚠️ Future enhancement (email system needed)

---

## Overview

User receives email notification about pending event. Clicks link in email. Opens game directly to specific event. Marks complete. Closes app. Email-driven engagement, not app-driven nagging.

---

## Module Dependency Chain

```
S2-7 (Tutorial)
  ↓
S5 (Worker - API endpoints + email trigger)
  ↓
S11.1 (KV Storage - event queue)
  ↓
(Email service - external, TBD)
```

**Note:** Email service not yet implemented. This scenario defines requirements.

---

## Preconditions

- User has pending event (created 24+ hours ago)
- User has not opened app in 24 hours
- User has email notifications enabled
- Email service configured (SendGrid/Mailgun/Resend)
- Event worthy of notification (not every event)

---

## Test Flow

### Step 1: Event Becomes Notification-Worthy
```
WORKER CRON JOB (runs hourly):
SELECT * FROM events 
WHERE status = 'pending' 
AND created_at < NOW() - INTERVAL 24 hours
AND notification_sent = false

FOR EACH pending_event:
  IF user_has_email AND email_enabled:
    - Generate notification URL
    - Send email
    - Mark notification_sent = true
```

### Step 2: User Receives Email
```
EMAIL CONTENT:

Subject: 🐍 Your Ball Python: New Care Reminder

Hi there,

You have a new care reminder for your Ball Python:

🍽️ Feeding Schedule Update

Ball Pythons typically eat every 7-10 days as adults...

[View Reminder →]
(Link: https://vinas8.github.io/catalog/game.html#hash_abc123&event=evt_feed_002)

---

You can adjust email preferences anytime in the app settings.

VALIDATION:
- ✅ One event per email (not a list)
- ✅ Educational preview in email
- ✅ Clear call-to-action
- ✅ Unsubscribe link present
- ✅ No urgency language
- ✅ Plain text + HTML versions
```

### Step 3: User Clicks Email Link
```
INPUT: Click [View Reminder →]

URL: https://vinas8.github.io/catalog/game.html#hash_abc123&event=evt_feed_002

GAME.HTML LOADS:
- Parses URL params
- Extracts user hash (hash_abc123)
- Extracts event ID (evt_feed_002)
- Fetches that specific event from Worker
- Displays event card immediately
- NO intermediate screens
- NO "welcome back" messages
```

### Step 4: Display Event (Direct)
```
UI RENDERS:

┌─────────────────────────────────────────────┐
│ 🍽️ Feeding Schedule Update                 │
│                                             │
│ Ball Pythons typically eat every 7-10 days  │
│ as adults. Younger snakes eat more          │
│ frequently (every 5-7 days).                │
│                                             │
│ 📚 Did you know?                            │
│ Consistent feeding schedule helps maintain  │
│ healthy weight and reduces stress.          │
│                                             │
│ [✓ Mark as Read]                            │
└─────────────────────────────────────────────┘

VALIDATION:
- ✅ Specific event loaded (not generic landing)
- ✅ Same UX as normal app visit
- ✅ NO "You came from email!" message
- ✅ NO tracking visible to user
```

### Step 5: User Completes and Exits
```
INPUT: Click [✓ Mark as Read]

ACTION:
POST /complete-event
Body: { 
  user: "hash_abc123", 
  event_id: "evt_feed_002",
  source: "email"  // Analytics only
}

WORKER UPDATES KV:
Key: events:hash_abc123
- Set evt_feed_002.status = "complete"
- Set evt_feed_002.completed_via = "email"

RESPONSE: { success: true }

UI SHOWS: "✅ Got it! See you next time."

USER CLOSES APP: Done. No further prompts.
```

---

## Validation Checklist

- [x] **Email sent for specific event:** Not generic ✅
- [x] **Direct link to event:** No landing page ✅
- [x] **<60 seconds:** Email click → complete = ~30s ✅
- [x] **No nagging:** One email, not daily ✅
- [x] **Unsubscribe present:** User can opt out ✅
- [x] **Same UX:** Email vs app opening identical ✅
- [x] **Educational preview:** Email has value alone ✅

---

## Validation Questions (ANSWERED)

### 1. Works if checked weekly?
**YES** ✅
- Email sent after 24 hours missed
- User can ignore email, open app later
- No penalties

### 2. ≤60 seconds interaction?
**YES** ✅
- Email click → event load → mark complete
- Total: ~30 seconds

### 3. No purchase required?
**YES** ✅
- Email notifications don't mention products
- Event completable without buying

### 4. Products optional + contextual + secondary?
**YES** ✅
- Email contains pure education
- NO product links in email
- Products only in-app (if event has them)

### 5. Deterministic events (no hidden timers)?
**YES** ✅
- Email sent at fixed threshold (24 hours)
- No escalating frequency
- User can disable

### 6. GitHub Pages + Cloudflare KV compatible?
**YES** ✅
- Worker triggers email via API
- Static game.html receives deep link
- No server-side session needed

---

## Success Criteria

**PASS if:**
1. Email sent for specific event (not generic)
2. Email link opens directly to that event
3. Event displayed without intermediate screens
4. User can complete in <60 seconds
5. Unsubscribe link present and working
6. Email has educational value (readable preview)
7. No daily nagging (max 1 email per 24-48 hours)

**FAIL if:**
- Email lists multiple events (overwhelming)
- Link opens to homepage (not direct)
- Email sent daily (nagging)
- No unsubscribe option
- Email pressures purchase
- Multiple emails per day

---

## Anti-Patterns to Avoid

❌ **Daily emails:** Sending every 24 hours  
❌ **Generic links:** "You have 5 pending events"  
❌ **Urgency:** "Complete within 24 hours!"  
❌ **Product promotion:** "Special offer in email"  
❌ **Nagging:** "You haven't checked in 3 days"  
❌ **Multiple emails:** Morning + evening reminders  
❌ **No unsubscribe:** Forcing email notifications

---

## Email Frequency Rules

**Maximum frequency:**
- 1 email per 24 hours (minimum gap)
- Only if pending event exists
- Only if user hasn't opened app

**Smart throttling:**
- If user opens app → cancel scheduled email
- If user marks event complete → cancel email
- If user ignores 3 emails → reduce frequency

**User control:**
- Settings: Email notifications ON/OFF
- Frequency: Daily / Every 3 days / Weekly / Never
- Event types: All / Important only / None

---

## Email Service Requirements

**Providers (choose one):**
- Resend (modern, developer-friendly)
- SendGrid (established, reliable)
- Mailgun (good deliverability)

**Must support:**
- Transactional emails (not marketing)
- HTML + plain text versions
- Unsubscribe link automatic
- Bounce/complaint handling
- Webhook for delivery status

**Cost estimate:**
- Free tier: 1,000-3,000 emails/month
- Paid: $10-15/month for 10,000 emails

---

## KV Operations Summary

| Operation | Key | Type | Purpose |
|-----------|-----|------|---------|
| READ | `events:hash_abc123` | Array | Fetch specific event by ID |
| WRITE | `events:hash_abc123` | Array | Mark complete, track source |
| WRITE | `email_log:hash_abc123` | Array | Log email sent (throttling) |

**Total:** 1 read, 2 writes

---

## Edge Cases

### User clicks old email link (event already complete)
- ✅ Show "Already completed!" message
- ✅ Display next pending event
- ✅ NO error page

### User has email disabled but event pending
- ✅ NO email sent
- ✅ Event remains pending
- ✅ User sees on next app visit

### Email delivery fails (bounced)
- ✅ Worker retries once after 1 hour
- ✅ If fails again, mark email_failed = true
- ✅ Don't retry indefinitely

### User opens app before email sends
- ✅ Cancel scheduled email
- ✅ User already engaged
- ✅ No redundant notification

---

## Debug Page

**URL:** http://localhost:8000/debug/tutorial-email-reentry.html

**Test Steps:**
1. Set pending event created 24 hours ago
2. Click "Simulate Email Sent"
3. Click "User Clicks Email Link"
4. Verifies game loads with event_id param
5. Displays specific event immediately
6. Click "Mark as Read"
7. Verifies completion tracked with source="email"

---

**Created:** 2025-12-29  
**Last Updated:** 2025-12-29T01:40:53Z  
**Status:** ⚠️ Future enhancement (requires email service)  
**SMRI Code (Generated):** S2-7.5,11.1.05  
**Dependencies:** Email service (SendGrid/Resend/Mailgun)
