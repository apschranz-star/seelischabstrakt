/*
 * Prueft module.js, rezepte.js und aktuell.js, ohne Browser.
 *
 *     node werkzeug/pruefe-module.js
 *
 * WAS SCHIEFGEHEN KANN
 * 1. Ein Text steht nur auf Deutsch. Dann zeigt die englische App an dieser
 *    Stelle Deutsch, und niemand merkt es, solange niemand umschaltet.
 * 2. Ein Zeichen oder Laborwert ist genannt, aber nirgends erklaert. Dann
 *    steht in der App der rohe Schluessel.
 * 3. Eine Frage des Tages hat Antworten ohne Ton. Dann faerbt das Segment
 *    nicht und die Arztmappe weiss nicht, welche Tage schlecht waren.
 * 4. Ein Rezept nennt ein Merkmal, das die App nicht kennt, oder hat eine
 *    doppelte id. Die id ist der Schluessel fuer "Gemerkt".
 * 5. aktuell.js ist kaputt oder leer. Dann fehlt die Forschungsuebersicht.
 */
const fs = require("fs");
const path = require("path");
const wurzel = path.join(__dirname, "..");

function laden(datei) {
  const sb = { INHALT: {} };
  new Function("window", fs.readFileSync(path.join(wurzel, datei), "utf8"))(sb);
  return sb;
}

const de = laden("inhalt-de.js").INHALT.de;
const { ANKER_MODULE: MODULE, ANKER_GRUND: GRUND } = laden("module.js");
const { ANKER_REZEPTE: REZ } = laden("rezepte.js");

const fehler = [];
const zwei = (o, wo) => {
  if (!o || typeof o !== "object") return fehler.push(`${wo}: kein Text`);
  for (const l of ["de", "en"]) {
    const v = o[l];
    const leer = v == null || (Array.isArray(v) ? !v.length || v.some((x) => !String(x).trim()) : !String(v).trim());
    if (leer) fehler.push(`${wo}: ${l} fehlt`);
  }
  if (Array.isArray(o.de) && Array.isArray(o.en) && o.de.length !== o.en.length) {
    fehler.push(`${wo}: de hat ${o.de.length} Eintraege, en ${o.en.length}`);
  }
};

const ids = new Set();
const eigeneLabor = new Set();
MODULE.forEach((m) => (m.eigeneLabor || []).forEach((w) => eigeneLabor.add(w.schluessel)));
const labor = new Set(de.laborwerte.map((w) => w.schluessel).concat([...eigeneLabor]));

