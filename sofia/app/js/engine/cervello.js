/*
 * Il cervello: judges a food Sofia wants to add and works out how much of it
 * replaces a portion of her plan.
 *
 * The same council seats as for recipes, with the same seniority:
 *   1 gluten guardian (veto)   coeliac disease
 *   2 lupus sentinel (veto)    lupus, her medicines and immunosuppression
 *   3 plan keeper (veto)       what the nutritionist allows, prefers or excludes
 *   4 kidney sentinel          salt, and potassium/phosphorus when a kidney
 *                              result is out of range
 *   5 data analyst             where the numbers come from, what is missing
 * Verdict: "si" (approved), "medio" (fits with care, or not in the plan but
 * compatible), "no" (vetoed). Every reason says where it comes from: the
 * plan, a guideline id from docs/fonti, or the package data.
 *
 * Portions: the amount of the new food with the same calories as the plan's
 * own portion it replaces, protein foods included (the plan's own protein
 * portions are about the same calories as each other); a protein food that
 * brings under 60% of the protein of that portion is flagged. The plan's
 * portions are computed from the plan itself (engine/nutrizione).
 */
import { PRANZO, CENA } from "../data/piano.js";
import { ALIMENTI } from "../data/alimenti.js";
import { valoriVoci } from "./nutrizione.js";
import { VETI, NOTE_LUPUS, notePersonali, farmaciProfilo, OK, NOTA, ADATTA, VETO } from "./consiglio.js";

export const CLASSI = {
  verdure: { it: "Verdure", en: "Vegetables" }, patate: { it: "Patate e tuberi", en: "Potatoes and tubers" }, legumi: { it: "Legumi", en: "Legumes" },
  frutta: { it: "Frutta fresca", en: "Fresh fruit" }, frutta_essiccata: { it: "Frutta essiccata", en: "Dried fruit" }, frutta_secca: { it: "Frutta secca e semi", en: "Nuts and seeds" },
  cereali: { it: "Cereali e pasta", en: "Grains and pasta" }, cereali_colazione: { it: "Cereali da colazione", en: "Breakfast cereals" }, farine: { it: "Farine", en: "Flours" },
  pane: { it: "Pane, gallette e cracker", en: "Bread, rice cakes and crackers" }, carne: { it: "Carne", en: "Meat" }, salumi: { it: "Salumi e carne lavorata", en: "Cured and processed meat" },
  pesce: { it: "Pesce e frutti di mare", en: "Fish and seafood" }, uova: { it: "Uova", en: "Eggs" }, proteine_veg: { it: "Proteine vegetali", en: "Plant proteins" },
  latte: { it: "Latte e bevande vegetali", en: "Milk and plant drinks" }, yogurt: { it: "Yogurt e kefir", en: "Yogurt and kefir" }, formaggi: { it: "Formaggi", en: "Cheese" },
  grassi: { it: "Oli e grassi", en: "Oils and fats" }, dolci: { it: "Dolci e snack", en: "Sweets and snacks" }, zuccheri: { it: "Zucchero, miele, marmellata", en: "Sugar, honey, jam" },
  cioccolato: { it: "Cioccolato", en: "Chocolate" }, bevande: { it: "Bevande", en: "Drinks" }, alcol: { it: "Alcolici", en: "Alcohol" },
  salse: { it: "Salse e condimenti", en: "Sauces and condiments" }, spezie: { it: "Spezie ed erbe", en: "Spices and herbs" }, piatti: { it: "Piatti pronti", en: "Ready meals" },
  altro: { it: "Altro", en: "Other" },
};

const R = (s) => new RegExp(s, "i");
const PIANO = "piano";

