# S2-tutorial-missed-care - Tutorial Abandonment Scenario

**SMRI:** S2-tutorial-missed-care  
**Module:** S2 (Game)  
**Priority:** P1 (High)  
**Duration:** <30 seconds  
**Dependencies:** S2 → S5 (Worker) → Cloudflare-KV

## Description

Tests the scenario where a user starts the tutorial but doesn't complete it. System should handle graceful degradation and re-entry.

## Test Steps

1. User opens tutorial page
2. User views event card
3. User closes page without marking complete
4. Check event status remains "incomplete" in KV
5. User returns later and sees same event

## Expected Outcomes

1. Event status persists as "incomplete"
2. No data loss occurs
3. User can resume from same step
4. No error messages displayed
5. Tutorial state saved correctly

## Success Criteria

- ✅ Incomplete events persist in KV
- ✅ No data corruption
- ✅ User can re-enter tutorial
- ✅ Progress tracked correctly

## Test Data

```javascript
{
  eventId: "daily-checkin-001",
  completed: false,
  lastViewed: "2025-12-29T02:00:00Z",
  attempts: 1
}
```

## Related Scenarios

- S2-tutorial-happy-path (success path)
- S2-tutorial-email-reentry (email reminder path)
