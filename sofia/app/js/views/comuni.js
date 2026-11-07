/* Pieces shared by several screens: meals, recipes, council verdicts. */
import { S, cambia } from "../store.js";
import { t, L, lingua } from "../i18n.js";
import { I, esc, quantita, giornoSett, dataLunga, maiuscola } from "../ui.js";
import { registra, apriFoglio, chiudiFoglio, toast } from "../ctx.js";
import { ALIMENTI, nome } from "../data/alimenti.js";
import { COLAZIONE, SPUNTINO, PRANZO, CENA, DOPOCENA } from "../data/piano.js";
import { RICETTE } from "../data/ricette.js";
import { OPZ, vociPasto, rimescolaPasto, invertiPranzoCena, vicine, ETICHETTE_CAT } from "../engine/planner.js";
import { consiglioRicetta, AGENTI } from "../engine/consiglio.js";
import { nuovoSeme } from "../engine/rng.js";
import { valoriVoci, PASTI as PASTI_KCAL } from "../engine/nutrizione.js";
import { opzioniNutrizione, istantanea, logDi, voceSua, cambiaConAnnulla, nomePasto } from "./diario.js";
import { foglioMia } from "./ricettemie.js";

export const PASTI_ORDINE = ["colazione", "spuntino", "pranzo", "cena", "dopocena"];
export const DEF = { colazione: COLAZIONE, spuntino: SPUNTINO, pranzo: PRANZO, cena: CENA, dopocena: DOPOCENA };

export function settimanaDi(s, data) {
  return s.settimane.find((w) => w.giorni.some((g) => g.data === data)) || null;
}

/* Main line of a meal, short. */
export function titoloPasto(g, pasto) {
  const p = g[pasto];
  if (!p) return "";
  if (pasto === "pranzo" && p.tipo === "composto") return `${nome(OPZ[p.carb].voci[0].a, lingua())} + ${nome(OPZ[p.prot].voci[0].a, lingua())}`;
  if (pasto === "cena" && p.tipo === "composto") {
    const v = vociPasto(g, "cena")[0];
    return nome(v.a, lingua());
  }
  if (p.tipo === "combinato" || p.tipo === "idea") {
    const o = OPZ[p.id];
    if (o.testo) return L(o.testo);
    return vociPasto(g, pasto).filter((v) => !["verdure", "olio_evo", "passata"].includes(v.a)).map((v) => nome(v.a, lingua())).slice(0, 3).join(" + ");
  }
  return vociPasto(g, pasto).map((v) => (v.testo ? L(v.testo) : nome(v.a, lingua()))).slice(0, 3).join(" + ");
}

export function dosiBrevi(g, pasto) {
  return vociPasto(g, pasto).map((v) => `${v.testo ? L(v.testo) : nome(v.a, lingua())} ${quantita(v)}`).join(" · ");
}

export function ricettePerPasto(g, pasto) {
  const p = g[pasto];
  if (!p) return [];
  return RICETTE.filter((r) => {
    if (r.pasto !== pasto) return false;
    const a = r.abbina;
    if (a.opzione) return p.id === a.opzione;
    if (a.combinato) return p.tipo === "combinato" && p.id === a.combinato;
    if (a.idea) return p.tipo === "idea" && p.id === a.idea;
    if (pasto === "pranzo" && p.tipo === "composto") return a.prot && a.prot.includes(p.prot) && a.carb && a.carb.includes(p.carb);
    if (pasto === "cena" && p.tipo === "composto") return a.prot && a.prot.includes(p.prot) && (!a.variante || !p.variante || a.variante === p.variante);
    return false;
  }).concat(pasto === "pranzo" && p.tipo === "composto" ? RICETTE.filter((r) => r.pasto === "pranzo" && r.abbina.prot && r.abbina.prot.includes(p.prot) && !(r.abbina.carb || []).includes(p.carb)) : []);
}

