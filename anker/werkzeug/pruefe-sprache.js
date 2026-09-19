/*
 * Prueft eine Sprachdatei gegen das deutsche Original.
 *
 *     node werkzeug/pruefe-sprache.js inhalt-en.js en
 *
 * Uebersetzt werden nur die lesbaren Texte. Alles, was der Code anfasst, muss
 * gleich bleiben: jeder Objektschluessel, jede id, jeder schluessel, und jeder
 * Wert, den app.js vergleicht. Wer das verschiebt, bricht die App still: die
 * Haken der Merkliste haengen an ihrer id, die Skalen an ihrem schluessel.
 */
const fs = require("fs");

function laden(pfad, zweig) {
  /* Das Original legt INHALT als const an, die Sprachdateien haengen sich an
     window. Beide Formen muessen hier hereinkommen. */
  const quelle = fs.readFileSync(pfad, "utf8");
  const sb = { INHALT: {} };
  new Function("window", quelle + "\n;try{ if (typeof INHALT === 'object') window.INHALT = INHALT; }catch(e){}")(sb);
  const o = zweig ? sb.INHALT[zweig] : sb.INHALT;
  if (!o || !Object.keys(o).length) throw new Error(pfad + ": INHALT" + (zweig ? "." + zweig : "") + " fehlt oder ist leer");
  return o;
}

/* Diese Felder sind Technik, nicht Sprache. */
const FEST = new Set(["id", "schluessel", "dringend", "land", "thema", "sicherheit",
                      "wert", "farbe", "art", "einheit"]);

function form(o, pfad, raus) {
  if (Array.isArray(o)) {
    raus.push(`${pfad}[] laenge=${o.length}`);
    o.forEach((x, i) => form(x, `${pfad}[${i}]`, raus));
  } else if (o && typeof o === "object") {
    Object.keys(o).sort().forEach((k) => {
      raus.push(`${pfad}.${k}`);
      if (FEST.has(k) && typeof o[k] !== "object") raus.push(`${pfad}.${k}=${o[k]}`);
      else form(o[k], `${pfad}.${k}`, raus);
    });
  }
  return raus;
}

const zielDatei = process.argv[2], zielZweig = process.argv[3];
const de = laden(__dirname + "/../inhalt-de.js", "de");
const ziel = laden(zielDatei.includes("/") ? zielDatei : __dirname + "/../" + zielDatei, zielZweig);

/* Der Zweig ui ist Absicht und gehoert nur in die Uebersetzungen: Deutsch ist
   die Schluesselsprache, dort ist der Satz selbst der Schluessel. Er wird
   deshalb hier nicht verglichen, sondern von werkzeug/pruefe-texte.js geprueft. */
const ohneUi = (x) => x.filter((p) => !p.startsWith(".ui"));
const a = ohneUi(form(de, "", [])), b = ohneUi(form(ziel, "", []));
const fehlt = a.filter((x) => !b.includes(x));
const zuviel = b.filter((x) => !a.includes(x));

if (!fehlt.length && !zuviel.length) {
  console.log(`OK: ${zielDatei} hat dieselbe Struktur wie das deutsche Original.`);
  process.exit(0);
}
console.log(`FEHLER in ${zielDatei}`);
if (fehlt.length) { console.log(`  fehlt (${fehlt.length}):`); fehlt.slice(0, 25).forEach((x) => console.log("    " + x)); }
if (zuviel.length) { console.log(`  zu viel (${zuviel.length}):`); zuviel.slice(0, 25).forEach((x) => console.log("    " + x)); }
process.exit(1);
