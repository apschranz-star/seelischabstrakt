/*
 * Statistics on Sofia's own numbers. Plain, checkable methods only:
 * mean, median, standard deviation, least-squares trend with a 95% confidence
 * interval (Student t), Pearson and Spearman correlation with Cohen's labels,
 * reference change value from biological variation, eGFR (CKD-EPI 2021) and
 * BMI. Every function says "not enough data" rather than guess: the
 * thresholds (n >= 3 for a trend, n >= 14 paired days for a correlation)
 * follow the same rules Anker uses in this repository.
 */

export const media = (a) => (a.length ? a.reduce((s, x) => s + x, 0) / a.length : null);
export function mediana(a) {
  if (!a.length) return null;
  const b = [...a].sort((x, y) => x - y), m = b.length >> 1;
  return b.length % 2 ? b[m] : (b[m - 1] + b[m]) / 2;
}
export function ds(a) {
  if (a.length < 2) return null;
  const m = media(a);
  return Math.sqrt(a.reduce((s, x) => s + (x - m) ** 2, 0) / (a.length - 1));
}

/* Two-sided 97.5% quantile of Student's t for df degrees of freedom. */
const T975 = [12.706, 4.303, 3.182, 2.776, 2.571, 2.447, 2.365, 2.306, 2.262, 2.228, 2.201, 2.179, 2.16, 2.145, 2.131, 2.12, 2.11, 2.101, 2.093, 2.086, 2.08, 2.074, 2.069, 2.064, 2.06, 2.056, 2.052, 2.048, 2.045, 2.042];
export function tCritico(df) {
  if (df < 1) return Infinity;
  if (df <= 30) return T975[df - 1];
  if (df <= 40) return 2.042 + ((2.021 - 2.042) * (df - 30)) / 10;
  if (df <= 60) return 2.021 + ((2.0 - 2.021) * (df - 40)) / 20;
  if (df <= 120) return 2.0 + ((1.98 - 2.0) * (df - 60)) / 60;
  return 1.96;
}

export function giorniDa(iso, base) {
  const a = Date.UTC(...iso.split("-").map((x, i) => Number(x) - (i === 1 ? 1 : 0)));
  const b = Date.UTC(...base.split("-").map((x, i) => Number(x) - (i === 1 ? 1 : 0)));
  return Math.round((a - b) / 86400000);
}

/* Least squares y = a + b t, t in days. */
export function regressione(punti) {
  const n = punti.length;
  if (n < 3) return { n, insufficiente: true };
  const ts = punti.map((p) => p.t), ys = punti.map((p) => p.y);
  const mt = media(ts), my = media(ys);
  let sxx = 0, sxy = 0, syy = 0;
  for (let i = 0; i < n; i++) { sxx += (ts[i] - mt) ** 2; sxy += (ts[i] - mt) * (ys[i] - my); syy += (ys[i] - my) ** 2; }
  if (sxx === 0) return { n, insufficiente: true };
  const b = sxy / sxx, a = my - b * mt;
  const res = ys.reduce((s, y, i) => s + (y - (a + b * ts[i])) ** 2, 0);
  const se = Math.sqrt(res / (n - 2) / sxx);
  const tc = tCritico(n - 2);
  const r2 = syy === 0 ? 1 : 1 - res / syy;
  return { n, a, b, se, ic95: [b - tc * se, b + tc * se], r2, giorni: Math.max(...ts) - Math.min(...ts) };
}

