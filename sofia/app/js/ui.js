/* Small UI toolkit: escaping, icons, number and date formats, the line chart. */
import { lingua, L } from "./i18n.js";

export function esc(s) {
  return String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}
export const attr = (o) => esc(JSON.stringify(o));

/* ------------------------------------------------------------- icons */
const S = (d, extra = "") => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ${extra}>${d}</svg>`;
export const I = {
  oggi: S('<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>'),
  settimana: S('<rect x="3" y="4.5" width="18" height="16" rx="3"/><path d="M3 9.5h18M8 2.5v4M16 2.5v4"/>'),
  cibo: S('<path d="M5 12a7 7 0 0 0 14 0z"/><path d="M3 12h18M12 5c0-1.5 1-2.5 2.5-3M9 7c-.5-1.2 0-2.6 1.2-3.2"/>'),
  salute: S('<path d="M3 12h4l2-5 4 10 2-5h6"/>'),
  corpo: S('<circle cx="12" cy="4.5" r="2"/><path d="M12 7v7M8 9.5l4-1 4 1M9.5 21l2.5-7 2.5 7"/>'),
  consiglio: S('<path d="M12 3l7.5 3v5.5c0 4.5-3.2 8.2-7.5 9.5-4.3-1.3-7.5-5-7.5-9.5V6z"/><path d="M8.5 12l2.5 2.5 4.5-5"/>'),
  impostazioni: S('<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-1.8-.3 1.6 1.6 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.6 1.6 0 0 0-1-1.5 1.6 1.6 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.6 1.6 0 0 0 .3-1.8 1.6 1.6 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.6 1.6 0 0 0 1.5-1 1.6 1.6 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.6 1.6 0 0 0 1.8.3H9a1.6 1.6 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.6 1.6 0 0 0 1 1.5 1.6 1.6 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0-.3 1.8V9a1.6 1.6 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.6 1.6 0 0 0-1.5 1z"/>'),
  rimescola: S('<path d="M16 3h5v5M4 20L21 3M21 16v5h-5M15 15l6 6M4 4l5 5"/>'),
  spunta: S('<path d="M5 12.5l4.5 4.5L19 7.5"/>'),
  piu: S('<path d="M12 5v14M5 12h14"/>'),
  meno: S('<path d="M5 12h14"/>'),
  chiudi: S('<path d="M6 6l12 12M18 6L6 18"/>'),
  freccia: S('<path d="M9 6l6 6-6 6"/>'),
  indietro: S('<path d="M15 6l-6 6 6 6"/>'),
  goccia: S('<path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z"/>'),
  tazza: S('<path d="M4 8h13v5a6 6 0 0 1-6 6h-1a6 6 0 0 1-6-6z"/><path d="M17 10h1.5a2.5 2.5 0 0 1 0 5H17M8 2.5c0 1.5 1 1.5 1 3M12 2.5c0 1.5 1 1.5 1 3"/>'),
  passi: S('<path d="M8 3c1.7 0 2.5 2 2.5 4.5S9.5 12 8 12 5.5 10 5.5 7.5 6.3 3 8 3zM16 9c1.7 0 2.5 2 2.5 4.5S17.5 18 16 18s-2.5-2-2.5-4.5S14.3 9 16 9zM6.5 14.5h3v3a1.5 1.5 0 0 1-3 0zM14.5 20.5h3"/>'),
  cuore: S('<path d="M12 20s-7.5-4.6-7.5-10A4.3 4.3 0 0 1 12 7.4 4.3 4.3 0 0 1 19.5 10c0 5.4-7.5 10-7.5 10z"/>'),
  cuorePieno: S('<path d="M12 20s-7.5-4.6-7.5-10A4.3 4.3 0 0 1 12 7.4 4.3 4.3 0 0 1 19.5 10c0 5.4-7.5 10-7.5 10z" fill="currentColor"/>'),
  link: S('<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>'),
  info: S('<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 7.5v.5"/>'),
  avviso: S('<path d="M12 3l9.5 17h-19z"/><path d="M12 10v4M12 17v.5"/>'),
  ok: S('<circle cx="12" cy="12" r="9"/><path d="M8 12.5l2.7 2.7L16 10"/>'),
  no: S('<circle cx="12" cy="12" r="9"/><path d="M9 9l6 6M15 9l-6 6"/>'),
  nd: S('<circle cx="12" cy="12" r="9"/><path d="M8 12h8"/>'),
  colazione: S('<path d="M4 10h13v3a6 6 0 0 1-6 6h-1a6 6 0 0 1-6-6zM17 11h1.5a2.5 2.5 0 0 1 0 5H17"/><path d="M8 3.5c.8.8.8 2 0 3M12 3.5c.8.8.8 2 0 3"/>'),
  spuntino: S('<path d="M12 8c-3-2.5-7-1-7 3.5S8.5 21 12 19.5C15.5 21 19 16 19 11.5S15 5.5 12 8z"/><path d="M12 8c0-2 1-3.5 2.5-4.5"/>'),
  pranzo: S('<circle cx="12" cy="12" r="7.5"/><path d="M12 8v4l2.5 2"/>'),
  cena: S('<path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5z"/>'),
  dopocena: S('<path d="M12 3l1.8 4.6L18.5 8l-3.7 3 1.2 4.8L12 13.2 8 15.8 9.2 11 5.5 8l4.7-.4z"/>'),
  scudo: S('<path d="M12 3l7.5 3v5.5c0 4.5-3.2 8.2-7.5 9.5-4.3-1.3-7.5-5-7.5-9.5V6z"/>'),
  play: S('<path d="M7 4.5v15l12-7.5z" fill="currentColor" stroke="none"/>'),
  pausa: S('<path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" fill="currentColor" stroke="none"/>'),
  carrello: S('<path d="M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.5L21 8H6.2"/><circle cx="10" cy="20" r="1.3"/><circle cx="17" cy="20" r="1.3"/>'),
  documento: S('<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4M9 12h6M9 16h6"/>'),
  lucchetto: S('<rect x="5" y="10.5" width="14" height="10" rx="2.5"/><path d="M8 10.5V7.5a4 4 0 0 1 8 0v3"/>'),
  scambio: S('<path d="M4 8h14l-3.5-3.5M20 16H6l3.5 3.5"/>'),
  orologio: S('<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>'),
  libro: S('<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5zM4 20.5A2.5 2.5 0 0 0 6.5 23H20"/>'),
  globo: S('<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.7 3.8 5.7 3.8 9s-1.3 6.3-3.8 9c-2.5-2.7-3.8-5.7-3.8-9S9.5 5.7 12 3z"/>'),
  cervello: S('<path d="M9.5 4.5A3 3 0 0 0 4.7 7a3 3 0 0 0-.7 5.4 3.2 3.2 0 0 0 2.5 5.1A3 3 0 0 0 12 19V5.5a2.5 2.5 0 0 0-2.5-1zM14.5 4.5A3 3 0 0 1 19.3 7a3 3 0 0 1 .7 5.4 3.2 3.2 0 0 1-2.5 5.1A3 3 0 0 1 12 19"/>'),
};

/* The butterfly: two olive leaves above, two plum petals below. Lupus is
   symbolised by a butterfly; the leaves are the Mediterranean plan. */
export const LOGO = `<svg class="logo" viewBox="0 0 64 64" aria-hidden="true">
  <path d="M31 30C27 16 14 8 7 12s2 18 24 18z" fill="#6f8a3a"/>
  <path d="M33 30C37 16 50 8 57 12s-2 18-24 18z" fill="#55642f"/>
  <path d="M31 33C20 34 11 42 14 50s14 2 17-17z" fill="#8a6bb5"/>
  <path d="M33 33c11 1 20 9 17 17s-14 2-17-17z" fill="#6b4c93"/>
  <path d="M32 24v26" stroke="#2a221c" stroke-width="2.2" stroke-linecap="round"/>
  <path d="M32 24c-1-4-3-6-6-7M32 24c1-4 3-6 6-7" stroke="#2a221c" stroke-width="1.6" fill="none" stroke-linecap="round"/>
