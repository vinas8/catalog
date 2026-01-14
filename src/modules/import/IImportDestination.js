/**
 * Import Destination Interface
 * Defines contract for all import destinations (KV, Stripe, Filesystem)
 */
export class IImportDestination {
  /**
   * Write data to destination
   * @param {Array} snakes - Array of validated snake objects
   * @returns {Promise<{success: boolean, written: number, errors?: Array}>}
   */
  async write(snakes) {
    throw new Error('write() must be implemented');
  }

  /**
   * Clear all data from destination
   * @returns {Promise<{success: boolean, deleted: number}>}
   */
  async clear() {
    throw new Error('clear() must be implemented');
  }

  /**
   * Get destination metadata
   * @returns {Object} {name, type, description}
   */
  getMetadata() {
    throw new Error('getMetadata() must be implemented');
  }
}
