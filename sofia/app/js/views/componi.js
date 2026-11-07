/*
 * Componi: build a meal from the plan's choices (and the foods she added
 * herself, at their computed portion), see its calories and log it.
 */
import { S } from "../store.js";
import { L, lingua, t } from "../i18n.js";
import { I, esc, num, quantita } from "../ui.js";
import { registra, apriFoglio, chiudiFoglio, ridisegna, toast } from "../ctx.js";
import { nome } from "../data/alimenti.js";
import { COLAZIONE, SPUNTINO, PRANZO, CENA, DOPOCENA } from "../data/piano.js";
import { VERDURE, FRUTTA } from "../data/scelte.js";
import { OPZ, isoData } from "../engine/planner.js";
import { valoriVoci, confrontoPasto, PASTI } from "../engine/nutrizione.js";
import { opzioniNutrizione, registraNelDiario, nomePasto } from "./diario.js";

const ORDINE = ["colazione", "spuntino", "pranzo", "cena", "dopocena"];
let b = nuova("pranzo", isoData(new Date()));
function nuova(pasto, data) {
  return { pasto, data, modo: "componi", carb: "pc8", prot: "pp6", pane: "pane_gf", protCena: "cp6", verdure: ["zucchine", "pomodori"], frutta: "mirtilli", opzione: null };
}

/* ---------------------------------------------------------- choices */
const esclusi = (s) => new Set(s.pref.escludi || []);
function opzioneOk(o, ex) {
  return !o.voci.some((v) => ex.has(v.a) && !(v.o || []).some((x) => !ex.has(x.a)));
}
const mieiDi = (s, classi) => Object.entries(s.alimentiExtra || {}).filter(([, x]) => x.livello !== "no" && classi.includes(x.classe));
const porzioneMia = (x, pasto) => (x.porzioni || []).find((p) => p.pasto === pasto) || (x.porzioni || [])[0];

function voceSemplice(v) {
  const x = { a: v.a, q: v.q, u: v.u };
  if (v.con) x.con = v.con;
  if (v.testo) x.testo = v.testo;
  return x;
}
function vociOpzione(id) { return (OPZ[id] ? OPZ[id].voci : []).map(voceSemplice); }
function vociMio(s, id, pasto) {
  const x = s.alimentiExtra[id];
  const p = x && porzioneMia(x, pasto);
  return p ? [{ a: id, q: p.q, u: p.u || "g" }] : [];
}
const vociScelta = (s, id, pasto) => (id && id.startsWith("x:") ? vociMio(s, id.slice(2), pasto) : vociOpzione(id));

function verdure(s, totale = 300) {
  const scelte = b.verdure.length ? b.verdure : ["zucchine"];
  const q = Math.round(totale / scelte.length);
  return scelte.map((id) => (id.startsWith("x:") ? { a: id.slice(2), q, u: "g" } : { a: "verdure", q, u: "g", scelta: id }));
}
function conFrutta(voci) {
  return voci.map((v) => (v.a === "frutta" ? { ...v, scelta: b.frutta } : v));
}

export function vociComposte(s = S()) {
  const olio = { a: "olio_evo", q: 10, u: "g" };
  if (b.pasto === "pranzo" && b.modo === "componi") return [...vociScelta(s, b.carb, "pranzo"), ...vociScelta(s, b.prot, "pranzo"), ...verdure(s), olio];
  if (b.pasto === "pranzo") return vociOpzione(b.opzione || "pa1").flatMap((v) => (v.a === "verdure" ? verdure(s, v.q) : [v]));
  if (b.pasto === "cena" && b.modo === "componi") {
    const pane = b.pane.startsWith("x:") ? vociMio(s, b.pane.slice(2), "cena") : [{ pane_gf: { a: "pane_gf", q: 60, u: "g" }, gallette_saraceno: { a: "gallette_saraceno", q: 5, u: "pz" }, gallette_riso: { a: "gallette_riso", q: 5, u: "pz" }, patate: { a: "patate", q: 200, u: "g" } }[b.pane]];
    return [...vociScelta(s, b.protCena, "cena"), ...pane, ...verdure(s), olio];
  }
  if (b.pasto === "cena") return vociOpzione(b.opzione || "ci1").flatMap((v) => (v.a === "verdure" ? verdure(s, Array.isArray(v.q) ? v.q[1] : v.q) : [v]));
  const def = { colazione: COLAZIONE, spuntino: SPUNTINO, dopocena: DOPOCENA }[b.pasto];
  return conFrutta(vociOpzione(b.opzione || def.opzioni[0].id));
}

