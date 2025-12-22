import assert from 'assert';
import tamagotchiPlugin from '../src/plugins/tamagotchi.js';

export async function run() {
  assert.strictEqual(typeof tamagotchiPlugin, 'object');
  assert.ok(Array.isArray(tamagotchiPlugin.actions), 'tamagotchi.actions must be an array');
  const actionIds = tamagotchiPlugin.actions.map(a => a.id);
  assert.ok(actionIds.includes('feed') && actionIds.includes('clean'), 'actions feed/clean present');
}
