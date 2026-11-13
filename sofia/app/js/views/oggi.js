/* Oggi: how much she ate today (calorie ring and the plan's groups), what she
   ate, today's plan, suggestions to open, habits and how she feels. Recipes
   and ideas live on their own page (Cibo, Idee). */
import { S, cambia, cambiaSilenzioso } from "../store.js";
import { t, L } from "../i18n.js";
import { I, esc, dataLunga, maiuscola, num } from "../ui.js";
import { registra } from "../ctx.js";
import { rigaPasto, settimanaDi, esitoHtml, titoloPasto, ICO } from "./comuni.js";
import { consiglioSettimana } from "../engine/consiglio.js";
import { isoData, aggiungiGiorni, lunediDi, vicine } from "../engine/planner.js";
import { renaleFuoriRange } from "../engine/salute.js";
import { cartaMangiato, opzioniNutrizione, logDi, nomePasto } from "./diario.js";
import { vociPasto } from "../engine/planner.js";
import { trovaEsclusi } from "../engine/esclusi.js";
import { valoriVoci } from "../engine/nutrizione.js";
import { obiettiviDelGiorno, mangiatoDelGiorno, anelli, KCAL_GIORNO } from "../engine/giorno.js";
import { ciambellaKcal, anelliGruppi } from "./grafici.js";
import { pastoDellOra } from "./registra.js";

export const titolo = (s) => `${t("ciao")} ${s.profilo.nome || ""}`.trim();
export const sottotitolo = () => esc(maiuscola(dataLunga(isoData(new Date()))));

const CHECKIN = [
  ["energia", 1, 5], ["umore", 1, 5], ["sonno", 1, 5],
  ["dolori", 0, 10], ["intestino", 0, 10], ["pelle", 0, 10], ["nebbia", 0, 10],
];
const ETICHETTE_SCALA = {
  1: { it: "1 = pessimo, 5 = ottimo", en: "1 = very poor, 5 = great" },
  0: { it: "0 = niente, 10 = fortissimi", en: "0 = none, 10 = severe" },
};

