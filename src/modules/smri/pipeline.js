/**
 * SMRI Pipeline Steps
 * @version 0.7.7
 */

export const pipelineSteps = [
  { 
    id: 'catalog', 
    title: '1. Browse Catalog', 
    url: '../catalog.html', 
    icon: '🛒',
    description: 'Browse available snakes'
  },
  { 
    id: 'product', 
    title: '2. Select Product', 
    url: '../catalog.html', 
    icon: '🐍',
    description: 'Choose a snake to purchase'
  },
  { 
    id: 'checkout', 
    title: '3. Checkout (Stripe)', 
    url: null, 
    icon: '💳', 
    info: 'Opens Stripe Checkout',
    description: 'Complete payment'
  },
  { 
    id: 'success', 
    title: '4. Success Page', 
    url: '../success.html', 
    icon: '✅',
    description: 'Payment confirmation'
  },
  { 
    id: 'collection', 
    title: '5. View Collection', 
    url: '../collection.html', 
    icon: '📦',
    description: 'See purchased snakes'
  },
  { 
    id: 'game', 
    title: '6. Play Game', 
    url: '../game.html', 
    icon: '🎮',
    description: 'Care for your snakes'
  }
];
