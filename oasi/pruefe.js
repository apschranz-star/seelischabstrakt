/*
 * Prueft die Oasi-Seite, ohne Browser und ohne ein einziges Paket.
 *
 *     node oasi/pruefe.js
 *
 * Es gibt nur eine Datei, und genau deshalb faellt darin nichts auf. Fuenf
 * Dinge sind hier schon schiefgegangen oder koennen es leicht:
 *
 * 1. Der Kopf. Die Seite ist als Artefakt entstanden und hatte weder doctype
 *    noch charset noch viewport. Auf einem Telefon wurde sie dadurch auf 980
 *    Pixel ausgelegt und herausgezoomt.
 * 2. Ein Wort dazugeschrieben und die Uebersetzung vergessen. Dann bleibt an
 *    der Stelle Italienisch stehen, mitten im deutschen Text, und niemand
 *    merkt es, solange niemand umschaltet.
 * 3. Eine Datei von einer fremden Adresse. Die Seite holt nichts von aussen,
 *    und das soll so bleiben.
 * 4. Der Entwurfsstreifen. Der darf erst weg, wenn Fabio bestaetigt hat.
 * 5. Die Platzhalter im Impressum. Die werden nicht erfunden.
 *
 * Der Workflow prueft 1, 3 und 4 noch einmal und veroeffentlicht nichts, wenn
 * etwas fehlt. 2 und 5 prueft nur dieses Werkzeug.
 */
const fs = require("fs");
const path = require("path");

const datei = path.join(__dirname, "index.html");
const html = fs.readFileSync(datei, "utf8");
let schlimm = 0;
const sag = (s) => console.log(s);

/* --------------------------------------------------------------- der Kopf */
const kopf = [
  ["<!doctype html>", /<!doctype html>/i],
  ['<meta charset>', /<meta charset=/i],
  ['<meta name="viewport">', /<meta name="viewport"/i],
  ['<html lang>', /<html lang="[a-z]{2}"/i],
  ["<body>", /<body>/i],
];
const fehltImKopf = kopf.filter(([, re]) => !re.test(html)).map(([n]) => n);
if (fehltImKopf.length) {
  schlimm++;
  sag(`Kopf: FEHLER, es fehlt ${fehltImKopf.join(", ")}.`);
  sag("  Ohne viewport legt ein Telefon die Seite auf 980 Pixel aus.");
} else {
  sag("Kopf: vollstaendig.");
}

/* ----------------------------------------------- nichts von fremden Servern */
const fremd = [...html.matchAll(/(?:src|href)="(https?:\/\/[^"]+)"/g)]
  .map((m) => m[1])
  .filter((u) => !u.startsWith("https://wa.me/"));
if (fremd.length) {
  schlimm++;
  sag(`Fremde Adressen: FEHLER, ${fremd.length}.`);
  [...new Set(fremd)].slice(0, 5).forEach((u) => sag(`  ${u}`));
} else {
  sag("Fremde Adressen: keine. Nur die wa.me-Links, und die sind Ziele zum Antippen.");
}

/* ------------------------------------------------------------- die Sprachen */
/* Das Woerterbuch aus dem Skript herausschneiden, Klammer fuer Klammer. */
function objektAb(text, marke) {
  const start = text.indexOf(marke);
  if (start < 0) return null;
  let i = text.indexOf("{", start), tiefe = 0, s = null;
  for (let n = i; n < text.length; n++) {
    const c = text[n];
    if (s) { if (c === "\\") n++; else if (c === s) s = null; continue; }
    if (c === '"' || c === "'") { s = c; continue; }
    if (c === "{") tiefe++;
    else if (c === "}") { tiefe--; if (!tiefe) return text.slice(i, n + 1); }
  }
  return null;
}

const roh = objektAb(html, "var DIZ=");
let DIZ = null;
try { DIZ = roh ? new Function("return " + roh)() : null; } catch (e) { DIZ = null; }

const rohIT = objektAb(html, "var IT=");
let IT = null;
try { IT = rohIT ? new Function("return " + rohIT)() : null; } catch (e) { IT = null; }

