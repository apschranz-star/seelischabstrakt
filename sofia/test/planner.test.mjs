import { test } from "node:test";
import assert from "node:assert/strict";
import { generaSettimana, validaSettimana, rimescolaPasto, conteggi, aggiungiGiorni, alimentiPasto, vociPasto } from "../app/js/engine/planner.js";
import { LIMITI, FREQUENZE_IDEALI } from "../app/js/data/piano.js";

const INIZIO = "2026-11-09";

test("500 shuffled weeks: every hard limit and every ideal frequency holds", () => {
  for (let seme = 1; seme <= 500; seme++) {
    const w = generaSettimana({ seme, inizio: INIZIO });
    assert.ok(!w.errore, `seed ${seme}: no week`);
    const v = validaSettimana(w);
    assert.ok(v.ok, `seed ${seme}: ${JSON.stringify(v.checks.filter((c) => !c.ok))}`);
    assert.ok(v.idealeOk, `seed ${seme}: ideal frequencies`);
    const c = conteggi(w);
    assert.equal(c.legumiPranzo, 2, "legumes at lunch exactly twice");
    assert.equal(c.cena.legumi, 1, "legumes at dinner exactly once");
    assert.ok(c.combinati <= 1, "at most one combined lunch");
    for (const [cat, [lo, hi]] of Object.entries(FREQUENZE_IDEALI.cena)) assert.ok((c.cena[cat] || 0) >= lo && (c.cena[cat] || 0) <= hi, `dinner ${cat}`);
  }
});

test("tuna counted across composed and combined lunches never exceeds 2", () => {
  for (let seme = 1; seme <= 300; seme++) {
    const w = generaSettimana({ seme, inizio: INIZIO, pref: { combinato: "sempre" } });
    const n = w.giorni.filter((g) => alimentiPasto(g, "pranzo").includes("tonno")).length;
    assert.ok(n <= 2, `seed ${seme}: tuna ${n}`);
  }
});

test("same seed, same week", () => {
  assert.deepEqual(generaSettimana({ seme: 42, inizio: INIZIO }).giorni, generaSettimana({ seme: 42, inizio: INIZIO }).giorni);
});

test("shuffling one meal keeps the week valid", () => {
  const w = generaSettimana({ seme: 7, inizio: INIZIO });
  for (let i = 0; i < 7; i++) for (const p of ["colazione", "pranzo", "cena"]) {
    const n = rimescolaPasto(w, i, p, 1000 + i);
    if (!n) continue;
    const v = validaSettimana(n);
    assert.ok(v.ok && v.idealeOk, `day ${i} ${p}`);
  }
});

test("excluded foods are avoided", () => {
  const escludi = ["polpo_cotto", "polpo_crudo", "calamari", "pesce_spada"];
  for (let seme = 1; seme <= 100; seme++) {
    const w = generaSettimana({ seme, inizio: INIZIO, pref: { escludi } });
    assert.ok(!w.errore);
    for (const g of w.giorni) for (const p of ["pranzo", "cena"]) for (const a of alimentiPasto(g, p)) assert.ok(!escludi.includes(a), `seed ${seme} ${a}`);
  }
});

test("omelette roll: never twice within 14 days across weeks", () => {
  const storia = [];
  let inizio = INIZIO;
  for (let k = 0; k < 12; k++) {
    const w = generaSettimana({ seme: 300 + k, inizio, storia: storia.slice(-2) });
    const v = validaSettimana(w, storia.slice(-2));
    assert.ok(v.ok, `week ${k}`);
    storia.push(w);
    inizio = aggiungiGiorni(inizio, 7);
  }
  const date = storia.flatMap((w) => w.giorni.filter((g) => g.cena.tipo === "idea" && g.cena.id === "ci2").map((g) => g.data)).sort();
  for (let i = 1; i < date.length; i++) {
    const d = (Date.parse(date[i]) - Date.parse(date[i - 1])) / 86400000;
    assert.ok(d >= 14, `${date[i - 1]} -> ${date[i]}`);
  }
});

test("every plan limit is checked by the validator", () => {
  const w = generaSettimana({ seme: 3, inizio: INIZIO });
  const ids = validaSettimana(w).checks.map((c) => c.id);
  for (const L of LIMITI) assert.ok(ids.includes("limite_" + L.id), L.id);
});

test("foods she does not eat: a whole group can go (cheese), legumes cannot", async () => {
  const { ALIMENTI } = await import("../app/js/data/alimenti.js");
  const formaggi = Object.entries(ALIMENTI).filter(([, a]) => a.gruppo === "formaggi").map(([id]) => id);
  for (let s = 1; s <= 25; s++) {
    const w = generaSettimana({ seme: s * 31, inizio: "2026-11-09", pref: { escludi: formaggi } });
    assert.ok(!w.errore, "no week without cheese, seed " + s);
    assert.ok(validaSettimana(w).ok, "hard limits broken, seed " + s);
    for (const g of w.giorni) for (const p of ["colazione", "spuntino", "pranzo", "cena", "dopocena"]) if (g[p]) assert.ok(!vociPasto(g, p).some((v) => formaggi.includes(v.a)), "cheese in " + g.data + " " + p);
  }
  assert.ok(generaSettimana({ seme: 5, inizio: "2026-11-09", pref: { escludi: ["legumi_secchi", "legumi_scolati"] } }).errore);
});