const ICO = { colazione: I.colazione, spuntino: I.spuntino, pranzo: I.pranzo, cena: I.cena, dopocena: I.dopocena };

export function rigaPasto(g, pasto, { conSpunta = true } = {}) {
  const p = g[pasto];
  if (!p) return "";
  const def = DEF[pasto];
  const s = S();
  const diario = (s.diario[g.data] || {}).pasti || {};
  const fatto = diario[pasto] === true;
  const registrato = logDi(s, g.data)[pasto];
  const voci = vociPasto(g, pasto);
  const kc = valoriVoci(registrato ? registrato.voci : voci, opzioniNutrizione(s));
  const kcal = `${registrato ? "" : "≈ "}${kc.completo ? "" : "≥ "}${Math.round(kc.tot.kcal)} kcal${registrato && registrato.fonte === "composto" ? " · " + L({ it: "composto da te", en: "composed by you" }) : ""}`;
  const escluso = voci.some((v) => (s.pref.escludi || []).includes(v.a));
  const ric = ricettePerPasto(g, pasto)[0];
  const slot = g.invertito && (pasto === "pranzo" || pasto === "cena") ? (pasto === "pranzo" ? "cena" : "pranzo") : pasto;
  const cat = p.cat ? `<span class="cat ${p.cat}" title="${esc(L(ETICHETTE_CAT[p.cat]))}">${esc(L(ETICHETTE_CAT[p.cat]).charAt(0).toUpperCase())}</span>` : "";
  return `<div class="pasto ${def.facoltativo ? "facoltativo" : ""}">
    <div class="ico">${ICO[pasto]}</div>
    <div class="corpo" data-az="apriPasto" data-data="${g.data}" data-pasto="${pasto}" role="button" tabindex="0">
      <div class="nome">${esc(L(DEF[slot].nome))}${def.facoltativo ? ` · ${esc(t("facoltativo"))}` : ""}${g.invertito && slot !== pasto ? ` · ${esc(t("invertito"))}` : ""}</div>
      <div class="cosa">${cat}${esc(titoloPasto(g, pasto))}</div>
      <div class="dosi">${esc(dosiBrevi(g, pasto))}</div>
      <div class="kcal-riga">${esc(kcal)}${escluso ? ` <span class="etichetta terra">${esc(L({ it: "c'è un cibo che non mangi", en: "has a food you skip" }))}</span>` : ""}</div>
      ${ric ? `<div class="ricetta-link">${I.libro}${esc(L(ric.titolo))}</div>` : ""}
    </div>
    ${conSpunta ? `<button class="spunta ${fatto ? "fatto" : ""}" data-az="spunta" data-data="${g.data}" data-pasto="${pasto}" aria-pressed="${fatto}" aria-label="${esc(L({ it: "Segna come mangiato", en: "Mark as eaten" }))}">${I.spunta}</button>` : ""}
  </div>`;
}

function lineaVoce(v) {
  const alt = (v.o || []).map((x) => `${x.testo ? L(x.testo) : nome(x.a, lingua())} ${quantita(x)}`);
  /* one gluten chip per food; a shared amount ("avena e cioccolato") names each food */
  const cibi = [v.a, ...(v.con || [])];
  const gf = cibi.map((id) => {
    const a = ALIMENTI[id];
    const chi = cibi.length > 1 ? nome(id, lingua()) + ": " : "";
    return a && a.glutine === "certificata" ? `<span class="etichetta viola">${esc(chi + L({ it: "certificata senza glutine", en: "certified gluten free" }))}</span>` : a && a.glutine === "etichetta" ? `<span class="etichetta">${esc(chi + L({ it: "dicitura senza glutine", en: "gluten-free label" }))}</span>` : "";
  }).join(" ");
  return `<li><div><div>${esc(v.testo ? L(v.testo) : nome(v.a, lingua()))}</div>${alt.length ? `<div class="minimo">${esc(L({ it: "oppure", en: "or" }))} ${esc(alt.join(L({ it: " oppure ", en: " or " })))}</div>` : ""}${gf ? `<div data-s="s96ad6">${gf}</div>` : ""}</div><span class="q">${esc(quantita(v))}</span></li>`;
}

