/*
 * "Registra cibo": one button, three steps.
 *   1. Which meal (breakfast, snack, lunch, dinner, after dinner, other).
 *   2. Which food: the plan's choices for that meal, her recent foods, a
 *      search in the plan, her own foods and the CIQUAL 2020 table (raw
 *      entries first), packages and brands from Open Food Facts, or the
 *      values on a label. Or the whole planned meal with one tap.
 *   3. How much: grams, or a household measure (½ can of 200 g, 1 small egg,
 *      1 glass of milk) turned into grams with a stated source (data/misure.js;
 *      packs and servings from the package's own label data).
 * Items gather in a basket; "Registra" saves the meal, the sheet closes and
 * the home page shows the new entry (highlighted) and the charts move.
 * Values found outside the plan are copied into each line with source and
 * code (engine/nutrizione: line.p), so the log never depends on a lookup.
 */
import { S, cambia } from "../store.js";
import { L, lingua, t } from "../i18n.js";
import { I, esc, num } from "../ui.js";
import { apriFoglio, chiudiFoglio, ridisegna, registra, toast } from "../ctx.js";
import { nome, ALIMENTI } from "../data/alimenti.js";
import { PASTI, valoriVoci, valoriVoce, grammi, origineVoce, STATI, scelta as sceltaDi } from "../engine/nutrizione.js";
import { VERDURE, FRUTTA } from "../data/scelte.js";
import { isoData, aggiungiGiorni, vociPasto } from "../engine/planner.js";
import { cercaPiano, caricaTabella, cercaCiqual, cercaOnline } from "../engine/ricerca.js";
import { classeDi } from "../engine/cervello.js";
import { MISURE, FONTI_MISURE, FRAZIONI, frazioneTesto, misurePer, grammiMisura } from "../data/misure.js";
import { ORDINE_LOG, nomePasto, registratoIt, concorda, alPasto, opzioniNutrizione, nomeVoce, logDi, istantanea, registraNelDiario, cambiaConAnnulla, scriviVoce, segnaNuovo } from "./diario.js";
import { settimanaDi } from "./comuni.js";

let w = null;
const numero = (x) => { const n = Number(String(x ?? "").trim().replace(",", ".")); return String(x ?? "").trim() === "" ? NaN : n; };
const copia = (x) => (x == null ? x : JSON.parse(JSON.stringify(x)));
const CAMPI_100 = ["kcal", "prot", "carb", "fat", "fib", "salt"];
function valori100(per100) {
  const p = {};
  for (const k of CAMPI_100) { const x = per100 ? Number(per100[k]) : NaN; if (per100 && per100[k] != null && Number.isFinite(x)) p[k] = Math.round(x * 100) / 100; }
  return p;
}
export function pastoDellOra(d = new Date()) {
  const h = d.getHours() + d.getMinutes() / 60;
  return h < 10 ? "colazione" : h < 12 ? "spuntino" : h < 16 ? "pranzo" : h < 21.5 ? "cena" : "dopocena";
}
const kcalTesto = (k) => `${num(k)} kcal`;
const statoTesto = (st) => (st && STATI[st] ? L(STATI[st]) : "");
const PESO = {
  crudo: { it: "g crudi", en: "g raw" }, secco: { it: "g secchi", en: "g dry" }, cotto: { it: "g cotti", en: "g cooked" },
  conservato: { it: "g sgocciolati", en: "g drained" }, venduto: { it: "g", en: "g" },
};
const pesoTesto = (st) => L(PESO[st] || PESO.venduto);
const k100Testo = (k) => (k == null ? null : num(k, Math.abs(k - Math.round(k)) >= 0.05 ? 1 : 0));
function fonteTesto(o) {
  if (!o.fonti || !o.fonti.length) return "";
  const f = o.fonti.map((x) => [x.db, x.id, x.nome].filter(Boolean).join(" ")).join("; ");
  if (o.resa) return L({ it: o.resa.it, en: o.resa.en }) + ": " + f;
  if (o.media) return L({ it: `media di ${o.fonti.length} alimenti: `, en: `average of ${o.fonti.length} foods: ` }) + f;
  if (o.simile) return L({ it: "valori di un alimento simile: ", en: "values of a similar food: " }) + f;
  return f;
}
function calcoloTesto(r, o) {
  const k100 = k100Testo(o.kcal100);
  return r.val && r.g && k100 != null ? `${num(r.g)} g × ${k100} kcal/100 g = ${num(r.val.kcal)} kcal` : "";
}
const macroTesto = (tot, incompleti = false) => `${L({ it: "Proteine", en: "Protein" })} ${num(tot.prot, 1)} g · ${L({ it: "carboidrati", en: "carbs" })} ${num(tot.carb, 1)} g · ${L({ it: "grassi", en: "fat" })} ${num(tot.fat, 1)} g` + (incompleti ? L({ it: " (incompleti: un'etichetta non li dà tutti)", en: " (incomplete: a label does not give them all)" }) : "");
const misuraTesto = (m) => (m && MISURE[m.k] ? `${frazioneTesto(m.f)} ${L(MISURE[m.k])}${m.peso ? ` ${L({ it: "da", en: "of" })} ${num(m.peso)} g` : ""}` : "");

/* ------------------------------------------------------------ the foods */
/* Every food the plan names for a meal (options, alternatives, shared amounts). */
function cibiDelPiano(pasto) {
  const out = new Set();
  const visita = (x) => {
    if (!x || typeof x !== "object") return;
    if (Array.isArray(x)) { x.forEach(visita); return; }
    if (typeof x.a === "string" && ALIMENTI[x.a]) out.add(x.a);
    for (const c of x.con || []) if (ALIMENTI[c]) out.add(c);
    for (const k of Object.keys(x)) if (k !== "nome" && typeof x[k] === "object") visita(x[k]);
  };
  visita(PASTI[pasto]);
  out.delete("acqua");
  return [...out];
}

