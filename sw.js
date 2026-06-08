// sw.js - CloserKE (Safe Version)
const CACHE_NAME = 'closerke-v2';

// Only cache these specific files
const FILES_TO_CACHE = [
  '/',
  '/index.html'
];

// Install
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Activate
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

// Fetch - SIMPLE STRATEGY
self.addEventListener('fetch', (event) => {
  // Skip Cloudinary media - never cache, never block
  const url = event.request.url;
  if (url.includes('cloudinary.com') || url.match(/\.(mp4|webm|mp3)$/i)) {
    // Let the browser handle normally
    return;
  }
  
  // For everything else: try network first, fallback to cache
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Cache a copy of successful responses
        if (response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        // Offline: serve from cache
        return caches.match(event.request);
      })
  );
});
