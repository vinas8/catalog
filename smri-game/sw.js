// SMRI Game Service Worker
const CACHE_NAME = 'smri-game-v0.1.0';
const urlsToCache = [
  '/catalog/smri-game/',
  '/catalog/smri-game/index.html',
  '/catalog/smri-game/styles.css',
  '/catalog/smri-game/game.js',
  '/catalog/smri-game/manifest.json',
  '/catalog/smri-game/data/modules.json',
  '/catalog/img/icon-192.png',
  '/catalog/img/icon-512.png'
];

// Install - cache assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting())
  );
});

// Activate - clean old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch - serve from cache, fallback to network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
      .catch(() => caches.match('/catalog/smri-game/index.html'))
  );
});
