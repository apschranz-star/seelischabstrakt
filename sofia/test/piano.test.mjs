/*
 * Plan audit: app/js/data/piano.js against a second transcription of the PDF
 * written independently by the QA auditor before it ever opened piano.js
 * (test/fixtures/piano-qa.json). Names are written differently in the two,
 * so the test compares what matters: every amount of every option, in order.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { COLAZIONE, SPUNTINO, PRANZO, CENA, DOPOCENA, LIMITI } from "../app/js/data/piano.js";

const qa = JSON.parse(readFileSync(new URL("./fixtures/piano-qa.json", import.meta.url), "utf8"));
const norm = (q) => (q == null ? null : Array.isArray(q) ? `${q[0]}-${q[1]}` : String(q).replace(/\s/g, ""));
const daQa = (items) => items.flatMap((i) => (i.items ? daQa(i.items) : [norm(i.qta)])).filter((x) => x != null && x !== "null").sort();
const daApp = (voci) => voci.map((v) => norm(v.q)).filter((x) => x != null).sort();

function confronta(nome, app, qaOpz) {
  assert.equal(app.length, qaOpz.length, `${nome}: number of options`);
  app.forEach((o, i) => assert.deepEqual(daApp(o.voci), daQa(qaOpz[i].items || [qaOpz[i]]), `${nome} option ${i + 1}`));
}

test("breakfast, snack and after-dinner amounts match the independent transcription", () => {
  confronta("colazione", COLAZIONE.opzioni, qa.colazione.opzioni);
  confronta("spuntino", SPUNTINO.opzioni, qa.spuntino.opzioni);
  confronta("dopocena", DOPOCENA.opzioni, qa.dopocena.opzioni);
});

test("lunch carbohydrates and proteins match", () => {
  confronta("pranzo carboidrati", PRANZO.carboidrati, qa.pranzo.carboidrati);
  confronta("pranzo proteine", PRANZO.proteine, qa.pranzo.proteine);
});

test("dinner proteins match", () => {
  confronta("cena proteine", CENA.proteine, qa.cena.proteine);
});

test("dinner bread alternatives match", () => {
  const app = CENA.contorno.find((v) => v.a === "pane_gf");
  /* the plan writes "5 gallette di grano saraceno o riso integrale" as one alternative; the app keeps the two kinds apart */
  const tutte = [...new Set([app, ...app.o].map((v) => norm(v.q) + v.u))].sort();
  assert.deepEqual(tutte, qa.cena.pane_e_alternative.map((x) => norm(x.qta) + (x.unita === "pezzi" ? "pz" : x.unita)).sort());
  assert.deepEqual(app.o.filter((x) => x.u === "pz").map((x) => x.a).sort(), ["gallette_riso", "gallette_saraceno"]);
});

test("light or protein cheese exactly where the plan says so, and the shared 10 g after dinner", () => {
  const tutte = [...COLAZIONE.opzioni, ...SPUNTINO.opzioni, ...PRANZO.proteine, ...PRANZO.combinati.opzioni, ...CENA.proteine, ...CENA.idee, ...DOPOCENA.opzioni];
  const riga = (id, a) => tutte.find((o) => o.id === id).voci.find((v) => v.a === a);
  const conProtein = (id, a, b) => (riga(id, a).o || []).some((x) => x.a === b);
  /* "ricotta light o protein" (spuntino 8), "mozzarella light o protein" (pranzo 7, cena 12) */
  assert.ok(conProtein("s8", "ricotta_light", "ricotta_protein"));
  assert.ok(conProtein("pp7", "mozzarella_light", "mozzarella_protein"));
  assert.ok(conProtein("cp12", "mozzarella_light", "mozzarella_protein"));
  /* "ricotta light" only (colazione 6, pranzo 9), "mozzarella light" only (combinato 2), "mozzarella protein" only (idea 1) */
  assert.ok(!conProtein("c6", "ricotta_light", "ricotta_protein"));
  assert.ok(!conProtein("pp9", "ricotta_light", "ricotta_protein"));
  assert.ok(!conProtein("pa2", "mozzarella_light", "mozzarella_protein"));
  assert.ok(riga("ci1", "mozzarella_protein") && !riga("ci1", "mozzarella_light"));
  /* "10 gr tra fiocchi di avena e cioccolato" */
  const d5 = riga("d5", "avena");
  assert.equal(d5.q, 10);
  assert.deepEqual(d5.con, ["cioccolato"]);
});

test("macro ranges match", () => {
  for (const [p, q] of [[COLAZIONE, qa.colazione], [SPUNTINO, qa.spuntino], [PRANZO, qa.pranzo], [CENA, qa.cena], [DOPOCENA, qa.dopocena]]) {
    assert.deepEqual(p.macro.proteine, q.range.proteine_g, p.id + " protein");
    assert.deepEqual(p.macro.carboidrati, q.range.carbo_g, p.id + " carbs");
    assert.deepEqual(p.macro.grassi, q.range.grassi_g, p.id + " fat");
  }
});

test("every quantified weekly limit the auditor found is in the plan data, same meal, number and period", () => {
  const quantificati = qa.limiti_settimanali.filter((l) => l.tipo === "max" || l.tipo === "obiettivo");
  assert.equal(quantificati.length, LIMITI.length, "same number of limits");
  const liberi = [...LIMITI];
  for (const l of quantificati) {
    const i = liberi.findIndex((x) => x.pasto === l.pasto && (x.max != null ? x.max : x.esattamente) === l.volte && x.periodoGiorni === 7 * l.periodo_settimane && (l.tipo === "obiettivo") === (x.esattamente != null));
    assert.ok(i >= 0, `no match for: ${l.pasto} ${l.alimento} ${l.testo}`);
    liberi.splice(i, 1);
  }
});
