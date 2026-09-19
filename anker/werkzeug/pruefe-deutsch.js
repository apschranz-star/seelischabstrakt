/*
 * Prueft, ob sich am deutschen Text etwas geaendert hat, ohne Browser.
 *
 *     node werkzeug/pruefe-deutsch.js            vergleicht
 *     node werkzeug/pruefe-deutsch.js --merken   schreibt den Stand fest
 *
 * WOFUER
 * Deutsch ist die Schluesselsprache: T("Noch nichts eingetragen.") gibt auf
 * Deutsch genau diesen Satz zurueck. Solange die Schluessel dieselben bleiben,
 * kann sich der deutsche Text gar nicht aendern. Wer beim Uebersetzen einen
 * deutschen Satz in app.js umformuliert, aendert damit unbemerkt zweierlei:
 * den deutschen Text und den Schluessel, unter dem die Uebersetzung liegt.
 * Genau das faengt diese Liste ab.
 *
 * textabzug.js beweist dasselbe gruendlicher, indem es die Seiten wirklich
 * rendert. Das braucht Playwright und ein Chromium. Hier reicht Node.
 *
 * Ein neuer Schluessel ist kein Fehler, sondern neue Arbeit; ein verschwundener
 * ist einer, bis jemand sagt, dass der Satz weg sollte. Wer die Aenderung will,
 * ruft danach --merken auf und legt die neue Liste mit in den Commit.
 */
const fs = require("fs");
const path = require("path");

const wurzel = path.join(__dirname, "..");
const stand = path.join(__dirname, "deutsch.json");
const app = fs.readFileSync(path.join(wurzel, "app.js"), "utf8");

const sauber = (t) => t.replace(/\\"/g, '"').replace(/\\\\/g, "\\");
const jetzt = new Set();
for (const m of app.matchAll(/\bTV?\(\s*"((?:[^"\\]|\\.)*)"\s*[,)]/g)) jetzt.add(sauber(m[1]));
for (const m of app.matchAll(/\bTP\(\s*"((?:[^"\\]|\\.)*)"\s*,\s*"((?:[^"\\]|\\.)*)"/g)) {
  jetzt.add(sauber(m[1]));
  jetzt.add(sauber(m[2]));
}
const liste = [...jetzt].sort();

if (process.argv[2] === "--merken") {
  fs.writeFileSync(stand, JSON.stringify(liste, null, 1) + "\n");
  console.log(`${liste.length} deutsche Saetze festgehalten in werkzeug/deutsch.json.`);
  process.exit(0);
}

if (!fs.existsSync(stand)) {
  console.log("Noch kein Stand da. Einmal 'node werkzeug/pruefe-deutsch.js --merken' aufrufen.");
  process.exit(1);
}

const vorher = new Set(JSON.parse(fs.readFileSync(stand, "utf8")));
const weg = [...vorher].filter((k) => !jetzt.has(k));
const neu = liste.filter((k) => !vorher.has(k));

if (!weg.length && !neu.length) {
  console.log(`Deutsch unveraendert, ${liste.length} Saetze.`);
  process.exit(0);
}

if (weg.length) {
  console.log(`verschwunden (${weg.length}), der deutsche Text hat sich hier geaendert:`);
  weg.forEach((k) => console.log(`  - ${k.slice(0, 96)}`));
}
if (neu.length) {
  console.log(`neu (${neu.length}), dafuer braucht jede angebotene Sprache eine Zeile:`);
  neu.forEach((k) => console.log(`  + ${k.slice(0, 96)}`));
}
console.log("\nGewollt? Dann 'node werkzeug/pruefe-deutsch.js --merken' und die Datei mit committen.");
process.exit(weg.length ? 1 : 0);