/* ---------------------------------------------------------- render */
function chip(azione, valore, attivo, testo, sotto = "") {
  return `<button class="chip scelta ${attivo ? "attivo" : ""}" data-az="${azione}" data-v="${esc(valore)}" aria-pressed="${attivo}"><span>${esc(testo)}</span>${sotto ? `<small>${esc(sotto)}</small>` : ""}</button>`;
}
function etichettaOpzione(o) {
  const v = o.voci[0];
  return `${v.testo ? L(v.testo) : nome(v.a, lingua())} ${quantita(v)}`;
}
const kcalDi = (voci, opz) => { const r = valoriVoci(voci, opz); return r.completo ? `${Math.round(r.tot.kcal)} kcal` : t("infoMancante"); };

function gruppoScelte(titolo, contenuto) {
  return `<div class="gruppo-scelte"><div class="lab-scelte">${esc(titolo)}</div><div class="scelte">${contenuto}</div></div>`;
}

export function renderComponi(s, { inFoglio = false } = {}) {
  const ex = esclusi(s), opz = opzioniNutrizione(s);
  const pasti = `<div class="chips">${ORDINE.map((p) => chip("cmpPasto", p, b.pasto === p, nomePasto(p))).join("")}</div>`;
  let corpo = "";
  const modi = (b.pasto === "pranzo" || b.pasto === "cena") ? `<div class="seg">${[["componi", { it: "Componi", en: "Compose" }], ["pronti", b.pasto === "pranzo" ? { it: "Già combinati", en: "Ready-combined" } : { it: "Idee", en: "Ideas" }]].map(([m, lab]) => `<button class="${b.modo === m ? "attivo" : ""}" data-az="cmpModo" data-v="${m}">${esc(L(lab))}</button>`).join("")}</div>` : "";
  const sceltaVerdure = gruppoScelte(L({ it: "Verdure (300 g in tutto, fino a 3)", en: "Vegetables (300 g in all, up to 3)" }),
    VERDURE.map((v) => chip("cmpVerdura", v.id, b.verdure.includes(v.id), lingua() === "en" ? v.en : v.it)).join("") + mieiDi(s, ["verdure"]).map(([id, x]) => chip("cmpVerdura", "x:" + id, b.verdure.includes("x:" + id), x.nome)).join(""));
  const sceltaFrutta = gruppoScelte(L({ it: "Quale frutta", en: "Which fruit" }), FRUTTA.filter((f) => f.id !== "pompelmo" || !/ciclosporin|cyclosporin|tacrolimus|voclosporin|sandimmun|neoral|prograf|advagraf|envarsus|lupkynis/i.test(s.profilo.farmaci || "")).map((f) => chip("cmpFrutta", f.id, b.frutta === f.id, lingua() === "en" ? f.en : f.it)).join(""));
  if (b.pasto === "pranzo" && b.modo === "componi") {
    corpo = gruppoScelte(L({ it: "Carboidrato", en: "Carbohydrate" }), PRANZO.carboidrati.filter((o) => opzioneOk(o, ex)).map((o) => chip("cmpCarb", o.id, b.carb === o.id, etichettaOpzione(o), kcalDi(vociOpzione(o.id), opz))).join("")
      + mieiDi(s, ["cereali", "legumi"]).map(([id, x]) => { const p = porzioneMia(x, "pranzo"); return p ? chip("cmpCarb", "x:" + id, b.carb === "x:" + id, `${x.nome} ${p.q} g`, `${Math.round(p.kcal)} kcal · ${L({ it: "tuo", en: "yours" })}`) : ""; }).join(""))
      + gruppoScelte(L({ it: "Proteina", en: "Protein" }), PRANZO.proteine.filter((o) => opzioneOk(o, ex)).map((o) => chip("cmpProt", o.id, b.prot === o.id, etichettaOpzione(o), kcalDi(vociOpzione(o.id), opz))).join("")
      + mieiDi(s, ["carne", "pesce", "uova", "formaggi", "proteine_veg"]).map(([id, x]) => { const p = porzioneMia(x, "pranzo"); return p ? chip("cmpProt", "x:" + id, b.prot === "x:" + id, `${x.nome} ${p.q} g`, `${Math.round(p.kcal)} kcal · ${L({ it: "tuo", en: "yours" })}`) : ""; }).join(""))
      + sceltaVerdure + `<p class="minimo">+ 10 g ${esc(nome("olio_evo", lingua()))}. ${esc(L(PRANZO.regola))}</p>`;
  } else if (b.pasto === "pranzo") {
    corpo = gruppoScelte(L({ it: "Pranzo già combinato (max 1 a settimana)", en: "Ready-combined lunch (max 1 a week)" }), PRANZO.combinati.opzioni.filter((o) => opzioneOk(o, ex)).map((o) => chip("cmpOpzione", o.id, (b.opzione || "pa1") === o.id, o.testo ? L(o.testo) : o.voci.slice(0, 3).map((v) => nome(v.a, lingua())).join(" + "))).join("")) + sceltaVerdure;
  } else if (b.pasto === "cena" && b.modo === "componi") {
    corpo = gruppoScelte(L({ it: "Proteina", en: "Protein" }), CENA.proteine.filter((o) => opzioneOk(o, ex)).map((o) => chip("cmpProtCena", o.id, b.protCena === o.id, etichettaOpzione(o), kcalDi(vociOpzione(o.id), opz))).join("")
      + mieiDi(s, ["carne", "pesce", "uova", "formaggi", "proteine_veg", "legumi"]).map(([id, x]) => { const p = porzioneMia(x, "cena"); return p ? chip("cmpProtCena", "x:" + id, b.protCena === "x:" + id, `${x.nome} ${p.q} g`, `${Math.round(p.kcal)} kcal · ${L({ it: "tuo", en: "yours" })}`) : ""; }).join(""))
      + gruppoScelte(L({ it: "Pane o patate", en: "Bread or potatoes" }), [["pane_gf", "pane_gf", 60, "g"], ["gallette_saraceno", "gallette_saraceno", 5, "pz"], ["gallette_riso", "gallette_riso", 5, "pz"], ["patate", "patate", 200, "g"]].filter(([, a]) => !ex.has(a)).map(([k, a, q, u]) => chip("cmpPane", k, b.pane === k, `${nome(a, lingua())} ${quantita({ q, u })}`, kcalDi([{ a, q, u }], opz))).join("")
      + mieiDi(s, ["pane", "patate"]).map(([id, x]) => { const p = porzioneMia(x, "cena"); return p ? chip("cmpPane", "x:" + id, b.pane === "x:" + id, `${x.nome} ${p.q} g`, `${Math.round(p.kcal)} kcal · ${L({ it: "tuo", en: "yours" })}`) : ""; }).join(""))
      + sceltaVerdure + `<p class="minimo">+ 10 g ${esc(nome("olio_evo", lingua()))}.</p>`;
  } else if (b.pasto === "cena") {
    corpo = gruppoScelte(L({ it: "Idee per la cena", en: "Dinner ideas" }), CENA.idee.filter((o) => opzioneOk(o, ex)).map((o) => chip("cmpOpzione", o.id, (b.opzione || "ci1") === o.id, o.testo ? L(o.testo) : o.voci.slice(0, 3).map((v) => nome(v.a, lingua())).join(" + "))).join("")) + sceltaVerdure;
  } else {
    const def = { colazione: COLAZIONE, spuntino: SPUNTINO, dopocena: DOPOCENA }[b.pasto];
    const lista = def.opzioni.filter((o) => opzioneOk(o, ex));
    corpo = gruppoScelte(L({ it: "Opzioni del piano", en: "Plan options" }), lista.map((o, i) => chip("cmpOpzione", o.id, (b.opzione || def.opzioni[0].id) === o.id, `${i + 1}. ${o.voci.map((v) => (v.testo ? L(v.testo) : nome(v.a, lingua()))).join(" + ")}`, kcalDi(conFrutta(vociOpzione(o.id)), opz))).join(""));
    const sel = OPZ[b.opzione || def.opzioni[0].id];
    if (sel && sel.voci.some((v) => v.a === "frutta")) corpo += sceltaFrutta;
  }
  const voci = vociComposte(s);
  const r = valoriVoci(voci, opz);
  const conf = confrontoPasto(b.pasto, r.tot.kcal);
  const def = PASTI[b.pasto];
  const stato = conf.stato === "ok" ? `<span class="stato ok">${I.ok}${esc(L({ it: "In linea col piano", en: "In line with the plan" }))}</span>`
    : conf.stato === "sopra" ? `<span class="stato attenzione">${I.avviso}${esc(L({ it: "Sopra il piano", en: "Above the plan" }))}</span>`
      : `<span class="stato attenzione">${I.avviso}${esc(L({ it: "Sotto il piano", en: "Below the plan" }))}</span>`;
  const macro = [["prot", "proteine", { it: "Proteine", en: "Protein" }], ["carb", "carboidrati", { it: "Carboidrati", en: "Carbs" }], ["fat", "grassi", { it: "Grassi", en: "Fat" }]].map(([k, m, lab]) => {
    const [lo, hi] = def.macro[m];
    const v = r.tot[k];
    const dentro = v >= lo * 0.85 && v <= hi * 1.15;
    return `<div class="tile piccola"><div class="lab">${esc(L(lab))}</div><div class="val">${num(v)}<small>g</small></div><div class="del">${dentro ? I.ok : I.avviso}${esc(`${L({ it: "piano", en: "plan" })} ${lo}-${hi} g`)}</div></div>`;
  }).join("");
  const somma = `<section class="card somma">
    <div class="riga tra"><div><div class="minimo">${esc(nomePasto(b.pasto))}</div><div class="grande-kcal">${r.completo ? "" : "≥ "}${num(r.tot.kcal)} <small>kcal</small></div></div>${stato}</div>
    <div class="minimo">${esc(L({ it: "Il piano dice circa", en: "The plan says about" }))} ${def.kcal[0] === def.kcal[1] ? def.kcal[0] : def.kcal.join("-")} kcal</div>
    <div class="griglia3" data-s="sd6f2a">${macro}</div>
    <ul class="lista-ingr">${voci.map((v) => `<li><span>${esc(v.scelta ? (lingua() === "en" ? (VERDURE.concat(FRUTTA).find((x) => x.id === v.scelta) || {}).en : (VERDURE.concat(FRUTTA).find((x) => x.id === v.scelta) || {}).it) : s.alimentiExtra[v.a] ? s.alimentiExtra[v.a].nome : v.testo ? L(v.testo) : nome(v.a, lingua()))}</span><span class="q">${esc(quantita(v))}</span></li>`).join("")}</ul>
    ${r.stime.length ? `<p class="minimo">${esc(L({ it: "Stime", en: "Estimates" }))}: ${esc(r.stime.join("; "))}</p>` : ""}
    ${r.mancanti.length ? `<p class="minimo">${esc(t("infoMancante"))}: ${esc(r.mancanti.map((a) => nome(a, lingua())).join(", "))}</p>` : ""}
    <button class="btn primario pieno" data-az="cmpRegistra">${I.spunta}${esc(L({ it: `Registra come ${nomePasto(b.pasto).toLowerCase()} del ${b.data === isoData(new Date()) ? "giorno" : b.data}`, en: `Log as ${nomePasto(b.pasto).toLowerCase()} for ${b.data === isoData(new Date()) ? "today" : b.data}` }))}</button>
  </section>`;
  const barra = `<div class="somma-barra" role="status"><div><strong>${r.completo ? "" : "≥ "}${num(r.tot.kcal)} kcal</strong> <span class="minimo">/ ${def.kcal[0] === def.kcal[1] ? def.kcal[0] : def.kcal.join("-")}</span><div>${stato}</div></div>
    <button class="btn piccolo primario" data-az="cmpRegistra">${I.spunta}${esc(L({ it: "Registra", en: "Log it" }))}</button></div>`;
  return `${inFoglio ? "" : pasti}${modi}${corpo}${barra}${somma}`;
}

