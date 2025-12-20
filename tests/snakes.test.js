import assert from 'assert';
import snakesPlugin from '../src/plugins/snakes.js';

export async function run() {
  assert.strictEqual(typeof snakesPlugin, 'object');
  assert.ok(Array.isArray(snakesPlugin.entities), 'entities should be an array');
  // ensure each entity has required fields
  for (const e of snakesPlugin.entities) {
    assert.ok(e.id, 'entity id required');
    assert.ok(e.name, 'entity name required');
    assert.ok(e.care_profile, 'entity care_profile required');
  }
  // ensure care_profiles exist
  assert.ok(snakesPlugin.care_profiles && typeof snakesPlugin.care_profiles === 'object');
}
