/*
 * Il Consiglio: the rule agents that check every week, every recipe and
 * every daily web recipe before Sofia sees it.
 *
 * Same module in the browser and in the Netlify function, so a recipe is
 * judged by exactly the same rules wherever it is judged. No AI model
 * decides anything here: every agent is a fixed, readable rule set, and every
 * rule says where it comes from (the plan, a guideline, or the gluten check
 * already proven in anker/werkzeug/glutenpruefung.js).
 *
 * Seniority decides who wins a disagreement. A veto from a more senior seat
 * cannot be overruled by a junior seat; the chair (Revisore senior) only
 * publishes what no seat vetoed. See docs/COUNCIL.md.
 */
import { ALIMENTI } from "../data/alimenti.js";
import { PRANZO, CENA, COLAZIONE } from "../data/piano.js";
import { validaSettimana, alimentiPasto } from "./planner.js";

export const AGENTI = [
  { id: "glutine", anzianita: 1, veto: true, nome: { it: "Custode del glutine", en: "Gluten guardian" }, ruolo: { it: "Celiachia: ogni ingrediente deve essere senza glutine o comprato con la dicitura senza glutine.", en: "Coeliac disease: every ingredient must be gluten free or bought labelled gluten free." } },
  { id: "lupus", anzianita: 2, veto: true, nome: { it: "Sentinella lupus", en: "Lupus sentinel" }, ruolo: { it: "Esclude cibi sconsigliati nel lupus e segnala cosa chiedere al medico.", en: "Excludes foods advised against in lupus and flags what to ask the doctor." } },
  { id: "piano", anzianita: 3, veto: true, nome: { it: "Custode del piano", en: "Plan keeper" }, ruolo: { it: "Solo alimenti, dosi e limiti scritti dalla nutrizionista.", en: "Only foods, amounts and limits written by the nutritionist." } },
  { id: "reni", anzianita: 4, veto: false, nome: { it: "Sentinella reni", en: "Kidney sentinel" }, ruolo: { it: "Sale, acqua e andamento degli esami renali. Segnala, non cambia il piano.", en: "Salt, water and kidney results over time. Flags, never changes the plan." } },
  { id: "dati", anzianita: 5, veto: false, nome: { it: "Analista dei dati", en: "Data analyst" }, ruolo: { it: "Dice quando i dati bastano per una statistica e quando no.", en: "Says when there is enough data for a statistic and when not." } },
  { id: "presidente", anzianita: 0, veto: false, nome: { it: "Revisore senior", en: "Senior reviewer" }, ruolo: { it: "Presiede: pubblica solo ciò che nessun seggio ha bloccato.", en: "Chair: publishes only what no seat blocked." } },
];

/* Verdict levels */
export const OK = "ok", NOTA = "nota", ADATTA = "adatta", VETO = "veto";

function verdetto(agente, livello, motivi = []) {
  return { agente, livello, motivi };
}

export function decisione(verdetti) {
  const ordinati = [...verdetti].sort((a, b) => anz(a.agente) - anz(b.agente));
  const veto = ordinati.find((v) => v.livello === VETO && AGENTI.find((x) => x.id === v.agente).veto);
  if (veto) return { esito: "respinta", da: veto.agente, verdetti: ordinati };
  if (ordinati.some((v) => v.livello === ADATTA)) return { esito: "adattata", verdetti: ordinati };
  return { esito: "approvata", verdetti: ordinati };
}
const anz = (id) => (AGENTI.find((a) => a.id === id) || { anzianita: 9 }).anzianita;

/* ================================================================ WEEK */

