const CACHE = "dakkai-v4-organizado";
const APP_SHELL = [
  "./",
  "./index.html",
  "./styles.css",
  "./config.js",
  "./script.js",
  "./manifest.webmanifest",
  "./assets/logo-dakkai.webp",
  "./assets/logo-dakkai.png",
  "./assets/favicon-64.png",
  "./assets/dakkai-hero-oficial.webp",
  "./assets/dakkai-hero-oficial-mobile.webp",
  "./assets/dakkai-experiencia-oficial.webp",
  "./assets/dakkai-experiencia-oficial-mobile.webp",
  "./assets/dakkai-galeria-sushi-mar.webp",
  "./assets/dakkai-galeria-prato-quente.webp",
  "./assets/icon-192.png",
  "./assets/icon-512.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  const requestUrl = new URL(event.request.url);
  const isFreshFile =
    event.request.mode === "navigate" ||
    /\.(?:html|css|js|webmanifest)$/.test(requestUrl.pathname);

  if (isFreshFile) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(CACHE).then((cache) => cache.put(event.request, copy));
          }
          return response;
        })
        .catch(() => caches.match(event.request).then((cached) => cached || caches.match("./index.html")))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).then((response) => {
        if (response.ok) {
          const copy = response.clone();
          caches.open(CACHE).then((cache) => cache.put(event.request, copy));
        }
        return response;
      });
    })
  );
});
