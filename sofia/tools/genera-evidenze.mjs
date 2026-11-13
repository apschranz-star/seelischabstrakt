/*
 * Builds app/js/data/evidenze.js from the council's research files in
 * docs/fonti/. Run: node tools/genera-evidenze.mjs
 * The app shows only what is in these files; nothing is typed by hand.
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const qui = dirname(fileURLToPath(import.meta.url));
const fonti = join(qui, "..", "docs", "fonti");
const nut = JSON.parse(readFileSync(join(fonti, "evidence-nutrition.json"), "utf8"));
const clinPath = join(fonti, "evidence-clinical.json");
const clin = existsSync(clinPath) ? JSON.parse(readFileSync(clinPath, "utf8")) : null;

/* Database food id -> app food id (app/js/data/alimenti.js). */
const MAPPA = {
  yogurt_bianco_magro_0: "yogurt_magro", latte_parzialmente_scremato: "latte_ps", kefir_bianco: "kefir", yogurt_greco_0: "yogurt_greco",
  ricotta_light: "ricotta_light", fiocchi_di_latte: "fiocchi_latte", philadelphia_light: "philadelphia_light", mozzarella_light: "mozzarella_light",
  parmigiano_reggiano: "parmigiano", fiocchi_avena: "avena", fiocchi_grano_saraceno: "fiocchi_saraceno", riso_soffiato_integrale: "riso_soffiato",
  miglio_soffiato: "miglio_soffiato", quinoa_soffiata: "quinoa_soffiata", cioccolato_fondente_85_90: "cioccolato",
  noci: "frutta_secca", mandorle: "frutta_secca", nocciole: "frutta_secca",
  marmellata_ridotta_zucchero: "marmellata", miele: "miele", pane_integrale_senza_glutine: "pane_gf",
  gallette_riso_integrale: "gallette_riso", gallette_grano_saraceno: "gallette_saraceno", hummus_ceci: "hummus", prugne_secche: "prugne_secche",
  pasta_grano_saraceno: "pasta_saraceno", pasta_riso_integrale: "pasta_riso_integrale", pasta_avena: "pasta_avena",
  riso_basmati: "riso_basmati", riso_venere: "riso_venere", riso_integrale: "riso_integrale", quinoa: "quinoa", grano_saraceno: "grano_saraceno",
  sorgo: "sorgo", miglio: "miglio", lenticchie_secche: "legumi_secchi", ceci_secchi: "legumi_secchi", fagioli_borlotti_secchi: "legumi_secchi",
  ceci_in_scatola_scolati: "legumi_scolati", patate: "patate", tonno_al_naturale: "tonno", salmone_affumicato: "salmone_affumicato",
  gamberi: "gamberi", calamaro: "calamari", seppia: "calamari", polpo_crudo: "polpo_crudo", polpo_cotto: "polpo_cotto",
  merluzzo: "merluzzo", nasello: "merluzzo", platessa: "pesce_bianco", orata: "pesce_bianco", alici_fresche: "alici", pesce_spada: "pesce_spada",
  salmone_fresco: "salmone", petto_di_pollo: "pollo", petto_di_tacchino: "tacchino", coniglio: "coniglio", vitello_magro: "vitello",
  lonza_di_maiale_magra: "maiale", uovo_intero: "uovo", albume: "albume", prosciutto_cotto: "prosciutto_cotto", olive_verdi: "olive",
  olio_extravergine: "olio_evo", passata_di_pomodoro: "passata",
  pomodori: "verdure", spinaci: "verdure", broccoli: "verdure", zucchine: "verdure", peperoni_rossi: "verdure",
  mirtilli: "frutta", lamponi: "frutta", more: "frutta", melograno: "frutta", arancia: "frutta", kiwi: "frutta",
};
const NOMI_NUTRIENTI = {
  protein: ["proteine", "protein"], fibre: ["fibre", "fibre"], calcium: ["calcio", "calcium"], iron: ["ferro", "iron"], magnesium: ["magnesio", "magnesium"],
  potassium: ["potassio", "potassium"], zinc: ["zinco", "zinc"], selenium: ["selenio", "selenium"], iodine: ["iodio", "iodine"],
  vitamin_c: ["vitamina C", "vitamin C"], vitamin_d: ["vitamina D", "vitamin D"], vitamin_e: ["vitamina E", "vitamin E"], vitamin_b6: ["vitamina B6", "vitamin B6"],
  vitamin_b12: ["vitamina B12", "vitamin B12"], folate: ["folati", "folate"], omega3_epa_dha: ["omega-3 EPA e DHA", "omega-3 EPA and DHA"], omega3_ala: ["omega-3 ALA", "omega-3 ALA"],
};
const tondo = (x, d = 2) => (x == null ? null : Math.round(x * 10 ** d) / 10 ** d);
/* The app's English is British (as in Coeliac UK and the ESsCD guidelines): the officers' own English texts say "coeliac". Source titles and official EU wording stay as published. */
const gb = (s) => (s == null ? s : String(s).replace(/\bceliac\b/g, "coeliac").replace(/\bCeliac\b/g, "Coeliac"));
const KEEP = ["kcal", "protein_g", "carb_g", "fat_g", "fibre_g", "calcium_mg", "iron_mg", "magnesium_mg", "potassium_mg", "sodium_mg", "vitc_mg", "vitd_ug", "b12_ug", "folate_ug", "epa_dha_g", "ala_g"];