/* Last 14 days, most recent first, one per food. */
function recenti(s, data) {
  const visti = new Set(), out = [];
  for (let k = 0; k < 14 && out.length < 10; k++) {
    const log = logDi(s, aggiungiGiorni(data, -k));
    const entrate = [...ORDINE_LOG.filter((p) => p !== "altro").map((p) => log[p]).filter(Boolean), ...(log.altro || [])].sort((a, b) => String(b.ora).localeCompare(String(a.ora)));
    for (const e of entrate) for (const v of e.voci) {
      if (v.u === "q.b." || v.q == null || v.a === "acqua") continue;
      const chiave = v.a + "|" + (v.scelta || "") + "|" + (v.nome || "");
      if (visti.has(chiave)) continue;
      visti.add(chiave);
      out.push(v);
    }
  }
  return out.slice(0, 10);
}

function voceDa(c, g, misura = null) {
  let v = null;
  if (c.tipo === "piano") v = { a: c.a, q: g, u: "g", ...(c.scelta ? { scelta: c.scelta } : {}) };
  else if (c.tipo === "mio") v = { a: c.a, q: g, u: "g" };
  else if (c.tipo === "recente") { v = copia(c.voce); delete v.o; v.q = g; v.u = "g"; }
  else if (c.tipo === "ciqual") { const r = c.rec; v = { a: "ciq:" + r.codice, q: g, u: "g", nome: r.nome, nomeEn: r.nomeEn, fonte: "ciqual", codice: String(r.codice), gruppo: r.gruppoCiqual || null, stato: r.stato, stimaKcal: r.stimaKcal || 0, p: valori100(r.per100) }; }
  else if (c.tipo === "off") { const r = c.rec; v = { a: "off:" + r.codice, q: g, u: "g", nome: r.marca ? `${r.nome} (${r.marca})` : r.nome, fonte: "off", codice: r.codice, marca: r.marca || null, stato: "venduto", p: valori100(r.per100) }; }
  else if (c.tipo === "etichetta") {
    const kcal = numero(c.campi.kcal);
    if (!(kcal >= 0 && kcal <= 900)) return null;
    const per100 = { kcal };
    for (const k of ["prot", "carb", "fat"]) { const x = numero(c.campi[k]); if (x >= 0 && x <= 100) per100[k] = x; }
    const scritto = String(c.campi.nome || "").trim().slice(0, 80);
    const n = scritto ? scritto.charAt(0).toUpperCase() + scritto.slice(1) : L({ it: "Prodotto dall'etichetta", en: "Product from the label" });
    v = { a: "etichetta:" + n.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 40), q: g, u: "g", nome: n, fonte: "etichetta", stato: "venduto", p: valori100(per100) };
  }
  if (v && misura) v.misura = misura; else if (v) delete v.misura;
  return v;
}

function nomeScelto(c, s) {
  if (c.tipo === "ciqual" || c.tipo === "off") return c.rec.marca ? `${c.rec.nome} (${c.rec.marca})` : c.rec.nome;
  if (c.tipo === "etichetta") return L({ it: "Valori dall'etichetta", en: "Values from the label" });
  if (c.tipo === "recente") return nomeVoce(c.voce, s);
  return c.nome;
}

/* The measures that fit the chosen food, with the label weight when the package gives it. */
function misureDi(c, s) {
  if (c.tipo === "etichetta") return [];
  if (c.tipo === "off") return misurePer({ nomeEn: c.rec.nome, confezione: c.rec.confezione, porzione: c.rec.porzione, inScatola: /scatol|lattina|\bcan\b/i.test(c.rec.quantita + " " + c.rec.nome) });
  if (c.tipo === "ciqual") return misurePer({ classe: classeDi(c.rec), nomeEn: c.rec.nomeEn });
  if (c.tipo === "mio") { const x = s.alimentiExtra[c.a] || {}; return misurePer({ classe: x.classe, nomeEn: x.nomeEn || x.nome, confezione: x.confezione, porzione: x.porzione }); }
  const id = c.tipo === "recente" ? c.voce.a : c.a;
  const a = ALIMENTI[id] || {};
  return misurePer({ id, gruppo: a.gruppo, nomeEn: c.tipo === "recente" ? c.voce.nomeEn || "" : nome(id, "en") });
}
function pesoEtichetta(c, k) {
  if (c.tipo !== "off") return "";
  if (k === "porzione") return c.rec.porzione || "";
  if (k === "confezione" || k === "scatoletta") return c.rec.confezione || "";
  return "";
}
function idENomeEn(c) {
  if (c.tipo === "ciqual") return { id: "", nomeEn: c.rec.nomeEn };
  if (c.tipo === "off") return { id: "", nomeEn: c.rec.nome };
  if (c.tipo === "recente") return { id: c.voce.a, nomeEn: c.voce.nomeEn || nome(c.voce.a, "en") };
  return { id: c.a || "", nomeEn: c.a ? nome(c.a, "en") : "" };
}

/* Grams of the amount being entered, or null. */
function grammiInseriti() {
  const q = w.quanto;
  if (q.modo === "grammi") { const g = numero(q.grammi); return g > 0 && g <= 3000 ? g : null; }
  const g = grammiMisura(q.misura, q.frazione, { ...idENomeEn(w.scelto), peso: numero(q.peso) });
  return g && g <= 3000 ? Math.round(g * 10) / 10 : null;
}
function anteprima() {
  if (!w || !w.scelto) return "";
  const g = grammiInseriti();
  if (g == null) return w.quanto.modo === "grammi" ? L({ it: "Scrivi i grammi (da 1 a 3000).", en: "Enter the grams (1 to 3000)." }) : MISURE[w.quanto.misura] && MISURE[w.quanto.misura].chiedi ? L({ it: "Scrivi il peso dell'etichetta.", en: "Enter the weight on the label." }) : L({ it: "Scegli una misura.", en: "Pick a measure." });
  const v = voceDa(w.scelto, g);
  if (!v) return t("infoMancante");
  const r = valoriVoce(v, opzioniNutrizione());
  return `= ${num(g)} g` + (r.val ? ` · ${kcalTesto(r.val.kcal)}` : ` · ${t("infoMancante")}`);
}

