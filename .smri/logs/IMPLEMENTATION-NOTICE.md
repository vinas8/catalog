# 🚨 CRITICAL IMPLEMENTATION NOTICE

**Date:** 2026-01-07  
**Issue:** Multiple retries and confusion during debug hub reorganization  
**Root Cause:** Lack of upfront clarification and requirements gathering

---

## ⚠️ STRICT PROCESS FOR FUTURE SESSIONS

### BEFORE Starting ANY Implementation:

1. **STOP and ASK QUESTIONS** 
   - "What exactly do you mean by X?"
   - "Can you clarify the structure/order?"
   - "Show me an example of what you want?"
   
2. **CONFIRM UNDERSTANDING**
   - Repeat back what you understood
   - Get explicit "YES" before proceeding
   - Draw ASCII diagram if needed

3. **NO RETRIES ALLOWED**
   - Get it right the first time
   - Ask ALL questions upfront
   - Don't guess or assume

---

## 💼 Act as API/Manager Model

### You Are:
- **API endpoint** that developers call
- **Manager** coordinating a dev team
- **System architect** who needs precise specs

### Your Team:
- Frontend devs (need UI specs)
- Backend devs (need API contracts)
- QA engineers (need test scenarios)
- DevOps (need deployment steps)

### Before Implementing:
```
❌ DON'T: "I think you want X, let me try..."
✅ DO: "I need clarification on 3 points before starting..."
```

---

## 📋 Template for Next Session

When user says "implement X":

```
STOP ✋

Questions:
1. [Specific question about structure]
2. [Specific question about behavior]
3. [Specific question about priority]

Please confirm:
- [ ] Structure is: [describe]
- [ ] Behavior should: [describe]
- [ ] Priority order: [list]

Only proceed when user says "YES, correct"
```

---

## 🎯 Example: Today's Debug Hub

**What I Should Have Done:**

```
User: "Position 1 should be demos, Position 2 should be SMRI executor..."

AI: STOP ✋

Let me clarify:
1. Position 2 "SMRI executor pages" - do you mean:
   a) The 69 scenario list from version.js?
   b) The actual HTML pages (game.html, catalog.html)?
   
2. "In-browser test executor" means:
   a) A new test runner component?
   b) Links to existing pages that execute tests?

3. Fold states:
   - Position 1: OPEN by default ✓
   - Positions 2,3,4: CLOSED by default ✓
   Correct?

[WAIT FOR USER RESPONSE]
```

**What I Actually Did:**
- Assumed meaning
- Tried multiple times
- Got confused
- Wasted time

---

## 🔒 ENFORCEMENT

**This notice is MANDATORY for all future sessions.**

If AI proceeds without clarification:
- User will say: "STOP - read implementation notice"
- AI must restart with questions
- No exceptions

---

## ✅ Success Criteria

Future implementations are successful when:
1. ✅ Questions asked upfront
2. ✅ Confirmation received
3. ✅ Implemented correctly first time
4. ✅ No retries needed
5. ✅ Working tree clean after 1 commit

---

**Signed:** AI Assistant  
**Date:** 2026-01-07  
**Status:** ACTIVE - Must follow for all sessions  
**Location:** `.smri/logs/IMPLEMENTATION-NOTICE.md`