/* ctx: { renaleFuoriRange, cni (takes ciclosporin, tacrolimus or voclosporin), seguenti (weeks already planned after this one) } */
export function consiglioSettimana(sett, storia = [], ctx = {}) {
  const salute = ctx;
  const v = [];
  /* Plan keeper: hard limits are vetoes, ideal frequencies are notes. */
  const val = validaSettimana(sett, storia, ctx.seguenti || []);
  const rotti = val.checks.filter((c) => c.livello !== "ideale" && !c.ok);
  const ideali = val.checks.filter((c) => c.livello === "ideale" && !c.ok);
  v.push(verdetto("piano", rotti.length ? VETO : ideali.length ? NOTA : OK, [...rotti, ...ideali].map((c) => ({ it: `${c.it} (${c.valore} / ${c.atteso})`, en: `${c.en} (${c.valore} / ${c.atteso})` }))));

  /* Gluten guardian: which foods of this week need a label or certification. */
  const usati = new Set();
  for (const g of sett.giorni) for (const p of ["colazione", "spuntino", "pranzo", "cena", "dopocena"]) if (g[p]) alimentiPasto(g, p).forEach((a) => usati.add(a));
  const cert = [...usati].filter((a) => ALIMENTI[a] && ALIMENTI[a].glutine === "certificata");
  const etich = [...usati].filter((a) => ALIMENTI[a] && ALIMENTI[a].glutine === "etichetta");
  const sconosciuti = [...usati].filter((a) => !ALIMENTI[a]);
  v.push(verdetto("glutine", sconosciuti.length ? VETO : NOTA, [
    ...(cert.length ? [{ it: "Solo certificati senza glutine: " + cert.map((a) => ALIMENTI[a].it).join(", "), en: "Certified gluten free only: " + cert.map((a) => ALIMENTI[a].en).join(", ") }] : []),
    ...(etich.length ? [{ it: "Compra con la dicitura senza glutine: " + etich.map((a) => ALIMENTI[a].it).join(", "), en: "Buy labelled gluten free: " + etich.map((a) => ALIMENTI[a].en).join(", ") }] : []),
    ...sconosciuti.map((a) => ({ it: "Alimento sconosciuto: " + a, en: "Unknown food: " + a })),
  ]));

  /* Lupus sentinel: the plan contains nothing on the avoid list by construction; it reports fish for omega-3. */
  let pesce = 0;
  for (const g of sett.giorni) for (const p of ["pranzo", "cena"]) if (g[p] && g[p].cat === "pesce") pesce++;
  v.push(verdetto("lupus", NOTA, [
    { it: `Pesce questa settimana: ${pesce} pasti.`, en: `Fish this week: ${pesce} meals.` },
    { it: "Integratore di omega 3: una meta-analisi mostra un piccolo beneficio sull'attività del lupus, con certezza bassa. Solo dopo l'approvazione del medico, come scrive anche la nutrizionista.", en: "Omega-3 supplement: one meta-analysis shows a small benefit on lupus activity, with low certainty. Only after the doctor approves, as the nutritionist also writes.", fonte: "lupus_omega3" },
    { it: "Nessun cibo cura il lupus: le terapie restano del medico.", en: "No food treats lupus: treatment stays with the doctor." },
    ...(farmaciProfilo(ctx.profilo).cni && (usati.has("frutta") || usati.has("marmellata")) ? [{ it: "Frutta e marmellata: con ciclosporina, tacrolimus o voclosporina niente pompelmo, pomelo, arancia amara di Siviglia (anche in marmellata) o tangelo.", en: "Fruit and jam: with ciclosporin, tacrolimus or voclosporin no grapefruit, pomelo, Seville (bitter) orange (marmalade too) or tangelo.", fonte: "drug_grapefruit_cni" }] : []),
  ]));

  /* Kidney sentinel: salty foods and the latest kidney results. */
  const salati = [...usati].filter((a) => ALIMENTI[a] && ALIMENTI[a].sale);
  const motiviReni = [
    { it: "Il piano dice di usare il sale in modo moderato. KDIGO, malattie glomerulari: sodio sotto 2 g al giorno (meno di 5 g di sale).", en: "The plan says to use salt in moderation. KDIGO, glomerular disease: sodium below 2 g a day (under 5 g of salt).", fonte: "ln_sodium" },
    { it: "KDIGO indica anche un peso normale e, nella malattia renale cronica, almeno 150 minuti a settimana di attività moderata; il piano propone, se il lupus lo permette, 30 minuti di camminata veloce 5 volte a settimana.", en: "KDIGO also advises a normal weight and, in chronic kidney disease, at least 150 minutes a week of moderate activity; the plan suggests, if lupus allows, 30 minutes of brisk walking 5 times a week.", fonte: "ln_weight_activity" },
  ];
  if (salati.length) motiviReni.push({ it: "Alimenti salati: " + salati.map((a) => ALIMENTI[a].it).join(", ") + ". Non aggiungere altro sale.", en: "Salty foods: " + salati.map((a) => ALIMENTI[a].en).join(", ") + ". Do not add extra salt." });
  if (salute.renaleFuoriRange) motiviReni.push({ it: "Un esame renale recente è fuori dall'intervallo del laboratorio: parlane con il medico prima di cambiare le proteine.", en: "A recent kidney result is outside the lab range: talk to the doctor before changing protein." });
  v.push(verdetto("reni", NOTA, motiviReni));

  return { ...decisione(v), checks: val.checks };
}

/* ======================================================= WEB RECIPES */
/*
 * Ingredient lines come from schema.org/Recipe on the source page, mostly in
 * English. Each line must be recognised, like in Anker: a line nobody knows
 * rejects the recipe. Order matters: the first matching rule wins.
 */
const R = (s) => new RegExp(s, "i");

/* Citrus that the FDA names with grapefruit for ciclosporin, tacrolimus and voclosporin (drug_grapefruit_cni). */
const AGRUMI_CNI = "grapefruit|pomelo|pompelmo|arancia amara|arance amare|seville|bitter orange|tangelo";
const IPERICO = "st\\.? john'?s wort|iperico|hypericum";

/* Lines that are never food. */
const NON_CIBO = R("^[^\\d]{0,40}:\\s*$|^(for the|per (il|la|le|i))\\b|cooking spray|non-?stick|parchment|toothpick|skewer|kitchen twine|optional garnish:?$");

