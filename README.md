# Serpent Town — MVP

Version: MVP Proposal v1.0  
Status: Approved — Architecture & Scope

Serpent Town is a calm, web-first digital keeper experience (Tamagotchi-style). This repository contains a minimal, testable MVP using static HTML/JS for the frontend and a Cloudflare Worker for backend ownership syncing.

## Project structure

src/
- index.html
- core.js
- constants.js
- plugins/
  - snakes.js
  - plants.js
  - tamagotchi.js
  - dex.js
  - shop.js
- assets/ (images placeholder)

worker/
- worker.js (Cloudflare Worker script)

tests/
- core.test.js
- snakes.test.js
- plants.test.js
- tamagotchi.test.js
- dex.test.js
- shop.test.js
- run-all.js

package.json

## What this includes
- Minimal static web UI (src/index.html)
- Core logic in `src/core.js` (single place with logic)
- Plugins are pure data (no functions) under `src/plugins/`
- Simple Cloudflare Worker (worker/worker.js) with:
  - POST /stripe-webhook (accepts `checkout.session.completed` events and stores ownership in KV)
  - GET  /collection?user=email
- Simple node-based test runner (no external deps) — run tests with `npm test`

## Running locally (frontend)
You can serve `src/` with any static server.

Option A (serve if installed):
```bash
npm start
# opens a static server at http://localhost:5000 (or use your own)
```

Option B (python http server):
```bash
cd src
python3 -m http.server 5000
# open http://localhost:5000
```

The frontend will attempt to call `/collection?user=demo@serpent.town`. If you don't have the worker deployed, the frontend falls back to a demo collection.

## Running tests
Tests use a tiny Node test runner provided in `tests/run-all.js` and assert using Node's `assert`.

Run:
```bash
npm test
```

All test files are under `tests/`. They validate core logic and plugin shape (plugins must be plain data objects).

## Cloudflare Worker deployment (MVP)
This worker handles ownership state via KV and receives Stripe webhooks.

1. Create a Cloudflare account and a Worker.
2. Create a KV namespace (e.g. `COLLECTIONS_KV`).
3. Deploy `worker/worker.js` and bind the KV namespace to the `COLLECTIONS_KV` binding name.
4. Expose the worker route (e.g. `https://api.serpent.town/*`) or use the Worker URL.

Example `wrangler.toml` snippet:
```toml
name = "serpent-town-worker"
type = "javascript"
account_id = "<YOUR_ACCOUNT_ID>"
workers_dev = true

[vars]
# none

[kv_namespaces]
bindings = [
  { binding = "COLLECTIONS_KV", id = "<YOUR_KV_ID>" }
]
```

Important: For production, verify Stripe webhook signatures using your webhook secret. The MVP worker intentionally does not perform signature verification — you must add this.

## Stripe setup (README MUST INCLUDE)
1. Create a Stripe account.
2. Create a Product for each sellable entity (e.g. `corn_snake`).
3. Create a Payment Link for the product.
4. When creating the Payment Link, add metadata keys:
   - `product_id` (e.g. `corn_snake`)
   - `user_email`: (you can ask the buyer in checkout or collect via other flows)
5. Create a webhook in Stripe dashboard pointing to:
   `https://<your-worker-domain>/stripe-webhook`
   - Listen for `checkout.session.completed`
6. (IMPORTANT) Add the Stripe webhook secret to your worker environment and verify Stripe signatures in `worker/worker.js`. The sample worker skips verification for clarity.

## Final rule (include in README)
Plugins describe the world. Core runs the world.
If it can’t be unit-tested, it doesn’t ship.

## Notes & Next steps
- Replace placeholder Stripe Payment Links in `src/plugins/shop.js` with your real payment links.
- Deploy worker and bind KV before relying on cloud collection storage.
- The Godot client is not executed in JS and should consume the same data structures via HTTP APIs or a direct asset bundle.

If you want, I can:
- generate a ready-to-deploy `wrangler.toml` and deployment instructions,
- add signature verification example for Stripe webhooks,
- plug in real Stripe Payment Link URLs and KV binding names for a ready deployment,
- or produce a compressed zip output / GitHub repo commit instructions.
