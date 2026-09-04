const CACHE = 'geo-pwa-v3';
const CORE = [
  '/',
  '/offline.html',
  '/manifest.webmanifest',
  '/favicon.svg',
  '/pwa-192.png',
  '/pwa-512.png',
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
            const cache = await caches.open(CACHE);
            void cache.put(request, response.clone());
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

  if (['style', 'script', 'image', 'font'].includes(request.destination)) {
    event.respondWith(
      caches.match(request).then((cached) => {
        const fresh = fetch(request)
          .then((response) => {
            if (response.ok)
              void caches
                .open(CACHE)
                .then((cache) => cache.put(request, response.clone()));
            return response;
          })
          .catch(() => cached);
        return cached || fresh;
      }),
    );
  }
});