/* Veto lines with the seat that vetoes and why. */
export const VETI = [
  { agente: "lupus", re: R("alfalfa|erba medica"), it: "Germogli di erba medica: sconsigliati nel lupus", en: "Alfalfa sprouts: advised against in lupus" },
  { agente: "lupus", re: R("echinacea"), it: "Echinacea: sconsigliata nel lupus", en: "Echinacea: advised against in lupus" },
  { agente: "piano", re: R("\\b(bacon|pancetta|guanciale|salami|salame|chorizo|sausages?|salsiccia|pepperoni|hot ?dogs?|frankfurters?|wurstel|deli (meat|turkey|chicken)|lunch ?meat|prosciutto(?! cotto)|speck|mortadella|bresaola|jerky|cold cuts?|affettat)\\b"), it: "Carne lavorata: esclusa dal piano", en: "Processed meat: excluded by the plan" },
  { agente: "piano", re: R("\\b(deep[ -]?fr|for frying|frying oil|oil for frying|fried)\\b|\\bfrittur"), it: "Frittura: esclusa dal piano", en: "Frying: excluded by the plan" },
  { agente: "piano", re: R("\\b(beef|steak|ground meat|minced meat|lamb|mutton|duck|goose|venison|bison|veal stock|manzo|agnello|anatra)\\b"), it: "Carne non prevista dal piano: manzo e macinato solo nel ragù del pranzo (90 g, max 1 a settimana), con la carne da confermare con la nutrizionista; per questo le ricette dal web restano fuori", en: "Meat not in the plan: beef and mince only in the lunch ragù (90 g, max once a week), with the meat to be confirmed by the nutritionist; so web recipes stay out" },
  { agente: "piano", re: R("\\b(sardines?|mackerel|trout|herring|tilapia|catfish|mussels|clams|scallops|crab|lobster|oysters?|sardine|sgombro|trota|cozze|vongole|capesante)\\b"), it: "Pesce non previsto dal piano", en: "Seafood not in the plan" },
  { agente: "piano", re: R("coconut (milk|cream)|heavy cream|whipping cream|double cream|half[ -]and[ -]half|panna|mascarpone|condensed milk|evaporated milk|ice cream"), it: "Panna, latte di cocco o latte condensato: non previsti dal piano", en: "Cream, coconut milk or condensed milk: not in the plan" },
  { agente: "piano", re: R("\\b(cake|cookies?|brownies?|muffins?|cupcakes?|frosting|icing|pie crust|pastry|pancake mix|waffle|donuts?|doughnuts?|marshmallows?|candy|caramel|sprinkles|chocolate chips|milk chocolate|white chocolate|nutella)\\b"), it: "Dolci e prodotti da forno: fuori dal piano ipocalorico", en: "Sweets and baked goods: outside the hypocaloric plan" },
  { agente: "piano", re: R("\\b(gluten[- ]free (flour|all[- ]purpose|baking|bread flour|measure)|flour blend|1 ?to ?1|xanthan|psyllium|yeast|baking powder|baking soda|bicarbonat|lievito)\\b"), it: "Impasti e lievitati: il piano evita i mix senza glutine", en: "Doughs and leavened bakes: the plan avoids gluten-free mixes" },
  { agente: "piano", re: R("\\b(chickpea|almond|coconut|rice|tapioca|potato|sorghum|millet|teff|cassava|arrowroot|corn|cassava) (flour|starch|meal)\\b|cornstarch|cornflour|amido|fecola"), it: "Farine e amidi non previsti dal piano (solo avena o grano saraceno per impanare)", en: "Flours and starches not in the plan (only oat or buckwheat for breading)" },
  { agente: "piano", re: R("\\b(corn tortillas?|tortilla chips|cornflakes|corn pasta|polenta|cornmeal|grits|sweet corn|corn kernels|\\bmais\\b)"), it: "Mais: non tra le scelte del piano", en: "Corn: not among the plan's choices" },
  { agente: "piano", re: R("\\b(cheddar|feta|goat cheese|chevre|brie|camembert|gouda|gruyere|swiss cheese|monterey|pepper jack|blue cheese|gorgonzola|halloumi|pecorino|provolone|manchego|queso|cotija|paneer|fontina|asiago|emmental)\\b"), it: "Formaggio non previsto dal piano", en: "Cheese not in the plan" },
  { agente: "piano", re: R("\\b(soda|cola|juice concentrate|energy drink|corn syrup|golden syrup|simple syrup|molasses)\\b"), it: "Bevande o sciroppi zuccherati", en: "Sugary drinks or syrups" },
  { agente: "piano", re: R("\\b(dates|raisins|sultanas|dried (apricots?|cranberr|figs?|mango|cherr)|candied)\\b"), it: "Frutta essiccata zuccherina: il piano prevede solo prugne secche", en: "Sugary dried fruit: the plan only has prunes" },
  { agente: "piano", re: R("\\b(cashews?|pistachios?|pecans?|macadamia|brazil nuts?|peanuts?|peanut butter|pine nuts|pinoli|arachidi|anacardi|pistacchi)\\b"), it: "Frutta secca diversa da noci, mandorle e nocciole", en: "Nuts other than walnuts, almonds and hazelnuts" },
  { agente: "piano", re: R("\\b(tofu|tempeh|seitan|edamame|soy (milk|beans?)|textured vegetable)\\b"), it: "Soia e derivati: non previsti dal piano", en: "Soy products: not in the plan" },
  { agente: "piano", re: R("\\bsweet potato(es)?\\b|patate dolci|patate americane|yams?\\b"), it: "Patate dolci: non previste (il piano ha 200 g di patate al posto del pane)", en: "Sweet potatoes: not in the plan (the plan has 200 g potatoes instead of bread)" },
];

/* Sprouts, in the words the sources use: CIQUAL writes "Mung bean, sprouted or
   soy spouts, raw" (sic) and "Lentils, sprouted". Brussels sprouts and sprouting
   broccoli are ordinary vegetables, not seed sprouts. */
export const GERMOGLI = "(?<!brussels )\\bsprouts?\\b(?! broccoli)|\\bsprouted\\b|\\bspouts\\b|germogl";
/* Thoroughly heat-treated sprouts (canned, boiled) are not the raw or lightly cooked ones the advice is about. */
const GERMOGLI_BEN_COTTI = "\\b(canned|boiled|in scatola|bolliti)\\b";

/* Lupus notes that do not block a recipe for everyone. The clinical evidence
   officer graded them (docs/fonti/evidence-clinical.json, ids in "fonte").
   With her profile (medicines, immunosuppression) some become vetoes on her
   phone: see notePersonali(). */
