# Product URL Structure

## Implementation

✅ **Created:**
- `/product.html` - Product page template
- `/catalog-router.html` - URL router (for static hosting)

## URL Structure

```
/[locale]/catalog/[species]/[morph]/[name]
```

### Examples

```
/en/catalog/ball-pythons/banana-clown/pudding
/en/catalog/ball-pythons/super-mojave/taohu
/en/catalog/corn-snakes/bloodred/charlie
/lt/catalog/ball-pythons/banana-clown/pudding (Lithuanian)
```

### Browsing Hierarchy

```
/en/catalog                              ← All products
/en/catalog/ball-pythons                 ← Filter: Ball Pythons
/en/catalog/ball-pythons/banana-clown    ← Filter: Banana Clowns
/en/catalog/ball-pythons/banana-clown/pudding ← Individual snake
```

## How It Works

### For Static Hosting (GitHub Pages, Cloudflare Pages)

1. Create symlinks or use router:
   ```bash
   # Create directory structure
   mkdir -p en/catalog/ball-pythons/banana-clown
   ln -s ../../../../product.html en/catalog/ball-pythons/banana-clown/pudding.html
   ```

2. Or use 404 redirect:
   - Configure hosting to redirect 404 → `/product.html`
   - Product page parses `window.location.pathname`

### For Dynamic Hosting (Cloudflare Workers)

```javascript
// worker.js
export default {
  async fetch(request) {
    const url = new URL(request.url);
    const path = url.pathname;
    
    // Match: /[locale]/catalog/[species]/[morph]/[name]
    const match = path.match(/^\/(\w+)\/catalog\/([\w-]+)\/([\w-]+)\/([\w-]+)$/);
    
    if (match) {
      const [_, locale, species, morph, name] = match;
      
      // Fetch product.html and inject data
      const html = await fetch('https://yoursite.com/product.html');
      return new Response(html.body, {
        headers: { 'Content-Type': 'text/html' }
      });
    }
    
    // Default behavior
    return fetch(request);
  }
};
```

## SEO Benefits

✅ **Unique URLs per product**
- Each snake has its own URL
- Shareable links
- Indexable by search engines

✅ **Breadcrumb navigation**
- Clear hierarchy
- Good UX and SEO

✅ **Meta tags**
- Dynamic title, description, OG tags
- Optimized for social sharing

## Usage in Code

### Generate Product URL

```javascript
function getProductURL(product, locale = 'en') {
  const species = product.species.replace('_', '-');
  const morph = product.morph.toLowerCase().replace(/\s+/g, '-');
  const name = product.name.toLowerCase().replace(/\s+/g, '-');
  
  return `/${locale}/catalog/${species}/${morph}/${name}`;
}

// Example
const pudding = {
  name: 'Pudding',
  species: 'ball_python',
  morph: 'Banana H. Clown'
};

const url = getProductURL(pudding);
// → /en/catalog/ball-pythons/banana-h-clown/pudding
```

### Link from Catalog

```html
<!-- OLD (modal) -->
<button onclick="openModal(product)">View Details</button>

<!-- NEW (product page) -->
<a href="/en/catalog/ball-pythons/banana-clown/pudding">View Details</a>
```

## Migration Path

1. **Phase 1:** Add product pages alongside modals
2. **Phase 2:** Update catalog to link to product pages
3. **Phase 3:** Remove modal (or keep as quick preview)

## Testing

### Static Hosting Test
```bash
# Test URL manually
open http://localhost:8000/product.html#/en/catalog/ball-pythons/banana-clown/pudding
```

### With Actual Products
1. Import CSV with modular import
2. Products get stored in KV
3. Visit: `/en/catalog/ball-pythons/banana-clown/pudding`
4. Page fetches from KV, renders product

## Cloudflare Pages Config

Add to `_redirects` file:
```
/*/catalog/*  /product.html  200
```

Or in Worker:
```javascript
// Match locale catalog URLs
if (pathname.match(/^\/\w+\/catalog\//)) {
  return env.ASSETS.fetch(new Request('https://yoursite.com/product.html'));
}
```