/* ------------------------------------------------------------ class */
const DA_CIQUAL = {
  "0201": "verdure", "0202": "patate", "0203": "legumi", "0204": "frutta", "0205": "frutta_secca",
  "0301": "cereali", "0302": "pane", "0303": "dolci", "0305": "cereali_colazione",
  "0401": "carne", "0402": "carne", "0403": "salumi", "0404": "salumi", "0405": "pesce", "0406": "pesce", "0407": "pesce", "0408": "pesce", "0409": "pesce", "0410": "uova", "0411": "proteine_veg",
  "0501": "latte", "0502": "yogurt", "0503": "formaggi", "0504": "grassi",
  "0601": "bevande", "0602": "bevande", "0603": "alcol",
  "0701": "zuccheri", "0702": "cioccolato", "0703": "dolci", "0704": "zuccheri", "0705": "dolci", "0706": "dolci", "0707": "cereali_colazione", "0708": "dolci", "0709": "dolci",
  "0801": "dolci", "0802": "dolci", "0803": "dolci",
  "0901": "grassi", "0902": "grassi", "0903": "grassi", "0904": "grassi", "0905": "grassi",
  "1001": "salse", "1002": "salse", "1003": "salse", "1004": "salse", "1005": "spezie", "1006": "spezie", "1007": "verdure", "1008": "altro", "1009": "altro",
};
const DA_OFF = [
  ["alcol", /en:alcoholic-beverages|en:wines|en:beers/], ["bevande", /en:waters|en:coffees|en:teas|en:herbal-teas|en:sodas|en:juices|en:fruit-juices|en:beverages/],
  ["latte", /en:plant-based-milk|en:milks|en:dairy-drinks/], ["yogurt", /en:yogurts|en:kefir|en:fermented-milk/], ["formaggi", /en:cheeses/],
  ["salumi", /en:prepared-meats|en:hams|en:sausages|en:salami|en:bacon|en:cured-meats|en:cold-cuts/], ["carne", /en:meats|en:poultries|en:chickens|en:beef/],
  ["pesce", /en:fishes|en:seafood|en:canned-fishes|en:tunas|en:smoked-fishes/], ["uova", /en:eggs/], ["proteine_veg", /en:meat-alternatives|en:tofu|en:tempeh|en:meat-analogues/],
  ["cioccolato", /en:chocolates|en:dark-chocolates/], ["zuccheri", /en:jams|en:honeys|en:sugars|en:fruit-preserves|en:marmalades/],
  ["dolci", /en:biscuits|en:cakes|en:sweet-snacks|en:confectioneries|en:ice-creams|en:pastries|en:candies|en:salty-snacks|en:chips|en:crisps/],
  ["cereali_colazione", /en:breakfast-cereals|en:mueslis|en:flakes/], ["farine", /en:flours/],
  ["pane", /en:breads|en:rice-cakes|en:puffed|en:crackers|en:crispbreads|en:flatbreads|en:wraps/],
  ["cereali", /en:pastas|en:rices|en:cereal-grains|en:grains|en:quinoa|en:buckwheat|en:cereals-and-their-products/],
  ["legumi", /en:legumes|en:pulses|en:lentils|en:chickpeas|en:beans/], ["frutta_secca", /en:nuts|en:seeds|en:nut-butters/],
  ["frutta_essiccata", /en:dried-fruits/], ["frutta", /en:fruits|en:fresh-fruits|en:frozen-fruits/], ["patate", /en:potatoes|en:sweet-potatoes/],
  ["verdure", /en:vegetables|en:fresh-vegetables|en:frozen-vegetables|en:salads|en:leaf-vegetables|en:mushrooms/],
  ["grassi", /en:fats|en:olive-oils|en:vegetable-oils|en:butters|en:margarines/], ["salse", /en:sauces|en:condiments|en:dressings|en:pestos|en:stocks|en:broths|en:salts/],
  ["spezie", /en:spices|en:herbs|en:culinary-plants/], ["piatti", /en:meals|en:prepared-meals|en:pizzas|en:soups|en:sandwiches/],
];
const DA_NOME = [
  ["alcol", R("\\b(vino|wine|birra|beer|liquor|liquore|spritz|vodka|gin|rum|whisk)")], ["salumi", R("\\b(salame|salami|prosciutto|bresaola|speck|mortadella|w(u|ü)rstel|salsicc|sausage|pancetta|bacon|chorizo|affettat|coppa|cotechino)")],
  ["proteine_veg", R("\\b(tofu|tempeh|seitan|edamame)")], ["cioccolato", R("cioccolat|chocolate")], ["formaggi", R("\\b(formagg|cheese|mozzarella|ricotta|parmigian|parmesan|grana|pecorino|feta|scamorza|stracchino|gorgonzola|emmental|brie|camembert|caprino)")],
  ["yogurt", R("\\b(yogurt|yoghurt|kefir)")], ["latte", R("\\b(latte|milk|bevanda di|drink)\\b")], ["uova", R("\\b(uov|egg|albume)")],
  ["pesce", R("\\b(salmon|tonn|tuna|merluzz|cod|nasello|hake|orata|bream|branzin|spigola|bass|sogliol|sole|platess|plaice|trot|trout|sgombr|mackerel|sardin|alic|acciug|anchov|pesce|fish|gamber|shrimp|prawn|calamar|squid|seppi|cuttle|polp|octopus|cozz|mussel|vongol|clam)")],
  ["carne", R("\\b(pollo|chicken|tacchin|turkey|conigli|rabbit|vitell|veal|manzo|beef|maiale|pork|agnell|lamb|cavall|horse|anatra|duck)")],
  ["legumi", R("\\b(lenticch|lentil|ceci|chick ?pea|fagiol|bean|fave|broad bean|piselli secchi|split pea|lupin)")], ["patate", R("\\b(patat|potato)")],
  ["frutta_secca", R("\\b(noci|noce|walnut|mandorl|almond|nocciol|hazelnut|pistacch|pistachio|anacard|cashew|arachid|peanut|pinol|pine nut|semi di|seeds?\\b|chia|lino|linseed|sesam)")],
  ["cereali", R("\\b(riso|rice|quinoa|grano saraceno|buckwheat|miglio|millet|sorgo|sorghum|amaranto|amaranth|teff|pasta|orzo|barley|farro|spelt|frumento|wheat|cous ?cous|bulgur|avena|oat)")],
  ["pane", R("\\b(pane|bread|gallett|rice cake|cracker|grissin|fette|piadina|tortilla)")], ["grassi", R("\\b(olio|oil|burro|butter|margarin|avocado)")],
  ["frutta", R("\\b(mela|apple|pera|pear|banana|arancia|orange|mandarin|kiwi|fragol|strawberr|mirtill|blueberr|lampon|raspberr|more\\b|blackberr|uva|grape|pesca|peach|albicocc|apricot|prugn|plum|cilieg|cherr|melone|melon|anguria|watermelon|ananas|pineapple|fic|fig|melograno|pomegranate|cachi|persimmon|mango|pompelmo|grapefruit|limone|lemon)")],
  ["verdure", R("\\b(spinac|spinach|zucchin|courgette|broccol|pomodor|tomato|peperon|pepper|finocch|fennel|melanzan|eggplant|carot|carrot|lattug|lettuce|rucola|rocket|cavol|cabbage|cauliflower|fagiolin|french bean|asparag|carciof|artichoke|fung|mushroom|cetriol|cucumber|sedano|celery|porr|leek|cipoll|onion|zucca|pumpkin|biet|chard|cicori|chicory|radicchio|indivia|endive|valeriana|lettuce|barbabietol|beetroot|ravanell|radish|verdur|vegetable)")],
  ["dolci", R("\\b(biscott|biscuit|cookie|torta|cake|merendin|gelato|ice cream|brioche|croissant|cornett|crostat|wafer|caramell|candy|snack)")],
  ["zuccheri", R("\\b(zucchero|sugar|miele|honey|marmellat|confettur|jam\\b)")], ["bevande", R("\\b(acqua|water|caff|coffee|t(e|è)\\b|tea\\b|tisan|infusion|succo|juice|cola|bibita|soda)")],
  ["spezie", R("\\b(zenzer|ginger|curcum|turmeric|cannell|cinnamon|origan|oregano|prezzemol|parsley|basilic|basil|rosmarin|rosemary|salvia|sage|timo|thyme|pepe\\b|peperoncin|chilli|aglio|garlic)")],
  ["salse", R("\\b(salsa|sauce|ketchup|maionese|mayonnaise|senape|mustard|aceto|vinegar|pesto|dado|stock|brodo|sale\\b|salt\\b)")],
];