export const NOTE_LUPUS = [
  { re: R("\\bgarlic\\b|\\baglio\\b"), fonte: "lupus_garlic", it: "Aglio: un centro per il lupus consiglia di limitarlo, ma le prove sono solo consigli di associazioni di pazienti. Chiedi al medico.", en: "Garlic: a lupus centre advises limiting it, but the evidence is patient-organisation advice only. Ask the doctor." },
  { re: R(AGRUMI_CNI), fonte: "drug_grapefruit_cni", it: "Pompelmo, pomelo, arancia amara di Siviglia o tangelo: da evitare se prendi ciclosporina, tacrolimus o voclosporina (schede tecniche e FDA).", en: "Grapefruit, pomelo, Seville (bitter) orange or tangelo: avoid if you take ciclosporin, tacrolimus or voclosporin (product labels and FDA)." },
  { re: R(GERMOGLI), fonte: "lupus_raw_sprouts_immunosuppressed", it: "Germogli crudi: da evitare se prendi immunosoppressori (indicazione FDA per chi ha difese ridotte).", en: "Raw sprouts: avoid if you take immunosuppressants (FDA advice for weakened immunity)." },
  { re: R(IPERICO), fonte: "drug_st_johns_wort", it: "Iperico: con ciclosporina da evitare (la scheda riporta una forte riduzione della ciclosporina nel sangue); con tacrolimus o voclosporina chiedi al medico prima di qualsiasi integratore (le schede avvertono sugli induttori del CYP3A4).", en: "St John's wort: avoid with ciclosporin (the label reports a marked fall in blood ciclosporin); with tacrolimus or voclosporin ask the doctor before any supplement (the labels warn about CYP3A4 inducers)." },
];

/* What the medicines in her profile mean for food. Runs on her phone only. */
export function farmaciProfilo(profilo = {}) {
  const farmaci = String((profilo && profilo.farmaci) || "").toLowerCase();
  const cni = /ciclosporin|cyclosporin|tacrolimus|voclosporin|sandimmun|neoral|prograf|advagraf|envarsus|lupkynis/.test(farmaci);
  const immuno = (profilo && profilo.immunosoppressori === true) || cni || /micofenol|mycophenol|cellcept|myfortic|azatioprin|imuran|ciclofosfamid|cyclophosphamid|metotressat|methotrexat|belimumab|benlysta|rituximab|anifrolumab|saphnelo|prednison|metilprednisolon|deltacortene|medrol/.test(farmaci);
  return { cni, immuno };
}

/* Profile-aware checks, run on Sofia's phone only (the profile never leaves it). */
export function notePersonali(righe, profilo = {}) {
  const { cni, immuno } = farmaciProfilo(profilo);
  const out = [];
  for (const z of righe) {
    if (cni && R(AGRUMI_CNI).test(z)) out.push({ livello: VETO, it: `Pompelmo, pomelo, arancia amara o tangelo con ciclosporina, tacrolimus o voclosporina: da evitare ("${z}")`, en: `Grapefruit, pomelo, bitter orange or tangelo with ciclosporin, tacrolimus or voclosporin: avoid ("${z}")` });
    if (cni && R(IPERICO).test(z)) out.push({ livello: VETO, it: `Iperico con ciclosporina, tacrolimus o voclosporina: chiedi al medico ("${z}")`, en: `St John's wort with ciclosporin, tacrolimus or voclosporin: ask the doctor ("${z}")` });
    if (immuno && R(GERMOGLI).test(z) && !R(GERMOGLI_BEN_COTTI).test(z)) out.push({ livello: VETO, it: `Germogli crudi con immunosoppressori: da evitare ("${z}")`, en: `Raw sprouts while immunosuppressed: avoid ("${z}")` });
  }
  return out;
}

/* Swaps the plan itself allows, applied automatically and shown to Sofia. */
const ADATTAMENTI = [
  { re: R("\\b(canola|rapeseed|vegetable|sunflower|corn|peanut|soybean|grapeseed|avocado|coconut|sesame) oil\\b|olio di (semi|girasole|mais|arachid|colza)"), a: "olio_evo", it: "Olio raffinato o di semi sostituito con olio extravergine di oliva", en: "Refined or seed oil replaced with extra virgin olive oil" },
  { re: R("\\b(butter|ghee|margarine|burro|lard|strutto)\\b"), a: "olio_evo", it: "Burro sostituito con olio extravergine (dose del piano)", en: "Butter replaced with extra virgin olive oil (plan amount)" },
  { re: R("\\b(white|red|dry|cooking|rice) wine\\b|\\bwine\\b|\\bvino\\b|sherry|marsala|mirin|sake|brandy|cognac|vodka|\\brum\\b|liqueur"), a: "acqua", it: "Alcol tolto: sostituisci con acqua o brodo vegetale", en: "Alcohol removed: use water or vegetable stock" },
  { re: R("sour cream|cr[eè]me fra[iî]che|panna acida|mayonnaise|mayo\\b|maionese"), a: "yogurt_greco", it: "Sostituito con yogurt greco 0% (ogni tanto)", en: "Replaced with Greek yogurt 0% (now and then)" },
  { re: R("\\b(chicken thighs?|chicken legs?|drumsticks?|whole chicken|cosce di pollo|sovracosce)\\b"), a: "pollo", it: "Usa petto di pollo, come nel piano", en: "Use chicken breast, as in the plan" },
  { re: R("tuna (in|packed in) (olive )?oil|tonno sott'olio"), a: "tonno", it: "Usa tonno al naturale", en: "Use tuna in water" },
  { re: R("\\b(jasmine|white|long[ -]grain|arborio|sushi|carnaroli) rice\\b|riso (bianco|arborio|carnaroli)"), a: "riso_basmati", it: "Usa riso basmati o un riso del piano", en: "Use basmati or another rice from the plan" },
  { re: R("\\b(rice noodles|rice pasta|gluten[- ]free (pasta|spaghetti|penne|noodles)|chickpea pasta|lentil pasta)\\b"), a: "pasta_saraceno", it: "Usa pasta di un solo ingrediente (grano saraceno, avena o riso integrale)", en: "Use single-ingredient pasta (buckwheat, oat or brown rice)" },
  { re: R("\\b(sugar|brown sugar|coconut sugar|maple syrup|agave|zucchero|sciroppo d'acero)\\b"), a: "miele", it: "Zucchero tolto o al massimo 10 g di miele", en: "Sugar removed or at most 10 g honey" },
  { re: R("\\b(whole milk|full[- ]fat milk|2% milk|latte intero)\\b"), a: "latte_ps", it: "Usa latte parzialmente scremato", en: "Use semi-skimmed milk" },
  { re: R("\\b(almond|oat|rice|cashew|plant[- ]based|dairy[- ]free|non[- ]dairy) milk\\b|latte (di mandorla|d'avena|vegetale)"), a: "latte_ps", it: "Usa latte parzialmente scremato o kefir, come nel piano", en: "Use semi-skimmed milk or kefir, as in the plan" },
  { re: R("\\b(whole milk|full[- ]fat|plain) (greek )?yogh?urt\\b|yogurt intero"), a: "yogurt_magro", it: "Usa yogurt bianco 0%", en: "Use plain 0% yogurt" },
  { re: R("\\b(halibut|haddock|pollock|sole|flounder|branzino|sea bass|snapper|grouper|whitefish|white fish|branzino|spigola|sogliola)\\b"), a: "pesce_bianco", it: "Pesce bianco: dose del piano per platessa, orata o altro pesce bianco", en: "White fish: plan amount for plaice, sea bream or other white fish" },
];

