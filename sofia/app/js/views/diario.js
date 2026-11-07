/*
 * The food log: what Sofia ate and the calories of the day against the
 * plan's 1400 kcal (eaten and left).
 *
 * Every entry is a list of ingredients with their uncooked weight. A planned
 * meal ticked as eaten is logged with the plan's lines, a composed meal with
 * the lines she picked; she can open any entry and correct each ingredient's
 * raw grams, or weigh her own ingredients. Each ingredient is matched to raw
 * (or dry) values: the plan's verified composition (CREA, CIQUAL, USDA), the
 * ANSES CIQUAL 2020 table, a package (Open Food Facts) or the values on the
 * label. Values found outside the plan are copied into the line when it is
 * logged; plan foods use the plan's composition data (it changes only with an
 * app update) and lines counted in pieces the unit weights in Settings, so a
 * past day can move if those change. Every line shows
 * grams x kcal per 100 g and its source; estimates are marked and missing
 * data is said, never guessed.
 */
import { S, cambia } from "../store.js";
import { L, lingua, t } from "../i18n.js";
import { I, esc, num, dataBreve, giornoSett } from "../ui.js";
import { registra, apriFoglio, chiudiFoglio, ridisegna, toast } from "../ctx.js";
import { nome } from "../data/alimenti.js";
import { valoriVoci, valoriVoce, giornata, grammi, origineVoce, STATI, OBIETTIVO_KCAL, PASTI, scelta as sceltaDi } from "../engine/nutrizione.js";
import { isoData, aggiungiGiorni } from "../engine/planner.js";
import { cercaPiano, caricaTabella, cercaCiqual, cercaOnline } from "../engine/ricerca.js";

export const ORDINE_LOG = ["colazione", "spuntino", "pranzo", "cena", "dopocena", "altro"];
const NOMI_PASTO = { altro: { it: "Altro", en: "Other" } };
export const nomePasto = (p) => L(NOMI_PASTO[p] || PASTI[p].nome);

/* What the nutrition engine needs from the state: her own foods and unit weights. */
export function opzioniNutrizione(s = S()) {
  const extra = {};
  for (const [id, x] of Object.entries(s.alimentiExtra || {})) extra[id] = { per100: x.per100, stimaKcal: x.stimaKcal, fonte: x.fonte, codice: x.codice, nomeEn: x.nomeEn, marca: x.marca, gruppoCiqual: x.gruppoCiqual };
  return { extra, pesi: s.pesiUnita || {} };
}

export function nomeVoce(v, s = S()) {
  if (v.testo) return L(v.testo);
  if (v.nome) return v.nome;
  if (v.scelta && sceltaDi(v.scelta)) { const x = sceltaDi(v.scelta); return lingua() === "en" ? x.en : x.it; }
  const mio = (s.alimentiExtra || {})[v.a];
  if (mio) return mio.nome;
  return nome(v.a, lingua());
}

export const logDi = (s, data) => ((s.diario[data] || {}).mangiato) || {};
const copia = (x) => (x == null ? x : JSON.parse(JSON.stringify(x)));

/* Lines as they are stored: alternatives dropped; shared amounts, picks and
   the values copied from outside the plan kept. */
const COPIA = ["con", "scelta", "testo", "nome", "nomeEn", "fonte", "codice", "marca", "stato", "stimaKcal", "p"];
export function istantanea(voci) {
  return voci.map((v) => {
    const x = { a: v.a, q: v.q, u: v.u };
    for (const k of COPIA) if (v[k] != null) x[k] = JSON.parse(JSON.stringify(v[k]));
    return x;
  });
}

/* An entry is more than a plain plan tick when she weighed, composed or corrected it:
   losing it would lose her work, so changes to it can be undone. */
export const voceSua = (e) => !!e && (e.fonte !== "piano" || !!e.modificato);

let annulla = null;
/* Applies fn and keeps the day's food log as it was, so the toast can undo it
   for a few seconds. Only the log is restored, not the rest of the day. */
export function cambiaConAnnulla(data, messaggio, fn) {
  const g = S().diario[data] || {};
  annulla = { data, mangiato: copia(g.mangiato || null), pasti: copia(g.pasti || null) };
  cambia(fn);
  toast(messaggio, { az: "annullaDiario", testo: L({ it: "Annulla", en: "Undo" }) });
}

/* Returns true when it replaced her own entry (then an Undo toast is already showing). */
export function registraNelDiario(data, pasto, voci, fonte, nomeLibero = null) {
  const prima = pasto !== "altro" ? logDi(S(), data)[pasto] : null;
  if (voceSua(prima)) {
    cambiaConAnnulla(data, L({ it: `${nomePasto(pasto)} sostituito`, en: `${nomePasto(pasto)} replaced` }), (s) => scriviVoce(s, data, pasto, voci, fonte, nomeLibero));
    return true;
  }
  cambia((s) => scriviVoce(s, data, pasto, voci, fonte, nomeLibero));
  return false;
}
function scriviVoce(s, data, pasto, voci, fonte, nomeLibero) {
  const g = (s.diario[data] = s.diario[data] || {});
  g.mangiato = g.mangiato || {};
  const voce = { voci: istantanea(voci), fonte, ora: new Date().toISOString() };
  if (nomeLibero) voce.nome = nomeLibero;
  if (pasto === "altro") { g.mangiato.altro = Array.isArray(g.mangiato.altro) ? g.mangiato.altro : []; g.mangiato.altro.push(voce); }
  else { g.mangiato[pasto] = voce; g.pasti = g.pasti || {}; g.pasti[pasto] = true; }
}

function kcalTesto(k) { return `${num(k)} kcal`; }
const FONTE_VOCE = {
  piano: { it: "come da piano", en: "as planned" },
  composto: { it: "composto da te", en: "composed by you" },
  ingredienti: { it: "pesato da te", en: "weighed by you" },
  singolo: { it: "aggiunto da te", en: "added by you" },
};

