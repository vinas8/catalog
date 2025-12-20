/**
 * Cloudflare Worker (module worker)
 *
 * Expected bindings:
 * - COLLECTIONS_KV (KV namespace)
 *
 * Endpoints:
 * - POST /stripe-webhook  (Stripe will POST events here)
 * - GET  /collection?user=<email>
 *
 * Notes:
 * - For MVP this accepts Stripe checkout.session.completed events and expects
 *   the session object to contain metadata: { product_id, user_email }.
 * - You must bind a KV namespace named COLLECTIONS_KV (or change the name below).
 *
 * Deployment:
 * - Use Wrangler or Cloudflare dashboard to deploy and bind KV.
 */

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const pathname = url.pathname;

    // Simple CORS for browser access
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Stripe-Signature'
        }
      });
    }

    if (pathname === '/stripe-webhook' && request.method === 'POST') {
      return handleStripeWebhook(request, env);
    }

    if (pathname === '/collection' && request.method === 'GET') {
      return handleGetCollection(request, env);
    }

    return new Response('Not found', { status: 404 });
  }
};

async function handleStripeWebhook(request, env) {
  // NOTE: For production you MUST verify the Stripe signature header using your webhook secret.
  // This MVP implementation DOES NOT verify signatures.
  let payload;
  try {
    payload = await request.json();
  } catch (err) {
    return new Response('Invalid JSON', { status: 400 });
  }

  const eventType = payload.type || (payload.data && payload.data.type);
  if (!eventType) {
    return new Response('No event type', { status: 400 });
  }

  if (eventType === 'checkout.session.completed') {
    const session = payload.data.object || payload; // fallback
    // expected metadata keys: product_id, user_email
    const metadata = session.metadata || {};
    const productId = metadata.product_id;
    const userEmail = metadata.user_email;

    if (!productId || !userEmail) {
      // nothing to do for now
      return new Response('Missing metadata', { status: 200 });
    }

    // Store ownership in KV. Key per user email
    const kvKey = `collection:${userEmail}`;
    try {
      const current = await env.COLLECTIONS_KV.get(kvKey);
      let arr = [];
      if (current) {
        try { arr = JSON.parse(current); } catch (e) { arr = []; }
      }
      if (!arr.includes(productId)) arr.push(productId);
      await env.COLLECTIONS_KV.put(kvKey, JSON.stringify(arr));
      return new Response('OK', { status: 200 });
    } catch (err) {
      return new Response('KV error', { status: 500 });
    }
  }

  // For other events do nothing
  return new Response('Ignored', { status: 200 });
}

async function handleGetCollection(request, env) {
  const url = new URL(request.url);
  const user = url.searchParams.get('user');
  if (!user) return new Response('Missing user param', { status: 400 });

  const kvKey = `collection:${user}`;
  try {
    const current = await env.COLLECTIONS_KV.get(kvKey);
    if (!current) {
      return new Response(JSON.stringify([]), {
        status: 200,
        headers: { 'content-type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      });
    }
    return new Response(current, {
      status: 200,
      headers: { 'content-type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  } catch (err) {
    return new Response('KV error', { status: 500 });
  }
}