const PRIMA = [["proteine_veg", R("\\b(tofu|tempeh|seitan|edamame)\\b")], ["alcol", R("\\b(vino|wine|birra|beer|liquor|liquore|spritz|vodka|whisk)")]];
export function classeDi({ gruppoCiqual = null, categorie = [], nome = "", per100 = {} } = {}) {
  for (const [c, re] of PRIMA) if (re.test(nome) && !/sausage|ravioli|burger|nuggets/i.test(nome)) return c;
  if (gruppoCiqual) {
    if (/^avocado/i.test(nome)) return "grassi";
    if (gruppoCiqual === "0204" && /\b(dried|prune|raisin|date)\b/i.test(nome)) return "frutta_essiccata";
    const g = DA_CIQUAL[gruppoCiqual] || DA_CIQUAL[String(gruppoCiqual).slice(0, 4)];
    if (g) return g;
    if (String(gruppoCiqual).startsWith("01")) return "piatti";
  }
  const cat = (categorie || []).join(" ");
  if (cat) for (const [c, re] of DA_OFF) if (re.test(cat)) return c;
  for (const [c, re] of DA_NOME) if (re.test(nome)) return c;
  const p = per100 || {};
  if (p.prot >= 15) return "carne";
  return "altro";
}

/* ------------------------------------------------------------ gluten */
const DICITURA_SG = R("senza glutine|gluten[ -]?free|sans gluten|glutenfrei|sin gluten|no[ -]gluten");
const CON_GLUTINE = R("\\b(frumento|grano(?!\\s+saraceno)|wheat|farro|spelt|orzo|barley|segale|rye|kamut|khorasan|triticale|bulgur|cous ?cous|cuscus|seitan|malto(?!destrin)|malt(?!o?dextrin|ose|itol)|birra|beer|semolin|semola(?! di (riso|mais))|pangrattato|breadcrumb|impanat|panat|breaded|batter|pastella|biscott|biscuit|cookie|cracker|grissin|rusk|fette biscottate|croissant|cornett|brioche|merendin|wafer|torta|cake|pastry|pasticc|pizza|lasagn|raviol|tortellin|gnocch|crepe|pancake|waffle|piadin|pita|bagel|focaccia|panino|sandwich|couscous)");
const PASTA_PANE = R("\\b(pasta|pane|bread|spaghetti|penne|fusilli|noodle)");
const ALTRI_CEREALI_SG = R("riso|rice|mais|maize|corn|legum|lentic|lentil|lens|ceci|chick|pisell|\\bpea\\b|saraceno|buckwheat|quinoa|sorgo|sorghum|miglio|millet|amarant|teff|patat|potato|castagn|chestnut");
const AVENA = R("\\b(avena|oat|oats|oatmeal)\\b");
const ETICHETTA_SEMPRE = new Set(["cereali", "cereali_colazione", "farine", "pane", "salumi", "proteine_veg", "salse", "piatti", "dolci", "cioccolato", "zuccheri", "frutta_essiccata"]);

function seggioGlutine(c, classe) {
  const testo = [c.nome, c.nomeEn, c.ingredienti].filter(Boolean).join(" ");
  const tag = [...(c.allergeni || []), ...(c.tracce || [])].join(" ");
  const etichette = (c.etichette || []).join(" ");
  const certificato = /en:gluten-free|en:no-gluten|en:sans-gluten|glutenfrei|senza-glutine|spiga-barrata|crossed-grain/i.test(etichette) || DICITURA_SG.test([c.nome, c.nomeEn].filter(Boolean).join(" "));
  if ((c.allergeni || []).some((t) => /gluten|glutine|wheat|frumento|barley|orzo|rye|segale|spelt|farro|oats|avena/i.test(t)))
    return { livello: VETO, motivi: [{ it: "Contiene glutine (allergeni dichiarati sulla confezione).", en: "Contains gluten (allergens declared on the package)." }] };
  if ((c.tracce || []).some((t) => /gluten|glutine|wheat|frumento|barley|orzo|rye|segale|spelt|farro/i.test(t)))
    return { livello: VETO, motivi: [{ it: "\"Può contenere tracce di glutine\": non adatto alla celiachia.", en: "\"May contain traces of gluten\": not suitable for coeliac disease." }] };
  const sospetto = CON_GLUTINE.test(testo) || (PASTA_PANE.test(testo) && !ALTRI_CEREALI_SG.test(testo));
  if (sospetto && !certificato) return { livello: VETO, motivi: [{ it: "Di solito contiene glutine (frumento, orzo, segale, farro o derivati). Va bene solo una versione con la dicitura senza glutine.", en: "Usually contains gluten (wheat, barley, rye, spelt or derivatives). Only a version labelled gluten free will do." }] };
  if (AVENA.test(testo) && !certificato) return { livello: NOTA, motivi: [{ it: "Avena: solo se certificata senza glutine.", en: "Oats: only if certified gluten free." }] };
  if (certificato) return { livello: OK, motivi: [{ it: "Con la dicitura senza glutine.", en: "Labelled gluten free." }] };
  if (c.fonte === "off" && !tag && !etichette) return { livello: NOTA, motivi: [{ it: "Nessuna informazione sul glutine nella scheda: controlla la dicitura senza glutine sulla confezione.", en: "No gluten information in the record: check the gluten-free wording on the package." }] };
  if (ETICHETTA_SEMPRE.has(classe) || c.fonte === "off") return { livello: NOTA, motivi: [{ it: "Compralo con la dicitura senza glutine (spiga barrata).", en: "Buy it labelled gluten free (crossed grain)." }] };
  return { livello: OK, motivi: [{ it: "Naturalmente senza glutine.", en: "Naturally gluten free." }] };
}

