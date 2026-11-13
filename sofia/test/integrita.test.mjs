import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { DESCRITTORI } from "../lib/ricette-web.mjs";

const qui = dirname(fileURLToPath(import.meta.url));
const radice = join(qui, "..");
const testi = [];
/* Every text file, whatever its extension: a file is text when its first 8 KB have no NUL byte. */
const binario = (p) => readFileSync(p).subarray(0, 8192).includes(0);
const visita = (d) => { for (const n of readdirSync(d)) { const p = join(d, n); if (n === "node_modules" || n === "vendor" || n === "fonti" || n === ".netlify" || n === ".git") continue; if (statSync(p).isDirectory()) visita(p); else if (!binario(p)) testi.push(p); } };
visita(radice);
/* the privacy scan also covers the research files in docs/fonti */
const fonti = join(radice, "docs/fonti");
const tuttiTesti = testi.concat(existsSync(fonti) ? readdirSync(fonti).filter((n) => /\.(md|json)$/.test(n)).map((n) => join(fonti, n)) : []);

test("no em dash or en dash anywhere in Sofia's own files", () => {
  for (const f of tuttiTesti) { const t = readFileSync(f, "utf8"); assert.ok(!/[\u2013\u2014]/.test(t), f); }
});

/*
 * Generic detectors on purpose: the repository is public, so this file must
 * not spell out the contact data it guards against. Any phone number, e-mail
 * address, VAT number or professional register entry fails the build.
 */
const VIETATI = [
  [new RegExp("\\bPal" + "la\\b", "i"), "surname"],
  [/[\w.+-]+@[\w-]+(?:\.[\w-]+)+/, "e-mail address"],
  [/(?<![\w.\/-])(?:\+39[\s.]?)?3\d{2}[\s.]?\d{3}[\s.]?\d{3,4}(?![\w.\/-])/, "mobile phone number"],
  [/(?<![\w.\/-])0\d{1,3}[\s.\/]?\d{5,8}(?![\w.\/-])/, "landline phone number"],
  [/(?<![\w.\/-])\d{11}(?![\w.\/-])/, "VAT number"],
  [/p\.?\s?iva\b|partita\s+iva|\bpec\b|iscrizione\s+albo|\bAA_\d/i, "professional register data"],
];

test("privacy: no surname and no contact data of anyone (phone, e-mail, VAT, register)", () => {
  for (const f of tuttiTesti) {
    const t = readFileSync(f, "utf8");
    for (const [re, cosa] of VIETATI) { const m = t.match(re); assert.ok(!m, cosa + " in " + f + (m ? ": " + m[0].slice(0, 3) + "..." : "")); }
  }
});

test("privacy detectors catch the formats printed on a nutritionist's letterhead", () => {
  const prova = (s) => VIETATI.some(([re]) => re.test(s));
  for (const s of ["tel: 3" + "00 000 0000", "mail: nome." + "cognome@" + "example.org", "p." + "iva: 0" + "00000" + "00000", "Iscrizione " + "Albo n. A" + "A_000000", "tel 06 " + "1234567"]) assert.ok(prova(s), s);
  for (const s of ["150 gr yogurt", "1400 kcal", "2026-11-06", "10.1016/j.clnu.2019.06.013", "ISSN 0261-5614", "PMID 31234567", "0.123456"]) assert.ok(!prova(s), s);
});

test("the descriptor list never contains a food or gluten word", () => {
  for (const w of ["optional", "or", "regular", "flour", "gluten", "wheat", "bread", "pasta", "oats", "barley", "rye", "malt", "beer", "soy", "sauce", "stock", "broth"]) assert.ok(!DESCRITTORI.has(w), w);
});

test("vendored copies are identical to the repository originals", () => {
  const coppie = [["lib/glutenpruefung.cjs", "../anker/werkzeug/glutenpruefung.js"]];
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

test("the service worker precaches every app module, so the app works offline", () => {
  const sw = readFileSync(join(radice, "app/sw.js"), "utf8");
  const moduli = [];
  const giu = (d, rel) => { for (const n of readdirSync(d)) { const p = join(d, n); if (statSync(p).isDirectory()) giu(p, rel + n + "/"); else if (n.endsWith(".js")) moduli.push(rel + n); } };
  giu(join(radice, "app/js"), "js/");
  for (const m of moduli) assert.ok(sw.includes('"' + m + '"'), "sw.js does not precache " + m);
  assert.ok(sw.includes('"data/piano-testo.cifrato.json"'));
  /* The body screen imports three.js: it is stored at install in a cache that survives app updates. */
  assert.match(sw, /VENDOR_SUBITO = \[[^\]]*"vendor\/three\.min\.js"/);
  assert.match(sw, /k !== VENDOR\b/);
  assert.match(sw, /const VENDOR = "sofia-vendor-__VENDOR__";/, "tools/timbro.mjs names the vendor cache");
});

/* The personal parts of the letter (sample phrases) stay in the encrypted file only; the
   plan's food rules are in the code on purpose. The access code is never committed: the
   generated gate files are git-ignored (the code itself is secret, so no test can name it). */
test("the letter's personal text stays encrypted and the gate files are not committed", () => {
  /* Only in a git checkout: the deploy upload removes these two lines on purpose so the armed
     gate is uploaded (docs/STATO.md), and the build on Netlify runs these tests without .git. */
  if (existsSync(join(radice, "..", ".git"))) {
    const ignora = readFileSync(join(radice, ".gitignore"), "utf8").split("\n").map((x) => x.trim());
    assert.ok(ignora.includes("app/zugang.js") && ignora.includes("app/zugang.css"), "the gate files must stay git-ignored");
  }
  for (const f of tuttiTesti) {
    if (f.endsWith("piano-testo.cifrato.json")) continue;
    const t = readFileSync(f, "utf8");
    assert.ok(!new RegExp(["video" + "chiamata", "tua " + "mamma", "farmacia " + "di"].join("|"), "i").test(t), "plan letter text in " + f);
  }
  const cifrato = JSON.parse(readFileSync(join(radice, "app/data/piano-testo.cifrato.json"), "utf8"));
  assert.equal(cifrato.app, "sofia-piano");
  assert.equal(cifrato.iterazioni, 600000);
});