MODULE.forEach((m) => {
  const w = `Modul ${m.id}`;
  if (!/^[a-z]+$/.test(m.id)) fehler.push(`${w}: id nur aus Kleinbuchstaben`);
  if (ids.has(m.id)) fehler.push(`${w}: id doppelt`);
  ids.add(m.id);
  if (!/^#[0-9a-f]{6}$/i.test(m.farbe)) fehler.push(`${w}: farbe ist kein #rrggbb`);
  ["name", "kurz", "beschreibung"].forEach((k) => zwei(m[k], `${w}.${k}`));
  (m.skalen || []).forEach((s, i) => ["name", "links", "rechts"].forEach((k) => zwei(s[k], `${w}.skalen[${i}].${k}`)));
  (m.checks || []).forEach((c, i) => {
    zwei(c.frage, `${w}.checks[${i}].frage`);
    c.optionen.forEach((o, j) => {
      zwei(o.text, `${w}.checks[${i}].optionen[${j}]`);
      if (!["gut", "mittel", "schlecht"].includes(o.ton)) fehler.push(`${w}.checks[${i}].optionen[${j}]: ton fehlt`);
    });
  });
  const eigene = new Set((m.eigeneZeichen || []).map((z) => z.schluessel));
  (m.eigeneZeichen || []).forEach((z, i) => zwei(z, `${w}.eigeneZeichen[${i}]`));
  (m.zeichen || []).forEach((z) => {
    const bekannt = de.symptome.includes(z) || eigene.has(z) || MODULE.some((x) => (x.eigeneZeichen || []).some((y) => y.schluessel === z));
    if (!bekannt) fehler.push(`${w}: Zeichen "${z}" ist nirgends erklaert`);
  });
  (m.labor || []).forEach((l) => { if (!labor.has(l)) fehler.push(`${w}: Laborwert "${l}" ist nirgends erklaert`); });
  (m.eigeneLabor || []).forEach((l, i) => ["name", "gruppe", "bedeutung"].forEach((k) => zwei(l[k], `${w}.eigeneLabor[${i}].${k}`)));
  (m.essen || []).forEach((p, i) => {
    zwei(p.was, `${w}.essen[${i}].was`);
    zwei(p.warum, `${w}.essen[${i}].warum`);
    if (!["weg", "vorsicht", "gut"].includes(p.art)) fehler.push(`${w}.essen[${i}]: art muss weg, vorsicht oder gut sein`);
  });
  (m.fragen || []).forEach((f, i) => zwei(f, `${w}.fragen[${i}]`));
  if (!m.forschung || !String(m.forschung.suche || "").trim()) fehler.push(`${w}: forschung.suche fehlt`);
});

if (GRUND && GRUND.befinden) ["name", "links", "rechts"].forEach((k) => zwei(GRUND.befinden[k], `GRUND.befinden.${k}`));
(GRUND.skalen || []).forEach((s, i) => ["name", "links", "rechts"].forEach((k) => zwei(s[k], `GRUND.skalen[${i}].${k}`)));

const TAGS = ["mediterran", "omega3", "eisen", "kalzium", "eiweiss", "ballaststoffe", "schonend", "vegetarisch", "ohneMilch", "vorrat"];
const rids = new Set();
REZ.bestand.forEach((b) => {
  if (!de.rezepte[b.index]) fehler.push(`rezepte.bestand: index ${b.index} gibt es in inhalt-de.js nicht`);
  b.tags.forEach((t) => { if (!TAGS.includes(t)) fehler.push(`rezepte.bestand[${b.index}]: unbekanntes Merkmal ${t}`); });
});
REZ.neu.forEach((r) => {
  const w = `Rezept ${r.id}`;
  if (rids.has(r.id)) fehler.push(`${w}: id doppelt`);
  rids.add(r.id);
  if (!/^[a-z0-9-]+$/.test(r.id)) fehler.push(`${w}: id nur aus a-z, 0-9 und -`);
  if (!["wenig", "mittel"].includes(r.kraft)) fehler.push(`${w}: kraft muss wenig oder mittel sein`);
  if (typeof r.minuten !== "number") fehler.push(`${w}: minuten fehlt`);
  r.tags.forEach((t) => { if (!TAGS.includes(t)) fehler.push(`${w}: unbekanntes Merkmal ${t}`); });
  ["name", "warum", "zutaten", "schritte", "hinweis"].forEach((k) => zwei(r[k], `${w}.${k}`));
});
MODULE.forEach((m) => [...((m.rezepte && m.rezepte.bevorzugt) || []), ...((m.rezepte && m.rezepte.meiden) || [])]
  .forEach((t) => { if (!TAGS.includes(t)) fehler.push(`Modul ${m.id}: unbekanntes Rezeptmerkmal ${t}`); }));

let akt = null;
try { akt = laden("aktuell.js").ANKER_AKTUELL; } catch (e) { fehler.push(`aktuell.js parst nicht: ${e.message}`); }
if (akt) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(akt.stand || "")) fehler.push("aktuell.js: stand fehlt");
  MODULE.forEach((m) => {
    const f = akt.forschung && akt.forschung[m.id];
    if (!f || !Array.isArray(f.neu)) fehler.push(`aktuell.js: keine Liste fuer ${m.id}`);
    else f.neu.concat(f.alltag || []).forEach((s) => {
      if (!/^\d+$/.test(s.pmid) || !s.titel) fehler.push(`aktuell.js: kaputter Eintrag bei ${m.id}`);
    });
  });
}

if (fehler.length) {
  console.log(`FEHLER (${fehler.length}):`);
  fehler.forEach((f) => console.log("  " + f));
  process.exit(1);
}
console.log(`OK: ${MODULE.length} Erkrankungen, ${REZ.bestand.length + REZ.neu.length} Rezepte, Forschung vom ${akt.stand}.`);
