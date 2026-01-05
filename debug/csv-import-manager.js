/**
 * CSV Import Manager Component
 * Handles CSV parsing, Stripe upload, and KV sync for product import
 */

class CSVImportManager {
  constructor(config = {}) {
    this.workerUrl = config.workerUrl || 'https://catalog.navickaszilvinas.workers.dev';
    this.onLog = config.onLog || console.log;
    this.csvData = null;
  }

  /**
   * Parse CSV text into structured data
   * @param {string} csvText - Raw CSV content
   * @returns {Array} Parsed product objects
   */
  parseCSV(csvText) {
    const lines = csvText.trim().split('\n').filter(l => l.trim());
    if (lines.length < 2) {
      throw new Error('CSV must have headers and at least one data row');
    }

    const headers = lines[0].split(',').map(h => h.trim());
    const products = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim());
      const row = {};
      headers.forEach((h, idx) => row[h] = values[idx] || '');
      products.push(row);
    }

    this.csvData = products;
    this.onLog(`✅ Parsed ${products.length} products from CSV`, 'success');
    return products;
  }

  /**
   * Convert CSV rows to product format for Stripe
   * @returns {Array} Formatted product objects
   */
  formatProductsForStripe() {
    if (!this.csvData) {
      throw new Error('No CSV data loaded. Call parseCSV() first');
    }

    return this.csvData.map(row => {
      // Auto-detect species based on morph
      const morph = row.Morph || '';
      const isCornSnake = morph.includes('Corn') || 
                         morph.includes('Salmon') || 
                         morph.includes('Opal') || 
                         morph.includes('Tessera') ||
                         morph.includes('Bloodred');

      return {
        name: row.Name || 'Unnamed Snake',
        morph: morph,
        gender: row.Gender || 'Unknown',
        yob: row.YOB || new Date().getFullYear().toString(),
        weight: row.Weight || 'TBD',
        species: isCornSnake ? 'corn_snake' : 'ball_python',
        price: parseFloat(row.Price) || 150.00
      };
    });
  }

  /**
   * Upload products to Stripe
   * @returns {Promise<Object>} Upload result with success/failure counts
   */
  async uploadToStripe() {
    if (!this.csvData) {
      throw new Error('No CSV data loaded');
    }

    this.onLog('⬆️ Uploading products to Stripe...', 'info');
    const products = this.formatProductsForStripe();

    try {
      const res = await fetch(`${this.workerUrl}/upload-products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ products })
      });

      const result = await res.json();

      if (res.ok) {
        this.onLog(`✅ Upload complete! ${result.uploaded}/${result.total} succeeded`, 'success');
        
        // Log individual results
        if (result.results) {
          result.results.forEach(r => {
            if (r.success) {
              this.onLog(`  ✅ ${r.name}`, 'success');
            } else {
              this.onLog(`  ❌ ${r.name}: ${r.error}`, 'error');
            }
          });
        }
        return result;
      } else {
        this.onLog(`❌ Upload failed: ${result.error}`, 'error');
        throw new Error(result.error);
      }
    } catch (err) {
      this.onLog(`❌ Error: ${err.message}`, 'error');
      throw err;
    }
  }

  /**
   * Sync Stripe products to Cloudflare KV
   * @returns {Promise<Object>} Sync result with count
   */
  async syncToKV() {
    this.onLog('🔄 Syncing Stripe → KV...', 'info');

    try {
      const res = await fetch(`${this.workerUrl}/sync-stripe-to-kv`, { 
        method: 'POST' 
      });
      const result = await res.json();

      if (res.ok) {
        this.onLog(`✅ Sync complete! ${result.synced}/${result.total} synced`, 'success');
        return result;
      } else {
        this.onLog(`❌ Sync failed: ${result.error}`, 'error');
        throw new Error(result.error);
      }
    } catch (err) {
      this.onLog(`❌ Error: ${err.message}`, 'error');
      throw err;
    }
  }

  /**
   * Get current products from KV
   * @returns {Promise<Array>} Products in KV
   */
  async getProducts() {
    try {
      const res = await fetch(`${this.workerUrl}/products`);
      if (!res.ok) throw new Error('Failed to fetch products');
      const products = await res.json();
      this.onLog(`📦 Fetched ${products.length} products from KV`, 'info');
      return products;
    } catch (err) {
      this.onLog(`❌ Error fetching products: ${err.message}`, 'error');
      throw err;
    }
  }

  /**
   * Full import flow: Parse CSV → Upload to Stripe → Sync to KV
   * @param {string} csvText - Raw CSV content
   * @returns {Promise<Object>} Import result
   */
  async fullImport(csvText) {
    this.onLog('🚀 Starting full import flow...', 'info');
    
    try {
      // Step 1: Parse CSV
      this.parseCSV(csvText);
      
      // Step 2: Upload to Stripe
      const uploadResult = await this.uploadToStripe();
      
      // Step 3: Sync to KV
      const syncResult = await this.syncToKV();
      
      // Step 4: Verify
      const products = await this.getProducts();
      
      this.onLog('✅ Full import complete!', 'success');
      this.onLog(`📊 Final: ${products.length} products in catalog`, 'success');
      
      return {
        success: true,
        parsed: this.csvData.length,
        uploaded: uploadResult.uploaded,
        synced: syncResult.synced,
        total: products.length
      };
    } catch (err) {
      this.onLog(`❌ Import failed: ${err.message}`, 'error');
      throw err;
    }
  }

  /**
   * Clear all Stripe products (destructive!)
   * @returns {Promise<Object>} Clear result
   */
  async clearStripe() {
    this.onLog('⚠️ Clearing all Stripe products...', 'warning');
    
    try {
      const res = await fetch(`${this.workerUrl}/clear-stripe-products`, { 
        method: 'POST' 
      });
      const result = await res.json();

      if (res.ok) {
        this.onLog(`✅ Cleared! ${result.deleted}/${result.total} deleted`, 'success');
        return result;
      } else {
        this.onLog(`❌ Clear failed: ${result.error}`, 'error');
        throw new Error(result.error);
      }
    } catch (err) {
      this.onLog(`❌ Error: ${err.message}`, 'error');
      throw err;
    }
  }
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CSVImportManager;
}
