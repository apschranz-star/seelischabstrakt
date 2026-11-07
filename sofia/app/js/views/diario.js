/*
 * The food log: what Sofia ate, in the plan's amounts, and the calories of
 * the day against the plan's 1400 kcal.
 *
 * A planned meal ticked as eaten is logged with the plan's lines; a meal she
 * composed is logged with the lines she picked; anything else she adds goes
 * under "Altro". Calories come from engine/nutrizione.js; estimates (pieces,
 * pots) are marked, and missing data is said, never guessed.
 */
import { S, cambia } from "../store.js";
import { L, lingua, t } from "../i18n.js";
import { I, esc, num, quantita, dataBreve, giornoSett } from "../ui.js";
import { registra, apriFoglio, chiudiFoglio, ridisegna, toast } from "../ctx.js";
import { ALIMENTI, nome } from "../data/alimenti.js";
import { valoriVoci, giornata, OBIETTIVO_KCAL, PASTI, scelta as sceltaDi } from "../engine/nutrizione.js";
import { isoData, aggiungiGiorni } from "../engine/planner.js";
import { cercaPiano } from "../engine/ricerca.js";

export const ORDINE_LOG = ["colazione", "spuntino", "pranzo", "cena", "dopocena", "altro"];
const NOMI_PASTO = { altro: { it: "Altro", en: "Other" } };
export const nomePasto = (p) => L(NOMI_PASTO[p] || PASTI[p].nome);

/* What the nutrition engine needs from the state: her own foods and unit weights. */
export function opzioniNutrizione(s = S()) {
  const extra = {};
  for (const [id, x] of Object.entries(s.alimentiExtra || {})) extra[id] = { per100: x.per100, stimaKcal: x.stimaKcal, fonte: x.fonte };
  return { extra, pesi: s.pesiUnita || {} };
}

export function nomeVoce(v, s = S()) {
  if (v.testo) return L(v.testo);
  if (v.scelta && sceltaDi(v.scelta)) { const x = sceltaDi(v.scelta); return lingua() === "en" ? x.en : x.it; }
  const mio = (s.alimentiExtra || {})[v.a];
  if (mio) return mio.nome;
  return nome(v.a, lingua());
}

export const logDi = (s, data) => ((s.diario[data] || {}).mangiato) || {};

/* Plain lines for the log: alternatives dropped, shared amounts and picks kept. */
export function istantanea(voci) {
  return voci.map((v) => {
    const x = { a: v.a, q: v.q, u: v.u };
    if (v.con) x.con = [...v.con];
    if (v.scelta) x.scelta = v.scelta;
    if (v.testo) x.testo = v.testo;
    return x;
  });
}

export function registraNelDiario(data, pasto, voci, fonte, nomeLibero = null) {
  cambia((s) => {
    const g = (s.diario[data] = s.diario[data] || {});
    g.mangiato = g.mangiato || {};
    const voce = { voci: istantanea(voci), fonte, ora: new Date().toISOString() };
    if (nomeLibero) voce.nome = nomeLibero;
    if (pasto === "altro") { g.mangiato.altro = Array.isArray(g.mangiato.altro) ? g.mangiato.altro : []; g.mangiato.altro.push(voce); }
    else { g.mangiato[pasto] = voce; g.pasti = g.pasti || {}; g.pasti[pasto] = true; }
  });
}

function kcalTesto(k) { return `${num(k)} kcal`; }

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
      return `<div class="voce-log"><div><div class="minimo">${esc(nomePasto(p))}${e.fonte === "composto" ? " · " + esc(L({ it: "composto da te", en: "composed by you" })) : e.fonte === "piano" ? " · " + esc(L({ it: "come da piano", en: "as planned" })) : ""}</div><div>${esc(desc)}</div></div>
        <div class="riga"><span class="kcal">${r.completo ? "" : "≥ "}${esc(kcalTesto(r.tot.kcal))}</span><button class="icon-btn mini" data-az="togliDalDiario" data-data="${data}" data-pasto="${p}" data-i="${i}" aria-label="${esc(L({ it: "Togli", en: "Remove" }))}">${I.chiudi}</button></div></div>`;
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
    <div class="piccolo muted" data-s="sd6f2a">${esc(L({ it: "Proteine", en: "Protein" }))} ${num(g.tot.prot)} g · ${esc(L({ it: "carboidrati", en: "carbs" }))} ${num(g.tot.carb)} g · ${esc(L({ it: "grassi", en: "fat" }))} ${num(g.tot.fat)} g · ${esc(L({ it: "fibre", en: "fibre" }))} ${num(g.tot.fib)} g</div>
    ${righe ? `<div class="log">${righe}</div>` : `<p class="piccolo muted">${esc(L({ it: "Segna i pasti con la spunta: le dosi del piano vengono registrate da sole. Se mangi altro, usa Componi o Aggiungi.", en: "Tick meals as eaten: the plan's amounts are logged by themselves. If you eat something else, use Compose or Add." }))}</p>`}
    <div class="riga wrap" data-s="sd6f2a"><button class="btn piccolo" data-az="apriAggiungiCibo" data-data="${data}">${I.piu}${esc(L({ it: "Aggiungi un cibo", en: "Add a food" }))}</button></div>
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

