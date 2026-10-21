/* ==========================================================================
   Magos Burgers & Shakes — service worker
   Strategy:
     • App shell (HTML/JS/CSS/fonts/icons) — cache-first, refreshed in the
       background so a new deploy lands on the next open.
     • Navigations — network-first with a cached shell fallback, so the app
       always opens, online or not.
     • Menu data lives inside app.js, so caching the shell caches the menu.
   ========================================================================== */

const VERSION = "v1.0.5";
const SHELL_CACHE = "magos-shell-" + VERSION;
const RUNTIME_CACHE = "magos-runtime-" + VERSION;

const SHELL = [
  "./",
  "./index.html",
  "./app.v105.js",
  "./manifest.json",
  "./assets/anton-latin.woff2",
  "./assets/dmsans-latin.woff2",
  "./icons/icon-16.png",
  "./icons/icon-32.png",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/icon-maskable-512.png",
  "./icons/apple-touch-icon.png"
];

/* ---------- install: precache the shell ---------- */
self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(SHELL_CACHE);
      // addAll fails the whole install if one file 404s — add individually
      // so a single miss can't break the app.
      await Promise.all(
        SHELL.map((url) =>
          cache.add(new Request(url, { cache: "reload" })).catch((err) => {
            console.warn("[sw] could not precache", url, err);
          })
        )
      );
      await self.skipWaiting();
    })()
  );
});

/* ---------- activate: drop old versions ---------- */
self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter((k) => k.startsWith("magos-") && k !== SHELL_CACHE && k !== RUNTIME_CACHE)
          .map((k) => caches.delete(k))
      );
      if (self.registration.navigationPreload) {
        try { await self.registration.navigationPreload.disable(); } catch (e) {}
      }
      await self.clients.claim();
    })()
  );
});

/* ---------- fetch ---------- */
self.addEventListener("fetch", (event) => {
  const req = event.request;

  // Only same-origin GETs are ours to handle.
  if (req.method !== "GET") return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return; // let WhatsApp / Maps go to the network

  // 1. Navigations → network first, cached shell offline
  if (req.mode === "navigate") {
    event.respondWith(
      (async () => {
        try {
          const fresh = await fetch(req);
          const cache = await caches.open(SHELL_CACHE);
          cache.put("./index.html", fresh.clone());
          return fresh;
        } catch (err) {
          const cache = await caches.open(SHELL_CACHE);
          return (
            (await cache.match("./index.html")) ||
            (await cache.match("./")) ||
            new Response(
              "<!doctype html><meta charset=utf-8><title>Offline</title>" +
                "<body style='font-family:system-ui;padding:2rem;background:#14110D;color:#F7EFDE'>" +
                "<h1 style='font-family:sans-serif'>You're offline</h1>" +
                "<p>Reconnect once and the Magos app will work offline from then on.</p></body>",
              { headers: { "Content-Type": "text/html; charset=utf-8" }, status: 200 }
            )
          );
        }
      })()
    );
    return;
  }

  // 2. Everything else → cache first, then network (and cache the result)
  event.respondWith(
    (async () => {
      const cached = await caches.match(req, { ignoreSearch: true });
      if (cached) {
        // Refresh in the background, but never block the response.
        event.waitUntil(
          (async () => {
            try {
              const fresh = await fetch(req);
              if (fresh && fresh.ok) {
                const cache = await caches.open(RUNTIME_CACHE);
                cache.put(req, fresh.clone());
              }
            } catch (e) { /* offline: the cached copy stands */ }
          })()
        );
        return cached;
      }

      try {
        const fresh = await fetch(req);
        if (fresh && fresh.ok) {
          const cache = await caches.open(RUNTIME_CACHE);
          cache.put(req, fresh.clone());
        }
        return fresh;
      } catch (err) {
        // Last resort for an uncached image/font while offline.
        return new Response("", { status: 504, statusText: "Offline" });
      }
    })()
  );
});

/* ---------- allow the page to trigger an update ---------- */
self.addEventListener("message", (event) => {
  if (event.data === "SKIP_WAITING") self.skipWaiting();
});
