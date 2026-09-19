/*
 * Zieht den sichtbaren Text jeder Seite ab und vergleicht zwei Abzuege.
 *
 *     node werkzeug/textabzug.js vorher.json de-AT     nimmt auf
 *     node werkzeug/textabzug.js nachher.json de-AT    nimmt auf
 *     node werkzeug/textabzug.js --vergleich vorher.json nachher.json
 *
 * Voraussetzung: die App liegt unter http://127.0.0.1:8137, etwa mit
 *     cd anker && python3 -m http.server 8137 --bind 127.0.0.1
 *
 * Dazu Playwright und ein Chromium. Beides gehoert nicht ins Repository, weil
 * es hundert Megabyte waeren:
 *     npm install playwright        (irgendwo, dann NODE_PATH daraufsetzen)
 *     NODE_PATH=/pfad/zu/node_modules node werkzeug/textabzug.js ...
 * Liegt Chromium woanders, sagt man es ueber die Umgebungsvariable CHROME.
 *
 * WOFUER
 * Beim Umbau der Oberflaeche auf T() darf sich am angezeigten Text nichts
 * aendern, solange Deutsch eingestellt ist: der Schluessel ist ja der deutsche
 * Satz. Ein Abzug vorher, einer nachher, und der Vergleich muss leer sein. Das
 * beweist, dass kein Satz verlorengegangen und keiner doppelt gesetzt ist.
 * Augenschein reicht dafuer nicht, es sind vierzehn Seiten.
 */
const fs = require("fs");

const SEITEN = ["heute", "verlauf", "essen", "wissen", "mehr", "medikamente", "werte",
                "termine", "stellen", "suchen", "erstgespraech", "bericht", "sicherung", "notfall"];
const EXE = process.env.CHROME || "/opt/pw-browsers/chromium-1194/chrome-linux/chrome";

if (process.argv[2] === "--vergleich") {
  const a = JSON.parse(fs.readFileSync(process.argv[3], "utf8"));
  const b = JSON.parse(fs.readFileSync(process.argv[4], "utf8"));
  let anders = 0;
  for (const s of SEITEN) {
    if (a[s] === b[s]) continue;
    anders++;
    console.log(`\n${s}: unterschiedlich (${(a[s] || "").length} gegen ${(b[s] || "").length} Zeichen)`);
    const wa = (a[s] || "").split(" "), wb = (b[s] || "").split(" ");
    for (let i = 0; i < Math.max(wa.length, wb.length); i++) {
      if (wa[i] !== wb[i]) {
        console.log(`  ab Wort ${i}:`);
        console.log(`    vorher : ${wa.slice(i, i + 14).join(" ")}`);
        console.log(`    nachher: ${wb.slice(i, i + 14).join(" ")}`);
        break;
      }
    }
  }
  console.log(anders ? `\n${anders} von ${SEITEN.length} Seiten unterschiedlich.` : `Alle ${SEITEN.length} Seiten gleich.`);
  process.exit(anders ? 1 : 0);
}

(async () => {
  /* Ohne Playwright bricht require mit einem Stapelauszug ab, und wer das
     zum ersten Mal sieht, haelt das Werkzeug fuer kaputt. Es fehlt nur ein
     Paket, und pruefe-deutsch.js kann dasselbe ohne Browser. */
  let chromium;
  try {
    ({ chromium } = require("playwright"));
  } catch (e) {
    console.error(
      "Playwright fehlt. Dieses Werkzeug braucht einen Browser.\n" +
      "  npm install playwright        (irgendwo)\n" +
      "  NODE_PATH=/pfad/zu/node_modules node werkzeug/textabzug.js ...\n" +
      "Ohne Browser: node werkzeug/pruefe-deutsch.js prueft dasselbe statisch.",
    );
    process.exit(2);
  }
  const b = await chromium.launch({ executablePath: EXE });
  const ctx = await b.newContext({ viewport: { width: 393, height: 852 }, isMobile: true,
    locale: process.argv[3] || "de-AT", timezoneId: "Europe/Vienna" });
  const p = await ctx.newPage();
  const fehler = [];
  p.on("pageerror", (e) => fehler.push(e.message));
  const raus = {};
  await p.goto("http://127.0.0.1:8137/index.html");
  for (const s of SEITEN) {
    await p.goto("http://127.0.0.1:8137/index.html#/" + s);
    await p.reload({ waitUntil: "load" });
    await p.waitForTimeout(220);
    raus[s] = await p.evaluate(() => document.body.innerText.replace(/\s+/g, " ").trim());
  }
  raus.__fehler = fehler;
  fs.writeFileSync(process.argv[2], JSON.stringify(raus, null, 1));
  console.log(`Abzug in ${process.argv[2]}. Laufzeitfehler: ${fehler.length}`);
  await b.close();
})();