function foglio() {
  return `<button class="icon-btn chiudi" data-az="chiudiFoglio" aria-label="${esc(t("chiudi"))}">${I.chiudi}</button>
    <h2>${esc(L({ it: "Componi", en: "Compose" }))}: ${esc(nomePasto(b.pasto))}</h2>${renderComponi(S(), { inFoglio: true })}`;
}

registra({
  apriComponi: (d) => { b = nuova(d.pasto || "pranzo", d.data || isoData(new Date())); apriFoglio(foglio); },
  cmpPasto: (d) => { b.pasto = d.v; b.modo = "componi"; b.opzione = null; ridisegna(); },
  cmpModo: (d) => { b.modo = d.v; b.opzione = null; ridisegna(); },
  cmpCarb: (d) => { b.carb = d.v; ridisegna(); },
  cmpProt: (d) => { b.prot = d.v; ridisegna(); },
  cmpProtCena: (d) => { b.protCena = d.v; ridisegna(); },
  cmpPane: (d) => { b.pane = d.v; ridisegna(); },
  cmpOpzione: (d) => { b.opzione = d.v; ridisegna(); },
  cmpFrutta: (d) => { b.frutta = d.v; ridisegna(); },
  cmpVerdura: (d) => {
    const i = b.verdure.indexOf(d.v);
    if (i >= 0) { if (b.verdure.length > 1) b.verdure.splice(i, 1); }
    else { b.verdure.push(d.v); if (b.verdure.length > 3) b.verdure.shift(); }
    ridisegna();
  },
  cmpRegistra: () => {
    const s = S();
    const voci = vociComposte(s);
    const r = valoriVoci(voci, opzioniNutrizione(s));
    registraNelDiario(b.data, b.pasto, voci, "composto");
    chiudiFoglio();
    toast(L({ it: `Registrato: ${Math.round(r.tot.kcal)} kcal`, en: `Logged: ${Math.round(r.tot.kcal)} kcal` }));
  },
});
