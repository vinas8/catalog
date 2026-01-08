/**
 * Module Function Catalog
 * @version 0.7.7
 * Public API facades for all modules - what each module exposes
 */

export const MODULE_FUNCTIONS = {
  // === COMMON MODULE ===
  common: {
    module: 'src/modules/common',
    exports: [
      { name: 'Core', type: 'class', description: 'Core system utilities' },
      { name: 'GAME_CONSTANTS', type: 'object', description: 'Game configuration constants' },
      { name: 'SPECIES', type: 'array', description: 'Available snake species' },
      { name: 'MORPHS', type: 'object', description: 'Morph definitions by species' }
    ],
    functions: [
      { name: 'Core.init()', returns: 'void', description: 'Initialize core system' },
      { name: 'Core.log(msg, type)', returns: 'void', description: 'Debug logging' },
      { name: 'Core.error(msg)', returns: 'void', description: 'Error logging' }
    ]
  },

  // === GAME MODULE ===
  game: {
    module: 'src/modules/game',
    exports: [
      { name: 'SerpentTown', type: 'class', description: 'Main game controller' },
      { name: 'snakesPlugin', type: 'object', description: 'Snake care mechanics' },
      { name: 'plantsPlugin', type: 'object', description: 'Plant care mechanics' },
      { name: 'tamagotchiPlugin', type: 'object', description: 'Tamagotchi core logic' },
      { name: 'dexPlugin', type: 'object', description: 'Dex/collection tracking' },
      { name: 'shopPlugin', type: 'object', description: 'In-game shop' }
    ],
    functions: [
      { name: 'SerpentTown.init(config)', returns: 'instance', description: 'Initialize game' },
      { name: 'SerpentTown.loadUser(userHash)', returns: 'Promise<boolean>', description: 'Load user data' },
      { name: 'SerpentTown.feed(animalId)', returns: 'boolean', description: 'Feed animal' },
      { name: 'SerpentTown.water(animalId)', returns: 'boolean', description: 'Water animal' },
      { name: 'SerpentTown.clean(animalId)', returns: 'boolean', description: 'Clean habitat' },
      { name: 'SerpentTown.getStats(animalId)', returns: 'object', description: 'Get animal stats' },
      { name: 'snakesPlugin.update(delta, state)', returns: 'void', description: 'Update snake stats' },
      { name: 'shopPlugin.buy(itemId)', returns: 'boolean', description: 'Purchase item' }
    ]
  },

  // === SHOP MODULE ===
  shop: {
    module: 'src/modules/shop',
    exports: [
      { name: 'Economy', type: 'class', description: 'Economic system' },
      { name: 'createInitialGameState', type: 'function', description: 'Create new game state' },
      { name: 'EquipmentShop', type: 'class', description: 'Equipment shop manager' },
      { name: 'StripeSync', type: 'class', description: 'Stripe → KV sync' },
      { name: 'SPECIES_PROFILES', type: 'object', description: 'Species data' },
      { name: 'MORPHS_BY_SPECIES', type: 'object', description: 'Morph catalog' },
      { name: 'TRAIT_DATABASE', type: 'object', description: 'Genetic traits' },
      { name: 'EQUIPMENT_CATALOG', type: 'array', description: 'Available equipment' },
      { name: 'ShopView', type: 'class', description: 'Shop UI controller' },
      { name: 'CatalogRenderer', type: 'class', description: 'Catalog renderer' }
    ],
    functions: [
      { name: 'Economy.calculatePrice(species, morph)', returns: 'number', description: 'Calculate product price' },
      { name: 'createInitialGameState()', returns: 'object', description: 'Create blank state' },
      { name: 'EquipmentShop.buy(itemId, qty)', returns: 'boolean', description: 'Buy equipment' },
      { name: 'StripeSync.syncProduct(productId)', returns: 'Promise<void>', description: 'Sync Stripe product' },
      { name: 'getTraitInfo(traitName)', returns: 'object', description: 'Get trait details' },
      { name: 'parseMorphString(morphStr)', returns: 'array', description: 'Parse morph string' },
      { name: 'initializeCatalog()', returns: 'Promise<array>', description: 'Load product catalog' },
      { name: 'ShopView.render()', returns: 'void', description: 'Render shop UI' },
      { name: 'CatalogRenderer.renderProduct(product)', returns: 'HTMLElement', description: 'Render product card' }
    ]
  },

  // === AUTH MODULE ===
  auth: {
    module: 'src/modules/auth',
    exports: [
      { name: 'UserAuth', type: 'class', description: 'User authentication manager' },
      { name: 'hashUser', type: 'function', description: 'Hash user identifier' }
    ],
    functions: [
      { name: 'UserAuth.login(identifier)', returns: 'Promise<string>', description: 'Login user, get hash' },
      { name: 'UserAuth.getCurrentUser()', returns: 'string|null', description: 'Get current user hash' },
      { name: 'UserAuth.logout()', returns: 'void', description: 'Logout current user' },
      { name: 'hashUser(identifier)', returns: 'string', description: 'Generate user hash' }
    ]
  },

  // === PAYMENT MODULE ===
  payment: {
    module: 'src/modules/payment',
    exports: [
      { name: 'StripeAdapter', type: 'class', description: 'Stripe payment adapter' },
      { name: 'redirectToCheckout', type: 'function', description: 'Redirect to Stripe checkout' }
    ],
    functions: [
      { name: 'StripeAdapter.createCheckout(productId)', returns: 'Promise<string>', description: 'Create checkout session' },
      { name: 'redirectToCheckout(sessionId)', returns: 'void', description: 'Redirect to Stripe' },
      { name: 'StripeAdapter.verifyPayment(sessionId)', returns: 'Promise<boolean>', description: 'Verify payment' }
    ]
  },

  // === TESTING MODULE ===
  testing: {
    module: 'src/modules/testing',
    exports: [
      { name: 'TestRunner', type: 'class', description: 'Unit test runner' },
      { name: 'assert', type: 'function', description: 'Test assertion' }
    ],
    functions: [
      { name: 'TestRunner.run(testSuite)', returns: 'Promise<object>', description: 'Run test suite' },
      { name: 'assert(condition, message)', returns: 'void', description: 'Assert condition' }
    ]
  },

  // === BREEDING MODULE ===
  breeding: {
    module: 'src/modules/breeding',
    exports: [
      { name: 'BreedingCalculator', type: 'class', description: 'Genetics calculator' },
      { name: 'MorphSync', type: 'class', description: 'Morph data sync' }
    ],
    functions: [
      { name: 'BreedingCalculator.calculate(parent1, parent2)', returns: 'array', description: 'Calculate offspring' },
      { name: 'BreedingCalculator.getCoI(pedigree)', returns: 'number', description: 'Calculate coefficient of inbreeding' },
      { name: 'MorphSync.fetchMorphs()', returns: 'Promise<array>', description: 'Fetch morph data' }
    ]
  },

  // === SMRI MODULE ===
  smri: {
    module: 'src/modules/smri',
    exports: [
      { name: 'SMRIRunner', type: 'class', description: 'Test runner' },
      { name: 'scenarios', type: 'array', description: 'Test scenarios' },
      { name: 'pipelineSteps', type: 'array', description: 'Pipeline steps' }
    ],
    functions: [
      { name: 'SMRIRunner.init()', returns: 'void', description: 'Initialize runner' },
      { name: 'SMRIRunner.runScenario(id)', returns: 'Promise<object>', description: 'Run scenario' },
      { name: 'SMRIRunner.runAll()', returns: 'Promise<void>', description: 'Run all scenarios' },
      { name: 'SMRIRunner.getSummary()', returns: 'object', description: 'Get results summary' }
    ]
  },

  // === TUTORIAL MODULE ===
  tutorial: {
    module: 'src/modules/tutorial',
    exports: [
      { name: 'TutorialSystem', type: 'class', description: 'Tutorial manager' },
      { name: 'EventSystem', type: 'class', description: 'Tutorial event system' }
    ],
    functions: [
      { name: 'TutorialSystem.start()', returns: 'void', description: 'Start tutorial' },
      { name: 'TutorialSystem.nextStep()', returns: 'boolean', description: 'Advance to next step' },
      { name: 'EventSystem.trigger(eventName, data)', returns: 'void', description: 'Trigger tutorial event' }
    ]
  }
};

// Helper functions
export const getModuleFunctions = (moduleName) => MODULE_FUNCTIONS[moduleName];

export const getAllModuleNames = () => Object.keys(MODULE_FUNCTIONS);

export const searchFunctions = (query) => {
  const results = [];
  const lowerQuery = query.toLowerCase();
  
  for (const [moduleName, moduleData] of Object.entries(MODULE_FUNCTIONS)) {
    for (const fn of moduleData.functions) {
      if (fn.name.toLowerCase().includes(lowerQuery) || 
          fn.description.toLowerCase().includes(lowerQuery)) {
        results.push({ module: moduleName, ...fn });
      }
    }
  }
  
  return results;
};

export const getExportsByModule = (moduleName) => {
  const module = MODULE_FUNCTIONS[moduleName];
  return module ? module.exports : [];
};

export const getFunctionsByModule = (moduleName) => {
  const module = MODULE_FUNCTIONS[moduleName];
  return module ? module.functions : [];
};
