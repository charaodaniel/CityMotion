/**
 * CityMotion Service Worker
 * Estratégia: cache-first para assets, network-first para API
 */
const CACHE_NAME = 'citymotion-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/app.html',
  '/manifest.json',
  '/css/styles.css',
  '/js/api.js',
  '/js/store.js',
  '/js/app.js',
];

// Instalação: cache dos assets principais
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

// Ativação: limpar caches antigos
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// Interceptar requisições
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Ignorar métodos não-GET (POST, PUT, DELETE não devem ser cacheados)
  if (event.request.method !== 'GET') {
    event.respondWith(fetch(event.request));
    return;
  }

  // API: network-first (sempre buscar do servidor)
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, clone);
          });
          return response;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // Assets: cache-first
  event.respondWith(
    caches.match(event.request).then((cached) => {
      return cached || fetch(event.request).then((response) => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, clone);
        });
        return response;
      });
    })
  );
});
