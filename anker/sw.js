/*
 * Der Service Worker. Er macht Anker offline benutzbar.
 *
 * Alles, was die App braucht, wird beim ersten Besuch einmal abgelegt und danach
 * zuerst aus dem Speicher bedient. Das ist hier nicht nur Bequemlichkeit: die App
 * soll im Zug, im Wartezimmer und im Flugmodus laufen, und sie soll nie den
 * Eindruck erwecken, sie braeuchte das Netz, um die eigenen Eintraege zu zeigen.
 *
 * Es geht nie eine Anfrage an einen fremden Server. Der Worker faengt nur
 * Anfragen an die eigene Adresse ab und laesst alles andere in Ruhe; die
 * Sicherheitsregel im Dokument verbietet ohnehin jede Verbindung nach draussen.
 */

const VERSION = "anker-v1";
const DATEIEN = [
  "./",
  "./index.html",
  "./app.css",
  "./app.js",
  "./content.js",
  "./icon.svg",
  "./icon-180.png",
  "./icon-192.png",
  "./icon-512.png",
  "./icon-512-maskable.png",
  "./manifest.webmanifest",
];

/*
 * Der Zugang. Die beiden Dateien gibt es nur in der veroeffentlichten Fassung,
 * lokal nicht. addAll ist alles oder nichts: eine fehlende Datei liesse die
 * ganze Ablage scheitern und die App waere nie offline da. Deshalb stehen sie
 * hier getrennt und werden einzeln abgelegt, jede fuer sich und ohne Folgen,
 * wenn sie fehlt.
 */
const VIELLEICHT = ["./zugang.js", "./zugang.css"];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(VERSION)
      .then((c) =>
        c.addAll(DATEIEN).then(() =>
          Promise.all(VIELLEICHT.map((d) => c.add(d).catch(() => {}))),
        ),
      )
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((namen) => Promise.all(namen.filter((n) => n !== VERSION).map((n) => caches.delete(n))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);
  if (e.request.method !== "GET" || url.origin !== self.location.origin) return;

  e.respondWith(
    caches.match(e.request, { ignoreSearch: true }).then((treffer) => {
      if (treffer) {
        // Im Hintergrund nachsehen, ob es etwas Neueres gibt. Schlaegt das fehl,
        // etwa ohne Netz, bleibt die abgelegte Fassung stehen.
        fetch(e.request)
          .then((antwort) => {
            if (antwort && antwort.ok) caches.open(VERSION).then((c) => c.put(e.request, antwort.clone()));
          })
          .catch(() => {});
        return treffer;
      }
      return fetch(e.request).catch(() => caches.match("./index.html"));
    }),
  );
});
