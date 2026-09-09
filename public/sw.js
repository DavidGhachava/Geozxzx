const CACHE = 'geo-pwa-v6';
const CORE = [
  '/',
  '/offline.html',
  '/manifest.webmanifest',
  '/favicon.svg',
  '/pwa-192.png',
  '/pwa-512.png',
  '/data/word-library-extended.json',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => cache.addAll(CORE))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      caches
        .keys()
        .then((keys) =>
          Promise.all(
            keys
              .filter((key) => key.startsWith('geo-pwa-') && key !== CACHE)
              .map((key) => caches.delete(key)),
          ),
        ),
      self.registration.navigationPreload?.enable(),
    ]).then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin || url.pathname.startsWith('/api/'))
    return;

  if (request.mode === 'navigate') {
    event.respondWith(
      (async () => {
        try {
          const response =
            (await event.preloadResponse) || (await fetch(request));
          if (response.ok) {
            const responseForCache = response.clone();
            const cache = await caches.open(CACHE);
            await cache.put(request, responseForCache);
          }
          return response;
        } catch {
          return (
            (await caches.match(request)) ||
            (await caches.match('/')) ||
            (await caches.match('/offline.html'))
          );
        }
      })(),
    );
    return;
  }

  if (
    url.pathname.startsWith('/data/') ||
    ['style', 'script', 'image', 'font', 'audio'].includes(request.destination)
  ) {
    event.respondWith(
      (async () => {
        try {
          const response = await fetch(request);
          if (response.ok) {
            const responseForCache = response.clone();
            const cache = await caches.open(CACHE);
            await cache.put(request, responseForCache);
          }
          return response;
        } catch {
          return (await caches.match(request)) || Response.error();
        }
      })(),
    );
  }
});