/* ------------------------------------------------ add one food sheet */
let aggiungi = { data: null, q: "", scelto: null, grammi: 100, pasto: "altro" };
function foglioAggiungi() {
  const s = S();
  const q = aggiungi.q.trim();
  const miei = Object.entries(s.alimentiExtra || {}).filter(([, x]) => x.livello !== "no" && (!q || x.nome.toLowerCase().includes(q.toLowerCase()))).slice(0, 8);
  const piano = q ? cercaPiano(q).filter((x) => !(s.pref.escludi || []).includes(x.id)) : [];
  const voce = aggiungi.scelto ? { a: aggiungi.scelto, q: Number(aggiungi.grammi) || 0, u: "g" } : null;
  const val = voce ? valoriVoci([voce], opzioniNutrizione(s)) : null;
  return `<button class="icon-btn chiudi" data-az="chiudiFoglio" aria-label="${esc(t("chiudi"))}">${I.chiudi}</button>
    <h2>${esc(L({ it: "Aggiungi un cibo", en: "Add a food" }))}</h2>
    <input class="cerca" type="search" id="cerca-agg" placeholder="${esc(L({ it: "Cerca tra il piano e i tuoi cibi", en: "Search the plan and your foods" }))}" value="${esc(aggiungi.q)}" data-input="aggCerca" aria-label="${esc(L({ it: "Cerca", en: "Search" }))}">
    <div class="scelte" data-s="sd6f2a">${[...piano.map((x) => [x.id, L(x)]), ...miei.map(([id, x]) => [id, x.nome])].map(([id, n]) => `<button class="chip ${aggiungi.scelto === id ? "attivo" : ""}" data-az="aggScegli" data-id="${esc(id)}">${esc(n)}</button>`).join("") || `<p class="minimo">${esc(L({ it: "Scrivi un nome. Per un cibo nuovo usa Cibo, I miei cibi: il consiglio lo controlla prima.", en: "Type a name. For a new food use Food, My foods: the council checks it first." }))}</p>`}</div>
    ${voce ? `<label class="campo"><span>${esc(L({ it: "Grammi", en: "Grams" }))}</span><input type="number" inputmode="decimal" min="1" max="2000" value="${esc(aggiungi.grammi)}" data-input="aggGrammi"></label>
      <label class="campo"><span>${esc(L({ it: "Pasto", en: "Meal" }))}</span><select data-cambia="aggPasto">${ORDINE_LOG.map((p) => `<option value="${p}" ${aggiungi.pasto === p ? "selected" : ""}>${esc(nomePasto(p))}</option>`).join("")}</select></label>
      <p class="piccolo">${val && val.completo ? esc(`${num(val.tot.kcal)} kcal · ${L({ it: "proteine", en: "protein" })} ${num(val.tot.prot, 1)} g`) : esc(t("infoMancante"))}</p>
      <button class="btn primario pieno" data-az="aggConferma">${I.spunta}${esc(L({ it: "Registra", en: "Log it" }))}</button>` : ""}`;
}

registra({
  apriAggiungiCibo: (d) => { aggiungi = { data: d.data || isoData(new Date()), q: "", scelto: null, grammi: 100, pasto: "altro" }; apriFoglio(foglioAggiungi); },
  aggCerca: (d, el) => { aggiungi.q = el.value; ridisegna(); const c = document.getElementById("cerca-agg"); if (c) { c.focus(); c.setSelectionRange(c.value.length, c.value.length); } },
  aggScegli: (d) => {
    aggiungi.scelto = d.id;
    const mio = (S().alimentiExtra || {})[d.id];
    if (mio && mio.porzioni && mio.porzioni[0]) aggiungi.grammi = mio.porzioni[0].q;
    ridisegna();
  },
  aggGrammi: (d, el) => { aggiungi.grammi = el.value; },
  aggPasto: (d, el) => { aggiungi.pasto = el.value; },
  aggConferma: () => {
    const q = Number(String(aggiungi.grammi).replace(",", "."));
    if (!aggiungi.scelto || !(q > 0)) return;
    registraNelDiario(aggiungi.data, aggiungi.pasto, [{ a: aggiungi.scelto, q, u: "g" }], "singolo");
    chiudiFoglio();
    toast(L({ it: "Registrato nel diario di oggi", en: "Logged in today's diary" }));
  },
  togliDalDiario: (d) => cambia((s) => {
    const g = s.diario[d.data];
    if (!g || !g.mangiato) return;
    if (d.pasto === "altro") { (g.mangiato.altro || []).splice(Number(d.i), 1); }
    else { delete g.mangiato[d.pasto]; if (g.pasti) g.pasti[d.pasto] = false; }
  }),
});
void ALIMENTI; void quantita;
