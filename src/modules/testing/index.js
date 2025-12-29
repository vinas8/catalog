/**
 * Testing Module - Shared test utilities
 * Used by both automated tests (npm test) and debug hub (browser)
 * 
 * @module testing
 * @version 0.7.0
 */

export { TestRunner } from './test-runner.js';
export { StripeClient, KVClient, WorkerClient } from './api-clients.js';
export { generateProduct, generateCustomer, generatePurchase } from './mock-data.js';
export { assertEquals, assertContains, assertThrows } from './assertions.js';
export { DebugAdapter } from './debug-adapter.js';