export function pearson(xs, ys) {
  const n = xs.length;
  if (n < 3) return null;
  const mx = media(xs), my = media(ys);
  let num = 0, dx = 0, dy = 0;
  for (let i = 0; i < n; i++) { num += (xs[i] - mx) * (ys[i] - my); dx += (xs[i] - mx) ** 2; dy += (ys[i] - my) ** 2; }
  if (!dx || !dy) return null;
  return num / Math.sqrt(dx * dy);
}
function ranghi(a) {
  const idx = a.map((v, i) => [v, i]).sort((x, y) => x[0] - y[0]);
  const r = new Array(a.length);
  for (let i = 0; i < idx.length;) {
    let j = i;
    while (j + 1 < idx.length && idx[j + 1][0] === idx[i][0]) j++;
    const m = (i + j) / 2 + 1;
    for (let k = i; k <= j; k++) r[idx[k][1]] = m;
    i = j + 1;
  }
  return r;
}
export const spearman = (xs, ys) => pearson(ranghi(xs), ranghi(ys));

/* Cohen (1988): 0.1 small, 0.3 medium, 0.5 large. */
export function cohen(r) {
  const a = Math.abs(r);
  if (a < 0.1) return { it: "trascurabile", en: "negligible" };
  if (a < 0.3) return { it: "debole", en: "weak" };
  if (a < 0.5) return { it: "moderata", en: "moderate" };
  return { it: "forte", en: "strong" };
}
export const MIN_GIORNI_CORRELAZIONE = 14;

/* Reference change value: two results differ beyond analytical and
   within-person biological variation. Percent. */
export function rcv(cva, cvi, z = 1.96) {
  return Math.SQRT2 * z * Math.sqrt(cva * cva + cvi * cvi);
}

/*
 * eGFR, CKD-EPI 2021 creatinine equation (no race term):
 *   142 x min(Scr/k, 1)^a x max(Scr/k, 1)^-1.200 x 0.9938^age x 1.012 if female
 *   k = 0.7 (F) or 0.9 (M); a = -0.241 (F) or -0.302 (M); Scr in mg/dL.
 * Inker LA et al., N Engl J Med 2021;385:1737-1749. Coefficients checked by
 * the clinical evidence officer (docs/FONTI.md).
 */
export function egfr2021({ creatinina, eta, sesso }) {
  if (!(creatinina > 0) || !(eta >= 18) || !sesso) return null;
  const f = sesso === "F";
  const k = f ? 0.7 : 0.9, a = f ? -0.241 : -0.302;
  const r = creatinina / k;
  return 142 * Math.pow(Math.min(r, 1), a) * Math.pow(Math.max(r, 1), -1.2) * Math.pow(0.9938, eta) * (f ? 1.012 : 1);
}

export function bmi(kg, cm) {
  if (!(kg > 0) || !(cm > 0)) return null;
  const m = cm / 100;
  return kg / (m * m);
}

/* WHO adult categories, WHO Technical Report Series 894, Table 2.1 (labels as verified by the clinical evidence officer). */
export function categoriaBmi(v) {
  if (v == null) return null;
  if (v < 18.5) return { id: "sotto", it: "Sottopeso", en: "Underweight" };
  if (v < 25) return { id: "normale", it: "Normopeso", en: "Normal range" };
  if (v < 30) return { id: "sovrappeso", it: "Sovrappeso (pre-obesità)", en: "Pre-obese (overweight)" };
  if (v < 35) return { id: "ob1", it: "Obesità di classe I", en: "Obese class I" };
  if (v < 40) return { id: "ob2", it: "Obesità di classe II", en: "Obese class II" };
  return { id: "ob3", it: "Obesità di classe III", en: "Obese class III" };
}

/* Exponentially smoothed weight trend: daily weights move with water and
   salt; the smoothed line shows the direction. alpha 0.1 per day. */
export function tendenzaEsponenziale(punti, alfa = 0.1) {
  if (!punti.length) return [];
  const ord = [...punti].sort((a, b) => (a.x < b.x ? -1 : 1));
  const out = [{ x: ord[0].x, y: ord[0].y }];
  for (let i = 1; i < ord.length; i++) {
    const giorni = Math.max(1, giorniDa(ord[i].x, ord[i - 1].x));
    const a = 1 - Math.pow(1 - alfa, giorni);
    out.push({ x: ord[i].x, y: out[i - 1].y + a * (ord[i].y - out[i - 1].y) });
  }
  return out;
}