/* ------------------------------------------------------------- lupus */
function seggioLupus(c, profilo) {
  const testo = [c.nome, c.nomeEn, c.ingredienti].filter(Boolean).join(" ");
  const motivi = [];
  let livello = OK;
  for (const v of VETI.filter((x) => x.agente === "lupus")) if (v.re.test(testo)) { livello = VETO; motivi.push({ it: v.it, en: v.en }); }
  for (const n of notePersonali([testo], profilo)) { livello = VETO; motivi.push({ it: n.it, en: n.en }); }
  for (const n of NOTE_LUPUS) if (n.re.test(testo) && !motivi.length) { if (livello === OK) livello = NOTA; motivi.push({ it: n.it, en: n.en, fonte: n.fonte }); }
  return { livello, motivi };
}

/* -------------------------------------------------------------- plan */
const FRITTO = R("\\b(fritt|fried|frit\\b|frittur|tempura|chips|crisps|patatine)");
const OLI_RAFFINATI = R("olio di (semi|girasole|mais|arachid|colza|soia|palma)|sunflower oil|corn oil|maize oil|peanut oil|groundnut oil|rapeseed oil|canola|soybean oil|soya oil|palm oil|vegetable oil|margarin");
const CARNE_ROSSA = R("\\b(manzo|beef|agnell|lamb|mutton|cavall|horse|anatra|duck|selvaggina|venison)");
const PROSCIUTTO_COTTO = R("prosciutto cotto|cooked ham|ham, cooked");
const FONDENTE_ALTO = R("\\b(8[5-9]|9\\d|100) ?%");
const RISO_BIANCO_MAIS = R("pasta di mais|corn pasta|maize pasta|riso bianco|white rice|rice, white|riso semplice");
const RISO = R("\\b(riso|rice)\\b");
const RISO_OK = R("brown|whole|integrale|basmati|venere|black|red|wild|nero|rosso|selvatic|puffed|soffiat|cake|gallett|pasta|flour|farina|drink|bevanda|noodle");
const NOCI_PIANO = R("\\b(noci|noce|walnut|mandorl|almond|nocciol|hazelnut|chia|lino|linseed|flax)");

const p = (it, en) => ({ it, en, fonte: PIANO });

