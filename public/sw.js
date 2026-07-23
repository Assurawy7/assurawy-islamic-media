// Assurawy Islamic Media — service worker
//
// Deliberately conservative caching, appropriate for an app with
// authentication, payments, and per-student data:
//   - Static build assets (/_next/static/*, /icons/*, fonts) — cache-first,
//     since these are content-hashed and safe to cache aggressively.
//   - Navigations (HTML pages) — network-first, falling back to the cached
//     copy (or the offline page) only when the network is unavailable, so
//     signed-in users never see stale dashboard/course data by default.
//   - EVERYTHING under /api/ — always network, NEVER cached. This is
//     non-negotiable: caching auth, payment, or enrollment responses could
//     serve stale session state or double-submit a payment.

const STATIC_CACHE = "assurawy-static-v1";
const OFFLINE_URL = "/offline.html";

const PRECACHE_URLS = [
  OFFLINE_URL,
  "/icons/icon-192.png",
  "/icons/icon-512.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => cache.addAll(PRECACHE_URLS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => k !== STATIC_CACHE).map((k) => caches.delete(k)))
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Never intercept API calls — always hit the network directly.
  if (url.pathname.startsWith("/api/")) return;

  // Only handle same-origin GET requests beyond this point.
  if (request.method !== "GET" || url.origin !== self.location.origin) return;

  // Next.js build assets and our icon set: cache-first (immutable, hashed URLs).
  if (url.pathname.startsWith("/_next/static/") || url.pathname.startsWith("/icons/")) {
    event.respondWith(
      caches.match(request).then(
        (cached) =>
          cached ||
          fetch(request).then((res) => {
            const clone = res.clone();
            caches.open(STATIC_CACHE).then((cache) => cache.put(request, clone));
            return res;
          })
      )
    );
    return;
  }

  // Page navigations: network-first, offline page as the last resort.
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request).catch(() => caches.match(OFFLINE_URL))
    );
    return;
  }
});
