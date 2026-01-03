/**
 * CORS Utilities for Cloudflare Worker
 * Handles Cross-Origin Resource Sharing headers
 */

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Stripe-Signature',
  'Content-Type': 'application/json'
};

export function handleOptions() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders
  });
}

export function getCorsHeaders() {
  return { ...corsHeaders };
}
