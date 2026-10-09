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

const { glutenPruefen } = require("./glutenpruefung.js");
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
  /* Warnzeichen zeigen auf ein Zeichen der Erkrankung, Signale auf eine
     Antwort ihrer Frage des Tages, und jedes Rezeptmuster muss sich bauen
     lassen. Sonst schweigt die Uebersicht genau dort, wo sie warnen soll. */
  (m.warnzeichen || []).forEach((z, i) => {
    zwei(z.text, `${w}.warnzeichen[${i}]`);
    if (!(m.zeichen || []).includes(z.zeichen)) fehler.push(`${w}.warnzeichen[${i}]: "${z.zeichen}" ist kein Zeichen dieser Erkrankung`);
  });
  (m.signale || []).forEach((g, i) => {
    zwei(g.text, `${w}.signale[${i}]`);
    const c = (m.checks || []).find((x) => x.schluessel === g.check);
    if (!c) fehler.push(`${w}.signale[${i}]: Frage ${g.check} gibt es nicht`);
    else g.werte.forEach((v) => { if (!c.optionen.some((o) => o.wert === v)) fehler.push(`${w}.signale[${i}]: Antwort ${v} gibt es nicht`); });
    if (!(g.ab >= 1)) fehler.push(`${w}.signale[${i}]: ab fehlt`);
  });
  (m.rezeptAchtung || []).forEach((a, i) => {
    zwei(a.text, `${w}.rezeptAchtung[${i}]`);
    try { new RegExp(a.muster, "i"); } catch (e) { fehler.push(`${w}.rezeptAchtung[${i}]: Muster kaputt`); }
  });
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

/* Die Uebersetzungen in uebersetzung.js: jeder deutsche Text aus module.js
   und rezepte.js in jeder Sprache, und jede Zahl darin dieselbe. Eine
   Mengenangabe, die beim Uebersetzen aus 200 g 20 g macht, faellt sonst
   niemandem auf. */
let UEB = null;
try { UEB = laden("uebersetzung.js").ANKER_UEBERSETZUNG; } catch (e) { fehler.push(`uebersetzung.js parst nicht: ${e.message}`); }
if (UEB) {
  const deutsch = new Set();
  const sammeln = (x) => {
    if (Array.isArray(x)) return x.forEach(sammeln);
    if (!x || typeof x !== "object") return;
    if ("de" in x && "en" in x) [].concat(x.de).forEach((d) => deutsch.add(d));
    for (const k in x) if (k !== "de" && k !== "en") sammeln(x[k]);
  };
  sammeln(MODULE); sammeln(GRUND); sammeln(REZ);
  const zahlen = (t) => (String(t).match(/\d+(?:[.,]\d+)?/g) || []).map((z) => z.replace(",", ".")).sort().join(" ");
  for (const l of ["it", "fr", "es"]) {
    const tafel = UEB[l] || {};
    let fehlt = 0;
    deutsch.forEach((d) => {
      const t = tafel[d];
      if (t == null || !String(t).trim()) { fehlt++; if (fehlt <= 5) fehler.push(`uebersetzung.js ${l}: fehlt "${d.slice(0, 60)}"`); return; }
      if (zahlen(d) !== zahlen(t)) fehler.push(`uebersetzung.js ${l}: Zahlen weichen ab bei "${d.slice(0, 50)}" -> "${String(t).slice(0, 50)}"`);
    });
    if (fehlt > 5) fehler.push(`uebersetzung.js ${l}: und ${fehlt - 5} weitere fehlen`);
    const tot = Object.keys(tafel).filter((k) => !deutsch.has(k));
    if (tot.length) fehler.push(`uebersetzung.js ${l}: ${tot.length} tote Eintraege, z.B. "${tot[0].slice(0, 50)}"`);
  }
}

/* Die Rezepte aus dem Netz: jedes mit https-Adresse, Zutaten und ohne
   gesperrte Zutat. Die Sperre selbst steht in rezepte-holen.js; hier wird
   nur geprueft, dass die Datei die Form hat, die die App erwartet. */
let netz = null;
try { netz = laden("rezepte-netz.js").ANKER_NETZREZEPTE; } catch (e) { fehler.push(`rezepte-netz.js parst nicht: ${e.message}`); }
if (netz) {
  const nid = new Set();
  (netz.rezepte || []).forEach((r) => {
    const w = `Netzrezept ${r.id}`;
    if (nid.has(r.id)) fehler.push(`${w}: id doppelt`);
    nid.add(r.id);
    if (!/^https:\/\//.test(r.url || "")) fehler.push(`${w}: keine https-Adresse`);
    if (!r.name || !Array.isArray(r.zutaten) || r.zutaten.length < 2) fehler.push(`${w}: Name oder Zutaten fehlen`);
    if (!Array.isArray(r.tags) || r.tags.some((t) => !TAGS.includes(t))) fehler.push(`${w}: unbekanntes Merkmal`);
    if (!Array.isArray(r.pruefen)) fehler.push(`${w}: pruefen fehlt`);
    /* Zweite Sicherung: jedes Rezept noch einmal durch dieselbe strenge
       Glutenpruefung. Wer die Datei von Hand aendert oder die Pruefung
       verschaerft, merkt es hier. */
    const g = glutenPruefen(r.zutaten || []);
    if (!g.ok) fehler.push(`${w}: besteht die Glutenpruefung nicht (${g.grund}: ${String(g.zeile).slice(0, 60)})`);
    if (r.pruefen && r.pruefen.length) fehler.push(`${w}: hat offene Pruefhinweise, die strenge Pruefung laesst keine zu`);
    if (!Array.isArray(r.packung)) fehler.push(`${w}: packung fehlt`);
  });
}

if (fehler.length) {
  console.log(`FEHLER (${fehler.length}):`);
  fehler.forEach((f) => console.log("  " + f));
  process.exit(1);
}
console.log(`OK: ${MODULE.length} Erkrankungen, ${REZ.bestand.length + REZ.neu.length} Rezepte, ${(netz.rezepte || []).length} aus dem Netz, Uebersetzungen it fr es vollstaendig, Forschung vom ${akt.stand}.`);
