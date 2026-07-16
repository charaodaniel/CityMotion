/**
 * CityMotion Service Worker v2
 * Estratégias:
 *   - Cache-first: assets estáticos (JS, CSS, imagens, fontes)
 *   - Network-first: chamadas API
 *   - Stale-while-revalidate: páginas HTML (app.html, index.html)
 *   - Fallback: offline.html quando sem conexão
 */
const CACHE_NAME = 'citymotion-v2';
const STATIC_CACHE = 'citymotion-static-v2';
const API_CACHE = 'citymotion-api-v2';

const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/app.html',
  '/offline.html',
  '/manifest.json',
  '/css/styles.css',
  '/css/tailwind.css',
  '/js/api.js',
  '/js/store.js',
  '/js/app.js',
  '/js/toast.js',
  '/js/ws.js',
  '/js/pwa-install.js',
  '/icons/icon-192.svg',
  '/icons/icon-512.svg',
  '/icons/icon-maskable.svg',
];

// ─── Instalação ────────────────────────────────────
self.addEventListener('install', (event) => {
  event.waitUntil(
    Promise.all([
      caches.open(CACHE_NAME).then((cache) => {
        return cache.addAll(PRECACHE_ASSETS);
      }),
      caches.open(STATIC_CACHE),
      caches.open(API_CACHE),
    ])
  );
  // Não fazer skipWaiting automaticamente — o PWA installer gerencia
  // self.skipWaiting();
});

// ─── Ativação ──────────────────────────────────────
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME && key !== STATIC_CACHE && key !== API_CACHE)
          .map((key) => caches.delete(key))
      );
    }).then(() => {
      // Notificar todos os clients sobre a atualização
      return self.clients.matchAll();
    }).then((clients) => {
      clients.forEach((client) => {
        client.postMessage({ type: 'SW_UPDATED' });
      });
    })
  );
  self.clients.claim();
});

// ─── Estratégias de Cache ──────────────────────────

/** Cache-first: usa cache, busca rede se não encontrado */
async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;

  try {
    const response = await fetch(request);
    if (response && response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    // Só retornar offline.html para navegação HTML
    // Para JS/CSS/JSON, retornar 503 para evitar erro de parse
    if (request.headers.get('Accept')?.includes('text/html')) {
      return caches.match('/offline.html');
    }
    return new Response(null, { status: 503 });
  }
}

/** Network-first: busca rede, fallback para cache */
async function networkFirst(request) {
  try {
    const response = await fetch(request);
    if (response && response.ok) {
      const cache = await caches.open(API_CACHE);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await caches.match(request);
    if (cached) return cached;
    // Se for requisição de página HTML, mostrar offline
    if (request.headers.get('Accept')?.includes('text/html')) {
      return caches.match('/offline.html');
    }
    return new Response(JSON.stringify({ error: 'offline' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

/** Stale-while-revalidate: serve cache, atualiza em background */
async function staleWhileRevalidate(request) {
  const cached = await caches.match(request);
  const fetchPromise = fetch(request).then((response) => {
    if (response && response.ok) {
      const cache = caches.open(CACHE_NAME);
      cache.then((c) => c.put(request, response.clone()));
    }
    return response;
  }).catch(() => cached);

  return cached || fetchPromise;
}

// ─── Interceptar Requisições ───────────────────────
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Ignorar apenas mesmo domínio (não cachear CDN/analytics externos)
  if (url.origin !== self.location.origin) {
    event.respondWith(fetch(request).catch(() => caches.match(request)));
    return;
  }

  // Ignorar métodos não-GET
  if (request.method !== 'GET') {
    event.respondWith(fetch(request).catch(() => new Response(null, { status: 503 })));
    return;
  }

  // Ignorar conexões WebSocket
  if (url.protocol === 'ws:' || url.protocol === 'wss:') {
    return;
  }

  // ─── API: network-first ───
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(networkFirst(request));
    return;
  }

  // ─── Páginas HTML: network-first com fallback offline ───
  if (url.pathname.endsWith('.html') || url.pathname === '/' || !url.pathname.includes('.')) {
    event.respondWith(networkFirst(request));
    return;
  }

  // ─── Módulos JS dinâmicos (import()): cache-first ───
  if (url.pathname.startsWith('/js/pages/')) {
    event.respondWith(cacheFirst(request));
    return;
  }

  // ─── Assets estáticos (JS, CSS, imagens, ícones): cache-first ───
  if (
    url.pathname.startsWith('/js/') ||
    url.pathname.startsWith('/css/') ||
    url.pathname.startsWith('/icons/') ||
    url.pathname.startsWith('/fonts/') ||
    url.pathname.startsWith('/images/')
  ) {
    event.respondWith(cacheFirst(request));
    return;
  }

  // ─── Manifest, SW: stale-while-revalidate ───
  if (url.pathname.endsWith('.json') || url.pathname.endsWith('.webmanifest')) {
    event.respondWith(staleWhileRevalidate(request));
    return;
  }

  // ─── Default: network-first ───
  event.respondWith(networkFirst(request));
});

// ─── Mensagens do Client ───────────────────────────
self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data?.type === 'CLEAR_CACHE') {
    caches.keys().then((keys) => {
      return Promise.all(keys.map((key) => caches.delete(key)));
    }).then(() => {
      event.ports?.[0]?.postMessage({ type: 'CACHE_CLEARED' });
    });
  }
});
