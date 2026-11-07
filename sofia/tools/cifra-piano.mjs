/*
 * The full text of Sofia's plan (the nutritionist's letter with her
 * translation) is personal: it never goes into the public repository or onto
 * the site in clear. It is stored encrypted with the access code
 * (PBKDF2-SHA256 600,000 iterations, AES-GCM-256, app/js/cripto.js), and the
 * app decrypts it on her phone with the code she typed at the gate.
 *
 *   SOFIA_ACCESS_KEY=<code> node tools/cifra-piano.mjs <plain.json>      encrypt into app/data/
 *   SOFIA_ACCESS_KEY=<code> node tools/cifra-piano.mjs --decifra         print the plain JSON
 */
import { readFileSync, writeFileSync } from "node:fs";
import { cifraConPassphrase, decifraConPassphrase } from "../app/js/cripto.js";

const OUT = new URL("../app/data/piano-testo.cifrato.json", import.meta.url);
const codice = process.env.SOFIA_ACCESS_KEY || "";
if (!codice) { console.error("cifra-piano: set SOFIA_ACCESS_KEY"); process.exit(1); }

if (process.argv[2] === "--decifra") {
  const dati = await decifraConPassphrase(JSON.parse(readFileSync(OUT, "utf8")), codice, "sofia-piano");
  process.stdout.write(JSON.stringify(dati, null, 2) + "\n");
} else {
  const chiaro = JSON.parse(readFileSync(process.argv[2], "utf8"));
  const file = await cifraConPassphrase(chiaro, codice, "sofia-piano");
  writeFileSync(OUT, JSON.stringify(file) + "\n");
  console.log("cifra-piano: written", OUT.pathname, (JSON.stringify(file).length / 1024).toFixed(1), "KB");
}