export function render(s) {
  const oggi = isoData(new Date());
  const w = settimanaDi(s, oggi);
  const d = s.diario[oggi] || {};
  if (!w) return `<div class="card vuoto"><div class="grande">${esc(t("nessunaSettimana"))}</div><button class="btn primario" data-az="creaSettimana">${I.rimescola}${esc(t("creaSettimana"))}</button></div>`;
  const g = w.giorni.find((x) => x.data === oggi);
  const ordine = g.invertito ? ["colazione", "spuntino", "cena", "pranzo", "dopocena"] : ["colazione", "spuntino", "pranzo", "cena", "dopocena"];
  const { storia, seguenti } = vicine(s.settimane, w.inizio);
  const dec = consiglioSettimana(w, storia, { renaleFuoriRange: renaleFuoriRange(s, oggi), profilo: s.profilo, seguenti });
  const acqua = d.acqua || 0, caffe = d.caffe || 0, passi = d.passi || 0;
  const lun = lunediDi(oggi);
  let giorniCammino = 0;
  for (let i = 0; i < 7; i++) { const x = s.diario[aggiungiGiorni(lun, i)]; if (x && x.passi >= 30) giorniCammino++; }
  const fatti = Object.values(d.pasti || {}).filter(Boolean).length;
  const bozza = s.bozze && s.bozze.importa;

  const opz = opzioniNutrizione(s);
  const log = logDi(s, oggi);
  const ob = obiettiviDelGiorno(g, opz);
  const m = mangiatoDelGiorno(log, opz);

  return `
  ${bozza ? `<a class="avviso viola" href="#/salute/esami" data-s="s9ba0e">${I.documento}<div><strong>${esc(L({ it: "Importazione esami da completare", en: "Lab import to finish" }))}</strong><br>${esc(L({ it: `${bozza.valori.length} valori letti dal referto, in attesa di conferma.`, en: `${bozza.valori.length} values read from the report, waiting for confirmation.` }))}</div></a>` : ""}
  ${cartaOggi(oggi, ob, m)}
  ${cartaMangiato(s, oggi)}
  ${cartaSuggerimenti(s, oggi, g, ordine, ob, m, log, opz)}
  <section class="card">
    <div class="riga tra"><h3>${esc(t("pianoDiOggi"))}</h3><span class="minimo">${esc(L({ it: `${fatti} di ${ordine.filter((p) => g[p]).length} registrati`, en: `${fatti} of ${ordine.filter((p) => g[p]).length} logged` }))}</span></div>
    ${ordine.map((p) => rigaPasto(g, p)).join("")}
    <div class="riga wrap" data-s="sd6f2a"><button class="btn piccolo" data-az="apriComponi" data-data="${oggi}" data-pasto="pranzo">${I.piu}${esc(L({ it: "Componi un pasto", en: "Compose a meal" }))}</button></div>
  </section>
  ${(() => {
    const ex = new Set(s.pref.escludi || []);
    const conEsclusi = w.giorni.filter((x) => x.data >= oggi).some((x) => ordine.some((p) => x[p] && trovaEsclusi(vociPasto(x, p), ex).length));
    return conEsclusi ? `<div class="avviso terra">${I.avviso}<div>${esc(L({ it: "Da oggi ci sono pasti con ingredienti che hai tolto.", en: "From today there are meals with ingredients you removed." }))} <button class="btn-testo" data-az="rifaiDaOggi" data-inizio="${w.inizio}">${esc(L({ it: "Rifai i giorni da oggi", en: "Redo the days from today" }))}</button></div></div>` : "";
  })()}

  <a class="card consiglio riga tra" href="#/consiglio" data-s="sa6409">
    <div class="riga">${I.consiglio}<div><div class="piccolo muted">${esc(L({ it: "Il consiglio sulla settimana", en: "The council on this week" }))}</div>${esitoHtml(dec.esito)}</div></div>${I.freccia}
  </a>

  <h2 class="sez">${esc(L({ it: "Abitudini", en: "Habits" }))}</h2>
  <section class="card">
    <div class="tracker"><div class="ico">${I.goccia}</div><div class="info"><div class="valore">${esc(t("acqua"))}: ${num(acqua, 2)} L</div><div class="minimo">${esc(L({ it: "Obiettivo 2-3 litri, meglio acqua calcica", en: "Target 2-3 litres, calcium-rich water is best" }))}</div><div class="barra"><i data-w="${Math.min(100, (acqua / 3) * 100)}"></i></div></div>
      <div class="passi"><button class="passo-btn" data-az="traccia" data-k="acqua" data-d="-0.25" aria-label="-0,25 L">−</button><button class="passo-btn" data-az="traccia" data-k="acqua" data-d="0.25" aria-label="+0,25 L">+</button></div></div>
    <div class="tracker"><div class="ico">${I.tazza}</div><div class="info"><div class="valore">${esc(t("caffe"))}: ${caffe} ${caffe > 3 ? `<span class="etichetta male">${esc(L({ it: "oltre 3", en: "over 3" }))}</span>` : ""}</div><div class="minimo">${esc(L({ it: "Al massimo 3, senza zucchero", en: "At most 3, without sugar" }))}</div></div>
      <div class="passi"><button class="passo-btn" data-az="traccia" data-k="caffe" data-d="-1" aria-label="-1">−</button><button class="passo-btn" data-az="traccia" data-k="caffe" data-d="1" aria-label="+1">+</button></div></div>
    <div class="tracker"><div class="ico">${I.passi}</div><div class="info"><div class="valore">${esc(t("camminata"))}: ${passi} min</div><div class="minimo">${esc(L({ it: `Questa settimana ${giorniCammino} di 5 giorni da 30 minuti. Come ti senti con il lupus viene prima.`, en: `This week ${giorniCammino} of 5 days of 30 minutes. How you feel with lupus comes first.` }))}</div><div class="barra viola"><i data-w="${Math.min(100, (giorniCammino / 5) * 100)}"></i></div></div>
      <div class="passi"><button class="passo-btn" data-az="traccia" data-k="passi" data-d="-10" aria-label="-10 min">−</button><button class="passo-btn" data-az="traccia" data-k="passi" data-d="10" aria-label="+10 min">+</button></div></div>
  </section>

  <h2 class="sez">${esc(t("comeStai"))}</h2>
  <section class="card">
    ${CHECKIN.map(([k, lo, hi]) => {
      const v = d[k];
      return `<div class="slider-riga"><label for="ck-${k}">${esc(t(k))}<output id="out-${k}">${v == null ? "-" : v}</output></label>
        <input id="ck-${k}" type="range" min="${lo}" max="${hi}" step="1" value="${v == null ? Math.round((lo + hi) / 2) : v}" class="${v == null ? "vuoto-val" : ""}" data-input="checkin" data-k="${k}" data-cambia="checkinFine" aria-describedby="sc-${k}">
        <div class="minimo" id="sc-${k}">${esc(L(ETICHETTE_SCALA[lo]))}</div></div>`;
    }).join("")}
    <div class="interruttore"><span>${esc(t("glutineSospetto"))}</span><input type="checkbox" ${d.glutine ? "checked" : ""} data-cambia="glutine"></div>
    <label class="campo"><span>${esc(L({ it: "Nota del giorno", en: "Note of the day" }))}</span><textarea data-cambia="notaGiorno" placeholder="${esc(L({ it: "Sintomi, cosa hai mangiato fuori, come hai dormito...", en: "Symptoms, what you ate out, how you slept..." }))}">${esc(d.nota || "")}</textarea></label>
    <p class="minimo">${esc(t("privacy"))}</p>
  </section>

  `;
}

