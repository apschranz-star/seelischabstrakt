/* Shared app context: actions, redraw, bottom sheet, toast, navigation. */
import { attivaGrafici, applicaStili, attivaColonne } from "./ui.js";

export const azioni = {};
export function registra(obj) { Object.assign(azioni, obj); }

let disegna = () => {};
export function impostaRender(f) { disegna = f; }
export function ridisegna() { disegna(); if (foglio.render) aggiornaFoglio(); }
export function vai(hash) { if (location.hash !== hash) location.hash = hash; else ridisegna(); }

/* ------------------------------------------------------------ sheet */
const foglio = { render: null, ultimoFocus: null };
export function apriFoglio(render) {
  const velo = document.getElementById("velo"), f = document.getElementById("foglio");
  foglio.render = typeof render === "function" ? render : () => render;
  foglio.ultimoFocus = document.activeElement;
  aggiornaFoglio();
  velo.hidden = false; f.hidden = false;
  requestAnimationFrame(() => { velo.classList.add("on"); f.classList.add("on"); f.focus(); });
}
function aggiornaFoglio() {
  const f = document.getElementById("foglio");
  const scroll = f.scrollTop;
  f.innerHTML = `<div class="maniglia" aria-hidden="true"></div>${foglio.render()}`;
  f.scrollTop = scroll;
  attivaGrafici(f);
  attivaColonne(f);
  applicaStili(f);
}
export function chiudiFoglio() {
  const velo = document.getElementById("velo"), f = document.getElementById("foglio");
  if (f.hidden) return;
  velo.classList.remove("on"); f.classList.remove("on");
  foglio.render = null;
  setTimeout(() => { velo.hidden = true; f.hidden = true; f.innerHTML = ""; }, 240);
  if (foglio.ultimoFocus && foglio.ultimoFocus.focus) foglio.ultimoFocus.focus();
}
export const foglioAperto = () => !!foglio.render;

/* ------------------------------------------------------------ toast */
let tId = null;
/* azione: { az, testo } adds one button (for example Undo) and keeps the toast up longer. */
export function toast(msg, azione = null) {
  const t = document.getElementById("toast");
  t.textContent = msg;
  if (azione) {
    const b = document.createElement("button");
    b.className = "toast-azione";
    b.dataset.az = azione.az;
    /* any other field travels as data (an id for the Undo) */
    for (const [k, v] of Object.entries(azione)) if (k !== "az" && k !== "testo" && v != null) b.dataset[k] = String(v);
    b.textContent = azione.testo;
    t.append(" ", b);
  }
  t.classList.add("on");
  clearTimeout(tId);
  tId = setTimeout(() => t.classList.remove("on"), azione ? 8000 : 2600);
}
