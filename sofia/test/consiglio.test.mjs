import { test } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { valutaRicettaWeb, consiglioRicetta, consiglioSettimana, notePersonali, decisione } from "../app/js/engine/consiglio.js";
import { RICETTE } from "../app/js/data/ricette.js";
import { generaSettimana } from "../app/js/engine/planner.js";
const { glutenPruefen } = createRequire(import.meta.url)("../lib/glutenpruefung.cjs");

const giudica = (ingredienti, titolo = "Test", categoria = "Main Course") => valutaRicettaWeb({ ingredienti, titolo, categoria, gluten: glutenPruefen(ingredienti) });

test("a plain plan lunch is approved and gets the plan's doses", () => {
  const r = giudica(["1 cup quinoa, rinsed", "1 lb shrimp, peeled and deveined", "2 tablespoons olive oil", "1 zucchini, diced", "1 lemon, juiced", "fresh parsley, chopped"]);
  assert.equal(r.esito, "approvata");
  assert.equal(r.pasto.pasto, "pranzo");
  assert.deepEqual(r.dosi.map((d) => [d.a, d.q]), [["quinoa", 80], ["gamberi", 70], ["verdure", 300], ["olio_evo", 10]]);
});

test("processed meat, frying, alfalfa and unknown foods are vetoed", () => {
  assert.equal(giudica(["6 eggs", "4 slices bacon"]).esito, "respinta");
  assert.equal(giudica(["2 chicken breasts", "oil for frying"]).esito, "respinta");
  const a = giudica(["2 cups mixed greens", "1 cup alfalfa sprouts", "2 eggs"]);
  assert.equal(a.esito, "respinta");
  assert.equal(a.verdetti.find((v) => v.agente === "lupus").livello, "veto", "the lupus seat vetoes alfalfa (the gluten seat may veto first by seniority)");
  assert.equal(giudica(["1 lb chicken breast", "1 cup dragonfruit glaze"]).esito, "respinta");
});

test("gluten: unlabelled oats and plain pasta are vetoed by the most senior seat", () => {
  const r = giudica(["1/2 cup rolled oats", "1 cup milk"]);
  assert.equal(r.esito, "respinta");
  assert.equal(r.da, "glutine");
  assert.equal(giudica(["8 oz spaghetti", "1 can tuna in water"]).da, "glutine");
});

test("seed oil and butter are adapted to extra virgin olive oil", () => {
  const r = giudica(["2 salmon fillets", "1 tablespoon canola oil", "2 cups broccoli florets", "1 lemon"]);
  assert.equal(r.esito, "adattata");
  assert.ok(r.adattamenti.some((x) => x.a === "olio_evo"));
});

test("garlic is a note, never a veto", () => {
  const r = giudica(["1 cup quinoa", "1 lb shrimp", "3 cloves garlic, minced", "1 tablespoon olive oil"]);
  assert.equal(r.esito, "approvata");
  assert.ok(r.verdetti.find((v) => v.agente === "lupus").motivi.some((m) => m.fonte === "lupus_garlic"));
});

test("profile notes: grapefruit with tacrolimus and sprouts with immunosuppression become vetoes on the phone", () => {
  assert.equal(notePersonali(["1 grapefruit, segmented"], { farmaci: "tacrolimus 2 mg" })[0].livello, "veto");
  assert.equal(notePersonali(["1 cup bean sprouts"], { immunosoppressori: true })[0].livello, "veto");
  assert.equal(notePersonali(["1 grapefruit"], { farmaci: "idrossiclorochina" }).length, 0);
});

test("seniority: the gluten veto wins over everything", () => {
  const d = decisione([{ agente: "reni", livello: "nota", motivi: [] }, { agente: "piano", livello: "adatta", motivi: [] }, { agente: "glutine", livello: "veto", motivi: [] }]);
  assert.equal(d.esito, "respinta");
  assert.equal(d.da, "glutine");
});

test("all curated recipes are approved by the council", () => {
  for (const r of RICETTE) assert.notEqual(consiglioRicetta(r).esito, "respinta", r.id);
});

test("a generated week passes the council", () => {
  const w = generaSettimana({ seme: 11, inizio: "2026-11-09" });
  assert.notEqual(consiglioSettimana(w).esito, "respinta");
});
