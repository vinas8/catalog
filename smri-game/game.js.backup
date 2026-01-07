// SMRI Game - Main Controller
// Plain JS, click-only, fullscreen screens, progressive unlock

const GAME_VERSION = '0.1.0';
const SAVE_KEY = 'smri_game_save';

// Game State
const state = {
    version: GAME_VERSION,
    player: {
        name: 'Player',
        location: 'title',
    },
    inventory: {
        eggs: 0,
        snakes: [],
    },
    unlocked: {
        shop: true,
        home: false,
        farm: false,
        town: false,
    },
    tutorial: {
        completed: false,
        step: 0,
    },
    currentEgg: null, // { purchased: timestamp, hatchProgress: 0-100, hatched: bool }
};

// Tutorial Steps
const tutorialSteps = [
    {
        title: '🎉 Welcome!',
        text: 'Your snake has hatched! Let\'s learn how to care for it.',
    },
    {
        title: '🍖 Feeding',
        text: 'Snakes need food regularly. Visit the Care Station to feed your snake.',
    },
    {
        title: '📈 Growth',
        text: 'As you care for your snake, it will grow and develop unique morphs.',
    },
    {
        title: '💰 Economy',
        text: 'Later, you\'ll be able to breed and sell snakes. Rare morphs fetch higher prices!',
    },
    {
        title: '✅ Ready!',
        text: 'Explore your house and interact with modules. Have fun!',
    },
];

// Module Definitions (auto-derived from SMRI structure)
const modules = {
    collection: {
        id: 'collection',
        name: 'Collection',
        icon: '📦',
        description: 'View your snakes and eggs',
        location: 'home',
    },
    care: {
        id: 'care',
        name: 'Care Station',
        icon: '🛏️',
        description: 'Feed, water, and care for your snakes',
        location: 'home',
    },
    breeding: {
        id: 'breeding',
        name: 'Breeding Board',
        icon: '📋',
        description: 'Plan breeding pairs and genetics',
        location: 'home',
    },
    dex: {
        id: 'dex',
        name: 'Snake Dex',
        icon: '💻',
        description: 'Encyclopedia of snake species and morphs',
        location: 'home',
    },
    tutorial: {
        id: 'tutorial',
        name: 'Tutorials',
        icon: '📚',
        description: 'Learn game mechanics and strategies',
        location: 'home',
    },
    admin: {
        id: 'admin',
        name: 'Admin Panel',
        icon: '🔒',
        description: 'Debug and admin tools',
        location: 'home',
    },
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadGame();
    setupEventListeners();
    updateUI();
});

// Event Listeners
function setupEventListeners() {
    // Title Screen
    document.getElementById('btn-start').addEventListener('click', () => {
        switchScreen('shop');
    });

    document.getElementById('btn-continue').addEventListener('click', () => {
        if (state.unlocked.home) {
            switchScreen('home');
        } else {
            switchScreen('shop');
        }
    });

    // Shop
    document.querySelector('[data-item="egg"]').addEventListener('click', () => {
        buyEgg();
    });

    // Egg Hatching
    document.getElementById('btn-hatch').addEventListener('click', () => {
        startHatching();
    });

    // Snake Born
    document.getElementById('btn-goto-home').addEventListener('click', () => {
        switchScreen('home');
        showTutorial();
    });

    // Home Interactables
    document.querySelectorAll('.interactable').forEach(el => {
        el.addEventListener('click', () => {
            const moduleId = el.dataset.module;
            openModule(moduleId);
        });
    });

    // Module Panel Close
    document.getElementById('btn-close-module').addEventListener('click', () => {
        closeModule();
    });

    // Back Buttons
    document.querySelectorAll('.btn-back[data-back]').forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.dataset.back;
            switchScreen(target);
        });
    });

    // Tutorial
    document.getElementById('btn-tutorial-next').addEventListener('click', () => {
        nextTutorialStep();
    });

    document.getElementById('btn-tutorial-skip').addEventListener('click', () => {
        closeTutorial();
    });
}

// Screen Management
function switchScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    const screen = document.getElementById(`screen-${screenId}`);
    if (screen) {
        screen.classList.add('active');
        state.player.location = screenId;
        saveGame();
    }
}

// Shop Functions
function buyEgg() {
    if (state.currentEgg && !state.currentEgg.hatched) {
        alert('You already have an egg! Hatch it first.');
        return;
    }

    // In real version, this would call Stripe
    console.log('[STUB] Stripe checkout for $5.00');

    state.currentEgg = {
        purchased: Date.now(),
        hatchProgress: 0,
        hatched: false,
    };
    state.inventory.eggs += 1;

    saveGame();
    switchScreen('egg');
}

// Egg Hatching
function startHatching() {
    const btn = document.getElementById('btn-hatch');
    const progressBar = document.querySelector('.progress-fill');
    const status = document.getElementById('egg-status');
    const eggVisual = document.getElementById('egg-visual');

    btn.disabled = true;
    btn.textContent = 'Hatching...';
    status.textContent = 'Your egg is hatching!';

    let progress = 0;
    const interval = setInterval(() => {
        progress += 5;
        progressBar.style.width = `${progress}%`;
        state.currentEgg.hatchProgress = progress;
        saveGame();

        // Shake animation
        if (progress > 30) {
            eggVisual.style.animation = 'shake 0.5s infinite';
        }

        if (progress >= 100) {
            clearInterval(interval);
            hatchComplete();
        }
    }, 200); // 4 seconds total
}

