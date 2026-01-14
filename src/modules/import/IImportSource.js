/**
 * Import Source Interface
 * Defines contract for all import sources (CSV, Stripe, KV, Filesystem)
 */
export class IImportSource {
  /**
   * Validate and parse raw data
   * @param {any} rawData - Raw input (file, text, URL, etc)
   * @returns {Promise<{valid: boolean, data?: Array, errors?: Array}>}
   */
  async validate(rawData) {
    throw new Error('validate() must be implemented');
  }

  /**
   * Read data from source
   * @returns {Promise<Array>} Array of snake objects
   */
  async read() {
    throw new Error('read() must be implemented');
  }

  /**
   * Get source metadata
   * @returns {Object} {name, type, description}
   */
  getMetadata() {
    throw new Error('getMetadata() must be implemented');
  }
}