/* --------------------------------------------------------- day card */
export function cartaCalorie(s, data) {
  const opz = opzioniNutrizione(s);
  const log = logDi(s, data);
  const g = giornata(log, opz);
  const mangiato = g.tot.kcal;
  const quota = mangiato / OBIETTIVO_KCAL;
  const stato = quota > 1.15 ? "molto" : quota > 1.0 ? "sopra" : "ok";
  const etichettaStato = stato === "ok"
    ? `<span class="stato ok">${I.ok}${esc(L({ it: "Nel piano", en: "Within the plan" }))}</span>`
    : `<span class="stato ${stato === "molto" ? "male" : "attenzione"}">${I.avviso}${esc(L({ it: "Oltre le 1400 kcal", en: "Over 1400 kcal" }))}</span>`;
  const righe = ORDINE_LOG.filter((p) => log[p] && (p !== "altro" || log[p].length)).map((p) => {
    const elenco = p === "altro" ? log[p] : [log[p]];
    return elenco.map((e, i) => {
      const r = valoriVoci(e.voci, opz);
      const desc = e.nome || e.voci.filter((v) => v.a !== "olio_evo" && v.a !== "verdure" || v.scelta).slice(0, 3).map((v) => nomeVoce(v, s)).join(" + ");
      const origine = FONTE_VOCE[e.fonte] ? " · " + L(FONTE_VOCE[e.fonte]) : "";
      const corretto = e.modificato ? " · " + L({ it: "corretto", en: "corrected" }) : "";
      return `<div class="voce-log"><div><div class="minimo">${esc(nomePasto(p))}${esc(origine + corretto)}</div><div>${esc(desc)}</div>
          <div class="minimo">${esc(L({ it: `${e.voci.length} ingredienti`, en: `${e.voci.length} ingredients` }))}</div></div>
        <div class="riga"><span class="kcal">${r.completo ? "" : "≥ "}${esc(kcalTesto(r.tot.kcal))}</span>
          <button class="btn piccolo" data-az="apriModificaLog" data-data="${data}" data-pasto="${p}" data-i="${i}">${esc(L({ it: "Grammi", en: "Grams" }))}</button>
          <button class="icon-btn mini" data-az="togliDalDiario" data-data="${data}" data-pasto="${p}" data-i="${i}" aria-label="${esc(L({ it: "Togli", en: "Remove" }))}">${I.chiudi}</button></div></div>`;
    }).join("");
  }).join("");
  const stime = g.stime.length ? `<p class="minimo">${esc(L({ it: "Stime usate", en: "Estimates used" }))}: ${esc(g.stime.join("; "))}.</p>` : "";
  const manca = g.mancanti.length ? `<p class="minimo">${esc(t("infoMancante"))}: ${esc([...new Set(g.mancanti)].map((a) => nomeVoce({ a }, s)).join(", "))} (${esc(L({ it: "non contati", en: "not counted" }))}).</p>` : "";
  return `<section class="card" aria-labelledby="kcal-tit">
    <div class="riga tra"><h3 id="kcal-tit">${esc(L({ it: "Calorie di oggi", en: "Today's calories" }))}</h3>${etichettaStato}</div>
    <div class="griglia2">
      <div class="tile"><div class="lab">${esc(L({ it: "Mangiate", en: "Eaten" }))}</div><div class="val">${esc(num(mangiato))}<small>kcal</small></div></div>
      <div class="tile"><div class="lab">${esc(g.restano >= 0 ? L({ it: "Restano", en: "Left" }) : L({ it: "Oltre", en: "Over by" }))}</div><div class="val">${esc(num(Math.abs(g.restano)))}<small>kcal</small></div></div>
    </div>
    <div class="metro ${stato}" role="meter" aria-valuemin="0" aria-valuemax="${OBIETTIVO_KCAL}" aria-valuenow="${Math.round(mangiato)}" aria-label="${esc(L({ it: "Calorie mangiate su 1400", en: "Calories eaten of 1400" }))}"><i data-w="${Math.min(100, quota * 100)}"></i></div>
    <div class="minimo riga tra"><span>0</span><span>${esc(L({ it: "obiettivo del piano: circa 1400 kcal", en: "plan target: about 1400 kcal" }))}</span></div>
    <div class="piccolo muted" data-s="sd6f2a">${esc(L({ it: "Proteine", en: "Protein" }))} ${num(g.tot.prot)} g · ${esc(L({ it: "carboidrati", en: "carbs" }))} ${num(g.tot.carb)} g · ${esc(L({ it: "grassi", en: "fat" }))} ${num(g.tot.fat)} g · ${esc(L({ it: "fibre", en: "fibre" }))} ${num(g.tot.fib)} g${g.macroIncomplete ? esc(L({ it: " (incompleti: un'etichetta non li dà tutti)", en: " (incomplete: a label does not give them all)" })) : ""}</div>
    ${righe ? `<div class="log">${righe}</div>` : `<p class="piccolo muted">${esc(L({ it: "Segna i pasti con la spunta: le dosi del piano vengono registrate da sole. Se mangi altro o dosi diverse, pesa gli ingredienti a crudo e inseriscili qui.", en: "Tick meals as eaten: the plan's amounts are logged by themselves. If you eat something else or other amounts, weigh the ingredients raw and enter them here." }))}</p>`}
    <div class="riga wrap" data-s="sd6f2a"><button class="btn piccolo" data-az="apriIngredienti" data-data="${data}">${I.piu}${esc(L({ it: "Ingredienti a crudo", en: "Raw ingredients" }))}</button></div>
    ${stime}${manca}
    ${storico(s, data, opz)}
  </section>`;
}

/* Last 7 days: one series, bars from a zero baseline, the plan's 1400 kcal as a
   reference line, tooltip per bar and a table view (dataviz rules). */