export function foglioPasto(data, pasto) {
  const s = S();
  const w = settimanaDi(s, data);
  if (!w) return `<p>${esc(t("nessunaSettimana"))}</p>`;
  const i = w.giorni.findIndex((g) => g.data === data);
  const g = w.giorni[i];
  const def = DEF[pasto];
  const voci = vociPasto(g, pasto);
  const ricette = ricettePerPasto(g, pasto);
  const note = (def.note || []).concat(pasto === "cena" ? CENA.conversioni : []);
  return `<button class="icon-btn chiudi" data-az="chiudiFoglio" aria-label="${esc(t("chiudi"))}">${I.chiudi}</button>
    <div class="minimo">${esc(maiuscola(dataLunga(data)))}</div>
    <h2>${esc(L(def.nome))}: ${esc(titoloPasto(g, pasto))}</h2>
    <div class="muted piccolo">${esc(L({ it: "Il piano dice circa", en: "The plan says about" }))} ${def.kcal[0] === def.kcal[1] ? def.kcal[0] : def.kcal.join("-")} kcal · ${esc(L({ it: "proteine", en: "protein" }))} ${def.macro.proteine.join("-")} g · ${esc(L({ it: "carboidrati", en: "carbs" }))} ${def.macro.carboidrati.join("-")} g · ${esc(L({ it: "grassi", en: "fat" }))} ${def.macro.grassi.join("-")} g</div>
    ${(() => { const r = valoriVoci(voci, opzioniNutrizione(s)); return `<div class="piccolo" data-s="sd6f2a"><strong>${esc(L({ it: "Questo pasto", en: "This meal" }))}: ${r.completo ? "" : "≥ "}${Math.round(r.tot.kcal)} kcal</strong> · P ${Math.round(r.tot.prot)} g · C ${Math.round(r.tot.carb)} g · G ${Math.round(r.tot.fat)} g${r.stime.length ? `<div class="minimo">${esc(L({ it: "Stime", en: "Estimates" }))}: ${esc(r.stime.join("; "))}</div>` : ""}${r.mancanti.length ? `<div class="minimo">${esc(t("infoMancante"))}: ${esc(r.mancanti.map((a) => nome(a, lingua())).join(", "))}</div>` : ""}</div>`; })()}
    <ul class="lista-ingr">${voci.map(lineaVoce).join("")}</ul>
    ${pasto === "pranzo" && g[pasto].tipo === "composto" ? `<p class="piccolo muted">${esc(L(PRANZO.regola))}</p>` : ""}
    ${note.length ? `<div class="stack">${note.map((n) => `<div class="avviso">${I.info}<div>${esc(L(n))}</div></div>`).join("")}</div>` : ""}
    <div class="riga wrap" data-s="sd6f2a">
      <button class="btn primario" data-az="rimescolaPasto" data-data="${data}" data-pasto="${pasto}">${I.rimescola}${esc(t("rimescolaPasto"))}</button>
      ${pasto === "pranzo" || pasto === "cena" ? `<button class="btn" data-az="inverti" data-data="${data}">${I.scambio}${esc(t("inverti"))}</button>` : ""}
      <button class="btn" data-az="apriComponi" data-data="${data}" data-pasto="${pasto}">${I.piu}${esc(L({ it: "Ho mangiato altro: componi", en: "I ate something else: compose" }))}</button>
    </div>
    ${ricette.length ? `<h2 class="sez">${esc(t("ricette"))}</h2>${ricette.slice(0, 4).map((r) => cartaRicetta(r)).join("")}` : `<p class="muted piccolo" data-s="sd6f2a">${esc(L({ it: "Cucina come preferisci: conta rispettare le dosi.", en: "Cook it as you like: what matters is the amounts." }))}</p>`}`;
}