/*
 * Diese drei stehen nicht als data-i18n im Dokument. Die Zeile "jetzt
 * geoeffnet, bis 22:00" wird gerechnet, nicht geschrieben, und holt sich ihren
 * Satz aus dem Code. Fehlt einer davon in einer Sprache, wirft die Seite an der
 * Stelle einen Fehler, statt still auf Italienisch zu bleiben.
 */
const AUS_DEM_CODE = ["aperto", "chiuso", "chiusoOggi"];
const platzhalter = (t) => (String(t).match(/\{\w\}/g) || []).slice().sort().join(",");

/* Die Schluessel im Dokument. Der Skriptblock zaehlt nicht mit: dort stehen
   dieselben Namen als Schluessel des Woerterbuchs. */
const rumpf = html.slice(0, html.indexOf("<script>"));
const imDokument = [...new Set([...rumpf.matchAll(/data-i18n="([^"]+)"/g)].map((m) => m[1]))];

if (!DIZ) {
  schlimm++;
  sag("Sprachen: FEHLER, das Woerterbuch var DIZ liess sich nicht lesen.");
} else {
  sag(`Sprachen: ${imDokument.length} Stellen im Dokument, Italienisch steht dort selbst.`);
  if (!IT) { schlimm++; sag("  FEHLER, das italienische var IT liess sich nicht lesen."); }
  for (const code of ["de", "en"]) {
    const tab = DIZ[code] || {};
    const fehlt = imDokument.filter((k) => typeof tab[k] !== "string");
    const tot = Object.keys(tab).filter(
      (k) => !imDokument.includes(k) && !AUS_DEM_CODE.includes(k),
    );
    const ausCode = AUS_DEM_CODE.filter((k) => typeof tab[k] !== "string");
    const schief = IT
      ? AUS_DEM_CODE.filter(
          (k) => typeof tab[k] === "string" && platzhalter(IT[k]) !== platzhalter(tab[k]),
        )
      : [];
    if (!fehlt.length && !tot.length && !ausCode.length && !schief.length) {
      sag(`  ${code}: alle ${imDokument.length} Stellen da, dazu die drei aus dem Code, keine toten Eintraege.`);
      continue;
    }
    schlimm++;
    if (ausCode.length) {
      sag(`  ${code}: FEHLER, aus dem Code fehlt ${ausCode.join(", ")}. Die Zeile mit den Oeffnungszeiten bricht dort ab.`);
    }
    if (schief.length) {
      sag(`  ${code}: FEHLER, falsche Platzhalter in ${schief.join(", ")}. {h} ist die Uhrzeit, {g} der Tag.`);
    }
    if (fehlt.length) {
      sag(`  ${code}: FEHLER, ${fehlt.length} ${fehlt.length === 1 ? "Stelle bleibt" : "Stellen bleiben"} auf Italienisch stehen:`);
      fehlt.slice(0, 12).forEach((k) => sag(`      ${k}`));
      if (fehlt.length > 12) sag(`      ... und ${fehlt.length - 12} weitere`);
    }
    if (tot.length) {
      sag(`  ${code}: ${tot.length} tote Eintraege, niemand fragt sie ab:`);
      tot.slice(0, 8).forEach((k) => sag(`      ${k}`));
    }
  }
}

/* ------------------------------------------------- was vor dem Start fehlt */
sag("");
const streifen = /data-i18n="avviso"/.test(html);
sag(streifen
  ? "Entwurfsstreifen: steht da. Der bleibt, bis Fabio bestaetigt hat."
  : "Entwurfsstreifen: WEG. Das ist nur richtig, wenn alles unten bestaetigt ist.");
if (!streifen) schlimm++;

const platz = (html.match(/\[da inserire\]/g) || []).length;
sag(platz
  ? `Impressum: ${platz} Platzhalter [da inserire]. Werden nicht erfunden.`
  : "Impressum: keine Platzhalter mehr.");

const nummer = (html.match(/var NUMERO="([0-9]+)"/) || [])[1];
if (nummer) sag(`Telefonnummer im Code: +${nummer.slice(0, 2)} ... Von Fabio bestaetigen lassen, alle WhatsApp-Knoepfe haengen daran.`);

sag("");
sag(schlimm === 0 ? "Alles in Ordnung." : schlimm === 1 ? "Eine Sache stimmt nicht." : `${schlimm} Sachen stimmen nicht.`);
process.exit(schlimm ? 1 : 0);
