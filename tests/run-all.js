// Simple test runner that imports all test modules and reports pass/fail.
// No external dependencies.

const tests = [
  './core.test.js',
  './snakes.test.js',
  './plants.test.js',
  './tamagotchi.test.js',
  './dex.test.js',
  './shop.test.js'
];

(async function run() {
  let passed = 0;
  let failed = 0;
  for (const t of tests) {
    try {
      const mod = await import(new URL(t, import.meta.url).href);
      if (typeof mod.run === 'function') {
        await mod.run();
      }
      console.log(`✔ ${t}`);
      passed++;
    } catch (err) {
      console.error(`✖ ${t}`);
      console.error(err);
      failed++;
    }
  }
  console.log('---');
  console.log(`Passed: ${passed}  Failed: ${failed}`);
  if (failed > 0) process.exit(1);
})();