function storico(s, data, opz) {
  const giorni = [];
  for (let i = 6; i >= 0; i--) {
    const d = aggiungiGiorni(data, -i);
    const log = logDi(s, d);
    const vuoto = !Object.keys(log).some((k) => (k === "altro" ? (log[k] || []).length : log[k]));
    giorni.push({ d, kcal: vuoto ? null : giornata(log, opz).tot.kcal });
  }
  if (giorni.filter((x) => x.kcal != null).length < 2) return "";
  const W = 340, H = 150, ml = 34, mr = 8, mt = 10, mb = 24;
  const max = Math.max(OBIETTIVO_KCAL * 1.2, ...giorni.map((x) => x.kcal || 0));
  const passo = 500;
  const top = Math.ceil(max / passo) * passo;
  const sy = (v) => mt + (1 - v / top) * (H - mt - mb);
  const bw = (W - ml - mr) / 7;
  let svg = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(L({ it: "Calorie degli ultimi 7 giorni", en: "Calories over the last 7 days" }))}">`;
  for (let v = 0; v <= top; v += passo) svg += `<line class="griglia-l" x1="${ml}" x2="${W - mr}" y1="${sy(v).toFixed(1)}" y2="${sy(v).toFixed(1)}"/><text class="asse-t" x="${ml - 5}" y="${(sy(v) + 3.5).toFixed(1)}" text-anchor="end">${esc(num(v))}</text>`;
  giorni.forEach((x, i) => {
    const cx = ml + bw * i + bw / 2;
    if (x.kcal != null) {
      const y = sy(x.kcal), h = sy(0) - y;
      const w = Math.min(18, bw - 6);
      svg += `<path class="colonna" d="M${(cx - w / 2).toFixed(1)},${sy(0).toFixed(1)}V${(y + 4).toFixed(1)}a4,4 0 0 1 4,-4h${(w - 8).toFixed(1)}a4,4 0 0 1 4,4V${sy(0).toFixed(1)}Z" tabindex="0" data-tip="${esc(`${giornoSett(x.d)} ${dataBreve(x.d)}: ${num(x.kcal)} kcal`)}"><title>${esc(`${giornoSett(x.d)} ${dataBreve(x.d)}: ${num(x.kcal)} kcal`)}</title></path>`;
      void h;
    }
    svg += `<text class="asse-t" x="${cx.toFixed(1)}" y="${H - 7}" text-anchor="middle">${esc(giornoSett(x.d).slice(0, 2))}</text>`;
  });
  svg += `<line class="obiettivo" x1="${ml}" x2="${W - mr}" y1="${sy(OBIETTIVO_KCAL).toFixed(1)}" y2="${sy(OBIETTIVO_KCAL).toFixed(1)}"/><text class="obiettivo-t" x="${W - mr}" y="${(sy(OBIETTIVO_KCAL) - 4).toFixed(1)}" text-anchor="end">1400</text></svg>`;
  const tabella = `<table class="tabella"><thead><tr><th>${esc(L({ it: "Giorno", en: "Day" }))}</th><th>kcal</th></tr></thead><tbody>${giorni.map((x) => `<tr><td>${esc(giornoSett(x.d))} ${esc(dataBreve(x.d))}</td><td>${x.kcal == null ? "-" : esc(num(x.kcal))}</td></tr>`).join("")}</tbody></table>`;
  return `<h4 class="sotto-tit">${esc(L({ it: "Ultimi 7 giorni", en: "Last 7 days" }))}</h4><div class="colonne">${svg}</div>
    <details><summary class="minimo">${esc(L({ it: "Vedi come tabella", en: "View as table" }))}</summary>${tabella}</details>`;
}

/* ------------------------------------- ingredients sheet, uncooked weights */
let ing = null;
const numero = (x) => { const n = Number(String(x ?? "").trim().replace(",", ".")); return String(x ?? "").trim() === "" ? NaN : n; };
const CAMPI_100 = ["kcal", "prot", "carb", "fat", "fib", "salt"];
function valori100(per100) {
  const p = {};
  for (const k of CAMPI_100) { const x = per100 ? Number(per100[k]) : NaN; if (per100 && per100[k] != null && Number.isFinite(x)) p[k] = Math.round(x * 100) / 100; }
  return p;
}
function pastoDellOra(d = new Date()) {
  const h = d.getHours() + d.getMinutes() / 60;
  return h < 10 ? "colazione" : h < 12 ? "spuntino" : h < 16 ? "pranzo" : h < 21.5 ? "cena" : "dopocena";
}
const statoTesto = (st) => (st && STATI[st] ? L(STATI[st]) : "");
/* What weight to enter, by the state the values refer to. */
const PESO = {
  crudo: { it: "g crudi", en: "g raw" }, secco: { it: "g secchi", en: "g dry" }, cotto: { it: "g cotti", en: "g cooked" },
  conservato: { it: "g sgocciolati", en: "g drained" }, venduto: { it: "g", en: "g" },
};
const pesoTesto = (st) => L(PESO[st] || PESO.venduto);

function fonteTesto(o) {
  if (!o.fonti || !o.fonti.length) return "";
  const f = o.fonti.map((x) => [x.db, x.id, x.nome].filter(Boolean).join(" ")).join("; ");
  if (o.resa) return L({ it: o.resa.it, en: o.resa.en }) + ": " + f;
  if (o.media) return L({ it: `media di ${o.fonti.length} alimenti: `, en: `average of ${o.fonti.length} foods: ` }) + f;
  if (o.simile) return L({ it: "valori di un alimento simile: ", en: "values of a similar food: " }) + f;
  return f;
}

/* kcal per 100 g with the decimal the source gives (16,5 not 17), so the sum can be checked by hand. */
const k100Testo = (k) => (k == null ? null : num(k, Math.abs(k - Math.round(k)) >= 0.05 ? 1 : 0));
function calcoloTesto(r, o) {
  const k100 = k100Testo(o.kcal100);
  return r.val && r.g && k100 != null ? `${num(r.g)} g × ${k100} kcal/100 g = ${num(r.val.kcal)} kcal` : "";
}
const macroTesto = (tot, incompleti = false) => `${L({ it: "Proteine", en: "Protein" })} ${num(tot.prot, 1)} g · ${L({ it: "carboidrati", en: "carbs" })} ${num(tot.carb, 1)} g · ${L({ it: "grassi", en: "fat" })} ${num(tot.fat, 1)} g · ${L({ it: "fibre", en: "fibre" })} ${num(tot.fib, 1)} g` + (incompleti ? L({ it: " (incompleti: un'etichetta non li dà tutti)", en: " (incomplete: a label does not give them all)" }) : "");