</svg>`;

/* ----------------------------------------------------------- formats */
export function num(n, dec = 0) {
  if (n == null || Number.isNaN(n)) return "-";
  return new Intl.NumberFormat(lingua() === "en" ? "en-GB" : "it-IT", { minimumFractionDigits: dec, maximumFractionDigits: dec }).format(n);
}
export function numAuto(n) {
  if (n == null || Number.isNaN(n)) return "-";
  const a = Math.abs(n);
  return num(n, a >= 100 ? 0 : a >= 10 ? 1 : a >= 1 ? 2 : 3);
}
export function dataLunga(iso) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Intl.DateTimeFormat(lingua() === "en" ? "en-GB" : "it-IT", { weekday: "long", day: "numeric", month: "long" }).format(new Date(y, m - 1, d, 12));
}
export function dataBreve(iso) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Intl.DateTimeFormat(lingua() === "en" ? "en-GB" : "it-IT", { day: "numeric", month: "short" }).format(new Date(y, m - 1, d, 12));
}
export function dataConAnno(iso) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Intl.DateTimeFormat(lingua() === "en" ? "en-GB" : "it-IT", { day: "numeric", month: "short", year: "numeric" }).format(new Date(y, m - 1, d, 12));
}
export function giornoSett(iso, lunga = false) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Intl.DateTimeFormat(lingua() === "en" ? "en-GB" : "it-IT", { weekday: lunga ? "long" : "short" }).format(new Date(y, m - 1, d, 12));
}
export const maiuscola = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);

export function quantita(v) {
  const en = lingua() === "en";
  if (v.q == null || v.u === "q.b.") return en ? "to taste" : "q.b.";
  const q = Array.isArray(v.q) ? `${v.q[0]}-${v.q[1]}` : num(v.q, v.q % 1 ? 1 : 0);
  if (v.u === "g" || v.u === "ml") return `${q} ${v.u}`;
  if (v.u === "pz") return en ? `${q} pcs` : `${q} pz`;
  if (v.u === "vasetto") return en ? `${q} pot` : `${q} vasetto`;
  if (v.u === "cucchiaino") return en ? `${q} tsp` : `${q} cucchiaino`;
  return `${q} ${v.u}`;
}

/* ------------------------------------------------------- line chart */
/*
 * One series over time, a lab reference band, an optional trend line.
 * Spec (dataviz skill): 2px line, 8px markers with a 2px surface ring,
 * hairline grid, one y axis, crosshair + tooltip, table view, no legend for
 * a single series (the card title names it). Out-of-range points also get
 * their own status in the table, never colour alone.
 */
function tacche(min, max, n = 4) {
  if (min === max) { min -= 1; max += 1; }
  const passoGrezzo = (max - min) / n;
  const p10 = Math.pow(10, Math.floor(Math.log10(passoGrezzo)));
  const passo = [1, 2, 2.5, 5, 10].map((m) => m * p10).find((s) => s >= passoGrezzo) || 10 * p10;
  const lo = Math.floor(min / passo) * passo, hi = Math.ceil(max / passo) * passo;
  const out = [];
  for (let v = lo; v <= hi + passo / 2; v += passo) out.push(Number(v.toFixed(10)));
  return out;
}

export function graficoLinea({ punti, banda = null, tendenza = null, unita = "", decimali = 1, altezza = 190, etichettaBanda = "" }) {
  if (!punti || !punti.length) return "";
  const W = 340, H = altezza, ml = 38, mr = 44, mt = 12, mb = 24;
  const giorno = (iso) => Date.UTC(...iso.split("-").map((x, i) => Number(x) - (i === 1 ? 1 : 0))) / 86400000;
  const xs = punti.map((p) => giorno(p.x));
  let x0 = Math.min(...xs), x1 = Math.max(...xs);
  if (x0 === x1) { x0 -= 3; x1 += 3; }
  const valori = punti.map((p) => p.y).concat(banda ? banda.filter((b) => b != null) : []).concat(tendenza ? tendenza.map((p) => p.y) : []);
  const ticks = tacche(Math.min(...valori), Math.max(...valori));
  const y0 = ticks[0], y1 = ticks[ticks.length - 1];
  const sx = (d) => ml + ((d - x0) / (x1 - x0)) * (W - ml - mr);
  const sy = (v) => mt + (1 - (v - y0) / (y1 - y0)) * (H - mt - mb);
  const pts = punti.map((p, i) => ({ ...p, px: sx(xs[i]), py: sy(p.y) }));
  let svg = `<svg viewBox="0 0 ${W} ${H}" role="img" tabindex="0" aria-label="${esc(L({ it: "Grafico", en: "Chart" }))}">`;
  svg += `<g class="griglia">${ticks.map((t) => `<line x1="${ml}" x2="${W - mr}" y1="${sy(t).toFixed(1)}" y2="${sy(t).toFixed(1)}"/>`).join("")}</g>`;
  if (banda && (banda[0] != null || banda[1] != null)) {
    const lo = banda[0] != null ? Math.max(banda[0], y0) : y0, hi = banda[1] != null ? Math.min(banda[1], y1) : y1;
    if (hi > lo) {
      svg += `<rect class="banda" x="${ml}" width="${W - ml - mr}" y="${sy(hi).toFixed(1)}" height="${(sy(lo) - sy(hi)).toFixed(1)}" rx="3"/>`;
      if (etichettaBanda) svg += `<text class="banda-lab" x="${ml + 6}" y="${(sy(hi) + 12).toFixed(1)}">${esc(etichettaBanda)}</text>`;
    }
  }
  svg += `<g class="asse">${ticks.map((t) => `<text x="${ml - 6}" y="${(sy(t) + 3.5).toFixed(1)}" text-anchor="end">${esc(num(t, Math.abs(y1 - y0) < 5 ? 1 : 0))}</text>`).join("")}`;
  const primo = punti[0].x, ultimo = punti[punti.length - 1].x;
  svg += `<text x="${pts[0].px.toFixed(1)}" y="${H - 6}" text-anchor="start">${esc(dataBreve(primo))}</text>`;
  if (punti.length > 1) svg += `<text x="${pts[pts.length - 1].px.toFixed(1)}" y="${H - 6}" text-anchor="end">${esc(dataBreve(ultimo))}</text>`;
  svg += `</g>`;
  if (pts.length > 1) {
    const d = pts.map((p, i) => `${i ? "L" : "M"}${p.px.toFixed(1)},${p.py.toFixed(1)}`).join("");
    svg += `<path class="area" d="${d}L${pts[pts.length - 1].px.toFixed(1)},${(H - mb).toFixed(1)}L${pts[0].px.toFixed(1)},${(H - mb).toFixed(1)}Z"/>`;
    svg += `<path class="linea" d="${d}"/>`;
  }
  if (tendenza && tendenza.length > 1) {
    const d = tendenza.map((p, i) => `${i ? "L" : "M"}${sx(giorno(p.x)).toFixed(1)},${sy(p.y).toFixed(1)}`).join("");
    svg += `<path class="tendenza" d="${d}"/>`;
  }
  const mostraPunti = pts.length <= 40;
  if (mostraPunti) svg += pts.map((p) => `<circle class="punto${p.fuori ? " fuori" : ""}" cx="${p.px.toFixed(1)}" cy="${p.py.toFixed(1)}" r="4.5"/>`).join("");
  else svg += `<circle class="punto${pts[pts.length - 1].fuori ? " fuori" : ""}" cx="${pts[pts.length - 1].px.toFixed(1)}" cy="${pts[pts.length - 1].py.toFixed(1)}" r="4.5"/>`;
  const fine = pts[pts.length - 1];
  svg += `<text class="etichetta-fine" x="${(fine.px + 8).toFixed(1)}" y="${(fine.py + 4).toFixed(1)}">${esc(num(fine.y, decimali))}</text>`;
  svg += `<line class="croce" x1="0" x2="0" y1="${mt}" y2="${H - mb}" visibility="hidden"/></svg>`;
  const dati = pts.map((p) => ({ x: p.x, y: p.y, px: p.px, fuori: !!p.fuori }));
  return `<div class="grafico" data-grafico="${attr({ dati, unita, decimali, W })}">${svg}<div class="tooltip" role="status"></div></div>`;
}

/* Crosshair and tooltip for every chart in a container: pointer and keyboard. */
export function attivaGrafici(root) {
  for (const g of root.querySelectorAll(".grafico[data-grafico]")) {
    if (g._attivo) continue;
    g._attivo = true;
    const cfg = JSON.parse(g.dataset.grafico);
    const svg = g.querySelector("svg"), tip = g.querySelector(".tooltip"), croce = g.querySelector(".croce");
    let idx = cfg.dati.length - 1;
    const mostra = (i) => {
      idx = Math.max(0, Math.min(cfg.dati.length - 1, i));
      const p = cfg.dati[idx];
      croce.setAttribute("x1", p.px); croce.setAttribute("x2", p.px); croce.setAttribute("visibility", "visible");
      const r = svg.getBoundingClientRect();
      tip.style.left = (p.px / cfg.W) * r.width + "px";
      tip.style.top = "8px";
      tip.textContent = "";
      const forte = document.createElement("strong");
      forte.textContent = `${num(p.y, cfg.decimali)} ${cfg.unita}`;
      tip.appendChild(forte);
      tip.appendChild(document.createTextNode(`  ${dataConAnno(p.x)}${p.fuori ? (lingua() === "en" ? " - outside lab range" : " - fuori intervallo") : ""}`));
      tip.classList.add("on");
    };
    const nascondi = () => { tip.classList.remove("on"); croce.setAttribute("visibility", "hidden"); };
    svg.addEventListener("pointermove", (e) => {
      const r = svg.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width) * cfg.W;
      let best = 0, d = Infinity;
      cfg.dati.forEach((p, i) => { const dd = Math.abs(p.px - x); if (dd < d) { d = dd; best = i; } });
      mostra(best);
    });
    svg.addEventListener("pointerleave", nascondi);
    svg.addEventListener("focus", () => mostra(idx));
    svg.addEventListener("blur", nascondi);
    svg.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") { mostra(idx - 1); e.preventDefault(); }
      if (e.key === "ArrowRight") { mostra(idx + 1); e.preventDefault(); }
    });
  }
}

/* Simple tile (dataviz "stat tile" contract): label, value, optional delta. */
export function tile(etichetta, valore, unita = "", delta = "") {
  return `<div class="tile"><div class="lab">${esc(etichetta)}</div><div class="val">${esc(valore)}${unita ? `<small>${esc(unita)}</small>` : ""}</div>${delta ? `<div class="del">${delta}</div>` : ""}</div>`;
}

export function statoHtml(s) {
  const m = {
    ok: [I.ok, L({ it: "Nell'intervallo", en: "In range" })],
    attenzione: [I.avviso, L({ it: "Vicino al limite", en: "Near the limit" })],
    male: [I.no, L({ it: "Fuori intervallo", en: "Out of range" })],
    nd: [I.nd, L({ it: "Nessun intervallo", en: "No range" })],
  }[s] || [I.nd, "-"];
  return `<span class="stato ${s}">${m[0]}${esc(m[1])}</span>`;
}
