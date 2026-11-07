/*
 * Le mie ricette: Sofia writes her own recipe from the plan's foods and the
 * foods she added; every ingredient gets the plan's amount for that meal (or
 * the portion the brain computed), and the council judges the result.
 */
import { S, cambia } from "../store.js";
import { L, lingua, t } from "../i18n.js";
import { I, esc, num, quantita } from "../ui.js";
import { registra, apriFoglio, chiudiFoglio, ridisegna, toast } from "../ctx.js";
import { ALIMENTI, nome } from "../data/alimenti.js";
import { COLAZIONE, SPUNTINO, PRANZO, CENA, DOPOCENA } from "../data/piano.js";
import { valoriVoci, confrontoPasto, PASTI } from "../engine/nutrizione.js";
import { valutaAlimento } from "../engine/cervello.js";
import { NOTE_LUPUS, notePersonali, VETI } from "../engine/consiglio.js";
import { opzioniNutrizione, nomePasto, nomeVoce } from "./diario.js";
import { badge } from "./miei.js";
import { isoData } from "../engine/planner.js";
import { renaleFuoriRange } from "../engine/salute.js";

const DEF = { colazione: COLAZIONE, spuntino: SPUNTINO, pranzo: PRANZO, cena: CENA, dopocena: DOPOCENA };
const opzioniDi = (pasto) => {
  const d = DEF[pasto];
  if (pasto === "pranzo") return [...PRANZO.carboidrati, ...PRANZO.proteine, ...PRANZO.combinati.opzioni];
  if (pasto === "cena") return [...CENA.proteine, ...CENA.idee, { voci: CENA.contorno }];
  return d.opzioni;
};

/* The plan's own amount of a food in that meal, or the portion the brain computed for her food. */
export function doseDi(a, pasto, s = S()) {
  const mio = (s.alimentiExtra || {})[a];
  if (mio) { const p = (mio.porzioni || []).find((x) => x.pasto === pasto) || (mio.porzioni || [])[0]; return p ? { a, q: p.q, u: p.u || "g" } : { a, q: 100, u: "g", stima: true }; }
  for (const o of opzioniDi(pasto)) for (const v of o.voci) {
    if (v.a === a) return { a, q: v.q, u: v.u };
    for (const x of v.o || []) if (x.a === a) return { a, q: x.q, u: x.u };
  }
  if (a === "verdure") return { a, q: 300, u: "g" };
  if (a === "olio_evo") return { a, q: 10, u: "g" };
  return { a, q: 100, u: "g", fuoriPasto: true };
}

let bozza = null;
const nuova = () => ({ titolo: "", pasto: "pranzo", minuti: 20, voci: [], extra: "", passi: "" });

/* Verdict of a recipe: the worst of its ingredients, plus the free-text extras. */
export function giudicaRicetta(r, s = S()) {
  const ctx = { profilo: s.profilo, renaleFuoriRange: renaleFuoriRange(s, isoData(new Date())) };
  const motivi = [];
  let livello = "si";
  const peggio = (l) => { if (l === "no" || (l === "medio" && livello === "si")) livello = l; };
  for (const v of r.voci) {
    const mio = (s.alimentiExtra || {})[v.a];
    if (mio) { const x = valutaAlimento(mio, ctx); peggio(x.livello); if (x.livello !== "si") motivi.push({ it: `${mio.nome}: ${x.livello === "no" ? "non adatto" : "con attenzione"}`, en: `${mio.nome}: ${x.livello === "no" ? "not suitable" : "with care"}` }); }
    if (v.fuoriPasto) { peggio("medio"); motivi.push({ it: `${nomeVoce(v, s)}: non previsto in questo pasto dal piano`, en: `${nomeVoce(v, s)}: not in this meal in the plan` }); }
    if ((s.pref.escludi || []).includes(v.a)) motivi.push({ it: `${nomeVoce(v, s)}: è tra i cibi che non mangi`, en: `${nomeVoce(v, s)}: it is among the foods you skip` });
  }
  const extra = String(r.extra || "").split(",").map((x) => x.trim()).filter(Boolean);
  for (const e of extra) {
    const x = valutaAlimento({ nome: e, fonte: "testo", per100: null, classe: "spezie" }, ctx);
    const vetoGlutine = x.seggi.find((z) => z.agente === "glutine" && z.livello === "veto");
    if (vetoGlutine) { peggio("no"); motivi.push({ it: `${e}: ${vetoGlutine.motivi[0].it}`, en: `${e}: ${vetoGlutine.motivi[0].en}` }); }
    for (const v of VETI.filter((z) => z.agente === "lupus")) if (v.re.test(e)) { peggio("no"); motivi.push({ it: v.it, en: v.en }); }
    for (const n of notePersonali([e], s.profilo)) { peggio("no"); motivi.push({ it: n.it, en: n.en }); }
    for (const n of NOTE_LUPUS) if (n.re.test(e)) motivi.push({ it: n.it, en: n.en });
  }
  const val = valoriVoci(r.voci, opzioniNutrizione(s));
  const conf = confrontoPasto(r.pasto, val.tot.kcal);
  if (conf.stato === "sopra") { peggio("medio"); motivi.push({ it: `Sopra le calorie del pasto (${Math.round(val.tot.kcal)} kcal, il piano dice circa ${conf.lo === conf.hi ? conf.lo : conf.lo + "-" + conf.hi})`, en: `Above the meal's calories (${Math.round(val.tot.kcal)} kcal, the plan says about ${conf.lo === conf.hi ? conf.lo : conf.lo + "-" + conf.hi})` }); }
  return { livello, motivi, val, conf };
}

