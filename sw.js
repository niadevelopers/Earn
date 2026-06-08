// sw.js - CloserKE Offline Service Worker
const CACHE_NAME = 'closerke-v3';
const urlsToCache = [
  './',
  './index.html',
  './app.js',
  './media.js',
  './manifest.json'
];

// Install
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
  self.skipWaiting();
});

// Activate - clean old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.map(key => {
        if (key !== CACHE_NAME) return caches.delete(key);
      })
    ))
  );
  self.clients.claim();
});

// Fetch - network first, cache fallback (graceful)
self.addEventListener('fetch', event => {
  const url = event.request.url;
  
  // Skip Cloudinary media - let it fail gracefully
  if (url.includes('cloudinary.com') || url.match(/\.(mp4|webm|mp3)$/i)) {
    return;
  }
  
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Cache successful responses
        if (response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return response;
      })
      .catch(() => {
        // Offline fallback
        return caches.match(event.request).then(cached => {
          if (cached) return cached;
          // Return offline page for navigation requests
          if (event.request.mode === 'navigate') {
            return caches.match('./index.html');
          }
          return new Response('Offline - content not available', { status: 404 });
        });
      })
  );
});