/* The hero: calories eaten (ring) and the plan's groups (five rings), one button to log food. */
function cartaOggi(oggi, ob, m) {
  const oltre = m.kcal > KCAL_GIORNO;
  return `<section class="card eroe" aria-labelledby="eroe-tit">
    <div class="riga tra"><h3 id="eroe-tit">${esc(L({ it: "Oggi", en: "Today" }))}</h3>${oltre ? `<span class="stato attenzione">${I.avviso}${esc(L({ it: "Oltre le 1400 kcal", en: "Over 1400 kcal" }))}</span>` : m.voci ? `<span class="stato ok">${I.ok}${esc(L({ it: "Nel piano", en: "Within the plan" }))}</span>` : ""}</div>
    <div class="eroe-grafici">${ciambellaKcal(m.kcal, KCAL_GIORNO)}${anelliGruppi(anelli(ob, m))}</div>
    <details class="come-calcola"><summary class="minimo">${esc(L({ it: "Da dove vengono gli obiettivi", en: "Where the targets come from" }))}</summary>
      <p class="minimo">${esc(L({ it: "Dal piano della nutrizionista: 1400 kcal al giorno; proteine, carboidrati e grassi come somma degli intervalli che il piano scrive per ogni pasto (l'anello si riempie a metà intervallo); verdure e frutta come i grammi dei pasti del piano di oggi. Le calorie mangiate vengono dal diario.", en: "From the nutritionist's plan: 1400 kcal a day; protein, carbohydrate and fat as the sum of the ranges the plan writes for each meal (the ring fills at the middle of the range); vegetables and fruit as the grams of today's planned meals. Calories eaten come from the diary." }))}${m.senzaGruppo ? " " + esc(L({ it: `${m.senzaGruppo} cibi confezionati senza gruppo non sono contati tra verdure e frutta.`, en: `${m.senzaGruppo} packaged foods without a group are not counted as vegetables or fruit.` })) : ""}</p></details>
    <button class="btn primario pieno grande" data-az="apriRegistra" data-data="${oggi}">${I.piu}${esc(L({ it: "Registra cibo", en: "Log food" }))}</button>
  </section>`;
}

