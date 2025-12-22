/**
 * Payment Module - Payment Processing (Stripe, PayPal, Square)
 * Enable/Disable: Set ENABLED = true/false
 */

export const ENABLED = true;

export { PaymentConfig } from './config.js';
export { createPaymentAdapter } from './payment-adapter.js';
