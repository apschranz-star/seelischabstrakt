/*
 * Reading lab reports. Two steps:
 *   1. testoDaPdf(file): pdf.js, loaded only now, turns each page into lines
 *      (text items grouped by their vertical position). Nothing leaves the
 *      phone: the file is read in the browser.
 *   2. trovaValori(righe): for every line that names a marker, the first
 *      number after the name is the value, a unit of that marker after it is
 *      the unit, and "a - b", "(a-b)", "< b", "> a" is the lab's own range.
 * The result is a list of proposals. Sofia confirms every row before
 * anything is saved: reports differ too much for blind trust.
 * Scanned reports (photos inside a PDF) contain no text and give no rows.
 */
import { ESAMI } from "../data/esami.js";

const ALIAS = ESAMI.flatMap((e) => e.alias.map((a) => ({ id: e.id, a: a.toLowerCase() }))).sort((x, y) => y.a.length - x.a.length);
const NUM = String.raw`[<>≤≥]?\s*\d+(?:[.,]\d+)?`;

function numero(s) {
  if (s == null) return null;
  const pulito = String(s).replace(/[<>≤≥\s]/g, "").replace(",", ".");
  const n = Number(pulito);
  return Number.isFinite(n) ? n : null;
}

function cercaAlias(riga) {
  const r = riga.toLowerCase();
  for (const x of ALIAS) {
    const i = r.indexOf(x.a);
    if (i < 0) continue;
    const prima = r[i - 1], dopo = r[i + x.a.length];
    const bordoPrima = i === 0 || !/[a-z0-9àèéìòù]/.test(prima);
    const bordoDopo = dopo === undefined || !/[a-z0-9àèéìòù]/.test(dopo);
    if (bordoPrima && bordoDopo) return { id: x.id, fine: i + x.a.length };
  }
  return null;
}

export function analizzaRiga(riga) {
  const hit = cercaAlias(riga);
  if (!hit) return null;
  const e = ESAMI.find((x) => x.id === hit.id);
  const resto = riga.slice(hit.fine);
  /* The value starts after a space, colon, bracket or asterisk, never inside a word like "HbA1c". */
  const mVal = resto.match(new RegExp(String.raw`(?:^|[\s:=(\[*])(${NUM})(?![\d.,]*\d)`));
  if (!mVal) return null;
  const valore = numero(mVal[1]);
  const dopoValore = resto.slice(mVal.index + mVal[0].length);
  const compatto = dopoValore.toLowerCase().replace(/\s+/g, "");
  const candidate = e.unita.flatMap((u) => [u.u, ...(u.alias || [])].map((nomeU) => ({ u: u.u, n: nomeU.toLowerCase().replace(/\s+/g, "") }))).sort((x, y) => y.n.length - x.n.length);
  const trovata = candidate.find((c) => c.n && compatto.includes(c.n));
  const unita = trovata ? trovata.u : e.unita[0].u;
  let min = null, max = null;
  const intervallo = dopoValore.match(new RegExp(`(${NUM})\\s*(?:-|\u2013|÷|a|to|bis)\\s*(${NUM})`));
  if (intervallo) { min = numero(intervallo[1]); max = numero(intervallo[2]); }
  else {
    const minore = dopoValore.match(new RegExp(`(?:<|≤|fino a|inferiore a|bis)\\s*(${NUM})`, "i"));
    const maggiore = dopoValore.match(new RegExp(`(?:>|≥|superiore a|maggiore di|ab)\\s*(${NUM})`, "i"));
    if (minore) max = numero(minore[1]);
    if (maggiore) min = numero(maggiore[1]);
  }
  if (min != null && max != null && min > max) [min, max] = [max, min];
  return { id: e.id, valore, unita, min, max, riga: riga.trim().slice(0, 160) };
}

const DATA_RE = /(?:prelievo|accettazione|data|referto|datum|date)[^\d]{0,24}(\d{1,2})[./-](\d{1,2})[./-](\d{2,4})/i;
export function trovaData(righe) {
  for (const r of righe) {
    const m = r.match(DATA_RE);
    if (m) {
      const y = m[3].length === 2 ? 2000 + Number(m[3]) : Number(m[3]);
      const mm = String(m[2]).padStart(2, "0"), dd = String(m[1]).padStart(2, "0");
      if (Number(mm) >= 1 && Number(mm) <= 12 && Number(dd) >= 1 && Number(dd) <= 31) return `${y}-${mm}-${dd}`;
    }
  }
  return null;
}

export function trovaValori(righe) {
  const visti = new Set();
  const out = [];
  for (const r of righe) {
    const x = analizzaRiga(r);
    if (x && !visti.has(x.id)) { visti.add(x.id); out.push(x); }
  }
  return { data: trovaData(righe), valori: out };
}

export async function testoDaPdf(file) {
  const pdfjs = await import("../../vendor/pdf.min.mjs");
  pdfjs.GlobalWorkerOptions.workerSrc = new URL("../../vendor/pdf.worker.min.mjs", import.meta.url).href;
  const doc = await pdfjs.getDocument({ data: new Uint8Array(await file.arrayBuffer()), isEvalSupported: false, disableFontFace: true }).promise;
  const righe = [];
  for (let p = 1; p <= Math.min(doc.numPages, 20); p++) {
    const pagina = await doc.getPage(p);
    const tc = await pagina.getTextContent();
    const gruppi = [];
    for (const it of tc.items) {
      if (!it.str || !it.str.trim()) continue;
      const y = it.transform[5], x = it.transform[4];
      let g = gruppi.find((k) => Math.abs(k.y - y) < 3);
      if (!g) { g = { y, parti: [] }; gruppi.push(g); }
      g.parti.push({ x, s: it.str });
    }
    gruppi.sort((a, b) => b.y - a.y);
    for (const g of gruppi) righe.push(g.parti.sort((a, b) => a.x - b.x).map((p) => p.s).join(" ").replace(/\s+/g, " "));
  }
  return righe;
}
