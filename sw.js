// BevQuery PWA service worker
// Safe starter version: installable PWA without aggressive API caching.

const CACHE_NAME = 'bevquery-pwa-v1';
const APP_ASSETS = [
  '/bevquery-app/',
  '/bevquery-app/manifest.json',
  '/bevquery-app/icons/icon-192.png',
  '/bevquery-app/icons/icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_ASSETS)).catch(() => null)
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const request = event.request;

  // Do not cache POST/API calls. BevQuery search/login data should stay fresh.
  if (request.method !== 'GET') return;

  event.respondWith(
    fetch(request).catch(() => caches.match(request).then((cached) => cached || caches.match('/bevquery-app/')))
  );
});
