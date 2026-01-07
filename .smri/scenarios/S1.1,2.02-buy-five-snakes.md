# S1.1,2.02 - Buy Five Different Snakes

**Version:** 0.8.0  
**Module:** Shop (S1)  
**Status:** ⏳ Implementation Needed  
**Priority:** 🔥 Medium

---

## 📋 Overview

Bulk purchase scenario: User buys 5 different snakes in sequence.

**User Story:** As a collector, I want to purchase multiple snakes and see them all in my collection.

---

## 🎯 Test Scenario

### Setup
```javascript
// Start fresh
localStorage.clear();
// Ensure KV has at least 5 different products
```

### Steps

**1. Purchase Snake #1**
- Load catalog
- Buy first snake (e.g., Banana)
- Complete Stripe checkout
- Verify collection: 1 item

**2. Purchase Snake #2**
- Return to catalog
- Buy second snake (e.g., Piebald)
- Complete checkout
- Verify collection: 2 items

**3. Repeat for Snakes #3, #4, #5**
- Different morphs each time
- Collection grows: 3, 4, 5 items

**4. Final Verification**
- Open `/collection.html`
- All 5 snakes visible
- Each has unique morph name
- All purchase dates recorded
- Total spent calculated

---

## ✅ Success Criteria

- [ ] Can purchase 5 times without error
- [ ] Collection shows all 5 snakes
- [ ] Each snake has unique ID
- [ ] Purchase dates in chronological order
- [ ] Total cost adds up correctly
- [ ] No duplicate IDs

---

## 🔧 Implementation

```javascript
// /tests/smri/S1-buy-five-snakes.test.js
test('S1: Buy 5 Different Snakes', async ({ page, context }) => {
  const morphs = ['Banana', 'Piebald', 'Albino', 'Pastel', 'Mojave'];
  
  for (let i = 0; i < 5; i++) {
    // Buy snake
    await page.goto('/catalog.html');
    await page.click(`.snake-card:has-text("${morphs[i]}")`);
    await page.click('button:has-text("Checkout")');
    
    // Mock Stripe success
    await mockStripeSuccess(page);
    
    // Verify collection count
    await page.goto('/collection.html');
    const items = await page.$$('.collection-item');
    expect(items.length).toBe(i + 1);
  }
  
  // Final check
  const finalItems = await page.$$('.collection-item');
  expect(finalItems.length).toBe(5);
  
  // Verify uniqueness
  const morphNames = await page.$$eval('.collection-item .morph-name', 
    els => els.map(el => el.textContent));
  const unique = new Set(morphNames);
  expect(unique.size).toBe(5);
});
```

---

## 🔗 Related Scenarios

- S1.1,2,3,4,5.01 - Happy path (single purchase)
- S2.2,5-1.04 - Game with 20 snakes (stress test)

---

**Created:** 2026-01-05  
**Status:** Ready for implementation