/* One ingredient: name, raw state, grams (editable), kcal, and how it was worked out. */
function rigaIngrediente(v, i, opz, s) {
  const r = valoriVoce(v, opz);
  const o = origineVoce(v, opz);
  const gr = grammi(v, opz.pesi);
  const inGrammi = v.u === "g" && v.q != null && !Array.isArray(v.q);
  const valore = inGrammi ? v.q : gr.g != null && !gr.nonContato ? Math.round(gr.g) : "";
  const calcolo = calcoloTesto(r, o);
  const note = [];
  if (!inGrammi && v.q != null && v.u !== "q.b.") note.push(L({ it: `nel piano: ${Array.isArray(v.q) ? v.q.join("-") : num(v.q)} ${v.u}`, en: `in the plan: ${Array.isArray(v.q) ? v.q.join("-") : num(v.q)} ${v.u}` }) + (gr.stima ? ` (${gr.stima})` : ""));
  if (r.nonContato) note.push(L({ it: "quantità non indicata: metti i grammi per contarla", en: "amount not given: enter the grams to count it" }));
  if (r.manca && !r.nonContato) note.push(t("infoMancante"));
  if (v.con && v.con.length) note.push(L({ it: "peso condiviso tra: ", en: "weight shared between: " }) + [v.a, ...v.con].map((a) => nome(a, lingua())).join(", "));
  for (const x of r.stime) if (!/^1 |metà|peso condiviso/.test(x)) note.push(x);
  if (o.stato === "cotto" && !o.resa) note.push(L({ it: "valori per il cibo cotto: scrivi il peso da cotto", en: "values for the cooked food: enter the cooked weight" }));
  if (v.a === "verdure" && !v.scelta) note.push(L({ it: "media di 5 verdure: per un valore preciso toglila e aggiungi le verdure che hai usato", en: "average of 5 vegetables: for a precise value remove it and add the vegetables you used" }));
  return `<div class="ing-riga">
    <div class="ing-testa"><strong>${esc(nomeVoce(v, s))}</strong>${o.stato ? `<span class="stato-cibo ${esc(o.stato)}">${esc(statoTesto(o.stato))}</span>` : ""}</div>
    <div class="ing-dati">
      <label class="ing-g"><input type="number" inputmode="decimal" min="0" max="3000" step="1" value="${esc(valore)}" placeholder="g" data-input="ingGrammi" data-i="${i}" aria-label="${esc(`${nomeVoce(v, s)}: ${pesoTesto(o.stato)}`)}"><span>${esc(pesoTesto(o.stato))}</span></label>
      <span class="kcal" id="ing-k-${i}">${r.val ? esc(kcalTesto(r.val.kcal)) : "-"}</span>
      <button class="icon-btn mini" data-az="ingTogli" data-i="${i}" aria-label="${esc(L({ it: "Togli", en: "Remove" }))}">${I.chiudi}</button>
    </div>
    <div class="minimo" id="ing-c-${i}">${esc(calcolo)}</div>
    ${o.fonti && o.fonti.length ? `<div class="fonte">${esc(fonteTesto(o))}</div>` : ""}
    ${note.length ? `<div class="minimo">${esc(note.join(" · "))}</div>` : ""}
  </div>`;
}

function anteprima() {
  if (!ing || !ing.scelto) return "";
  const g = numero(ing.grammi);
  if (!(g > 0)) return L({ it: "Scrivi i grammi a crudo.", en: "Enter the raw grams." });
  const v = voceDa(ing.scelto, g);
  if (!v) return t("infoMancante");
  const r = valoriVoce(v, opzioniNutrizione());
  return r.val ? `= ${num(r.val.kcal)} kcal` : t("infoMancante");
}

function voceDa(c, g) {
  if (c.tipo === "piano" || c.tipo === "mio") return { a: c.a, q: g, u: "g" };
  if (c.tipo === "ciqual") { const r = c.rec; return { a: "ciq:" + r.codice, q: g, u: "g", nome: r.nome, nomeEn: r.nomeEn, fonte: "ciqual", codice: String(r.codice), stato: r.stato, stimaKcal: r.stimaKcal || 0, p: valori100(r.per100) }; }
  if (c.tipo === "off") { const r = c.rec; return { a: "off:" + r.codice, q: g, u: "g", nome: r.marca ? `${r.nome} (${r.marca})` : r.nome, fonte: "off", codice: r.codice, marca: r.marca || null, stato: "venduto", p: valori100(r.per100) }; }
  if (c.tipo === "etichetta") {
    const kcal = numero(c.campi.kcal);
    if (!(kcal >= 0 && kcal <= 900)) return null;
    const per100 = { kcal };
    for (const k of ["prot", "carb", "fat"]) { const x = numero(c.campi[k]); if (x >= 0 && x <= 100) per100[k] = x; }
    const scritto = String(c.campi.nome || "").trim().slice(0, 80);
    const n = scritto ? scritto.charAt(0).toUpperCase() + scritto.slice(1) : L({ it: "Prodotto dall'etichetta", en: "Product from the label" });
    return { a: "etichetta:" + n.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 40), q: g, u: "g", nome: n, fonte: "etichetta", stato: "venduto", p: valori100(per100) };
  }
  return null;
}