function seggioPiano(c, classe) {
  const testo = [c.nome, c.nomeEn, c.ingredienti].filter(Boolean).join(" ");
  const v = c.per100 || {};
  if (FRITTO.test(testo)) return { livello: VETO, motivi: [p("Fritto: la nutrizionista chiede di evitare i fritti.", "Fried: the nutritionist asks to avoid fried food.")] };
  if (classe === "alcol") return { livello: VETO, motivi: [p("Alcolici: il piano chiede di evitarli (anche perché fortemente infiammatori).", "Alcohol: the plan asks to avoid it (also because it is strongly inflammatory).")] };
  if (OLI_RAFFINATI.test(testo)) return { livello: VETO, motivi: [p("Oli raffinati (mais, colza, girasole, arachide...): la nutrizionista chiede di evitarli. Solo olio extravergine di oliva.", "Refined oils (corn, rapeseed, sunflower, peanut...): the nutritionist asks to avoid them. Extra virgin olive oil only.")] };
  if (classe === "salumi") {
    if (PROSCIUTTO_COTTO.test(testo)) return { livello: ADATTA, motivi: [p("Prosciutto cotto: nel piano solo 20 g nel rotolo di frittata, al massimo una volta ogni due settimane.", "Cooked ham: in the plan only 20 g in the omelette roll, at most once every two weeks.")] };
    return { livello: VETO, motivi: [p("Affettati, insaccati, wurstel: la nutrizionista chiede di eliminarli. Un pezzo ogni tanto non fa danni, ma non va nella lista.", "Cold cuts, sausages, frankfurters: the nutritionist asks to cut them out. A piece now and then does no harm, but they do not go on the list.")] };
  }
  if (classe === "cioccolato") {
    if (FONDENTE_ALTO.test(testo)) return { livello: OK, motivi: [p("Cioccolato fondente 85-90%: nel piano (10 g a colazione o nello spuntino, 15 g dopocena).", "Dark chocolate 85-90%: in the plan (10 g at breakfast or snack, 15 g after dinner).")] };
    if (R("fondente|dark|extra ?dark").test(testo) && !R("less than 70|meno del 70|with fruit|con frutta|milk|latte").test(testo)) return { livello: ADATTA, motivi: [p("Fondente: va bene solo se 85-90% di cacao. Controlla la percentuale sulla confezione.", "Dark: fine only if 85-90% cocoa. Check the percentage on the package.")] };
    return { livello: VETO, motivi: [p("Solo cioccolato fondente 85-90%: gli altri sono fortemente zuccherati.", "Only 85-90% dark chocolate: the others are heavily sweetened.")] };
  }
  if (classe === "dolci") return { livello: VETO, motivi: [p("Prodotti da forno, dolci e snack raffinati: la nutrizionista chiede di eliminarli (anche quelli senza glutine, spesso pieni di zuccheri e additivi).", "Baked goods, sweets and refined snacks: the nutritionist asks to cut them out (gluten-free ones too, often full of sugar and additives).")] };
  if (classe === "bevande") {
    if ((v.sug || 0) > 2.5 || R("cola|soda|bibita|succo|juice|nettare|nectar").test(testo)) return { livello: VETO, motivi: [p("Bevande zuccherate o succhi: il piano dice di preferire sempre l'acqua.", "Sugary drinks or juices: the plan says to always prefer water.")] };
    if (R("caff|coffee").test(testo)) return { livello: OK, motivi: [p("Caffè: al massimo 3 al giorno, senza zucchero.", "Coffee: at most 3 a day, without sugar.")] };
    return { livello: OK, motivi: [p("Acqua, tè e tisane senza zucchero: nel piano.", "Water, tea and herbal tea without sugar: in the plan.")] };
  }
  if (classe === "zuccheri") {
    if (R("miele|honey|marmellat|confettur|jam").test(testo)) return { livello: OK, motivi: [p("Miele o marmellata: 10 g a colazione (meglio marmellata a ridotto contenuto di zuccheri).", "Honey or jam: 10 g at breakfast (jam with reduced sugar is better).")] };
    return { livello: VETO, motivi: [p("Zucchero aggiunto: il piano esclude i prodotti fortemente zuccherati.", "Added sugar: the plan excludes heavily sweetened products.")] };
  }
  if (classe === "grassi") {
    if (R("extra ?verg|extra virgin").test(testo)) return { livello: OK, motivi: [p("Olio extravergine di oliva: il condimento del piano.", "Extra virgin olive oil: the plan's dressing.")] };
    if (R("avocado").test(testo)) return { livello: OK, motivi: [p("Avocado: tra i cibi consigliati dalla nutrizionista. Conta come grasso: al posto di parte dell'olio.", "Avocado: among the foods the nutritionist recommends. It counts as fat: instead of part of the oil.")] };
    return { livello: ADATTA, motivi: [p("Il piano usa solo olio extravergine: burro, panna e altri grassi non sono previsti.", "The plan uses only extra virgin olive oil: butter, cream and other fats are not included.")] };
  }
  if (classe === "verdure") return { livello: OK, motivi: [p("Verdura: 300 g a pranzo e 300 g a cena, anche di più se non sei sazia. L'olio non cambia.", "Vegetable: 300 g at lunch and 300 g at dinner, more if still hungry. The oil stays the same.")] };
  if (classe === "patate") {
    if (R("dolc|sweet").test(testo)) return { livello: ADATTA, motivi: [p("Patate dolci: non nel piano. Le patate non sono verdure: a cena al posto del pane, con le calorie dei 200 g di patate.", "Sweet potatoes: not in the plan. Potatoes are not vegetables: at dinner instead of bread, with the calories of 200 g potatoes.")] };
    return { livello: OK, motivi: [p("Patate: non sono verdure. A cena 200 g al posto del pane.", "Potatoes: not vegetables. At dinner 200 g instead of bread.")] };
  }
  if (classe === "legumi") return { livello: OK, motivi: [p("Legumi: 2 pranzi e 1 cena a settimana.", "Legumes: 2 lunches and 1 dinner a week.")] };
  if (classe === "frutta") return { livello: OK, motivi: [p("Frutta fresca: a colazione, nello spuntino o dopocena. Meglio frutti di bosco, melograno, agrumi, uva (antiossidanti).", "Fresh fruit: at breakfast, snack or after dinner. Berries, pomegranate, citrus and grapes are best (antioxidants).")] };
  if (classe === "frutta_essiccata") return { livello: ADATTA, motivi: [p("Frutta essiccata: molto zuccherina. Nel piano solo 25 g di prugne secche nello spuntino.", "Dried fruit: very sugary. The plan has only 25 g prunes at snack time.")] };
  if (classe === "frutta_secca") {
    if (/sal(ato|ted)/i.test(testo) || (v.salt || 0) > 0.6) return { livello: ADATTA, motivi: [p("Frutta secca salata: meglio al naturale (sale con moderazione).", "Salted nuts: plain is better (salt in moderation).")] };
    if (NOCI_PIANO.test(testo)) return { livello: OK, motivi: [p("Frutta secca e semi oleosi (noci, mandorle, nocciole, chia, lino): consigliati dalla nutrizionista.", "Nuts and oily seeds (walnuts, almonds, hazelnuts, chia, flax): recommended by the nutritionist.")] };
    return { livello: OK, motivi: [p("Frutta secca: tra i cibi consigliati. Il piano nomina noci, mandorle e nocciole.", "Nuts: among the recommended foods. The plan names walnuts, almonds and hazelnuts.")] };
  }
  if (classe === "cereali") {
    if (RISO_BIANCO_MAIS.test(testo) || (RISO.test(testo) && !RISO_OK.test(testo))) return { livello: ADATTA, motivi: [p("La nutrizionista chiede di evitare pasta di mais e riso semplice: meglio cereali in chicco (grano saraceno, quinoa, miglio, sorgo).", "The nutritionist asks to avoid corn pasta and plain white rice: whole grains are better (buckwheat, quinoa, millet, sorghum).")] };
    if (R("pasta").test(testo) && !R("legum|lentic|lentil|ceci|chick|saraceno|buckwheat|riso integrale|brown rice|avena|oat").test(testo)) return { livello: ADATTA, motivi: [p("Pasta senza glutine: va bene se fatta con un solo ingrediente (grano saraceno, riso integrale, legumi 100%), senza mono e digliceridi.", "Gluten-free pasta: fine if made from a single ingredient (buckwheat, brown rice, 100% legumes), without mono- and diglycerides.")] };
    return { livello: OK, motivi: [p("Cereali in chicco o pasta di un solo ingrediente: la scelta preferita della nutrizionista a pranzo.", "Whole grains or single-ingredient pasta: the nutritionist's preferred lunch choice.")] };
  }
  if (classe === "cereali_colazione") {
    if ((v.sug || 0) > 12) return { livello: VETO, motivi: [p("Cereali zuccherati: il piano esclude i prodotti fortemente zuccherati. Meglio fiocchi di avena.", "Sweetened cereals: the plan excludes heavily sweetened products. Oat flakes are better.")] };
    return { livello: OK, motivi: [p("Fiocchi o cereali soffiati: alternative all'avena a colazione, stesso peso.", "Flakes or puffed grains: alternatives to oats at breakfast, same weight.")] };
  }
  if (classe === "farine") return { livello: ADATTA, motivi: [p("Farine: solo per impanare o infarinare (10 g di pane = 7 g di farina). Meglio avena o grano saraceno.", "Flours: only for breading or flouring (10 g bread = 7 g flour). Oat or buckwheat is best.")] };
  if (classe === "pane") {
    if (R("gallett|rice cake|puffed").test(testo)) return { livello: OK, motivi: [p("Gallette di un solo ingrediente: alternativa al pane del piano.", "Single-ingredient rice cakes: an alternative to bread in the plan.")] };
    return { livello: ADATTA, motivi: [p("Pane o cracker senza glutine confezionati: spesso tanti additivi. Scegli quelli con pochi ingredienti; a cena al posto dei 60 g di pane.", "Packaged gluten-free bread or crackers: often many additives. Choose few ingredients; at dinner instead of the 60 g bread.")] };
  }
  if (classe === "carne") {
    if (CARNE_ROSSA.test(testo)) return { livello: ADATTA, motivi: [p("Carne rossa: non nel piano (a cena solo vitello o maiale magro, max 1 volta a settimana). Se la mangi, magra e come quella.", "Red meat: not in the plan (at dinner only lean veal or pork, max once a week). If you eat it, lean and counted like those.")] };
    if ((v.fat || 0) > 10) return { livello: ADATTA, motivi: [p("Carne grassa: il piano usa tagli magri.", "Fatty meat: the plan uses lean cuts.")] };
    return { livello: OK, motivi: [p("Carne bianca o magra: nel piano 1-2 volte a pranzo e a cena.", "White or lean meat: in the plan 1-2 times at lunch and at dinner.")] };
  }
  if (classe === "pesce") {
    if (R("affumicat|smoked|salat|salted|baccal").test(testo)) return { livello: ADATTA, motivi: [p("Pesce affumicato o salato: molto sale. Il salmone affumicato nel piano è max 1 volta a settimana.", "Smoked or salted fish: a lot of salt. Smoked salmon in the plan is max once a week.")] };
    if (R("surimi|bastoncin|fish finger").test(testo)) return { livello: ADATTA, motivi: [p("Pesce lavorato: meglio pesce fresco o surgelato al naturale.", "Processed fish: fresh or plain frozen fish is better.")] };
    return { livello: OK, motivi: [p("Pesce: il piano lo vuole spesso (2-3 cene e 1-2 pranzi a settimana).", "Fish: the plan wants it often (2-3 dinners and 1-2 lunches a week).")] };
  }
  if (classe === "uova") return { livello: OK, motivi: [p("Uova: 1 pranzo e 1 cena a settimana, cucinate come vuoi.", "Eggs: 1 lunch and 1 dinner a week, cooked as you like.")] };
  if (classe === "proteine_veg") return { livello: ADATTA, motivi: [p("Non nel piano: puoi usarlo al posto di una proteina con la porzione calcolata, poi chiedi conferma alla nutrizionista.", "Not in the plan: you can use it instead of a protein with the computed portion, then ask the nutritionist to confirm.")] };
  if (classe === "latte" || classe === "yogurt") {
    if ((v.sug || 0) > 6) return { livello: ADATTA, motivi: [p("Zuccherato o aromatizzato: il piano usa yogurt e latte bianchi, senza zucchero.", "Sweetened or flavoured: the plan uses plain yogurt and milk, without sugar.")] };
    if (R("soia|soy|avena|oat|riso|rice|mandorl|almond|cocco|coconut").test(testo)) return { livello: ADATTA, motivi: [p("Bevanda vegetale: non nel piano. Se la usi al posto del latte, senza zucchero.", "Plant drink: not in the plan. If you use it instead of milk, unsweetened.")] };
    return { livello: OK, motivi: [p("Latte, yogurt o kefir bianchi: a colazione e nello spuntino.", "Plain milk, yogurt or kefir: at breakfast and snack time.")] };
  }
  if (classe === "formaggi") {
    if ((v.fat || 0) <= 12) return { livello: OK, motivi: [p("Formaggio fresco e leggero: come mozzarella light, ricotta o fiocchi di latte nel piano.", "Fresh, light cheese: like the plan's light mozzarella, ricotta or cottage cheese.")] };
    return { livello: ADATTA, motivi: [p("Formaggio grasso o stagionato: non tra quelli del piano. Porzione piccola, conta come proteina.", "Fatty or aged cheese: not among the plan's cheeses. A small portion, counted as protein.")] };
  }
  if (classe === "spezie") return { livello: OK, motivi: [p("Spezie ed erbe: consigliate (zenzero, curcuma, cannella, origano, prezzemolo).", "Spices and herbs: recommended (ginger, turmeric, cinnamon, oregano, parsley).")] };
  if (classe === "salse") {
    if (R("aceto|vinegar|limone|lemon").test(testo) && !R("malt").test(testo)) return { livello: OK, motivi: [p("Limone e aceto per condire: consigliati (il limone aiuta ad assorbire il ferro delle verdure).", "Lemon and vinegar as dressing: recommended (lemon helps absorb iron from vegetables).")] };
    if (R("^sale|\\bsalt\\b|\\bsale\\b").test(testo)) return { livello: ADATTA, motivi: [p("Sale: con moderazione.", "Salt: in moderation.")] };
    return { livello: ADATTA, motivi: [p("Salse pronte: poco, contano nelle calorie e spesso hanno sale e zucchero.", "Ready sauces: sparingly, they count in calories and often contain salt and sugar.")] };
  }
  if (classe === "piatti") return { livello: ADATTA, motivi: [p("Piatto pronto: il piano non ha una dose. Meglio cucinarlo con le dosi del piano.", "Ready meal: the plan has no amount for it. Better cooked with the plan's amounts.")] };
  return { livello: ADATTA, motivi: [p("Non nel piano: chiedi alla nutrizionista.", "Not in the plan: ask the nutritionist.")] };
}

