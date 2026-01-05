# S1.1,2,3,4,5.01 - Happy Path Purchase Flow

**Version:** 0.8.0  
**Module:** Shop (S1)  
**Status:** ⏳ Implementation Needed  
**Priority:** 🔥 Critical

---

## 📋 Overview

Complete end-to-end purchase flow for first-time user buying a single snake.

**User Story:** As a new customer, I want to browse the catalog, select a snake, purchase it via Stripe, and see it in my collection.

---

## 🎯 Test Scenario

### Setup
```javascript
// Clear test data
localStorage.clear();
sessionStorage.clear();
// Start on catalog page
window.location = '/catalog.html';
```

### Steps

**1. Browse Catalog (Module 1: Shop)**
- Load `/catalog.html`
- Wait for products to render
- Verify: At least 1 product card visible
- Verify: Each card has image, title, price, "Buy Now" button

**2. Select Product (Module 2: Product Detail)**
- Click first product card
- Modal opens with full details
- Verify: Morph name, price, species, genes
- Verify: "Checkout" button enabled

**3. Initiate Checkout (Module 3: Auth)**
- Click "Checkout" button
- If no user hash → Generate anonymous user
- Verify: `userHash` stored in localStorage
- Redirect to Stripe Checkout

**4. Complete Payment (Module 4: Payment)**
- Stripe Checkout session created
- Payment successful (test mode)
- Webhook fires: `checkout.session.completed`
- Product assigned to user in KV

**5. Success Page (Module 5: Confirmation)**
- Redirect to `/success.html?session_id={id}`
- Fetch session details from Worker
- Display purchased snake info
- Link to collection page

**6. View Collection**
- Navigate to `/collection.html`
- Load user products from KV
- Verify: Purchased snake appears
- Verify: Correct morph, price, purchase date

---

## ✅ Success Criteria

- [ ] Catalog loads with products from KV
- [ ] Product modal shows complete details
- [ ] Anonymous user hash generated
- [ ] Stripe session created successfully
- [ ] Webhook assigns product to user
- [ ] Success page shows correct product
- [ ] Collection displays purchased snake

---

## 🔧 Implementation

### Files to Create/Modify

**Test File:** `/tests/smri/S1-happy-path-purchase.test.js`
```javascript
import { test, expect } from '@playwright/test';

test('S1: Happy Path Purchase Flow', async ({ page }) => {
  // 1. Browse Catalog
  await page.goto('/catalog.html');
  await page.waitForSelector('.snake-card');
  const cards = await page.$$('.snake-card');
  expect(cards.length).toBeGreaterThan(0);
  
  // 2. Select Product
  await cards[0].click();
  await page.waitForSelector('.modal-content');
  const modalTitle = await page.textContent('.modal-title');
  expect(modalTitle).toBeTruthy();
  
  // 3. Checkout
  await page.click('button:has-text("Checkout")');
  await page.waitForURL(/stripe\.com/);
  
  // 4. Payment (test mode auto-complete)
  // Stripe test cards: 4242 4242 4242 4242
  // This step requires Stripe test mode configuration
  
  // 5. Success Page
  await page.waitForURL(/success\.html/);
  const successMessage = await page.textContent('.success-message');
  expect(successMessage).toContain('Thank you');
  
  // 6. Collection
  await page.click('a:has-text("View Collection")');
  await page.waitForSelector('.collection-item');
  const items = await page.$$('.collection-item');
  expect(items.length).toBe(1);
});
```

**Scenario Page:** `/debug/smri-s1-happy-path.html`
```html
<!DOCTYPE html>
<html>
<head>
  <title>SMRI S1: Happy Path Purchase</title>
  <script type="module">
    import { runScenario } from './modules/scenario-runner.js';
    
    const scenario = {
      id: 'S1.1,2,3,4,5.01',
      title: 'Happy Path Purchase Flow',
      steps: [
        { action: 'load', url: '/catalog.html', verify: '.snake-card' },
        { action: 'click', selector: '.snake-card:first-child' },
        { action: 'wait', selector: '.modal-content' },
        { action: 'click', selector: 'button:has-text("Checkout")' },
        { action: 'verify', condition: 'localStorage.userHash exists' },
        { action: 'complete', message: 'Stripe checkout initiated' }
      ]
    };
    
    runScenario(scenario);
  </script>
</head>
<body>
  <h1>🛒 S1: Happy Path Purchase Flow</h1>
  <div id="scenario-output"></div>
</body>
</html>
```

---

## 📊 Modules Tested

- ✅ **S1 (Shop):** Catalog rendering, product selection
- ✅ **S2 (Game):** N/A for purchase flow
- ✅ **S3 (Auth):** Anonymous user creation
- ✅ **S4 (Payment):** Stripe session, webhook handling
- ✅ **S5 (Worker):** KV product assignment, success API

---

## 🔗 Related Scenarios

- S1.1,2,3,4.01 - Returning user purchase
- S1.1.01 - Product availability check
- S1.1,2.02 - Buy 5 different snakes

---

## 📝 Notes

**Current Status:** Scenario defined, needs implementation in test suite.

**Test Type:** E2E (requires Playwright)

**Estimated Completion:** 2-3 hours

**Dependencies:**
- Stripe test mode configured
- Worker deployed with webhook
- KV namespace populated with products

---

**Created:** 2026-01-05  
**Last Updated:** 2026-01-05  
**Status:** Ready for implementation
