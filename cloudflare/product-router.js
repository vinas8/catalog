/**
 * Cloudflare Worker for Clean Product URLs
 * Handles: /[locale]/catalog/[species]/[morph]/[name]
 */

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;
    
    // Match catalog URLs: /[locale]/catalog/...
    const catalogMatch = path.match(/^\/(\w{2})\/catalog(\/.*)?$/);
    
    if (catalogMatch) {
      const [_, locale, rest] = catalogMatch;
      const parts = (rest || '').split('/').filter(p => p);
      
      // /en/catalog/ball-pythons/banana-clown/pudding → product page
      if (parts.length === 3) {
        const [species, morph, name] = parts;
        
        // Fetch product.html and serve it
        const productUrl = new URL('/product.html', request.url);
        productUrl.searchParams.set('url', path);
        
        const response = await env.ASSETS.fetch(productUrl);
        
        // Return with clean URL (no redirect)
        return new Response(response.body, {
          status: 200,
          headers: {
            'Content-Type': 'text/html',
            'Cache-Control': 'public, max-age=3600'
          }
        });
      }
      
      // /en/catalog/ball-pythons/banana-clown → catalog with filter
      else if (parts.length === 2) {
        const [species, morph] = parts;
        const catalogUrl = new URL('/catalog.html', request.url);
        catalogUrl.searchParams.set('species', species);
        catalogUrl.searchParams.set('morph', morph);
        
        const response = await env.ASSETS.fetch(catalogUrl);
        return new Response(response.body, {
          status: 200,
          headers: { 'Content-Type': 'text/html' }
        });
      }
      
      // /en/catalog/ball-pythons → catalog filtered by species
      else if (parts.length === 1) {
        const [species] = parts;
        const catalogUrl = new URL('/catalog.html', request.url);
        catalogUrl.searchParams.set('species', species);
        
        const response = await env.ASSETS.fetch(catalogUrl);
        return new Response(response.body, {
          status: 200,
          headers: { 'Content-Type': 'text/html' }
        });
      }
      
      // /en/catalog → full catalog
      else {
        return env.ASSETS.fetch(new URL('/catalog.html', request.url));
      }
    }
    
    // Default: serve static assets
    return env.ASSETS.fetch(request);
  }
};