export function cartaRicetta(r) {
  const pref = S().preferite.includes(r.id);
  return `<div class="card piatta ricetta-card" data-az="apriRicetta" data-id="${r.id}" role="button" tabindex="0">
    <div class="riga tra"><div class="tit">${esc(L(r.titolo))}</div>${pref ? `<span data-s="sb98c5">${I.cuorePieno}</span>` : ""}</div>
    <div class="meta">
      <span class="etichetta">${I.orologio}${r.minuti} ${esc(t("minuti"))}</span>
      <span class="etichetta oliva">${esc(L(DEF[r.pasto].nome))}</span>
      ${r.mia ? `<span class="etichetta viola">${esc(L({ it: "tua", en: "yours" }))}</span>` : ""}
      ${(r.tag || []).includes("omega3") ? `<span class="etichetta viola">omega-3</span>` : ""}
      ${(r.tag || []).includes("ferro_vitc") ? `<span class="etichetta terra">${esc(L({ it: "ferro + vitamina C", en: "iron + vitamin C" }))}</span>` : ""}
      ${(r.tag || []).includes("calcio") ? `<span class="etichetta">${esc(L({ it: "calcio", en: "calcium" }))}</span>` : ""}
    </div>
  </div>`;
}

export function verdettiHtml(dec, { compatto = false } = {}) {
  const sig = { ok: "ok", nota: "nota", adatta: "adatta", veto: "veto" };
  const simbolo = { ok: "✓", nota: "i", adatta: "~", veto: "×" };
  return dec.verdetti.map((v) => {
    const a = AGENTI.find((x) => x.id === v.agente);
    if (compatto && v.livello === "ok") return "";
    return `<div class="seggio"><div class="sigillo ${sig[v.livello]}" aria-hidden="true">${simbolo[v.livello]}</div>
      <div><div class="riga tra"><strong>${esc(L(a.nome))}</strong><span class="minimo">${esc(L({ it: "seggio", en: "seat" }))} ${a.anzianita}${a.veto ? " · veto" : ""}</span></div>
      <div class="piccolo muted">${esc({ ok: L({ it: "Nessun rilievo", en: "No findings" }), nota: L({ it: "Nota", en: "Note" }), adatta: L({ it: "Adattamento", en: "Adaptation" }), veto: L({ it: "Veto", en: "Veto" }) }[v.livello])}</div>
      ${v.motivi.length ? `<ul>${v.motivi.slice(0, 8).map((m) => `<li>${esc(L(m))}</li>`).join("")}</ul>` : ""}</div></div>`;
  }).join("");
}

export function esitoHtml(esito) {
  const ico = esito === "approvata" ? I.ok : esito === "adattata" ? I.scambio : I.no;
  return `<span class="esito ${esito}">${ico}${esc(t(esito))}</span>`;
}

export function foglioRicetta(id) {
  const r = RICETTE.find((x) => x.id === id);
  if (!r) return "";
  const pref = S().preferite.includes(r.id);
  const dec = consiglioRicetta(r);
  return `<button class="icon-btn chiudi" data-az="chiudiFoglio" aria-label="${esc(t("chiudi"))}">${I.chiudi}</button>
    <div class="minimo">${esc(L(DEF[r.pasto].nome))} · ${r.minuti} ${esc(t("minuti"))}</div>
    <h2>${esc(L(r.titolo))}</h2>
    <div class="riga wrap" data-s="s9e40d">${esitoHtml(dec.esito)}
      <button class="btn piccolo fantasma" data-az="preferita" data-id="${r.id}" aria-pressed="${pref}">${pref ? I.cuorePieno : I.cuore}${esc(L({ it: pref ? "Tra le preferite" : "Preferita", en: pref ? "In favourites" : "Favourite" }))}</button></div>
    <h3 data-s="s56f43">${esc(t("ingredienti"))} <span class="minimo">${esc(L({ it: "dosi del piano, 1 porzione", en: "plan amounts, 1 serving" }))}</span></h3>
    <ul class="lista-ingr">${r.ingredienti.map(lineaVoce).join("")}</ul>
    ${r.extra && r.extra.length ? `<p class="piccolo"><strong>${esc(t("aPiacere"))}:</strong> ${esc(r.extra.map(L).join(", "))}</p>` : ""}
    <h3>${esc(t("procedimento"))}</h3>
    <ol class="passi-ric">${(r.passi[lingua()] || r.passi.it).map((p) => `<li>${esc(p)}</li>`).join("")}</ol>
    <details><summary class="piccolo"><strong>${esc(t("verdetti"))}</strong></summary>${verdettiHtml(dec)}</details>`;
}

