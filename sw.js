const CACHE_NAME = 'ecotrack-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/css/main.css',
  '/css/components.css',
  '/css/pages.css',
  '/manifest.json',
  '/js/data/emission-factors.js',
  '/js/data/recommendations.js',
  '/js/data/offsets.js',
  '/js/data/eco-scores.js',
  '/js/firebase-config.js',
  '/js/services/auth.js',
  '/js/services/firestore.js',
  '/js/services/calculator.js',
  '/js/components/navbar.js',
  '/js/components/charts.js',
  '/js/components/cards.js',
  '/js/components/modal.js',
  '/js/components/forms.js',
  '/js/tests.js',
  '/js/pages/home.js',
  '/js/pages/calculator.js',
  '/js/pages/dashboard.js',
  '/js/pages/actions.js',
  '/js/pages/offset.js',
  '/js/pages/ecoscore.js',
  '/js/pages/education.js',
  '/js/app.js'
];

// Install event - Cache core assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Activate event - Clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - Network first, falling back to cache
self.addEventListener('fetch', (event) => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return;
  // Ignore Firebase API and non-http requests
  if (!event.request.url.startsWith('http') || event.request.url.includes('identitytoolkit') || event.request.url.includes('firestore')) return;

  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        // Optionally clone and cache new dynamic assets here if needed
        return networkResponse;
      })
      .catch(() => {
        // Fallback to cache if network fails (offline mode)
        return caches.match(event.request);
      })
  );
});
