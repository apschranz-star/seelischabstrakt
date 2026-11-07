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
import { registra, toast } from "../ctx.js";
import { nome } from "../data/alimenti.js";
import { valoriVoci, giornata, grammi, OBIETTIVO_KCAL, PASTI, scelta as sceltaDi } from "../engine/nutrizione.js";
import { aggiungiGiorni } from "../engine/planner.js";

export const ORDINE_LOG = ["colazione", "spuntino", "pranzo", "cena", "dopocena", "altro"];
const NOMI_PASTO = { altro: { it: "Altro", en: "Other" } };
export const nomePasto = (p) => L(NOMI_PASTO[p] || PASTI[p].nome);
/* Italian agreement: la colazione, la cena; lo spuntino; il pranzo, il dopocena. */
const FEMMINILE = new Set(["colazione", "cena"]);
export const registratoIt = (p) => (FEMMINILE.has(p) ? "registrata" : "registrato");
/* past participle agreeing with the meal: concorda("cena", "tolt") = "tolta" */
export const concorda = (p, radice) => radice + (FEMMINILE.has(p) ? "a" : "o");
export const alPasto = (p) => L({ it: `${FEMMINILE.has(p) ? "alla" : p === "spuntino" ? "allo" : "al"} ${nomePasto(p).toLowerCase()}`, en: `to ${nomePasto(p).toLowerCase()}` });

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
const COPIA = ["con", "scelta", "testo", "nome", "nomeEn", "fonte", "codice", "marca", "gruppo", "stato", "stimaKcal", "p", "misura"];
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
/* Applies fn and keeps that one meal as it was (for "altro", the entry at
   index i), so the toast can undo it for a few seconds. Only that meal comes
   back: anything else logged meanwhile stays. */
export function cambiaConAnnulla(data, pasto, i, messaggio, fn) {
  const g = S().diario[data] || {};
  const m = g.mangiato || {};
  annulla = { data, pasto, i, voce: copia(pasto === "altro" ? (m.altro || [])[i] : m[pasto]) || null, spuntato: (g.pasti || {})[pasto] };
  cambia(fn);
  toast(messaggio, { az: "annullaDiario", testo: L({ it: "Annulla", en: "Undo" }) });
}