/* Own recipes in the shape of the curated ones, for lists and cards. */
export function mieComeRicette(s = S()) {
  return (s.ricetteMie || []).map((r) => ({ ...r, titolo: { it: r.titolo, en: r.titolo }, ingredienti: r.voci, passi: { it: r.passiLista || [], en: r.passiLista || [] }, extra: (r.extra ? String(r.extra).split(",").map((x) => x.trim()).filter(Boolean) : []).map((x) => ({ it: x, en: x })), mia: true, tag: [] }));
}

function foglioNuova() {
  const s = S();
  const b = bozza;
  const gruppi = {};
  for (const [id, a] of Object.entries(ALIMENTI)) if (!["acqua", "caffe", "tisane"].includes(id)) (gruppi[a.gruppo] = gruppi[a.gruppo] || []).push([id, L(a)]);
  const miei = Object.values(s.alimentiExtra || {}).filter((x) => x.livello !== "no");
  const select = `<select data-cambia="ricAggiungi" aria-label="${esc(L({ it: "Aggiungi un ingrediente", en: "Add an ingredient" }))}"><option value="">${esc(L({ it: "+ Aggiungi un ingrediente", en: "+ Add an ingredient" }))}</option>
    ${miei.length ? `<optgroup label="${esc(L({ it: "I miei cibi", en: "My foods" }))}">${miei.map((x) => `<option value="${esc(x.id)}">${esc(x.nome)}</option>`).join("")}</optgroup>` : ""}
    ${Object.entries(gruppi).map(([g, lista]) => `<optgroup label="${esc(g)}">${lista.map(([id, n]) => `<option value="${id}">${esc(n)}</option>`).join("")}</optgroup>`).join("")}</select>`;
  const giudizio = b.voci.length ? giudicaRicetta(b, s) : null;
  return `<button class="icon-btn chiudi" data-az="chiudiFoglio" aria-label="${esc(t("chiudi"))}">${I.chiudi}</button>
    <h2>${esc(L({ it: "Nuova ricetta", en: "New recipe" }))}</h2>
    <label class="campo"><span>${esc(L({ it: "Nome", en: "Name" }))}</span><input value="${esc(b.titolo)}" maxlength="80" data-input="ricTitolo"></label>
    <div class="campi2"><label class="campo"><span>${esc(L({ it: "Pasto", en: "Meal" }))}</span><select data-cambia="ricPasto">${Object.keys(DEF).map((p) => `<option value="${p}" ${b.pasto === p ? "selected" : ""}>${esc(nomePasto(p))}</option>`).join("")}</select></label>
    <label class="campo"><span>${esc(L({ it: "Minuti", en: "Minutes" }))}</span><input type="number" min="1" max="600" value="${esc(b.minuti)}" data-input="ricMinuti" inputmode="numeric"></label></div>
    <h3 data-s="s56f43">${esc(t("ingredienti"))} <span class="minimo">${esc(L({ it: "dosi del piano per questo pasto", en: "the plan's amounts for this meal" }))}</span></h3>
    <ul class="lista-ingr">${b.voci.map((v, i) => `<li><span>${esc(nomeVoce(v, s))}${v.fuoriPasto ? ` <span class="etichetta attenzione">${esc(L({ it: "non in questo pasto", en: "not in this meal" }))}</span>` : ""}</span><span class="riga"><span class="q">${esc(quantita(v))}</span><button class="icon-btn mini" data-az="ricTogli" data-i="${i}" aria-label="${esc(L({ it: "Togli", en: "Remove" }))}">${I.chiudi}</button></span></li>`).join("")}</ul>
    ${select}
    <label class="campo"><span>${esc(L({ it: "A piacere (spezie, erbe, limone), separati da virgola", en: "To taste (spices, herbs, lemon), comma separated" }))}</span><input value="${esc(b.extra)}" maxlength="200" data-input="ricExtra"></label>
    <label class="campo"><span>${esc(L({ it: "Procedimento (un passo per riga)", en: "Method (one step per line)" }))}</span><textarea data-input="ricPassi" maxlength="2000">${esc(b.passi)}</textarea></label>
    ${giudizio ? `<section class="card piatta"><div class="riga tra"><strong>${esc(L({ it: "Il consiglio", en: "The council" }))}</strong>${badge(giudizio.livello)}</div>
      <div class="piccolo">${giudizio.val.completo ? "" : "≥ "}${num(giudizio.val.tot.kcal)} kcal · P ${num(giudizio.val.tot.prot)} g · C ${num(giudizio.val.tot.carb)} g · G ${num(giudizio.val.tot.fat)} g</div>
      ${giudizio.motivi.length ? `<ul class="piccolo">${giudizio.motivi.map((m) => `<li>${esc(L(m))}</li>`).join("")}</ul>` : ""}</section>` : ""}
    <button class="btn primario pieno" data-az="ricSalva" ${b.titolo.trim() && b.voci.length ? "" : "disabled"}>${I.spunta}${esc(L({ it: "Salva la ricetta", en: "Save the recipe" }))}</button>`;
}

