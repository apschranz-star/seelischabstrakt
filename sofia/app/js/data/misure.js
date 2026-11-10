/*
 * Household measures for the food log: "1 small egg", "half a can", "a glass
 * of milk". Each turns into grams with a stated source.
 *
 * Sources (docs/FONTI.md):
 *   - LARN, SINU (Societa Italiana di Nutrizione Umana), "Standard
 *     quantitativi delle porzioni", IV revision 2014 and V revision 2024:
 *     glasses 125 / 200 / 300 mL, cup 250 mL, coffee cup 50 mL, level
 *     tablespoon 10 mL, level teaspoon 5 mL; oil 1 tablespoon (10 mL) = 9 g;
 *     yogurt 1 pot = 125 g; fresh fruit 1 portion = 150 g; fresh cheese
 *     100 g = 1 small mozzarella; nuts 30 g; potatoes 200 g = 2 small.
 *   - Eggs: EU weight grades for class A eggs in the shell (Regulation (EC)
 *     589/2008, now Delegated Regulation (EU) 2023/2465): S under 53 g,
 *     M 53-63 g, L 63-73 g, XL from 73 g. Edible part 88% (USDA: shell 12%
 *     refuse). Grams here are the middle of each grade times 0.88.
 *   - Cans and packs: the weight printed on the label (Sofia types it, or the
 *     package from Open Food Facts gives it).
 * Liquids in mL become grams with the food's density: oil 0.9 (LARN: 10 mL =
 * 9 g), milk and kefir 1.03, everything else 1.
 */
export const FONTI_MISURE = {
  larn: { it: "porzioni standard LARN (SINU)", en: "LARN standard portions (SINU)" },
  uova: { it: "classi di peso UE delle uova, parte edibile 88%", en: "EU egg weight grades, 88% edible" },
  etichetta: { it: "peso sull'etichetta", en: "weight on the label" },
};

export const MISURE = {
  uovo_s: { it: "uovo piccolo (S)", en: "small egg (S)", g: 42, fonte: "uova" },
  uovo_m: { it: "uovo medio (M)", en: "medium egg (M)", g: 51, fonte: "uova" },
  uovo_l: { it: "uovo grande (L)", en: "large egg (L)", g: 60, fonte: "uova" },
  uovo_xl: { it: "uovo molto grande (XL)", en: "extra large egg (XL)", g: 66, fonte: "uova" },
  bicchiere_piccolo: { it: "bicchiere piccolo (125 mL)", en: "small glass (125 mL)", ml: 125, fonte: "larn" },
  bicchiere: { it: "bicchiere medio (200 mL)", en: "medium glass (200 mL)", ml: 200, fonte: "larn" },
  bicchiere_grande: { it: "bicchiere grande (300 mL)", en: "large glass (300 mL)", ml: 300, fonte: "larn" },
  tazza: { it: "tazza media (250 mL)", en: "medium cup (250 mL)", ml: 250, fonte: "larn" },
  tazzina: { it: "tazzina da caffè (50 mL)", en: "coffee cup (50 mL)", ml: 50, fonte: "larn" },
  cucchiaio: { it: "cucchiaio raso (10 mL)", en: "level tablespoon (10 mL)", ml: 10, fonte: "larn" },
  cucchiaino: { it: "cucchiaino raso (5 mL)", en: "level teaspoon (5 mL)", ml: 5, fonte: "larn" },
  vasetto: { it: "vasetto di yogurt (125 g)", en: "yogurt pot (125 g)", g: 125, fonte: "larn" },
  frutto: { it: "frutto medio (150 g)", en: "medium fruit (150 g)", g: 150, fonte: "larn" },
  mozzarella: { it: "mozzarella piccola (100 g)", en: "small mozzarella (100 g)", g: 100, fonte: "larn" },
  patata: { it: "patata piccola (100 g)", en: "small potato (100 g)", g: 100, fonte: "larn" },
  frutta_secca: { it: "porzione di frutta secca (30 g, 7-8 noci)", en: "portion of nuts (30 g, 7-8 walnuts)", g: 30, fonte: "larn" },
  scatoletta: { it: "scatoletta", en: "can", chiedi: true, fonte: "etichetta" },
  confezione: { it: "confezione", en: "pack", chiedi: true, fonte: "etichetta" },
  porzione: { it: "porzione dell'etichetta", en: "serving on the label", chiedi: true, fonte: "etichetta" },
};

export const FRAZIONI = [0.25, 0.5, 0.75, 1, 1.5, 2, 3];
export const frazioneTesto = (f) => ({ 0.25: "¼", 0.5: "½", 0.75: "¾", 1.5: "1½" })[f] || String(f);

/* Which measures fit a food, from its plan group or food-brain class. */
export function misurePer({ id = "", classe = "", gruppo = "", nomeEn = "", inScatola = false, confezione = null, porzione = null } = {}) {
  const k = [];
  const n = String(nomeEn).toLowerCase();
  if (id === "uovo" || id === "albume" || classe === "uova" || /^egg\b|\begg, (whole|raw)/.test(n)) k.push("uovo_s", "uovo_m", "uovo_l", "uovo_xl");
  if (["latte_ps", "kefir"].includes(id) || classe === "latte" || classe === "bevande" || /\bmilk\b|\bdrink\b|\bjuice\b/.test(n)) k.push("bicchiere_piccolo", "bicchiere", "bicchiere_grande", "tazza", "cucchiaio");
  if (id === "caffe" || /\bcoffee\b/.test(n)) k.push("tazzina", "tazza");
  const olio = /\boil\b/.test(n) && !/\bin [a-z ]*oil\b/.test(n);
  if (id === "olio_evo" || olio) k.push("cucchiaio", "cucchiaino");
  if (["yogurt_magro", "yogurt_greco"].includes(id) || classe === "yogurt") k.push("vasetto");
  if (gruppo === "frutta" || classe === "frutta") k.push("frutto");
  if (/^mozzarella/.test(id) || /^mozzarella/.test(n)) k.push("mozzarella");
  if (id === "patate" || classe === "patate") k.push("patata");
  if (id === "frutta_secca" || classe === "frutta_secca") k.push("frutta_secca");
  if (inScatola || id === "tonno" || id === "legumi_scolati" || /\bcanned\b/.test(n)) k.push("scatoletta");
  if (porzione) k.push("porzione");
  k.push("confezione");
  return [...new Set(k)];
}

const DENSITA = { olio_evo: 0.9, latte_ps: 1.03, kefir: 1.03 };
export function densita(id = "", nomeEn = "") {
  if (DENSITA[id] != null) return DENSITA[id];
  const n = String(nomeEn).toLowerCase();
  if (/\boil\b/.test(n) && !/\bin [a-z ]*oil\b/.test(n)) return 0.9;
  if (/\bmilk\b|kefir/.test(n)) return 1.03;
  return 1;
}

/* Grams of "fraction x measure" (peso: the label weight for cans and packs). */
export function grammiMisura(chiave, frazione, { id = "", nomeEn = "", peso = null } = {}) {
  const m = MISURE[chiave];
  if (!m) return null;
  const f = Number(frazione);
  if (!(f > 0)) return null;
  if (m.chiedi) { const p = Number(peso); return p > 0 ? f * p : null; }
  if (m.g != null) return f * m.g;
  return f * m.ml * densita(id, nomeEn);
}
