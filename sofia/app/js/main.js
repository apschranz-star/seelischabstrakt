/*
 * Sofia: boot, router, automatic upkeep.
 *
 * Unattended by design: on every start the app makes sure the current week
 * (and from Saturday the next one) exists, saves after every change, resumes
 * unfinished imports, refreshes the daily recipes and updates itself when a
 * new version is published. Nothing needs a button press to stay current.
 */
import { carica, S, cambia, ascolta, chiediMemoriaPersistente, memoriaNonDisponibile } from "./store.js";
import { impostaLingua, t, L } from "./i18n.js";
import { I, LOGO, esc, attivaGrafici, applicaStili, attivaColonne } from "./ui.js";
import { animaArchi } from "./views/grafici.js";
import { azioni, impostaRender, ridisegna, chiudiFoglio, foglioAperto, toast } from "./ctx.js";
import { generaSettimana, isoData, lunediDi, aggiungiGiorni, vicine } from "./engine/planner.js";
import { nuovoSeme } from "./engine/rng.js";
import * as oggi from "./views/oggi.js";
import * as settimana from "./views/settimana.js";
import * as cibo from "./views/cibo.js";
import * as salute from "./views/salute.js";
import * as corpo from "./views/corpo.js";
import * as consiglio from "./views/consiglio.js";
import * as impostazioni from "./views/impostazioni.js";

const VISTE = { oggi, settimana, cibo, salute, corpo, consiglio, impostazioni };
const NAV = [["oggi", I.oggi], ["settimana", I.settimana], ["cibo", I.cibo], ["salute", I.salute], ["corpo", I.corpo]];

export function oggiIso() { return isoData(new Date()); }

/* Keep the plan running without anyone pressing "create". */
export function assicuraSettimane() {
  const s = S();
  const oggiD = oggiIso();
  const lun = lunediDi(oggiD);
  const daCreare = [lun];
  const dow = (new Date().getDay() + 6) % 7;
  if (dow >= 5) daCreare.push(aggiungiGiorni(lun, 7));
  let creata = false;
  for (const inizio of daCreare) {
    if (s.settimane.some((w) => w.inizio === inizio)) continue;
    const { storia, seguenti } = vicine(s.settimane, inizio);
    const w = generaSettimana({ seme: nuovoSeme(), inizio, storia, seguenti, pref: s.pref });
    if (w.errore) continue;
    w.creata = new Date().toISOString();
    w.automatica = true;
    cambia((st) => {
      st.settimane.push(w);
      st.settimane.sort((a, b) => (a.inizio < b.inizio ? -1 : 1));
      if (st.settimane.length > 8) st.settimane = st.settimane.slice(-8);
    });
    creata = true;
  }
  return creata;
}

function rotta() {
  const h = (location.hash || "#/oggi").replace(/^#\/?/, "");
  const [vista, ...resto] = h.split("/");
  return { vista: VISTE[vista] ? vista : "oggi", parti: resto.map(decodeURIComponent) };
}

function render() {
  const s = S();
  const r = rotta();
  const v = VISTE[r.vista];
  document.documentElement.dataset.tema = s.impostazioni.tema === "auto" ? "" : s.impostazioni.tema;
  const app = document.getElementById("app");
  const titolo = v.titolo ? v.titolo(s, r.parti) : t(r.vista);
  app.innerHTML = `
    <header class="top">
      ${LOGO}
      <div><h1>${esc(titolo)}</h1>${v.sottotitolo ? `<div class="sub">${v.sottotitolo(s, r.parti)}</div>` : ""}</div>
      <div class="spazio"></div>
      <a class="icon-btn ${r.vista === "consiglio" ? "attivo" : ""}" href="#/consiglio" aria-label="${esc(t("consiglio"))}">${I.consiglio}</a>
      <a class="icon-btn ${r.vista === "impostazioni" ? "attivo" : ""}" href="#/impostazioni" aria-label="${esc(t("impostazioni"))}">${I.impostazioni}</a>
    </header>
    ${memoriaNonDisponibile() ? `<div class="avviso terra">${I.avviso}<div>${esc(L({ it: "Questo browser non permette di salvare i dati (navigazione privata?). Quello che inserisci andrà perso alla chiusura.", en: "This browser does not allow saving data (private mode?). What you enter will be lost when you close it." }))}</div></div>` : ""}
    <main id="vista">${v.render(s, r.parti)}</main>`;
  document.getElementById("nav").innerHTML = `<ul>${NAV.map(([id, ico]) => `<li><a href="#/${id}" class="${r.vista === id ? "attivo" : ""}" ${r.vista === id ? 'aria-current="page"' : ""}>${ico}<span>${esc(t(id))}</span></a></li>`).join("")}</ul>`;
  attivaGrafici(app);
  attivaColonne(app);
  applicaStili(app);
  animaArchi(app);
  if (v.dopo) v.dopo(s, r.parti);
}

/* ------------------------------------------------------- delegation */
document.addEventListener("click", (e) => {
  const el = e.target.closest("[data-az]");
  if (el) {
    const f = azioni[el.dataset.az];
    if (f) { e.preventDefault(); f(el.dataset, el, e); }
    return;
  }
  if (e.target.id === "velo") chiudiFoglio();
});
document.addEventListener("change", (e) => {
  const el = e.target.closest("[data-cambia]");
  if (el && azioni[el.dataset.cambia]) azioni[el.dataset.cambia](el.dataset, el, e);
});
document.addEventListener("input", (e) => {
  const el = e.target.closest("[data-input]");
  if (el && azioni[el.dataset.input]) azioni[el.dataset.input](el.dataset, el, e);
});
document.addEventListener("submit", (e) => {
  const el = e.target.closest("form[data-invia]");
  if (el && azioni[el.dataset.invia]) { e.preventDefault(); azioni[el.dataset.invia](el.dataset, el, e); }
});
document.addEventListener("keydown", (e) => { if (e.key === "Escape" && foglioAperto()) chiudiFoglio(); });

/* -------------------------------------------------- service worker */
function registraSW() {
  if (!("serviceWorker" in navigator)) return;
  navigator.serviceWorker.register("./sw.js").then((reg) => {
    reg.update().catch(() => {});
    setInterval(() => reg.update().catch(() => {}), 6 * 3600 * 1000);
  }).catch(() => {});
  let ricaricato = false;
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    if (ricaricato) return;
    ricaricato = true;
    /* New version installed: reload quietly unless a form is open. */
    if (!foglioAperto() && !document.querySelector("form:focus-within")) location.reload();
  });
}

/* -------------------------------------------------------------- boot */
function avvia() {
  const s = carica();
  impostaLingua(s.impostazioni.lingua);
  impostaRender(render);
  ascolta(() => render());
  window.addEventListener("hashchange", () => { chiudiFoglio(); corpo.lascia(); window.scrollTo(0, 0); render(); });
  assicuraSettimane();
  render();
  registraSW();
  document.addEventListener("pointerdown", () => chiediMemoriaPersistente(), { once: true });
  /* A new day while the app stays open (phone left on the counter). */
  let giorno = oggiIso();
  setInterval(() => {
    if (oggiIso() !== giorno) { giorno = oggiIso(); assicuraSettimane(); ridisegna(); }
  }, 60 * 1000);
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden && oggiIso() !== giorno) { giorno = oggiIso(); assicuraSettimane(); ridisegna(); }
  });
  cibo.aggiornaRicetteWeb(false);
  void toast;
}

avvia();
