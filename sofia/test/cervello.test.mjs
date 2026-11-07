import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { valoriVoci, confrontoPasto } from "../app/js/engine/nutrizione.js";
import { valutaAlimento } from "../app/js/engine/cervello.js";
import { caricaTabella, cercaCiqual, cercaPiano } from "../app/js/engine/ricerca.js";
import { filtra, ripulisciCache, SETTE_GIORNI } from "../lib/off.mjs";
import { COLAZIONE, SPUNTINO, PRANZO, CENA, DOPOCENA } from "../app/js/data/piano.js";

const mediana = (xs) => { const s = [...xs].sort((a, b) => a - b); return s[Math.floor(s.length / 2)]; };

test("plan meals computed from composition data match the plan's own calorie figures", () => {
  /* The plan says: breakfast about 200, snack 100-120, lunch 490-500, dinner about 460, after dinner about 100 kcal. */
  for (const o of COLAZIONE.opzioni) { const k = valoriVoci(o.voci).tot.kcal; assert.ok(k > 160 && k < 260, o.id + " " + k); }
  for (const o of [...SPUNTINO.opzioni, ...DOPOCENA.opzioni]) { const k = valoriVoci(o.voci).tot.kcal; assert.ok(k > 60 && k < 140, o.id + " " + k); }
  const ver = { a: "verdure", q: 300, u: "g" }, olio = { a: "olio_evo", q: 10, u: "g" };
  const pranzi = PRANZO.carboidrati.flatMap((c) => PRANZO.proteine.map((p) => valoriVoci([...c.voci, ...p.voci, ver, olio])).filter((r) => r.completo).map((r) => r.tot.kcal));
  assert.ok(Math.abs(mediana(pranzi) - 495) / 495 < 0.12, "lunch median " + mediana(pranzi));
  const pane = CENA.contorno.find((v) => v.a === "pane_gf");
  const cene = CENA.proteine.flatMap((p) => [pane, ...pane.o].map((b) => valoriVoci([...p.voci, b, ver, olio]))).filter((r) => r.completo).map((r) => r.tot.kcal);
  assert.ok(Math.abs(mediana(cene) - 460) / 460 < 0.12, "dinner median " + mediana(cene));
  assert.equal(confrontoPasto("pranzo", 500).stato, "ok");
  assert.equal(confrontoPasto("pranzo", 700).stato, "sopra");
});

test("missing composition is reported, never guessed", () => {
  const r = valoriVoci([{ a: "mozzarella_protein", q: 100, u: "g" }]);
  assert.equal(r.completo, false);
  assert.deepEqual(r.mancanti, ["mozzarella_protein"]);
});

async function verdetto(q, profilo = {}) {
  const t = await caricaTabella();
  const r = cercaCiqual(q, t, 1)[0];
  assert.ok(r, "no CIQUAL result for " + q);
  return { r, v: valutaAlimento(r, { profilo }) };
}

test("Italian search finds the right CIQUAL food", async () => {
  const t = await caricaTabella();
  const primo = (q) => cercaCiqual(q, t, 1)[0].nomeEn;
  assert.equal(primo("spinaci"), "Spinach, raw");
  assert.equal(primo("lenticchie"), "Lentil, dried");
  assert.equal(primo("ceci"), "Chick pea, dried");
  assert.match(primo("salmone"), /^Salmon, raw/);
  assert.match(primo("yogurt greco"), /Greek-style/);
  assert.ok(cercaPiano("quinoa").some((x) => x.id === "quinoa"));
});

test("the brain approves, adapts or vetoes like the plan and the guidelines", async () => {
  assert.equal((await verdetto("spinaci")).v.livello, "si");
  assert.equal((await verdetto("lenticchie")).v.livello, "si");
  assert.equal((await verdetto("salmone")).v.livello, "si");
  assert.equal((await verdetto("tofu")).v.livello, "medio");
  assert.equal((await verdetto("riso")).v.livello, "medio");
  assert.equal((await verdetto("manzo")).v.livello, "medio");
  for (const q of ["pasta", "seitan", "birra", "biscotti"]) assert.equal((await verdetto(q)).v.da, "glutine", q);
  assert.equal((await verdetto("prosciutto crudo")).v.livello, "no");
  assert.equal((await verdetto("olio di girasole")).v.livello, "no");
  assert.equal((await verdetto("erba medica")).v.da, "lupus");
  assert.equal((await verdetto("pompelmo")).v.livello, "si");
  assert.equal((await verdetto("pompelmo", { farmaci: "tacrolimus" })).v.livello, "no");
});

test("portions follow the plan's own portions", async () => {
  const len = (await verdetto("lenticchie")).v.porzioni;
  assert.deepEqual(len.map((p) => [p.pasto, p.q]), [["pranzo", 70], ["cena", 40]]);
  const sal = (await verdetto("salmone")).v.porzioni.find((p) => p.pasto === "cena");
  assert.ok(sal.q >= 80 && sal.q <= 110, "dinner salmon " + sal.q); /* the plan: 90 g fresh salmon */
  assert.equal((await verdetto("spinaci")).v.porzioni[0].q, 300);
});

test("Open Food Facts results: gluten traces veto, gluten-free label passes", () => {
  const hits = JSON.parse(readFileSync(new URL("./fixtures/off-tofu.json", import.meta.url), "utf8")).hits;
  const lista = filtra(hits);
  assert.ok(lista.length >= 3);
  const conTracce = lista.find((x) => x.tracce.some((t) => /gluten/.test(t)));
  assert.equal(valutaAlimento(conTracce).da, "glutine");
  const sg = lista.find((x) => x.etichette.includes("en:no-gluten"));
  const v = valutaAlimento(sg);
  assert.notEqual(v.livello, "no");
  assert.equal(v.seggi.find((s) => s.agente === "glutine").livello, "ok");
});

test("the food lookup cache deletes answers older than 7 days and unreadable ones", async () => {
  const ora = Date.parse("2026-11-07T04:17:00Z");
  const dati = new Map([
    ["tofu", { quando: new Date(ora - SETTE_GIORNI + 60000).toISOString(), risultati: [] }],
    ["tempeh", { quando: new Date(ora - SETTE_GIORNI - 60000).toISOString(), risultati: [] }],
    ["rotto", { risultati: [] }],
  ]);
  const store = {
    list: async () => ({ blobs: [...dati.keys()].map((key) => ({ key, etag: "x" })), directories: [] }),
    get: async (k) => dati.get(k) ?? null,
    delete: async (k) => { dati.delete(k); },
  };
  assert.equal(await ripulisciCache(store, { ora }), 2);
  assert.deepEqual([...dati.keys()], ["tofu"]);
});
