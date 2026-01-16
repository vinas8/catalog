# Cart Implementation - Demo Purchase Flow

## Status: IN PROGRESS

## What's Been Done ✅

1. **Cart Module** (`src/modules/cart/`)
   - `Cart.js` - Core cart logic with checkout() method
   - `CartUI.js` - UI component for cart display
   - `index.js` - Facade with addToCart(), showCartPopup(), getCart()

2. **Checkout Method Added**
   - `Cart.checkout(userHash)` creates Stripe session via Worker API
   - POST to `/create-checkout` with cart items
   - Returns Stripe checkout URL
   - Saves user_hash to localStorage

3. **Facade Functions**
   - `addToCart(product)` - Adds product, shows popup notification
   - `showCartPopup(message, type)` - Shows temporary notification
   - `updateCartBadge()` - Updates cart count badge
   - `initCartUI(options)` - Initialize cart UI component

4. **Styles Added** (partial)
   - Cart popup notification styles
   - Cart badge styles

## What's Needed ❌

### 1. Update catalog.html Demo Buy Button
Replace current demo button with cart add:

```javascript
// OLD (localStorage hack):
<button onclick="localStorage.setItem(...)">Demo Buy</button>

// NEW (cart + Stripe):
<button onclick="
  import('./src/modules/cart/index.js').then(({addToCart}) => {
    addToCart(JSON.parse(this.getAttribute('data-product')));
  })
">🛒 Add to Cart</button>
```

### 2. Add Cart UI to Catalog Page
In `catalog.html`, add:

```html
<!-- Cart sidebar/modal -->
<div id="cart-container"></div>

<script type="module">
import { initCartUI, getCart } from './src/modules/cart/index.js';

// Initialize cart UI
const cartUI = initCartUI({ containerId: 'cart-container' });
cartUI.render();

// Make global for onclick handlers
window.cartUI = cartUI;
window.getCart = getCart;
</script>
```

### 3. Add Checkout Button Handler
In cart UI or catalog page:

```javascript
async function checkout() {
  const cart = getCart();
  const userHash = localStorage.getItem('serpent_user_hash') || 
                   'demo_' + Date.now();
  
  try {
    const checkoutUrl = await cart.checkout(userHash);
    window.location.href = checkoutUrl; // Redirect to Stripe
  } catch (err) {
    showCartPopup('Checkout failed: ' + err.message, 'error');
  }
}
```

### 4. Worker API Endpoint
Need `/create-checkout` endpoint in Cloudflare Worker:

```javascript
// worker/index.js
case '/create-checkout':
  const { items, user_hash } = await request.json();
  
  // Create Stripe checkout session with multiple line items
  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: items.map(item => ({
      price_data: {
        currency: 'eur',
        product_data: { name: item.name },
        unit_amount: Math.round(item.price * 100)
      },
      quantity: 1
    })),
    success_url: `${SITE_URL}/success.html`,
    cancel_url: `${SITE_URL}/catalog.html`,
    client_reference_id: user_hash,
    metadata: { user_hash }
  });
  
  return json({ url: session.url });
```

### 5. Update Demo Flow
In `demo-isolated-test.html`:

**Step 2 - Simulate Purchase:**
```javascript
{
  title: 'Add to Cart & Checkout',
  description: 'Click "Add to Cart" then checkout via Stripe test mode',
  content: `
    <iframe src="/catalog.html?source=demo_first_purchase"></iframe>
    <p>1. Click "🛒 Add to Cart" on a snake</p>
    <p>2. Click cart icon to view cart</p>
    <p>3. Click "Checkout" button</p>
    <p>4. Complete Stripe checkout (use test card: 4242...)</p>
  `
}
```

### 6. Register in SMRI
Update `src/config/smri/module-functions.js`:

```javascript
{
  ref: 'S1.3,4.01',
  module: 'cart',
  functions: {
    addToCart: 'Add product to cart and show notification',
    showCartPopup: 'Show temporary notification popup',
    getCart: 'Get cart singleton instance',
    checkout: 'Create Stripe checkout session for cart'
  }
}
```

### 7. Clear TIMEOUTS Error
Add version busters to all module imports or use different constant names.

## Testing Flow

1. Load demo: http://localhost:8000/demo-isolated-test.html
2. Click Start Demo (imports 3 snakes)
3. Step 1: Browse catalog iframe
4. Click "🛒 Add to Cart" on Demo Banana snake
5. See popup: "✅ Added Demo Banana to cart"
6. Click cart badge/icon to open cart
7. See cart with 1 item, €350
8. Click "Checkout" button
9. Redirect to Stripe checkout page
10. Fill in test card: 4242 4242 4242 4242
11. Complete payment
12. Webhook updates KV with purchase
13. Redirect to success.html
14. Success page shows purchased snake
15. Click "View in Game"
16. Game loads snake from KV

## Notes

- Remove all localStorage demo hacks (demo_last_purchase, etc.)
- Use real Stripe flow even for demos (test mode)
- Cart persists in localStorage
- Clear cart after successful checkout (webhook or success page)
- Add cart icon with badge to navigation
- Make cart UI modal/sidebar (not inline)
