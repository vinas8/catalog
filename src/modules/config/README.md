# Config Module

**SMRI:** S0.5.01  
**Version:** 0.7.7

## Overview

Configuration management module for feature flags and app settings.

## Features

- ✅ **Feature Flags** - Enable/disable features globally
- ✅ **Centralized Config** - Single source of configuration
- ✅ **Easy Toggle** - Simple boolean flags

## Usage

```javascript
import { FEATURE_FLAGS } from './src/modules/config/index.js';

if (FEATURE_FLAGS.ENABLE_BREEDING) {
  // Show breeding UI
}
```

## Available Flags

```javascript
{
  ENABLE_SHOP: true,        // Shop/catalog features
  ENABLE_BREEDING: true,    // Breeding calculator
  ENABLE_GENETICS: true,    // Genetics system
  ENABLE_MORPHS: true,      // Morph database
  ENABLE_CATALOG: true,     // Product catalog
  ENABLE_DEBUG: true,       // Debug tools
  ENABLE_ANALYTICS: false   // Analytics tracking
}
```

## Files

```
src/modules/config/
├── feature-flags.js  # Feature toggle definitions
├── index.js          # Facade export
└── README.md         # Documentation
```

## Module Control

Set `ENABLED = false` in `index.js` to disable entire module.
