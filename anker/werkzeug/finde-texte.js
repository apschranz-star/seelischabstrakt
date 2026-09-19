/*
 * Sucht die Oberflaechentexte, die noch fest in app.js stehen.
 *
 *     node werkzeug/finde-texte.js            Liste und Zaehlung
 *     node werkzeug/finde-texte.js --json     dieselbe Liste als JSON
 *
 * Der Inhalt der App liegt laengst in inhalt-<sprache>.js. Die Oberflaeche
 * nicht: Knoepfe, Beschriftungen und Meldungen stecken noch als deutsche
 * Zeichenketten im Code. Dieses Werkzeug zeigt, welche das sind, damit man
 * beim Uebersetzen keine uebersieht und den Fortschritt zaehlen kann.
 *
 * Zwei Fundarten:
 *   str   eine Zeichenkette in Anfuehrungszeichen, leicht zu ersetzen
 *   tpl   Text in einer Backtick-Vorlage zwischen zwei Tags, aufwendiger,
 *         weil daraus ${T("...")} werden muss
 */
const fs = require("fs");
const path = require("path");

const quelle = fs.readFileSync(path.join(__dirname, "..", "app.js"), "utf8");

/* Was Technik ist und keine Sprache. */
const AUSSCHLUSS = new Set(["use strict", "hinweis rot", "hinweis", "beforeend",
  "afterbegin", "Anker", "T12:00:00", "2-digit", "long", "short", "numeric"]);
const TECHNIK = /^(#\/|https?:|\.\/|tel:|anker-|application\/|data-)/;
const DEUTSCH = /[A-ZÄÖÜ][a-zäöüß]{2,}|[a-zäöüß]{3,}\s+[a-zäöüß]{2,}|aeh|oeh|ueh|ss/;

function technik(t) {
  if (AUSSCHLUSS.has(t) || TECHNIK.test(t)) return true;
  if (t.includes("${")) return true;
  if (/^[a-z][a-z0-9-]*( [a-z][a-z0-9-]*)*$/.test(t)) return true;  // CSS-Klassen
  if (/^[a-zA-Z]+$/.test(t) && t[0] === t[0].toLowerCase()) return true;
  return false;
}

const gefunden = new Map();
function merke(roh, art, stelle) {
  const t = roh.trim();
  if (t.length < 3 || technik(t) || !DEUTSCH.test(t)) return;
  if (!gefunden.has(t)) gefunden.set(t, { art: new Set(), zeilen: [] });
  gefunden.get(t).art.add(art);
  gefunden.get(t).zeilen.push(quelle.slice(0, stelle).split("\n").length);
}

for (const m of quelle.matchAll(/"((?:[^"\\\n]|\\.){3,})"/g)) merke(m[1], "str", m.index);
for (const m of quelle.matchAll(/`([^`]*)`/g)) {
  for (const t of m[1].matchAll(/>([^<>{}$]+)</g)) merke(t[1], "tpl", m.index);
}

const liste = [...gefunden.entries()].map(([text, v]) => ({
  text, art: [...v.art].sort().join("+"), zeile: v.zeilen[0], treffer: v.zeilen.length,
}));

if (process.argv.includes("--json")) {
  console.log(JSON.stringify(liste, null, 1));
} else {
  liste.sort((a, b) => a.zeile - b.zeile).forEach((x) => {
    console.log(`${String(x.zeile).padStart(5)} ${x.art.padEnd(7)} ${x.text.replace(/\s+/g, " ").slice(0, 92)}`);
  });
  const str = liste.filter((x) => x.art === "str").length;
  const tpl = liste.filter((x) => x.art === "tpl").length;
  const zeichen = liste.reduce((n, x) => n + x.text.length, 0);
  console.log(`\n${liste.length} Texte, ${zeichen} Zeichen. In Zeichenketten: ${str}. In Vorlagen: ${tpl}. Beides: ${liste.length - str - tpl}.`);
}