/* Recognised plan foods (first match wins). */
const MAPPA = [
  ["yogurt_greco", "greek yogh?urt|yogurt greco|skyr"],
  ["yogurt_magro", "yogh?urt"],
  ["kefir", "kefir"],
  ["latte_ps", "\\bmilk\\b|\\blatte\\b"],
  ["ricotta_light", "ricotta"],
  ["fiocchi_latte", "cottage cheese|fiocchi di latte"],
  ["philadelphia_light", "cream cheese|philadelphia|formaggio spalmabile"],
  ["mozzarella_light", "mozzarella"],
  ["parmigiano", "parmesan|parmigiano|grana padano"],
  ["farina_avena", "oat flour|farina di avena"],
  ["avena", "\\boats?\\b|oatmeal|rolled oats|fiocchi di avena|avena"],
  ["farina_saraceno", "buckwheat flour|farina di grano saraceno"],
  ["pasta_saraceno", "buckwheat (pasta|noodles|soba)|100% buckwheat|pasta di grano saraceno"],
  ["grano_saraceno", "buckwheat|kasha|grano saraceno"],
  ["quinoa", "quinoa"],
  ["miglio", "millet|miglio"],
  ["sorgo", "sorghum|sorgo"],
  ["riso_venere", "black rice|forbidden rice|riso venere|riso nero"],
  ["riso_integrale", "brown rice|wild rice|riso integrale"],
  ["riso_basmati", "basmati|\\brice\\b|\\briso\\b"],
  ["gallette_riso", "rice cakes?|gallette"],
  ["pangrattato_gf", "gluten[- ]free (bread ?crumbs|panko)|pangrattato"],
  ["pane_gf", "gluten[- ]free bread|pane senza glutine"],
  ["hummus", "hummus"],
  ["legumi_scolati", "canned (chickpeas|beans|lentils)|(chickpeas|beans|lentils),? (drained|rinsed|cooked)|(drained|rinsed|cooked) (chickpeas|beans|lentils)"],
  ["legumi_secchi", "lentils?|chickpeas?|garbanzo|cannellini|borlotti|kidney beans|black beans|white beans|navy beans|pinto beans|great northern|butter beans|lima beans|split peas|fava|broad beans|lenticchie|ceci|fagioli|piselli secchi|cicerchie"],
  ["pollo", "chicken breasts?|chicken|pollo"],
  ["tacchino", "turkey|tacchino"],
  ["coniglio", "rabbit|coniglio"],
  ["vitello", "\\bveal\\b|vitello"],
  ["maiale", "pork (loin|tenderloin|chop)|lean pork|maiale|lonza"],
  ["salmone_affumicato", "smoked salmon|lox|salmone affumicato"],
  ["salmone", "salmon|salmone"],
  ["tonno", "\\btuna\\b|tonno"],
  ["gamberi", "shrimp|prawns?|gamberi|gamberetti"],
  ["calamari", "squid|calamari|cuttlefish|seppi|totan"],
  ["polpo_cotto", "octopus|polpo"],
  ["merluzzo", "\\bcod\\b|hake|merluzzo|nasello"],
  ["pesce_bianco", "plaice|sea bream|dorade|orata|platessa"],
  ["alici", "anchov|alici|acciughe"],
  ["pesce_spada", "swordfish|pesce spada"],
  ["albume", "egg whites?|album"],
  ["uovo", "\\beggs?\\b|\\buov[ao]\\b"],
  ["patate", "potato|patat"],
  ["prugne_secche", "prunes|prugne secche|dried plums"],
  ["frutta_secca", "walnuts?|almonds?|hazelnuts?|noci|mandorle|nocciole"],
  ["cioccolato", "dark chocolate|(85|90)% (cacao|cocoa|chocolate)|cioccolato fondente"],
  ["marmellata", "\\bjam\\b|preserves|marmellata|confettura"],
  ["miele", "honey|miele"],
  ["olio_evo", "olive oil|olio (extra ?vergine|evo|d'oliva)"],
  ["passata", "passata|tomato (sauce|puree|paste)|crushed tomatoes|diced tomatoes|canned tomatoes|pelati|polpa di pomodoro|concentrato"],
  ["pesto", "pesto"],
  ["olive", "\\bolives?\\b|olive"],
  ["frutta", "berr(y|ies)|blueberr|raspberr|blackberr|strawberr|cherr(y|ies)|apples?|pears?|bananas?|oranges?|mandarin|clementine|grapefruit|pomegranate|grapes?|kiwi|peach|nectarine|apricots?|plums?|mango|pineapple|melon|watermelon|figs?|persimmon|frutti di bosco|mirtilli|lamponi|fragole|mele|pere|arance|melograno|uva|pesche|albicocche|ananas"],
  ["avocado", "avocado"],
  ["semi", "chia|flax|linseed|pumpkin seeds|pepitas|sunflower seeds|sesame seeds|hemp seeds|semi di (chia|lino|zucca|girasole|sesamo)"],
  ["verdure", "broccoli|zucchin|courgette|spinach|kale|chard|arugula|rocket|lettuce|romaine|cabbage|cauliflower|brussels|bell peppers?|red peppers?|peppers|tomato|cherry tomatoes|cucumber|carrots?|celery|fennel|leeks?|eggplant|aubergine|mushrooms?|asparagus|green beans|snap peas|snow peas|\\bpeas\\b|artichok|beets?|radish|squash|pumpkin|onions?|shallots?|scallions?|spring onions|endive|radicchio|watercress|bok choy|okra|turnips?|parsnips?|celeriac|sprouts|microgreens|salad greens|mixed greens|spring mix|verdur|zucchine|spinaci|cavol|peperon|pomodor|carot|sedano|finocchi|porri|melanzan|funghi|asparag|fagiolini|carciof|barbabietol|zucca|cipoll|scalogn|insalata|rucola|lattuga|bietol|cetriol"],
];
const MAPPA_RE = MAPPA.map(([a, s]) => [a, R(s)]);

