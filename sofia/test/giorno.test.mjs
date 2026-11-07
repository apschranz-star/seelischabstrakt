import { test } from "node:test";
import assert from "node:assert/strict";
import { obiettiviDelGiorno, mangiatoDelGiorno, anelli, numeriSettimana, gruppoDi, KCAL_GIORNO, MACRO_GIORNO } from "../app/js/engine/giorno.js";
import { generaSettimana, rifaiDa, validaSettimana, vociPasto, lunediDi, aggiungiGiorni } from "../app/js/engine/planner.js";
import { MISURE, misurePer, grammiMisura, densita } from "../app/js/data/misure.js";
import { trovaEsclusi, analisiEsclusi, ricettaEsclusi, escludibile } from "../app/js/engine/esclusi.js";
import { RICETTE } from "../app/js/data/ricette.js";
import { normalizza as normalizzaOff } from "../lib/off.mjs";

const LUN = "2026-11-02";
const settimana = () => generaSettimana({ seme: 7, inizio: LUN });
const comePiano = (g, pasti) => Object.fromEntries(pasti.filter((p) => g[p]).map((p) => [p, { voci: vociPasto(g, p).map((v) => ({ ...v, o: undefined })), fonte: "piano" }]));

/* Day targets: the plan's 1400 kcal, the sum of its per-meal macro ranges, the planned vegetables. */
test("day targets come from the plan", () => {
  const w = settimana();
  const g = w.giorni[2];
  const o = obiettiviDelGiorno(g);
  assert.equal(o.kcal, 1400);
  assert.ok(MACRO_GIORNO.prot.min > 0 && MACRO_GIORNO.prot.max > MACRO_GIORNO.prot.min);
  assert.deepEqual(o.prot, MACRO_GIORNO.prot);
  const verdurePianificate = ["pranzo", "cena"].flatMap((p) => vociPasto(g, p)).filter((v) => v.a === "verdure" || v.a === "minestrone").reduce((t, v) => t + v.q, 0);
  assert.equal(o.verdure, verdurePianificate);
  assert.ok(o.verdure >= 300, "lunch and dinner carry vegetables");
});

/* What she logs counts: as planned (vegetables included) or picked one by one. */
test("eaten values count vegetables however they are logged", () => {
  const w = settimana();
  const g = w.giorni[3];
  const m = mangiatoDelGiorno(comePiano(g, ["pranzo", "cena"]));
  assert.ok(m.kcal > 0 && m.verdure >= 300, `vegetables as planned: ${m.verdure}`);
  const scelte = mangiatoDelGiorno({ pranzo: { voci: [{ a: "verdure", q: 200, u: "g", scelta: "zucchine" }, { a: "frutta", q: 150, u: "g", scelta: "mela" }] } });
  assert.equal(scelte.verdure, 200);
  assert.equal(scelte.frutta, 150);
  /* a table entry: CIQUAL group 0201 is vegetables, 0204 fruit, potatoes (0202) neither */
  assert.equal(gruppoDi({ a: "ciq:20020", gruppo: "0201" }), "verdure");
  assert.equal(gruppoDi({ a: "ciq:13039", gruppo: "0204" }), "frutta");
  assert.equal(gruppoDi({ a: "ciq:4008", gruppo: "0202" }), null);
  assert.equal(gruppoDi({ a: "minestrone" }), "verdure");
});

test("rings: state per row, no target means 'not in today's plan'", () => {
  const r = anelli({ kcal: 1400, ...MACRO_GIORNO, verdure: 600, frutta: 0 }, { kcal: 700, prot: MACRO_GIORNO.prot.max + 5, carb: 10, fat: MACRO_GIORNO.fat.min, verdure: 600, frutta: 120 });
  const per = Object.fromEntries(r.map((x) => [x.chiave, x]));
  assert.deepEqual(r.map((x) => x.chiave), ["carb", "prot", "verdure", "frutta", "fat"]);
  assert.equal(per.prot.stato, "sopra");
  assert.equal(per.carb.stato, "sotto");
  assert.equal(per.fat.stato, "ok");
  assert.equal(per.verdure.stato, "ok");
  assert.equal(per.frutta.stato, "nessuno");
});

/* The week: past days with nothing logged count neither as eaten nor as target (information missing). */
test("week numbers: logged days, today and the days ahead; empty past days left out", () => {
  const w = settimana();
  const oggi = aggiungiGiorni(LUN, 4); /* Friday */
  const log = { [aggiungiGiorni(LUN, 3)]: comePiano(w.giorni[3], ["colazione", "spuntino", "pranzo", "cena", "dopocena"]), [oggi]: comePiano(w.giorni[4], ["colazione"]) };
  const n = numeriSettimana(w.giorni, (d) => log[d] || {}, {}, oggi);
  const per = Object.fromEntries(n.righe.map((x) => [x.chiave, x]));
  assert.deepEqual(n.vuoti, [LUN, aggiungiGiorni(LUN, 1), aggiungiGiorni(LUN, 2)]);
  assert.equal(n.registrati, 2);
  /* Thursday, Friday (today), Saturday, Sunday */
  assert.equal(per.kcal.max, 4 * KCAL_GIORNO);
  assert.equal(per.prot.min, 4 * MACRO_GIORNO.prot.min);
  assert.equal(per.prot.max, 4 * MACRO_GIORNO.prot.max);
  const atteso = mangiatoDelGiorno(log[aggiungiGiorni(LUN, 3)]).kcal + mangiatoDelGiorno(log[oggi]).kcal;
  assert.ok(Math.abs(per.kcal.valore - atteso) < 1e-6);
  assert.ok(Math.abs(per.kcal.restano - (per.kcal.max - per.kcal.valore)) < 1e-6);
  assert.ok(per.verdure.valore >= 300 && per.verdure.tetto === false);
  /* over the ceiling */
  const pieno = numeriSettimana(w.giorni.slice(0, 1), () => ({ pranzo: { voci: [{ a: "olio_evo", q: 300, u: "g" }] } }), {}, LUN);
  const grassi = pieno.righe.find((x) => x.chiave === "fat");
  assert.equal(grassi.stato, "sopra");
  assert.ok(grassi.oltre > 0 && grassi.restano === 0);
});

