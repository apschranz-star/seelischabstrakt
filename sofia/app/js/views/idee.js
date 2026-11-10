/*
 * Idee: Sofia adds the ingredients she feels like eating and the app proposes
 * recipes that use them: the 44 recipes in the plan's amounts and her own
 * recipes (web recipes have no amounts, they stay in "Dal web"). Each recipe says how many
 * of her ingredients it uses, what else it needs, its calories per portion
 * (engine/nutrizione) and the council's verdict. Every ingredient she adds
 * shows a clear signal (the chip lights up, a message says how many recipes
 * match). Without ingredients, the page shows today's recipes from the plan.
 */
import { S } from "../store.js";
import { L, lingua } from "../i18n.js";
import { I, esc, num } from "../ui.js";
import { registra, ridisegna, toast } from "../ctx.js";
import { nome, ALIMENTI } from "../data/alimenti.js";
import { VERDURE, FRUTTA } from "../data/scelte.js";
import { RICETTE } from "../data/ricette.js";
import { cercaPiano } from "../engine/ricerca.js";
import { valoriVoci } from "../engine/nutrizione.js";
import { consiglioRicetta } from "../engine/consiglio.js";
import { normalizza } from "../data/dizionario.js";
import { isoData } from "../engine/planner.js";
import { DEF, cartaRicetta, settimanaDi, ricettePerPasto, esitoHtml } from "./comuni.js";
import { opzioniNutrizione } from "./diario.js";
import { mieComeRicette } from "./ricettemie.js";
import { ricettaEsclusi, ricettaMenziona, nomeEscluso } from "../engine/esclusi.js";

let scelti = [];          /* { tipo: "piano" | "scelta" | "gruppo" | "testo", id, testo } */
let q = "", pasto = "tutti", appena = null;

const etichetta = (x) => x.tipo === "piano" ? nome(x.id, lingua()) : x.tipo === "scelta" ? (lingua() === "en" ? x.en : x.it) : x.tipo === "gruppo" ? L(x.id === "verdure" ? { it: "Verdure", en: "Vegetables" } : { it: "Frutta", en: "Fruit" }) : x.testo;
const chiave = (x) => `${x.tipo}:${x.id || normalizza(x.testo)}`;

/* All the words a recipe is made of, for matching free text and vegetable names. */
function testoRicetta(r) {
  const parti = [L(r.titolo), r.titolo && r.titolo.it, ...(r.ingredienti || []).flatMap((v) => [v.testo && v.testo.it, v.testo && v.testo.en, nome(v.a, "it"), nome(v.a, "en")]), ...(r.extra || []).flatMap((x) => [x.it, x.en])];
  return normalizza(parti.filter(Boolean).join(" "));
}

function usa(r, x, testo) {
  const ingr = r.ingredienti || [];
  if (x.tipo === "piano") return ingr.some((v) => v.a === x.id || (v.con || []).includes(x.id)) || testo.includes(normalizza(nome(x.id, "it")));
  if (x.tipo === "gruppo") return ingr.some((v) => (ALIMENTI[v.a] || {}).gruppo === x.id || (x.id === "verdure" && v.a === "verdure") || (x.id === "frutta" && v.a === "frutta"));
  if (x.tipo === "scelta") return ingr.some((v) => v.scelta === x.id) || testo.includes(normalizza(x.it)) || testo.includes(normalizza(x.en));
  const t = normalizza(x.testo);
  return t.length >= 3 && testo.includes(t);
}

/* Does one ingredient line already cover a chosen item? (so "Ti serve anche" lists only what is missing) */
function copre(v, x) {
  const t = normalizza([v.testo && v.testo.it, v.testo && v.testo.en, nome(v.a, "it"), nome(v.a, "en")].filter(Boolean).join(" "));
  if (x.tipo === "piano") return v.a === x.id || (v.con || []).includes(x.id) || t.includes(normalizza(nome(x.id, "it")));
  if (x.tipo === "gruppo") return v.a === x.id || (ALIMENTI[v.a] || {}).gruppo === x.id;
  if (x.tipo === "scelta") return v.scelta === x.id || t.includes(normalizza(x.it)) || t.includes(normalizza(x.en));
  const q2 = normalizza(x.testo);
  return q2.length >= 3 && t.includes(q2);
}

/* The plan's recipes and hers: both carry ingredients in the plan's amounts. */
const tutteLeRicette = (s) => [...RICETTE, ...mieComeRicette(s)];