/* Suggestions she can open: the next planned meal, what is still missing, ideas. */
function cartaSuggerimenti(s, oggi, g, ordine, ob, m, log, opz) {
  const voci = [];
  const ora = ordine.indexOf(pastoDellOra());
  const prossimo = ordine.find((p, i) => i >= Math.max(0, ora) && g[p] && !log[p]) || ordine.find((p) => g[p] && !log[p]);
  if (prossimo) {
    const kcal = Math.round(valoriVoci(vociPasto(g, prossimo), opz).tot.kcal);
    voci.push(`<button class="sugg" data-az="apriPasto" data-data="${oggi}" data-pasto="${prossimo}"><span class="ico">${ICO[prossimo]}</span><span><strong>${esc(L({ it: `Prossimo: ${nomePasto(prossimo).toLowerCase()}`, en: `Next: ${nomePasto(prossimo).toLowerCase()}` }))}</strong><br><span class="minimo">${esc(titoloPasto(g, prossimo))} · ≈ ${kcal} kcal</span></span>${I.freccia}</button>`);
  }
  const restaPasto = ordine.some((p) => g[p] && !log[p] && (p === "pranzo" || p === "cena"));
  const gapV = Math.round(ob.verdure - m.verdure), gapF = Math.round(ob.frutta - m.frutta);
  if (gapV >= 100) voci.push(`<button class="sugg" data-az="apriIdee" data-con="verdure"><span class="ico">${I.foglia || I.ok}</span><span><strong>${esc(L({ it: `Mancano ${gapV} g di verdure`, en: `${gapV} g of vegetables to go` }))}</strong><br><span class="minimo">${esc(restaPasto ? L({ it: "Idee con le verdure per il prossimo pasto", en: "Ideas with vegetables for the next meal" }) : L({ it: "Idee con le verdure", en: "Ideas with vegetables" }))}</span></span>${I.freccia}</button>`);
  if (gapF >= 50) voci.push(`<button class="sugg" data-az="apriIdee" data-con="frutta"><span class="ico">${I.spuntino}</span><span><strong>${esc(L({ it: `Mancano ${gapF} g di frutta`, en: `${gapF} g of fruit to go` }))}</strong><br><span class="minimo">${esc(L({ it: "Il piano la mette a colazione o nello spuntino", en: "The plan puts it at breakfast or in the snack" }))}</span></span>${I.freccia}</button>`);
  voci.push(`<button class="sugg" data-az="apriIdee"><span class="ico">${I.libro}</span><span><strong>${esc(L({ it: "Idee e ricette", en: "Ideas and recipes" }))}</strong><br><span class="minimo">${esc(L({ it: "Scegli gli ingredienti che hai voglia di mangiare: ti propongo le ricette", en: "Pick the ingredients you feel like eating: I suggest recipes" }))}</span></span>${I.freccia}</button>`);
  return `<section class="card" aria-labelledby="sugg-tit"><h3 id="sugg-tit">${esc(L({ it: "Suggerimenti", en: "Suggestions" }))}</h3><div class="sugg-lista">${voci.join("")}</div></section>`;
}

registra({
  traccia: (d) => cambia((s) => {
    const oggi = isoData(new Date());
    const g = (s.diario[oggi] = s.diario[oggi] || {});
    const passo = Number(d.d);
    const nuovo = Math.max(0, Math.round(((g[d.k] || 0) + passo) * 100) / 100);
    g[d.k] = d.k === "acqua" ? Math.min(6, nuovo) : nuovo;
  }),
  checkin: (d, el) => {
    const out = document.getElementById("out-" + d.k);
    if (out) out.textContent = el.value;
    el.classList.remove("vuoto-val");
    cambiaSilenzioso((s) => {
      const oggi = isoData(new Date());
      const g = (s.diario[oggi] = s.diario[oggi] || {});
      g[d.k] = Number(el.value);
    });
  },
  checkinFine: () => {},
  glutine: (d, el) => cambia((s) => {
    const oggi = isoData(new Date());
    const g = (s.diario[oggi] = s.diario[oggi] || {});
    g.glutine = el.checked;
  }),
  notaGiorno: (d, el) => cambiaSilenzioso((s) => {
    const oggi = isoData(new Date());
    const g = (s.diario[oggi] = s.diario[oggi] || {});
    g.nota = el.value.slice(0, 2000);
  }),
});
