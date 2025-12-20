<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Serpent Town — Catalog (MVP)</title>
  <style>
    body { font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial; max-width:900px; margin:2rem auto; padding:0 1rem; color:#111;}
    header { display:flex; align-items:center; justify-content:space-between; margin-bottom:1rem;}
    .card { border:1px solid #e6e6e6; border-radius:8px; padding:12px; margin:8px 0; display:flex; gap:12px; align-items:center;}
    .thumb { width:64px; height:64px; background:#f3f3f3; display:flex; align-items:center; justify-content:center; border-radius:6px; }
    button { background:#0b6efd; color:white; border:none; padding:8px 12px; border-radius:6px; cursor:pointer; }
    .muted { color:#666; font-size:0.9rem }
    .row { display:flex; gap:12px; flex-wrap:wrap; }
    .stat { font-size:0.9rem; }
    #inspector .card { flex-direction: column; align-items:flex-start; }
  </style>
</head>
<body>
  <header>
    <h1>Serpent Town</h1>
    <nav class="muted">Catalog + Tamagotchi (minimal)</nav>
  </header>

  <main>
    <section id="hero">
      <h2>Care. Learn. Collect.</h2>
      <p class="muted">Minimal demo: catalog + actions. Buy using Stripe links; care actions are local UI interactions.</p>
    </section>

    <section>
      <h3>Catalog</h3>
      <div id="catalog"></div>
    </section>

    <section>
      <h3>Your Collection</h3>
      <div id="collection"></div>
    </section>

    <section>
      <h3>Inspect Pet</h3>
      <div id="inspector" class="muted">Select a pet from your collection.</div>
    </section>
  </main>

  <script type="module">
    import { DEFAULTS } from './constants.js';
    import * as Core from './core.js';
    import tamagotchiPlugin from './plugins/tamagotchi.js';
    import shopPlugin from './plugins/shop.js';

    // Only load the two plugins requested: catalog (shop) and tamagotchi
    Core.loadPlugins([shopPlugin, tamagotchiPlugin]);

    // Optional: point to a deployed worker URL (absolute). Leave empty to use demo collection fallback.
    const WORKER_URL = '';
    const USER_EMAIL = 'demo@serpent.town';

    function renderCatalog() {
      const catalogEl = document.getElementById('catalog');
      catalogEl.innerHTML = '';
      for (const item of shopPlugin.catalog) {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
          <div class="thumb">${item.image ? '<img src="' + item.image + '" width="56" height="56" alt="" />' : '📦'}</div>
          <div style="flex:1">
            <div><strong>${item.display_name || item.product_id}</strong></div>
            <div class="muted">${item.description || ''}</div>
            <div class="muted">Price: ${item.price_text || '—'}</div>
          </div>
          <div>
            <a target="_blank" rel="noopener" href="${item.payment_link}"><button>Buy</button></a>
          </div>
        `;
        catalogEl.appendChild(card);
      }
    }

    async function fetchCollection() {
      const url = WORKER_URL ? `${WORKER_URL}/collection?user=${encodeURIComponent(USER_EMAIL)}` : `/collection?user=${encodeURIComponent(USER_EMAIL)}`;
      try {
        const resp = await fetch(url);
        if (resp.ok) return await resp.json();
      } catch (e) { /* ignore */ }
      // fallback to demo collection in core
      return Core.getDemoCollection(USER_EMAIL);
    }

    async function renderCollection() {
      const collectionEl = document.getElementById('collection');
      collectionEl.innerHTML = '';
      const owned = await fetchCollection();
      if (!owned || owned.length === 0) {
        collectionEl.innerHTML = '<div class="muted">No pets yet. Buy one from the catalog.</div>';
        return;
      }

      for (const id of owned) {
        // Try to find a matching catalog entry by product_id
        const catalogEntry = shopPlugin.catalog.find(c => c.product_id === id) || { product_id: id, display_name: id };
        const pet = createTransientPetFromCatalog(catalogEntry);
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
          <div class="thumb">${catalogEntry.image ? '<img src="' + catalogEntry.image + '" width="56" height="56" alt="" />' : '🐾'}</div>
          <div style="flex:1">
            <div><strong>${catalogEntry.display_name || catalogEntry.product_id}</strong></div>
            <div class="stat">Hunger: <span data-stat="hunger">${pet.care.hunger}</span></div>
            <div class="stat">Clean: <span data-stat="clean">${pet.care.clean}</span></div>
          </div>
          <div>
            <button data-id="${catalogEntry.product_id}" class="inspect-btn">Open</button>
          </div>
        `;
        collectionEl.appendChild(card);
      }
    }

    // Create a minimal transient pet instance from a shop catalog entry.
    function createTransientPetFromCatalog(catalogEntry) {
      const entityDef = {
        id: catalogEntry.product_id,
        name: catalogEntry.display_name || catalogEntry.product_id,
        initial_care: { hunger: DEFAULTS.STAT_MAX, clean: DEFAULTS.STAT_MAX }
      };
      return Core.createPetInstance(entityDef, {});
    }

    function setupCollectionClickHandler() {
      document.getElementById('collection').addEventListener('click', (e) => {
        const btn = e.target.closest('button.inspect-btn');
        if (!btn) return;
        const id = btn.getAttribute('data-id');
        openInspectorFor(id);
      });
    }

    function openInspectorFor(productId) {
      const inspectorEl = document.getElementById('inspector');
      const catalogEntry = shopPlugin.catalog.find(c => c.product_id === productId) || { product_id: productId };
      const pet = createTransientPetFromCatalog(catalogEntry);

      inspectorEl.innerHTML = '';
      const node = document.createElement('div');
      node.className = 'card';
      node.innerHTML = `
        <div style="flex:1">
          <div><strong>${catalogEntry.display_name || catalogEntry.product_id}</strong></div>
          <div class="muted">${catalogEntry.description || ''}</div>
          <div class="stat">Hunger: <span id="stat-hunger">${pet.care.hunger}</span></div>
          <div class="stat">Clean: <span id="stat-clean">${pet.care.clean}</span></div>
        </div>
        <div>
          <button id="feed">Feed</button>
          <button id="clean">Clean</button>
        </div>
      `;
      inspectorEl.appendChild(node);

      // Wire tamagotchi actions (labels from plugin, logic in core)
      document.getElementById('feed').addEventListener('click', () => {
        Core.applyAction('feed', pet, {});
        document.getElementById('stat-hunger').textContent = pet.care.hunger;
      });
      document.getElementById('clean').addEventListener('click', () => {
        Core.applyAction('clean', pet, {});
        document.getElementById('stat-clean').textContent = pet.care.clean;
      });
    }

    (async function init() {
      renderCatalog();
      await renderCollection();
      setupCollectionClickHandler();
    })();
  </script>
</body>
</html>