/* Household measures: the grams each one stands for. */
test("household measures turn into grams with their source", () => {
  assert.equal(grammiMisura("uovo_s", 1), 42);
  assert.equal(grammiMisura("scatoletta", 0.5, { peso: 200 }), 100);
  assert.equal(grammiMisura("scatoletta", 0.5), null, "a can needs the label weight");
  assert.equal(grammiMisura("bicchiere", 1, { id: "latte_ps" }), 206);
  assert.equal(grammiMisura("cucchiaio", 1, { id: "olio_evo" }), 9);
  assert.equal(densita("", "Tuna, canned in sunflower oil, drained"), 1, "fish in oil is not oil");
  assert.ok(misurePer({ id: "uovo" }).includes("uovo_m"));
  assert.ok(misurePer({ id: "tonno" }).includes("scatoletta"));
  assert.ok(!misurePer({ nomeEn: "Tuna, canned in sunflower oil, drained" }).includes("cucchiaio"));
  assert.ok(misurePer({ nomeEn: "Sunflower oil" }).includes("cucchiaio"));
  for (const [k, m] of Object.entries(MISURE)) assert.ok(m.fonte && (m.g || m.ml || m.chiedi), k);
});

test("Open Food Facts pack and serving sizes in grams", () => {
  const x = normalizzaOff({ product_name: "Tonno", nutriments: { "energy-kcal_100g": 190 }, product_quantity: "160", product_quantity_unit: "g", serving_quantity: "80", serving_size: "80 g" });
  assert.equal(x.confezione, 160);
  assert.equal(x.porzione, 80);
  assert.equal(normalizzaOff({ product_name: "Latte", product_quantity: "1", product_quantity_unit: "l" }).confezione, 1000);
  assert.equal(normalizzaOff({ product_name: "Strano", product_quantity: "90000" }).confezione, null);
});

/* Removed ingredients: plan foods, single vegetables and fruits, recipe text. */
test("removed ingredients: whole words, mixes, alternatives and titles", () => {
  const riga = (it) => [{ a: "verdure", testo: { it } }];
  assert.deepEqual(trovaEsclusi(riga("pesce bianco al forno"), ["pesca"]), [], "pesca is not pesce");
  assert.deepEqual(trovaEsclusi(riga("melanzane grigliate"), ["mela"]), [], "mela is not melanzane");
  assert.deepEqual(trovaEsclusi(riga("pesche sciroppate"), ["pesca"]), ["pesca"]);
  assert.deepEqual(analisiEsclusi(riga("pomodorini, peperoni, cetrioli"), ["peperoni"]), { blocca: [], menziona: ["peperoni"] }, "a mix works without one");
  assert.deepEqual(trovaEsclusi(riga("lamponi o fragole"), ["fragole"]), [], "an alternative is free");
  assert.deepEqual(trovaEsclusi(riga("lamponi o fragole"), ["fragole", "lamponi"]), ["lamponi", "fragole"]);
  assert.deepEqual(trovaEsclusi(riga("peperoni e cipolla"), ["peperoni"], { it: "Quinoa con pollo e peperoni" }), ["peperoni"], "the title names the dish");
  /* plan foods by id; an option with an alternative is removed only when both are */
  assert.deepEqual(trovaEsclusi([{ a: "salmone", q: 150, u: "g" }], ["salmone"]), ["salmone"]);
  assert.deepEqual(trovaEsclusi([{ a: "pane_gf", q: 60, u: "g", o: [{ a: "gallette_riso" }] }], ["pane_gf"]), []);
  assert.ok(!escludibile("verdure") && escludibile("peperoni") && escludibile("salmone"));
  const conSalmone = RICETTE.filter((r) => ricettaEsclusi(r, ["salmone"]).length);
  assert.ok(conSalmone.length >= 1 && conSalmone.every((r) => r.ingredienti.some((v) => v.a === "salmone")));
});

/* Redo from today: past days stay, today's logged meals stay, the rest avoids what she removed and keeps every limit. */
test("redo the days from today keeps the past and the plan's limits", () => {
  const w = settimana();
  const oggi = aggiungiGiorni(LUN, 4);
  const semi = Array.from({ length: 40 }, (_, i) => 5000 + i * 13);
  const via = ["salmone", "calamari", "merluzzo"];
  const r = rifaiDa(w, oggi, { semi, pref: { escludi: via }, tieni: (d, p) => d === oggi && p === "pranzo" });
  assert.ok(r, "a valid splice exists");
  assert.deepEqual(r.giorni.slice(0, 4), w.giorni.slice(0, 4));
  assert.deepEqual(r.giorni[4].pranzo, w.giorni[4].pranzo, "today's logged lunch stays");
  assert.ok(validaSettimana(r).ok);
  for (const g of r.giorni.slice(5)) for (const p of ["pranzo", "cena"]) assert.ok(!vociPasto(g, p).some((v) => via.includes(v.a)), `${g.data} ${p}`);
  assert.equal(lunediDi(r.giorni[0].data), LUN);
});
