# S1.1,2.03 - Buy Same Morph Twice

**Version:** 0.8.0  
**Module:** Shop (S1)  
**Status:** ⏳ Implementation Needed  
**Priority:** 🔥 Medium

---

## 📋 Overview

Edge case: User purchases the same morph twice to build breeding pairs.

**User Story:** As a breeder, I want to buy two Banana Ball Pythons (male/female) for breeding projects.

---

## 🎯 Test Scenario

### Setup
```javascript
// Ensure catalog has 2+ of same morph available
const mockProducts = [
  { id: 'banana_001', morph: 'Banana', sex: 'Male', available: true },
  { id: 'banana_002', morph: 'Banana', sex: 'Female', available: true }
];
```

### Steps

**1. Purchase First Banana**
- Buy `banana_001` (Male)
- Collection: 1 Banana (Male)

**2. Purchase Second Banana**
- Return to catalog
- Same "Banana" product appears (different individual)
- Buy `banana_002` (Female)
- Collection: 2 Bananas (Male + Female)

**3. Verify Distinction**
- Both show in collection
- Unique IDs prevent conflicts
- Display shows: "Banana #1", "Banana #2"
- Or: "Banana (Male)", "Banana (Female)"

---

## ✅ Success Criteria

- [ ] Can buy same morph multiple times
- [ ] Each purchase gets unique ID
- [ ] Collection distinguishes duplicates
- [ ] No data overwrite
- [ ] Breeding calculator recognizes pair

---

## 🔧 Implementation

```javascript
// /tests/smri/S1-duplicate-morph.test.js
test('S1: Buy Same Morph Twice', async ({ page }) => {
  // First purchase
  await page.goto('/catalog.html');
  await page.click('.snake-card:has-text("Banana"):first');
  await page.click('button:has-text("Checkout")');
  await mockStripeSuccess(page);
  
  // Second purchase (same morph)
  await page.goto('/catalog.html');
  await page.click('.snake-card:has-text("Banana"):nth(1)');
  await page.click('button:has-text("Checkout")');
  await mockStripeSuccess(page);
  
  // Verify collection
  await page.goto('/collection.html');
  const bananas = await page.$$('.collection-item:has-text("Banana")');
  expect(bananas.length).toBe(2);
  
  // Check unique IDs
  const ids = await page.$$eval('.collection-item', 
    els => els.map(el => el.dataset.snakeId));
  expect(ids[0]).not.toBe(ids[1]);
});
```

### Product Structure
```json
{
  "id": "banana_001",
  "morph": "Banana",
  "sex": "Male",
  "individual_id": "BAN-M-001",
  "price": 15000
}
```

---

## 🔗 Related Scenarios

- S1.1,2.02 - Buy 5 different snakes
- S2.2.08 - Breeding compatibility check

---

**Created:** 2026-01-05  
**Status:** Ready for implementation