function foglioIngredienti() {
  const s = S();
  if (!ing) return "";
  const opz = opzioniNutrizione(s);
  const tot = valoriVoci(ing.voci, opz);
  const esistente = !ing.modifica && ing.pasto !== "altro" ? logDi(s, ing.data)[ing.pasto] : null;
  const q = ing.q.trim();
  const piano = q.length >= 2 ? cercaPiano(q) : [];
  const miei = q.length >= 2 ? Object.entries(s.alimentiExtra || {}).filter(([, x]) => x.nome.toLowerCase().includes(q.toLowerCase())).slice(0, 6) : [];
  const esclusi = new Set(s.pref.escludi || []);
  const c = ing.scelto;
  const risultati = q.length < 2 ? "" : `
    ${piano.length ? `<div class="minimo">${esc(L({ it: "Nel tuo piano (valori a crudo o secchi)", en: "In your plan (raw or dry values)" }))}</div>
      <div class="scelte">${piano.map((x) => `<button class="chip ${c && c.a === x.id ? "attivo" : ""}" data-az="ingScegli" data-tipo="piano" data-id="${esc(x.id)}">${esc(L(x))}${esclusi.has(x.id) ? ` · ${esc(L({ it: "non mangi", en: "you don't eat" }))}` : ""}</button>`).join("")}</div>` : ""}
    ${miei.length ? `<div class="minimo">${esc(L({ it: "I tuoi cibi", en: "Your foods" }))}</div>
      <div class="scelte">${miei.map(([id, x]) => `<button class="chip ${c && c.a === id ? "attivo" : ""}" data-az="ingScegli" data-tipo="mio" data-id="${esc(id)}">${esc(x.nome)}</button>`).join("")}</div>` : ""}
    <div class="minimo">${esc(L({ it: "Tabella CIQUAL 2020 (prima i valori a crudo)", en: "CIQUAL 2020 table (raw values first)" }))}</div>
    ${ing.ciqual.length && ing.ciqual[0].parziale ? `<div class="avviso">${I.avviso}<div class="piccolo">${esc(L({ it: "Nessun alimento per tutta la frase: questi risultati sono per una parola sola. Controlla che sia il cibo giusto.", en: "Nothing for the whole phrase: these results are for a single word. Check it is the right food." }))}</div></div>` : ""}
    ${ing.ciqual.length ? `<div class="ing-risultati">${ing.ciqual.map((x, i) => `<button class="ing-ris ${c && c.tipo === "ciqual" && c.rec.codice === x.codice ? "attivo" : ""}" data-az="ingScegli" data-tipo="ciqual" data-i="${i}">
        <span><strong>${esc(x.nome)}</strong> <span class="stato-cibo ${esc(x.stato)}">${esc(statoTesto(x.stato))}</span><br><span class="minimo">${esc(x.nomeEn)} · ${esc(String(x.codice))}</span></span>
        <span class="kcal">${esc(num(x.per100.kcal))}<small> kcal/100 g</small></span></button>`).join("")}</div>`
      : `<p class="minimo">${esc(ing.cercando ? L({ it: "Cerco...", en: "Searching..." }) : L({ it: "Nessun alimento trovato nella tabella. Prova un altro nome, cerca la confezione online o usa i valori dell'etichetta.", en: "No food found in the table. Try another name, search the package online or use the label values." }))}</p>`}
    ${ing.online ? (ing.online.stato === "carico" ? `<p class="minimo">${esc(L({ it: "Cerco le confezioni...", en: "Searching packages..." }))}</p>`
      : ing.online.stato === "errore" ? `<p class="minimo">${esc(L({ it: "La ricerca online non risponde ora. Usa la tabella o i valori dell'etichetta.", en: "The online search does not answer now. Use the table or the label values." }))}</p>`
      : `<div class="minimo">${esc(L({ it: "Confezioni (Open Food Facts, valori per 100 g come si compra; controlla l'etichetta)", en: "Packages (Open Food Facts, values per 100 g as sold; check the label)" }))}</div>
        ${ing.online.lista.length ? `<div class="ing-risultati">${ing.online.lista.slice(0, 8).map((x, i) => `<button class="ing-ris ${c && c.tipo === "off" && c.rec.codice === x.codice ? "attivo" : ""}" data-az="ingScegli" data-tipo="off" data-i="${i}">
          <span><strong>${esc(x.nome)}</strong>${x.marca ? `<br><span class="minimo">${esc(x.marca)}</span>` : ""}</span><span class="kcal">${esc(num(x.per100.kcal))}<small> kcal/100 g</small></span></button>`).join("")}</div>` : `<p class="minimo">${esc(L({ it: "Nessuna confezione trovata.", en: "No package found." }))}</p>`}`) : ""}
    <div class="riga wrap" data-s="sd6f2a">
      <button class="btn piccolo" data-az="ingOnline">${I.globo}${esc(L({ it: "Cerca confezioni online", en: "Search packages online" }))}</button>
      <button class="btn piccolo" data-az="ingEtichetta">${I.documento}${esc(L({ it: "Valori dall'etichetta", en: "Values from the label" }))}</button>
    </div>`;
  const nuovo = !c ? "" : c.tipo === "etichetta" ? `<div class="card piatta ing-nuovo">
      <strong>${esc(L({ it: "Valori dall'etichetta (per 100 g)", en: "Values from the label (per 100 g)" }))}</strong>
      <label class="campo"><span>${esc(L({ it: "Nome", en: "Name" }))}</span><input type="text" maxlength="80" value="${esc(c.campi.nome || "")}" data-input="ingEtiCampo" data-k="nome"></label>
      <div class="campi2">
        <label class="campo"><span>kcal</span><input type="number" inputmode="decimal" min="0" max="900" value="${esc(c.campi.kcal || "")}" data-input="ingEtiCampo" data-k="kcal"></label>
        <label class="campo"><span>${esc(L({ it: "Proteine g", en: "Protein g" }))}</span><input type="number" inputmode="decimal" min="0" max="100" value="${esc(c.campi.prot || "")}" data-input="ingEtiCampo" data-k="prot"></label>
        <label class="campo"><span>${esc(L({ it: "Carboidrati g", en: "Carbs g" }))}</span><input type="number" inputmode="decimal" min="0" max="100" value="${esc(c.campi.carb || "")}" data-input="ingEtiCampo" data-k="carb"></label>
        <label class="campo"><span>${esc(L({ it: "Grassi g", en: "Fat g" }))}</span><input type="number" inputmode="decimal" min="0" max="100" value="${esc(c.campi.fat || "")}" data-input="ingEtiCampo" data-k="fat"></label>
      </div>
      <label class="campo"><span>${esc(L({ it: "Grammi che hai usato", en: "Grams you used" }))}</span><input type="number" inputmode="decimal" min="1" max="3000" id="ing-grammi" value="${esc(ing.grammi)}" data-input="ingGrammiNuovo"></label>
      <p class="piccolo" id="ing-anteprima" aria-live="polite">${esc(anteprima())}</p>
      <button class="btn primario" data-az="ingAggiungi">${I.piu}${esc(L({ it: "Aggiungi", en: "Add" }))}</button></div>`
    : (() => {
      const prova = voceDa(c, 100);
      const o = prova ? origineVoce(prova, opz) : { fonti: [] };
      const nomeC = c.tipo === "ciqual" || c.tipo === "off" ? c.rec.nome : c.nome;
      return `<div class="card piatta ing-nuovo">
        <div class="ing-testa"><strong>${esc(nomeC)}</strong>${o.stato ? `<span class="stato-cibo ${esc(o.stato)}">${esc(statoTesto(o.stato))}</span>` : ""}</div>
        <div class="minimo">${o.kcal100 != null ? esc(`${k100Testo(o.kcal100)} kcal/100 g`) : esc(t("infoMancante"))}${o.fonti.length ? " · " + esc(fonteTesto(o)) : ""}</div>
        ${o.stato === "cotto" ? `<div class="avviso terra">${I.avviso}<div class="piccolo">${esc(L({ it: "Questi valori sono per il cibo cotto: usali solo se hai pesato da cotto.", en: "These values are for the cooked food: use them only if you weighed it cooked." }))}</div></div>` : ""}
        <label class="campo"><span>${esc(L(({ crudo: { it: "Grammi a crudo", en: "Raw grams" }, secco: { it: "Grammi a secco, prima di cuocere", en: "Dry grams, before cooking" }, cotto: { it: "Grammi da cotto", en: "Cooked grams" }, conservato: { it: "Grammi sgocciolati", en: "Drained grams" } })[o.stato] || { it: "Grammi", en: "Grams" }))}</span><input type="number" inputmode="decimal" min="1" max="3000" id="ing-grammi" value="${esc(ing.grammi)}" data-input="ingGrammiNuovo"></label>
        <p class="piccolo" id="ing-anteprima" aria-live="polite">${esc(anteprima())}</p>
        <button class="btn primario" data-az="ingAggiungi">${I.piu}${esc(L({ it: "Aggiungi", en: "Add" }))}</button></div>`;
    })();
  return `<button class="icon-btn chiudi" data-az="chiudiFoglio" aria-label="${esc(t("chiudi"))}">${I.chiudi}</button>
    <h2>${esc(ing.modifica ? L({ it: `${nomePasto(ing.pasto)}: ingredienti`, en: `${nomePasto(ing.pasto)}: ingredients` }) : L({ it: "Ingredienti a crudo", en: "Raw ingredients" }))}</h2>
    <p class="piccolo muted">${esc(L({ it: "Pesa ogni ingrediente prima di cuocerlo e scrivi i grammi: l'app li trasforma in calorie con i valori a crudo delle tabelle ufficiali o dell'etichetta.", en: "Weigh each ingredient before cooking and enter the grams: the app turns them into calories with the raw values of official tables or of the label." }))}</p>
    <details class="come-calcola"><summary class="piccolo">${esc(L({ it: "Come calcola le calorie", en: "How the calories are worked out" }))}</summary>
      <ul class="piccolo">
        <li>${esc(L({ it: "Peso a crudo: la cottura cambia soprattutto l'acqua, che non ha calorie, quindi grammi a crudo per valori a crudo danno le calorie del piatto. L'olio della cottura va aggiunto a parte. Ogni riga dice a che stato si riferiscono i valori (crudo, secco, cotto, sgocciolato) e quindi che peso scrivere.", en: "Raw weight: cooking mostly changes water, which has no calories, so raw grams times raw values give the calories of the dish. Cooking oil is added separately. Each line says which state its values refer to (raw, dry, cooked, drained) and so which weight to enter." }))}</li>
        <li>${esc(L({ it: "Valori per 100 g: cibi del piano dalle tabelle verificate dal consiglio (CREA, CIQUAL, USDA), per pochi cibi da un alimento simile (lo dice la riga); gli altri dalla tabella ufficiale CIQUAL 2020 (ANSES), da una confezione di Open Food Facts (dati inseriti da utenti: controlla l'etichetta) o dall'etichetta che copi tu.", en: "Values per 100 g: plan foods from the tables checked by the council (CREA, CIQUAL, USDA), for a few foods from a similar food (the line says so); the others from the official CIQUAL 2020 table (ANSES), from an Open Food Facts package (user-entered data: check the label) or from the label you copy." }))}</li>
        <li>${esc(L({ it: "Energia: CIQUAL e le etichette UE usano i fattori del Regolamento (UE) 1169/2011: 4 kcal per grammo di proteine e di carboidrati, 9 di grassi, 2 di fibre.", en: "Energy: CIQUAL and EU labels use the factors of Regulation (EU) 1169/2011: 4 kcal per gram of protein and of carbohydrate, 9 of fat, 2 of fibre." }))}</li>
        <li>${esc(L({ it: "Sono stime: le tabelle danno valori medi e un prodotto reale può differire. Con i valori dell'etichetta il calcolo è più preciso.", en: "These are estimates: tables give average values and a real product can differ. With the label values the result is more precise." }))}</li>
      </ul></details>
    ${ing.modifica ? "" : `<label class="campo"><span>${esc(L({ it: "Pasto", en: "Meal" }))}</span><select data-cambia="ingPasto">${ORDINE_LOG.map((p) => `<option value="${p}" ${ing.pasto === p ? "selected" : ""}>${esc(nomePasto(p))}</option>`).join("")}</select></label>
      ${esistente ? `<p class="minimo">${esc(L({ it: `${nomePasto(ing.pasto)} è già registrato (${num(valoriVoci(esistente.voci, opz).tot.kcal)} kcal): alla fine scegli se aggiungere questi ingredienti o sostituirlo.`, en: `${nomePasto(ing.pasto)} is already logged (${num(valoriVoci(esistente.voci, opz).tot.kcal)} kcal): at the end choose whether to add these ingredients or replace it.` }))}</p>` : ""}`}
    <div class="ing-lista">${ing.voci.length ? ing.voci.map((v, i) => rigaIngrediente(v, i, opz, s)).join("") : `<p class="piccolo muted">${esc(L({ it: "Ancora nessun ingrediente.", en: "No ingredients yet." }))}</p>`}</div>
    ${ing.voci.length ? `<div class="ing-totale riga tra"><strong>${esc(L({ it: "Totale", en: "Total" }))}</strong><span class="kcal" id="ing-tot">${tot.completo ? "" : "≥ "}${esc(kcalTesto(tot.tot.kcal))}</span></div>
      <p class="minimo" id="ing-mac">${esc(macroTesto(tot.tot, tot.macroIncomplete))}</p>` : ""}
    <h3 class="sotto-tit">${esc(L({ it: "Aggiungi un ingrediente", en: "Add an ingredient" }))}</h3>
    <input class="cerca" type="search" id="cerca-ing" placeholder="${esc(L({ it: "Es. riso basmati, zucchine, petto di pollo", en: "E.g. basmati rice, courgettes, chicken breast" }))}" value="${esc(ing.q)}" data-input="ingCerca" aria-label="${esc(L({ it: "Cerca un ingrediente", en: "Search an ingredient" }))}">
    ${risultati}
    ${nuovo}
    ${esistente ? `<div class="campi2">
        <button class="btn primario" data-az="ingRegistra">${I.piu}${esc(L({ it: `Aggiungi al ${nomePasto(ing.pasto).toLowerCase()}`, en: `Add to ${nomePasto(ing.pasto).toLowerCase()}` }))}</button>
        <button class="btn" data-az="ingSostituisci">${I.scambio}${esc(L({ it: "Sostituisci", en: "Replace" }))}</button></div>`
      : `<button class="btn primario pieno" data-az="ingRegistra">${I.spunta}${esc(ing.modifica ? L({ it: "Salva", en: "Save" }) : L({ it: "Registra nel diario", en: "Log it" }))}</button>`}`;
}