/* --------------------------------------------------------------- render */
function rigaCesto(v, i, opz, s) {
  const r = valoriVoce(v, opz);
  const o = origineVoce(v, opz);
  const gr = grammi(v, opz.pesi);
  const inGrammi = v.u === "g" && v.q != null && !Array.isArray(v.q);
  const valore = inGrammi ? v.q : gr.g != null && !gr.nonContato ? Math.round(gr.g) : "";
  const note = [];
  if (v.misura) note.push(misuraTesto(v.misura));
  if (!inGrammi && v.q != null && v.u !== "q.b.") note.push(L({ it: `nel piano: ${Array.isArray(v.q) ? v.q.join("-") : num(v.q)} ${v.u}`, en: `in the plan: ${Array.isArray(v.q) ? v.q.join("-") : num(v.q)} ${v.u}` }) + (gr.stima ? ` (${gr.stima})` : ""));
  if (r.nonContato) note.push(L({ it: "quantità non indicata: metti i grammi per contarla", en: "amount not given: enter the grams to count it" }));
  if (r.manca && !r.nonContato) note.push(t("infoMancante"));
  if (v.con && v.con.length) note.push(L({ it: "peso condiviso tra: ", en: "weight shared between: " }) + [v.a, ...v.con].map((a) => nome(a, lingua())).join(", "));
  if (o.stato === "cotto" && !o.resa) note.push(L({ it: "valori per il cibo cotto: scrivi il peso da cotto", en: "values for the cooked food: enter the cooked weight" }));
  if (v.a === "verdure" && !v.scelta) note.push(L({ it: "media di 5 verdure: per un valore preciso toglila e aggiungi le verdure che hai usato", en: "average of 5 vegetables: for a precise value remove it and add the vegetables you used" }));
  return `<div class="ing-riga ${w.nuovo === i ? "appena" : ""}">
    <div class="ing-testa"><strong>${esc(nomeVoce(v, s))}</strong>${o.stato ? `<span class="stato-cibo ${esc(o.stato)}">${esc(statoTesto(o.stato))}</span>` : ""}</div>
    <div class="ing-dati">
      <label class="ing-g"><input type="number" inputmode="decimal" min="0" max="3000" step="1" value="${esc(valore)}" placeholder="g" data-input="regGrammi" data-i="${i}" aria-label="${esc(`${nomeVoce(v, s)}: ${pesoTesto(o.stato)}`)}"><span>${esc(pesoTesto(o.stato))}</span></label>
      <span class="kcal" id="reg-k-${i}">${r.val ? esc(kcalTesto(r.val.kcal)) : "-"}</span>
      <button class="icon-btn mini" data-az="regTogli" data-i="${i}" aria-label="${esc(L({ it: "Togli", en: "Remove" }))}">${I.chiudi}</button>
    </div>
    <div class="minimo" id="reg-c-${i}">${esc(calcoloTesto(r, o))}</div>
    ${o.fonti && o.fonti.length ? `<div class="fonte">${esc(fonteTesto(o))}</div>` : ""}
    ${note.length ? `<div class="minimo">${esc(note.join(" · "))}</div>` : ""}
  </div>`;
}

function passoPasto(s) {
  const log = logDi(s, w.data);
  const sett = settimanaDi(s, w.data);
  const giorno = sett && sett.giorni.find((x) => x.data === w.data);
  const opz = opzioniNutrizione(s);
  return `<h2>${esc(L({ it: "Che pasto?", en: "Which meal?" }))}</h2>
    <div class="griglia-pasti">${ORDINE_LOG.map((p) => {
      const e = p === "altro" ? null : log[p];
      const altri = p === "altro" ? (log.altro || []).length : 0;
      const piano = giorno && giorno[p] ? valoriVoci(vociPasto(giorno, p), opz).tot.kcal : null;
      const stato = e ? `${I.spunta}${esc(kcalTesto(valoriVoci(e.voci, opz).tot.kcal))}` : altri ? esc(L({ it: `${altri} già`, en: `${altri} already` })) : piano != null ? esc(L({ it: `piano ≈ ${Math.round(piano)} kcal`, en: `plan ≈ ${Math.round(piano)} kcal` })) : "";
      return `<button class="pasto-btn ${e ? "fatto" : ""} ${p === w.pasto ? "suggerito" : ""}" data-az="regPasto" data-pasto="${p}"><strong>${esc(nomePasto(p))}</strong><span class="minimo">${stato}</span></button>`;
    }).join("")}</div>`;
}

