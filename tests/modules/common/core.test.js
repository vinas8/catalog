import assert from 'assert';
import { GAME_DEFAULTS } from '../../test-constants.js';
import * as Core from '../src/core.js';
import snakesPlugin from '../src/plugins/snakes.js';
import tamagotchiPlugin from '../src/plugins/tamagotchi.js';

export async function run() {
  // Reload plugins map fresh
  Core.loadPlugins([snakesPlugin, tamagotchiPlugin]);

  // Create instance for corn_snake
  const snakeDef = snakesPlugin.entities.find(s => s.id === 'corn_snake');
  const profile = Core.getCareProfileForEntity(snakeDef);
  const pet = Core.createPetInstance(snakeDef, profile);

  // Start at full
  assert.strictEqual(pet.care.hunger, GAME_DEFAULTS.STAT_MAX);
  assert.strictEqual(pet.care.clean, GAME_DEFAULTS.STAT_MAX);

  // Apply decay once
  Core.applyDecay(pet, profile);
  // Expect decreased hunger/clean per profile (corn_standard: hunger decay 5, clean decay 2)
  assert.strictEqual(pet.care.hunger, 95);
  assert.strictEqual(pet.care.clean, 98);

  // Apply feed action
  Core.applyAction('feed', pet, profile);
  assert.strictEqual(pet.care.hunger, GAME_DEFAULTS.STAT_MAX);

  // Apply clean action
  Core.applyAction('clean', pet, profile);
  assert.strictEqual(pet.care.clean, GAME_DEFAULTS.STAT_MAX);

  // Unknown action does nothing
  pet.care.hunger = 50;
  Core.applyAction('unknown_action', pet, profile);
  assert.strictEqual(pet.care.hunger, 50);
}
