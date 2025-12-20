import assert from 'assert';
import plantsPlugin from '../src/plugins/plants.js';

export async function run() {
  assert.strictEqual(typeof plantsPlugin, 'object');
  assert.ok(Array.isArray(plantsPlugin.entities), 'plants entities should be an array');
  // can be empty in MVP but shape must be preserved
  if (plantsPlugin.entities.length > 0) {
    const e = plantsPlugin.entities[0];
    assert.ok(e.id && e.name);
  }
}