function risultatiRicerca(s) {
  const q = w.q.trim();
  if (q.length < 2) return "";
  const piano = cercaPiano(q);
  const miei = Object.entries(s.alimentiExtra || {}).filter(([, x]) => x.nome.toLowerCase().includes(q.toLowerCase())).slice(0, 6);
  const esclusi = new Set(s.pref.escludi || []);
  return `
    ${piano.length ? `<div class="minimo">${esc(L({ it: "Nel tuo piano", en: "In your plan" }))}</div>
      <div class="scelte">${piano.map((x) => `<button class="chip" data-az="regScegli" data-tipo="piano" data-id="${esc(x.id)}">${esc(L(x))}${esclusi.has(x.id) ? ` · ${esc(L({ it: "non mangi", en: "you don't eat" }))}` : ""}</button>`).join("")}</div>` : ""}
    ${miei.length ? `<div class="minimo">${esc(L({ it: "I tuoi cibi", en: "Your foods" }))}</div>
      <div class="scelte">${miei.map(([id, x]) => `<button class="chip" data-az="regScegli" data-tipo="mio" data-id="${esc(id)}">${esc(x.nome)}</button>`).join("")}</div>` : ""}
    <div class="minimo">${esc(L({ it: "Tabella CIQUAL 2020 (prima i valori a crudo)", en: "CIQUAL 2020 table (raw values first)" }))}</div>
    ${w.ciqual.length && w.ciqual[0].parziale ? `<div class="avviso">${I.avviso}<div class="piccolo">${esc(L({ it: "Nessun alimento per tutta la frase: questi risultati sono per una parola sola. Controlla che sia il cibo giusto.", en: "Nothing for the whole phrase: these results are for a single word. Check it is the right food." }))}</div></div>` : ""}
    ${w.ciqual.length ? `<div class="ing-risultati">${w.ciqual.map((x, i) => `<button class="ing-ris" data-az="regScegli" data-tipo="ciqual" data-i="${i}">
        <span><strong>${esc(x.nome)}</strong> <span class="stato-cibo ${esc(x.stato)}">${esc(statoTesto(x.stato))}</span><br><span class="minimo">${esc(x.nomeEn)} · ${esc(String(x.codice))}</span></span>
        <span class="kcal">${esc(num(x.per100.kcal))}<small> kcal/100 g</small></span></button>`).join("")}</div>`
      : `<p class="minimo">${esc(w.cercando ? L({ it: "Cerco...", en: "Searching..." }) : L({ it: "Nessun alimento nella tabella. Prova un altro nome, cerca la marca o usa l'etichetta.", en: "No food in the table. Try another name, search the brand or use the label." }))}</p>`}
    ${w.online ? (w.online.stato === "carico" ? `<p class="minimo">${esc(L({ it: "Cerco le marche...", en: "Searching brands..." }))}</p>`
      : w.online.stato === "errore" ? `<p class="minimo">${esc(L({ it: "La ricerca delle marche non risponde ora. Usa la tabella o l'etichetta.", en: "The brand search does not answer now. Use the table or the label." }))}</p>`
      : `<div class="minimo">${esc(L({ it: "Marche e confezioni (Open Food Facts: dati inseriti da utenti, controlla l'etichetta)", en: "Brands and packages (Open Food Facts: user-entered data, check the label)" }))}</div>
        ${w.online.lista.length ? `<div class="ing-risultati">${w.online.lista.slice(0, 8).map((x, i) => `<button class="ing-ris" data-az="regScegli" data-tipo="off" data-i="${i}">
          <span><strong>${esc(x.nome)}</strong><br><span class="minimo">${esc([x.marca, x.quantita, x.porzioneTesto ? L({ it: "porzione ", en: "serving " }) + x.porzioneTesto : ""].filter(Boolean).join(" · "))}</span></span><span class="kcal">${esc(num(x.per100.kcal))}<small> kcal/100 g</small></span></button>`).join("")}</div>` : `<p class="minimo">${esc(L({ it: "Nessuna confezione trovata.", en: "No package found." }))}</p>`}`) : ""}`;
}

function passoCibo(s) {
  const opz = opzioniNutrizione(s);
  const tot = valoriVoci(w.voci, opz);
  const esistente = !w.modifica && w.pasto !== "altro" ? logDi(s, w.data)[w.pasto] : null;
  const sett = settimanaDi(s, w.data);
  const giorno = sett && sett.giorni.find((x) => x.data === w.data);
  const pianoOggi = giorno && w.pasto !== "altro" && giorno[w.pasto] ? vociPasto(giorno, w.pasto) : null;
  const esclusi = new Set(s.pref.escludi || []);
  const dalPiano = w.pasto === "altro" ? [] : cibiDelPiano(w.pasto).filter((a) => !esclusi.has(a));
  const chipVerdure = dalPiano.includes("verdure") ? VERDURE.filter((x) => !esclusi.has(x.id)).slice(0, 14) : [];
  const chipFrutta = dalPiano.includes("frutta") ? FRUTTA.filter((x) => !esclusi.has(x.id)).slice(0, 12) : [];
  const rec = recenti(s, w.data);
  return `
    <div class="riga tra"><h2>${esc(nomePasto(w.pasto))}</h2>${w.modifica ? "" : `<button class="btn-testo" data-az="regCambiaPasto">${esc(L({ it: "cambia pasto", en: "change meal" }))}</button>`}</div>
    ${esistente ? `<p class="minimo">${esc(L({ it: `${nomePasto(w.pasto)} è già ${registratoIt(w.pasto)} (${num(valoriVoci(esistente.voci, opz).tot.kcal)} kcal): alla fine scegli se aggiungere o sostituire.`, en: `${nomePasto(w.pasto)} is already logged (${num(valoriVoci(esistente.voci, opz).tot.kcal)} kcal): at the end choose add or replace.` }))}</p>` : ""}
    ${!w.modifica && !esistente && !w.voci.length && pianoOggi ? `<button class="btn pieno come-piano" data-az="regComePiano">${I.spunta}<span><strong>${esc(L({ it: "Mangiato come da piano", en: "Eaten as planned" }))}</strong><br><span class="minimo">${esc(pianoOggi.filter((v) => v.u !== "q.b.").map((v) => nomeVoce(v, s)).join(", "))} · ${esc(kcalTesto(valoriVoci(pianoOggi, opz).tot.kcal))}</span></span></button>` : ""}
    ${w.voci.length ? `<div class="cesto"><div class="minimo">${esc(L({ it: "Nel piatto", en: "On the plate" }))}</div>
      <div class="ing-lista">${w.voci.map((v, i) => rigaCesto(v, i, opz, s)).join("")}</div>
      <div class="ing-totale riga tra"><strong>${esc(L({ it: "Totale", en: "Total" }))}</strong><span class="kcal" id="reg-tot">${tot.completo ? "" : "≥ "}${esc(kcalTesto(tot.tot.kcal))}</span></div>
      <p class="minimo" id="reg-mac">${esc(macroTesto(tot.tot, tot.macroIncomplete))}</p></div>` : ""}
    <h3 class="sotto-tit">${esc(w.voci.length ? L({ it: "Aggiungi un altro cibo", en: "Add another food" }) : L({ it: "Cosa hai mangiato?", en: "What did you eat?" }))}</h3>
    <input class="cerca" type="search" id="cerca-reg" placeholder="${esc(L({ it: "Cerca un cibo o una marca (es. tonno, Rio Mare, zucchine)", en: "Search a food or a brand (e.g. tuna, courgettes)" }))}" value="${esc(w.q)}" data-input="regCerca" aria-label="${esc(L({ it: "Cerca un cibo o una marca", en: "Search a food or a brand" }))}">
    ${w.q.trim().length >= 2 ? `<div class="riga wrap" data-s="sd6f2a">
      <button class="btn piccolo" data-az="regMarche">${I.globo}${esc(L({ it: "Cerca marche e confezioni", en: "Search brands and packages" }))}</button>
      <button class="btn piccolo" data-az="regEtichetta">${I.documento}${esc(L({ it: "Valori dall'etichetta", en: "Values from the label" }))}</button></div>` : ""}
    ${risultatiRicerca(s)}
    ${w.q.trim().length < 2 ? `
      ${dalPiano.length ? `<div class="minimo">${esc(L({ it: `Dal tuo piano per ${nomePasto(w.pasto).toLowerCase()}`, en: `From your plan for ${nomePasto(w.pasto).toLowerCase()}` }))}</div>
        <div class="scelte">${dalPiano.filter((a) => a !== "verdure" && a !== "frutta").map((a) => `<button class="chip" data-az="regScegli" data-tipo="piano" data-id="${esc(a)}">${esc(nome(a, lingua()))}</button>`).join("")}</div>` : ""}
      ${chipVerdure.length ? `<div class="minimo">${esc(L({ it: "Verdure", en: "Vegetables" }))}</div><div class="scelte">${chipVerdure.map((x) => `<button class="chip" data-az="regScegli" data-tipo="piano" data-id="verdure" data-scelta="${esc(x.id)}">${esc(lingua() === "en" ? x.en : x.it)}</button>`).join("")}</div>` : ""}
      ${chipFrutta.length ? `<div class="minimo">${esc(L({ it: "Frutta", en: "Fruit" }))}</div><div class="scelte">${chipFrutta.map((x) => `<button class="chip" data-az="regScegli" data-tipo="piano" data-id="frutta" data-scelta="${esc(x.id)}">${esc(lingua() === "en" ? x.en : x.it)}</button>`).join("")}</div>` : ""}
      ${rec.length ? `<div class="minimo">${esc(L({ it: "Mangiati di recente", en: "Eaten recently" }))}</div><div class="scelte">${rec.map((v, i) => `<button class="chip" data-az="regScegli" data-tipo="recente" data-i="${i}">${esc(nomeVoce(v, s))}</button>`).join("")}</div>` : ""}
      <div class="riga wrap" data-s="sd6f2a"><button class="btn piccolo" data-az="regEtichetta">${I.documento}${esc(L({ it: "Valori dall'etichetta", en: "Values from the label" }))}</button></div>` : ""}
    <div class="piede-foglio">${esistente && w.voci.length ? `<div class="campi2">
        <button class="btn primario" data-az="regSalva">${I.piu}${esc(L({ it: `Aggiungi ${alPasto(w.pasto)}`, en: `Add to ${nomePasto(w.pasto).toLowerCase()}` }))}</button>
        <button class="btn" data-az="regSostituisci">${I.scambio}${esc(L({ it: "Sostituisci", en: "Replace" }))}</button></div>`
      : `<button class="btn primario pieno" data-az="regSalva" ${w.voci.length || w.modifica ? "" : "disabled"}>${I.spunta}${esc(w.modifica ? L({ it: "Salva", en: "Save" }) : w.voci.length ? L({ it: `Registra ${nomePasto(w.pasto).toLowerCase()} · ${kcalTesto(tot.tot.kcal)}`, en: `Log ${nomePasto(w.pasto).toLowerCase()} · ${kcalTesto(tot.tot.kcal)}` }) : L({ it: "Scegli almeno un cibo", en: "Pick at least one food" }))}</button>`}</div>`;
}