/* ----------------------------------------------------------- actions */
/* Tick or untick a meal as eaten; ticking logs the plan's lines unless she already logged that meal. */
function spunta(s, d) {
  const g = (s.diario[d.data] = s.diario[d.data] || {});
  g.pasti = g.pasti || {};
  g.pasti[d.pasto] = !g.pasti[d.pasto];
  g.mangiato = g.mangiato || {};
  if (g.pasti[d.pasto]) {
    const w = settimanaDi(s, d.data);
    const giorno = w && w.giorni.find((x) => x.data === d.data);
    if (giorno && !g.mangiato[d.pasto]) g.mangiato[d.pasto] = { voci: istantanea(vociPasto(giorno, d.pasto)), fonte: "piano", ora: new Date().toISOString() };
  } else delete g.mangiato[d.pasto];
}

registra({
  chiudiFoglio: () => chiudiFoglio(),
  apriPasto: (d) => apriFoglio(() => foglioPasto(d.data, d.pasto)),
  apriRicetta: (d) => apriFoglio(() => (String(d.id).startsWith("mia-") ? foglioMia(d.id) : foglioRicetta(d.id))),
  preferita: (d) => cambia((s) => {
    const i = s.preferite.indexOf(d.id);
    if (i >= 0) s.preferite.splice(i, 1); else s.preferite.push(d.id);
  }),
  /* Ticking a meal logs the plan's amounts for it; unticking removes them. */
  spunta: (d) => {
    /* Unticking a meal she weighed, composed or corrected removes her work: it can be undone. */
    const e = logDi(S(), d.data)[d.pasto];
    const togli = !!((S().diario[d.data] || {}).pasti || {})[d.pasto];
    if (togli && voceSua(e)) return cambiaConAnnulla(d.data, d.pasto, 0, L({ it: `${nomePasto(d.pasto)} tolto dal diario`, en: `${nomePasto(d.pasto)} removed from the diary` }), (s) => spunta(s, d));
    cambia((s) => spunta(s, d));
  },
  rimescolaPasto: (d) => {
    const s = S();
    const w = settimanaDi(s, d.data);
    if (!w) return;
    const i = w.giorni.findIndex((g) => g.data === d.data);
    const { storia, seguenti } = vicine(s.settimane, w.inizio);
    const nuova = rimescolaPasto(w, i, d.pasto, nuovoSeme(), storia, s.pref, seguenti);
    if (!nuova) { toast(L({ it: "Nessuna alternativa che rispetti tutti i limiti della settimana", en: "No alternative that keeps every weekly limit" })); return; }
    cambia((st) => { const k = st.settimane.findIndex((x) => x.inizio === w.inizio); st.settimane[k] = { ...nuova, modificata: new Date().toISOString() }; });
    toast(L({ it: "Pasto rimescolato: il consiglio ha controllato la settimana", en: "Meal shuffled: the council checked the week" }));
  },
  inverti: (d) => {
    const s = S();
    const w = settimanaDi(s, d.data);
    if (!w) return;
    const i = w.giorni.findIndex((g) => g.data === d.data);
    const nuova = invertiPranzoCena(w, i);
    cambia((st) => { const k = st.settimane.findIndex((x) => x.inizio === w.inizio); st.settimane[k] = nuova; });
  },
});

export { giornoSett };