export function foglioMia(id) {
  const s = S();
  const r = (s.ricetteMie || []).find((x) => x.id === id);
  if (!r) return "";
  const g = giudicaRicetta(r, s);
  return `<button class="icon-btn chiudi" data-az="chiudiFoglio" aria-label="${esc(t("chiudi"))}">${I.chiudi}</button>
    <div class="minimo">${esc(nomePasto(r.pasto))} · ${r.minuti} ${esc(t("minuti"))} · ${esc(L({ it: "ricetta tua", en: "your recipe" }))}</div>
    <h2>${esc(r.titolo)}</h2>
    <div class="riga wrap" data-s="s9e40d">${badge(g.livello)}<span class="piccolo">${g.val.completo ? "" : "≥ "}${num(g.val.tot.kcal)} kcal</span></div>
    <ul class="lista-ingr">${r.voci.map((v) => `<li><span>${esc(nomeVoce(v, s))}</span><span class="q">${esc(quantita(v))}</span></li>`).join("")}</ul>
    ${r.extra ? `<p class="piccolo"><strong>${esc(t("aPiacere"))}:</strong> ${esc(r.extra)}</p>` : ""}
    ${(r.passiLista || []).length ? `<h3>${esc(t("procedimento"))}</h3><ol class="passi-ric">${r.passiLista.map((p) => `<li>${esc(p)}</li>`).join("")}</ol>` : ""}
    ${g.motivi.length ? `<ul class="piccolo">${g.motivi.map((m) => `<li>${esc(L(m))}</li>`).join("")}</ul>` : ""}
    <button class="btn piccolo fantasma" data-az="ricElimina" data-id="${esc(r.id)}">${I.chiudi}${esc(L({ it: "Elimina la ricetta", en: "Delete the recipe" }))}</button>`;
}

registra({
  nuovaRicetta: () => { bozza = nuova(); apriFoglio(foglioNuova); },
  ricTitolo: (d, el) => { bozza.titolo = el.value; },
  ricMinuti: (d, el) => { bozza.minuti = Math.max(1, Math.min(600, Number(el.value) || 20)); },
  ricExtra: (d, el) => { bozza.extra = el.value; },
  ricPassi: (d, el) => { bozza.passi = el.value; },
  ricPasto: (d, el) => { bozza.pasto = el.value; bozza.voci = bozza.voci.map((v) => doseDi(v.a, bozza.pasto)); ridisegna(); },
  ricAggiungi: (d, el) => { if (!el.value) return; bozza.voci.push(doseDi(el.value, bozza.pasto)); ridisegna(); },
  ricTogli: (d) => { bozza.voci.splice(Number(d.i), 1); ridisegna(); },
  ricSalva: () => {
    const b = bozza;
    if (!b.titolo.trim() || !b.voci.length) return;
    const id = "mia-" + Date.now().toString(36);
    cambia((s) => { s.ricetteMie.push({ id, titolo: b.titolo.trim().slice(0, 80), pasto: b.pasto, minuti: b.minuti, voci: b.voci, extra: b.extra.trim(), passiLista: b.passi.split("\n").map((x) => x.trim()).filter(Boolean).slice(0, 30), creata: isoData(new Date()) }); });
    chiudiFoglio();
    toast(L({ it: "Ricetta salvata: la trovi tra le ricette", en: "Recipe saved: it is among the recipes" }));
  },
  ricElimina: (d) => { cambia((s) => { s.ricetteMie = s.ricetteMie.filter((x) => x.id !== d.id); }); chiudiFoglio(); },
});
void lingua; void nome; void PASTI;
