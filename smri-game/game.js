// SMRI Game v0.2.0 - Integrates existing modules
const GAME_VERSION = '0.2.0';
const SAVE_KEY = 'smri_game_save';

const MODULES = {
    shop: '../catalog.html',
    collection: '../collection.html',
    game: '../game.html',
    dex: '../dex.html',
    calculator: '../calculator.html',
    breeding: '../calc/index.html',
    tutorial: '../tutorial/index.html',
    farm: '../learn-farm.html',
    admin: '../admin-kv.html',
};

const state = {
    version: GAME_VERSION,
    player: { name: 'Player', location: 'title', gold: 0 },
    unlocked: {
        shop: true, dex: true, tutorial: true, admin: true,
        collection: false, game: false, calculator: false, breeding: false, farm: false,
    },
    tutorial: { completed: false, step: 0 },
    firstTime: true,
};

const tutorialSteps = [
    { title: '🎉 Welcome to Serpent Town!', text: 'This is your new home for breeding snakes. Let\'s explore!' },
    { title: '🏪 The Shop', text: 'Visit the shop to buy your first snake via Stripe!' },
    { title: '📖 Snake Dex', text: 'Learn about species and morphs. Just like a Pokédex!' },
    { title: '✅ Ready!', text: 'Explore the town and start your journey!' },
];

document.addEventListener('DOMContentLoaded', () => {
    loadGame();
    setupEventListeners();
    updateUI();
    switchScreen(state.firstTime ? 'title' : 'town');
});

function setupEventListeners() {
    document.getElementById('btn-start')?.addEventListener('click', () => {
        state.firstTime = false;
        saveGame();
        switchScreen('town');
        showTutorial();
    });

    document.getElementById('btn-continue')?.addEventListener('click', () => switchScreen('town'));

    document.querySelectorAll('.building').forEach(b => {
        b.addEventListener('click', () => {
            const id = b.dataset.module;
            if (state.unlocked[id]) openModule(id);
            else alert('🔒 Locked! Complete tasks to unlock.');
        });
    });

    document.getElementById('btn-tutorial-next')?.addEventListener('click', nextTutorialStep);
    document.getElementById('btn-tutorial-skip')?.addEventListener('click', closeTutorial);
}

function switchScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(`screen-${id}`)?.classList.add('active');
    state.player.location = id;
    saveGame();
}

function openModule(id) {
    if (MODULES[id]) window.location.href = MODULES[id];
}

function showTutorial() {
    if (state.tutorial.completed) return;
    state.tutorial.step = 0;
    document.getElementById('tutorial-overlay').style.display = 'flex';
    updateTutorialUI();
}

function nextTutorialStep() {
    state.tutorial.step++;
    if (state.tutorial.step >= tutorialSteps.length) closeTutorial();
    else updateTutorialUI();
}

function updateTutorialUI() {
    const step = tutorialSteps[state.tutorial.step];
    document.getElementById('tutorial-title').textContent = step.title;
    document.getElementById('tutorial-text').textContent = step.text;
    if (state.tutorial.step === tutorialSteps.length - 1) {
        document.getElementById('btn-tutorial-next').textContent = 'Finish';
    }
}

function closeTutorial() {
    state.tutorial.completed = true;
    document.getElementById('tutorial-overlay').style.display = 'none';
    saveGame();
}

function updateUI() {
    const continueBtn = document.getElementById('btn-continue');
    if (continueBtn && !state.firstTime) continueBtn.style.display = 'inline-block';

    document.querySelectorAll('.building').forEach(b => {
        b.classList.toggle('locked', !state.unlocked[b.dataset.module]);
    });
}

function saveGame() {
    localStorage.setItem(SAVE_KEY, JSON.stringify(state));
}

function loadGame() {
    const saved = localStorage.getItem(SAVE_KEY);
    if (saved) {
        Object.assign(state, JSON.parse(saved));
        if (state.version !== GAME_VERSION) {
            state.version = GAME_VERSION;
            saveGame();
        }
    }
}

window.smriGame = { state, saveGame, switchScreen, openModule, MODULES };
console.log('🐍 SMRI Game v' + GAME_VERSION + ' loaded');
