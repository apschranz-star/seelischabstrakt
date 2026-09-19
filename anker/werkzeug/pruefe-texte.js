/*
 * Prueft, ob jeder Oberflaechentext, den app.js ueber T() anfordert, in jeder
 * angebotenen Sprache auch wirklich dasteht.
 *
 *     node werkzeug/pruefe-texte.js
 *
 * WARUM ES DAS BRAUCHT
 * Der Schluessel ist der deutsche Satz selbst. Das ist bequem und sicher beim
 * Umbau, hat aber eine Falle: aendert jemand in app.js ein Wort an einem
 * deutschen Satz, findet T() den Eintrag nicht mehr und zeigt still den
 * deutschen Text. Die App bleibt heil, die Uebersetzung faellt lautlos aus.
 * Genau das faengt dieses Werkzeug ab.
 */
const fs = require("fs");
const path = require("path");
const wurzel = path.join(__dirname, "..");

const app = fs.readFileSync(path.join(wurzel, "app.js"), "utf8");

/* Alle Schluessel, die app.js ueber T("...") anfordert. */
const verlangt = new Set();
for (const m of app.matchAll(/\bT\(\s*"((?:[^"\\]|\\.)*)"\s*\)/g)) {
  verlangt.add(m[1].replace(/\\"/g, '"').replace(/\\\\/g, "\\"));
}

/* Welche Sprachen die App ueberhaupt anbietet. */
const fertig = (app.match(/const OBERFLAECHE_FERTIG = \[([^\]]*)\]/) || [, '"de"'])[1]
  .split(",").map((s) => s.trim().replace(/"/g, "")).filter(Boolean);

function ui(code) {
  if (code === "de") return null;                       // Deutsch ist der Schluessel selbst
  const datei = path.join(wurzel, `inhalt-${code}.js`);
  if (!fs.existsSync(datei)) return undefined;
  const sb = { INHALT: {} };
  new Function("window", fs.readFileSync(datei, "utf8"))(sb);
  return (sb.INHALT[code] || {}).ui || {};
}

console.log(`app.js verlangt ${verlangt.size} Oberflaechentexte.`);
console.log(`Angeboten werden: ${fertig.join(", ")}\n`);

let schlimm = 0;
for (const code of fertig) {
  const tabelle = ui(code);
  if (tabelle === null) { console.log(`${code}: ist die Schluesselsprache, nichts nachzusehen.`); continue; }
  if (tabelle === undefined) { console.log(`${code}: FEHLER, inhalt-${code}.js fehlt.`); schlimm++; continue; }
  const fehlt = [...verlangt].filter((k) => !(k in tabelle));
  const tot = Object.keys(tabelle).filter((k) => !verlangt.has(k));
  if (!fehlt.length && !tot.length) { console.log(`${code}: alle ${verlangt.size} Texte da, keine toten Eintraege.`); continue; }
  schlimm++;
  console.log(`${code}: FEHLER`);
  if (fehlt.length) {
    console.log(`  fehlen (${fehlt.length}), die App zeigt dort Deutsch:`);
    fehlt.slice(0, 15).forEach((k) => console.log(`    ${k.slice(0, 84)}`));
    if (fehlt.length > 15) console.log(`    ... und ${fehlt.length - 15} weitere`);
  }
  if (tot.length) {
    console.log(`  tote Eintraege (${tot.length}), niemand fragt sie ab:`);
    tot.slice(0, 10).forEach((k) => console.log(`    ${k.slice(0, 84)}`));
  }
}
process.exit(schlimm ? 1 : 0);
