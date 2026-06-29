const CACHE_NAME = "gameday-live-v115";
const ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./assets/icon-180.png",
  "./assets/icon-192.png",
  "./assets/icon-512.png",
  "./assets/icon-maskable-192.png",
  "./assets/icon-maskable-512.png",
  "./assets/vs-loop-v111.mp4",
  "./assets/vs-overlay-v111.png",
  "./assets/buzz.mp3",
  "./assets/gameover.mp3",
  "./assets/ready-vs.jpg",
  "./assets/timeout.png",
  "./assets/3pointer.png",
  "./assets/slamdunk.png",
  "./assets/winner.png",
  "./assets/login-bg.png"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
      .catch(() => self.skipWaiting())
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy)).catch(() => {});
        return response;
      });
    }).catch(() => caches.match("./index.html"))
  );
});