/* Neutral extras: herbs, spices, lemon, salt, water. They never add a portion. */
const NEUTRI = R("^(?:.*\\b)?(salt|sea salt|kosher salt|pepper|black pepper|white pepper|peppercorns|red pepper flakes|chili flakes|chilli|chili powder|cayenne|paprika|smoked paprika|cumin|coriander|turmeric|curcuma|ginger|zenzero|cinnamon|cannella|nutmeg|noce moscata|cloves?|cardamom|allspice|bay leaf|bay leaves|alloro|oregano|origano|basil|basilico|parsley|prezzemolo|cilantro|coriandolo|mint|menta|dill|aneto|rosemary|rosmarino|thyme|timo|sage|salvia|chives|erba cipollina|tarragon|marjoram|maggiorana|herbs|erbe|spices|spezie|garlic|aglio|lemon|lime|limone|zest|scorza|juice|succo|vinegar|aceto|water|acqua|ice|ghiaccio|stock|broth|brodo|capers|capperi|mustard|senape|tamari|coconut aminos|fish sauce|hot sauce|harissa|sriracha|vanilla|vaniglia|cocoa powder|cacao|saffron|zafferano|sumac|za'?atar|fennel seeds|mustard seeds|garam masala|curry|five spice|italian seasoning|herbes de provence|everything bagel)\\b");

function pulisci(z) {
  return String(z).toLowerCase().replace(/\([^)]*\)/g, " ").replace(/[\d¼½¾⅓⅔⅛.,/-]+/g, " ").replace(/\b(cups?|tbsp|tsp|tablespoons?|teaspoons?|grams?|g|kg|ml|l|oz|ounces?|lbs?|pounds?|pinch|dash|handful|cloves?|cans?|large|medium|small|fresh|freshly|chopped|diced|minced|sliced|grated|shredded|to taste|optional|for serving|for garnish|divided|plus more|about|or|and|of|the|a|an|cut|into|pieces|peeled|deveined|boneless|skinless|raw|cooked|drained|rinsed|thinly|finely|roughly|halved|quartered|trimmed|packed|heaping|level|whole|ripe|frozen|thawed|room temperature|at|to|for|in|with|q\.?b\.?)\b/g, " ").replace(/\s+/g, " ").trim();
}

/* Anker's gluten check reports its reason in German; Sofia reads Italian or English. */
const MOTIVI_GLUTINE = [
  [/^glutenhaltige Alternative/, { it: "propone un'alternativa con glutine", en: "offers a gluten-containing alternative" }],
  [/^glutenfrei nur auf Wunsch/, { it: "senza glutine solo come opzione", en: "gluten free only as an option" }],
  [/^gesperrte Zutat/, { it: "ingrediente con glutine", en: "gluten-containing ingredient" }],
  [/^ohne Zusatz glutenfrei/, { it: "manca la dicitura senza glutine", en: "not marked gluten free" }],
  [/^nicht bestaetigt/, { it: "ingrediente non confermato", en: "ingredient not confirmed" }],
];
export function motivoGlutine(grund) {
  const m = MOTIVI_GLUTINE.find(([re]) => re.test(String(grund || "")));
  return m ? m[1] : { it: "riga non confermata", en: "line not confirmed" };
}