/* ------------------------------------------------------------ kidney */
export const SALE_ALTO = 1.5; /* g salt per 100 g: more than this is "high" in the UK front-of-pack scheme (DH/FSA 2016) */
function seggioReni(c, porzioni, renale) {
  const v = c.per100 || {};
  const motivi = [];
  let livello = OK;
  if (v.salt != null && v.salt > SALE_ALTO) {
    livello = ADATTA;
    motivi.push({ it: `Molto salato: ${String(Math.round(v.salt * 10) / 10).replace(".", ",")} g di sale ogni 100 g. Il piano dice sale moderato; KDIGO, malattie glomerulari: meno di 5 g di sale al giorno.`, en: `Very salty: ${Math.round(v.salt * 10) / 10} g salt per 100 g. The plan says moderate salt; KDIGO, glomerular disease: under 5 g salt a day.`, fonte: "ln_sodium" });
  }
  if (renale && ((v.k || 0) > 0 || (v.p || 0) > 0)) {
    if (livello === OK) livello = NOTA;
    motivi.push({ it: "Un esame renale recente è fuori dall'intervallo del laboratorio: chiedi al medico se limitare potassio e fosforo.", en: "A recent kidney result is outside the lab range: ask the doctor whether to limit potassium and phosphorus." });
  }
  void porzioni;
  return { livello, motivi };
}