function rimettiFuoco(id) {
  const c = document.getElementById(id);
  if (c) { c.focus(); if (c.setSelectionRange && c.type !== "number") c.setSelectionRange(c.value.length, c.value.length); }
}

let timerIng = null;
async function cercaIngredienti() {
  if (!ing) return;
  const mio = (ing.cercaId = (ing.cercaId || 0) + 1);
  const n = ing.q.trim();
  if (n.length < 2) { ing.ciqual = []; ing.cercando = false; ridisegna(); rimettiFuoco("cerca-ing"); return; }
  ing.cercando = true;
  const tab = await caricaTabella();
  if (!ing || mio !== ing.cercaId) return;
  ing.ciqual = cercaCiqual(n, tab, 8, { crudo: true });
  ing.cercando = false;
  ridisegna();
  rimettiFuoco("cerca-ing");
}

export function apriIngredienti({ data = isoData(new Date()), pasto = null, modifica = null } = {}) {
  let voci = [];
  if (modifica) {
    const log = logDi(S(), data);
    const e = modifica.pasto === "altro" ? (log.altro || [])[modifica.i] : log[modifica.pasto];
    if (!e) return;
    voci = copia(e.voci);
    pasto = modifica.pasto;
  }
  ing = { data, pasto: pasto || pastoDellOra(), voci, modifica, q: "", ciqual: [], online: null, scelto: null, grammi: "", cercaId: 0, cercando: false, invalidi: new Set() };
  apriFoglio(foglioIngredienti);
  caricaTabella();
}

