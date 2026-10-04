/*
 * Holt die monatliche Forschungsuebersicht und schreibt anker/aktuell.js.
 *
 *     node werkzeug/aktualisieren.js
 *
 * Laeuft einmal im Monat in .github/workflows/anker-aktuell.yml, laesst sich
 * aber auch von Hand starten. Braucht Node 18 oder neuer, sonst nichts.
 *
 * WARUM SO UND NICHT IN DER APP
 * Die App darf keine Verbindung nach draussen aufbauen (connect-src 'none'),
 * weil sie Gesundheitsdaten traegt. Also holt dieses Skript die Daten auf
 * GitHub, schreibt sie in eine Datei neben der App, und die App laedt diese
 * Datei von ihrer eigenen Adresse wie jedes andere Skript. Vom Telefon geht
 * nichts hinaus, auch nicht, wonach gesucht wird.
 *
 * WOHER
 * PubMed ueber die offizielle Schnittstelle E-utilities der National Library
 * of Medicine, kein Abkratzen von Webseiten. Gesucht wird je Erkrankung nach
 * Leitlinien, Meta-Analysen, systematischen Uebersichten und randomisierten
 * Studien der letzten zwoelf Monate, dazu eine zweite Liste zu Ernaehrung,
 * Muedigkeit, Bewegung und Lebensqualitaet, und fuer jedes Paar von
 * Erkrankungen die Arbeiten, die beide betreffen.
 *
 * Gespeichert werden Titel, Zeitschrift, Datum, Art und PubMed-Nummer. Keine
 * Zusammenfassungen: die stehen unter dem Recht der Verlage, und ein Titel
 * mit Link ist genau das, was in die Sprechstunde mitgenommen wird.
 */
const fs = require("fs");
const path = require("path");

const wurzel = path.join(__dirname, "..");
const sb = {};
new Function("window", fs.readFileSync(path.join(wurzel, "module.js"), "utf8"))(sb);
const MODULE = sb.ANKER_MODULE;

const BASIS = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/";
const WERKZEUG = "anker-begleitbuch";
const ARTEN =
  '(guideline[pt] OR "practice guideline"[pt] OR meta-analysis[pt] OR "systematic review"[pt] OR "randomized controlled trial"[pt] OR review[pt])';
const ALLTAG =
  "(diet[tiab] OR nutrition[tiab] OR fatigue[tiab] OR exercise[tiab] OR \"quality of life\"[tiab] OR \"physical activity\"[tiab])";
const FILTER = "english[la] AND hasabstract";

const warte = (ms) => new Promise((r) => setTimeout(r, ms));

async function holen(url, versuch = 0) {
  /* Ohne API-Schluessel erlaubt die NLM drei Anfragen je Sekunde. */
  await warte(400);
  try {
    const a = await fetch(url, { headers: { "User-Agent": WERKZEUG } });
    if (a.status === 429 && versuch < 4) { await warte(2000 * (versuch + 1)); return holen(url, versuch + 1); }
    if (!a.ok) throw new Error(`HTTP ${a.status}`);
    return a.json();
  } catch (e) {
    if (versuch < 3) { await warte(1500 * (versuch + 1)); return holen(url, versuch + 1); }
    throw e;
  }
}

async function suchen(begriff, { tage = 365, anzahl = 8, sortierung = "relevance" } = {}) {
  const q = new URLSearchParams({
    db: "pubmed", term: begriff, retmode: "json", retmax: String(anzahl),
    sort: sortierung, datetype: "pdat", reldate: String(tage), tool: WERKZEUG,
  });
  const s = await holen(BASIS + "esearch.fcgi?" + q);
  const ids = (s.esearchresult && s.esearchresult.idlist) || [];
  if (!ids.length) return [];
  const z = await holen(BASIS + "esummary.fcgi?" + new URLSearchParams({ db: "pubmed", id: ids.join(","), retmode: "json", tool: WERKZEUG }));
  const r = z.result || {};
  return ids.map((id) => r[id]).filter(Boolean).map(eintrag);
}

const ART_NAMEN = [
  ["Practice Guideline", "leitlinie"], ["Guideline", "leitlinie"],
  ["Meta-Analysis", "metaanalyse"], ["Systematic Review", "uebersicht"],
  ["Randomized Controlled Trial", "studie"], ["Review", "uebersicht"],
];

function eintrag(d) {
  const typen = d.pubtype || [];
  const art = (ART_NAMEN.find(([n]) => typen.includes(n)) || [, "artikel"])[1];
  const datum = String(d.sortpubdate || d.pubdate || "").slice(0, 10).replace(/\//g, "-");
  return {
    pmid: String(d.uid),
    titel: String(d.title || "").replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim(),
    zeitschrift: String(d.fulljournalname || d.source || "").trim(),
    datum,
    art,
  };
}

function einmalig(liste) {
  const gesehen = new Set();
  return liste.filter((e) => (gesehen.has(e.pmid) ? false : (gesehen.add(e.pmid), true)));
}

(async () => {
  const forschung = {};
  for (const m of MODULE) {
    const s = m.forschung.suche;
    const leit = await suchen(`${s} AND ${ARTEN} AND ${FILTER}`, { anzahl: 8 });
    const alltag = await suchen(`${s} AND ${ALLTAG} AND ${ARTEN} AND ${FILTER}`, { anzahl: 5 });
    forschung[m.id] = {
      neu: einmalig(leit),
      alltag: einmalig(alltag).filter((e) => !leit.some((x) => x.pmid === e.pmid)),
    };
    console.log(`${m.id}: ${forschung[m.id].neu.length} + ${forschung[m.id].alltag.length}`);
  }

  /* Paare. Seltener veroeffentlicht, daher fuenf Jahre statt einem. */
  const paare = {};
  for (let i = 0; i < MODULE.length; i++) {
    for (let j = i + 1; j < MODULE.length; j++) {
      const a = MODULE[i], b = MODULE[j];
      const schluessel = [a.id, b.id].sort().join("+");
      const liste = await suchen(`${a.forschung.suche} AND ${b.forschung.suche} AND ${FILTER}`, { tage: 1825, anzahl: 4 });
      if (liste.length) paare[schluessel] = liste;
      console.log(`${schluessel}: ${liste.length}`);
    }
  }

  const leer = Object.values(forschung).every((f) => !f.neu.length);
  if (leer) {
    /* Lieber den alten Stand behalten als eine leere Uebersicht ausliefern. */
    console.error("Keine einzige Arbeit gefunden. aktuell.js bleibt unveraendert.");
    process.exit(1);
  }

  const heute = new Date().toISOString().slice(0, 10);
  const daten = { stand: heute, quelle: "PubMed (NCBI E-utilities)", forschung, paare };
  const text =
    "/*\n * Monatliche Forschungsuebersicht, erzeugt von werkzeug/aktualisieren.js.\n" +
    " * Nicht von Hand aendern, der naechste Lauf ueberschreibt die Datei.\n */\n" +
    "window.ANKER_AKTUELL = " + JSON.stringify(daten, null, 1) + ";\n";
  fs.writeFileSync(path.join(wurzel, "aktuell.js"), text);
  console.log(`aktuell.js geschrieben, Stand ${heute}.`);
})().catch((e) => {
  console.error("Abbruch:", e.message);
  process.exit(1);
});