const cibi = {};
for (const f of nut.foods) {
  const app = MAPPA[f.id];
  if (!app) continue;
  const per100g = Object.fromEntries(KEEP.map((k) => [k, tondo(f.per100g ? f.per100g[k] : null, k.endsWith("_g") && k !== "protein_g" && k !== "carb_g" && k !== "fat_g" && k !== "fibre_g" ? 3 : 2)]));
  (cibi[app] = cibi[app] || []).push({
    id: f.id, it: f.name_it, en: f.name_en, stato: f.state, db: f.database, dbId: String(f.db_id), url: f.url,
    per100g, fonteDi: f.source_of_recommended || [], proxy: f.proxy || null, cautela: f.caution || null,
  });
}

const claims = nut.claims.map((c) => {
  const cibiApp = [...new Set((c.eligible_foods_recommended || []).map((x) => MAPPA[x]).filter(Boolean))];
  const varianti = {};
  for (const x of c.eligible_foods_recommended || []) { const a = MAPPA[x]; if (a) (varianti[a] = varianti[a] || []).push(x); }
  return {
    id: c.id, nutriente: { it: c.nutrient_it, en: c.nutrient }, testo: { it: c.claim_it, en: c.claim_en },
    condizioni: { it: c.conditions_it_full || c.conditions_en, en: c.conditions_en },
    organo: c.system, organoAlt: c.system_alt || null, tipo: c.link ? c.link.type : null, chiave: c.link ? c.link.key || null : null,
    quantitaGiorno: c.link && c.link.daily_amount_g ? c.link.daily_amount_g : null,
    nonCalcolabile: c.link && c.link.type === "not_computable" ? c.link.reason : null,
    candidati: c.link && c.link.candidate_foods ? [...new Set(c.link.candidate_foods.map((x) => MAPPA[x]).filter(Boolean))] : [],
    cibi: cibiApp, varianti, atto: c.legal_act || "Regolamento (UE) n. 432/2012", url: c.url_consolidated_it || c.url_it || c.url, urlEn: c.url_consolidated_en || c.url,
  };
});

/* Lab markers: entirely from the clinical evidence officer's file. */
const VERSO = { high_bad: "alto", low_bad: "basso", both: "entrambi" };
const ALIAS_EXTRA = { upcr: ["rapporto proteine/creatinina", "proteine/creatinina", "upcr"], uacr: ["albumina/creatinina", "microalbuminuria", "uacr"], crp: ["proteina c reattiva", "pcr"], esr: ["ves", "velocità di eritrosedimentazione"], ttg_iga: ["anti-transglutaminasi", "antitransglutaminasi", "anti transglutaminasi"], vitamin_d_25oh: ["25-oh vitamina d", "25(oh)d", "vitamina d"] };
const esami = clin ? clin.labs.map((l) => ({
  id: l.id, it: l.name_it, en: l.name_en, de: l.name_de,
  campione: l.specimen === "urine" ? "urine" : "sangue",
  organo: l.organ, organiSecondari: l.secondary_organs || [], verso: VERSO[l.direction] || "entrambi",
  unita: l.units.map((u) => ({ u: u.unit, f: u.to_canonical_factor == null ? null : u.to_canonical_factor, canonica: u.canonical, alias: u.unit_aliases || [] })),
  alias: [...new Set([...(l.aliases || []), ...(ALIAS_EXTRA[l.id] || [])].map((x) => String(x).toLowerCase().trim()).filter((x) => x.length >= 2))],
  perche: { it: l.why_it, en: gb(l.why_en) },
  note: l.notes || null,
  fonti: (l.sources || []).map((x) => ({ titolo: x.title, editore: x.publisher, anno: x.year, url: x.url })),
})) : [];
writeFileSync(join(qui, "..", "app", "js", "data", "esami-dati.js"), `/* GENERATED by tools/genera-evidenze.mjs from docs/fonti/evidence-clinical.json. Do not edit by hand. */\nexport const ESAMI_DATI = ${JSON.stringify(esami)};\n`);

const clinApp = clin ? {
  generato: clin.generated,
  dieta: clin.diet_points.map((d) => ({ id: d.id, condizione: d.condition, tipo: d.type, cibi: d.foods || [], it: d.statement_it, en: gb(d.statement_en), evidenza: d.evidence, fonti: (d.sources || []).map((x) => ({ titolo: x.title, editore: x.publisher, anno: x.year, url: x.url })) })),
  egfr: clin.egfr_ckd_epi_2021,
  bmi: clin.bmi_who,
  acqua: clin.mineral_water_calcium,
  variabilita: { usabile: clin.biological_variation.usable_in_app, nota: clin.biological_variation.access_note, rcv: clin.biological_variation.rcv_formula, alternative: clin.biological_variation.alternative_sources || clin.biological_variation.non_eflm_values || null },
  domande: clin.open_questions,
} : null;

const out = `/* GENERATED by tools/genera-evidenze.mjs from docs/fonti/. Do not edit by hand. */
export const GENERATO = ${JSON.stringify(nut.generated)};
export const METODO = ${JSON.stringify(nut.method_note)};
export const NOMI_NUTRIENTI = ${JSON.stringify(NOMI_NUTRIENTI)};
export const SOGLIE = ${JSON.stringify({ nrv: nut.thresholds.nrv, significativo100g: nut.thresholds.significant_amount_per_100g })};
export const CLAIMS = ${JSON.stringify(claims)};
export const COMPOSIZIONE = ${JSON.stringify(cibi)};
export const CLINICA = ${JSON.stringify(clinApp)};
`;
writeFileSync(join(qui, "..", "app", "js", "data", "evidenze.js"), out);
console.log(`evidenze.js: ${claims.length} claims, ${Object.keys(cibi).length} app foods, clinica: ${clin ? clinApp.dieta.length + " diet points" : "not yet"}, ${(out.length / 1024).toFixed(0)} KB; esami-dati.js: ${esami.length} markers`);
