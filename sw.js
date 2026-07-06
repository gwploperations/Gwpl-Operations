// GWPL People — minimal service worker.
// Caches the app shell so it opens instantly and works if the connection drops mid-visit.
// This does NOT enable background GPS tracking — browsers only allow location
// access while the page/app is open and in the foreground (see Field Tracking page for details).

const CACHE_NAME = 'gwpl-people-v1';
const APP_SHELL = ['./index.html', './manifest.json', './icon.svg'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});