function hatchComplete() {
    state.currentEgg.hatched = true;

    // Generate snake
    const morphs = ['Normal', 'Banana', 'Piebald', 'Pastel', 'Albino'];
    const morph = morphs[Math.floor(Math.random() * morphs.length)];

    const snake = {
        id: `snake_${Date.now()}`,
        species: 'Ball Python',
        morph: morph,
        born: Date.now(),
        fed: false,
        happiness: 100,
    };

    state.inventory.snakes.push(snake);
    state.inventory.eggs -= 1;
    state.unlocked.home = true;

    saveGame();

    // Show snake
    document.getElementById('snake-morph').textContent = morph;
    switchScreen('born');
}

// Module System
function openModule(moduleId) {
    const module = modules[moduleId];
    if (!module) return;

    const panel = document.getElementById('module-panel');
    const title = document.getElementById('module-title');
    const content = document.getElementById('module-content');

    title.textContent = `${module.icon} ${module.name}`;

    // Generate module content (stub)
    content.innerHTML = generateModuleContent(module);

    panel.classList.add('active');
}

function closeModule() {
    document.getElementById('module-panel').classList.remove('active');
}

function generateModuleContent(module) {
    switch (module.id) {
        case 'collection':
            return `
                <h3>Your Collection</h3>
                <p><strong>Snakes:</strong> ${state.inventory.snakes.length}</p>
                <p><strong>Eggs:</strong> ${state.inventory.eggs}</p>
                <div style="margin-top: 1.5rem">
                    ${state.inventory.snakes.map(s => `
                        <div style="background: var(--bg-primary); padding: 1rem; margin-bottom: 0.5rem; border-radius: 8px;">
                            🐍 <strong>${s.morph}</strong> ${s.species}
                        </div>
                    `).join('')}
                </div>
            `;

        case 'care':
            if (state.inventory.snakes.length === 0) {
                return '<p>No snakes to care for yet. Buy an egg from the shop!</p>';
            }
            return `
                <h3>Care for Your Snake</h3>
                <p><em>Coming soon: Feed, water, and monitor stats.</em></p>
                <button class="btn-primary" onclick="alert('🍖 Snake fed! (stub)')">Feed Snake</button>
            `;

        case 'breeding':
            return `
                <h3>Breeding Calculator</h3>
                <p><em>Coming soon: Genetics calculator, breeding pairs, morph predictions.</em></p>
            `;

        case 'dex':
            return `
                <h3>Snake Encyclopedia</h3>
                <p><em>Coming soon: Browse species, morphs, genetics info.</em></p>
            `;

        case 'tutorial':
            return `
                <h3>Tutorials</h3>
                <p>Learn about:</p>
                <ul style="list-style: none; padding: 0;">
                    <li style="padding: 0.5rem 0;">📖 Snake Care Basics</li>
                    <li style="padding: 0.5rem 0;">🧬 Genetics & Breeding</li>
                    <li style="padding: 0.5rem 0;">💰 Economy & Trading</li>
                    <li style="padding: 0.5rem 0;">🎮 Game Mechanics</li>
                </ul>
            `;

        case 'admin':
            return `
                <h3>Admin Panel</h3>
                <button class="btn-secondary" onclick="if(confirm('Reset all data?')) { localStorage.removeItem('${SAVE_KEY}'); location.reload(); }">Reset Game</button>
                <div style="margin-top: 1rem; font-size: 0.8rem; color: #999;">
                    <p>Version: ${GAME_VERSION}</p>
                    <p>Save Size: ${JSON.stringify(state).length} bytes</p>
                </div>
            `;

        default:
            return `<p><em>Module "${module.name}" coming soon...</em></p>`;
    }
}

// Tutorial System
function showTutorial() {
    if (state.tutorial.completed) return;

    state.tutorial.step = 0;
    document.getElementById('tutorial-overlay').style.display = 'flex';
    updateTutorialUI();
}

function nextTutorialStep() {
    state.tutorial.step += 1;

    if (state.tutorial.step >= tutorialSteps.length) {
        closeTutorial();
    } else {
        updateTutorialUI();
    }
}

function updateTutorialUI() {
    const step = tutorialSteps[state.tutorial.step];
    document.getElementById('tutorial-title').textContent = step.title;
    document.getElementById('tutorial-text').textContent = step.text;

    const nextBtn = document.getElementById('btn-tutorial-next');
    if (state.tutorial.step === tutorialSteps.length - 1) {
        nextBtn.textContent = 'Finish';
    }
}

function closeTutorial() {
    state.tutorial.completed = true;
    document.getElementById('tutorial-overlay').style.display = 'none';
    saveGame();
}

// UI Updates
function updateUI() {
    // Show continue button if game exists
    const continueBtn = document.getElementById('btn-continue');
    if (state.inventory.snakes.length > 0 || state.currentEgg) {
        continueBtn.style.display = 'inline-block';
    }

    // Disable egg purchase if already has egg
    const buyBtn = document.querySelector('[data-item="egg"]');
    if (state.currentEgg && !state.currentEgg.hatched) {
        buyBtn.disabled = true;
        buyBtn.textContent = 'Egg Purchased';
    }
}

// Save/Load
function saveGame() {
    localStorage.setItem(SAVE_KEY, JSON.stringify(state));
}

function loadGame() {
    const saved = localStorage.getItem(SAVE_KEY);
    if (saved) {
        const loaded = JSON.parse(saved);
        Object.assign(state, loaded);

        // Version migration
        if (state.version !== GAME_VERSION) {
            console.log(`Migrating save from ${state.version} to ${GAME_VERSION}`);
            state.version = GAME_VERSION;
            saveGame();
        }
    }
}

// Export for module panel inline handlers
window.state = state;
window.saveGame = saveGame;

console.log('🐍 SMRI Game loaded - v' + GAME_VERSION);
