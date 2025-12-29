/**
 * Assertion Helpers - Test assertions
 * 
 * @version 0.7.0
 */

export class AssertionError extends Error {
  constructor(message, expected, actual) {
    super(message);
    this.name = 'AssertionError';
    this.expected = expected;
    this.actual = actual;
  }
}

/**
 * Assert equality
 */
export function assertEquals(actual, expected, message) {
  if (actual !== expected) {
    throw new AssertionError(
      message || `Expected ${expected} but got ${actual}`,
      expected,
      actual
    );
  }
}

/**
 * Assert deep equality (for objects)
 */
export function assertDeepEquals(actual, expected, message) {
  const actualJson = JSON.stringify(actual);
  const expectedJson = JSON.stringify(expected);
  
  if (actualJson !== expectedJson) {
    throw new AssertionError(
      message || `Expected ${expectedJson} but got ${actualJson}`,
      expected,
      actual
    );
  }
}

/**
 * Assert truthiness
 */
export function assert(value, message) {
  if (!value) {
    throw new AssertionError(
      message || `Expected truthy value but got ${value}`,
      true,
      value
    );
  }
}

/**
 * Assert contains (string or array)
 */
export function assertContains(collection, item, message) {
  const contains = typeof collection === 'string'
    ? collection.includes(item)
    : Array.isArray(collection) && collection.includes(item);
    
  if (!contains) {
    throw new AssertionError(
      message || `Expected collection to contain ${item}`,
      item,
      collection
    );
  }
}

/**
 * Assert function throws
 */
export async function assertThrows(fn, expectedError, message) {
  try {
    await fn();
    throw new AssertionError(
      message || 'Expected function to throw',
      'error',
      'no error'
    );
  } catch (error) {
    if (expectedError && !error.message.includes(expectedError)) {
      throw new AssertionError(
        message || `Expected error to contain "${expectedError}"`,
        expectedError,
        error.message
      );
    }
  }
}

/**
 * Assert HTTP status
 */
export function assertStatus(response, expectedStatus, message) {
  if (response.status !== expectedStatus) {
    throw new AssertionError(
      message || `Expected HTTP ${expectedStatus} but got ${response.status}`,
      expectedStatus,
      response.status
    );
  }
}

/**
 * Assert response OK
 */
export function assertOK(response, message) {
  if (!response.ok) {
    throw new AssertionError(
      message || `Expected response to be OK but got ${response.status}`,
      'ok',
      response.status
    );
  }
}

/**
 * Assert array length
 */
export function assertLength(array, expectedLength, message) {
  if (!Array.isArray(array) || array.length !== expectedLength) {
    throw new AssertionError(
      message || `Expected length ${expectedLength} but got ${array?.length}`,
      expectedLength,
      array?.length
    );
  }
}

/**
 * Assert object has property
 */
export function assertHasProperty(obj, prop, message) {
  if (!obj || !(prop in obj)) {
    throw new AssertionError(
      message || `Expected object to have property "${prop}"`,
      prop,
      Object.keys(obj || {})
    );
  }
}
