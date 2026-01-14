# Demo Module

**SMRI:** S9.2,8,5.01  
**Version:** 0.7.7

## Overview

Unified interactive demo system with mobile-first split-screen layout for showcasing Snake Muffin workflows.

## Features

- ✅ **Mobile-first responsive** - Vertical on mobile, side-by-side on desktop
- ✅ **Step-by-step execution** - Navigate through scenarios with visual progress
- ✅ **Live browser preview** - Shows actual pages in iframe
- ✅ **Background API calls** - Execute imports, syncs, etc.
- ✅ **Auto-play mode** - Automatically advance through steps
- ✅ **Detailed logging** - Track all actions with timestamps
- ✅ **Status overlays** - Visual feedback on iframe

## Usage

### Basic Setup

```html
<div id="demo-root"></div>

<script type="module">
  import { Demo } from './src/modules/demo/index.js';

  const demo = new Demo({
    containerId: 'demo-root',
    scenarios: [ /* scenarios */ ]
  });

  demo.init();
</script>
```

### Scenario Format

```javascript
{
  icon: '🛒',
  title: 'Complete Purchase Flow',
  smri: 'S1.1,2,3,4,5.01',
  description: 'Import → Browse → Purchase → Game',
  steps: [
    {
      title: 'Import Products',
      description: 'Upload 5 snakes to Stripe & KV',
      api: {
        method: 'POST',
        url: '/upload-products',
        body: { products: [...] }
      }
    },
    {
      title: 'Browse Catalog',
      description: 'View available snakes',
      url: '/catalog.html'
    },
    {
      title: 'Custom Action',
      description: 'Execute custom logic',
      url: '/page.html',
      action: async (demo) => {
        demo.log('Doing something...', 'info');
        await demo.wait(1000);
      }
    }
  ]
}
```

### Step Types

**1. API Call**
```javascript
{
  title: 'Import Data',
  api: {
    method: 'POST',
    url: '/upload-products',
    body: { products: [...] }
  }
}
```

**2. Page Load**
```javascript
{
  title: 'Browse Catalog',
  url: '/catalog.html'
}
```

**3. Custom Action**
```javascript
{
  title: 'Custom Step',
  url: '/page.html',
  action: async (demo) => {
    demo.log('Message', 'info');
    await demo.wait(2000);
  }
}
```

**4. Combined**
```javascript
{
  title: 'Complex Step',
  url: '/page.html',
  api: { ... },
  action: async (demo) => { ... }
}
```

## Demo Methods

### Navigation
- `demo.goToStep(index)` - Jump to specific step
- `demo.nextStep()` - Advance to next step
- `demo.prevStep()` - Go back one step

### Auto-play
- `demo.toggleAutoPlay()` - Start/stop auto-advance
- `demo.autoPlayDelay` - Delay between steps (ms)

### Browser
- `demo.loadIframe(url)` - Load URL in preview
- `demo.reloadIframe()` - Refresh current page

### Status & Logging
- `demo.showStatus(message, type)` - Show overlay (`'info'`, `'executing'`, `'success'`, `'error'`)
- `demo.log(message, type)` - Add log entry

### Utilities
- `demo.wait(ms)` - Async sleep
- `demo.executeAPI(config)` - Execute API call

## Pre-built Scenarios

### 1. Purchase Flow (S1.1,2,3,4,5.01)
- Import products to Stripe & KV
- Browse catalog
- View snake details
- Add to cart
- Checkout with Stripe
- View in game

### 2. Game Tutorial (S2.7,5,5-1.01)
- Open game page
- Feed snake
- Give water
- Clean enclosure
- Check stats

### 3. Owner Dashboard (S6.1,4,5.01)
- Open admin
- Import CSV
- Manage KV storage
- View orders

## Mobile Responsiveness

**Mobile (<1024px):**
- Vertical layout (control panel on top)
- Control panel max-height: 50vh
- Browser panel fills remaining space

**Desktop (≥1024px):**
- Horizontal layout (side-by-side)
- Control panel: 400px fixed width
- Browser panel: flex-fill

## Files

```
src/modules/demo/
├── Demo.js          # Main component
└── index.js         # Facade export

demo.html            # Working example with 3 scenarios
```

## Example Usage

Visit **`/demo.html`** for a working implementation with:
- 🛒 Complete Purchase Flow
- 🎮 Game Tutorial
- 👔 Owner Dashboard

## API Reference

### Constructor Options

```javascript
{
  containerId: 'demo-root',        // Container element ID
  scenarios: [],                    // Array of scenario objects
  workerUrl: 'https://...',        // Worker API URL
  baseUrl: window.location.origin, // Base URL for relative paths
  autoPlayDelay: 3000              // Auto-play delay (ms)
}
```

## Styling

All styles are injected automatically. Custom CSS uses `.demo-*` prefixes to avoid conflicts.

## Browser Support

- Modern browsers (ES6 modules)
- Mobile Safari iOS 12+
- Chrome/Edge 80+
- Firefox 75+

## Future Enhancements

- [ ] Iframe interaction (click automation)
- [ ] Screenshot capture
- [ ] Video recording
- [ ] Scenario export/import
- [ ] Analytics tracking