/* Recipes holding an ingredient she removed (week > Togli ingredienti) are left out and counted. */
let nascoste = 0;
function proposte(s) {
  const opz = opzioniNutrizione(s);
  const ex = new Set(s.pref.escludi || []);
  const out = [];
  nascoste = 0;
  for (const r of tutteLeRicette(s)) {
    if (pasto !== "tutti" && r.pasto !== pasto) continue;
    if (ex.size && ricettaEsclusi(r, ex).length) { if (scelti.some((x) => usa(r, x, testoRicetta(r)))) nascoste++; continue; }
    const testo = testoRicetta(r);
    const usati = scelti.filter((x) => usa(r, x, testo));
    if (!usati.length) continue;
    const altri = (r.ingredienti || []).filter((v) => v.a !== "acqua" && !scelti.some((x) => copre(v, x))).map((v) => (v.testo ? L(v.testo) : nome(v.a, lingua())));
    const kcal = valoriVoci(r.ingredienti || [], opz);
    out.push({ r, usati, altri, kcal, dec: consiglioRicetta(r), senza: ex.size ? ricettaMenziona(r, ex) : [] });
  }
  return out.sort((a, b) => b.usati.length - a.usati.length || (a.dec.esito === "respinta") - (b.dec.esito === "respinta") || a.altri.length - b.altri.length || a.r.minuti - b.r.minuti);
}

function suggerimentiIngredienti(s) {
  const t = q.trim();
  if (t.length < 2) return [];
  const n = normalizza(t);
  const out = [];
  for (const x of [...VERDURE, ...FRUTTA]) if (normalizza(x.it).includes(n) || normalizza(x.en).includes(n)) out.push({ tipo: "scelta", id: x.id, it: x.it, en: x.en });
  for (const x of cercaPiano(t)) if (!["verdure", "frutta", "acqua"].includes(x.id)) out.push({ tipo: "piano", id: x.id });
  const visti = new Set(scelti.map(chiave));
  return out.filter((x) => !visti.has(chiave(x))).slice(0, 10);
}

export function render(s) {
  const lista = scelti.length ? proposte(s) : [];
  const sugg = suggerimentiIngredienti(s);
  const oggi = isoData(new Date());
  const w = settimanaDi(s, oggi);
  const g = w && w.giorni.find((x) => x.data === oggi);
  const exOggi = new Set(s.pref.escludi || []);
  const libere = (p) => ricettePerPasto(g, p).filter((r) => !ricettaEsclusi(r, exOggi).length).slice(0, 2);
  const diOggi = g ? [...libere("pranzo"), ...libere("cena")] : [];
  return `<section class="card" aria-labelledby="idee-tit">
    <h3 id="idee-tit">${esc(L({ it: "Cosa hai voglia di mangiare?", en: "What do you feel like eating?" }))}</h3>
    <p class="minimo">${esc(L({ it: "Aggiungi gli ingredienti che hai o che vuoi usare: ti propongo le ricette del piano e le tue che li usano, con le dosi giuste.", en: "Add the ingredients you have or want to use: I suggest the plan's recipes and yours that use them, in the right amounts." }))}</p>
    <div class="scelte" aria-live="polite">${scelti.map((x, i) => `<span class="chip attivo ${appena === chiave(x) ? "appena" : ""}">${I.spunta}${esc(etichetta(x))}<button class="chip-x" data-az="ideeTogli" data-i="${i}" aria-label="${esc(L({ it: `Togli ${etichetta(x)}`, en: `Remove ${etichetta(x)}` }))}">${I.chiudi}</button></span>`).join("") || `<span class="minimo">${esc(L({ it: "Nessun ingrediente ancora.", en: "No ingredients yet." }))}</span>`}</div>
    <input class="cerca" type="search" id="cerca-idee" value="${esc(q)}" data-input="ideeCerca" placeholder="${esc(L({ it: "Es. salmone, zucchine, quinoa", en: "E.g. salmon, courgettes, quinoa" }))}" aria-label="${esc(L({ it: "Aggiungi un ingrediente", en: "Add an ingredient" }))}">
    ${q.trim().length >= 2 ? `<div class="scelte">${sugg.map((x, i) => `<button class="chip" data-az="ideeAggiungi" data-i="${i}">${I.piu}${esc(etichetta(x))}</button>`).join("")}
      <button class="chip" data-az="ideeAggiungiTesto">${I.piu}${esc(L({ it: `"${q.trim()}" come parola`, en: `"${q.trim()}" as a word` }))}</button></div>` : ""}
    <div class="scelte" role="group" aria-label="${esc(L({ it: "Pasto", en: "Meal" }))}">${["tutti", "colazione", "spuntino", "pranzo", "cena"].map((p) => `<button class="chip ${pasto === p ? "attivo" : ""}" aria-pressed="${pasto === p}" data-az="ideePasto" data-p="${p}">${esc(p === "tutti" ? L({ it: "Tutti i pasti", en: "All meals" }) : L(DEF[p].nome))}</button>`).join("")}</div>
  </section>
  ${scelti.length ? `<h2 class="sez" id="idee-ris">${esc(lista.length ? L({ it: `${lista.length} ${lista.length === 1 ? "ricetta" : "ricette"} per te`, en: `${lista.length} ${lista.length === 1 ? "recipe" : "recipes"} for you` }) : L({ it: "Nessuna ricetta con questi ingredienti", en: "No recipe with these ingredients" }))}</h2>
    ${nascoste ? `<p class="minimo">${esc(L({ it: `${nascoste} ${nascoste === 1 ? "ricetta nascosta: contiene" : "ricette nascoste: contengono"} ingredienti che hai tolto (${(s.pref.escludi || []).slice(0, 4).map((id) => nomeEscluso(id, lingua())).join(", ")}${(s.pref.escludi || []).length > 4 ? "..." : ""}).`, en: `${nascoste} ${nascoste === 1 ? "recipe hidden: it holds" : "recipes hidden: they hold"} ingredients you removed.` }))} <a href="#/settimana">${esc(L({ it: "Cambia", en: "Change" }))}</a></p>` : ""}
    ${lista.length ? lista.slice(0, 12).map(({ r, usati, altri, kcal, dec, senza }) => `<div class="card piatta ricetta-card" data-az="apriRicetta" data-id="${esc(r.id)}" role="button" tabindex="0">
        <div class="tit">${esc(L(r.titolo))}</div>
        <div class="meta"><span class="etichetta">${I.orologio}${esc(String(r.minuti || "?"))} min</span><span class="etichetta oliva">${esc(L(DEF[r.pasto] ? DEF[r.pasto].nome : { it: r.pasto, en: r.pasto }))}</span><span class="etichetta">${kcal.completo ? "" : "≥ "}${esc(num(kcal.tot.kcal))} kcal</span>${r.mia ? `<span class="etichetta viola">${esc(L({ it: "tua", en: "yours" }))}</span>` : ""}${esitoHtml(dec.esito)}</div>
        <div class="minimo">${I.spunta} ${esc(L({ it: `Usa ${usati.length} di ${scelti.length}: `, en: `Uses ${usati.length} of ${scelti.length}: ` }) + usati.map(etichetta).join(", "))}</div>
        ${altri.length ? `<div class="minimo">${esc(L({ it: "Ti serve anche: ", en: "You also need: " }) + altri.slice(0, 5).join(", ") + (altri.length > 5 ? "..." : ""))}</div>` : ""}
        ${senza.length ? `<div class="minimo">${esc(L({ it: "Fai senza: ", en: "Leave out: " }) + senza.map((id) => nomeEscluso(id, lingua())).join(", ") + L({ it: " (tolti da te)", en: " (you removed them)" }))}</div>` : ""}
      </div>`).join("") : `<p class="piccolo muted">${esc(L({ it: "Prova a togliere un ingrediente o a cambiare pasto.", en: "Try removing an ingredient or changing the meal." }))}</p>`}`
    : `<h2 class="sez">${esc(L({ it: "Le ricette di oggi", en: "Today's recipes" }))}</h2>
    ${diOggi.length ? diOggi.map((r) => cartaRicetta(r)).join("") : `<p class="piccolo muted">${esc(L({ it: "Oggi i pasti del piano non hanno una ricetta abbinata: aggiungi un ingrediente qui sopra.", en: "Today's planned meals have no matching recipe: add an ingredient above." }))}</p>`}`}`;
}

