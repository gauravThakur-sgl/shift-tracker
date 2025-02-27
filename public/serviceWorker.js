const CACHE_NAME = 'button-ui-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/clock.svg',
];
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    clients.claim(),
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

sself.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (event.request.url.endsWith('.js') || event.request.url.endsWith('.css')) {
        return cachedResponse || fetch(event.request);
      }
      return fetch(event.request).then((response) => {
        return caches.open(CACHE_NAME).then((cache) => {
          if (event.request.url.startsWith('/api/')) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      }).catch(() => cachedResponse);
    })
  );
});