/* Returns true when it replaced her own entry (then an Undo toast is already showing). */
export function registraNelDiario(data, pasto, voci, fonte, nomeLibero = null) {
  const prima = pasto !== "altro" ? logDi(S(), data)[pasto] : null;
  if (voceSua(prima)) {
    cambiaConAnnulla(data, pasto, 0, L({ it: `${nomePasto(pasto)} ${concorda(pasto, "sostituit")}`, en: `${nomePasto(pasto)} replaced` }), (s) => scriviVoce(s, data, pasto, voci, fonte, nomeLibero));
    return true;
  }
  cambia((s) => scriviVoce(s, data, pasto, voci, fonte, nomeLibero));
  return false;
}
export function scriviVoce(s, data, pasto, voci, fonte, nomeLibero) {
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

/* --------------------------------------------------- what she ate today */
/* The entry just logged or corrected is highlighted once on the next render. */
let nuovo = null;
export function segnaNuovo(data, pasto) { nuovo = { data, pasto }; }

function righeLog(s, data, opz, log) {
  return ORDINE_LOG.filter((p) => log[p] && (p !== "altro" || log[p].length)).map((p) => {
    const elenco = p === "altro" ? log[p] : [log[p]];
    return elenco.map((e, i) => {
      const r = valoriVoci(e.voci, opz);
      const cibi = e.voci.filter((v) => v.u !== "q.b." && v.q != null).map((v) => {
        const g = grammi(v, opz.pesi).g;
        return `${nomeVoce(v, s)}${g != null ? " " + num(g) + " g" : ""}`;
      });
      const origine = FONTE_VOCE[e.fonte] ? L(FONTE_VOCE[e.fonte]) : "";
      const corretto = e.modificato ? " · " + L({ it: "corretto", en: "corrected" }) : "";
      const evid = nuovo && nuovo.data === data && nuovo.pasto === p && (p !== "altro" || i === elenco.length - 1);
      return `<div class="voce-log ${evid ? "appena" : ""}" ${evid ? 'id="log-appena"' : ""}>
        <div class="testo"><div class="riga tra"><strong>${I.spunta} ${esc(nomePasto(p))}</strong><span class="kcal">${r.completo ? "" : "≥ "}${esc(kcalTesto(r.tot.kcal))}</span></div>
          <div class="cibi">${esc(e.nome || cibi.join(", "))}</div>
          <div class="minimo">${esc(origine + corretto)}</div></div>
        <div class="azioni"><button class="btn piccolo" data-az="apriModificaLog" data-data="${data}" data-pasto="${p}" data-i="${i}">${esc(L({ it: "Modifica", en: "Edit" }))}</button>
          <button class="icon-btn mini" data-az="togliDalDiario" data-data="${data}" data-pasto="${p}" data-i="${i}" aria-label="${esc(L({ it: `Togli ${nomePasto(p)}`, en: `Remove ${nomePasto(p)}` }))}">${I.chiudi}</button></div>
      </div>`;
    }).join("");
  }).join("");
}

/* "Cosa hai mangiato oggi": every logged meal with its foods and grams, editable. */
export function cartaMangiato(s, data) {
  const opz = opzioniNutrizione(s);
  const log = logDi(s, data);
  const g = giornata(log, opz);
  const righe = righeLog(s, data, opz, log);
  const stime = g.stime.length ? `<p class="minimo">${esc(L({ it: "Stime usate", en: "Estimates used" }))}: ${esc(g.stime.join("; "))}.</p>` : "";
  const manca = g.mancanti.length ? `<p class="minimo">${esc(t("infoMancante"))}: ${esc([...new Set(g.mancanti)].map((a) => nomeVoce({ a }, s)).join(", "))} (${esc(L({ it: "non contati", en: "not counted" }))}).</p>` : "";
  const html = `<section class="card" aria-labelledby="mangiato-tit">
    <div class="riga tra"><h3 id="mangiato-tit">${esc(L({ it: "Cosa hai mangiato oggi", en: "What you ate today" }))}</h3><span class="minimo">${esc(kcalTesto(g.tot.kcal))}</span></div>
    ${righe ? `<div class="log">${righe}</div>` : `<p class="piccolo muted">${esc(L({ it: "Ancora niente. Tocca “Registra cibo” o la spunta di un pasto del piano.", en: "Nothing yet. Tap “Log food” or the tick of a planned meal." }))}</p>`}
    ${stime}${manca}
    <details class="storico-7"><summary class="piccolo">${esc(L({ it: "Ultimi 7 giorni", en: "Last 7 days" }))}</summary>${storico(s, data, opz)}</details>
  </section>`;
  if (nuovo && nuovo.data === data) setTimeout(() => { nuovo = null; }, 0);
  return html;
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

registra({
  togliDalDiario: (d) => cambiaConAnnulla(d.data, d.pasto, Number(d.i) || 0, L({ it: `${nomePasto(d.pasto)} ${concorda(d.pasto, "tolt")} dal diario`, en: `${nomePasto(d.pasto)} removed from the diary` }), (s) => {
    const g = s.diario[d.data];
    if (!g || !g.mangiato) return;
    if (d.pasto === "altro") { (g.mangiato.altro || []).splice(Number(d.i), 1); }
    else { delete g.mangiato[d.pasto]; if (g.pasti) g.pasti[d.pasto] = false; }
  }),
  annullaDiario: () => {
    if (!annulla) return;
    const { data, pasto, i, voce, spuntato } = annulla;
    annulla = null;
    cambia((s) => {
      const g = (s.diario[data] = s.diario[data] || {});
      g.mangiato = g.mangiato || {};
      if (pasto === "altro") {
        if (voce) { g.mangiato.altro = Array.isArray(g.mangiato.altro) ? g.mangiato.altro : []; g.mangiato.altro.splice(Math.min(i, g.mangiato.altro.length), 0, voce); }
        return;
      }
      if (voce) g.mangiato[pasto] = voce; else delete g.mangiato[pasto];
      g.pasti = g.pasti || {};
      if (spuntato === undefined) delete g.pasti[pasto]; else g.pasti[pasto] = spuntato;
    });
    toast(L({ it: "Ripristinato", en: "Restored" }));
  },
});