function salvaIngredienti(sostituisci = false) {
  if (!ing) return;
  if (ing.invalidi.size) { toast(L({ it: "Controlla i grammi segnati", en: "Check the grams marked" })); return; }
  const ora = new Date().toISOString();
  const voci = ing.voci;
  const { data, pasto, modifica } = ing;
  if (modifica) {
    const svuota = !voci.length;
    const applica = (s) => {
      const g = s.diario[data];
      if (!g || !g.mangiato) return;
      if (pasto === "altro") {
        const arr = g.mangiato.altro || [];
        if (!arr[modifica.i]) return;
        if (!voci.length) arr.splice(modifica.i, 1);
        else { arr[modifica.i].voci = istantanea(voci); arr[modifica.i].modificato = ora; }
      } else if (g.mangiato[pasto]) {
        if (!voci.length) { delete g.mangiato[pasto]; if (g.pasti) g.pasti[pasto] = false; }
        else { g.mangiato[pasto].voci = istantanea(voci); g.mangiato[pasto].modificato = ora; }
      }
    };
    ing = null;
    chiudiFoglio();
    if (svuota) cambiaConAnnulla(data, L({ it: `${nomePasto(pasto)} tolto dal diario`, en: `${nomePasto(pasto)} removed from the diary` }), applica);
    else { cambia(applica); toast(L({ it: "Diario aggiornato", en: "Diary updated" })); }
    return;
  }
  if (!voci.length) { toast(L({ it: "Aggiungi almeno un ingrediente", en: "Add at least one ingredient" })); return; }
  const esistente = pasto !== "altro" && logDi(S(), data)[pasto];
  ing = null;
  chiudiFoglio();
  if (esistente && !sostituisci) {
    cambia((s) => { const e = s.diario[data].mangiato[pasto]; e.voci.push(...istantanea(voci)); e.modificato = ora; });
    toast(L({ it: "Aggiunti al pasto", en: "Added to the meal" }));
  } else if (esistente) {
    cambiaConAnnulla(data, L({ it: `${nomePasto(pasto)} sostituito`, en: `${nomePasto(pasto)} replaced` }), (s) => scriviVoce(s, data, pasto, voci, "ingredienti"));
  } else {
    registraNelDiario(data, pasto, voci, "ingredienti");
    toast(L({ it: "Diario aggiornato", en: "Diary updated" }));
  }
}