export function dopo() {
  const c = document.getElementById("cerca-idee");
  if (c && q && document.activeElement !== c) { c.focus(); c.setSelectionRange(c.value.length, c.value.length); }
  appena = null;
}

function aggiungi(x) {
  if (scelti.some((y) => chiave(y) === chiave(x))) return;
  scelti.push(x);
  appena = chiave(x);
  q = "";
  ridisegna();
  const n = proposte(S()).length;
  toast(L({ it: `Aggiunto: ${etichetta(x)} · ${n} ${n === 1 ? "ricetta" : "ricette"}`, en: `Added: ${etichetta(x)} · ${n} ${n === 1 ? "recipe" : "recipes"}` }));
}

let timer = null;
registra({
  apriIdee: (d) => {
    if (d.con === "verdure" || d.con === "frutta") { const x = { tipo: "gruppo", id: d.con }; if (!scelti.some((y) => chiave(y) === chiave(x))) { scelti.push(x); appena = chiave(x); } }
    location.hash = "#/cibo/idee";
  },
  ideeCerca: (d, el) => { q = el.value; clearTimeout(timer); timer = setTimeout(() => ridisegna(), 180); },
  ideeAggiungi: (d) => { const x = suggerimentiIngredienti(S())[Number(d.i)]; if (x) aggiungi(x); },
  ideeAggiungiTesto: () => { const t = q.trim(); if (t.length >= 2) aggiungi({ tipo: "testo", testo: t.slice(0, 40) }); },
  ideeTogli: (d) => { scelti.splice(Number(d.i), 1); ridisegna(); },
  ideePasto: (d) => { pasto = d.p; ridisegna(); },
});