/* Judge one web recipe. gluten: result of anker's glutenPruefen, computed by the caller on the server. */
export function valutaRicettaWeb({ ingredienti = [], titolo = "", categoria = "", gluten = null }) {
  const verdetti = [];
  const motivi = { glutine: [], lupus: [], piano: [], reni: [] };
  const livelli = { glutine: OK, lupus: OK, piano: OK, reni: OK };
  const alimenti = new Set();
  const adattamenti = [];
  const alza = (ag, liv) => {
    const ord = [OK, NOTA, ADATTA, VETO];
    if (ord.indexOf(liv) > ord.indexOf(livelli[ag])) livelli[ag] = liv;
  };

  /* Gluten guardian: the proven check from Anker decides. */
  if (!gluten) { alza("glutine", VETO); motivi.glutine.push({ it: "Controllo glutine non eseguito", en: "Gluten check not run" }); }
  else if (!gluten.ok) { const m = motivoGlutine(gluten.grund); alza("glutine", VETO); motivi.glutine.push({ it: `Glutine: ${m.it}${gluten.zeile ? ' ("' + gluten.zeile + '")' : ""}`, en: `Gluten: ${m.en}${gluten.zeile ? ' ("' + gluten.zeile + '")' : ""}` }); }
  else if (gluten.packung && gluten.packung.length) { alza("glutine", NOTA); motivi.glutine.push({ it: "Compra con la dicitura senza glutine: " + gluten.packung.slice(0, 8).join("; "), en: "Buy labelled gluten free: " + gluten.packung.slice(0, 8).join("; ") }); }

  if (/dessert|cake|cookie|bread|baking|drink|cocktail|beverage|dolc|torta|biscott/i.test(categoria) || /\b(cake|cookies?|brownies?|muffins?|bread|pie|tart|cocktail|pancakes?|waffles?|donuts?|cupcakes?|bars|granola|fudge|truffles?)\b/i.test(titolo)) {
    alza("piano", VETO);
    motivi.piano.push({ it: "Categoria fuori dal piano: " + (categoria || titolo), en: "Category outside the plan: " + (categoria || titolo) });
  }

  for (const riga of ingredienti) {
    const z = String(riga);
    if (NON_CIBO.test(z)) continue;
    for (const n of NOTE_LUPUS) if (n.re.test(z)) { alza("lupus", NOTA); motivi.lupus.push({ it: n.it, en: n.en, fonte: n.fonte }); }
    const veto = VETI.find((v) => v.re.test(z));
    if (veto) { alza(veto.agente, VETO); motivi[veto.agente].push({ it: `${veto.it}: "${z}"`, en: `${veto.en}: "${z}"` }); continue; }
    const ad = ADATTAMENTI.find((x) => x.re.test(z));
    if (ad) { alza("piano", ADATTA); adattamenti.push({ riga: z, a: ad.a, it: ad.it, en: ad.en }); alimenti.add(ad.a); continue; }
    if (/\b(broth|stock|brodo|bouillon)\b/i.test(z)) { alza("reni", NOTA); motivi.reni.push({ it: `Brodo: scegli senza glutine e con poco sale ("${z}")`, en: `Stock: choose gluten free and low salt ("${z}")` }); continue; }
    const hit = MAPPA_RE.find(([, re]) => re.test(z));
    if (hit) {
      const a = hit[0];
      if (a === "avocado" || a === "semi") { alza("piano", NOTA); motivi.piano.push({ it: `Nel piano senza dose: "${z}" (piccola quantità)`, en: `In the plan without an amount: "${z}" (small amount)` }); continue; }
      alimenti.add(a);
      if (ALIMENTI[a] && ALIMENTI[a].sale) { alza("reni", NOTA); motivi.reni.push({ it: `Salato: ${ALIMENTI[a].it}`, en: `Salty: ${ALIMENTI[a].en}` }); }
      continue;
    }
    const resto = pulisci(z);
    if (!resto || NEUTRI.test(resto) || NEUTRI.test(z)) {
      if (/\b(salt|sale|stock|broth|brodo|capers|capperi|fish sauce|tamari|soy)\b/i.test(z)) { alza("reni", NOTA); motivi.reni.push({ it: `Sale: "${z}" con moderazione`, en: `Salt: "${z}" in moderation` }); }
      continue;
    }
    alza("piano", VETO);
    motivi.piano.push({ it: `Ingrediente non riconosciuto nel piano: "${z}"`, en: `Ingredient not recognised in the plan: "${z}"` });
  }

  const pasto = assegnaPasto([...alimenti]);
  if (!pasto) { alza("piano", VETO); motivi.piano.push({ it: "Non corrisponde a nessun pasto del piano", en: "Does not match any meal of the plan" }); }
  else {
    /* A plan meal has one protein source. Other protein foods in the recipe are left out. */
    const principale = pasto.prot;
    const altre = [...alimenti].filter((a) => a !== principale && ALIMENTI[a] && ALIMENTI[a].cat && !(pasto.carb && a === pasto.carb));
    if (altre.length > 1) { alza("piano", VETO); motivi.piano.push({ it: "Troppe fonti di proteine per un solo pasto del piano: " + altre.map((a) => ALIMENTI[a].it).join(", "), en: "Too many protein sources for one plan meal: " + altre.map((a) => ALIMENTI[a].en).join(", ") }); }
    else if (altre.length === 1) { alza("piano", ADATTA); adattamenti.push({ riga: ALIMENTI[altre[0]].en, a: null, it: `Togli ${ALIMENTI[altre[0]].it}: nel piano il pasto ha una sola fonte di proteine`, en: `Leave out ${ALIMENTI[altre[0]].en}: a plan meal has one protein source` }); }
  }
  if (adattamenti.length > 4) { alza("piano", VETO); motivi.piano.push({ it: "Troppe sostituzioni: non sarebbe più la stessa ricetta", en: "Too many swaps: it would no longer be the same recipe" }); }

  for (const ag of ["glutine", "lupus", "piano", "reni"]) verdetti.push(verdetto(ag, livelli[ag], motivi[ag]));
  const d = decisione(verdetti);
  return { ...d, pasto, alimenti: [...alimenti], adattamenti, dosi: pasto ? dosiPiano(pasto, [...alimenti]) : [] };
}