registra({
  apriIngredienti: (d) => apriIngredienti({ data: d.data || isoData(new Date()), pasto: d.pasto || null }),
  /* kept for older links: the single-food sheet became the ingredients sheet */
  apriAggiungiCibo: (d) => apriIngredienti({ data: d.data || isoData(new Date()) }),
  apriModificaLog: (d) => apriIngredienti({ data: d.data, modifica: { pasto: d.pasto, i: Number(d.i) || 0 } }),
  ingPasto: (d, el) => { if (ing && !ing.modifica) { ing.pasto = el.value; ridisegna(); } },
  ingCerca: (d, el) => { if (!ing) return; ing.q = el.value; ing.online = null; clearTimeout(timerIng); timerIng = setTimeout(cercaIngredienti, 220); },
  ingScegli: (d) => {
    if (!ing) return;
    const s = S();
    if (d.tipo === "piano") ing.scelto = { tipo: "piano", a: d.id, nome: nome(d.id, lingua()) };
    else if (d.tipo === "mio" && s.alimentiExtra[d.id]) ing.scelto = { tipo: "mio", a: d.id, nome: s.alimentiExtra[d.id].nome };
    else if (d.tipo === "ciqual" && ing.ciqual[Number(d.i)]) ing.scelto = { tipo: "ciqual", rec: ing.ciqual[Number(d.i)] };
    else if (d.tipo === "off" && ing.online && ing.online.lista[Number(d.i)]) ing.scelto = { tipo: "off", rec: ing.online.lista[Number(d.i)] };
    else return;
    ing.grammi = "";
    ridisegna();
    rimettiFuoco("ing-grammi");
  },
  ingOnline: async () => {
    if (!ing) return;
    const n = ing.q.trim();
    if (n.length < 2) { toast(L({ it: "Scrivi prima un nome", en: "Type a name first" })); return; }
    ing.online = { stato: "carico", lista: [] };
    ridisegna();
    try {
      const lista = await cercaOnline(n);
      if (ing && ing.q.trim() === n) ing.online = { stato: "ok", lista: lista.filter((x) => x.per100 && x.per100.kcal != null) };
    } catch (e) {
      if (ing) ing.online = { stato: "errore", lista: [] };
    }
    ridisegna();
  },
  ingEtichetta: () => { if (!ing) return; ing.scelto = { tipo: "etichetta", campi: { nome: ing.q.trim() } }; ing.grammi = ""; ridisegna(); },
  ingEtiCampo: (d, el) => {
    if (!ing || !ing.scelto || ing.scelto.tipo !== "etichetta") return;
    ing.scelto.campi[d.k] = el.value;
    const a = document.getElementById("ing-anteprima");
    if (a) a.textContent = anteprima();
  },
  ingGrammiNuovo: (d, el) => {
    if (!ing) return;
    ing.grammi = el.value;
    const a = document.getElementById("ing-anteprima");
    if (a) a.textContent = anteprima();
  },
  ingAggiungi: () => {
    if (!ing || !ing.scelto) return;
    const g = numero(ing.grammi);
    if (!(g > 0 && g <= 3000)) { toast(L({ it: "Scrivi i grammi (da 1 a 3000)", en: "Enter the grams (1 to 3000)" })); return; }
    const v = voceDa(ing.scelto, g);
    if (!v) { toast(L({ it: "Scrivi le kcal per 100 g dell'etichetta (da 0 a 900)", en: "Enter the label's kcal per 100 g (0 to 900)" })); return; }
    ing.voci.push(v);
    ing.scelto = null; ing.grammi = ""; ing.q = ""; ing.ciqual = []; ing.online = null;
    ridisegna();
  },
  /* Typing grams updates the line and the total in place: no redraw, so a tap
     on Save right after typing is never lost. */
  ingGrammi: (d, el) => {
    if (!ing) return;
    const i = Number(d.i);
    const v = ing.voci[i];
    if (!v) return;
    const g = numero(el.value);
    if (!(g >= 0 && g <= 3000)) {
      ing.invalidi.add(i);
      const c = document.getElementById("ing-c-" + i);
      if (c) c.textContent = L({ it: "Scrivi i grammi, da 0 a 3000, o togli l'ingrediente.", en: "Enter the grams, 0 to 3000, or remove the ingredient." });
      return;
    }
    ing.invalidi.delete(i);
    v.q = Math.round(g * 10) / 10; v.u = "g";
    const opz = opzioniNutrizione();
    const r = valoriVoce(v, opz);
    const k = document.getElementById("ing-k-" + i); if (k) k.textContent = r.val ? kcalTesto(r.val.kcal) : "-";
    const c = document.getElementById("ing-c-" + i); if (c) c.textContent = calcoloTesto(r, origineVoce(v, opz));
    const tot = valoriVoci(ing.voci, opz);
    const tEl = document.getElementById("ing-tot"); if (tEl) tEl.textContent = (tot.completo ? "" : "≥ ") + kcalTesto(tot.tot.kcal);
    const m = document.getElementById("ing-mac"); if (m) m.textContent = macroTesto(tot.tot, tot.macroIncomplete);
  },
  ingTogli: (d) => { if (ing) { ing.voci.splice(Number(d.i), 1); ing.invalidi.clear(); ridisegna(); } },
  ingRegistra: () => salvaIngredienti(false),
  ingSostituisci: () => salvaIngredienti(true),
  togliDalDiario: (d) => cambiaConAnnulla(d.data, L({ it: `${nomePasto(d.pasto)} tolto dal diario`, en: `${nomePasto(d.pasto)} removed from the diary` }), (s) => {
    const g = s.diario[d.data];
    if (!g || !g.mangiato) return;
    if (d.pasto === "altro") { (g.mangiato.altro || []).splice(Number(d.i), 1); }
    else { delete g.mangiato[d.pasto]; if (g.pasti) g.pasti[d.pasto] = false; }
  }),
  annullaDiario: () => {
    if (!annulla) return;
    const { data, mangiato, pasti } = annulla;
    annulla = null;
    cambia((s) => {
      const g = (s.diario[data] = s.diario[data] || {});
      if (mangiato) g.mangiato = mangiato; else delete g.mangiato;
      if (pasti) g.pasti = pasti; else delete g.pasti;
    });
    toast(L({ it: "Ripristinato", en: "Restored" }));
  },
});
