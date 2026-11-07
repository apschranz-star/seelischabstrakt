/* Stamps app/sw.js with a hash of every app file, so a new build always
   installs a new cache and the app updates itself. */
import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { createHash } from "node:crypto";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const app = join(dirname(fileURLToPath(import.meta.url)), "..", "app");
const h = createHash("sha256");
const visita = (d) => {
  for (const n of readdirSync(d).sort()) {
    const p = join(d, n);
    if (statSync(p).isDirectory()) visita(p);
    else if (n !== "sw.js") h.update(n).update(readFileSync(p));
  }
};
visita(app);
const v = h.digest("hex").slice(0, 12);
const sw = join(app, "sw.js");
const testo = readFileSync(sw, "utf8").replace(/const VERSIONE = "[^"]*";/, `const VERSIONE = "${v}";`);
writeFileSync(sw, testo);
console.log("sw.js version", v);
