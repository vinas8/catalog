import assert from 'assert';
import dexPlugin from '../src/plugins/dex.js';

export async function run() {
  assert.strictEqual(typeof dexPlugin, 'object');
  assert.ok(dexPlugin.ui, 'dex should provide UI metadata');
}
