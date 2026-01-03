/**
 * Response Utilities for Cloudflare Worker
 * Standardized JSON response helpers
 */

import { corsHeaders } from './cors.js';

export function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: corsHeaders
  });
}

export function errorResponse(error, status = 500) {
  return jsonResponse({ error: String(error) }, status);
}

export function notFoundResponse(message = 'Not found') {
  return jsonResponse({ error: message }, 404);
}

export function successResponse(data) {
  return jsonResponse({ success: true, ...data }, 200);
}