/* ---------------------------------------------------------- portions */
const tondo = (x) => Math.max(5, Math.round(x / 5) * 5);
const mediana = (xs) => { const s = xs.filter((x) => x != null).sort((a, b) => a - b); return s.length ? s[Math.floor(s.length / 2)] : null; };
let RIF = null;
function rif(voci) { const r = valoriVoci(voci); return r.completo ? { kcal: r.tot.kcal, prot: r.tot.prot } : null; }
function rifOpzioni(opzioni) {
  const vals = opzioni.map((o) => rif(o.voci)).filter(Boolean);
  return { kcal: mediana(vals.map((v) => v.kcal)), prot: mediana(vals.map((v) => v.prot)) };
}
const perCat = (opz, cat) => opz.filter((o) => (ALIMENTI[o.voci[0].a] || {}).cat === cat || o.cat === cat || (cat === "carne" && ["pollo", "tacchino", "coniglio", "vitello", "maiale"].includes(o.voci[0].a)));
function riferimenti() {
  if (RIF) return RIF;
  const g = (a, q, u = "g") => rif([{ a, q, u }]);
  RIF = {
    carbPranzo: rifOpzioni(PRANZO.carboidrati.filter((o) => o.cat !== "legumi")),
    legumiSecchiPranzo: g("legumi_secchi", 70), legumiScolatiPranzo: g("legumi_scolati", 180), legumiSecchiCena: g("legumi_secchi", 40), legumiScolatiCena: g("legumi_scolati", 130),
    protPranzo: { carne: rifOpzioni(perCat(PRANZO.proteine, "carne").filter((o) => o.voci[0].a !== "ragu")), pesce: rifOpzioni(perCat(PRANZO.proteine, "pesce")), formaggio: rifOpzioni(perCat(PRANZO.proteine, "formaggio")) },
    protCena: { carne: rifOpzioni(perCat(CENA.proteine, "carne")), pesce: rifOpzioni(perCat(CENA.proteine, "pesce")), formaggio: rifOpzioni(perCat(CENA.proteine, "formaggio")) },
    paneCena: g("pane_gf", 60), paneColazione: g("pane_gf", 30), patate: g("patate", 200), frutta: g("frutta", 150), prugne: g("prugne_secche", 25),
    fruttaSecca: g("frutta_secca", 10), olio: g("olio_evo", 10), yogurt: g("yogurt_magro", 150), latte: rif([{ a: "latte_ps", q: 150, u: "ml" }]), avena: g("avena", 25),
    cioccolato: g("cioccolato", 15), marmellata: g("marmellata", 10),
  };
  return RIF;
}

function perKcal(v, ref, pasto, come) {
  if (!ref || !v.kcal) return null;
  const q = tondo((ref.kcal / v.kcal) * 100);
  return { pasto, q, u: "g", kcal: (q * v.kcal) / 100, prot: (q * (v.prot || 0)) / 100, come };
}
/* Protein foods: the plan's own options in a group are close in calories, not
   in protein (90 g salmon, 210 g cod, 150 g chicken at dinner), so the
   portion matches the calories; it is flagged when it brings much less protein. */
/* Protein foods: same calories as the plan's portion, with the protein checked. */
function perProteine(v, ref, pasto, come) {
  if (!ref || !v.kcal) return null;
  const q = tondo((ref.kcal / v.kcal) * 100);
  const prot = (q * (v.prot || 0)) / 100;
  return { pasto, q, u: "g", kcal: (q * v.kcal) / 100, prot, come, pocheProteine: prot < ref.prot * 0.6 };
}
const C = (it, en) => ({ it, en });

