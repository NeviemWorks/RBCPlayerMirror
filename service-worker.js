const CACHE_NAME = "rbc-radio-cache-v2";
const urlsToCache = [
  "/RBCPlayerSimple/",
  "/RBCPlayerSimple/index.html",
  "/RBCPlayerSimple/manifest.json",
  "/RBCPlayerSimple/service-worker.js",
  "/RBCPlayerSimple/album-art-placeholder.jpg",
  "/RBCPlayerSimple/img-192.png", // Ensure favicon is cached
  "https://files.svgcdn.io/uil/play-circle.svg",
  "https://files.svgcdn.io/uil/stop-circle.svg"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async cache => {
      for (const url of urlsToCache) {
        try {
          await cache.add(url);
        } catch (error) {
          console.warn(`Failed to cache ${url}:`, error);
        }
      }
    })
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
});
