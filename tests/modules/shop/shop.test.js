import assert from 'assert';
import shopPlugin from '../src/plugins/shop.js';

export async function run() {
  assert.strictEqual(typeof shopPlugin, 'object');
  assert.ok(Array.isArray(shopPlugin.catalog), 'catalog must be array');
  // each catalog item should reference a product_id and payment_link (placeholder allowed)
  for (const item of shopPlugin.catalog) {
    assert.ok(item.product_id, 'catalog item.product_id required');
    assert.ok(item.payment_link, 'catalog item.payment_link required');
  }
}
