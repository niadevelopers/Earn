// sw.js - CloserKE Offline Service Worker
// Cache name - increment version to force updates
const CACHE_NAME = 'closerke-v1';

// Files to cache for offline access
const FILES_TO_CACHE = [
  './',
  './index.html',
  './app.js',
  './media.js',
  './manifest.json',  // optional - create one for better PWA experience
  // Fonts and critical assets
  'https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=Instrument+Sans:ital,wght@0,400;0,500;0,600;1,400&family=Fira+Code:wght@400;500&display=swap'
];

// Install event - cache core files
self.addEventListener('install', (event) => {
  console.log('[SW] Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Caching core files');
        return cache.addAll(FILES_TO_CACHE);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  const requestUrl = new URL(event.request.url);
  
  // STRATEGY 1: Cloudinary media - NETWORK FIRST (never cache)
  // These require internet to stream
  if (requestUrl.hostname.includes('cloudinary.com') || 
      requestUrl.pathname.match(/\.(mp4|webm|mp3|wav)$/i)) {
    event.respondWith(
      fetch(event.request).catch(() => {
        // Return offline placeholder for media
        return new Response(
          '<html><body style="text-align:center; padding:40px; font-family:sans-serif;"><h2>📡 No Internet Connection</h2><p>Videos and audio require an internet connection to play.</p><p>Check your connection and try again.</p><button onclick="location.reload()">Retry</button></body></html>',
          { headers: { 'Content-Type': 'text/html' } }
        );
      })
    );
    return;
  }
  
  // STRATEGY 2: External fonts - CACHE FIRST, fallback to network
  if (requestUrl.hostname.includes('fonts.googleapis.com') ||
      requestUrl.hostname.includes('fonts.gstatic.com')) {
    event.respondWith(
      caches.match(event.request)
        .then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          return fetch(event.request).then((networkResponse) => {
            return caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, networkResponse.clone());
              return networkResponse;
            });
          });
        })
    );
    return;
  }
  
  // STRATEGY 3: HTML pages - NETWORK FIRST, fallback to cached HTML
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          // Cache the fresh version
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
        })
        .catch(() => {
          // Offline: serve cached index.html
          return caches.match('./index.html');
        })
    );
    return;
  }
  
  // STRATEGY 4: All other assets (JS, CSS, images) - CACHE FIRST
  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          // Return cached version
          return cachedResponse;
        }
        
        // Not in cache - fetch from network
        return fetch(event.request).then((networkResponse) => {
          // Don't cache non-successful responses
          if (!networkResponse || networkResponse.status !== 200) {
            return networkResponse;
          }
          
          // Cache for future offline use
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
        });
      })
      .catch(() => {
        // Complete offline fallback for images
        if (event.request.destination === 'image') {
          return new Response(
            '<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#2d3a1f"/><text x="50%" y="50%" text-anchor="middle" fill="#c9a227" dy=".3em">📷 Offline</text></svg>',
            { headers: { 'Content-Type': 'image/svg+xml' } }
          );
        }
        
        // Default fallback
        return new Response('Offline - content not available', { status: 404 });
      })
  );
});
