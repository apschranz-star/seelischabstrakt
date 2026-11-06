import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { DESCRITTORI } from "../lib/ricette-web.mjs";

const qui = dirname(fileURLToPath(import.meta.url));
const radice = join(qui, "..");
const testi = [];
const visita = (d) => { for (const n of readdirSync(d)) { const p = join(d, n); if (n === "node_modules" || n === "vendor" || n === "fonti" || n.endsWith(".png") || n.endsWith(".woff2")) continue; if (statSync(p).isDirectory()) visita(p); else if (/\.(js|mjs|cjs|css|html|md|json|toml|sh|webmanifest)$/.test(n)) testi.push(p); } };
visita(radice);

test("no em dash or en dash anywhere in Sofia's own files", () => {
  for (const f of testi) { const t = readFileSync(f, "utf8"); assert.ok(!/[\u2013\u2014]/.test(t), f); }
});

test("privacy: no surname, no contact data of the nutritionist, no health data in the code", () => {
  for (const f of testi) {
    const t = readFileSync(f, "utf8");
    assert.ok(!new RegExp("Pal" + "la").test(t), "surname in " + f);
    const contatti = new RegExp(["isabella" + "giunta", "347\\s?" + "345", "0235" + "0010564", "Roncig" + "lione", "Tarqui" + "nia"].join("|"), "i");
    assert.ok(!contatti.test(t), "nutritionist contact data in " + f);
  }
});

test("the descriptor list never contains a food or gluten word", () => {
  for (const w of ["optional", "or", "regular", "flour", "gluten", "wheat", "bread", "pasta", "oats", "barley", "rye", "malt", "beer", "soy", "sauce", "stock", "broth"]) assert.ok(!DESCRITTORI.has(w), w);
});

test("vendored copies are identical to the repository originals", () => {
  const coppie = [["lib/glutenpruefung.cjs", "../anker/werkzeug/glutenpruefung.js"], ["tools/gate/gate.snippet.html", "../gate/gate.snippet.html"], ["tools/gate/split.py", "../gate/split.py"], ["tools/gate/inject.sh", "../gate/inject.sh"]];
  for (const [copia, orig] of coppie) {
    const o = join(radice, orig);
    if (!existsSync(o)) continue; /* deployed from sofia/ alone: originals not present */
    assert.equal(readFileSync(join(radice, copia), "utf8"), readFileSync(o, "utf8"), copia);
  }
});

test("the page forbids inline styles and scripts, and the app never writes style attributes", () => {
  const html = readFileSync(join(radice, "app/index.html"), "utf8");
  assert.match(html, /style-src 'self'/);
  assert.match(html, /script-src 'self'/);
  for (const f of testi.filter((x) => x.includes("/app/js/") && !x.includes("/three/"))) assert.ok(!/style="/.test(readFileSync(f, "utf8")), f);
});