export function porzioniPer(classe, v) {
  const R2 = riferimenti();
  const out = [];
  const add = (x) => { if (x) out.push(x); };
  switch (classe) {
    case "verdure": out.push({ pasto: "pranzo", q: 300, u: "g", come: C("dentro i 300 g di verdure", "within the 300 g of vegetables"), libera: true }, { pasto: "cena", q: 300, u: "g", come: C("dentro i 300 g di verdure", "within the 300 g of vegetables"), libera: true }); break;
    case "patate": add(perKcal(v, R2.patate, "cena", C("al posto dei 200 g di patate o del pane", "instead of 200 g potatoes or the bread"))); break;
    case "legumi": {
      const secco = v.kcal >= 250;
      add(perKcal(v, secco ? R2.legumiSecchiPranzo : R2.legumiScolatiPranzo, "pranzo", secco ? C("al posto di 70 g di legumi secchi", "instead of 70 g dried legumes") : C("al posto di 180 g di legumi scolati", "instead of 180 g drained legumes")));
      add(perKcal(v, secco ? R2.legumiSecchiCena : R2.legumiScolatiCena, "cena", secco ? C("al posto di 40 g di legumi secchi", "instead of 40 g dried legumes") : C("al posto di 130 g di legumi scolati", "instead of 130 g drained legumes")));
      break;
    }
    case "frutta": add(perKcal(v, R2.frutta, "spuntino", C("al posto di 150 g di frutta", "instead of 150 g fruit"))); break;
    case "frutta_essiccata": add(perKcal(v, R2.prugne, "spuntino", C("al posto di 25 g di prugne secche", "instead of 25 g prunes"))); break;
    case "frutta_secca": add(perKcal(v, R2.fruttaSecca, "colazione", C("al posto di 10 g di frutta secca", "instead of 10 g nuts"))); break;
    case "cereali": add(perKcal(v, R2.carbPranzo, "pranzo", v.kcal < 200 ? C("peso cotto, al posto di 80 g di cereali crudi", "cooked weight, instead of 80 g raw grains") : C("peso crudo, al posto di 80 g di cereali o pasta", "raw weight, instead of 80 g grains or pasta"))); break;
    case "cereali_colazione": add(perKcal(v, R2.avena, "colazione", C("al posto di 25 g di fiocchi di avena", "instead of 25 g oat flakes"))); break;
    case "pane": add(perKcal(v, R2.paneCena, "cena", C("al posto di 60 g di pane", "instead of 60 g bread"))); add(perKcal(v, R2.paneColazione, "colazione", C("al posto di 30 g di pane", "instead of 30 g bread"))); break;
    case "carne": case "salumi": add(perProteine(v, R2.protPranzo.carne, "pranzo", C("stesse calorie di 60 g di petto di pollo", "same calories as 60 g chicken breast"))); add(perProteine(v, R2.protCena.carne, "cena", C("stesse calorie della carne della cena", "same calories as the dinner meat"))); break;
    case "pesce": add(perProteine(v, R2.protPranzo.pesce, "pranzo", C("stesse calorie del pesce del pranzo", "same calories as the lunch fish"))); add(perProteine(v, R2.protCena.pesce, "cena", C("stesse calorie del pesce della cena", "same calories as the dinner fish"))); break;
    case "proteine_veg": add(perProteine(v, R2.protPranzo.carne, "pranzo", C("stesse calorie di 60 g di petto di pollo", "same calories as 60 g chicken breast"))); add(perProteine(v, R2.protCena.carne, "cena", C("stesse calorie di 150 g di petto di pollo", "same calories as 150 g chicken breast"))); break;
    case "formaggi": add(perProteine(v, R2.protPranzo.formaggio, "pranzo", C("stesse calorie dei formaggi del pranzo", "same calories as the lunch cheeses"))); add(perProteine(v, R2.protCena.formaggio, "cena", C("stesse calorie dei formaggi della cena", "same calories as the dinner cheeses"))); break;
    case "latte": case "yogurt": add(perKcal(v, R2.yogurt, "colazione", C("al posto di 150 g di yogurt magro", "instead of 150 g low-fat yogurt"))); break;
    case "grassi": add(perKcal(v, R2.olio, "pranzo", C("al posto dei 10 g di olio", "instead of the 10 g oil"))); break;
    case "cioccolato": add(perKcal(v, R2.cioccolato, "dopocena", C("al posto di 15 g di cioccolato fondente", "instead of 15 g dark chocolate"))); break;
    case "zuccheri": add(perKcal(v, R2.marmellata, "colazione", C("al posto di 10 g di marmellata", "instead of 10 g jam"))); break;
    default: break;
  }
  return out;
}

/* -------------------------------------------------------------- data */
function seggioDati(c) {
  const motivi = [];
  let livello = OK;
  if (c.fonte === "ciqual") motivi.push({ it: `Valori: tabella CIQUAL 2020 (ANSES), alimento ${c.codice}: ${c.nomeEn}.`, en: `Values: CIQUAL 2020 table (ANSES), food ${c.codice}: ${c.nomeEn}.` });
  if (c.fonte === "off") motivi.push({ it: `Valori dalla confezione (Open Food Facts, database collaborativo, codice ${c.codice}). Controlla sempre l'etichetta.`, en: `Values from the package (Open Food Facts, a collaborative database, code ${c.codice}). Always check the label.` });
  if (c.stimaKcal) { livello = NOTA; motivi.push({ it: "Energia calcolata da proteine, carboidrati e grassi: è una stima.", en: "Energy computed from protein, carbohydrate and fat: an estimate." }); }
  if (!c.per100 || c.per100.kcal == null) { livello = NOTA; motivi.push({ it: "Informazione mancante: niente calorie, quindi niente porzione.", en: "Information missing: no calories, so no portion." }); }
  return { livello, motivi };
}

/* ------------------------------------------------------------ verdict */
export function valutaAlimento(c, { profilo = {}, renaleFuoriRange = false } = {}) {
  const classe = c.classe || classeDi({ gruppoCiqual: c.gruppoCiqual, categorie: c.categorie, nome: [c.nome, c.nomeEn].filter(Boolean).join(" "), per100: c.per100 });
  const v = c.per100 || {};
  const porzioni = v.kcal ? porzioniPer(classe, v) : [];
  const seggi = [
    { agente: "glutine", ...seggioGlutine(c, classe) },
    { agente: "lupus", ...seggioLupus(c, profilo) },
    { agente: "piano", ...seggioPiano(c, classe) },
    { agente: "reni", ...seggioReni(c, porzioni, renaleFuoriRange) },
    { agente: "dati", ...seggioDati(c) },
  ];
  if (porzioni.some((x) => x.pocheProteine)) {
    const pi = seggi.find((s) => s.agente === "piano");
    if (pi.livello === OK) pi.livello = ADATTA;
    pi.motivi.push({ it: "Con le stesse calorie porta molte meno proteine degli alimenti del piano: non sostituisce bene una proteina.", en: "For the same calories it brings much less protein than the plan's foods: not a good protein swap." });
  }
  const veto = seggi.find((s) => s.livello === VETO);
  const livello = veto ? "no" : seggi.some((s) => s.livello === ADATTA || (s.agente === "dati" && s.livello === NOTA && !v.kcal)) ? "medio" : "si";
  return { livello, classe, seggi, porzioni, da: veto ? veto.agente : null, cni: farmaciProfilo(profilo).cni };
}
