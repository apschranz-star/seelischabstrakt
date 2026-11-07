/*
 * Offline and self-updating.
 *   - App files: cache first, refreshed in the background; a new build
 *     (new VERSIONE, stamped by tools/build.sh) replaces the cache and takes
 *     over at once, the page reloads itself when nothing is being edited.
 *   - /api/ricette: network first, last answer from cache when offline.
 *   - Heavy files (three.js, pdf.js) are cached the first time they are used.
 * Sofia's own data is not here: it lives in localStorage, never in a cache.
 */
const VERSIONE = "__VERSIONE__";
const CACHE = "sofia-" + VERSIONE;
const API = "sofia-api";
const BASE = [
  "./", "index.html", "manifest.webmanifest", "css/app.css", "fonts/fonts.css",
  "fonts/fraunces-latin-normal-300-700.woff2", "fonts/fraunces-latin-ext-normal-300-700.woff2", "fonts/fraunces-latin-italic-300-700.woff2",
  "fonts/manrope-latin-normal.woff2", "fonts/manrope-latin-ext-normal.woff2",
  "icons/icon.svg", "icons/icon-192.png", "icons/icon-512.png", "icons/apple-touch-icon.png",
  "js/main.js", "js/ctx.js", "js/ui.js", "js/i18n.js", "js/store.js", "js/cripto.js",
  "js/data/alimenti.js", "js/data/piano.js", "js/data/ricette.js", "js/data/esami.js", "js/data/esami-dati.js", "js/data/evidenze.js",
  "js/data/scelte.js", "js/data/dizionario.js", "js/data/ciqual.js", "data/piano-testo.cifrato.json",
  "js/engine/rng.js", "js/engine/planner.js", "js/engine/consiglio.js", "js/engine/stats.js", "js/engine/salute.js", "js/engine/impatti.js", "js/engine/labparse.js",
  "js/engine/nutrizione.js", "js/engine/cervello.js", "js/engine/ricerca.js",
  "js/views/comuni.js", "js/views/oggi.js", "js/views/settimana.js", "js/views/cibo.js", "js/views/salute.js", "js/views/corpo.js", "js/views/consiglio.js", "js/views/impostazioni.js",
  "js/views/diario.js", "js/views/componi.js", "js/views/miei.js", "js/views/pianotesto.js", "js/views/ricettemie.js",
  "js/three/corpo3d.js",
];
const FACOLTATIVI = ["zugang.js", "zugang.css"];

self.addEventListener("install", (e) => {
  e.waitUntil((async () => {
    const c = await caches.open(CACHE);
    await c.addAll(BASE);
    for (const f of FACOLTATIVI) { try { await c.add(f); } catch (err) { /* gate not armed in local tests */ } }
    await self.skipWaiting();
  })());
});

self.addEventListener("activate", (e) => {
  e.waitUntil((async () => {
    for (const k of await caches.keys()) if (k.startsWith("sofia-") && k !== CACHE && k !== API) await caches.delete(k);
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);
  if (e.request.method !== "GET" || url.origin !== location.origin) return;
  if (url.pathname.startsWith("/api/")) {
    e.respondWith((async () => {
      try {
        const r = await fetch(e.request);
        if (r.ok) { const c = await caches.open(API); c.put(e.request, r.clone()); }
        return r;
      } catch (err) {
        const hit = await caches.match(e.request);
        const vuota = url.pathname.startsWith("/api/alimento") ? { risultati: [], offline: true } : { libreria: { ricette: [] }, ultimo: null, offline: true };
        return hit || new Response(JSON.stringify(vuota), { status: url.pathname.startsWith("/api/alimento") ? 503 : 200, headers: { "Content-Type": "application/json" } });
      }
    })());
    return;
  }
  e.respondWith((async () => {
    const c = await caches.open(CACHE);
    const hit = await c.match(e.request, { ignoreSearch: true });
    if (hit) return hit;
    try {
      const r = await fetch(e.request);
      if (r.ok && (url.pathname.includes("/vendor/") || url.pathname.endsWith(".js") || url.pathname.endsWith(".mjs"))) c.put(e.request, r.clone());
      return r;
    } catch (err) {
      if (e.request.mode === "navigate") return (await c.match("index.html")) || Response.error();
      return Response.error();
    }
  })());
});