/* Which meal of the plan a set of foods belongs to. */
const CEREALI = new Set(PRANZO.carboidrati.flatMap((o) => o.voci.flatMap((v) => [v.a, ...(v.o || []).map((x) => x.a)])));
const PROT_PRANZO = new Set(PRANZO.proteine.flatMap((o) => o.voci.map((v) => v.a)));
const PROT_CENA = new Set(CENA.proteine.flatMap((o) => o.voci.flatMap((v) => [v.a, ...(v.o || []).map((x) => x.a)])));
const COL = new Set(["yogurt_magro", "yogurt_greco", "kefir", "latte_ps", "avena"]);

export function assegnaPasto(alimenti) {
  const s = new Set(alimenti);
  const cereale = [...s].find((a) => CEREALI.has(a) && !a.startsWith("legumi"));
  const legume = [...s].find((a) => a.startsWith("legumi"));
  const protP = [...s].find((a) => PROT_PRANZO.has(a));
  const protC = [...s].find((a) => PROT_CENA.has(a) && !a.startsWith("legumi"));
  const dolce = [...s].some((a) => ["frutta", "miele", "marmellata", "cioccolato"].includes(a));
  if (cereale && protP) return { pasto: "pranzo", carb: cereale, prot: protP };
  if (legume && protP) return { pasto: "pranzo", carb: legume, prot: protP };
  if (protC) return { pasto: "cena", prot: protC, pane: s.has("patate") ? "patate" : null };
  if (legume) return { pasto: "cena", prot: legume };
  if ([...s].some((a) => COL.has(a)) && (dolce || s.has("avena"))) return { pasto: "colazione" };
  if (cereale) return { pasto: "pranzo", carb: cereale, prot: null };
  if (s.has("verdure") && s.size <= 3) return { pasto: "contorno" };
  return null;
}

/* The plan amounts that apply when Sofia cooks this recipe. */
export function dosiPiano(p, alimenti) {
  const trova = (lista, a) => {
    for (const o of lista) for (const v of o.voci) {
      if (v.a === a || (v.con || []).includes(a)) return { a, q: v.q, u: v.u, opzione: o.id, ...(v.con ? { condiviso: [v.a, ...v.con] } : {}) };
      for (const x of v.o || []) if (x.a === a) return { a, q: x.q, u: x.u, opzione: o.id };
    }
    return null;
  };
  const out = [];
  if (p.pasto === "pranzo") {
    if (p.carb) out.push(trova(PRANZO.carboidrati, p.carb) || { a: p.carb, q: 80, u: "g" });
    if (p.prot) out.push(trova(PRANZO.proteine, p.prot));
    out.push({ a: "verdure", q: 300, u: "g" }, { a: "olio_evo", q: 10, u: "g" });
  } else if (p.pasto === "cena") {
    out.push(trova(CENA.proteine, p.prot));
    out.push({ a: "verdure", q: 300, u: "g" }, { a: "olio_evo", q: 10, u: "g" });
    out.push(p.pane === "patate" ? { a: "patate", q: 200, u: "g" } : { a: "pane_gf", q: 60, u: "g", alt: ["gallette", "patate"] });
  } else if (p.pasto === "colazione") {
    const opz = COLAZIONE.opzioni.find((o) => o.voci.every((v) => alimenti.includes(v.a) || v.a === "frutta")) || COLAZIONE.opzioni[0];
    for (const v of opz.voci) out.push({ a: v.a, q: v.q, u: v.u, opzione: opz.id });
  } else if (p.pasto === "contorno") {
    out.push({ a: "verdure", q: 300, u: "g" }, { a: "olio_evo", q: 10, u: "g" });
  }
  return out.filter(Boolean);
}

/* =================================================== CURATED RECIPES */

export function consiglioRicetta(ric) {
  const v = [];
  const alim = ric.ingredienti.map((i) => i.a);
  const sconosciuti = alim.filter((a) => !ALIMENTI[a]);
  const cert = alim.filter((a) => ALIMENTI[a] && ALIMENTI[a].glutine === "certificata");
  const etich = alim.filter((a) => ALIMENTI[a] && ALIMENTI[a].glutine === "etichetta");
  v.push(verdetto("glutine", sconosciuti.length ? VETO : cert.length || etich.length ? NOTA : OK, [
    ...cert.map((a) => ({ it: `${ALIMENTI[a].it}: solo certificata senza glutine`, en: `${ALIMENTI[a].en}: certified gluten free only` })),
    ...etich.map((a) => ({ it: `${ALIMENTI[a].it}: con dicitura senza glutine`, en: `${ALIMENTI[a].en}: labelled gluten free` })),
  ]));
  const extraVietati = (ric.extra || []).filter((e) => VETI.some((x) => x.re.test(e.en) || x.re.test(e.it)));
  v.push(verdetto("lupus", extraVietati.some((e) => /alfalfa|echinacea/i.test(e.en)) ? VETO : OK, []));
  v.push(verdetto("piano", sconosciuti.length || extraVietati.length ? VETO : OK, extraVietati.map((e) => ({ it: "Extra non ammesso: " + e.it, en: "Extra not allowed: " + e.en }))));
  const salati = alim.filter((a) => ALIMENTI[a] && ALIMENTI[a].sale);
  v.push(verdetto("reni", salati.length ? NOTA : OK, salati.length ? [{ it: "Salato: " + salati.map((a) => ALIMENTI[a].it).join(", ") + ". Non aggiungere sale.", en: "Salty: " + salati.map((a) => ALIMENTI[a].en).join(", ") + ". Do not add salt." }] : []));
  return decisione(v);
}
