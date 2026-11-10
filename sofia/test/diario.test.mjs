import { test } from "node:test";
import assert from "node:assert/strict";
import { valoriVoci, origineVoce, statoDaNome } from "../app/js/engine/nutrizione.js";
import { caricaTabella, cercaCiqual } from "../app/js/engine/ricerca.js";

/* The food log takes uncooked weights: the table entry it proposes first must be the raw (or dry) one. */
test("ingredient search proposes raw or dry entries first", async () => {
  const t = await caricaTabella();
  const primo = (q) => cercaCiqual(q, t, 3, { crudo: true })[0];
  const attesi = {
    "riso basmati": [9119, "crudo"], pasta: [9810, "crudo"], "pasta senza glutine": [9874, "crudo"], quinoa: [9340, "crudo"],
    lenticchie: [20504, "secco"], ceci: [20516, "secco"], fagioli: [null, "secco"], "petto di pollo": [36017, "crudo"],
    salmone: [null, "crudo"], merluzzo: [26043, "crudo"], polpo: [10018, "crudo"], orata: [null, "crudo"], uovo: [22000, "crudo"],
    patate: [4008, "crudo"], zucchine: [20020, "crudo"], spinaci: [20059, "crudo"], avena: [9310, "crudo"], olio: [17270, "venduto"],
  };
  for (const [q, [codice, stato]] of Object.entries(attesi)) {
    const r = primo(q);
    assert.ok(r, q + ": nothing found");
    if (codice) assert.equal(Number(r.codice), codice, `${q}: ${r.nomeEn}`);
    assert.equal(r.stato, stato, `${q}: ${r.nomeEn}`);
  }
});

test("the state of the values is read from the source's own name", () => {
  assert.equal(statoDaNome("Spinach, raw"), "crudo");
  assert.equal(statoDaNome("Salmon, raw, wild"), "crudo");
  assert.equal(statoDaNome("Sandwich made with panini bread, raw cured ham, mozzarella cheese and tomato"), "conservato");
  assert.equal(statoDaNome("Lentil, dried", true), "secco");
  assert.equal(statoDaNome("Banana, pulp, dried", false), "venduto");
  assert.equal(statoDaNome("Dried pasta, gluten-free, cooked, unsalted", true), "cotto");
  assert.equal(statoDaNome("Egg, scrambled, with added fat"), "cotto");
  assert.equal(statoDaNome("Chick pea, canned, drained", true), "conservato");
  assert.equal(statoDaNome("Olive oil, extra virgin"), "venduto");
});

test("plan foods show their raw or dry source, averages are said", () => {
  const pollo = origineVoce({ a: "pollo", q: 150, u: "g" });
  assert.equal(pollo.stato, "crudo");
  assert.match(pollo.fonti[0].nome, /raw/);
  const legumi = origineVoce({ a: "legumi_secchi", q: 50, u: "g" });
  assert.equal(legumi.stato, "secco");
  assert.equal(legumi.media, true);
  assert.equal(origineVoce({ a: "prugne_secche", q: 30, u: "g" }).stato, "venduto");
  assert.equal(origineVoce({ a: "polpo_cotto", q: 160, u: "g" }).stato, "cotto");
});

test("a logged ingredient keeps its own values: grams x kcal per 100 g", () => {
  const voci = [
    { a: "ciq:9119", q: 70, u: "g", nome: "Riso basmati", fonte: "ciqual", codice: "9119", nomeEn: "Basmati rice, raw", stato: "crudo", p: { kcal: 353, prot: 8.2, carb: 77.5, fat: 0.6, fib: 1.4, salt: 0 } },
    { a: "ciq:20020", q: 200, u: "g", nome: "Zucchine", fonte: "ciqual", codice: "20020", p: { kcal: 16.5, prot: 1.36, carb: 1.4, fat: 0.36, fib: 1.2, salt: 0.01 } },
    { a: "olio_evo", q: 10, u: "g" },
    { a: "etichetta:pasta-di-lenticchie", q: 80, u: "g", nome: "Pasta di lenticchie", fonte: "etichetta", p: { kcal: 340, prot: 25 } },
  ];
  const r = valoriVoci(voci);
  assert.equal(r.completo, true);
  assert.equal(Math.round(r.righe[0].val.kcal * 10) / 10, 247.1);
  assert.equal(Math.round(r.righe[1].val.kcal * 10) / 10, 33);
  assert.equal(Math.round(r.righe[3].val.kcal * 10) / 10, 272);
  assert.equal(Math.round(r.tot.kcal), Math.round(247.1 + 33 + r.righe[2].val.kcal + 272));
  assert.equal(origineVoce(voci[0]).fonti[0].id, "9119");
  assert.equal(origineVoce(voci[0]).stato, "crudo");
});