function passoQuanto(s) {
  const c = w.scelto;
  const opz = opzioniNutrizione(s);
  if (c.tipo === "etichetta") {
    const f = c.campi;
    return `<div class="riga tra"><h2>${esc(L({ it: "Dall'etichetta", en: "From the label" }))}</h2><button class="btn-testo" data-az="regIndietro">${esc(L({ it: "indietro", en: "back" }))}</button></div>
      <p class="minimo">${esc(L({ it: "Copia i valori per 100 g dalla tabella nutrizionale della confezione.", en: "Copy the values per 100 g from the package's nutrition table." }))}</p>
      <label class="campo"><span>${esc(L({ it: "Nome", en: "Name" }))}</span><input type="text" maxlength="80" value="${esc(f.nome || "")}" data-input="regEti" data-k="nome"></label>
      <div class="campi2">
        <label class="campo"><span>kcal / 100 g</span><input type="number" inputmode="decimal" min="0" max="900" value="${esc(f.kcal || "")}" data-input="regEti" data-k="kcal"></label>
        <label class="campo"><span>${esc(L({ it: "Proteine g", en: "Protein g" }))}</span><input type="number" inputmode="decimal" min="0" max="100" value="${esc(f.prot || "")}" data-input="regEti" data-k="prot"></label>
        <label class="campo"><span>${esc(L({ it: "Carboidrati g", en: "Carbs g" }))}</span><input type="number" inputmode="decimal" min="0" max="100" value="${esc(f.carb || "")}" data-input="regEti" data-k="carb"></label>
        <label class="campo"><span>${esc(L({ it: "Grassi g", en: "Fat g" }))}</span><input type="number" inputmode="decimal" min="0" max="100" value="${esc(f.fat || "")}" data-input="regEti" data-k="fat"></label>
      </div>
      <label class="campo"><span>${esc(L({ it: "Grammi che hai mangiato", en: "Grams you ate" }))}</span><input type="number" inputmode="decimal" min="1" max="3000" id="reg-grammi" value="${esc(w.quanto.grammi)}" data-input="regQuantoG"></label>
      <p class="anteprima" id="reg-anteprima" aria-live="polite">${esc(anteprima())}</p>
      <button class="btn primario pieno" data-az="regAggiungi">${I.piu}${esc(L({ it: "Metti nel piatto", en: "Put on the plate" }))}</button>`;
  }
  const prova = voceDa(c, 100);
  const o = prova ? origineVoce(prova, opz) : { fonti: [] };
  const misure = misureDi(c, s);
  const q = w.quanto;
  const m = MISURE[q.misura];
  return `<div class="riga tra"><h2>${esc(L({ it: "Quanto?", en: "How much?" }))}</h2><button class="btn-testo" data-az="regIndietro">${esc(L({ it: "indietro", en: "back" }))}</button></div>
    <div class="card piatta">
      <div class="ing-testa"><strong>${esc(nomeScelto(c, s))}</strong>${o.stato ? `<span class="stato-cibo ${esc(o.stato)}">${esc(statoTesto(o.stato))}</span>` : ""}</div>
      <div class="minimo">${o.kcal100 != null ? esc(`${k100Testo(o.kcal100)} kcal/100 g`) : esc(t("infoMancante"))}${o.fonti.length ? " · " + esc(fonteTesto(o)) : ""}</div>
      ${o.stato === "cotto" ? `<div class="avviso terra">${I.avviso}<div class="piccolo">${esc(L({ it: "Valori per il cibo cotto: scrivi il peso da cotto.", en: "Values for the cooked food: enter the cooked weight." }))}</div></div>` : ""}
    </div>
    <div class="segmenti" role="tablist">
      <button role="tab" class="${q.modo === "grammi" ? "attivo" : ""}" aria-selected="${q.modo === "grammi"}" data-az="regModo" data-m="grammi">${esc(L({ it: "Grammi", en: "Grams" }))}</button>
      ${misure.length ? `<button role="tab" class="${q.modo === "misura" ? "attivo" : ""}" aria-selected="${q.modo === "misura"}" data-az="regModo" data-m="misura">${esc(L({ it: "Misure di casa", en: "Household measures" }))}</button>` : ""}
    </div>
    ${q.modo === "grammi" ? `<label class="campo"><span>${esc(L({ it: "Grammi", en: "Grams" }))} (${esc(pesoTesto(o.stato))})</span><input type="number" inputmode="decimal" min="1" max="3000" id="reg-grammi" value="${esc(q.grammi)}" data-input="regQuantoG"></label>`
      : `<div class="minimo">${esc(L({ it: "Quanto", en: "How much" }))}</div>
      <div class="scelte">${FRAZIONI.map((f) => `<button class="chip ${q.frazione === f ? "attivo" : ""}" aria-pressed="${q.frazione === f}" data-az="regFrazione" data-f="${f}">${esc(frazioneTesto(f))}</button>`).join("")}</div>
      <div class="minimo">${esc(L({ it: "Di cosa", en: "Of what" }))}</div>
      <div class="scelte">${misure.map((k) => `<button class="chip ${q.misura === k ? "attivo" : ""}" aria-pressed="${q.misura === k}" data-az="regMisura" data-k="${k}">${esc(L(MISURE[k]))}</button>`).join("")}</div>
      ${m && m.chiedi ? `<label class="campo"><span>${esc(L({ it: `Peso ${q.misura === "porzione" ? "della porzione" : q.misura === "scatoletta" ? "della scatoletta (sgocciolato, se c'è)" : "della confezione"} in g, dall'etichetta`, en: `Weight of the ${q.misura === "porzione" ? "serving" : q.misura === "scatoletta" ? "can (drained, if given)" : "pack"} in g, from the label` }))}</span><input type="number" inputmode="decimal" min="1" max="5000" id="reg-peso" value="${esc(q.peso)}" data-input="regPeso"></label>` : ""}
      ${m ? `<p class="minimo">${esc(L({ it: "Fonte della misura: ", en: "Measure source: " }) + L(FONTI_MISURE[m.fonte]))}</p>` : ""}`}
    <p class="anteprima" id="reg-anteprima" aria-live="polite">${esc(anteprima())}</p>
    <button class="btn primario pieno" data-az="regAggiungi">${I.piu}${esc(L({ it: "Metti nel piatto", en: "Put on the plate" }))}</button>`;
}

function foglioRegistra() {
  const s = S();
  if (!w) return "";
  const corpo = w.passo === "pasto" ? passoPasto(s) : w.passo === "quanto" && w.scelto ? passoQuanto(s) : passoCibo(s);
  return `<button class="icon-btn chiudi" data-az="chiudiFoglio" aria-label="${esc(t("chiudi"))}">${I.chiudi}</button>
    <div class="passi-reg minimo" aria-hidden="true"><span class="${w.passo === "pasto" ? "ora" : "fatto"}">1 ${esc(L({ it: "pasto", en: "meal" }))}</span><span class="${w.passo === "cibo" ? "ora" : w.passo === "quanto" ? "fatto" : ""}">2 ${esc(L({ it: "cibo", en: "food" }))}</span><span class="${w.passo === "quanto" ? "ora" : ""}">3 ${esc(L({ it: "quantità", en: "amount" }))}</span></div>
    ${corpo}`;
}

function rimettiFuoco(id) {
  const c = document.getElementById(id);
  if (c) { c.focus(); if (c.setSelectionRange && c.type !== "number") c.setSelectionRange(c.value.length, c.value.length); }
}

let timer = null;
async function cerca() {
  if (!w) return;
  const mio = (w.cercaId = (w.cercaId || 0) + 1);
  const n = w.q.trim();
  if (n.length < 2) { w.ciqual = []; w.cercando = false; ridisegna(); rimettiFuoco("cerca-reg"); return; }
  w.cercando = true;
  const tab = await caricaTabella();
  if (!w || mio !== w.cercaId) return;
  w.ciqual = cercaCiqual(n, tab, 8, { crudo: true });
  w.cercando = false;
  ridisegna();
  rimettiFuoco("cerca-reg");
}

/* data: day; pasto: preselected meal (skips step 1); modifica: { pasto, i } to correct an entry. */
export function apriRegistra({ data = isoData(new Date()), pasto = null, modifica = null } = {}) {
  let voci = [];
  if (modifica) {
    const log = logDi(S(), data);
    const e = modifica.pasto === "altro" ? (log.altro || [])[modifica.i] : log[modifica.pasto];
    if (!e) return;
    voci = copia(e.voci);
    pasto = modifica.pasto;
  }
  w = { data, pasto: pasto || pastoDellOra(), passo: pasto || modifica ? "cibo" : "pasto", voci, modifica, q: "", ciqual: [], online: null, scelto: null, quanto: null, cercaId: 0, cercando: false, invalidi: new Set(), nuovo: null };
  apriFoglio(foglioRegistra);
  caricaTabella();
}

function chiudiCon(messaggio) {
  w = null;
  chiudiFoglio();
  if (messaggio) toast(messaggio);
}

function salva(sostituisci = false) {
  if (!w) return;
  if (w.invalidi.size) { toast(L({ it: "Controlla i grammi segnati", en: "Check the grams marked" })); return; }
  const ora = new Date().toISOString();
  const { data, pasto, modifica } = w;
  const voci = w.voci;
  const opz = opzioniNutrizione();
  const kcal = Math.round(valoriVoci(voci, opz).tot.kcal);
  /* before saving: the render that follows the save highlights the entry */
  if (voci.length) segnaNuovo(data, pasto);
  if (modifica) {
    const applica = (s) => {
      const g = s.diario[data];
      if (!g || !g.mangiato) return;
      if (pasto === "altro") {
        const arr = g.mangiato.altro || [];
        if (!arr[modifica.i]) return;
        if (!voci.length) arr.splice(modifica.i, 1); else { arr[modifica.i].voci = istantanea(voci); arr[modifica.i].modificato = ora; }
      } else if (g.mangiato[pasto]) {
        if (!voci.length) { delete g.mangiato[pasto]; if (g.pasti) g.pasti[pasto] = false; } else { g.mangiato[pasto].voci = istantanea(voci); g.mangiato[pasto].modificato = ora; }
      }
    };
    const vuoto = !voci.length;
    w = null; chiudiFoglio();
    if (vuoto) cambiaConAnnulla(data, pasto, modifica.i || 0, L({ it: `${nomePasto(pasto)} ${concorda(pasto, "tolt")} dal diario`, en: `${nomePasto(pasto)} removed from the diary` }), applica);
    else { cambia(applica); toast(L({ it: `${nomePasto(pasto)} ${concorda(pasto, "corrett")}: ${kcal} kcal`, en: `${nomePasto(pasto)} corrected: ${kcal} kcal` })); }
    return;
  }
  if (!voci.length) { toast(L({ it: "Scegli almeno un cibo", en: "Pick at least one food" })); return; }
  const esistente = pasto !== "altro" && logDi(S(), data)[pasto];
  if (esistente && !sostituisci) {
    cambia((s) => { const e = s.diario[data].mangiato[pasto]; e.voci.push(...istantanea(voci)); e.modificato = ora; });
    chiudiCon(L({ it: `Aggiunto ${alPasto(pasto)}: +${kcal} kcal`, en: `Added to ${nomePasto(pasto).toLowerCase()}: +${kcal} kcal` }));
  } else if (esistente) {
    w = null; chiudiFoglio();
    cambiaConAnnulla(data, pasto, 0, L({ it: `${nomePasto(pasto)} ${concorda(pasto, "sostituit")}: ${kcal} kcal`, en: `${nomePasto(pasto)} replaced: ${kcal} kcal` }), (s) => scriviVoce(s, data, pasto, voci, "ingredienti"));
  } else {
    registraNelDiario(data, pasto, voci, "ingredienti");
    chiudiCon(L({ it: `${nomePasto(pasto)} ${registratoIt(pasto)}: +${kcal} kcal`, en: `${nomePasto(pasto)} logged: +${kcal} kcal` }));
  }
}

registra({
  apriRegistra: (d) => apriRegistra({ data: d.data || isoData(new Date()), pasto: d.pasto || null }),
  /* older buttons and links */
  apriIngredienti: (d) => apriRegistra({ data: d.data || isoData(new Date()), pasto: d.pasto || null }),
  apriAggiungiCibo: (d) => apriRegistra({ data: d.data || isoData(new Date()) }),
  apriModificaLog: (d) => apriRegistra({ data: d.data, modifica: { pasto: d.pasto, i: Number(d.i) || 0 } }),
  regPasto: (d) => { if (!w) return; w.pasto = d.pasto; w.passo = "cibo"; ridisegna(); },
  regCambiaPasto: () => { if (w && !w.modifica) { w.passo = "pasto"; ridisegna(); } },
  regComePiano: () => {
    if (!w) return;
    const s = S();
    const sett = settimanaDi(s, w.data);
    const giorno = sett && sett.giorni.find((x) => x.data === w.data);
    if (!giorno || !giorno[w.pasto]) return;
    const voci = vociPasto(giorno, w.pasto);
    const kcal = Math.round(valoriVoci(voci, opzioniNutrizione(s)).tot.kcal);
    const { data, pasto } = w;
    segnaNuovo(data, pasto);
    registraNelDiario(data, pasto, voci, "piano");
    w = null; chiudiFoglio();
    toast(L({ it: `${nomePasto(pasto)} ${registratoIt(pasto)} come da piano: +${kcal} kcal`, en: `${nomePasto(pasto)} logged as planned: +${kcal} kcal` }));
  },
  regCerca: (d, el) => { if (!w) return; w.q = el.value; w.online = null; clearTimeout(timer); timer = setTimeout(cerca, 220); },
  regScegli: (d) => {
    if (!w) return;
    const s = S();
    let c = null;
    if (d.tipo === "piano") c = { tipo: "piano", a: d.id, scelta: d.scelta || null, nome: d.scelta && sceltaDi(d.scelta) ? (lingua() === "en" ? sceltaDi(d.scelta).en : sceltaDi(d.scelta).it) : nome(d.id, lingua()) };
    else if (d.tipo === "mio" && s.alimentiExtra[d.id]) c = { tipo: "mio", a: d.id, nome: s.alimentiExtra[d.id].nome };
    else if (d.tipo === "ciqual" && w.ciqual[Number(d.i)]) c = { tipo: "ciqual", rec: w.ciqual[Number(d.i)] };
    else if (d.tipo === "off" && w.online && w.online.lista[Number(d.i)]) c = { tipo: "off", rec: w.online.lista[Number(d.i)] };
    else if (d.tipo === "recente") { const v = recenti(s, w.data)[Number(d.i)]; if (v) c = { tipo: "recente", voce: v }; }
    if (!c) return;
    const misure = misureDi(c, s);
    const ultimaG = c.tipo === "recente" ? grammi(c.voce, opzioniNutrizione(s).pesi).g : null;
    const usaMisura = misure.length && misure[0] !== "confezione" && c.tipo !== "recente";
    w.scelto = c;
    w.quanto = { modo: usaMisura ? "misura" : "grammi", grammi: ultimaG ? String(Math.round(ultimaG)) : "", frazione: 1, misura: misure[0] || null, peso: pesoEtichetta(c, misure[0]) ? String(pesoEtichetta(c, misure[0])) : "" };
    w.passo = "quanto";
    ridisegna();
    if (w.quanto.modo === "grammi") rimettiFuoco("reg-grammi");
  },
  regMarche: async () => {
    if (!w) return;
    const n = w.q.trim();
    if (n.length < 2) { toast(L({ it: "Scrivi prima un nome o una marca", en: "Type a name or a brand first" })); return; }
    w.online = { stato: "carico", lista: [] };
    ridisegna();
    try {
      const lista = await cercaOnline(n);
      if (w && w.q.trim() === n) w.online = { stato: "ok", lista: lista.filter((x) => x.per100 && x.per100.kcal != null) };
    } catch (e) {
      if (w) w.online = { stato: "errore", lista: [] };
    }
    ridisegna();
  },
  regEtichetta: () => { if (!w) return; w.scelto = { tipo: "etichetta", campi: { nome: w.q.trim() } }; w.quanto = { modo: "grammi", grammi: "", frazione: 1, misura: null, peso: "" }; w.passo = "quanto"; ridisegna(); },
  regEti: (d, el) => { if (!w || !w.scelto || w.scelto.tipo !== "etichetta") return; w.scelto.campi[d.k] = el.value; const a = document.getElementById("reg-anteprima"); if (a) a.textContent = anteprima(); },
  regIndietro: () => { if (!w) return; w.scelto = null; w.passo = "cibo"; ridisegna(); },
  regModo: (d) => { if (!w || !w.quanto) return; w.quanto.modo = d.m; ridisegna(); if (d.m === "grammi") rimettiFuoco("reg-grammi"); },
  regFrazione: (d) => { if (!w || !w.quanto) return; w.quanto.frazione = Number(d.f); ridisegna(); },
  regMisura: (d) => { if (!w || !w.quanto) return; w.quanto.misura = d.k; const p = pesoEtichetta(w.scelto, d.k); if (p) w.quanto.peso = String(p); ridisegna(); if (MISURE[d.k] && MISURE[d.k].chiedi && !w.quanto.peso) rimettiFuoco("reg-peso"); },
  regPeso: (d, el) => { if (!w || !w.quanto) return; w.quanto.peso = el.value; const a = document.getElementById("reg-anteprima"); if (a) a.textContent = anteprima(); },
  regQuantoG: (d, el) => { if (!w || !w.quanto) return; w.quanto.grammi = el.value; const a = document.getElementById("reg-anteprima"); if (a) a.textContent = anteprima(); },
  regAggiungi: () => {
    if (!w || !w.scelto) return;
    const g = grammiInseriti();
    if (g == null) { toast(w.quanto.modo === "grammi" ? L({ it: "Scrivi i grammi (da 1 a 3000)", en: "Enter the grams (1 to 3000)" }) : L({ it: "Scegli la misura (e il peso dell'etichetta)", en: "Pick the measure (and the label weight)" })); return; }
    const misura = w.quanto.modo === "misura" ? { k: w.quanto.misura, f: w.quanto.frazione, ...(MISURE[w.quanto.misura].chiedi ? { peso: numero(w.quanto.peso) } : {}) } : null;
    const v = voceDa(w.scelto, g, misura);
    if (!v) { toast(L({ it: "Scrivi le kcal per 100 g dell'etichetta (da 0 a 900)", en: "Enter the label's kcal per 100 g (0 to 900)" })); return; }
    w.voci.push(v);
    w.nuovo = w.voci.length - 1;
    const nomeV = nomeVoce(v, S());
    w.scelto = null; w.quanto = null; w.q = ""; w.ciqual = []; w.online = null; w.passo = "cibo";
    ridisegna();
    toast(L({ it: `Nel piatto: ${nomeV} ${num(g)} g`, en: `On the plate: ${nomeV} ${num(g)} g` }));
  },
  /* Typing grams updates the line and the total in place: no redraw, so a tap on Save right after is never lost. */
  regGrammi: (d, el) => {
    if (!w) return;
    const i = Number(d.i);
    const v = w.voci[i];
    if (!v) return;
    const g = numero(el.value);
    const c = document.getElementById("reg-c-" + i);
    if (!(g >= 0 && g <= 3000)) { w.invalidi.add(i); if (c) c.textContent = L({ it: "Scrivi i grammi, da 0 a 3000, o togli il cibo.", en: "Enter the grams, 0 to 3000, or remove the food." }); return; }
    w.invalidi.delete(i);
    v.q = Math.round(g * 10) / 10; v.u = "g"; delete v.misura;
    const opz = opzioniNutrizione();
    const r = valoriVoce(v, opz);
    const k = document.getElementById("reg-k-" + i); if (k) k.textContent = r.val ? kcalTesto(r.val.kcal) : "-";
    if (c) c.textContent = calcoloTesto(r, origineVoce(v, opz));
    const tot = valoriVoci(w.voci, opz);
    const tEl = document.getElementById("reg-tot"); if (tEl) tEl.textContent = (tot.completo ? "" : "≥ ") + kcalTesto(tot.tot.kcal);
    const m = document.getElementById("reg-mac"); if (m) m.textContent = macroTesto(tot.tot, tot.macroIncomplete);
  },
  regTogli: (d) => { if (w) { w.voci.splice(Number(d.i), 1); w.invalidi.clear(); w.nuovo = null; ridisegna(); } },
  regSalva: () => salva(false),
  regSostituisci: () => salva(true),
});
