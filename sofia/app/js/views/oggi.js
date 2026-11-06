/* Oggi: today's plan, water, coffee, walking, how she feels, a recipe for today. */
import { S, cambia, cambiaSilenzioso } from "../store.js";
import { t, L } from "../i18n.js";
import { I, esc, dataLunga, maiuscola, num } from "../ui.js";
import { registra } from "../ctx.js";
import { rigaPasto, settimanaDi, cartaRicetta, ricettePerPasto, esitoHtml } from "./comuni.js";
import { consiglioSettimana } from "../engine/consiglio.js";
import { RICETTE } from "../data/ricette.js";
import { rng, hash } from "../engine/rng.js";
import { isoData, aggiungiGiorni, lunediDi } from "../engine/planner.js";
import { renaleFuoriRange } from "../engine/salute.js";

export const titolo = (s) => `${t("ciao")} ${s.profilo.nome || ""}`.trim();
export const sottotitolo = () => esc(maiuscola(dataLunga(isoData(new Date()))));

const CHECKIN = [
  ["energia", 1, 5], ["umore", 1, 5], ["sonno", 1, 5],
  ["dolori", 0, 10], ["intestino", 0, 10], ["pelle", 0, 10], ["nebbia", 0, 10],
];
const ETICHETTE_SCALA = {
  1: { it: "1 = molto bassa, 5 = ottima", en: "1 = very low, 5 = great" },
  0: { it: "0 = niente, 10 = fortissimi", en: "0 = none, 10 = severe" },
};

export function render(s) {
  const oggi = isoData(new Date());
  const w = settimanaDi(s, oggi);
  const d = s.diario[oggi] || {};
  if (!w) return `<div class="card vuoto"><div class="grande">${esc(t("nessunaSettimana"))}</div><button class="btn primario" data-az="creaSettimana">${I.rimescola}${esc(t("creaSettimana"))}</button></div>`;
  const g = w.giorni.find((x) => x.data === oggi);
  const ordine = g.invertito ? ["colazione", "spuntino", "cena", "pranzo", "dopocena"] : ["colazione", "spuntino", "pranzo", "cena", "dopocena"];
  const storia = s.settimane.filter((x) => x.inizio < w.inizio).slice(-2);
  const dec = consiglioSettimana(w, storia, { renaleFuoriRange: renaleFuoriRange(s, oggi) });
  const acqua = d.acqua || 0, caffe = d.caffe || 0, passi = d.passi || 0;
  const lun = lunediDi(oggi);
  let giorniCammino = 0;
  for (let i = 0; i < 7; i++) { const x = s.diario[aggiungiGiorni(lun, i)]; if (x && x.passi >= 30) giorniCammino++; }
  const fatti = Object.values(d.pasti || {}).filter(Boolean).length;
  const bozza = s.bozze && s.bozze.importa;

  /* Today's suggestion: the recipe for today's lunch or dinner, otherwise a daily pick. */
  const R = rng(hash(oggi));
  const proposte = [...ricettePerPasto(g, "pranzo").slice(0, 1), ...ricettePerPasto(g, "cena").slice(0, 1)];
  if (!proposte.length) proposte.push(R.pick(RICETTE.filter((r) => r.pasto === "pranzo" || r.pasto === "cena")));
  const web = (s.webCache && s.webCache.libreria && s.webCache.libreria.ricette || []).filter((r) => r.aggiunta && r.aggiunta >= aggiungiGiorni(oggi, -7)).slice(0, 1);

  return `
  ${bozza ? `<a class="avviso viola" href="#/salute/esami" data-s="s9ba0e">${I.documento}<div><strong>${esc(L({ it: "Importazione esami da completare", en: "Lab import to finish" }))}</strong><br>${esc(L({ it: `${bozza.valori.length} valori letti dal referto, in attesa di conferma.`, en: `${bozza.valori.length} values read from the report, waiting for confirmation.` }))}</div></a>` : ""}
  <section class="card">
    <div class="riga tra"><h3>${esc(t("pianoDiOggi"))}</h3><span class="minimo">${fatti}/${ordine.filter((p) => g[p]).length}</span></div>
    ${ordine.map((p) => rigaPasto(g, p)).join("")}
  </section>

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

  <h2 class="sez">${esc(L({ it: "Oggi per te", en: "For you today" }))}</h2>
  ${proposte.map((r) => cartaRicetta(r)).join("")}
  ${web.map((r) => `<a class="card piatta ricetta-card" href="#/cibo/web" data-s="s80d65"><div class="tit">${esc(r.titolo)}</div><div class="meta"><span class="etichetta">${I.globo}${esc(r.fonte)}</span>${esitoHtml(r.esito)}</div></a>`).join("")}
  `;
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
